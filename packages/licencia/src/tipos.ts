export type EstadoLicencia = 'sin_licencia' | 'trial' | 'activa' | 'cancelada' | 'gracia' | 'expirada' | 'bloqueada'

export interface EstadoActual {
  estado: EstadoLicencia
  email?: string
  expiraISO?: string
  diasRestantes?: number
}

export const GRACIA_DIAS = 7
