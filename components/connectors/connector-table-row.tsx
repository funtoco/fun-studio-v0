"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { Edit3, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { type Connector } from "@/lib/types/connector"
import { ConnectorActions } from "@/app/admin/connectors/connector-actions"

interface ConnectorTableRowProps {
  connector: Connector
  tenantId: string
  onEdit: (connector: Connector) => void
  onDelete: (connector: Connector) => void
}

export function ConnectorTableRow({ 
  connector, 
  tenantId, 
  onEdit, 
  onDelete 
}: ConnectorTableRowProps) {
  const getStatusBadge = (status: string) => {
    const colorVariant = getStatusColor(status)
    const text = status === 'connected' ? '接続済' : 
                 status === 'disconnected' ? '未接続' : 'エラー'
    
    return (
      <Badge variant={colorVariant as any}>
        {text}
      </Badge>
    )
  }

  const getProviderIcon = (provider: string) => {
    if (provider === 'kintone') {
      return (
        <div className="w-5 h-5 relative">
          <Image 
            src="/kintone-logo-horizontal.webp" 
            alt="Kintone logo" 
            fill 
            className="object-contain"
          />
        </div>
      )
    }
    return null
  }

  const getDisplayConfig = (connector: Connector): string => {
    const config = connector.provider_config
    
    if (connector.provider === 'kintone' && config.subdomain) {
      return `${config.subdomain}.cybozu.com`
    }
    
    return '-'
  }

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          {getProviderIcon(connector.provider)}
          <span>{connector.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {(connector as any).tenant_name || 'Unknown Tenant'}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-mono text-sm">
          {getDisplayConfig(connector)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <StatusDot status={connector.status} />
          {getStatusBadge(connector.status)}
        </div>
      </TableCell>
      <TableCell>
        {new Date(connector.updated_at).toLocaleDateString('ja-JP')}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(connector)}
            title="編集"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(connector)}
            title="削除"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Link href={`/admin/connectors/${connector.id}`}>
            <Button variant="ghost" size="sm" title="詳細">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          
          <ConnectorActions 
            connector={connector} 
            tenantId={tenantId} 
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'connected':
      return 'success'
    case 'disconnected':
      return 'secondary'
    case 'error':
      return 'destructive'
    default:
      return 'secondary'
  }
}
