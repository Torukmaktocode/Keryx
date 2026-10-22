/**
 * Sub-agente de presentación (0 tokens): convierte el AST inmutable del
 * sermón (SermonDocument) en EXACTAMENTE 10 diapositivas listas para PPTX.
 * Puro: sin IA, sin redondeos de contenido. Cada texto sale del AST con su
 * fallback garantizado (patrón slotText); si el módulo no dio el dato, la
 * diapositiva se rellena con OTRA pieza real del documento, jamás con
 * texto inventado.
 */
import type { SermonDocument, Slot } from './sermonEngine'

const esPlaceholder = (value: string): boolean =>
  /\[(?:[^\]]*por completar[^\]]*|concreto[^]]*|marca[^\]]*|la herida|donde se repite|sintesis doctrinal|caso moderno|llamado concreto|redacta la oraci|completa la gran idea)/i.test(value)

interface Bloques {
  secciones: Array<{ titulo: string; parrafos: string[] }>
  texto: string[]
  granIdea: string
  oracion: string
}

/** Puro: parte un markdown (## secciones, bullets, parrafos) en bloques. */
export function bloquesDe(markdown: string): Bloques {
  const secciones: Bloques['secciones'] = []
  let actual: { titulo: string; parrafos: string[] } = { titulo: '', parrafos: [] }
  const push = (): void => {
    if (actual.parrafos.length) secciones.push(actual)
  }
  const granMatch = /gran idea[^:]*:\s*(.+)/i
  let granIdea = ''
  for (const raw of markdown.split('\n')) {
    const line = raw.trim()
    const heading = /^#{1,4}\s+(.*)$/.exec(line)
    if (heading) {
      push()
      actual = { titulo: heading[1], parrafos: [] }
      continue
    }
    if (!line) continue
    const gran = granMatch.exec(line)
    if (gran && !granIdea) {
      granIdea = gran[1].trim()
      continue
    }
    const parrafo = line
      .replace(/^>\s?/, '')
      .replace(/^-\s/, '')
      .replace(/^\*\*(.+)\*\*$/, '$1')
      .trim()
    if (parrafo && !esPlaceholder(parrafo)) actual.parrafos.push(parrafo)
  }
  push()
  const texto: string[] = []
  let oracion = ''
  for (const s of secciones) {
    const normalizado = s.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    if (/^texto base/.test(normalizado)) texto.push(...s.parrafos)
    if (/^oracion/.test(normalizado)) oracion = s.parrafos[0] ?? ''
  }
  return { secciones, texto, granIdea, oracion }
}

const CONTEXTO_LABELS: Array<[RegExp, string]> = [
  [/^contexto historico/, 'Historia'],
  [/^contexto teologico/, 'Teología'],
  [/^contexto cristologico/, 'Cristo'],
  [/^contexto social/, 'Cultura'],
  [/^contexto filosofico/, 'Filosofía']
]

