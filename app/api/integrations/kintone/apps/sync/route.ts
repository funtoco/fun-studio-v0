import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function admin() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function fetchApps(domain: string, token: string, offset = 0, limit = 100) {
  const url = new URL(`${domain}/k/v1/apps.json`)
  url.searchParams.set("offset", String(offset))
  url.searchParams.set("limit", String(limit))
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`apps fetch ${res.status}`)
  return res.json() // { apps: [...] }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const connectorId = searchParams.get('connectorId')
    
    if (!connectorId) {
      return NextResponse.json({ error: 'connectorId is required' }, { status: 400 })
    }
    
    console.log(`[kintone-sync] Apps sync request for connectorId: ${connectorId}`)
    
    const supabase = admin()
    
    // Load config + token dari credentials (payload jsonb)
    const { data: rows } = await supabase
      .from("credentials")
      .select("type,payload")
      .eq("connector_id", connectorId)

    const cfg = rows?.find(r => r.type === "kintone_config")?.payload ? JSON.parse(rows.find(r => r.type === "kintone_config")!.payload) : null
    const tok = rows?.find(r => r.type === "kintone_token")?.payload ? JSON.parse(rows.find(r => r.type === "kintone_token")!.payload) : null
    if (!cfg?.domain || !tok?.access_token) throw new Error("missing config/token")
    
    let offset = 0, upserted = 0
    for (;;) {
      const page = await fetchApps(cfg.domain, tok.access_token, offset, 100)
      const apps = page.apps ?? []
      if (!apps.length) break

      const upserts = apps.map((a: any) => ({
        connector_id: connectorId,
        kintone_app_id: String(a.appId),
        kintone_app_code: a.code ?? null,
        kintone_app_name: a.name,
        description: `Kintone app: ${a.name}`,
        app_type: 'kintone',
        status: 'active'
      }))

      const { error } = await supabase.from("app_mappings").upsert(upserts, {
        onConflict: "connector_id,kintone_app_id"
      })
      if (error) throw error
      upserted += upserts.length

      if (apps.length < 100) break
      offset += 100
    }

    console.log(`[kintone-sync] Successfully synced ${upserted} apps`)
    
    return NextResponse.json({ ok: true, upserted })
    
  } catch (error: any) {
    console.error('[kintone-sync] Apps sync failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
