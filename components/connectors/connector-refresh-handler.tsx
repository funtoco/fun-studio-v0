/**
 * Component to handle auto-refresh after OAuth reconnect
 */

"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

interface ConnectorRefreshHandlerProps {
  connectorId: string
  tenantId: string
}

export function ConnectorRefreshHandler({ connectorId, tenantId }: ConnectorRefreshHandlerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if we just came back from OAuth callback
    const connected = searchParams.get('connected')
    const error = searchParams.get('error')

    if (connected === 'true') {
      toast.success('コネクターが正常に接続されました！')
      
      // Clean up URL parameters and refresh
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('connected')
      newUrl.searchParams.delete('error')
      
      // Use replace to avoid back button issues
      router.replace(newUrl.pathname + newUrl.search)
      
      // Force refresh the page to get updated connector data
      setTimeout(() => {
        router.refresh()
      }, 1000)
    }

    if (error) {
      toast.error(`接続エラー: ${decodeURIComponent(error)}`)
      
      // Clean up error parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('connected')
      
      router.replace(newUrl.pathname + newUrl.search)
    }
  }, [searchParams, router])

  // This component doesn't render anything
  return null
}
