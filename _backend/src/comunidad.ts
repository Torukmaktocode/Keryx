import { emailDeLicencia } from './ia'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

interface SermónComunidad {
  id: string
  email: string
  nombre: string
  iglesia: string
  ciudad: string
  pais: string
  titulo: string
  contexto: string
  minutos: number
  experiencia: string | null
  texto: string
  creado_at: string
}

async function sb(
  env: Env,
  path: string,
  init: RequestInit = {},
  fetchFn: FetchFn = fetch
): Promise<Response> {
  const cabeceras = new Headers(init.headers)
  cabeceras.set('apikey', env.SUPABASE_SERVICE_ROLE_KEY)
  cabeceras.set('Authorization', `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`)
  cabeceras.set('Content-Type', 'application/json')
  return fetchFn(`${env.SUPABASE_URL}${path}`, { ...init, headers: cabeceras })
}

function cadena(cuerpo: Record<string, unknown>, clave: string, max: number): string {
  const v = typeof cuerpo[clave] === 'string' ? (cuerpo[clave] as string).trim() : ''
  return v.slice(0, max)
}

export async function manejarPublicar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, String(cuerpo.licencia))
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const titulo = cadena(cuerpo, 'titulo', 120)
  const nombre = cadena(cuerpo, 'nombre', 80)
  const iglesia = cadena(cuerpo, 'iglesia', 80)
  const ciudad = cadena(cuerpo, 'ciudad', 80)
  const pais = cadena(cuerpo, 'pais', 80)
  const contexto = cadena(cuerpo, 'contexto', 600)
  const experiencia = cadena(cuerpo, 'experiencia', 600)
  const texto = cadena(cuerpo, 'texto', 60000)
  const minutos = typeof cuerpo.minutos === 'number' ? Math.round(cuerpo.minutos) : 0
  if (!titulo || !nombre || !iglesia || !ciudad || !pais || !contexto || !texto) {
    return rtaError('faltan campos obligatorios', 'formato', 400)
  }
  if (minutos < 1 || minutos > 300) return rtaError('minutos invalidos', 'formato', 400)
  if (texto.length < 200) return rtaError('el sermón es demasiado corto', 'formato', 400)

  const r = await sb(env, '/rest/v1/sermones_comunidad', {
    method: 'POST',
    body: JSON.stringify({ email, titulo, nombre, iglesia, ciudad, pais, contexto, minutos, experiencia, texto })
  }, fetchFn)
  if (!r.ok) return rtaError('no se pudo publicar', 'almacen', 502)
  return rtaOk({ publicado: true })
}

export async function manejarLista(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string } | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const r = await sb(
    env,
    '/rest/v1/sermones_comunidad?select=titulo,id,nombre,iglesia,ciudad,pais,contexto,minutos,experiencia,creado_at&order=creado_at.desc&limit=100',
    {},
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo leer', 'almacen', 502)
  return rtaOk(await r.json())
}

export async function manejarObtener(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const r = await sb(
    env,
    `/rest/v1/sermones_comunidad?id=eq.${encodeURIComponent(cuerpo.id)}&select=titulo,id,nombre,iglesia,ciudad,pais,contexto,minutos,experiencia,texto,creado_at`,
    {},
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo leer', 'almacen', 502)
  const filas = (await r.json()) as SermónComunidad[]
  const fila = filas[0]
  if (!fila) return rtaError('sermón no encontrado', 'no_encontrado', 404)
  return rtaOk(fila)
}
