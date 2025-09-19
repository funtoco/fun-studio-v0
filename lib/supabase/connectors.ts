import { supabase } from './client'
import { KintoneOAuthClient, KintoneTokenResponse } from '../connectors/kintone-oauth'

export interface Tenant {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface ConnectorType {
  id: string
  name: string
  display_name: string
  description?: string
  logo_url?: string
  is_active: boolean
}

export interface Connector {
  id: string
  tenant_id: string
  connector_type_id: string
  name: string
  subdomain?: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  
  // OAuth info (sensitive data should be encrypted)
  oauth_client_id?: string
  oauth_access_token?: string
  oauth_refresh_token?: string
  oauth_token_expires_at?: string
  oauth_scopes?: string[]
  
  last_sync_at?: string
  last_error?: string
  sync_frequency_minutes: number
  settings: Record<string, any>
  
  created_at: string
  updated_at: string
  
  // Joined data
  tenant?: Tenant
  connector_type?: ConnectorType
}

export interface KintoneApp {
  id: string
  connector_id: string
  kintone_app_id: string
  app_code: string
  app_name: string
  description?: string
  is_sync_enabled: boolean
  last_synced_at?: string
  record_count: number
  field_mappings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SyncLog {
  id: string
  connector_id: string
  kintone_app_id?: string
  sync_type: 'full' | 'incremental' | 'manual'
  status: 'running' | 'completed' | 'failed' | 'cancelled'
  records_processed: number
  records_created: number
  records_updated: number
  records_failed: number
  error_message?: string
  error_details?: Record<string, any>
  started_at: string
  completed_at?: string
  duration_seconds?: number
}

/**
 * Set current tenant context for RLS
 */
export async function setTenantContext(tenantSlug: string) {
  const { error } = await supabase.rpc('set_config', {
    setting_name: 'app.current_tenant_id',
    setting_value: tenantSlug,
    is_local: true
  })
  
  if (error) {
    console.error('Failed to set tenant context:', error)
    throw error
  }
}

/**
 * Get all tenants
 */
export async function getTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }

  return data || []
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching tenant:', error)
    throw error
  }

  return data
}

/**
 * Get connector types
 */
export async function getConnectorTypes(): Promise<ConnectorType[]> {
  const { data, error } = await supabase
    .from('connector_types')
    .select('*')
    .eq('is_active', true)
    .order('display_name')

  if (error) {
    console.error('Error fetching connector types:', error)
    throw error
  }

  return data || []
}

/**
 * Get connectors for current tenant
 */
export async function getConnectors(tenantSlug: string): Promise<Connector[]> {
  await setTenantContext(tenantSlug)
  
  const { data, error } = await supabase
    .from('connectors')
    .select(`
      *,
      tenant:tenants(*),
      connector_type:connector_types(*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching connectors:', error)
    throw error
  }

  return data || []
}

/**
 * Get connector by ID
 */
export async function getConnectorById(id: string, tenantSlug: string): Promise<Connector | null> {
  await setTenantContext(tenantSlug)
  
  const { data, error } = await supabase
    .from('connectors')
    .select(`
      *,
      tenant:tenants(*),
      connector_type:connector_types(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching connector:', error)
    throw error
  }

  return data
}

/**
 * Create new connector
 */
export async function createConnector(
  tenantSlug: string,
  connectorData: Partial<Connector>
): Promise<Connector> {
  await setTenantContext(tenantSlug)
  
  // Get tenant ID
  const tenant = await getTenantBySlug(tenantSlug)
  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantSlug}`)
  }

  const { data, error } = await supabase
    .from('connectors')
    .insert({
      ...connectorData,
      tenant_id: tenant.id,
      updated_at: new Date().toISOString()
    })
    .select(`
      *,
      tenant:tenants(*),
      connector_type:connector_types(*)
    `)
    .single()

  if (error) {
    console.error('Error creating connector:', error)
    throw error
  }

  return data
}

/**
 * Update connector
 */
export async function updateConnector(
  id: string,
  tenantSlug: string,
  updates: Partial<Connector>
): Promise<Connector> {
  await setTenantContext(tenantSlug)
  
  const { data, error } = await supabase
    .from('connectors')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select(`
      *,
      tenant:tenants(*),
      connector_type:connector_types(*)
    `)
    .single()

  if (error) {
    console.error('Error updating connector:', error)
    throw error
  }

  return data
}

/**
 * Delete connector
 */
export async function deleteConnector(id: string, tenantSlug: string): Promise<void> {
  await setTenantContext(tenantSlug)
  
  const { error } = await supabase
    .from('connectors')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting connector:', error)
    throw error
  }
}

/**
 * Store OAuth tokens for connector (encrypted)
 */
export async function storeOAuthTokens(
  connectorId: string,
  tenantSlug: string,
  tokens: KintoneTokenResponse
): Promise<void> {
  await setTenantContext(tenantSlug)
  
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString()
  
  const { error } = await supabase
    .from('connectors')
    .update({
      oauth_access_token: tokens.access_token, // TODO: encrypt
      oauth_refresh_token: tokens.refresh_token, // TODO: encrypt  
      oauth_token_expires_at: expiresAt,
      oauth_scopes: tokens.scope.split(' '),
      status: 'connected',
      updated_at: new Date().toISOString()
    })
    .eq('id', connectorId)

  if (error) {
    console.error('Error storing OAuth tokens:', error)
    throw error
  }
}

/**
 * Get Kintone apps for connector
 */
export async function getKintoneApps(connectorId: string, tenantSlug: string): Promise<KintoneApp[]> {
  await setTenantContext(tenantSlug)
  
  const { data, error } = await supabase
    .from('kintone_apps')
    .select('*')
    .eq('connector_id', connectorId)
    .order('app_name')

  if (error) {
    console.error('Error fetching Kintone apps:', error)
    throw error
  }

  return data || []
}

/**
 * Sync Kintone apps for connector
 */
export async function syncKintoneApps(
  connectorId: string,
  tenantSlug: string,
  oauthClient: KintoneOAuthClient,
  accessToken: string
): Promise<void> {
  await setTenantContext(tenantSlug)
  
  try {
    // Get apps from Kintone
    const kintoneApps = await oauthClient.getApps(accessToken)
    
    // Upsert apps to database
    for (const app of kintoneApps) {
      const { error } = await supabase
        .from('kintone_apps')
        .upsert({
          connector_id: connectorId,
          kintone_app_id: app.appId,
          app_code: app.code || `APP_${app.appId}`,
          app_name: app.name,
          description: app.description,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'connector_id,kintone_app_id'
        })

      if (error) {
        console.error(`Error upserting app ${app.appId}:`, error)
      }
    }
    
    // Update connector last sync time
    await updateConnector(connectorId, tenantSlug, {
      last_sync_at: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error syncing Kintone apps:', error)
    throw error
  }
}

/**
 * Get sync logs for connector
 */
export async function getSyncLogs(
  connectorId: string,
  tenantSlug: string,
  limit: number = 50
): Promise<SyncLog[]> {
  await setTenantContext(tenantSlug)
  
  const { data, error } = await supabase
    .from('sync_logs')
    .select('*')
    .eq('connector_id', connectorId)
    .order('started_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching sync logs:', error)
    throw error
  }

  return data || []
}
