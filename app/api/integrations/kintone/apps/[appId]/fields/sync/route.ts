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

async function fetchFields(domain: string, token: string, appId: number) {
  const url = new URL(`${domain}/k/v1/app/form/fields.json`)
  url.searchParams.set("app", String(appId))
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`fields fetch ${res.status}`)
  return res.json() // { properties: { code: { label,type,required,... }, ... } }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const connectorId = searchParams.get('connectorId')
    const appId = parseInt(params.appId)
    
    if (!connectorId) {
      return NextResponse.json({ error: 'connectorId is required' }, { status: 400 })
    }
    
    if (isNaN(appId)) {
      return NextResponse.json({ error: 'Invalid appId' }, { status: 400 })
    }
    
    console.log(`[kintone-sync] Fields sync request for connectorId: ${connectorId}, appId: ${appId}`)
    
    const supabase = admin()
    
    const { data: rows } = await supabase
      .from("credentials").select("type,payload").eq("connector_id", connectorId)

    const cfg = rows?.find(r => r.type === "kintone_config")?.payload ? JSON.parse(rows.find(r => r.type === "kintone_config")!.payload) : null
    const tok = rows?.find(r => r.type === "kintone_token")?.payload ? JSON.parse(rows.find(r => r.type === "kintone_token")!.payload) : null
    if (!cfg?.domain || !tok?.access_token) throw new Error("missing config/token")
    
    const json = await fetchFields(cfg.domain, tok.access_token, appId)
    const props = json.properties ?? {}
    const upserts = Object.entries(props).map(([field_code, p]: any) => ({
      connector_id: connectorId,
      app_id: appId,
      field_code,
      label: p.label ?? null,
      type: p.type ?? null,
      required: !!p.required,
      meta: p
    }))

    const { error } = await supabase.from("kintone_fields").upsert(upserts, {
      onConflict: "connector_id,app_id,field_code"
    })
    if (error) throw error

    console.log(`[kintone-sync] Successfully synced ${upserts.length} fields for app: ${appId}`)
    
    return NextResponse.json({ ok: true, upserted: upserts.length })
    
  } catch (error: any) {
    console.error('[kintone-sync] Fields sync failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
