"use client"

import { useState } from "react"
import { ReadonlyKanban, type KanbanColumn } from "@/components/ui/readonly-kanban"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { people } from "@/data/people"
import { visas } from "@/data/visas"
import { isExpiringSoon } from "@/lib/utils"
import type { VisaStatus } from "@/lib/models"

const visaStatuses: VisaStatus[] = [
  "書類準備中",
  "書類作成中",
  "書類確認中",
  "申請準備中",
  "ビザ申請準備中",
  "申請中",
  "ビザ取得済み",
]

export default function VisasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [managerFilter, setManagerFilter] = useState<string>("all")
  const [expiryFilter, setExpiryFilter] = useState<string>("all")

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

  // Group visas by status for kanban columns
  const kanbanColumns: KanbanColumn[] = visaStatuses.map((status) => {
    const statusVisas = filteredVisas.filter((visa) => visa.status === status)

    return {
      id: status,
      title: status,
      items: statusVisas
        .map((visa) => {
          const person = people.find((p) => p.id === visa.personId)
          if (!person) return null

          const isUrgent = visa.expiryDate && isExpiringSoon(visa.expiryDate, 7)

          return {
            id: visa.id,
            title: person.name,
            subtitle: `${visa.type} | 担当: ${visa.manager || "未設定"}`,
            badge: visa.expiryDate && isExpiringSoon(visa.expiryDate, 30) ? "期限注意" : undefined,
            badgeVariant: isUrgent ? ("destructive" as const) : ("secondary" as const),
            metadata: {
              personId: person.id,
              expiryDate: visa.expiryDate,
              type: visa.type,
              manager: visa.manager,
            },
          }
        })
        .filter(Boolean) as any[],
    }
  })

  const handleItemClick = (item: any) => {
    // Navigate to person detail page
    window.location.href = `/people/${item.metadata.personId}`
  }

  // Get unique values for filters
  const visaTypes = Array.from(new Set(visas.map((v) => v.type)))
  const managers = Array.from(new Set(visas.map((v) => v.manager).filter(Boolean)))

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ビザ進捗管理</h1>
        <p className="text-muted-foreground mt-2">ビザ申請の進捗状況をKanban形式で確認</p>
      </div>

      {/* Filters */}
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

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="ビザ種別" />
            </div>
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

        <Select value={managerFilter} onValueChange={setManagerFilter}>
          <SelectTrigger className="w-40">
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

        <Select value={expiryFilter} onValueChange={setExpiryFilter}>
          <SelectTrigger className="w-40">
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

        {/* Active filters count */}
        {(searchTerm || typeFilter !== "all" || managerFilter !== "all" || expiryFilter !== "all") && (
          <Badge variant="secondary">
            {filteredVisas.length} / {visas.length} 件
          </Badge>
        )}
      </div>

      {/* Kanban Board */}
      <ReadonlyKanban columns={kanbanColumns} onItemClick={handleItemClick} />

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {visaStatuses.map((status) => {
          const count = filteredVisas.filter((visa) => visa.status === status).length
          return (
            <div key={status} className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-muted-foreground">{status}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
