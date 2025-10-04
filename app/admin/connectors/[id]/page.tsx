/**
 * Connector detail page with proper scoping and connection gating
 * /admin/connectors/[id]?tenantId=xxx
 */

import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ConnectorDetailClient } from "./connector-detail-client"
import { StatusDot } from "@/components/ui/status-dot"
import { KeyValueList } from "@/components/ui/key-value-list"
import { EmptyState } from "@/components/ui/empty-state"
import { Shield, Database, GitBranch, Zap, AlertCircle, Settings, Activity } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getConnector, getConnectionStatus } from "@/lib/db/connectors"
import { getTenantById } from "@/lib/supabase/tenants"
import { redactClientId, redactDomain } from "@/lib/ui/redact"

// New function to get connection status from oauth_credentials
async function getConnectionStatusFromCredentials(connectorId: string) {
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  
  // Check if there's a valid credentials entry with kintone_token type
  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*')
    .eq('connector_id', connectorId)
    .eq('type', 'kintone_token')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  if (error || !credentials) {
    return { status: 'disconnected' }
  }
  
  // Check if token is expired
  const now = new Date()
  const expiresAt = credentials.expires_at ? new Date(credentials.expires_at) : null
  
  if (expiresAt && expiresAt <= now) {
    return { status: 'disconnected' }
  }
  
  return { status: 'connected' }
}
import { getConfigAndToken, computeRedirectUri } from "@/lib/connectors/kintoneClient"
import { ConnectorActions } from "../connector-actions"
import { ConnectorAppMappingTab } from "./connector-app-mapping-tab"
import { OAuthSetupInfo } from "@/components/connectors/oauth-setup-info"

interface ConnectorDetailPageProps {
  params: {
    id: string
  }
  searchParams: {
    tenantId?: string
    connected?: string
    error?: string
    tab?: string
  }
}

