/**
 * Unified connector authentication start endpoint
 * GET /api/auth/connectors/[provider]/start?connectorId=xxx&tenantId=xxx&returnTo=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector } from '@/lib/db/connectors'
import { loadKintoneClientConfig } from '@/lib/db/credential-loader'
import { buildKintoneAuthUrl } from '@/lib/integrations/kintone'
import { cookies } from 'next/headers'
import { randomBytes } from 'crypto'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = params.provider
    const connectorId = searchParams.get('connectorId')
    const tenantId = searchParams.get('tenantId')
    const returnTo = searchParams.get('returnTo')
    
    if (!connectorId || !tenantId) {
      return NextResponse.json(
        { error: 'connectorId and tenantId are required' },
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
    
    if (connector.provider !== providerId) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }
    
    // Handle different providers
    if (providerId === 'kintone') {
      // Load Kintone configuration
      const config = await loadKintoneClientConfig(connectorId)
      
      // Generate random state for CSRF protection
      const state = randomBytes(32).toString('base64url')
      
      // Store session data in cookie
      const cookieStore = cookies()
      const sessionData = {
        tenantId,
        connectorId,
        returnTo: returnTo || `/admin/connectors/${connectorId}?tenantId=${tenantId}`
      }
      
      cookieStore.set('kintone_oauth_session', JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/'
      })
      
      // Build Kintone OAuth URL
      const authUrl = buildKintoneAuthUrl({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        domain: config.subdomain,
        redirectUri: config.redirectUri
      }, state)
      
      return NextResponse.redirect(authUrl)
    }
    
    return NextResponse.json(
      { error: `Provider '${providerId}' is not supported` },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Connector auth start error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
