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
    { key: "mappingFields", label: "③フィールド対応" },
    { key: "reviewAndSave", label: "④確認" },
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

function MappingFields() {
  const {
    selectedKintoneApp,
    selectedDestinationApp,
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

  // Load existing field mappings in edit mode
  useEffect(() => {
    if (editMode && existingMapping && existingMapping.id && draftFieldMappings.length === 0) {
      const loadExistingMappings = async () => {
        try {
          const response = await fetch(`/api/connectors/${connectorId}/mappings/${existingMapping.id}/fields`)
          if (response.ok) {
            const data = await response.json()
            const mappings = data.fields.map((field: any) => ({
              source_field_code: field.source_field_code,
              destination_field_key: field.target_field_id
            }))
            setDraftFieldMappings(mappings)
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

  async function onSaveDraft() {
    if (!selectedKintoneApp || !selectedDestinationApp) return
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
    if (res.ok) {
      const data = await res.json()
      setMappingIdDraft(data.mapping_id)
      console.log(`[FLOW] SaveDraft mappingId=${data.mapping_id}`)
      next()
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
              options={kintoneFields}
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
        <Button type="button" onClick={onSaveDraft} disabled={!canSave}>下書きを保存</Button>
      </div>
    </div>
  )
}

function ReviewAndSave() {
  const { selectedKintoneApp, selectedDestinationApp, draftFieldMappings, mappingIdDraft } = useKintoneWizardStore()
  return (
    <div className="space-y-4 text-sm">
      <div>アプリ: {selectedKintoneApp?.name} → {selectedDestinationApp?.name}</div>
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
  
  async function onActivate() {
    if (!mappingId || !connectorId || !tenantId) return
    
    try {
      if (editMode) {
        // 編集モードの場合は更新処理
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
        
        if (res.ok) {
          console.log(`[FLOW] Field mappings updated for mappingId=${mappingId}`)
          
          // 更新後に連携も実行
          const syncRes = await fetch(`/api/connectors/${connectorId}/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tenantId,
              force: true
            })
          })
          
          if (syncRes.ok) {
            const syncResult = await syncRes.json()
            console.log(`[FLOW] Sync started after update for connectorId=${connectorId}`, syncResult)
            // 新規登録と同様のイベントを送信
            window.dispatchEvent(new CustomEvent('mapping:activated'))
            close()
          } else {
            console.error('[FLOW] Sync failed after update:', await syncRes.json())
            // フィールド更新は成功したので、更新イベントは送信
            window.dispatchEvent(new CustomEvent('mapping:updated'))
            close()
          }
        } else {
          const error = await res.json()
          console.error('[FLOW] Update failed:', error)
        }
      } else {
        // 新規作成モードの場合は同期処理
        const res = await fetch(`/api/connectors/${connectorId}/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenantId,
            force: true
          })
        })
        
        if (res.ok) {
          const result = await res.json()
          console.log(`[FLOW] Sync started for connectorId=${connectorId}, mappingId=${mappingId}`, result)
          // notify page to refresh mapping card
          window.dispatchEvent(new CustomEvent('mapping:activated'))
          close()
        } else {
          const error = await res.json()
          console.error('[FLOW] Sync failed:', error)
        }
      }
    } catch (error) {
      console.error('[FLOW] Operation error:', error)
    }
  }
  
  return (
    <Button 
      type="button" 
      onClick={onActivate} 
      disabled={!mappingId || !connectorId || !tenantId}
    >
      有効化
    </Button>
  )
}


