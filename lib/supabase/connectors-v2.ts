/**
 * Supabase client functions for new connector model (v2)
 * Uses the updated schema with provider_config and connector_secrets
 */

import { createClient } from '@supabase/supabase-js'
// import { getManifest } from '@/lib/connectors/manifests'
import { type ProviderId } from '@/lib/connectors/types'

// Client-side client with anon key
function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, anonKey)
}

// Types for new model
export interface ConnectorV2 {
  id: string
  tenant_id: string
  provider: string
  provider_config: Record<string, any>
  scopes: string[]
  status: 'connected' | 'disconnected' | 'error'
  error_message?: string
  created_at: string
  updated_at: string
  // Computed fields
  name?: string
  displayConfig?: string
}

export interface ConnectorLogV2 {
  id: string
  connector_id: string
  level: 'info' | 'warn' | 'error'
  event: 'connector_created' | 'authorize_start' | 'authorize_callback' | 'token_saved' | 'token_refreshed' | 'disconnected' | 'error' | 'connection_test'
  detail: any
  created_at: string
}

// Client functions for new model
export async function getConnectorsV2(): Promise<ConnectorV2[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  // Add computed fields
  return (data || []).map(connector => ({
    ...connector,
    name: getConnectorDisplayName(connector),
    displayConfig: getDisplayConfig(connector)
  }))
}

export async function getConnectorsByTenantV2(tenantId: string): Promise<ConnectorV2[]> {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('connectors')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  
  return (data || []).map(connector => ({
    ...connector,
    name: getConnectorDisplayName(connector),
    displayConfig: getDisplayConfig(connector)
  }))
}

export async function getConnectorLogsV2(
  connectorId: string, 
  limit: number = 10
): Promise<ConnectorLogV2[]> {
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
function getConnectorDisplayName(connector: ConnectorV2): string {
  try {
    // const manifest = getManifest(connector.provider as ProviderId)
    const config = connector.provider_config
    const providerName = connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)
    
    if (connector.provider === 'kintone' && config.subdomain) {
      return `${providerName} (${config.subdomain})`
    }
    
    if (connector.provider === 'hubspot' && config.portalId) {
      return `${providerName} (${config.portalId})`
    }
    
    return `${providerName} Connector`
  } catch {
    return `${connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} Connector`
  }
}

function getDisplayConfig(connector: ConnectorV2): string {
  try {
    const config = connector.provider_config
    const keys = Object.keys(config).filter(key => config[key])
    
    if (keys.length === 0) return '-'
    
    return keys.map(key => {
      const value = config[key]
      if (key === 'subdomain') {
        return `${value}.cybozu.com`
      }
      return `${key}: ${value}`
    }).join(', ')
  } catch {
    return '-'
  }
}

export function getProviderDisplayName(provider: string): string {
  // try {
  //   const manifest = getManifest(provider as ProviderId)
  //   return manifest.title
  // } catch {
    return provider.charAt(0).toUpperCase() + provider.slice(1)
  // }
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

// OAuth helper functions for new model
export async function connectProviderV2(provider: string, tenantId: string, connectorId: string): Promise<void> {
  const url = `/api/connect/${provider}/start-v2?tenantId=${tenantId}&connectorId=${connectorId}`
  window.location.href = url
}

export async function disconnectProviderV2(provider: string, tenantId: string, connectorId: string): Promise<void> {
  const response = await fetch(`/api/connect/${provider}/disconnect-v2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ tenantId, connectorId })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Disconnect failed')
  }
  
  // Refresh the page to show updated status
  window.location.reload()
}
