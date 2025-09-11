import { cn } from "@/lib/utils"
import { getVisaStatusColor, getSupportStatusColor } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type?: "visa" | "support"
  className?: string
}

export function StatusBadge({ status, type = "visa", className }: StatusBadgeProps) {
  const colorClass = type === "visa" ? getVisaStatusColor(status) : getSupportStatusColor(status)

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass, className)}
    >
      {status}
    </span>
  )
}
