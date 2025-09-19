/**
 * Provider adapters for token exchange and refresh
 */

import { ProviderAdapter, type ProviderId } from './types'

/**
 * Kintone adapter
 */
class KintoneAdapter implements ProviderAdapter {
  async exchangeToken(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
    codeVerifier: string
  }) {
    const { cfg, clientId, clientSecret, code, redirectUri, codeVerifier } = input
    const subdomain = cfg.subdomain
    
    if (!subdomain) {
      throw new Error('Subdomain is required for Kintone')
    }

    // Mock OAuth for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_kintone_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_in: 3600,
        token_type: 'Bearer',
        raw: {
          mock: true,
          subdomain,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = `https://${subdomain}.cybozu.com/oauth2/token`
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
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
      raw
    }
  }

  async refreshToken(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    refreshToken: string
  }) {
    const { cfg, clientId, clientSecret, refreshToken } = input
    const subdomain = cfg.subdomain
    
    if (!subdomain) {
      throw new Error('Subdomain is required for Kintone')
    }

    // Mock refresh for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_refreshed_token_${Date.now()}`,
        refresh_token: refreshToken,
        expires_in: 3600,
        token_type: 'Bearer',
        raw: {
          mock: true,
          refreshed: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = `https://${subdomain}.cybozu.com/oauth2/token`
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
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
      refresh_token: raw.refresh_token || refreshToken,
      expires_in: raw.expires_in,
      token_type: raw.token_type || 'Bearer',
      raw
    }
  }
}

/**
 * HubSpot adapter
 */
class HubSpotAdapter implements ProviderAdapter {
  async exchangeToken(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
    codeVerifier: string
  }) {
    const { clientId, clientSecret, code, redirectUri } = input

    // Mock OAuth for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_hubspot_token_${Date.now()}`,
        refresh_token: `mock_hubspot_refresh_${Date.now()}`,
        expires_in: 21600, // 6 hours
        token_type: 'Bearer',
        raw: {
          mock: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = 'https://api.hubapi.com/oauth/v1/token'
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
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
      throw new Error(`HubSpot token exchange failed: ${response.status} ${errorText}`)
    }

    const raw = await response.json()
    
    return {
      access_token: raw.access_token,
      refresh_token: raw.refresh_token,
      expires_in: raw.expires_in,
      token_type: raw.token_type || 'Bearer',
      raw
    }
  }

  async refreshToken(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    refreshToken: string
  }) {
    const { clientId, clientSecret, refreshToken } = input

    // Mock refresh for development
    if (process.env.MOCK_OAUTH === '1') {
      return {
        access_token: `mock_hubspot_refreshed_${Date.now()}`,
        refresh_token: refreshToken,
        expires_in: 21600,
        token_type: 'Bearer',
        raw: {
          mock: true,
          refreshed: true,
          timestamp: new Date().toISOString()
        }
      }
    }

    const tokenUrl = 'https://api.hubapi.com/oauth/v1/token'
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
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
      throw new Error(`HubSpot token refresh failed: ${response.status} ${errorText}`)
    }

    const raw = await response.json()
    
    return {
      access_token: raw.access_token,
      refresh_token: raw.refresh_token || refreshToken,
      expires_in: raw.expires_in,
      token_type: raw.token_type || 'Bearer',
      raw
    }
  }
}

/**
 * Registry of all adapters
 */
export const adapters: Record<ProviderId, ProviderAdapter> = {
  kintone: new KintoneAdapter(),
  hubspot: new HubSpotAdapter()
}

/**
 * Get adapter for a provider
 */
export function getAdapter(providerId: ProviderId): ProviderAdapter {
  const adapter = adapters[providerId]
  if (!adapter) {
    throw new Error(`Unknown provider: ${providerId}`)
  }
  return adapter
}
