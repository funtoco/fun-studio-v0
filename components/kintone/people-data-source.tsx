/**
 * Data source component for People page that can switch between sample data and Kintone data
 */

"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { getPeople } from "@/lib/supabase/people"
import { getVisas } from "@/lib/supabase/visas"
import type { Person } from "@/lib/models"

interface KintoneRecord {
  id: string
  revision: string
  [key: string]: any
}

interface KintoneApp {
  id: string
  app_id: string
  name: string
  code: string
}

interface PeopleDataSourceProps {
  onDataChange: (people: Person[], source: 'sample' | 'kintone') => void
  onLoadingChange: (loading: boolean) => void
  onErrorChange: (error: string | null) => void
}

export function PeopleDataSource({ onDataChange, onLoadingChange, onErrorChange }: PeopleDataSourceProps) {
  const [useKintone, setUseKintone] = useState(false)
  const [kintoneApps, setKintoneApps] = useState<KintoneApp[]>([])
  const [selectedApp, setSelectedApp] = useState<string>('')
  const [kintoneRecords, setKintoneRecords] = useState<KintoneRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectorId, setConnectorId] = useState<string>('')

  console.log('PeopleDataSource: Component initialized', { useKintone, loading, error })

  // Load Kintone apps when switching to Kintone mode
  useEffect(() => {
    if (useKintone && !connectorId) {
      loadConnector()
    }
  }, [useKintone])

  // Load apps when connector is available
  useEffect(() => {
    if (useKintone && connectorId) {
      loadKintoneApps()
    }
  }, [useKintone, connectorId])

  // Load data when app is selected
  useEffect(() => {
    if (useKintone && selectedApp && connectorId) {
      loadKintoneRecords()
    }
  }, [useKintone, selectedApp, connectorId])

  const loadSampleData = useCallback(async () => {
    try {
      console.log('PeopleDataSource: loadSampleData started')
      setLoading(true)
      onLoadingChange(true)
      setError(null)
      onErrorChange(null)
      
      console.log('PeopleDataSource: Calling getPeople()...')
      const [peopleData] = await Promise.all([
        getPeople()
      ])
      
      console.log('PeopleDataSource: getPeople() result:', { count: peopleData.length, data: peopleData })
      onDataChange(peopleData, 'sample')
      console.log('PeopleDataSource: onDataChange called with sample data')
    } catch (err) {
      console.error('PeopleDataSource: Error in loadSampleData:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sample data'
      setError(errorMessage)
      onErrorChange(errorMessage)
    } finally {
      console.log('PeopleDataSource: loadSampleData finished')
      setLoading(false)
      onLoadingChange(false)
    }
  }, [onDataChange, onLoadingChange, onErrorChange])

  // Load sample data when not using Kintone
  useEffect(() => {
    console.log('PeopleDataSource: useEffect for sample data', { useKintone })
    if (!useKintone) {
      console.log('PeopleDataSource: Loading sample data...')
      loadSampleData()
    }
  }, [useKintone, loadSampleData])

  const loadConnector = async () => {
    try {
      const response = await fetch('/api/admin/connectors?tenantId=550e8400-e29b-41d4-a716-446655440001')
      if (!response.ok) throw new Error('Failed to fetch connectors')
      const data = await response.json()
      const connectedConnector = data.connectors.find((c: any) => c.status === 'connected' && c.provider === 'kintone')
      if (connectedConnector) {
        setConnectorId(connectedConnector.id)
      } else {
        // Show all connectors, not just connected ones
        const kintoneConnectors = data.connectors.filter((c: any) => c.provider === 'kintone')
        if (kintoneConnectors.length > 0) {
          setError('Kintoneコネクターが見つかりましたが、接続されていません。まずコネクターを接続してください。')
        } else {
          setError('Kintoneコネクターが見つかりません。まずコネクターを作成してください。')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connector')
    }
  }

  const loadKintoneApps = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps`)
      if (!response.ok) throw new Error('Failed to fetch apps')
      const data = await response.json()
      setKintoneApps(data.apps || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load apps')
    } finally {
      setLoading(false)
    }
  }

  const loadKintoneRecords = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps/${selectedApp}/records?limit=100`)
      if (!response.ok) throw new Error('Failed to fetch records')
      const data = await response.json()
      setKintoneRecords(data.records || [])
      
      // Transform Kintone records to Person format
      const transformedPeople = transformKintoneRecordsToPeople(data.records)
      onDataChange(transformedPeople, 'kintone')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  const transformKintoneRecordsToPeople = (records: KintoneRecord[]): Person[] => {
    return records.map(record => ({
      id: record.id,
      name: record.name || record.名前 || record.氏名 || 'Unknown',
      kana: record.kana || record.カナ || record.フリガナ || '',
      nationality: record.nationality || record.国籍 || '',
      company: record.company || record.会社 || record.所属会社 || '',
      email: record.email || record.メール || record.メールアドレス || '',
      phone: record.phone || record.電話 || record.電話番号 || '',
      employeeNumber: record.employeeNumber || record.従業員番号 || record.社員番号 || '',
      workingStatus: record.workingStatus || record.就労ステータス || record.ステータス || '',
      createdAt: record.createdAt || record.作成日時 || new Date().toISOString(),
      updatedAt: record.updatedAt || record.更新日時 || new Date().toISOString()
    }))
  }

  const handleSourceToggle = (checked: boolean) => {
    setUseKintone(checked)
    setSelectedApp('')
    setKintoneRecords([])
    setError(null)
  }

  const handleAppSelect = (appId: string) => {
    setSelectedApp(appId)
  }

  const syncApps = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/connectors/${connectorId}/kintone/apps`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to sync apps')
      const data = await response.json()
      setKintoneApps(data.apps || [])
      toast.success(`${data.total} 個のアプリを同期しました`)
    } catch (err) {
      toast.error("アプリの同期に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  // Update parent component states
  useEffect(() => {
    onLoadingChange(loading)
  }, [loading, onLoadingChange])

  useEffect(() => {
    onErrorChange(error)
  }, [error, onErrorChange])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>データソース</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Source Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="use-kintone"
            checked={useKintone}
            onCheckedChange={handleSourceToggle}
          />
          <Label htmlFor="use-kintone">
            Kintone データを使用
          </Label>
        </div>

        {/* Kintone Configuration */}
        {useKintone && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            {!connectorId ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || '接続されたKintoneコネクターが見つかりません。まずコネクターを設定してください。'}
                  <div className="mt-2">
                    <Link href="/admin/connectors?tenantId=550e8400-e29b-41d4-a716-446655440001">
                      <Button variant="outline" size="sm">
                        コネクター管理へ
                      </Button>
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            ) : kintoneApps.length === 0 ? (
              <div className="space-y-2">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Kintoneアプリが同期されていません。
                  </AlertDescription>
                </Alert>
                <Button onClick={syncApps} disabled={loading} size="sm">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      同期中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      アプリを同期
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Kintoneアプリを選択:</Label>
                <div className="grid gap-2">
                  {kintoneApps.map((app) => (
                    <div
                      key={app.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedApp === app.app_id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => handleAppSelect(app.app_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {app.app_id} | コード: {app.code}
                          </div>
                        </div>
                        {selectedApp === app.app_id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center space-x-2 text-sm">
          {useKintone ? (
            <>
              <Database className="h-4 w-4 text-blue-500" />
              <span>Kintone データを使用中</span>
              {selectedApp && (
                <Badge variant="outline">
                  {kintoneApps.find(app => app.app_id === selectedApp)?.name}
                </Badge>
              )}
            </>
          ) : (
            <>
              <Database className="h-4 w-4 text-gray-500" />
              <span>サンプルデータを使用中</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
