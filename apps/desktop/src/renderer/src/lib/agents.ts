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
  kind:
    | 'texto'
    | 'comentario'
    | 'bosquejo'
    | 'strongs'
    | 'tema'
    | 'historico'
    | 'ilustracion'
    | 'referencia'
    | 'teologico'
    | 'cultural'
    | 'cristologico'
    | 'filosofico'
    | 'aplicacion'
    | 'idiomas'
    | 'morfologia'
    | 'critico'
    | 'sistematica'
    | 'historia'
    | 'caso'
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
export const DOSSIER_BUDGET = 16000

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
  referencia: /lambert|paralelos|concordancias|analogias/i,
  teologico: /diccionario de teologi|teologico|teologia|eclesiologi|sacramentum/i,
  cultural: /usos y costumbre|arqueolog|perspicacia/i,
  cristologico: /jes.s de nazaret|cristologi|vida de jes/i,
  filosofico: /diccionario de filosofi/i,
  aplicacion: /pastoral|evangelizaci|catequis|doctrina social|evangelismo/i,
  idiomas: /tuggy|lexico griego/i,
  morfologia: /morfologico robinson|morphological analysis/i,
  critico: /metzger|aparato critico|interlineal|cevallos|codigo textual|codigo real|hebraico|gratn/i,
  sistematica: /teologia sistematica|dogmatica|teologia biblica sistematica/i,
  historia: /\bhistoria del cristianismo\b|josefo|martires|eusebio/i,
  caso: /donde hallarlo|nave|tematico|thompson/i
}

/** Orden interna de especialistas: preferimos los de contenido mas extenso. */
const SPECIAL_ORDER: Partial<Record<AgentCitation['kind'], (name: string) => number>> = {
  teologico: (name) =>
    /ferguson/i.test(name) ? 0 : /enciclopedico/i.test(name) ? 1 : 2,
  filosofico: (name) => (/brugger/i.test(name) ? 0 : /herder|rosental/i.test(name) ? 1 : 2),
  cultural: (name) => (/usos y costumbre/i.test(name) ? 0 : 1),
  cristologico: (name) => (/nazaret/i.test(name) ? 0 : 1)
}

function shortName(name: string): string {
  return name.length > 34 ? `${name.slice(0, 32)}…` : name
}

/** Comentarios de referencia pesada: se priorizan en el dosier. */
const COMMENT_RANK = /calvino|macarthur|matthew henry|keil|delitzsch|robertson|barclay|guzik|macdonald|walton|keener|wiersbe|jamieson|scofield|spurgeon|trenchard|metzger/i

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

/** Variantes de tema para diccionarios generales (singular/plural). */
function topicVariants(theme: string): string[] {
  const t = theme.trim().toUpperCase()
  if (!t) return []
  const variants = [t]
  if (t.endsWith('S') && t.length > 3) variants.push(t.slice(0, -1))
  return [...new Set(variants)]
}

/** Palabras distintivas del texto del versiculo para minar diccionarios generales. */
function verseThemeWords(html: string): string[] {
  const stop = new Set([
    'porque', 'aquel', 'aquella', 'cuando', 'donde', 'nuestro', 'nuestra', 'tambien',
    'ustedes', 'ellos', 'ella', 'nosotros', 'hasta', 'desde', 'sobre', 'entre',
    'todos', 'toda', 'todo', 'otra', 'otro', 'esta', 'este', 'esas', 'esos',
    'pero', 'como', 'cual', 'cuales', 'para', 'sino', 'tiene', 'tienen', 'dijo'
  ])
  return [
    ...new Set(
      [...new Set(stripTags(html).toLowerCase().split(/[^\wáéíóúñü]+/))]
        .filter((w) => /^[a-záéíóúñü]{4,}$/.test(w) && !stop.has(w))
    )
  ]
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .sort((a, b) => b.length - a.length)
    .slice(0, 6)
}

/** Codigo morfologico compacto (VAAI3S) → candidatos Robinson (V-AAI-3S, VAAI3S). */
function morphCandidates(compact: string): string[] {
  const c = compact.trim().toUpperCase()
  if (!/^[A-Z]{2,10}\d{0,3}[A-Z]{0,3}$/.test(c)) return []
  const dashed =
    (c.startsWith('V') ? `V-${c.slice(1)}` : c)
      .replace(/(\d)([A-Z])/g, '$1-$2')
      .replace(/([A-Z])(\d)/g, '$1-$2')
  return [...new Set([dashed, c])]
}

