/**
 * Connector types for client-side usage
 * This file only contains types, no server-side dependencies
 */

export interface Connector {
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
  auth_method?: string
}

export interface ConnectorLog {
  id: string
  connector_id: string
  level: 'info' | 'warn' | 'error'
  event: string
  detail: any
  created_at: string
}

export interface ConnectorStats {
  total: number
  connected: number
  disconnected: number
  error: number
}
