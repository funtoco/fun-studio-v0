"use client"

import { create } from "zustand"

export type UiFlowState =
  | "idle"
  | "selectingKintoneApp"
  | "selectingDestinationApp"
  | "mappingFields"
  | "reviewAndSave"
  | "done"

export type KintoneAppLite = { id: string; name: string }
export type DestinationAppLite = { key: string; name: string }

export type DraftFieldMapping = {
  source_field_code: string
  destination_field_key: string
  transform?: unknown
}

type CacheEntry<T> = {
  expiresAt: number
  data: T
}

export type WizardState = {
  isOpen: boolean
  uiFlowState: UiFlowState
  connectorId?: string
  tenantId?: string
  selectedKintoneApp: KintoneAppLite | null
  selectedDestinationApp: DestinationAppLite | null
  draftFieldMappings: DraftFieldMapping[]
  mappingIdDraft: string | null

  // 10-min caches
  appsCache?: CacheEntry<{ apps: KintoneAppLite[]; total: number; nextOffset?: number }>
  fieldsCacheByAppId: Record<string, CacheEntry<{ fields: Array<{ code: string; label: string; type: string }> }>>
  schemaCacheByAppKey?: Record<string, CacheEntry<{ columns: Array<{ key: string; label: string; type: string; position?: number }> }>>

  open: (ctx?: { connectorId?: string; tenantId?: string }) => void
  close: () => void
  reset: () => void

  goToSelectingKintoneApp: () => void
  setSelectedKintoneApp: (app: KintoneAppLite) => void
  setSelectedDestinationApp: (app: DestinationAppLite) => void
  setDraftFieldMappings: (m: DraftFieldMapping[]) => void
  setMappingIdDraft: (id: string | null) => void
  next: () => void
  back: () => void

  // cache helpers
  setAppsCache: (payload: { apps: KintoneAppLite[]; total: number; nextOffset?: number }) => void
  getAppsCacheValid: () => CacheEntry<{ apps: KintoneAppLite[]; total: number; nextOffset?: number }> | null
  setFieldsCache: (appId: string, payload: { fields: Array<{ code: string; label: string; type: string }> }) => void
  getFieldsCacheValid: (appId: string) => CacheEntry<{ fields: Array<{ code: string; label: string; type: string }> }> | null
  setSchemaCache: (key: string, payload: { columns: Array<{ key: string; label: string; type: string; position?: number }> }) => void
  getSchemaCacheValid: (key: string) => CacheEntry<{ columns: Array<{ key: string; label: string; type: string; position?: number }> }> | null
}

const TEN_MIN = 10 * 60 * 1000

export const useKintoneWizardStore = create<WizardState>((set, get) => ({
  isOpen: false,
  uiFlowState: "idle",
  selectedKintoneApp: null,
  selectedDestinationApp: null,
  draftFieldMappings: [],
  mappingIdDraft: null,
  fieldsCacheByAppId: {},
  schemaCacheByAppKey: {},

  open: (ctx) => {
    set({ isOpen: true, connectorId: ctx?.connectorId, tenantId: ctx?.tenantId })
    console.log("[FLOW] → selectingKintoneApp")
    set({ uiFlowState: "selectingKintoneApp" })
  },
  close: () => {
    set({ isOpen: false })
  },
  reset: () => {
    set({
      uiFlowState: "idle",
      selectedKintoneApp: null,
      selectedDestinationApp: null,
      draftFieldMappings: [],
      mappingIdDraft: null,
    })
  },

  goToSelectingKintoneApp: () => set({ uiFlowState: "selectingKintoneApp" }),

  setSelectedKintoneApp: (app) => {
    set({ selectedKintoneApp: app })
    console.log(`[FLOW] KintoneSelected appId=${app.id} → selectingDestinationApp`)
    set({ uiFlowState: "selectingDestinationApp" })
  },
  setSelectedDestinationApp: (app) => {
    set({ selectedDestinationApp: app })
    console.log(`[FLOW] DestinationSelected appKey=${app.key} → mappingFields`)
    set({ uiFlowState: "mappingFields" })
  },
  setDraftFieldMappings: (m) => set({ draftFieldMappings: m }),
  setMappingIdDraft: (id) => set({ mappingIdDraft: id }),

  next: () => {
    const state = get().uiFlowState
    if (state === "selectingKintoneApp") set({ uiFlowState: "selectingDestinationApp" })
    else if (state === "selectingDestinationApp") set({ uiFlowState: "mappingFields" })
    else if (state === "mappingFields") set({ uiFlowState: "reviewAndSave" })
    else if (state === "reviewAndSave") set({ uiFlowState: "done" })
  },
  back: () => {
    const state = get().uiFlowState
    if (state === "selectingDestinationApp") set({ uiFlowState: "selectingKintoneApp" })
    else if (state === "mappingFields") set({ uiFlowState: "selectingDestinationApp" })
    else if (state === "reviewAndSave") set({ uiFlowState: "mappingFields" })
  },

  setAppsCache: (payload) => {
    set({
      appsCache: {
        data: payload,
        expiresAt: Date.now() + TEN_MIN,
      },
    })
  },
  getAppsCacheValid: () => {
    const c = get().appsCache
    if (!c) return null
    if (typeof window !== 'undefined') {
      // extend cache per session to avoid flicker on reopen within 10min
    }
    return c.expiresAt > Date.now() ? c : null
  },
  setFieldsCache: (appId, payload) => {
    const current = get().fieldsCacheByAppId
    set({
      fieldsCacheByAppId: {
        ...current,
        [appId]: {
          data: payload,
          expiresAt: Date.now() + TEN_MIN,
        },
      },
    })
  },
  getFieldsCacheValid: (appId) => {
    const c = get().fieldsCacheByAppId[appId]
    if (!c) return null
    return c.expiresAt > Date.now() ? c : null
  },
  setSchemaCache: (key, payload) => {
    const current = get().schemaCacheByAppKey || {}
    set({
      schemaCacheByAppKey: {
        ...current,
        [key]: {
          data: payload,
          expiresAt: Date.now() + TEN_MIN,
        },
      },
    })
  },
  getSchemaCacheValid: (key) => {
    const c = (get().schemaCacheByAppKey || {})[key]
    if (!c) return null
    return c.expiresAt > Date.now() ? c : null
  },
}))


