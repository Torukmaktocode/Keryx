import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  CANONICAL_BOOKS,
  type BookInfo,
  type ModuleCategory,
  type Repository,
  type SearchOptions,
  type SearchResult,
  type StrongsEntry,
  type SwordModule,
  type Verse
} from '@keryx/core'
import { resolveBook } from '../reference'
import type { SwordProvider } from '../provider'
import { isTextDriver, scanModules, type ModuleConf } from './conf'
import { buildSlotLookup, chapterVerseCount, verseSlot } from './ordinal'
import { RawLdModule, ZLdModule, ZTextModule } from './readers'
import { renderMarkup, stripMarkup } from './markup'
import {
  buildSnippet,
  countMatches,
  inBookScope,
  matchesQuery,
  tokenizeQuery,
  type SearchMatchOptions
} from './search'

/** Orden canonico para el ranking de resultados. */
export const CANONICAL_ORDER = CANONICAL_BOOKS.map((b) => b.code)

const REMOTE_BASE = 'https://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/'
const MODDISP = 'https://www.crosswire.org/sword/modules/ModDisp.jsp?modType='

const REMOTE_CATEGORIES: Array<{ modType: string; category: ModuleCategory }> = [
  { modType: 'Bibles', category: 'Bible' },
  { modType: 'Commentaries', category: 'Commentary' },
  { modType: 'Dictionaries', category: 'Dictionary' },
  { modType: 'Books', category: 'GenBook' },
  { modType: 'Devotionals', category: 'Devotional' }
]

function splitHeading(html: string): { text: string; heading?: string } {
  const match = html.match(/<div class="verse-heading">([\s\S]*?)<\/div>/)
  if (!match) return { text: html }
  const heading = match[1].replace(/<[^>]+>/g, '').trim()
  const text = html.replace(/<div class="verse-heading">[\s\S]*?<\/div>/g, '').trim()
  return { text, heading: heading || undefined }
}

export class LocalSwordProvider implements SwordProvider {
  readonly kind = 'local' as const
  readonly available = true

  private readonly confs = new Map<string, ModuleConf>()
  private readonly textModules = new Map<string, ZTextModule>()
  private readonly ldModules = new Map<string, RawLdModule | ZLdModule>()
  private slotLookup: Map<string, { book: string; chapter: number; verse: number }> | null = null
  private readonly chapterCache = new Map<string, Verse[]>()
  private readonly dictCache = new Map<string, string | null>()
  private readonly searchCache = new Map<string, SearchResult[]>()

  private constructor(private readonly root: string) {}

  static create(root: string): LocalSwordProvider | null {
    if (!existsSync(join(root, 'mods.d'))) return null
    const provider = new LocalSwordProvider(root)
    provider.refresh()
    return provider.confs.size > 0 ? provider : null
  }

  refresh(): void {
    this.confs.clear()
    this.textModules.clear()
    this.ldModules.clear()
    this.chapterCache.clear()
    this.dictCache.clear()
    this.searchCache.clear()
    for (const conf of scanModules(this.root)) this.confs.set(conf.name, conf)
  }

  private textModule(conf: ModuleConf): ZTextModule {
    let module = this.textModules.get(conf.name)
    if (!module) {
      module = new ZTextModule(conf.moduleDir, conf.cipherKey, conf.compressType)
      this.textModules.set(conf.name, module)
    }
    return module
  }

  private ldModule(conf: ModuleConf): RawLdModule | ZLdModule {
    let module = this.ldModules.get(conf.name)
    if (!module) {
      module =
        conf.driver === 'zLD'
          ? new ZLdModule(conf.moduleDir, conf.prefix, conf.cipherKey, conf.compressType)
          : new RawLdModule(conf.moduleDir, conf.prefix, conf.driver === 'RawLD4')
      this.ldModules.set(conf.name, module)
    }
    return module
  }

  private toSwordModule(conf: ModuleConf): SwordModule {
    return {
      name: conf.name,
      description: conf.description,
      category: conf.category,
      lang: conf.lang,
      driver: conf.driver,
      encoding: conf.encoding,
      version: '',
      installed: true,
      source: 'local',
      hasStrongs: conf.hasStrongs,
      cipherKey: Boolean(conf.cipherKey)
    }
  }

