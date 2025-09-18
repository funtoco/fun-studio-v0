export interface AppMapping {
  id: string
  kintoneAppId: string
  serviceFunctionName: string
  serviceFunctionCode: string
  status: "active" | "inactive" | "error"
  createdAt: string
}

export const appMappings: AppMapping[] = [
  {
    id: "mapping-1",
    kintoneAppId: "app-1",
    serviceFunctionName: "Customer Management",
    serviceFunctionCode: "CUSTOMER_MGMT",
    status: "active",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "mapping-2",
    kintoneAppId: "app-2",
    serviceFunctionName: "Project Tracking",
    serviceFunctionCode: "PROJECT_TRACK",
    status: "active",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "mapping-3",
    kintoneAppId: "app-3",
    serviceFunctionName: "Task Management",
    serviceFunctionCode: "TASK_MGMT",
    status: "inactive",
    createdAt: "2024-03-01T09:15:00Z",
  },
  {
    id: "mapping-4",
    kintoneAppId: "app-4",
    serviceFunctionName: "People Management",
    serviceFunctionCode: "PEOPLE_MGMT",
    status: "active",
    createdAt: "2024-02-25T11:00:00Z",
  },
  {
    id: "mapping-5",
    kintoneAppId: "app-5",
    serviceFunctionName: "Visa Management",
    serviceFunctionCode: "VISA_MGMT",
    status: "active",
    createdAt: "2024-02-28T14:15:00Z",
  },
]
