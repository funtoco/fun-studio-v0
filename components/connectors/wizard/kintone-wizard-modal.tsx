"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Select from "react-select"
import { useKintoneWizardStore } from "./kintone-wizard-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

function Stepper() {
  const state = useKintoneWizardStore((s) => s.uiFlowState)
  const steps = [
    { key: "selectingKintoneApp", label: "①Kintoneアプリ" },
    { key: "selectingDestinationApp", label: "②Funstudioアプリ" },
    { key: "settingFilters", label: "③フィルター設定" },
    { key: "mappingFields", label: "④フィールド対応" },
    { key: "reviewAndSave", label: "⑤確認" },
  ]
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, idx) => (
        <div key={s.key} className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded ${state === s.key ? "bg-black text-white" : "bg-muted"}`}>{s.label}</div>
          {idx < steps.length - 1 && <span className="text-muted-foreground">→</span>}
        </div>
      ))}
    </div>
  )
}

function SelectingKintoneApp() {
  const { getAppsCacheValid, setAppsCache, setSelectedKintoneApp, connectorId } = useKintoneWizardStore()
  const cache = getAppsCacheValid()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchApps() {
    let id = connectorId
    if (!id && typeof window !== 'undefined') {
      const m = window.location.pathname.match(/\/admin\/connectors\/([^/]+)/)
      if (m && m[1]) {
        id = m[1]
      }
    }
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/connectors/${id}/kintone/apps?source=kintone&limit=30&offset=0`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const msg = body?.error || `HTTP ${res.status}`
        setError(msg)
        return
      }
      const data = await res.json()
      setAppsCache({ apps: data.apps || [], total: data.total || 0, nextOffset: data.nextOffset })
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cache || !connectorId) return
    fetchApps()
  }, [cache, connectorId])

  if (!cache) {
    return (
      <div className="py-10">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            <span>読み込み中...</span>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-sm text-red-600">{error || 'データが読み込めませんでした'}</div>
            <Button type="button" variant="outline" onClick={fetchApps}>再試行</Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">Kintoneのアプリを選択してください</div>
      <div className="max-h-72 overflow-auto space-y-2">
        {cache.data.apps.map((app) => (
          <button
            key={String(app.id)}
            type="button"
            className="w-full text-left p-3 border rounded hover:bg-muted"
            onClick={() => setSelectedKintoneApp({ id: String(app.id), name: app.name })}
          >
            <div className="font-medium">{app.name}</div>
            <div className="text-xs text-muted-foreground">ID: {String(app.id)}</div>
          </button>
        ))}
        {cache.data.apps.length === 0 && (
          <div className="text-sm text-center text-muted-foreground py-6">アプリが見つかりません</div>
        )}
      </div>
    </div>
  )
}

function SelectingDestinationApp() {
  const { setSelectedDestinationApp } = useKintoneWizardStore()
  // Static list for MVP
  const destinations = [
    { key: "people", name: "人材一覧" },
    { key: "visas", name: "ビザ進捗管理" },
    { key: "meetings", name: "面談記録" },
  ]
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">取り込み先アプリを選択してください</div>
      <div className="grid gap-2">
        {destinations.map((d) => (
          <button
            key={d.key}
            type="button"
            className="text-left p-3 border rounded hover:bg-muted"
            onClick={() => setSelectedDestinationApp(d)}
          >
            <div className="font-medium">{d.name}</div>
            <div className="text-xs text-muted-foreground">key: {d.key}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Kintoneフィールド用のSelectコンポーネント
function KintoneFieldSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string
  onChange: (value: string) => void
  options: Array<{ code: string; label: string; type: string }>
}) {
  const selectOptions = options.map(field => ({
    value: field.code,
    label: `${field.label} (${field.type})`
  }))

  const selectedOption = selectOptions.find(option => option.value === value)

  return (
    <Select
      value={selectedOption}
      onChange={(option: any) => onChange(option?.value || '')}
      options={selectOptions}
      placeholder="Kintone フィールドを選択"
      isSearchable
      isClearable
      className="text-sm"
      styles={{
        control: (base: any) => ({
          ...base,
          minHeight: '40px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          '&:hover': {
            borderColor: '#9ca3af'
          }
        }),
        placeholder: (base: any) => ({
          ...base,
          color: '#6b7280'
        })
      }}
    />
  )
}

// Funstudioフィールド用のSelectコンポーネント
function FunstudioFieldSelect({ 
  value, 
  onChange, 
  options 
}: { 
  value: string
  onChange: (value: string) => void
  options: Array<{ key: string; label: string; type: string }>
}) {
  const selectOptions = options.map(field => ({
    value: field.key,
    label: `${field.label}${field.type ? ` (${field.type})` : ''}`
  }))

  const selectedOption = selectOptions.find(option => option.value === value)

  return (
    <Select
      value={selectedOption}
      onChange={(option: any) => onChange(option?.value || '')}
      options={selectOptions}
      placeholder="Funstudio フィールドを選択"
      isSearchable
      isClearable
      className="text-sm"
      styles={{
        control: (base: any) => ({
          ...base,
          minHeight: '40px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          '&:hover': {
            borderColor: '#9ca3af'
          }
        }),
        placeholder: (base: any) => ({
          ...base,
          color: '#6b7280'
        })
      }}
    />
  )
}

