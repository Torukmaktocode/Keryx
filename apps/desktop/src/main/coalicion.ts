import { app } from 'electron'
import { createInterface } from 'node:readline'
import { createReadStream, existsSync } from 'node:fs'
import { join } from 'node:path'
import type { CoalicionItem, CoalicionRequest } from '@keryx/core'

interface Articulo {
  titulo: string
  autores: string[]
  fecha: string
  temas: string[]
  url: string
  texto: string
}

let cache: Promise<Articulo[] | null> | null = null

function archivo(): string | null {
  const recursos = (process as unknown as { resourcesPath?: string }).resourcesPath
  const pruebas: Array<() => string | null> = [
    () => (process.env.KERYX_COALICION_PATH ? join(process.env.KERYX_COALICION_PATH, 'articulos.jsonl') : null),
    () => (recursos ? join(recursos, 'coalicion', 'articulos.jsonl') : null),
    () => join(process.cwd(), 'coalicion', 'articulos.jsonl'),
    () => join(app.getAppPath(), '..', 'coalicion', 'articulos.jsonl'),
    () => join(app.getAppPath(), '..', '..', 'coalicion', 'articulos.jsonl'),
    () => join(app.getPath('userData'), 'coalicion', 'articulos.jsonl')
  ]
  for (const prueba of pruebas) {
    const candidato = prueba()
    if (candidato && existsSync(candidato)) return candidato
  }
  return null
}

const SIN_ACENTO = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const VACIAS = new Set([
  'la', 'el', 'los', 'las', 'de', 'del', 'y', 'en', 'que', 'a', 'con', 'para',
  'por', 'un', 'una', 'sobre', 'es', 'son', 'como', 'mas', 'su', 'sus', 'al',
  'the', 'of', 'to', 'and', 'in', 'for', 'on', 'no', 'si', 'o', 'u', 'se',
  'capitulo', 'verso', 'versiculo', 'biblia', 'reyes', 'antiguo', 'nuevo'
])

function tokenizar(s: string): string[] {
  return SIN_ACENTO(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3 && !VACIAS.has(t))
}

function extraer(texto: string, max = 560): string {
  const plano = texto.replace(/\b>\s+/g, ' ').replace(/\s+/g, ' ').trim()
  if (plano.length <= max) return plano
  const deja = plano.slice(0, max)
  const corte = Math.max(deja.lastIndexOf('. '), deja.lastIndexOf('! '), deja.lastIndexOf('? '), deja.lastIndexOf('” '))
  return corte > 140 ? deja.slice(0, corte + 1) : `${deja.trim()}…`
}

async function cargar(): Promise<Articulo[] | null> {
  if (!cache) {
    cache = (async () => {
      const ruta = archivo()
      if (!ruta) return null
      const articulos: Articulo[] = []
      const lector = createInterface({ input: createReadStream(ruta, 'utf8'), crlfDelay: Infinity })
      for await (const linea of lector) {
        if (!linea.trim()) continue
        try {
          const o = JSON.parse(linea) as Articulo & Record<string, unknown>
          if (o.vacio || typeof o.texto !== 'string' || o.texto.length < 400) continue
          articulos.push({
            titulo: String(o.titulo ?? ''),
            autores: Array.isArray(o.autor) ? o.autor.map((a) => String(a?.nombre ?? '')) : [],
            fecha: String(o.fecha ?? '').slice(0, 10),
            temas: Array.isArray(o.temas) ? o.temas.map(String) : [],
            url: String(o.url ?? ''),
            texto: o.texto.slice(0, 2600).replace(/\s+/g, ' ').trim()
          })
        } catch {
          continue
        }
      }
      return articulos
    })().catch(() => null)
  }
  return cache
}

export async function buscarCoalicion(req: CoalicionRequest): Promise<CoalicionItem[]> {
  const articulos = await cargar()
  if (!articulos?.length) return []
  const tokens = [...new Set(tokenizar(req.consulta))].slice(0, 12)
  if (!tokens.length) return []
  const limite = req.limite ?? 3
  const resultados: Array<{ item: CoalicionItem; puntaje: number; fecha: string }> = []
  for (const a of articulos) {
    const slugTemas = new Set(a.temas.flatMap((t) => SIN_ACENTO(t).split('-')))
    let puntaje = 0
    for (const t of tokens) {
      if (slugTemas.has(t)) puntaje += 4
      else if (a.temas.some((tema) => SIN_ACENTO(tema).includes(t))) puntaje += 2
      if (SIN_ACENTO(a.titulo).includes(t)) puntaje += 3
      if (a.texto.slice(0, 400).toLowerCase().includes(t)) puntaje += 1
    }
    if (puntaje < 4) continue
    resultados.push({
      puntaje,
      fecha: a.fecha,
      item: {
        titulo: a.titulo,
        autores: a.autores.filter(Boolean),
        fecha: a.fecha,
        temas: a.temas,
        url: a.url,
        extracto: extraer(a.texto)
      }
    })
  }
  return resultados
    .sort((x, y) => y.puntaje - x.puntaje || y.fecha.localeCompare(x.fecha))
    .slice(0, limite)
    .map((r) => r.item)
}
