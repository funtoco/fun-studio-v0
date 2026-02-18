"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Users, 
  Calendar, 
  Mail, 
  UserPlus, 
  LinkIcon, 
  Pencil, 
  Trash2,
  ExternalLink,
  Plus,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { 
  getCurrentUserTenants, 
  updateTenant, 
  deleteTenant,
  type Tenant,
  type UserTenant 
} from "@/lib/supabase/tenants"
import { TenantEditDialog } from "@/tenant-management/components/tenant-edit-dialog"
import { ConfirmDialog } from "@/tenant-management/components/confirm-dialog"
import { toast } from "sonner"

export default function TenantsPage() {
  const [userTenants, setUserTenants] = useState<UserTenant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null)

  useEffect(() => {
    loadTenants()
  }, [])

  async function loadTenants() {
    setIsLoading(true)
    try {
      const tenants = await getCurrentUserTenants()
      setUserTenants(tenants)
    } catch (error) {
      console.error("Failed to load tenants:", error)
      toast.error("テナント情報の取得に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTenant = async (tenantId: string, data: { name: string; description: string; slug: string }) => {
    const result = await updateTenant(tenantId, data)
    if (result.success) {
      toast.success("テナント情報を更新しました")
      loadTenants()
    } else {
      toast.error(result.error || "更新に失敗しました")
    }
  }

  const handleDeleteTenant = async () => {
    if (!deletingTenantId) return
    const result = await deleteTenant(deletingTenantId)
    if (result.success) {
      toast.success("テナントを削除しました")
      loadTenants()
    } else {
      toast.error(result.error || "削除に失敗しました")
    }
    setDeletingTenantId(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">テナント一覧</h1>
          <p className="text-muted-foreground">所属しているすべてのテナントを管理できます</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {userTenants.map((ut) => {
          const tenant = ut.tenant
          if (!tenant) return null

          return (
            <Card key={tenant.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    {tenant.name}
                    {ut.role === 'owner' && (
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Owner
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>テナント ID: {tenant.id} / スラッグ: {tenant.slug}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingTenant(tenant)}>
                    <Pencil className="size-4 mr-2" />
                    編集
                  </Button>
                  {ut.role === 'owner' && (
                    <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeletingTenantId(tenant.id)}>
                      <Trash2 className="size-4 mr-2" />
                      削除
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tenant.description && (
                  <p className="text-sm text-muted-foreground border-l-2 pl-4 py-1 italic">
                    {tenant.description}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">作成日</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tenant.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ロール</p>
                      <p className="text-sm text-muted-foreground capitalize">{ut.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">ステータス</p>
                      <p className="text-sm text-muted-foreground capitalize">{ut.status}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex gap-4">
                  <Button asChild>
                    <Link href={`/tenants/members?tenantId=${tenant.id}`}>
                      <Users className="size-4 mr-2" />
                      メンバー管理
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href={`/dashboard?tenantId=${tenant.id}`}>
                      <ExternalLink className="size-4 mr-2" />
                      ダッシュボードへ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {userTenants.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">所属しているテナントがありません</h3>
              <p className="text-muted-foreground text-center mb-4">
                新しくテナントを作成するか、招待を待ってください
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <TenantEditDialog 
        tenant={editingTenant}
        open={!!editingTenant}
        onOpenChange={(open) => !open && setEditingTenant(null)}
        onSave={handleUpdateTenant}
      />

      <ConfirmDialog
        open={!!deletingTenantId}
        onOpenChange={(open) => !open && setDeletingTenantId(null)}
        onConfirm={handleDeleteTenant}
        title="テナントの削除"
        description="本当にこのテナントを削除しますか？この操作は取り消せません。また、このテナントに紐づくすべてのデータ（人材、ビザ、コネクター設定など）が完全に削除されます。"
        confirmText="削除する"
        variant="destructive"
      />
    </div>
  )
}
