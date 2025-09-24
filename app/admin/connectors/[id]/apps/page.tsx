/**
 * Kintone Apps page with connection gating
 * /admin/connectors/[id]/apps?tenantId=xxx
 */

import { notFound } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { kintoneApps } from "@/data/kintone-apps"
import { appMappings } from "@/data/mappings-apps"
import { Database, Settings, ExternalLink, Zap } from "lucide-react"
import Link from "next/link"
import { getConnector, getConnectionStatus } from "@/lib/db/connectors-v2"
import { getKintoneAppsWithFieldCounts } from "@/lib/db/kintone-data"
import { ConnectorActions } from "../../connector-actions"
import { SyncAppsButtonWrapper } from "@/components/connectors/sync-apps-button-wrapper"

interface KintoneAppsPageProps {
  params: {
    id: string
  }
  searchParams: {
    tenantId?: string
  }
}

export default async function KintoneAppsPage({ 
  params, 
  searchParams 
}: KintoneAppsPageProps) {
  const connectorId = params.id
  const tenantId = searchParams.tenantId || "550e8400-e29b-41d4-a716-446655440001"
  
  // Get connector and validate
  const connector = await getConnector(connectorId)
  
  if (!connector || connector.tenant_id !== tenantId) {
    notFound()
  }
  
  if (connector.provider !== 'kintone') {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Kintone アプリ"
          description="このコネクターは Kintone プロバイダーではありません"
          breadcrumbs={[
            { label: "概要", href: "/admin/connectors/dashboard" },
            { label: "コネクター", href: `/admin/connectors?tenantId=${tenantId}` },
            { label: connector.name, href: `/admin/connectors/${connectorId}?tenantId=${tenantId}` },
            { label: "Kintone アプリ" }
          ]}
        />
        
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="Kintone プロバイダーではありません"
          description={`このコネクターは ${connector.provider} プロバイダーです`}
          action={
            <Link href={`/admin/connectors/${connectorId}?tenantId=${tenantId}`}>
              <Button>
                コネクター詳細へ戻る
              </Button>
            </Link>
          }
        />
      </div>
    )
  }
  
  // Get connection status
  const connectionStatus = await getConnectionStatus(connectorId)
  
  // Connection gating
  if (connectionStatus?.status !== 'connected') {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          title="Kintone アプリ"
          description="接続されている Kintone アプリの一覧と詳細"
          breadcrumbs={[
            { label: "概要", href: "/admin/connectors/dashboard" },
            { label: "コネクター", href: `/admin/connectors?tenantId=${tenantId}` },
            { label: connector.name, href: `/admin/connectors/${connectorId}?tenantId=${tenantId}` },
            { label: "Kintone アプリ" }
          ]}
        />

        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="まず接続してください"
          description="Kintone アプリを表示するには、まずコネクターを接続してください"
          action={
            <ConnectorActions connector={connector} connectionStatus={connectionStatus} tenantId={tenantId} showLabel />
          }
        />
      </div>
    )
  }
  
  // Get real Kintone apps from database
  let kintoneAppsData: any[] = []
  try {
    kintoneAppsData = await getKintoneAppsWithFieldCounts(connectorId)
  } catch (error) {
    console.error('Failed to load Kintone apps:', error)
  }
  
  const getAppMappingStatus = (appCode: string) => {
    const mapping = appMappings.find(m => 
      m.appCode === appCode && 
      (m.connectorId === connectorId || m.subdomain === 'funtoco') // Hardcoded for now since we don't have provider_config in new system
    )
    return mapping?.status || 'unmapped'
  }
  
  const getMappingBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">アクティブ</Badge>
      case 'inactive':
        return <Badge variant="secondary">非アクティブ</Badge>
      case 'error':
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">未マッピング</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Kintone アプリ"
        description="接続されている Kintone アプリの一覧と詳細"
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: `/admin/connectors?tenantId=${tenantId}` },
          { label: connector.name, href: `/admin/connectors/${connectorId}?tenantId=${tenantId}` },
          { label: "Kintone アプリ" }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <SyncAppsButtonWrapper 
              connectorId={connectorId}
            />
            <Button variant="outline" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
          </div>
        }
      />

      {kintoneAppsData.length === 0 ? (
        <EmptyState
          icon={<Database className="h-12 w-12" />}
          title="まだアプリがありません"
          description="このコネクターに関連付けられた Kintone アプリがありません"
          action={
            <SyncAppsButtonWrapper 
              connectorId={connectorId}
              size="lg"
            />
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>アプリ一覧</span>
              <Badge variant="outline">{kintoneAppsData.length} 件</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アプリ名</TableHead>
                  <TableHead>アプリコード</TableHead>
                  <TableHead>フィールド数</TableHead>
                  <TableHead>マッピング状態</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kintoneAppsData.map((app) => {
                  const mappingStatus = getAppMappingStatus(app.code)
                  return (
                    <TableRow key={app.app_id}>
                      <TableCell className="font-medium">{app.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-1 py-0.5 rounded">
                          {app.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{app.field_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {getMappingBadge(mappingStatus)}
                      </TableCell>
                      <TableCell>
                        {new Date(app.updated_at).toLocaleDateString("ja-JP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/connectors/${connectorId}/apps/${app.code}?tenantId=${tenantId}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
