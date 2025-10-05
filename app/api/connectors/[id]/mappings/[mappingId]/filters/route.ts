import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MappingFilter, MappingFiltersListResponse } from '@/lib/types/mappings'

// Server-side Supabase client with service role key
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// GET /api/connectors/[id]/mappings/[mappingId]/filters
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const supabase = getServerClient()

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

    // Get filters for the mapping
    const { data: filters, error: filtersError } = await supabase
      .from('connector_app_filters')
      .select('*')
      .eq('app_mapping_id', mappingId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (filtersError) {
      console.error('Error fetching filters:', filtersError)
      return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 })
    }

    const response: MappingFiltersListResponse = {
      success: true,
      data: filters as MappingFilter[]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in GET /api/connectors/[id]/mappings/[mappingId]/filters:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/connectors/[id]/mappings/[mappingId]/filters
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    console.log('[FILTERS API] Starting POST request', { params })
    
    const supabase = getServerClient()

    const { id: connectorId, mappingId } = params
    const body = await request.json()
    const { filters } = body

    if (!filters || !Array.isArray(filters)) {
      return NextResponse.json({ error: 'Invalid filters data' }, { status: 400 })
    }

    // Verify connector belongs to user's tenant
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('tenant_id')
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json({ error: 'Connector not found' }, { status: 404 })
    }

    // Verify mapping exists
    const { data: mapping, error: mappingError } = await supabase
      .from('connector_app_mappings')
      .select('id')
      .eq('id', mappingId)
      .eq('connector_id', connectorId)
      .single()

    if (mappingError || !mapping) {
      return NextResponse.json({ error: 'Mapping not found' }, { status: 404 })
    }

    // First, deactivate existing filters
    const { error: deactivateError } = await supabase
      .from('connector_app_filters')
      .update({ is_active: false })
      .eq('app_mapping_id', mappingId)

    if (deactivateError) {
      console.error('Error deactivating existing filters:', deactivateError)
      return NextResponse.json({ error: 'Failed to update existing filters' }, { status: 500 })
    }

    // Insert new filters
    const filterData = filters.map((filter: any) => ({
      connector_id: connectorId,
      app_mapping_id: mappingId,
      field_code: filter.field_code,
      field_name: filter.field_name,
      field_type: filter.field_type,
      filter_value: filter.filter_value,
      is_active: true
    }))

    const { data: newFilters, error: insertError } = await supabase
      .from('connector_app_filters')
      .insert(filterData)
      .select()

    if (insertError) {
      console.error('Error inserting filters:', insertError)
      return NextResponse.json({ error: 'Failed to save filters' }, { status: 500 })
    }

    const response: MappingFiltersListResponse = {
      success: true,
      data: newFilters as MappingFilter[]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in POST /api/connectors/[id]/mappings/[mappingId]/filters:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/connectors/[id]/mappings/[mappingId]/filters
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  // PUT is same as POST for this endpoint
  return POST(request, { params })
}

// DELETE /api/connectors/[id]/mappings/[mappingId]/filters
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const supabase = getServerClient()

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

    // Deactivate all filters for the mapping
    const { error: deactivateError } = await supabase
      .from('connector_app_filters')
      .update({ is_active: false })
      .eq('app_mapping_id', mappingId)

    if (deactivateError) {
      console.error('Error deactivating filters:', deactivateError)
      return NextResponse.json({ error: 'Failed to delete filters' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/connectors/[id]/mappings/[mappingId]/filters:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
