/**
 * Connector disconnect endpoint
 * POST /api/connectors/[id]/disconnect
 */

import { NextRequest, NextResponse } from 'next/server'
import { updateConnectionStatus } from '@/lib/db/connectors'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { tenantId, connectorId } = body
    
    if (!tenantId || !connectorId) {
      return NextResponse.json(
        { error: 'tenantId and connectorId are required' },
        { status: 400 }
      )
    }
    
    const providerId = params.id
    
    // Create admin client
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    
    // Delete OAuth credentials
    const { error: credentialsError } = await supabase
      .from('oauth_credentials')
      .delete()
      .eq('connector_id', connectorId)
    
    if (credentialsError) {
      console.error('Failed to delete credentials:', credentialsError)
      return NextResponse.json(
        { error: 'Failed to delete credentials' },
        { status: 500 }
      )
    }
    
    // Update connection status
    await updateConnectionStatus(connectorId, 'disconnected')
    
    console.log(`✅ Connector ${connectorId} disconnected successfully`)
    
    return NextResponse.json({
      success: true,
      message: `${providerId} connector disconnected successfully`
    })
    
  } catch (error) {
    console.error('Disconnect error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