const seccionDe = (bloques: Bloques, patron: RegExp): string[] =>
  bloques.secciones.find((s) => patron.test(s.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')))?.parrafos ?? []

/**
 * Adaptador puro (0 tokens): convierte cualquier resultado del Asistente
 * (Estudio completo, Devocional completo, mensajes) en el AST del documento
 * de presentacion. Solo reorganiza contenido real del markdown; los huecos
 * quedan vacios y buildSlides los rellena con OTRA pieza real del documento.
 */
export function documentDesdeTexto(ref: string, markdown: string, kicker: string): SermonDocument {
  const bloques = bloquesDe(markdown)
  const puntosFuente = seccionDe(bloques, /^bosquejo/)
  const comentarios = seccionDe(bloques, /^comentario verso/)
  const basePuntos = (puntosFuente.length ? puntosFuente : comentarios).slice(0, 5)
  const senales = ['Primeramente…', 'En segundo lugar…', 'Y para concluir…', 'Para el punto 4…', 'Para el punto 5…']
  const puntos = basePuntos.map((parrafo, index) => ({
    signal: senales[index] ?? '',
    title: truncate(parrafo, 60),
    evidence: '',
    bridge: { text: parrafo } as Slot
  }))
  const contexto: SermonDocument['contexto'] = []
  for (const [patron, label] of CONTEXTO_LABELS) {
    const first = seccionDe(bloques, patron)[0]
    if (first) contexto.push({ label, text: truncate(first, 140) })
  }
  const citas = bloques.texto.filter((t) => t.length > 60).slice(1, 3)
  return {
    ref,
    orador: kicker,
    personaId: '',
    voiceHeader: '',
    presentacionKicker: kicker,
    gancho: { fallback: '', text: bloques.texto[0] },
    intro: { fallback: '' },
    texto: bloques.texto,
    granIdea: bloques.granIdea,
    contexto,
    palabras: seccionDe(bloques, /^palabras originales/).slice(0, 4),
    forma: '',
    puntos,
    citas,
    casoReal: seccionDe(bloques, /^ilustracion biblica/).slice(0, 2),
    ilustracion: seccionDe(bloques, /^ilustraciones ancladas/).slice(0, 2),
    consenso: seccionDe(bloques, /^teologia sistematica/).slice(0, 3),
    aplicacion: seccionDe(bloques, /^aplicacion/).slice(0, 2),
    meditacion: { fallback: '' },
    cierre: { recap: bloques.texto[1] ?? bloques.texto[0] ?? '', llamado: '', bendicion: '' },
    oracion: { fallback: '', text: bloques.oracion },
    fuentes: [],
    dossierChars: 0
  }
}

export type SlideKind =
  | 'titulo'
  | 'granIdea'
  | 'contexto'
  | 'punto'
  | 'ilustracion'
  | 'cita'
  | 'aplicacion'
  | 'meditacion'
  | 'texto'
  | 'palabras'
  | 'consenso'
  | 'cierre'

export interface PSlide {
  kind: SlideKind
  /** Kicker pequeño (señal oral, orador…). */
  kicker?: string
  title: string
  lines: string[]
  quote?: string
}

export const TARGET_SLIDES = 10

const MAX_TITLE = 64
const MAX_LINE = 150
const MAX_LINES = 3
const MAX_QUOTE = 190

function clean(value: string): string {
  return value
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncate(value: string, max: number): string {
  const text = clean(value)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const space = cut.lastIndexOf(' ')
  return `${cut.slice(0, space > max * 0.6 ? space : max)}…`
}

function slotText(slot: Slot): string {
  return (slot.text?.trim() || slot.fallback).trim()
}

/** Recorta un texto en hasta `maxLines` frases, cada una hasta `maxLen`. */
export function takeLines(text: string, maxLines = MAX_LINES, maxLen = MAX_LINE): string[] {
  const parts = clean(text)
    .split(/(?<=[.!?…:])\s+/)
    .filter((part) => part.length > 1)
  const lines: string[] = []
  let current = ''
  for (const part of parts) {
    const candidate = current ? `${current} ${part}` : part
    if (candidate.length > maxLen) {
      if (current) lines.push(truncate(current, maxLen))
      if (lines.length >= maxLines) return lines
      current = ''
      lines.push(truncate(part, maxLen))
      if (lines.length >= maxLines) return lines
    } else {
      current = candidate
      if (current.length >= maxLen * 0.8 && lines.length + 1 < maxLines) {
        lines.push(truncate(current, maxLen))
        current = ''
      }
    }
  }
  if (current && lines.length < maxLines) lines.push(truncate(current, maxLen))
  return lines
}

function puntoContent(punto: SermonDocument['puntos'][number]): string {
  const bridge = slotText(punto.bridge)
  if (bridge && bridge.length > 20) return bridge
  return clean(punto.evidence)
}

function rellenoDeTexto(doc: SermonDocument): PSlide {
  const texto =
    doc.texto.slice(2, 8).find((t) => clean(t).length > 60) ??
    (clean(doc.texto[1] ?? '').length > 60 ? doc.texto[1] : '') ??
    ''
  if (texto) return { kind: 'texto', title: doc.ref, lines: takeLines(texto, 2, 220) }
  return { kind: 'texto', title: doc.ref, lines: takeLines(slotText(doc.meditacion) || doc.granIdea, 2, 220) }
}

function shiftFrom(pool: PSlide[], doc: SermonDocument): PSlide {
  const [next] = pool.splice(0, 1)
  return next ?? rellenoDeTexto(doc)
}

function fillersOf(doc: SermonDocument): PSlide[] {
  const pool: PSlide[] = []
  if (slotText(doc.meditacion)) {
    pool.push({ kind: 'meditacion', kicker: 'Y para la semana…', title: 'Frase para meditar', lines: [], quote: truncate(slotText(doc.meditacion), MAX_QUOTE) })
  }
  const extra = doc.texto.slice(1).find((line) => clean(line).length > 40)
  if (extra) pool.push({ kind: 'texto', title: doc.ref, lines: takeLines(extra, 2, 220) })
  if (doc.palabras.length) {
    pool.push({ kind: 'palabras', title: 'Palabras originales', lines: doc.palabras.slice(0, 2).map((p) => truncate(p, 150)) })
  }
  if (doc.consenso.length) {
    pool.push({ kind: 'consenso', title: 'Consenso doctrinal', lines: doc.consenso.slice(0, 3).map((c) => truncate(c, 150)) })
  }
  const segundaCita = doc.citas[1]
  if (segundaCita) pool.push({ kind: 'cita', title: 'Frase clave', lines: [], quote: truncate(segundaCita, MAX_QUOTE) })
  if (slotText(doc.gancho)) {
    pool.push({ kind: 'cita', kicker: 'El texto abre la puerta…', title: doc.ref, lines: [], quote: truncate(slotText(doc.gancho), MAX_QUOTE) })
  }
  for (const texto of doc.texto.slice(2, 8)) {
    if (clean(texto).length > 60) {
      pool.push({ kind: 'texto', title: doc.ref, lines: takeLines(texto, 2, 220) })
    }
  }
  return pool
}

/** Estructura fija de 10 diapositivas a partir del AST. */
export function buildSlides(doc: SermonDocument): PSlide[] {
  const pool = fillersOf(doc)
  const slides: PSlide[] = []

  slides.push({
    kind: 'titulo',
    kicker: doc.presentacionKicker ? clean(doc.presentacionKicker) : `Sermón · ${clean(doc.orador)}`,
    title: truncate(doc.ref, MAX_TITLE),
    lines: [],
    quote: doc.texto.length ? truncate(doc.texto[0], MAX_QUOTE) : truncate(slotText(doc.gancho), MAX_QUOTE)
  })
  slides.push({
    kind: 'granIdea',
    title: 'Gran idea',
    lines: takeLines(doc.granIdea, 2, 200)
  })
  if (doc.contexto.length) {
    slides.push({
      kind: 'contexto',
      title: 'Contexto',
      lines: doc.contexto.slice(0, 3).map((c) => `${c.label}: ${truncate(c.text, 95)}`)
    })
  }

  const puntoSlides: PSlide[] = doc.puntos.slice(0, 3).map((punto) => ({
    kind: 'punto',
    kicker: clean(punto.signal),
    title: truncate(punto.title, MAX_TITLE),
    lines: takeLines(puntoContent(punto), 2, 190)
  }))
  while (puntoSlides.length < 3) {
    puntoSlides.push(shiftFrom(pool, doc))
  }
  slides.push(...puntoSlides)

  const ilustracion = clean(doc.casoReal[0] ?? doc.ilustracion[0] ?? '')
  if (ilustracion) {
    slides.push({ kind: 'ilustracion', title: 'Ilustración', lines: takeLines(ilustracion, 2, 200) })
  } else {
    slides.push(shiftFrom(pool, doc))
  }

  const cita = clean(doc.citas[0] ?? doc.consenso[0] ?? '')
  if (cita) {
    slides.push({ kind: 'cita', title: 'Frase clave', lines: [], quote: truncate(cita, MAX_QUOTE) })
  } else {
    slides.push(shiftFrom(pool, doc))
  }

  const aplicacion = doc.aplicacion.slice(0, 2).map((a) => truncate(a, 160))
  if (aplicacion.length) {
    slides.push({ kind: 'aplicacion', title: 'Aplicación', lines: aplicacion })
  } else {
    slides.push({
      kind: 'aplicacion',
      title: 'Aplicación',
      lines: takeLines(doc.cierre.recap, 2, 160)
    })
  }

  while (slides.length < TARGET_SLIDES - 1 && pool.length) {
    slides.push(shiftFrom(pool, doc))
  }

  slides.push({
    kind: 'cierre',
    kicker: 'Y para concluir…',
    title: 'Cierre y oración',
    lines: [truncate(doc.cierre.recap, 110), truncate(doc.cierre.llamado, 110)].filter(Boolean),
    quote: truncate(slotText(doc.oracion), MAX_QUOTE)
  })

  return slides.slice(0, TARGET_SLIDES)
}

/** Tamaño de fuente del cuerpo según densidad (legibilidad en proyector). */
export function bodyFontSize(slide: PSlide): number {
  const chars = [...slide.lines, slide.quote ?? ''].join(' ').length
  if (slide.kind === 'titulo') return 30
  if (chars <= 120) return 26
  if (chars <= 260) return 22
  return 19
}
