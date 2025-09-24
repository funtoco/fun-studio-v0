/**
 * Data source component for Visa page that can switch between sample data and Kintone data
 */

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, RefreshCw, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { getVisas } from "@/lib/supabase/visas"

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

interface Visa {
  id: string
  personId: string
  type: string
  status: string
  applicationDate?: string
  expiryDate?: string
  createdAt: string
  updatedAt: string
}

interface VisaDataSourceProps {
  onDataChange: (visas: Visa[], source: 'sample' | 'kintone') => void
  onLoadingChange: (loading: boolean) => void
  onErrorChange: (error: string | null) => void
}

export function VisaDataSource({ onDataChange, onLoadingChange, onErrorChange }: VisaDataSourceProps) {
  const [useKintone, setUseKintone] = useState(false)
  const [kintoneApps, setKintoneApps] = useState<KintoneApp[]>([])
  const [selectedApp, setSelectedApp] = useState<string>('')
  const [kintoneRecords, setKintoneRecords] = useState<KintoneRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectorId, setConnectorId] = useState<string>('')

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

  // Load sample data when not using Kintone
  useEffect(() => {
    if (!useKintone) {
      loadSampleData()
    }
  }, [useKintone])

  const loadConnector = async () => {
    try {
      const response = await fetch('/api/admin/connectors?tenantId=550e8400-e29b-41d4-a716-446655440001')
      if (!response.ok) throw new Error('Failed to fetch connectors')
      const data = await response.json()
      const connectedConnector = data.connectors.find((c: any) => c.status === 'connected' && c.provider === 'kintone')
      if (connectedConnector) {
        setConnectorId(connectedConnector.id)
      } else {
        setError('接続されたKintoneコネクターが見つかりません')
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
      
      // Transform Kintone records to Visa format
      const transformedVisas = transformKintoneRecordsToVisas(data.records)
      onDataChange(transformedVisas, 'kintone')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records')
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = async () => {
    try {
      setLoading(true)
      setError(null)
      const visaData = await getVisas()
      onDataChange(visaData, 'sample')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sample data')
    } finally {
      setLoading(false)
    }
  }

  const transformKintoneRecordsToVisas = (records: KintoneRecord[]): Visa[] => {
    return records.map(record => ({
      id: record.id,
      personId: record.personId || record.人材ID || record.人材番号 || '',
      type: record.type || record.ビザ種類 || record.種類 || '',
      status: record.status || record.ステータス || record.進捗 || '',
      applicationDate: record.applicationDate || record.申請日 || record.申請日時 || '',
      expiryDate: record.expiryDate || record.期限 || record.有効期限 || '',
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
            id="use-kintone-visa"
            checked={useKintone}
            onCheckedChange={handleSourceToggle}
          />
          <Label htmlFor="use-kintone-visa">
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
                  接続されたKintoneコネクターが見つかりません。まずコネクターを設定してください。
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
