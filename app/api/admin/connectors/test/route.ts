/**
 * Test API for connector creation without encryption (Mock OAuth only)
 * POST /api/admin/connectors/test
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

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

// Validation schema
const createConnectorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  tenantId: z.string().uuid(),
  provider: z.enum(['kintone', 'hubspot']),
  providerConfig: z.record(z.any()).default({}),
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  scopes: z.array(z.string()).min(1, 'At least one scope is required')
})

export async function POST(request: NextRequest) {
  try {
    // Only allow in development with Mock OAuth
    if (process.env.NODE_ENV !== 'development' || process.env.MOCK_OAUTH !== '1') {
      return NextResponse.json(
        { error: 'This test endpoint is only available in development with MOCK_OAUTH=1' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validatedData = createConnectorSchema.parse(body)
    const { name, tenantId, provider, providerConfig, clientId, clientSecret, scopes } = validatedData
    
    console.log('🧪 Test connector creation:', { provider, tenantId, providerConfig })
    
    const supabase = getServerClient()
    
    // Check if connector already exists for this tenant/provider/config
    const { data: existingConnector } = await supabase
      .from('connectors')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('provider', provider)
      .eq('provider_config', JSON.stringify(providerConfig))
      .single()
    
    if (existingConnector) {
      return NextResponse.json(
        { error: 'Connector already exists for this configuration' },
        { status: 409 }
      )
    }
    
    // Create connector record
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .insert({
        tenant_id: tenantId,
        name,
        provider,
        provider_config: providerConfig,
        scopes,
        status: 'disconnected'
      })
      .select('id')
      .single()
    
    if (connectorError || !connector) {
      console.error('Failed to create connector:', connectorError)
      return NextResponse.json(
        { error: 'Failed to create connector' },
        { status: 500 }
      )
    }
    
    console.log('✅ Connector created:', connector.id)
    
    // Note: connector_secrets table is no longer used
    // OAuth credentials are stored in oauth_credentials table
    
    // Log connector creation
    await supabase
      .from('connector_logs')
      .insert({
        connector_id: connector.id,
        level: 'info',
        event: 'connector_created',
        detail: {
          provider,
          tenant_id: tenantId,
          scopes: scopes.length,
          config_keys: Object.keys(providerConfig),
          mock: true
        }
      })
    
    console.log('✅ Connector creation logged')
    
    return NextResponse.json({
      success: true,
      connectorId: connector.id,
      message: 'Test connector created successfully (Mock OAuth)',
      mock: true
    })
    
  } catch (error) {
    console.error('Create test connector error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
