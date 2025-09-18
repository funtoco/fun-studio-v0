"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KeyValueList } from "@/components/ui/key-value-list"
import { EmptyState } from "@/components/ui/empty-state"
import { kintoneApps } from "@/data/kintone-apps"
import { kintoneFields } from "@/data/kintone-fields"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { Database, Settings, GitBranch, FileText, CheckCircle, XCircle } from "lucide-react"
import { use } from "react"

interface PageProps {
  params: Promise<{ appCode: string }>
}

export default function KintoneAppDetailPage({ params }: PageProps) {
  const { appCode } = use(params)

  // Find the app by appCode
  const app = kintoneApps.find((a) => a.appCode === appCode)

  if (!app) {
    return (
      <div className="space-y-6 p-6">
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="アプリが見つかりません"
          description="指定されたアプリコードのアプリが存在しません。"
        />
      </div>
    )
  }

  // Get fields for this app
  const appFields = kintoneFields.filter((field) => field.appId === app.id)

  // Get mappings for this app
  const appMapping = appMappings.find((mapping) => mapping.kintoneAppId === app.id)
  const relatedFieldMappings = fieldMappings.filter((mapping) =>
    appFields.some((field) => field.id === mapping.kintoneFieldId),
  )

  const getFieldTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      SINGLE_LINE_TEXT: { label: "単行テキスト", variant: "outline" },
      MULTI_LINE_TEXT: { label: "複数行テキスト", variant: "outline" },
      NUMBER: { label: "数値", variant: "secondary" },
      DATE: { label: "日付", variant: "secondary" },
      DATETIME: { label: "日時", variant: "secondary" },
      DROP_DOWN: { label: "ドロップダウン", variant: "default" },
      CHECK_BOX: { label: "チェックボックス", variant: "default" },
      USER_SELECT: { label: "ユーザー選択", variant: "default" },
    }

    const config = typeConfig[type] || { label: type, variant: "outline" as const }
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "mapped":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            {status === "active" ? "アクティブ" : "マッピング済"}
          </Badge>
        )
      case "inactive":
      case "unmapped":
        return <Badge variant="secondary">{status === "inactive" ? "非アクティブ" : "未マッピング"}</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={app.name}
        description={`アプリコード: ${app.appCode}`}
        breadcrumbs={[
          { label: "ダッシュボード", href: "/admin/connectors/dashboard" },
          { label: "Kintone アプリ", href: "/admin/connectors/kintone/apps" },
          { label: app.name },
        ]}
        actions={
          <div className="flex items-center space-x-2">
            {appMapping && getStatusBadge(appMapping.status)}
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4 mr-2" />
              設定変更
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="fields" className="space-y-4">
            <TabsList>
              <TabsTrigger value="fields">フィールド</TabsTrigger>
              <TabsTrigger value="mappings">関連マッピング</TabsTrigger>
            </TabsList>

            <TabsContent value="fields">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>フィールド一覧</span>
                  </CardTitle>
                  <CardDescription>このアプリに含まれる {appFields.length} 個のフィールド</CardDescription>
                </CardHeader>
                <CardContent>
                  {appFields.length === 0 ? (
                    <EmptyState
                      icon={<FileText className="h-8 w-8" />}
                      title="フィールドがありません"
                      description="このアプリにはフィールドが設定されていません。"
                    />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ラベル</TableHead>
                          <TableHead>コード</TableHead>
                          <TableHead>型</TableHead>
                          <TableHead>必須</TableHead>
                          <TableHead>備考</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appFields.map((field) => (
                          <TableRow key={field.id}>
                            <TableCell className="font-medium">{field.label}</TableCell>
                            <TableCell>
                              <code className="text-sm bg-muted px-1 py-0.5 rounded">{field.code}</code>
                            </TableCell>
                            <TableCell>{getFieldTypeBadge(field.type)}</TableCell>
                            <TableCell>
                              {field.required ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{field.description || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mappings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <span>関連マッピング</span>
                  </CardTitle>
                  <CardDescription>このアプリに関連するフィールドマッピング</CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedFieldMappings.length === 0 ? (
                    <EmptyState
                      icon={<GitBranch className="h-8 w-8" />}
                      title="マッピングがありません"
                      description="このアプリのフィールドはまだマッピングされていません。"
                    />
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kintone フィールド</TableHead>
                          <TableHead>フィールドコード</TableHead>
                          <TableHead className="text-center">→</TableHead>
                          <TableHead>サービス項目</TableHead>
                          <TableHead>項目コード</TableHead>
                          <TableHead>ステータス</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatedFieldMappings.map((mapping) => {
                          const field = appFields.find((f) => f.id === mapping.kintoneFieldId)
                          return (
                            <TableRow key={mapping.id}>
                              <TableCell className="font-medium">{field?.label}</TableCell>
                              <TableCell>
                                <code className="text-sm bg-muted px-1 py-0.5 rounded">{field?.code}</code>
                              </TableCell>
                              <TableCell className="text-center">→</TableCell>
                              <TableCell>{mapping.serviceItemLabel}</TableCell>
                              <TableCell>
                                <code className="text-sm bg-muted px-1 py-0.5 rounded">{mapping.serviceItemCode}</code>
                              </TableCell>
                              <TableCell>{getStatusBadge(mapping.status)}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">アプリ情報</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  {
                    key: "アプリ名",
                    value: app.name,
                  },
                  {
                    key: "アプリコード",
                    value: <code className="text-sm">{app.appCode}</code>,
                  },
                  {
                    key: "フィールド数",
                    value: `${appFields.length} フィールド`,
                  },
                  {
                    key: "最終更新",
                    value: new Date(app.updatedAt).toLocaleDateString("ja-JP"),
                  },
                ]}
              />
            </CardContent>
          </Card>

          {/* Mapping Status */}
          {appMapping && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">マッピング状態</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyValueList
                  items={[
                    {
                      key: "サービス機能",
                      value: appMapping.serviceFunctionName,
                    },
                    {
                      key: "機能コード",
                      value: <code className="text-sm">{appMapping.serviceFunctionCode}</code>,
                    },
                    {
                      key: "ステータス",
                      value: getStatusBadge(appMapping.status),
                    },
                    {
                      key: "マッピング作成日",
                      value: new Date(appMapping.createdAt).toLocaleDateString("ja-JP"),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          )}

          {/* Field Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">フィールド統計</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList
                items={[
                  {
                    key: "必須フィールド",
                    value: `${appFields.filter((f) => f.required).length} 個`,
                  },
                  {
                    key: "任意フィールド",
                    value: `${appFields.filter((f) => !f.required).length} 個`,
                  },
                  {
                    key: "マッピング済み",
                    value: `${relatedFieldMappings.filter((m) => m.status === "mapped").length} 個`,
                  },
                  {
                    key: "未マッピング",
                    value: `${appFields.length - relatedFieldMappings.filter((m) => m.status === "mapped").length} 個`,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
