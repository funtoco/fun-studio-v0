/**
 * OAuth disconnect endpoint
 * POST /api/connect/[provider]/disconnect
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdapter, type ProviderId } from '@/lib/connectors/registry'
import { 
  getConnectorByTenantAndProvider,
  deleteOAuthCredentials,
  updateConnectorStatus,
  addConnectorLog
} from '@/lib/supabase/connectors-db'

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const body = await request.json()
    const { tenantId } = body
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      )
    }
    
    const providerId = params.provider as ProviderId
    const adapter = getAdapter(providerId)
    
    // Get connector
    const connector = await getConnectorByTenantAndProvider(tenantId, providerId)
    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    try {
      // Delete OAuth credentials
      await deleteOAuthCredentials(connector.id)
      
      // Update connector status
      await updateConnectorStatus(connector.id, 'disconnected')
      
      // Log disconnection
      await addConnectorLog(
        connector.id,
        'info',
        'disconnected',
        {
          manual: true,
          timestamp: new Date().toISOString()
        }
      )
      
      return NextResponse.json({
        success: true,
        message: `${adapter.name} connector disconnected successfully`
      })
      
    } catch (disconnectError) {
      console.error('Disconnect error:', disconnectError)
      
      const errorMessage = disconnectError instanceof Error 
        ? disconnectError.message 
        : 'Disconnect failed'
      
      // Log error
      await addConnectorLog(
        connector.id,
        'error',
        'error',
        {
          error: 'disconnect_failed',
          message: errorMessage
        }
      )
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Disconnect request error:', error)
    return NextResponse.json(
      { error: 'Failed to process disconnect request' },
      { status: 500 }
    )
  }
}
