"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getCompanies } from "@/lib/supabase/companies"
import { useAuth } from "@/contexts/auth-context"
import type { Company } from "@/lib/models"

export default function CompaniesPage() {
  const router = useRouter()
  const { user, role, loading: authLoading } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true)
        const companiesData = await getCompanies()
        setCompanies(companiesData)
      } catch (err) {
        console.error('Error fetching companies:', err)
        setError('データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user) {
      fetchCompanies()
    }
  }, [user, authLoading])

  const columns: Column<Company>[] = [
    {
      key: "name",
      label: "会社名",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{row.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            {row.nameKana && (
              <div className="text-sm text-muted-foreground">{row.nameKana}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "industry",
      label: "業界",
      sortable: true,
      filterable: true,
      render: (value) => value ? <Badge variant="outline">{value}</Badge> : <span className="text-muted-foreground">-</span>,
    },
    {
      key: "representative",
      label: "代表者",
      sortable: true,
      render: (value) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "employeeCount",
      label: "従業員数",
      sortable: true,
      render: (value) => value ? `${value}人` : <span className="text-muted-foreground">-</span>,
    },
    {
      key: "phone",
      label: "電話番号",
      render: (value) => value || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "email",
      label: "メールアドレス",
      render: (value) => value || <span className="text-muted-foreground">-</span>,
    },
  ]

  const filters = [
    {
      key: "industry",
      label: "業界",
      options: Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))).map((industry) => ({
        value: industry!,
        label: industry!,
      })),
      multiple: true,
    },
  ]

  const handleRowClick = (company: Company) => {
    router.push(`/companies/${company.id}`)
  }

  if (authLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
          <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">認証中...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
          <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">ログインが必要です</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
          <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
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
          <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
          <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
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
        <h1 className="text-3xl font-bold text-foreground">法人一覧</h1>
        <p className="text-muted-foreground mt-2">法人の一覧と基本情報</p>
        {role && (
          <div className="mt-2">
            <Badge variant="secondary">ロール: {role}</Badge>
          </div>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        data={companies}
        columns={columns}
        filters={filters}
        searchKeys={["name", "nameKana", "industry", "representative"]}
        onRowClick={handleRowClick}
      />
    </div>
  )
}