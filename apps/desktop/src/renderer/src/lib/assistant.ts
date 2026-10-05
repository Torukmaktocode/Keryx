import { bookName, CANONICAL_BOOKS, findBook, type AppSettings, type SwordModule } from '@keryx/core'
import { api } from './api'
import { moduleLabel } from './modules'
import { parseReference } from './reference'

export type AssistantMode = 'verse' | 'chapter' | 'topic' | 'word' | 'concept' | 'hermeneutica'

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
}

export interface AssistantContext {
  locale: string
  settings: AppSettings
  modules: SwordModule[]
  selectedModule: string
}

export const ASSISTANT_MODES: AssistantMode[] = [
  'verse',
  'chapter',
  'topic',
  'word',
  'concept',
  'hermeneutica'
]

const stripTags = (value: string): string =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

function pickBible(ctx: AssistantContext): string {
  const bibles = ctx.modules.filter((m) => m.category === 'Bible')
  if (ctx.selectedModule && bibles.some((m) => m.name === ctx.selectedModule)) {
    return ctx.selectedModule
  }
  const spanish = bibles.find((m) => (m.lang || '').toLowerCase().startsWith('es'))
  return (spanish ?? bibles[0])?.name ?? ''
}

function dictModules(ctx: AssistantContext): SwordModule[] {
  return ctx.modules.filter(
    (m) => m.category === 'Lexicon' || m.category === 'Dictionary' || m.category === 'GenBook'
  )
}

function commentaryModules(ctx: AssistantContext): SwordModule[] {
  return ctx.modules.filter(
    (m) => m.category === 'Commentary' || m.name.toLowerCase().startsWith('champlin')
  )
}

function refLabel(ctx: AssistantContext, code: string, chapter: number, verse?: number): string {
  const book = findBook(code)
  const name = book ? bookName(book, ctx.locale) : code
  return `${name} ${chapter}${verse ? `:${verse}` : ''}`
}

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
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
      lines.push(`### Comentario · ${moduleLabel(commentary)}`, '', plain.slice(0, 1600), '')
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
  for (const word of plain.toLowerCase().match(/[a-záéíóúñü]{4,}/gi) ?? []) {
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
  for (const p of passages) lines.push(`- **${p.ref}** — ${p.text}`)
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
        `### Strong ${strongs.key} · ${strongs.language}`,
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
      lines.push(`- **${ref}** — ${stripTags(hit.text)}`)
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
      lines.push(`### ${hit.module} · ${hit.book}`, '', stripTags(hit.text).slice(0, 1600), '')
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
      lines.push(`- **${ref}** — ${stripTags(hit.text)}`)
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
    '1. **Genero literario** — define reglas de lectura.',
    '2. **Contexto** — historico, cultural y literario.',
    '3. **Palabras clave** — terminos originales y rango semantico.',
    '4. **Figuras** — retorica, parabolas, tipos y profecia.',
    '5. **Puente al presente** — del principio eterno a la aplicacion.',
    '',
    '> Usa la checklist interactiva del modo Estudio para armar el documento.'
  ]
  return { markdown: guideLines.join('\n'), passages: [] }
}

