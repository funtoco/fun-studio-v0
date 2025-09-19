/**
 * Base Connector Interface
 * All connectors (Kintone, HubSpot, Slack, etc.) implement this interface
 */

export interface ConnectorConfig {
  id: string
  name: string
  type: string
  tenantId: string
  credentials: Record<string, any>
  settings: Record<string, any>
}

export interface SyncResult {
  success: boolean
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsSkipped: number
  recordsFailed: number
  errors: string[]
  duration: number
}

export interface ConnectorCapabilities {
  canRead: boolean
  canWrite: boolean
  canSync: boolean
  canWebhook: boolean
  supportedEntities: string[] // ['people', 'companies', 'visas', etc.]
}

export abstract class BaseConnector {
  protected config: ConnectorConfig

  constructor(config: ConnectorConfig) {
    this.config = config
  }

  // Abstract methods that each connector must implement
  abstract getCapabilities(): ConnectorCapabilities
  abstract testConnection(): Promise<boolean>
  abstract authenticate(): Promise<boolean>
  abstract refreshAuth(): Promise<boolean>

  // Data operations
  abstract syncFromExternal(entity: string, options?: any): Promise<SyncResult>
  abstract syncToExternal(entity: string, data: any[], options?: any): Promise<SyncResult>
  abstract getExternalData(entity: string, filters?: any): Promise<any[]>
  abstract pushToExternal(entity: string, records: any[]): Promise<SyncResult>

  // Metadata operations
  abstract getAvailableEntities(): Promise<string[]>
  abstract getEntitySchema(entity: string): Promise<any>
  abstract getFieldMappings(entity: string): Promise<any>

  // Common utility methods
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    console[level](`[${this.config.type}:${this.config.name}] ${message}`, data)
  }

  protected handleError(error: any, operation: string): never {
    this.log('error', `Failed ${operation}:`, error)
    throw new Error(`${this.config.type} connector ${operation} failed: ${error.message}`)
  }
}

/**
 * Connector Factory - creates appropriate connector instance
 */
export class ConnectorFactory {
  private static connectorClasses: Map<string, any> = new Map()

  static register(type: string, connectorClass: any) {
    this.connectorClasses.set(type, connectorClass)
  }

  static create(config: ConnectorConfig): BaseConnector {
    const ConnectorClass = this.connectorClasses.get(config.type)
    if (!ConnectorClass) {
      throw new Error(`Unknown connector type: ${config.type}`)
    }
    return new ConnectorClass(config)
  }

  static getSupportedTypes(): string[] {
    return Array.from(this.connectorClasses.keys())
  }
}
