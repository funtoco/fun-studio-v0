/**
 * Dev introspection endpoint to verify connector config
 * GET /api/dev/show-connector?connectorId=...
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector } from '@/lib/db/connectors'
import { getServerClient } from '@/lib/supabase/server'

// Force Node.js runtime and disable static caching
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const connectorId = searchParams.get('connectorId')
    
    if (!connectorId) {
      return NextResponse.json(
        { error: 'connectorId is required' },
        { status: 400 }
      )
    }
    
    // Get connector info
    const connector = await getConnector(connectorId)
    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    // Get credentials info (without secrets)
    const supabase = getServerClient()
    const { data: credentials, error } = await supabase
      .from('credentials')
      .select('type, payload_encrypted')
      .eq('connector_id', connectorId)
    
    if (error) {
      return NextResponse.json(
        { error: `Failed to get credentials: ${error.message}` },
        { status: 500 }
      )
    }
    
    // Analyze credentials
    const configCred = credentials?.find(c => c.type === 'kintone_config')
    let hasClientId = false
    let hasSecret = false
    let format = 'unknown'
    
    if (configCred?.payload_encrypted) {
      const payload = configCred.payload_encrypted
      
      // Check if it's plain text (base64 JSON)
      try {
        const decoded = Buffer.from(payload, 'base64').toString('utf8')
        const parsed = JSON.parse(decoded)
        hasClientId = !!parsed.client_id
        hasSecret = !!parsed.client_secret
        format = 'plain'
      } catch {
        // Check if it's encrypted (hex format)
        if (payload.startsWith('\\x')) {
          format = 'enc'
          hasClientId = true // Assume it has data if encrypted
          hasSecret = true
        }
      }
    }
    
    return NextResponse.json({
      provider: connector.provider,
      domain: configCred ? 'funtoco.cybozu.com' : 'unknown',
      hasClientId,
      hasSecret,
      format,
      connectorId: connector.id,
      displayName: connector.display_name,
      createdAt: connector.created_at
    })
    
  } catch (error) {
    console.error('Show connector error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
