"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Building2, Users } from "lucide-react"
import { getCurrentUserTenants, UserTenant } from "@/lib/supabase/tenants"

interface TenantSelectorProps {
  selectedTenantId: string | null
  onTenantSelect: (tenantId: string) => void
}

export function TenantSelector({ selectedTenantId, onTenantSelect }: TenantSelectorProps) {
  const [tenants, setTenants] = useState<UserTenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const userTenants = await getCurrentUserTenants()
        setTenants(userTenants)
      } catch (err) {
        console.error('Error fetching tenants:', err)
        setError('テナントの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenants()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">テナントを選択</h3>
          <p className="text-sm text-muted-foreground">
            コネクターを追加するテナントを選択してください
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">テナントを選択</h3>
          <p className="text-sm text-muted-foreground">
            コネクターを追加するテナントを選択してください
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (tenants.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">テナントを選択</h3>
          <p className="text-sm text-muted-foreground">
            コネクターを追加するテナントを選択してください
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">利用可能なテナントがありません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">テナントを選択</h3>
        <p className="text-sm text-muted-foreground">
          コネクターを追加するテナントを選択してください
        </p>
      </div>

      <div className="grid gap-4">
        {/* テナントなしで続行 */}
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${selectedTenantId === '' ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
          onClick={() => onTenantSelect('')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">テナント設定なしで続行</CardTitle>
                  <CardDescription>全体向けや後からテナントを紐付ける場合に選択</CardDescription>
                </div>
              </div>
              {selectedTenantId === '' && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {tenants.map((userTenant) => (
          <Card
            key={userTenant.tenant_id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTenantId === userTenant.tenant_id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => onTenantSelect(userTenant.tenant_id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {userTenant.tenant?.name || 'Unknown Tenant'}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {userTenant.role === 'owner' ? 'オーナー' : 
                         userTenant.role === 'admin' ? '管理者' : 
                         userTenant.role === 'member' ? 'メンバー' : 'ゲスト'}
                      </Badge>
                      {userTenant.tenant?.description && (
                        <span className="text-xs text-muted-foreground">
                          {userTenant.tenant.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedTenantId === userTenant.tenant_id && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>ID: {userTenant.tenant_id.slice(0, 8)}...</span>
                </div>
                {userTenant.tenant?.slug && (
                  <div className="flex items-center gap-1">
                    <span>スラッグ: {userTenant.tenant.slug}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
