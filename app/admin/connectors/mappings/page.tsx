"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { kintoneApps } from "@/data/kintone-apps"
import { kintoneFields } from "@/data/kintone-fields"
import { appMappings } from "@/data/mappings-apps"
import { fieldMappings } from "@/data/mappings-fields"
import { GitBranch, Search, Plus, Settings, Filter, Database, FileText } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MappingsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter mappings based on search term
  const filteredAppMappings = appMappings.filter((mapping) => {
    const app = kintoneApps.find((a) => a.id === mapping.kintoneAppId)
    return (
      mapping.serviceFunctionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.appCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const filteredFieldMappings = fieldMappings.filter((mapping) => {
    const field = kintoneFields.find((f) => f.id === mapping.kintoneFieldId)
    return (
      mapping.serviceItemLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field?.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

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
      case "error":
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="マッピング管理"
        description="Kintone アプリとサービス機能のマッピング設定"
        breadcrumbs={[{ label: "概要", href: "/admin/connectors/dashboard" }, { label: "マッピング管理" }]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
            <Button disabled title="参照専用（現在は編集不可）">
              <Plus className="h-4 w-4 mr-2" />
              マッピング追加
            </Button>
          </div>
        }
      />

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>マッピング一覧</span>
              </CardTitle>
              <CardDescription>アプリマッピング: {appMappings.length}件、フィールドマッピング: {fieldMappings.length}件</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="マッピング名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

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
              {filteredAppMappings.length === 0 ? (
                <EmptyState
                  icon={<Database className="h-12 w-12" />}
                  title={searchTerm ? "検索結果が見つかりません" : "アプリマッピングがありません"}
                  description={
                    searchTerm ? "検索条件に一致するマッピングが見つかりませんでした。" : "まだアプリマッピングが設定されていません。"
                  }
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kintone アプリ名</TableHead>
                      <TableHead>アプリコード</TableHead>
                      <TableHead>サービス機能名</TableHead>
                      <TableHead>機能コード</TableHead>
                      <TableHead>ステータス</TableHead>
                      <TableHead>作成日</TableHead>
                      <TableHead className="text-right">アクション</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppMappings.map((mapping) => {
                      const app = kintoneApps.find((a) => a.id === mapping.kintoneAppId)
                      return (
                        <TableRow key={mapping.id}>
                          <TableCell className="font-medium">{app?.name}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-muted px-1 py-0.5 rounded">{app?.appCode}</code>
                          </TableCell>
                          <TableCell>{mapping.serviceFunctionName}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-muted px-1 py-0.5 rounded">{mapping.serviceFunctionCode}</code>
                          </TableCell>
                          <TableCell>{getStatusBadge(mapping.status)}</TableCell>
                          <TableCell>{new Date(mapping.createdAt).toLocaleDateString("ja-JP")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" disabled title="アプリ管理は各コネクターの詳細ページで行います">
                              詳細
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>フィールドマッピング</span>
              </CardTitle>
              <CardDescription>Kintone フィールドとサービス項目の対応関係</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFieldMappings.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-12 w-12" />}
                  title={searchTerm ? "検索結果が見つかりません" : "フィールドマッピングがありません"}
                  description={
                    searchTerm ? "検索条件に一致するマッピングが見つかりませんでした。" : "まだフィールドマッピングが設定されていません。"
                  }
                />
              ) : (
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
                      <TableHead>ステータス</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFieldMappings.map((mapping) => {
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

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アプリマッピング</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appMappings.length}</div>
            <p className="text-xs text-muted-foreground">総マッピング数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブ</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appMappings.filter((m) => m.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">アクティブなマッピング</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">フィールドマッピング</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fieldMappings.length}</div>
            <p className="text-xs text-muted-foreground">総フィールド数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">マッピング済み</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fieldMappings.filter((m) => m.status === "mapped").length}</div>
            <p className="text-xs text-muted-foreground">設定済みフィールド</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
