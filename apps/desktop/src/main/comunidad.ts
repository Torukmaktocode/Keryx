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

export function comunidadLista(autor?: string): Promise<Array<SermónComunidadResumen & { email?: string }> | LicenciaError> {
  return post<Array<SermónComunidadResumen & { email?: string }>>('/comunidad/lista', autor ? { autor } : {})
}

export function comunidadObtener(id: string): Promise<SermónComunidadCompleto | LicenciaError> {
  return post<SermónComunidadCompleto>('/comunidad/obtener', { id })
}

export function comunidadLike(id: string): Promise<{ likes: number; yo_doy_like: boolean } | LicenciaError> {
  return post<{ likes: number; yo_doy_like: boolean }>('/comunidad/like', { id })
}

export function comunidadComentar(id: string, nombre: string, texto: string): Promise<{ comentado: true } | LicenciaError> {
  return post<{ comentado: true }>('/comunidad/comentar', { id, nombre, texto })
}

export function comunidadComentarios(id: string): Promise<Array<{ nombre: string; texto: string; creado_at: string }> | LicenciaError> {
  return post<Array<{ nombre: string; texto: string; creado_at: string }>>('/comunidad/comentarios', { id })
}

export function comunidadSeguir(autor: string): Promise<{ seguidores: number; siguiendo: boolean } | LicenciaError> {
  return post<{ seguidores: number; siguiendo: boolean }>('/comunidad/seguir', { autor })
}

export function comunidadSeguidores(autor: string): Promise<{ seguidores: number; yo_sigo: boolean } | LicenciaError> {
  return post<{ seguidores: number; yo_sigo: boolean }>('/comunidad/seguidores', { autor })
}
