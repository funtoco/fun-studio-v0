/**
 * Unified connector authentication callback endpoint
 * GET /api/auth/connectors/[provider]/callback?code=xxx&state=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector, updateConnectionStatus } from '@/lib/db/connectors'
import { loadKintoneClientConfig } from '@/lib/db/credential-loader'
import { exchangeCodeForToken } from '@/lib/integrations/kintone'
import { computeRedirectUri, computeBaseUrl } from '@/lib/utils/redirect-uri'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = params.provider
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    if (error) {
      return NextResponse.json(
        { error: `OAuth error: ${error} - ${errorDescription}` },
        { status: 400 }
      )
    }
    
    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      )
    }
    
    // Get session data from cookie
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('kintone_oauth_session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Missing session data' },
        { status: 400 }
      )
    }
    
    const sessionData = JSON.parse(sessionCookie.value)
    const { connectorId, tenantId, returnTo } = sessionData
    
    // Get connector
    const connector = await getConnector(connectorId)
    if (!connector || connector.tenant_id !== tenantId) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    // Handle different providers
    if (providerId === 'kintone') {
      // Load Kintone configuration
      const config = await loadKintoneClientConfig(connectorId)
      
      // Compute redirect URI dynamically from request (must match the one used in start)
      const redirectUri = computeRedirectUri(request)
      console.log('[auth-callback] computed redirectUri', redirectUri)
      
      // Exchange code for token
      const tokenData = await exchangeCodeForToken({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        domain: config.domain,
        redirectUri: redirectUri
      }, code)
      
      // Store token (simplified - in real implementation, encrypt this)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      await supabase
        .from('credentials')
        .insert({
          connector_id: connectorId,
          type: 'kintone_token',
          payload: JSON.stringify(tokenData)
        })
      
      // Update connection status
      await updateConnectionStatus(connectorId, 'connected')
      
      // Clear session cookie
      cookieStore.delete('kintone_oauth_session')
      
      // Redirect to return URL
      const baseUrl = computeBaseUrl(request)
      let redirectUrl = returnTo || `${baseUrl}/admin/connectors/${connectorId}?tenantId=${tenantId}&connected=true`
      
      // If returnTo is a relative URL, make it absolute
      if (returnTo && returnTo.startsWith('/')) {
        redirectUrl = `${baseUrl}${returnTo}`
      }
      
      return NextResponse.redirect(redirectUrl)
    }
    
    return NextResponse.json(
      { error: `Provider '${providerId}' is not supported` },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Connector auth callback error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}