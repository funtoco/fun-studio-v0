import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

export const runtime = 'nodejs'

// DELETE /api/connectors/[id]/kintone/apps/[mappingId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id: connectorId, mappingId } = params
    
    console.log('DELETE request received:', { connectorId, mappingId, url: request.url })
    
    if (!connectorId || !mappingId) {
      console.log('Missing required parameters:', { connectorId, mappingId })
      return NextResponse.json(
        { error: 'Connector ID and mapping ID are required' },
        { status: 400 }
      )
    }

    const supabase = getServerClient()

    // Get connector and verify access
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

    // First, delete related field mappings
    const { error: fieldDeleteError } = await supabase
      .from('connector_field_mappings')
      .delete()
      .eq('app_mapping_id', mappingId)

    if (fieldDeleteError) {
      console.error('Error deleting field mappings:', fieldDeleteError)
      return NextResponse.json(
        { error: 'Failed to delete field mappings' },
        { status: 500 }
      )
    }

    // Then delete the app mapping
    const { error: deleteError } = await supabase
      .from('connector_app_mappings')
      .delete()
      .eq('id', mappingId)
      .eq('connector_id', connectorId)

    if (deleteError) {
      console.error('Error deleting app mapping:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete app mapping' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Delete app mapping error:', error)
    return NextResponse.json(
      { error: 'Failed to delete app mapping' },
      { status: 500 }
    )
  }
}
