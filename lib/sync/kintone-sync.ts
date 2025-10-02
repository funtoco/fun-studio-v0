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
// import { getKintoneMapping, type KintoneMapping } from './mapping-loader'

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

// Mapping configuration for Kintone fields to our database
const FIELD_MAPPINGS = {
  people: {
    kintoneAppId: '13', // Kintone app ID
    coid: '2787', // COID for filtering
    fields: {
      'name': 'name',
      'kana': '文字列__1行_',
      'nationality': 'country',
      'dob': 'dateOfBirth',
      'phone': 'phoneNumber', // 仮のマッピング
      // 'email': 'メールアドレス',
      'address': 'address',
      // 'employee_number': 'HRID',
      'working_status': 'salesStatus',
      'specific_skill_field': 'field',
      'residence_card_no': 'latestResidenceCardNo',
      'residence_card_expiry_date': 'latestResidenceCardExpirationDate',
      'residence_card_issued_date': 'latestResidenceCardPermitDate'
    }
  },
  visas: {
    kintoneAppId: '50', // Kintone app ID
    coid: '2787', // COID for filtering
    fields: {
      'person_id': 'WOID',
      'type': 'requestType',
      'status': 'ステータス',
      'expiry_date': 'latestResidenceCardExpirationDate',
      'submitted_at': '入社日___支援開始日',
      'result_at': '更新ビザ許可になった日',
      'manager': 'operationStaffCompany'
    }
  }
}

export interface SyncResult {
  success: boolean
  synced: {
    people: number
    visas: number
  }
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
   * Sync all data from Kintone to Supabase
   */
  async syncAll(): Promise<SyncResult> {
    if (process.env.ALLOW_LEGACY_IMPORTS === 'false' || process.env.IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE === 'true') {
      // Check active mapping exists for this connector
      const { data: activeMappings } = await this.supabase
        .from('app_mappings')
        .select('id')
        .eq('connector_id', this.connectorId)
        .eq('status', 'active')

      if (!activeMappings || activeMappings.length === 0) {
        console.log('[GUARD] reject write: no active mapping')
        return { success: false, synced: { people: 0, visas: 0 }, errors: ['no active mapping'], duration: 0 }
      }
    }
    const startTime = Date.now()
    let syncedPeople = 0
    let syncedVisas = 0
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

      // Temporarily disable logging for testing
      // await addLog(this.connectorId, 'info', 'sync_started', {
      //   timestamp: new Date().toISOString(),
      //   sessionId
      // })

      // Sync people data
      try {
        syncedPeople = await this.syncPeople()
        // await addLog(this.connectorId, 'info', 'people_synced', {
        //   count: syncedPeople,
        //   sessionId
        // })
      } catch (err) {
        const error = `People sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(error)
        // await addLog(this.connectorId, 'error', 'people_sync_failed', { error, sessionId })
      }

        // Sync visa data
        try {
          syncedVisas = await this.syncVisas()
        // await addLog(this.connectorId, 'info', 'visas_synced', {
        //   count: syncedVisas,
        //   sessionId
        // })
      } catch (err) {
        const error = `Visa sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(error)
        // await addLog(this.connectorId, 'error', 'visa_sync_failed', { error, sessionId })
      }

      const duration = Date.now() - startTime
      const success = errors.length === 0
      const totalCount = syncedPeople + syncedVisas

      // Complete sync session
      await this.syncLogger.completeSession(
        success ? 'success' : 'failed',
        totalCount,
        syncedPeople + syncedVisas,
        0, // failedCount - individual failures are logged separately
        success ? undefined : errors.join('; ')
      )

      // await addLog(this.connectorId, success ? 'info' : 'warn', 'sync_completed', {
      //   success,
      //   synced: { people: syncedPeople, visas: syncedVisas },
      //   errors: errors.length,
      //   duration,
      //   sessionId
      // })

      return {
        success,
        synced: { people: syncedPeople, visas: syncedVisas },
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
      
      // await addLog(this.connectorId, 'error', 'sync_failed', {
      //   error,
      //   duration,
      //   sessionId
      // })

      return {
        success: false,
        synced: { people: syncedPeople, visas: syncedVisas },
        errors: [error],
        duration,
        sessionId
      }
    }
  }

