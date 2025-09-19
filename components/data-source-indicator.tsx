"use client"

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, RefreshCw, ExternalLink, Info } from "lucide-react"
import Link from "next/link"
import { getDataSourceInfo, type DataSourceInfo } from "@/lib/data-source/manager"

export function DataSourceIndicator() {
  const [dataSource, setDataSource] = useState<DataSourceInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDataSource() {
      try {
        const info = await getDataSourceInfo()
        setDataSource(info)
      } catch (err) {
        console.error('Failed to load data source info:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadDataSource()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>データソース確認中...</span>
      </div>
    )
  }

  if (!dataSource) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">データソース:</span>
        
        {dataSource.source === 'kintone' ? (
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="bg-blue-100 text-blue-800">
              Kintone 連携
            </Badge>
            {dataSource.connectorName && (
              <span className="text-sm text-muted-foreground">
                ({dataSource.connectorName})
              </span>
            )}
          </div>
        ) : (
          <Badge variant="secondary">
            サンプルデータ
          </Badge>
        )}
      </div>

      {dataSource.source === 'kintone' && (
        <div className="text-xs text-muted-foreground space-y-1">
          {dataSource.recordCount && (
            <div>
              人材: {dataSource.recordCount.people} 件, 
              ビザ: {dataSource.recordCount.visas} 件
            </div>
          )}
          {dataSource.lastSync && (
            <div>
              最終同期: {new Date(dataSource.lastSync).toLocaleString('ja-JP')}
            </div>
          )}
          {dataSource.connectorId && (
            <Link 
              href={`/admin/connectors/${dataSource.connectorId}`}
              className="inline-flex items-center space-x-1 text-blue-600 hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span>コネクター設定</span>
            </Link>
          )}
        </div>
      )}

      {dataSource.source === 'sample' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-1">
              <div className="text-sm font-medium">サンプルデータを使用中</div>
              <div className="text-xs">
                Kintone との連携を設定すると、リアルタイムデータを使用できます
              </div>
              <Link href="/admin/connectors" className="inline-flex items-center space-x-1 text-yellow-700 hover:underline text-xs">
                <ExternalLink className="h-3 w-3" />
                <span>コネクター設定</span>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
