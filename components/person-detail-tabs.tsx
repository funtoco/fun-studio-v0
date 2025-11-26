"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Timeline } from "@/components/ui/timeline"
import { TreeNoteView } from "@/components/ui/tree-note-view"
import { formatDateTime } from "@/lib/utils"
import type { Meeting, SupportAction, Visa } from "@/lib/models"

interface PersonDetailTabsProps {
  personMeetings: Meeting[]
  personSupportActions: SupportAction[]
  personVisas: Visa[]
}

export function PersonDetailTabs({ personMeetings, personSupportActions, personVisas }: PersonDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("timeline")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="timeline">タイムライン</TabsTrigger>
        <TabsTrigger value="meetings">面談記録</TabsTrigger>
        <TabsTrigger value="support">サポート記録</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>活動タイムライン</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline
              items={[
                ...personMeetings.map((meeting) => ({
                  id: meeting.id,
                  type: "meeting" as const,
                  title: meeting.title,
                  datetime: meeting.datetime,
                  status: meeting.kind,
                })),
                ...personSupportActions.map((action) => ({
                  id: action.id,
                  type: "support" as const,
                  title: action.title,
                  datetime: action.updatedAt,
                  status: action.status,
                })),
                // Add visa status history
                ...personVisas.flatMap((visa) => {
                  const statusDates = [
                    { date: visa.documentPreparationDate, status: "書類準備中" },
                    { date: visa.documentCreationDate, status: "書類作成中" },
                    { date: visa.documentConfirmationDate, status: "書類確認中" },
                    { date: visa.applicationPreparationDate, status: "申請準備中" },
                    { date: visa.visaApplicationPreparationDate, status: "ビザ申請準備中" },
                    { date: visa.applicationDate, status: "申請中" },
                    { date: visa.additionalDocumentsDate, status: "追加書類" },
                    { date: visa.visaAcquiredDate, status: "ビザ取得済み" },
                  ]

                  return statusDates
                    .filter(({ date }) => date)
                    .map(({ date, status }) => ({
                      id: `${visa.id}-${status}`,
                      type: "visa" as const,
                      title: `ビザ状況: ${status}`,
                      datetime: date!,
                      status: status,
                    }))
                }),
              ].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="meetings" className="mt-6">
        <div className="space-y-4">
          {personMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">面談記録がありません</p>
              </CardContent>
            </Card>
          ) : (
            personMeetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {formatDateTime(meeting.datetime)}
                        </span>
                        <Badge variant="outline">{meeting.kind}</Badge>
                        {meeting.durationMin && <span>{meeting.durationMin}分</span>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TreeNoteView notes={meeting.notes} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="support" className="mt-6">
        <div className="space-y-4">
          {personSupportActions.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">サポート記録がありません</p>
              </CardContent>
            </Card>
          ) : (
            personSupportActions.map((action) => (
              <Card key={action.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{action.category}</Badge>
                        <StatusBadge status={action.status} type="support" />
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {action.assignee && <div>担当: {action.assignee}</div>}
                      {action.due && <div>期日: {action.due}</div>}
                    </div>
                  </div>
                </CardHeader>
                {action.detail && (
                  <CardContent>
                    <p className="text-sm">{action.detail}</p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
