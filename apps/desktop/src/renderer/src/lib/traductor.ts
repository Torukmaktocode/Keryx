/**
 * Traducción en tiempo real (renderer) — sub-agente de código, 0 tokens.
 * El motor vive en el main process (daemon Python + Argos Translate, offline
 * tras la primera descarga). Aquí: cache LRU, hooks de React, normalización
 * de idiomas y traducción de Markdown por bloques que PRESERVA la estructura
 * y jamás toca las citas ancladas [Módulo · entrada].
 */
import { useEffect, useState } from 'react'
import { api } from './api'

export const IDIOMAS: string[] = ['es', 'en', 'pt', 'it', 'fr', 'de', 'zh']

/** Lenguas nativas: sección propia en el selector (motores CT2 dialectales). */
export const NATIVAS: string[] = ['arn', 'gn', 'qu', 'ay', 'bn']

export type NivelTraduccion = 'verificado' | 'experimental' | 'original'

export interface RefVerso {
  code: string
  cap: number
  ver: number
}

export function normalizarIdioma(code?: string | null): string {
  const value = (code ?? '').toLowerCase()
  if (!value) return ''
  if (value.startsWith('zh')) return 'zh'
  if (NATIVAS.includes(value.slice(0, 3))) return value.slice(0, 3)
  return value.slice(0, 2)
}

/** Texto plano de un HTML de módulo (los <w data-strong>, <i>, <b> viajan como texto). */
export function plainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/* ── Cache LRU (re-render y volver al pasaje = instantáneo) ──────────── */

const CACHE_MAX = 3000
const cache = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()
const suscriptores = new Set<() => void>()
/** Claves incluidas en un lote en curso: los hooks esperan el lote
 * en vez de emitir llamadas individuales que compiten en el daemon. */
const lotesEnVuelo = new Map<string, Promise<void>>()

function cacheKey(source: string, target: string, text: string): string {
  return `${source}>${target}:${text}`
}

function cacheGet(key: string): string | undefined {
  const value = cache.get(key)
  if (value !== undefined) {
    cache.delete(key)
    cache.set(key, value)
  }
  return value
}