  async repositories(): Promise<Repository[]> {
    return [{ name: 'CrossWire', url: REMOTE_BASE, type: 'Master' }]
  }

  async listLocalModules(): Promise<SwordModule[]> {
    return [...this.confs.values()].map((conf) => this.toSwordModule(conf))
  }

  async listRemoteModules(repository = 'CrossWire'): Promise<SwordModule[]> {
    void repository
    const result: SwordModule[] = []
    for (const { modType, category } of REMOTE_CATEGORIES) {
      try {
        const response = await fetch(`${MODDISP}${modType}`)
        const html = await response.text()
        const names = new Set<string>()
        for (const match of html.matchAll(/ModInfo\.jsp\?modName=([A-Za-z0-9_-]+)/g)) names.add(match[1])
        for (const name of names) {
          result.push({
            name,
            description: '',
            category,
            lang: '',
            driver: '',
            encoding: 'UTF-8',
            version: '',
            installed: this.confs.has(name),
            source: 'remote',
            repository
          })
        }
      } catch {
        // red opcional
      }
    }
    return result
  }

  async installModule(name: string): Promise<void> {
    const response = await fetch(`${REMOTE_BASE}${name}.zip`)
    if (!response.ok) throw new Error(`No se pudo descargar ${name} (${response.status})`)
    const buffer = Buffer.from(await response.arrayBuffer())
    const cacheDir = join(this.root, '.cache')
    mkdirSync(cacheDir, { recursive: true })
    const zipPath = join(cacheDir, `${name}.zip`)
    writeFileSync(zipPath, buffer)
    const extract = spawnSync('tar', ['-xf', zipPath, '-C', this.root], { stdio: 'pipe' })
    if (extract.status !== 0) throw new Error(`No se pudo extraer ${name}`)
    this.refresh()
  }

  async uninstallModule(name: string): Promise<void> {
    const conf = this.confs.get(name)
    if (!conf) return
    try {
      rmSync(conf.moduleDir, { recursive: true, force: true })
    } catch {
      // ignora
    }
    try {
      rmSync(join(this.root, 'mods.d', `${name}.conf`), { force: true })
    } catch {
      // ignora
    }
    this.refresh()
  }

  async getBooks(): Promise<BookInfo[]> {
    return CANONICAL_BOOKS
  }