  /**
   * Sync people data from Kintone
   */
  private async syncPeople(): Promise<number> {
    if (process.env.ALLOW_LEGACY_IMPORTS === 'false' || process.env.IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE === 'true') {
      const { data: active } = await this.supabase
        .from('app_mappings')
        .select('id')
        .eq('connector_id', this.connectorId)
        .eq('status', 'active')
      if (!active || active.length === 0) {
        console.log('[GUARD] reject write: no active mapping')
        return 0
      }
    }
    try {
      // Use hardcoded configuration
      const mapping = FIELD_MAPPINGS.people
      
      // Build query
      let query = ''
      if (mapping.coid) {
        query = `COID = "${mapping.coid}"`
      }
      
      // Get filter conditions from database
      const filterQuery = await this.buildFilterQuery('people')
      if (filterQuery) {
        query = query ? `${query} AND ${filterQuery}` : filterQuery
      }
      
      // Get records from Kintone
      const records = await this.kintoneClient.getRecords(mapping.kintoneAppId, query, [])
    
    let syncedCount = 0
    
    for (const record of records) {
      const itemId = `k_${record.$id.value}`
      
      try {
        // Transform Kintone record to our format using hardcoded field mappings
        const person = {
          id: itemId, // Prefix with 'k_' for Kintone origin
          name: record[mapping.fields.name]?.value || '',
          kana: record[mapping.fields.kana]?.value || null,
          nationality: record[mapping.fields.nationality]?.value || null,
          dob: record[mapping.fields.dob]?.value || null,
          phone: record[mapping.fields.phone]?.value || null,
          email: record[mapping.fields.email]?.value || null,
          address: record[mapping.fields.address]?.value || null,
          employee_number: record[mapping.fields.employee_number]?.value || null,
          working_status: record[mapping.fields.working_status]?.value || null,
          specific_skill_field: record[mapping.fields.specific_skill_field]?.value || null,
          residence_card_no: record[mapping.fields.residence_card_no]?.value || null,
          residence_card_expiry_date: record[mapping.fields.residence_card_expiry_date]?.value || null,
          residence_card_issued_date: record[mapping.fields.residence_card_issued_date]?.value || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Upsert to Supabase
        const { error } = await this.supabase
          .from('people')
          .upsert(person, { onConflict: 'id' })

        if (error) {
          throw error
        }

        // Log successful item sync (for manual syncs only)
        if (this.syncType === 'manual') {
          await this.syncLogger.logItem('people', itemId, 'success')
        }

        syncedCount++
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Failed to sync person ${record.$id.value}:`, err)
        
        // Log failed item sync (for manual syncs only)
        if (this.syncType === 'manual') {
          await this.syncLogger.logItem('people', itemId, 'failed', errorMessage)
        }
        
        // Continue with other records
      }
    }

    return syncedCount
    } catch (error) {
      throw error
    }
  }

  /**
   * Sync visa data from Kintone
   */
  private async syncVisas(): Promise<number> {
    if (process.env.ALLOW_LEGACY_IMPORTS === 'false' || process.env.IMPORTS_DISABLED_UNTIL_MAPPING_ACTIVE === 'true') {
      const { data: active } = await this.supabase
        .from('app_mappings')
        .select('id')
        .eq('connector_id', this.connectorId)
        .eq('status', 'active')
      if (!active || active.length === 0) {
        console.log('[GUARD] reject write: no active mapping')
        return 0
      }
    }
    try {
      // Use hardcoded configuration
      const mapping = FIELD_MAPPINGS.visas
      
      // Build query
      let query = ''
      if (mapping.coid) {
        query = `COID = "${mapping.coid}"`
      }
      
      // Get filter conditions from database
      const filterQuery = await this.buildFilterQuery('visas')
      if (filterQuery) {
        query = query ? `${query} AND ${filterQuery}` : filterQuery
      }
      
      // Get records from Kintone
      const records = await this.kintoneClient.getRecords(mapping.kintoneAppId, query, [])
    
    let syncedCount = 0
    
    for (const record of records) {
      const itemId = `k_${record.$id.value}`
      
      try {
        // Transform Kintone record to our format using hardcoded field mappings
        const personIdValue = record[mapping.fields.person_id]?.value
        const personId = personIdValue ? `k_${personIdValue}` : null
        
        // Map status field to valid database values using the provided mapping
        const fullStatus = record[mapping.fields.status]?.value || '書類準備中'
        let mappedStatus = '書類準備中' // default
        
        // Status mapping from Kintone to database
        const statusMapping = {
          書類準備中: [
            '営業_企業情報待ち', //過去のステータス
            '新規_企業情報待ち', 
            '既存_企業情報待ち', 
            '支援_更新案内・人材情報更新待ち'
          ],
          書類作成中: ['OP_企業書類作成中'],
          書類確認中: [
            '営業_企業に確認してください', //過去のステータス
            '新規_企業に確認してください',
            '既存_企業に確認してください',
            'OP_企業に確認してください', //過去のステータス
            '新規_企業_書類確認待ち',
            '既存_企業_書類確認待ち',
            '企業_書類確認待ち（新規）',
            '企業_書類確認待ち（更新）',
            'OP_書類修正中',
          ],
          申請準備中: [
            'OP_押印書類送付準備中',
            'OP_押印書類受取待ち',
            'OP_申請人サイン書類準備中',
            '支援_申請人サイン待ち',
            'OP_申請人サイン書類受取待ち',
          ],
          ビザ申請準備中: ['ビザ申請準備中','ビザ申請待ち'],
          申請中: ['申請中'],
          '(追加書類)': ['追加修正対応中'],
          ビザ取得済み: ['許可'],
        }
        
        // Find matching status
        for (const [dbStatus, kintoneStatuses] of Object.entries(statusMapping)) {
          if (kintoneStatuses.includes(fullStatus)) {
            mappedStatus = dbStatus
            break
          }
        }
        
        
        // Handle manager field (USER_SELECT type)
        const managerValue = record[mapping.fields.manager]?.value
        const managerName = Array.isArray(managerValue) && managerValue.length > 0 
          ? managerValue[0].name 
          : null
        
        const visa = {
          id: itemId, // Prefix with 'k_' for Kintone origin
          person_id: personId,
          type: record[mapping.fields.type]?.value || '認定申請',
          status: mappedStatus,
          expiry_date: record[mapping.fields.expiry_date]?.value || null,
          submitted_at: record[mapping.fields.submitted_at]?.value || null,
          result_at: record[mapping.fields.result_at]?.value || null,
          manager: managerName,
          updated_at: new Date().toISOString()
        }

        // Upsert to Supabase
        const { error } = await this.supabase
          .from('visas')
          .upsert(visa, { onConflict: 'id' })

        if (error) {
          throw error
        }

        // Log successful item sync (for manual syncs only)
        if (this.syncType === 'manual') {
          await this.syncLogger.logItem('visa', itemId, 'success')
        }

        syncedCount++
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Failed to sync visa ${record.$id.value}:`, err)
        
        // Log failed item sync (for manual syncs only)
        if (this.syncType === 'manual') {
          await this.syncLogger.logItem('visa', itemId, 'failed', errorMessage)
        }
        
        // Continue with other records
      }
    }

    return syncedCount
    } catch (error) {
      console.error('Error in syncVisas:', error)
      throw error
    }
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

  // Get subdomain from connector config (hardcoded for now)
  const subdomain = 'funtoco'
  
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
    subdomain,
    accessToken
  })
  
  return new KintoneDataSync(connectorId, kintoneClient, tenantId, syncType, runBy)
}
