"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DataTable, type Column } from "@/components/ui/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { DeadlineChip } from "@/components/ui/deadline-chip"
import { PersonAvatar } from "@/components/ui/person-avatar"
import { getPeople } from "@/lib/supabase/people"
import { getVisas } from "@/lib/supabase/visas"
import type { Person } from "@/lib/models"

interface PersonWithVisa extends Person {
  visaStatus?: string
  visaType?: string
  expiryDate?: string
}

export default function PeoplePage() {
  const router = useRouter()
  const [people, setPeople] = useState<Person[]>([])
  const [visas, setVisas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'sample' | 'kintone'>('sample')

  console.log('PeoplePage: Component initialized', { people: people.length, loading, error, dataSource })

  // Load people data
  useEffect(() => {
    async function fetchPeopleData() {
      try {
        setLoading(true)
        setError(null)
        const peopleData = await getPeople()
        setPeople(peopleData)
        setDataSource('sample')
        console.log('PeoplePage: People data loaded', { count: peopleData.length })
      } catch (err) {
        console.error('Error fetching people data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load people data')
      } finally {
        setLoading(false)
      }
    }
    fetchPeopleData()
  }, [])

  // Load visa data (always from sample for now)
  useEffect(() => {
    async function fetchVisaData() {
      try {
        const visaData = await getVisas()
        setVisas(visaData)
      } catch (err) {
        console.error('Error fetching visa data:', err)
      }
    }
    fetchVisaData()
  }, [])

  // Combine people with their visa information
  const peopleWithVisas: PersonWithVisa[] = people.map((person) => {
    const visa = visas.find((v) => v.personId === person.id)
    return {
      ...person,
      visaStatus: visa?.status,
      visaType: visa?.type,
      expiryDate: visa?.expiryDate,
    }
  })

  const columns: Column<PersonWithVisa>[] = [
    {
      key: "name",
      label: "名前",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <PersonAvatar 
            name={value || ""} 
            imagePath={row.imagePath}
            size="md"
          />
          <div>
            <div className="font-medium">{value}</div>
            {row.kana && <div className="text-xs text-muted-foreground">{row.kana}</div>}
          </div>
        </div>
      ),
    },
    {
      key: "nationality",
      label: "国籍",
      sortable: true,
      filterable: true,
    },
    {
      key: "tenantName",
      label: "会社",
      sortable: true,
      filterable: true,
    },
    {
      key: "employeeNumber",
      label: "従業員番号",
      sortable: true,
      render: (value) =>
        value ? <span className="text-sm font-mono">{value}</span> : <span className="text-muted-foreground">-</span>,
    },
    {
      key: "workingStatus",
      label: "就労ステータス",
      sortable: true,
      filterable: true,
      render: (value) =>
        value ? <StatusBadge status={value} type="working" /> : <span className="text-muted-foreground">-</span>,
    },
  ]

  const filters = [
    {
      key: "nationality",
      label: "国籍",
      options: Array.from(new Set(people.map((p) => p.nationality).filter(Boolean))).map((nationality) => ({
        value: nationality!,
        label: nationality!,
      })),
      multiple: true,
    },
    {
      key: "tenantName",
      label: "会社",
      options: Array.from(new Set(people.map((p) => p.tenantName).filter(Boolean))).map((tenantName) => ({
        value: tenantName!,
        label: tenantName!,
      })),
      multiple: true,
    },
    {
      key: "workingStatus",
      label: "就労ステータス",
      options: ["入社待ち", "在籍中", "退職", "内定取消", "内定辞退", "支援終了"].map(
        (status) => ({
          value: status,
          label: status,
        }),
      ),
      multiple: true,
    },
  ]

  const handleRowClick = (person: PersonWithVisa) => {
    router.push(`/people/${person.id}`)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">人材一覧</h1>
          <p className="text-muted-foreground mt-2">外国人人材の一覧と基本情報</p>
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
          <h1 className="text-3xl font-bold text-foreground">人材一覧</h1>
          <p className="text-muted-foreground mt-2">外国人人材の一覧と基本情報</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">人材一覧</h1>
          <p className="text-muted-foreground mt-2">外国人人材の一覧と基本情報</p>
        </div>
      </div>


      {/* Data Table */}
      <DataTable
        data={peopleWithVisas}
        columns={columns}
        filters={filters}
        searchKeys={["name", "tenantName", "nationality"]}
        onRowClick={handleRowClick}
      />
    </div>
  )
}
