import { create } from 'zustand'
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type EngineInfo,
  type SwordModule
} from '@keryx/core'
import { api } from '../lib/api'

export type View = 'reader' | 'study' | 'library' | 'write' | 'templates' | 'modules' | 'settings'

interface AppState {
  view: View
  ready: boolean
  error: string | null
  engine: EngineInfo | null
  settings: AppSettings
  modules: SwordModule[]
  selectedModule: string
  activeDocumentId: string | null
  toast: string | null
  setView: (view: View) => void
  setSelectedModule: (name: string) => void
  setActiveDocumentId: (id: string | null) => void
  notify: (message: string | null) => void
  bootstrap: () => Promise<void>
  refreshModules: () => Promise<void>
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  togglePriority: (name: string) => Promise<void>
  sendToWriting: (block: string, title?: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  view: 'reader',
  ready: false,
  error: null,
  engine: null,
  settings: DEFAULT_SETTINGS,
  modules: [],
  selectedModule: '',
  activeDocumentId: null,
  toast: null,

  setView: (view) => set({ view }),
  setSelectedModule: (selectedModule) => set({ selectedModule }),
  setActiveDocumentId: (activeDocumentId) => set({ activeDocumentId }),
  notify: (toast) => set({ toast }),

  bootstrap: async () => {
    try {
      const [engine, settings, modules] = await Promise.all([
        api.engine(),
        api.settings.get(),
        api.modules.list()
      ])
      const bibleModules = modules.filter((m) => m.category === 'Bible')
      set({
        engine,
        settings,
        modules,
        selectedModule: get().selectedModule || bibleModules[0]?.name || modules[0]?.name || '',
        ready: true
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : String(error),
        ready: true
      })
    }
  },

  refreshModules: async () => {
    const modules = await api.modules.list()
    set({ modules })
  },

  updateSettings: async (patch) => {
    const settings = await api.settings.set(patch)
    set({ settings })
  },

  togglePriority: async (name) => {
    const current = get().settings.priorityModules
    const next = current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]
    const settings = await api.settings.set({ priorityModules: next })
    set({ settings })
  },

  sendToWriting: async (block, title = 'Estudio') => {
    const id = get().activeDocumentId
    if (id) {
      const doc = await api.documents.get(id)
      if (doc) {
        await api.documents.save({ id, content: `${doc.content}\n\n${block}` })
        set({ view: 'write' })
        get().notify('Enviado al editor')
        return
      }
    }
    const doc = await api.documents.create({ title, kind: 'study', content: block })
    set({ activeDocumentId: doc.id, view: 'write' })
    get().notify('Enviado al editor')
  }
}))
