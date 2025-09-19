/**
 * Kintone to Supabase data synchronization service
 * Syncs people and visa data from Kintone apps to our database
 */

import { createClient } from '@supabase/supabase-js'
import { KintoneApiClient, type KintoneRecord } from '@/lib/kintone/api-client'
import { getConnectorSecrets, addLog } from '@/lib/db/connectors'
import { decryptJson } from '@/lib/security/crypto'

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
    kintoneApp: 'PEOPLE', // Kintone app code
    fields: {
      'name': '氏名',
      'kana': 'フリガナ',
      'nationality': '国籍',
      'dob': '生年月日',
      'phone': '電話番号',
      'email': 'メールアドレス',
      'address': '住所',
      'employee_number': '従業員番号',
      'working_status': '就労ステータス',
      'specific_skill_field': '特定技能分野',
      'residence_card_no': '在留カード番号',
      'residence_card_expiry_date': '在留カード有効期限',
      'residence_card_issued_date': '在留カード交付日'
    }
  },
  visas: {
    kintoneApp: 'VISAS', // Kintone app code
    fields: {
      'person_id': '人材ID',
      'type': 'ビザ種類',
      'status': 'ステータス',
      'expiry_date': '有効期限',
      'submitted_at': '申請日',
      'result_at': '結果日',
      'manager': '担当者'
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
}

export class KintoneDataSync {
  private connectorId: string
  private kintoneClient: KintoneApiClient
  private supabase: ReturnType<typeof getServerClient>

  constructor(connectorId: string, kintoneClient: KintoneApiClient) {
    this.connectorId = connectorId
    this.kintoneClient = kintoneClient
    this.supabase = getServerClient()
  }

  /**
   * Sync all data from Kintone to Supabase
   */
  async syncAll(): Promise<SyncResult> {
    const startTime = Date.now()
    let syncedPeople = 0
    let syncedVisas = 0
    const errors: string[] = []

    try {
      await addLog(this.connectorId, 'info', 'sync_started', {
        timestamp: new Date().toISOString()
      })

      // Sync people data
      try {
        syncedPeople = await this.syncPeople()
        await addLog(this.connectorId, 'info', 'people_synced', {
          count: syncedPeople
        })
      } catch (err) {
        const error = `People sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(error)
        await addLog(this.connectorId, 'error', 'people_sync_failed', { error })
      }

      // Sync visa data
      try {
        syncedVisas = await this.syncVisas()
        await addLog(this.connectorId, 'info', 'visas_synced', {
          count: syncedVisas
        })
      } catch (err) {
        const error = `Visa sync failed: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(error)
        await addLog(this.connectorId, 'error', 'visa_sync_failed', { error })
      }

      const duration = Date.now() - startTime
      const success = errors.length === 0

      await addLog(this.connectorId, success ? 'info' : 'warn', 'sync_completed', {
        success,
        synced: { people: syncedPeople, visas: syncedVisas },
        errors: errors.length,
        duration
      })

      return {
        success,
        synced: { people: syncedPeople, visas: syncedVisas },
        errors,
        duration
      }

    } catch (err) {
      const duration = Date.now() - startTime
      const error = err instanceof Error ? err.message : 'Unknown sync error'
      
      await addLog(this.connectorId, 'error', 'sync_failed', {
        error,
        duration
      })

      return {
        success: false,
        synced: { people: syncedPeople, visas: syncedVisas },
        errors: [error],
        duration
      }
    }
  }

  /**
   * Sync people data from Kintone
   */
  private async syncPeople(): Promise<number> {
    const mapping = FIELD_MAPPINGS.people
    
    // Get records from Kintone
    const records = await this.kintoneClient.getRecords(mapping.kintoneApp)
    
    let syncedCount = 0
    
    for (const record of records) {
      try {
        // Transform Kintone record to our format
        const person = {
          id: `k_${record.$id.value}`, // Prefix with 'k_' for Kintone origin
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

        syncedCount++
      } catch (err) {
        console.error(`Failed to sync person ${record.$id.value}:`, err)
        // Continue with other records
      }
    }

    return syncedCount
  }

  /**
   * Sync visa data from Kintone
   */
  private async syncVisas(): Promise<number> {
    const mapping = FIELD_MAPPINGS.visas
    
    // Get records from Kintone
    const records = await this.kintoneClient.getRecords(mapping.kintoneApp)
    
    let syncedCount = 0
    
    for (const record of records) {
      try {
        // Transform Kintone record to our format
        const visa = {
          id: `k_${record.$id.value}`, // Prefix with 'k_' for Kintone origin
          person_id: record[mapping.fields.person_id]?.value || null,
          type: record[mapping.fields.type]?.value || '認定申請',
          status: record[mapping.fields.status]?.value || '書類準備中',
          expiry_date: record[mapping.fields.expiry_date]?.value || null,
          submitted_at: record[mapping.fields.submitted_at]?.value || null,
          result_at: record[mapping.fields.result_at]?.value || null,
          manager: record[mapping.fields.manager]?.value || null,
          updated_at: new Date().toISOString()
        }

        // Upsert to Supabase
        const { error } = await this.supabase
          .from('visas')
          .upsert(visa, { onConflict: 'id' })

        if (error) {
          throw error
        }

        syncedCount++
      } catch (err) {
        console.error(`Failed to sync visa ${record.$id.value}:`, err)
        // Continue with other records
      }
    }

    return syncedCount
  }
}

/**
 * Create sync service for a connector
 */
export async function createSyncService(connectorId: string): Promise<KintoneDataSync> {
  // Get connector with decrypted credentials
  const connectorWithSecrets = await getConnectorSecrets(connectorId)
  
  if (!connectorWithSecrets || !connectorWithSecrets.secrets) {
    throw new Error('Connector credentials not found')
  }
  
  if (connectorWithSecrets.provider !== 'kintone') {
    throw new Error('Only Kintone connectors support data sync')
  }
  
  const subdomain = connectorWithSecrets.provider_config.subdomain
  if (!subdomain) {
    throw new Error('Kintone subdomain not configured')
  }
  
  // Get OAuth credentials
  const supabase = getServerClient()
  const { data: credentials } = await supabase
    .from('oauth_credentials')
    .select('access_token_enc')
    .eq('connector_id', connectorId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (!credentials) {
    throw new Error('OAuth credentials not found')
  }
  
  // Decrypt access token
  let accessToken: string
  
  if (credentials.access_token_enc.startsWith('mock_encrypted_')) {
    accessToken = 'mock_access_token_for_testing'
  } else {
    const decryptedToken = decryptJson(credentials.access_token_enc)
    accessToken = decryptedToken.token
  }
  
  // Create Kintone client
  const kintoneClient = new KintoneApiClient({
    subdomain,
    accessToken
  })
  
  return new KintoneDataSync(connectorId, kintoneClient)
}
