import { describe, expect, it } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { SignJWT } from 'jose'
import { supabaseFalso } from './supabase-falso'
import {
  manejarPublicar,
  manejarLista,
  manejarLlamita,
  manejarResponder,
  manejarComentar,
  manejarComentarios
} from './oracion'
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

function baseVacia() {
  return supabaseFalso({ suscripciones: [], usuarios: [], dispositivos: [], oraciones: [], oraciones_oran: [] })
}

const PETICION = 'Oren por la salud de mi padre que esta hospitalizado desde el lunes.'

async function publicar(falso: ReturnType<typeof baseVacia>, jwt: string, extras: Record<string, unknown> = {}): Promise<Response> {
  return manejarPublicar(env, new Request('https://w.dev/oracion/publicar', {
    method: 'POST',
    body: JSON.stringify({ licencia: jwt, nombre: 'Maria Gomez', pais: 'Argentina', peticion: PETICION, ...extras })
  }), falso.fetch)
}

describe('manejarPublicar (oracion)', () => {
  it('feliz: publica con email de la licencia', async () => {
    const falso = baseVacia()
    const jwt = await licenciaValida()
    const r = await publicar(falso, jwt)
    const cuerpo = (await r.json()) as { ok: boolean }
    expect(cuerpo.ok).toBe(true)
    expect(falso.base.oraciones![0]!.email).toBe('u1@mail.com')
    expect(falso.base.oraciones![0]!.pais).toBe('Argentina')
  })

  it('peticion demasiado corta: 400', async () => {
    const falso = baseVacia()
    const jwt = await licenciaValida()
    const r = await publicar(falso, jwt, { peticion: 'corta' })
    expect(r.status).toBe(400)
  })

  it('licencia invalida: 401', async () => {
    const falso = baseVacia()
    const r = await publicar(falso, 'falso')
    expect(r.status).toBe(401)
  })
})

describe('manejarLlamita', () => {
  it('prende y apaga la llamita, contando orando', async () => {
    const falso = baseVacia()
    const jwtAutor = await licenciaValida()
    await publicar(falso, jwtAutor)
    falso.base.oraciones![0]!.id = 'aaaaaaaa-0000-0000-0000-000000000001'
    const id = falso.base.oraciones![0]!.id as string

    const jwtOtro = await licenciaValida()
    const r1 = await manejarLlamita(env, new Request('https://w.dev/oracion/llamita', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro, id })
    }), falso.fetch)
    const c1 = (await r1.json()) as { ok: boolean; data: { orando: number; yo_oro: boolean } }
    expect(c1.data).toEqual({ orando: 1, yo_oro: true })

    const r2 = await manejarLlamita(env, new Request('https://w.dev/oracion/llamita', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro, id })
    }), falso.fetch)
    const c2 = (await r2.json()) as { ok: boolean; data: { orando: number; yo_oro: boolean } }
    expect(c2.data).toEqual({ orando: 0, yo_oro: false })
  })
})

describe('manejarResponder', () => {
  it('solo el autor marca la respuesta', async () => {
    const falso = baseVacia()
    const jwtAutor = await licenciaValida()
    await publicar(falso, jwtAutor)
    falso.base.oraciones![0]!.id = 'aaaaaaaa-0000-0000-0000-000000000002'
    const id = falso.base.oraciones![0]!.id as string

    const jwtOtro = await licenciaValida()
    const rAjeno = await manejarResponder(env, new Request('https://w.dev/oracion/responder', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro, id, respuesta: 'Dios respondio de una manera maravillosa' })
    }), falso.fetch)
    expect(rAjeno.status).toBe(403)

    const rAutor = await manejarResponder(env, new Request('https://w.dev/oracion/responder', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtAutor, id, respuesta: 'Mi padre salio del hospital: Dios respondio' })
    }), falso.fetch)
    const cuerpo = (await rAutor.json()) as { ok: boolean; data: { respondida: boolean } }
    expect(cuerpo.data.respondida).toBe(true)
    expect(falso.base.oraciones![0]!.respuesta).toContain('salio del hospital')
  })
})

describe('manejarLista (oracion)', () => {
  it('devuelve las oraciones con contador de llamitas', async () => {
    const falso = baseVacia()
    const jwtAutor = await licenciaValida()
    await publicar(falso, jwtAutor)
    falso.base.oraciones![0]!.id = 'aaaaaaaa-0000-0000-0000-000000000003'
    const id = falso.base.oraciones![0]!.id as string
    const jwtOtro = await licenciaValida()
    await manejarLlamita(env, new Request('https://w.dev/oracion/llamita', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro, id })
    }), falso.fetch)

    const r = await manejarLista(env, new Request('https://w.dev/oracion/lista', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro })
    }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: Array<{ pais: string; orando: number; yo_oro: boolean }> }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data[0].pais).toBe('Argentina')
    expect(cuerpo.data[0].orando).toBe(1)
    expect(cuerpo.data[0].yo_oro).toBe(true)
  })
})

describe('comentarios de oracion', () => {
  it('cualquier usuario comenta y los comentarios se listan', async () => {
    const falso = baseVacia()
    const jwtAutor = await licenciaValida()
    await publicar(falso, jwtAutor)
    falso.base.oraciones![0]!.id = 'aaaaaaaa-0000-0000-0000-000000000004'
    const id = falso.base.oraciones![0]!.id as string

    const jwtOtro = await licenciaValida()
    const rC = await manejarComentar(env, new Request('https://w.dev/oracion/comentar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtOtro, id, nombre: 'Pedro', texto: 'Oro por la sanidad de tu padre' })
    }), falso.fetch)
    const cuerpoC = (await rC.json()) as { ok: boolean; data: { comentado: boolean } }
    expect(cuerpoC.data.comentado).toBe(true)

    const rL = await manejarComentarios(env, new Request('https://w.dev/oracion/comentarios', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwtAutor, id })
    }), falso.fetch)
    const cuerpoL = (await rL.json()) as { ok: boolean; data: Array<{ nombre: string; texto: string }> }
    expect(cuerpoL.ok).toBe(true)
    expect(cuerpoL.data).toHaveLength(1)
    expect(cuerpoL.data[0].nombre).toBe('Pedro')
  })

  it('comentario demasiado corto: 400', async () => {
    const falso = baseVacia()
    const jwt = await licenciaValida()
    const r = await manejarComentar(env, new Request('https://w.dev/oracion/comentar', {
      method: 'POST',
      body: JSON.stringify({ licencia: jwt, id: 'aaaaaaaa-0000-0000-0000-000000000005', texto: 'x' })
    }), falso.fetch)
    expect(r.status).toBe(400)
  })
})
