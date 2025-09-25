"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, Link, HelpCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MembersTable } from "./members-table"
import { InviteMemberDialog } from "./invite-member-dialog"
import { InviteLinkDialog } from "./invite-link-dialog"
import { ConfirmDialog } from "./confirm-dialog"
import { EmptyState } from "./empty-state"
import { 
  getTenantMembers, 
  getTenantInvitations, 
  createTenantInvitation,
  updateUserTenantRole,
  removeUserFromTenant,
  cancelTenantInvitation,
  type UserTenant
} from "@/lib/supabase/tenants"
import { useAuth } from "@/contexts/auth-context"

interface TenantMembersPageProps {
  tenantId: string
}

export function TenantMembersPage({ tenantId }: TenantMembersPageProps) {
  const { user } = useAuth()
  const [members, setMembers] = useState<UserTenant[]>([])
  const [invitations, setInvitations] = useState<UserTenant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  // Dialog states
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isInviteLinkDialogOpen, setIsInviteLinkDialogOpen] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: "default" | "destructive"
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  useEffect(() => {
    fetchData()
  }, [tenantId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [membersData, invitationsData] = await Promise.all([
        getTenantMembers(tenantId),
        getTenantInvitations(tenantId)
      ])
      setMembers(membersData)
      setInvitations(invitationsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get current user's role in this tenant
  const currentUserMember = members.find(m => m.user_id === user?.id)
  const currentUserRole = currentUserMember?.role || 'guest'
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin'

  // Filtered members based on search and tab
  const filteredMembers = useMemo(() => {
    let filtered = members

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (member) =>
          (member.email || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Tab filter
    if (activeTab !== "all") {
      const statusMap: Record<string, string> = {
        active: "active",
        pending: "pending",
      }
      filtered = filtered.filter((member) => member.status === statusMap[activeTab])
    }

    return filtered
  }, [members, searchQuery, activeTab])

  // Handle member selection
  const handleSelectMember = (memberId: string, selected: boolean) => {
    setSelectedMembers((prev) => 
      selected 
        ? [...prev, memberId] 
        : prev.filter((id) => id !== memberId)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedMembers(selected ? filteredMembers.map((m) => m.id) : [])
  }

  // Handle role change
  const handleChangeRole = async (memberId: string, role: 'owner' | 'admin' | 'member' | 'guest') => {
    try {
      await updateUserTenantRole(memberId, role)
      await fetchData()
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  // Handle member removal
  const handleDeleteMember = async (memberId: string) => {
    try {
      await removeUserFromTenant(memberId)
      await fetchData()
      setSelectedMembers(prev => prev.filter(id => id !== memberId))
    } catch (error) {
      console.error('Error removing member:', error)
    }
  }

  // Handle bulk actions
  const handleBulkAction = async (action: string) => {
    if (action === "delete") {
      try {
        await Promise.all(selectedMembers.map(id => removeUserFromTenant(id)))
        await fetchData()
        setSelectedMembers([])
      } catch (error) {
        console.error('Error bulk deleting members:', error)
      }
    }
  }

  // Handle member invitation
  const handleAddMember = async (memberData: { name: string; email: string; role: 'admin' | 'member' | 'guest' }) => {
    try {
      const result = await createTenantInvitation(tenantId, memberData.email, memberData.role)
      if (result.success) {
        await fetchData()
        // Show success message or toast here if needed
      } else {
        console.error('Error creating invitation:', result.error)
        // Show error message or toast here if needed
      }
    } catch (error) {
      console.error('Error creating invitation:', error)
    }
  }

  // Show delete confirmation
  const showDeleteConfirm = (memberId: string) => {
    const member = members.find((m) => m.id === memberId)
    if (!member) return

    setConfirmDialog({
      open: true,
      title: "メンバーを削除",
      description: `${member.email || 'このメンバー'}さんをテナントから削除しますか？この操作は取り消せません。`,
      onConfirm: () => handleDeleteMember(memberId),
      variant: "destructive",
    })
  }

  const pendingCount = members.filter((m) => m.status === "pending").length
  const activeCount = members.filter((m) => m.status === "active").length

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">メンバー</h1>
          <p className="text-muted-foreground">テナントのメンバーを管理します</p>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          読み込み中...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">メンバー</h1>
        <p className="text-muted-foreground">テナントのメンバーを管理します</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="名前またはメールで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {selectedMembers.length > 0 && canManageMembers && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedMembers.length}件選択中</span>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")}>
                一括削除
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <HelpCircle className="size-4 mr-2" />
                権限ルールを見る
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">権限ルール</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Owner:</strong> 全権限。他のOwnerの降格は不可。最低1名必要。
                  </p>
                  <p>
                    <strong>Admin:</strong> メンバーCRUDとロール変更可（Owner以外）
                  </p>
                  <p>
                    <strong>Member:</strong> 一般権限
                  </p>
                  <p>
                    <strong>Guest:</strong> 閲覧のみ
                  </p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      • 自分自身のロール変更・削除は不可
                      <br />• Ownerの削除・無効化は不可
                      <br />• 最後のOwnerの降格は不可
                    </p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            onClick={() => setIsInviteLinkDialogOpen(true)} 
            variant="outline" 
            disabled={!canManageMembers}
          >
            <Link className="size-4 mr-2" />
            招待リンクを作成
          </Button>
          <Button 
            onClick={() => setIsInviteDialogOpen(true)} 
            disabled={!canManageMembers}
          >
            <UserPlus className="size-4 mr-2" />
            メンバーを追加
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({members.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredMembers.length === 0 ? (
            searchQuery ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">検索条件に一致するメンバーが見つかりません</p>
              </div>
            ) : (
              <EmptyState onAddMember={() => setIsInviteDialogOpen(true)} />
            )
          ) : (
            <MembersTable
              members={filteredMembers}
              selectedMembers={selectedMembers}
              onSelectMember={handleSelectMember}
              onSelectAll={handleSelectAll}
              onChangeRole={handleChangeRole}
              onDeleteMember={showDeleteConfirm}
              currentUserRole={currentUserRole}
              currentUserId={user?.id}
            />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">保留中のメンバーはいません</p>
            </div>
          ) : (
            <MembersTable
              members={filteredMembers}
              selectedMembers={selectedMembers}
              onSelectMember={handleSelectMember}
              onSelectAll={handleSelectAll}
              onChangeRole={handleChangeRole}
              onDeleteMember={showDeleteConfirm}
              currentUserRole={currentUserRole}
              currentUserId={user?.id}
            />
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">アクティブなメンバーはいません</p>
            </div>
          ) : (
            <MembersTable
              members={filteredMembers}
              selectedMembers={selectedMembers}
              onSelectMember={handleSelectMember}
              onSelectAll={handleSelectAll}
              onChangeRole={handleChangeRole}
              onDeleteMember={showDeleteConfirm}
              currentUserRole={currentUserRole}
              currentUserId={user?.id}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <InviteMemberDialog
        tenantId={tenantId}
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        onInviteSent={handleAddMember}
      />

      <InviteLinkDialog
        tenantId={tenantId}
        open={isInviteLinkDialogOpen}
        onOpenChange={setIsInviteLinkDialogOpen}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
        confirmText="削除"
      />
    </div>
  )
}
