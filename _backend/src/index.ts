import { manejarWebhook } from './webhook'
import { manejarLogin } from './login'
import { manejarActivar, manejarRefrescar, manejarDesactivar } from './licencia'
import { manejarIa } from './ia'
import { manejarPublicar, manejarLista, manejarObtener } from './comunidad'
import { rtaError, type Env } from './tipos'

const VENTANA_MS = 60000
const MAX_POR_MINUTO = 5
const GOLPES = new Map<string, number[]>()

function limitar(ip: string, ahora = Date.now()): boolean {
  const previos = (GOLPES.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= MAX_POR_MINUTO) return false
  previos.push(ahora)
  GOLPES.set(ip, previos)
  return true
}

export async function enrutador(req: Request, env: Env): Promise<Response> {
  const ruta = new URL(req.url).pathname
  const metodo = req.method

  try {
    if (metodo === 'POST' && ruta === '/webhooks/hotmart') return await manejarWebhook(env, req)

    const ip = req.headers.get('CF-Connecting-IP') ?? 'desconocida'

    if (metodo === 'POST' && ruta === '/auth/login') {
      if (!limitar(ip)) return rtaError('demasiados intentos, espera un minuto', 'rate_limit', 429)
      return await manejarLogin(env, req)
    }
    if (metodo === 'POST' && ruta === '/license/activar') return await manejarActivar(env, req)
    if (metodo === 'POST' && ruta === '/license/refrescar') return await manejarRefrescar(env, req)
    if (metodo === 'POST' && ruta === '/license/desactivar') return await manejarDesactivar(env, req)
    if (metodo === 'POST' && ruta === '/ai/chat') return await manejarIa(env, req)
    if (metodo === 'POST' && ruta === '/comunidad/publicar') return await manejarPublicar(env, req)
    if (metodo === 'POST' && ruta === '/comunidad/lista') return await manejarLista(env, req)
    if (metodo === 'POST' && ruta === '/comunidad/obtener') return await manejarObtener(env, req)

    return rtaError('ruta no encontrada', 'no_ruta', 404)
  } catch {
    return rtaError('error interno', 'interno', 500)
  }
}

export default {
  fetch(req: Request, env: Env): Promise<Response> {
    return enrutador(req, env)
  }
}
