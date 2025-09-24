import { Badge } from "@/components/ui/badge"
import type { Role } from "@/types/tenant"

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const variants = {
    Owner: "bg-red-100 text-red-800 hover:bg-red-100",
    Admin: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Member: "bg-green-100 text-green-800 hover:bg-green-100",
    Viewer: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }

  return (
    <Badge variant="secondary" className={variants[role]}>
      {role}
    </Badge>
  )
}
