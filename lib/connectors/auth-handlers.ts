/**
 * Authentication handlers for different strategies
 */

import { NextRequest, NextResponse } from 'next/server'
import { AuthConfig, AuthStrategy } from './auth-strategies'
import { ProviderDefinition } from './provider-definitions'

export interface AuthContext {
  providerId: string
  connectorId: string
  tenantId: string
  returnTo?: string
  config: Record<string, any>
}

export interface AuthResult {
  success: boolean
  credentials?: Record<string, any>
  error?: string
  redirectUrl?: string
}

/**
 * Base authentication handler
 */
export abstract class AuthHandler {
  abstract strategy: AuthStrategy
  
  abstract startAuth(context: AuthContext): Promise<AuthResult>
  abstract handleCallback(request: NextRequest, context: AuthContext): Promise<AuthResult>
  abstract refreshAuth(credentials: Record<string, any>): Promise<AuthResult>
  abstract validateConfig(config: Record<string, any>): boolean
}

/**
 * OAuth 2.0 authentication handler
 */
export class OAuth2Handler extends AuthHandler {
  strategy: AuthStrategy = 'oauth2'
  
  async startAuth(context: AuthContext): Promise<AuthResult> {
    const { providerId, connectorId, tenantId, returnTo, config } = context
    
    // Generate state parameter
    const state = this.generateState({
      providerId,
      connectorId,
      tenantId,
      returnTo
    })
    
    // Build authorization URL
    const authUrl = this.buildAuthUrl(config, state)
    
    return {
      success: true,
      redirectUrl: authUrl
    }
  }
  
  async handleCallback(request: NextRequest, context: AuthContext): Promise<AuthResult> {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    if (error) {
      return {
        success: false,
        error: `OAuth error: ${error}`
      }
    }
    
    if (!code || !state) {
      return {
        success: false,
        error: 'Missing code or state parameter'
      }
    }
    
    // Verify state
    const stateData = this.verifyState(state)
    if (!stateData) {
      return {
        success: false,
        error: 'Invalid state parameter'
      }
    }
    
    // Exchange code for token
    try {
      const credentials = await this.exchangeCodeForToken(code, context.config)
      return {
        success: true,
        credentials
      }
    } catch (error) {
      return {
        success: false,
        error: `Token exchange failed: ${error}`
      }
    }
  }
  
  async refreshAuth(credentials: Record<string, any>): Promise<AuthResult> {
    if (!credentials.refreshToken) {
      return {
        success: false,
        error: 'No refresh token available'
      }
    }
    
    try {
      const newCredentials = await this.refreshToken(credentials)
      return {
        success: true,
        credentials: newCredentials
      }
    } catch (error) {
      return {
        success: false,
        error: `Token refresh failed: ${error}`
      }
    }
  }
  
  validateConfig(config: Record<string, any>): boolean {
    return !!(config.clientId && config.clientSecret && config.redirectUri)
  }
  
  private generateState(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString('base64')
  }
  
  private verifyState(state: string): any {
    try {
      return JSON.parse(Buffer.from(state, 'base64').toString())
    } catch {
      return null
    }
  }
  
  private buildAuthUrl(config: Record<string, any>, state: string): string {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scopes?.join(' ') || '',
      state
    })
    
    return `${config.authUrl}?${params.toString()}`
  }
  
  private async exchangeCodeForToken(code: string, config: Record<string, any>): Promise<Record<string, any>> {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        code
      })
    })
    
    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`)
    }
    
    return response.json()
  }
  
  private async refreshToken(credentials: Record<string, any>): Promise<Record<string, any>> {
    const response = await fetch(credentials.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken
      })
    })
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`)
    }
    
    return response.json()
  }
}

/**
 * API Key authentication handler
 */
export class ApiKeyHandler extends AuthHandler {
  strategy: AuthStrategy = 'api_key'
  
  async startAuth(context: AuthContext): Promise<AuthResult> {
    // API Key auth doesn't need OAuth flow
    return {
      success: false,
      error: 'API Key authentication does not require OAuth flow'
    }
  }
  
  async handleCallback(request: NextRequest, context: AuthContext): Promise<AuthResult> {
    return {
      success: false,
      error: 'API Key authentication does not use OAuth callback'
    }
  }
  
  async refreshAuth(credentials: Record<string, any>): Promise<AuthResult> {
    // API Key auth doesn't need refresh
    return {
      success: true,
      credentials
    }
  }
  
  validateConfig(config: Record<string, any>): boolean {
    return !!config.apiKey
  }
  
  async testConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(credentials.baseUrl || 'https://api.hubapi.com', {
        headers: {
          [credentials.headerName || 'Authorization']: `${credentials.headerPrefix || 'Bearer'} ${credentials.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

/**
 * Basic Auth authentication handler
 */
export class BasicAuthHandler extends AuthHandler {
  strategy: AuthStrategy = 'basic_auth'
  
  async startAuth(context: AuthContext): Promise<AuthResult> {
    return {
      success: false,
      error: 'Basic Auth does not require OAuth flow'
    }
  }
  
  async handleCallback(request: NextRequest, context: AuthContext): Promise<AuthResult> {
    return {
      success: false,
      error: 'Basic Auth does not use OAuth callback'
    }
  }
  
  async refreshAuth(credentials: Record<string, any>): Promise<AuthResult> {
    return {
      success: true,
      credentials
    }
  }
  
  validateConfig(config: Record<string, any>): boolean {
    return !!(config.username && config.password)
  }
  
  async testConnection(credentials: Record<string, any>): Promise<boolean> {
    try {
      const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')
      const response = await fetch(credentials.baseUrl, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}

/**
 * Authentication handler registry
 */
export const authHandlers: Record<AuthStrategy, AuthHandler> = {
  oauth2: new OAuth2Handler(),
  api_key: new ApiKeyHandler(),
  basic_auth: new BasicAuthHandler(),
  custom: new OAuth2Handler() // Custom can use OAuth2 as base
}

/**
 * Get authentication handler for a strategy
 */
export function getAuthHandler(strategy: AuthStrategy): AuthHandler {
  const handler = authHandlers[strategy]
  if (!handler) {
    throw new Error(`No authentication handler found for strategy: ${strategy}`)
  }
  return handler
}
