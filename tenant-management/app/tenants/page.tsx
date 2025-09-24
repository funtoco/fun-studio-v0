"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Calendar, Mail, UserPlus, LinkIcon } from "lucide-react"
import Link from "next/link"
import { tenants } from "@/data/tenant"
import { members } from "@/data/members"
import { inviteLinks } from "@/data/invites"

export default function TenantsPage() {
  const tenant = tenants[0] // 単一テナント想定
  const tenantMembers = members.filter((m) => m.tenantId === tenant.id)
  const activeMembers = tenantMembers.filter((m) => m.status === "Active")
  const pendingMembers = tenantMembers.filter((m) => m.status === "Pending")
  const activeInvites = inviteLinks.filter((i) => i.isActive)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">テナント概要</h1>
        <p className="text-muted-foreground">テナント情報とメンバー管理の概要を確認できます</p>
      </div>

      {/* テナント基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            {tenant.name}
          </CardTitle>
          <CardDescription>テナント ID: {tenant.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">作成日</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(tenant.createdAt).toLocaleDateString("ja-JP")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">メンバー数</p>
                <p className="text-sm text-muted-foreground">{tenantMembers.length}名</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">オーナー</p>
                <p className="text-sm text-muted-foreground">{tenant.ownerEmail}</p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button asChild>
              <Link href="/tenants/members">
                <Users className="size-4 mr-2" />
                メンバー管理へ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブメンバー</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers.length}</div>
            <p className="text-xs text-muted-foreground">現在アクティブなメンバー</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">保留中の招待</CardTitle>
            <UserPlus className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingMembers.length}</div>
            <p className="text-xs text-muted-foreground">承認待ちのメンバー</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブな招待リンク</CardTitle>
            <LinkIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvites.length}</div>
            <p className="text-xs text-muted-foreground">有効な招待リンク</p>
          </CardContent>
        </Card>
      </div>

      {/* 空状態（メンバーがいない場合） */}
      {tenantMembers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">まだメンバーがいません</h3>
            <p className="text-muted-foreground text-center mb-4">
              チームメンバーを招待して、コラボレーションを始めましょう
            </p>
            <Button asChild>
              <Link href="/tenants/members">
                <UserPlus className="size-4 mr-2" />
                メンバーを招待
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
