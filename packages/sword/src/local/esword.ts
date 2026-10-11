import { existsSync, readdirSync, statSync } from 'node:fs'
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

interface EswordRoot {
  path: string
  library: 'principal' | 'biblioteca'
}

interface EswordModule {
  name: string
  path: string
  ext: string
  category: ModuleCategory
  description: string
  abbreviation: string
  lang: string
  library: 'principal' | 'biblioteca'
  bookTable: string | null
  dictTable: string | null
  commTable: string | null
  commVerse: string | null
  commChapter: string | null
  commBook: string | null
}

/** Normaliza el campo Language de Details a codigo iso (es/pt/en) o ''. */
function normalizeLang(raw: string): string {
  const token = raw.trim().toLowerCase().split(/[\s,-]/)[0] ?? ''
  if (['es', 'spanish', 'castellano', 'espanol', 'español'].includes(token)) return 'es'
  if (['pt', 'portuguese', 'portuguesa', 'português', 'portugues'].includes(token)) return 'pt'
  if (['en', 'english', 'ingles', 'inglés'].includes(token)) return 'en'
  return ''
}

/**
 * Recorre la raiz_ (y subcarpetas hasta `depth`) recogiendo archivos con
 * extension de modulo e-Sword. depth 0 = carpeta plana.
 */
function collectFiles(root: string, depth: number): string[] {
  const out: string[] = []
  const walk = (dir: string, level: number): void => {
    let entries: string[] = []
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const name of entries) {
      if (name.startsWith('.') || name === '__MACOSX') continue
      const path = join(dir, name)
      try {
        if (statSync(path).isDirectory()) {
          if (level < depth) walk(path, level + 1)
        } else if (categoryFor(extname(path).toLowerCase()) !== 'Unknown') {
          out.push(path)
        }
      } catch {
        // omite archivos bloqueados
      }
    }
  }
  walk(root, 0)
  return out
}

export class EswordProvider implements SwordProvider {
  readonly kind = 'local' as const
  readonly available = true
  private modules: EswordModule[] = []
  private readonly dbs = new Map<string, DatabaseSync>()

  private constructor(private readonly roots: EswordRoot[]) {}

  /** Crea el proveedor con raiz principal (esword/) y raices extra (biblioteca/...). */
  static create(root: string, extraRoots: string[] = []): EswordProvider | null {
    const roots: EswordRoot[] = []
    if (existsSync(root)) roots.push({ path: root, library: 'principal' })
    for (const extra of extraRoots) {
      if (existsSync(extra)) roots.push({ path: extra, library: 'biblioteca' })
    }
    if (!roots.length) return null
    const provider = new EswordProvider(roots)
    provider.refresh()
    return provider.modules.length > 0 ? provider : null
  }

