/**
 * Server-side database helpers for connector CRUD operations
 * SSR-friendly functions for Next.js App Router
 */

import { createClient } from '@supabase/supabase-js'
import { decryptJson, encryptJson } from '@/lib/security/crypto'
import { revalidatePath } from 'next/cache'

// Server-side client with service role key
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
  name: string
  provider: 'kintone' | 'hubspot'
  auth_method: 'oauth' | 'api_token'
  provider_config: Record<string, any>
  scopes: string[]
  status: 'connected' | 'disconnected' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface ConnectorWithSecrets extends Connector {
  secrets?: {
    client_id: string
    client_secret: string
  }
}

export interface ConnectorLog {
  id: string
  connector_id: string
  level: 'info' | 'warn' | 'error'
  event: string
  detail: any
  created_at: string
}

export interface CreateConnectorInput {
  name: string
  tenantId: string
  provider: 'kintone' | 'hubspot'
  providerConfig: Record<string, any>
  scopes: string[]
  clientId?: string
  clientSecret?: string
}

// List connectors with search and filtering
export async function listConnectors(tenantId: string, q?: string): Promise<Connector[]> {
  const supabase = getServerClient()
  
  let query = supabase
    .from('connectors')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('updated_at', { ascending: false })
  
  // Apply search filter
  if (q && q.trim()) {
    const searchTerm = q.trim()
    query = query.or(`name.ilike.%${searchTerm}%,provider.ilike.%${searchTerm}%,provider_config->>subdomain.ilike.%${searchTerm}%`)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Failed to list connectors:', error)
    throw error
  }
  
  return data || []
}

// Get single connector by ID
export async function getConnector(connectorId: string): Promise<Connector | null> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('id', connectorId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Failed to get connector:', error)
    throw error
  }
  
  return data
}

// Get connector with decrypted secrets (server-only)
export async function getConnectorSecrets(connectorId: string): Promise<ConnectorWithSecrets | null> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connectors')
    .select(`
      *,
      connector_secrets (
        oauth_client_id_enc,
        oauth_client_secret_enc
      )
    `)
    .eq('id', connectorId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Failed to get connector with secrets:', error)
    throw error
  }
  
  if (!data) return null
  
  // Decrypt secrets if available
  let secrets: { client_id: string; client_secret: string } | undefined
  
  if (data.connector_secrets) {
    try {
      const clientIdEnc = data.connector_secrets.oauth_client_id_enc
      const clientSecretEnc = data.connector_secrets.oauth_client_secret_enc
      
      if (clientIdEnc && clientSecretEnc) {
        // Handle both mock and real encryption
        if (clientIdEnc.startsWith('mock_encrypted_')) {
          secrets = {
            client_id: clientIdEnc.replace('mock_encrypted_', ''),
            client_secret: clientSecretEnc.replace('mock_encrypted_', '')
          }
        } else {
          const decryptedClientId = decryptJson(clientIdEnc)
          const decryptedClientSecret = decryptJson(clientSecretEnc)
          
          secrets = {
            client_id: decryptedClientId.value,
            client_secret: decryptedClientSecret.value
          }
        }
      }
    } catch (decryptionError) {
      console.error('Failed to decrypt secrets for connector', connectorId, decryptionError)
      // Don't throw - just return without secrets
    }
  }
  
  return {
    ...data,
    secrets
  }
}

