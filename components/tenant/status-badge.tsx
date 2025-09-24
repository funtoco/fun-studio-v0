"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'suspended'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'アクティブ',
          variant: 'default' as const,
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'pending':
        return {
          label: '招待中',
          variant: 'secondary' as const,
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        }
      case 'suspended':
        return {
          label: '無効',
          variant: 'destructive' as const,
          icon: <XCircle className="h-3 w-3 mr-1" />,
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      default:
        return {
          label: '不明',
          variant: 'outline' as const,
          icon: <Clock className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
