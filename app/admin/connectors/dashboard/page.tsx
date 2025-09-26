import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/ui/status-dot"
import { KeyValueList } from "@/components/ui/key-value-list"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConnectorList } from "@/components/connectors/connector-list"
import { connectors } from "@/data/connectors"
import { kintoneApps } from "@/data/kintone-apps"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { connectorLogs } from "@/data/connector-logs"
import { Cable, Database, GitBranch, Activity, ExternalLink, AlertCircle, CheckCircle, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface ConnectorDashboardPageProps {
  searchParams: {
    tenantId?: string
    q?: string
  }
}

export default function ConnectorDashboardPage({ searchParams }: ConnectorDashboardPageProps) {
  // For development, use default tenant
  const tenantId = searchParams.tenantId || "550e8400-e29b-41d4-a716-446655440001" // Funtoco
  const searchQuery = searchParams.q

  // Calculate statistics
  const connectedConnectors = connectors.filter((c) => c.status === "connected").length
  const totalConnectors = connectors.length
  const totalApps = kintoneApps.length
  const activeMappings = appMappings.length // Use total count if no status property
  const totalFieldMappings = fieldMappings.length // Use total count if no status property
  const recentLogs = connectorLogs.slice(0, 5)
  const lastSync = connectors.find((c) => c.lastSync)?.lastSync

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            接続済
          </Badge>
        )
      case "disconnected":
        return <Badge variant="secondary">未接続</Badge>
      case "error":
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  const getLogIcon = (type: string) => {
    switch (type) {
      case "oauth_success":
      case "sync_success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "oauth_error":
      case "sync_error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="コネクター管理" 
        description="Kintone 接続の状態とマッピング設定の管理"
        breadcrumbs={[{ label: "コネクター管理" }]}
      />


      {/* Connector List */}
      <ConnectorList 
        tenantId={tenantId} 
        searchQuery={searchQuery}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Connection Status Detail */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>最近のアクティビティ</span>
              </CardTitle>
              <CardDescription>システムの最新の動作ログ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-2">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.message}</p>
                      {log.details && <p className="text-xs text-muted-foreground mt-1">{log.details}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString("ja-JP")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">同期状態</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  {
                    key: "最終同期",
                    value: lastSync ? new Date(lastSync).toLocaleString("ja-JP") : "未実行",
                  },
                  {
                    key: "同期間隔",
                    value: "15分",
                  },
                  {
                    key: "次回同期",
                    value: "13分後",
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Development Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>開発ガイド</span>
              </CardTitle>
              <CardDescription>Kintone OAuth 設定の参考資料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                disabled
                title="参照専用（現在は編集不可）"
              >
                <div>
                  <p className="font-medium text-sm">OAuth クイックガイド</p>
                  <p className="text-xs text-muted-foreground mt-1">基本的な OAuth 設定手順</p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                disabled
                title="参照専用（現在は編集不可）"
              >
                <div>
                  <p className="font-medium text-sm">OAuth クライアント追加手順</p>
                  <p className="text-xs text-muted-foreground mt-1">cybozu.com での設定方法</p>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 text-left"
                disabled
                title="参照専用（現在は編集不可）"
              >
                <div>
                  <p className="font-medium text-sm">API リファレンス</p>
                  <p className="text-xs text-muted-foreground mt-1">Kintone REST API 仕様</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" disabled title="アプリ管理は各コネクターの詳細ページで行います">
                <Database className="h-4 w-4 mr-2" />
                アプリ一覧
              </Button>
              <Button variant="outline" className="w-full" disabled title="参照専用（現在は編集不可）">
                <GitBranch className="h-4 w-4 mr-2" />
                設定変更
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
