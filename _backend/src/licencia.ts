import { SignJWT, jwtVerify } from 'jose'
import { suscripcionDe, dispositivosDe, agregarDispositivo, borrarDispositivo } from './db'
import { verificarSesion, clavePrivada, clavePublica } from './login'
import { rtaError, rtaOk, type Env, type Suscripcion } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

export const GRACIA_MS = 7 * 86400000
export const MAX_DISPOSITIVOS = 3

const ESTADOS_CON_ACCESO = ['activa', 'cancelada', 'trial']

export function finDeAcceso(s: Suscripcion): number | null {
  const fechas = [s.expira_at, s.trial_hasta].filter((x): x is string => Boolean(x)).map((x) => new Date(x).getTime())
  return fechas.length ? Math.max(...fechas) : null
}

async function firmaLicencia(env: Env, email: string, huella: string, suscripcion: Suscripcion, fin: number): Promise<string> {
  return new SignJWT({ tipo: 'licencia', huella, estado: suscripcion.estado, trial: suscripcion.estado === 'trial' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(new Date(fin + GRACIA_MS))
    .sign(await clavePrivada(env))
}

export async function manejarActivar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { tokenSesion?: string; huella?: string } | null
  if (!cuerpo?.tokenSesion || !cuerpo.huella) return rtaError('faltan datos', 'formato')
  const email = await verificarSesion(env, cuerpo.tokenSesion)
  if (!email) return rtaError('sesion invalida o vencida, inicia sesion de nuevo', 'sesion', 401)
  const huella = cuerpo.huella.slice(0, 64)

  const suscripcion = await suscripcionDe(env, email, fetchFn)
  if (!suscripcion || !ESTADOS_CON_ACCESO.includes(suscripcion.estado)) {
    return rtaError('suscripcion inactiva: suscribete para usar Keryx', 'sin_acceso', 403)
  }
  const fin = finDeAcceso(suscripcion)
  if (fin === null || fin <= Date.now()) return rtaError('sin suscripcion activa', 'sin_acceso', 403)

  const equipos = await dispositivosDe(env, email, fetchFn)
  if (!equipos.some((d) => d.huella === huella)) {
    if (equipos.length >= MAX_DISPOSITIVOS) {
      return rtaError('Limite de 3 equipos alcanzado: cierra sesion en uno para activar este', 'limite_dispositivos', 403)
    }
    await agregarDispositivo(env, email, huella, fetchFn)
  }

  const licencia = await firmaLicencia(env, email, huella, suscripcion, fin)
  return rtaOk({ licencia, expiraISO: new Date(fin + GRACIA_MS).toISOString(), estado: suscripcion.estado })
}

export async function manejarRefrescar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string } | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato')
  try {
    const { payload } = await jwtVerify(cuerpo.licencia, await clavePublica(env))
    if (payload.tipo !== 'licencia') throw new Error('tipo')
    const email = String(payload.sub)
    const huella = String(payload.huella)
    const suscripcion = await suscripcionDe(env, email, fetchFn)
    if (!suscripcion || !ESTADOS_CON_ACCESO.includes(suscripcion.estado)) {
      return rtaError('suscripcion inactiva: renueva para seguir usando Keryx', 'sin_acceso', 403)
    }
    const fin = finDeAcceso(suscripcion)
    if (fin === null || fin <= Date.now()) return rtaError('suscripcion vencida: renueva para seguir usando Keryx', 'sin_acceso', 403)
    const licencia = await firmaLicencia(env, email, huella, suscripcion, fin)
    return rtaOk({ licencia, expiraISO: new Date(fin + GRACIA_MS).toISOString(), estado: suscripcion.estado })
  } catch {
    return rtaError('licencia invalida o vencida: inicia sesion de nuevo', 'vencida', 403)
  }
}

export async function manejarDesactivar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { tokenSesion?: string; huella?: string } | null
  if (!cuerpo?.tokenSesion || !cuerpo.huella) return rtaError('faltan datos', 'formato')
  const email = await verificarSesion(env, cuerpo.tokenSesion)
  if (!email) return rtaError('sesion invalida', 'sesion', 401)
  await borrarDispositivo(env, email, cuerpo.huella.slice(0, 64), fetchFn)
  return rtaOk({ desactivado: true })
}
