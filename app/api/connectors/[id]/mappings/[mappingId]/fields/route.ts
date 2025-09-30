import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateFieldsSchema = z.object({
  fields: z.array(z.object({
    source_field_code: z.string(),
    target_field_id: z.string()
  }))
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id: connectorId, mappingId } = params
    const supabase = await createClient()
    
    // Verify connector exists
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('id, tenant_id')
      .eq('id', connectorId)
      .single()
    
    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    // Verify mapping exists and belongs to this connector
    const { data: mapping, error: mappingError } = await supabase
      .from('connector_app_mappings')
      .select('id, connector_id')
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()
    
    if (mappingError || !mapping) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      )
    }
    
    // Get field mappings for this mapping
    const { data: fieldMappings, error: fieldMappingsError } = await supabase
      .from('connector_field_mappings')
      .select('*')
      .eq('app_mapping_id', mappingId)
      .order('created_at', { ascending: true })
    
    if (fieldMappingsError) {
      console.error('Error fetching field mappings:', fieldMappingsError)
      return NextResponse.json(
        { error: 'Failed to fetch field mappings' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      fields: fieldMappings || [],
      mappingId,
      fieldCount: fieldMappings?.length || 0
    })
    
  } catch (error) {
    console.error('Error fetching field mappings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id: connectorId, mappingId } = params
    const body = await request.json()
    
    // Validate request body
    const validatedData = updateFieldsSchema.parse(body)
    
    const supabase = await createClient()
    
    // Verify connector exists
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('id, tenant_id')
      .eq('id', connectorId)
      .single()
    
    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    // Verify mapping exists and belongs to this connector
    const { data: mapping, error: mappingError } = await supabase
      .from('connector_app_mappings')
      .select('id, connector_id')
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()
    
    if (mappingError || !mapping) {
      return NextResponse.json(
        { error: 'Mapping not found' },
        { status: 404 }
      )
    }
    
    // Delete existing field mappings for this mapping
    const { error: deleteError } = await supabase
      .from('connector_field_mappings')
      .delete()
      .eq('app_mapping_id', mappingId)
    
    if (deleteError) {
      console.error('Error deleting existing field mappings:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete existing field mappings' },
        { status: 500 }
      )
    }
    
    // Insert new field mappings
    const fieldMappings = validatedData.fields.map(field => ({
      connector_id: connectorId,
      app_mapping_id: mappingId,
      source_field_id: field.source_field_code,
      source_field_code: field.source_field_code,
      target_field_id: field.target_field_id,
      is_required: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))
    
    const { error: insertError } = await supabase
      .from('connector_field_mappings')
      .insert(fieldMappings)
    
    if (insertError) {
      console.error('Error inserting field mappings:', insertError)
      return NextResponse.json(
        { error: 'Failed to insert field mappings' },
        { status: 500 }
      )
    }
    
    // Update mapping timestamp
    const { error: updateError } = await supabase
      .from('connector_app_mappings')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', mappingId)
    
    if (updateError) {
      console.error('Error updating mapping timestamp:', updateError)
      // Don't fail the request for this
    }
    
    return NextResponse.json({
      success: true,
      message: 'Field mappings updated successfully',
      mappingId,
      fieldCount: fieldMappings.length
    })
    
  } catch (error) {
    console.error('Error updating field mappings:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}