  async getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    const conf = this.confs.get(module)
    if (!conf || !isTextDriver(conf.driver)) return []
    const canonical = resolveBook(book)
    if (!canonical) return []
    const cacheKey = `${module}:${canonical.code}:${chapter}`
    const cached = this.chapterCache.get(cacheKey)
    if (cached) return cached
    const count = chapterVerseCount(canonical.code, chapter)
    const reader = this.textModule(conf)
    const verses: Verse[] = []
    for (let verse = 1; verse <= count; verse++) {
      const slotInfo = verseSlot(canonical.code, chapter, verse)
      if (!slotInfo) continue
      const raw = reader.getVerse(slotInfo.testament, slotInfo.slot)
      if (raw === null || raw === '') continue
      const html = renderMarkup(conf.sourceType, raw)
      const { text, heading } = splitHeading(html)
      verses.push({ book: canonical.code, chapter, verse, text, heading })
    }
    this.chapterCache.set(cacheKey, verses)
    return verses
  }

  async getVerse(
    module: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<Verse | null> {
    const list = await this.getChapter(module, book, chapter)
    return list.find((item) => item.verse === verse) ?? null
  }

  async search(options: SearchOptions): Promise<SearchResult[]> {
    const cacheKey = JSON.stringify(options)
    const cached = this.searchCache.get(cacheKey)
    if (cached) return cached

    const modules = options.modules?.length
      ? options.modules
      : [...this.confs.values()].filter((c) => c.category === 'Bible').map((c) => c.name)
    if (!this.slotLookup) this.slotLookup = buildSlotLookup()
    const lookup = this.slotLookup
    const limit = options.limit ?? 200
    const results: SearchResult[] = []

    const done = (): SearchResult[] => {
      this.searchCache.set(cacheKey, results)
      return results
    }

    // Motor nuevo: tokens AND, tolerancia a acentos, texto limpio y ranking.
    const tokens = tokenizeQuery(options.query)
    if (!tokens.length) return done()
    const matchOptions: SearchMatchOptions = {
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? false
    }

    for (const name of modules) {
      const conf = this.confs.get(name)
      if (!conf) continue
      if (!isTextDriver(conf.driver)) {
        const dict = this.ldModule(conf)
        for (const key of dict.keys()) {
          if (results.length >= limit) return done()
          const raw = dict.getEntry(key)
          if (!raw) continue
          const plain = stripMarkup(conf.sourceType, raw)
          if (!plain) continue
          if (!matchesQuery(plain, tokens, matchOptions)) continue
          if (!inBookScope(key, options.scope)) {
            // Diccionarios no hacen scope AT/NT: filtra por la clave si trae libro.
            continue
          }
          const { snippet: value } = buildSnippet(plain, tokens)
          results.push({
            module: name,
            book: key,
            chapter: 0,
            verse: 0,
            text: value,
            score: countMatches(plain, tokens)
          })
        }
        continue
      }
      const reader = this.textModule(conf)
      for (const testament of [1, 2] as const) {
        for (const { slot, text } of reader.iterateVerses(testament)) {
          if (results.length >= limit) return done()
          if (options.scope === 'ot' && testament !== 1) continue
          if (options.scope === 'nt' && testament !== 2) continue
          const ref = lookup.get(`${testament}:${slot}`)
          if (!ref) continue
          const plain = stripMarkup(conf.sourceType, text)
          if (!plain) continue
          if (!matchesQuery(plain, tokens, matchOptions)) continue
          if (!inBookScope(ref.book, options.scope)) continue
          results.push({
            module: name,
            book: ref.book,
            chapter: ref.chapter,
            verse: ref.verse,
            text: plain,
            score: countMatches(plain, tokens)
          })
        }
      }
    }

    // Ranking: mas coincidencias primero, luego orden canonico.
    const orderOf = (code: string): number => {
      const index = CANONICAL_ORDER.indexOf(code)
      return index < 0 ? Number.MAX_SAFE_INTEGER : index
    }
    results.sort(
      (a, b) =>
        (b.score ?? 0) - (a.score ?? 0) ||
        orderOf(a.book) - orderOf(b.book) ||
        a.chapter - b.chapter ||
        a.verse - b.verse
    )
    return done()
  }

  async getDictKeys(module: string): Promise<string[]> {
    const conf = this.confs.get(module)
    if (!conf || isTextDriver(conf.driver)) return []
    return this.ldModule(conf).keys()
  }

  async lookupDict(module: string, key: string): Promise<string | null> {
    const conf = this.confs.get(module)
    if (!conf || isTextDriver(conf.driver)) return null
    const cacheKey = `${module}:${key}`
    const cached = this.dictCache.get(cacheKey)
    if (cached !== undefined) return cached
    const reader = this.ldModule(conf)
    let entry = reader.getEntry(key)
    if (!entry) {
      const match = /^([GH])0*(\d+)$/i.exec(key.trim())
      if (match) entry = reader.getEntry(match[2].padStart(5, '0'))
    }
    if (!entry) entry = reader.getEntry(key, true)
    const result = entry ? renderMarkup(conf.sourceType, entry) : null
    this.dictCache.set(cacheKey, result)
    return result
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    const normalized = key.trim().toUpperCase()
    const language: StrongsEntry['language'] = normalized.startsWith('G')
      ? 'greek'
      : normalized.startsWith('H')
        ? 'hebrew'
        : 'unknown'
    const candidates = language === 'greek' ? ['StrongsGreek', 'GreekHebrew'] : ['StrongsHebrew', 'HebrewGreek']
    for (const module of candidates) {
      if (!this.confs.has(module)) continue
      const entry = await this.lookupDict(module, normalized)
      if (entry) {
        const plain = stripMarkup('TEI', entry)
        return { key: normalized, definition: plain, language }
      }
    }
    return null
  }
}
