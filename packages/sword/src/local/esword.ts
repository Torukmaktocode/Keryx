import { existsSync, readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
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
import { matchesQuery, tokenizeQuery } from './search'
import type { SwordProvider } from '../provider'

const BIBLE_EXT = new Set(['.bblx', '.bbli', '.bbl'])
const DICT_EXT = new Set(['.dctx', '.dcti', '.dct', '.lexi', '.lexx'])
const COMM_EXT = new Set(['.cmtx', '.cmti', '.cmt'])
const DEV_EXT = new Set(['.devx', '.devi', '.dev'])
const TOPIC_EXT = new Set(['.topx', '.topi', '.refx', '.refi', '.top', '.ref'])

function categoryFor(ext: string): ModuleCategory {
  if (BIBLE_EXT.has(ext)) return 'Bible'
  if (DICT_EXT.has(ext)) return 'Dictionary'
  if (COMM_EXT.has(ext)) return 'Commentary'
  if (DEV_EXT.has(ext)) return 'Devotional'
  if (TOPIC_EXT.has(ext)) return 'GenBook'
  return 'Unknown'
}

function stripRtf(input: string): string {
  let text = input
  text = text.replace(/\\u(-?\d+)\s?\??/g, (_, value: string) => {
    const code = ((Number(value) % 65536) + 65536) % 65536
    return String.fromCharCode(code)
  })
  text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  text = text.replace(/\\par[d]?/g, '<br/>')
  text = text.replace(/\{\\\*[^{}]*\}/g, '')
  text = text.replace(/\\[a-zA-Z]+-?\d*\s?/g, '')
  text = text.replace(/[{}]/g, '')
  return text
}

function renderEsword(text: string): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.startsWith('{\\rtf')) return stripRtf(text).trim()
  return text.trim()
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeLike(value: string): string {
  return value.replace(/[%_\\]/g, (m) => `\\${m}`)
}

function snippet(text: string, query: string, radius = 120): string {
  const index = text.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) return text.slice(0, radius * 2)
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + query.length + radius)
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

interface EswordModule {
  name: string
  path: string
  ext: string
  category: ModuleCategory
  description: string
  abbreviation: string
  bookTable: string | null
  dictTable: string | null
  commTable: string | null
}

export class EswordProvider implements SwordProvider {
  readonly kind = 'local' as const
  readonly available = true
  private modules: EswordModule[] = []
  private readonly dbs = new Map<string, DatabaseSync>()

  private constructor(private readonly root: string) {}

  static create(root: string): EswordProvider | null {
    if (!existsSync(root)) return null
    const provider = new EswordProvider(root)
    provider.refresh()
    return provider.modules.length > 0 ? provider : null
  }

  refresh(): void {
    for (const db of this.dbs.values()) {
      try {
        db.close()
      } catch {
        // ignora
      }
    }
    this.dbs.clear()
    this.modules = []
    for (const file of readdirSync(this.root)) {
      const ext = extname(file).toLowerCase()
      const category = categoryFor(ext)
      if (category === 'Unknown') continue
      const path = join(this.root, file)
      try {
        const db = this.open(path)
        const info = this.readDetails(db)
        const tables = this.tables(db)
        const bookTable = tables.find((t) => /^bible$/i.test(t)) ?? null
        const dictTable =
          tables.find((t) => /dict|lexicon/i.test(t)) ??
          (tables.includes('Dictionary') ? 'Dictionary' : null)
        const commTable = tables.find((t) => /comment/i.test(t)) ?? null
        this.modules.push({
          name: basename(file, ext),
          path,
          ext,
          category,
          description: info.description,
          abbreviation: info.abbreviation,
          bookTable,
          dictTable,
          commTable
        })
      } catch {
        // modulo cifrado o invalido
      }
    }
  }

  private open(path: string): DatabaseSync {
    let db = this.dbs.get(path)
    if (!db) {
      db = new DatabaseSync(path, { readOnly: true })
      this.dbs.set(path, db)
    }
    return db
  }

  private tables(db: DatabaseSync): string[] {
    const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{
      name: string
    }>
    return rows.map((row) => row.name)
  }

  private readDetails(db: DatabaseSync): { description: string; abbreviation: string } {
    try {
      const row = db.prepare('SELECT * FROM Details LIMIT 1').get() as
        | Record<string, unknown>
        | undefined
      if (!row) return { description: '', abbreviation: '' }
      const description = String(row.Description ?? row.description ?? '')
      const abbreviation = String(row.Abbreviation ?? row.abbreviation ?? '')
      return { description, abbreviation }
    } catch {
      return { description: '', abbreviation: '' }
    }
  }

  private module(name: string): EswordModule | undefined {
    return this.modules.find((m) => m.name === name)
  }

  private toSwordModule(module: EswordModule): SwordModule {
    return {
      name: module.name,
      description: module.description,
      category: module.category,
      lang: module.name.toLowerCase().startsWith('champlin') ? 'es' : '',
      driver: `e-Sword ${module.ext}`,
      encoding: 'UTF-8',
      version: '',
      installed: true,
      source: 'local',
      hasStrongs: false
    }
  }

  async repositories(): Promise<Repository[]> {
    return []
  }

  async listLocalModules(): Promise<SwordModule[]> {
    return this.modules.map((m) => this.toSwordModule(m))
  }

  async listRemoteModules(): Promise<SwordModule[]> {
    return []
  }

  async installModule(): Promise<void> {
    throw new Error('Instala modulos e-Sword copiandolos a la carpeta esword/')
  }

