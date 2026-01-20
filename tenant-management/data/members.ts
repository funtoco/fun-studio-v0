import type { TenantMember } from "@/types/tenant"

export const members: TenantMember[] = [
  {
    id: "mem_001",
    tenantId: "tnt_001",
    name: "FunBase",
    email: "info@funtoco.jp",
    role: "Owner",
    status: "Active",
    lastActiveAt: "2025-06-10T01:20:00Z",
    isSelf: true,
  },
  {
    id: "mem_002",
    tenantId: "tnt_001",
    name: "Tomoaki Nishimura",
    email: "n.t0226@gmail.com",
    role: "Admin",
    status: "Active",
    lastActiveAt: "2025-06-10T03:00:00Z",
  },
  {
    id: "mem_003",
    tenantId: "tnt_001",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "Member",
    status: "Pending",
  },
]