function cacheSet(key: string, value: string): void {
  if (cache.has(key)) cache.delete(key)
  cache.set(key, value)
  if (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
  for (const fn of [...suscriptores]) fn()
}

/** Espera a que un lote en curso llene la cache antes de emitir una
 * llamada individual: el daemon es secuencial y los 36 hooks compiten
 * contra el lote del capitulo. Espera maximo 2 s y luego degrada. */
function esperarLote(text: string, src: string, tgt: string, maxMs = 2000): Promise<string | null> {
  const key = cacheKey(src, tgt, text)
  const hit = cacheGet(key)
  if (hit !== undefined) return Promise.resolve(hit)
  const lote = lotesEnVuelo.get(key)
  if (lote) {
    return lote.then(() => cacheGet(key) ?? null)
  }
  return new Promise((resolve) => {
    const inicio = Date.now()
    const tick = (): void => {
      const valor = cacheGet(key)
      if (valor !== undefined) {
        suscriptores.delete(tick)
        resolve(valor)
        return
      }
      const vuelo = lotesEnVuelo.get(key)
      if (vuelo) {
        suscriptores.delete(tick)
        void vuelo.then(() => resolve(cacheGet(key) ?? null))
        return
      }
      if (Date.now() - inicio > maxMs) {
        suscriptores.delete(tick)
        resolve(null)
        return
      }
      setTimeout(tick, 80)
    }
    suscriptores.add(tick)
    setTimeout(tick, 80)
  })
}

function esParFaltante(message: string): boolean {
  return /no instalado|Paquete de idioma/i.test(message)
}

async function instalarPar(source: string, target: string): Promise<void> {
  try {
    await api.translate.install({ source, target })
  } catch {
    // Sin red o paquete inexistente: la traducción degrada al original.
  }
}

/** Traduce un bloque; auto-instala el par (directo o vía pivote 'en') una vez. */
export async function traducirTexto(text: string, source: string, target: string): Promise<string> {
  const src = normalizarIdioma(source)
  const tgt = normalizarIdioma(target)
  if (!text.trim() || !src || !tgt || src === tgt) return text
  const key = cacheKey(src, tgt, text)
  const hit = cacheGet(key)
  if (hit !== undefined) return hit
  const flying = inflight.get(key)
  if (flying) return flying
  const promise = (async () => {
    try {
      let out: string
      try {
        out = await api.translate.translate({ source: src, target: tgt, text })
      } catch (error) {
        if (!esParFaltante(error instanceof Error ? error.message : String(error))) throw error
        await instalarPar(src, tgt)
        out = await api.translate.translate({ source: src, target: tgt, text })
      }
      if (out !== text) {
        cacheSet(key, out)
        nivelSet(key, 'experimental')
      }
      return out
    } catch {
      return text
    } finally {
      inflight.delete(key)
    }
  })()
  inflight.set(key, promise)
  return promise
}

/* ── Nivel de cada traduccion (para los chips ✓/≈/—) ─────────────────── */

const corpusMeta = new Map<string, string>()

function metaCorpus(lang: string): string | undefined {
  return corpusMeta.get(lang)
}

const niveles = new Map<string, { nivel: NivelTraduccion; fuente?: string }>()

function nivelGet(key: string): { nivel: NivelTraduccion; fuente?: string } | undefined {
  return niveles.get(key)
}

function nivelSet(key: string, nivel: NivelTraduccion, fuente?: string): void {
  niveles.set(key, { nivel, fuente })
}

/* ── Progreso de carga por idioma (barra y ms en el selector) ────────── */

export interface CargaIdioma {
  estado: 'cargando' | 'listo'
  total: number
  listo: number
  inicioMs: number
  listoMs?: number
  msFinal?: number
}

const cargas = new Map<string, CargaIdioma>()
const suscriptoresCarga = new Set<() => void>()

function cargaSet(lang: string, carga: CargaIdioma): void {
  cargas.set(lang, carga)
  for (const fn of [...suscriptoresCarga]) fn()
}

export function suscribirCargas(fn: () => void): () => void {
  suscriptoresCarga.add(fn)
  return () => suscriptoresCarga.delete(fn)
}

export function cargaDe(lang: string): CargaIdioma | null {
  return cargas.get(lang) ?? null
}

const VENTANA_LISTO_MS = 2500

export function formatoDuracion(ms: number): string {
  if (ms < 1000) return `${Math.max(1, Math.round(ms / 10) * 10)} ms`
  return `${(ms / 1000).toFixed(1).replace('.', ',')} s`
}

export function msDeCarga(carga: CargaIdioma): number | null {
  if (carga.estado === 'cargando') return Date.now() - carga.inicioMs
  if (carga.listoMs && Date.now() - carga.listoMs < VENTANA_LISTO_MS) return carga.msFinal ?? null
  return null
}

/** Hook de suscripcion al progreso de un idioma: tiquea cada 100 ms
 * mientras corre el contador y abre una ventana breve para el ms final. */
export function useCargaIdioma(lang: string): CargaIdioma | null {
  const [carga, setCarga] = useState<CargaIdioma | null>(cargaDe(lang))
  const [, forzar] = useState(0)
  useEffect(() => suscribirCargas(() => setCarga(cargaDe(lang))), [lang])
  useEffect(() => {
    if (!carga) return
    if (carga.estado === 'cargando') {
      const id = setInterval(() => forzar((n) => n + 1), 100)
      return () => clearInterval(id)
    }
    if (!carga.listoMs) return
    const id = setTimeout(() => forzar((n) => n + 1), VENTANA_LISTO_MS)
    return () => clearTimeout(id)
  }, [carga])
  return carga
}

/* ── Estado del motor (disponibilidad, para avisos honestos) ─────────── */

let estadoMotor: { available: boolean; pairs: string[] } | null = null

/** Estado del motor; el valor negativo NO se cachea: si el daemon murió y
 * el watchdog del main lo relanzó, la próxima consulta se revalida sola. */
export async function estadoTraduccion(): Promise<{ available: boolean; pairs: string[] }> {
  if (estadoMotor?.available) return estadoMotor
  try {
    estadoMotor = await api.translate.status()
  } catch {
    estadoMotor = { available: false, pairs: [] }
  }
  return estadoMotor
}

export function invalideEstadoTraduccion(): void {
  estadoMotor = null
}

/** Traduce por lote (1 capitulo = 1-2 llamadas). Con referencias canonicas
 * primero consulta el corpus paralelo (Nivel 1 verificado, instantaneo) y
 * solo lo no cubierto va al motor neural (Nivel 2 experimental). Devuelve el
 * lote alineado al orden de entrada (original si no aplica). */
export async function traducirLoteMulti(
  items: Array<{ texto: string; lang?: string | null; ref?: RefVerso | null; corpus?: boolean }>,
  target: string,
  opciones: { silencioso?: boolean } = {}
): Promise<string[]> {
  const tgt = normalizarIdioma(target)
  const salida = items.map((item) => plainText(item.texto))
  const originales = salida.slice()
  if (!tgt || tgt === 'off' || tgt === 'es' || !items.length) return salida

  /* Dedupe de lotes en vuelo: el efecto del Lector re-dispara con la misma
   * firma (misma locale y capitulo) mientras colVerses re-renderiza; sin
   * esto cada re-disparo encola un lote neural duplicado detras del anterior. */
  const firmaLote = `${tgt}:${originales.length}:${originales[0].slice(0, 60)}`
  const enVuelo = lotesCapitulo.get(firmaLote)
  if (enVuelo) return enVuelo
  const ejecucion = ejecutarLoteMulti(items, salida, originales, tgt, opciones.silencioso === true)
  lotesCapitulo.set(firmaLote, ejecucion)
  void ejecucion.finally(() => lotesCapitulo.delete(firmaLote))
  return ejecucion
}

const lotesCapitulo = new Map<string, Promise<string[]>>()
/** Lotes visibles en vuelo por idioma: solo el último que termina marca
 * "listo" (evita que un lote traslape el estado de otro del mismo idioma). */
const vuelosPorLang = new Map<string, number>()

function cargaIniciar(lang: string, total: number): void {
  const previa = cargas.get(lang)
  cargaSet(lang, {
    estado: 'cargando',
    total,
    listo: 0,
    inicioMs: previa?.estado === 'cargando' ? previa.inicioMs : Date.now()
  })
}

function cargaProgreso(lang: string, total: number, listo: number): void {
  const previa = cargas.get(lang)
  if (previa?.estado !== 'cargando') return
  cargaSet(lang, { estado: 'cargando', total, listo, inicioMs: previa.inicioMs })
}

function cargaTerminar(lang: string, total: number): void {
  const previa = cargas.get(lang)
  const inicio = previa?.inicioMs ?? Date.now()
  const ahora = Date.now()
  cargaSet(lang, {
    estado: 'listo',
    total,
    listo: total,
    inicioMs: inicio,
    listoMs: ahora,
    msFinal: Math.max(1, ahora - inicio)
  })
}

async function ejecutarLoteMulti(
  items: Array<{ texto: string; lang?: string | null; ref?: RefVerso | null; corpus?: boolean }>,
  salida: string[],
  originales: string[],
  tgt: string,
  silencioso = false
): Promise<string[]> {
  const vuelos = (vuelosPorLang.get(tgt) ?? 0) + 1
  if (!silencioso) {
    vuelosPorLang.set(tgt, vuelos)
    cargaIniciar(tgt, items.length)
  }
  /* Nivel 1: corpus paralelo por referencia (texto real de Sociedades
   * Biblicas/Wycliffe). Una unica llamada para todo el lote. Los items
   * con corpus:false (columnas no-Base en comparativa) saltan el corpus
   * y traducen su propio texto para conservar el matiz de cada version. */
  const conRef = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => Boolean(item.ref) && item.corpus !== false && NATIVAS.includes(tgt))
  const resueltos = new Set<number>()
  if (conRef.length) {
    try {
      const respuesta = await api.translate.verso({
        items: conRef.map(({ item }) => ({
          lang: tgt,
          code: item.ref!.code,
          cap: item.ref!.cap,
          ver: item.ref!.ver
        }))
      })
      if (respuesta) {
        const fuente = respuesta.meta?.[tgt]?.fuente
        if (fuente) corpusMeta.set(tgt, fuente)
        for (const [, { index, item }] of conRef.entries()) {
          const claveRef = `${tgt}:${item.ref!.code}:${item.ref!.cap}:${item.ref!.ver}`
          const texto = respuesta.versos[claveRef]
          if (!texto) continue
          const src = normalizarIdioma(item.lang) || 'es'
          salida[index] = texto
          resueltos.add(index)
          cacheSet(cacheKey(src, tgt, originales[index]), texto)
          nivelSet(cacheKey(src, tgt, originales[index]), 'verificado', metaCorpus(tgt))
        }
      }
    } catch {
      // sin corpus o sin daemon: los versiculos caen al motor neural
    }
  }

  const porLang = new Map<string, number[]>()
  for (const [index, { lang }] of items.entries()) {
    if (resueltos.has(index)) continue
    const limpio = salida[index]
    if (!limpio || limpio.length < 4) continue
    const src = normalizarIdioma(lang)
    if (!src || src === tgt) continue
    const enCache = cacheGet(cacheKey(src, tgt, originales[index]))
    if (enCache !== undefined) {
      salida[index] = enCache
      continue
    }
    const indices = porLang.get(src) ?? []
    if (!indices.includes(index)) indices.push(index)
    porLang.set(src, indices)
  }
  if (!silencioso) {
    const pendientes = [...porLang.values()].reduce((n, lista) => n + lista.length, 0)
    if (pendientes) cargaProgreso(tgt, items.length, items.length - pendientes)
    else if (vuelos <= 1) cargaTerminar(tgt, items.length)
  }
  await Promise.all(
    [...porLang.entries()].map(async ([src, indices]) => {
      const LOTE = 120
      const grupos: number[][] = []
      for (let base = 0; base < indices.length; base += LOTE) grupos.push(indices.slice(base, base + LOTE))
      await Promise.all(
        grupos.map(async (grupo) => {
          const claves = grupo.map((index) => cacheKey(src, tgt, originales[index]))
          const promesa = (async () => {
            try {
              const respuesta = await api.translate.batch({
                source: src,
                target: tgt,
                items: grupo.map((index) => originales[index])
              })
              for (const [pos, traducido] of (respuesta ?? []).entries()) {
                const index = grupo[pos]
                if (index === undefined || !traducido) continue
                salida[index] = traducido
                const clave = cacheKey(src, tgt, originales[index])
                if (traducido !== originales[index]) {
                  cacheSet(clave, traducido)
                  nivelSet(clave, 'experimental')
                }
              }
            } catch {
              // sin motor o sin paquete: los hooks degradan al original
            } finally {
              for (const clave of claves) lotesEnVuelo.delete(clave)
              if (!silencioso) {
                const previa = cargaDe(tgt)
                if (previa?.estado === 'cargando')
                  cargaProgreso(
                    tgt,
                    previa.total,
                    Math.min(previa.listo + grupo.length, previa.total)
                  )
              }
            }
          })()
          for (const clave of claves) lotesEnVuelo.set(clave, promesa)
          await promesa
        })
      )
    })
  )
  if (silencioso) return salida
  const restantes = (vuelosPorLang.get(tgt) ?? 1) - 1
  if (restantes > 0) {
    vuelosPorLang.set(tgt, restantes)
    return salida
  }
  vuelosPorLang.delete(tgt)
  cargaTerminar(tgt, items.length)
  return salida
}

