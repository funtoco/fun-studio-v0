/**
 * Individual Data Mapping API
 * Handles individual data mapping operations (GET, PUT, DELETE)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify tenant access
    if (tenantId) {
      const { data: connector, error: connectorError } = await supabase
        .from('connectors')
        .select('tenant_id')
        .eq('id', connectorId)
        .single()

      if (connectorError || !connector) {
        return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
      }

      if (connector.tenant_id !== tenantId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Get data mapping with value mappings
    const { data: dataMapping, error: dataMappingError } = await supabase
      .from('data_mappings')
      .select(`
        *,
        field_value_mappings (
          id,
          source_value,
          target_value,
          is_active,
          sort_order,
          created_at,
          updated_at
        )
      `)
      .eq('id', mappingId)
      .single()

    if (dataMappingError || !dataMapping) {
      return NextResponse.json({ error: 'Data mapping not found' }, { status: 404 })
    }

    // Verify the data mapping belongs to this connector
    const { data: appMapping, error: appMappingError } = await supabase
      .from('connector_app_mappings')
      .select('connector_id')
      .eq('id', dataMapping.app_mapping_id)
      .single()

    if (appMappingError || !appMapping || appMapping.connector_id !== connectorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      dataMapping,
      success: true
    })

  } catch (error) {
    console.error('Get data mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const body = await request.json()

    const { app_mapping_id, field_name, field_type, is_active } = body

    if (!app_mapping_id || !field_name || !field_type) {
      return NextResponse.json(
        { error: 'Missing required fields: app_mapping_id, field_name, field_type' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify tenant access
    if (tenantId) {
      const { data: connector, error: connectorError } = await supabase
        .from('connectors')
        .select('tenant_id')
        .eq('id', connectorId)
        .single()

      if (connectorError || !connector) {
        return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
      }

      if (connector.tenant_id !== tenantId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Verify the data mapping exists and belongs to this connector
    const { data: existingMapping, error: existingError } = await supabase
      .from('data_mappings')
      .select(`
        *,
        connector_app_mappings!inner(connector_id)
      `)
      .eq('id', mappingId)
      .single()

    if (existingError || !existingMapping) {
      return NextResponse.json({ error: 'Data mapping not found' }, { status: 404 })
    }

    if (existingMapping.connector_app_mappings.connector_id !== connectorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Verify app mapping belongs to this connector
    const { data: appMapping, error: appMappingError } = await supabase
      .from('connector_app_mappings')
      .select('id, connector_id')
      .eq('id', app_mapping_id)
      .eq('connector_id', connectorId)
      .single()

    if (appMappingError || !appMapping) {
      return NextResponse.json({ error: 'App mapping not found or access denied' }, { status: 404 })
    }

    // Update data mapping
    const { data: dataMapping, error: updateError } = await supabase
      .from('data_mappings')
      .update({
        app_mapping_id,
        field_name,
        field_type,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', mappingId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating data mapping:', updateError)
      return NextResponse.json({ error: 'Failed to update data mapping' }, { status: 500 })
    }

    return NextResponse.json({
      dataMapping,
      success: true
    })

  } catch (error) {
    console.error('Update data mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Verify tenant access
    if (tenantId) {
      const { data: connector, error: connectorError } = await supabase
        .from('connectors')
        .select('tenant_id')
        .eq('id', connectorId)
        .single()

      if (connectorError || !connector) {
        return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
      }

      if (connector.tenant_id !== tenantId) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Verify the data mapping exists and belongs to this connector
    const { data: existingMapping, error: existingError } = await supabase
      .from('data_mappings')
      .select(`
        *,
        connector_app_mappings!inner(connector_id)
      `)
      .eq('id', mappingId)
      .single()

    if (existingError || !existingMapping) {
      return NextResponse.json({ error: 'Data mapping not found' }, { status: 404 })
    }

    if (existingMapping.connector_app_mappings.connector_id !== connectorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Delete data mapping (cascade will delete value mappings)
    const { error: deleteError } = await supabase
      .from('data_mappings')
      .delete()
      .eq('id', mappingId)

    if (deleteError) {
      console.error('Error deleting data mapping:', deleteError)
      return NextResponse.json({ error: 'Failed to delete data mapping' }, { status: 500 })
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Delete data mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
