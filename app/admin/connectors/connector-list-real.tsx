/**
 * Real connector list with SSR, search, and filtering
 */

import { Suspense } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { EmptyState } from "@/components/ui/empty-state"
import { Cable, Settings, Zap, AlertCircle, ExternalLink, Plus, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { listConnectors, type Connector } from "@/lib/db/connectors"
import { maskClientId } from "@/lib/security/mask"
import { AddConnectorSimple } from "@/components/connectors/add-connector-simple"
import { ConnectorActions } from "./connector-actions"
import { ConnectorSearch } from "./connector-search"

interface ConnectorListRealProps {
  tenantId: string
  searchQuery?: string
}

export async function ConnectorListReal({ tenantId, searchQuery }: ConnectorListRealProps) {
  let connectors: Connector[] = []
  let error: string | null = null
  
  try {
    connectors = await listConnectors(tenantId, searchQuery)
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load connectors'
    console.error('Failed to load connectors:', err)
  }
  
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
    switch (provider) {
      case 'kintone':
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
      case 'hubspot':
        return (
          <div className="w-5 h-5 relative">
            <Image
              src="/imgbin-logo-hubspot-inc.jpg"
              alt="HubSpot logo"
              fill
              className="object-contain"
            />
          </div>
        )
      default:
        return <Cable className="h-5 w-5" />
    }
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex items-center justify-between">
        <ConnectorSearch initialQuery={searchQuery} />
        <ConnectorActions tenantId={tenantId} />
      </div>

      {/* Summary Cards */}
      {connectors.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">接続済</span>
              </div>
              <div className="text-2xl font-bold">
                {connectors.filter(c => c.status === 'connected').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-muted-foreground">未接続</span>
              </div>
              <div className="text-2xl font-bold">
                {connectors.filter(c => c.status === 'disconnected').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">エラー</span>
              </div>
              <div className="text-2xl font-bold">
                {connectors.filter(c => c.status === 'error').length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Connector Table or Empty State */}
      {connectors.length === 0 ? (
        <EmptyState
          icon={<Cable className="h-12 w-12" />}
          title="コネクターがまだありません"
          description="新しいコネクターを作成してサービス連携を開始してください"
          action={
            <ConnectorActions tenantId={tenantId} showLabel />
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Cable className="h-5 w-5" />
              <span>コネクター一覧</span>
              {searchQuery && (
                <Badge variant="outline" className="ml-2">
                  検索: {searchQuery}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>プロバイダー</TableHead>
                  <TableHead>設定</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectors.map((connector) => (
                  <TableRow key={connector.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getProviderIcon(connector.provider)}
                        <span>{connector.name}</span>
                      </div>
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
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/connectors/${connector.id}?tenantId=${tenantId}`}>
                          <Button variant="ghost" size="sm">
                            詳細
                          </Button>
                        </Link>
                        
                        <ConnectorActions 
                          connector={connector} 
                          tenantId={tenantId} 
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Helper functions
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

function getDisplayConfig(connector: Connector): string {
  const config = connector.provider_config
  
  if (connector.provider === 'kintone' && config.subdomain) {
    return `${config.subdomain}.cybozu.com`
  }
  
  if (connector.provider === 'hubspot' && config.portalId) {
    return `Portal: ${config.portalId}`
  }
  
  const keys = Object.keys(config).filter(key => config[key])
  if (keys.length === 0) return '-'
  
  return keys.map(key => `${key}: ${config[key]}`).join(', ')
}

// Loading component
export function ConnectorListLoading() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
