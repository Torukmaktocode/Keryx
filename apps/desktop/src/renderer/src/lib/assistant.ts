import { bookName, findBook, type AppSettings, type SwordModule } from '@keryx/core'
import { runCreator } from './creator'
import type { SermonDocument } from './sermonEngine'
import type { MineProgressReporter } from './agents'

export type AssistantMode = 'crearsermon' | 'crearestudio' | 'creardevocional'

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
  /** AST inmutable del sermón (solo modo economía de «crearsermon»):
   *  alimenta el sub-agente de presentación y la exportación PPTX. */
  sermonDoc?: SermonDocument
}

export type AssistantStepId =
  | 'intent'
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

export const ASSISTANT_MODES: AssistantMode[] = ['crearsermon', 'crearestudio', 'creardevocional']

const ENTIDADES: Record<string, string> = {
  nbsp: ' ', laquo: '\u00ab', raquo: '\u00bb', ldquo: '\u201c', rdquo: '\u201d',
  lsquo: '\u2018', rsquo: '\u2019', hellip: '\u2026', mdash: '\u2014', ndash: '\u2013',
  bull: '\u2022', middot: '\u00b7', deg: '\u00b0', sect: '\u00a7', para: '\u00b6',
  iexcl: '\u00a1', iquest: '\u00bf', apos: "'", quot: '"'
}
for (const [nombre, code] of [
  ['aacute', 225], ['eacute', 233], ['iacute', 237], ['oacute', 243], ['uacute', 250],
  ['ntilde', 241], ['agrave', 224], ['egrave', 232], ['igrave', 236], ['ograve', 242],
  ['ugrave', 249], ['acirc', 226], ['ecirc', 234], ['icirc', 238], ['ocirc', 244],
  ['ucirc', 251], ['atilde', 227], ['otilde', 245], ['auml', 228], ['euml', 235],
  ['iuml', 239], ['ouml', 246], ['uuml', 252], ['szlig', 223]
] as Array<[string, number]>) {
  const letra = String.fromCharCode(code)
  const mayus = String.fromCharCode(code - 32)
  const nombreMayus = nombre.replace(/^\w/, (inicial: string) => inicial.toUpperCase())
  ENTIDADES[nombre] = letra
  ENTIDADES[nombreMayus] = mayus
}

const EXTRAER_ENTIDAD = /&#x([0-9a-fA-F]+);|&#(\d+);|&([a-zA-Z]+);/g

function decodificarEntidades(texto: string): string {
  return texto.replace(EXTRAER_ENTIDAD, (match, hex, dec, nombre) => {
    if (hex) {
      const code = parseInt(hex, 16)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
    }
    if (dec) {
      const code = Number(dec)
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match
    }
    if (nombre === 'amp') return '&'
    const letra = ENTIDADES[nombre] ?? ENTIDADES[nombre.toLowerCase()]
    return letra ?? match
  })
}

export const stripTags = (value: string): string =>
  decodificarEntidades(
    value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  ).trim()

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
  const creator = await runCreator(ctx, mode, trimmed, ctx.personaId ?? 'peterson', onStep, onProgress)
  return { ...creator, elapsedMs: performance.now() - started }
}

export const ASSISTANT_EXAMPLES: Record<AssistantMode, string[]> = {
  crearsermon: ['Juan 3:16', 'Salmos 23', 'Filipenses 2:1-11'],
  crearestudio: ['Romanos 12:1-2', 'Genesis 1', 'Marcos 4:35-41'],
  creardevocional: ['Salmos 91', 'Lamentaciones 3:22-23', 'Mateo 11:28-30']
}
