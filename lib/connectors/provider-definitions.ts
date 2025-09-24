/**
 * Provider definitions with authentication strategies and capabilities
 */

import { AuthConfig, getAuthStrategy, getAvailableStrategies } from './auth-strategies'

export interface ProviderCapabilities {
  dataSync: boolean
  realTimeSync: boolean
  webhooks: boolean
  bulkOperations: boolean
  customFields: boolean
  fileUpload: boolean
  search: boolean
  filtering: boolean
  pagination: boolean
}

export interface ProviderEntity {
  name: string
  displayName: string
  description: string
  primaryKey: string
  fields: Array<{
    name: string
    type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'json'
    required: boolean
    displayName: string
    description?: string
  }>
}

export interface ProviderDefinition {
  id: string
  name: string
  description: string
  logo?: string
  website?: string
  documentation?: string
  
  // Authentication
  defaultAuthStrategy: string
  supportedAuthStrategies: string[]
  
  // Capabilities
  capabilities: ProviderCapabilities
  
  // Data entities
  entities: ProviderEntity[]
  
  // Configuration
  requiresSubdomain: boolean
  requiresEnvironment: boolean
  customConfigFields?: Array<{
    name: string
    type: 'text' | 'select' | 'textarea' | 'boolean'
    label: string
    required: boolean
    options?: Array<{ value: string; label: string }>
  }>
  
  // API limits
  rateLimits?: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
}

/**
 * Provider definitions registry
 */
export const providerDefinitions: Record<string, ProviderDefinition> = {
  kintone: {
    id: 'kintone',
    name: 'Kintone',
    description: 'Cybozu Kintone - Low-code application development platform',
    logo: '/logos/kintone-logo-horizontal.webp',
    website: 'https://www.kintone.com',
    documentation: 'https://developer.kintone.io',
    
    defaultAuthStrategy: 'oauth',
    supportedAuthStrategies: ['oauth'],
    
    capabilities: {
      dataSync: true,
      realTimeSync: false,
      webhooks: true,
      bulkOperations: true,
      customFields: true,
      fileUpload: true,
      search: true,
      filtering: true,
      pagination: true
    },
    
    entities: [
      {
        name: 'apps',
        displayName: 'Applications',
        description: 'Kintone applications',
        primaryKey: 'appId',
        fields: [
          { name: 'appId', type: 'number', required: true, displayName: 'App ID' },
          { name: 'name', type: 'string', required: true, displayName: 'App Name' },
          { name: 'description', type: 'string', required: false, displayName: 'Description' },
          { name: 'spaceId', type: 'number', required: false, displayName: 'Space ID' },
          { name: 'threadId', type: 'number', required: false, displayName: 'Thread ID' }
        ]
      },
      {
        name: 'records',
        displayName: 'Records',
        description: 'Application records',
        primaryKey: '$id',
        fields: [
          { name: '$id', type: 'number', required: true, displayName: 'Record ID' },
          { name: '$revision', type: 'number', required: true, displayName: 'Revision' },
          { name: 'Created_by', type: 'json', required: true, displayName: 'Created By' },
          { name: 'Updated_by', type: 'json', required: true, displayName: 'Updated By' }
        ]
      }
    ],
    
    requiresSubdomain: true,
    requiresEnvironment: false,
    
    customConfigFields: [
      {
        name: 'subdomain',
        type: 'text',
        label: 'Subdomain',
        required: true
      }
    ],
    
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    }
  },
  
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'HubSpot CRM and Marketing Platform',
    logo: '/logos/hubspot-logo.jpg',
    website: 'https://www.hubspot.com',
    documentation: 'https://developers.hubspot.com',
    
    defaultAuthStrategy: 'oauth',
    supportedAuthStrategies: ['oauth', 'private_app'],
    
    capabilities: {
      dataSync: true,
      realTimeSync: true,
      webhooks: true,
      bulkOperations: true,
      customFields: true,
      fileUpload: true,
      search: true,
      filtering: true,
      pagination: true
    },
    
    entities: [
      {
        name: 'contacts',
        displayName: 'Contacts',
        description: 'HubSpot contacts',
        primaryKey: 'id',
        fields: [
          { name: 'id', type: 'string', required: true, displayName: 'Contact ID' },
          { name: 'email', type: 'email', required: false, displayName: 'Email' },
          { name: 'firstname', type: 'string', required: false, displayName: 'First Name' },
          { name: 'lastname', type: 'string', required: false, displayName: 'Last Name' },
          { name: 'company', type: 'string', required: false, displayName: 'Company' }
        ]
      },
      {
        name: 'companies',
        displayName: 'Companies',
        description: 'HubSpot companies',
        primaryKey: 'id',
        fields: [
          { name: 'id', type: 'string', required: true, displayName: 'Company ID' },
          { name: 'name', type: 'string', required: false, displayName: 'Company Name' },
          { name: 'domain', type: 'string', required: false, displayName: 'Domain' },
          { name: 'industry', type: 'string', required: false, displayName: 'Industry' }
        ]
      }
    ],
    
    requiresSubdomain: false,
    requiresEnvironment: false,
    
    rateLimits: {
      requestsPerMinute: 100,
      requestsPerHour: 10000,
      requestsPerDay: 100000
    }
  },
  
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Salesforce CRM Platform',
    logo: '/logos/salesforce-logo.png',
    website: 'https://www.salesforce.com',
    documentation: 'https://developer.salesforce.com',
    
    defaultAuthStrategy: 'oauth',
    supportedAuthStrategies: ['oauth'],
    
    capabilities: {
      dataSync: true,
      realTimeSync: true,
      webhooks: true,
      bulkOperations: true,
      customFields: true,
      fileUpload: true,
      search: true,
      filtering: true,
      pagination: true
    },
    
    entities: [
      {
        name: 'leads',
        displayName: 'Leads',
        description: 'Salesforce leads',
        primaryKey: 'Id',
        fields: [
          { name: 'Id', type: 'string', required: true, displayName: 'Lead ID' },
          { name: 'FirstName', type: 'string', required: false, displayName: 'First Name' },
          { name: 'LastName', type: 'string', required: false, displayName: 'Last Name' },
          { name: 'Email', type: 'email', required: false, displayName: 'Email' },
          { name: 'Company', type: 'string', required: false, displayName: 'Company' }
        ]
      }
    ],
    
    requiresSubdomain: false,
    requiresEnvironment: true,
    
    customConfigFields: [
      {
        name: 'environment',
        type: 'select',
        label: 'Environment',
        required: true,
        options: [
          { value: 'login', label: 'Production' },
          { value: 'test', label: 'Sandbox' }
        ]
      }
    ],
    
    rateLimits: {
      requestsPerMinute: 1000,
      requestsPerHour: 10000,
      requestsPerDay: 100000
    }
  }
}

/**
 * Get provider definition
 */
export function getProviderDefinition(providerId: string): ProviderDefinition {
  const definition = providerDefinitions[providerId]
  if (!definition) {
    throw new Error(`Provider definition not found: ${providerId}`)
  }
  return definition
}

/**
 * Get all available providers
 */
export function getAllProviders(): ProviderDefinition[] {
  return Object.values(providerDefinitions)
}

/**
 * Get providers by capability
 */
export function getProvidersByCapability(capability: keyof ProviderCapabilities): ProviderDefinition[] {
  return getAllProviders().filter(provider => provider.capabilities[capability])
}
