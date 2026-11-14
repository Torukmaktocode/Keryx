import { describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { generateKeyPairSync } from 'node:crypto'
import { supabaseFalso } from './supabase-falso'
import { manejarLogin } from './login'
import type { Env } from './tipos'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: PRIVADA, LICENCIA_PUBLICA: PUBLICA }

function pedidoLogin(email: string, password: string): Request {
  return new Request('https://w.workers.dev/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

describe('manejarLogin', () => {
  it('cuenta nueva sin suscripcion: crea usuario + trial 7 dias y devuelve token', async () => {
    const falso = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'secreta123'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: { token: string } }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data.token).toContain('.')
    expect(falso.base.usuarios).toHaveLength(1)
    expect(falso.base.suscripciones[0].estado).toBe('trial')
    const dias = (new Date(falso.base.suscripciones[0].trial_hasta as string).getTime() - Date.now()) / 86400000
    expect(dias).toBeGreaterThan(6.5)
    expect(dias).toBeLessThan(7.5)
    expect(await bcrypt.compare('secreta123', falso.base.usuarios[0].password_hash)).toBe(true)
  })

  it('contrasena incorrecta rechaza con codigo credenciales', async () => {
    const falso = supabaseFalso()
    await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'secreta123'), falso.fetch)
    const r = await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'malapass99'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(401)
    expect(cuerpo.ok).toBe(false)
    expect(cuerpo.codigo).toBe('credenciales')
  })

  it('comprador de Hotmart que entra por primera vez: estado activa, sin trial', async () => {
    const falso = supabaseFalso()
    falso.base.suscripciones.push({ email: 'comprador@mail.com', estado: 'activa', expira_at: '2026-12-14T00:00:00Z', trial_hasta: null, hotmart_comprador_id: '123', actualizado_at: 'hoy' })
    const r = await manejarLogin(env, pedidoLogin('comprador@mail.com', 'secreta123'), falso.fetch)
    expect(r.status).toBe(200)
    expect(falso.base.suscripciones[0].estado).toBe('activa')
    expect(falso.base.suscripciones[0].trial_hasta).toBeNull()
  })

  it('trial agotado sin compra: codigo trial_agotado', async () => {
    const falso = supabaseFalso()
    falso.base.suscripciones.push({ email: 'viejo@mail.com', estado: 'trial', expira_at: null, trial_hasta: new Date(Date.now() - 86400000).toISOString(), hotmart_comprador_id: null, actualizado_at: 'hoy' })
    const r = await manejarLogin(env, pedidoLogin('viejo@mail.com', 'secreta123'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string; error?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('trial_agotado')
    expect(cuerpo.error).toContain('uscr')
  })

  it('email invalido: 400', async () => {
    const { fetch } = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('no-es-email', 'secreta123'), fetch)
    expect(r.status).toBe(400)
  })

  it('contrasena corta: 400', async () => {
    const { fetch } = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('a@b.c', '123'), fetch)
    expect(r.status).toBe(400)
  })
})