export async function traducirLote(textos: string[], source: string, target: string): Promise<void> {
  await traducirLoteMulti(textos.map((texto) => ({ texto, lang: source })), target)
}

/* ── Precalentado de TODOS los idiomas (cambio instantaneo entre idiomas) ── */

const precalentados = new Set<string>()
let cadenaPrecalentado: Promise<void> = Promise.resolve()

/** Traduce el contenido actual hacia TODOS los idiomas instalados (en
 * segundo plano, en cadena) para que cambiar de idioma sea instantaneo. */
export function precalentarOtrosIdiomas(
  items: Array<{ texto: string; lang?: string | null }>,
  actual: string
): void {
  const tgtActual = normalizarIdioma(actual)
  if (!tgtActual || tgtActual === 'off' || !items.length) return
  /* Con una lengua nativa activa la cola del daemon se respeta: la precarga
   * de los idiomas mayores saturaria el motor neural justo cuando el lector
   * necesita el lote nativo. Al cambiar a un idioma mayor se precalienta alli. */
  if (NATIVAS.includes(tgtActual)) return
  const firma = `${tgtActual}:${items.length}:${plainText(items[0]?.texto ?? '').slice(0, 60)}`
  for (const idioma of IDIOMAS) {
    if (idioma === 'es' || idioma === tgtActual) continue
    const clave = `${idioma}@${firma}`
    if (precalentados.has(clave)) continue
    precalentados.add(clave)
    const itemsIdioma = items.map((item) => ({ texto: item.texto, lang: item.lang ?? 'es' }))
    cadenaPrecalentado = cadenaPrecalentado.then(async () => {
      await traducirLoteMulti(itemsIdioma, idioma, { silencioso: true })
    })
  }
}

