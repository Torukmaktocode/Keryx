import { BACKEND_URL } from '@keryx/core/licencia'
import type { LicenciaError } from '@keryx/core/licencia'
import type { OraciónResumen } from '@keryx/core'
import { licencia } from './licencia-puente'

type Rta<T> = { ok: true; data: T } | { ok: false; error: string; codigo?: string }

async function post<T>(ruta: string, cuerpo: Record<string, unknown>): Promise<T | LicenciaError> {
  const jwt = licencia.jwtActual()
  if (!jwt) return { error: 'Entra con tu cuenta para usar la oración.', codigo: 'sin_acceso' }
  try {
    const r = await fetch(`${BACKEND_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licencia: jwt, ...cuerpo })
    })
    const rta = (await r.json()) as Rta<T>
    if (rta.ok) return rta.data
    return { error: rta.error, codigo: rta.codigo }
  } catch {
    return { error: 'No se pudo conectar con el servidor.', codigo: 'red' }
  }
}

export function oracionPublicar(args: { nombre: string; pais: string; peticion: string }): Promise<{ publicado: true } | LicenciaError> {
  return post<{ publicado: true }>('/oracion/publicar', { ...args })
}

export function oracionLista(args?: { categoria?: string; modo?: string }): Promise<OraciónResumen[] | LicenciaError> {
  return post<OraciónResumen[]>('/oracion/lista', { ...(args ?? {}) })
}

export function oracionLlamita(id: string): Promise<{ orando: number; yo_oro: boolean } | LicenciaError> {
  return post<{ orando: number; yo_oro: boolean }>('/oracion/llamita', { id })
}

export function oracionResponder(id: string, respuesta: string): Promise<{ respondida: true } | LicenciaError> {
  return post<{ respondida: true }>('/oracion/responder', { id, respuesta })
}
