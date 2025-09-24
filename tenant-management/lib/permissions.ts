import type { Role, TenantMember } from "@/types/tenant"

export interface PermissionContext {
  currentUser: TenantMember
  targetMember?: TenantMember
  allMembers: TenantMember[]
}

export class PermissionService {
  // ロールの階層レベル（数値が高いほど権限が強い）
  private static roleHierarchy: Record<Role, number> = {
    Viewer: 1,
    Member: 2,
    Admin: 3,
    Owner: 4,
  }

  // メンバーを削除できるかチェック
  static canDeleteMember(context: PermissionContext): boolean {
    const { currentUser, targetMember, allMembers } = context

    if (!targetMember) return false

    // 自分自身は削除できない
    if (targetMember.isSelf) return false

    // Ownerは削除できない
    if (targetMember.role === "Owner") return false

    // 最後のOwnerは削除できない（他にOwnerがいない場合）
    if (targetMember.role === "Owner") {
      const ownerCount = allMembers.filter((m) => m.role === "Owner" && m.status === "Active").length
      if (ownerCount <= 1) return false
    }

    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // メンバーのロールを変更できるかチェック
  static canChangeRole(context: PermissionContext, newRole: Role): boolean {
    const { currentUser, targetMember } = context

    if (!targetMember) return false

    // 自分自身のロールは変更できない
    if (targetMember.isSelf) return false

    // 現在のユーザーがAdmin以上の権限を持っている必要がある
    if (this.roleHierarchy[currentUser.role] < this.roleHierarchy.Admin) {
      return false
    }

    // Ownerは他のOwnerのロールを変更できない（自分以外）
    if (targetMember.role === "Owner" && currentUser.role === "Owner" && !currentUser.isSelf) {
      return false
    }

    // AdminはOwnerのロールを変更できない
    if (targetMember.role === "Owner" && currentUser.role === "Admin") {
      return false
    }

    // AdminはOwnerロールに変更できない
    if (newRole === "Owner" && currentUser.role === "Admin") {
      return false
    }

    return true
  }

  // メンバーのステータスを変更できるかチェック
  static canToggleStatus(context: PermissionContext): boolean {
    const { currentUser, targetMember } = context

    if (!targetMember) return false

    // 自分自身のステータスは変更できない
    if (targetMember.isSelf) return false

    // Ownerのステータスは変更できない
    if (targetMember.role === "Owner") return false

    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // 招待を再送信できるかチェック
  static canResendInvite(context: PermissionContext): boolean {
    const { currentUser, targetMember } = context

    if (!targetMember) return false

    // Pendingステータスのメンバーのみ
    if (targetMember.status !== "Pending") return false

    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // メンバーを追加できるかチェック
  static canAddMember(currentUser: TenantMember): boolean {
    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // 招待リンクを作成できるかチェック
  static canCreateInviteLink(currentUser: TenantMember): boolean {
    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // 一括操作ができるかチェック
  static canPerformBulkActions(currentUser: TenantMember): boolean {
    // Admin以上の権限が必要
    return this.roleHierarchy[currentUser.role] >= this.roleHierarchy.Admin
  }

  // Ownerの降格が可能かチェック（最低1名のOwnerが必要）
  static canDemoteOwner(context: PermissionContext): boolean {
    const { targetMember, allMembers } = context

    if (!targetMember || targetMember.role !== "Owner") return true

    const activeOwnerCount = allMembers.filter((m) => m.role === "Owner" && m.status === "Active").length

    // 最後のOwnerは降格できない
    return activeOwnerCount > 1
  }

  // ロール変更時のバリデーション
  static validateRoleChange(
    context: PermissionContext,
    newRole: Role,
  ): {
    isValid: boolean
    error?: string
  } {
    const { targetMember, allMembers } = context

    if (!targetMember) {
      return { isValid: false, error: "メンバーが見つかりません" }
    }

    // Ownerから他のロールに変更する場合
    if (targetMember.role === "Owner" && newRole !== "Owner") {
      if (!this.canDemoteOwner(context)) {
        return {
          isValid: false,
          error: "最低1名のOwnerが必要です。他のメンバーをOwnerに昇格させてから実行してください。",
        }
      }
    }

    // 権限チェック
    if (!this.canChangeRole(context, newRole)) {
      return {
        isValid: false,
        error: "このロール変更を実行する権限がありません。",
      }
    }

    return { isValid: true }
  }

  // 削除時のバリデーション
  static validateMemberDeletion(context: PermissionContext): {
    isValid: boolean
    error?: string
  } {
    const { targetMember } = context

    if (!targetMember) {
      return { isValid: false, error: "メンバーが見つかりません" }
    }

    if (targetMember.isSelf) {
      return { isValid: false, error: "自分自身を削除することはできません" }
    }

    if (targetMember.role === "Owner") {
      return { isValid: false, error: "Ownerは削除できません" }
    }

    if (!this.canDeleteMember(context)) {
      return { isValid: false, error: "このメンバーを削除する権限がありません" }
    }

    return { isValid: true }
  }
}
