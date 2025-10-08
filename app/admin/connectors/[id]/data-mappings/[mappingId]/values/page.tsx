/**
 * Value Mappings Management Page
 * /admin/connectors/[id]/data-mappings/[mappingId]/values?tenantId=xxx
 */

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Settings, ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"
import { getConnector } from "@/lib/db/connectors"
import { getTenantById } from "@/lib/supabase/tenants"
import { ValueMappingsManager } from "./value-mappings-manager"
import Link from "next/link"

interface ValueMappingsPageProps {
  params: {
    id: string
    mappingId: string
  }
  searchParams: {
    tenantId?: string
  }
}

export default async function ValueMappingsPage({ 
  params, 
  searchParams 
}: ValueMappingsPageProps) {
  const connectorId = params.id
  const mappingId = params.mappingId
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
        title="値マッピング管理"
        description={`${connector.display_name} の値マッピング設定`}
        breadcrumbs={[
          { label: "概要", href: "/admin/connectors/dashboard" },
          { label: "コネクター", href: tenantId ? `/admin/connectors?tenantId=${tenantId}` : "/admin/connectors" },
          { label: connector.display_name, href: tenantId ? `/admin/connectors/${connectorId}?tenantId=${tenantId}` : `/admin/connectors/${connectorId}` },
          { label: "データマッピング", href: tenantId ? `/admin/connectors/${connectorId}/data-mappings?tenantId=${tenantId}` : `/admin/connectors/${connectorId}/data-mappings` },
          { label: "値マッピング" }
        ]}
        actions={
          <Link href={tenantId ? `/admin/connectors/${connectorId}/data-mappings?tenantId=${tenantId}` : `/admin/connectors/${connectorId}/data-mappings`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
        }
      />

      {/* Value Mappings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>値マッピング概要</span>
          </CardTitle>
          <CardDescription>
            Kintoneフィールドの値とサービスフィールドの値の対応関係を設定します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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
                <Edit className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">対象フィールド</span>
              </div>
              <div className="text-2xl font-bold">status</div>
              <p className="text-xs text-muted-foreground">マッピング対象のフィールド名</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">変換例</span>
              </div>
              <div className="text-2xl font-bold">書類準備中</div>
              <p className="text-xs text-muted-foreground">複数のKintone値から1つのサービス値へ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Mappings Manager */}
      <Suspense fallback={
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </CardContent>
        </Card>
      }>
        <ValueMappingsManager 
          connectorId={connectorId}
          mappingId={mappingId}
          tenantId={tenantId}
        />
      </Suspense>
    </div>
  )
}
