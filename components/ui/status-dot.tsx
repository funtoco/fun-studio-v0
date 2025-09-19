import { cn } from "@/lib/utils"

interface StatusDotProps {
  status: "connected" | "disconnected" | "error" | "active" | "inactive"
  className?: string
}

export function StatusDot({ status, className }: StatusDotProps) {
  const statusConfig = {
    connected: "bg-green-500",
    active: "bg-green-500",
    disconnected: "bg-gray-400",
    inactive: "bg-gray-400",
    error: "bg-red-500",
  }

  return <div className={cn("h-2 w-2 rounded-full", statusConfig[status], className)} />
}
