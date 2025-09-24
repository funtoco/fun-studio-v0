/**
 * Kintone connection health check
 * GET /api/integrations/kintone/health?connectorId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector, getCredential } from '@/lib/db/connectors'
import { getConnectorToken, testConnection } from '@/lib/integrations/kintone'

// Force Node.js runtime and disable static caching
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const connectorId = searchParams.get('connectorId')
    
    if (!connectorId) {
      return NextResponse.json(
        { error: 'connectorId is required' },
        { status: 400 }
      )
    }
    
    // Get connector
    const connector = await getConnector(connectorId)
    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    if (connector.provider !== 'kintone') {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }
    
    try {
      // Get valid access token (with auto-refresh if needed)
      const accessToken = await getConnectorToken(connectorId)
      
      // Get config for testing
      const config = await getCredential(connectorId, 'kintone_config')
      if (!config) {
        return NextResponse.json(
          { error: 'Configuration not found' },
          { status: 400 }
        )
      }
      
      // Test connection
      const isHealthy = await testConnection(config, accessToken)
      
      if (isHealthy) {
        return NextResponse.json({
          status: 'ok',
          connectorId,
          provider: 'kintone',
          message: 'Connection is healthy'
        })
      } else {
        return NextResponse.json({
          status: 'error',
          connectorId,
          provider: 'kintone',
          message: 'Connection test failed'
        }, { status: 500 })
      }
      
    } catch (error) {
      console.error('Health check failed:', error)
      
      return NextResponse.json({
        status: 'error',
        connectorId,
        provider: 'kintone',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
