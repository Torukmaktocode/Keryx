import type { Dispositivo, Env, Suscripcion, Usuario } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

async function sb(env: Env, path: string, init: RequestInit = {}, fetchFn: FetchFn = fetch): Promise<Response> {
  const cabeceras = new Headers(init.headers)
  cabeceras.set('apikey', env.SUPABASE_SERVICE_ROLE_KEY)
  cabeceras.set('Authorization', `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`)
  cabeceras.set('Content-Type', 'application/json')
  return fetchFn(`${env.SUPABASE_URL}${path}`, { ...init, headers: cabeceras })
}

async function primera<T>(r: Response): Promise<T | null> {
  const filas = (await r.json()) as T[]
  return filas[0] ?? null
}

export async function suscripcionDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Suscripcion | null> {
  const r = await sb(env, `/rest/v1/suscripciones?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return primera<Suscripcion>(r)
}

export async function upsertSuscripcion(env: Env, envio: Partial<Suscripcion> & { email: string }, fetchFn: FetchFn = fetch): Promise<void> {
  const fila = { actualizado_at: new Date().toISOString(), ...envio }
  await sb(env, '/rest/v1/suscripciones', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(fila)
  }, fetchFn)
}

export async function usuarioDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Usuario | null> {
  const r = await sb(env, `/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return primera<Usuario>(r)
}

export async function crearUsuario(env: Env, email: string, passwordHash: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, '/rest/v1/usuarios', {
    method: 'POST',
    body: JSON.stringify({ email, password_hash: passwordHash, creado_at: new Date().toISOString() })
  }, fetchFn)
}

export async function dispositivosDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Dispositivo[]> {
  const r = await sb(env, `/rest/v1/dispositivos?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return (await r.json()) as Dispositivo[]
}

export async function agregarDispositivo(env: Env, email: string, huella: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, '/rest/v1/dispositivos', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ email, huella, activado_at: new Date().toISOString() })
  }, fetchFn)
}

export async function borrarDispositivo(env: Env, email: string, huella: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, `/rest/v1/dispositivos?email=eq.${encodeURIComponent(email)}&huella=eq.${encodeURIComponent(huella)}`, { method: 'DELETE' }, fetchFn)
}
