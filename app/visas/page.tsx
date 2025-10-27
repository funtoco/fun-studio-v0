"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, FileText, Clock, X, ChevronDown, ChevronUp, Building2 } from "lucide-react"
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [expiryFilter, setExpiryFilter] = useState<string>("all")
  const [companyFilter, setCompanyFilter] = useState<string>("all")
  const [affiliationFilter, setAffiliationFilter] = useState<string>("all")
  const [people, setPeople] = useState<Person[]>([])
  const [visas, setVisas] = useState<Visa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(new Set())

  // URLパラメータから初期値を設定
  useEffect(() => {
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const expiry = searchParams.get('expiry')
    const company = searchParams.get('company')
    const affiliation = searchParams.get('affiliation')

    if (search !== null) setSearchTerm(search)
    if (type) setTypeFilter(type)
    if (expiry) setExpiryFilter(expiry)
    if (company) setCompanyFilter(company)
    if (affiliation) setAffiliationFilter(affiliation)
  }, [searchParams])

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

  // フィルター変更時のハンドラ
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const newParams = new URLSearchParams()
    if (value) newParams.set('search', value)
    if (typeFilter !== 'all') newParams.set('type', typeFilter)
    if (expiryFilter !== 'all') newParams.set('expiry', expiryFilter)
    if (companyFilter !== 'all') newParams.set('company', companyFilter)
    if (affiliationFilter !== 'all') newParams.set('affiliation', affiliationFilter)
    router.replace(`/visas?${newParams.toString()}`, { scroll: false })
  }

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    const newParams = new URLSearchParams()
    if (searchTerm) newParams.set('search', searchTerm)
    if (value !== 'all') newParams.set('type', value)
    if (expiryFilter !== 'all') newParams.set('expiry', expiryFilter)
    if (companyFilter !== 'all') newParams.set('company', companyFilter)
    if (affiliationFilter !== 'all') newParams.set('affiliation', affiliationFilter)
    router.replace(`/visas?${newParams.toString()}`, { scroll: false })
  }

  const handleExpiryFilterChange = (value: string) => {
    setExpiryFilter(value)
    const newParams = new URLSearchParams()
    if (searchTerm) newParams.set('search', searchTerm)
    if (typeFilter !== 'all') newParams.set('type', typeFilter)
    if (value !== 'all') newParams.set('expiry', value)
    if (companyFilter !== 'all') newParams.set('company', companyFilter)
    if (affiliationFilter !== 'all') newParams.set('affiliation', affiliationFilter)
    router.replace(`/visas?${newParams.toString()}`, { scroll: false })
  }

  const handleCompanyFilterChange = (value: string) => {
    setCompanyFilter(value)
    const newParams = new URLSearchParams()
    if (searchTerm) newParams.set('search', searchTerm)
    if (typeFilter !== 'all') newParams.set('type', typeFilter)
    if (expiryFilter !== 'all') newParams.set('expiry', expiryFilter)
    if (value !== 'all') newParams.set('company', value)
    if (affiliationFilter !== 'all') newParams.set('affiliation', affiliationFilter)
    router.replace(`/visas?${newParams.toString()}`, { scroll: false })
  }

  const handleAffiliationFilterChange = (value: string) => {
    setAffiliationFilter(value)
    const newParams = new URLSearchParams()
    if (searchTerm) newParams.set('search', searchTerm)
    if (typeFilter !== 'all') newParams.set('type', typeFilter)
    if (expiryFilter !== 'all') newParams.set('expiry', expiryFilter)
    if (companyFilter !== 'all') newParams.set('company', companyFilter)
    if (value !== 'all') newParams.set('affiliation', value)
    router.replace(`/visas?${newParams.toString()}`, { scroll: false })
  }

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

    // Expiry filter
    if (expiryFilter !== "all" && visa.expiryDate) {
      const days = Number.parseInt(expiryFilter)
      if (!isExpiringSoon(visa.expiryDate, days)) return false
    }

    // Company filter
    if (companyFilter !== "all" && person.tenantName !== companyFilter) return false

    // Affiliation filter
    if (affiliationFilter !== "all" && person.company !== affiliationFilter) return false

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
          subtitle: visa.type,
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

  // フィルター適用前の処理：他のフィルターでフィルタリングして選択肢を生成
  const getFilteredDataForOptions = () => {
    return visas.filter((visa) => {
      const person = people.find((p) => p.id === visa.personId)
      if (!person) return false

      // Search filter
      if (searchTerm) {
        const searchMatch = person.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (!searchMatch) return false
      }

      // Type filter
      if (typeFilter !== "all" && visa.type !== typeFilter) return false

      // Expiry filter
      if (expiryFilter !== "all" && visa.expiryDate) {
        const days = Number.parseInt(expiryFilter)
        if (!isExpiringSoon(visa.expiryDate, days)) return false
      }

      // 会社と所属先のフィルターは除外（選択肢生成のため）
      return true
    }).map((visa) => {
      const person = people.find((p) => p.id === visa.personId)
      return person
    }).filter(Boolean)
  }

  const handleItemClick = (item: any) => {
    window.location.href = `/people/${item.metadata.personId}`
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setExpiryFilter("all")
    setCompanyFilter("all")
    setAffiliationFilter("all")
    router.replace('/visas', { scroll: false })
  }

  // 個別のフィルターを削除
  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'type':
        handleTypeFilterChange('all')
        break
      case 'expiry':
        handleExpiryFilterChange('all')
        break
      case 'company':
        handleCompanyFilterChange('all')
        break
      case 'affiliation':
        handleAffiliationFilterChange('all')
        break
      case 'search':
        handleSearchChange('')
        break
    }
  }

  // アクティブなフィルターを取得
  const activeFilters = []
  if (typeFilter !== "all") activeFilters.push({ key: 'type', label: `ビザ種別: ${typeFilter}`, value: typeFilter })
  if (expiryFilter !== "all") activeFilters.push({ key: 'expiry', label: `期限: ${expiryFilter}日以内`, value: expiryFilter })
  if (companyFilter !== "all") activeFilters.push({ key: 'company', label: `会社: ${companyFilter}`, value: companyFilter })
  if (affiliationFilter !== "all") activeFilters.push({ key: 'affiliation', label: `所属先: ${affiliationFilter}`, value: affiliationFilter })
  if (searchTerm) activeFilters.push({ key: 'search', label: `検索: ${searchTerm}`, value: searchTerm })

  // Get unique values for filters
  const visaTypes = Array.from(new Set(visas.map((v) => v.type)))
  
  // 会社の選択肢（会社フィルターを除いた他のフィルターに基づいて動的に生成）
  const companies = Array.from(new Set(
    getFilteredDataForOptions()
      .map((person) => person?.tenantName)
      .filter(Boolean)
  ))
  
  // 所属先の選択肢（会社フィルターと所属先フィルターを除いた他のフィルターに基づいて動的に生成）
  const affiliations = Array.from(new Set(
    getFilteredDataForOptions()
      .filter((person) => {
        // 会社フィルターが設定されている場合は、その会社の所属先のみを表示
        if (companyFilter !== "all") {
          return person?.tenantName === companyFilter
        }
        return true
      })
      .map((person) => person?.company)
      .filter(Boolean)
  ))

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
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Active filters count */}
          {(searchTerm || typeFilter !== "all" || expiryFilter !== "all" || companyFilter !== "all" || affiliationFilter !== "all") && (
            <Badge variant="secondary" className="ml-auto">
              {filteredVisas.length} / {visas.length} 件を表示
            </Badge>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
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
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Select value={expiryFilter} onValueChange={handleExpiryFilterChange}>
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

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select value={companyFilter} onValueChange={handleCompanyFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="会社" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company!}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">会社</span>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <Select value={affiliationFilter} onValueChange={handleAffiliationFilterChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="所属先" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {affiliations.map((affiliation) => (
                  <SelectItem key={affiliation} value={affiliation!}>
                    {affiliation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">所属先</span>
          </div>

          {/* Clear filters button */}
          {(typeFilter !== "all" || expiryFilter !== "all" || companyFilter !== "all" || affiliationFilter !== "all") && (
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

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">フィルタ:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => removeFilter(filter.key)}
              >
                {filter.label} ×
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              全てクリア
            </Button>
          </div>
        )}
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
