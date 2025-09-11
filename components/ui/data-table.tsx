"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, FilterIcon, Download, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  filters?: Filter[]
  searchKeys?: (keyof T)[]
  onRowClick?: (row: T) => void
  className?: string
}

interface Filter {
  key: string
  label: string
  options: { value: string; label: string }[]
  multiple?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  filters = [],
  searchKeys = [],
  onRowClick,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  // Filter data based on search and filters
  const filteredData = data.filter((row) => {
    // Search filter
    if (searchTerm) {
      const searchMatch = searchKeys.some((key) => {
        const value = row[key]
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
      if (!searchMatch) return false
    }

    // Column filters
    for (const [filterKey, filterValues] of Object.entries(activeFilters)) {
      if (filterValues.length > 0) {
        const rowValue = row[filterKey]?.toString()
        if (!filterValues.includes(rowValue)) return false
      }
    }

    return true
  })

  // Sort data
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    : filteredData

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((current) => {
      const currentValues = current[filterKey] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]

      return { ...current, [filterKey]: newValues }
    })
  }

  const exportToCsv = () => {
    const headers = columns.map((col) => col.label).join(",")
    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const value = typeof col.key === "string" ? row[col.key] : ""
          return `"${value?.toString().replace(/"/g, '""') || ""}"`
        })
        .join(","),
    )

    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          {searchKeys.length > 0 && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Filters */}
          {filters.map((filter) => (
            <Select key={filter.key} onValueChange={(value) => handleFilterChange(filter.key, value)}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <SelectValue placeholder={filter.label} />
                </div>
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {/* Export */}
        <Button variant="outline" onClick={exportToCsv} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          CSV出力
        </Button>
      </div>

      {/* Active Filters */}
      {Object.entries(activeFilters).some(([_, values]) => values.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">フィルタ:</span>
          {Object.entries(activeFilters).map(([key, values]) =>
            values.map((value) => (
              <Badge
                key={`${key}-${value}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleFilterChange(key, value)}
              >
                {value} ×
              </Badge>
            )),
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key.toString()}
                  className={cn(column.sortable && "cursor-pointer select-none hover:bg-muted/50")}
                  onClick={() => column.sortable && handleSort(column.key.toString())}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={cn(
                            "h-3 w-3",
                            sortConfig?.key === column.key && sortConfig.direction === "asc"
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 -mt-1",
                            sortConfig?.key === column.key && sortConfig.direction === "desc"
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  データがありません
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row, index) => (
                <TableRow
                  key={index}
                  className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key.toString()}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]?.toString() || ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {sortedData.length} 件中 {sortedData.length} 件を表示
        {data.length !== sortedData.length && ` (全 ${data.length} 件)`}
      </div>
    </div>
  )
}
