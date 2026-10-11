import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'node:path'
import {
  IPC,
  aiChatSchema,
  chapterRequestSchema,
  coverageRequestSchema,
  dictCoverageSchema,
  compareRequestSchema,
  dictLookupSchema,
  documentCreateSchema,
  documentIdSchema,
  documentSaveSchema,
  fullscreenSchema,
  installModuleSchema,
  searchRequestSchema,
  settingsPatchSchema,
  uninstallModuleSchema,
  verseRequestSchema,
  zoomSchema,
  type CompareColumn,
  type EngineInfo,
  type Result
} from '@keryx/core'
import { SwordService } from '@keryx/sword'
import { JsonStore } from '@keryx/db'
import { aiChat, aiStatus } from './ai'

type Handler = (args: unknown[]) => Promise<unknown> | unknown

function register(channel: string, handler: Handler): void {
  ipcMain.handle(channel, async (_event, ...args: unknown[]): Promise<Result<unknown>> => {
    try {
      const data = await handler(args)
      return { ok: true, data }
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      }
    }
  })
}

export async function registerIpc(
  dataPath?: string,
  eswordPath?: string,
  bibliotecaPath?: string
): Promise<JsonStore | undefined> {
  const store = new JsonStore(join(app.getPath('userData'), 'keryx-store.json'))
  const sword = await SwordService.create(dataPath, eswordPath, bibliotecaPath)

  const currentWindow = (): BrowserWindow | null =>
    BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0] ?? null

  register(IPC.appVersion, () => app.getVersion())
  register(IPC.appPlatform, () => process.platform)
  register(
    IPC.appEngine,
    (): EngineInfo => ({ kind: sword.providerKind, native: sword.usingNative })
  )

  register(IPC.windowSetFullscreen, (args) => {
    const { value } = fullscreenSchema.parse(args[0] ?? {})
    const window = currentWindow()
    if (!window) return false
    window.setFullScreen(Boolean(value))
    return window.isFullScreen()
  })
  register(IPC.windowIsFullscreen, () => currentWindow()?.isFullScreen() ?? false)
  register(IPC.windowToggleFullscreen, () => {
    const window = currentWindow()
    if (!window) return false
    window.setFullScreen(!window.isFullScreen())
    return window.isFullScreen()
  })
  register(IPC.windowSetZoom, (args) => {
    const { value } = zoomSchema.parse(args[0] ?? {})
    const window = currentWindow()
    if (!window) return 1
    const zoom = value ?? 1
    window.webContents.setZoomFactor(zoom)
    return zoom
  })

  register(IPC.modulesList, () => sword.listLocalModules())
  register(IPC.modulesRefresh, () => sword.listLocalModules())
  register(IPC.modulesRemote, (args) => sword.listRemoteModules(args[0] as string | undefined))
  register(IPC.modulesRepositories, () => sword.repositories())
  register(IPC.modulesSyncRepos, () => sword.repositories())
  register(IPC.modulesInstall, async (args) => {
    const input = installModuleSchema.parse(args[0])
    await sword.installModule(input.name, input.repository)
    return null
  })
  register(IPC.modulesUninstall, async (args) => {
    const input = uninstallModuleSchema.parse(args[0])
    await sword.uninstallModule(input.name)
    return null
  })

  register(IPC.bibleBooks, (args) => sword.getBooks(args[0] as string | undefined))
  register(IPC.bibleChapter, (args) => {
    const req = chapterRequestSchema.parse(args[0])
    return sword.getChapter(req.module, req.book, req.chapter)
  })
  register(IPC.bibleVerse, (args) => {
    const req = verseRequestSchema.parse(args[0])
    return sword.getVerse(req.module, req.book, req.chapter, req.verse)
  })
  register(IPC.bibleCommentaryVerses, (args) => {
    const req = chapterRequestSchema.parse(args[0])
    return sword.commentaryVerses(req.module, req.book, req.chapter)
  })
  register(IPC.bibleCommentaryCoverage, (args) => {
    const req = coverageRequestSchema.parse(args[0])
    return sword.commentaryCoverage(req.book, req.chapter)
  })
  register(IPC.bibleSearch, (args) => {
    const req = searchRequestSchema.parse(args[0])
    return sword.search(req)
  })
  register(IPC.bibleCompare, async (args) => {
    const req = compareRequestSchema.parse(args[0])
    const columns: CompareColumn[] = []
    for (const module of req.modules) {
      const verses = await sword.getChapter(module, req.book, req.chapter)
      columns.push({ module, verses })
    }
    return columns
  })

  register(IPC.dictLookup, (args) => {
    const req = dictLookupSchema.parse(args[0])
    return sword.lookupDict(req.module, req.key)
  })
  register(IPC.dictStrongs, (args) => sword.strongs(String(args[0])))
  register(IPC.dictCoverage, (args) => {
    const req = dictCoverageSchema.parse(args[0])
    return sword.dictCoverage(req.term)
  })

  register(IPC.documentsList, () => store.listDocuments())
  register(IPC.documentsGet, (args) => {
    const { id } = documentIdSchema.parse(args[0])
    return store.getDocument(id)
  })
  register(IPC.documentsCreate, (args) => {
    const input = documentCreateSchema.parse(args[0])
    return store.createDocument(input)
  })
  register(IPC.documentsSave, (args) => {
    const input = documentSaveSchema.parse(args[0])
    return store.saveDocument(input.id, input.content, input.title)
  })
  register(IPC.documentsRemove, (args) => {
    const { id } = documentIdSchema.parse(args[0])
    store.removeDocument(id)
    return null
  })

  register(IPC.settingsGet, () => store.getSettings())
  register(IPC.settingsSet, (args) => {
    const patch = settingsPatchSchema.parse(args[0])
    return store.setSettings(patch)
  })

  register(IPC.aiChat, (args) => {
    const req = aiChatSchema.parse(args[0])
    return aiChat(store.getSettings(), req)
  })
  register(IPC.aiStatus, () => aiStatus(store.getSettings()))

  return store
}
