import type {
  BookInfo,
  Repository,
  SearchOptions,
  SearchResult,
  StrongsEntry,
  SwordModule,
  Verse
} from '@keryx/core'
import type { SwordProvider } from '../provider'

/** Combina varios proveedores (SWORD + e-Sword) en una sola interfaz. */
export class CompositeSwordProvider implements SwordProvider {
  readonly kind = 'local' as const
  readonly available = true

  constructor(private readonly providers: SwordProvider[]) {}

  async repositories(): Promise<Repository[]> {
    const lists = await Promise.all(this.providers.map((p) => p.repositories()))
    return lists.flat()
  }

  async listLocalModules(): Promise<SwordModule[]> {
    const lists = await Promise.all(this.providers.map((p) => p.listLocalModules()))
    return lists.flat().sort((a, b) => a.name.localeCompare(b.name))
  }

  async listRemoteModules(repository?: string): Promise<SwordModule[]> {
    const lists = await Promise.all(this.providers.map((p) => p.listRemoteModules(repository)))
    return lists.flat()
  }

  async installModule(name: string, repository?: string): Promise<void> {
    for (const provider of this.providers) {
      try {
        await provider.installModule(name, repository)
        return
      } catch {
        // prueba el siguiente
      }
    }
    throw new Error(`No se pudo instalar ${name}`)
  }

  async uninstallModule(name: string): Promise<void> {
    for (const provider of this.providers) {
      try {
        await provider.uninstallModule(name)
        return
      } catch {
        // prueba el siguiente
      }
    }
  }

  async getBooks(module?: string): Promise<BookInfo[]> {
    for (const provider of this.providers) {
      const books = await provider.getBooks(module ?? '')
      if (books.length) return books
    }
    return []
  }

  async getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    for (const provider of this.providers) {
      const verses = await provider.getChapter(module, book, chapter)
      if (verses.length) return verses
    }
    return []
  }

  async getVerse(
    module: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<Verse | null> {
    for (const provider of this.providers) {
      const found = await provider.getVerse(module, book, chapter, verse)
      if (found) return found
    }
    return null
  }

  async commentaryVerses(module: string, book: string, chapter: number): Promise<number[]> {
    const lists = await Promise.all(this.providers.map((p) => p.commentaryVerses(module, book, chapter)))
    return [...new Set(lists.flat())].sort((a, b) => a - b)
  }

  async search(options: SearchOptions): Promise<SearchResult[]> {
    const results: SearchResult[] = []
    for (const provider of this.providers) {
      results.push(...(await provider.search(options)))
    }
    return results.slice(0, options.limit ?? 200)
  }

  async lookupDict(module: string, key: string): Promise<string | null> {
    for (const provider of this.providers) {
      const entry = await provider.lookupDict(module, key)
      if (entry) return entry
    }
    return null
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    for (const provider of this.providers) {
      const entry = await provider.strongs(key)
      if (entry) return entry
    }
    return null
  }
}
