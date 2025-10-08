/**
 * App Mappings API
 * Handles fetching app mappings for a connector
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

    // Get app mappings
    const { data: appMappings, error: appMappingsError } = await supabase
      .from('connector_app_mappings')
      .select(`
        id,
        source_app_id,
        source_app_name,
        target_app_type,
        is_active,
        created_at,
        updated_at
      `)
      .eq('connector_id', connectorId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (appMappingsError) {
      console.error('Error fetching app mappings:', appMappingsError)
      return NextResponse.json({ error: 'Failed to fetch app mappings' }, { status: 500 })
    }

    return NextResponse.json({
      appMappings: appMappings || [],
      success: true
    })

  } catch (error) {
    console.error('App mappings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
