import type { TenantInviteLink } from "@/types/tenant"

export const inviteLinks: TenantInviteLink[] = [
  {
    id: "inv_001",
    url: "https://app.example.com/invite/inv_001",
    defaultRole: "Member",
    expiresAt: "2025-07-31T00:00:00Z",
    isActive: true,
    createdAt: "2025-06-09T10:00:00Z",
  },
]
