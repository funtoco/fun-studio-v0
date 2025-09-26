/**
 * Kintone API client for data synchronization
 * Handles authentication and data fetching from Kintone
 */

export interface KintoneApp {
  appId: string
  code: string
  name: string
  description: string
  spaceId?: string
  threadId?: string
  createdAt: string
  modifiedAt: string
}

export interface KintoneField {
  code: string
  label: string
  type: string
  required: boolean
  options?: any
}

export interface KintoneRecord {
  $id: { value: string }
  $revision: { value: string }
  [fieldCode: string]: any
}

export interface KintoneApiConfig {
  subdomain: string
  accessToken: string
}

export class KintoneApiClient {
  private subdomain: string
  private accessToken: string
  private baseUrl: string

  constructor(config: KintoneApiConfig) {
    this.subdomain = config.subdomain
    this.accessToken = config.accessToken
    this.baseUrl = `https://${this.subdomain}.cybozu.com`
  }

  /**
   * Make authenticated request to Kintone API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kintone API error: ${response.status} ${errorText}`)
    }

    return response.json()
  }

  /**
   * Get all apps accessible to the current user
   */
  async getApps(): Promise<KintoneApp[]> {
    const response = await this.request<{ apps: any[] }>('/k/v1/apps.json')
    
    return response.apps.map(app => ({
      appId: app.appId,
      code: app.code,
      name: app.name,
      description: app.description || '',
      spaceId: app.spaceId,
      threadId: app.threadId,
      createdAt: app.createdAt,
      modifiedAt: app.modifiedAt
    }))
  }

  /**
   * Get app details including form fields
   */
  async getAppFields(appId: string): Promise<KintoneField[]> {
    const response = await this.request<{ properties: Record<string, any> }>(
      `/k/v1/app/form/fields.json?app=${appId}`
    )
    
    return Object.entries(response.properties).map(([code, field]) => ({
      code,
      label: field.label || code,
      type: field.type,
      required: field.required || false,
      options: field.options || null
    }))
  }

  /**
   * Get records from an app with pagination support
   */
  async getRecords(appId: string, query?: string, fields?: string[]): Promise<KintoneRecord[]> {
    const limit = 500
    let offset = 0
    let allRecords: KintoneRecord[] = []

    while (true) {
      let endpoint = `/k/v1/records.json?app=${appId}&query=order by $id asc limit ${limit} offset ${offset}`
      
      // Override query if provided
      if (query) {
        endpoint = `/k/v1/records.json?app=${appId}&query=${encodeURIComponent(query + ' order by $id asc')} limit ${limit} offset ${offset}`
      }
      
      if (fields && fields.length > 0) {
        const fieldsParam = fields.map(field => `fields[]=${encodeURIComponent(field)}`).join('&')
        endpoint += `&${fieldsParam}`
      }
      
      const response = await this.request<{ records: KintoneRecord[] }>(endpoint)
      const records = response.records
      
      allRecords = allRecords.concat(records)
      
      // If we got fewer records than the limit, we've reached the end
      if (records.length < limit) {
        break
      }
      
      offset += limit
    }

    return allRecords
  }

  /**
   * Create records in an app
   */
  async createRecords(appId: string, records: Record<string, any>[]): Promise<{ ids: string[]; revisions: string[] }> {
    const response = await this.request<{ ids: string[]; revisions: string[] }>(
      '/k/v1/records.json',
      {
        method: 'POST',
        body: JSON.stringify({
          app: appId,
          records: records.map(record => ({ fields: record }))
        })
      }
    )
    
    return response
  }

  /**
   * Update records in an app
   */
  async updateRecords(appId: string, records: { id: string; record: Record<string, any>; revision?: string }[]): Promise<{ records: { id: string; revision: string }[] }> {
    const response = await this.request<{ records: { id: string; revision: string }[] }>(
      '/k/v1/records.json',
      {
        method: 'PUT',
        body: JSON.stringify({
          app: appId,
          records: records.map(({ id, record, revision }) => ({
            id,
            fields: record,
            revision
          }))
        })
      }
    )
    
    return response
  }

  /**
   * Test connection to Kintone
   */
  async testConnection(): Promise<{ success: boolean; userInfo?: any; error?: string }> {
    try {
      // Try to get apps as a connection test (uses k:app_settings:read scope)
      const appsResponse = await this.request<{ apps: any[] }>('/k/v1/apps.json')
      return {
        success: true,
        userInfo: {
          appsCount: appsResponse.apps.length,
          accessibleApps: appsResponse.apps.map(app => ({
            id: app.appId,
            name: app.name,
            code: app.code
          }))
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get app schema for mapping purposes
   */
  async getAppSchema(appId: string): Promise<{
    app: KintoneApp
    fields: KintoneField[]
    recordCount: number
  }> {
    const [apps, fields, records] = await Promise.all([
      this.getApps(),
      this.getAppFields(appId),
      this.getRecords(appId, 'limit 1') // Just get count
    ])

    const app = apps.find(a => a.appId === appId)
    if (!app) {
      throw new Error(`App ${appId} not found`)
    }

    // Get total record count
    const countResponse = await this.request<{ totalCount: string }>(
      `/k/v1/records.json?app=${appId}&totalCount=true&query=limit 0`
    )

    return {
      app,
      fields,
      recordCount: parseInt(countResponse.totalCount)
    }
  }
}

/**
 * Create Kintone API client from connector credentials
 */
export async function createKintoneClient(connectorId: string): Promise<KintoneApiClient> {
  // This would typically get credentials from database
  // For now, we'll need to implement the credential retrieval
  throw new Error('Kintone client creation not yet implemented - need credential retrieval')
}

/**
 * Test Kintone connection with given credentials
 */
export async function testKintoneConnection(
  subdomain: string, 
  accessToken: string
): Promise<{ success: boolean; userInfo?: any; error?: string }> {
  const client = new KintoneApiClient({ subdomain, accessToken })
  return client.testConnection()
}
