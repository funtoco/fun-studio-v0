/**
 * Data Mappings API
 * Handles CRUD operations for data mappings
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connectorId = params.id
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

    // Get app mappings first
    const { data: appMappings, error: appMappingsError } = await supabase
      .from('connector_app_mappings')
      .select('id')
      .eq('connector_id', connectorId)

    if (appMappingsError) {
      console.error('Error fetching app mappings:', appMappingsError)
      return NextResponse.json({ error: 'Failed to fetch app mappings' }, { status: 500 })
    }

    const appMappingIds = appMappings?.map(am => am.id) || []

    // Get data mappings with value mappings for the app mappings
    let dataMappings = []
    if (appMappingIds.length > 0) {
      const { data: dataMappingsData, error: dataMappingsError } = await supabase
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
        .in('app_mapping_id', appMappingIds)
        .order('created_at', { ascending: false })

      if (dataMappingsError) {
        console.error('Error fetching data mappings:', dataMappingsError)
        return NextResponse.json({ error: 'Failed to fetch data mappings' }, { status: 500 })
      }

      dataMappings = dataMappingsData || []
    }

    return NextResponse.json({
      dataMappings: dataMappings,
      success: true
    })

  } catch (error) {
    console.error('Data mappings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connectorId = params.id
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const body = await request.json()

    const { app_mapping_id, field_name, field_type } = body

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

    // Create data mapping
    const { data: dataMapping, error: createError } = await supabase
      .from('data_mappings')
      .insert({
        app_mapping_id,
        field_name,
        field_type,
        is_active: true
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating data mapping:', createError)
      return NextResponse.json({ error: 'Failed to create data mapping' }, { status: 500 })
    }

    return NextResponse.json({
      dataMapping,
      success: true
    })

  } catch (error) {
    console.error('Create data mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
