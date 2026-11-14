import { hostname, userInfo } from 'node:os'
import { ClienteLicencia, type LoginRta } from './cliente'
import { crearAlmacen } from './almacen'
import { calcularHuella } from './huella'
import { verificarLicencia, type VerificacionLicencia } from './verificar'
import { GRACIA_DIAS, type EstadoActual, type EstadoLicencia } from './tipos'

const DIA_MS = 86400000

export function estadoDesdeVerificacion(v: VerificacionLicencia, jwt: string | null): EstadoActual {
  if (!jwt || !v.valido) return { estado: 'sin_licencia' }
  const expiraMs = v.expiraMs ?? 0
  if (expiraMs <= Date.now()) return { estado: 'expirada', email: v.email }
  const diasRestantes = Math.max(0, Math.round((expiraMs - Date.now()) / DIA_MS - GRACIA_DIAS))
  const estado: EstadoLicencia = v.estado === 'trial' ? 'trial' : v.estado === 'cancelada' ? 'cancelada' : 'activa'
  return { estado, email: v.email, expiraISO: new Date(expiraMs).toISOString(), diasRestantes }
}

export interface OpcionesLicencia {
  backendUrl: string
  clavePublicaPem: string
  piezasHuella?: string[]
  carpeta: string
  safeStorage: import('./almacen').SafeStorageMin
  fetchFn?: typeof fetch
  msRevalidar?: number
}

export function crearLicencia(opciones: OpcionesLicencia) {
  const huella = calcularHuella(opciones.piezasHuella ?? [hostname(), userInfo().username])
  const almacen = crearAlmacen({ carpeta: opciones.carpeta, safeStorage: opciones.safeStorage })
  const cliente = new ClienteLicencia(opciones.backendUrl, opciones.fetchFn)
  let ultimaRed = 0

  async function verificar(): Promise<EstadoActual> {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    return estadoDesdeVerificacion(await verificarLicencia(jwt, opciones.clavePublicaPem, huella), jwt)
  }

  function estado(): EstadoActual {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    try {
      const parsed = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8')) as { exp?: number; huella?: string; estado?: string }
      if (parsed.huella && parsed.huella !== huella) return { estado: 'bloqueada' }
      if (typeof parsed.exp === 'number' && parsed.exp * 1000 <= Date.now()) return { estado: 'expirada' }
      const delPayload = parsed.estado
      if (delPayload === 'trial' || delPayload === 'activa' || delPayload === 'cancelada') return { estado: delPayload }
      return { estado: 'gracia' }
    } catch {
      return { estado: 'expirada' }
    }
  }

  async function iniciar(email: string, password: string): Promise<EstadoActual | { error: string; codigo?: string }> {
    const sesion = await cliente.tokenSesion(email, password)
    if ('error' in sesion) return { error: sesion.error, codigo: sesion.codigo }
    const activada = await cliente.activar(sesion.token, huella)
    if ('error' in activada) return { error: activada.error, codigo: activada.codigo }
    almacen.guardar(activada.licencia)
    ultimaRed = Date.now()
    return await verificar()
  }

  async function refrescarSiToca(): Promise<EstadoActual> {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    const v = await verificarLicencia(jwt, opciones.clavePublicaPem, huella)
    if (!v.valido) return estadoDesdeVerificacion(v, jwt)
    if (Date.now() - ultimaRed < (opciones.msRevalidar ?? 24 * 3600000)) return estadoDesdeVerificacion(v, jwt)
    const renovada = await cliente.refrescar(jwt)
    if ('error' in renovada) {
      if (renovada.codigo === 'sin_acceso') {
        almacen.borrar()
        return { estado: 'expirada' }
      }
    } else {
      almacen.guardar(renovada.licencia)
      ultimaRed = Date.now()
    }
    return await verificar()
  }

  function salir(): void {
    almacen.borrar()
  }

  function iniciarCron(): void {
    setInterval(() => {
      void refrescarSiToca()
    }, opciones.msRevalidar ?? 24 * 3600000)
  }

  return { estado, iniciar, verificar, refrescarSiToca, salir, iniciarCron, huella }
}

export type { LoginRta }
