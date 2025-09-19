/**
 * Kintone OAuth Integration
 * Based on: https://cybozu.dev/ja/common/docs/oauth-client/add-client/
 */

export interface KintoneOAuthConfig {
  subdomain: string // e.g., 'funtoco' for funtoco.cybozu.com
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

export interface KintoneTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export interface KintoneUserInfo {
  id: string
  code: string
  name: string
  email: string
  url: string
  employee_number: string
  phone: string
  mobile_phone: string
  extension_number: string
  timezone: string
  is_guest: boolean
}

export class KintoneOAuthClient {
  private config: KintoneOAuthConfig

  constructor(config: KintoneOAuthConfig) {
    this.config = config
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      response_type: 'code',
      ...(state && { state }),
    })

    return `https://${this.config.subdomain}.cybozu.com/oauth2/authorization?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<KintoneTokenResponse> {
    const response = await fetch(`https://${this.config.subdomain}.cybozu.com/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token exchange failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<KintoneTokenResponse> {
    const response = await fetch(`https://${this.config.subdomain}.cybozu.com/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Token refresh failed: ${error}`)
    }

    return response.json()
  }

  /**
   * Get user information using access token
   */
  async getUserInfo(accessToken: string): Promise<KintoneUserInfo> {
    const response = await fetch(`https://${this.config.subdomain}.cybozu.com/v1/user.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get user info: ${error}`)
    }

    return response.json()
  }

  /**
   * Get list of Kintone apps
   */
  async getApps(accessToken: string): Promise<any[]> {
    const response = await fetch(`https://${this.config.subdomain}.cybozu.com/k/v1/apps.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get apps: ${error}`)
    }

    const data = await response.json()
    return data.apps || []
  }

  /**
   * Get app form (fields) information
   */
  async getAppForm(accessToken: string, appId: string): Promise<any> {
    const response = await fetch(
      `https://${this.config.subdomain}.cybozu.com/k/v1/app/form.json?app=${appId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get app form: ${error}`)
    }

    return response.json()
  }

  /**
   * Get records from an app
   */
  async getRecords(
    accessToken: string,
    appId: string,
    query?: string,
    fields?: string[]
  ): Promise<any[]> {
    const params = new URLSearchParams({
      app: appId,
      ...(query && { query }),
      ...(fields && { fields: fields.join(',') }),
    })

    const response = await fetch(
      `https://${this.config.subdomain}.cybozu.com/k/v1/records.json?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get records: ${error}`)
    }

    const data = await response.json()
    return data.records || []
  }

  /**
   * Test connection with current access token
   */
  async testConnection(accessToken: string): Promise<boolean> {
    try {
      await this.getUserInfo(accessToken)
      return true
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

/**
 * Default OAuth scopes for Kintone integration
 */
export const DEFAULT_KINTONE_SCOPES = [
  'k:app_record:read',
  'k:app_record:write', 
  'k:app_settings:read',
  'k:user:read'
]

/**
 * Create Kintone OAuth client instance
 */
export function createKintoneOAuthClient(config: KintoneOAuthConfig): KintoneOAuthClient {
  return new KintoneOAuthClient(config)
}
