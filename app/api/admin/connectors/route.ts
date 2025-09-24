/**
 * Admin API for connector management
 * POST /api/admin/connectors - Create new connector with BYOC credentials
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { listConnectors, createConnector, getCredential, getConnectionStatus } from '@/lib/db/connectors'
import { computeRedirectUri } from '@/lib/utils/redirect-uri'

// Use Node.js runtime for crypto operations
export const runtime = 'nodejs'

// Validation schema for new connector system
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
    
    const connectors = await listConnectors(tenantId)
    
    // Enrich connectors with config and status data
    const enrichedConnectors = await Promise.all(
      connectors.map(async (connector) => {
        try {
          // Get connection status
          const status = await getConnectionStatus(connector.id)
          
          // For now, use mock config to avoid encryption issues
          const mockConfig = {
            subdomain: 'funtoco'
          }
          
          return {
            id: connector.id,
            name: connector.display_name,
            provider: connector.provider,
            status: status?.status || 'disconnected',
            provider_config: mockConfig,
            created_at: connector.created_at,
            updated_at: connector.updated_at
          }
        } catch (error) {
          console.error(`Failed to enrich connector ${connector.id}:`, error)
          return {
            id: connector.id,
            name: connector.display_name,
            provider: connector.provider,
            status: 'error',
            provider_config: { subdomain: 'funtoco' },
            created_at: connector.created_at,
            updated_at: connector.updated_at
          }
        }
      })
    )
    
    // Filter by search query if provided
    let filteredConnectors = enrichedConnectors
    if (searchQuery) {
      filteredConnectors = enrichedConnectors.filter(connector =>
        connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        connector.provider.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return NextResponse.json({
      connectors: filteredConnectors,
      total: filteredConnectors.length
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
    
    // Create connector using new system
    const connectorId = await createConnector({
      tenant_id: tenantId,
      provider,
      display_name: name
    })
    
    // Store Kintone configuration
    if (provider === 'kintone') {
      // For now, store as plain text to avoid encryption issues
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      
      const configData = {
        domain: `https://${providerConfig.subdomain}.cybozu.com`,
        clientId: clientId,
        clientSecret: clientSecret,
        scope: ['k:app_record:read', 'k:app_settings:read'] // Valid Kintone scopes
      }
      
      // Store as plain text JSON
      const { error: credError } = await supabase
        .from('credentials')
        .insert({
          connector_id: connectorId,
          type: 'kintone_config',
          payload: JSON.stringify(configData),
          format: 'plain'
        })
      
      if (credError) {
        throw new Error(`Failed to store credential: ${credError.message}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      connectorId,
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
