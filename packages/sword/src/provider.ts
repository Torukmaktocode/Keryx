import type {
  BookInfo,
  ModuleCoverage,
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
  /** Modulos con contenido para la referencia/termino (marcas e-Sword). */
  commentaryCoverage(book: string, chapter: number): Promise<ModuleCoverage[]>
  dictCoverage(term: string): Promise<ModuleCoverage[]>
  /** Guia Exegética: ocurrencias reales de un codigo Strong en la biblia. */
  lookupLemma(module: string, lemma: string): Promise<{ topic: string; definition: string } | null>
  strongsOccurrences(
    code: string,
    limit?: number
  ): Promise<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>>
  search(options: SearchOptions): Promise<SearchResult[]>
  /** Total real de versiculos que cumplen la consulta (sin limite de results). */
  searchCount(options: SearchOptions): Promise<number>
  /** Sugerencias tipograficas (0 tokens) para consultas sin resultados. */
  suggest(
    query: string,
    module: string,
    limit?: number
  ): Promise<Array<{ word: string; score: number }>>
  /** Lote ortografico para el corrector del modo Escritura (0 tokens). */
  checkSpelling(
    module: string,
    words: string[],
    limit?: number
  ): Promise<Array<{ word: string; known: boolean; suggestions: string[] }>>
  lookupDict(module: string, key: string): Promise<string | null>
  /** Indice de temas de un modulo diccionario o libro (e-Sword/Local). */
  dictEntries(module: string, prefix: string, limit?: number): Promise<Array<{ topic: string }>>
  strongs(key: string): Promise<StrongsEntry | null>
}