// Create new connector
export async function createConnector(input: CreateConnectorInput): Promise<string> {
  const supabase = getServerClient()
  const { name, tenantId, provider, providerConfig, scopes, clientId, clientSecret } = input
  
  // Check for duplicates
  const { data: existing } = await supabase
    .from('connectors')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('provider', provider)
    .eq('provider_config', JSON.stringify(providerConfig))
    .single()
  
  if (existing) {
    throw new Error('Connector already exists for this configuration')
  }
  
  // Create connector
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
    throw new Error('Failed to create connector')
  }
  
  // Store encrypted credentials if provided
  if (clientId && clientSecret) {
    try {
      let clientIdEnc: string
      let clientSecretEnc: string
      
      // Use mock encryption in development
      if (process.env.MOCK_OAUTH === '1') {
        clientIdEnc = `mock_encrypted_${clientId}`
        clientSecretEnc = `mock_encrypted_${clientSecret}`
      } else {
        clientIdEnc = encryptJson({ value: clientId })
        clientSecretEnc = encryptJson({ value: clientSecret })
      }
      
      const { error: secretsError } = await supabase
        .from('connector_secrets')
        .insert({
          connector_id: connector.id,
          oauth_client_id_enc: clientIdEnc,
          oauth_client_secret_enc: clientSecretEnc
        })
      
      if (secretsError) {
        // Clean up connector if secrets fail
        await supabase.from('connectors').delete().eq('id', connector.id)
        throw secretsError
      }
    } catch (encryptionError) {
      // Clean up connector if encryption fails
      await supabase.from('connectors').delete().eq('id', connector.id)
      throw new Error('Failed to secure credentials')
    }
  }
  
  // Log creation
  await addLog(connector.id, 'info', 'connector_created', {
    provider,
    tenant_id: tenantId,
    name,
    scopes: scopes.length,
    has_credentials: !!(clientId && clientSecret)
  })
  
  // Revalidate connector pages
  revalidatePath('/admin/connectors', 'page')
  revalidatePath(`/admin/connectors/${connector.id}`, 'page')
  
  return connector.id
}

// Update connector status
export async function setConnectorStatus(
  id: string, 
  status: 'connected' | 'disconnected' | 'error', 
  errorMessage?: string
): Promise<void> {
  const supabase = getServerClient()
  
  const { error } = await supabase
    .from('connectors')
    .update({
      status,
      error_message: errorMessage || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  if (error) {
    console.error('Failed to update connector status:', error)
    throw error
  }
  
  // Log status change
  await addLog(id, 'info', status === 'connected' ? 'connected' : 'disconnected', {
    status,
    error_message: errorMessage,
    timestamp: new Date().toISOString()
  })
  
  // Revalidate affected pages
  revalidatePath('/admin/connectors', 'page')
  revalidatePath(`/admin/connectors/${id}`, 'page')
}

// Add log entry
export async function addLog(
  connectorId: string,
  level: 'info' | 'warn' | 'error',
  event: string,
  detail?: any
): Promise<void> {
  const supabase = getServerClient()
  
  const { error } = await supabase
    .from('connector_logs')
    .insert({
      connector_id: connectorId,
      level,
      event,
      detail
    })
  
  if (error) {
    console.error('Failed to add log:', error)
    // Don't throw - logging failure shouldn't break the main flow
  }
}

// Get connector logs
export async function getConnectorLogs(connectorId: string, limit: number = 10): Promise<ConnectorLog[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('connector_logs')
    .select('*')
    .eq('connector_id', connectorId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Failed to get connector logs:', error)
    throw error
  }
  
  return data || []
}

// Delete connector and all related data
export async function deleteConnector(connectorId: string): Promise<void> {
  const supabase = getServerClient()
  
  // Log deletion before removing
  await addLog(connectorId, 'info', 'connector_deleted', {
    timestamp: new Date().toISOString()
  })
  
  // Delete connector (cascades to secrets, credentials, logs)
  const { error } = await supabase
    .from('connectors')
    .delete()
    .eq('id', connectorId)
  
  if (error) {
    console.error('Failed to delete connector:', error)
    throw error
  }
  
  // Revalidate pages
  revalidatePath('/admin/connectors', 'page')
}

// Get connector statistics from /data files (filtered by connectorId)
export async function getConnectorStats(connectorId: string): Promise<{
  connectedApps: number
  activeMappings: number
  fieldMappings: number
  lastSync?: string
}> {
  // Import data files
  const { kintoneApps } = await import('@/data/kintone-apps')
  const { appMappings } = await import('@/data/mappings-apps')
  const { fieldMappings } = await import('@/data/mappings-fields')
  
  // Filter by connectorId (assuming data has connectorId field)
  const connectedApps = kintoneApps.filter(app => app.connectorId === connectorId).length
  const activeMappings = appMappings.filter(mapping => mapping.connectorId === connectorId && mapping.status === 'active').length
  const fieldMappingsCount = fieldMappings.filter(mapping => mapping.connectorId === connectorId).length
  
  // Get last sync from logs
  const logs = await getConnectorLogs(connectorId, 1)
  const lastSyncLog = logs.find(log => log.event === 'sync_completed')
  
  return {
    connectedApps,
    activeMappings,
    fieldMappings: fieldMappingsCount,
    lastSync: lastSyncLog?.created_at
  }
}
