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

// Get Kintone apps for a connector (updated to use app_mappings)
export async function getKintoneApps(connectorId: string): Promise<KintoneApp[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('app_mappings')
    .select()
    .eq('connector_id', connectorId)
    .order('kintone_app_name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone apps: ${error.message}`)
  }
  
  return (data || []).map(app => ({
    id: app.id,
    connector_id: app.connector_id,
    app_id: app.kintone_app_id,
    code: app.kintone_app_code,
    name: app.kintone_app_name,
    description: app.description,
    created_at: app.created_at,
    updated_at: app.updated_at
  }))
}

// Get Kintone fields for an app (updated to use field_mappings)
export async function getKintoneFields(kintoneAppId: string): Promise<KintoneField[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('field_mappings')
    .select()
    .eq('mapping_app_id', kintoneAppId)
    .order('kintone_field_label', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone fields: ${error.message}`)
  }
  
  return (data || []).map(field => ({
    id: field.id,
    kintone_app_id: field.mapping_app_id,
    field_code: field.kintone_field_code,
    field_label: field.kintone_field_label,
    field_type: field.kintone_field_type,
    required: false, // Default value since it's not in field_mappings
    created_at: field.created_at,
    updated_at: field.updated_at
  }))
}

// Get Kintone apps with field counts (updated to use app_mappings)
export async function getKintoneAppsWithFieldCounts(connectorId: string): Promise<(KintoneApp & { field_count: number })[]> {
  const supabase = getServerClient()
  
  const { data, error } = await supabase
    .from('app_mappings')
    .select(`
      *,
      field_mappings(count)
    `)
    .eq('connector_id', connectorId)
    .order('kintone_app_name', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to get Kintone apps with field counts: ${error.message}`)
  }
  
  return (data || []).map(app => ({
    id: app.id,
    connector_id: app.connector_id,
    app_id: app.kintone_app_id,
    code: app.kintone_app_code,
    name: app.kintone_app_name,
    description: app.description,
    created_at: app.created_at,
    updated_at: app.updated_at,
    field_count: app.field_mappings?.[0]?.count || 0
  }))
}
