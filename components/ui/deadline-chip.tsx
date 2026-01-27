import { cn } from "@/lib/utils"
import { getDaysUntilExpiry, isExpiringSoon } from "@/lib/utils"
import { AlertTriangle, Clock } from "lucide-react"

interface DeadlineChipProps {
  date: string
  label?: string
  className?: string
}

export function DeadlineChip({ date, label = "期限", className }: DeadlineChipProps) {
  const daysUntil = getDaysUntilExpiry(date)
  const isUrgent = isExpiringSoon(date, 7)
  const isWarning = isExpiringSoon(date, 30)

  if (daysUntil < 0) {
    return null
  }

  if (isUrgent) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-red-100 text-red-800",
          className,
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        {daysUntil}日後
      </span>
    )
  }

  if (isWarning) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          "bg-yellow-100 text-yellow-800",
          className,
        )}
      >
        <Clock className="h-3 w-3" />
        {daysUntil}日後
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        "bg-gray-100 text-gray-800",
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {daysUntil}日後
    </span>
  )
}
