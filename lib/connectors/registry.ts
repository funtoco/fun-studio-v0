/**
 * Provider registry for OAuth connectors
 * Extensible architecture for multiple providers
 */

export type ProviderId = 'kintone' | 'hubspot'

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
  raw: any
}

export interface AuthorizeUrlInput {
  tenantId: string
  subdomain?: string // required for kintone
  clientId: string
  redirectUri: string
  scope: string[]
  stateJwt: string
  codeChallenge: string
}

export interface TokenExchangeInput {
  subdomain?: string // required for kintone
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
  codeVerifier: string
}

export interface RefreshTokenInput {
  subdomain?: string
  clientId: string
  clientSecret: string
  refreshToken: string
}

export abstract class ProviderAdapter {
  abstract readonly id: ProviderId
  abstract readonly name: string
  abstract readonly requiredScopes: string[]
  abstract readonly supportsRefresh: boolean

  abstract buildAuthorizeUrl(input: AuthorizeUrlInput): string
  abstract exchangeToken(input: TokenExchangeInput): Promise<TokenResponse>
  abstract refreshToken?(input: RefreshTokenInput): Promise<TokenResponse>
  abstract validateConfig?(config: { subdomain?: string; clientId: string; clientSecret: string }): boolean
}

/**
 * Kintone OAuth adapter
 */
class KintoneAdapter extends ProviderAdapter {
  readonly id: ProviderId = 'kintone'
  readonly name = 'Kintone'
  readonly requiredScopes = ['k:app_record:read', 'k:app_settings:read']
  readonly supportsRefresh = true

  buildAuthorizeUrl(input: AuthorizeUrlInput): string {
    if (!input.subdomain) {
      throw new Error('Subdomain is required for Kintone')
    }

    const params = new URLSearchParams({
      client_id: input.clientId,
      response_type: 'code',
      redirect_uri: input.redirectUri,
      scope: input.scope.join(' '),
      state: input.stateJwt,
      code_challenge: input.codeChallenge,
      code_challenge_method: 'S256'
    })

    return `https://${input.subdomain}.cybozu.com/oauth2/authorize?${params.toString()}`
  }

  async exchangeToken(input: TokenExchangeInput): Promise<TokenResponse> {
    if (!input.subdomain) {
      throw new Error('Subdomain is required for Kintone')
    }

    // Mock OAuth for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_kintone_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'k:app_record:read k:app_settings:read',
        raw: {
          mock: true,
          subdomain: input.subdomain,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = `https://${input.subdomain}.cybozu.com/oauth2/token`
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: input.clientId,
      client_secret: input.clientSecret,
      code: input.code,
      redirect_uri: input.redirectUri,
      code_verifier: input.codeVerifier
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kintone token exchange failed: ${response.status} ${errorText}`)
    }

    const raw = await response.json()
    
    return {
      access_token: raw.access_token,
      refresh_token: raw.refresh_token,
      expires_in: raw.expires_in,
      token_type: raw.token_type || 'Bearer',
      scope: raw.scope,
      raw
    }
  }

  async refreshToken(input: RefreshTokenInput): Promise<TokenResponse> {
    if (!input.subdomain) {
      throw new Error('Subdomain is required for Kintone')
    }

    // Mock refresh for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_refreshed_token_${Date.now()}`,
        refresh_token: input.refreshToken, // Keep same refresh token
        expires_in: 3600,
        token_type: 'Bearer',
        raw: {
          mock: true,
          refreshed: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = `https://${input.subdomain}.cybozu.com/oauth2/token`
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: input.clientId,
      client_secret: input.clientSecret,
      refresh_token: input.refreshToken
    })

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: body.toString()
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Kintone token refresh failed: ${response.status} ${errorText}`)
    }

    const raw = await response.json()
    
    return {
      access_token: raw.access_token,
      refresh_token: raw.refresh_token || input.refreshToken,
      expires_in: raw.expires_in,
      token_type: raw.token_type || 'Bearer',
      scope: raw.scope,
      raw
    }
  }

  validateConfig(config: { subdomain?: string; clientId: string; clientSecret: string }): boolean {
    return !!(
      config.subdomain && 
      config.clientId && 
      config.clientSecret &&
      /^[a-z0-9-]+$/.test(config.subdomain)
    )
  }
}

/**
 * HubSpot OAuth adapter (stub for future implementation)
 */
class HubSpotAdapter extends ProviderAdapter {
  readonly id: ProviderId = 'hubspot'
  readonly name = 'HubSpot'
  readonly requiredScopes = ['contacts', 'content']
  readonly supportsRefresh = true

  buildAuthorizeUrl(input: AuthorizeUrlInput): string {
    const params = new URLSearchParams({
      client_id: input.clientId,
      response_type: 'code',
      redirect_uri: input.redirectUri,
      scope: input.scope.join(' '),
      state: input.stateJwt
    })

    return `https://app.hubspot.com/oauth/authorize?${params.toString()}`
  }

  async exchangeToken(input: TokenExchangeInput): Promise<TokenResponse> {
    // Mock OAuth for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_hubspot_token_${Date.now()}`,
        refresh_token: `mock_hubspot_refresh_${Date.now()}`,
        expires_in: 21600, // 6 hours
        token_type: 'Bearer',
        scope: 'contacts content',
        raw: {
          mock: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    // TODO: Implement real HubSpot OAuth
    throw new Error('HubSpot OAuth not yet implemented. Set MOCK_OAUTH=1 for testing.')
  }

  async refreshToken(input: RefreshTokenInput): Promise<TokenResponse> {
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_hubspot_refreshed_${Date.now()}`,
        refresh_token: input.refreshToken,
        expires_in: 21600,
        token_type: 'Bearer',
        raw: {
          mock: true,
          refreshed: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    throw new Error('HubSpot token refresh not yet implemented. Set MOCK_OAUTH=1 for testing.')
  }

  validateConfig(config: { clientId: string; clientSecret: string }): boolean {
    return !!(config.clientId && config.clientSecret)
  }
}

// Registry of all available adapters
export const adapters: Record<ProviderId, ProviderAdapter> = {
  kintone: new KintoneAdapter(),
  hubspot: new HubSpotAdapter()
}

/**
 * Get adapter by provider ID
 */
export function getAdapter(providerId: ProviderId): ProviderAdapter {
  const adapter = adapters[providerId]
  if (!adapter) {
    throw new Error(`Unknown provider: ${providerId}`)
  }
  return adapter
}

/**
 * Get all available provider IDs
 */
export function getAvailableProviders(): ProviderId[] {
  return Object.keys(adapters) as ProviderId[]
}

/**
 * Validate subdomain format (for Kintone)
 */
export function validateSubdomain(subdomain: string): boolean {
  return /^[a-z0-9-]+$/.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 32
}
