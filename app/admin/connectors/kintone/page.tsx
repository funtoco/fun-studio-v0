"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { StatusDot } from "@/components/ui/status-dot"
import { KeyValueList } from "@/components/ui/key-value-list"
import { connectors } from "@/data/connectors"
import { kintoneApps } from "@/data/kintone-apps"
import { kintoneFields } from "@/data/kintone-fields"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { connectorLogs } from "@/data/connector-logs"
import { Cable, Settings, ExternalLink, Eye, EyeOff, Activity, Database, GitBranch } from "lucide-react"
import { useState } from "react"

export default function KintoneConnectorDetailPage() {
  const [showClientSecret, setShowClientSecret] = useState(false)

  // Get the main Kintone connector (assuming first connected one)
  const connector = connectors.find((c) => c.type === "kintone" && c.status === "connected") || connectors[0]
  const connectorLogsData = connectorLogs.filter((log) => log.connectorId === connector.id)
  const connectorApps = kintoneApps.filter((app) => app.connectorId === connector.id)
  const connectorAppMappings = appMappings.filter((mapping) =>
    connectorApps.some((app) => app.id === mapping.kintoneAppId),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "mapped":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            {status === "connected" ? "接続済" : status === "active" ? "アクティブ" : "マッピング済"}
          </Badge>
        )
      case "disconnected":
      case "inactive":
      case "unmapped":
        return (
          <Badge variant="secondary">
            {status === "disconnected" ? "未接続" : status === "inactive" ? "非アクティブ" : "未マッピング"}
          </Badge>
        )
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
        return <div className="h-2 w-2 rounded-full bg-green-500" />
      case "oauth_error":
      case "sync_error":
        return <div className="h-2 w-2 rounded-full bg-red-500" />
      default:
        return <div className="h-2 w-2 rounded-full bg-blue-500" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={connector.name}
        description="Kintone コネクターの詳細設定と状態"
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: "/admin/connectors" },
          { label: "Kintone" },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <StatusDot status={connector.status} />
            {getStatusBadge(connector.status)}
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4 mr-2" />
              設定変更
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* OAuth Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cable className="h-5 w-5" />
                <span>OAuth 設定</span>
              </CardTitle>
              <CardDescription>認証設定の詳細情報（参照のみ）</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <KeyValueList
                items={[
                  {
                    key: "クライアント ID",
                    value: (
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {showClientSecret ? "abc123def456ghi789" : "abc123..."}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowClientSecret(!showClientSecret)}
                          title="参照専用（現在は編集不可）"
                        >
                          {showClientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    ),
                  },
                  {
                    key: "リダイレクト URI",
                    value: <code className="text-sm">https://funstudio.example.com/oauth/callback</code>,
                  },
                  {
                    key: "スコープ",
                    value: (
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          k:app_record:read
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          k:app_record:write
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          k:app_settings:read
                        </Badge>
                      </div>
                    ),
                  },
                  {
                    key: "認可状態",
                    value: getStatusBadge("connected"),
                  },
                ]}
              />
              <Separator />
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled title="参照専用（現在は編集不可）">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  OAuth クライアント追加手順を見る
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Connection Info */}
          <Card>
            <CardHeader>
              <CardTitle>接続先情報</CardTitle>
              <CardDescription>Kintone 環境の詳細</CardDescription>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  {
                    key: "サブドメイン",
                    value: <code className="text-sm">{connector.subdomain}</code>,
                  },
                  {
                    key: "環境",
                    value: "本番環境",
                  },
                  {
                    key: "エンドポイント",
                    value: <code className="text-sm">https://{connector.subdomain}.cybozu.com</code>,
                  },
                  {
                    key: "最終接続確認",
                    value: connector.lastSync ? new Date(connector.lastSync).toLocaleString("ja-JP") : "未実行",
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Mappings */}
          <Tabs defaultValue="apps" className="space-y-4">
            <TabsList>
              <TabsTrigger value="apps">アプリマッピング</TabsTrigger>
              <TabsTrigger value="fields">フィールドマッピング</TabsTrigger>
            </TabsList>

            <TabsContent value="apps">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5" />
                    <span>アプリ ↔ 機能マッピング</span>
                  </CardTitle>
                  <CardDescription>Kintone アプリとサービス機能の対応関係</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kintone アプリ名</TableHead>
                        <TableHead>アプリコード</TableHead>
                        <TableHead>サービス機能名</TableHead>
                        <TableHead>ステータス</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connectorAppMappings.map((mapping) => {
                        const app = connectorApps.find((a) => a.id === mapping.kintoneAppId)
                        return (
                          <TableRow key={mapping.id}>
                            <TableCell className="font-medium">{app?.name}</TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">{app?.appCode}</code>
                            </TableCell>
                            <TableCell>{mapping.serviceFunctionName}</TableCell>
                            <TableCell>{getStatusBadge(mapping.status)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fields">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <span>フィールドマッピング</span>
                  </CardTitle>
                  <CardDescription>Kintone フィールドとサービス項目の対応関係</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kintone フィールド</TableHead>
                        <TableHead>フィールドコード</TableHead>
                        <TableHead>型</TableHead>
                        <TableHead className="text-center">→</TableHead>
                        <TableHead>サービス項目</TableHead>
                        <TableHead>項目コード</TableHead>
                        <TableHead>型</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fieldMappings.slice(0, 10).map((mapping) => {
                        const field = kintoneFields.find((f) => f.id === mapping.kintoneFieldId)
                        return (
                          <TableRow key={mapping.id}>
                            <TableCell className="font-medium">{field?.label}</TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">{field?.code}</code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {field?.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">→</TableCell>
                            <TableCell>{mapping.serviceItemLabel}</TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">{mapping.serviceItemCode}</code>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {mapping.serviceItemType}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">統計情報</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  {
                    key: "接続アプリ数",
                    value: connectorApps.length,
                  },
                  {
                    key: "アクティブマッピング",
                    value: connectorAppMappings.filter((m) => m.status === "active").length,
                  },
                  {
                    key: "フィールドマッピング",
                    value: fieldMappings.length,
                  },
                  {
                    key: "最終更新",
                    value: new Date(connector.updatedAt).toLocaleDateString("ja-JP"),
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Recent Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>最近のログ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {connectorLogsData.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    {getLogIcon(log.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString("ja-JP")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
