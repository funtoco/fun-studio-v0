import { createClient } from '@/lib/supabase/client'
import type { MappingField } from '@/lib/types/mappings'

/**
 * Get update keys for a specific app mapping
 * @param appMappingId - The app mapping ID
 * @returns Array of field names that should be used as update keys
 */
export async function getUpdateKeys(appMappingId: string): Promise<string[]> {
  const supabase = createClient()
  
  const { data: fieldMappings, error } = await supabase
    .from('connector_field_mappings')
    .select('target_field_id')
    .eq('app_mapping_id', appMappingId)
    .eq('is_update_key', true)
    .eq('is_active', true)
  
  if (error) {
    console.error('Error fetching update keys:', error)
    return ['id'] // Fallback to default id field
  }
  
  const updateKeys = fieldMappings?.map(fm => fm.target_field_id) || []
  
  // If no update keys are configured, fallback to 'id'
  if (updateKeys.length === 0) {
    console.warn('No update keys configured, falling back to "id"')
    return ['id']
  }
  
  return updateKeys
}

/**
 * Get update keys for a specific connector and target app type
 * @param connectorId - The connector ID
 * @param targetAppType - The target app type (people, visas, meetings)
 * @returns Array of field names that should be used as update keys
 */
export async function getUpdateKeysByConnector(
  connectorId: string, 
  targetAppType: string
): Promise<string[]> {
  const supabase = createClient()
  
  // First get the app mapping for this connector and target type
  const { data: appMapping, error: appError } = await supabase
    .from('connector_app_mappings')
    .select('id')
    .eq('connector_id', connectorId)
    .eq('target_app_type', targetAppType)
    .eq('is_active', true)
    .single()
  
  if (appError || !appMapping) {
    console.error('Error fetching app mapping:', appError)
    return ['id'] // Fallback to default id field
  }
  
  return getUpdateKeys(appMapping.id)
}

/**
 * Build upsert conflict columns string for Supabase
 * @param updateKeys - Array of field names to use as update keys
 * @returns Comma-separated string of conflict columns
 */
export function buildConflictColumns(updateKeys: string[]): string {
  return updateKeys.join(',')
}

/**
 * Build update condition object for Supabase where clause
 * @param data - The data object containing field values
 * @param updateKeys - Array of field names to use as update keys
 * @returns Object with update key conditions
 */
export function buildUpdateCondition(data: Record<string, any>, updateKeys: string[]): Record<string, any> {
  const condition: Record<string, any> = {}
  
  for (const key of updateKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      condition[key] = data[key]
    }
  }
  
  return condition
}
