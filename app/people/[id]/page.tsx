"use client"

import { useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { Timeline } from "@/components/ui/timeline"
import { TreeNoteView } from "@/components/ui/tree-note-view"
import { people } from "@/data/people"
import { visas } from "@/data/visas"
import { allMeetings } from "@/data/meetings"
import { supportActions } from "@/data/support-actions"
import { formatDate, formatDateTime } from "@/lib/utils"
import { Mail, Phone, MapPin, Building2, Calendar, User, IdCard, User2 } from "lucide-react"

interface PersonDetailPageProps {
  params: { id: string }
}

export default function PersonDetailPage({ params }: PersonDetailPageProps) {
  const [activeTab, setActiveTab] = useState("timeline")

  const person = people.find((p) => p.id === params.id)
  const visa = visas.find((v) => v.personId === params.id)
  const personMeetings = allMeetings.filter((m) => m.personId === params.id)
  const personSupportActions = supportActions.filter((sa) => sa.personId === params.id)

  if (!person) {
    notFound()
  }

  // Generate timeline for this person
  const personTimeline = [
    ...personMeetings.map((meeting) => ({
      id: meeting.id,
      type: "meeting" as const,
      title: meeting.title,
      description: `種別: ${meeting.kind}`,
      datetime: meeting.datetime,
      status: meeting.kind,
    })),
    ...personSupportActions.map((action) => ({
      id: action.id,
      type: "support" as const,
      title: action.title,
      description: `カテゴリ: ${action.category}`,
      datetime: action.updatedAt,
      status: action.status,
    })),
  ].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{person.name}</h1>
                  {person.kana && <p className="text-muted-foreground">{person.kana}</p>}
                  <div className="flex items-center gap-4 mt-2">
                    {person.nationality && (
                      <Badge variant="outline" className="gap-1">
                        <User className="h-3 w-3" />
                        {person.nationality}
                      </Badge>
                    )}
                    {person.company && (
                      <Badge variant="outline" className="gap-1">
                        <Building2 className="h-3 w-3" />
                        {person.company}
                      </Badge>
                    )}
                    {person.workingStatus && (
                      <StatusBadge status={person.workingStatus} type="working" />
                    )}
                  </div>
                </div>
                {visa && (
                  <div className="text-right">
                    <StatusBadge status={visa.status} type="visa" />
                    {visa.expiryDate && (
                      <div className="mt-2">
                        <DeadlineChip date={visa.expiryDate} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabs Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                  <Timeline items={personTimeline} />
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
                                <Calendar className="h-4 w-4" />
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
                            {action.due && <div>期日: {formatDate(action.due)}</div>}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>本人情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {person.dob && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">生年月日</span>
                  </div>
                  <span className="text-sm">{person.dob}</span>
                </div>
              )}
              {person.employeeNumber && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">従業員番号</span>
                  </div>
                  <span className="text-sm">{person.employeeNumber}</span>
                </div>
              )}
              {person.residenceCardNo && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">在留カード番号</span>
                  </div>
                  <span className="text-sm">{person.residenceCardNo}</span>
                </div>
              )}
              {person.residenceCardExpiryDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">在留カード有効期限</span>
                  </div>
                  <span className="text-sm">{person.residenceCardExpiryDate}</span>
                </div>
              )}
              {person.residenceCardIssuedDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">在留カード発行日</span>
                  </div>
                  <span className="text-sm">{person.residenceCardIssuedDate}</span>
                </div>
              )}
              {person.email && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">メールアドレス</span>
                  </div>
                  <span className="text-sm">{person.email}</span>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">電話番号</span>
                  </div>
                  <span className="text-sm">{person.phone}</span>
                </div>
              )}
              {person.address && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">住所</span>
                  </div>
                  <span className="text-sm">{person.address}</span>
                </div>
              )}
              {person.specificSkillField && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">特定技能分野</span>
                  </div>
                  <span className="text-sm">{person.specificSkillField}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visa Information */}
          {visa && (
            <Card>
              <CardHeader>
                <CardTitle>ビザ情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">種別</span>
                  <Badge variant="outline">{visa.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">状況</span>
                  <StatusBadge status={visa.status} type="visa" />
                </div>
                {visa.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">期限</span>
                    <span className="text-sm">{formatDate(visa.expiryDate)}</span>
                  </div>
                )}
                {visa.manager && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">担当者</span>
                    <span className="text-sm">{visa.manager}</span>
                  </div>
                )}
                {visa.submittedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">申請日</span>
                    <span className="text-sm">{formatDate(visa.submittedAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {person.note && (
            <Card>
              <CardHeader>
                <CardTitle>メモ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{person.note}</p>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">面談回数</span>
                <Badge variant="secondary">{personMeetings.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Support件数</span>
                <Badge variant="secondary">{personSupportActions.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">登録日</span>
                <span className="text-sm">{formatDate(person.createdAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
