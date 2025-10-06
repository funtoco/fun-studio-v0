/**
 * Sync logging utilities for tracking synchronization sessions and item-level details
 */

import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

export interface SyncSession {
  id: string
  tenant_id: string
  connector_id: string
  sync_type: 'manual' | 'scheduled'
  status: 'running' | 'success' | 'failed'
  start_time: string
  end_time?: string
  total_count: number
  success_count: number
  failed_count: number
  error_message?: string
  run_by?: string
}

export interface SyncItemLog {
  id: string
  session_id: string
  item_type: 'people' | 'visas'
  item_id: string
  status: 'success' | 'failed'
  timestamp: string
  error_details?: string
}

export class SyncLogger {
  private supabase: ReturnType<typeof getServerClient>
  private sessionId?: string

  constructor() {
    this.supabase = getServerClient()
  }

  /**
   * Start a new sync session
   */
  async startSession(
    tenantId: string,
    connectorId: string,
    syncType: 'manual' | 'scheduled',
    runBy?: string
  ): Promise<string> {
    const { data, error } = await this.supabase
      .from('sync_sessions')
      .insert({
        tenant_id: tenantId,
        connector_id: connectorId,
        sync_type: syncType,
        status: 'running',
        run_by: null // Set to null to avoid foreign key constraint
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`Failed to create sync session: ${error.message}`)
    }

    this.sessionId = data.id
    return data.id
  }

  /**
   * Log individual item sync result (for manual syncs only)
   */
  async logItem(
    itemType: 'people' | 'visas',
    itemId: string,
    status: 'success' | 'failed',
    errorDetails?: string
  ): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Sync session not started')
    }

    const { error } = await this.supabase
      .from('sync_item_logs')
      .insert({
        session_id: this.sessionId,
        item_type: itemType,
        item_id: itemId,
        status,
        error_details: errorDetails
      })

    if (error) {
      console.error('Failed to log sync item:', error)
      // Don't throw error to avoid breaking sync process
    }
  }

  /**
   * Update session with final results
   */
  async completeSession(
    status: 'success' | 'failed',
    totalCount: number,
    successCount: number,
    failedCount: number,
    errorMessage?: string
  ): Promise<void> {
    if (!this.sessionId) {
      throw new Error('Sync session not started')
    }

    const { error } = await this.supabase
      .from('sync_sessions')
      .update({
        status,
        end_time: new Date().toISOString(),
        total_count: totalCount,
        success_count: successCount,
        failed_count: failedCount,
        error_message: errorMessage
      })
      .eq('id', this.sessionId)

    if (error) {
      throw new Error(`Failed to complete sync session: ${error.message}`)
    }
  }

  /**
   * Get sync sessions for a tenant
   */
  async getSessions(
    tenantId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<SyncSession[]> {
    const { data, error } = await this.supabase
      .from('sync_sessions')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch sync sessions: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get item logs for a specific session
   */
  async getItemLogs(
    sessionId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<SyncItemLog[]> {
    const { data, error } = await this.supabase
      .from('sync_item_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch item logs: ${error.message}`)
    }

    return data || []
  }

  /**
   * Get real-time sync progress for a running session
   */
  async getSessionProgress(sessionId: string): Promise<{
    session: SyncSession | null
    itemLogs: SyncItemLog[]
  }> {
    const [sessionResult, itemLogsResult] = await Promise.all([
      this.supabase
        .from('sync_sessions')
        .select('*')
        .eq('id', sessionId)
        .single(),
      this.supabase
        .from('sync_item_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: false })
        .limit(100)
    ])

    if (sessionResult.error) {
      throw new Error(`Failed to fetch session: ${sessionResult.error.message}`)
    }

    if (itemLogsResult.error) {
      throw new Error(`Failed to fetch item logs: ${itemLogsResult.error.message}`)
    }

    return {
      session: sessionResult.data,
      itemLogs: itemLogsResult.data || []
    }
  }
}

/**
 * Create a new sync logger instance
 */
export function createSyncLogger(): SyncLogger {
  return new SyncLogger()
}
