import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'
import { manejarWebhook } from './webhook'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

function pedido(evento: string, extra: Record<string, unknown> = {}): Request {
  return new Request('https://w.workers.dev/webhooks/hotmart', {
    method: 'POST',
    headers: { 'X-Hotmart-Token': 'tok', 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: evento, data: { subscriber: { email: 'cliente@mail.com' }, purchase: { next_cycle_date: '2027-01-13' }, ...extra } })
  })
}

describe('manejarWebhook', () => {
  it('rechaza hottok invalido con 403', async () => {
    const { fetch } = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', { method: 'POST', headers: { 'X-Hotmart-Token': 'otro' }, body: '{}' })
    const r = await manejarWebhook(env, req, fetch)
    expect(r.status).toBe(403)
  })

  it('PURCHASE_APPROVED activa y guarda expira_at desde next_cycle_date', async () => {
    const falso = supabaseFalso()
    const r = await manejarWebhook(env, pedido('PURCHASE_APPROVED'), falso.fetch)
    expect(r.status).toBe(200)
    const s = falso.base.suscripciones[0]
    expect(s.email).toBe('cliente@mail.com')
    expect(s.estado).toBe('activa')
    expect(s.expira_at).toContain('2027-01-13')
  })

  it('SUBSCRIPTION_RENEWAL mantiene una sola fila y re-fecha', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('PURCHASE_APPROVED', { purchase: { next_cycle_date: '2026-12-01' } }), falso.fetch)
    await manejarWebhook(env, pedido('SUBSCRIPTION_RENEWAL', { purchase: { next_cycle_date: '2026-12-31' } }), falso.fetch)
    expect(falso.base.suscripciones).toHaveLength(1)
    expect(falso.base.suscripciones[0].expira_at).toContain('2026-12-31')
  })

  it('SUBSCRIPTION_CANCELLATION deja estado cancelada conservando expira_at', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('PURCHASE_APPROVED'), falso.fetch)
    await manejarWebhook(env, pedido('SUBSCRIPTION_CANCELLATION'), falso.fetch)
    const s = falso.base.suscripciones[0]
    expect(s.estado).toBe('cancelada')
    expect(s.expira_at).toContain('2027-01-13')
  })

  it('SUBSCRIPTION_EXPIRATION y PURCHASE_REFUNDED ponen inactiva', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('SUBSCRIPTION_EXPIRATION'), falso.fetch)
    expect(falso.base.suscripciones[0].estado).toBe('inactiva')
    await manejarWebhook(env, pedido('PURCHASE_REFUNDED'), falso.fetch)
    expect(falso.base.suscripciones[0].estado).toBe('inactiva')
  })

  it('evento desconocido responde 200 sin tocar la base', async () => {
    const falso = supabaseFalso()
    const r = await manejarWebhook(env, pedido('BILLET_GENERATED'), falso.fetch)
    expect(r.status).toBe(200)
    expect(falso.base.suscripciones).toHaveLength(0)
  })

  it('acepta buyer.email cuando no hay subscriber', async () => {
    const falso = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', {
      method: 'POST',
      headers: { 'X-Hotmart-Token': 'tok' },
      body: JSON.stringify({ event: 'PURCHASE_APPROVED', data: { buyer: { email: 'otro@mail.com' }, purchase: {} } })
    })
    await manejarWebhook(env, req, falso.fetch)
    expect(falso.base.suscripciones[0].email).toBe('otro@mail.com')
  })

  it('next_cycle_date ausente usa hoy + 30 dias', async () => {
    const falso = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', {
      method: 'POST',
      headers: { 'X-Hotmart-Token': 'tok' },
      body: JSON.stringify({ event: 'PURCHASE_APPROVED', data: { subscriber: { email: 'c@mail.com' }, purchase: {} } })
    })
    await manejarWebhook(env, req, falso.fetch)
    const expira = new Date(falso.base.suscripciones[0].expira_at as string)
    const dias = (expira.getTime() - Date.now()) / 86400000
    expect(dias).toBeGreaterThan(28)
    expect(dias).toBeLessThan(32)
  })
})
