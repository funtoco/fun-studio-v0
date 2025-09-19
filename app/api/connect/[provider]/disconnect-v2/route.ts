/**
 * OAuth disconnect endpoint (v2 - new connector model)
 * POST /api/connect/[provider]/disconnect-v2
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
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

// Validation schema
const disconnectSchema = z.object({
  tenantId: z.string().uuid(),
  connectorId: z.string().uuid()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const body = await request.json()
    const validatedData = disconnectSchema.parse(body)
    const { tenantId, connectorId } = validatedData
    
    const providerId = params.provider as ProviderId
    const adapter = getAdapter(providerId)
    const supabase = getServerClient()
    
    // Get connector
    const { data: connector, error: connectorError } = await supabase
      .from('connectors')
      .select('*')
      .eq('id', connectorId)
      .eq('tenant_id', tenantId)
      .eq('provider', providerId)
      .single()
    
    if (connectorError || !connector) {
      return NextResponse.json(
        { error: 'Connector not found' },
        { status: 404 }
      )
    }
    
    try {
      // Delete OAuth credentials
      const { error: credentialsError } = await supabase
        .from('oauth_credentials')
        .delete()
        .eq('connector_id', connectorId)
      
      if (credentialsError) {
        throw credentialsError
      }
      
      // Update connector status
      const { error: statusError } = await supabase
        .from('connectors')
        .update({ 
          status: 'disconnected',
          error_message: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', connectorId)
      
      if (statusError) {
        throw statusError
      }
      
      // Log disconnection
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'info',
          event: 'disconnected',
          detail: {
            manual: true,
            timestamp: new Date().toISOString()
          }
        })
      
      console.log(`✅ Connector ${connectorId} disconnected successfully`)
      
      return NextResponse.json({
        success: true,
        message: `${adapter.constructor.name} connector disconnected successfully`
      })
      
    } catch (disconnectError) {
      console.error('Disconnect error:', disconnectError)
      
      const errorMessage = disconnectError instanceof Error 
        ? disconnectError.message 
        : 'Disconnect failed'
      
      // Log error
      await supabase
        .from('connector_logs')
        .insert({
          connector_id: connectorId,
          level: 'error',
          event: 'error',
          detail: {
            error: 'disconnect_failed',
            message: errorMessage
          }
        })
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Disconnect request error:', error)
    
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
      { error: 'Failed to process disconnect request' },
      { status: 500 }
    )
  }
}
