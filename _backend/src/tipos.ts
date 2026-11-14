export type EstadoSuscripcion = 'activa' | 'cancelada' | 'inactiva' | 'trial'

export interface Suscripcion {
  email: string
  estado: EstadoSuscripcion
  expira_at: string | null
  trial_hasta: string | null
  hotmart_comprador_id: string | null
  actualizado_at: string
}

export interface Usuario {
  email: string
  password_hash: string
  creado_at: string
}

export interface Dispositivo {
  email: string
  huella: string
  activado_at: string
}

export interface Env {
  HOTTOK: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  LICENCIA_PRIVADA: string
  LICENCIA_PUBLICA: string
}

export type Rta<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; codigo?: string }

export function rtaOk<T>(data: T): Response {
  return Response.json({ ok: true, data })
}

export function rtaError(error: string, codigo?: string, status = 400): Response {
  return Response.json({ ok: false, error, codigo }, { status })
}
