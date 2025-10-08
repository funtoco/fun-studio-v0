/**
 * Individual Value Mapping API
 * Handles individual value mapping operations (GET, PUT, DELETE)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string; valueMappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const valueMappingId = params.valueMappingId
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

    // Get value mapping
    const { data: valueMapping, error: valueMappingError } = await supabase
      .from('field_value_mappings')
      .select('*')
      .eq('id', valueMappingId)
      .single()

    if (valueMappingError || !valueMapping) {
      return NextResponse.json({ error: 'Value mapping not found' }, { status: 404 })
    }

    // Verify the value mapping belongs to this data mapping
    if (valueMapping.data_mapping_id !== mappingId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({
      valueMapping,
      success: true
    })

  } catch (error) {
    console.error('Get value mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string; valueMappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const valueMappingId = params.valueMappingId
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const body = await request.json()

    const { source_value, target_value, is_active, sort_order } = body

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

    // Verify the value mapping exists and belongs to this data mapping
    const { data: existingMapping, error: existingError } = await supabase
      .from('field_value_mappings')
      .select('*')
      .eq('id', valueMappingId)
      .eq('data_mapping_id', mappingId)
      .single()

    if (existingError || !existingMapping) {
      return NextResponse.json({ error: 'Value mapping not found' }, { status: 404 })
    }

    // Update value mapping
    const { data: valueMapping, error: updateError } = await supabase
      .from('field_value_mappings')
      .update({
        source_value,
        target_value,
        is_active: is_active !== undefined ? is_active : true,
        sort_order: sort_order !== undefined ? sort_order : 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', valueMappingId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating value mapping:', updateError)
      return NextResponse.json({ error: 'Failed to update value mapping' }, { status: 500 })
    }

    return NextResponse.json({
      valueMapping,
      success: true
    })

  } catch (error) {
    console.error('Update value mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string; valueMappingId: string } }
) {
  try {
    const connectorId = params.id
    const mappingId = params.mappingId
    const valueMappingId = params.valueMappingId
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

    // Verify the value mapping exists and belongs to this data mapping
    const { data: existingMapping, error: existingError } = await supabase
      .from('field_value_mappings')
      .select('*')
      .eq('id', valueMappingId)
      .eq('data_mapping_id', mappingId)
      .single()

    if (existingError || !existingMapping) {
      return NextResponse.json({ error: 'Value mapping not found' }, { status: 404 })
    }

    // Delete value mapping
    const { error: deleteError } = await supabase
      .from('field_value_mappings')
      .delete()
      .eq('id', valueMappingId)

    if (deleteError) {
      console.error('Error deleting value mapping:', deleteError)
      return NextResponse.json({ error: 'Failed to delete value mapping' }, { status: 500 })
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Delete value mapping API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
