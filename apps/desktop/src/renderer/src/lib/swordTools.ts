/**
 * Registro tipado de herramientas de datos (el "harness"): toda consulta a
 * la biblioteca pasa por aqui — entrada validada, cache por request y costo
 * de presupuesto declarado. Los sub-agentes componen herramientas, no SQL.
 *
 * 0 tokens por diseño: todo es TypeScript + SQLite local.
 */
import type { ModuleCoverage, SwordModule } from '@keryx/core'

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
  search: (
    query: string,
    modules: string[],
    limit: number
  ) => Promise<Array<{ module: string; book: string; chapter: number; verse: number; text: string }>>
}

export interface ToolResult {
  ok: boolean
  data: string
  cite: string
}

export interface SwordTool {
  name: string
  /** Costo maximo de presupuesto que consume su resultado. */
  budget: number
  /** Ejecuta la herramienta con entrada validada; jamas lanza. */
  run(req: ToolRequest): Promise<ToolResult | null>
}

export interface ToolRequest {
  module: string
  key: string
  maxChars: number
  hook: AgentHook
}

/** Cache por clave (module+key) para dedupe intra-build: dos agentes que
 * piden "GALILEA" a Martens comparten una sola consulta SQLite. */
export class ToolCache {
  private map = new Map<string, Promise<ToolResult | null>>()

  getOrCreate(key: string, factory: () => Promise<ToolResult | null>): Promise<ToolResult | null> {
    const cached = this.map.get(key)
    if (cached) return cached
    const promise = factory().catch(() => null)
    this.map.set(key, promise)
    return promise
  }
}

/** Herramienta: lookup de diccionario con recorte y cita garantizados. */
export function lookupTool(name: string, budget: number): SwordTool {
  return {
    name,
    budget,
    run: async (req: ToolRequest): Promise<ToolResult | null> => {
      const raw = await req.hook.lookup(req.module, req.key)
      if (!raw) return null
      const plain = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (plain.length < 40) return null
      const data = plain.length <= req.maxChars ? plain : `${plain.slice(0, req.maxChars)}…`
      return { ok: true, data, cite: `${req.module} · ${req.key}` }
    }
  }
}

/** Herramienta: busqueda full-text en GenBooks/commentaries (casos, consenso). */
export function searchTool(name: string, budget: number): SwordTool {
  return {
    name,
    budget,
    run: async (req: ToolRequest): Promise<ToolResult | null> => {
      const hits = await req.hook.search(req.key, [req.module], 4)
      const hit = hits[0]
      if (!hit) return null
      const plain = hit.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      if (plain.length < 40) return null
      const data = plain.length <= req.maxChars ? plain : `${plain.slice(0, req.maxChars)}…`
      return { ok: true, data, cite: `${req.module} · ${hit.book}` }
    }
  }
}

/** Ejecuta una lista de {tool, req} en paralelo con timeout grupal. */
export async function runTools(
  jobs: Array<{ tool: SwordTool; req: ToolRequest }>,
  timeoutMs = 8000
): Promise<Array<{ job: (typeof jobs)[number]; result: ToolResult | null }>> {
  const wrapped = jobs.map(async (job) => ({
    job,
    result: await Promise.race([
      job.tool.run(job.req).catch(() => null),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))
    ])
  }))
  return Promise.all(wrapped)
}

/** Llena los requests de modulo+key contra los modulos disponibles que
 * cumplen el regex, ordenados por rank (0 = mejor). */
export function expandToolRequests(
  hook: AgentHook,
  modRe: RegExp,
  keys: Array<string>,
  maxModules: number,
  rank?: (name: string) => number
): Array<{ module: string; key: string }> {
  const mods = hook.modules
    .filter(
      (m) =>
        modRe.test(m.name) &&
        (m.category === 'Dictionary' || m.category === 'Lexicon' || m.category === 'GenBook')
    )
    .sort(rank ? (a, b) => rank(a.name) - rank(b.name) : undefined)
    .slice(0, maxModules)
  const out: Array<{ module: string; key: string }> = []
  for (const mod of mods) {
    for (const key of keys) out.push({ module: mod.name, key })
  }
  return out
}
