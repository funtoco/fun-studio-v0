/**
 * Admin API for connector management
 * POST /api/admin/connectors - Create new connector with BYOC credentials
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { encryptJson } from '@/lib/security/crypto'
import { getManifest, validateProviderConfig } from '@/lib/connectors/manifests'
import { type ProviderId } from '@/lib/connectors/types'
import { listConnectors } from '@/lib/db/connectors'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenantId')
    const searchQuery = searchParams.get('q')
    
    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      )
    }
    
    const connectors = await listConnectors(tenantId, searchQuery || undefined)
    
    return NextResponse.json({
      connectors,
      total: connectors.length
    })
    
  } catch (error) {
    console.error('Get connectors error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connectors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createConnectorSchema.parse(body)
    const { name, tenantId, provider, providerConfig, clientId, clientSecret, scopes } = validatedData
    
    // Get provider manifest and validate config
    const manifest = getManifest(provider as ProviderId)
    validateProviderConfig(provider as ProviderId, providerConfig)
    
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
    
    // Encrypt and store client credentials
    try {
      const clientIdEnc = encryptJson({ value: clientId })
      const clientSecretEnc = encryptJson({ value: clientSecret })
      
      const { error: secretsError } = await supabase
        .from('connector_secrets')
        .insert({
          connector_id: connector.id,
          oauth_client_id_enc: clientIdEnc,
          oauth_client_secret_enc: clientSecretEnc
        })
      
      if (secretsError) {
        // Clean up connector if secrets fail
        await supabase
          .from('connectors')
          .delete()
          .eq('id', connector.id)
        
        throw secretsError
      }
    } catch (encryptionError) {
      console.error('Failed to encrypt credentials:', encryptionError)
      
      // Clean up connector
      await supabase
        .from('connectors')
        .delete()
        .eq('id', connector.id)
      
      return NextResponse.json(
        { error: 'Failed to secure credentials' },
        { status: 500 }
      )
    }
    
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
          config_keys: Object.keys(providerConfig)
        }
      })
    
    return NextResponse.json({
      success: true,
      connectorId: connector.id,
      message: 'Connector created successfully'
    })
    
  } catch (error) {
    console.error('Create connector error:', error)
    
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
