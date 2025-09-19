/**
 * Data source manager - determines whether to use Kintone or sample data
 * Automatically switches based on available Kintone connections
 */

import { createClient } from '@supabase/supabase-js'

// Client-side Supabase
function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, anonKey)
}

export interface DataSourceInfo {
  source: 'kintone' | 'sample'
  connectorId?: string
  connectorName?: string
  lastSync?: string
  recordCount?: {
    people: number
    visas: number
  }
}

/**
 * Get current data source information
 */
export async function getDataSourceInfo(): Promise<DataSourceInfo> {
  try {
    const supabase = getClient()
    
    // Check for connected Kintone connectors
    const { data: connectors } = await supabase
      .from('connectors')
      .select('id, name, provider, status, updated_at')
      .eq('provider', 'kintone')
      .eq('status', 'connected')
      .order('updated_at', { ascending: false })
      .limit(1)
    
    if (connectors && connectors.length > 0) {
      const connector = connectors[0]
      
      // Get last sync info from logs
      const { data: syncLog } = await supabase
        .from('connector_logs')
        .select('created_at, detail')
        .eq('connector_id', connector.id)
        .eq('event', 'sync_completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      // Get record counts from Supabase (Kintone-synced data has 'k_' prefix)
      const [peopleCount, visasCount] = await Promise.all([
        supabase.from('people').select('id', { count: 'exact' }).like('id', 'k_%'),
        supabase.from('visas').select('id', { count: 'exact' }).like('id', 'k_%')
      ])
      
      return {
        source: 'kintone',
        connectorId: connector.id,
        connectorName: connector.name,
        lastSync: syncLog?.created_at,
        recordCount: {
          people: peopleCount.count || 0,
          visas: visasCount.count || 0
        }
      }
    }
    
    // No connected Kintone connector, use sample data
    return {
      source: 'sample'
    }
    
  } catch (err) {
    console.error('Failed to get data source info:', err)
    // Fallback to sample data
    return {
      source: 'sample'
    }
  }
}

/**
 * Check if we should use Kintone data
 */
export async function shouldUseKintoneData(): Promise<boolean> {
  const info = await getDataSourceInfo()
  return info.source === 'kintone' && (info.recordCount?.people || 0) > 0
}
