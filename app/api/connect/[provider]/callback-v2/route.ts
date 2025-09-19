/**
 * OAuth authorization callback endpoint (v2 - new connector model)
 * GET /api/connect/[provider]/callback-v2?code=xxx&state=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { verifyStateJWT, validateStatePayload } from '@/lib/security/state'
import { decryptJson, encryptJson } from '@/lib/security/crypto'
import { getAdapter } from '@/lib/connectors/adapters'
import { type ProviderId } from '@/lib/connectors/types'

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

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
    
    const { tenantId, provider: stateProvider, connectorId, returnTo } = statePayload
    const providerId = params.provider as ProviderId
    
    // Verify provider matches
    if (stateProvider !== providerId) {
      return NextResponse.json(
        { error: 'Provider mismatch' },
        { status: 400 }
      )
    }
    
    if (!connectorId) {
      return NextResponse.json(
        { error: 'Missing connector ID in state' },
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
    const supabase = getServerClient()
    
    // Get connector with secrets and config
    const { data: connectorData, error: connectorError } = await supabase
      .from('connectors')
      .select(`
        *,
        connector_secrets (
          oauth_client_id_enc,
          oauth_client_secret_enc
        )
      `)
      .eq('id', connectorId)
      .eq('tenant_id', tenantId)
      .single()
    
    if (connectorError || !connectorData) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    if (!connectorData.connector_secrets) {
      return NextResponse.json(
        { error: 'Connector credentials not found' },
        { status: 400 }
      )
    }
    
    // Decrypt client credentials (handle both real and mock encryption)
    let clientId: string
    let clientSecret: string
    
    try {
      const clientIdEnc = connectorData.connector_secrets.oauth_client_id_enc
      const clientSecretEnc = connectorData.connector_secrets.oauth_client_secret_enc
      
      // Check if it's mock encrypted (for development)
      if (clientIdEnc.startsWith('mock_encrypted_') && clientSecretEnc.startsWith('mock_encrypted_')) {
        console.log('🧪 Using mock encrypted credentials')
        clientId = clientIdEnc.replace('mock_encrypted_', '')
        clientSecret = clientSecretEnc.replace('mock_encrypted_', '')
      } else {
        // Real decryption
        const decryptedClientId = decryptJson(clientIdEnc)
        const decryptedClientSecret = decryptJson(clientSecretEnc)
        
        clientId = decryptedClientId.value
        clientSecret = decryptedClientSecret.value
      }
      
      console.log(`🔑 Credentials loaded - Client ID: ${clientId.slice(0, 8)}...`)
    } catch (decryptionError) {
      console.error('Failed to decrypt credentials:', decryptionError)
      
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'error',
          event: 'error',
          detail: {
            error: 'credential_decryption_failed',
            message: 'Failed to decrypt client credentials'
          }
        })
      
      return NextResponse.json(
        { error: 'Failed to decrypt credentials' },
        { status: 500 }
      )
    }
    
    // Build redirect URI (must match the one used in start)
    const redirectUri = new URL(`/api/connect/${providerId}/callback-v2`, request.url).toString()
    
    try {
      // Exchange authorization code for tokens
      const tokenResponse = await adapter.exchangeToken({
        cfg: connectorData.provider_config,
        clientId,
        clientSecret,
        code,
        redirectUri,
        codeVerifier
      })
      
      // Encrypt and save tokens
      const accessTokenEnc = encryptJson({ token: tokenResponse.access_token })
      const refreshTokenEnc = tokenResponse.refresh_token 
        ? encryptJson({ token: tokenResponse.refresh_token })
        : null
      
      // Calculate expiry time
      const expiresAt = tokenResponse.expires_in 
        ? new Date(Date.now() + tokenResponse.expires_in * 1000).toISOString()
        : null
      
      // Delete existing credentials for this connector
      await supabase
        .from('oauth_credentials')
        .delete()
        .eq('connector_id', connectorId)
      
      // Insert new credentials
      await supabase
        .from('oauth_credentials')
        .insert({
          connector_id: connectorId,
          access_token_enc: accessTokenEnc,
          refresh_token_enc: refreshTokenEnc,
          expires_at: expiresAt,
          token_type: tokenResponse.token_type || 'Bearer',
          raw_provider_response: tokenResponse.raw
        })
      
      // Update connector status
      await supabase
        .from('connectors')
        .update({ 
          status: 'connected',
          error_message: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', connectorId)
      
      // Log successful callback
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'info',
          event: 'authorize_callback',
          detail: {
            success: true,
            token_type: tokenResponse.token_type,
            expires_in: tokenResponse.expires_in,
            has_refresh_token: !!tokenResponse.refresh_token,
            mock: tokenResponse.raw?.mock || false
          }
        })
      
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'info',
          event: 'token_saved',
          detail: {
            encrypted: true,
            expires_in: tokenResponse.expires_in,
            has_refresh_token: !!tokenResponse.refresh_token
          }
        })
      
      // Redirect to success page
      const successUrl = new URL(returnTo || `/admin/connectors/${providerId}`, request.url)
      successUrl.searchParams.set('connected', 'true')
      successUrl.searchParams.set('tenantId', tenantId)
      successUrl.searchParams.set('connectorId', connectorId)
      
      console.log(`✅ OAuth callback successful for connector ${connectorId}`)
      return NextResponse.redirect(successUrl)
      
    } catch (tokenError) {
      console.error('Token exchange error:', tokenError)
      
      const errorMessage = tokenError instanceof Error 
        ? tokenError.message 
        : 'Token exchange failed'
      
      // Update connector status with error
      await supabase
        .from('connectors')
        .update({ 
          status: 'error',
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', connectorId)
      
      // Log error
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'error',
          event: 'error',
          detail: {
            error: 'token_exchange_failed',
            message: errorMessage,
            code: code?.substring(0, 10) + '...' // Partial code for debugging
          }
        })
      
      // Redirect to error page
      const errorUrl = new URL(returnTo || `/admin/connectors/${providerId}`, request.url)
      errorUrl.searchParams.set('error', 'token_exchange_failed')
      errorUrl.searchParams.set('tenantId', tenantId)
      errorUrl.searchParams.set('connectorId', connectorId)
      
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
