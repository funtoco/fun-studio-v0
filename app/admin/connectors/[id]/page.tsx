/**
 * Connector detail page with proper scoping and connection gating
 * /admin/connectors/[id]?tenantId=xxx
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusDot } from "@/components/ui/status-dot"
import { KeyValueList } from "@/components/ui/key-value-list"
import { EmptyState } from "@/components/ui/empty-state"
import { Shield, Database, GitBranch, Zap, AlertCircle, Settings, Activity } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getConnector, getConnectorLogs, getConnectorStats } from "@/lib/db/connectors"
import { maskClientId } from "@/lib/security/mask"
import { ConnectorActions } from "../connector-actions"
import { ConnectorAppsTab } from "./connector-apps-tab"
import { ConnectorMappingsTab } from "./connector-mappings-tab"
import { OAuthSetupInfo } from "@/components/connectors/oauth-setup-info"
import { SyncButton } from "@/components/connectors/sync-button"
import { ConnectorRefreshHandler } from "@/components/connectors/connector-refresh-handler"

interface ConnectorDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    tenantId?: string
    connected?: string
    error?: string
  }
}

export default async function ConnectorDetailPage({ 
  params, 
  searchParams 
}: ConnectorDetailPageProps) {
  const connectorId = params.id
  const tenantId = searchParams.tenantId || "550e8400-e29b-41d4-a716-446655440001"
  
  // Get connector data
  const connector = await getConnector(connectorId)
  
  if (!connector || connector.tenant_id !== tenantId) {
    notFound()
  }
  
  // Get additional data based on connection status
  let logs: any[] = []
  let stats = { connectedApps: 0, activeMappings: 0, fieldMappings: 0 }
  
  try {
    if (connector.status === 'connected') {
      [logs, stats] = await Promise.all([
        getConnectorLogs(connectorId, 10),
        getConnectorStats(connectorId)
      ])
    } else {
      logs = await getConnectorLogs(connectorId, 5) // Fewer logs for disconnected
    }
  } catch (err) {
    console.error('Failed to load connector details:', err)
  }
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'kintone':
        return (
          <div className="w-6 h-6 relative">
            <Image
              src="/kintone-logo-horizontal.webp"
              alt="Kintone logo"
              fill
              className="object-contain"
            />
          </div>
        )
      case 'hubspot':
        return (
          <div className="w-6 h-6 relative">
            <Image
              src="/imgbin-logo-hubspot-inc.jpg"
              alt="HubSpot logo"
              fill
              className="object-contain"
            />
          </div>
        )
      default:
        return <Shield className="h-6 w-6" />
    }
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">接続済</Badge>
      case 'disconnected':
        return <Badge variant="secondary">未接続</Badge>
      case 'error':
        return <Badge variant="destructive">エラー</Badge>
      default:
        return <Badge variant="outline">不明</Badge>
    }
  }

  return (
    <div className="space-y-6 p-6">
      <ConnectorRefreshHandler connectorId={connectorId} tenantId={tenantId} />
      <PageHeader
        title={connector.name}
        description={`${connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} コネクターの詳細設定と状態`}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: `/admin/connectors?tenantId=${tenantId}` },
          { label: connector.name }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <StatusDot status={connector.status} />
            {getStatusBadge(connector.status)}
            {connector.status === 'connected' && connector.provider === 'kintone' && (
              <SyncButton connectorId={connector.id} tenantId={tenantId} />
            )}
            <ConnectorActions connector={connector} tenantId={tenantId} />
          </div>
        }
      />

      {/* Success/Error Messages */}
      {searchParams.connected === 'true' && (
        <Alert className="border-green-200 bg-green-50">
          <Zap className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            コネクターが正常に接続されました！
          </AlertDescription>
        </Alert>
      )}
      
      {searchParams.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            接続エラー: {decodeURIComponent(searchParams.error)}
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status Gate */}
      {connector.status === 'disconnected' ? (
        <div className="space-y-6">
          <EmptyState
            icon={getProviderIcon(connector.provider)}
            title="コネクターが未接続です"
            description="OAuth認証を完了してサービス連携を開始してください"
            action={
              <ConnectorActions connector={connector} tenantId={tenantId} showLabel />
            }
          />
          
          {/* OAuth Setup Information */}
          <OAuthSetupInfo 
            provider={connector.provider}
            subdomain={connector.provider_config.subdomain}
          />
        </div>
      ) : connector.status === 'error' ? (
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">接続エラーが発生しています</div>
                {connector.error_message && (
                  <div className="text-sm">{connector.error_message}</div>
                )}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-2">
            <ConnectorActions connector={connector} tenantId={tenantId} showLabel />
            <Link href={`/admin/connectors/${connectorId}/logs?tenantId=${tenantId}`}>
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                詳細ログ
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Connected State - Show Full Details with Tabs */
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>概要</span>
            </TabsTrigger>
            <TabsTrigger value="apps" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>アプリ</span>
              <Badge variant="outline">{stats.connectedApps}</Badge>
            </TabsTrigger>
            <TabsTrigger value="mappings" className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span>マッピング</span>
              <Badge variant="outline">{stats.activeMappings}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Configuration */}
              <div className="lg:col-span-2 space-y-6">
            {/* OAuth Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>OAuth 設定</span>
                </CardTitle>
                <CardDescription>
                  認証設定の詳細情報（参照のみ）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KeyValueList
                  items={[
                    {
                      key: "クライアント ID",
                      value: maskClientId("dummy-for-display"),
                      icon: <Settings className="h-4 w-4" />
                    },
                    {
                      key: "リダイレクト URI",
                      value: `${process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/connect/${connector.provider}/callback-v2`,
                      icon: <Zap className="h-4 w-4" />
                    },
                    {
                      key: "スコープ",
                      value: connector.scopes.join(", "),
                      icon: <Shield className="h-4 w-4" />
                    }
                  ]}
                />
              </CardContent>
            </Card>

            {/* Connection Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getProviderIcon(connector.provider)}
                  <span>接続先情報</span>
                </CardTitle>
                <CardDescription>
                  {connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} 接続の詳細
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KeyValueList
                  items={Object.entries(connector.provider_config).map(([key, value]) => ({
                    key: key === 'subdomain' ? 'サブドメイン' : key,
                    value: key === 'subdomain' ? `${value}.cybozu.com` : String(value),
                    icon: <Database className="h-4 w-4" />
                  }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>統計情報</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">接続アプリ数</span>
                    <Badge variant="outline">{stats.connectedApps}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">アクティブマッピング</span>
                    <Badge variant="outline">{stats.activeMappings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">フィールドマッピング</span>
                    <Badge variant="outline">{stats.fieldMappings}</Badge>
                  </div>
                  {stats.lastSync && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">最終同期</span>
                      <span className="text-sm">
                        {new Date(stats.lastSync).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>最近のログ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    ログがありません
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start space-x-2 text-sm">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          log.level === 'error' ? 'bg-red-500' :
                          log.level === 'warn' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{log.event}</div>
                          <div className="text-muted-foreground text-xs">
                            {new Date(log.created_at).toLocaleString('ja-JP')}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {logs.length > 5 && (
                      <Link href={`/admin/connectors/${connectorId}/logs?tenantId=${tenantId}`}>
                        <Button variant="ghost" size="sm" className="w-full mt-2">
                          すべてのログを表示
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            </div>
          </TabsContent>

          <TabsContent value="apps">
            <ConnectorAppsTab connector={connector} tenantId={tenantId} />
          </TabsContent>

          <TabsContent value="mappings">
            <ConnectorMappingsTab connector={connector} tenantId={tenantId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
