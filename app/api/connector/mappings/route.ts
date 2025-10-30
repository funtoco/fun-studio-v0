import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient } from '@/lib/kintone/api-client'
import { decryptJson } from '@/lib/crypto/secretStore'

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
      target_table,
      skip_if_no_update_target,
      app_mapping_id, // Optional: if provided, update existing mapping
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
    let mappingId: string
    let upserted: any

    if (app_mapping_id) {
      // Update existing mapping using provided app_mapping_id
      console.log('Updating existing mapping:', app_mapping_id)
      const { data: updated, error: updateErr } = await supabase
        .from('connector_app_mappings')
        .update({
          source_app_id: String(source_app_id),
          source_app_name: `Kintone app ${source_app_id}`,
          skip_if_no_update_target: skip_if_no_update_target || false,
          is_active: false, // draft status
        })
        .eq('id', app_mapping_id)
        .select()
        .single()
      
      if (updateErr || !updated) {
        console.error('update mapping error', updateErr)
        return NextResponse.json({ error: 'Failed to update mapping' }, { status: 500 })
      }
      
      mappingId = app_mapping_id
      upserted = updated
    } else {
      // Create new mapping
      console.log('Creating new mapping')
      const defaultTargetTable = target_table || destination_app_key
      const { data: inserted, error: insErr } = await supabase
        .from('connector_app_mappings')
        .insert({
          connector_id,
          target_app_type: destination_app_key,
          target_table: defaultTargetTable,
          source_app_id: String(source_app_id),
          source_app_name: `Kintone app ${source_app_id}`,
          skip_if_no_update_target: skip_if_no_update_target || false,
          is_active: false, // draft status
        })
        .select()
        .single()
      
      if (insErr || !inserted) {
        console.error('insert mapping error', insErr)
        return NextResponse.json({ error: 'Failed to create mapping' }, { status: 500 })
      }
      
      mappingId = inserted.id
      upserted = inserted
    }

    // Save draft field mappings if provided
    if (Array.isArray(field_mappings) && field_mappings.length > 0) {
      // Get Kintone field information to populate source_field_type and source_field_name
      let kintoneFields: any[] = []
      try {
        // Get Kintone config and token
        const { data: configCreds } = await supabase
          .from('credentials')
          .select('*')
          .eq('connector_id', connector_id)
          .eq('type', 'kintone_config')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        const { data: tokenCreds } = await supabase
          .from('credentials')
          .select('*')
          .eq('connector_id', connector_id)
          .eq('type', 'kintone_token')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (configCreds && tokenCreds) {
          let kintoneConfig
          if (configCreds.payload) {
            kintoneConfig = JSON.parse(configCreds.payload)
          } else if (configCreds.payload_encrypted) {
            kintoneConfig = decryptJson(configCreds.payload_encrypted)
          }

          let tokenData
          if (tokenCreds.payload) {
            tokenData = JSON.parse(tokenCreds.payload)
          } else if (tokenCreds.payload_encrypted) {
            tokenData = decryptJson(tokenCreds.payload_encrypted)
          }

          if (kintoneConfig?.domain && tokenData?.access_token) {
            const kintoneClient = new KintoneApiClient({ 
              domain: kintoneConfig.domain, 
              accessToken: tokenData.access_token 
            })
            kintoneFields = await kintoneClient.getAppFields(String(source_app_id))
          }
        }
      } catch (error) {
        console.warn('Failed to fetch Kintone fields for field mapping:', error)
        // Continue without field type information
      }

      // replace existing field mappings for this mapping
      await supabase.from('connector_field_mappings').delete().eq('app_mapping_id', mappingId)

      const toInsert = field_mappings
        .filter((f: any) => f.source_field_code && f.destination_field_key)
        .map((f: any, index: number) => {
          // Find corresponding Kintone field information
          const kintoneField = kintoneFields.find(field => field.code === f.source_field_code)
          
          return {
            connector_id,
            app_mapping_id: mappingId,
            source_field_id: f.source_field_code,
            source_field_code: f.source_field_code,
            source_field_name: kintoneField?.label || f.source_field_code,
            source_field_type: kintoneField?.type || 'UNKNOWN',
            target_field_id: f.destination_field_key,
            target_field_code: f.destination_field_key,
            is_required: false,
            is_active: true,
            is_update_key: f.is_update_key || false,
            sort_order: index,
          }
        })

      if (toInsert.length > 0) {
        await supabase.from('connector_field_mappings').insert(toInsert)
      }
    }

    console.log(`[FLOW] SaveDraft mappingId=${upserted.id}`)

    return NextResponse.json({ mapping_id: upserted.id, status: 'draft' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}