/** Códigos morfológicos del markup e-Sword: <num>G25 VAAI3S</num>. */
function verseMorphCodes(html: string): string[] {
  return [
    ...new Set(
      [...html.matchAll(/<num>\s*[GH]\d{1,5}\s+([A-Z0-9]{2,8}(?:\s+[A-Z0-9-]{1,10})*)\s*<\/num>/gi)]
        .flatMap((m) => m[1].split(/\s+/))
        .filter((code) => /^[A-Z]{2,}/i.test(code))
    )
  ].slice(0, 6)
}

/** Ensambla el dosier con presupuesto global. `at` fuerza la referencia (Guía del Pasaje). */
export async function buildDossier(
  hook: AgentHook,
  mode: AgentMode,
  query: string,
  at?: { book: string; chapter: number; verse?: number }
): Promise<Dossier> {
  const parsed = at ?? parseReference(query)
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

  // ---- 2-7) Agentes de mina EN PARALELO: cada uno produce {entries, cites}
  //           y el presupuesto se consume en orden canonico al ensamblar.
  // Claves Strong extraidas del verso (data-strong="G26" o <num>G25 VAAI3S</num>).
  const strongKeys = verseHtml
    ? [
        ...[...verseHtml.matchAll(/data-strong="([GH]\d{1,6})"/gi)].map((m) => m[1]),
        ...[...verseHtml.matchAll(/<num>\s*([GH]\d{1,6})\s/gi)].map((m) => m[1])
      ]
        .map((k) => k.toUpperCase())
        .slice(0, 8)
    : []

  interface Job {
    kind: AgentCitation['kind']
    title: string
    entries: string[]
    cites: AgentCitation[]
  }

  const commentJob = async (): Promise<Job> => {
    const job: Job = { kind: 'comentario', title: 'Comentario (por cobertura)', entries: [], cites: [] }
    if (!parsed) return job
    const coverage = await safe(hook.coverage(parsed.book, parsed.chapter), [] as ModuleCoverage[])
    const commentaryByCoverage = coverage
      .filter((c) => hook.modules.some((m) => m.name === c.module && m.category === 'Commentary'))
      .sort((a, b) => Number(COMMENT_RANK.test(b.module)) - Number(COMMENT_RANK.test(a.module)))
      .slice(0, SECTION_MAX_ENTRIES)
    for (const item of commentaryByCoverage) {
      const comment = await safe(
        hook.verse(item.module, parsed.book, parsed.chapter, parsed.verse ?? 1),
        null
      )
      if (!comment?.text) continue
      job.entries.push(`[${shortName(item.module)}] ${trimEntry(comment.text, 520)}`)
      job.cites.push({ kind: 'comentario', module: item.module, entry: refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1) })
    }
    return job
  }

  const outlineJob = async (): Promise<Job> => {
    const job: Job = { kind: 'bosquejo', title: 'Bosquejo y sermones', entries: [], cites: [] }
    const outlineMod = parsed
      ? hook.modules.find((m) => SPECIAL_RE.bosquejo?.test(m.name) && m.category === 'Commentary')
      : undefined
    if (!parsed || !outlineMod) return job
    const outline = await safe(
      hook.verse(outlineMod.name, parsed.book, parsed.chapter, parsed.verse ?? 1),
      null
    )
    if (outline?.text) {
      job.entries.push(trimEntry(outline.text, 900))
      job.cites.push({ kind: 'bosquejo', module: outlineMod.name, entry: refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1) })
    }
    return job
  }

  const strongsJob = async (): Promise<Job> => {
    const job: Job = { kind: 'strongs', title: 'Palabras originales', entries: [], cites: [] }
    for (const key of [...new Set(strongKeys)]) {
      const entry = await safe(hook.strongs(key), null)
      if (!entry) continue
      job.entries.push(`**${entry.key}** (${entry.language}) ${trimEntry(entry.definition, 420)}`)
      job.cites.push({ kind: 'strongs', module: entry.key, entry: key })
    }
    return job
  }

  // ---- 3b) Idiomas originales: lexico griego (Tuggy) keyeado por la palabra
  //          ESPANOLA del verso → palabras griegas reales que la traducen.
  const idiomasJob = async (): Promise<Job> => {
    const job: Job = { kind: 'idiomas', title: 'Palabras griegas del NT (Tuggy)', entries: [], cites: [] }
    const topics = (themeForCtx ? [themeForCtx] : []).concat(verseThemes).slice(0, 3)
    if (!topics.length) return job
    const mods = hook.modules.filter((m) => SPECIAL_RE.idiomas?.test(m.name)).slice(0, 1)
    for (const mod of mods) {
      for (const topic of topics.flatMap(topicVariants)) {
        const entry = await safe(hook.lookup(mod.name, topic), null)
        if (!entry) continue
        job.entries.push(
          `**${topic}** → ${trimEntry(entry, 520)}`
        )
        job.cites.push({ kind: 'idiomas', module: mod.name, entry: topic })
        break
      }
    }
    return job
  }

  // ---- 3c) Morfologia gramatical: codigos del verso explicados por Robinson.
  const morfologiaJob = async (): Promise<Job> => {
    const job: Job = { kind: 'morfologia', title: 'Morfologia (Robinson)', entries: [], cites: [] }
    const mods = hook.modules
      .filter((m) => SPECIAL_RE.morfologia?.test(m.name))
      .slice(0, 2)
    if (!mods.length) return job
    for (const compact of verseMorphCodes(verseHtml)) {
      for (const candidate of morphCandidates(compact)) {
        let entry: string | null = null
        for (const mod of mods) {
          entry = await safe(hook.lookup(mod.name, candidate), null)
          if (!entry) continue
          // la definicion Robinson ya trae Tiempo/Voz/Modo/Persona/Numero
          job.entries.push(
            `**${compact}** (${candidate}) ${trimEntry(entry.replace(/<[^>]+>/g, ' ').replace(/Funci[oó]n gramatical:?/i, ''), 320)}`
          )
          job.cites.push({ kind: 'morfologia', module: mod.name, entry: candidate })
          break
        }
        if (entry) break
      }
    }
    return job
  }

  // ---- 4) Temas (Nave y tematicos reales)
  const rawTheme = themeWords(query) || (parsed ? '' : query)
  const verseThemes = verseHtml ? verseThemeWords(verseHtml) : []
  const esBookName = parsed
    ? bookName(CANONICAL_BOOKS.find((b) => b.code === parsed.book) ?? CANONICAL_BOOKS[0], 'es').toLowerCase()
    : ''
  const themeForCtx =
    parsed && rawTheme && esBookName.includes(rawTheme.toLowerCase()) ? '' : rawTheme

  const themeJob = async (): Promise<Job> => {
    const job: Job = { kind: 'tema', title: `Temas (${rawTheme || '—'})`, entries: [], cites: [] }
    if (!rawTheme) return job
    const topicMods = hook.modules
      .filter((m) => SPECIAL_RE.tema?.test(m.name))
      .slice(0, 2)
    for (const mod of topicMods) {
      const entry = await safe(hook.lookup(mod.name, rawTheme), null)
      if (!entry) continue
      job.entries.push(`[${shortName(moduleLabel(mod))} · ${rawTheme}] ${trimEntry(entry, 520)}`)
      job.cites.push({ kind: 'tema', module: mod.name, entry: rawTheme })
    }
    return job
  }

  const geoJob = async (): Promise<Job> => {
    const job: Job = { kind: 'historico', title: 'Contexto historico y geografico', entries: [], cites: [] }
    if (!parsed) return job
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
      job.entries.push(`[${shortName(moduleLabel(mod))} · ${esName}] ${trimEntry(entry, 560)}`)
      job.cites.push({ kind: 'historico', module: mod.name, entry: esName })
    }
    return job
  }

  const contextJobs: Array<Promise<Job>> = (
    [
      { kind: 'teologico', title: 'Contexto teologico y sistematico' } as const,
      { kind: 'cultural', title: 'Contexto social y cultural' } as const,
      { kind: 'cristologico', title: 'Contexto cristologico' } as const,
      { kind: 'filosofico', title: 'Contexto filosofico' } as const,
      { kind: 'aplicacion', title: 'Puentes pastorales y aplicacion' } as const
    ] as Array<{ kind: AgentCitation['kind']; title: string }>
  ).map((agent) =>
    (async (): Promise<Job> => {
      const job: Job = { kind: agent.kind, title: agent.title, entries: [], cites: [] }
      if (!themeForCtx && !verseThemes.length) return job
      const order = SPECIAL_ORDER[agent.kind]
      const mods = hook.modules
        .filter(
          (m) =>
            SPECIAL_RE[agent.kind]?.test(m.name) &&
            (m.category === 'Dictionary' || m.category === 'Lexicon' || m.category === 'GenBook')
        )
        .sort(order ? (a, b) => order(a.name) - order(b.name) : undefined)
        .slice(0, 2)
      const topics = [
        ...topicVariants(themeForCtx),
        ...verseThemes.flatMap((w) => topicVariants(w.toUpperCase()))
      ].slice(0, 6)
      for (const mod of mods) {
        let entry: string | null = null
        let usedTopic = ''
        for (const topic of topics) {
          entry = await safe(hook.lookup(mod.name, topic), null)
          if (entry) {
            usedTopic = topic
            break
          }
        }
        if (!entry) continue
        job.entries.push(`[${shortName(moduleLabel(mod))} · ${usedTopic}] ${trimEntry(entry, 520)}`)
        job.cites.push({ kind: agent.kind, module: mod.name, entry: usedTopic })
        break
      }
      return job
    })()
  )

  // Walton-Keener (Contexto Cultural) es un COMENTARIO: se mina verso por verso
  // y alimenta el Contexto social/cultural con su entrada real del pasaje.
  const waltonJob = async (): Promise<Job> => {
    const job: Job = { kind: 'cultural', title: 'Contexto social y cultural (verso)', entries: [], cites: [] }
    if (!parsed) return job
    const walton = hook.modules.find(
      (m) => m.category === 'Commentary' && /walton|keener|contexto cultural/i.test(m.name)
    )
    if (!walton) return job
    const entry = await safe(
      hook.verse(walton.name, parsed.book, parsed.chapter, parsed.verse ?? 1),
      null
    )
    if (entry?.text) {
      job.entries.push(`[${shortName(walton.name)}] ${trimEntry(entry.text, 560)}`)
      job.cites.push({ kind: 'cultural', module: walton.name, entry: refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1) })
    }
    return job
  }

  // Exegesis critica por verso: Metzger, aparato critico, interlineal Cevallos,
  // codigo textual... lo que tenga cobertura en este versiculo.
  const criticoJob = async (): Promise<Job> => {
    const job: Job = { kind: 'critico', title: 'Exegesis critica e interlineal', entries: [], cites: [] }
    if (!parsed) return job
    const critMods = hook.modules
      .filter((m) => m.category === 'Commentary' && SPECIAL_RE.critico?.test(m.name))
      .slice(0, 2)
    for (const mod of critMods) {
      const entry = await safe(
        hook.verse(mod.name, parsed.book, parsed.chapter, parsed.verse ?? 1),
        null
      )
      if (!entry?.text) continue
      job.entries.push(`[${shortName(mod.name)}] ${trimEntry(entry.text, 560)}`)
      job.cites.push({ kind: 'critico', module: mod.name, entry: refEntry(parsed.book, parsed.chapter, parsed.verse ?? 1) })
    }
    return job
  }

  // Teologias Sistematicas GENBOOK (Hodge, Grudem, MacArthur, Chafer...):
  // buscan el tema/letras del verso dentro del cuerpo del libro .refi.
  // Historia (Josefo/Gonzalez/Fox) se ancla mejor por el NOMBRE del libro biblico.
  const bookJobs = (
    kind: AgentCitation['kind'],
    modRe: RegExp,
    title: string,
    prefersBookName = false
  ): Promise<Job> =>
    (async (): Promise<Job> => {
      const job: Job = { kind, title, entries: [], cites: [] }
      const esName = parsed
        ? bookName(CANONICAL_BOOKS.find((b) => b.code === parsed.book) ?? CANONICAL_BOOKS[0], 'es')
        : ''
      const topicsForBook = (
        prefersBookName && esName ? [esName] : []
      )
        .concat((themeForCtx ? [themeForCtx] : []).concat(verseThemes))
        .slice(0, 2)
      if (!topicsForBook.length) return job
      const bookMods = hook.modules
        .filter((m) => m.category === 'GenBook' && modRe.test(m.name))
        .slice(0, 2)
      const skip = /^(contenido|portada|indice|datos)/i
      for (const mod of bookMods) {
        let done = false
        for (const topicWord of topicsForBook) {
          if (done) break
          const found = await safe(hook.search(topicWord, [mod.name], 4), [])
          const hit = found.find((r) => !skip.test(r.book))
          if (!hit) continue
          job.entries.push(`[${shortName(moduleLabel(mod))} · ${hit.book}] ${trimEntry(hit.text, 520)}`)
          job.cites.push({ kind, module: mod.name, entry: hit.book })
          done = true
        }
      }
      return job
    })()

  const sistematicaJob = (): Promise<Job> =>
    bookJobs('sistematica', SPECIAL_RE.sistematica ?? /teologia sistematica|dogmatica/i, 'Teologia sistematica')

  const historiaJob = (): Promise<Job> =>
    bookJobs(
      'historia',
      SPECIAL_RE.historia ?? /josefo|martires/i,
      'Historia y contexto cristiano',
      true
    )

  const illusJob = async (): Promise<Job> => {
    const job: Job = { kind: 'ilustracion', title: 'Ilustraciones', entries: [], cites: [] }
    const illusTopics = (rawTheme ? [rawTheme] : []).concat(verseThemes).slice(0, 3)
    if (!illusTopics.length) return job
    const illusMods = hook.modules
      .filter(
        (m) =>
          SPECIAL_RE.ilustracion?.test(m.name) &&
          (m.category === 'Dictionary' || m.category === 'Lexicon' || m.category === 'GenBook')
      )
      .slice(0, 2)
    for (const mod of illusMods) {
      let done = false
      for (const topicWord of illusTopics) {
        if (done) break
        const found = await safe(hook.search(topicWord, [mod.name], 3), [])
        const topic = found[0]?.book
        if (!topic) continue
        const entry = await safe(hook.lookup(mod.name, topic), null)
        if (!entry) continue
        job.entries.push(`[${shortName(moduleLabel(mod))} · ${topic}] ${trimEntry(entry, 480)}`)
        job.cites.push({ kind: 'ilustracion', module: mod.name, entry: topic })
        done = true
      }
    }
    return job
  }

  // Casos biblicos REALES para ilustrar a partir de Nave / Donde Hallarlo /
  // Thompson / concordancias tematicas: solo entradas con contenido real.
  const casoJob = async (): Promise<Job> => {
    const job: Job = { kind: 'caso', title: 'Casos biblicos reales', entries: [], cites: [] }
    if (!parsed) return job
    const esName = bookName(
      CANONICAL_BOOKS.find((b) => b.code === parsed.book) ?? CANONICAL_BOOKS[0],
      'es'
    )
    const topicsFor = ([esName] as string[]).concat(themeForCtx ? [themeForCtx] : []).concat(verseThemes).slice(0, 3)
    const mods = hook.modules
      .filter((m) => m.category === 'Dictionary' && /donde hallarlo|nave|tematico|thompson/i.test(m.name))
      .sort((a, b) => Number(/donde hallarlo/i.test(b.name)) - Number(/donde hallarlo/i.test(a.name)))
      .slice(0, 2)
    for (const mod of mods) {
      let done = false
      for (const topic of topicsFor.flatMap(topicVariants)) {
        if (done) break
        const entry = await safe(hook.lookup(mod.name, topic), null)
        if (!entry) continue
        const plain = stripTags(entry)
        if (plain.length < 120) continue
        job.entries.push(`[${shortName(moduleLabel(mod))} · ${topic}] ${trimEntry(entry, 520)}`)
        job.cites.push({ kind: 'caso', module: mod.name, entry: topic })
        done = true
      }
    }
    return job
  }

  // ---- 4b) Paralelos y analogias (Lambert): temas ↔ referencias cruzadas.
  const refsJob = async (): Promise<Job> => {
    const job: Job = { kind: 'referencia', title: 'Paralelos y referencias cruzadas (Lambert)', entries: [], cites: [] }
    const topicsForRefs = (themeForCtx ? [themeForCtx] : []).concat(verseThemes).slice(0, 3)
    if (!topicsForRefs.length) return job
    const refMods = hook.modules.filter((m) => SPECIAL_RE.referencia?.test(m.name)).slice(0, 1)
    for (const mod of refMods) {
      for (const topic of topicsForRefs.flatMap(topicVariants)) {
        const entry = await safe(hook.lookup(mod.name, topic), null)
        if (!entry) continue
        job.entries.push(`[${shortName(moduleLabel(mod))} · ${topic}] ${trimEntry(entry, 560)}`)
        job.cites.push({ kind: 'referencia', module: mod.name, entry: topic })
        break
      }
    }
    return job
  }

  const jobs = await Promise.all([
    commentJob(),
    outlineJob(),
    strongsJob(),
    idiomasJob(),
    morfologiaJob(),
    themeJob(),
    geoJob(),
    ...contextJobs,
    waltonJob(),
    criticoJob(),
    sistematicaJob(),
    historiaJob(),
    casoJob(),
    refsJob(),
    illusJob()
  ])

  // Ensamble canonico: el presupuesto se consume en orden fijo (determinista).
  for (const job of jobs) {
    citations.push(...job.cites)
    addSection(job.kind, job.title, job.entries)
  }

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
    // 1º biblia del panel activo, 2º biblia con Strong# (markup explotable),
    // 3º español, luego alfabético.
    const selA = hook.selectedModule && a.name === hook.selectedModule ? 0 : 1
    const selB = hook.selectedModule && b.name === hook.selectedModule ? 0 : 1
    if (selA !== selB) return selA - selB
    const stA = /strong/i.test(a.name) ? 0 : 1
    const stB = /strong/i.test(b.name) ? 0 : 1
    if (stA !== stB) return stA - stB
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
