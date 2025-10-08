/**
 * Data Mappings Management Page
 * /admin/connectors/[id]/data-mappings?tenantId=xxx
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { GitBranch, Plus, Settings, Database, ArrowRight } from "lucide-react"
import { getConnector } from "@/lib/db/connectors"
import { getTenantById } from "@/lib/supabase/tenants"
import { DataMappingsManager } from "./data-mappings-manager"

interface DataMappingsPageProps {
  params: {
    id: string
  }
  searchParams: {
    tenantId?: string
  }
}

export default async function DataMappingsPage({ 
  params, 
  searchParams 
}: DataMappingsPageProps) {
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
  
  // Get tenant information
  const tenant = await getTenantById(connector.tenant_id)

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="データマッピング管理"
        description={`${connector.display_name} の値マッピング設定`}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: tenantId ? `/admin/connectors?tenantId=${tenantId}` : "/admin/connectors" },
          { label: connector.display_name, href: tenantId ? `/admin/connectors/${connectorId}?tenantId=${tenantId}` : `/admin/connectors/${connectorId}` },
          { label: "データマッピング" }
        ]}
      />

      {/* Data Mappings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5" />
            <span>データマッピング概要</span>
          </CardTitle>
          <CardDescription>
            Kintoneフィールドの値とサービスフィールドの値の対応関係を管理します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">設定済みフィールド</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">値マッピングが設定されたフィールド数</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">マッピングルール</span>
              </div>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">設定された値の対応ルール数</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">変換対象</span>
              </div>
              <div className="text-2xl font-bold">visas</div>
              <p className="text-xs text-muted-foreground">主な対象サービス</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Mappings Manager */}
      <Suspense fallback={
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      }>
        <DataMappingsManager 
          connectorId={connectorId}
          tenantId={tenantId}
        />
      </Suspense>
    </div>
  )
}
