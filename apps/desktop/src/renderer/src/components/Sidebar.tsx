import { useEffect, useState, type ReactElement } from 'react'
import { LOCALES, useI18n, type TranslationKey } from '@keryx/i18n'
import type { AppSettings, LenguaEstado } from '@keryx/core'
import { useAppStore, type View } from '../store/appStore'
import { Icon, type IconName } from './Icon'
import { api } from '../lib/api'
import {
  estadoTraduccion,
  formatoDuracion,
  msDeCarga,
  NATIVAS,
  useCargaIdioma
} from '../lib/traductor'

const ITEMS: { id: View; icon: IconName }[] = [
  { id: 'reader', icon: 'reader' },
  { id: 'study', icon: 'study' },
  { id: 'search', icon: 'search' },
  { id: 'assistant', icon: 'spark' },
  { id: 'inspiration', icon: 'star' },
  { id: 'library', icon: 'library' },
  { id: 'write', icon: 'write' },
  { id: 'templates', icon: 'templates' },
  { id: 'presentaciones', icon: 'slides' },
  { id: 'modules', icon: 'modules' },
  { id: 'settings', icon: 'settings' }
]

export function Sidebar() {
  const { t } = useI18n()
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const locale = useAppStore((s) => s.settings.uiLocale)
  const translateLocale = useAppStore((s) => s.settings.translateLocale)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const [motor, setMotor] = useState<{ available: boolean } | null>(null)
  const [lenguas, setLenguas] = useState<LenguaEstado[]>([])

  useEffect(() => {
    void estadoTraduccion().then((status) => setMotor(status))
    void api.translate.lenguas().then((lenguas) => setLenguas(lenguas))
  }, [])

  /* Revalidar el estado del motor cuando se cambia de idioma: el banner
   * "no disponible" no puede quedar pegado si el daemon ya se relanzó. */
  useEffect(() => {
    let vivo = true
    void estadoTraduccion().then((status) => {
      if (vivo) setMotor(status)
    })
    return () => {
      vivo = false
    }
  }, [translateLocale])

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <strong>Keryx</strong>
        <span>{t('brand.tagline')}</span>
      </div>
      <nav className="nav">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${view === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <Icon name={item.icon} />
            {t(`nav.${item.id}`)}
          </button>
        ))}
        <button className="nav-item" onClick={() => void toggleSidebar()}>
          <Icon name="menu" />
          {t('app.hideMenu')}
        </button>
      </nav>
      <div className="sidebar-footer">
        {locale !== 'es' && motor && !motor.available && (
          <small className="muted" style={{ display: 'block', padding: '2px 6px' }}>
            {t('traduccion.noDisponible')}
          </small>
        )}
        <div className="lang-switch" title={t('settings.language')}>
          {LOCALES.map((code) => (
            <ChipMayor
              key={code}
              code={code}
              activo={locale === code && !NATIVAS.includes(translateLocale)}
              titulo={t(`language.${code}` as TranslationKey)}
              onElegir={() => void updateSettings({ uiLocale: code, translateLocale: code })}
            />
          ))}
        </div>
        <div className="lang-switch nativas" title={t('settings.nativas')}>
          {(lenguas.length ? lenguas.map((l) => l.code) : NATIVAS).map((code) => {
            const estado = lenguas.find((l) => l.code === code)
            return (
              <ChipNativa
                key={code}
                code={code}
                translateLocale={translateLocale}
                updateSettings={updateSettings}
                estado={estado}
                disabled={estado?.motor === 'pendiente'}
              />
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function ChipMayor({
  code,
  activo,
  titulo,
  onElegir
}: {
  code: string
  activo: boolean
  titulo: string
  onElegir: () => void
}): ReactElement {
  const carga = useCargaIdioma(code)
  const ms = carga ? msDeCarga(carga) : null
  const pct = carga && carga.total ? Math.round((carga.listo / carga.total) * 100) : 0
  return (
    <button className={activo ? 'active' : ''} onClick={onElegir} title={titulo}>
      <span>{code.toUpperCase()}</span>
      {carga?.estado === 'cargando' && (
        <span className="nativa-carga" style={{ width: `${pct}%` }} data-pct={pct} />
      )}
      <span className={`carga-ms ${ms !== null ? 'visible' : ''}`}>
        {ms !== null ? formatoDuracion(ms) : ''}
      </span>
    </button>
  )
}

function ChipNativa({
  code,
  translateLocale,
  updateSettings,
  estado,
  disabled = false
}: {
  code: string
  translateLocale: string
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>
  estado?: LenguaEstado
  disabled?: boolean
}): ReactElement {
  const { t } = useI18n()
  const carga = useCargaIdioma(code)
  const ms = carga ? msDeCarga(carga) : null
  const pct = carga && carga.total ? Math.round((carga.listo / carga.total) * 100) : 0
  return (
    <button
      className={translateLocale === code ? 'active' : ''}
      onClick={() => void updateSettings({ translateLocale: code })}
      disabled={disabled}
      title={
        disabled
          ? t('settings.sinCorpus')
          : estado
            ? `${estado.nombre} · ${estado.motor === 'corpus' ? 'corpus verificado' : 'motor neural'} · ${estado.versosCorpus.toLocaleString('es')} versos · glosario ${estado.glosario} pares · ${estado.alfabeto}`
            : t(`language.${code}` as TranslationKey)
      }
    >
      <span className="nativa-nombre">{t(`language.${code}` as TranslationKey)}</span>
      {carga && carga.estado === 'cargando' && (
        <span className="nativa-carga" style={{ width: `${pct}%` }} data-pct={pct} />
      )}
      {carga?.estado === 'listo' && <span className="nativa-listo" />}
      <span className={`carga-ms ${ms !== null ? 'visible' : ''}`}>
        {ms !== null ? formatoDuracion(ms) : ''}
      </span>
    </button>
  )
}
