import { Suspense, lazy, useEffect, useState } from 'react'
import type { JSX } from 'react'
import { I18nProvider, useI18n } from '@keryx/i18n'
import type { EstadoActual } from '@keryx/core/licencia'
import { useAppStore } from './store/appStore'
import { api } from './lib/api'
import { LoginView } from './views/LoginView'
import { BloqueoView } from './views/BloqueoView'
import { BannerLicencia } from './components/BannerLicencia'
import { Sidebar } from './components/Sidebar'
import { ReaderView } from './views/ReaderView'
import { StudyView } from './views/StudyView'
import { SearchView } from './views/SearchView'
import { LibraryView } from './views/LibraryView'
import { TemplatesView } from './views/TemplatesView'
import { AssistantView } from './views/AssistantView'
import { InspirationView } from './views/InspirationView'
import { ModulesView } from './views/ModulesView'
import { SettingsView } from './views/SettingsView'
import { Icon } from './components/Icon'

const WritingView = lazy(() =>
  import('./views/WritingView').then((m) => ({ default: m.WritingView })),
)

const PresentacionesView = lazy(() =>
  import('./views/PresentacionesView').then((m) => ({ default: m.PresentacionesView })),
)

function Shell({ estadoLicencia }: { estadoLicencia: EstadoActual | null }) {
  const { t } = useI18n()
  const view = useAppStore((s) => s.view)
  const ready = useAppStore((s) => s.ready)
  const error = useAppStore((s) => s.error)
  const toast = useAppStore((s) => s.toast)
  const notify = useAppStore((s) => s.notify)
  const sidebarHidden = useAppStore((s) => s.sidebarHidden)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const toggleFullscreen = useAppStore((s) => s.toggleFullscreen)
  const fullscreen = useAppStore((s) => s.fullscreen)
  const setFullscreen = useAppStore((s) => s.setFullscreen)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => notify(null), 2600)
    return () => clearTimeout(timer)
  }, [toast, notify])

  // Estado real de pantalla completa (p. ej. F11 nativo o el usuario maximiza).
  useEffect(() => {
    let cancelled = false
    void api.window
      .isFullscreen()
      .then((value) => {
        if (!cancelled) setFullscreen(value)
      })
      .catch(() => {
        // ignorar
      })
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'F11') {
        e.preventDefault()
        void toggleFullscreen()
      } else if (e.key.toLowerCase() === 'b' && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        void toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelled = true
      window.removeEventListener('keydown', onKey)
    }
  }, [toggleFullscreen, toggleSidebar, setFullscreen])

  return (
    <div className={`app ${sidebarHidden ? 'sidebar-hidden' : ''}`}>
      {!sidebarHidden && <Sidebar />}
      {sidebarHidden && (
        <button
          className="sidebar-reveal"
          onClick={() => void toggleSidebar()}
          title={t('app.showMenu')}
        >
          <Icon name="menu" size={16} />
        </button>
      )}
      <main className="content">
        <BannerLicencia estado={estadoLicencia} />
        <div className="window-controls">
          <button
            className="btn ghost small"
            onClick={() => void toggleSidebar()}
            title={t('app.toggleMenu')}
          >
            <Icon name="menu" size={16} />
          </button>
          <button
            className={`btn ghost small ${fullscreen ? 'primary' : ''}`}
            onClick={() => void toggleFullscreen()}
            title={t('app.toggleFullscreen')}
          >
            <Icon name={fullscreen ? 'fullscreen-exit' : 'fullscreen'} size={16} />
          </button>
        </div>
        {!ready ? (
          <div className="empty">
            <span className="spinner" />
            <span style={{ marginLeft: 12 }}>{t('app.loading')}</span>
          </div>
        ) : error ? (
          <div className="empty">{t('app.startError', { error })}</div>
        ) : (
          <>
            {view === 'reader' && <ReaderView />}
            {view === 'study' && <StudyView />}
            {view === 'search' && <SearchView />}
            {view === 'library' && <LibraryView />}
            {view === 'write' && (
              <Suspense fallback={<div className="empty"><span className="spinner" /><span style={{ marginLeft: 12 }}>{t('app.loading')}</span></div>}>
                <WritingView />
              </Suspense>
            )}
            {view === 'templates' && <TemplatesView />}
            {view === 'assistant' && <AssistantView />}
            {view === 'presentaciones' && (
              <Suspense fallback={<div className="empty"><span className="spinner" /><span style={{ marginLeft: 12 }}>{t('app.loading')}</span></div>}>
                <PresentacionesView />
              </Suspense>
            )}
            {view === 'inspiration' && <InspirationView />}
            {view === 'modules' && <ModulesView />}
            {view === 'settings' && <SettingsView />}
          </>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function PuertaLicencia(): JSX.Element {
  const { t } = useI18n()
  const bootstrap = useAppStore((s) => s.bootstrap)
  const [vistaLicencia, setVistaLicencia] = useState<'cargando' | 'ok' | 'login' | 'bloqueo'>('cargando')
  const [estadoLicencia, setEstadoLicencia] = useState<EstadoActual | null>(null)

  useEffect(() => {
    void api.licencia
      .estado()
      .then((e) => {
        setEstadoLicencia(e)
        if (e.estado === 'sin_licencia') setVistaLicencia('login')
        else if (e.estado === 'expirada' || e.estado === 'bloqueada') setVistaLicencia('bloqueo')
        else setVistaLicencia('ok')
      })
      .catch(() => setVistaLicencia('login'))
  }, [])

  useEffect(() => {
    if (vistaLicencia !== 'ok') return
    void bootstrap()
  }, [vistaLicencia, bootstrap])

  function aLogin(): void {
    setEstadoLicencia(null)
    setVistaLicencia('login')
  }

  if (vistaLicencia === 'cargando') return <div className="licencia-panel">{t('app.loading')}</div>
  if (vistaLicencia === 'login')
    return (
      <LoginView
        alListo={(estado) => {
          setEstadoLicencia(estado ?? null)
          setVistaLicencia('ok')
        }}
      />
    )
  if (vistaLicencia === 'bloqueo' && estadoLicencia) return <BloqueoView estado={estadoLicencia} alListo={aLogin} />
  return <Shell estadoLicencia={estadoLicencia} />
}

export default function App() {
  const theme = useAppStore((s) => s.settings.theme)
  const locale = useAppStore((s) => s.settings.uiLocale)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nProvider locale={locale}>
      <PuertaLicencia />
    </I18nProvider>
  )
}
