/**
 * Value Mapper Utility
 * Handles value mapping between Kintone and service fields
 */

import { createClient } from '@supabase/supabase-js'

export interface ValueMappingRule {
  id: string
  source_value: string
  target_value: string
  is_active: boolean
  sort_order: number
}

export interface DataMapping {
  id: string
  app_mapping_id: string
  field_name: string
  field_type: string
  is_active: boolean
  value_mappings: ValueMappingRule[]
}

/**
 * Get data mappings for a specific app mapping
 */
export async function getDataMappings(appMappingId: string): Promise<DataMapping[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  console.log(`[ValueMapper] Fetching data mappings for app mapping: ${appMappingId}`)

  const { data: dataMappings, error } = await supabase
    .from('data_mappings')
    .select(`
      id,
      app_mapping_id,
      field_name,
      field_type,
      is_active,
      field_value_mappings (
        id,
        source_value,
        target_value,
        is_active,
        sort_order
      )
    `)
    .eq('app_mapping_id', appMappingId)
    .eq('is_active', true)
    .order('field_name', { ascending: true })

  if (error) {
    console.error('Error fetching data mappings:', error)
    return []
  }

  console.log(`[ValueMapper] Found ${dataMappings?.length || 0} data mappings`)
  dataMappings?.forEach(mapping => {
    console.log(`[ValueMapper] Field: ${mapping.field_name}, Value mappings: ${mapping.field_value_mappings?.length || 0}`)
  })

  return dataMappings?.map(mapping => ({
    ...mapping,
    value_mappings: mapping.field_value_mappings || []
  })) || []
}

/**
 * Map a value using the configured mapping rules
 */
export function mapValue(
  value: any,
  dataMapping: DataMapping
): any {
  console.log(`[ValueMapper] Mapping value: "${value}" for field: ${dataMapping.field_name}`)
  
  if (!value || !dataMapping || !dataMapping.value_mappings?.length) {
    console.log(`[ValueMapper] No mapping needed - value: ${value}, mappings: ${dataMapping.value_mappings?.length || 0}`)
    return value
  }

  // Convert value to string for comparison
  const stringValue = String(value).trim()
  console.log(`[ValueMapper] Looking for mapping: "${stringValue}"`)

  // Find matching mapping rule
  const activeMappings = dataMapping.value_mappings
    .filter(mapping => mapping.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)

  console.log(`[ValueMapper] Active mappings: ${activeMappings.length}`)
  activeMappings.forEach(mapping => {
    console.log(`[ValueMapper]   "${mapping.source_value}" -> "${mapping.target_value}"`)
  })

  for (const mapping of activeMappings) {
    if (mapping.source_value === stringValue) {
      console.log(`[ValueMapper] Found mapping: "${stringValue}" -> "${mapping.target_value}"`)
      return mapping.target_value
    }
  }

  // If no mapping found, return original value
  console.log(`[ValueMapper] No mapping found for: "${stringValue}", returning original value`)
  return value
}

/**
 * Map multiple field values using data mappings
 */
export function mapFieldValues(
  record: Record<string, any>,
  dataMappings: DataMapping[]
): Record<string, any> {
  const mappedRecord = { ...record }

  for (const dataMapping of dataMappings) {
    const fieldName = dataMapping.field_name
    const originalValue = record[fieldName]

    if (originalValue !== undefined) {
      const mappedValue = mapValue(originalValue, dataMapping)
      mappedRecord[fieldName] = mappedValue
    }
  }

  return mappedRecord
}

/**
 * Get status mapping for visas (example implementation)
 */
export function getVisasStatusMapping(): Record<string, string[]> {
  return {
    '書類準備中': [
      '営業_企業情報待ち',
      '新規_企業情報待ち', 
      '既存_企業情報待ち', 
      '支援_更新案内・人材情報更新待ち'
    ],
    '書類作成中': ['OP_企業書類作成中'],
    '書類確認中': [
      '営業_企業に確認してください',
      '新規_企業に確認してください',
      '既存_企業に確認してください',
      'OP_企業に確認してください',
      '新規_企業_書類確認待ち',
      '既存_企業_書類確認待ち',
      '企業_書類確認待ち（新規）',
      '企業_書類確認待ち（更新）',
      'OP_書類修正中',
    ],
    '申請準備中': [
      'OP_押印書類送付準備中',
      'OP_押印書類受取待ち',
      'OP_申請人サイン書類準備中',
      '支援_申請人サイン待ち',
      'OP_申請人サイン書類受取待ち',
    ],
    'ビザ申請準備中': ['ビザ申請準備中','ビザ申請待ち'],
    '申請中': ['申請中'],
    '(追加書類)': ['追加修正対応中'],
    'ビザ取得済み': ['許可'],
  }
}

/**
 * Map visas status using the predefined mapping
 */
export function mapVisasStatus(kintoneStatus: string): string {
  const statusMapping = getVisasStatusMapping()
  
  for (const [targetStatus, sourceStatuses] of Object.entries(statusMapping)) {
    if (sourceStatuses.includes(kintoneStatus)) {
      return targetStatus
    }
  }
  
  // If no mapping found, return original status
  return kintoneStatus
}

/**
 * Create data mapping for visas status field
 */
export async function createVisasStatusMapping(appMappingId: string): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const statusMapping = getVisasStatusMapping()

  // Create data mapping for status field
  const { data: dataMapping, error: dataMappingError } = await supabase
    .from('data_mappings')
    .insert({
      app_mapping_id: appMappingId,
      field_name: 'status',
      field_type: 'string',
      is_active: true
    })
    .select()
    .single()

  if (dataMappingError) {
    console.error('Error creating data mapping:', dataMappingError)
    throw new Error('Failed to create data mapping')
  }

  // Create value mappings
  const valueMappings = []
  for (const [targetStatus, sourceStatuses] of Object.entries(statusMapping)) {
    for (let i = 0; i < sourceStatuses.length; i++) {
      valueMappings.push({
        data_mapping_id: dataMapping.id,
        source_value: sourceStatuses[i],
        target_value: targetStatus,
        is_active: true,
        sort_order: i
      })
    }
  }

  const { error: valueMappingsError } = await supabase
    .from('field_value_mappings')
    .insert(valueMappings)

  if (valueMappingsError) {
    console.error('Error creating value mappings:', valueMappingsError)
    throw new Error('Failed to create value mappings')
  }
}
