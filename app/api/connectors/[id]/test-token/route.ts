/**
 * Test token endpoint to get full token for manual testing
 * GET /api/connectors/[id]/test-token
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decryptJson } from '@/lib/security/crypto'

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
  { params }: { params: { id: string } }
) {
  try {
    const { id: connectorId } = params
    const supabase = getServerClient()

    // Get connector and its credentials
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select(`
        *,
        oauth_credentials(*)
      `)
      .eq('id', connectorId)
      .single()

    if (connectorError || !connector) {
      return NextResponse.json({
        success: false,
        error: 'Connector not found'
      })
    }

    // Get OAuth credentials
    const oauthCreds = connector.oauth_credentials?.[0]
    if (!oauthCreds) {
      return NextResponse.json({
        success: false,
        error: 'No OAuth credentials found'
      })
    }

    // Decrypt access token
    let accessToken: string
    try {
      const accessTokenData = decryptJson(oauthCreds.access_token_enc)
      accessToken = accessTokenData.token || accessTokenData.value
      
      if (!accessToken) {
        return NextResponse.json({
          success: false,
          error: 'Access token is empty after decryption'
        })
      }
    } catch (decryptError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to decrypt access token'
      })
    }

    return NextResponse.json({
      success: true,
      token: accessToken,
      subdomain: connector.provider_config.subdomain,
      scopes: connector.scopes,
      expiresAt: oauthCreds.expires_at,
      tokenType: oauthCreds.token_type
    })

  } catch (error) {
    console.error('Test token error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    })
  }
}
