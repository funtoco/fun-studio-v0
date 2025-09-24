/**
 * Authentication strategies for different connector types
 */

export type AuthStrategy = 'oauth2' | 'api_key' | 'basic_auth' | 'custom'

export interface AuthStrategyConfig {
  strategy: AuthStrategy
  requiredFields: string[]
  optionalFields?: string[]
  description: string
}

export interface OAuth2Config extends AuthStrategyConfig {
  strategy: 'oauth2'
  requiredFields: ['clientId', 'clientSecret', 'redirectUri']
  optionalFields: ['scopes', 'subdomain']
  authUrl: string
  tokenUrl: string
  userInfoUrl?: string
}

export interface ApiKeyConfig extends AuthStrategyConfig {
  strategy: 'api_key'
  requiredFields: ['apiKey']
  optionalFields: ['baseUrl', 'environment']
  headerName?: string
  headerPrefix?: string
}

export interface BasicAuthConfig extends AuthStrategyConfig {
  strategy: 'basic_auth'
  requiredFields: ['username', 'password']
  optionalFields: ['baseUrl']
}

export interface CustomAuthConfig extends AuthStrategyConfig {
  strategy: 'custom'
  requiredFields: string[]
  optionalFields?: string[]
  customFields: Array<{
    name: string
    type: 'text' | 'password' | 'select' | 'textarea'
    label: string
    placeholder?: string
    options?: Array<{ value: string; label: string }>
    required: boolean
  }>
}

export type AuthConfig = OAuth2Config | ApiKeyConfig | BasicAuthConfig | CustomAuthConfig

/**
 * Authentication strategy registry
 */
export const authStrategies: Record<string, AuthConfig> = {
  kintone_oauth: {
    strategy: 'oauth2',
    requiredFields: ['clientId', 'clientSecret', 'redirectUri'],
    optionalFields: ['scopes', 'subdomain'],
    description: 'Kintone OAuth 2.0 authentication',
    authUrl: 'https://{subdomain}.cybozu.com/oauth2/authorization',
    tokenUrl: 'https://{subdomain}.cybozu.com/oauth2/token',
    userInfoUrl: 'https://{subdomain}.cybozu.com/k/v1/users/me.json'
  },
  
  hubspot_oauth: {
    strategy: 'oauth2',
    requiredFields: ['clientId', 'clientSecret', 'redirectUri'],
    optionalFields: ['scopes'],
    description: 'HubSpot OAuth 2.0 authentication',
    authUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    userInfoUrl: 'https://api.hubapi.com/crm/v3/owners/me'
  },
  
  hubspot_private_app: {
    strategy: 'api_key',
    requiredFields: ['apiKey'],
    optionalFields: ['baseUrl'],
    description: 'HubSpot Private App authentication',
    headerName: 'Authorization',
    headerPrefix: 'Bearer'
  },
  
  salesforce_oauth: {
    strategy: 'oauth2',
    requiredFields: ['clientId', 'clientSecret', 'redirectUri'],
    optionalFields: ['environment', 'scopes'],
    description: 'Salesforce OAuth 2.0 authentication',
    authUrl: 'https://{environment}.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://{environment}.salesforce.com/services/oauth2/token',
    userInfoUrl: 'https://{environment}.salesforce.com/services/oauth2/userinfo'
  },
  
  slack_oauth: {
    strategy: 'oauth2',
    requiredFields: ['clientId', 'clientSecret', 'redirectUri'],
    optionalFields: ['scopes'],
    description: 'Slack OAuth 2.0 authentication',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    userInfoUrl: 'https://slack.com/api/users.identity'
  },
  
  custom_api: {
    strategy: 'custom',
    requiredFields: ['endpoint', 'authType'],
    optionalFields: ['headers', 'timeout'],
    description: 'Custom API authentication',
    customFields: [
      {
        name: 'endpoint',
        type: 'text',
        label: 'API Endpoint',
        placeholder: 'https://api.example.com',
        required: true
      },
      {
        name: 'authType',
        type: 'select',
        label: 'Authentication Type',
        required: true,
        options: [
          { value: 'bearer', label: 'Bearer Token' },
          { value: 'basic', label: 'Basic Auth' },
          { value: 'apikey', label: 'API Key' }
        ]
      },
      {
        name: 'token',
        type: 'password',
        label: 'Token/Key',
        required: true
      }
    ]
  }
}

/**
 * Get authentication strategy for a provider
 */
export function getAuthStrategy(providerId: string, strategyName?: string): AuthConfig {
  const key = strategyName ? `${providerId}_${strategyName}` : `${providerId}_oauth`
  const strategy = authStrategies[key]
  
  if (!strategy) {
    throw new Error(`No authentication strategy found for ${providerId}${strategyName ? ` with strategy ${strategyName}` : ''}`)
  }
  
  return strategy
}

/**
 * Get all available strategies for a provider
 */
export function getAvailableStrategies(providerId: string): AuthConfig[] {
  return Object.entries(authStrategies)
    .filter(([key]) => key.startsWith(`${providerId}_`))
    .map(([, config]) => config)
}
