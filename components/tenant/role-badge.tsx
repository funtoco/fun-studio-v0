"use client"

import { Badge } from "@/components/ui/badge"
import { Crown, Shield, User, UserCheck } from "lucide-react"

interface RoleBadgeProps {
  role: 'owner' | 'admin' | 'member' | 'guest'
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          label: 'オーナー',
          variant: 'default' as const,
          icon: <Crown className="h-3 w-3 mr-1" />,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      case 'admin':
        return {
          label: '管理者',
          variant: 'secondary' as const,
          icon: <Shield className="h-3 w-3 mr-1" />,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      case 'member':
        return {
          label: 'メンバー',
          variant: 'outline' as const,
          icon: <User className="h-3 w-3 mr-1" />,
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'guest':
        return {
          label: 'ゲスト',
          variant: 'outline' as const,
          icon: <UserCheck className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      default:
        return {
          label: '不明',
          variant: 'outline' as const,
          icon: <User className="h-3 w-3 mr-1" />,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getRoleConfig(role)

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
