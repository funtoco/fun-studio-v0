import { BaseConnector, ConnectorCapabilities, SyncResult } from './base-connector'
import { KintoneOAuthClient, createKintoneOAuthClient } from './kintone-oauth'

/**
 * Kintone Connector Implementation
 * Handles bi-directional sync between our app and Kintone
 */
export class KintoneConnector extends BaseConnector {
  private oauthClient: KintoneOAuthClient
  private accessToken?: string

  constructor(config: any) {
    super(config)
    
    this.oauthClient = createKintoneOAuthClient({
      subdomain: config.credentials.subdomain,
      clientId: config.credentials.clientId,
      clientSecret: config.credentials.clientSecret,
      redirectUri: config.credentials.redirectUri,
      scopes: config.credentials.scopes || ['k:app_record:read', 'k:app_record:write']
    })
    
    this.accessToken = config.credentials.accessToken
  }

  getCapabilities(): ConnectorCapabilities {
    return {
      canRead: true,
      canWrite: true,
      canSync: true,
      canWebhook: false, // Kintone doesn't support webhooks easily
      supportedEntities: ['people', 'companies', 'visas', 'meetings', 'support_actions']
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.accessToken) return false
      return await this.oauthClient.testConnection(this.accessToken)
    } catch (error) {
      this.log('error', 'Connection test failed', error)
      return false
    }
  }

  async authenticate(): Promise<boolean> {
    // OAuth flow is handled separately via API routes
    // This method just validates existing tokens
    return this.testConnection()
  }

  async refreshAuth(): Promise<boolean> {
    try {
      if (!this.config.credentials.refreshToken) return false
      
      const tokens = await this.oauthClient.refreshToken(this.config.credentials.refreshToken)
      this.accessToken = tokens.access_token
      
      // Update credentials in database
      // TODO: Call updateConnector with new tokens
      
      return true
    } catch (error) {
      this.handleError(error, 'token refresh')
    }
  }

  async getAvailableEntities(): Promise<string[]> {
    try {
      const apps = await this.oauthClient.getApps(this.accessToken!)
      return apps.map(app => app.code || `app_${app.appId}`)
    } catch (error) {
      this.handleError(error, 'get available entities')
    }
  }

  async getEntitySchema(entity: string): Promise<any> {
    try {
      // Map entity to Kintone app ID
      const appId = this.getAppIdForEntity(entity)
      const form = await this.oauthClient.getAppForm(this.accessToken!, appId)
      return this.transformKintoneFormToSchema(form)
    } catch (error) {
      this.handleError(error, `get schema for ${entity}`)
    }
  }

  async getFieldMappings(entity: string): Promise<any> {
    // Return predefined field mappings for each entity
    const mappings = {
      people: {
        name: 'name',
        kana: 'kana', 
        nationality: 'nationality',
        dob: 'birth_date',
        phone: 'phone',
        email: 'email',
        employeeNumber: 'employee_number',
        workingStatus: 'working_status'
      },
      visas: {
        type: 'visa_type',
        status: 'visa_status', 
        expiryDate: 'expiry_date',
        manager: 'manager'
      },
      companies: {
        name: 'company_name',
        industry: 'industry',
        contactPerson: 'contact_person'
      }
    }
    
    return mappings[entity as keyof typeof mappings] || {}
  }

  async syncFromExternal(entity: string, options?: any): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: false,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      errors: [],
      duration: 0
    }

    try {
      this.log('info', `Starting sync from Kintone for ${entity}`)
      
      const appId = this.getAppIdForEntity(entity)
      const records = await this.oauthClient.getRecords(
        this.accessToken!, 
        appId,
        options?.query,
        options?.fields
      )
      
      result.recordsProcessed = records.length
      
      // Transform and sync each record
      for (const record of records) {
        try {
          const transformedRecord = this.transformKintoneRecord(entity, record)
          
          // Check if record exists (based on external ID or unique field)
          const existingRecord = await this.findExistingRecord(entity, transformedRecord)
          
          if (existingRecord) {
            await this.updateLocalRecord(entity, existingRecord.id, transformedRecord)
            result.recordsUpdated++
          } else {
            await this.createLocalRecord(entity, transformedRecord)
            result.recordsCreated++
          }
          
        } catch (recordError) {
          result.recordsFailed++
          result.errors.push(`Record ${record.$id?.value}: ${recordError}`)
          this.log('warn', `Failed to sync record ${record.$id?.value}`, recordError)
        }
      }
      
      result.success = result.recordsFailed === 0
      this.log('info', `Sync completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated, ${result.recordsFailed} failed`)
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.log('error', `Sync from external failed for ${entity}`, error)
    }
    
    result.duration = Date.now() - startTime
    return result
  }

  async syncToExternal(entity: string, data: any[], options?: any): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      success: false,
      recordsProcessed: data.length,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      errors: [],
      duration: 0
    }

    try {
      this.log('info', `Starting sync to Kintone for ${entity}`)
      
      const appId = this.getAppIdForEntity(entity)
      const fieldMappings = await this.getFieldMappings(entity)
      
      for (const record of data) {
        try {
          // Transform our record format to Kintone format
          const kintoneRecord = this.transformToKintoneRecord(record, fieldMappings)
          
          // Check if record exists in Kintone (by external_id or unique field)
          const existingKintoneRecord = await this.findKintoneRecord(appId, record)
          
          if (existingKintoneRecord) {
            // Update existing record
            await this.updateKintoneRecord(appId, existingKintoneRecord.id, kintoneRecord)
            result.recordsUpdated++
          } else {
            // Create new record
            await this.createKintoneRecord(appId, kintoneRecord)
            result.recordsCreated++
          }
          
        } catch (recordError) {
          result.recordsFailed++
          result.errors.push(`Record ${record.id}: ${recordError}`)
          this.log('warn', `Failed to sync record ${record.id} to Kintone`, recordError)
        }
      }
      
      result.success = result.recordsFailed === 0
      this.log('info', `Sync to Kintone completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated, ${result.recordsFailed} failed`)
      
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.log('error', `Sync to external failed for ${entity}`, error)
    }
    
    result.duration = Date.now() - startTime
    return result
  }

  async getExternalData(entity: string, filters?: any): Promise<any[]> {
    try {
      const appId = this.getAppIdForEntity(entity)
      const query = filters ? this.buildKintoneQuery(filters) : undefined
      
      return await this.oauthClient.getRecords(this.accessToken!, appId, query)
    } catch (error) {
      this.handleError(error, `get external data for ${entity}`)
    }
  }

  async pushToExternal(entity: string, records: any[]): Promise<SyncResult> {
    return this.syncToExternal(entity, records)
  }

  // Private helper methods
  private getAppIdForEntity(entity: string): string {
    // Map our entities to Kintone app IDs
    // This could be configurable per tenant
    const appMapping = {
      people: 'PEOPLE_APP',
      visas: 'VISA_APP', 
      companies: 'COMPANY_APP',
      meetings: 'MEETING_APP',
      support_actions: 'SUPPORT_APP'
    }
    
    const appId = appMapping[entity as keyof typeof appMapping]
    if (!appId) {
      throw new Error(`No Kintone app mapping found for entity: ${entity}`)
    }
    
    return appId
  }

  private transformKintoneRecord(entity: string, kintoneRecord: any): any {
    // Transform Kintone record format to our internal format
    const fieldMappings = this.getFieldMappings(entity)
    const transformed: any = {}
    
    for (const [ourField, kintoneField] of Object.entries(fieldMappings)) {
      if (kintoneRecord[kintoneField]) {
        transformed[ourField] = kintoneRecord[kintoneField].value
      }
    }
    
    // Add Kintone metadata
    transformed.external_id = kintoneRecord.$id?.value
    transformed.external_source = 'kintone'
    transformed.last_synced_at = new Date().toISOString()
    
    return transformed
  }

  private transformToKintoneRecord(record: any, fieldMappings: any): any {
    const kintoneRecord: any = {}
    
    for (const [ourField, kintoneField] of Object.entries(fieldMappings)) {
      if (record[ourField] !== undefined) {
        kintoneRecord[kintoneField] = { value: record[ourField] }
      }
    }
    
    return kintoneRecord
  }

  private transformKintoneFormToSchema(form: any): any {
    // Transform Kintone form structure to our schema format
    const schema = {
      fields: [],
      properties: {}
    }
    
    for (const field of form.properties || []) {
      schema.fields.push({
        code: field.code,
        label: field.label,
        type: field.type,
        required: field.required
      })
      
      schema.properties[field.code] = {
        type: this.mapKintoneFieldType(field.type),
        title: field.label,
        required: field.required
      }
    }
    
    return schema
  }

  private mapKintoneFieldType(kintoneType: string): string {
    const typeMapping = {
      'SINGLE_LINE_TEXT': 'string',
      'MULTI_LINE_TEXT': 'string', 
      'NUMBER': 'number',
      'DATE': 'string',
      'DATETIME': 'string',
      'DROP_DOWN': 'string',
      'CHECK_BOX': 'array',
      'USER_SELECT': 'string'
    }
    
    return typeMapping[kintoneType as keyof typeof typeMapping] || 'string'
  }

  private buildKintoneQuery(filters: any): string {
    // Build Kintone query string from filters
    const conditions: string[] = []
    
    for (const [field, value] of Object.entries(filters)) {
      if (value) {
        conditions.push(`${field} = "${value}"`)
      }
    }
    
    return conditions.join(' and ')
  }

  // These methods would interact with our Supabase database
  private async findExistingRecord(entity: string, record: any): Promise<any> {
    // TODO: Implement Supabase query to find existing record
    return null
  }

  private async createLocalRecord(entity: string, record: any): Promise<any> {
    // TODO: Implement Supabase insert
    return null
  }

  private async updateLocalRecord(entity: string, id: string, record: any): Promise<any> {
    // TODO: Implement Supabase update
    return null
  }

  private async findKintoneRecord(appId: string, record: any): Promise<any> {
    // TODO: Query Kintone to find existing record
    return null
  }

  private async createKintoneRecord(appId: string, record: any): Promise<any> {
    // TODO: Create record in Kintone
    return null
  }

  private async updateKintoneRecord(appId: string, recordId: string, record: any): Promise<any> {
    // TODO: Update record in Kintone
    return null
  }
}
