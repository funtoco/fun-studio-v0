"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDebouncedCallback } from 'use-debounce'

interface ConnectorSearchProps {
  initialQuery?: string
}

export function ConnectorSearch({ initialQuery }: ConnectorSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery || '')

  // Debounced search to avoid too many requests
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim())
    } else {
      params.delete('q')
    }
    
    router.push(`/admin/connectors?${params.toString()}`)
  }, 200)

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="コネクター名、プロバイダー、サブドメインで検索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-10"
      />
      {query && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={clearSearch}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
