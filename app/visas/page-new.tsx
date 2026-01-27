"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { getVisaStatusCounts, getVisasPaginated, type VisaListResponse, type VisaStatusCounts } from "@/lib/supabase/visas"
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
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL state
  const currentStatus = searchParams.get('status') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')
  
  // Component state
  const [searchTerm, setSearchTerm] = useState("")
  const [statusCounts, setStatusCounts] = useState<VisaStatusCounts>({})
  const [visaData, setVisaData] = useState<VisaListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Update URL with new params
  const updateUrl = useCallback((status: string, page: number) => {
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (page !== 1) params.set('page', page.toString())
    
    const url = params.toString() ? `/visas?${params.toString()}` : '/visas'
    router.push(url)
  }, [router])

  // Fetch status counts
  const fetchStatusCounts = useCallback(async () => {
    try {
      const counts = await getVisaStatusCounts()
      setStatusCounts(counts)
    } catch (err) {
      console.error('Error fetching status counts:', err)
    }
  }, [])

  // Fetch visa list data
  const fetchVisaData = useCallback(async (status: string, page: number) => {
    try {
      setLoading(true)
      const data = await getVisasPaginated(status, page, 20)
      setVisaData(data)
    } catch (err) {
      console.error('Error fetching visa data:', err)
      setError('データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle status card click
  const handleStatusClick = (status: string) => {
    updateUrl(status, 1) // Reset to page 1 when changing status
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    updateUrl(currentStatus, page)
    // Scroll to top of list
    document.getElementById('visa-list')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle item click
  const handleItemClick = (personId: string) => {
    router.push(`/people/${personId}`)
  }

  // Load data when URL params change
  useEffect(() => {
    fetchStatusCounts()
    fetchVisaData(currentStatus, currentPage)
  }, [currentStatus, currentPage, fetchStatusCounts, fetchVisaData])

  // Debounced search (if needed in future)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search functionality can be added here
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">ビザ進捗管理</h1>
          <p className="text-muted-foreground mt-2">ビザ申請の進捗状況を管理</p>
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
        <p className="text-muted-foreground mt-2">ビザ申請の進捗状況を管理</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* All Status Card */}
        <Card 
          className={`cursor-pointer transition-colors ${currentStatus === 'all' ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
          onClick={() => handleStatusClick('all')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {Object.values(statusCounts).reduce((sum, count) => sum + count, 0)}
            </div>
            <div className="text-sm text-muted-foreground">すべて</div>
          </CardContent>
        </Card>

        {/* Individual Status Cards */}
        {visaStatuses.map((status) => (
          <Card 
            key={status}
            className={`cursor-pointer transition-colors ${currentStatus === status ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
            onClick={() => handleStatusClick(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{statusCounts[status] || 0}</div>
              <div className="text-sm text-muted-foreground">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Filter & Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {currentStatus !== 'all' && (
            <Badge variant="outline" className="px-3 py-1">
              {currentStatus}
            </Badge>
          )}
          <div className="text-sm text-muted-foreground">
            {loading ? '読み込み中...' : `${visaData?.totalCount || 0} 件`}
          </div>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="人材名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Visa List */}
      <div id="visa-list" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">読み込み中...</div>
          </div>
        ) : !visaData?.visas.length ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">該当データがありません</p>
            </CardContent>
          </Card>
        ) : (
          visaData.visas.map((visa: any) => {
            const isUrgent = visa.expiryDate && isExpiringSoon(visa.expiryDate, 7)
            const isWarning = visa.expiryDate && isExpiringSoon(visa.expiryDate, 30)
            
            return (
              <Card 
                key={visa.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleItemClick(visa.personId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{visa.person.name}</h4>
                        <StatusBadge status={visa.status} type="visa" />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{visa.type}</span>
                        <span>担当: {visa.manager || "未設定"}</span>
                        {visa.person.tenantId && <span>テナントID: {visa.person.tenantId}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {visa.expiryDate && (
                        <DeadlineChip 
                          date={visa.expiryDate} 
                          label="期限"
                        />
                      )}
                      {(isWarning || isUrgent) && (
                        <Badge variant={isUrgent ? "destructive" : "secondary"} className="text-xs">
                          期限間近
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {visaData && visaData.totalCount > 20 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={!visaData.hasPrevPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!visaData.hasPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, Math.ceil(visaData.totalCount / 20)) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!visaData.hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.ceil(visaData.totalCount / 20))}
            disabled={!visaData.hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
