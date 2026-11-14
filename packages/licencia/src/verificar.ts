import { jwtVerify, importSPKI } from 'jose'

export { calcularHuella } from './huella'

export interface VerificacionLicencia {
  valido: boolean
  email?: string
  expiraMs?: number
  trial?: boolean
  estado?: string
}

export async function verificarLicencia(jwt: string, publicaPem: string, huella: string): Promise<VerificacionLicencia> {
  try {
    const clave = await importSPKI(publicaPem, 'EdDSA')
    const { payload } = await jwtVerify(jwt, clave)
    if (payload.tipo !== 'licencia' || payload.huella !== huella) return { valido: false }
    return {
      valido: true,
      email: String(payload.sub ?? ''),
      expiraMs: typeof payload.exp === 'number' ? payload.exp * 1000 : undefined,
      trial: payload.trial === true,
      estado: typeof payload.estado === 'string' ? payload.estado : undefined
    }
  } catch {
    return { valido: false }
  }
}
