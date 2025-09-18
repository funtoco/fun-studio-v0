export interface KintoneApp {
  id: string
  name: string
  appCode: string
  fieldCount: number
  updatedAt: string
  connectorId: string
}

export const kintoneApps: KintoneApp[] = [
  {
    id: "app-1",
    name: "顧客管理",
    appCode: "CUSTOMER",
    fieldCount: 12,
    updatedAt: "2024-03-08T11:20:00Z",
    connectorId: "kintone-main",
  },
  {
    id: "app-2",
    name: "案件管理",
    appCode: "PROJECT",
    fieldCount: 18,
    updatedAt: "2024-03-07T15:30:00Z",
    connectorId: "kintone-main",
  },
  {
    id: "app-3",
    name: "タスク管理",
    appCode: "TASK",
    fieldCount: 8,
    updatedAt: "2024-03-06T09:15:00Z",
    connectorId: "kintone-main",
  },
  {
    id: "app-4",
    name: "人材管理",
    appCode: "PEOPLE",
    fieldCount: 15,
    updatedAt: "2024-03-05T13:45:00Z",
    connectorId: "kintone-main",
  },
  {
    id: "app-5",
    name: "ビザ管理",
    appCode: "VISA",
    fieldCount: 22,
    updatedAt: "2024-03-04T16:20:00Z",
    connectorId: "kintone-main",
  },
]
