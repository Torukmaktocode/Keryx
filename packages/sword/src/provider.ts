import type {
  BookInfo,
  Repository,
  SearchOptions,
  SearchResult,
  StrongsEntry,
  SwordModule,
  Verse
} from '@keryx/core'

export interface SwordProvider {
  readonly kind: 'native' | 'local' | 'demo'
  readonly available: boolean
  repositories(): Promise<Repository[]>
  listLocalModules(): Promise<SwordModule[]>
  listRemoteModules(repository?: string): Promise<SwordModule[]>
  installModule(name: string, repository?: string): Promise<void>
  uninstallModule(name: string): Promise<void>
  getBooks(module: string): Promise<BookInfo[]>
  getChapter(module: string, book: string, chapter: number): Promise<Verse[]>
  getVerse(module: string, book: string, chapter: number, verse: number): Promise<Verse | null>
  commentaryVerses(module: string, book: string, chapter: number): Promise<number[]>
  search(options: SearchOptions): Promise<SearchResult[]>
  lookupDict(module: string, key: string): Promise<string | null>
  strongs(key: string): Promise<StrongsEntry | null>
}
