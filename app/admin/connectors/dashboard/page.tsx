import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusDot } from "@/components/ui/status-dot"
import { KeyValueList } from "@/components/ui/key-value-list"
import { connectors } from "@/data/connectors"
import { kintoneApps } from "@/data/kintone-apps"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { connectorLogs } from "@/data/connector-logs"
import { Cable, Database, GitBranch, Activity, ExternalLink, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function ConnectorDashboardPage() {
  // Calculate statistics
  const connectedConnectors = connectors.filter((c) => c.status === "connected").length
  const totalConnectors = connectors.length
  const totalApps = kintoneApps.length
  const activeMappings = appMappings.filter((m) => m.status === "active").length
  const totalFieldMappings = fieldMappings.filter((m) => m.status === "mapped").length
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
      <PageHeader title="コネクターダッシュボード" description="Kintone 接続の状態とマッピング設定の概要" />

      {/* Status Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">接続状態</CardTitle>
            <Cable className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <StatusDot status={connectedConnectors > 0 ? "connected" : "disconnected"} />
              <div className="text-2xl font-bold">
                {connectedConnectors}/{totalConnectors}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {connectedConnectors > 0 ? "正常に接続中" : "接続されていません"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">設定済みアプリ</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
            <p className="text-xs text-muted-foreground mt-1">Kintone アプリ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アプリマッピング</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMappings}</div>
            <p className="text-xs text-muted-foreground mt-1">アクティブなマッピング</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">フィールドマッピング</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFieldMappings}</div>
            <p className="text-xs text-muted-foreground mt-1">設定済みフィールド</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Connection Status Detail */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cable className="h-5 w-5" />
                <span>接続状態詳細</span>
              </CardTitle>
              <CardDescription>各コネクターの現在の状態</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectors.map((connector) => (
                <div
                  key={connector.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <StatusDot status={connector.status} />
                    <div>
                      <p className="font-medium text-sm">{connector.name}</p>
                      <p className="text-xs text-muted-foreground">{connector.subdomain}.cybozu.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(connector.status)}
                    <Link href={`/admin/connectors/${connector.type}`}>
                      <Button variant="ghost" size="sm">
                        詳細
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

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
            <CardContent className="space-y-2">
              <Link href="/admin/connectors" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  コネクター一覧
                </Button>
              </Link>
              <Link href="/admin/connectors/kintone/apps" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  アプリ一覧
                </Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent" disabled title="参照専用（現在は編集不可）">
                設定変更
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
