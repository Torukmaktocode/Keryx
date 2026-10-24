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
  const aperturas = markdown
    .split('\n')
    .filter((line) => /^> \*(?:Como lo abrió Jesús|Como lo habló )/.test(line))
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
    aperturas,
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
    // citas ancladas del dosier: [Modulo · entrada] no se proyectan en pantalla
    .replace(/\[[^\]]*·[^\]]*\]/g, ' ')
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

/** Corta en frontera de frase (o coma); la elipsis solo si no hubo frontera. */
export function cortaFrase(value: string, max: number): string {
  const text = clean(value)
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const fin = Math.max(
    cut.lastIndexOf('. '),
    cut.lastIndexOf('.'),
    cut.lastIndexOf('! '),
    cut.lastIndexOf('? '),
    cut.lastIndexOf('…')
  )
  const frontera = fin > max * 0.5 ? fin + 1 : Math.max(cut.lastIndexOf(','), cut.lastIndexOf(' '))
  return `${cut.slice(0, frontera > 0 ? frontera : max).trimEnd()}…`
}

/** Trocea en frases PROYECTABLES: frontera de frase y máximo por línea. */
export function lineasProyectables(text: string, maxLines = MAX_LINES, maxLen = MAX_LINE): string[] {
  const parts = clean(text)
    .split(/(?<=[.!?…])\s+/)
    .filter((part) => part.length > 1)
  const lines: string[] = []
  let current = ''
  for (const part of parts) {
    const candidate = current ? `${current} ${part}` : part
    if (candidate.length > maxLen) {
      if (current) lines.push(cortaFrase(current, maxLen))
      if (lines.length >= maxLines) return lines
      current = ''
      lines.push(cortaFrase(part, maxLen))
      if (lines.length >= maxLines) return lines
    } else {
      current = candidate
      if (current.length >= maxLen * 0.7 && lines.length + 1 < maxLines) {
        lines.push(cortaFrase(current, maxLen))
        current = ''
      }
    }
  }
  if (current && lines.length < maxLines) lines.push(cortaFrase(current, maxLen))
  return lines.map((line) => (line.length > maxLen ? `${line.slice(0, maxLen).trimEnd()}…` : line))
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

/** Clave de comparacion para no repetir contenido entre diapositivas. */
function claveDe(value: string): string {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü ]/g, '')
    .slice(0, 70)
}

/* ════════════════════════════════════════════════════════════════════════
   EQUIPO DE SUB-AGENTES DE PRESENTACION (codigo puro, 0 tokens)
   Cada agente es especialista en una parte del deck y devuelve CANDIDATOS
   ordenados por preferencia (todos con contenido real del AST, cortados en
   frontera de frase y sin citas de modulos en pantalla). El orquestador
   consume en orden, deduplica contra el deck y rellena los huecos con las
   reservas de los otros agentes: presentacion completa, detallada y lista
   para proyectar, SIN IA.
   ════════════════════════════════════════════════════════════════════════ */

export type AgenteSlide = (
  doc: SermonDocument,
  usados: Set<string>
) => PSlide[]

const SENALES_PUNTO = ['Primeramente…', 'En segundo lugar…', 'Y para concluir…', 'Para el punto 4…', 'Para el punto 5…']

/** Kicker de portada: etiqueta del genero + orador (si hay). */
function kickerPortada(doc: SermonDocument): string {
  if (doc.presentacionKicker) return clean(doc.presentacionKicker)
  const orador = clean(doc.orador)
  return orador ? `Sermón · ${orador}` : 'Sermón'
}

/** AGENTE DE PORTADA: referencia + el versiculo/anclaje del mensaje. */
export const agentePortada: AgenteSlide = (doc, usados) => {
  const anclaje = clean(doc.texto[0] ?? slotText(doc.gancho) ?? '')
  if (!anclaje) return []
  usados.add(claveDe(anclaje))
  return [
    {
      kind: 'titulo',
      kicker: kickerPortada(doc),
      title: truncate(doc.ref, MAX_TITLE),
      lines: [],
      quote: cortaFrase(anclaje, MAX_QUOTE)
    }
  ]
}

