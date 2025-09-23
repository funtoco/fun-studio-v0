/**
 * Apps tab component for connector detail page
 */

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { Database, Settings, ExternalLink, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"
import { type Connector } from "@/lib/types/connector"
import { toast } from "sonner"

interface KintoneApp {
  id: string
  app_id: string
  code: string
  name: string
  description: string
  space_id?: string
  thread_id?: string
  created_at: string
  updated_at: string
  last_synced_at?: string
}

interface ConnectorAppsTabProps {
  connector: Connector
  tenantId: string
}

export function ConnectorAppsTab({ connector, tenantId }: ConnectorAppsTabProps) {
  const [apps, setApps] = useState<KintoneApp[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadApps = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connector.id}/kintone/apps`)
      if (!response.ok) {
        throw new Error('Failed to fetch apps')
      }
      const data = await response.json()
      setApps(data.apps || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps')
    } finally {
      setLoading(false)
    }
  }

  const syncApps = async () => {
    try {
      setSyncing(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connector.id}/kintone/apps`, {
        method: 'POST'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync apps')
      }
      const data = await response.json()
      setApps(data.apps || [])
      toast.success(`${data.total} 個のアプリを同期しました`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync apps'
      setError(errorMessage)
      toast.error("アプリの同期に失敗しました", {
        description: errorMessage
      })
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (connector.status === 'connected') {
      loadApps()
    } else {
      setLoading(false)
    }
  }, [connector.id, connector.status])

  if (connector.provider !== 'kintone') {
    return (
      <EmptyState
        icon={<Database className="h-12 w-12" />}
        title="Kintone プロバイダーではありません"
        description={`このコネクターは ${connector.provider} プロバイダーです`}
      />
    )
  }

  if (connector.status !== 'connected') {
    return (
      <EmptyState
        icon={<Database className="h-12 w-12" />}
        title="コネクターが未接続です"
        description="Kintone に接続してからアプリを同期してください"
      />
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>アプリを読み込み中...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="text-red-600">エラー: {error}</div>
            <Button onClick={loadApps} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (apps.length === 0) {
    return (
      <EmptyState
        icon={<Database className="h-12 w-12" />}
        title="まだアプリがありません"
        description="Kintone からアプリを同期して表示します"
        action={
          <Button onClick={syncApps} disabled={syncing}>
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                同期中...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                アプリを同期
              </>
            )}
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span className="text-lg font-semibold">Kintone アプリ一覧</span>
          <Badge variant="outline">{apps.length} 件</Badge>
        </div>
        <Button onClick={syncApps} disabled={syncing} size="sm">
          {syncing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              同期中...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              同期
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>アプリ名</TableHead>
                <TableHead>アプリID</TableHead>
                <TableHead>アプリコード</TableHead>
                <TableHead>説明</TableHead>
                <TableHead>最終同期</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {app.app_id}
                    </code>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-1 py-0.5 rounded">
                      {app.code}
                    </code>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {app.description || '-'}
                  </TableCell>
                  <TableCell>
                    {app.last_synced_at ? 
                      new Date(app.last_synced_at).toLocaleDateString("ja-JP") : 
                      '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/admin/connectors/${connector.id}/apps/${app.app_id}?tenantId=${tenantId}`}>
                        <Button variant="ghost" size="sm" title="フィールドを表示">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" disabled title="設定（準備中）">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
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
