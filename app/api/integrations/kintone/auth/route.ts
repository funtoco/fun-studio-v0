/**
 * Kintone OAuth authorization start
 * GET /api/integrations/kintone/auth?tenantId=xxx&connectorId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector, getCredential } from '@/lib/db/connectors-v2'
import { buildKintoneAuthUrl } from '@/lib/integrations/kintone'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const connectorId = searchParams.get('connectorId')
    
    if (!tenantId || !connectorId) {
      return NextResponse.json(
        { error: 'tenantId and connectorId are required' },
        { status: 400 }
      )
    }
    
    // Get connector
    const connector = await getConnector(connectorId)
    if (!connector || connector.tenant_id !== tenantId) {
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
    
    // Get Kintone configuration
    const config = await getCredential(connectorId, 'kintone_config')
    if (!config) {
      return NextResponse.json(
        { error: 'Kintone configuration not found' },
        { status: 400 }
      )
    }
    
    // Generate state parameter
    const state = randomBytes(32).toString('hex')
    
    // Build authorization URL
    const authUrl = buildKintoneAuthUrl(config, state)
    
    // Store state in session/cookie for verification in callback
    // For now, we'll include it in the redirect URL
    const redirectUrl = new URL(authUrl)
    redirectUrl.searchParams.set('state', state)
    
    return NextResponse.redirect(redirectUrl.toString())
    
  } catch (error) {
    console.error('Kintone auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
