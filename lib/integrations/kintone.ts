/**
 * Kintone OAuth 2.0 integration
 */

import { getCredential, updateCredential, updateConnectionStatus } from '@/lib/db/connectors'

export interface KintoneConfig {
  clientId: string
  clientSecret: string
  domain: string
  redirectUri: string
}

export interface KintoneTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope?: string
}

export interface KintoneUserInfo {
  id: string
  name: string
  email: string
}

/**
 * Build Kintone OAuth authorization URL
 */
export function buildKintoneAuthUrl(config: KintoneConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'k:app_record:read k:app_settings:read', // Valid Kintone scopes
    state
  })
  
  // Use correct Kintone OAuth endpoint format
  return `https://${config.domain}.cybozu.com/oauth2/authorization?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  config: KintoneConfig, 
  code: string
): Promise<KintoneTokenResponse> {
  const tokenUrl = `https://${config.domain}.cybozu.com/oauth2/token`
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri
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
    throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
  }
  
  return response.json()
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(
  config: KintoneConfig,
  refreshToken: string
): Promise<KintoneTokenResponse> {
  const tokenUrl = `https://${config.subdomain}.cybozu.com/oauth2/token`
  
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.client_id,
    client_secret: config.client_secret,
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
    throw new Error(`Token refresh failed: ${response.status} ${errorText}`)
  }
  
  return response.json()
}

/**
 * Get user information using access token
 */
export async function getUserInfo(
  config: KintoneConfig,
  accessToken: string
): Promise<KintoneUserInfo> {
  const response = await fetch(`https://${config.subdomain}.cybozu.com/k/v1/users/me.json`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get user info: ${response.status} ${errorText}`)
  }
  
  const data = await response.json()
  return {
    id: data.id,
    name: data.name,
    email: data.email
  }
}

/**
 * Test connection health
 */
export async function testConnection(
  config: KintoneConfig,
  accessToken: string
): Promise<boolean> {
  try {
    await getUserInfo(config, accessToken)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get connector token with auto-refresh
 */
export async function getConnectorToken(connectorId: string): Promise<string> {
  // Get stored config and token
  const config = await getCredential(connectorId, 'kintone_config') as KintoneConfig
  const tokenData = await getCredential(connectorId, 'oauth_token') as {
    access_token: string
    refresh_token?: string
    expires_at: string
  }
  
  if (!config || !tokenData) {
    throw new Error('Connector not configured or not authenticated')
  }
  
  // Check if token is expired
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  
  if (expiresAt > now) {
    // Token is still valid
    return tokenData.access_token
  }
  
  // Token is expired, try to refresh
  if (!tokenData.refresh_token) {
    throw new Error('Token expired and no refresh token available')
  }
  
  try {
    const newTokenData = await refreshAccessToken(config, tokenData.refresh_token)
    
    // Calculate new expiry time
    const newExpiresAt = new Date(Date.now() + newTokenData.expires_in * 1000)
    
    // Update stored token
    await updateCredential(connectorId, 'oauth_token', {
      access_token: newTokenData.access_token,
      refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
      expires_at: newExpiresAt.toISOString()
    })
    
    // Update connection status
    await updateConnectionStatus(connectorId, 'connected')
    
    return newTokenData.access_token
  } catch (error) {
    // Refresh failed, mark as error
    await updateConnectionStatus(connectorId, 'error', `Token refresh failed: ${error}`)
    throw error
  }
}
