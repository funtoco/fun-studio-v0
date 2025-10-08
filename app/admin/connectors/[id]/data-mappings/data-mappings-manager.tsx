/**
 * Data Mappings Manager Component
 * Manages value mappings for Kintone fields to service fields
 */

"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GitBranch, Plus, Edit, Trash2, Settings, ArrowRight, Database } from "lucide-react"
import { toast } from "sonner"

interface DataMapping {
  id: string
  app_mapping_id: string
  field_name: string
  field_type: string
  is_active: boolean
  created_at: string
  updated_at: string
  value_mappings: ValueMapping[]
}

interface ValueMapping {
  id: string
  data_mapping_id: string
  source_value: string
  target_value: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

interface AppMapping {
  id: string
  source_app_id: string
  source_app_name: string
  target_app_type: string
  is_active: boolean
}

interface DataMappingsManagerProps {
  connectorId: string
  tenantId?: string
}

export function DataMappingsManager({ connectorId, tenantId }: DataMappingsManagerProps) {
  const [dataMappings, setDataMappings] = useState<DataMapping[]>([])
  const [appMappings, setAppMappings] = useState<AppMapping[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingMapping, setEditingMapping] = useState<DataMapping | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state for creating/editing mappings
  const [formData, setFormData] = useState({
    app_mapping_id: '',
    field_name: '',
    field_type: 'string'
  })

  // Load data mappings and app mappings
  useEffect(() => {
    loadData()
  }, [connectorId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load app mappings first
      const appMappingsResponse = await fetch(`/api/connectors/${connectorId}/app-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`)
      if (!appMappingsResponse.ok) {
        throw new Error('Failed to load app mappings')
      }
      const appMappingsData = await appMappingsResponse.json()
      console.log('App mappings response:', appMappingsData)
      setAppMappings(appMappingsData.appMappings || [])

      // Load data mappings
      const dataMappingsResponse = await fetch(`/api/connectors/${connectorId}/data-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`)
      if (!dataMappingsResponse.ok) {
        throw new Error('Failed to load data mappings')
      }
      const dataMappingsData = await dataMappingsResponse.json()
      console.log('Data mappings response:', dataMappingsData)
      setDataMappings(dataMappingsData.dataMappings || [])

    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMapping = async () => {
    if (!formData.app_mapping_id || !formData.field_name) {
      toast.error('すべての必須フィールドを入力してください')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create data mapping')
      }

      toast.success('データマッピングを作成しました')
      setShowCreateDialog(false)
      setFormData({ app_mapping_id: '', field_name: '', field_type: 'string' })
      loadData()
    } catch (err) {
      console.error('Error creating data mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to create data mapping')
    } finally {
      setSaving(false)
    }
  }

  const handleEditMapping = (mapping: DataMapping) => {
    setEditingMapping(mapping)
    setFormData({
      app_mapping_id: mapping.app_mapping_id,
      field_name: mapping.field_name,
      field_type: mapping.field_type
    })
    setShowEditDialog(true)
  }

  const handleUpdateMapping = async () => {
    if (!editingMapping || !formData.app_mapping_id || !formData.field_name) {
      toast.error('すべての必須フィールドを入力してください')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${editingMapping.id}${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update data mapping')
      }

      toast.success('データマッピングを更新しました')
      setShowEditDialog(false)
      setEditingMapping(null)
      setFormData({ app_mapping_id: '', field_name: '', field_type: 'string' })
      loadData()
    } catch (err) {
      console.error('Error updating data mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update data mapping')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMapping = async (mappingId: string) => {
    if (!confirm('このデータマッピングを削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete data mapping')
      }

      toast.success('データマッピングを削除しました')
      loadData()
    } catch (err) {
      console.error('Error deleting data mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to delete data mapping')
    }
  }

  const getAppMappingName = (appMappingId: string) => {
    const appMapping = appMappings.find(am => am.id === appMappingId)
    return appMapping ? `${appMapping.source_app_name} → ${appMapping.target_app_type}` : 'Unknown'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>エラーが発生しました: {error}</p>
            <Button onClick={loadData} className="mt-4">
              再試行
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Data Mappings List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>データマッピング一覧</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                フィールドの値マッピング設定を管理します
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              新しいマッピング
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dataMappings.length === 0 ? (
            <EmptyState
              icon={<GitBranch className="h-8 w-8" />}
              title="データマッピングがありません"
              description="Kintoneフィールドの値とサービスフィールドの値の対応関係を設定してください"
              action={
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  最初のマッピングを作成
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アプリマッピング</TableHead>
                  <TableHead>フィールド名</TableHead>
                  <TableHead>フィールドタイプ</TableHead>
                  <TableHead>値マッピング数</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">
                      {getAppMappingName(mapping.app_mapping_id)}
                    </TableCell>
                    <TableCell>{mapping.field_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapping.field_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {mapping.value_mappings?.length || 0} ルール
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mapping.is_active ? "default" : "secondary"}>
                        {mapping.is_active ? "アクティブ" : "非アクティブ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `/admin/connectors/${connectorId}/data-mappings/${mapping.id}/values${tenantId ? `?tenantId=${tenantId}` : ''}`
                            window.open(url, '_blank')
                          }}
                        >
                          <Settings className="h-4 w-4" />
                          値マッピング
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMapping(mapping)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMapping(mapping.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Data Mapping Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいデータマッピング</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="app_mapping_id">アプリマッピング</Label>
              <Select
                value={formData.app_mapping_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, app_mapping_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="アプリマッピングを選択" />
                </SelectTrigger>
                <SelectContent>
                  {appMappings.map((appMapping) => (
                    <SelectItem key={appMapping.id} value={appMapping.id}>
                      {appMapping.source_app_name} → {appMapping.target_app_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="field_name">フィールド名</Label>
              <Input
                id="field_name"
                value={formData.field_name}
                onChange={(e) => setFormData(prev => ({ ...prev, field_name: e.target.value }))}
                placeholder="例: status"
              />
            </div>
            <div>
              <Label htmlFor="field_type">フィールドタイプ</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, field_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">文字列</SelectItem>
                  <SelectItem value="number">数値</SelectItem>
                  <SelectItem value="boolean">真偽値</SelectItem>
                  <SelectItem value="date">日付</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleCreateMapping} disabled={saving}>
                {saving ? '作成中...' : '作成'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Data Mapping Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>データマッピングを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_app_mapping_id">アプリマッピング</Label>
              <Select
                value={formData.app_mapping_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, app_mapping_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="アプリマッピングを選択" />
                </SelectTrigger>
                <SelectContent>
                  {appMappings.map((appMapping) => (
                    <SelectItem key={appMapping.id} value={appMapping.id}>
                      {appMapping.source_app_name} → {appMapping.target_app_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_field_name">フィールド名</Label>
              <Input
                id="edit_field_name"
                value={formData.field_name}
                onChange={(e) => setFormData(prev => ({ ...prev, field_name: e.target.value }))}
                placeholder="例: status"
              />
            </div>
            <div>
              <Label htmlFor="edit_field_type">フィールドタイプ</Label>
              <Select
                value={formData.field_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, field_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">文字列</SelectItem>
                  <SelectItem value="number">数値</SelectItem>
                  <SelectItem value="boolean">真偽値</SelectItem>
                  <SelectItem value="date">日付</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                キャンセル
              </Button>
              <Button onClick={handleUpdateMapping} disabled={saving}>
                {saving ? '更新中...' : '更新'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
