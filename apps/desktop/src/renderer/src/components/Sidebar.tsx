import { LOCALES, useI18n } from '@keryx/i18n'
import { useAppStore, type View } from '../store/appStore'
import { Icon, type IconName } from './Icon'

const ITEMS: { id: View; icon: IconName }[] = [
  { id: 'home', icon: 'home' },
  { id: 'reader', icon: 'reader' },
  { id: 'study', icon: 'study' },
  { id: 'search', icon: 'search' },
  { id: 'assistant', icon: 'spark' },
  { id: 'inspiration', icon: 'star' },
  { id: 'library', icon: 'library' },
  { id: 'write', icon: 'write' },
  { id: 'templates', icon: 'templates' },
  { id: 'modules', icon: 'modules' },
  { id: 'settings', icon: 'settings' }
]

export function Sidebar() {
  const { t } = useI18n()
  const view = useAppStore((s) => s.view)
  const setView = useAppStore((s) => s.setView)
  const engine = useAppStore((s) => s.engine)
  const locale = useAppStore((s) => s.settings.uiLocale)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const version = useAppStore((s) => s.version)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <aside className="sidebar">
      <button className="sidebar-brand" onClick={() => setView('home')}>
        <strong>Keryx</strong>
        <span>{t('brand.tagline')}</span>
      </button>
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
        <div className="lang-switch" title={t('settings.language')}>
          {LOCALES.map((code) => (
            <button
              key={code}
              className={locale === code ? 'active' : ''}
              onClick={() => void updateSettings({ uiLocale: code })}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <span>
          {engine ? (engine.native ? t('engine.native') : t('engine.demo')) : t('engine.starting')}
        </span>
        <span className="muted">{version}</span>
      </div>
    </aside>
  )
}
