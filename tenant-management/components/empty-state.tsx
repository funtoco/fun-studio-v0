"use client"

import { Users, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAddMember: () => void
}

export function EmptyState({ onAddMember }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="size-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">メンバーがいません</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">招待リンクを作成するか、メンバーを追加してください。</p>
      <Button onClick={onAddMember}>
        <UserPlus className="size-4 mr-2" />
        メンバーを追加
      </Button>
    </div>
  )
}
