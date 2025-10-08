/**
 * Value Mappings API
 * Handles CRUD operations for field value mappings
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

    // Verify the data mapping exists and belongs to this connector
    const { data: dataMapping, error: dataMappingError } = await supabase
      .from('data_mappings')
      .select(`
        *,
        connector_app_mappings!inner(connector_id)
      `)
      .eq('id', mappingId)
      .single()

    if (dataMappingError || !dataMapping) {
      return NextResponse.json({ error: 'Data mapping not found' }, { status: 404 })
    }

    if (dataMapping.connector_app_mappings.connector_id !== connectorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get value mappings
    const { data: valueMappings, error: valueMappingsError } = await supabase
      .from('field_value_mappings')
      .select('*')
      .eq('data_mapping_id', mappingId)
      .order('sort_order', { ascending: true })

    if (valueMappingsError) {
      console.error('Error fetching value mappings:', valueMappingsError)
      return NextResponse.json({ error: 'Failed to fetch value mappings' }, { status: 500 })
    }

    return NextResponse.json({
      valueMappings: valueMappings || [],
      success: true
    })

  } catch (error) {
    console.error('Value mappings API error:', error)
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
    const connectorId = params.id
    const mappingId = params.mappingId
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const body = await request.json()

    const { source_value, target_value, is_active = true, sort_order = 0 } = body

    if (!source_value || !target_value) {
      return NextResponse.json(
        { error: 'Missing required fields: source_value, target_value' },
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
    const { data: dataMapping, error: dataMappingError } = await supabase
      .from('data_mappings')
      .select(`
        *,
        connector_app_mappings!inner(connector_id)
      `)
      .eq('id', mappingId)
      .single()

    if (dataMappingError || !dataMapping) {
      return NextResponse.json({ error: 'Data mapping not found' }, { status: 404 })
    }

    if (dataMapping.connector_app_mappings.connector_id !== connectorId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create value mapping
    const { data: valueMapping, error: createError } = await supabase
      .from('field_value_mappings')
      .insert({
        data_mapping_id: mappingId,
        source_value,
        target_value,
        is_active,
        sort_order
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating value mapping:', createError)
      return NextResponse.json({ error: 'Failed to create value mapping' }, { status: 500 })
    }

    return NextResponse.json({
      valueMapping,
      success: true
    })

  } catch (error) {
    console.error('Create value mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
