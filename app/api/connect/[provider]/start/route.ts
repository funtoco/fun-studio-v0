/**
 * OAuth authorization start endpoint
 * GET /api/connect/[provider]/start?tenantId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdapter, type ProviderId } from '@/lib/connectors/registry'
import { generatePKCEPair } from '@/lib/security/pkce'
import { signStateJWT } from '@/lib/security/state'
import { getConnectorByTenantAndProvider, addConnectorLog } from '@/lib/supabase/connectors-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const returnTo = searchParams.get('returnTo')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      )
    }
    
    const providerId = params.provider as ProviderId
    const adapter = getAdapter(providerId)
    
    // Get connector configuration
    const connector = await getConnectorByTenantAndProvider(tenantId, providerId)
    if (!connector) {
      return NextResponse.json(
        { error: `No ${providerId} connector found for tenant` },
        { status: 404 }
      )
    }
    
    if (!connector.oauth_client_id || !connector.oauth_client_secret) {
      await addConnectorLog(
        connector.id,
        'error',
        'error',
        { error: 'OAuth client not configured', missing: ['client_id', 'client_secret'] }
      )
      
      return NextResponse.json(
        { error: 'OAuth client not configured' },
        { status: 400 }
      )
    }
    
    // Generate PKCE pair
    const { codeVerifier, codeChallenge } = generatePKCEPair()
    
    // Generate state JWT
    const stateJwt = await signStateJWT({
      tenantId,
      provider: providerId,
      returnTo: returnTo || `/admin/connectors/${providerId}`
    })
    
    // Build redirect URI
    const redirectUri = new URL(`/api/connect/${providerId}/callback`, request.url).toString()
    
    // Debug logging
    console.log(`🔗 OAuth Start - Provider: ${providerId}`)
    console.log(`🔗 Redirect URI: ${redirectUri}`)
    console.log(`🔗 Subdomain: ${connector.subdomain}`)
    console.log(`🔗 Client ID: ${connector.oauth_client_id}`)
    console.log(`🔗 Scopes: ${JSON.stringify(connector.scopes)}`)
    
    // Check for Mock OAuth
    if (process.env.MOCK_OAUTH === '1') {
      console.log(`🧪 Mock OAuth enabled - bypassing real authorization`)
      
      // Store code verifier in cookie for callback
      const cookieStore = cookies()
      cookieStore.set('connect_pkce_verifier', codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/'
      })
      
      // Log mock authorization start
      await addConnectorLog(
        connector.id,
        'info',
        'authorize_start',
        {
          mock: true,
          redirect_uri: redirectUri,
          scopes: connector.scopes || adapter.requiredScopes,
          subdomain: connector.subdomain
        }
      )
      
      // Redirect directly to callback with mock code
      const mockCallbackUrl = new URL(redirectUri)
      mockCallbackUrl.searchParams.set('code', `mock_auth_code_${Date.now()}`)
      mockCallbackUrl.searchParams.set('state', stateJwt)
      
      console.log(`🚀 Mock OAuth - Redirecting to callback: ${mockCallbackUrl.toString()}`)
      return NextResponse.redirect(mockCallbackUrl.toString())
    }
    
    // Real OAuth flow
    const authUrl = adapter.buildAuthorizeUrl({
      tenantId,
      subdomain: connector.subdomain,
      clientId: connector.oauth_client_id,
      redirectUri,
      scope: connector.scopes || adapter.requiredScopes,
      stateJwt,
      codeChallenge
    })
    
    // Store code verifier in secure cookie
    const cookieStore = cookies()
    cookieStore.set('connect_pkce_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/'
    })
    
    // Log authorization start
    await addConnectorLog(
      connector.id,
      'info',
      'authorize_start',
      {
        redirect_uri: redirectUri,
        scopes: connector.scopes || adapter.requiredScopes,
        subdomain: connector.subdomain
      }
    )
    
    console.log(`🚀 Redirecting to: ${authUrl}`)
    
    // Redirect to provider
    return NextResponse.redirect(authUrl)
    
  } catch (error) {
    console.error('OAuth start error:', error)
    return NextResponse.json(
      { error: 'Failed to start OAuth flow' },
      { status: 500 }
    )
  }
}
