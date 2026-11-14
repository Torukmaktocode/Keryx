import { describe, expect, it } from 'vitest'
import { SignJWT, importPKCS8 } from 'jose'
import { generateKeyPairSync } from 'node:crypto'
import { verificarLicencia, calcularHuella } from './verificar'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()

async function jwtDe(huella: string, exp: Date): Promise<string> {
  const clave = await importPKCS8(PRIVADA, 'EdDSA')
  return new SignJWT({ tipo: 'licencia', huella, estado: 'activa', trial: false })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject('p@mail.com')
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(clave)
}

describe('verificarLicencia', () => {
  it('valida firma + huella + exp', async () => {
    const jwt = await jwtDe('huella-1', new Date(Date.now() + 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(true)
    expect(r.email).toBe('p@mail.com')
    expect(r.trial).toBe(false)
  })

  it('huella distinta: invalido', async () => {
    const jwt = await jwtDe('otra', new Date(Date.now() + 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('exp vencido: invalido', async () => {
    const jwt = await jwtDe('huella-1', new Date(Date.now() - 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('firma con otra clave: invalido (nadie forja licencias)', async () => {
    const parB = generateKeyPairSync('ed25519')
    const claveB = await importPKCS8(parB.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(), 'EdDSA')
    const jwt = await new SignJWT({ tipo: 'licencia', huella: 'huella-1' })
      .setProtectedHeader({ alg: 'EdDSA' })
      .setSubject('x@mail.com')
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + 3600000))
      .sign(claveB)
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('calcularHuella es sha256 hex estable', () => {
    expect(calcularHuella(['a', 'b'])).toBe(calcularHuella(['a', 'b']))
    expect(calcularHuella(['a', 'b'])).toMatch(/^[0-9a-f]{64}$/)
    expect(calcularHuella(['b', 'a'])).not.toBe(calcularHuella(['a', 'b']))
  })
})
