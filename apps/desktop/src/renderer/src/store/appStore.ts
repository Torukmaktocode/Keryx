import { create } from 'zustand'
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type EngineInfo,
  type SwordModule
} from '@keryx/core'
import { api } from '../lib/api'

export type View =
  | 'reader'
  | 'study'
  | 'search'
  | 'library'
  | 'write'
  | 'templates'
  | 'assistant'
  | 'modules'
  | 'settings'

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
  fullscreen: boolean
  sidebarHidden: boolean
  version: string
  navBook: string
  navChapter: number
  navVerse: number | null
  setView: (view: View) => void
  setSelectedModule: (name: string) => void
  setActiveDocumentId: (id: string | null) => void
  notify: (message: string | null) => void
  setFullscreen: (value: boolean) => void
  toggleFullscreen: () => Promise<void>
  setSidebarHidden: (value: boolean) => void
  toggleSidebar: () => Promise<void>
  setNav: (book: string, chapter: number, verse?: number) => void
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
  fullscreen: false,
  sidebarHidden: false,
  version: '0.1.0',
  navBook: 'John',
  navChapter: 3,
  navVerse: null,

  setView: (view) => set({ view }),
  setSelectedModule: (selectedModule) => set({ selectedModule }),
  setActiveDocumentId: (activeDocumentId) => set({ activeDocumentId }),
  notify: (toast) => set({ toast }),
  setNav: (navBook, navChapter, navVerse) =>
    set({ navBook, navChapter, navVerse: navVerse ?? null }),
  setFullscreen: (fullscreen) => set({ fullscreen }),

  toggleFullscreen: async () => {
    try {
      const value = await api.window.toggleFullscreen()
      set({ fullscreen: value })
    } catch {
      // ignorar: entorno sin control de ventana
    }
  },

  toggleSidebar: async () => {
    const next = !get().sidebarHidden
    set({ sidebarHidden: next })
    try {
      const settings = await api.settings.set({ sidebarHidden: next })
      set({ settings })
    } catch {
      // persistencia opcional
    }
  },

  setSidebarHidden: (value) => set({ sidebarHidden: value }),

  bootstrap: async () => {
    try {
      const [engine, settings, modules, version] = await Promise.all([
        api.engine(),
        api.settings.get(),
        api.modules.list(),
        api.version().catch(() => '0.1.0')
      ])
      const bibleModules = modules.filter((m) => m.category === 'Bible')
      set({
        engine,
        settings,
        modules,
        selectedModule: get().selectedModule || bibleModules[0]?.name || modules[0]?.name || '',
        sidebarHidden: settings.sidebarHidden ?? false,
        version,
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
