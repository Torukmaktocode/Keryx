import { suscripcionDe, upsertSuscripcion } from './db'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>

export const MAPEO_EVENTOS: Record<string, 'activa' | 'cancelada' | 'inactiva'> = {
  PURCHASE_APPROVED: 'activa',
  PURCHASE_COMPLETE: 'activa',
  SUBSCRIPTION_RENEWAL: 'activa',
  SUBSCRIPTION_CANCELLATION: 'cancelada',
  PURCHASE_CANCELED: 'cancelada',
  SUBSCRIPTION_EXPIRATION: 'inactiva',
  PURCHASE_REFUNDED: 'inactiva'
}

function fechaExpira(data: Record<string, unknown>): string {
  const compra = data['purchase'] as Record<string, unknown> | undefined
  const proximo = typeof compra?.['next_cycle_date'] === 'string' ? (compra['next_cycle_date'] as string) : null
  if (proximo) return new Date(`${proximo}T12:00:00Z`).toISOString()
  return new Date(Date.now() + 30 * 86400000).toISOString()
}

export async function manejarWebhook(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  if (req.headers.get('X-Hotmart-Token') !== env.HOTTOK) return rtaError('hottok invalido', 'hottok', 403)
  const cuerpo = (await req.json().catch(() => null)) as { event?: string; data?: Record<string, unknown> } | null
  const evento = cuerpo?.event ?? ''
  const data = cuerpo?.data ?? {}
  const destino = MAPEO_EVENTOS[evento]
  if (!destino) return rtaOk({ ignorado: evento })

  const sub = data['subscriber'] as Record<string, unknown> | undefined
  const buyer = data['buyer'] as Record<string, unknown> | undefined
  const email =
    typeof sub?.['email'] === 'string' ? (sub['email'] as string) : typeof buyer?.['email'] === 'string' ? (buyer['email'] as string) : null
  if (!email) return rtaError('sin email en el evento', 'sin_email', 400)
  const compradorId = typeof sub?.['subscriber_code'] === 'string' ? (sub['subscriber_code'] as string) : null

  const previa = await suscripcionDe(env, email, fetchFn)
  const expira_at = destino === 'activa' ? fechaExpira(data) : (previa?.expira_at ?? null)
  await upsertSuscripcion(env, { email, estado: destino, expira_at, hotmart_comprador_id: compradorId ?? previa?.hotmart_comprador_id ?? null }, fetchFn)
  return rtaOk({ evento, email, estado: destino })
}
