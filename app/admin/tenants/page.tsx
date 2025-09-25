"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Building2, Users, Plus, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TenantMembersPage } from "@/components/tenant/tenant-members-page"
import { CreateTenantDialog } from "@/components/tenant/create-tenant-dialog"
import { createTenantAction, getTenantsAction, type CreateTenantData } from "@/lib/actions/tenant-actions"
import { deleteTenant } from "@/lib/supabase/tenants"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/lib/hooks/use-toast"
import { Tenant } from "@/tenant-management/types/tenant"

export default function AdminTenantsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [userTenants, setUserTenants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      fetchData()
    }
  }, [user, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const tenantsData: Tenant[] = await getTenantsAction()
      setTenants(tenantsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "エラー",
        description: "テナントの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTenant = async (tenantData: CreateTenantData) => {
    try {
      await createTenantAction(tenantData)
      await fetchData() // Refresh the list
      toast({
        title: "成功",
        description: "テナントが作成されました",
      })
    } catch (error) {
      console.error('Error creating tenant:', error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "テナントの作成に失敗しました",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTenant = async (tenantId: string, tenantName: string) => {
    if (!confirm(`「${tenantName}」を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      const result = await deleteTenant(tenantId)
      
      if (result.success) {
        await fetchData() // Refresh the list
        toast({
          title: "成功",
          description: "テナントが削除されました",
        })
      } else {
        toast({
          title: "エラー",
          description: result.error || "テナントの削除に失敗しました",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting tenant:', error)
      toast({
        title: "エラー",
        description: "テナントの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

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
            <p className="text-muted-foreground mt-2">読み込み中...</p>
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

  // If a tenant is selected, show the tenant members page
  if (selectedTenant) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTenant(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            テナント一覧に戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">テナント管理</h1>
            <p className="text-muted-foreground mt-1">メンバーと権限を管理します</p>
          </div>
        </div>
        <TenantMembersPage tenantId={selectedTenant} />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">テナント管理</h1>
            <p className="text-muted-foreground mt-1">テナントとメンバーを管理します</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          新しいテナント
        </Button>
      </div>

      {/* Tenants List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => {
          const userTenant = userTenants.find(ut => ut.tenant_id === tenant.id)
          const userRole = userTenant?.role || 'guest'
          
          return (
            <Card key={tenant.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-lg">
                        {tenant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription>{tenant.slug}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTenant(tenant.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        メンバー管理
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Building2 className="h-4 w-4 mr-2" />
                        設定
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenant.description && (
                    <p className="text-sm text-muted-foreground">{tenant.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={userRole === 'owner' ? 'default' : userRole === 'admin' ? 'secondary' : 'outline'}>
                        {userRole === 'owner' ? 'オーナー' : 
                         userRole === 'admin' ? '管理者' : 
                         userRole === 'member' ? 'メンバー' : 'ゲスト'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tenant.max_members}人まで
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    メンバー管理
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">テナントがありません</h3>
              <p className="text-muted-foreground mb-6">
                新しいテナントを作成して、チームでの作業を始めましょう。
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新しいテナントを作成
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Tenant Dialog */}
      <CreateTenantDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTenant={handleCreateTenant}
      />
    </div>
  )
}
