import { cn } from "@/lib/utils"
import { getVisaStatusColor, getSupportStatusColor, getWorkingStatusColor } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type?: "visa" | "support" | "working"
  className?: string
}

export function StatusBadge({ status, type = "visa", className }: StatusBadgeProps) {
  const colorClass = 
    type === "visa" ? getVisaStatusColor(status) :
    type === "support" ? getSupportStatusColor(status) :
    getWorkingStatusColor(status)

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colorClass, className)}
    >
      {status}
    </span>
  )
}