function SettingFilters() {
  const {
    selectedKintoneApp,
    draftFilters,
    setDraftFilters,
    connectorId,
    getFieldsCacheValid,
    setFieldsCache,
    next,
  } = useKintoneWizardStore()

  const fieldsCache = selectedKintoneApp ? getFieldsCacheValid(selectedKintoneApp.id) : null

  // Load fields when enter
  useEffect(() => {
    let active = true
    if (!selectedKintoneApp || fieldsCache) return
    ;(async () => {
      let id = connectorId
      if (!id && typeof window !== 'undefined') {
        const m = window.location.pathname.match(/\/admin\/connectors\/([^/]+)/)
        if (m && m[1]) id = m[1]
      }
      if (!id) return
      const res = await fetch(`/api/connectors/${id}/kintone/apps/${selectedKintoneApp.id}/fields`)
      if (!active) return
      if (res.ok) {
        const data = await res.json()
        setFieldsCache(selectedKintoneApp.id, { fields: data.fields || [] })
      }
    })()
    return () => {
      active = false
    }
  }, [connectorId, selectedKintoneApp, fieldsCache, setFieldsCache])

  const kintoneFields = fieldsCache?.data.fields || []

  const addFilter = () => {
    setDraftFilters([...draftFilters, { field_code: '', field_name: '', field_type: '', filter_value: '' }])
  }

  const removeFilter = (index: number) => {
    const newFilters = draftFilters.filter((_, i) => i !== index)
    setDraftFilters(newFilters)
  }

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...draftFilters]
    if (field === 'field_code') {
      const selectedField = kintoneFields.find(f => f.code === value)
      newFilters[index] = {
        ...newFilters[index],
        field_code: value,
        field_name: selectedField?.label || '',
        field_type: selectedField?.type || '',
        filter_value: ''
      }
    } else {
      newFilters[index] = { ...newFilters[index], [field]: value }
    }
    setDraftFilters(newFilters)
  }

  const canProceed = draftFilters.length === 0 || draftFilters.every(f => f.field_code && f.filter_value)

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        連携対象を絞り込むフィルター条件を設定してください（任意）
      </div>
      <div className="space-y-3">
        {draftFilters.map((filter, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 border rounded">
            <KintoneFieldSelect
              value={filter.field_code}
              onChange={(value) => updateFilter(idx, 'field_code', value)}
              options={kintoneFields}
            />
            <div className="flex items-center text-sm text-muted-foreground">
              =
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={filter.filter_value}
                onChange={(e) => updateFilter(idx, 'filter_value', e.target.value)}
                placeholder="フィルター値を入力"
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeFilter(idx)}
                className="px-2"
              >
                ×
              </Button>
            </div>
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={addFilter}
          >
            フィルターを追加
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={next} 
          disabled={!canProceed}
        >
          次へ
        </Button>
      </div>
    </div>
  )
}

