import { app, safeStorage } from 'electron'
import { hostname, userInfo } from 'node:os'
import { crearLicencia } from '@keryx/licencia'
import { BACKEND_URL } from '@keryx/core/licencia'
import { CLAVE_PUBLICA } from './clave-publica'

export const licencia = crearLicencia({
  backendUrl: BACKEND_URL,
  clavePublicaPem: CLAVE_PUBLICA,
  piezasHuella: [hostname(), userInfo().username, app.getName()],
  carpeta: app.getPath('userData'),
  safeStorage
})
