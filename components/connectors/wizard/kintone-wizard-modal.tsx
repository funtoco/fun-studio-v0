"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
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
            key={String(app.appId ?? app.id)}
            type="button"
            className="w-full text-left p-3 border rounded hover:bg-muted"
            onClick={() => setSelectedKintoneApp({ id: String(app.appId ?? app.id), name: app.name })}
          >
            <div className="font-medium">{app.name}</div>
            <div className="text-xs text-muted-foreground">ID: {String(app.appId ?? app.id)}</div>
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
            <select
              className="border rounded p-2 text-sm"
              value={m.source_field_code}
              aria-label="Kintone field"
              onChange={(e) => {
                const copy = [...draftFieldMappings]
                copy[idx] = { ...copy[idx], source_field_code: e.target.value }
                setDraftFieldMappings(copy)
              }}
            >
              <option value="">Kintone フィールドを選択</option>
              {kintoneFields.map(f => (
                <option key={f.code} value={f.code}>{f.label} ({f.type})</option>
              ))}
            </select>
            <select
              className="border rounded p-2 text-sm"
              value={m.destination_field_key}
              aria-label="Destination field"
              onChange={(e) => {
                const copy = [...draftFieldMappings]
                copy[idx] = { ...copy[idx], destination_field_key: e.target.value }
                setDraftFieldMappings(copy)
              }}
            >
              <option value="">Funstudio フィールドを選択</option>
              {destFields.map((df: any, i: number) => {
                const k = df.key ?? df.column_name ?? String(i)
                const lbl = df.label ?? df.column_name ?? df.key ?? ''
                const type = df.type ?? ''
                return (
                  <option key={k} value={k}>{lbl}{type ? ` (${type})` : ''}</option>
                )
              })}
            </select>
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
  const { close } = useKintoneWizardStore()
  async function onActivate() {
    if (!mappingId) return
    const res = await fetch(`/api/connector/mappings/${mappingId}/activate`, { method: 'POST' })
    if (res.ok) {
      console.log(`[FLOW] Activate mappingId=${mappingId} → done`)
      // notify page to refresh mapping card
      window.dispatchEvent(new CustomEvent('mapping:activated'))
      close()
    }
  }
  return <Button type="button" onClick={onActivate} disabled={!mappingId}>有効化</Button>
}