/* ── Hooks ───────────────────────────────────────────────────────────── */

export interface TraducidoEstado {
  out: string
  cargando: boolean
  activo: boolean
  revertido: boolean
  revertir: () => void
  nivel?: NivelTraduccion
  fuente?: string
}

/**
 * Traduce un bloque de texto plano cuando el idioma de destino difiere del
 * idioma del módulo. Devuelve el original mientras carga y permite reviertir.
 */
export function useTranslated(text: string, sourceLang?: string | null, target?: string): TraducidoEstado {
  const [out, setOut] = useState(text)
  const [cargando, setCargando] = useState(false)
  const [revertido, setRevertido] = useState(false)
  const src = normalizarIdioma(sourceLang)
  const tgt = normalizarIdioma(target)
  const activo = Boolean(tgt) && tgt !== 'off' && Boolean(src) && src !== tgt && !revertido

  useEffect(() => {
    setOut(text)
    setRevertido(false)
  }, [text, sourceLang, target])

  useEffect(() => {
    if (!activo || !tgt) return
    let alive = true
    setCargando(true)
    void (async () => {
      const delLote = await esperarLote(text, src, tgt, NATIVAS.includes(tgt) ? 90_000 : 2000)
      if (!alive) return
      if (delLote !== null) {
        setOut(delLote)
        setCargando(false)
        return
      }
      traducirTexto(text, src, tgt)
        .then((res) => {
          if (alive) {
            setOut(res)
            setCargando(false)
          }
        })
        .catch(() => {
          if (alive) setCargando(false)
        })
    })()
    return () => {
      alive = false
    }
  }, [activo, text, src, tgt])

  const info = activo && !revertido ? nivelGet(cacheKey(src, tgt, text)) : undefined
  return {
    out: activo ? out : text,
    cargando: activo && cargando,
    activo,
    revertido,
    revertir: () => setRevertido(true),
    nivel: info?.nivel,
    fuente: info?.fuente
  }
}

