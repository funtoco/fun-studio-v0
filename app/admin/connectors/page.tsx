"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { connectors } from "@/data/connectors"
import { Cable, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function ConnectorsPage() {
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

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="コネクター"
        description="Kintone 接続の設定と状態を管理"
        breadcrumbs={[{ label: "ダッシュボード", href: "/admin/connectors/dashboard" }, { label: "コネクター" }]}
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
            <Button disabled title="参照専用（現在は編集不可）">
              <Plus className="h-4 w-4 mr-2" />
              新規追加
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cable className="h-5 w-5" />
            <span>コネクター一覧</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>コネクター名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>サブドメイン</TableHead>
                <TableHead>OAuth クライアント名</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>更新日</TableHead>
                <TableHead className="text-right">アクション</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectors.map((connector) => (
                <TableRow
                  key={connector.id}
                  className="cursor-pointer hover:bg-muted/50"
                    onClick={() => (window.location.href = `/admin/connectors/${connector.type}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <StatusDot status={connector.status} />
                      <span>{connector.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(connector.status)}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">{connector.subdomain}</code>
                  </TableCell>
                  <TableCell>{connector.oauthClientName}</TableCell>
                  <TableCell>{new Date(connector.createdAt).toLocaleDateString("ja-JP")}</TableCell>
                  <TableCell>{new Date(connector.updatedAt).toLocaleDateString("ja-JP")}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/connectors/${connector.type}`}>
                      <Button variant="ghost" size="sm">
                        詳細
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
