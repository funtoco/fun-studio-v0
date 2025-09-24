"use client"

import { useState } from "react"
import { Copy, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Role, TenantInviteLink } from "@/types/tenant"

interface InviteLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateInviteLink: (link: Omit<TenantInviteLink, "id" | "url" | "createdAt">) => void
}

export function InviteLinkDialog({ open, onOpenChange, onCreateInviteLink }: InviteLinkDialogProps) {
  const [defaultRole, setDefaultRole] = useState<Role>("Member")
  const [expiry, setExpiry] = useState("30days")
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreateLink = () => {
    const expiresAt =
      expiry === "never"
        ? undefined
        : new Date(Date.now() + (expiry === "7days" ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString()

    const linkId = `inv_${Date.now()}`
    const url = `https://app.example.com/invite/${linkId}`

    onCreateInviteLink({
      defaultRole,
      expiresAt,
      isActive: true,
    })

    setGeneratedLink(url)
  }

  const handleCopyLink = async () => {
    if (generatedLink) {
      try {
        await navigator.clipboard.writeText(generatedLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy link:", err)
      }
    }
  }

  const handleInvalidateLink = () => {
    setGeneratedLink(null)
    // 実際の実装では、リンクを無効化するAPIを呼び出す
  }

  const handleClose = () => {
    setDefaultRole("Member")
    setExpiry("30days")
    setGeneratedLink(null)
    setCopied(false)
    onOpenChange(false)
  }

  const expiryLabels = {
    "7days": "7日間",
    "30days": "30日間",
    never: "無期限",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>招待リンクを作成</DialogTitle>
          <DialogDescription>メンバーが自分で参加できる招待リンクを作成します。</DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <div className="grid gap-6 py-4">
            <div className="grid gap-3">
              <Label>有効期限</Label>
              <RadioGroup value={expiry} onValueChange={setExpiry}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7days" id="7days" />
                  <Label htmlFor="7days">7日間</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30days" id="30days" />
                  <Label htmlFor="30days">30日間</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="never" />
                  <Label htmlFor="never">無期限</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="defaultRole">デフォルトロール</Label>
              <Select value={defaultRole} onValueChange={(value: Role) => setDefaultRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer - 閲覧のみ</SelectItem>
                  <SelectItem value="Member">Member - 一般権限</SelectItem>
                  <SelectItem value="Admin">Admin - 管理権限</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCreateLink} className="w-full">
              招待リンクを生成
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>生成された招待リンク</Label>
              <div className="flex items-center gap-2">
                <Input value={generatedLink} readOnly className="flex-1" />
                <Button size="icon" variant="outline" onClick={handleCopyLink} className="shrink-0 bg-transparent">
                  {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600">リンクをコピーしました！</p>}
            </div>

            <div className="space-y-2">
              <Label>設定内容</Label>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>デフォルトロール:</span>
                  <Badge variant="secondary">{defaultRole}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>有効期限:</span>
                  <span>{expiryLabels[expiry as keyof typeof expiryLabels]}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleInvalidateLink} className="flex-1 bg-transparent">
                <X className="size-4 mr-2" />
                無効化
              </Button>
              <Button onClick={handleClose} className="flex-1">
                完了
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
