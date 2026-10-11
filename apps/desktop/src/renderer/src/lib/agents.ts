/**
 * Sub-agentes deterministas (0 tokens): minan y ANCLAN la evidencia de los
 * modulos reales de la biblioteca en un dosier compacto y citado.
 *
 * La IA no participa aqui: cada entrada trae [Modulo - entrada] verificable,
 * con recorte de tamano y presupuesto global. El "cerebro" (IA o el composer
 * local) solo REDACTA por encima del dosier.
 */
import { bookName, CANONICAL_BOOKS, type ModuleCoverage, type SwordModule } from '@keryx/core'
import { api } from './api'
import { parseReference } from './reference'
import { moduleLabel } from './modules'
import { safe, stripTags } from './assistant'
export type AgentMode =
  | 'verse'
  | 'chapter'
  | 'topic'
  | 'word'
  | 'concept'
  | 'hermeneutica'
  | 'crearsermon'
  | 'crearestudio'
  | 'creardevocional'

export interface AgentCitation {
  module: string
  entry: string
  kind: 'texto' | 'comentario' | 'bosquejo' | 'strongs' | 'tema' | 'historico' | 'ilustracion' | 'referencia'
}

export interface DossierSection {
  kind: AgentCitation['kind']
  title: string
  entries: string[]
}

export interface Dossier {
  query: string
  section: string | null
  sections: DossierSection[]
  citations: AgentCitation[]
  chars: number
}

export const ENTRY_MAX_CHARS = 620
export const SECTION_MAX_ENTRIES = 3
export const DOSSIER_BUDGET = 7000

/** Ganchos de datos inyectables (api en produccion, fake en tests). */
export interface AgentHook {
  modules: SwordModule[]
  locale: string
  priorityModules: string[]
  selectedModule: string
  chapter: (module: string, book: string, ch: number) => Promise<{ verse: number; text: string; heading?: string }[]>
  verse: (module: string, book: string, ch: number, v: number) => Promise<{ verse: number; text: string } | null>
  coverage: (book: string, ch: number) => Promise<ModuleCoverage[]>
  lookup: (module: string, key: string) => Promise<string | null>
  strongs: (key: string) => Promise<{ key: string; language: string; definition: string } | null>
  search: (query: string, modules: string[], limit: number) => Promise<Array<{ module: string; book: string; chapter: number; verse: number; text: string }>>
}

/* ------------------------------------------------------------------ utils */

const SPECIAL_RE: Record<AgentCitation['kind'], RegExp | null> = {
  texto: null,
  comentario: null,
  bosquejo: /bosquejo|sermones|predic/i,
  strongs: null,
  tema: /nave|concordancia tem.?atica|tematico/i,
  historico: /geogra|enciclop|tabern.culo de israel|usos y costumbre|manners|historic/i,
  ilustracion: /an.cdot|ilustracion|figuras|citas/i,
  referencia: null
}

function shortName(name: string): string {
  return name.length > 34 ? `${name.slice(0, 32)}…` : name
}

