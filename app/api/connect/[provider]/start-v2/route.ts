/**
 * OAuth authorization start endpoint (v2 - new connector model)
 * GET /api/connect/[provider]/start-v2?tenantId=xxx&connectorId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { generatePKCEPair } from '@/lib/security/pkce'
import { signStateJWT } from '@/lib/security/state'
import { decryptJson } from '@/lib/security/crypto'
import { getManifest } from '@/lib/connectors/manifests'
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
    const tenantId = searchParams.get('tenantId')
    const connectorId = searchParams.get('connectorId')
    const returnTo = searchParams.get('returnTo')
    
    if (!tenantId || !connectorId) {
      return NextResponse.json(
        { error: 'tenantId and connectorId are required' },
        { status: 400 }
      )
    }
    
    const providerId = params.provider as ProviderId
    const manifest = getManifest(providerId)
    const supabase = getServerClient()
    
    // Get connector with secrets
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
      .eq('provider', providerId)
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
    } catch (decryptionError) {
      console.error('Failed to decrypt credentials:', decryptionError)
      return NextResponse.json(
        { error: 'Failed to decrypt credentials' },
        { status: 500 }
      )
    }
    
    // Generate PKCE pair
    const { codeVerifier, codeChallenge } = generatePKCEPair()
    
    // Generate state JWT
    const stateJwt = await signStateJWT({
      tenantId,
      provider: providerId,
      connectorId,
      returnTo: returnTo || `/admin/connectors/${providerId}?tenantId=${tenantId}`
    })
    
    // Build redirect URI
    const redirectUri = new URL(`/api/connect/${providerId}/callback-v2`, request.url).toString()
    
    // Debug logging
    console.log(`🔗 OAuth Start (v2) - Provider: ${providerId}`)
    console.log(`🔗 Connector ID: ${connectorId}`)
    console.log(`🔗 Redirect URI: ${redirectUri}`)
    console.log(`🔗 Provider Config:`, connectorData.provider_config)
    console.log(`🔗 Scopes:`, connectorData.scopes)
    
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
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'info',
          event: 'authorize_start',
          detail: {
            mock: true,
            redirect_uri: redirectUri,
            scopes: connectorData.scopes,
            provider_config: connectorData.provider_config
          }
        })
      
      // Redirect directly to callback with mock code
      const mockCallbackUrl = new URL(redirectUri)
      mockCallbackUrl.searchParams.set('code', `mock_auth_code_${Date.now()}`)
      mockCallbackUrl.searchParams.set('state', stateJwt)
      
      console.log(`🚀 Mock OAuth - Redirecting to callback: ${mockCallbackUrl.toString()}`)
      return NextResponse.redirect(mockCallbackUrl.toString())
    }
    
    // Real OAuth flow - build authorization URL
    const baseAuthUrl = manifest.authorizeUrl(connectorData.provider_config)
    const authUrl = new URL(baseAuthUrl)
    
    // Add OAuth parameters
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', connectorData.scopes.join(' '))
    authUrl.searchParams.set('state', stateJwt)
    authUrl.searchParams.set('code_challenge', codeChallenge)
    authUrl.searchParams.set('code_challenge_method', 'S256')
    
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
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connectorId,
        level: 'info',
        event: 'authorize_start',
        detail: {
          redirect_uri: redirectUri,
          scopes: connectorData.scopes,
          provider_config: connectorData.provider_config
        }
      })
    
    console.log(`🚀 Redirecting to: ${authUrl.toString()}`)
    
    // Redirect to provider
    return NextResponse.redirect(authUrl.toString())
    
  } catch (error) {
    console.error('OAuth start error:', error)
    return NextResponse.json(
      { error: 'Failed to start OAuth flow' },
      { status: 500 }
    )
  }
}
