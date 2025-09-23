/**
 * Provider manifests defining configuration and endpoints for each connector type
 */

import { ProviderManifest, type ProviderId } from './types'

/**
 * Kintone provider manifest
 */
const kintoneManifest: ProviderManifest = {
  id: 'kintone',
  title: 'Kintone',
  description: 'Connect to Kintone apps for data synchronization',
  icon: '🔷',
  clientMode: 'per-tenant',
  
  authorizeUrl: (cfg) => {
    const subdomain = cfg.subdomain
    if (!subdomain) throw new Error('Subdomain required for Kintone')
    // Kintone uses /oauth2/authorization (not /authorize)
    return `https://${subdomain}.cybozu.com/oauth2/authorization`
  },
  
  tokenUrl: (cfg) => {
    const subdomain = cfg.subdomain
    if (!subdomain) throw new Error('Subdomain required for Kintone')
    return `https://${subdomain}.cybozu.com/oauth2/token`
  },
  
  defaultScopes: ['k:app_record:read', 'k:app_settings:read'],
  
  validateConfig: (cfg) => {
    const { subdomain } = cfg
    if (!subdomain || typeof subdomain !== 'string') {
      throw new Error('Subdomain is required')
    }
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      throw new Error('Subdomain must contain only lowercase letters, numbers, and hyphens')
    }
    if (subdomain.length < 3 || subdomain.length > 32) {
      throw new Error('Subdomain must be between 3 and 32 characters')
    }
  },
  
  configFields: [
    {
      key: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      required: true,
      placeholder: 'example',
      description: 'Your Kintone subdomain (from https://subdomain.cybozu.com)',
      validation: {
        pattern: '^[a-z0-9-]+$',
        minLength: 3,
        maxLength: 32
      }
    }
  ]
}

/**
 * HubSpot provider manifest
 */
const hubspotManifest: ProviderManifest = {
  id: 'hubspot',
  title: 'HubSpot',
  description: 'Connect to HubSpot CRM for contact and deal management',
  icon: '🟠',
  clientMode: 'global', // Can use global client or BYOC
  
  authorizeUrl: () => 'https://app.hubspot.com/oauth/authorize',
  tokenUrl: () => 'https://api.hubapi.com/oauth/v1/token',
  
  defaultScopes: [
    'crm.objects.contacts.read',
    'crm.objects.companies.read',
    'crm.objects.deals.read'
  ],
  
  validateConfig: (cfg) => {
    // HubSpot doesn't require additional config beyond client credentials
    // But we could add portal ID validation here if needed
  },
  
  configFields: [
    {
      key: 'portalId',
      label: 'Portal ID (Optional)',
      type: 'text',
      required: false,
      placeholder: '12345678',
      description: 'Your HubSpot Portal ID for reference (optional)'
    }
  ]
}

/**
 * Registry of all provider manifests
 */
export const manifests: Record<ProviderId, ProviderManifest> = {
  kintone: kintoneManifest,
  hubspot: hubspotManifest
}

/**
 * Get manifest for a provider
 */
export function getManifest(providerId: ProviderId): ProviderManifest {
  const manifest = manifests[providerId]
  if (!manifest) {
    throw new Error(`Unknown provider: ${providerId}`)
  }
  return manifest
}

/**
 * Get all available providers
 */
export function getAvailableProviders(): ProviderManifest[] {
  return Object.values(manifests)
}

/**
 * Validate provider configuration
 */
export function validateProviderConfig(providerId: ProviderId, config: Record<string, any>): void {
  const manifest = getManifest(providerId)
  manifest.validateConfig(config)
}

/**
 * Get authorization URL for a provider
 */
export function getAuthorizeUrl(providerId: ProviderId, config: Record<string, any>): string {
  const manifest = getManifest(providerId)
  return manifest.authorizeUrl(config)
}

/**
 * Get token URL for a provider
 */
export function getTokenUrl(providerId: ProviderId, config: Record<string, any>): string {
  const manifest = getManifest(providerId)
  return manifest.tokenUrl(config)
}