function trimEntry(text: string, max = ENTRY_MAX_CHARS): string {
  const plain = stripTags(text).replace(/\s+/g, ' ').trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max)}…`
}

function themeWords(query: string): string {
  const stop = new Set([
    'de', 'del', 'la', 'el', 'los', 'las', 'en', 'con', 'para', 'por', 'que',
    'esta', 'este', 'al', 'un', 'una', 'sobre', 'versiculo', 'capitulo', 'libro'
  ])
  return query
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?¡¿()[\]"]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w))
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .trim()
}

/** Ensambla el dosier con presupuesto global. */
export async function buildDossier(
  hook: AgentHook,
  mode: AgentMode,
  query: string
): Promise<Dossier> {
  const parsed = parseReference(query)
  const sections: DossierSection[] = []
  const citations: AgentCitation[] = []
  let budget = DOSSIER_BUDGET

  const addSection = (
    kind: DossierSection['kind'],
    title: string,
    entries: Array<string>,
    extra = 0
  ): void => {
    if (!entries.length) return
    const chars = entries.join('\n').length + extra
    if (budget - chars < 400) return
    budget -= chars
    sections.push({ kind, title, entries })
  }

  const cite = (kind: AgentCitation['kind'], module: string, entry: string): void => {
    citations.push({ module, entry, kind })
  }

  // ---- 1) Texto base
  const bible = pickBibleModule(hook)
  let verseHtml = ''
  if (parsed && bible) {
    const showFullChapter = mode !== 'verse'
    const verses = await safe(
      hook.chapter(bible.name, parsed.book, parsed.chapter),
      [] as { verse: number; text: string; heading?: string }[]
    )
    if (verses.length) {
      const scoped = parsed.verse
        ? verses.filter((v) => v.verse === parsed.verse)
        : verses.slice(0, showFullChapter ? verses.length : Math.min(3, verses.length))
      const label = bookName(
        CANONICAL_BOOKS.find((b) => b.code === parsed.book) ?? CANONICAL_BOOKS[0],
        hook.locale
      )
      const lines: string[] = []
      for (const verse of scoped) {
        lines.push(`${verse.verse} ${stripTags(verse.text).slice(0, 400)}`)
        if (!verseHtml) verseHtml = verse.text
      }
      addSection('texto', `${label} ${parsed.chapter}`, lines, label.length + 20)
      cite('texto', bible.name, `${label} ${parsed.chapter}`)
    }
  }

  // ---- 2) Comentarios (por cobertura real) y Bosquejos predica
  if (parsed) {
    const coverage = await safe(hook.coverage(parsed.book, parsed.chapter), [] as ModuleCoverage[])
    const commentaryByCoverage = coverage
      .filter((c) => hook.modules.some((m) => m.name === c.module && m.category === 'Commentary'))
      .slice(0, SECTION_MAX_ENTRIES)
    const commentEntries: string[] = []
    for (const item of commentaryByCoverage) {
      const comment = await safe(
        hook.verse(item.module, parsed.book, parsed.chapter, parsed.verse ?? 1),
        null
      )
      if (!comment?.text) continue
      commentEntries.push(`[${shortName(item.module)}] ${trimEntry(comment.text, 520)}`)
      cite('comentario', item.module, refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1))
    }
    addSection('comentario', 'Comentario (por cobertura)', commentEntries)

    const outlineMod = hook.modules.find(
      (m) => SPECIAL_RE.bosquejo?.test(m.name) && m.category === 'Commentary'
    )
    if (outlineMod) {
      const outline = await safe(
        hook.verse(outlineMod.name, parsed.book, parsed.chapter, parsed.verse ?? 1),
        null
      )
      if (outline?.text) {
        addSection('bosquejo', 'Bosquejo y sermones', [trimEntry(outline.text, 900)])
        cite('bosquejo', outlineMod.name, refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1))
      }
    }
  }

  // ---- 3) Palabras originales (Strong)
  const strongKeys = verseHtml
    ? [...verseHtml.matchAll(/data-strong="([GH]\d{1,6})"/gi)]
        .slice(0, 6)
        .map((m) => m[1].toUpperCase())
    : []
  const strongEntries: string[] = []
  for (const key of [...new Set(strongKeys)]) {
    const entry = await safe(hook.strongs(key), null)
    if (!entry) continue
    strongEntries.push(`**${entry.key}** (${entry.language}) ${trimEntry(entry.definition, 420)}`)
    cite('strongs', entry.key, key)
  }
  addSection('strongs', 'Palabras originales', strongEntries)

  // ---- 4) Temas (Nave y tematicos reales)
  const theme = themeWords(query) || (parsed ? '' : query)
  const topicEntries: string[] = []
  if (theme) {
    const topicMods = hook.modules
      .filter((m) => SPECIAL_RE.tema?.test(m.name))
      .sort((a, b) => Number(SPECIAL_RE.tema?.test(a.name)) - Number(SPECIAL_RE.tema?.test(b.name)))
      .slice(0, 2)
    for (const mod of topicMods) {
      const entry = await safe(hook.lookup(mod.name, theme), null)
      if (!entry) continue
      topicEntries.push(`[${shortName(moduleLabel(mod))} · ${theme}] ${trimEntry(entry, 520)}`)
      cite('tema', mod.name, theme)
    }
  }
  addSection('tema', `Temas (${theme || '—'})`, topicEntries)

  // ---- 5) Contexto historico / geografia (especialistas reales)
  const geoEntries: string[] = []
  if (parsed) {
    const esName = bookName(
      CANONICAL_BOOKS.find((b) => b.code === parsed.book) ?? CANONICAL_BOOKS[0],
      'es'
    )
    const geoMods = hook.modules
      .filter((m) => SPECIAL_RE.historico?.test(m.name))
      .slice(0, 2)
    for (const mod of geoMods) {
      const entry = await safe(hook.lookup(mod.name, esName), null)
      if (!entry) continue
      geoEntries.push(`[${shortName(moduleLabel(mod))} · ${esName}] ${trimEntry(entry, 560)}`)
      cite('historico', mod.name, esName)
    }
  }
  addSection('historico', 'Contexto historico y geografico', geoEntries)

  // ---- 6) Ilustraciones (anecdotario mibiblioteca)
  const illusEntries: string[] = []
  if (theme) {
    const illusMods = hook.modules
      .filter(
        (m) =>
          SPECIAL_RE.ilustracion?.test(m.name) &&
          (m.category === 'Dictionary' || m.category === 'Lexicon' || m.category === 'GenBook')
      )
      .slice(0, 2)
    for (const mod of illusMods) {
      const found = await safe(hook.search(theme, [mod.name], 3), [])
      const topic = found[0]?.book
      if (!topic) continue
      const entry = await safe(hook.lookup(mod.name, topic), null)
      if (!entry) continue
      illusEntries.push(`[${shortName(moduleLabel(mod))} · ${topic}] ${trimEntry(entry, 480)}`)
      cite('ilustracion', mod.name, topic)
    }
  }
  addSection('ilustracion', 'Ilustraciones', illusEntries)

  return {
    query,
    section: parsed ? refEntry(parsed.book, parsed.chapter, parsed.verse) : null,
    sections,
    citations,
    chars: DOSSIER_BUDGET - budget
  }
}

function refEntry(book: string, chapter: number, verse?: number): string {
  return `${book}${chapter}${verse ? `:${verse}` : ''}`
}

function pickBibleModule(hook: AgentHook): SwordModule | null {
  const bibles = hook.modules.filter((m) => m.category === 'Bible')
  const scored = bibles.sort((a, b) => {
    const rankA = hook.priorityModules.includes(a.name) ? 0 : 1
    const rankB = hook.priorityModules.includes(b.name) ? 0 : 1
    if (rankA !== rankB) return rankA - rankB
    const es = (m: SwordModule): number => ((m.lang || '').toLowerCase().startsWith('es') ? 0 : 1)
    return es(a) - es(b) || a.name.localeCompare(b.name)
  })
  return scored[0] ?? null
}

/** Render Markdown del dosier (modos no creadores y vista de fuentes). */
export function renderDossier(dossier: Dossier): string {
  const lines: string[] = []
  if (dossier.section) lines.push(`**${dossier.section}**`, '')
  for (const section of dossier.sections) {
    lines.push(`## ${section.title}`, '')
    lines.push(...section.entries, '')
  }
  return lines.join('\n')
}