/* ── Markdown por bloques (Asistente): estructura y citas intactas ───── */

const CITACION = /\[[^\]]+·[^\]]+\]/
const LINEA_ESTRUCTURAL_QUOTE = /^(Voz:|💬|\*\*Tu petición|\*Señal para predicar|Dosier:|Forma de la voz)/

export interface TraductorFn {
  (text: string, source: string): Promise<string>
}

/** Puro e inyectable (testeable): traduce el texto, no la estructura ni las citas. */
export async function translateMarkdownCon(markdown: string, fn: TraductorFn): Promise<string> {
  const lines = markdown.split('\n')
  const out: string[] = []
  for (const line of lines) {
    if (!line.trim()) {
      out.push(line)
      continue
    }
    if (CITACION.test(line) || LINEA_ESTRUCTURAL_QUOTE.test(line.replace(/^>\s?/, ''))) {
      out.push(line)
      continue
    }
    const heading = /^(#{1,6}\s+)(.*)$/.exec(line)
    if (heading) {
      out.push(`${heading[1]}${await fn(heading[2], 'es')}`)
      continue
    }
    const quote = /^>\s?(.*)$/.exec(line)
    if (quote) {
      out.push(`> ${await fn(quote[1], 'es')}`)
      continue
    }
    const bullet = /^-\s(.*)$/.exec(line)
    if (bullet) {
      out.push(`- ${await fn(bullet[1], 'es')}`)
      continue
    }
    out.push(await fn(line, 'es'))
  }
  return out.join('\n')
}

export async function translateMarkdown(markdown: string, target: string): Promise<string> {
  return translateMarkdownCon(markdown, (text, source) => traducirTexto(text, source, target))
}

const PREFIJO_ESTRUCTURAL = /^(#{1,6}\s+|>\s?|-\s)/

/** Markdown por LOTE (sermones, guias): 1-2 llamadas translate_batch para el
 * documento entero en vez de N llamadas individuales encadenadas. Preserva
 * la estructura (títulos, citas, bullets) y las lineas citacionales intactas. */
export async function translateMarkdownLote(markdown: string, target: string): Promise<string> {
  const tgt = normalizarIdioma(target)
  if (!markdown.trim() || !tgt || tgt === 'off' || tgt === 'es') return markdown
  const lines = markdown.split('\n')
  const items: Array<{ texto: string; lang?: string | null }> = []
  const mapa: number[] = []
  lines.forEach((line, index) => {
    if (!line.trim()) return
    if (CITACION.test(line) || LINEA_ESTRUCTURAL_QUOTE.test(line.replace(/^>\s?/, ''))) return
    items.push({ texto: line.replace(PREFIJO_ESTRUCTURAL, ''), lang: 'es' })
    mapa.push(index)
  })
  if (!items.length) return markdown
  const salida = await traducirLoteMulti(items, tgt)
  const porLinea = new Map<number, string>()
  mapa.forEach((indexLinea, idx) => {
    const traducido = salida[idx]
    if (traducido) porLinea.set(indexLinea, traducido)
  })
  return lines
    .map((line, index) => {
      const traducido = porLinea.get(index)
      if (traducido === undefined) return line
      const marca = PREFIJO_ESTRUCTURAL.exec(line)
      return marca ? `${marca[1]}${traducido}` : traducido
    })
    .join('\n')
}

/** HTML mínimo del Markdown ya traducido (estructura preservada). */
export function markdownTraducidoToHtml(markdown: string): string {
  const lines = markdown.split('\n')
  const html: string[] = []
  for (const line of lines) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      const level = Math.min(4, heading[1].length + 1)
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
    } else if (/^>\s?/.test(line)) {
      html.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`)
    } else if (/^-\s/.test(line)) {
      html.push(`<ul><li>${inline(line.slice(2))}</li></ul>`)
    } else if (!line.trim()) {
      html.push('')
    } else {
      html.push(`<p>${inline(line)}</p>`)
    }
  }
  return html.join('\n')
}

function inline(text: string): string {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
