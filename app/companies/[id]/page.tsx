"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Building2, Users, Phone, Mail, Globe, MapPin, Calendar, DollarSign } from "lucide-react"
import { getCompanyById, getPeopleByCompanyId } from "@/lib/supabase/companies"
import { getVisas } from "@/lib/supabase/visas"
import { useAuth } from "@/contexts/auth-context"
import type { Company, Person, Visa } from "@/lib/models"

interface PersonWithVisa extends Person {
  visaStatus?: string
  visaType?: string
  expiryDate?: string
}

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, role, loading: authLoading } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [people, setPeople] = useState<PersonWithVisa[]>([])
  const [visas, setVisas] = useState<Visa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const companyId = params.id as string
        
        const [companyData, peopleData, visasData] = await Promise.all([
          getCompanyById(companyId),
          getPeopleByCompanyId(companyId),
          getVisas()
        ])
        
        if (!companyData) {
          setError('法人が見つかりません')
          return
        }
        
        setCompany(companyData)
        setVisas(visasData)
        
        // Combine people with their visa information
        const peopleWithVisas: PersonWithVisa[] = peopleData.map((person) => {
          const visa = visasData.find((v) => v.personId === person.id)
          return {
            ...person,
            visaStatus: visa?.status,
            visaType: visa?.type,
            expiryDate: visa?.expiryDate,
          }
        })
        
        setPeople(peopleWithVisas)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchData()
    }
  }, [params.id, user, authLoading])

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">法人詳細</h1>
            <p className="text-muted-foreground mt-2">認証中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">法人詳細</h1>
            <p className="text-muted-foreground mt-2">ログインが必要です</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">法人詳細</h1>
            <p className="text-muted-foreground mt-2">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">法人詳細</h1>
            <p className="text-muted-foreground mt-2">{error || '法人が見つかりません'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">{company.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
            {company.nameKana && (
              <p className="text-muted-foreground mt-1">{company.nameKana}</p>
            )}
            {role && (
              <div className="mt-2">
                <Badge variant="secondary">ロール: {role}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                基本情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.industry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">業界</label>
                    <div className="mt-1">
                      <Badge variant="outline">{company.industry}</Badge>
                    </div>
                  </div>
                )}
                {company.representative && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">代表者</label>
                    <div className="mt-1">{company.representative}</div>
                  </div>
                )}
                {company.establishedDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">設立日</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(company.establishedDate).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                )}
                {company.capital && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">資本金</label>
                    <div className="mt-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {company.capital}
                    </div>
                  </div>
                )}
                {company.employeeCount && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">従業員数</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {company.employeeCount}人
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>連絡先情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">住所</label>
                    <div className="mt-1 flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{company.address}</span>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">電話番号</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {company.phone}
                    </div>
                  </div>
                )}
                {company.email && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">メールアドレス</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {company.email}
                    </div>
                  </div>
                )}
                {company.website && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">ウェブサイト</label>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {company.description && (
            <Card>
              <CardHeader>
                <CardTitle>会社概要</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{company.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* People List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                所属人材 ({people.length}人)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {people.length > 0 ? (
                <div className="space-y-3">
                  {people.map((person) => (
                    <div 
                      key={person.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                      onClick={() => router.push(`/people/${person.id}`)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{person.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {person.nationality} • {person.visaStatus || 'ビザ情報なし'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  所属人材がいません
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
