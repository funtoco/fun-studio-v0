/**
 * Value Mappings Manager Component
 * Manages individual value mappings for a data mapping
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
// import { Textarea } from "@/components/ui/textarea"
import { Settings, Plus, Edit, Trash2, ArrowRight, Database } from "lucide-react"
import { toast } from "sonner"

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

interface DataMapping {
  id: string
  app_mapping_id: string
  field_name: string
  field_type: string
  is_active: boolean
}

interface ValueMappingsManagerProps {
  connectorId: string
  mappingId: string
  tenantId?: string
}

// サービス値の候補（statusMappingから抽出）
const SERVICE_VALUE_OPTIONS = [
  '書類準備中',
  '書類作成中',
  '書類確認中',
  '申請準備中',
  'ビザ申請準備中',
  '申請中',
  '(追加書類)',
  'ビザ取得済み'
]

export function ValueMappingsManager({ connectorId, mappingId, tenantId }: ValueMappingsManagerProps) {
  const [valueMappings, setValueMappings] = useState<ValueMapping[]>([])
  const [dataMapping, setDataMapping] = useState<DataMapping | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingMapping, setEditingMapping] = useState<ValueMapping | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state for creating/editing mappings
  const [formData, setFormData] = useState({
    source_value: '',
    target_value: '',
    is_active: true,
    sort_order: 0
  })

  // Load value mappings and data mapping info
  useEffect(() => {
    loadData()
  }, [mappingId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load data mapping info
      const dataMappingResponse = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}${tenantId ? `?tenantId=${tenantId}` : ''}`)
      if (!dataMappingResponse.ok) {
        throw new Error('Failed to load data mapping')
      }
      const dataMappingData = await dataMappingResponse.json()
      setDataMapping(dataMappingData.dataMapping)

      // Load value mappings
      const valueMappingsResponse = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}/value-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`)
      if (!valueMappingsResponse.ok) {
        throw new Error('Failed to load value mappings')
      }
      const valueMappingsData = await valueMappingsResponse.json()
      console.log('Value mappings response:', valueMappingsData)
      setValueMappings(valueMappingsData.valueMappings || [])

    } catch (err) {
      console.error('Error loading data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMapping = async () => {
    if (!formData.source_value || !formData.target_value) {
      toast.error('すべての必須フィールドを入力してください')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}/value-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create value mapping')
      }

      toast.success('値マッピングを作成しました')
      setShowCreateDialog(false)
      setFormData({ source_value: '', target_value: '', is_active: true, sort_order: 0 })
      loadData()
    } catch (err) {
      console.error('Error creating value mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to create value mapping')
    } finally {
      setSaving(false)
    }
  }

  const handleEditMapping = (mapping: ValueMapping) => {
    setEditingMapping(mapping)
    setFormData({
      source_value: mapping.source_value,
      target_value: mapping.target_value,
      is_active: mapping.is_active,
      sort_order: mapping.sort_order
    })
    setShowEditDialog(true)
  }

  const handleUpdateMapping = async () => {
    if (!editingMapping || !formData.source_value || !formData.target_value) {
      toast.error('すべての必須フィールドを入力してください')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}/value-mappings/${editingMapping.id}${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update value mapping')
      }

      toast.success('値マッピングを更新しました')
      setShowEditDialog(false)
      setEditingMapping(null)
      setFormData({ source_value: '', target_value: '', is_active: true, sort_order: 0 })
      loadData()
    } catch (err) {
      console.error('Error updating value mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update value mapping')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteMapping = async (mappingId: string) => {
    if (!confirm('この値マッピングを削除しますか？')) {
      return
    }

    try {
      const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}/value-mappings/${mappingId}${tenantId ? `?tenantId=${tenantId}` : ''}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete value mapping')
      }

      toast.success('値マッピングを削除しました')
      loadData()
    } catch (err) {
      console.error('Error deleting value mapping:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to delete value mapping')
    }
  }

  const handleBulkCreate = async () => {
    // Create the status mapping from the provided example
    const statusMapping = {
      '書類準備中': [
        '営業_企業情報待ち',
        '新規_企業情報待ち', 
        '既存_企業情報待ち', 
        '支援_更新案内・人材情報更新待ち'
      ],
      '書類作成中': ['OP_企業書類作成中'],
      '書類確認中': [
        '営業_企業に確認してください',
        '新規_企業に確認してください',
        '既存_企業に確認してください',
        'OP_企業に確認してください',
        '新規_企業_書類確認待ち',
        '既存_企業_書類確認待ち',
        '企業_書類確認待ち（新規）',
        '企業_書類確認待ち（更新）',
        'OP_書類修正中',
      ],
      '申請準備中': [
        'OP_押印書類送付準備中',
        'OP_押印書類受取待ち',
        'OP_申請人サイン書類準備中',
        '支援_申請人サイン待ち',
        'OP_申請人サイン書類受取待ち',
      ],
      'ビザ申請準備中': ['ビザ申請準備中','ビザ申請待ち'],
      '申請中': ['申請中'],
      '(追加書類)': ['追加修正対応中'],
      'ビザ取得済み': ['許可'],
    }

    try {
      setSaving(true)
      
      // Create all value mappings
      for (const [targetValue, sourceValues] of Object.entries(statusMapping)) {
        for (let i = 0; i < sourceValues.length; i++) {
          const response = await fetch(`/api/connectors/${connectorId}/data-mappings/${mappingId}/value-mappings${tenantId ? `?tenantId=${tenantId}` : ''}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              source_value: sourceValues[i],
              target_value: targetValue,
              is_active: true,
              sort_order: i
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to create value mapping')
          }
        }
      }

      toast.success('ステータスマッピングを一括作成しました')
      loadData()
    } catch (err) {
      console.error('Error creating bulk mappings:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to create bulk mappings')
    } finally {
      setSaving(false)
    }
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
      {/* Value Mappings List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>値マッピング一覧</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {dataMapping?.field_name} フィールドの値マッピング設定を管理します
              </p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleBulkCreate} disabled={saving}>
                <Database className="h-4 w-4 mr-2" />
                一括作成
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新しいマッピング
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {valueMappings.length === 0 ? (
            <EmptyState
              icon={<Settings className="h-8 w-8" />}
              title="値マッピングがありません"
              description="Kintoneフィールドの値とサービスフィールドの値の対応関係を設定してください"
              action={
                <div className="flex space-x-2">
                  <Button onClick={handleBulkCreate} disabled={saving}>
                    <Database className="h-4 w-4 mr-2" />
                    一括作成
                  </Button>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    最初のマッピングを作成
                  </Button>
                </div>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kintone値</TableHead>
                  <TableHead>サービス値</TableHead>
                  <TableHead>順序</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {valueMappings.map((mapping) => (
                  <TableRow key={mapping.id}>
                    <TableCell className="font-medium">
                      {mapping.source_value}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mapping.target_value}</Badge>
                    </TableCell>
                    <TableCell>
                      {mapping.sort_order}
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

      {/* Create Value Mapping Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しい値マッピング</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="source_value">Kintone値</Label>
              <Input
                id="source_value"
                value={formData.source_value}
                onChange={(e) => setFormData(prev => ({ ...prev, source_value: e.target.value }))}
                placeholder="例: 営業_企業情報待ち"
              />
            </div>
            <div>
              <Label htmlFor="target_value">サービス値</Label>
              <Select
                value={formData.target_value}
                onValueChange={(value) => setFormData(prev => ({ ...prev, target_value: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="サービス値を選択" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_VALUE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort_order">順序</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
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

      {/* Edit Value Mapping Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>値マッピングを編集</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_source_value">Kintone値</Label>
              <Input
                id="edit_source_value"
                value={formData.source_value}
                onChange={(e) => setFormData(prev => ({ ...prev, source_value: e.target.value }))}
                placeholder="例: 営業_企業情報待ち"
              />
            </div>
            <div>
              <Label htmlFor="edit_target_value">サービス値</Label>
              <Select
                value={formData.target_value}
                onValueChange={(value) => setFormData(prev => ({ ...prev, target_value: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="サービス値を選択" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_VALUE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit_sort_order">順序</Label>
              <Input
                id="edit_sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
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
