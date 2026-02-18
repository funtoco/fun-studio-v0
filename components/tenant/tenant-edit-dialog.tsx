"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import type { Tenant } from "@/tenant-management/types/tenant"

interface TenantEditDialogProps {
  tenant: Tenant | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (tenantId: string, data: { name: string; description: string; slug: string }) => Promise<void>
}

export function TenantEditDialog({
  tenant,
  open,
  onOpenChange,
  onSave,
}: TenantEditDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [slug, setSlug] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (tenant) {
      setName(tenant.name)
      setDescription(tenant.description || "")
      setSlug(tenant.slug)
    }
  }, [tenant])

  const handleSave = async () => {
    if (!tenant) return
    setIsSaving(true)
    try {
      await onSave(tenant.id, { name, description, slug })
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save tenant:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>テナントの編集</DialogTitle>
          <DialogDescription>
            テナントの基本情報を変更します。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">テナント名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="株式会社サンプル"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">スラッグ (ID)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sample-company"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="テナントの詳細説明..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "保存中..." : "保存する"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
