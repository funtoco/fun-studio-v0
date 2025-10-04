/**
 * Kintone to Supabase data synchronization service
 * Syncs people and visa data from Kintone apps to our database
 */

import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient, type KintoneRecord } from '@/lib/kintone/api-client'
import { getConnector, addLog } from '@/lib/db/connectors'
import { getCredential } from '@/lib/db/connectors'
import { decryptJson } from '@/lib/security/crypto'
// import { loadKintoneClientConfig } from '@/lib/db/credential-loader'
import { SyncLogger, createSyncLogger } from './sync-logger'
import { getUpdateKeysByConnector, buildConflictColumns } from './update-key-utils'
// import { getKintoneMapping, type KintoneMapping } from './mapping-loader'

// Types for field mappings
interface FieldMapping {
  source_field_code: string
  target_field_id: string
  is_required: boolean
  sort_order: number
}

interface AppMapping {
  id: string
  source_app_id: string
  target_app_type: string
  field_mappings: FieldMapping[]
}

/**
 * Get field mappings from database for a specific app mapping
 */
async function getFieldMappings(
  supabase: any,
  appMappingId: string
): Promise<FieldMapping[]> {
  const { data, error } = await supabase
    .from('connector_field_mappings')
    .select('source_field_code, target_field_id, is_required, sort_order')
    .eq('app_mapping_id', appMappingId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching field mappings:', error)
    return []
  }

  return data || []
}

/**
 * Get app mapping configuration from database
 */
async function getAppMapping(
  supabase: any,
  connectorId: string,
  targetAppType: string
): Promise<AppMapping | null> {
  const { data, error } = await supabase
    .from('connector_app_mappings')
    .select('id, source_app_id, target_app_type')
    .eq('connector_id', connectorId)
    .eq('target_app_type', targetAppType)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('Error fetching app mapping:', error)
    return null
  }

  const fieldMappings = await getFieldMappings(supabase, data.id)
  
  return {
    id: data.id,
    source_app_id: data.source_app_id,
    target_app_type: data.target_app_type,
    field_mappings: fieldMappings
  }
}

/**
 * Refresh Kintone access token using refresh token
 * Based on https://cybozu.dev/ja/common/docs/oauth-client/add-client/
 */
