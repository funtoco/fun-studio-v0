"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2 } from "lucide-react"
import { TenantMembersPage } from "@/components/tenant/tenant-members-page"
import { useAuth } from "@/contexts/auth-context"

export default function CompanyTenantsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(false)
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">テナント管理</h1>
            <p className="text-muted-foreground mt-2">認証中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">テナント管理</h1>
            <p className="text-muted-foreground mt-2">ログインが必要です</p>
          </div>
        </div>
      </div>
    )
  }

  // For now, we'll use a default tenant ID
  // In a real implementation, this would come from the company or user's current tenant
  const tenantId = "00000000-0000-0000-0000-000000000001" // Default tenant from migration

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-muted-foreground" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">テナント管理</h1>
              <p className="text-muted-foreground mt-1">メンバーと権限を管理します</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Members Management */}
      <TenantMembersPage tenantId={tenantId} />
    </div>
  )
}
