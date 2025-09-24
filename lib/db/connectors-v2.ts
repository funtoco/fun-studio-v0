/**
 * Database helpers for new connector system
 */

import { createClient } from '@supabase/supabase-js'
import { encryptJson, decryptJson } from '@/lib/crypto/secretStore'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// Types
export interface Connector {
  id: string
  tenant_id: string
  provider: string
  display_name: string
  created_at: string
  updated_at: string
}

export interface Credential {
  id: string
  connector_id: string
  type: string
  payload_encrypted: Buffer
  created_at: string
  updated_at: string
}

export interface ConnectionStatus {
  id: string
  connector_id: string
  status: 'connected' | 'disconnected' | 'error'
  last_error?: string
  updated_at: string
}

// Connector operations
export async function createConnector(data: {
  tenant_id: string
  provider: string
  display_name: string
}): Promise<string> {
  const supabase = getServerClient()
  
  const { data: connector, error } = await supabase
    .from('connectors')
    .insert(data)
    .select('id')
    .single()
  
  if (error || !connector) {
    throw new Error(`Failed to create connector: ${error?.message}`)
  }
  
  return connector.id
}

export async function getConnector(connectorId: string): Promise<Connector | null> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', connectorId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get connector: ${error.message}`)
  }
  
  return data
}

export async function listConnectors(tenantId: string): Promise<Connector[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to list connectors: ${error.message}`)
  }
  
  return data || []
}

// Credential operations
export async function storeCredential(connectorId: string, type: string, data: any): Promise<void> {
  const supabase = getServerClient()
  
  const encrypted = encryptJson(data)
  
  const { error } = await supabase
    .from('credentials')
    .insert({
      connector_id: connectorId,
      type,
      payload_encrypted: encrypted.toString('base64')
    })
  
  if (error) {
    throw new Error(`Failed to store credential: ${error.message}`)
  }
}

export async function getCredential(connectorId: string, type: string): Promise<any | null> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('credentials')
    .select('payload_encrypted')
    .eq('connector_id', connectorId)
    .eq('type', type)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get credential: ${error.message}`)
  }
  
  if (!data) return null
  
  try {
    // Try to decrypt first
    return decryptJson(data.payload_encrypted)
  } catch (error) {
    // If decryption fails, try to parse as plain text (base64 encoded JSON)
    try {
      const plainText = Buffer.from(data.payload_encrypted, 'base64').toString('utf8')
      return JSON.parse(plainText)
    } catch (parseError) {
      throw new Error(`Failed to decrypt or parse credential: ${error.message}`)
    }
  }
}

export async function updateCredential(connectorId: string, type: string, data: any): Promise<void> {
  const supabase = getServerClient()
  
  const encrypted = encryptJson(data)
  
  const { error } = await supabase
    .from('credentials')
    .update({ payload_encrypted: encrypted })
    .eq('connector_id', connectorId)
    .eq('type', type)
  
  if (error) {
    throw new Error(`Failed to update credential: ${error.message}`)
  }
}

// Connection status operations
export async function updateConnectionStatus(
  connectorId: string, 
  status: 'connected' | 'disconnected' | 'error',
  lastError?: string
): Promise<void> {
  const supabase = getServerClient()
  
  const { error } = await supabase
    .from('connection_status')
    .upsert({
      connector_id: connectorId,
      status,
      last_error: lastError || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'connector_id' })
  
  if (error) {
    throw new Error(`Failed to update connection status: ${error.message}`)
  }
}

export async function getConnectionStatus(connectorId: string): Promise<ConnectionStatus | null> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connection_status')
    .select('*')
    .eq('connector_id', connectorId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get connection status: ${error.message}`)
  }
  
  return data
}
