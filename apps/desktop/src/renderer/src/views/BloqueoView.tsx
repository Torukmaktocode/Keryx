import type { JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import { api } from '../lib/api'
import type { EstadoActual } from '@keryx/core/licencia'
import { mensajeDeEstado } from '../lib/licencia-ui'

export function BloqueoView({ estado, alListo }: { estado: EstadoActual; alListo: (estado?: EstadoActual) => void }): JSX.Element {
  const { t } = useI18n()
  const mensaje = mensajeDeEstado(estado)
  return (
    <div className="licencia-panel">
      <h1>Keryx</h1>
      <p className="licencia-sub">{t(mensaje.clave as never, mensaje.vars as never)}</p>
      <button className="licencia-boton" onClick={() => void api.licencia.checkout()}>
        {t('licencia.renovar')}
      </button>
      <button className="licencia-enlace" onClick={() => void api.licencia.salir().then(() => alListo())}>
        {t('licencia.salir')}
      </button>
    </div>
  )
}
