import { bookName, CANONICAL_BOOKS, findBook, type AppSettings, type SwordModule } from '@keryx/core'
import { api } from './api'
import { moduleLabel } from './modules'
import { parseReference } from './reference'
import { runCreator } from './creator'
import type { MineProgressReporter } from './agents'

export type AssistantMode =
  | 'verse'
  | 'chapter'
  | 'topic'
  | 'word'
  | 'concept'
  | 'hermeneutica'
  | 'crearsermon'
  | 'crearestudio'
  | 'creardevocional'

export interface AssistantPassage {
  ref: string
  module: string
  text: string
}

export interface AssistantResult {
  markdown: string
  passages: AssistantPassage[]
  aiUsed: boolean
  notice?: string
  /** Sub-agentes: fuentes ancladas del dosier (cuando aplica). */
  citations?: Array<{ module: string; entry: string; kind: string }>
  /** Caracteres del dosier anclado (presupuesto de sub-agentes). */
  dossierChars?: number
  /** Tiempo real total de la respuesta (ms, medido en el renderer). */
  elapsedMs?: number
  /** Tiempo real acumulado de las llamadas IA (ms, medido en el renderer). */
  aiMs?: number
}

export type AssistantStepId =
  | 'locate'
  | 'search'
  | 'dossier'
  | 'compose'
  | 'voice'
  | 'critic'
  | 'repair'
  | 'final'
  | 'sources'

/** Reporta en vivo qué está haciendo el asistente (paso a paso, 0 tokens). */
export type AssistantStepReporter = (id: AssistantStepId, detail?: string) => void

export function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`
  const seconds = ms / 1000
  return `${seconds.toFixed(seconds < 60 ? 1 : 0)} s`
}

export interface AssistantContext {
  locale: string
  settings: AppSettings
  modules: SwordModule[]
  selectedModule: string
  personaId?: string
}

export const ASSISTANT_MODES: AssistantMode[] = [
  'crearsermon',
  'crearestudio',
  'creardevocional',
  'verse',
  'chapter',
  'topic',
  'word',
  'concept',
  'hermeneutica'
]

export const stripTags = (value: string): string =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

export function pickBible(ctx: AssistantContext): string {
  const bibles = ctx.modules.filter((m) => m.category === 'Bible')
  if (ctx.selectedModule && bibles.some((m) => m.name === ctx.selectedModule)) {
    return ctx.selectedModule
  }
  const spanish = bibles.find((m) => (m.lang || '').toLowerCase().startsWith('es'))
  return (spanish ?? bibles[0])?.name ?? ''
}

export function dictModules(ctx: AssistantContext): SwordModule[] {
  return ctx.modules.filter(
    (m) => m.category === 'Lexicon' || m.category === 'Dictionary' || m.category === 'GenBook'
  )
}

export function commentaryModules(ctx: AssistantContext): SwordModule[] {
  return ctx.modules.filter((m) => m.category === 'Commentary')
}

export function refLabel(ctx: AssistantContext, code: string, chapter: number, verse?: number): string {
  const book = findBook(code)
  const name = book ? bookName(book, ctx.locale) : code
  return `${name} ${chapter}${verse ? `:${verse}` : ''}`
}

export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch {
    return fallback
  }
}

interface LocalResult {
  markdown: string
  passages: AssistantPassage[]
}

async function localVerse(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const parsed = parseReference(query)
  if (!parsed) return localTopic(ctx, query)
  const module = pickBible(ctx)
  const verses = await safe(
    api.bible.chapter({ module, book: parsed.book, chapter: parsed.chapter }),
    []
  )
  const selected = parsed.verse
    ? verses.filter((v) => v.verse === parsed.verse)
    : verses.slice(0, 3)
  if (!selected.length) {
    return { markdown: `> No encontre **${query}** en el modulo seleccionado.`, passages: [] }
  }

  const lines: string[] = [`## ${refLabel(ctx, parsed.book, parsed.chapter, parsed.verse)}`, '']
  const passages: AssistantPassage[] = []
  for (const verse of selected) {
    const text = stripTags(verse.text)
    const ref = refLabel(ctx, parsed.book, parsed.chapter, verse.verse)
    lines.push(`**${verse.verse}.** ${text}`, '')
    passages.push({ ref, module, text })
  }

  const commentary = commentaryModules(ctx)[0]
  if (commentary) {
    const comment = await safe(
      api.bible.verse({
        module: commentary.name,
        book: parsed.book,
        chapter: parsed.chapter,
        verse: parsed.verse ?? selected[0].verse
      }),
      null
    )
    const plain = comment?.text ? stripTags(comment.text) : ''
    if (plain) {
      lines.push(`### Comentario Â· ${moduleLabel(commentary)}`, '', plain.slice(0, 1600), '')
    }
  }
  return { markdown: lines.join('\n'), passages }
}

