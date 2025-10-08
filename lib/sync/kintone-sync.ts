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
import { getUpdateKeysByConnector, buildConflictColumns, buildUpdateCondition } from './update-key-utils'
import { uploadFileToStorage, generateFilePath } from '@/lib/storage/file-uploader'
import { getDataMappings, mapFieldValues, type DataMapping } from '@/lib/mappings/value-mapper'
// import { getKintoneMapping, type KintoneMapping } from './mapping-loader'

// Types for field mappings
interface FieldMapping {
  source_field_code: string
  source_field_type?: string
  target_field_id: string
  is_required: boolean
  sort_order: number
}

interface AppMapping {
  id: string
  source_app_id: string
  target_app_type: string
  skip_if_no_update_target: boolean
  field_mappings: FieldMapping[]
}

/**
 * Process FILE type field - download from Kintone and upload to Supabase Storage
 */
async function processFileField(
  kintoneClient: KintoneApiClient,
  record: KintoneRecord,
  fieldMapping: FieldMapping,
  tenantId: string
): Promise<string | null> {
  try {
    const sourceValue = record[fieldMapping.source_field_code]?.value
    
    if (!sourceValue || !Array.isArray(sourceValue) || sourceValue.length === 0) {
      console.log(`  📁 No file data found for field ${fieldMapping.source_field_code}`)
      return null
    }

    // Get the first file (Kintone FILE fields can have multiple files)
    const fileInfo = sourceValue[0]
    if (!fileInfo || !fileInfo.fileKey) {
      console.log(`  📁 No file key found for field ${fieldMapping.source_field_code}`)
      return null
    }

    console.log(`  📁 Processing file for field ${fieldMapping.source_field_code}:`, {
      fileKey: fileInfo.fileKey,
      name: fileInfo.name,
      contentType: fileInfo.contentType
    })

    // Download file from Kintone
    const fileData = await kintoneClient.downloadFile(fileInfo.fileKey)
    
    // Generate unique file path
    const filePath = generateFilePath(
      tenantId,
      record.$id.value,
      fieldMapping.source_field_code,
      fileData.fileName
    )

    // Upload to Supabase Storage
    const uploadResult = await uploadFileToStorage(
      'people-images', // Use the configured bucket
      filePath,
      fileData.data,
      fileData.contentType,
      { upsert: true }
    )

    if (!uploadResult.success) {
      console.error(`  ❌ Failed to upload file for field ${fieldMapping.source_field_code}:`, uploadResult.error)
      return null
    }

    console.log(`  ✅ File uploaded successfully: ${uploadResult.path}`)
    return uploadResult.path || null

  } catch (error) {
    console.error(`  ❌ Error processing file field ${fieldMapping.source_field_code}:`, error)
    return null
  }
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
    .select('source_field_code, source_field_type, target_field_id, is_required, sort_order')
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
 * Get app mapping configurations from database
 */
async function getAppMappings(
  supabase: any,
  connectorId: string,
  targetAppType: string
): Promise<AppMapping[]> {
  const { data, error } = await supabase
    .from('connector_app_mappings')
    .select('id, source_app_id, target_app_type, skip_if_no_update_target')
    .eq('connector_id', connectorId)
    .eq('target_app_type', targetAppType)
    .eq('is_active', true)

  if (error || !data) {
    console.error('Error fetching app mappings:', error)
    return []
  }

  // Process each mapping and get field mappings
  const mappings: AppMapping[] = []
  for (const mapping of data) {
    const fieldMappings = await getFieldMappings(supabase, mapping.id)
    const appMapping = {
      id: mapping.id,
      source_app_id: mapping.source_app_id,
      target_app_type: mapping.target_app_type,
      skip_if_no_update_target: mapping.skip_if_no_update_target || false,
      field_mappings: fieldMappings
    }
    
    console.log(`📋 Loaded app mapping:`, {
      id: appMapping.id,
      source_app_id: appMapping.source_app_id,
      target_app_type: appMapping.target_app_type,
      skip_if_no_update_target: appMapping.skip_if_no_update_target
    })
    
    mappings.push(appMapping)
  }
  
  return mappings
}

/**
 * Get specific app mapping by ID
 */
async function getAppMappingById(
  supabase: any,
  appMappingId: string
): Promise<AppMapping | null> {
  const { data, error } = await supabase
    .from('connector_app_mappings')
    .select('id, source_app_id, target_app_type, connector_id, skip_if_no_update_target')
    .eq('id', appMappingId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('Error fetching app mapping by ID:', error)
    return null
  }

  const fieldMappings = await getFieldMappings(supabase, data.id)
  
  return {
    id: data.id,
    source_app_id: data.source_app_id,
    target_app_type: data.target_app_type,
    skip_if_no_update_target: data.skip_if_no_update_target || false,
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
  private async buildFilterQuery(appType: 'people' | 'visas', appMappingId?: string): Promise<string> {
    try {
      let mappingId: string

      if (appMappingId) {
        // Use specific mapping ID if provided
        mappingId = appMappingId
        console.log(`🔍 Using specific mapping ID: ${mappingId}`)
      } else {
        // Get active mappings for this connector
        const { data: mappings, error: mappingsError } = await this.supabase
          .from('connector_app_mappings')
          .select('id, target_app_type, source_app_id')
          .eq('connector_id', this.connectorId)
          .eq('is_active', true)

        if (mappingsError || !mappings || mappings.length === 0) {
          console.log('🔍 No active mappings found, using empty query')
          return ''
        }

        // Find mapping for the target app type
        const mapping = mappings.find(m => m.target_app_type === appType)
        if (!mapping) {
          console.log(`🔍 No mapping found for ${appType}, using empty query`)
          return ''
        }

        mappingId = mapping.id
      }

      // Get filter conditions for this mapping
      const { data: filters, error: filtersError } = await this.supabase
        .from('connector_app_filters')
        .select('field_code, filter_value')
        .eq('app_mapping_id', mappingId)
        .eq('is_active', true)

      if (filtersError) {
        console.error('Error fetching filters:', filtersError)
        return ''
      }

      if (!filters || filters.length === 0) {
        console.log(`🔍 No filter conditions found for mapping ${mappingId}, using empty query`)
        return ''
      }

      // Build query conditions (simple approach without validation)
      const conditions = filters
        .filter(f => f.field_code && f.filter_value)
        .map(f => `${f.field_code} = "${f.filter_value}"`)
        .join(' AND ')

      console.log(`🔍 Built filter query: ${conditions || 'No valid filters'}`)
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
          const syncedCount = await this.syncAppData(appMapping.target_app_type, appMapping.source_app_id, appMapping.id)
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
  private async syncAppData(targetAppType: string, sourceAppId: string, appMappingId?: string): Promise<number> {
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
      let appMappings: AppMapping[]
      
      // If specific app mapping ID is provided, get only that mapping
      if (appMappingId) {
        const appMapping = await getAppMappingById(this.supabase, appMappingId)
        if (!appMapping) {
          console.error(`❌ No active mapping found with ID: ${appMappingId}`)
          return 0
        }
        appMappings = [appMapping]
        console.log(`📋 Found specific mapping ${appMappingId} for ${targetAppType}`)
      } else {
        // Get all mappings for the target app type
        appMappings = await getAppMappings(this.supabase, this.connectorId, targetAppType)
        if (!appMappings || appMappings.length === 0) {
          console.error(`❌ No active ${targetAppType} mappings found`)
          return 0
        }
        console.log(`📋 Found ${appMappings.length} mapping(s) for ${targetAppType}`)
      }
      
      let totalSyncedCount = 0
      
      // Process each mapping
      for (const appMapping of appMappings) {
        console.log(`🔄 Processing mapping ${appMapping.id} for app ${appMapping.source_app_id}:`, {
          sourceAppId: appMapping.source_app_id,
          fieldMappingsCount: appMapping.field_mappings.length,
          fieldMappings: appMapping.field_mappings.map(fm => ({
            source: fm.source_field_code,
            target: fm.target_field_id,
            required: fm.is_required
          }))
        })
        
        // Build query using only database filter conditions
        const filterQuery = await this.buildFilterQuery(targetAppType as 'people' | 'visas', appMappingId)
        const query = filterQuery || ''
        
        console.log(`🔍 Query for ${targetAppType} (app ${appMapping.source_app_id}):`, query || 'No filters')
        
        // Get records from Kintone
        const records = await this.kintoneClient.getRecords(appMapping.source_app_id, query, [])
        console.log(`📊 Retrieved ${records.length} records from Kintone for ${targetAppType} (app ${appMapping.source_app_id})`)
      
        let syncedCount = 0
      
        const updateKeys = await getUpdateKeysByConnector(this.connectorId, targetAppType, appMapping.id)
        console.log(`🔍 Update keys for ${targetAppType}:`, updateKeys.map(fm => ({
          source: fm.source_field_code,
          target: fm.target_field_id,
          required: fm.is_required
        })))
        for (const record of records) {
          console.log(`🔄 Processing record ${record.$id.value} for ${targetAppType}`)
        
          try {
            // Transform Kintone record to our format using database field mappings
            // Determine target table based on app type
            const targetTable = this.getTargetTable(targetAppType)
            if (!targetTable) {
              throw new Error(`Unknown target app type: ${targetAppType}`)
            }

            // Get dynamic update keys for this connector and target app type
            const updateKeys = await getUpdateKeysByConnector(this.connectorId, targetAppType, appMapping.id)
            
            // Check if record exists using update keys
            const whereCondition = buildUpdateCondition(record, updateKeys)
            console.log(`🔍 Search condition for existing record:`, whereCondition)
            
            const { data: existingRecord, error: selectError } = await this.supabase
              .from(targetTable)
              .select('id')
              .match(whereCondition)
              .single()

            console.log(`🔍 Existing record search result:`, { existingRecord, selectError })

            if (selectError && selectError.code !== 'PGRST116') {
              // PGRST116 means no rows found, which is expected for new records
              console.error(`❌ Error checking existing record:`, selectError)
              throw selectError
            }

            // Check if we should skip this record
            if (!existingRecord && appMapping.skip_if_no_update_target) {
              // Skip this record if no update target found
              console.log(`⏭️ Skipping record ${record.$id.value} - no update target found and skip_if_no_update_target is enabled`)
              console.log(`⏭️ App mapping skip setting:`, appMapping.skip_if_no_update_target)
              console.log(`⏭️ Existing record check result:`, existingRecord)
              
              // Log skipped item sync (for manual syncs only)
              if (this.syncType === 'manual') {
                await this.syncLogger.logItem(targetAppType as 'people' | 'visas', record.$id.value, 'failed', 'Skipped: No update target found')
              }
              
              continue // Skip to next record
            }

            // Only process data if we're going to insert or update
            const data: any = {
              tenant_id: this.tenantId, // Set tenant_id from connector
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }

            // Map fields using database configuration
            for (const fieldMapping of appMapping.field_mappings) {
              if (fieldMapping.source_field_type === 'FILE') {
                // Special handling for FILE type fields
                console.log(`  📁 Processing FILE field: ${fieldMapping.source_field_code}`)
                const filePath = await processFileField(this.kintoneClient, record, fieldMapping, this.tenantId)
                data[fieldMapping.target_field_id] = filePath
                console.log(`  📝 Mapping FILE ${fieldMapping.source_field_code} -> ${fieldMapping.target_field_id}: ${filePath || 'null'}`)
              } else {
                // Regular field mapping
                const sourceValue = record[fieldMapping.source_field_code]?.value
                data[fieldMapping.target_field_id] = sourceValue || null
                console.log(`  📝 Mapping ${fieldMapping.source_field_code} -> ${fieldMapping.target_field_id}: ${sourceValue}`)
              }
            }

            // Apply value mappings if configured
            try {
              const dataMappings = await getDataMappings(appMapping.id)
              if (dataMappings.length > 0) {
                console.log(`  🔄 Applying value mappings for ${dataMappings.length} fields`)
                const mappedData = mapFieldValues(data, dataMappings)
                
                // Update data with mapped values
                for (const [key, value] of Object.entries(mappedData)) {
                  if (data[key] !== value) {
                    console.log(`  🔄 Value mapping applied: ${key} "${data[key]}" -> "${value}"`)
                    data[key] = value
                  }
                }
              }
            } catch (valueMappingError) {
              console.warn(`  ⚠️ Value mapping failed (continuing with original values):`, valueMappingError)
            }

            console.log(`🔍 Data object keys:`, Object.keys(data))
            console.log(`🔍 Data object values:`, data)

            let error: any = null

            if (existingRecord) {
              // Record exists, update it
              console.log(`🔄 Updating existing record in ${targetTable}`, whereCondition)
              const { error: updateError } = await this.supabase
                .from(targetTable)
                .update(data)
                .match(whereCondition)
              error = updateError
            } else {
              // Insert new record
              console.log(`➕ Inserting new record to ${targetTable}`)
              console.log(`➕ Insert data:`, data)
              const { error: insertError } = await this.supabase
                .from(targetTable)
                .insert(data)
              error = insertError
            }

            if (error) {
              console.error(`❌ Database error for ${targetAppType} ${record.$id.value}:`, error)
              throw error
            }

            console.log(`✅ Successfully synced ${targetAppType} ${record.$id.value}`)


            syncedCount++
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            console.error(`❌ Failed to sync ${targetAppType} ${record.$id.value}:`, err)
            
            
            // Continue with other records
          }
        }
        
        console.log(`✅ Completed sync for ${targetAppType} (app ${appMapping.source_app_id}): ${syncedCount} records synced`)
        totalSyncedCount += syncedCount
      }

      console.log(`✅ Completed sync for ${targetAppType}: ${totalSyncedCount} total records synced across ${appMappings.length} mapping(s)`)
      return totalSyncedCount
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
