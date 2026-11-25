export type EstadoLicencia = 'sin_licencia' | 'trial' | 'activa' | 'cancelada' | 'gracia' | 'expirada' | 'bloqueada'

export interface EstadoActual {
  estado: EstadoLicencia
  email?: string
  expiraISO?: string
  diasRestantes?: number
}

export interface LicenciaError {
  error: string
  codigo?: string
}

export const BACKEND_URL = 'https://keryx-licencias.keryx-backend.workers.dev'
export const CHECKOUT_URL = 'https://pay.hotmart.com/8968763'
