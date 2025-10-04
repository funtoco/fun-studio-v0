/**
 * API to manage Kintone app fields
 * GET /api/connectors/[id]/kintone/apps/[appId]/fields - List fields for an app
 * POST /api/connectors/[id]/kintone/apps/[appId]/fields - Sync fields to database
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient } from '@/lib/kintone/api-client'
import { decryptJson } from '@/lib/security/crypto'

// Import token handling functions from the apps route
type TokenSet = {
  access_token: string
  refresh_token?: string
  expires_at?: number
  scope?: string
}

async function getLatestTokenSet(connectorId: string): Promise<TokenSet | null> {
  const supabase = getServerClient()
  
  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_token')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !credentials) {
    return null
  }

  try {
    let tokenData: any
    if (credentials.payload) {
      tokenData = JSON.parse(credentials.payload)
    } else if (credentials.payload_encrypted) {
      tokenData = decryptJson(credentials.payload_encrypted)
    } else {
      return null
    }

    // Ensure expires_at is always a number (epoch ms)
    let expiresAt: number | undefined
    if (tokenData.expires_at) {
      expiresAt = typeof tokenData.expires_at === 'number' ? tokenData.expires_at : new Date(tokenData.expires_at).getTime()
    }

    return {
      access_token: tokenData.access_token || tokenData.token,
      refresh_token: tokenData.refresh_token,
      expires_at: expiresAt,
      scope: tokenData.scope
    }
  } catch (err) {
    console.error('Failed to parse token data:', err)
    return null
  }
}

async function refreshToken(connectorId: string, tokenSet: TokenSet): Promise<TokenSet | null> {
  const supabase = getServerClient()
  
  // Get Kintone config for client credentials
  const { data: configCreds, error: configError } = await supabase
    .from('credentials')
    .select('*')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_config')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (configError || !configCreds) {
    console.error('No Kintone config found for token refresh')
    return null
  }

  let kintoneConfig: any
  if (configCreds.payload) {
    kintoneConfig = JSON.parse(configCreds.payload)
  } else if (configCreds.payload_encrypted) {
    kintoneConfig = decryptJson(configCreds.payload_encrypted)
  } else {
    return null
  }

  const clientId = kintoneConfig.clientId
  const clientSecret = kintoneConfig.clientSecret
  const domain = kintoneConfig.domain

  if (!clientId || !clientSecret || !domain) {
    console.error('Missing client credentials for token refresh')
    return null
  }

  try {
    // Prepare refresh token request - use correct OAuth2 endpoint
    const tokenUrl = `${domain}/oauth2/token`
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[token-refresh] POST ${tokenUrl}`)
      console.log(`[token-refresh] Headers: Authorization: Basic ${basicAuth.substring(0, 20)}...`)
    }
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenSet.refresh_token
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[token-refresh] Failed: ${response.status} ${errorText.substring(0, 200)}`)
      return null
    }

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text()
      console.error(`[token-refresh] Non-JSON response: ${contentType}, body: ${responseText.substring(0, 200)}`)
      return null
    }

    const newTokenData = await response.json()
    
    // Calculate expires_at (default to 55 minutes if not provided)
    const expiresIn = newTokenData.expires_in || 3300 // 55 minutes
    const expiresAt = Date.now() + (expiresIn * 1000)

    const newTokenSet: TokenSet = {
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || tokenSet.refresh_token,
      expires_at: expiresAt, // Always set expires_at
      scope: newTokenData.scope || tokenSet.scope
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[token-refresh] Success: expires_at=${expiresAt}, expires_in=${expiresIn}`)
    }

    // Update existing credentials row or insert new one
    const { error: updateError } = await supabase
      .from('credentials')
      .update({
        payload: JSON.stringify({
          access_token: newTokenSet.access_token,
          refresh_token: newTokenSet.refresh_token,
          expires_at: newTokenSet.expires_at,
          scope: newTokenSet.scope
        }),
        updated_at: new Date().toISOString()
      })
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_token')
      .order('created_at', { ascending: false })
      .limit(1)

    if (updateError) {
      console.error('Failed to update refreshed token:', updateError)
      return null
    }

    return newTokenSet
  } catch (err) {
    console.error('Token refresh error:', err)
    return null
  }
}

async function getValidToken(connectorId: string): Promise<TokenSet | null> {
  const tokenSet = await getLatestTokenSet(connectorId)
  
  if (!tokenSet || !tokenSet.access_token) {
    return null
  }

  // Check if token needs refresh (expires within 1 minute or no expires_at)
  const now = Date.now()
  const needsRefresh = !tokenSet.expires_at || tokenSet.expires_at <= now + 60000

  if (needsRefresh) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[token] Refreshing token for connector ${connectorId}, expires_at: ${tokenSet.expires_at}, now: ${now}`)
    }
    
    const refreshedToken = await refreshToken(connectorId, tokenSet)
    return refreshedToken || tokenSet // Fallback to original if refresh fails
  }

  return tokenSet
}

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, serviceKey)
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  try {
    const { id: connectorId, appId } = params
    const supabase = getServerClient()

    // Get connector info
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select()
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'This endpoint is only for Kintone connectors' },
        { status: 400 }
      )
    }

    // Get valid token with auto-refresh
    const tokenSet = await getValidToken(connectorId)
    if (!tokenSet || !tokenSet.access_token) {
      return NextResponse.json(
        { error: 'No valid OAuth token found' },
        { status: 400 }
      )
    }

    // Load Kintone config (domain)
    const { data: configCreds, error: configError } = await supabase
      .from('credentials')
      .select('*')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_config')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (configError || !configCreds) {
      return NextResponse.json(
        { error: 'Kintone configuration not found' },
        { status: 400 }
      )
    }

    let kintoneConfig
    if (configCreds.payload) {
      kintoneConfig = JSON.parse(configCreds.payload)
    } else if (configCreds.payload_encrypted) {
      kintoneConfig = decryptJson(configCreds.payload_encrypted)
    }

    const domain = kintoneConfig?.domain
    if (!domain) {
      return NextResponse.json(
        { error: 'Kintone domain not found' },
        { status: 400 }
      )
    }

    // Create client and fetch fields
    const kintoneClient = new KintoneApiClient({ domain, accessToken: tokenSet.access_token })
    const kintoneFields = await kintoneClient.getAppFields(parseInt(appId, 10))

    return NextResponse.json({
      fields: kintoneFields || [],
      total: kintoneFields?.length || 0,
      appId
    })
  } catch (error) {
    console.error('Get Kintone fields error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Kintone fields' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; appId: string } }
) {
  try {
    const { id: connectorId, appId } = params
    const supabase = getServerClient()

    // Get connector
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('*')
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'This endpoint is only for Kintone connectors' },
        { status: 400 }
      )
    }

    if (connector.status !== 'connected') {
      return NextResponse.json(
        { error: 'Connector is not connected' },
        { status: 400 }
      )
    }

    // Get OAuth credentials from credentials table
    const { data: oauthCreds, error: credsError } = await supabase
      .from('credentials')
      .select('*')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_token')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (credsError || !oauthCreds) {
      return NextResponse.json(
        { error: 'No OAuth credentials found' },
        { status: 400 }
      )
    }

    // Decrypt access token from credentials table
    let accessToken
    if (oauthCreds.payload) {
      // Plain text payload
      const tokenData = JSON.parse(oauthCreds.payload)
      accessToken = tokenData.token || tokenData.access_token
    } else if (oauthCreds.payload_encrypted) {
      // Encrypted payload
      const accessTokenData = decryptJson(oauthCreds.payload_encrypted)
      accessToken = accessTokenData.token || accessTokenData.value || accessTokenData.access_token
    } else {
      throw new Error('No valid token payload found')
    }

    // Get Kintone config from credentials table
    const { data: configCreds, error: configError } = await supabase
      .from('credentials')
      .select('*')
      .eq('connector_id', connectorId)
      .eq('type', 'kintone_config')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (configError || !configCreds) {
      return NextResponse.json(
        { error: 'Kintone configuration not found' },
        { status: 400 }
      )
    }

    // Parse config
    let kintoneConfig
    if (configCreds.payload) {
      kintoneConfig = JSON.parse(configCreds.payload)
    } else if (configCreds.payload_encrypted) {
      kintoneConfig = decryptJson(configCreds.payload_encrypted)
    } else {
      return NextResponse.json(
        { error: 'Invalid Kintone configuration' },
        { status: 400 }
      )
    }

    // Use full domain from config
    const domain = kintoneConfig.domain

    if (!domain) {
      return NextResponse.json(
        { error: 'Kintone domain not found' },
        { status: 400 }
      )
    }

    // Create Kintone API client with full domain
    const kintoneClient = new KintoneApiClient({
      domain,
      accessToken
    })

    // Get the kintone_app record
    const { data: kintoneApp, error: appError } = await supabase
      .from('kintone_apps')
      .select()
      .eq('connector_id', connectorId)
      .eq('app_id', appId)
      .single()

    if (appError || !kintoneApp) {
      return NextResponse.json(
        { error: 'Kintone app not found. Please sync apps first.' },
        { status: 404 }
      )
    }

    // Fetch fields from Kintone
    const kintoneFields = await kintoneClient.getAppFields(appId)

    // Clear existing fields for this app
    await supabase
      .from('kintone_fields')
      .delete()
      .eq('kintone_app_id', kintoneApp.id)

    // Insert new fields
    const fieldsToInsert = kintoneFields.map(field => ({
      kintone_app_id: kintoneApp.id,
      field_code: field.code,
      field_label: field.label,
      field_type: field.type,
      required: field.required,
      options: field.options || null
    }))

    const { data: insertedFields, error: insertError } = await supabase
      .from('kintone_fields')
      .insert(fieldsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting fields:', insertError)
      return NextResponse.json(
        { error: 'Failed to sync fields' },
        { status: 500 }
      )
    }

    // Log sync event
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connectorId,
        level: 'info',
        event: 'fields_synced',
        detail: {
          app_id: appId,
          app_name: kintoneApp.name,
          fields_count: insertedFields.length
        }
      })

    return NextResponse.json({
      success: true,
      fields: insertedFields,
      total: insertedFields.length,
      appId,
      syncedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Sync Kintone fields error:', error)
    return NextResponse.json(
      { error: 'Failed to sync Kintone fields' },
      { status: 500 }
    )
  }
}
