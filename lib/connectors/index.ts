/**
 * Connector Registry
 * Register all available connectors here
 */

import { ConnectorFactory } from './base-connector'
import { KintoneConnector } from './kintone-connector'
import { HubSpotConnector } from './hubspot-connector'

// Register all connectors
ConnectorFactory.register('kintone', KintoneConnector)
ConnectorFactory.register('hubspot', HubSpotConnector)
// ConnectorFactory.register('slack', SlackConnector)
// ConnectorFactory.register('salesforce', SalesforceConnector)
// ConnectorFactory.register('notion', NotionConnector)

export { ConnectorFactory }
export * from './base-connector'
export * from './kintone-connector'
export * from './kintone-oauth'

/**
 * Get available connector types with metadata
 */
export function getAvailableConnectors() {
  return [
    {
      type: 'kintone',
      name: 'Kintone',
      description: 'Cybozu Kintone cloud database platform',
      logo: '/connectors/kintone.png',
      authType: 'oauth',
      capabilities: ['read', 'write', 'sync'],
      entities: ['people', 'companies', 'visas', 'meetings', 'support_actions'],
      status: 'active'
    },
    {
      type: 'hubspot',
      name: 'HubSpot',
      description: 'Customer relationship management platform',
      logo: '/connectors/hubspot.png',
      authType: 'oauth',
      capabilities: ['read', 'write', 'sync', 'webhook'],
      entities: ['companies', 'contacts', 'deals'],
      status: 'planned'
    },
    {
      type: 'slack',
      name: 'Slack',
      description: 'Team communication platform',
      logo: '/connectors/slack.png',
      authType: 'oauth',
      capabilities: ['read', 'write', 'webhook'],
      entities: ['messages', 'channels', 'users'],
      status: 'planned'
    },
    {
      type: 'salesforce',
      name: 'Salesforce',
      description: 'Customer relationship management platform',
      logo: '/connectors/salesforce.png',
      authType: 'oauth',
      capabilities: ['read', 'write', 'sync'],
      entities: ['accounts', 'contacts', 'opportunities'],
      status: 'planned'
    }
  ]
}
