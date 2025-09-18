"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { kintoneApps } from "@/data/kintone-apps"
import { kintoneFields } from "@/data/kintone-fields"
import { appMappings } from "@/data/mappings-apps"
import { Database, Search, Plus, Settings, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function KintoneAppsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter apps based on search term
  const filteredApps = kintoneApps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get field count for each app
  const getFieldCount = (appId: string) => {
    return kintoneFields.filter((field) => field.appId === appId).length
  }

  // Get mapping status for each app
  const getMappingStatus = (appId: string) => {
    const mapping = appMappings.find((m) => m.kintoneAppId === appId)
    return mapping?.status || "unmapped"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            アクティブ
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">非アクティブ</Badge>
      case "unmapped":
        return <Badge variant="outline">未マッピング</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Kintone アプリ"
        description="接続されている Kintone アプリの一覧と詳細"
        breadcrumbs={[{ label: "ダッシュボード", href: "/admin/connectors/dashboard" }, { label: "Kintone アプリ" }]}
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
              アプリ追加
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>アプリ一覧</span>
              </CardTitle>
              <CardDescription>{kintoneApps.length} 個のアプリが接続されています</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="アプリ名またはコードで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredApps.length === 0 ? (
            <EmptyState
              icon={<Database className="h-12 w-12" />}
              title={searchTerm ? "検索結果が見つかりません" : "アプリがありません"}
              description={
                searchTerm ? "検索条件に一致するアプリが見つかりませんでした。" : "まだアプリが接続されていません。"
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アプリ名</TableHead>
                  <TableHead>アプリコード</TableHead>
                  <TableHead>フィールド数</TableHead>
                  <TableHead>マッピング状態</TableHead>
                  <TableHead>最終更新</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => (window.location.href = `/admin/connectors/kintone/apps/${app.appCode}`)}
                  >
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{app.appCode}</code>
                    </TableCell>
                    <TableCell>{getFieldCount(app.id)} フィールド</TableCell>
                    <TableCell>{getStatusBadge(getMappingStatus(app.id))}</TableCell>
                    <TableCell>{new Date(app.updatedAt).toLocaleDateString("ja-JP")}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/connectors/kintone/apps/${app.appCode}`}>
                        <Button variant="ghost" size="sm">
                          詳細
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総アプリ数</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kintoneApps.length}</div>
            <p className="text-xs text-muted-foreground">接続済みアプリ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">マッピング済み</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appMappings.filter((m) => m.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">アクティブなマッピング</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総フィールド数</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kintoneFields.length}</div>
            <p className="text-xs text-muted-foreground">全アプリ合計</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
