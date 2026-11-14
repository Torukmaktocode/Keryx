import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'

describe('supabaseFalso', () => {
  it('inserta y filtra por email eq', async () => {
    const falso = supabaseFalso()
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.c', estado: 'trial', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: 'hoy' })
    })
    const r = await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones?email=eq.a%40b.c&select=*')
    const filas = (await r.json()) as Array<{ email: string }>
    expect(filas).toHaveLength(1)
    expect(filas[0].email).toBe('a@b.c')
  })

  it('merge-duplicates actualiza la fila existente', async () => {
    const falso = supabaseFalso()
    const fila = { email: 'a@b.c', estado: 'trial', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: 'hoy' }
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', { method: 'POST', body: JSON.stringify(fila) })
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ email: 'a@b.c', estado: 'activa', expira_at: '2026-12-14', trial_hasta: null, hotmart_comprador_id: '111', actualizado_at: 'hoy2' })
    })
    const r = await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones?email=eq.a%40b.c&select=*')
    const filas = (await r.json()) as Array<{ estado: string }>
    expect(filas).toHaveLength(1)
    expect(filas[0].estado).toBe('activa')
  })

  it('DELETE respeta huella', async () => {
    const falso = supabaseFalso()
    const base = falso.base as unknown as { dispositivos: Array<{ email: string; huella: string }> }
    base.dispositivos.push({ email: 'a@b.c', huella: 'h1' }, { email: 'a@b.c', huella: 'h2' })
    await falso.fetch('https://sb.supabase.co/rest/v1/dispositivos?email=eq.a%40b.c&huella=eq.h1', { method: 'DELETE' })
    expect(base.dispositivos).toHaveLength(1)
    expect(base.dispositivos[0].huella).toBe('h2')
  })
})
