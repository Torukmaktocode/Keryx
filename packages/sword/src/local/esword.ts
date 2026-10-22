import { existsSync, readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import {
  CANONICAL_BOOKS,
  type BookInfo,
  type ModuleCategory,
  type ModuleCoverage,
  type Repository,
  type SearchOptions,
  type SearchResult,
  type StrongsEntry,
  type SwordModule,
  type Verse
} from '@keryx/core'
import { resolveBook } from '../reference'
import { accentGlob, matchesQuery, normalizeText, suggestWords, tokenizeQuery } from './search'
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

/** Quita bloques de estilos/scripts y data-URIs (basura de Word y de imagenes). */
function sinEstilos(html: string): string {
  return (html ?? '')
    .replace(/src="data:[^"]*"/gi, ' ')
    .replace(/src='data:[^']*'/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
}

/** Extrae el idioma del atributo lang="es-ES" que e-Sword deja en el HTML. */
function langDeHtml(html: string): string {
  const match = /lang=["']([a-z]{2})(?:-[A-Za-z]{2,4})?["']/i.exec(sinEstilos(html ?? ''))
  if (!match) return ''
  const code = match[1].toLowerCase()
  return code === 'es' || code === 'pt' || code === 'en' ? code : ''
}

const STOPWORDS: Record<string, Set<string>> = {
  es: new Set([
    'que', 'de', 'la', 'los', 'las', 'el', 'y', 'en', 'un', 'una', 'con', 'para', 'por', 'su',
    'lo', 'es', 'son', 'del', 'se', 'no', 'mas', 'pero', 'como', 'dijo', 'todos', 'al', 'este',
    'esta', 'sus', 'hijo', 'dios', 'jesus', 'sera', 'fue', 'han', 'todo', 'cual', 'aquel'
  ]),
  en: new Set([
    'the', 'and', 'of', 'to', 'in', 'that', 'is', 'was', 'for', 'with', 'his', 'her', 'they',
    'not', 'but', 'are', 'have', 'this', 'from', 'which', 'their', 'said', 'shall', 'unto',
    'them', 'thee', 'thou', 'hath', 'thy', 'were', 'been', 'will', 'who', 'all'
  ]),
  pt: new Set([
    'que', 'de', 'não', 'nao', 'uma', 'com', 'por', 'dos', 'das', 'para', 'seu', 'são', 'sao',
    'mais', 'como', 'mas', 'ao', 'ele', 'isso', 'também', 'tambem', 'muito', 'pelo', 'pela',
    'até', 'ate', 'quando', 'e', 'os', 'as', 'em', 'ser', 'foi', 'sua', 'seus', 'lhe'
  ])
}

const TRANSLIT = new Set([
  'kai', 'theos', 'theou', 'kyrios', 'kyriou', 'autos', 'autou', 'oun', 'gar', 'hoti', 'eis',
  'panta', 'panton', 'yehovah', 'elohim', 'yisrael', 'asher', 'dabar', 'hayah', 'elohai'
])

/**
 * Detecta el idioma (es/pt/en o '') por evidencia lexical: stopwords y marcas
 * ortograficas. Determinista, 0 tokens; umbral minimo para no inventar. Texto
 * griego/hebreo transliterado (Strong, interlineales) devuelve ''.
 */
export function detectarIdiomaTexto(text: string): string {
  const words = (text ?? '')
    .toLowerCase()
    .match(/[a-záéíóúñüãõçâêôà¿¡]+/g)
  if (!words?.length) return ''
  const translit = words.filter((w) => TRANSLIT.has(w)).length
  if (translit >= 5) return ''
  const latinRatio = (text.match(/[a-záéíóúñüãõçâêôà¿¡]/gi) ?? []).length / Math.max(1, text.length)
  if (latinRatio < 0.3) return ''
  const scores = { es: 0, en: 0, pt: 0 }
  for (const word of words) {
    if (STOPWORDS.es.has(word)) scores.es += 1
    if (STOPWORDS.en.has(word)) scores.en += 1
    if (STOPWORDS.pt.has(word)) scores.pt += 1
    if (/ñ/.test(word) || /[¿¡]/.test(word)) scores.es += 2
    if (/ã|õ|ç/.test(word) || /â|ê|ô/.test(word)) scores.pt += 2
    if (/á|é|í|ó|ú/.test(word)) scores.es += 1
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
  return best[1] >= 4 ? best[0] : ''
}

/**
 * Normaliza un tema de diccionario para comparar: sin acentos, mayusculas,
 * sin marcador de marcador inicial (\b, usado por e-Sword), sin numeracion
 * inicial ("01. ADONAI" -> "ADONAI"), sin signos.
 */
function normTopic(raw: string): string {
  let text = (raw ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
  text = text.replace(/^\\?B\b/, '') // marcador \b de e-Sword (case-insensitive)
  text = text.replace(/^[\s#*.\d\-–—]+/, '') // numeracion/prefijos iniciales
  return text.replace(/[^A-Z0-9Ñ ]+/g, ' ').replace(/\s+/g, ' ').trim()
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

/** Rangos de canon por agente (numeros e-Sword = orden canonico 1-66). Cada
 * agente escanea su franja en paralelo: garantiza cobertura real de Génesis
 * a Apocalipsis sin que Génesis agote el limite de resultados solos. */
const BIBLE_AGENT_RANGES: Array<[number, number]> = [
  [1, 10],
  [11, 20],
  [21, 26],
  [27, 39],
  [40, 46],
  [47, 65],
  [66, 66]
]

export class EswordProvider implements SwordProvider {
  readonly kind = 'local' as const
  readonly available = true
  private modules: EswordModule[] = []
  private readonly dbs = new Map<string, DatabaseSync>()
  private readonly vocab = new Map<string, string[]>()

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
        // sin duplicados por NOMBRE DE ARCHIVO: un mismo titulo puede existir
        // como comentario (.cmti) y diccionario (.dcti); ambos deben vivir
        const key = basename(path).toLowerCase()
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
          // Idioma real del modulo. Prioridad: contenido lexical (decisivo),
          // luego titulo/Information; columna Language solo si no es modulo de
          // texto biblico antiguo (los conversores suelen mentir); attr lang de
          // Word como ultimo recurso.
          const meta = stripHtml(sinEstilos(`${info.description} ${info.information}`))
          const esTextoBiblico =
            /greek|hebraic|hebrew|griego|hebreo|interlineal|transliterat|vulgate|textus receptus|massoret/i.test(meta)
          let language = info.language && !esTextoBiblico ? info.language : ''
          const contentSample = this.sampleContent(db, [
            bookTable,
            commVerse,
            commChapter,
            commBook,
            dictTable
          ])
          if (!language) language = detectarIdiomaTexto(contentSample)
          if (!language && !esTextoBiblico) language = detectarIdiomaTexto(meta.slice(0, 2000))
          if (!language && !esTextoBiblico && info.information) {
            language = langDeHtml(info.information)
          }
          this.modules.push({
            name: basename(path, ext),
            path,
            ext,
            category: categoryFor(ext),
            description: info.description,
            abbreviation: info.abbreviation,
            lang: language,
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
    this.resolveNameCollisions()
  }

  /**
   * Un mismo titulo puede existir en varias categorias (Ej. "Biblia de
   * Estudio MacArthur" como .cmti y .dcti). Sufija con la categoria (es)
   * para que los nombres queden unicos ante la UI y el consumo por nombre.
   */
  private resolveNameCollisions(): void {
    const CATEGORY_LABELS: Record<string, string> = {
      Bible: 'Biblia',
      Commentary: 'Comentario',
      Dictionary: 'Diccionario',
      GenBook: 'Libro',
      Devotional: 'Devocional'
    }
    const counts = new Map<string, number>()
    for (const mod of this.modules) counts.set(mod.name.toLowerCase(), (counts.get(mod.name.toLowerCase()) ?? 0) + 1)
    for (const mod of this.modules) {
      if ((counts.get(mod.name.toLowerCase()) ?? 0) > 1) {
        const label = CATEGORY_LABELS[mod.category]
        if (label) mod.name = `${mod.name} (${label})`
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
    information: string
    language: string
  } {
    try {
      const row = db.prepare('SELECT * FROM Details LIMIT 1').get() as
        | Record<string, unknown>
        | undefined
      if (!row) return { description: '', abbreviation: '', information: '', language: '' }
      const description = String(row.Description ?? row.description ?? '')
      const abbreviation = String(row.Abbreviation ?? row.abbreviation ?? '')
      const information = String(row.Information ?? row.information ?? '')
      const language = normalizeLang(String(row.Language ?? row.language ?? ''))
      return { description, abbreviation, information, language }
    } catch {
      return { description: '', abbreviation: '', information: '', language: '' }
    }
  }

  /** Texto plano del contenido real del modulo (idioma): recorre las tablas
   * candidatas en orden (las vacias no cuentan) y barre por offsets hasta
   * juntar texto suficiente. */
  private sampleContent(db: DatabaseSync, tables: Array<string | null>): string {
    let text = ''
    for (const table of tables) {
      if (!table || text.length >= 300) continue
      try {
        for (let offset = 0; offset <= 30 && text.length < 300; offset += 6) {
          const rows = db.prepare(`SELECT * FROM ${table} LIMIT 6 OFFSET ${offset}`).all() as Array<
            Record<string, unknown>
          >
          if (!rows.length) break
          for (const row of rows) {
            for (const value of Object.values(row)) {
              if (typeof value === 'string') {
                text += ` ${stripHtml(sinEstilos(value)).slice(0, 1200)}`
              }
            }
          }
        }
      } catch {
        // tabla inaccesible: siguiente candidata
      }
    }
    return text
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
   * Lee las entradas de comentario de un capitulo. Cada fila del comentario
   * e-Sword es UNA entrada anclada en VerseBegin (los rangos tipo "1-8"
   * llevan ese texto una sola vez, como e-Sword); no se expanden.
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
            `SELECT VerseBegin AS vb, Comments AS text` +
              ` FROM ${conf.commVerse} WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ? ORDER BY VerseBegin`
          )
          .all(ordinal, chapter, chapter) as Array<{ vb: number; text: string }>
        const byAnchor = new Map<number, Verse>()
        for (const row of rows) {
          const text = renderEsword(row.text ?? '')
          if (!text || byAnchor.has(row.vb)) continue
          byAnchor.set(row.vb, { book: code, chapter, verse: row.vb, text })
        }
        out.push(...byAnchor.values())
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
    const conf = this.module(module)
    const canonical = resolveBook(book)
    if (!conf || !canonical) return null
    if (conf.category === 'Commentary') {
      // e-Sword: el versiculo activo muestra la entrada que lo CUBRE
      const list = await this.getChapter(module, book, chapter)
      const exact = list.find((item) => item.verse === verse)
      if (exact) return exact
      const lower = list.filter((item) => item.verse > 0 && item.verse <= verse)
      return lower.at(-1) ?? list[0] ?? null
    }
    const list = await this.getChapter(module, book, chapter)
    return list.find((item) => item.verse === verse) ?? null
  }

  /** Versiculos con entrada en el comentario (.cmtx/.cmti). */
  async commentaryVerses(module: string, book: string, chapter: number): Promise<number[]> {
    const conf = this.module(module)
    const canonical = resolveBook(book)
    if (!conf || !canonical || conf.category !== 'Commentary') return []
    const db = this.open(conf.path)
    const found = new Set<number>()
    try {
      if (conf.commVerse) {
        // e-Sword: una entrada por fila, anclada en VerseBegin (el rango NO se expande)
        const rows = db
          .prepare(
            `SELECT VerseBegin AS vb FROM ${conf.commVerse}` +
              ` WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ?`
          )
          .all(canonical.ordinal, chapter, chapter) as Array<{ vb: number }>
        for (const row of rows) found.add(row.vb)
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

  /**
   * Marcas e-Sword: comentarios con contenido para el libro+capitulo, de todos
   * los modulos de comentario a la vez (1 query indexada por modulo).
   */
  async commentaryCoverage(book: string, chapter: number): Promise<ModuleCoverage[]> {
    const canonical = resolveBook(book)
    if (!canonical) return []
    const out: ModuleCoverage[] = []
    for (const conf of this.modules) {
      if (conf.category !== 'Commentary') continue
      if (!conf.commVerse && !conf.commChapter && !conf.commBook) continue
      let hits = 0
      try {
        const db = this.open(conf.path)
        if (conf.commVerse) {
          const row = db
            .prepare(
              `SELECT COUNT(*) AS n FROM ${conf.commVerse}` +
                ` WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ?`
            )
            .get(canonical.ordinal, chapter, chapter) as { n: number }
          hits = Number(row.n) > 0 ? Math.max(hits, 1) : 0
          if (hits > 0) {
            // cuenta aproximada de versiculos cubiertos para el conteo del chip
            const rows = db
              .prepare(
                `SELECT VerseBegin AS vb, ChapterBegin AS cb, VerseEnd AS ve, ChapterEnd AS ce` +
                  ` FROM ${conf.commVerse} WHERE Book = ? AND ChapterBegin <= ? AND ChapterEnd >= ?`
              )
              .all(canonical.ordinal, chapter, chapter) as Array<{
              vb: number
              cb: number
              ve: number
              ce: number
            }>
            const seen = new Set<number>()
            for (const r of rows) {
              const start = r.cb < chapter ? 1 : r.vb
              const end = r.ce > chapter ? Math.min(250, r.ve) : r.ve
              for (let v = start; v <= end && seen.size < 200; v++) seen.add(v)
            }
            hits = seen.size
          }
        }
        if (hits === 0) {
          if (conf.commChapter) {
            const row = db
              .prepare(`SELECT 1 FROM ${conf.commChapter} WHERE Book = ? AND Chapter = ?`)
              .get(canonical.ordinal, chapter)
            if (row) hits = 1
          }
          if (hits === 0 && conf.commBook) {
            const row = db
              .prepare(`SELECT 1 FROM ${conf.commBook} WHERE Book = ?`)
              .get(canonical.ordinal)
            if (row) hits = 1
          }
        }
      } catch {
        // ignora
      }
      if (hits > 0) out.push({ module: conf.name, hits })
    }
    return out.sort((a, b) => b.hits - a.hits || a.module.localeCompare(b.module))
  }

  /** Diccionarios/lexicos/libros que tienen entrada cuyo tema empieza por
   * `term` (marca e-Sword de los paneles de diccionario). */
  async dictCoverage(term: string): Promise<ModuleCoverage[]> {
    const keys = term.trim().split(/\s+/)
    if (!keys.length || !keys[0]) return []
    const out: ModuleCoverage[] = []
    for (const conf of this.modules) {
      if (!conf.dictTable) continue
      if (conf.category === 'Bible' || conf.category === 'Commentary') continue
      try {
        const db = this.open(conf.path)
        const columns = this.columns(db, conf.dictTable)
        const topicCol = columns.find((c) => /topic|term|word|key|title/i.test(c)) ?? columns[0]
        const first = keys[0].replace(/[%_\\]/g, '')
        // solo prefijo: usa el TopicIndex y evita barridos completos
        const probe = db.prepare(
          `SELECT 1 FROM ${conf.dictTable} WHERE ${topicCol} LIKE ? LIMIT 1`
        )
        if (probe.get(`${first}%`)) {
          out.push({ module: conf.name, hits: 1 })
        }
      } catch {
        // ignora
      }
    }
    return out.sort((a, b) => a.module.localeCompare(b.module))
  }

  async search(options: SearchOptions): Promise<SearchResult[]> {
    const targets = options.modules?.length
      ? options.modules
      : this.modules.map((m) => m.name)
    const results: SearchResult[] = []
    const limit = options.limit ?? 200
    const glob = `*${accentGlob(options.query)}*`
    // El GLOB (clases [aáAÁ]) pre-filtra un superconjunto insensible a
    // acentos/mayusculas; el filtro real es por palabra, sensible al usuario.
    const tokens = tokenizeQuery(options.query)
    const matchOptions = {
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? true
    }
    // El pre-filtro trae un superconjunto; se amplia para que el filtro por
    // palabra completa no agote los candidatos antes de llenar el limite pedido.
    const likeLimit = Math.min(limit * 25, 50000)
    for (const name of targets) {
      const conf = this.module(name)
      if (!conf) continue
      const db = this.open(conf.path)
      try {
        if (conf.category === 'Bible' && conf.bookTable) {
          // Agentes de canon en paralelo: cada franja escanea independiente.
          // El scope AT/NT recorta las franjas (antes el scope se ignoraba).
          const scopeFrom = options.scope === 'nt' ? 40 : 1
          const scopeTo = options.scope === 'ot' ? 39 : 66
          const ranges = BIBLE_AGENT_RANGES.filter(
            ([from, to]) => to >= scopeFrom && from <= scopeTo
          ).map(([from, to]) => [Math.max(from, scopeFrom), Math.min(to, scopeTo)] as [number, number])
          const take = Math.max(2, Math.ceil(limit / ranges.length))
          const slices = await Promise.all(
            ranges.map(([from, to]) =>
              this.searchBibleAgent(conf, name, glob, tokens, matchOptions, from, to, take)
            )
          )
          const ordered = slices.flat().sort((a, b) => {
            const indexA = CANONICAL_BOOKS.findIndex((book) => book.code === a.book)
            const indexB = CANONICAL_BOOKS.findIndex((book) => book.code === b.book)
            return indexA - indexB || a.chapter - b.chapter || a.verse - b.verse
          })
          for (const result of ordered) {
            results.push(result)
            if (results.length >= limit) return results
          }
        } else if (conf.category === 'Commentary' && conf.commVerse) {
          const rows = db
            .prepare(
              `SELECT Book AS book, ChapterBegin AS chapter, VerseBegin AS verse, Comments AS text` +
                ` FROM ${conf.commVerse} WHERE Comments GLOB ? LIMIT ?`
            )
            .all(glob, likeLimit) as Array<{
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
              `SELECT ${topicCol} AS topic, ${defCol} AS text FROM ${conf.dictTable} WHERE ${defCol} GLOB ? LIMIT ?`
            )
            .all(glob, likeLimit) as Array<{ topic: string; text: string }>
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

  /** Indice de temas del modulo (diccionario o libro topical) — SQL nativo. */
  async dictEntries(module: string, prefix: string, limit = 400): Promise<Array<{ topic: string }>> {
    const conf = this.module(module)
    if (!conf || !conf.dictTable) return []
    const db = this.open(conf.path)
    const columns = this.columns(db, conf.dictTable)
    const topicCol = columns.find((c) => /topic|term|word|key|title/i.test(c)) ?? columns[0]
    try {
      const needle = prefix.trim() ? `%${escapeLike(prefix.trim())}%` : '%'
      const rows = db
        .prepare(
          `SELECT ${topicCol} AS topic FROM ${conf.dictTable} WHERE ${topicCol} LIKE ? ORDER BY ${topicCol} COLLATE NOCASE LIMIT ?`
        )
        .all(needle, limit) as Array<{ topic: string }>
      return rows.filter((row) => String(row.topic ?? '').trim())
    } catch {
      return []
    }
  }

  /** Indice de vocabulario normalizado de una Biblia (cacheado) — sin IA. */
  private vocabulary(module: string): string[] {
    const cached = this.vocab.get(module)
    if (cached) return cached
    const conf = this.module(module)
    if (!conf || conf.category !== 'Bible' || !conf.bookTable) return []
    const db = this.open(conf.path)
    const counts = new Map<string, number>()
    try {
      const rows = db
        .prepare(`SELECT Scripture AS text FROM ${conf.bookTable}`)
        .all() as Array<{ text: string }>
      for (const row of rows) {
        const plain = stripHtml(renderEsword(row.text ?? ''))
        for (const token of tokenizeQuery(plain)) {
          if (token.length < 3 || token.length > 18) continue
          counts.set(token, (counts.get(token) ?? 0) + 1)
        }
      }
    } catch {
      return []
    }
    const list = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([token]) => token)
    this.vocab.set(module, list)
    return list
  }

  /** Sugerencias tipograficas para una consulta sin resultados (0 tokens). */
  async suggest(
    query: string,
    module: string,
    limit = 6
  ): Promise<Array<{ word: string; score: number }>> {
    const vocabulary = this.vocabulary(module)
    if (!vocabulary.length) return []
    return suggestWords(vocabulary, query, limit).map((item) => ({
      word: item.word,
      score: item.distance
    }))
  }

  /** Revisa un lote de palabras contra el vocabulario (0 tokens): devuelve solo
   * las DESCONOCIDAS con sugerencias cercanas (corrector del modo Escritura). */
  async checkSpelling(
    module: string,
    words: string[],
    limit = 3
  ): Promise<Array<{ word: string; known: boolean; suggestions: string[] }>> {
    const vocabulary = this.vocabulary(module)
    if (!vocabulary.length) return []
    const known = new Set(vocabulary)
    const seen = new Set<string>()
    const out: Array<{ word: string; known: boolean; suggestions: string[] }> = []
    for (const raw of words) {
      const word = normalizeText(raw)
      if (word.length < 4 || word.length > 18 || seen.has(word)) continue
      seen.add(word)
      if (known.has(word)) continue
      const suggestions = suggestWords(vocabulary, word, limit)
        .filter((item) => item.distance > 0)
        .slice(0, limit)
        .map((item) => item.word)
      out.push({ word: raw, known: false, suggestions })
      if (out.length >= 200) break
    }
    return out
  }

  /** Recuento exacto de versiculos que cumplen (mismas reglas que search). */
  async searchCount(options: SearchOptions): Promise<number> {
    const targets = options.modules?.length
      ? options.modules
      : this.modules.map((m) => m.name)
    const tokens = tokenizeQuery(options.query)
    if (!tokens.length) return 0
    const glob = `*${accentGlob(options.query)}*`
    const matchOptions = {
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? true
    }
    const scopeFrom = options.scope === 'nt' ? 40 : 1
    const scopeTo = options.scope === 'ot' ? 39 : 66
    const ranges = BIBLE_AGENT_RANGES.filter(
      ([from, to]) => to >= scopeFrom && from <= scopeTo
    ).map(([from, to]) => [Math.max(from, scopeFrom), Math.min(to, scopeTo)] as [number, number])
    let total = 0
    for (const name of targets) {
      const conf = this.module(name)
      if (!conf || conf.category !== 'Bible' || !conf.bookTable) continue
      const db = this.open(conf.path)
      try {
        for (const [from, to] of ranges) {
          const rows = db
            .prepare(
              `SELECT Book AS book, Chapter AS chapter, Verse AS verse, Scripture AS text FROM ${conf.bookTable} WHERE Book BETWEEN ? AND ? AND Scripture GLOB ?`
            )
            .all(from, to, glob) as Array<{ text: string }>
          for (const row of rows) {
            const plain = stripHtml(renderEsword(row.text ?? ''))
            if (matchesQuery(plain, tokens, matchOptions)) total += 1
          }
        }
      } catch {
        // ignora
      }
    }
    return total
  }

  /** Agente de canon: escanea una franja de libros (e-Sword numera canonicamente). */
  private async searchBibleAgent(
    conf: EswordModule,
    name: string,
    glob: string,
    tokens: string[],
    matchOptions: { caseSensitive: boolean; wholeWord: boolean },
    from: number,
    to: number,
    take: number
  ): Promise<SearchResult[]> {
    const db = this.open(conf.path)
    const likeLimit = Math.min(Math.max(take * 30, 200), 50000)
    const rows = db
      .prepare(
        `SELECT Book AS book, Chapter AS chapter, Verse AS verse, Scripture AS text FROM ${conf.bookTable} WHERE Book BETWEEN ? AND ? AND Scripture GLOB ? LIMIT ?`
      )
      .all(from, to, glob, likeLimit) as Array<{
      book: number
      chapter: number
      verse: number
      text: string
    }>
    const out: SearchResult[] = []
    for (const row of rows) {
      const plain = stripHtml(renderEsword(row.text ?? ''))
      if (tokens.length && !matchesQuery(plain, tokens, matchOptions)) continue
      const canonical = CANONICAL_BOOKS[row.book - 1]
      out.push({
        module: name,
        book: canonical?.code ?? String(row.book),
        chapter: row.chapter,
        verse: row.verse,
        text: renderEsword(row.text ?? '')
      })
      if (out.length >= take) break
    }
    return out
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
      // 1) exacto (rapido via indice)
      const row = db
        .prepare(
          `SELECT ${defCol} AS text FROM ${conf.dictTable} WHERE ${topicCol} = ? COLLATE NOCASE LIMIT 1`
        )
        .get(key) as { text: string } | undefined
      if (row?.text) return renderEsword(row.text)
      // 2) prefijo literal
      const like = db
        .prepare(
          `SELECT ${defCol} AS text FROM ${conf.dictTable} WHERE ${topicCol} LIKE ? LIMIT 1`
        )
        .get(`${escapeLike(key.trim())}%`) as { text: string } | undefined
      if (like?.text) return renderEsword(like.text)
      // 3) tolerante: numeracion inicial, acentos y ordinales. Se normalizan
      //    TODOS los temas en JS (LIKE no matchea acentos: AARON vs AARON).
      const wanted = normTopic(key)
      const rows = db
        .prepare(`SELECT ${topicCol} AS topic FROM ${conf.dictTable}`)
        .all() as Array<{ topic: string }>
      let best: string | undefined
      for (const row of rows) {
        const norm = normTopic(row.topic)
        if (!norm) continue
        if (norm === wanted) {
          best = row.topic
          break
        }
        if (!best && norm.startsWith(wanted)) best = row.topic
      }
      if (!best) return null
      const exact = db
        .prepare(
          `SELECT ${defCol} AS text FROM ${conf.dictTable} WHERE ${topicCol} = ? LIMIT 1`
        )
        .get(best) as { text: string } | undefined
      return exact?.text ? renderEsword(exact.text) : null
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

  private lemmaCache = new Map<string, Map<string, string>>()

  // entidades HTML con nombres griegos que usan los lexicos Biblioteca Hispana
  private static greekEntities: Record<string, string> = {
    alpha: '\u03b1', beta: '\u03b2', gamma: '\u03b3', delta: '\u03b4', epsilon: '\u03b5',
    zeta: '\u03b6', eta: '\u03b7', theta: '\u03b8', iota: '\u03b9', kappa: '\u03ba',
    lambda: '\u03bb', mu: '\u03bc', nu: '\u03bd', xi: '\u03be', omicron: '\u03bf',
    pi: '\u03c0', rho: '\u03c1', sigma: '\u03c3', sigmaf: '\u03c2', tau: '\u03c4',
    upsilon: '\u03c5', phi: '\u03c6', chi: '\u03c7', psi: '\u03c8', omega: '\u03c9',
    nbsp: ' ', laquo: '\u00ab', raquo: '\u00bb', quot: '\u0022', amp: '\u0026'
  }

  private decodeEntities(text: string): string {
    return text
      .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_m, dec) => String.fromCodePoint(parseInt(dec, 10)))
      .replace(/&([a-zA-Z]+);/g, (m, name: string) =>
        Object.prototype.hasOwnProperty.call(EswordProvider.greekEntities, name.toLowerCase())
          ? EswordProvider.greekEntities[name.toLowerCase()]
          : m
      )
  }

  private normalizeLemma(raw: string): string {
    return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
  }

  private lemmaIndexFor(moduleName: string, path: string, dictTable: string): Map<string, string> {
    const cached = this.lemmaCache.get(moduleName)
    if (cached) return cached
    const map = new Map<string, string>()
    try {
      const db = this.open(path)
      const greek = /[\u0370-\u03ff\u1f00-\u1fff]+/
      const rows = db
        .prepare(`SELECT Topic AS topic, Definition AS def FROM ${dictTable}`)
        .all() as Array<{ topic: unknown; def: unknown }>
      for (const row of rows) {
        const def = String(row.def ?? '')
        const match = greek.exec(this.decodeEntities(stripHtml(def)))
        const lemma = match ? this.normalizeLemma(match[0]) : ''
        if (lemma && !map.has(lemma)) {
          map.set(
            lemma,
            `[${stripHtml(String(row.topic ?? ''))}] ${this.decodeEntities(stripHtml(def)).slice(0, 620)}`
          )
        }
      }
    } catch {
      // libreria sin la tabla: indice vacio
    }
    this.lemmaCache.set(moduleName, map)
    return map
  }

  /** Entrada de lexico por LEMA griego real (normalizado sin acentos). */
  async lookupLemma(module: string, lemma: string): Promise<{ topic: string; definition: string } | null> {
    const conf = this.module(module)
    if (!conf || !conf.dictTable) return null
    const normalized = this.normalizeLemma(lemma)
    if (!normalized) return null
    const hit = this.lemmaIndexFor(conf.name, conf.path, conf.dictTable).get(normalized)
    if (!hit) return null
    const topic = hit.slice(1, hit.indexOf(']'))
    return { topic, definition: hit.slice(hit.indexOf(']') + 1).trim() }
  }

  async strongs(key: string): Promise<StrongsEntry | null> {
    const names = ['Strongs', 'StrongsPlus', 'Strong']
    const strongModules = this.modules.filter(
      (m) => names.includes(m.name) || /strong/i.test(m.name)
    )
    const ordered = [
      ...strongModules.filter((m) => names.includes(m.name)),
      ...strongModules.filter((m) => !names.includes(m.name))
    ]
    for (const conf of ordered) {
      const entry = await this.lookupDict(conf.name, key)
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

  /**
   * Guia Exegética (100% codigo): ocurrencias de un codigo Strong en la
   * biblia con Strong# (formato e-Sword: `palabra <num>G25 VAAI3S</num>`).
   */
  async strongsOccurrences(
    code: string,
    limit = 600
  ): Promise<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>> {
    const clean = code.trim().toUpperCase().replace(/[^GH\d]/g, '')
    const normalized = /^[GH]\d{1,5}$/.test(clean) ? clean : ''
    if (!normalized) return []
    const language = normalized.startsWith('G') ? 'greek' : 'hebrew'
    const bible = this.modules.find(
      (m) => m.category === 'Bible' && /strong/i.test(m.name) && m.bookTable
    )
    if (!bible || !bible.bookTable) return []
    const db = this.open(bible.path)
    try {
      const rows = db
        .prepare(
          `SELECT Book AS book, Chapter AS chapter, Verse AS verse, Scripture AS text` +
            ` FROM ${bible.bookTable} WHERE Scripture LIKE ? LIMIT ?`
        )
        .all(`%${normalized} %`, limit * 3) as Array<{
        book: number
        chapter: number
        verse: number
        text: string
      }>
      const out: Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }> = []
      const pattern = new RegExp(`([^\\n<>]{1,30}?)\\s*<num>\\s*${normalized}(?![\\d])([^<]*)<\\/num>`, 'gi')
      for (const row of rows) {
        pattern.lastIndex = 0
        let match = pattern.exec(row.text ?? '')
        while (match) {
          // dentro del mismo <num> pueden venir varios codigos Strong
          // (G3588 G2316 DNSM NNSM): se cachan solo tokens morfologicos.
          const morphTokens = (match[2] ?? '')
            .split(/\s+/)
            .filter((t) => t && !/^[GH]?\d{1,5}$/i.test(t))
          out.push({
            book: CANONICAL_BOOKS[row.book - 1]?.code ?? String(row.book),
            chapter: row.chapter,
            verse: row.verse,
            word: stripHtml(match[1] ?? '').slice(0, 40),
            morphology: `${language} ${morphTokens.join(' ')}`.trim().slice(0, 40)
          })
          if (out.length >= limit) return out
          match = pattern.exec(row.text ?? '')
        }
      }
      return out
    } catch {
      return []
    }
  }
}
