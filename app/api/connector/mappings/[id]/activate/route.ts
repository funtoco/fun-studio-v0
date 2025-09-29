import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey)
}

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mappingId = params.id
    const supabase = getServerClient()

    // Get mapping
    const { data: mapping, error: mappingError } = await supabase
      .from('connector_app_mappings')
      .select('id, connector_id, target_app_type, source_app_id')
      .eq('id', mappingId)
      .single()

    if (mappingError || !mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 })
    }

    // Deactivate existing active mapping that conflicts (same connector + source app)
    await supabase
      .from('connector_app_mappings')
      .update({ is_active: false })
      .eq('connector_id', mapping.connector_id)
      .eq('source_app_id', mapping.source_app_id)
      .eq('is_active', true)

    // Activate this mapping
    const { data: updated, error: activateError } = await supabase
      .from('connector_app_mappings')
      .update({ is_active: true })
      .eq('id', mappingId)
      .select('id, connector_id, target_app_type, source_app_id, is_active')
      .single()

    if (activateError) {
      return NextResponse.json({ error: 'Failed to activate mapping' }, { status: 500 })
    }

    console.log(`[FLOW] Activate mappingId=${mappingId} → done`)

    // TODO: schedule initial import job (out of scope; enqueue if worker exists)

    return NextResponse.json({ mapping: updated })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to activate mapping' }, { status: 500 })
  }
}


