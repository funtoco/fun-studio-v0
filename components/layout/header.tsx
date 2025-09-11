"use client"

import { Search, Bell, Settings, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  // デバッグ用
  console.log("Header - user:", user)
  console.log("Header - user email:", user?.email)

  const handleSignOut = async () => {
    console.log("ログアウトボタンがクリックされました")
    await signOut()
    // AuthContextでリダイレクト処理を行うため、ここでは何もしない
  }

  const handleUserIconClick = () => {
    console.log("ユーザーアイコンがクリックされました")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="人材名、会社名で検索... (/ でフォーカス)" className="pl-10" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">ログイン中...</div>
        )}
      </div>
    </header>
  )
}
