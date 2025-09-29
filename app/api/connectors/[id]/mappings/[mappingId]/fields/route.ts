/**
 * API to manage field mappings for a specific app mapping
 * GET /api/connectors/[id]/mappings/[mappingId]/fields - List field mappings
 * POST /api/connectors/[id]/mappings/[mappingId]/fields - Save field mappings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, serviceKey)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id: connectorId, mappingId } = params
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

    // Verify the mapping belongs to this connector
    const { data: appMapping, error: mappingError } = await supabase
      .from('app_mappings')
      .select()
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()

    if (mappingError || !appMapping) {
      return NextResponse.json(
        { error: 'App mapping not found' },
        { status: 404 }
      )
    }

    // Get field mappings for this app mapping
    const { data: fieldMappings, error: fieldsError } = await supabase
      .from('field_mappings')
      .select()
      .eq('mapping_app_id', mappingId)
      .order('internal_field_name')

    if (fieldsError) {
      console.error('Error fetching field mappings:', fieldsError)
      return NextResponse.json(
        { error: 'Failed to fetch field mappings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      fields: fieldMappings || [],
      total: fieldMappings?.length || 0,
      mappingId
    })

  } catch (error) {
    console.error('Get field mappings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch field mappings' },
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
    const { fieldMappings } = body

    if (!fieldMappings || !Array.isArray(fieldMappings)) {
      return NextResponse.json(
        { error: 'fieldMappings array is required' },
        { status: 400 }
      )
    }

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

    // Verify the mapping belongs to this connector
    const { data: appMapping, error: mappingError } = await supabase
      .from('app_mappings')
      .select()
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()

    if (mappingError || !appMapping) {
      return NextResponse.json(
        { error: 'App mapping not found' },
        { status: 404 }
      )
    }

    // Clear existing field mappings for this app mapping
    const { error: deleteError } = await supabase
      .from('field_mappings')
      .delete()
      .eq('mapping_app_id', mappingId)

    if (deleteError) {
      console.error('Error deleting existing field mappings:', deleteError)
      return NextResponse.json(
        { error: 'Failed to clear existing field mappings' },
        { status: 500 }
      )
    }

    // Insert new field mappings
    const fieldsToInsert = fieldMappings
      .filter(field => field.kintone_field_code && field.internal_field_name) // Only include fields with both values
      .map(field => ({
        mapping_app_id: mappingId,
        kintone_field_code: field.kintone_field_code,
        kintone_field_label: field.kintone_field_label || '',
        kintone_field_type: field.kintone_field_type || '',
        internal_field_name: field.internal_field_name,
        internal_field_type: field.internal_field_type || 'string',
        is_required: field.is_required || false,
        transformation_rule: field.transformation_rule || null
      }))

    if (fieldsToInsert.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No field mappings to save',
        fields: [],
        total: 0
      })
    }

    const { data: insertedFields, error: insertError } = await supabase
      .from('field_mappings')
      .insert(fieldsToInsert)
      .select()

    if (insertError) {
      console.error('Error inserting field mappings:', insertError)
      return NextResponse.json(
        { error: 'Failed to save field mappings' },
        { status: 500 }
      )
    }

    // Log the mapping update
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connectorId,
        level: 'info',
        event: 'field_mappings_updated',
        detail: {
          mapping_id: mappingId,
          app_name: appMapping.kintone_app_name,
          fields_count: insertedFields.length
        }
      })

    return NextResponse.json({
      success: true,
      fields: insertedFields,
      total: insertedFields.length,
      mappingId
    })

  } catch (error) {
    console.error('Save field mappings error:', error)
    return NextResponse.json(
      { error: 'Failed to save field mappings' },
      { status: 500 }
    )
  }
}
