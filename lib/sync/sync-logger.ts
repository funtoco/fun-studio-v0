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
    const tenantValue = tenantId && tenantId.length > 0 ? tenantId : null
    const { data, error } = await this.supabase
      .from('sync_sessions')
      .insert({
        tenant_id: tenantValue,
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
   * Get real-time sync progress for a running session
   */
  async getSessionProgress(sessionId: string): Promise<{
    session: SyncSession | null
  }> {
    const { data, error } = await this.supabase
      .from('sync_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch session: ${error.message}`)
    }

    return {
      session: data
    }
  }
}

/**
 * Create a new sync logger instance
 */
export function createSyncLogger(): SyncLogger {
  return new SyncLogger()
}
