import { useEffect } from 'react'
import { I18nProvider, useI18n } from '@keryx/i18n'
import { useAppStore } from './store/appStore'
import { Sidebar } from './components/Sidebar'
import { ReaderView } from './views/ReaderView'
import { StudyView } from './views/StudyView'
import { LibraryView } from './views/LibraryView'
import { WritingView } from './views/WritingView'
import { TemplatesView } from './views/TemplatesView'
import { ModulesView } from './views/ModulesView'
import { SettingsView } from './views/SettingsView'

function Shell() {
  const { t } = useI18n()
  const view = useAppStore((s) => s.view)
  const ready = useAppStore((s) => s.ready)
  const error = useAppStore((s) => s.error)
  const toast = useAppStore((s) => s.toast)
  const notify = useAppStore((s) => s.notify)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => notify(null), 2600)
    return () => clearTimeout(timer)
  }, [toast, notify])

  return (
    <div className="app">
      <Sidebar />
      <main className="content">
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
            {view === 'library' && <LibraryView />}
            {view === 'write' && <WritingView />}
            {view === 'templates' && <TemplatesView />}
            {view === 'modules' && <ModulesView />}
            {view === 'settings' && <SettingsView />}
          </>
        )}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default function App() {
  const theme = useAppStore((s) => s.settings.theme)
  const locale = useAppStore((s) => s.settings.uiLocale)
  const bootstrap = useAppStore((s) => s.bootstrap)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <I18nProvider locale={locale}>
      <Shell />
    </I18nProvider>
  )
}
