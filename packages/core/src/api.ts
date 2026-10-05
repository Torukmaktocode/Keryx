import type {
  AiChatRequest,
  AiChatResult,
  AiStatus,
  AppSettings,
  BookInfo,
  Document,
  DocumentMeta,
  Repository,
  Result,
  SearchOptions,
  SearchResult,
  StrongsEntry,
  SwordModule,
  Verse
} from './types'

export interface EngineInfo {
  kind: 'native' | 'local' | 'demo'
  native: boolean
}

export interface CompareColumn {
  module: string
  verses: Verse[]
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
    search(req: SearchOptions): Promise<Result<SearchResult[]>>
    compare(req: {
      book: string
      chapter: number
      modules: string[]
    }): Promise<Result<CompareColumn[]>>
  }
  dict: {
    lookup(req: { module: string; key: string }): Promise<Result<string | null>>
    strongs(key: string): Promise<Result<StrongsEntry | null>>
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
  ai: {
    chat(req: AiChatRequest): Promise<Result<AiChatResult>>
    status(): Promise<Result<AiStatus>>
  }
}
