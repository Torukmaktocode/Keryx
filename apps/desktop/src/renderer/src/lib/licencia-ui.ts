import type { EstadoActual, LicenciaError } from '@keryx/core/licencia'

export function mensajeDeEstado(estado: EstadoActual): { clave: string; vars?: Record<string, unknown> } {
  const vars = estado.diasRestantes !== undefined ? { dias: estado.diasRestantes } : undefined
  return { clave: `licencia.estado.${estado.estado}`, vars }
}

export function esErrorLogin(rta: unknown): rta is LicenciaError {
  return typeof rta === 'object' && rta !== null && 'error' in rta
}

export function necesitaBanner(estado: EstadoActual): boolean {
  return estado.estado === 'trial' || estado.estado === 'gracia'
}

export function codigoAKey(codigo?: string): string {
  return `licencia.error.${codigo ?? 'red'}`
}
