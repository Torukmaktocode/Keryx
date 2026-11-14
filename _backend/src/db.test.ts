import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'
import { suscripcionDe, upsertSuscripcion, usuarioDe, crearUsuario, dispositivosDe, agregarDispositivo, borrarDispositivo } from './db'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

describe('db', () => {
  it('suscripcionDe devuelve null si no existe', async () => {
    const { fetch } = supabaseFalso()
    expect(await suscripcionDe(env, 'a@b.c', fetch)).toBeNull()
  })

  it('upsert crea y luego actualiza sin pisar lo demas', async () => {
    const { fetch } = supabaseFalso()
    await upsertSuscripcion(env, { email: 'a@b.c', estado: 'trial', trial_hasta: '2026-11-21T00:00:00Z' }, fetch)
    const s1 = await suscripcionDe(env, 'a@b.c', fetch)
    expect(s1?.estado).toBe('trial')
    await upsertSuscripcion(env, { email: 'a@b.c', estado: 'activa', expira_at: '2026-12-14T00:00:00Z' }, fetch)
    const s2 = await suscripcionDe(env, 'a@b.c', fetch)
    expect(s2?.estado).toBe('activa')
    expect(s2?.trial_hasta).toBe('2026-11-21T00:00:00Z')
  })

  it('usuarios y dispositivos', async () => {
    const { fetch } = supabaseFalso()
    await crearUsuario(env, 'a@b.c', 'hash', fetch)
    expect((await usuarioDe(env, 'a@b.c', fetch))?.password_hash).toBe('hash')
    await agregarDispositivo(env, 'a@b.c', 'huella1', fetch)
    await agregarDispositivo(env, 'a@b.c', 'huella2', fetch)
    expect(await dispositivosDe(env, 'a@b.c', fetch)).toHaveLength(2)
    await borrarDispositivo(env, 'a@b.c', 'huella1', fetch)
    expect((await dispositivosDe(env, 'a@b.c', fetch)).map((d) => d.huella)).toEqual(['huella2'])
  })

  it('usa la URL y cabeceras del env', async () => {
    const vista: { valor: { url: string; cabeceras: Record<string, string> } | null } = { valor: null }
    const fetchEspia = (async (url: string | URL | Request, init?: RequestInit) => {
      vista.valor = { url: String(url), cabeceras: Object.fromEntries(new Headers(init?.headers).entries()) }
      return new Response('[]')
    }) as typeof fetch
    await suscripcionDe(env, 'x@y.z', fetchEspia)
    expect(vista.valor?.url).toContain('https://sb.supabase.co/rest/v1/suscripciones')
    expect(vista.valor?.cabeceras['apikey']).toBe('key')
    expect(vista.valor?.cabeceras['authorization']).toBe('Bearer key')
  })
})
