import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose'
import { crearUsuario, suscripcionDe, upsertSuscripcion, usuarioDe } from './db'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function clavePrivada(env: Env): Promise<CryptoKey> {
  return importPKCS8(env.LICENCIA_PRIVADA, 'EdDSA')
}

export async function clavePublica(env: Env): Promise<CryptoKey> {
  return importSPKI(env.LICENCIA_PUBLICA, 'EdDSA')
}

export async function signSesion(env: Env, email: string): Promise<string> {
  return new SignJWT({ tipo: 'sesion' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime('600s')
    .sign(await clavePrivada(env))
}

export async function verificarSesion(env: Env, token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, await clavePublica(env))
    if (payload.tipo !== 'sesion') return null
    return String(payload.sub)
  } catch {
    return null
  }
}

export async function manejarLogin(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { email?: string; password?: string } | null
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email.trim().toLowerCase() : ''
  const password = typeof cuerpo?.password === 'string' ? cuerpo.password : ''
  if (!EMAIL_RE.test(email)) return rtaError('email invalido', 'formato')
  if (password.length < 6 || password.length > 200) return rtaError('contrasena invalida', 'formato')

  const suscripcion = await suscripcionDe(env, email, fetchFn)
  const usuario = await usuarioDe(env, email, fetchFn)

  if (!usuario) {
    const trialVencido = suscripcion?.estado === 'trial' && suscripcion.trial_hasta && new Date(suscripcion.trial_hasta).getTime() < Date.now()
    if (suscripcion?.estado === 'inactiva' || trialVencido) {
      return rtaError('Trial agotado: suscribete para usar Keryx', 'trial_agotado', 403)
    }
    const hash = bcrypt.hashSync(password, 10)
    await crearUsuario(env, email, hash, fetchFn)
    if (!suscripcion) {
      await upsertSuscripcion(env, { email, estado: 'trial', trial_hasta: new Date(Date.now() + 7 * 86400000).toISOString(), expira_at: null, hotmart_comprador_id: null }, fetchFn)
    }
  } else if (!bcrypt.compareSync(password, usuario.password_hash)) {
    return rtaError('email o contrasena incorrectos', 'credenciales', 401)
  }

  return rtaOk({ token: await signSesion(env, email), email, estado: suscripcion?.estado ?? 'trial' })
}
