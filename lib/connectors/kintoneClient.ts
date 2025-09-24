import { type SupabaseClient } from "@supabase/supabase-js"

export type KintoneConfig = { 
  domain: string
  clientId: string
  clientSecret: string
  scope: string[]
}

export type KintoneToken = { 
  access_token: string
  refresh_token: string
  expires_at: string
  scope?: string
}

export async function getConfigAndToken(supabase: SupabaseClient, connectorId: string): Promise<{cfg: KintoneConfig, tok: KintoneToken}> {
  
  // Load config
  const { data: configRow, error: configError } = await supabase
    .from('credentials')
    .select('payload')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_config')
    .single()
  
  if (configError || !configRow) {
    throw new Error(`Failed to load Kintone config: ${configError?.message || 'Config not found'}`)
  }
  
  const cfg: KintoneConfig = JSON.parse(configRow.payload)
  
  // Load token
  const { data: tokenRow, error: tokenError } = await supabase
    .from('credentials')
    .select('payload')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_token')
    .single()
  
  if (tokenError || !tokenRow) {
    throw new Error(`Failed to load Kintone token: ${tokenError?.message || 'Token not found'}`)
  }
  
  const tok: KintoneToken = JSON.parse(tokenRow.payload)
  
  // Check if token is expired (with 60s buffer)
  const expiresAt = new Date(tok.expires_at)
  const now = new Date()
  const bufferTime = 60 * 1000 // 60 seconds
  
  if (now.getTime() > (expiresAt.getTime() - bufferTime)) {
    // Token is expired or about to expire, try to refresh
    try {
      const refreshedToken = await refreshToken(cfg, tok)
      await saveToken(supabase, connectorId, refreshedToken)
      tok.access_token = refreshedToken.access_token
      tok.refresh_token = refreshedToken.refresh_token
      tok.expires_at = refreshedToken.expires_at
    } catch (refreshError) {
      throw new Error(`Token expired and refresh failed: ${refreshError}`)
    }
  }
  
  return { cfg, tok }
}

export function computeRedirectUri(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https"
  const host = req.headers.get("x-forwarded-host") ?? "localhost:3000"
  return `${proto}://${host}/api/integrations/kintone/callback`
}

export function buildAuthorizeUrl(cfg: KintoneConfig, redirectUri: string, state: any): string {
  const url = new URL(`${cfg.domain}/oauth2/authorization`)
  url.searchParams.set("client_id", cfg.clientId)
  url.searchParams.set("redirect_uri", redirectUri)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", cfg.scope.join(" "))
  url.searchParams.set("state", Buffer.from(JSON.stringify(state)).toString("base64url"))
  return url.toString()
}

export async function fetchApps(cfg: KintoneConfig, tok: KintoneToken, offset = 0, limit = 100) {
  const url = new URL(`${cfg.domain}/k/v1/apps.json`)
  url.searchParams.set("offset", String(offset))
  url.searchParams.set("limit", String(limit))
  
  const res = await fetch(url, { 
    headers: { 
      Authorization: `Bearer ${tok.access_token}`,
      'Content-Type': 'application/json'
    } 
  })
  
  if (!res.ok) {
    throw new Error(`Apps fetch failed ${res.status}: ${await res.text()}`)
  }
  
  return res.json() // { apps: [...] }
}

export async function fetchFields(cfg: KintoneConfig, tok: KintoneToken, appId: number) {
  const url = new URL(`${cfg.domain}/k/v1/app/form/fields.json`)
  url.searchParams.set("app", String(appId))
  
  const res = await fetch(url, { 
    headers: { 
      Authorization: `Bearer ${tok.access_token}`,
      'Content-Type': 'application/json'
    } 
  })
  
  if (!res.ok) {
    throw new Error(`Fields fetch failed ${res.status}: ${await res.text()}`)
  }
  
  return res.json() // { properties: {...} }
}

export async function fetchRecords(cfg: KintoneConfig, tok: KintoneToken, appId: number, offset = 0, limit = 500, sinceId?: number) {
  const url = new URL(`${cfg.domain}/k/v1/records.json`)
  url.searchParams.set("app", String(appId))
  url.searchParams.set("offset", String(offset))
  url.searchParams.set("limit", String(limit))
  
  if (sinceId) {
    url.searchParams.set("query", `$id > ${sinceId}`)
  }
  
  const res = await fetch(url, { 
    headers: { 
      Authorization: `Bearer ${tok.access_token}`,
      'Content-Type': 'application/json'
    } 
  })
  
  if (!res.ok) {
    throw new Error(`Records fetch failed ${res.status}: ${await res.text()}`)
  }
  
  return res.json() // { records: [...] }
}

async function refreshToken(cfg: KintoneConfig, tok: KintoneToken): Promise<KintoneToken> {
  const url = new URL(`${cfg.domain}/oauth2/token`)
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tok.refresh_token,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret
  })
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })
  
  if (!res.ok) {
    throw new Error(`Token refresh failed ${res.status}: ${await res.text()}`)
  }
  
  const data = await res.json()
  
  // Calculate new expiry time
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + (data.expires_in - 60)) // 60s buffer
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: expiresAt.toISOString(),
    scope: data.scope
  }
}

async function saveToken(supabase: SupabaseClient, connectorId: string, token: KintoneToken): Promise<void> {
  const { error } = await supabase
    .from('credentials')
    .upsert({
      connector_id: connectorId,
      type: 'kintone_token',
      payload: JSON.stringify(token),
      format: 'plain'
    }, { onConflict: 'connector_id,type' })
  
  if (error) {
    throw new Error(`Failed to save token: ${error.message}`)
  }
}
