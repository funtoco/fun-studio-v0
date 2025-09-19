/**
 * OAuth authorization callback endpoint
 * GET /api/connect/[provider]/callback?code=xxx&state=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getAdapter, type ProviderId } from '@/lib/connectors/registry'
import { verifyStateJWT, validateStatePayload } from '@/lib/security/state'
import { 
  getConnectorByTenantAndProvider,
  saveOAuthCredentials,
  updateConnectorStatus,
  addConnectorLog
} from '@/lib/supabase/connectors-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    
    // Handle OAuth errors
    if (error) {
      console.error('OAuth provider error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/admin/connectors?error=${encodeURIComponent(error)}`, request.url)
      )
    }
    
    if (!code || !state) {
      return NextResponse.json(
        { error: 'Missing code or state parameter' },
        { status: 400 }
      )
    }
    
    // Verify state JWT
    const statePayload = await verifyStateJWT(state)
    if (!validateStatePayload(statePayload)) {
      return NextResponse.json(
        { error: 'Invalid state payload' },
        { status: 400 }
      )
    }
    
    const { tenantId, provider: stateProvider, returnTo } = statePayload
    const providerId = params.provider as ProviderId
    
    // Verify provider matches
    if (stateProvider !== providerId) {
      return NextResponse.json(
        { error: 'Provider mismatch' },
        { status: 400 }
      )
    }
    
    // Get code verifier from cookie
    const cookieStore = cookies()
    const codeVerifier = cookieStore.get('connect_pkce_verifier')?.value
    if (!codeVerifier) {
      return NextResponse.json(
        { error: 'Missing code verifier' },
        { status: 400 }
      )
    }
    
    // Clear the cookie
    cookieStore.delete('connect_pkce_verifier')
    
    const adapter = getAdapter(providerId)
    
    // Get connector
    const connector = await getConnectorByTenantAndProvider(tenantId, providerId)
    if (!connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    if (!connector.oauth_client_id || !connector.oauth_client_secret) {
      return NextResponse.json(
        { error: 'OAuth client not configured' },
        { status: 400 }
      )
    }
    
    // Build redirect URI (must match the one used in start)
    const redirectUri = new URL(`/api/connect/${providerId}/callback`, request.url).toString()
    
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await adapter.exchangeToken({
        subdomain: connector.subdomain,
        clientId: connector.oauth_client_id,
        clientSecret: connector.oauth_client_secret,
        code,
        redirectUri,
        codeVerifier
      })
      
      // Save encrypted credentials
      await saveOAuthCredentials(connector.id, tokenResponse)
      
      // Update connector status
      await updateConnectorStatus(connector.id, 'connected')
      
      // Log successful callback
      await addConnectorLog(
        connector.id,
        'info',
        'authorize_callback',
        {
          success: true,
          token_type: tokenResponse.token_type,
          expires_in: tokenResponse.expires_in,
          scope: tokenResponse.scope,
          mock: tokenResponse.raw?.mock || false
        }
      )
      
      await addConnectorLog(
        connector.id,
        'info',
        'token_saved',
        {
          encrypted: true,
          expires_in: tokenResponse.expires_in,
          has_refresh_token: !!tokenResponse.refresh_token
        }
      )
      
      // Redirect to success page
      const successUrl = new URL(returnTo || `/admin/connectors/${providerId}`, request.url)
      successUrl.searchParams.set('connected', 'true')
      successUrl.searchParams.set('tenantId', tenantId)
      
      return NextResponse.redirect(successUrl)
      
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError)
      
      const errorMessage = tokenError instanceof Error 
        ? tokenError.message 
        : 'Token exchange failed'
      
      // Update connector status with error
      await updateConnectorStatus(connector.id, 'error', errorMessage)
      
      // Log error
      await addConnectorLog(
        connector.id,
        'error',
        'error',
        {
          error: 'token_exchange_failed',
          message: errorMessage,
          code: code?.substring(0, 10) + '...' // Partial code for debugging
        }
      )
      
      // Redirect to error page
      const errorUrl = new URL(returnTo || `/admin/connectors/${providerId}`, request.url)
      errorUrl.searchParams.set('error', 'token_exchange_failed')
      errorUrl.searchParams.set('tenantId', tenantId)
      
      return NextResponse.redirect(errorUrl)
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    
    // Redirect to generic error page
    const errorUrl = new URL('/admin/connectors', request.url)
    errorUrl.searchParams.set('error', 'callback_failed')
    
    return NextResponse.redirect(errorUrl)
  }
}
