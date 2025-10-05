/**
 * Mapping types for Kintone integration
 * Simplified structure without separate kintone_apps and kintone_fields tables
 */

export interface MappingApp {
  id: string
  connector_id: string
  source_app_id: string // Kintone app ID (e.g., "13")
  source_app_name: string // Kintone app name (e.g., "就労_就労管理")
  target_app_type: string // Target app type (people, visas, meetings, etc.)
  is_active: boolean
  skip_if_no_update_target: boolean // Whether to skip records when no update target is found
  created_at: string
  updated_at: string
}

export interface MappingField {
  id: string
  connector_id: string
  app_mapping_id: string // Reference to connector_app_mappings
  source_field_id: string // Kintone field code for API calls
  source_field_code?: string // Kintone field code
  source_field_name?: string // Display name of the Kintone field
  source_field_type?: string // Kintone field type (SINGLE_LINE_TEXT, etc.)
  target_field_id: string // Field name in our system
  target_field_code?: string // Field code in our system
  target_field_name?: string // Field display name in our system
  target_field_type?: string // Field type in our system
  is_required: boolean
  is_active: boolean
  is_update_key: boolean // Whether this field should be used as an update key for Supabase operations
  sort_order?: number
  created_at: string
  updated_at: string
}

export interface MappingAppWithFields extends MappingApp {
  fields: MappingField[]
}

export interface MappingFilter {
  id: string
  connector_id: string
  app_mapping_id: string // Reference to connector_app_mappings
  field_code: string // Kintone field code for filtering
  field_name?: string // Display name of the Kintone field
  field_type?: string // Kintone field type (SINGLE_LINE_TEXT, etc.)
  filter_value: string // Filter value for equality comparison
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MappingAppWithFilters extends MappingApp {
  filters: MappingFilter[]
}

// Helper types for API responses
export interface MappingAppResponse {
  success: boolean
  data?: MappingApp
  error?: string
}

export interface MappingFieldResponse {
  success: boolean
  data?: MappingField
  error?: string
}

export interface MappingAppsListResponse {
  success: boolean
  data?: MappingApp[]
  error?: string
}

export interface MappingFieldsListResponse {
  success: boolean
  data?: MappingField[]
  error?: string
}

export interface MappingFilterResponse {
  success: boolean
  data?: MappingFilter
  error?: string
}

export interface MappingFiltersListResponse {
  success: boolean
  data?: MappingFilter[]
  error?: string
}

// Field mapping configuration for sync
export interface FieldMappingConfig {
  kintoneApp: string
  fields: Record<string, string> // internal_field_name -> kintone_field_code
}

// Predefined field mappings for common use cases
export const FIELD_MAPPINGS: Record<string, FieldMappingConfig> = {
  people: {
    kintoneApp: 'PEOPLE',
    fields: {
      'name': '氏名',
      'kana': 'フリガナ',
      'nationality': '国籍',
      'dob': '生年月日',
      'phone': '電話番号',
      'email': 'メールアドレス',
      'address': '住所',
      'employee_number': '従業員番号',
      'working_status': '就労ステータス',
      'specific_skill_field': '特定技能分野',
      'residence_card_no': '在留カード番号',
      'residence_card_expiry_date': '在留カード有効期限',
      'residence_card_issued_date': '在留カード交付日'
    }
  },
  visas: {
    kintoneApp: 'VISAS',
    fields: {
      'person_id': '人材ID',
      'type': 'ビザ種類',
      'status': 'ステータス',
      'expiry_date': '有効期限',
      'submitted_at': '申請日',
      'result_at': '結果日',
      'manager': '担当者'
    }
  }
}
