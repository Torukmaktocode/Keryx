import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { Repository, SwordModule } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'
import { TituloTraducido } from '../components/TituloTraducido'

export function ModulesView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const refreshModules = useAppStore((s) => s.refreshModules)
  const notify = useAppStore((s) => s.notify)
  const priorities = useAppStore((s) => s.settings.priorityModules)
  const togglePriority = useAppStore((s) => s.togglePriority)

  const [repositories, setRepositories] = useState<Repository[]>([])
  const [repo, setRepo] = useState('')
  const [remote, setRemote] = useState<SwordModule[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...modules]
      .filter((m) => {
        if (needle && !m.name.toLowerCase().includes(needle) && !m.description.toLowerCase().includes(needle)) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        const pa = priorities.includes(a.name) ? 1 : 0
        const pb = priorities.includes(b.name) ? 1 : 0
        if (pa !== pb) return pb - pa
        return a.name.localeCompare(b.name)
      })
  }, [modules, priorities, query])

  useEffect(() => {
    void api.modules
      .repositories()
      .then((list) => {
        setRepositories(list)
        if (list[0]) setRepo(list[0].name)
      })
      .catch(() => setRepositories([]))
  }, [])

  useEffect(() => {
    if (!repo) return
    void api.modules
      .remote(repo)
      .then(setRemote)
      .catch(() => setRemote([]))
  }, [repo])

  const install = async (name: string): Promise<void> => {
    setBusy(name)
    try {
      await api.modules.install({ name, repository: repo })
      await refreshModules()
      notify(t('modules.installedNotify', { name }))
    } catch (error) {
      notify(error instanceof Error ? error.message : t('modules.installError'))
    } finally {
      setBusy(null)
    }
  }

  const uninstall = async (name: string): Promise<void> => {
    setBusy(name)
    try {
      await api.modules.uninstall(name)
      await refreshModules()
      notify(t('modules.uninstalledNotify', { name }))
    } catch (error) {
      notify(error instanceof Error ? error.message : t('modules.uninstallError'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('modules.title')}</h1>
        <div className="spacer" />
        <button className="btn small" onClick={() => void refreshModules()}>
          {t('common.refresh')}
        </button>
      </header>
      <div className="view-body">
        <div className="filters">
          <input
            className="input"
            placeholder={t('modules.filterPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <h3>{t('modules.installed', { count: filtered.length })}</h3>
        <div className="list">
          {filtered.map((m) => {
            const langLabel = m.lang ? languageLabel(m.lang, locale) : ''
            return (
              <div className="list-item" key={`${m.driver}-${m.name}`}>
                <div className="meta">
                  <strong><TituloTraducido text={m.name} lang={m.lang} /></strong>
                  <small>
                    {m.category}
                    {langLabel ? ` - ${langLabel}` : ''}
                    {m.hasStrongs ? ' - Strongs' : ''}
                  </small>
                </div>
                <button
                  className={`btn small ghost ${priorities.includes(m.name) ? 'primary' : ''}`}
                  title={t('modules.priorityHint')}
                  onClick={() => void togglePriority(m.name)}
                >
                  <Icon name="star" size={14} />
                </button>
                <button
                  className="btn small ghost"
                  disabled={busy === m.name}
                  onClick={() => void uninstall(m.name)}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            )
          })}
          {filtered.length === 0 && <p className="empty">{t('modules.empty')}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
          <h3 style={{ margin: 0 }}>{t('modules.repository')}</h3>
          <select className="select" value={repo} onChange={(e) => setRepo(e.target.value)}>
            {repositories.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="list" style={{ marginTop: 12 }}>
          {remote.map((m) => (
            <div className="list-item" key={m.name}>
              <div className="meta">
                <strong><TituloTraducido text={m.name} lang={m.lang} /></strong>
                <small>
                  {m.category} - {m.lang}
                </small>
              </div>
              <span className="badge muted">{t('common.remote')}</span>
              <button
                className="btn small"
                disabled={busy === m.name}
                onClick={() => void install(m.name)}
              >
                <Icon name="download" size={14} /> {t('common.install')}
              </button>
            </div>
          ))}
          {remote.length === 0 && <p className="empty">{t('modules.emptyRemote')}</p>}
        </div>
      </div>
    </div>
  )
}