  /** Cierra las conexiones SQLite abiertas (uso al refrescar o apagar). */
  dispose(): void {
    for (const db of this.dbs.values()) {
      try {
        db.close()
      } catch {
        // ignora
      }
    }
    this.dbs.clear()
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
    const seen = new Set<string>()
    for (const root of this.roots) {
      // principal = carpeta plana; biblioteca = recursivo a 2 niveles
      const depth = root.library === 'principal' ? 0 : 2
      for (const path of collectFiles(root.path, depth)) {
        const ext = extname(path).toLowerCase()
        // sin duplicados por nombre de modulo (name != filename) en varias raices
        const key = basename(path, ext).toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        try {
          const db = this.open(path)
          const info = this.readDetails(db)
          const tables = this.tables(db)
          const bookTable = tables.find((t) => /^bible$/i.test(t)) ?? null
          // diccionario: tablas de contenido (evita tablas de indice)
          const contentTables = tables.filter((t) => !/index/i.test(t))
          const dictTable =
            contentTables.find((t) => /dict|lexicon/i.test(t)) ??
            contentTables.find(
              (t) => /topical|reference|article|gbook|\bbook\b/i.test(t) && !/^bible$/i.test(t)
            ) ??
            (tables.includes('Dictionary') ? 'Dictionary' : null)
          // comentario e-Sword 2009: Verse/Chapter/Book Commentary
          const commVerse = tables.find((t) => /^versecommentary$/i.test(t)) ?? null
          const commChapter = tables.find((t) => /^chaptercommentary$/i.test(t)) ?? null
          const commBook = tables.find((t) => /^bookcommentary$/i.test(t)) ?? null
          const commTable =
            commVerse ?? commChapter ?? commBook ?? (contentTables.find((t) => /comment/i.test(t)) ?? null)
          this.modules.push({
            name: basename(path, ext),
            path,
            ext,
            category: categoryFor(ext),
            description: info.description,
            abbreviation: info.abbreviation,
            lang: info.language,
            library: root.library,
            bookTable,
            dictTable,
            commTable,
            commVerse,
            commChapter,
            commBook
          })
        } catch {
          // modulo cifrado o invalido
        }
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

  private readDetails(db: DatabaseSync): {
    description: string
    abbreviation: string
    language: string
  } {
    try {
      const row = db.prepare('SELECT * FROM Details LIMIT 1').get() as
        | Record<string, unknown>
        | undefined
      if (!row) return { description: '', abbreviation: '', language: '' }
      const description = String(row.Description ?? row.description ?? '')
      const abbreviation = String(row.Abbreviation ?? row.abbreviation ?? '')
      const language = normalizeLang(String(row.Language ?? row.language ?? ''))
      return { description, abbreviation, language }
    } catch {
      return { description: '', abbreviation: '', language: '' }
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
      lang: module.lang,
      driver: `e-Sword ${module.ext}`,
      encoding: 'UTF-8',
      version: '',
      installed: true,
      source: 'local',
      library: module.library,
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
    throw new Error('Instala modulos e-Sword copiandolos a esword/ o dentro de biblioteca/')
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
    if (conf.category === 'Commentary') {
      return this.readCommentary(conf, canonical.code, canonical.ordinal, chapter)
    }
    if (!conf.bookTable) return []
    const bookNumber = canonical.ordinal
    const db = this.open(conf.path)
    try {
      const rows = db
        .prepare(
          `SELECT Verse AS verse, Scripture AS text FROM ${conf.bookTable} WHERE Book = ? AND Chapter = ? ORDER BY Verse`
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

  /**
   * Lee la entrada de comentario para los versiculos de un capitulo. Los
   * comentarios e-Sword usan rangos (ChapterBegin/VerseBegin..ChapterEnd/VerseEnd)
   * y niveles adicionales (comentario de capitulo y de libro).
   */
  private readCommentary(
    conf: EswordModule,
    code: string,
    ordinal: number,
    chapter: number
  ): Verse[] {
    const db = this.open(conf.path)
    const out: Verse[] = []
    try {
      if (conf.commVerse) {
        const rows = db
          .prepare(
            `SELECT ChapterBegin AS cb, VerseBegin AS vb, ChapterEnd AS ce, VerseEnd AS ve, Comments AS text` +
              ` FROM ${conf.commVerse} WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ? ORDER BY VerseBegin`
          )
          .all(ordinal, chapter, chapter) as Array<{
          cb: number
          vb: number
          ce: number
          ve: number
          text: string
        }>
        for (const row of rows) {
          const start = row.cb < chapter ? 1 : row.vb
          const end = row.ce > chapter ? 999 : row.ve
          const text = renderEsword(row.text ?? '')
          if (!text) continue
          for (let v = start; v <= end; v++) out.push({ book: code, chapter, verse: v, text })
        }
      }
      const intro = this.readCommentaryIntro(conf, code, ordinal, chapter)
      if (intro) out.unshift(...intro)
    } catch {
      // se devuelve lo que haya
    }
    return out
  }

  /** Comentarios de capitulo (verse 0) y de libro (verse 0). */
  private readCommentaryIntro(
    conf: EswordModule,
    code: string,
    ordinal: number,
    chapter: number
  ): Verse[] {
    if (!conf.commChapter && !conf.commBook) return []
    const db = this.open(conf.path)
    const parts: string[] = []
    try {
      if (conf.commBook) {
        const book = db
          .prepare(`SELECT Comments AS text FROM ${conf.commBook} WHERE Book = ?`)
          .get(ordinal) as { text: string } | undefined
        if (book?.text) parts.push(renderEsword(book.text))
      }
      if (conf.commChapter) {
        const chapterComment = db
          .prepare(
            `SELECT Comments AS text FROM ${conf.commChapter} WHERE Book = ? AND Chapter = ?`
          )
          .get(ordinal, chapter) as { text: string } | undefined
        if (chapterComment?.text) parts.push(renderEsword(chapterComment.text))
      }
    } catch {
      // ignora
    }
    return parts.map((text) => ({ book: code, chapter: 0, verse: 0, text }))
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

  /** Versiculos del capitulo que tienen entrada en el comentario (.cmtx/.cmti). */
  async commentaryVerses(module: string, book: string, chapter: number): Promise<number[]> {
    const conf = this.module(module)
    const canonical = resolveBook(book)
    if (!conf || !canonical || conf.category !== 'Commentary') return []
    const db = this.open(conf.path)
    const found = new Set<number>()
    try {
      if (conf.commVerse) {
        const rows = db
          .prepare(
            `SELECT ChapterBegin AS cb, VerseBegin AS vb, ChapterEnd AS ce, VerseEnd AS ve` +
              ` FROM ${conf.commVerse} WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ?`
          )
          .all(canonical.ordinal, chapter, chapter) as Array<{
          cb: number
          vb: number
          ce: number
          ve: number
        }>
        for (const row of rows) {
          const start = row.cb < chapter ? 1 : row.vb
          const end = row.ce > chapter ? 250 : row.ve
          for (let v = start; v <= end && v - start < 200; v++) found.add(v)
        }
      }
      if (conf.commChapter) {
        const exists = db
          .prepare(`SELECT 1 FROM ${conf.commChapter} WHERE Book = ? AND Chapter = ?`)
          .get(canonical.ordinal, chapter)
        if (exists) found.add(0)
      }
      if (conf.commBook) {
        const exists = db
          .prepare(`SELECT 1 FROM ${conf.commBook} WHERE Book = ?`)
          .get(canonical.ordinal)
        if (exists) found.add(0)
      }
    } catch {
      // ignora
    }
    return [...found].sort((a, b) => a - b)
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
        } else if (conf.category === 'Commentary' && conf.commVerse) {
          const rows = db
            .prepare(
              `SELECT Book AS book, ChapterBegin AS chapter, VerseBegin AS verse, Comments AS text` +
                ` FROM ${conf.commVerse} WHERE Comments LIKE ? ESCAPE '\\' LIMIT ?`
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
              text: snippet(stripHtml(row.text ?? ''), options.query)
            })
            if (results.length >= limit) return results
          }
        } else if (conf.dictTable) {
          const columns = this.columns(db, conf.dictTable)
          const topicCol = columns.find((c) => /topic|term|word|key|title/i.test(c)) ?? columns[0]
          const defCol =
            columns.find((c) => /definition|def\b|meaning|notes|data|content|body|text/i.test(c)) ??
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
    const topicCol = columns.find((c) => /topic|term|word|key|title/i.test(c)) ?? columns[0]
    const defCol =
      columns.find((c) => /definition|def\b|meaning|notes|data|content|body|text/i.test(c)) ??
      columns[1] ??
      columns[0]
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