/** AGENTE DE GRAN IDEA: la sintesis doctrinal en 2-3 frases proyectables. */
export const agenteGranIdea: AgenteSlide = (doc, usados) => {
  const candidatos = [
    doc.granIdea,
    slotText(doc.intro),
    slotText(doc.gancho),
    ...doc.puntos.map((p) => slotText(p.bridge))
  ]
  const out: PSlide[] = []
  for (const candidato of candidatos) {
    if (clean(candidato).length < 30 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    out.push({ kind: 'granIdea', title: 'Gran idea', lines: takeLines(candidato, 3, 150) })
    break
  }
  return out
}

/** AGENTE DE TEXTO: el pasaje biblico entero, frase a frase, para leerlo en voz alta. */
export const agenteTexto: AgenteSlide = (doc, usados) => {
  const out: PSlide[] = []
  for (const pieza of doc.texto.slice(0, 4)) {
    if (clean(pieza).length < 40 || usados.has(claveDe(pieza))) continue
    usados.add(claveDe(pieza))
    out.push({ kind: 'texto', title: doc.ref, lines: takeLines(pieza, 3, 190) })
  }
  return out
}

/** AGENTE DE CONTEXTO: historia, teologia, cultura — una linea por dato. */
export const agenteContexto: AgenteSlide = (doc, usados) => {
  const lineas: string[] = []
  for (const c of doc.contexto) {
    if (usados.has(claveDe(c.text))) continue
    usados.add(claveDe(c.text))
    lineas.push(truncate(`${c.label}: ${c.text}`, 110))
    if (lineas.length >= 3) break
  }
  if (!lineas.length) return []
  return [{ kind: 'contexto', title: 'Contexto', lines: lineas }]
}

/** AGENTE DE PUNTOS: los 3 primeros con su senal oral y puente detallado. */
export const agentePuntos: AgenteSlide = (doc, usados) => {
  const out: PSlide[] = []
  for (const [index, punto] of doc.puntos.slice(0, 5).entries()) {
    const contenido = puntoContent(punto)
    if (!contenido || usados.has(claveDe(contenido))) continue
    usados.add(claveDe(contenido))
    out.push({
      kind: 'punto',
      kicker: clean(punto.signal) || SENALES_PUNTO[index] || '',
      title: truncate(punto.title, MAX_TITLE),
      lines: takeLines(contenido, 3, 150)
    })
  }
  return out
}

/** AGENTE DE ILUSTRACION: el caso real o la imagen anclada. */
export const agenteIlustracion: AgenteSlide = (doc, usados) => {
  for (const candidato of [...doc.casoReal, ...doc.ilustracion, ...doc.texto.slice(1, 4)]) {
    if (clean(candidato).length < 40 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    return [{ kind: 'ilustracion', title: 'Ilustración', lines: takeLines(candidato, 3, 170) }]
  }
  return []
}

/** AGENTE DE FRASE CLAVE: cita, consenso doctrinal o el versiculo clave. */
export const agenteFraseClave: AgenteSlide = (doc, usados) => {
  const candidatos = [
    ...doc.citas,
    ...doc.consenso,
    ...doc.texto.slice(1, 6),
    slotText(doc.gancho),
    slotText(doc.meditacion)
  ]
  for (const candidato of candidatos) {
    if (clean(candidato).length < 30 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    return [{ kind: 'cita', title: 'Frase clave', lines: [], quote: cortaFrase(candidato, MAX_QUOTE) }]
  }
  return []
}

/** AGENTE DE APLICACION: la vida real — casa, trabajo, iglesia. */
export const agenteAplicacion: AgenteSlide = (doc, usados) => {
  const lineas: string[] = []
  for (const a of doc.aplicacion) {
    if (usados.has(claveDe(a))) continue
    usados.add(claveDe(a))
    lineas.push(truncate(a, 160))
    if (lineas.length >= 3) break
  }
  if (!lineas.length) {
    for (const fuente of [doc.cierre.recap, doc.cierre.llamado]) {
      if (clean(fuente).length < 20 || usados.has(claveDe(fuente))) continue
      usados.add(claveDe(fuente))
      lineas.push(truncate(fuente, 160))
      if (lineas.length >= 2) break
    }
  }
  if (!lineas.length) return []
  return [{ kind: 'aplicacion', title: 'Aplicación', lines: lineas }]
}

/** AGENTE DE PALABRAS ORIGINALES: Strong# proyectable (2 terminos). */
export const agentePalabras: AgenteSlide = (doc, usados) => {
  const lineas: string[] = []
  for (const p of doc.palabras) {
    if (usados.has(claveDe(p))) continue
    usados.add(claveDe(p))
    lineas.push(truncate(p, 150))
    if (lineas.length >= 2) break
  }
  if (!lineas.length) return []
  return [{ kind: 'palabras', title: 'Palabras originales', lines: lineas }]
}

/** AGENTE DE MEDITACION Y CONSENSO: piezas devocionales y doctrinales. */
export const agenteMeditacion: AgenteSlide = (doc, usados) => {
  for (const candidato of [slotText(doc.meditacion), ...doc.consenso, slotText(doc.oracion)]) {
    if (clean(candidato).length < 40 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    return [
      {
        kind: 'meditacion',
        kicker: 'Y para la semana…',
        title: 'Frase para meditar',
        lines: [],
        quote: cortaFrase(candidato, MAX_QUOTE)
      }
    ]
  }
  return []
}

/** AGENTE DE RESERVAS: el resto del material real, listo para rellenar huecos. */
export const agenteReservas: AgenteSlide = (doc, usados) => {
  const out: PSlide[] = []
  const candidatos = [...doc.texto.slice(1, 10), ...doc.consenso, ...doc.citas, ...doc.palabras]
  for (const candidato of candidatos) {
    if (clean(candidato).length < 40 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    out.push({ kind: 'texto', title: doc.ref, lines: takeLines(candidato, 3, 190) })
  }
  return out
}

/** AGENTE DE ULTIMA INSTANCIA: piezas honestas del cierre (bendicion, recap,
 * llamado) cuando todo el material ya salio; jamas texto inventado. */
export const agenteUltimaInstancia: AgenteSlide = (doc, usados) => {
  const out: PSlide[] = []
  for (const candidato of [doc.cierre.bendicion, doc.cierre.recap, doc.cierre.llamado]) {
    if (clean(candidato).length < 15 || usados.has(claveDe(candidato))) continue
    usados.add(claveDe(candidato))
    out.push({
      kind: 'cita',
      kicker: 'Y para la semana…',
      title: 'Frase para meditar',
      lines: [],
      quote: cortaFrase(candidato, MAX_QUOTE)
    })
  }
  return out
}

/** Orquestador del equipo: arma EXACTAMENTE 10 diapositivas con la prioridad
 * de un mensaje en vivo (portada → idea → texto → 3 puntos → ilustración →
 * frase clave → aplicación → cierre con oración) y completa huecos con las
 * reservas reales (contexto, palabras, meditación, más texto). */
export function componerPresentacion(doc: SermonDocument): PSlide[] {
  const usados = new Set<string>()
  const slides: PSlide[] = []
  const reservas: PSlide[] = []

  const fijos: AgenteSlide[] = [agentePortada, agenteGranIdea, agenteTexto]
  for (const agente of fijos) {
    const candidatos = agente(doc, usados)
    if (candidatos.length) slides.push(candidatos[0])
    reservas.push(...candidatos.slice(1))
  }

  const puntos = agentePuntos(doc, usados)
  for (const slide of puntos.slice(0, 3)) slides.push(slide)
  reservas.push(...puntos.slice(3))

  for (const agente of [agenteIlustracion, agenteFraseClave, agenteAplicacion]) {
    const candidatos = agente(doc, usados)
    if (candidatos.length) slides.push(candidatos[0])
    reservas.push(...candidatos.slice(1))
  }

  reservas.push(
    ...agenteContexto(doc, usados),
    ...agentePalabras(doc, usados),
    ...agenteMeditacion(doc, usados),
    ...agenteReservas(doc, usados),
    ...agenteUltimaInstancia(doc, usados)
  )

  for (const reserva of reservas) {
    if (slides.length >= TARGET_SLIDES - 1) break
    slides.push(reserva)
  }

  const oracion = slotText(doc.oracion)
  const recap = usados.has(claveDe(doc.cierre.recap)) ? '' : truncate(doc.cierre.recap, 110)
  const llamado = usados.has(claveDe(doc.cierre.llamado)) ? '' : truncate(doc.cierre.llamado, 110)
  slides.push({
    kind: 'cierre',
    kicker: 'Y para concluir…',
    title: 'Cierre y oración',
    lines: [recap, llamado].filter(Boolean),
    quote: oracion ? truncate(oracion, MAX_QUOTE) : undefined
  })

  return slides.slice(0, TARGET_SLIDES)
}

/** Alias historico del orquestador (misma API de siempre). */
export function buildSlides(doc: SermonDocument): PSlide[] {
  return componerPresentacion(doc)
}

/** Tamaño de fuente del cuerpo según densidad (legibilidad en proyector). */
export function bodyFontSize(slide: PSlide): number {
  const chars = [...slide.lines, slide.quote ?? ''].join(' ').length
  if (slide.kind === 'titulo') return 30
  if (chars <= 120) return 26
  if (chars <= 260) return 22
  return 19
}

/* ── Sub-agente de redaccion (IA opcional, 1 pasada corta) ───────────── */

const SISTEMA_PULEO =
  'Eres un redactor de diapositivas para predicacion y ensenanza. Recibes el ESQUELETO de una presentacion ya construida ' +
  'con contenido biblico anclado por codigo. Tu trabajo SOLO es de redaccion para proyeccion: (1) cada diapositiva con 1-2 frases ' +
  'de maximo 14 palabras cada una, legibles desde el fondo de una sala; (2) lenguaje pastoral, calido y claro, sin jerga academica; ' +
  '(3) NO inventes datos, versiculos, nombres ni cifras: usa SOLAMENTE el contenido de cada diapositiva; (4) sin corchetes, sin ' +
  'referencias de modulos, sin siglas de Strong en pantalla; (5) los titulos se quedan cortos y concretos; (6) respeta el orden y ' +
  'la cantidad de diapositivas. Formato EXACTO de respuesta:\n' +
  '==SLIDE 1==\nTITULO: ...\nLINEA: ...\nLINEA: ...\nCITA: ...\n' +
  'LINEA solo si la diapositiva lo tenia; CITA solo si la diapositiva lo tenia.'

export function pidePuleo(doc: SermonDocument, slides: PSlide[]): { system: string; user: string } {
  const esqueleto = slides
    .map((slide, index) =>
      [
        `==SLIDE ${index + 1}==`,
        `TIPO: ${slide.kind}`,
        `TITULO: ${slide.title}`,
        ...slide.lines.map((line) => `LINEA: ${line}`),
        ...(slide.quote ? [`CITA: ${slide.quote}`] : [])
      ].join('\n')
    )
    .join('\n\n')
  return {
    system: SISTEMA_PULEO,
    user: `REFERENCIA/TEMA: ${doc.ref}\n\n${esqueleto}`
  }
}

/** Puro: rellena los textos redactados sobre el esqueleto base; sin respuesta
 * valida, el deck de codigo queda intacto (nunca se pierde la presentacion). */
export function parsePuleo(text: string, base: PSlide[]): PSlide[] {
  const bloques = new Map<number, { titulo?: string; lineas: string[]; cita?: string }>()
  const patron = /==\s*SLIDE\s+(\d+)\s*==([\s\S]*?)(?=$|==\s*SLIDE\s+\d+\s*==)/gi
  for (const match of text.matchAll(patron)) {
    const index = Number(match[1]) - 1
    if (index < 0 || index >= base.length) continue
    const cuerpo = match[2] ?? ''
    const lineas: string[] = []
    let titulo: string | undefined
    let cita: string | undefined
    for (const line of cuerpo.split('\n')) {
      const t = /^TITULO:\s*(.+)$/i.exec(line.trim())
      const l = /^LINEA:\s*(.+)$/i.exec(line.trim())
      const c = /^CITA:\s*(.+)$/i.exec(line.trim())
      if (t) titulo = t[1].trim()
      else if (l) lineas.push(l[1].trim())
      else if (c) cita = c[1].trim()
    }
    if (titulo || lineas.length || cita) bloques.set(index, { titulo, lineas, cita })
  }
  if (!bloques.size) return base
  return base.map((slide, index) => {
    const puleo = bloques.get(index)
    if (!puleo) return slide
    return {
      ...slide,
      title: puleo.titulo?.slice(0, MAX_TITLE) || slide.title,
      lines: puleo.lineas.length ? puleo.lineas.slice(0, MAX_LINES) : slide.lines,
      quote: puleo.cita?.slice(0, MAX_QUOTE) ?? slide.quote
    }
  })
}
