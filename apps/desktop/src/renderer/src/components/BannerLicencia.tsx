import type { JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import type { EstadoActual } from '@keryx/core/licencia'
import { mensajeDeEstado, necesitaBanner } from '../lib/licencia-ui'

export function BannerLicencia({ estado }: { estado: EstadoActual | null }): JSX.Element | null {
  const { t } = useI18n()
  if (!estado || !necesitaBanner(estado)) return null
  const mensaje = mensajeDeEstado(estado)
  return (
    <div className="licencia-banner">
      <span className="licencia-banner-icono">✦</span>
      {t(mensaje.clave as never, mensaje.vars as never)}
    </div>
  )
}
