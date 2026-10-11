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
import { DEMO_CHAPTERS, DEMO_DICTIONARY, DEMO_LOCAL_MODULES, DEMO_REMOTE_MODULES } from './demo-data'

function toSwordModule(
  mod: (typeof DEMO_LOCAL_MODULES)[number],
  source: 'local' | 'remote',
  repository?: string
): SwordModule {
  return {
    name: mod.name,
    description: mod.description,
    category: mod.category,
    lang: mod.lang,
    driver: 'zText',
    encoding: 'UTF-8',
    version: '1.0',
    installed: source === 'local',
    source,
    repository,
    hasStrongs: mod.hasStrongs
  }
}

export class DemoSwordProvider implements SwordProvider {
  readonly kind = 'demo' as const
  readonly available = true
  private installed = new Set(DEMO_LOCAL_MODULES.map((m) => m.name))

  async repositories(): Promise<Repository[]> {
    return [
      { name: 'CrossWire', url: 'https://www.crosswire.org/sword', type: 'Master', lastUpdated: new Date().toISOString() },
      { name: 'eBible.org', url: 'https://ebible.org/Sword', type: 'Remote', lastUpdated: new Date().toISOString() },
      { name: 'STEP Bible', url: 'https://ftp.stepbible.org/pub/sword', type: 'Remote', lastUpdated: new Date().toISOString() }
    ]
  }

  async listLocalModules(): Promise<SwordModule[]> {
    return DEMO_LOCAL_MODULES.filter((m) => this.installed.has(m.name)).map((m) =>
      toSwordModule(m, 'local')
    )
  }

  async listRemoteModules(repository = 'CrossWire'): Promise<SwordModule[]> {
    return DEMO_REMOTE_MODULES.map((m) => toSwordModule(m, 'remote', repository))
  }

  async installModule(name: string): Promise<void> {
    this.installed.add(name)
  }

  async uninstallModule(name: string): Promise<void> {
    this.installed.delete(name)
  }

  async getBooks(): Promise<BookInfo[]> {
    return CANONICAL_BOOKS
  }

  async getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    const canonical = resolveBook(book)
    const code = canonical?.code ?? book
    return DEMO_CHAPTERS[`${module}:${code}:${chapter}`] ?? []
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
    const needle = options.caseSensitive ? options.query : options.query.toLowerCase()
    const wholeWord = options.wholeWord ?? true
    const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const results: SearchResult[] = []
    const modules = options.modules?.length ? options.modules : ['KJV', 'RVR1909']
    for (const [key, verses] of Object.entries(DEMO_CHAPTERS)) {
      const [module, book, chapterStr] = key.split(':')
      if (!modules.includes(module)) continue
      for (const verse of verses) {
        const haystack = options.caseSensitive ? verse.text : verse.text.toLowerCase()
        const matches = wholeWord
          ? new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`, 'u').test(haystack)
          : haystack.includes(needle)
        if (matches) {
          results.push({
            module,
            book,
            chapter: Number(chapterStr),
            verse: verse.verse,
            text: verse.text
          })
        }
      }
    }
    return results.slice(0, options.limit ?? 100)
  }

  async lookupDict(module: string, key: string): Promise<string | null> {
    const dict = DEMO_DICTIONARY[module]
    if (!dict) return null
    return dict[key.toUpperCase()] ?? null
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    const normalized = key.toUpperCase()
    const language: StrongsEntry['language'] = normalized.startsWith('G')
      ? 'greek'
      : normalized.startsWith('H')
        ? 'hebrew'
        : 'unknown'
    const module = language === 'greek' ? 'StrongsGreek' : 'StrongsHebrew'
    const definition = await this.lookupDict(module, normalized)
    if (!definition) return null
    const [translit, rest] = definition.split(' (')
    return {
      key: normalized,
      transliteration: translit,
      definition: rest ? rest.replace(/\): /, ': ') : definition,
      language
    }
  }
}