  async uninstallModule(): Promise<void> {
    throw new Error('No soportado')
  }

  async getBooks(): Promise<BookInfo[]> {
    return CANONICAL_BOOKS
  }

  async getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    const conf = this.module(module)
    const canonical = resolveBook(book)
    if (!conf || !canonical) return []
    const bookNumber = canonical.ordinal
    const db = this.open(conf.path)
    const table = conf.category === 'Commentary' ? conf.commTable : conf.bookTable
    if (!table) return []
    const textColumn = conf.category === 'Commentary' ? 'Comments' : 'Scripture'
    try {
      const rows = db
        .prepare(
          `SELECT Verse AS verse, ${textColumn} AS text FROM ${table} WHERE Book = ? AND Chapter = ? ORDER BY Verse`
        )
        .all(bookNumber, chapter) as Array<{ verse: number; text: string }>
      return rows
        .map((row) => ({
          book: canonical.code,
          chapter,
          verse: row.verse,
          text: renderEsword(row.text ?? '')
        }))
        .filter((verse) => verse.text.length > 0)
    } catch {
      return []
    }
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
    const targets = options.modules?.length
      ? options.modules
      : this.modules.map((m) => m.name)
    const results: SearchResult[] = []
    const limit = options.limit ?? 200
    const like = `%${escapeLike(options.query)}%`
    // El LIKE de SQLite solo pre-filtra (superset); el filtro real es por
    // palabra completa, para que "amor" no empate con "JAMOR" o "Amorrheo".
    const tokens = tokenizeQuery(options.query)
    const matchOptions = {
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? true
    }
    // El LIKE trae un superconjunto; se amplia para que el filtro por palabra
    // completa no agote los candidatos antes de llenar el limite pedido.
    const likeLimit = Math.min(limit * 25, 5000)
    for (const name of targets) {
      const conf = this.module(name)
      if (!conf) continue
      const db = this.open(conf.path)
      try {
        if (conf.category === 'Bible' && conf.bookTable) {
          const rows = db
            .prepare(
              `SELECT Book AS book, Chapter AS chapter, Verse AS verse, Scripture AS text FROM ${conf.bookTable} WHERE Scripture LIKE ? ESCAPE '\\' LIMIT ?`
            )
            .all(like, likeLimit) as Array<{
            book: number
            chapter: number
            verse: number
            text: string
          }>
          for (const row of rows) {
            const plain = stripHtml(renderEsword(row.text ?? ''))
            if (tokens.length && !matchesQuery(plain, tokens, matchOptions)) continue
            const canonical = CANONICAL_BOOKS[row.book - 1]
            results.push({
              module: name,
              book: canonical?.code ?? String(row.book),
              chapter: row.chapter,
              verse: row.verse,
              text: renderEsword(row.text ?? '')
            })
            if (results.length >= limit) return results
          }
        } else if (conf.dictTable) {
          const columns = this.columns(db, conf.dictTable)
          const topicCol = columns.find((c) => /topic|term|word|key/i.test(c)) ?? columns[0]
          const defCol =
            columns.find((c) => /definition|def|meaning|notes|data/i.test(c)) ??
            columns[1] ??
            columns[0]
          const rows = db
            .prepare(
              `SELECT ${topicCol} AS topic, ${defCol} AS text FROM ${conf.dictTable} WHERE ${defCol} LIKE ? ESCAPE '\\' LIMIT ?`
            )
            .all(like, likeLimit) as Array<{ topic: string; text: string }>
          for (const row of rows) {
            const plain = stripHtml(renderEsword(row.text ?? ''))
            if (tokens.length && !matchesQuery(plain, tokens, matchOptions)) continue
            results.push({
              module: name,
              book: String(row.topic ?? ''),
              chapter: 0,
              verse: 0,
              text: snippet(stripHtml(row.text ?? ''), options.query)
            })
            if (results.length >= limit) return results
          }
        }
      } catch {
        // ignora
      }
    }
    return results
  }

  async lookupDict(module: string, key: string): Promise<string | null> {
    const conf = this.module(module)
    if (!conf || !conf.dictTable) return null
    const db = this.open(conf.path)
    const columns = this.columns(db, conf.dictTable)
    const topicCol = columns.find((c) => /topic|term|word|key/i.test(c)) ?? columns[0]
    const defCol =
      columns.find((c) => /definition|def|meaning|notes|data/i.test(c)) ?? columns[1] ?? columns[0]
    try {
      const row = db
        .prepare(
          `SELECT ${defCol} AS text FROM ${conf.dictTable} WHERE ${topicCol} = ? COLLATE NOCASE LIMIT 1`
        )
        .get(key) as { text: string } | undefined
      if (row?.text) return renderEsword(row.text)
      const like = db
        .prepare(
          `SELECT ${defCol} AS text FROM ${conf.dictTable} WHERE ${topicCol} LIKE ? LIMIT 1`
        )
        .get(`${key}%`) as { text: string } | undefined
      return like?.text ? renderEsword(like.text) : null
    } catch {
      return null
    }
  }

  private columns(db: DatabaseSync, table: string): string[] {
    try {
      const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>
      return rows.map((row) => row.name)
    } catch {
      return []
    }
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    for (const name of ['Strongs', 'StrongsPlus', 'Strong']) {
      const entry = await this.lookupDict(name, key)
      if (entry) {
        return {
          key,
          definition: entry.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
          language: key.toUpperCase().startsWith('G') ? 'greek' : 'hebrew'
        }
      }
    }
    return null
  }
}
