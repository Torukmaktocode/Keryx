import { emailDeLicencia } from './ia'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

export interface Oración {
  id: string
  email: string
  nombre: string
  pais: string
  peticion: string
  respondida: boolean
  respuesta: string | null
  respondido_at: string | null
  creado_at: string
  orando: number
  yo_oro: boolean
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
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const nombre = cadena(cuerpo, 'nombre', 80)
  const pais = cadena(cuerpo, 'pais', 80)
  const peticion = cadena(cuerpo, 'peticion', 3000)
  const categoria = cadena(cuerpo, 'categoria', 40) || 'general'
  const CATEGORIAS = ['general', 'salud', 'familia', 'trabajo', 'economia', 'gratitud']
  if (!nombre || !pais || !peticion) return rtaError('faltan campos obligatorios', 'formato', 400)
  if (peticion.length < 10) return rtaError('la petición es demasiado corta', 'formato', 400)
  if (!CATEGORIAS.includes(categoria)) return rtaError('categoría invalida', 'formato', 400)

  const r = await sb(env, '/rest/v1/oraciones', {
    method: 'POST',
    body: JSON.stringify({ email, nombre, pais, peticion, categoria })
  }, fetchFn)
  if (!r.ok) return rtaError('no se pudo publicar', 'almacen', 502)
  return rtaOk({ publicado: true })
}

export async function manejarLista(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as {
    licencia?: string
    categoria?: string
    modo?: string
  } | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const filtroCategoria =
    typeof cuerpo.categoria === 'string' && cuerpo.categoria && cuerpo.categoria !== 'todas'
      ? `&categoria=eq.${encodeURIComponent(cuerpo.categoria)}`
      : ''
  const r = await sb(
    env,
    `/rest/v1/oraciones?select=id,email,nombre,pais,peticion,categoria,respondida,respuesta,respondido_at,creado_at&order=creado_at.desc&limit=100${filtroCategoria}`,
    {},
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo leer', 'almacen', 502)
  const filas = (await r.json()) as Array<Record<string, unknown>>

  const ra = await sb(env, '/rest/v1/oraciones_oran?select=oracion_id,email&limit=5000', {}, fetchFn)
  const votos = ra.ok ? ((await ra.json()) as Array<{ oracion_id: string; email: string }>) : []

  const lista = filas.map((fila) => ({
    ...fila,
    orando: votos.filter((v) => v.oracion_id === fila.id).length,
    yo_oro: votos.some((v) => v.oracion_id === fila.id && v.email === email)
  }))
  if (cuerpo.modo === 'ranking') {
    lista.sort((a, b) => (b.orando as number) - (a.orando as number))
  }
  return rtaOk(lista)
}

export async function manejarLlamita(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const id = cuerpo.id
  const r = await sb(
    env,
    `/rest/v1/oraciones_oran?oracion_id=eq.${encodeURIComponent(id)}&email=eq.${encodeURIComponent(email)}`,
    {},
    fetchFn
  )
  const existentes = r.ok ? ((await r.json()) as Array<Record<string, unknown>>) : []
  if (existentes.length > 0) {
    const d = await sb(
      env,
      `/rest/v1/oraciones_oran?oracion_id=eq.${encodeURIComponent(id)}&email=eq.${encodeURIComponent(email)}`,
      { method: 'DELETE' },
      fetchFn
    )
    if (!d.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  } else {
    const a = await sb(env, '/rest/v1/oraciones_oran', {
      method: 'POST',
      body: JSON.stringify({ oracion_id: id, email })
    }, fetchFn)
    if (!a.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  }

  const c = await sb(
    env,
    `/rest/v1/oraciones_oran?oracion_id=eq.${encodeURIComponent(id)}&select=email`,
    {},
    fetchFn
  )
  const votos = c.ok ? ((await c.json()) as Array<Record<string, unknown>>) : []
  return rtaOk({ orando: votos.length, yo_oro: existentes.length === 0 })
}

export async function manejarResponder(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string; respuesta?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id || !cuerpo.respuesta) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)
  const respuesta = cadena(cuerpo, 'respuesta', 3000)
  if (respuesta.length < 10) return rtaError('cuenta un poco más cómo Dios respondió', 'formato', 400)

  const r = await sb(
    env,
    `/rest/v1/oraciones?id=eq.${encodeURIComponent(cuerpo.id)}&email=eq.${encodeURIComponent(email)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        respondida: true,
        respuesta,
        respondido_at: new Date().toISOString()
      })
    },
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  const filas = (await r.json()) as Array<Record<string, unknown>>
  if (filas.length === 0) return rtaError('solo el autor puede marcar la respuesta', 'no_autor', 403)
  return rtaOk({ respondida: true })
}
