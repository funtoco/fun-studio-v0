"use client"

import { useState } from "react"
import { Search, Bell, Settings, User, LogOut, RefreshCw, Cable, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { currentUser } from "@/data/users"

export function Header() {
  const { user, role, signOut, refreshUser } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // デバッグ用
  console.log("Header - user:", user)
  console.log("Header - role:", role)
  console.log("Header - currentUser.role:", currentUser.role)
  console.log("Header - role === 'admin':", role === "admin")
  console.log("Header - currentUser.role === 'admin':", currentUser.role === "admin")
  console.log("Header - 条件全体:", (role === "admin" || currentUser.role === "admin"))

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
      {/* Search and Company Switcher */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="人材名、会社名で検索... (/ でフォーカス)" 
            className="pl-10 w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={refreshUser} title="ユーザー情報をリフレッシュ">
          <RefreshCw className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {(role === "admin" || currentUser.role === "admin") && (
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Settings className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>管理者設定</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/admin/connectors/dashboard')}>
                <Cable className="mr-2 h-4 w-4" />
                コネクター管理
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin/tenants')}>
                <Users className="mr-2 h-4 w-4" />
                テナント管理
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
