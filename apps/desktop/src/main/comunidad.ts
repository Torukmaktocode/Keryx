import { BACKEND_URL } from '@keryx/core/licencia'
import type { LicenciaError } from '@keryx/core/licencia'
import type { SermónComunidadCompleto, SermónComunidadResumen } from '@keryx/core'
import { licencia } from './licencia-puente'

type Rta<T> = { ok: true; data: T } | { ok: false; error: string; codigo?: string }

interface EntradaPublicar {
  titulo: string
  nombre: string
  iglesia: string
  ciudad: string
  pais: string
  contexto: string
  minutos: number
  experiencia?: string
  texto: string
}

async function post<T>(ruta: string, cuerpo: Record<string, unknown>): Promise<T | LicenciaError> {
  const jwt = licencia.jwtActual()
  if (!jwt) return { error: 'Entra con tu cuenta para usar la comunidad.', codigo: 'sin_acceso' }
  try {
    const r = await fetch(`${BACKEND_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licencia: jwt, ...cuerpo })
    })
    const cuerpo_rta = (await r.json()) as Rta<T>
    if (cuerpo_rta.ok) return cuerpo_rta.data
    return { error: cuerpo_rta.error, codigo: cuerpo_rta.codigo }
  } catch {
    return { error: 'No se pudo conectar con el servidor.', codigo: 'red' }
  }
}

export function comunidadPublicar(args: EntradaPublicar): Promise<{ publicado: true } | LicenciaError> {
  return post<{ publicado: true }>('/comunidad/publicar', { ...args })
}

export function comunidadLista(): Promise<SermónComunidadResumen[] | LicenciaError> {
  return post<SermónComunidadResumen[]>('/comunidad/lista', {})
}

export function comunidadObtener(id: string): Promise<SermónComunidadCompleto | LicenciaError> {
  return post<SermónComunidadCompleto>('/comunidad/obtener', { id })
}