async function refreshKintoneToken(
  subdomain: string, 
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<{
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}> {
  // Create Basic Auth header with client credentials
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  
  const response = await fetch(`https://${subdomain}.cybozu.com/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to refresh token: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type,
  }
}

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// Field mappings are now loaded from database dynamically

export interface SyncResult {
  success: boolean
  synced: Record<string, number> // app_type -> count
  errors: string[]
  duration: number
  sessionId?: string
}

export class KintoneDataSync {
  private connectorId: string
  private kintoneClient: KintoneApiClient
  private supabase: ReturnType<typeof getServerClient>
  private syncLogger: SyncLogger
  private tenantId: string
  private syncType: 'manual' | 'scheduled'
  private runBy?: string

  constructor(
    connectorId: string, 
    kintoneClient: KintoneApiClient,
    tenantId: string,
    syncType: 'manual' | 'scheduled' = 'manual',
    runBy?: string
  ) {
    this.connectorId = connectorId
    this.kintoneClient = kintoneClient
    this.supabase = getServerClient()
    this.syncLogger = createSyncLogger()
    this.tenantId = tenantId
    this.syncType = syncType
    this.runBy = runBy
  }

  /**
   * Build Kintone query from filter conditions
   */
  private async buildFilterQuery(appType: 'people' | 'visas'): Promise<string> {
    try {
      // Get active mappings for this connector
      const { data: mappings, error: mappingsError } = await this.supabase
        .from('connector_app_mappings')
        .select('id, target_app_type')
        .eq('connector_id', this.connectorId)
        .eq('is_active', true)

      if (mappingsError || !mappings || mappings.length === 0) {
        return ''
      }

      // Find mapping for the target app type
      const mapping = mappings.find(m => m.target_app_type === appType)
      if (!mapping) {
        return ''
      }

      // Get filter conditions for this mapping
      const { data: filters, error: filtersError } = await this.supabase
        .from('connector_app_filters')
        .select('field_code, filter_value')
        .eq('app_mapping_id', mapping.id)
        .eq('is_active', true)

      if (filtersError || !filters || filters.length === 0) {
        return ''
      }

      // Build query conditions
      const conditions = filters
        .filter(f => f.field_code && f.filter_value)
        .map(f => `${f.field_code} = "${f.filter_value}"`)
        .join(' AND ')

      return conditions
    } catch (error) {
      console.error('Error building filter query:', error)
      return ''
    }
  }

  /**
   * Sync all data from Kintone to Supabase based on connector_app_mappings
   * @param appMappingId Optional specific app mapping ID to sync. If not provided, syncs all active mappings.
   */
  async syncAll(appMappingId?: string): Promise<SyncResult> {
    if (process.env.ALLOW_LEGACY_IMPORTS === 'false' || process.env.IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE === 'true') {
      // Check active mapping exists for this connector
      const { data: activeMappings } = await this.supabase
        .from('connector_app_mappings')
        .select('id')
        .eq('connector_id', this.connectorId)
        .eq('is_active', true)

      if (!activeMappings || activeMappings.length === 0) {
        console.log('[GUARD] reject write: no active mapping')
        return { success: false, synced: {}, errors: ['no active mapping'], duration: 0 }
      }
    }

    const startTime = Date.now()
    const synced: Record<string, number> = {}
    const errors: string[] = []
    let sessionId: string | undefined

    try {
      // Start sync session
      sessionId = await this.syncLogger.startSession(
        this.tenantId,
        this.connectorId,
        this.syncType,
        this.runBy
      )

      // Get app mappings for this connector
      let query = this.supabase
        .from('connector_app_mappings')
        .select('id, target_app_type, source_app_id')
        .eq('connector_id', this.connectorId)
        .eq('is_active', true)

      // If specific app mapping ID is provided, filter by it
      if (appMappingId) {
        query = query.eq('id', appMappingId)
      }

      const { data: appMappings, error: mappingsError } = await query

      if (mappingsError || !appMappings || appMappings.length === 0) {
        const error = appMappingId 
          ? `No active app mapping found with ID: ${appMappingId}`
          : 'No active app mappings found'
        errors.push(error)
        return { success: false, synced: {}, errors, duration: Date.now() - startTime, sessionId }
      }

      // Sync each app mapping
      for (const appMapping of appMappings) {
        try {
          const syncedCount = await this.syncAppData(appMapping.target_app_type, appMapping.source_app_id)
          synced[appMapping.target_app_type] = syncedCount
        } catch (err) {
          const error = `${appMapping.target_app_type} sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`
          errors.push(error)
          synced[appMapping.target_app_type] = 0
        }
      }

      const duration = Date.now() - startTime
      const success = errors.length === 0
      const totalCount = Object.values(synced).reduce((sum, count) => sum + count, 0)

      // Complete sync session
      await this.syncLogger.completeSession(
        success ? 'success' : 'failed',
        totalCount,
        totalCount,
        0, // failedCount - individual failures are logged separately
        success ? undefined : errors.join('; ')
      )

      return {
        success,
        synced,
        errors,
        duration,
        sessionId
      }

    } catch (err) {
      const duration = Date.now() - startTime
      const error = err instanceof Error ? err.message : 'Unknown sync error'
      
      // Complete session with error if session was started
      if (sessionId) {
        try {
          await this.syncLogger.completeSession('failed', 0, 0, 0, error)
        } catch (logError) {
          console.error('Failed to complete sync session:', logError)
        }
      }

      return {
        success: false,
        synced,
        errors: [error],
        duration,
        sessionId
      }
    }
  }

  /**
   * Sync app data from Kintone based on app mapping configuration
   */
  private async syncAppData(targetAppType: string, sourceAppId: string): Promise<number> {
    console.log(`🔄 Starting sync for ${targetAppType} from app ${sourceAppId}`)
    
    if (process.env.ALLOW_LEGACY_IMPORTS === 'false' || process.env.IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE === 'true') {
      const { data: active } = await this.supabase
        .from('connector_app_mappings')
        .select('id')
        .eq('connector_id', this.connectorId)
        .eq('is_active', true)
      if (!active || active.length === 0) {
        console.log('[GUARD] reject write: no active mapping')
        return 0
      }
    }

    try {
      // Get mapping configuration from database
      const appMapping = await getAppMapping(this.supabase, this.connectorId, targetAppType)
      if (!appMapping) {
        console.error(`❌ No active ${targetAppType} mapping found`)
        return 0
      }
      
      console.log(`📋 Found mapping for ${targetAppType}:`, {
        sourceAppId: appMapping.source_app_id,
        fieldMappingsCount: appMapping.field_mappings.length,
        fieldMappings: appMapping.field_mappings.map(fm => ({
          source: fm.source_field_code,
          target: fm.target_field_id,
          required: fm.is_required
        }))
      })
      
      // Build query using only database filter conditions
      const filterQuery = await this.buildFilterQuery(targetAppType as 'people' | 'visas')
      const query = filterQuery || ''
      
      console.log(`🔍 Query for ${targetAppType}:`, query || 'No filters')
      
      // Get records from Kintone
      const records = await this.kintoneClient.getRecords(sourceAppId, query, [])
      console.log(`📊 Retrieved ${records.length} records from Kintone for ${targetAppType}`)
    
      let syncedCount = 0
      
      for (const record of records) {
        const itemId = `k_${record.$id.value}`
        console.log(`🔄 Processing record ${record.$id.value} for ${targetAppType}`)
        
        try {
          // Transform Kintone record to our format using database field mappings
          const data: any = {
            id: itemId, // Prefix with 'k_' for Kintone origin
            tenant_id: this.tenantId, // Set tenant_id from connector
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          // Map fields using database configuration
          for (const fieldMapping of appMapping.field_mappings) {
            const sourceValue = record[fieldMapping.source_field_code]?.value
            data[fieldMapping.target_field_id] = sourceValue || null
            console.log(`  📝 Mapping ${fieldMapping.source_field_code} -> ${fieldMapping.target_field_id}: ${sourceValue}`)
          }

          // Determine target table based on app type
          const targetTable = this.getTargetTable(targetAppType)
          if (!targetTable) {
            throw new Error(`Unknown target app type: ${targetAppType}`)
          }

          // Get dynamic update keys for this connector and target app type
          const updateKeys = await getUpdateKeysByConnector(this.connectorId, targetAppType)
          const conflictColumns = buildConflictColumns(updateKeys)
          
          console.log(`💾 Upserting to ${targetTable} with update keys: ${conflictColumns}`, data)

          // Upsert to Supabase with dynamic update keys
          const { error } = await this.supabase
            .from(targetTable)
            .upsert(data, { onConflict: conflictColumns })

          if (error) {
            console.error(`❌ Database error for ${targetAppType} ${record.$id.value}:`, error)
            throw error
          }

          console.log(`✅ Successfully synced ${targetAppType} ${record.$id.value}`)

          // Log successful item sync (for manual syncs only)
          if (this.syncType === 'manual') {
            await this.syncLogger.logItem(targetAppType as 'people' | 'visas', itemId, 'success')
          }

          syncedCount++
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error'
          console.error(`❌ Failed to sync ${targetAppType} ${record.$id.value}:`, err)
          
          // Log failed item sync (for manual syncs only)
          if (this.syncType === 'manual') {
            await this.syncLogger.logItem(targetAppType as 'people' | 'visas', itemId, 'failed', errorMessage)
          }
          
          // Continue with other records
        }
      }

      console.log(`✅ Completed sync for ${targetAppType}: ${syncedCount} records synced`)
      return syncedCount
    } catch (error) {
      console.error(`❌ Error in syncAppData for ${targetAppType}:`, error)
      throw error
    }
  }

  /**
   * Get target table name for app type
   */
  private getTargetTable(targetAppType: string): string | null {
    const tableMap: Record<string, string> = {
      'people': 'people',
      'visas': 'visas',
      'meetings': 'meetings'
    }
    return tableMap[targetAppType] || null
  }




}

/**
 * Create sync service for a connector
 */
export async function createSyncService(
  connectorId: string,
  tenantId: string,
  syncType: 'manual' | 'scheduled' = 'manual',
  runBy?: string
): Promise<KintoneDataSync> {
  try {
    // Get connector
    const connector = await getConnector(connectorId)
    
    if (!connector) {
      throw new Error('Connector not found')
    }
    
    if (connector.provider !== 'kintone') {
      throw new Error('Only Kintone connectors support data sync')
    }
  } catch (error) {
    console.error('❌ Error in createSyncService:', error)
    throw error
  }
  
  let credentials = await getCredential(connectorId, 'kintone_token')
  if (!credentials) {
    throw new Error('OAuth credentials not found in credentials table')
  }

  // Get subdomain from connector config
  const configCredential = await getCredential(connectorId, 'kintone_config')
  if (!configCredential || !configCredential.domain) {
    throw new Error('Kintone domain not found in connector config')
  }
  
  // Extract subdomain from domain URL (e.g., "https://funtoco.cybozu.com" -> "funtoco")
  const domainUrl = configCredential.domain
  const domainMatch = domainUrl.match(/https?:\/\/([^.]+)\.cybozu\.com/)
  if (!domainMatch) {
    throw new Error(`Invalid Kintone domain format: ${domainUrl}`)
  }
  const subdomain = domainMatch[1]
  
  // Check if access token is expired and refresh if needed
  // Clean access token by removing full-width spaces and other invalid characters
  let accessToken = credentials.access_token.replace(/[\u3000\u00A0]/g, ' ').trim()
  const refreshToken = credentials.refresh_token?.replace(/[\u3000\u00A0]/g, ' ').trim()
  if (refreshToken) {
    try {
      // Get client credentials from credentials table
      const clientCredentials = await getCredential(connectorId, 'kintone_config')
      
      if (!clientCredentials) {
        throw new Error('OAuth client credentials not found')
      }

      const refreshedCredentials = await refreshKintoneToken(
        subdomain, 
        refreshToken,
        clientCredentials.clientId,
        clientCredentials.clientSecret
      )
      
      accessToken = refreshedCredentials.access_token
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      // Continue with existing token if refresh fails
    }
  }
  
  // Create Kintone client
  const kintoneClient = new KintoneApiClient({
    domain: `https://${subdomain}.cybozu.com`,
    accessToken
  })
  
  return new KintoneDataSync(connectorId, kintoneClient, tenantId, syncType, runBy)
}
