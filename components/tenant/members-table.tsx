"use client"

import { MoreHorizontal, Trash2, UserX, UserCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RoleBadge } from "./role-badge"
import { StatusBadge } from "./status-badge"
import type { UserTenant } from "@/lib/supabase/tenants"

interface MembersTableProps {
  members: UserTenant[]
  selectedMembers: string[]
  onSelectMember: (memberId: string, selected: boolean) => void
  onSelectAll: (selected: boolean) => void
  onChangeRole: (memberId: string, role: 'owner' | 'admin' | 'member' | 'guest') => void
  onDeleteMember: (memberId: string) => void
  currentUserRole: 'owner' | 'admin' | 'member' | 'guest'
  currentUserId?: string
}

export function MembersTable({
  members,
  selectedMembers,
  onSelectMember,
  onSelectAll,
  onChangeRole,
  onDeleteMember,
  currentUserRole,
  currentUserId,
}: MembersTableProps) {
  const allSelected = members.length > 0 && selectedMembers.length === members.length
  const someSelected = selectedMembers.length > 0 && selectedMembers.length < members.length

  const formatLastActive = (joinedAt?: string) => {
    if (!joinedAt) return "-"
    return new Date(joinedAt).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Permission checks
  const canChangeRole = (targetMember: UserTenant) => {
    if (currentUserRole === 'guest' || currentUserRole === 'member') return false
    if (targetMember.user_id === currentUserId) return false // Can't change own role
    if (targetMember.role === 'owner' && currentUserRole !== 'owner') return false
    return true
  }

  const canDeleteMember = (targetMember: UserTenant) => {
    if (currentUserRole === 'guest' || currentUserRole === 'member') return false
    if (targetMember.user_id === currentUserId) return false // Can't delete self
    if (targetMember.role === 'owner') return false // Can't delete owner
    return true
  }

  const canToggleStatus = (targetMember: UserTenant) => {
    if (currentUserRole === 'guest' || currentUserRole === 'member') return false
    if (targetMember.user_id === currentUserId) return false // Can't change own status
    if (targetMember.role === 'owner') return false // Can't change owner status
    return true
  }

  const handleRoleChange = (member: UserTenant, newRole: 'owner' | 'admin' | 'member' | 'guest') => {
    if (!canChangeRole(member)) return
    onChangeRole(member.id, newRole)
  }

  const handleDeleteMember = (member: UserTenant) => {
    if (!canDeleteMember(member)) return
    onDeleteMember(member.id)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={onSelectAll}
                aria-label="すべて選択"
                {...(someSelected && { "data-state": "indeterminate" })}
              />
            </TableHead>
            <TableHead>名前</TableHead>
            <TableHead>メール</TableHead>
            <TableHead>ロール</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>参加日</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const isCurrentUser = member.user_id === currentUserId
            const displayName = member.user?.user_metadata?.name || member.user?.email || 'Unknown User'
            const email = member.user?.email || ''

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={(checked) => onSelectMember(member.id, checked as boolean)}
                    aria-label={`${displayName}を選択`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{displayName}</span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          自分
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>
                  <RoleBadge role={member.role} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={member.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatLastActive(member.joined_at)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">メニューを開く</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canChangeRole(member) && (
                        <>
                          {member.role !== 'owner' && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member, 'owner')}
                            >
                              Ownerに変更
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'admin' && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member, 'admin')}
                            >
                              Adminに変更
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'member' && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member, 'member')}
                            >
                              Memberに変更
                            </DropdownMenuItem>
                          )}
                          {member.role !== 'guest' && (
                            <DropdownMenuItem
                              onClick={() => handleRoleChange(member, 'guest')}
                            >
                              Guestに変更
                            </DropdownMenuItem>
                          )}
                        </>
                      )}

                      {canChangeRole(member) && canToggleStatus(member) && <DropdownMenuSeparator />}

                      {canToggleStatus(member) &&
                        (member.status === "active" ? (
                          <DropdownMenuItem onClick={() => {/* TODO: Implement status toggle */}}>
                            <UserX className="size-4 mr-2" />
                            一時無効化
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => {/* TODO: Implement status toggle */}}>
                            <UserCheck className="size-4 mr-2" />
                            有効化
                          </DropdownMenuItem>
                        ))}

                      {canDeleteMember(member) && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMember(member)} 
                            className="text-destructive"
                          >
                            <Trash2 className="size-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
