/**
 * OAuth authorization start endpoint (v2 - new connector model)
 * GET /api/connect/[provider]/start-v2?tenantId=xxx&connectorId=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { getConnector } from '@/lib/db/connectors-v2'
import { getConfigAndToken, computeRedirectUri, buildAuthorizeUrl } from '@/lib/connectors/kintoneClient'

// Force Node.js runtime and disable static caching
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Sign state JWT (simplified for now)
async function signStateJWT(payload: any): Promise<string> {
  // For now, just return a simple state string
  return Buffer.from(JSON.stringify(payload)).toString('base64')
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
    
    const providerId = params.provider
    
    // Get connector using new system
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
    
    // Load Kintone configuration from database - NO FALLBACK
    let config
    try {
      // Create admin client inline
      const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
      
      // Load config only (token not needed for OAuth start)
      const { data: configRow, error: configError } = await supabase
        .from('credentials')
        .select('payload')
        .eq('connector_id', connectorId)
        .eq('type', 'kintone_config')
        .single()
      
      if (configError || !configRow?.payload) {
        throw new Error(`Failed to load Kintone config: ${configError?.message || 'Not found'}`)
      }
      
      config = JSON.parse(configRow.payload)
      console.log(`[kintone-auth] DEBUG - Config loaded:`, {
        domain: config?.domain,
        clientId: config?.clientId,
        hasScope: !!config?.scope
      })
    } catch (error) {
      console.error(`[kintone-auth] ERROR missing credentials for connectorId=${connectorId}:`, error.message)
      return NextResponse.json(
        { error: `Failed to load Kintone configuration: ${error.message}` },
        { status: 400 }
      )
    }
    
    // Compute redirect URI dynamically
    const redirectUri = computeRedirectUri(request)
    
    // Generate state parameter
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
    const state = await signStateJWT({
      tenantId,
      provider: providerId,
      connectorId,
      returnTo: returnTo || `${baseUrl}/admin/connectors/${connectorId}?tenantId=${tenantId}`
    })
    
    // Build authorization URL using config from database
    const authUrl = buildAuthorizeUrl(config, redirectUri, state)
    
    console.log(`[kintone-auth] OAuth Start - Provider: ${providerId}`)
    console.log(`[kintone-auth] Connector ID: ${connectorId}`)
    console.log(`[kintone-auth] Client ID: ${config.clientId}`)
    console.log(`[kintone-auth] Domain: ${config.domain}`)
    console.log(`[kintone-auth] Auth URL: ${authUrl}`)
    
    return NextResponse.redirect(authUrl)
    
  } catch (error) {
    console.error('OAuth start error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}