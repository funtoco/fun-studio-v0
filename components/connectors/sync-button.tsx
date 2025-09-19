"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface SyncButtonProps {
  connectorId: string
  tenantId: string
}

export function SyncButton({ connectorId, tenantId }: SyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)
  const router = useRouter()

  const handleSync = async () => {
    setIsLoading(true)
    setShowResult(false)
    
    try {
      const response = await fetch(`/api/connectors/${connectorId}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tenantId })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Sync failed')
      }
      
      setLastResult(result)
      setShowResult(true)
      
      // Hide result after 5 seconds
      setTimeout(() => setShowResult(false), 5000)
      
      // Refresh page to show updated data
      router.refresh()
      
    } catch (err) {
      setLastResult({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        synced: { people: 0, visas: 0 }
      })
      setShowResult(true)
      setTimeout(() => setShowResult(false), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span>{isLoading ? 'データ同期中...' : 'データ同期'}</span>
      </Button>
      
      {showResult && lastResult && (
        <Alert 
          variant={lastResult.success ? "default" : "destructive"}
          className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg"
        >
          {lastResult.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">
                {lastResult.success ? 'データ同期完了' : 'データ同期エラー'}
                {lastResult.mock && <Badge variant="outline" className="ml-2 text-xs">Mock</Badge>}
              </div>
              <div className="text-sm">
                人材: {lastResult.synced?.people || 0} 件, 
                ビザ: {lastResult.synced?.visas || 0} 件
              </div>
              {lastResult.duration && (
                <div className="text-xs text-muted-foreground">
                  実行時間: {(lastResult.duration / 1000).toFixed(1)}秒
                </div>
              )}
              {lastResult.errors && lastResult.errors.length > 0 && (
                <div className="text-xs text-destructive">
                  エラー: {lastResult.errors.length} 件
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
