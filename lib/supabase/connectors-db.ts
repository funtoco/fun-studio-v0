/**
 * Supabase client functions for connector system
 * Handles OAuth credentials, connector status, and logs
 */

import { createClient } from '@supabase/supabase-js'
import { encryptJson, decryptJson } from '../security/crypto'

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
export interface Tenant {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Connector {
  id: string
  tenant_id: string
  provider: string
  subdomain?: string
  oauth_client_id?: string
  oauth_client_secret?: string
  scopes: string[]
  status: 'connected' | 'disconnected' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface OAuthCredentials {
  id: string
  connector_id: string
  access_token_enc: string
  refresh_token_enc?: string
  expires_at?: string
  token_type: string
  raw_provider_response: any
  created_at: string
  updated_at: string
}

export interface ConnectorLog {
  id: string
  connector_id: string
  level: 'info' | 'warn' | 'error'
  event: 'authorize_start' | 'authorize_callback' | 'token_saved' | 'token_refreshed' | 'disconnected' | 'error' | 'connection_test'
  detail: any
  created_at: string
}

// Tenant functions
export async function getTenants(): Promise<Tenant[]> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('tenants')
    .select()
    .order('name')
  
  if (error) throw error
  return data || []
}

export async function getTenantById(id: string): Promise<Tenant | null> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('tenants')
    .select()
    .eq('id', id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Connector functions
export async function getConnectors(): Promise<Connector[]> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('connectors')
    .select()
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function getConnectorById(id: string): Promise<Connector | null> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('connectors')
    .select()
    .eq('id', id)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getConnectorByTenantAndProvider(
  tenantId: string, 
  provider: string
): Promise<Connector | null> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('connectors')
    .select()
    .eq('tenant_id', tenantId)
    .eq('provider', provider)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateConnectorStatus(
  connectorId: string,
  status: Connector['status'],
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
    .eq('id', connectorId)
  
  if (error) throw error
}

// OAuth credentials functions
export async function saveOAuthCredentials(
  connectorId: string,
  credentials: {
    access_token: string
    refresh_token?: string
    expires_in?: number
    token_type?: string
    raw: any
  }
): Promise<void> {
  const supabase = getServerClient()
  
  // Encrypt sensitive data
  const accessTokenEnc = encryptJson({ token: credentials.access_token })
  const refreshTokenEnc = credentials.refresh_token 
    ? encryptJson({ token: credentials.refresh_token })
    : null
  
  // Calculate expiry time
  const expiresAt = credentials.expires_in 
    ? new Date(Date.now() + credentials.expires_in * 1000).toISOString()
    : null
  
  // Delete existing credentials for this connector
  await supabase
    .from('oauth_credentials')
    .delete()
    .eq('connector_id', connectorId)
  
  // Insert new credentials
  const { error } = await supabase
    .from('oauth_credentials')
    .insert({
      connector_id: connectorId,
      access_token_enc: accessTokenEnc,
      refresh_token_enc: refreshTokenEnc,
      expires_at: expiresAt,
      token_type: credentials.token_type || 'Bearer',
      raw_provider_response: credentials.raw
    })
  
  if (error) throw error
}

export async function getOAuthCredentials(connectorId: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_at?: Date
  token_type: string
  raw: any
} | null> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('oauth_credentials')
    .select()
    .eq('connector_id', connectorId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null
  
  // Decrypt tokens
  const accessToken = decryptJson(data.access_token_enc).token
  const refreshToken = data.refresh_token_enc 
    ? decryptJson(data.refresh_token_enc).token 
    : undefined
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: data.expires_at ? new Date(data.expires_at) : undefined,
    token_type: data.token_type,
    raw: data.raw_provider_response
  }
}

export async function deleteOAuthCredentials(connectorId: string): Promise<void> {
  const supabase = getServerClient()
  const { error } = await supabase
    .from('oauth_credentials')
    .delete()
    .eq('connector_id', connectorId)
  
  if (error) throw error
}

// Connector logs functions
export async function addConnectorLog(
  connectorId: string,
  level: ConnectorLog['level'],
  event: ConnectorLog['event'],
  detail: any
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
  
  if (error) throw error
}

export async function getConnectorLogs(
  connectorId: string,
  limit: number = 10
): Promise<ConnectorLog[]> {
  const supabase = getServerClient()
  const { data, error } = await supabase
    .from('connector_logs')
    .select()
    .eq('connector_id', connectorId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// Helper function to get connector with credentials
export async function getConnectorWithCredentials(
  tenantId: string, 
  provider: string
): Promise<{
  connector: Connector
  credentials?: {
    access_token: string
    refresh_token?: string
    expires_at?: Date
    token_type: string
  }
} | null> {
  const connector = await getConnectorByTenantAndProvider(tenantId, provider)
  if (!connector) return null
  
  const credentials = await getOAuthCredentials(connector.id)
  
  return {
    connector,
    credentials: credentials ? {
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expires_at: credentials.expires_at,
      token_type: credentials.token_type
    } : undefined
  }
}
