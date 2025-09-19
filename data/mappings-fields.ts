export interface FieldMapping {
  id: string
  kintoneFieldId: string
  serviceItemLabel: string
  serviceItemCode: string
  serviceItemType: string
  status: "mapped" | "unmapped" | "error"
  createdAt: string
}

export const fieldMappings: FieldMapping[] = [
  // 顧客管理マッピング
  {
    id: "field-mapping-1",
    kintoneFieldId: "field-1",
    serviceItemLabel: "Company Name",
    serviceItemCode: "company_name",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-15T10:30:00Z",
  },
  {
    id: "field-mapping-2",
    kintoneFieldId: "field-2",
    serviceItemLabel: "Contact Person",
    serviceItemCode: "contact_person",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-15T10:35:00Z",
  },
  {
    id: "field-mapping-3",
    kintoneFieldId: "field-3",
    serviceItemLabel: "Email Address",
    serviceItemCode: "email_address",
    serviceItemType: "email",
    status: "mapped",
    createdAt: "2024-02-15T10:40:00Z",
  },
  // 案件管理マッピング
  {
    id: "field-mapping-4",
    kintoneFieldId: "field-6",
    serviceItemLabel: "Project Title",
    serviceItemCode: "project_title",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-20T15:00:00Z",
  },
  {
    id: "field-mapping-5",
    kintoneFieldId: "field-7",
    serviceItemLabel: "Customer Reference",
    serviceItemCode: "customer_ref",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-20T15:05:00Z",
  },
  // 人材管理マッピング
  {
    id: "field-mapping-6",
    kintoneFieldId: "field-11",
    serviceItemLabel: "Person Name",
    serviceItemCode: "name",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-25T11:30:00Z",
  },
  {
    id: "field-mapping-7",
    kintoneFieldId: "field-12",
    serviceItemLabel: "Nationality",
    serviceItemCode: "nationality",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-25T11:35:00Z",
  },
  {
    id: "field-mapping-8",
    kintoneFieldId: "field-14",
    serviceItemLabel: "Employee Number",
    serviceItemCode: "employeeNumber",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-25T11:40:00Z",
  },
  {
    id: "field-mapping-9",
    kintoneFieldId: "field-15",
    serviceItemLabel: "Working Status",
    serviceItemCode: "workingStatus",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-25T11:45:00Z",
  },
  // ビザ管理マッピング
  {
    id: "field-mapping-10",
    kintoneFieldId: "field-16",
    serviceItemLabel: "Visa Type",
    serviceItemCode: "type",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-28T14:30:00Z",
  },
  {
    id: "field-mapping-11",
    kintoneFieldId: "field-17",
    serviceItemLabel: "Visa Status",
    serviceItemCode: "status",
    serviceItemType: "string",
    status: "mapped",
    createdAt: "2024-02-28T14:35:00Z",
  },
  {
    id: "field-mapping-12",
    kintoneFieldId: "field-18",
    serviceItemLabel: "Expiry Date",
    serviceItemCode: "expiryDate",
    serviceItemType: "date",
    status: "mapped",
    createdAt: "2024-02-28T14:40:00Z",
  },
]
