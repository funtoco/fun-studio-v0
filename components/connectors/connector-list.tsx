"use client"

import { useState, useEffect, useCallback } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cable, Plus, AlertCircle } from "lucide-react"
import { AddConnectorDialog } from "./add-connector-dialog"
import { ConnectorTableRow } from "./connector-table-row"
import { EditConnectorDialog } from "./edit-connector-dialog"
import { DeleteConnectorDialog } from "./delete-connector-dialog"
import { type Connector } from "@/lib/types/connector"

interface ConnectorListProps {
  tenantId: string
  searchQuery?: string
}

export function ConnectorList({ tenantId, searchQuery }: ConnectorListProps) {
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null)

  const loadConnectors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // If tenantId is provided, filter by tenant, otherwise get all connectors
      const url = tenantId 
        ? `/api/admin/connectors?tenantId=${tenantId}&q=${searchQuery || ''}`
        : `/api/admin/connectors?q=${searchQuery || ''}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch connectors')
      const data = await response.json()
      setConnectors(data.connectors || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connectors')
    } finally {
      setLoading(false)
    }
  }, [tenantId, searchQuery])

  useEffect(() => {
    loadConnectors()
  }, [loadConnectors])

  const handleEdit = (connector: Connector) => {
    setSelectedConnector(connector)
    setShowEditDialog(true)
  }

  const handleDelete = (connector: Connector) => {
    setSelectedConnector(connector)
    setShowDeleteDialog(true)
  }

  const handleDialogClose = () => {
    setShowEditDialog(false)
    setShowDeleteDialog(false)
    setSelectedConnector(null)
  }

  const handleDataRefresh = () => {
    loadConnectors()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Connectors</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadConnectors}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Connector Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Cable className="h-5 w-5" />
              <span>コネクター一覧</span>
              {searchQuery && (
                <Badge variant="outline" className="ml-2">
                  検索: {searchQuery}
                </Badge>
              )}
            </CardTitle>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              コネクター追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {connectors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">コネクターが見つかりません</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                最初のコネクターを追加
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>テナント名</TableHead>
                  <TableHead>プロバイダー</TableHead>
                  <TableHead>設定</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>更新日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connectors.map((connector) => (
                  <ConnectorTableRow
                    key={connector.id}
                    connector={connector}
                    tenantId={tenantId}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddConnectorDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        tenantId={tenantId}
        onSuccess={handleDataRefresh}
      />

      {selectedConnector && (
        <EditConnectorDialog
          open={showEditDialog}
          onOpenChange={handleDialogClose}
          connector={selectedConnector}
          onUpdated={handleDataRefresh}
        />
      )}

      {selectedConnector && (
        <DeleteConnectorDialog
          open={showDeleteDialog}
          onOpenChange={handleDialogClose}
          connectorId={selectedConnector.id}
          connectorName={selectedConnector.name}
          onDeleted={handleDataRefresh}
        />
      )}
    </div>
  )
}
