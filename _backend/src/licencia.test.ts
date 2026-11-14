import { describe, expect, it } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { supabaseFalso } from './supabase-falso'
import { manejarLogin } from './login'
import { manejarActivar, manejarRefrescar, manejarDesactivar, finDeAcceso } from './licencia'
import type { Env, Suscripcion } from './tipos'

const par = generateKeyPairSync('ed25519')
const env: Env = {
  HOTTOK: 'tok',
  SUPABASE_URL: 'https://sb.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'key',
  LICENCIA_PRIVADA: par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  LICENCIA_PUBLICA: par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
}

type Falso = ReturnType<typeof supabaseFalso>

async function loginYActivar(falso: Falso, email = 'u@mail.com', estado: Suscripcion['estado'] = 'trial', finISO: string | null = new Date(Date.now() + 20 * 86400000).toISOString()) {
  falso.base.suscripciones.push({ email, estado, expira_at: estado === 'trial' ? null : finISO, trial_hasta: estado === 'trial' ? finISO : null, hotmart_comprador_id: null, actualizado_at: 'hoy' })
  falso.base.usuarios.push({ email, password_hash: bcrypt.hashSync('secreta123', 10), creado_at: 'hoy' })
  const rl = await manejarLogin(env, new Request('https://w.dev/auth/login', { method: 'POST', body: JSON.stringify({ email, password: 'secreta123' }) }), falso.fetch)
  const { data } = (await rl.json()) as { ok: boolean; data: { token: string } }
  return data.token
}

function reqActivar(tokenSesion: string, huella: string): Request {
  return new Request('https://w.dev/license/activar', { method: 'POST', body: JSON.stringify({ tokenSesion, huella }) })
}

describe('finDeAcceso', () => {
  it('devuelve max(expira_at, trial_hasta)', () => {
    const s = { email: 'a', estado: 'activa', expira_at: '2026-12-01T00:00:00Z', trial_hasta: '2026-11-20T00:00:00Z', hotmart_comprador_id: null, actualizado_at: '' } as Suscripcion
    expect(finDeAcceso(s)).toBe(new Date('2026-12-01T00:00:00Z').getTime())
  })

  it('null sin fechas', () => {
    const s = { email: 'a', estado: 'inactiva', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: '' } as Suscripcion
    expect(finDeAcceso(s)).toBeNull()
  })
})

describe('manejarActivar', () => {
  it('activa trial: licencia con exp = fin + 7 dias de gracia', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    const r = await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: { licencia: string; expiraISO: string } }
    expect(cuerpo.ok).toBe(true)
    const fin = new Date(falso.base.suscripciones[0].trial_hasta as string).getTime()
    const expira = new Date(cuerpo.data.expiraISO).getTime()
    expect(expira - fin).toBeCloseTo(7 * 86400000, -3)
    expect(falso.base.dispositivos.map((d) => d.huella)).toEqual(['huella-eq1'])
  })

  it('idempotente: re-activar la misma huella no agrega fila', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    expect(falso.base.dispositivos).toHaveLength(1)
  })

  it('limite de 3 dispositivos: el cuarto da 403 limite_dispositivos', async () => {
    const falso = supabaseFalso()
    falso.base.dispositivos.push({ email: 'u@mail.com', huella: 'h1' }, { email: 'u@mail.com', huella: 'h2' }, { email: 'u@mail.com', huella: 'h3' }, { email: 'u@mail.com', huella: 'h4' })
    const token = await loginYActivar(falso)
    const r = await manejarActivar(env, reqActivar(token, 'h5'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('limite_dispositivos')
  })

  it('suscripcion inactiva vencida: 403 sin_acceso', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso, 'vencido@mail.com', 'inactiva', new Date(Date.now() - 86400000).toISOString())
    const r = await manejarActivar(env, reqActivar(token, 'hx'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('sin_acceso')
  })

  it('suscripcion inactiva con expira_at futuro: 403 sin_acceso igualmente', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso, 'futuro@mail.com', 'inactiva', new Date(Date.now() + 86400000).toISOString())
    const r = await manejarActivar(env, reqActivar(token, 'hy'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('sin_acceso')
  })

  it('token de sesion invalido: 401', async () => {
    const falso = supabaseFalso()
    const r = await manejarActivar(env, reqActivar('no-es-jwt', 'hx'), falso.fetch)
    expect(r.status).toBe(401)
  })
})

describe('manejarRefrescar', () => {
  it('renueva con nueva firma y confirma el estado', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    const ra = await manejarActivar(env, reqActivar(token, 'huella-r1'), falso.fetch)
    const { data: da } = (await ra.json()) as { ok: boolean; data: { licencia: string } }
    const rr = await manejarRefrescar(env, new Request('https://w.dev/license/refrescar', { method: 'POST', body: JSON.stringify({ licencia: da.licencia }) }), falso.fetch)
    const cuerpo = (await rr.json()) as { ok: boolean; data: { licencia: string } }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data.licencia).toContain('.')
  })

  it('licencia invalida: 403 vencida (re-login)', async () => {
    const falso = supabaseFalso()
    const r = await manejarRefrescar(env, new Request('https://w.dev/license/refrescar', { method: 'POST', body: JSON.stringify({ licencia: 'garbage' }) }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('vencida')
  })
})

describe('manejarDesactivar', () => {
  it('libera la huella indicada con sesion valida', async () => {
    const falso = supabaseFalso()
    falso.base.dispositivos.push({ email: 'u@mail.com', huella: 'h1' })
    const token = await loginYActivar(falso)
    await manejarDesactivar(env, new Request('https://w.dev/license/desactivar', { method: 'POST', body: JSON.stringify({ tokenSesion: token, huella: 'h1' }) }), falso.fetch)
    expect(falso.base.dispositivos).toHaveLength(0)
  })
})