async function localChapter(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const parsed = parseReference(query)
  if (!parsed) return localTopic(ctx, query)
  const module = pickBible(ctx)
  const verses = await safe(
    api.bible.chapter({ module, book: parsed.book, chapter: parsed.chapter }),
    []
  )
  if (!verses.length) {
    return { markdown: `> No hay texto para **${query}**.`, passages: [] }
  }

  const plain = verses.map((v) => stripTags(v.text)).join(' ')
  const stop = new Set([
    'que','de','la','el','los','las','y','en','a','con','por','para','se','su','del','al','no','es',
    'the','and','of','to','in','that','he','shall','unto','for','with','his','they','them','was'
  ])
  const freq = new Map<string, number>()
  for (const word of plain.toLowerCase().match(/[a-zÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼]{4,}/gi) ?? []) {
    if (stop.has(word)) continue
    freq.set(word, (freq.get(word) ?? 0) + 1)
  }
  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => `${word} (${count})`)

  const headings = verses.filter((v) => v.heading).map((v) => v.heading as string)
  const lines = [
    `## ${refLabel(ctx, parsed.book, parsed.chapter)}`,
    '',
    `- **Versiculos:** ${verses.length}`,
    `- **Modulo:** ${module}`,
    keywords.length ? `- **Palabras clave:** ${keywords.join(', ')}` : ''
  ].filter(Boolean)
  if (headings.length) {
    lines.push('', '### Secciones', '', ...headings.map((h) => `- ${stripTags(h)}`))
  }
  lines.push('', '> Abre el modo Estudio para leer el capitulo completo con comentarios.')

  const passages = verses.slice(0, 4).map((v) => ({
    ref: refLabel(ctx, parsed.book, parsed.chapter, v.verse),
    module,
    text: stripTags(v.text)
  }))
  return { markdown: lines.join('\n'), passages }
}

async function localTopic(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const bible = pickBible(ctx)
  const modules = bible ? [bible] : []
  const hits = await safe(api.bible.search({ query, modules, limit: 12 }), [])
  if (!hits.length) {
    return {
      markdown: `> Sin coincidencias para **${query}** en las Biblias instaladas.`,
      passages: []
    }
  }
  const passages = hits.map((hit) => ({
    ref: refLabel(ctx, hit.book, hit.chapter, hit.verse),
    module: hit.module,
    text: stripTags(hit.text)
  }))
  const lines = [`## Tema: ${query}`, '', `Encontre **${hits.length}** pasajes relacionados:`, '']
  for (const p of passages) lines.push(`- **${p.ref}** â€” ${p.text}`)
  return { markdown: lines.join('\n'), passages }
}

async function localWord(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const term = query.trim()
  const lines = [`## Palabra: ${term}`, '']
  const passages: AssistantPassage[] = []

  if (/^[GH]\d+$/i.test(term)) {
    const strongs = await safe(api.dict.strongs(term.toUpperCase()), null)
    if (strongs) {
      lines.push(
        `### Strong ${strongs.key} Â· ${strongs.language}`,
        '',
        strongs.definition.slice(0, 1400),
        ''
      )
    }
  }

  for (const dict of dictModules(ctx).slice(0, 3)) {
    const entry = await safe(api.dict.lookup({ module: dict.name, key: term }), null)
    if (entry) {
      lines.push(`### ${moduleLabel(dict)}`, '', stripTags(entry).slice(0, 1400), '')
      break
    }
  }

  const bible = pickBible(ctx)
  const hits = await safe(
    api.bible.search({ query: term, modules: bible ? [bible] : [], limit: 8 }),
    []
  )
  if (hits.length) {
    lines.push('### Usos en la Escritura', '')
    for (const hit of hits) {
      const ref = refLabel(ctx, hit.book, hit.chapter, hit.verse)
      lines.push(`- **${ref}** â€” ${stripTags(hit.text)}`)
      passages.push({ ref, module: hit.module, text: stripTags(hit.text) })
    }
  }
  if (lines.length <= 2) lines.push('> No encontre definiciones ni usos para este termino.')
  return { markdown: lines.join('\n'), passages }
}

