/**
 * Mapping types for Kintone integration
 * Simplified structure without separate kintone_apps and kintone_fields tables
 */

export interface MappingApp {
  id: string
  connector_id: string
  kintone_app_id: string // Kintone app ID (numeric string)
  kintone_app_code: string // Kintone app code for API calls
  kintone_app_name: string // Display name of the Kintone app
  internal_app_type: string // 'people', 'visa', etc.
  internal_app_name: string // Display name for internal app
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MappingField {
  id: string
  mapping_app_id: string
  kintone_field_code: string // Kintone field code for API calls
  kintone_field_label: string // Display name of the Kintone field
  kintone_field_type: string // Kintone field type (SINGLE_LINE_TEXT, etc.)
  internal_field_name: string // Field name in our system
  internal_field_type: string // Field type in our system
  is_required: boolean
  transformation_rule?: Record<string, any> // Any data transformation rules
  created_at: string
  updated_at: string
}

export interface MappingAppWithFields extends MappingApp {
  fields: MappingField[]
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
