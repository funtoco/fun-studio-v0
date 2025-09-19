"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Cable, Database, Settings, FileText, Menu, X, ExternalLink, GitBranch } from "lucide-react"

interface ConnectorShellProps {
  children: React.ReactNode
}

// Simplified navigation - only main sections
const getNavigation = (tenantId?: string) => [
  {
    name: "概要",
    href: "/admin/connectors/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "コネクター",
    href: `/admin/connectors${tenantId ? `?tenantId=${tenantId}` : ''}`,
    icon: Cable,
  }
]

const documentationLinks = [
  {
    name: "OAuth クイックガイド",
    href: "#",
    external: true,
  },
  {
    name: "OAuth クライアント追加手順",
    href: "#",
    external: true,
  },
  {
    name: "API リファレンス",
    href: "#",
    external: true,
  },
]

export function ConnectorShell({ children }: ConnectorShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  // Extract tenantId from search params
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const tenantId = urlParams.get('tenantId') || undefined
  
  const navigation = getNavigation(tenantId)

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <Cable className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">FunStudio</span>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            {/* Main Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => {
                // Precise active state logic - only exact matches or specific patterns
                const isActive = pathname === item.href ||
                  (item.href.includes('/apps') && pathname.includes('/apps')) ||
                  (item.href.includes('/mappings') && pathname.includes('/mappings'))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <Separator className="my-6" />

            {/* Documentation Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">開発ガイド</span>
              </div>
              <div className="space-y-1 pl-6">
                {documentationLinks.map((link) => (
                  <button
                    key={link.name}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-not-allowed"
                    disabled
                    title="参照専用（現在は編集不可）"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Status Section */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-foreground">システム状態</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">接続状態</span>
                  <Badge variant="default" className="text-xs">
                    接続済
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">最終同期</span>
                  <span className="text-xs text-muted-foreground">2分前</span>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">コネクター管理</h1>
              <p className="text-sm text-muted-foreground">接続状態とマッピング設定の確認</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              参照専用
            </Badge>
            <Button variant="ghost" size="sm" disabled title="参照専用（現在は編集不可）">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  )
}
