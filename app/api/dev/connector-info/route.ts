/**
 * Development-only connector info endpoint
 * GET /api/dev/connector-info?tenantId=xxx&provider=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnectorByTenantAndProvider } from '@/lib/supabase/connectors-db'
import { maskClientId, maskClientSecret } from '@/lib/security/mask'

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId') || '550e8400-e29b-41d4-a716-446655440001'
    const provider = searchParams.get('provider') || 'kintone'
    
    const connector = await getConnectorByTenantAndProvider(tenantId, provider)
    
    if (!connector) {
      return NextResponse.json({
        error: 'Connector not found',
        tenantId,
        provider,
        suggestion: 'Make sure the migration has been applied and sample data exists'
      })
    }
    
    // Build expected redirect URI
    const redirectUri = new URL(`/api/connect/${provider}/callback`, request.url).toString()
    
    return NextResponse.json({
      connector: {
        id: connector.id,
        tenant_id: connector.tenant_id,
        provider: connector.provider,
        subdomain: connector.subdomain,
        oauth_client_id: connector.oauth_client_id ? maskClientId(connector.oauth_client_id) : 'NOT_SET',
        oauth_client_secret: connector.oauth_client_secret ? maskClientSecret(connector.oauth_client_secret) : 'NOT_SET',
        scopes: connector.scopes,
        status: connector.status,
        error_message: connector.error_message,
        created_at: connector.created_at,
        updated_at: connector.updated_at
      },
      oauth_config: {
        expected_redirect_uri: redirectUri,
        authorization_url: connector.subdomain ? 
          `https://${connector.subdomain}.cybozu.com/oauth2/authorize` : 
          'SUBDOMAIN_NOT_SET',
        token_url: connector.subdomain ? 
          `https://${connector.subdomain}.cybozu.com/oauth2/token` : 
          'SUBDOMAIN_NOT_SET'
      },
      setup_instructions: {
        kintone_oauth_settings: `https://${connector.subdomain || 'YOUR_SUBDOMAIN'}.cybozu.com/k/admin/system/oauth/`,
        redirect_uri_to_add: redirectUri,
        required_scopes: ['k:app_record:read', 'k:app_settings:read']
      },
      debug_info: {
        current_host: request.headers.get('host'),
        user_agent: request.headers.get('user-agent'),
        mock_oauth: process.env.MOCK_OAUTH === '1'
      }
    })
    
  } catch (error) {
    console.error('Connector info error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get connector info',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