const MODE_INSTRUCTIONS: Record<AssistantMode, string> = {
  verse: [
    'Realiza una exegesis completa y de nivel academico del pasaje:',
    '(1) Texto y traduccion literal.',
    '(2) Contexto literario, historico y redentor (donde encaja en el argumento del libro y en la historia de la redencion).',
    '(3) Analisis del original: terminos clave en hebreo/griego (transliterados), gramatica y sintaxis relevante.',
    '(4) Teologia biblica y sistematica: que revela sobre Dios, el hombre, Cristo y la salvacion.',
    '(5) Interpretacion historica y debates: Padres de la Iglesia, Reformadores y exegesis moderna, con sus posturas.',
    '(6) Aplicacion pastoral y espiritual.'
  ].join(' '),
  chapter: [
    'Ofrece una exposicion profunda del capitulo:',
    '(1) Panorama y estructura literaria (division en unidades).',
    '(2) Tema central y argumento que articula el capitulo.',
    '(3) Exegesis por secciones con los versiculos clave.',
    '(4) Trasfondo historico-cultural y genero literario.',
    '(5) Conexiones canonicas y teologicas (tipologia, cumplimiento, ecos del AT).',
    '(6) Aplicaciones y sintesis doctrinal.'
  ].join(' '),
  topic: [
    'Desarrolla el tema con rigor de teologia biblica y sistematica:',
    '(1) Definicion y precision terminologica.',
    '(2) Desarrollo progresivo a traves del canon (AT, evangelios, epistolas, escatologia).',
    '(3) Principales pasajes con exegesis breve.',
    '(4) Ubicacion en los loci de la teologia sistematica.',
    '(5) Debates, matices y principales posturas con sus representantes.',
    '(6) Sintesis y aplicacion.'
  ].join(' '),
  word: [
    'Realiza un estudio lexico y teologico de la palabra:',
    '(1) Termino original, transliteracion y raiz.',
    '(2) Rango semantico y usos en el AT, la LXX y el NT.',
    '(3) Matices, campos semanticos y terminos relacionados.',
    '(4) Evolucion del uso y peso teologico.',
    '(5) Pasajes clave y su interpretacion.',
    '(6) Relevancia doctrinal y practica.'
  ].join(' '),
  concept: [
    'Expone el concepto con profundidad dogmatica e historica:',
    '(1) Definicion tecnica y precision terminologica.',
    '(2) Fundamento biblico y desarrollo en la historia de la redencion.',
    '(3) Desarrollo historico-dogmatico: Padres, concilios y confesiones.',
    '(4) Formulacion sistematica actual.',
    '(5) Herejias, controversias y debates contemporaneos.',
    '(6) Implicaciones pastorales y aplicacion.'
  ].join(' '),
  hermeneutica: [
    'Aplica el metodo hermeneutico completo al pasaje o tema:',
    '(1) Genero literario y sus reglas de interpretacion.',
    '(2) Contexto historico-cultural y literario (autor, destinatarios, proposito, estructura).',
    '(3) Analisis del texto en el original: terminos clave griego/hebreo transliterados, con rango semantico.',
    '(4) Figuras retoricas, parabolas, tipos y profecia presentes.',
    '(5) Puente cultural: que diferencia hay entre el entonces y el hoy; principio eterno.',
    '(6) Gran idea en una sola frase y aplicacion concreta.',
    'Usa los recursos de Fee/Stuart (generos), Duvall/Hays (viaje interpretativo) y',
    'J.M. Martinez como marco metodologico, sin citarlos textually salvo referencia.'
  ].join(' ')
}

const SYSTEM_PROMPT = [
  'Eres Keryx, un asistente de estudio biblico y teologia de nivel academico avanzado (doctorado).',
  'Integras exegesis rigurosa, teologia biblica, teologia sistematica y teologia historica.',
  '',
  'Principios:',
  '- Fidelidad a la Escritura y a la ortodoxia historica cristiana; distingue con claridad entre el texto, la interpretacion y la opinion.',
  '- Cita siempre las referencias como "Libro Capitulo:Versiculo" y, cuando aporte, el termino original en hebreo/griego transliterado.',
  '- Usa el material de los modulos instalados (comentarios, lexicos, diccionarios) como evidencia: sintetizalo y atribuyelo, sin copiarlo entero.',
  '- Senala los debates interpretativos y las principales posturas (patristica, reformadores, exegesis moderna) con sus representantes.',
  '- No inventes citas, datos ni referencias; si la evidencia es insuficiente, dilo con honestidad.',
  '- Evita el relleno: privilegia precision, densidad teologica y claridad.',
  '',
  'Formato: Markdown con encabezados (##, ###), listas y tablas cuando ayuden a la claridad.',
  'Extension: profunda y desarrollada (apunta a 600-1000 palabras), organizada por las secciones indicadas.'
].join('\n')

function buildAiMessages(
  ctx: AssistantContext,
  mode: AssistantMode,
  query: string,
  context: string
): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
  const language = ctx.locale === 'en' ? 'English' : ctx.locale === 'pt' ? 'Portuguese' : 'Spanish'
  const system = `${SYSTEM_PROMPT}\n\nResponde en ${language}.`
  const user = [
    `Modo: ${mode}`,
    `Estructura requerida: ${MODE_INSTRUCTIONS[mode]}`,
    '',
    `Consulta del usuario: ${query}`,
    '',
    'Material recuperado de los modulos instalados (evidencia de apoyo; cita las fuentes, no lo copies literalmente):',
    context || '(sin material adicional)'
  ].join('\n')
  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ]
}

