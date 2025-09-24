import { Badge } from "@/components/ui/badge"
import type { MemberStatus } from "@/types/tenant"

interface StatusBadgeProps {
  status: MemberStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    Active: "bg-green-100 text-green-800 hover:bg-green-100",
    Pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    Disabled: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  }

  const labels = {
    Active: "アクティブ",
    Pending: "保留中",
    Disabled: "無効",
  }

  return (
    <Badge variant="secondary" className={variants[status]}>
      {labels[status]}
    </Badge>
  )
}