export default async function ConnectorDetailPage({ 
  params, 
  searchParams 
}: ConnectorDetailPageProps) {
  const connectorId = params.id
  const tenantId = searchParams.tenantId
  
  // Handle redirects from old tab URLs
  const tab = searchParams.tab
  if (tab === 'apps' || tab === 'mappings') {
    // Redirect to the new unified tab
    const redirectUrl = tenantId 
      ? `/admin/connectors/${connectorId}?tenantId=${tenantId}`
      : `/admin/connectors/${connectorId}`
    redirect(redirectUrl)
  }
  
  // Get connector data from new system
  const connector = await getConnector(connectorId)
  
  if (!connector) {
    notFound()
  }
  
  // If tenantId is provided, verify it matches the connector's tenant
  if (tenantId && connector.tenant_id !== tenantId) {
    notFound()
  }
  
  // Get connection status using oauth_credentials
  const connectionStatus = await getConnectionStatusFromCredentials(connectorId)
  
  // Get tenant information
  const tenant = await getTenantById(connector.tenant_id)
  
  // Get real data from database
  let logs: any[] = []
  let stats = { connectedApps: 0, activeMappings: 0, fieldMappings: 0 }
  let kintoneConfig: any = null
  let redirectUri = ''
  
  try {
    if (connectionStatus?.status === 'connected') {
      // Create admin client inline
      const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
      
      // Get app mappings count
      const { data: appMappings } = await supabase
        .from('app_mappings')
        .select('id')
        .eq('connector_id', connectorId)
        .eq('status', 'active')
      
      stats.connectedApps = appMappings?.length || 0
      stats.activeMappings = appMappings?.length || 0
      
      // Get field mappings count
      if (appMappings && appMappings.length > 0) {
        const { data: fieldMappings } = await supabase
          .from('field_mappings')
          .select('id')
          .in('mapping_app_id', appMappings.map(m => m.id))
        
        stats.fieldMappings = fieldMappings?.length || 0
      }
      
      // Load Kintone config for display
      try {
        
        // Load config from credentials table
        const { data: configCreds } = await supabase
          .from("credentials")
          .select("*")
          .eq("connector_id", connectorId)
          .eq("type", "kintone_config")
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        // Use config from credentials or fallback to provider_config
        if (configCreds?.payload) {
          kintoneConfig = JSON.parse(configCreds.payload)
        } else if (configCreds?.payload_encrypted) {
          // Try to decrypt if encrypted
          try {
            const { decryptJson } = require('@/lib/security/crypto')
            kintoneConfig = decryptJson(configCreds.payload_encrypted)
          } catch (decryptError) {
            console.error('Failed to decrypt config:', decryptError)
            kintoneConfig = connector.provider_config
          }
        } else {
          kintoneConfig = connector.provider_config
        }
        
        if (kintoneConfig && kintoneConfig.domain) {
          // Create a mock request to compute redirect URI
          const mockRequest = new Request('https://localhost:3000', {
            headers: {
              'x-forwarded-proto': 'https',
              'x-forwarded-host': 'localhost:3000'
            }
          })
          redirectUri = computeRedirectUri(mockRequest)
        } else {
          kintoneConfig = null
          redirectUri = 'https://localhost:3000/api/auth/connectors/kintone/callback'
        }
      } catch (configError) {
        console.error('Failed to load Kintone config:', configError)
        kintoneConfig = null
        redirectUri = 'https://localhost:3000/api/connect/kintone/callback'
      }
    }
  } catch (error) {
    console.error('Failed to load real stats:', error)
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
      <PageHeader
        title={connector.display_name}
        description={`${connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} コネクターの詳細設定と状態`}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: tenantId ? `/admin/connectors?tenantId=${tenantId}` : "/admin/connectors" },
          { label: connector.display_name }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <StatusDot status={connectionStatus?.status || 'disconnected'} />
            {getStatusBadge(connectionStatus?.status || 'disconnected')}
            <ConnectorActions connector={connector} connectionStatus={connectionStatus} tenantId={tenantId} />
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

      {/* Connection Status Gate - Check both connection status and connector status */}
      {connectionStatus?.status !== 'connected' && connector.status !== 'connected' && connector.status !== undefined ? (
        <div className="space-y-6">
          <EmptyState
            icon={getProviderIcon(connector.provider)}
            title="コネクターが未接続です"
            description="OAuth認証を完了してサービス連携を開始してください"
            action={
              <ConnectorActions connector={connector} connectionStatus={connectionStatus} tenantId={tenantId} showLabel />
            }
          />
          
          {/* OAuth Setup Information */}
          <OAuthSetupInfo 
            provider={connector.provider}
            subdomain="funtoco"
          />
        </div>
      ) : connectionStatus?.status === 'error' ? (
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
            <ConnectorActions connector={connector} connectionStatus={connectionStatus} tenantId={tenantId} showLabel />
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
        <ConnectorDetailClient
          connector={connector}
          tenantId={tenantId}
          connectionStatus={connectionStatus}
          tab={tab}
        >
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
                    value: kintoneConfig?.clientId ? redactClientId(kintoneConfig.clientId) : "未設定",
                    icon: <Settings className="h-4 w-4" />
                  },
                  {
                    key: "リダイレクト URI",
                    value: redirectUri || "未設定",
                    icon: <Zap className="h-4 w-4" />
                  },
                  {
                    key: "スコープ",
                    value: kintoneConfig?.scope ? kintoneConfig.scope.join(" ") : "未設定",
                    icon: <Shield className="h-4 w-4" />
                  },
                  {
                    key: "ドメイン",
                    value: kintoneConfig?.domain ? redactDomain(kintoneConfig.domain) : "未設定",
                    icon: <Database className="h-4 w-4" />
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
                items={[
                  {
                    key: 'プロバイダー',
                    value: connector.provider,
                    icon: <Database className="h-4 w-4" />
                  },
                  {
                    key: '表示名',
                    value: connector.display_name,
                    icon: <Database className="h-4 w-4" />
                  },
                  {
                    key: 'テナント名',
                    value: tenant?.name || 'Unknown Tenant',
                    icon: <Database className="h-4 w-4" />
                  },
                  {
                    key: '作成日',
                    value: new Date(connector.created_at).toLocaleDateString('ja-JP'),
                    icon: <Database className="h-4 w-4" />
                  }
                ]}
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
        </ConnectorDetailClient>
      )}
    </div>
  )
}
