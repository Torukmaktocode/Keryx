import type {
  AiChatRequest,
  AiChatResult,
  AiStatus,
  AppSettings,
  Document,
  ModuleCoverage,
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
    commentaryCoverage: (req: { book: string; chapter: number }): Promise<ModuleCoverage[]> =>
      unwrap(raw.bible.commentaryCoverage(req)),
    search: (req: SearchOptions) => unwrap(raw.bible.search(req)),
    searchCount: (req: SearchOptions): Promise<number> => unwrap(raw.bible.searchCount(req)),
    suggest: (req: { query: string; module: string; limit?: number }): Promise<Array<{ word: string; score: number }>> =>
      unwrap(raw.bible.suggest(req)),
    checkSpelling: (
      req: { module: string; words: string[]; limit?: number }
    ): Promise<Array<{ word: string; known: boolean; suggestions: string[] }>> =>
      unwrap(raw.bible.checkSpelling(req)),
    compare: (req: {
      book: string
      chapter: number
      modules: string[]
    }): Promise<CompareColumn[]> => unwrap(raw.bible.compare(req)),
    strongsOccurrences: (req: { code: string; limit?: number }) =>
      unwrap<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>>(
        raw.bible.strongsOccurrences(req)
      )
  },
  dict: {
    lookup: (req: { module: string; key: string }): Promise<string | null> =>
      unwrap(raw.dict.lookup(req)),
    entries: (req: { module: string; prefix?: string }): Promise<Array<{ topic: string }>> =>
      unwrap(raw.dict.entries(req)),
    strongs: (key: string): Promise<StrongsEntry | null> => unwrap(raw.dict.strongs(key)),
    coverage: (req: { term: string }): Promise<ModuleCoverage[]> => unwrap(raw.dict.coverage(req)),
    lookupLemma: (req: { module: string; lemma: string }) =>
      unwrap<{ topic: string; definition: string } | null>(raw.dict.lookupLemma(req))
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
  presentations: {
    save: (input: { name: string; base64: string }): Promise<{ saved: boolean; path: string }> =>
      unwrap(raw.presentations.save(input))
  },
  translate: {
    status: (): Promise<{ available: boolean; pairs: string[] }> => unwrap(raw.translate.status()),
    translate: (req: { source: string; target: string; text: string }): Promise<string> =>
      unwrap(raw.translate.translate(req)),
    batch: (req: { source: string; target: string; items: string[] }): Promise<string[]> =>
      unwrap(raw.translate.batch(req)),
    install: (req: { source: string; target: string }): Promise<string[]> =>
      unwrap(raw.translate.install(req)),
    verso: (
      req: { items: Array<{ lang: string; code: string; cap: number; ver: number }> }
    ): Promise<{ versos: Record<string, string | null>; meta: Record<string, Record<string, string>> }> =>
      unwrap(raw.translate.verso(req))
  },
  ai: {
    chat: (req: AiChatRequest): Promise<AiChatResult> => unwrap(raw.ai.chat(req)),
    status: (): Promise<AiStatus> => unwrap(raw.ai.status())
  }
}