async function gatherEvidence(
  ctx: AssistantContext,
  mode: AssistantMode,
  query: string
): Promise<string> {
  const parts: string[] = []
  const bible = pickBible(ctx)
  const parsed = parseReference(query)

  if ((mode === 'verse' || mode === 'chapter') && parsed) {
    if (bible) {
      const verses = await safe(
        api.bible.chapter({ module: bible, book: parsed.book, chapter: parsed.chapter }),
        []
      )
      if (verses.length) {
        const text = verses.map((v) => `${v.verse}. ${stripTags(v.text)}`).join('\n')
        parts.push(`[Biblia ${bible}] ${refLabel(ctx, parsed.book, parsed.chapter)}\n${text}`)
      }
    }
    const commentaries = commentaryModules(ctx).slice(0, 3)
    for (const commentary of commentaries) {
      const comment = await safe(
        api.bible.verse({
          module: commentary.name,
          book: parsed.book,
          chapter: parsed.chapter,
          verse: parsed.verse ?? 1
        }),
        null
      )
      const plain = comment?.text ? stripTags(comment.text) : ''
      if (plain) {
        parts.push(
          `[Comentario ${moduleLabel(commentary)}] ${refLabel(ctx, parsed.book, parsed.chapter, parsed.verse)}\n${plain.slice(0, 2200)}`
        )
      }
    }
    return parts.join('\n\n')
  }

  const dicts = dictModules(ctx).slice(0, 4)
  for (const dict of dicts) {
    const entry = await safe(api.dict.lookup({ module: dict.name, key: query }), null)
    if (entry) parts.push(`[${moduleLabel(dict)}] ${query}\n${stripTags(entry).slice(0, 2200)}`)
  }

  const bibles = ctx.modules
    .filter((m) => m.category === 'Bible')
    .sort((a, b) => {
      const rank = (m: SwordModule): number => ((m.lang || '').toLowerCase().startsWith('es') ? 0 : 1)
      return rank(a) - rank(b)
    })
    .slice(0, 2)
  for (const translation of bibles) {
    const hits = await safe(
      api.bible.search({ query, modules: [translation.name], limit: 8 }),
      []
    )
    if (hits.length) {
      const lines = hits.map(
        (hit) => `${refLabel(ctx, hit.book, hit.chapter, hit.verse)} — ${stripTags(hit.text)}`
      )
      parts.push(`[Pasajes en ${translation.name}]\n${lines.join('\n')}`)
    }
  }
  return parts.join('\n\n')
}

export async function runAssistant(
  ctx: AssistantContext,
  mode: AssistantMode,
  query: string
): Promise<AssistantResult> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { markdown: '', passages: [], aiUsed: false }
  }

  let local: LocalResult
  if (mode === 'verse') local = await localVerse(ctx, trimmed)
  else if (mode === 'chapter') local = await localChapter(ctx, trimmed)
  else if (mode === 'word') local = await localWord(ctx, trimmed)
  else if (mode === 'concept') local = await localConcept(ctx, trimmed)
  else if (mode === 'hermeneutica') local = await localHermeneutica(ctx, trimmed)
  else local = await localTopic(ctx, trimmed)

  if (!ctx.settings.aiEnabled) {
    return { markdown: local.markdown, passages: local.passages, aiUsed: false }
  }

  try {
    const evidence = await gatherEvidence(ctx, mode, trimmed)
    const context = [local.markdown, evidence].filter(Boolean).join('\n\n---\n\n')
    const result = await api.ai.chat({
      messages: buildAiMessages(ctx, mode, trimmed, context),
      temperature: 0.35,
      maxTokens: 3200
    })
    return {
      markdown: result.text,
      passages: local.passages,
      aiUsed: true
    }
  } catch (error) {
    return {
      markdown: local.markdown,
      passages: local.passages,
      aiUsed: false,
      notice: error instanceof Error ? error.message : String(error)
    }
  }
}

export const ASSISTANT_EXAMPLES: Record<AssistantMode, string[]> = {
  verse: ['Juan 3:16', 'Salmos 23:1', 'Romanos 8:28'],
  chapter: ['Filipenses 4', 'Genesis 1', 'Mateo 5'],
  topic: ['gracia', 'esperanza', 'perdon'],
  word: ['amor', 'G26', 'fe'],
  concept: ['justificacion', 'santidad', 'pacto'],
  hermeneutica: ['Salmos 23', 'Mateo 13:1-23', 'Romanos 12:1-2']
}

export function assistantBookOptions(): Array<{ code: string; label: string }> {
  return CANONICAL_BOOKS.map((book) => ({ code: book.code, label: book.nameEs }))
}
