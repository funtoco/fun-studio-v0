export interface LogEntry {
  id: string
  timestamp: string
  type: "oauth_success" | "oauth_error" | "scope_update" | "mapping_update" | "sync_success" | "sync_error"
  message: string
  details?: string
  connectorId: string
}

export const connectorLogs: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "2024-03-10T14:30:00Z",
    type: "sync_success",
    message: "データ同期が正常に完了しました",
    details: "5つのアプリから合計247件のレコードを同期",
    connectorId: "kintone-main",
  },
  {
    id: "log-2",
    timestamp: "2024-03-10T09:15:00Z",
    type: "oauth_success",
    message: "OAuth認証が更新されました",
    details: "アクセストークンを正常に更新",
    connectorId: "kintone-main",
  },
  {
    id: "log-3",
    timestamp: "2024-03-09T16:45:00Z",
    type: "oauth_error",
    message: "OAuth認証でエラーが発生しました",
    details: "リフレッシュトークンの有効期限が切れています",
    connectorId: "kintone-dev",
  },
  {
    id: "log-4",
    timestamp: "2024-03-08T11:20:00Z",
    type: "mapping_update",
    message: "フィールドマッピングが更新されました",
    details: "人材管理アプリに新しいフィールドマッピングを追加",
    connectorId: "kintone-main",
  },
  {
    id: "log-5",
    timestamp: "2024-03-07T15:30:00Z",
    type: "scope_update",
    message: "OAuthスコープが更新されました",
    details: "k:app_record:read スコープを追加",
    connectorId: "kintone-main",
  },
  {
    id: "log-6",
    timestamp: "2024-03-06T09:15:00Z",
    type: "sync_success",
    message: "ビザ管理データの同期完了",
    details: "ビザ管理アプリから50件のレコードを同期",
    connectorId: "kintone-main",
  },
  {
    id: "log-7",
    timestamp: "2024-03-05T13:45:00Z",
    type: "mapping_update",
    message: "アプリマッピングが追加されました",
    details: "人材管理アプリをPeople Managementにマッピング",
    connectorId: "kintone-main",
  },
  {
    id: "log-8",
    timestamp: "2024-03-04T16:20:00Z",
    type: "sync_error",
    message: "同期処理でエラーが発生",
    details: "ビザ管理アプリへのアクセス権限が不足しています",
    connectorId: "kintone-dev",
  },
]