async function localConcept(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const lines = [`## Concepto: ${query}`, '']
  const passages: AssistantPassage[] = []

  const dicts = dictModules(ctx)
  if (dicts.length) {
    const hits = await safe(
      api.bible.search({ query, modules: dicts.map((m) => m.name).slice(0, 2), limit: 4 }),
      []
    )
    for (const hit of hits) {
      lines.push(`### ${hit.module} Â· ${hit.book}`, '', stripTags(hit.text).slice(0, 1600), '')
    }
  }

  const bible = pickBible(ctx)
  const verses = await safe(
    api.bible.search({ query, modules: bible ? [bible] : [], limit: 6 }),
    []
  )
  if (verses.length) {
    lines.push('### Pasajes relacionados', '')
    for (const hit of verses) {
      const ref = refLabel(ctx, hit.book, hit.chapter, hit.verse)
      lines.push(`- **${ref}** â€” ${stripTags(hit.text)}`)
      passages.push({ ref, module: hit.module, text: stripTags(hit.text) })
    }
  }
  if (lines.length <= 2) lines.push('> Sin resultados para este concepto.')
  return { markdown: lines.join('\n'), passages }
}

async function localHermeneutica(ctx: AssistantContext, query: string): Promise<LocalResult> {
  const parsed = parseReference(query)
  if (parsed) {
    const base = await localVerse(ctx, query)
    const lines = [
      ...base.markdown.split('\n').slice(0, 8),
      '',
      '## Checklist hermeneutica',
      '',
      '1. **Genero literario:** identifica la clase de texto y sus reglas de interpretacion.',
      '2. **Contexto historico-literario:** autor, destinatarios, fecha, proposito y pasajes adjacentes.',
      '3. **Palabras clave en el original:** usa el panel de estudio para revisar Strong.',
      '4. **Figuras, parabolas y profecia:** imagenes, simbolos y cumplimientos.',
      '5. **Puente al presente:** principio eterno y aplicacion concreta.',
      '',
      '> Activa la IA o completa la checklist interactiva en el panel Hermeneutica del modo Estudio.'
    ]
    return { markdown: lines.join('\n'), passages: base.passages }
  }
  const guideLines = [
    `## Guia hermeneutica: ${query}`,
    '',
    '1. **Genero literario** â€” define reglas de lectura.',
    '2. **Contexto** â€” historico, cultural y literario.',
    '3. **Palabras clave** â€” terminos originales y rango semantico.',
    '4. **Figuras** â€” retorica, parabolas, tipos y profecia.',
    '5. **Puente al presente** â€” del principio eterno a la aplicacion.',
    '',
    '> Usa la checklist interactiva del modo Estudio para armar el documento.'
  ]
  return { markdown: guideLines.join('\n'), passages: [] }
}


export async function runAssistant(
  ctx: AssistantContext,
  mode: AssistantMode,
  query: string,
  onStep?: AssistantStepReporter,
  onProgress?: MineProgressReporter
): Promise<AssistantResult> {
  const started = performance.now()
  const trimmed = query.trim()
  if (!trimmed) {
    return { markdown: '', passages: [], aiUsed: false, elapsedMs: 0 }
  }

  // Modos de creacion completa (sermon / estudio / devocional estilo grandes)
  if (mode === 'crearsermon' || mode === 'crearestudio' || mode === 'creardevocional') {
    const creator = await runCreator(ctx, mode, trimmed, ctx.personaId ?? 'peterson', onStep, onProgress)
    return { ...creator, elapsedMs: performance.now() - started }
  }

  onStep?.('search')
  let local: LocalResult
  if (mode === 'verse') local = await localVerse(ctx, trimmed)
  else if (mode === 'chapter') local = await localChapter(ctx, trimmed)
  else if (mode === 'word') local = await localWord(ctx, trimmed)
  else if (mode === 'concept') local = await localConcept(ctx, trimmed)
  else if (mode === 'hermeneutica') local = await localHermeneutica(ctx, trimmed)
  else local = await localTopic(ctx, trimmed)

  // Los modos de estudio NO usan IA: todo se ancla por codigo (0 tokens).
  return {
    markdown: local.markdown,
    passages: local.passages,
    aiUsed: false,
    elapsedMs: performance.now() - started
  }
}

export const ASSISTANT_EXAMPLES: Record<AssistantMode, string[]> = {
  verse: ['Juan 3:16', 'Salmos 23:1', 'Romanos 8:28'],
  chapter: ['Filipenses 4', 'Genesis 1', 'Mateo 5'],
  topic: ['gracia', 'esperanza', 'perdon'],
  word: ['amor', 'G26', 'fe'],
  concept: ['justificacion', 'santidad', 'pacto'],
  hermeneutica: ['Salmos 23', 'Mateo 13:1-23', 'Romanos 12:1-2'],
  crearsermon: ['Juan 3:16', 'Salmos 23', 'Filipenses 2:1-11'],
  crearestudio: ['Romanos 12:1-2', 'Genesis 1', 'Marcos 4:35-41'],
  creardevocional: ['Salmos 91', 'Lamentaciones 3:22-23', 'Mateo 11:28-30']
}

export function assistantBookOptions(): Array<{ code: string; label: string }> {
  return CANONICAL_BOOKS.map((book) => ({ code: book.code, label: book.nameEs }))
}
