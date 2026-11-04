import type {
  AiChatRequest,
  AiChatResult,
  AiStatus,
  AppSettings,
  BookInfo,
  Document,
  DocumentMeta,
  ModuleCoverage,
  Repository,
  Result,
  SearchOptions,
  SearchResult,
  StrongsEntry,
  SwordModule,
  Verse
} from './types'
import type {
  CoalicionItem,
  CoalicionRequest,
  GlosarioPar,
  GlosarioRequest,
  LenguaEstado,
  PresentationSaveInput,
  TranslateBatchInput,
  TranslatePairInput,
  TranslateRequestInput,
  VersoBatchInput
} from './schemas'

export interface EngineInfo {
  kind: 'native' | 'local' | 'demo'
  native: boolean
}

export interface CompareColumn {
  module: string
  verses: Verse[]
}

export interface PresentationSaveResult {
  saved: boolean
  path: string
}

export interface TranslateStatusResult {
  available: boolean
  pairs: string[]
}

export interface KeryxApi {
  app: {
    version(): Promise<Result<string>>
    platform(): Promise<Result<string>>
    engine(): Promise<Result<EngineInfo>>
  }
  window: {
    setFullscreen(value: boolean): Promise<Result<boolean>>
    isFullscreen(): Promise<Result<boolean>>
    toggleFullscreen(): Promise<Result<boolean>>
    setZoom(value: number): Promise<Result<number>>
  }
  modules: {
    list(): Promise<Result<SwordModule[]>>
    remote(repository?: string): Promise<Result<SwordModule[]>>
    refresh(): Promise<Result<SwordModule[]>>
    install(input: { name: string; repository?: string }): Promise<Result<null>>
    uninstall(name: string): Promise<Result<null>>
    repositories(): Promise<Result<Repository[]>>
    syncRepositories(): Promise<Result<Repository[]>>
  }
  bible: {
    books(module?: string): Promise<Result<BookInfo[]>>
    chapter(req: { module: string; book: string; chapter: number }): Promise<Result<Verse[]>>
    verse(req: {
      module: string
      book: string
      chapter: number
      verse: number
    }): Promise<Result<Verse | null>>
    commentaryVerses(req: { module: string; book: string; chapter: number }): Promise<Result<number[]>>
    commentaryCoverage(req: { book: string; chapter: number }): Promise<Result<ModuleCoverage[]>>
    search(req: SearchOptions): Promise<Result<SearchResult[]>>
    searchCount(req: SearchOptions): Promise<Result<number>>
    suggest(req: { query: string; module: string; limit?: number }): Promise<Result<Array<{ word: string; score: number }>>>
    checkSpelling(req: {
      module: string
      words: string[]
      limit?: number
    }): Promise<Result<Array<{ word: string; known: boolean; suggestions: string[] }>>>
    compare(req: {
      book: string
      chapter: number
      modules: string[]
    }): Promise<Result<CompareColumn[]>>
    strongsOccurrences(req: {
      code: string
      limit?: number
    }): Promise<Result<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>>>
  }
  dict: {
    lookup(req: { module: string; key: string }): Promise<Result<string | null>>
    entries(req: { module: string; prefix?: string }): Promise<Result<Array<{ topic: string }>>>
    strongs(key: string): Promise<Result<StrongsEntry | null>>
    coverage(req: { term: string }): Promise<Result<ModuleCoverage[]>>
    lookupLemma(req: { module: string; lemma: string }): Promise<Result<{ topic: string; definition: string } | null>>
  }
  coalicion: {
    buscar(req: CoalicionRequest): Promise<Result<CoalicionItem[]>>
  }
  documents: {
    list(): Promise<Result<DocumentMeta[]>>
    get(id: string): Promise<Result<Document | null>>
    create(input: {
      title: string
      kind: Document['kind']
      content?: string
    }): Promise<Result<Document>>
    save(input: { id: string; content: string; title?: string }): Promise<Result<Document>>
    remove(id: string): Promise<Result<null>>
  }
  settings: {
    get(): Promise<Result<AppSettings>>
    set(patch: Partial<AppSettings>): Promise<Result<AppSettings>>
  }
  presentations: {
    save(input: PresentationSaveInput): Promise<Result<PresentationSaveResult>>
  }
  translate: {
    status(): Promise<Result<TranslateStatusResult>>
    translate(req: TranslateRequestInput): Promise<Result<string>>
    batch(req: TranslateBatchInput): Promise<Result<string[]>>
    install(req: TranslatePairInput): Promise<Result<string[]>>
    verso(req: VersoBatchInput): Promise<Result<{
      versos: Record<string, string | null>
      meta: Record<string, Record<string, string>>
    }>>
    lenguas(): Promise<Result<LenguaEstado[]>>
    glosario(req: GlosarioRequest): Promise<Result<{ lang: string; pares: GlosarioPar[] }>>
  }
  ai: {
    chat(req: AiChatRequest): Promise<Result<AiChatResult>>
    status(): Promise<Result<AiStatus>>
  }
}
