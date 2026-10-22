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

export function normalizarIdioma(code?: string | null): string {
  const value = (code ?? '').toLowerCase()
  if (!value) return ''
  if (value.startsWith('zh')) return 'zh'
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
      cacheSet(key, out)
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

/* ── Estado del motor (disponibilidad, para avisos honestos) ─────────── */

let estadoMotor: { available: boolean; pairs: string[] } | null = null

export async function estadoTraduccion(): Promise<{ available: boolean; pairs: string[] }> {
  if (estadoMotor) return estadoMotor
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

/* ── Hooks ───────────────────────────────────────────────────────────── */

export interface TraducidoEstado {
  out: string
  cargando: boolean
  activo: boolean
  revertido: boolean
  revertir: () => void
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
    void traducirTexto(text, src, tgt)
      .then((res) => {
        if (alive) {
          setOut(res)
          setCargando(false)
        }
      })
      .catch(() => {
        if (alive) setCargando(false)
      })
    return () => {
      alive = false
    }
  }, [activo, text, src, tgt])

  return {
    out: activo ? out : text,
    cargando: activo && cargando,
    activo,
    revertido,
    revertir: () => setRevertido(true)
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
