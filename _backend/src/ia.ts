import { importSPKI, jwtVerify } from 'jose'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

const VENTANA_MS = 60_000
const MAX_POR_MINUTO = 20
const GOLPES = new Map<string, number[]>()

function limitar(email: string, ahora = Date.now()): boolean {
  const previos = (GOLPES.get(email) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= MAX_POR_MINUTO) return false
  previos.push(ahora)
  GOLPES.set(email, previos)
  return true
}

interface PayloadLicencia {
  tipo?: string
  sub?: string
  exp?: number
  estado?: string
}

export async function emailDeLicencia(env: Env, jwt: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(jwt, await importSPKI(env.LICENCIA_PUBLICA, 'EdDSA'))
    if (payload.tipo !== 'licencia') return null
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null
    const estado = String(payload.estado ?? '')
    if (!['trial', 'activa', 'cancelada', 'gracia'].includes(estado)) return null
    return String(payload.sub ?? '') || null
  } catch {
    return null
  }
}

interface CuerpoIa {
  licencia?: string
  model?: string
  messages?: Array<{ role?: string; content?: string }>
  temperature?: number
  maxTokens?: number
}

export async function manejarIa(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as CuerpoIa | null
  if (!cuerpo?.licencia || !Array.isArray(cuerpo.messages) || cuerpo.messages.length === 0) {
    return rtaError('faltan datos', 'formato', 400)
  }
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)
  if (!limitar(email)) return rtaError('demasiadas peticiones, espera un minuto', 'rate_limit', 429)
  if (!env.OPENAI_KEY) return rtaError('IA no configurada en el servidor', 'sin_ia', 500)

  const rta = await fetchFn('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: typeof cuerpo.model === 'string' && cuerpo.model.trim() ? cuerpo.model.trim() : 'gpt-4o-mini',
      messages: cuerpo.messages,
      temperature: typeof cuerpo.temperature === 'number' ? cuerpo.temperature : 0.6,
      max_tokens: typeof cuerpo.maxTokens === 'number' ? cuerpo.maxTokens : 1200
    })
  })
  if (!rta.ok) {
    const detalle = await rta.text().catch(() => '')
    return rtaError(`proveedor de IA fallo: ${detalle.slice(0, 200)}`, 'proveedor', 502)
  }
  const data = (await rta.json().catch(() => null)) as Record<string, unknown> | null
  if (!data) return rtaError('respuesta de IA ilegible', 'proveedor', 502)
  return rtaOk(data)
}
