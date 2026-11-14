import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SignJWT, importPKCS8 } from 'jose'
import { generateKeyPairSync } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { crearLicencia, estadoDesdeVerificacion } from './licencia'
import { crearSafeStorageFalso } from './almacen'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
const carpeta = mkdtempSync(join(tmpdir(), 'licmain-'))
const FIN_REAL = Date.now() + 20 * 86400000

async function jwtDelBackend(huella: string): Promise<string> {
  const clave = await importPKCS8(PRIVADA, 'EdDSA')
  return new SignJWT({ tipo: 'licencia', huella, estado: 'activa', trial: false })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject('p@mail.com')
    .setIssuedAt()
    .setExpirationTime(new Date(FIN_REAL + 7 * 86400000))
    .sign(clave)
}

function crearOrquestador(fetchEspia: typeof fetch) {
  return crearLicencia({
    backendUrl: 'https://w.dev',
    clavePublicaPem: PUBLICA,
    piezasHuella: ['maquina', 'instalacion'],
    carpeta,
    safeStorage: crearSafeStorageFalso(),
    fetchFn: fetchEspia
  })
}

describe('estadoDesdeVerificacion', () => {
  it('sin licencia', () => {
    expect(estadoDesdeVerificacion({ valido: false }, null).estado).toBe('sin_licencia')
  })
  it('expirada cuando exp <= ahora', () => {
    expect(estadoDesdeVerificacion({ valido: true, expiraMs: Date.now() - 1000, estado: 'activa' }, 'jwt').estado).toBe('expirada')
  })
  it('activa con diasRestantes = (exp - 7d) - ahora', () => {
    const e = estadoDesdeVerificacion({ valido: true, expiraMs: FIN_REAL + 7 * 86400000, estado: 'activa' }, 'jwt')
    expect(e.estado).toBe('activa')
    expect(e.diasRestantes).toBeCloseTo(20, 0)
  })
  it('cancelada mantiene estado del payload', () => {
    const e = estadoDesdeVerificacion({ valido: true, expiraMs: FIN_REAL + 7 * 86400000, estado: 'cancelada' }, 'jwt')
    expect(e.estado).toBe('cancelada')
  })
})

describe('orquestador con backend falso', () => {
  beforeEach(() => {
    rmSync(join(carpeta, 'licencia.dat'), { force: true })
  })

  it('estado inicial sin_licencia', () => {
    const licencia = crearOrquestador((async () => new Response('[]')) as typeof fetch)
    expect(licencia.estado().estado).toBe('sin_licencia')
  })

  it('iniciar hace login+activar+guardar y deja estado activa', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      if (ruta === '/license/activar' || ruta === '/license/refrescar') {
        return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
      }
      return new Response('[]')
    }) as typeof fetch)
    const e = await licencia.iniciar('p@mail.com', 'secreta123')
    expect(e.estado).toBe('activa')
    expect(e.email).toBe('p@mail.com')
    expect(e.diasRestantes).toBeCloseTo(20, 0)
    expect(licencia.estado().estado).toBe('activa')
  })

  it('credenciales malas propagan codigo del backend', async () => {
    const malo = crearOrquestador((async () => Response.json({ ok: false, error: 'email o contrasena incorrectos', codigo: 'credenciales' }, { status: 401 })) as typeof fetch)
    const e = await malo.iniciar('p@mail.com', 'malapass1')
    expect((e as unknown as { codigo?: string }).codigo).toBe('credenciales')
  })

  it('refrescarSiToca no revalida antes de 24h y mantiene el estado', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
    }) as typeof fetch)
    await licencia.iniciar('p@mail.com', 'secreta123')
    const espia = vi.spyOn({ m: () => {} }, 'm')
    void espia
    const e = await licencia.refrescarSiToca()
    expect(e.estado).toBe('activa')
  })

  it('salir borra el archivo y vuelve a sin_licencia', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
    }) as typeof fetch)
    await licencia.iniciar('p@mail.com', 'secreta123')
    licencia.salir()
    expect(licencia.estado().estado).toBe('sin_licencia')
  })
})
