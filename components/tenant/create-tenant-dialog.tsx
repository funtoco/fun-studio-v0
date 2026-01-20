"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateTenantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTenant: (tenantData: { name: string; slug: string; description?: string }) => void
}

export function CreateTenantDialog({ 
  open, 
  onOpenChange, 
  onCreateTenant 
}: CreateTenantDialogProps) {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "テナント名を入力してください"
    }

    if (!slug.trim()) {
      newErrors.slug = "スラッグを入力してください"
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = "スラッグは小文字、数字、ハイフンのみ使用できます"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onCreateTenant({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      })

      // Reset form
      setName("")
      setSlug("")
      setDescription("")
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating tenant:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setName("")
    setSlug("")
    setDescription("")
    setErrors({})
    onOpenChange(false)
  }

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setSlug(generatedSlug)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新しいテナントを作成</DialogTitle>
          <DialogDescription>
            新しいテナントを作成して、チームでの作業を始めましょう。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">テナント名</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="例: FunBase株式会社"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">スラッグ</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="例: funbase-inc"
              />
              <p className="text-sm text-muted-foreground">
                スラッグはURLで使用されます。小文字、数字、ハイフンのみ使用できます。
              </p>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">説明（任意）</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="テナントの説明を入力してください"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              キャンセル
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '作成中...' : 'テナントを作成'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
