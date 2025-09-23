/**
 * Test connection endpoint for debugging OAuth issues
 * GET /api/connectors/[id]/test-connection
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
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }

    // Get OAuth credentials
    const oauthCreds = connector.oauth_credentials?.[0]
    if (!oauthCreds) {
      return NextResponse.json({
        success: false,
        error: 'No OAuth credentials found',
        debug: {
          connectorId,
          hasOauthCreds: false,
          connectorStatus: connector.status
        }
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
          error: 'Access token is empty after decryption',
          debug: {
            connectorId,
            hasEncryptedToken: !!oauthCreds.access_token_enc,
            tokenLength: oauthCreds.access_token_enc?.length || 0,
            hasRefreshToken: !!oauthCreds.refresh_token_enc,
            expiresAt: oauthCreds.expires_at,
            tokenType: oauthCreds.token_type,
            decryptedData: accessTokenData,
            isValueString: typeof accessTokenData.value === 'string',
            valueLength: accessTokenData.value?.length || 0
          }
        })
      }
    } catch (decryptError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to decrypt access token',
        debug: {
          connectorId,
          decryptError: decryptError instanceof Error ? decryptError.message : 'Unknown error',
          hasEncryptedToken: !!oauthCreds.access_token_enc,
          tokenLength: oauthCreds.access_token_enc?.length || 0,
          hasRefreshToken: !!oauthCreds.refresh_token_enc,
          expiresAt: oauthCreds.expires_at,
          encryptedTokenPreview: oauthCreds.access_token_enc?.substring(0, 20) + '...'
        }
      })
    }

    // Test simple API call to Kintone using apps endpoint (matches our scope)
    const baseUrl = `https://${connector.provider_config.subdomain}.cybozu.com`
    const testUrl = `${baseUrl}/k/v1/apps.json`

    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        return NextResponse.json({
          success: false,
          error: `Kintone API error: ${response.status}`,
          debug: {
            connectorId,
            status: response.status,
            statusText: response.statusText,
            errorText,
            url: testUrl,
            hasToken: !!accessToken,
            tokenLength: accessToken.length,
            tokenPrefix: accessToken.substring(0, 10) + '...',
            subdomain: connector.provider_config.subdomain
          }
        })
      }

      const userData = await response.json()
      return NextResponse.json({
        success: true,
        message: 'Connection test successful',
        debug: {
          connectorId,
          userInfo: {
            id: userData.id,
            name: userData.name,
            email: userData.email
          },
          subdomain: connector.provider_config.subdomain,
          scopes: connector.scopes
        }
      })

    } catch (fetchError) {
      return NextResponse.json({
        success: false,
        error: 'Network error during connection test',
        debug: {
          connectorId,
          fetchError: fetchError instanceof Error ? fetchError.message : 'Unknown error',
          url: testUrl
        }
      })
    }

  } catch (error) {
    console.error('Test connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