function MappingFields() {
  const {
    selectedKintoneApp,
    selectedDestinationApp,
    draftFilters,
    draftFieldMappings,
    setDraftFieldMappings,
    connectorId,
    getFieldsCacheValid,
    setFieldsCache,
    getSchemaCacheValid,
    setSchemaCache,
    setMappingIdDraft,
    next,
    editMode,
    existingMapping,
  } = useKintoneWizardStore()

  const fieldsCache = selectedKintoneApp ? getFieldsCacheValid(selectedKintoneApp.id) : null

  // Load fields when enter
  useEffect(() => {
    let active = true
    if (!selectedKintoneApp || fieldsCache) return
    
    console.log('[DEBUG] Loading Kintone fields for edit mode', {
      selectedKintoneApp,
      fieldsCache,
      editMode,
      existingMapping
    })
    
    ;(async () => {
      let id = connectorId
      if (!id && typeof window !== 'undefined') {
        const m = window.location.pathname.match(/\/admin\/connectors\/([^/]+)/)
        if (m && m[1]) id = m[1]
      }
      if (!id) {
        console.error('[DEBUG] No connector ID found')
        return
      }
      
      console.log('[DEBUG] Fetching fields from API', {
        connectorId: id,
        appId: selectedKintoneApp.id,
        url: `/api/connectors/${id}/kintone/apps/${selectedKintoneApp.id}/fields`
      })
      
      const res = await fetch(`/api/connectors/${id}/kintone/apps/${selectedKintoneApp.id}/fields`)
      if (!active) return
      
      console.log('[DEBUG] API response status', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('[DEBUG] API response data', data)
        setFieldsCache(selectedKintoneApp.id, { fields: data.fields || [] })
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('[DEBUG] API error', errorData)
      }
    })()
    return () => {
      active = false
    }
  }, [connectorId, selectedKintoneApp, fieldsCache, setFieldsCache, editMode, existingMapping])

  const kintoneFields = fieldsCache?.data.fields || []
  
  // レコードIDを手動で追加（Kintone APIでは取得されないため）
  const kintoneFieldsWithRecordId = [
    {
      code: '$id',
      label: 'レコードID',
      type: '__ID__'
    },
    ...kintoneFields
  ]
  
  console.log('[DEBUG] Kintone fields for select', {
    kintoneFields: kintoneFieldsWithRecordId,
    fieldsCache,
    selectedKintoneApp
  })

  // Load existing field mappings in edit mode
  useEffect(() => {
    if (editMode && existingMapping && existingMapping.id && draftFieldMappings.length === 0) {
      console.log('[DEBUG] Loading existing field mappings', {
        editMode,
        existingMapping,
        connectorId,
        draftFieldMappingsLength: draftFieldMappings.length
      })
      
      const loadExistingMappings = async () => {
        try {
          const response = await fetch(`/api/connectors/${connectorId}/mappings/${existingMapping.id}/fields`)
          console.log('[DEBUG] Existing mappings API response status', response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log('[DEBUG] Existing mappings data', data)
            const mappings = data.fields.map((field: any) => ({
              source_field_code: field.source_field_code,
              destination_field_key: field.target_field_id
            }))
            console.log('[DEBUG] Mapped field mappings', mappings)
            setDraftFieldMappings(mappings)
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('[DEBUG] Existing mappings API error', errorData)
          }
        } catch (error) {
          console.error('Failed to load existing field mappings:', error)
        }
      }
      loadExistingMappings()
    }
  }, [editMode, existingMapping, connectorId, draftFieldMappings.length, setDraftFieldMappings])

  const destinationKey = selectedDestinationApp?.key || 'people'
  const schemaCache = destinationKey ? getSchemaCacheValid(destinationKey) : null
  const [schemaError, setSchemaError] = useState<string | null>(null)

  // Fetch live schema for selected destination app
  useEffect(() => {
    if (!destinationKey || schemaCache) return
    ;(async () => {
      try {
        const res = await fetch(`/api/schema/${destinationKey}`)
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j?.error || `HTTP ${res.status}`)
        }
        const data = await res.json()
        const cols = (data.columns || []).map((c: any) => ({
          key: c.key ?? c.column_name,
          label: c.label ?? c.column_name ?? c.key,
          type: c.type ?? c.data_type,
          position: c.position ?? c.ordinal_position ?? 0,
        }))
        setSchemaCache(destinationKey, { columns: cols })
        setSchemaError(null)
        console.log(`[SCHEMA] fetched ${destinationKey} columns: ${cols.length}`)
      } catch (e: any) {
        console.error('Schema fetch error', e)
        setSchemaError(e?.message || 'failed to fetch schema')
      }
    })()
  }, [destinationKey, schemaCache, setSchemaCache])

  const destFields = schemaCache?.data.columns || []

  const canSave = draftFieldMappings.length >= 1 && draftFieldMappings.every(m => m.source_field_code && m.destination_field_key)
  const [isSaving, setIsSaving] = useState(false)

  async function onSaveDraft() {
    if (!selectedKintoneApp || !selectedDestinationApp || isSaving) return
    
    setIsSaving(true)
    try {
      // First save the mapping
      const res = await fetch(`/api/connector/mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connector_id: connectorId,
          source_type: 'kintone',
          source_app_id: selectedKintoneApp.id,
          destination_app_key: selectedDestinationApp.key,
          field_mappings: draftFieldMappings,
        }),
      })
      
      if (!res.ok) {
        console.error('Failed to save mapping:', await res.json())
        return
      }
      
      const data = await res.json()
      setMappingIdDraft(data.mapping_id)
      console.log(`[FLOW] SaveDraft mappingId=${data.mapping_id}`)
      
      // Then save filters if any
      if (draftFilters.length > 0) {
        const filterRes = await fetch(`/api/connectors/${connectorId}/mappings/${data.mapping_id}/filters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: draftFilters }),
        })
        
        if (!filterRes.ok) {
          console.error('Failed to save filters:', await filterRes.json())
          return
        }
        
        console.log(`[FLOW] Filters saved for mappingId=${data.mapping_id}`)
      }
      
      next()
    } catch (error) {
      console.error('Error in onSaveDraft:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">フィールドの対応関係を設定してください（最低1件必須）</div>
      <div className="space-y-2">
        {draftFieldMappings.map((m, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded">
            <KintoneFieldSelect
              value={m.source_field_code}
              onChange={(value) => {
                const copy = [...draftFieldMappings]
                copy[idx] = { ...copy[idx], source_field_code: value }
                setDraftFieldMappings(copy)
              }}
              options={kintoneFieldsWithRecordId}
            />
            <FunstudioFieldSelect
              value={m.destination_field_key}
              onChange={(value) => {
                const copy = [...draftFieldMappings]
                copy[idx] = { ...copy[idx], destination_field_key: value }
                setDraftFieldMappings(copy)
              }}
              options={destFields.map((df: any, i: number) => ({
                key: df.key ?? df.column_name ?? String(i),
                label: df.label ?? df.column_name ?? df.key ?? '',
                type: df.type ?? ''
              }))}
            />
          </div>
        ))}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraftFieldMappings([...draftFieldMappings, { source_field_code: '', destination_field_key: '' }])}
          >
            追加
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={onSaveDraft} disabled={!canSave || isSaving}>
          {isSaving ? '保存中...' : '下書きを保存'}
        </Button>
      </div>
    </div>
  )
}

