import { describe, expect, it } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { SignJWT } from 'jose'
import { supabaseFalso } from './supabase-falso'
import { manejarPublicar, manejarLista, manejarObtener } from './comunidad'
import type { Env } from './tipos'

const par = generateKeyPairSync('ed25519')
const env: Env = {
  HOTTOK: 'tok',
  SUPABASE_URL: 'https://sb.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'key',
  LICENCIA_PRIVADA: par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  LICENCIA_PUBLICA: par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
}

let n = 0
async function licenciaValida(): Promise<string> {
  n += 1
  return new SignJWT({ tipo: 'licencia', huella: `h${n}`, estado: 'trial' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(`u${n}@mail.com`)
    .setIssuedAt()
    .setExpirationTime('20m')
    .sign(par.privateKey)
}

const TEXTO = 'x'.repeat(300)

function cuerpoPublicar(): Record<string, unknown> {
  return {
    titulo: 'La gracia que sostiene',
    nombre: 'Juan Pérez',
    iglesia: 'Iglesia Central',
    ciudad: 'Bogotá',
    pais: 'Colombia',
    contexto: 'Retiro de jóvenes; occasion especial',
    minutos: 35,
    experiencia: '12 años predicando',
    texto: TEXTO
  }
}

describe('manejarPublicar', () => {
  it('feliz: publica con email de la licencia', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    const r = await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...cuerpoPublicar() })
    }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean }
    expect(cuerpo.ok).toBe(true)
    const fila = falso.base.sermones_comunidad![0]!
    expect(fila.email).toBe('u1@mail.com')
    expect(fila.nombre).toBe('Juan Pérez')
    expect(fila.pais).toBe('Colombia')
    expect(fila.minutos).toBe(35)
  })

  it('sin campos obligatorios: 400', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    const sinNombre = { ...cuerpoPublicar(), nombre: '' }
    const r = await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...sinNombre })
    }), falso.fetch)
    expect(r.status).toBe(400)
  })

  it('texto demasiado corto: 400', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    const corto = { ...cuerpoPublicar(), texto: 'muy corto' }
    const r = await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...corto })
    }), falso.fetch)
    expect(r.status).toBe(400)
  })

  it('minutos fuera de rango: 400', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    const mal = { ...cuerpoPublicar(), minutos: 999 }
    const r = await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...mal })
    }), falso.fetch)
    expect(r.status).toBe(400)
  })

  it('licencia invalida: 401', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const r = await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: 'falso', ...cuerpoPublicar() })
    }), falso.fetch)
    expect(r.status).toBe(401)
  })
})

describe('manejarLista y manejarObtener', () => {
  it('lista devuelve sermones publicados (sin texto)', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...cuerpoPublicar() })
    }), falso.fetch)
    falso.base.sermones_comunidad![0]!.id = '11111111-1111-1111-1111-111111111111'
    const r = await manejarLista(env, new Request('https://w.dev/comunidad/lista', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt })
    }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: Array<Record<string, unknown>> }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data).toHaveLength(1)
    expect(cuerpo.data[0].nombre).toBe('Juan Pérez')
    expect(cuerpo.data[0].pais).toBe('Colombia')
  })

  it('obtener devuelve el texto completo por id', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    await manejarPublicar(env, new Request('https://w.dev/comunidad/publicar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, ...cuerpoPublicar() })
    }), falso.fetch)
    const id = '22222222-2222-2222-2222-222222222222'
    falso.base.sermones_comunidad![0]!.id = id
    const r = await manejarObtener(env, new Request('https://w.dev/comunidad/obtener', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, id })
    }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: { texto: string; iglesia: string } }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data.texto).toBe(TEXTO)
    expect(cuerpo.data.iglesia).toBe('Iglesia Central')
  })

  it('obtener id inexistente: 404', async () => {
    const falso = supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], sermones_comunidad: [] })
    const jwt = await licenciaValida()
    const r = await manejarObtener(env, new Request('https://w.dev/comunidad/obtener', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, id: '33333333-3333-3333-3333-333333333333' })
    }), falso.fetch)
    expect(r.status).toBe(404)
  })
})
