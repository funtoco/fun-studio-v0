/**
 * Provider types and interfaces for the connector system
 */

export type ProviderId = 'kintone' | 'hubspot'

export type ClientMode = 'per-tenant' | 'global'

export interface ProviderManifest {
  id: ProviderId
  title: string
  description: string
  icon?: string
  clientMode: ClientMode // kintone=per-tenant, hubspot=global
  authorizeUrl: (cfg: Record<string, any>) => string
  tokenUrl: (cfg: Record<string, any>) => string
  defaultScopes: string[]
  validateConfig: (cfg: Record<string, any>) => void
  configFields: ConfigField[]
}

export interface ConfigField {
  key: string
  label: string
  type: 'text' | 'password' | 'select' | 'multiselect'
  required: boolean
  placeholder?: string
  description?: string
  options?: { value: string; label: string }[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
  }
}

export interface ProviderAdapter {
  exchangeToken(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    code: string
    redirectUri: string
    codeVerifier: string
  }): Promise<{
    access_token: string
    refresh_token?: string
    expires_in?: number
    token_type?: string
    raw: any
  }>
  
  refreshToken?(input: {
    cfg: Record<string, any>
    clientId: string
    clientSecret: string
    refreshToken: string
  }): Promise<{
    access_token: string
    refresh_token?: string
    expires_in?: number
    token_type?: string
    raw: any
  }>
}

export interface ConnectorConfig {
  tenantId: string
  provider: ProviderId
  providerConfig: Record<string, any>
  clientId: string
  clientSecret: string
  scopes: string[]
}

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
  raw: any
}
