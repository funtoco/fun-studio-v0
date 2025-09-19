import { Suspense } from 'react'
import { PageHeader } from "@/components/ui/page-header"
import { ConnectorListReal, ConnectorListLoading } from "./connector-list-real"

interface ConnectorsPageProps {
  searchParams: {
    tenantId?: string
    q?: string
  }
}

export default function ConnectorsPage({ searchParams }: ConnectorsPageProps) {
  // For development, use default tenant
  const tenantId = searchParams.tenantId || "550e8400-e29b-41d4-a716-446655440001" // Funtoco
  const searchQuery = searchParams.q

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="コネクター"
        description="Kintone 接続の設定と状態を管理"
        breadcrumbs={[{ label: "概要", href: "/admin/connectors/dashboard" }, { label: "コネクター" }]}
      />

      <Suspense fallback={<ConnectorListLoading />}>
        <ConnectorListReal 
          tenantId={tenantId} 
          searchQuery={searchQuery}
        />
      </Suspense>
    </div>
  )
}