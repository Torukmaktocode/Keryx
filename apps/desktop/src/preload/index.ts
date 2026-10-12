import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '@keryx/core/channels'
import type { KeryxApi } from '@keryx/core/api'

const invoke = <T>(channel: string, ...args: unknown[]): Promise<T> =>
  ipcRenderer.invoke(channel, ...args) as Promise<T>

const api: KeryxApi = {
  app: {
    version: () => invoke(IPC.appVersion),
    platform: () => invoke(IPC.appPlatform),
    engine: () => invoke(IPC.appEngine)
  },
  window: {
    setFullscreen: (value) => invoke(IPC.windowSetFullscreen, { value }),
    isFullscreen: () => invoke(IPC.windowIsFullscreen),
    toggleFullscreen: () => invoke(IPC.windowToggleFullscreen),
    setZoom: (value) => invoke(IPC.windowSetZoom, { value })
  },
  modules: {
    list: () => invoke(IPC.modulesList),
    remote: (repository) => invoke(IPC.modulesRemote, repository),
    refresh: () => invoke(IPC.modulesRefresh),
    install: (input) => invoke(IPC.modulesInstall, input),
    uninstall: (name) => invoke(IPC.modulesUninstall, { name }),
    repositories: () => invoke(IPC.modulesRepositories),
    syncRepositories: () => invoke(IPC.modulesSyncRepos)
  },
  bible: {
    books: (module) => invoke(IPC.bibleBooks, module),
    chapter: (req) => invoke(IPC.bibleChapter, req),
    verse: (req) => invoke(IPC.bibleVerse, req),
    commentaryVerses: (req) => invoke(IPC.bibleCommentaryVerses, req),
    commentaryCoverage: (req) => invoke(IPC.bibleCommentaryCoverage, req),
    search: (req) => invoke(IPC.bibleSearch, req),
    compare: (req) => invoke(IPC.bibleCompare, req),
    strongsOccurrences: (req) => invoke(IPC.bibleStrongsOccurrences, req)
  },
  dict: {
    lookup: (req) => invoke(IPC.dictLookup, req),
    strongs: (key) => invoke(IPC.dictStrongs, key),
    coverage: (req) => invoke(IPC.dictCoverage, req),
    lookupLemma: (req) => invoke(IPC.dictLemma, req)
  },
  documents: {
    list: () => invoke(IPC.documentsList),
    get: (id) => invoke(IPC.documentsGet, { id }),
    create: (input) => invoke(IPC.documentsCreate, input),
    save: (input) => invoke(IPC.documentsSave, input),
    remove: (id) => invoke(IPC.documentsRemove, { id })
  },
  settings: {
    get: () => invoke(IPC.settingsGet),
    set: (patch) => invoke(IPC.settingsSet, patch)
  },
  ai: {
    chat: (req) => invoke(IPC.aiChat, req),
    status: () => invoke(IPC.aiStatus)
  }
}

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('keryx', api)
} else {
  ;(window as unknown as { keryx: KeryxApi }).keryx = api
}
