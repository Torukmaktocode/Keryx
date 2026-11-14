import { describe, expect, it } from 'vitest'
import { enrutador } from './index'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

describe('enrutador', () => {
  it('404 en ruta desconocida', async () => {
    const r = await enrutador(new Request('https://w.dev/no-existe', { method: 'POST' }), env)
    expect(r.status).toBe(404)
  })

  it('rate limit de login: la 6a peticion de la misma IP da 429', async () => {
    const pedidos = Array.from(
      { length: 6 },
      () =>
        new Request('https://w.dev/auth/login', {
          method: 'POST',
          headers: { 'CF-Connecting-IP': '1.2.3.4' },
          body: JSON.stringify({ email: 'a@b.c', password: 'secreta123' })
        })
    )
    for (let i = 0; i < 5; i++) await enrutador(pedidos[i], env)
    const sexta = await enrutador(pedidos[5], env)
    expect(sexta.status).toBe(429)
  })

  it('otra IP no esta limitada', async () => {
    const r = await enrutador(
      new Request('https://w.dev/auth/login', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '9.9.9.9' },
        body: JSON.stringify({ email: 'a@b.c', password: 'secreta123' })
      }),
      env
    )
    expect(r.status).not.toBe(429)
  })

  it('webhook pasa por el router (403 sin hottok)', async () => {
    const r = await enrutador(new Request('https://w.dev/webhooks/hotmart', { method: 'POST', body: '{}' }), env)
    expect(r.status).toBe(403)
  })
})