function ReviewAndSave() {
  const { selectedKintoneApp, selectedDestinationApp, draftFilters, draftFieldMappings, mappingIdDraft } = useKintoneWizardStore()
  return (
    <div className="space-y-4 text-sm">
      <div>アプリ: {selectedKintoneApp?.name} → {selectedDestinationApp?.name}</div>
      
      {draftFilters.length > 0 && (
        <div>
          <div className="font-medium mb-2">フィルター条件:</div>
          <div className="border rounded p-3 space-y-1">
            {draftFilters.map((f, i) => (
              <div key={i} className="text-xs">
                {f.field_name} ({f.field_code}) = "{f.filter_value}"
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>ペア数: {draftFieldMappings.length}</div>
      <div className="border rounded p-3">
        {draftFieldMappings.map((m, i) => (
          <div key={i}>{m.source_field_code} → {m.destination_field_key}</div>
        ))}
      </div>
      <div className="text-xs text-muted-foreground">mappingId: {mappingIdDraft || '-'}</div>
    </div>
  )
}

function DoneStep() {
  return <div className="text-sm">接続が有効になりました。ウィザードを閉じることができます。</div>
}

export function KintoneWizardModal() {
  const {
    isOpen,
    uiFlowState,
    close,
    back,
    next,
    connectorId,
    mappingIdDraft,
  } = useKintoneWizardStore()

  if (!isOpen) return null
  if (!connectorId) {
    // cannot fetch apps without connector id; keep modal open but show info
  }

  const container = (
    <div
      className="fixed inset-0 z-[2000]"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={(e) => e.stopPropagation()}
      />
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg border" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b flex items-center justify-between">
            <Stepper />
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={back}>Back</Button>
              <Button type="button" variant="ghost" onClick={close}>Cancel</Button>
            </div>
          </div>
          <div className="p-6 max-h-[70vh] overflow-auto">
            {uiFlowState === "selectingKintoneApp" && <SelectingKintoneApp />}
            {uiFlowState === "selectingDestinationApp" && <SelectingDestinationApp />}
            {uiFlowState === "settingFilters" && <SettingFilters />}
            {uiFlowState === "mappingFields" && <MappingFields />}
            {uiFlowState === "reviewAndSave" && <ReviewAndSave />}
            {uiFlowState === "done" && <DoneStep />}
          </div>
          <div className="p-4 border-t flex items-center justify-end gap-2">
            {uiFlowState === "selectingKintoneApp" && <Button type="button" onClick={next}>Next</Button>}
            {uiFlowState === "selectingDestinationApp" && <Button type="button" onClick={next}>Next</Button>}
            {uiFlowState === "mappingFields" && null}
            {uiFlowState === "reviewAndSave" && (
              <ActivateButton mappingId={mappingIdDraft} />
            )}
            {uiFlowState === "done" && <Button type="button" onClick={close}>Close</Button>}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(container, document.body)
}

function ActivateButton({ mappingId }: { mappingId: string | null }) {
  const { close, connectorId, tenantId, editMode, draftFieldMappings } = useKintoneWizardStore()
  const [isActivating, setIsActivating] = useState(false)
  
  async function onActivate() {
    if (!mappingId || !connectorId || !tenantId || isActivating) return
    
    setIsActivating(true)
    try {
      if (editMode) {
        // 編集モードの場合はフィールドマッピングを更新してから有効化
        const res = await fetch(`/api/connectors/${connectorId}/mappings/${mappingId}/fields`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: draftFieldMappings.map(m => ({
              source_field_code: m.source_field_code,
              target_field_id: m.destination_field_key
            }))
          })
        })
        
        if (!res.ok) {
          const error = await res.json()
          console.error('[FLOW] Field mapping update failed:', error)
          return
        }
        
        console.log(`[FLOW] Field mappings updated for mappingId=${mappingId}`)
      }
      
      // マッピングを有効化（連携処理は実行しない）
      const activateRes = await fetch(`/api/connectors/${connectorId}/mappings/${mappingId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (activateRes.ok) {
        console.log(`[FLOW] Mapping activated for mappingId=${mappingId}`)
        // UI更新イベントを送信
        window.dispatchEvent(new CustomEvent('mapping:activated'))
        close()
      } else {
        const error = await activateRes.json()
        console.error('[FLOW] Activation failed:', error)
      }
    } catch (error) {
      console.error('[FLOW] Operation error:', error)
    } finally {
      setIsActivating(false)
    }
  }
  
  return (
    <Button 
      type="button" 
      onClick={onActivate} 
      disabled={!mappingId || !connectorId || !tenantId || isActivating}
    >
      {isActivating ? '有効化中...' : '有効化'}
    </Button>
  )
}


