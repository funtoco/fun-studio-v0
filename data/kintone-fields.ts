export interface KintoneField {
  id: string
  appId: string
  label: string
  code: string
  type:
    | "SINGLE_LINE_TEXT"
    | "MULTI_LINE_TEXT"
    | "NUMBER"
    | "DATE"
    | "DATETIME"
    | "DROP_DOWN"
    | "CHECK_BOX"
    | "USER_SELECT"
  required: boolean
  description?: string
}

export const kintoneFields: KintoneField[] = [
  // 顧客管理アプリのフィールド
  {
    id: "field-1",
    appId: "app-1",
    label: "会社名",
    code: "company_name",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-2",
    appId: "app-1",
    label: "担当者名",
    code: "contact_name",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-3",
    appId: "app-1",
    label: "メールアドレス",
    code: "email",
    type: "SINGLE_LINE_TEXT",
    required: false,
  },
  {
    id: "field-4",
    appId: "app-1",
    label: "電話番号",
    code: "phone",
    type: "SINGLE_LINE_TEXT",
    required: false,
  },
  {
    id: "field-5",
    appId: "app-1",
    label: "業界",
    code: "industry",
    type: "DROP_DOWN",
    required: false,
  },
  // 案件管理アプリのフィールド
  {
    id: "field-6",
    appId: "app-2",
    label: "案件名",
    code: "project_name",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-7",
    appId: "app-2",
    label: "顧客",
    code: "customer",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-8",
    appId: "app-2",
    label: "開始日",
    code: "start_date",
    type: "DATE",
    required: true,
  },
  {
    id: "field-9",
    appId: "app-2",
    label: "終了予定日",
    code: "end_date",
    type: "DATE",
    required: false,
  },
  {
    id: "field-10",
    appId: "app-2",
    label: "ステータス",
    code: "status",
    type: "DROP_DOWN",
    required: true,
  },
  // 人材管理アプリのフィールド
  {
    id: "field-11",
    appId: "app-4",
    label: "氏名",
    code: "name",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-12",
    appId: "app-4",
    label: "国籍",
    code: "nationality",
    type: "DROP_DOWN",
    required: true,
  },
  {
    id: "field-13",
    appId: "app-4",
    label: "生年月日",
    code: "dob",
    type: "DATE",
    required: false,
  },
  {
    id: "field-14",
    appId: "app-4",
    label: "従業員番号",
    code: "employee_number",
    type: "SINGLE_LINE_TEXT",
    required: true,
  },
  {
    id: "field-15",
    appId: "app-4",
    label: "就労ステータス",
    code: "working_status",
    type: "DROP_DOWN",
    required: true,
  },
  // ビザ管理アプリのフィールド
  {
    id: "field-16",
    appId: "app-5",
    label: "ビザ種類",
    code: "visa_type",
    type: "DROP_DOWN",
    required: true,
  },
  {
    id: "field-17",
    appId: "app-5",
    label: "ビザステータス",
    code: "visa_status",
    type: "DROP_DOWN",
    required: true,
  },
  {
    id: "field-18",
    appId: "app-5",
    label: "有効期限",
    code: "expiry_date",
    type: "DATE",
    required: false,
  },
  {
    id: "field-19",
    appId: "app-5",
    label: "担当者",
    code: "manager",
    type: "USER_SELECT",
    required: false,
  },
]
