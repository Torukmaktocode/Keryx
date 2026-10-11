import {
  CANONICAL_BOOKS,
  type BookInfo,
  type ModuleCoverage,
  type Repository,
  type SearchOptions,
  type SearchResult,
  type StrongsEntry,
  type SwordModule,
  type Verse
} from '@keryx/core'
import { resolveBook } from './reference'
import type { SwordProvider } from './provider'

const PACKAGE_NAME = 'node-sword-interface'

/**
 * Intenta cargar el binding nativo de SWORD (libsword via node-sword-interface).
 * Si el paquete no esta instalado o no fue recompilado para Electron, devuelve null
 * y la aplicacion continua con el proveedor de demostracion.
 */
export async function tryLoadNativeSword(): Promise<any | null> {
  try {
    const mod: any = await import(/* @vite-ignore */ PACKAGE_NAME)
    return mod?.default ?? mod ?? null
  } catch {
    return null
  }
}

function categoryFromType(type: string): SwordModule['category'] {
  switch (type) {
    case 'Bible':
      return 'Bible'
    case 'Commentary':
      return 'Commentary'
    case 'Lexicon':
      return 'Lexicon'
    default:
      return 'Unknown'
  }
}

/**
 * Envuelve la API de node-sword-interface. La API exacta puede variar entre
 * versiones; por eso todas las llamadas se resuelven de forma defensiva.
 */
export class NativeSwordProvider implements SwordProvider {
  readonly kind = 'native' as const
  readonly available = true

  constructor(private readonly sword: any) {}

  private require(method: string): (...args: any[]) => any {
    const fn = this.sword?.[method]
    if (typeof fn !== 'function') {
      throw new Error(`node-sword-interface no expone ${method}()`)
    }
    return fn.bind(this.sword)
  }

  async repositories(): Promise<Repository[]> {
    const names: string[] = this.require('getRepoNames')()
    return names.map((name) => ({ name, url: '', type: 'Master' as const }))
  }

  async listLocalModules(): Promise<SwordModule[]> {
    const modules: any[] = this.require('getAllLocalModules')('bible')
    return modules.map((m) => this.mapModule(m, 'local'))
  }

  async listRemoteModules(repository = 'CrossWire'): Promise<SwordModule[]> {
    const modules: any[] = this.require('getAllRepoModules')(repository, 'bible')
    return modules.map((m) => this.mapModule(m, 'remote', repository))
  }

  async installModule(name: string, repository = 'CrossWire'): Promise<void> {
    await this.require('installModule')(repository, name)
  }

  async uninstallModule(name: string): Promise<void> {
    await this.require('uninstallModule')(name)
  }

  async getBooks(): Promise<BookInfo[]> {
    return CANONICAL_BOOKS
  }

  async getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    const canonical = resolveBook(book)
    const code = canonical?.code ?? book
    const verses: any[] = this.require('getChapterText')(module, code, chapter)
    return verses.map((v) => ({
      book: code,
      chapter,
      verse: v.verseNr ?? v.verse ?? 0,
      text: v.content ?? v.text ?? ''
    }))
  }

  async getVerse(
    module: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<Verse | null> {
    const chapterVerses = await this.getChapter(module, book, chapter)
    return chapterVerses.find((v) => v.verse === verse) ?? null
  }

  async commentaryVerses(): Promise<number[]> {
    return []
  }

  async commentaryCoverage(): Promise<ModuleCoverage[]> {
    return []
  }

  async dictCoverage(): Promise<ModuleCoverage[]> {
    return []
  }
  async strongsOccurrences(): Promise<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>> {
    return []
  }

  async search(options: SearchOptions): Promise<SearchResult[]> {
    const module = options.modules?.[0] ?? 'KJV'
    const results: any[] = await this.require('getModuleSearchResults')(
      module,
      options.query,
      undefined,
      'multiWord',
      'none',
      options.caseSensitive ?? false
    )
    return results.map((r) => ({
      module,
      book: r.bookCode ?? r.book ?? '',
      chapter: r.chapter ?? 0,
      verse: r.verseNr ?? r.verse ?? 0,
      text: r.content ?? r.text ?? ''
    }))
  }

  async lookupDict(module: string, key: string): Promise<string | null> {
    return this.require('getRawModuleEntry')(module, key, false) ?? null
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    const entry = this.require('getStrongsEntry')(key)
    if (!entry) return null
    return {
      key,
      transliteration: entry.translit,
      definition: entry.definition ?? '',
      language: key.toUpperCase().startsWith('G') ? 'greek' : 'hebrew'
    }
  }

  private mapModule(m: any, source: 'local' | 'remote', repository?: string): SwordModule {
    return {
      name: m.name ?? m.moduleName ?? '',
      description: m.description ?? '',
      category: categoryFromType(m.type ?? 'Bible'),
      lang: m.language ?? m.lang ?? '',
      driver: m.driver ?? 'zText',
      encoding: m.encoding ?? 'UTF-8',
      version: m.version ?? '',
      installed: source === 'local',
      source,
      repository,
      hasStrongs: Boolean(m.hasStrongs)
    }
  }
}

