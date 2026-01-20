export interface Connector {
  id: string
  name: string
  type: "kintone"
  status: "connected" | "disconnected" | "error"
  subdomain: string
  oauthClientName: string
  createdAt: string
  updatedAt: string
  lastSync?: string
}

export const connectors: Connector[] = [
  {
    id: "kintone-main",
    name: "Kintone Main Connector",
    type: "kintone",
    status: "connected",
    subdomain: "example",
    oauthClientName: "FunBase OAuth Client",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-03-10T14:30:00Z",
    lastSync: "2024-03-10T14:30:00Z",
  },
  {
    id: "kintone-dev",
    name: "Kintone Development",
    type: "kintone",
    status: "error",
    subdomain: "dev-example",
    oauthClientName: "Dev OAuth Client",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-03-09T16:45:00Z",
  },
]
