"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, FileText, User, Clock, X, ChevronDown, ChevronUp } from "lucide-react"
import { getPeople } from "@/lib/supabase/people"
import { getVisas } from "@/lib/supabase/visas"
import { isExpiringSoon } from "@/lib/utils"
import type { VisaStatus, Person, Visa } from "@/lib/models"

const visaStatuses: VisaStatus[] = [
  "書類準備中",
  "書類作成中",
  "書類確認中",
  "申請準備中",
  "ビザ申請準備中",
  "申請中",
  "ビザ取得済み",
]

interface ExtendedKanbanColumn {
  id: string
  title: string
  items: any[]
  totalCount: number
  displayedCount: number
  isExpanded: boolean
}

export default function VisasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [managerFilter, setManagerFilter] = useState<string>("all")
  const [expiryFilter, setExpiryFilter] = useState<string>("all")
  const [people, setPeople] = useState<Person[]>([])
  const [visas, setVisas] = useState<Visa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [peopleData, visaData] = await Promise.all([
          getPeople(),
          getVisas()
        ])
        setPeople(peopleData)
        setVisas(visaData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter visas based on search and filters
  const filteredVisas = visas.filter((visa) => {
    const person = people.find((p) => p.id === visa.personId)
    if (!person) return false

    // Search filter
    if (searchTerm) {
      const searchMatch = person.name.toLowerCase().includes(searchTerm.toLowerCase())
      if (!searchMatch) return false
    }

    // Type filter
    if (typeFilter !== "all" && visa.type !== typeFilter) return false

    // Manager filter
    if (managerFilter !== "all" && visa.manager !== managerFilter) return false

    // Expiry filter
    if (expiryFilter !== "all" && visa.expiryDate) {
      const days = Number.parseInt(expiryFilter)
      if (!isExpiringSoon(visa.expiryDate, days)) return false
    }

    return true
  })

  // Group visas by status for kanban columns with priority-based display
  const kanbanColumns: ExtendedKanbanColumn[] = visaStatuses.map((status) => {
    const statusVisas = filteredVisas.filter((visa) => visa.status === status)

    // Sort by priority: urgent first, then by date
    const sortedVisas = statusVisas
      .map((visa) => {
        const person = people.find((p) => p.id === visa.personId)
        if (!person) return null

        const isUrgent = visa.expiryDate && isExpiringSoon(visa.expiryDate, 7)
        const isWarning = visa.expiryDate && isExpiringSoon(visa.expiryDate, 30)

        return {
          id: visa.id,
          title: person.name,
          subtitle: `${visa.type} | 担当: ${visa.manager || "未設定"}`,
          badge: isWarning ? "期限注意" : undefined,
          badgeVariant: isUrgent ? ("destructive" as const) : ("secondary" as const),
          metadata: {
            personId: person.id,
            expiryDate: visa.expiryDate,
            type: visa.type,
            manager: visa.manager,
            isUrgent,
            isWarning,
          },
          visa,
        }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => {
        // Priority: urgent > warning > normal
        if (a.metadata.isUrgent && !b.metadata.isUrgent) return -1
        if (!a.metadata.isUrgent && b.metadata.isUrgent) return 1
        if (a.metadata.isWarning && !b.metadata.isWarning) return -1
        if (!a.metadata.isWarning && b.metadata.isWarning) return 1
        
        // Secondary sort by expiry date
        if (a.visa.expiryDate && b.visa.expiryDate) {
          return new Date(a.visa.expiryDate).getTime() - new Date(b.visa.expiryDate).getTime()
        }
        return 0
      })

    // Limit display to 5 items unless expanded
    const isExpanded = expandedColumns.has(status)
    const displayItems = isExpanded ? sortedVisas : sortedVisas.slice(0, 5)

    return {
      id: status,
      title: status,
      items: displayItems,
      totalCount: sortedVisas.length,
      displayedCount: displayItems.length,
      isExpanded,
    }
  })

  const toggleColumnExpansion = (columnId: string) => {
    setExpandedColumns(prev => {
      const newSet = new Set(prev)
      if (newSet.has(columnId)) {
        newSet.delete(columnId)
      } else {
        newSet.add(columnId)
      }
      return newSet
    })
  }

  const handleItemClick = (item: any) => {
    window.location.href = `/people/${item.metadata.personId}`
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setManagerFilter("all")
    setExpiryFilter("all")
  }

  // Get unique values for filters
  const visaTypes = Array.from(new Set(visas.map((v) => v.type)))
  const managers = Array.from(new Set(visas.map((v) => v.manager).filter(Boolean)))

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ビザ進捗管理</h1>
          <p className="text-muted-foreground mt-2">ビザ申請の進捗状況をKanban形式で確認</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">読み込み中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ビザ進捗管理</h1>
          <p className="text-muted-foreground mt-2">ビザ申請の進捗状況をKanban形式で確認</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ビザ進捗管理</h1>
        <p className="text-muted-foreground mt-2">ビザ申請の進捗状況をKanban形式で確認</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="人材名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Active filters count */}
          {(searchTerm || typeFilter !== "all" || managerFilter !== "all" || expiryFilter !== "all") && (
            <Badge variant="secondary" className="ml-auto">
              {filteredVisas.length} / {visas.length} 件を表示
            </Badge>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {visaTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">ビザ種別</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Select value={managerFilter} onValueChange={setManagerFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="担当者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager} value={manager!}>
                    {manager}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">担当者</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select value={expiryFilter} onValueChange={setExpiryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="期限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="7">7日以内</SelectItem>
                <SelectItem value="30">30日以内</SelectItem>
                <SelectItem value="60">60日以内</SelectItem>
                <SelectItem value="90">90日以内</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">期限切れ</span>
          </div>

          {/* Clear filters button */}
          {(typeFilter !== "all" || managerFilter !== "all" || expiryFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground ml-auto"
            >
              <X className="h-3 w-3 mr-1" />
              フィルタークリア
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Kanban Board with Priority Display */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <Badge variant="secondary" className="ml-2">
                {column.totalCount}
              </Badge>
            </div>

            {/* Column Items */}
            <div className="space-y-3">
              {column.items.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">項目がありません</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {column.items.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleItemClick(item)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.title}</h4>
                            {item.subtitle && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          {item.badge && (
                            <Badge variant={item.badgeVariant} className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Expand/Collapse Button */}
                  {column.totalCount > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleColumnExpansion(column.id)}
                      className="w-full justify-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {column.isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          折りたたむ
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          +{column.totalCount - 5}件を表示
                        </>
                      )}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
