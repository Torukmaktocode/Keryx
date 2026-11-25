import { describe, expect, it } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { SignJWT } from 'jose'
import { manejarIa } from './ia'
import type { Env } from './tipos'

const par = generateKeyPairSync('ed25519')
const env: Env = {
  HOTTOK: 'tok',
  SUPABASE_URL: 'https://sb.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'key',
  LICENCIA_PRIVADA: par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  LICENCIA_PUBLICA: par.publicKey.export({ type: 'spki', format: 'pem' }).toString(),
  OPENAI_KEY: 'sk-test'
}

let n = 0

async function licenciaValida(estado = 'trial', minutos = 20): Promise<string> {
  n += 1
  return new SignJWT({ tipo: 'licencia', huella: `h${n}`, estado })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(`u${n}@mail.com`)
    .setIssuedAt()
    .setExpirationTime(`${minutos}m`)
    .sign(par.privateKey)
}

function reqIa(licencia: string): Request {
  return new Request('https://w.dev/ai/chat', {
    method: 'POST',
    body: JSON.stringify({
      licencia,
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'resume Juan 3' }]
    }),
    headers: { 'Content-Type': 'application/json' }
  })
}

const openaiOk: Response = Response.json({ model: 'gpt-4o-mini', choices: [{ message: { content: 'resumen' } }] })

describe('manejarIa', () => {
  it('sin licencia en el cuerpo: 400 formato', async () => {
    const r = await manejarIa(env, new Request('https://w.dev/ai/chat', { method: 'POST', body: '{}' }))
    expect(r.status).toBe(400)
  })

  it('licencia con firma invalida: 401 sin_acceso', async () => {
    const parAjeno = generateKeyPairSync('ed25519')
    const jwt = await new SignJWT({ tipo: 'licencia', estado: 'trial' })
      .setProtectedHeader({ alg: 'EdDSA' })
      .setSubject('x@mail.com')
      .setIssuedAt()
      .setExpirationTime('20m')
      .sign(parAjeno.privateKey)
    const r = await manejarIa(env, reqIa(jwt), async () => openaiOk)
    expect(r.status).toBe(401)
  })

  it('licencia vencida: 401', async () => {
    const jwt = await licenciaValida('trial', -5)
    const r = await manejarIa(env, reqIa(jwt), async () => openaiOk)
    expect(r.status).toBe(401)
  })

  it('feliz: reenvia a OpenAI con la clave del servidor y devuelve la respuesta', async () => {
    const jwt = await licenciaValida()
    let capturada: RequestInit | undefined
    let url = ''
    const r = await manejarIa(env, reqIa(jwt), async (u, init) => {
      url = u
      capturada = init
      return openaiOk
    })
    const cuerpo = (await r.json()) as { ok: boolean; data: { choices: Array<{ message: { content: string } }> } }
    expect(cuerpo.ok).toBe(true)
    expect(url).toBe('https://api.openai.com/v1/chat/completions')
    const headers = capturada?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer sk-test')
    expect(cuerpo.data.choices[0].message.content).toBe('resumen')
  })

  it('sin OPENAI_KEY en el servidor: 500 sin_ia', async () => {
    const jwt = await licenciaValida()
    const sinKey: Env = { ...env, OPENAI_KEY: undefined }
    const r = await manejarIa(sinKey, reqIa(jwt), async () => openaiOk)
    const cuerpo = (await r.json()) as { ok: boolean; codigo: string }
    expect(cuerpo.codigo).toBe('sin_ia')
  })

  it('estado expirada en el payload: 401', async () => {
    const jwt = await licenciaValida('expirada')
    const r = await manejarIa(env, reqIa(jwt), async () => openaiOk)
    expect(r.status).toBe(401)
  })
})
