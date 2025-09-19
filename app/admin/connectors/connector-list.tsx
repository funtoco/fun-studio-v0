"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusDot } from "@/components/ui/status-dot"
import { Cable, Settings, Zap, AlertCircle, ExternalLink, Plus } from "lucide-react"
import Link from "next/link"
import { AddConnectorDialog } from "@/components/connectors/add-connector-dialog"
import { 
  getConnectorsV2, 
  connectProviderV2, 
  disconnectProviderV2,
  getProviderDisplayName,
  getStatusColor,
  type ConnectorV2
} from "@/lib/supabase/connectors-v2"
import { getTenants, type Tenant } from "@/lib/supabase/connectors-client"
import { maskClientId } from "@/lib/security/mask"

export function ConnectorList() {
  const [connectors, setConnectors] = useState<ConnectorV2[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  
  // For development, use first tenant
  const currentTenantId = "550e8400-e29b-41d4-a716-446655440001" // Funtoco
  
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [connectorsData, tenantsData] = await Promise.all([
        getConnectorsV2(),
        getTenants()
      ])
      setConnectors(connectorsData)
      setTenants(tenantsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    loadData()
  }, [loadData])
  
  const handleConnect = async (provider: string, connectorId: string) => {
    try {
      await connectProviderV2(provider, currentTenantId, connectorId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed')
    }
  }
  
  const handleDisconnect = async (provider: string, connectorId: string) => {
    if (confirm(`${getProviderDisplayName(provider)} コネクターを切断しますか？`)) {
      try {
        await disconnectProviderV2(provider, currentTenantId, connectorId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Disconnect failed')
      }
    }
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
  
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error: {error}</span>
          </div>
        </div>
      </div>
    )
  }
  
  const handleAddSuccess = (connectorId: string) => {
    setShowAddDialog(false)
    // Refresh connectors list
    loadData()
  }

  return (
    <div className="space-y-6">
      {/* Add Connector Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          コネクター追加
        </Button>
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
      
      {/* Connector Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cable className="h-5 w-5" />
            <span>コネクター一覧</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>コネクター名</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>設定</TableHead>
                <TableHead>スコープ</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {connectors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    コネクターが見つかりません
                  </TableCell>
                </TableRow>
              ) : (
                connectors.map((connector) => (
                  <TableRow key={connector.id}>
                    <TableCell className="font-medium">
                      {connector.name || getProviderDisplayName(connector.provider)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusDot status={connector.status} />
                        {getStatusBadge(connector.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {connector.displayConfig || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {connector.scopes.slice(0, 2).map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                        {connector.scopes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{connector.scopes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(connector.created_at).toLocaleDateString('ja-JP')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {connector.status === 'connected' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnect(connector.provider, connector.id)}
                          >
                            切断
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(connector.provider, connector.id)}
                            disabled={connector.status === 'error'}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            接続
                          </Button>
                        )}
                        
                        <Link href={`/admin/connectors/${connector.provider}?tenantId=${currentTenantId}&connectorId=${connector.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Connector Dialog */}
      <AddConnectorDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        tenantId={currentTenantId}
        onSuccess={handleAddSuccess}
      />
    </div>
  )
}
