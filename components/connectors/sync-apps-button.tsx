"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Database, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SyncAppsButtonProps {
  connectorId: string
  onSuccess?: () => void
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  showLabel?: boolean
}

export function SyncAppsButton({ 
  connectorId, 
  onSuccess, 
  variant = "default",
  size = "default",
  showLabel = true 
}: SyncAppsButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSync = async () => {
    setIsLoading(true)
    setShowResult(false)
    
    try {
      const response = await fetch(`/api/integrations/kintone/apps/sync?connectorId=${connectorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Sync failed')
      }
      
      setResult({
        success: true,
        appsCount: data.upserted || 0,
        fieldsCount: 0
      })
      setShowResult(true)
      
      // Hide result after 5 seconds
      setTimeout(() => setShowResult(false), 5000)
      
      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
      
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        appsCount: 0,
        fieldsCount: 0
      })
      setShowResult(true)
      setTimeout(() => setShowResult(false), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleSync}
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <Database className="h-4 w-4" />
        {showLabel && (
          <span>{isLoading ? '同期中...' : 'Kintone アプリを同期'}</span>
        )}
      </Button>
      
      {showResult && result && (
        <Alert 
          variant={result.success ? "default" : "destructive"}
          className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg"
        >
          {result.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">
                {result.success ? '同期完了' : '同期エラー'}
              </div>
              <div className="text-sm">
                アプリ: {result.appsCount || 0} 件, 
                フィールド: {result.fieldsCount || 0} 件
              </div>
              {result.error && (
                <div className="text-xs text-destructive">
                  エラー: {result.error}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
