"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Plus, Zap, Unplug } from "lucide-react"
import { AddConnectorDialog } from "@/components/connectors/add-connector-dialog"
import { type Connector } from "@/lib/db/connectors-v2"

interface ConnectorActionsProps {
  tenantId: string
  connector?: Connector
  connectionStatus?: { status: 'connected' | 'disconnected' | 'error' }
  showLabel?: boolean
}

export function ConnectorActions({ tenantId, connector, connectionStatus, showLabel }: ConnectorActionsProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddSuccess = () => {
    setShowAddDialog(false)
    router.refresh() // Refresh to show new connector
  }

  const handleConnect = async () => {
    if (!connector) return
    
    setIsLoading(true)
    try {
      const startUrl = `/api/connect/${connector.provider}/start-v2?tenantId=${tenantId}&connectorId=${connector.id}`
      window.location.href = startUrl
    } catch (err) {
      console.error('Connection failed:', err)
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    if (!connector) return
    
    if (!confirm(`${connector.name} を切断しますか？`)) {
      return
    }
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/connect/${connector.provider}/disconnect-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          tenantId, 
          connectorId: connector.id 
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Disconnect failed')
      }
      
      // Refresh to show updated status
      router.refresh()
    } catch (err) {
      console.error('Disconnect failed:', err)
      alert(`切断に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // If no connector provided, show Add button
  if (!connector) {
    return (
      <>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {showLabel ? 'コネクター追加' : ''}
        </Button>
        
        <AddConnectorDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddSuccess}
        />
      </>
    )
  }

  // Show Connect/Disconnect based on status
  return (
    <>
      {connectionStatus?.status === 'connected' ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={isLoading}
        >
          <Unplug className="h-4 w-4 mr-1" />
          {isLoading ? '切断中...' : '切断'}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={handleConnect}
          disabled={isLoading || connectionStatus?.status === 'error'}
        >
          <Zap className="h-4 w-4 mr-1" />
          {isLoading ? '接続中...' : '接続'}
        </Button>
      )}
    </>
  )
}
