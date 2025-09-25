/**
 * Database helpers for Kintone data (apps and fields)
 */

import { createClient } from '@supabase/supabase-js'

// Server-side client
function getServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration')
  }
  
  return createClient(supabaseUrl, serviceKey)
}

// Types
export interface KintoneApp {
  id: string
  connector_id: string
  app_id: string
  code: string
  name: string
  description?: string
  space_id?: string
  thread_id?: string
  created_at: string
  updated_at: string
  last_synced_at?: string
}

export interface KintoneField {
  id: string
  kintone_app_id: string
  field_code: string
  field_label: string
  field_type: string
  required: boolean
  options?: any
  created_at: string
  updated_at: string
}

// Get Kintone apps for a connector
export async function getKintoneApps(connectorId: string): Promise<KintoneApp[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('kintone_apps')
    .select()
    .eq('connector_id', connectorId)
    .order('name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone apps: ${error.message}`)
  }
  
  return data || []
}

// Get Kintone fields for an app
export async function getKintoneFields(kintoneAppId: string): Promise<KintoneField[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('kintone_fields')
    .select()
    .eq('kintone_app_id', kintoneAppId)
    .order('field_label', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone fields: ${error.message}`)
  }
  
  return data || []
}

// Get Kintone apps with field counts
export async function getKintoneAppsWithFieldCounts(connectorId: string): Promise<(KintoneApp & { field_count: number })[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('kintone_apps')
    .select(`
      *,
      kintone_fields(count)
    `)
    .eq('connector_id', connectorId)
    .order('name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone apps with field counts: ${error.message}`)
  }
  
  return (data || []).map(app => ({
    ...app,
    field_count: app.kintone_fields?.[0]?.count || 0
  }))
}
