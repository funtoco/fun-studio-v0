/**
 * Debug connection endpoint for detailed Kintone API testing
 * GET /api/connectors/[id]/debug-connection
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
        error: 'Connector not found',
        debug: { connectorError }
      })
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
            decryptedData: accessTokenData
          }
        })
      }
    } catch (decryptError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to decrypt access token',
        debug: {
          connectorId,
          decryptError: decryptError instanceof Error ? decryptError.message : 'Unknown error'
        }
      })
    }

    const baseUrl = `https://${connector.provider_config.subdomain}.cybozu.com`
    
    // Test multiple endpoints to see which one works
    const testEndpoints = [
      { name: 'Apps (GET)', url: `${baseUrl}/k/v1/apps.json`, method: 'GET' },
      { name: 'Apps (POST)', url: `${baseUrl}/k/v1/apps.json`, method: 'POST', body: '{}' },
      { name: 'User Info', url: `${baseUrl}/k/v1/user.json`, method: 'GET' },
      { name: 'App Settings', url: `${baseUrl}/k/v1/app/settings.json`, method: 'GET' },
    ]

    const results = []

    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: endpoint.body
        })

        const responseText = await response.text()
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch {
          responseData = responseText
        }

        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          response: responseData,
          headers: Object.fromEntries(response.headers.entries())
        })

      } catch (fetchError) {
        results.push({
          endpoint: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          success: false,
          error: fetchError instanceof Error ? fetchError.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      debug: {
        connectorId,
        connector: {
          id: connector.id,
          name: connector.name,
          provider: connector.provider,
          status: connector.status,
          scopes: connector.scopes,
          provider_config: connector.provider_config
        },
        oauth: {
          hasToken: !!accessToken,
          tokenLength: accessToken.length,
          tokenPrefix: accessToken.substring(0, 10) + '...',
          expiresAt: oauthCreds.expires_at,
          tokenType: oauthCreds.token_type
        },
        testResults: results
      }
    })

  } catch (error) {
    console.error('Debug connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}
