"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, AlertTriangle } from "lucide-react"
import { deleteConnector } from '@/lib/supabase/connectors-v2'

interface DeleteConnectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  connectorId: string
  connectorName: string
  onDeleted: () => void
}

export function DeleteConnectorDialog({
  open,
  onOpenChange,
  connectorId,
  connectorName,
  onDeleted
}: DeleteConnectorDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetch(`/api/admin/connectors/${connectorId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete connector')
      }

      // Close dialog and refresh list
      onOpenChange(false)
      onDeleted()
    } catch (err) {
      console.error('Delete error:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete connector')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <span>コネクター削除</span>
          </DialogTitle>
          <DialogDescription>
            この操作は取り消すことができません。以下のコネクターを削除してもよろしいですか？
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium">{connectorName}</div>
            <div className="text-sm text-muted-foreground">ID: {connectorId}</div>
          </div>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-1">
                <div className="font-medium">削除されるデータ:</div>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>コネクター設定</li>
                  <li>OAuth認証情報</li>
                  <li>同期ログ</li>
                  <li>マッピング設定</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="min-w-[100px]"
          >
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
