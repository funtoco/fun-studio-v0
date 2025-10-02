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
import { Loader2 } from "lucide-react"

interface StatusToggleDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  currentStatus: boolean
  appName: string
  isLoading?: boolean
}

export function StatusToggleDialog({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  appName,
  isLoading = false
}: StatusToggleDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Error toggling status:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const newStatus = !currentStatus
  const statusText = newStatus ? '有効' : '無効'
  const actionText = newStatus ? '有効化' : '無効化'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>マッピング{actionText}の確認</DialogTitle>
          <DialogDescription>
            「{appName}」のマッピングを{statusText}にしますか？
            {!newStatus && (
              <span className="block mt-2 text-amber-600 font-medium">
                無効化すると、このマッピングでのデータ連携が停止されます。
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing || isLoading}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing || isLoading}
            variant={newStatus ? "default" : "destructive"}
          >
            {isProcessing || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                処理中...
              </>
            ) : (
              actionText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
