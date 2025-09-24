"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Role, TenantMember } from "@/types/tenant"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMember: (member: Omit<TenantMember, "id" | "tenantId" | "lastActiveAt">) => void
  existingEmails: string[]
}

export function AddMemberDialog({ open, onOpenChange, onAddMember, existingEmails }: AddMemberDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Member")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "名前を入力してください"
    }

    if (!email.trim()) {
      newErrors.email = "メールアドレスを入力してください"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください"
    } else if (existingEmails.includes(email.toLowerCase())) {
      newErrors.email = "このメールアドレスは既に登録されています"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onAddMember({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role,
      status: "Pending",
    })

    // フォームをリセット
    setName("")
    setEmail("")
    setRole("Member")
    setErrors({})
    onOpenChange(false)
  }

  const handleCancel = () => {
    setName("")
    setEmail("")
    setRole("Member")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>メンバーを追加</DialogTitle>
          <DialogDescription>新しいメンバーをテナントに招待します。招待メールが送信されます。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">名前</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="田中太郎" />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tanaka@example.com"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">ロール</Label>
              <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer - 閲覧のみ</SelectItem>
                  <SelectItem value="Member">Member - 一般権限</SelectItem>
                  <SelectItem value="Admin">Admin - 管理権限</SelectItem>
                  <SelectItem value="Owner">Owner - 全権限</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              キャンセル
            </Button>
            <Button type="submit">招待を送信</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
