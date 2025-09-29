import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey)
}

// POST /api/connector/mappings (create draft)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      connector_id,
      tenant_id,
      source_type,
      source_app_id,
      destination_app_key,
      field_mappings,
    } = body || {}

    if (!connector_id || !source_type || !source_app_id || !destination_app_key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (source_type !== 'kintone') {
      return NextResponse.json({ error: 'Only kintone source supported' }, { status: 400 })
    }

    const supabase = getServerClient()

    // Ensure connector exists
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('id, tenant_id')
      .eq('id', connector_id)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
    }

    // Create draft mapping for this connector + destination
    const appIdNum = parseInt(String(source_app_id), 10)
    if (Number.isNaN(appIdNum)) {
      return NextResponse.json({ error: 'source_app_id must be numeric' }, { status: 400 })
    }
    // Manual upsert one draft mapping per (connector, destination)
    const { data: existing, error: findErr } = await supabase
      .from('app_mappings')
      .select('id')
      .eq('connector_id', connector_id)
      .eq('service_feature', destination_app_key)
      .maybeSingle()

    let upserted: any
    if (findErr) {
      console.error('find mapping error', findErr)
    }
    if (existing?.id) {
      const { data: updated, error: updErr } = await supabase
        .from('app_mappings')
        .update({
          app_id: appIdNum,
          kintone_app_id: String(source_app_id),
          kintone_app_code: '',
          kintone_app_name: '',
          description: `Kintone app ${source_app_id} → ${destination_app_key}`,
          status: 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (updErr || !updated) {
        console.error('update mapping error', updErr)
        return NextResponse.json({ error: 'Failed to update mapping' }, { status: 500 })
      }
      upserted = updated
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from('app_mappings')
        .insert({
          connector_id,
          service_feature: destination_app_key,
          app_id: appIdNum,
          kintone_app_id: String(source_app_id),
          kintone_app_code: '',
          kintone_app_name: '',
          description: `Kintone app ${source_app_id} → ${destination_app_key}`,
          status: 'draft',
        })
        .select()
        .single()
      if (insErr || !inserted) {
        console.error('insert mapping error', insErr)
        return NextResponse.json({ error: 'Failed to create mapping' }, { status: 500 })
      }
      upserted = inserted
    }

    // Save draft field mappings if provided
    if (Array.isArray(field_mappings) && field_mappings.length > 0) {
      // replace existing field mappings for this mapping
      await supabase.from('field_mappings').delete().eq('mapping_app_id', upserted.id)

      const toInsert = field_mappings
        .filter((f: any) => f.source_field_code && f.destination_field_key)
        .map((f: any) => ({
          mapping_app_id: upserted.id,
          kintone_field_code: f.source_field_code,
          internal_field_name: f.destination_field_key,
          transformation_rule: f.transform ?? null,
        }))

      if (toInsert.length > 0) {
        await supabase.from('field_mappings').insert(toInsert)
      }
    }

    console.log(`[FLOW] SaveDraft mappingId=${upserted.id}`)

    return NextResponse.json({ mapping_id: upserted.id, status: 'draft' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}


