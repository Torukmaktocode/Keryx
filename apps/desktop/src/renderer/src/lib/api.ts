import type {
  AiChatRequest,
  AiChatResult,
  AiStatus,
  AppSettings,
  Document,
  Result,
  SearchOptions,
  Verse,
  CompareColumn,
  BookInfo,
  EngineInfo,
  Repository,
  StrongsEntry,
  SwordModule,
  DocumentMeta
} from '@keryx/core'

async function unwrap<T>(promise: Promise<Result<T>>): Promise<T> {
  const result = await promise
  if (!result.ok) {
    throw new Error(result.error ?? 'Error desconocido')
  }
  return result.data as T
}

const raw = window.keryx

export const api = {
  engine: (): Promise<EngineInfo> => unwrap(raw.app.engine()),
  version: (): Promise<string> => unwrap(raw.app.version()),
  platform: (): Promise<string> => unwrap(raw.app.platform()),
  window: {
    setFullscreen: (value: boolean): Promise<boolean> => unwrap(raw.window.setFullscreen(value)),
    isFullscreen: (): Promise<boolean> => unwrap(raw.window.isFullscreen()),
    toggleFullscreen: (): Promise<boolean> => unwrap(raw.window.toggleFullscreen()),
    setZoom: (value: number): Promise<number> => unwrap(raw.window.setZoom(value))
  },
  modules: {
    list: (): Promise<SwordModule[]> => unwrap(raw.modules.list()),
    remote: (repository?: string): Promise<SwordModule[]> => unwrap(raw.modules.remote(repository)),
    install: (input: { name: string; repository?: string }): Promise<null> =>
      unwrap(raw.modules.install(input)),
    uninstall: (name: string): Promise<null> => unwrap(raw.modules.uninstall(name)),
    repositories: (): Promise<Repository[]> => unwrap(raw.modules.repositories())
  },
  bible: {
    books: (module?: string): Promise<BookInfo[]> => unwrap(raw.bible.books(module)),
    chapter: (req: { module: string; book: string; chapter: number }): Promise<Verse[]> =>
      unwrap(raw.bible.chapter(req)),
    verse: (req: {
      module: string
      book: string
      chapter: number
      verse: number
    }): Promise<Verse | null> => unwrap(raw.bible.verse(req)),
    commentaryVerses: (req: {
      module: string
      book: string
      chapter: number
    }): Promise<number[]> => unwrap(raw.bible.commentaryVerses(req)),
    search: (req: SearchOptions) => unwrap(raw.bible.search(req)),
    compare: (req: {
      book: string
      chapter: number
      modules: string[]
    }): Promise<CompareColumn[]> => unwrap(raw.bible.compare(req))
  },
  dict: {
    lookup: (req: { module: string; key: string }): Promise<string | null> =>
      unwrap(raw.dict.lookup(req)),
    strongs: (key: string): Promise<StrongsEntry | null> => unwrap(raw.dict.strongs(key))
  },
  documents: {
    list: (): Promise<DocumentMeta[]> => unwrap(raw.documents.list()),
    get: (id: string): Promise<Document | null> => unwrap(raw.documents.get(id)),
    create: (input: {
      title: string
      kind: Document['kind']
      content?: string
    }): Promise<Document> => unwrap(raw.documents.create(input)),
    save: (input: { id: string; content: string; title?: string }): Promise<Document> =>
      unwrap(raw.documents.save(input)),
    remove: (id: string): Promise<null> => unwrap(raw.documents.remove(id))
  },
  settings: {
    get: (): Promise<AppSettings> => unwrap(raw.settings.get()),
    set: (patch: Partial<AppSettings>): Promise<AppSettings> => unwrap(raw.settings.set(patch))
  },
  ai: {
    chat: (req: AiChatRequest): Promise<AiChatResult> => unwrap(raw.ai.chat(req)),
    status: (): Promise<AiStatus> => unwrap(raw.ai.status())
  }
}
