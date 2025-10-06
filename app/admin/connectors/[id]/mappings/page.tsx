/**
 * App & Mapping page for connector detail
 * /admin/connectors/[id]/mappings?tenantId=xxx
 */

import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StatusDot } from "@/components/ui/status-dot"
import { EmptyState } from "@/components/ui/empty-state"
import { Database, Zap, AlertCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getConnector } from "@/lib/db/connectors"
import { getTenantById } from "@/lib/supabase/tenants"
import { ConnectorAppMappingTab } from "../connector-app-mapping-tab"
import { ConnectorActions } from "../../connector-actions"

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

interface ConnectorMappingsPageProps {
  params: {
    id: string
  }
  searchParams: {
    tenantId?: string
    connected?: string
    error?: string
  }
}

export default async function ConnectorMappingsPage({ 
  params, 
  searchParams 
}: ConnectorMappingsPageProps) {
  const connectorId = params.id
  const tenantId = searchParams.tenantId
  
  // Get connector data
  const connector = await getConnector(connectorId)
  
  if (!connector) {
    notFound()
  }
  
  // If tenantId is provided, verify it matches the connector's tenant
  if (tenantId && connector.tenant_id !== tenantId) {
    notFound()
  }
  
  // Get connection status
  const connectionStatus = await getConnectionStatusFromCredentials(connectorId)
  
  // Get tenant information
  const tenant = await getTenantById(connector.tenant_id)
  
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
        return <Database className="h-6 w-6" />
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
        title={`${connector.display_name} - アプリ&マッピング`}
        description={`${connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} コネクターのアプリマッピング設定`}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: tenantId ? `/admin/connectors?tenantId=${tenantId}` : "/admin/connectors" },
          { label: connector.display_name, href: tenantId ? `/admin/connectors/${connectorId}?tenantId=${tenantId}` : `/admin/connectors/${connectorId}` },
          { label: "アプリ&マッピング" }
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

      {/* Back to Overview Link */}
      <div className="flex items-center space-x-2">
        <Link href={tenantId ? `/admin/connectors/${connectorId}?tenantId=${tenantId}` : `/admin/connectors/${connectorId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            概要に戻る
          </Button>
        </Link>
      </div>

      {/* Connection Status Gate */}
      {connectionStatus?.status !== 'connected' && connector.status !== 'connected' && connector.status !== undefined ? (
        <div className="space-y-6">
          <EmptyState
            icon={getProviderIcon(connector.provider)}
            title="コネクターが未接続です"
            description="OAuth認証を完了してアプリマッピングを設定してください"
            action={
              <ConnectorActions connector={connector} connectionStatus={connectionStatus} tenantId={tenantId} showLabel />
            }
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
          </div>
        </div>
      ) : (
        /* Connected State - Show App Mapping Tab */
        <ConnectorAppMappingTab
          connector={connector}
          tenantId={tenantId || ''}
          connectionStatus={connectionStatus}
        />
      )}
    </div>
  )
}
