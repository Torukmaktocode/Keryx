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
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; autor?: string } | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const filtroAutor = typeof cuerpo.autor === 'string' && cuerpo.autor ? `&email=eq.${encodeURIComponent(cuerpo.autor)}` : ''
  const r = await sb(
    env,
    `/rest/v1/sermones_comunidad?select=titulo,id,email,nombre,iglesia,ciudad,pais,contexto,minutos,experiencia,creado_at&order=creado_at.desc&limit=100${filtroAutor}`,
    {},
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo leer', 'almacen', 502)
  const filas = (await r.json()) as Array<Record<string, unknown>>

  const rl = await sb(env, '/rest/v1/comunidad_likes?select=sermon_id&limit=5000', {}, fetchFn)
  const likes = rl.ok ? ((await rl.json()) as Array<{ sermon_id: string }>) : []
  const rc = await sb(env, '/rest/v1/comunidad_comentarios?select=sermon_id&limit=5000', {}, fetchFn)
  const comentarios = rc.ok ? ((await rc.json()) as Array<{ sermon_id: string }>) : []

  const lista = filas.map((fila) => ({
    ...fila,
    likes: likes.filter((l) => l.sermon_id === fila.id).length,
    comentarios: comentarios.filter((c) => c.sermon_id === fila.id).length,
    es_mio: fila.email === email
  }))
  return rtaOk(lista)
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

export async function manejarLike(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const id = cuerpo.id
  const filtro = `/rest/v1/comunidad_likes?sermon_id=eq.${encodeURIComponent(id)}&email=eq.${encodeURIComponent(email)}`
  const r = await sb(env, filtro, {}, fetchFn)
  const existentes = r.ok ? ((await r.json()) as Array<Record<string, unknown>>) : []
  if (existentes.length > 0) {
    const d = await sb(env, filtro, { method: 'DELETE' }, fetchFn)
    if (!d.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  } else {
    const a = await sb(env, '/rest/v1/comunidad_likes', {
      method: 'POST',
      body: JSON.stringify({ sermon_id: id, email })
    }, fetchFn)
    if (!a.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  }
  const c = await sb(env, `/rest/v1/comunidad_likes?sermon_id=eq.${encodeURIComponent(id)}&select=email`, {}, fetchFn)
  const votos = c.ok ? ((await c.json()) as Array<Record<string, unknown>>) : []
  return rtaOk({ likes: votos.length, yo_doy_like: existentes.length === 0 })
}

export async function manejarComentar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string; nombre?: string; texto?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)
  const texto = cadena(cuerpo, 'texto', 1000)
  const nombre = cadena(cuerpo, 'nombre', 80) || 'Miembro'
  if (texto.length < 2) return rtaError('el comentario es demasiado corto', 'formato', 400)

  const r = await sb(env, '/rest/v1/comunidad_comentarios', {
    method: 'POST',
    body: JSON.stringify({ sermon_id: cuerpo.id, email, nombre, texto })
  }, fetchFn)
  if (!r.ok) return rtaError('no se pudo comentar', 'almacen', 502)
  return rtaOk({ comentado: true })
}

export async function manejarComentarios(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; id?: string } | null
  if (!cuerpo?.licencia || !cuerpo.id) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const r = await sb(
    env,
    `/rest/v1/comunidad_comentarios?sermon_id=eq.${encodeURIComponent(cuerpo.id)}&select=nombre,texto,creado_at&order=creado_at.asc&limit=200`,
    {},
    fetchFn
  )
  if (!r.ok) return rtaError('no se pudo leer', 'almacen', 502)
  return rtaOk(await r.json())
}

export async function manejarSeguir(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; autor?: string } | null
  if (!cuerpo?.licencia || !cuerpo.autor) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)
  if (cuerpo.autor === email) return rtaError('no puedes seguirte a ti mismo', 'formato', 400)

  const filtro = `/rest/v1/comunidad_seguir?autor_email=eq.${encodeURIComponent(cuerpo.autor)}&seguidor_email=eq.${encodeURIComponent(email)}`
  const r = await sb(env, filtro, {}, fetchFn)
  const existentes = r.ok ? ((await r.json()) as Array<Record<string, unknown>>) : []
  if (existentes.length > 0) {
    const d = await sb(env, filtro, { method: 'DELETE' }, fetchFn)
    if (!d.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  } else {
    const a = await sb(env, '/rest/v1/comunidad_seguir', {
      method: 'POST',
      body: JSON.stringify({ autor_email: cuerpo.autor, seguidor_email: email })
    }, fetchFn)
    if (!a.ok) return rtaError('no se pudo actualizar', 'almacen', 502)
  }
  const c = await sb(
    env,
    `/rest/v1/comunidad_seguir?autor_email=eq.${encodeURIComponent(cuerpo.autor)}&select=seguidor_email`,
    {},
    fetchFn
  )
  const filas = c.ok ? ((await c.json()) as Array<{ seguidor_email: string }>) : []
  return rtaOk({ seguidores: filas.length, siguiendo: existentes.length === 0 })
}

export async function manejarSeguidores(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string; autor?: string } | null
  if (!cuerpo?.licencia || !cuerpo.autor) return rtaError('faltan datos', 'formato', 400)
  const email = await emailDeLicencia(env, cuerpo.licencia)
  if (!email) return rtaError('licencia invalida o vencida', 'sin_acceso', 401)

  const r = await sb(
    env,
    `/rest/v1/comunidad_seguir?autor_email=eq.${encodeURIComponent(cuerpo.autor)}&select=seguidor_email`,
    {},
    fetchFn
  )
  const filas = r.ok ? ((await r.json()) as Array<{ seguidor_email: string }>) : []
  return rtaOk({ seguidores: filas.length, yo_sigo: filas.some((f) => f.seguidor_email === email) })
}
