"use client"

import { Search, UserPlus, Link, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { TenantMember } from "@/types/tenant"
import { PermissionService } from "@/lib/permissions"

interface MembersToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddMember: () => void
  onCreateInviteLink: () => void
  selectedCount: number
  onBulkAction: (action: string) => void
  currentUser?: TenantMember
}

export function MembersToolbar({
  searchQuery,
  onSearchChange,
  onAddMember,
  onCreateInviteLink,
  selectedCount,
  onBulkAction,
  currentUser,
}: MembersToolbarProps) {
  const canAddMember = currentUser ? PermissionService.canAddMember(currentUser) : false
  const canCreateInviteLink = currentUser ? PermissionService.canCreateInviteLink(currentUser) : false
  const canPerformBulkActions = currentUser ? PermissionService.canPerformBulkActions(currentUser) : false

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="名前またはメールで検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        {selectedCount > 0 && canPerformBulkActions && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedCount}件選択中</span>
            <Button variant="outline" size="sm" onClick={() => onBulkAction("delete")}>
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
                  <strong>Viewer:</strong> 閲覧のみ
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
        <Button onClick={onCreateInviteLink} variant="outline" disabled={!canCreateInviteLink}>
          <Link className="size-4 mr-2" />
          招待リンクを作成
        </Button>
        <Button onClick={onAddMember} disabled={!canAddMember}>
          <UserPlus className="size-4 mr-2" />
          メンバーを追加
        </Button>
      </div>
    </div>
  )
}
