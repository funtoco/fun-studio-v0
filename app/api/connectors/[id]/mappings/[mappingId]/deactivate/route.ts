import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/connectors/[id]/mappings/[mappingId]/deactivate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: connectorId, mappingId } = params

    // Verify connector belongs to user's tenant
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('tenant_id')
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
    }

    // Verify mapping exists and belongs to the connector
    const { data: mapping, error: mappingError } = await supabase
      .from('connector_app_mappings')
      .select('id, is_active')
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()

    if (mappingError || !mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 })
    }

    // Deactivate the mapping
    const { error: updateError } = await supabase
      .from('connector_app_mappings')
      .update({ is_active: false })
      .eq('id', mappingId)

    if (updateError) {
      console.error('Error deactivating mapping:', updateError)
      return NextResponse.json({ error: 'Failed to deactivate mapping' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Mapping deactivated successfully',
      mappingId: mappingId,
      isActive: false
    })
  } catch (error) {
    console.error('Error in POST /api/connectors/[id]/mappings/[mappingId]/deactivate:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
