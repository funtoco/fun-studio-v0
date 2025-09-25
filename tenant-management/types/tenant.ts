export type Role = "Owner" | "Admin" | "Member" | "Viewer"
export type MemberStatus = "Active" | "Pending" | "Disabled"

export interface Tenant {
  id: string
  name: string
  slug: string
  description?: string
  max_members: number
  created_at: string
  updated_at: string
}

export interface TenantInviteLink {
  id: string
  url: string
  defaultRole: Role
  expiresAt?: string // ISO | undefined
  isActive: boolean
  createdAt: string
}

export interface TenantMember {
  id: string
  tenantId: string
  name: string
  email: string
  role: Role
  status: MemberStatus
  lastActiveAt?: string
  isSelf?: boolean
}