/** Serializa el dosier para el prompt del cerebro (IA). */
export function dossierForPrompt(dossier: Dossier): string {
  const parts: string[] = [dossier.section ? `PASAJE: ${dossier.section}` : '']
  for (const section of dossier.sections) {
    parts.push(`### ${section.title} [${section.entries.length} fuente(s)]`)
    parts.push(...section.entries, '')
  }
  return parts.join('\n').trim()
}

/* ----------------------------------------------------------- adaptador api */

export function apiHook(ctx: {
  modules: SwordModule[]
  locale: string
  priorityModules: string[]
  selectedModule: string
}): AgentHook {
  return {
    modules: ctx.modules,
    locale: ctx.locale,
    priorityModules: ctx.priorityModules,
    selectedModule: ctx.selectedModule,
    chapter: (module, book, ch) =>
      api.bible.chapter({ module, book, chapter: ch }).catch(() => []),
    verse: async (module, book, ch, v) =>
      (await api.bible.verse({ module, book, chapter: ch, verse: v }).catch(() => null)) ?? null,
    coverage: (book, ch) => api.bible.commentaryCoverage({ book, chapter: ch }).catch(() => []),
    lookup: (module, key) => api.dict.lookup({ module, key }).catch(() => null),
    strongs: async (key) => (await api.dict.strongs(key).catch(() => null)) ?? null,
    search: (query, modules, limit) => api.bible.search({ query, modules, limit }).catch(() => [])
  }
}
