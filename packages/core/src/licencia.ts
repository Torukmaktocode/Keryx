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

export const BACKEND_URL = ''
export const CHECKOUT_URL = ''
