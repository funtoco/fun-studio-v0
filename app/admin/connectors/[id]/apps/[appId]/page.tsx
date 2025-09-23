/**
 * Kintone app fields page
 * /admin/connectors/[id]/apps/[appId]?tenantId=xxx
 */

"use client"

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { Database, Settings, RefreshCw, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface KintoneField {
  id: string
  field_code: string
  field_label: string
  field_type: string
  required: boolean
  options?: any
  created_at: string
  updated_at: string
}

interface KintoneApp {
  id: string
  app_id: string
  code: string
  name: string
  description: string
}

export default function AppFieldsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const connectorId = params.id as string
  const appId = params.appId as string
  const tenantId = searchParams.get('tenantId') || "550e8400-e29b-41d4-a716-446655440001"

  const [app, setApp] = useState<KintoneApp | null>(null)
  const [fields, setFields] = useState<KintoneField[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadApp = async () => {
    try {
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps`)
      if (!response.ok) throw new Error('Failed to fetch apps')
      const data = await response.json()
      const foundApp = data.apps.find((a: KintoneApp) => a.app_id === appId)
      if (foundApp) {
        setApp(foundApp)
      }
    } catch (err) {
      console.error('Failed to load app:', err)
    }
  }

  const loadFields = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps/${appId}/fields`)
      if (!response.ok) {
        throw new Error('Failed to fetch fields')
      }
      const data = await response.json()
      setFields(data.fields || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fields')
    } finally {
      setLoading(false)
    }
  }

  const syncFields = async () => {
    try {
      setSyncing(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps/${appId}/fields`, {
        method: 'POST'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to sync fields')
      }
      const data = await response.json()
      setFields(data.fields || [])
      toast.success(`${data.total} 個のフィールドを同期しました`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync fields'
      setError(errorMessage)
      toast.error("フィールドの同期に失敗しました", {
        description: errorMessage
      })
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    loadApp()
    loadFields()
  }, [connectorId, appId])

  const getFieldTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string; variant: string }> = {
      'SINGLE_LINE_TEXT': { label: '1行テキスト', variant: 'default' },
      'MULTI_LINE_TEXT': { label: '複数行テキスト', variant: 'secondary' },
      'NUMBER': { label: '数値', variant: 'outline' },
      'DATE': { label: '日付', variant: 'outline' },
      'DATETIME': { label: '日時', variant: 'outline' },
      'TIME': { label: '時刻', variant: 'outline' },
      'DROP_DOWN': { label: 'ドロップダウン', variant: 'outline' },
      'CHECK_BOX': { label: 'チェックボックス', variant: 'outline' },
      'RADIO_BUTTON': { label: 'ラジオボタン', variant: 'outline' },
      'MULTI_SELECT': { label: '複数選択', variant: 'outline' },
      'FILE': { label: 'ファイル', variant: 'outline' },
      'LINK': { label: 'リンク', variant: 'outline' },
      'USER_SELECT': { label: 'ユーザー選択', variant: 'outline' },
      'ORGANIZATION_SELECT': { label: '組織選択', variant: 'outline' },
      'GROUP_SELECT': { label: 'グループ選択', variant: 'outline' },
      'REFERENCE_TABLE': { label: '関連レコード一覧', variant: 'outline' },
      'CALC': { label: '計算', variant: 'outline' },
      'MODIFIER': { label: '更新者', variant: 'outline' },
      'CREATOR': { label: '作成者', variant: 'outline' },
      'CREATED_TIME': { label: '作成日時', variant: 'outline' },
      'UPDATED_TIME': { label: '更新日時', variant: 'outline' }
    }

    const fieldType = typeMap[type] || { label: type, variant: 'outline' }
    return <Badge variant={fieldType.variant as any}>{fieldType.label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>フィールドを読み込み中...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="text-red-600">エラー: {error}</div>
              <Button onClick={loadFields} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                再試行
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title={app?.name || `アプリ ${appId}`}
        description={app?.description || 'Kintone アプリのフィールド一覧'}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: `/admin/connectors?tenantId=${tenantId}` },
          { label: "アプリ", href: `/admin/connectors/${connectorId}?tenantId=${tenantId}` },
          { label: app?.name || appId }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <Link href={`/admin/connectors/${connectorId}?tenantId=${tenantId}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <Button onClick={syncFields} disabled={syncing} size="sm">
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
        }
      />

      {fields.length === 0 ? (
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="まだフィールドがありません"
          description="Kintone からフィールドを同期して表示します"
          action={
            <Button onClick={syncFields} disabled={syncing}>
              {syncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  同期中...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  フィールドを同期
                </>
              )}
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span className="text-lg font-semibold">フィールド一覧</span>
              <Badge variant="outline">{fields.length} 件</Badge>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>フィールド名</TableHead>
                    <TableHead>フィールドコード</TableHead>
                    <TableHead>タイプ</TableHead>
                    <TableHead>必須</TableHead>
                    <TableHead>オプション</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.field_label}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {field.field_code}
                        </code>
                      </TableCell>
                      <TableCell>
                        {getFieldTypeBadge(field.field_type)}
                      </TableCell>
                      <TableCell>
                        {field.required ? (
                          <Badge variant="destructive">必須</Badge>
                        ) : (
                          <Badge variant="outline">任意</Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {field.options ? (
                          <div className="text-sm text-muted-foreground truncate">
                            {JSON.stringify(field.options).slice(0, 50)}...
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" disabled title="設定（準備中）">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
