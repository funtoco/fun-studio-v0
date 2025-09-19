/**
 * Client-side Supabase functions for connector system
 * Uses anon key for read-only operations
 */

import { createClient } from '@supabase/supabase-js'

// Client-side client with anon key
function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, anonKey)
}

// Types (matching server-side)
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
  scopes: string[]
  status: 'connected' | 'disconnected' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
  // Computed fields
  name?: string
}

export interface ConnectorLog {
  id: string
  connector_id: string
  level: 'info' | 'warn' | 'error'
  event: 'authorize_start' | 'authorize_callback' | 'token_saved' | 'token_refreshed' | 'disconnected' | 'error' | 'connection_test'
  detail: any
  created_at: string
}

// Client functions
export async function getTenants(): Promise<Tenant[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data || []
}

export async function getConnectors(): Promise<Connector[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Add computed name field
  return (data || []).map(connector => ({
    ...connector,
    name: getConnectorDisplayName(connector)
  }))
}

export async function getConnectorsByTenant(tenantId: string): Promise<Connector[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return (data || []).map(connector => ({
    ...connector,
    name: getConnectorDisplayName(connector)
  }))
}

export async function getConnectorLogs(
  connectorId: string, 
  limit: number = 10
): Promise<ConnectorLog[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('connector_logs')
    .select('*')
    .eq('connector_id', connectorId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) throw error
  return data || []
}

// Helper functions
function getConnectorDisplayName(connector: Connector): string {
  const providerName = connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)
  if (connector.subdomain) {
    return `${providerName} (${connector.subdomain})`
  }
  return `${providerName} Connector`
}

export function getProviderDisplayName(provider: string): string {
  switch (provider) {
    case 'kintone':
      return 'Kintone'
    case 'hubspot':
      return 'HubSpot'
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1)
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'connected':
      return 'success'
    case 'disconnected':
      return 'secondary'
    case 'error':
      return 'destructive'
    default:
      return 'secondary'
  }
}

// OAuth helper functions
export async function connectProvider(provider: string, tenantId: string): Promise<void> {
  const url = `/api/connect/${provider}/start?tenantId=${tenantId}`
  window.location.href = url
}

export async function disconnectProvider(provider: string, tenantId: string): Promise<void> {
  const response = await fetch(`/api/connect/${provider}/disconnect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tenantId })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Disconnect failed')
  }
  
  // Refresh the page to show updated status
  window.location.reload()
}
