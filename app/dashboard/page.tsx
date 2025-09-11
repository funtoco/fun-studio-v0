"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeline } from "@/components/ui/timeline"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Calendar, AlertTriangle } from "lucide-react"
import { people } from "@/data/people"
import { visas } from "@/data/visas"
import { allMeetings } from "@/data/meetings"
import { supportActions } from "@/data/support-actions"
import { generateActivityTimeline, isExpiringSoon, formatDate } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  // Calculate KPIs
  const totalPeople = people.length
  const expiringSoon = visas.filter((visa) => visa.expiryDate && isExpiringSoon(visa.expiryDate, 30)).length
  const thisMonthMeetings = allMeetings.filter((meeting) => {
    const meetingDate = new Date(meeting.datetime)
    const now = new Date()
    return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear()
  }).length

  // Generate recent activity (last 10 items)
  const recentActivity = generateActivityTimeline(people, visas, allMeetings, supportActions)
    .slice(0, 10)
    .map((activity) => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: `${activity.personName}`,
      datetime: activity.datetime,
      status: activity.status,
      // Removed onClick handler - navigation will be handled by Timeline component internally
    }))

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ダッシュボード</h1>
        <p className="text-muted-foreground mt-2">ビザ進捗管理システムの概要</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">人材総数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPeople}</div>
            <p className="text-xs text-muted-foreground">登録済み外国人人材</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在留期限30日以内</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringSoon}</div>
            <p className="text-xs text-muted-foreground">要注意対象者</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今月の面談件数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthMeetings}</div>
            <p className="text-xs text-muted-foreground">実施済み面談</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">アクティブなSupport</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supportActions.filter((action) => action.status !== "done").length}
            </div>
            <p className="text-xs text-muted-foreground">対応中・未対応</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>最近の活動</CardTitle>
              <p className="text-sm text-muted-foreground">面談、ビザ更新、Support記録の最新10件</p>
            </CardHeader>
            <CardContent>
              <Timeline items={recentActivity} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Links */}
        <div className="space-y-6">
          {/* Visa Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>ビザ進捗状況</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["書類準備中", "書類作成中", "書類確認中", "申請準備中", "ビザ申請準備中", "申請中", "ビザ取得済み"].map(
                (status) => {
                  const count = visas.filter((visa) => visa.status === status).length
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm">{status}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  )
                },
              )}
              <div className="pt-2 border-t">
                <Link href="/visas" className="text-sm text-primary hover:underline">
                  ビザ進捗ボードを見る →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Expiring Visas */}
          <Card>
            <CardHeader>
              <CardTitle>期限が近いビザ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visas
                  .filter((visa) => visa.expiryDate && isExpiringSoon(visa.expiryDate, 60))
                  .sort((a, b) => new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime())
                  .slice(0, 5)
                  .map((visa) => {
                    const person = people.find((p) => p.id === visa.personId)
                    if (!person) return null

                    return (
                      <div key={visa.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium">{person.name}</div>
                          <div className="text-muted-foreground">{visa.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-muted-foreground">{formatDate(visa.expiryDate!)}</div>
                          <Badge
                            variant={isExpiringSoon(visa.expiryDate!, 30) ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {isExpiringSoon(visa.expiryDate!, 7) ? "緊急" : "注意"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                {visas.filter((visa) => visa.expiryDate && isExpiringSoon(visa.expiryDate, 60)).length === 0 && (
                  <p className="text-sm text-muted-foreground">期限が近いビザはありません</p>
                )}
              </div>
              <div className="pt-3 border-t">
                <Link href="/people" className="text-sm text-primary hover:underline">
                  人材一覧を見る →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/meetings"
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm"
              >
                <div className="font-medium">面談記録を確認</div>
                <div className="text-muted-foreground">最新の面談状況を確認</div>
              </Link>
              <Link href="/actions" className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm">
                <div className="font-medium">Support記録を確認</div>
                <div className="text-muted-foreground">対応中のサポート案件</div>
              </Link>
              <Link
                href="/timeline"
                className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm"
              >
                <div className="font-medium">全体タイムライン</div>
                <div className="text-muted-foreground">すべての活動を時系列で確認</div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
