"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit3, AlertTriangle, CheckCircle } from "lucide-react"
import { type Connector } from '@/lib/types/connector'

interface EditConnectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  connector: Connector
  onUpdated: () => void
}

export function EditConnectorDialog({
  open,
  onOpenChange,
  connector,
  onUpdated
}: EditConnectorDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [subdomain, setSubdomain] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    if (connector && open) {
      const config = connector.provider_config
      setSubdomain(config.subdomain || '')
      setClientId(config.client_id || '')
      setClientSecret(config.client_secret || '')
      setError(null)
      setSuccess(false)
    }
  }, [connector, open])

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      setError(null)
      setSuccess(false)

      const updatedConfig = {
        ...connector.provider_config,
        subdomain: subdomain.trim(),
        client_id: clientId.trim(),
        client_secret: clientSecret.trim()
      }

      const response = await fetch(`/api/admin/connectors/${connector.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider_config: updatedConfig
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update connector')
      }

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        onUpdated()
      }, 1500)
    } catch (err) {
      console.error('Update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update connector')
    } finally {
      setIsUpdating(false)
    }
  }

  const isFormValid = subdomain.trim() && clientId.trim() && clientSecret.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>コネクター編集</span>
          </DialogTitle>
          <DialogDescription>
            {connector.provider.charAt(0).toUpperCase() + connector.provider.slice(1)} コネクターの設定を編集できます
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Provider Info */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{connector.provider}</Badge>
            <Badge variant={connector.status === 'connected' ? 'default' : 'secondary'}>
              {connector.status === 'connected' ? '接続済み' : '未接続'}
            </Badge>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain">サブドメイン</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="funtoco"
                  disabled={isUpdating}
                />
                <span className="text-sm text-muted-foreground">.cybozu.com</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="OAuth Client ID"
                disabled={isUpdating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="OAuth Client Secret"
                disabled={isUpdating}
              />
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                コネクターが正常に更新されました
              </AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              設定を変更した後、再度接続が必要な場合があります。
              既存のOAuth認証情報は無効になる可能性があります。
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || !isFormValid}
            className="min-w-[100px]"
          >
            {isUpdating ? '更新中...' : '更新'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
