import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { SearchResult } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { useAppStore } from '../store/appStore'

export function LibraryView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const notify = useAppStore((s) => s.notify)
  const priorities = useAppStore((s) => s.settings.priorityModules)

  const resources = useMemo(
    () =>
      modules
        .filter((m) =>
          ['Lexicon', 'Dictionary', 'GenBook', 'Devotional', 'Commentary'].includes(m.category)
        )
        .sort((a, b) => {
          const pa = priorities.includes(a.name) ? 1 : 0
          const pb = priorities.includes(b.name) ? 1 : 0
          if (pa !== pb) return pb - pa
          return a.name.localeCompare(b.name)
        }),
    [modules, priorities]
  )

  const [selected, setSelected] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [entry, setEntry] = useState<{ title: string; html: string } | null>(null)
  const [searching, setSearching] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(false)

  useEffect(() => {
    if (!selected && resources.length) setSelected(resources[0].name)
  }, [resources, selected])

  useEffect(() => {
    setResults([])
    setEntry(null)
  }, [selected])

  const runSearch = async (): Promise<void> => {
    if (!selected || !query.trim()) return
    setSearching(true)
    setEntry(null)
    try {
      const found = await api.bible.search({ query, modules: [selected], limit: 80 })
      setResults(found)
      if (found.length === 0) notify(t('study.noResults'))
    } catch {
      notify(t('study.searchError'))
    } finally {
      setSearching(false)
    }
  }

  const openEntry = async (key: string): Promise<void> => {
    if (!selected || !key) return
    setLoadingEntry(true)
    try {
      const html = await api.dict.lookup({ module: selected, key })
      setEntry({ title: key, html: html ?? `<p>${t('library.notFound')}</p>` })
    } catch {
      setEntry({ title: key, html: `<p>${t('common.error')}</p>` })
    } finally {
      setLoadingEntry(false)
    }
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('library.title')}</h1>
        <div className="spacer" />
        <select className="select" value={selected} onChange={(e) => setSelected(e.target.value)}>
          {resources.map((m) => (
            <option key={`${m.driver}-${m.name}`} value={m.name}>
              {m.name} ({languageLabel(m.lang, locale)})
            </option>
          ))}
        </select>
      </header>
      <div className="view-body">
        <div className="filters">
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder={t('library.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void runSearch()}
          />
          <button className="btn primary" onClick={() => void runSearch()} disabled={searching}>
            {searching ? t('study.searching') : t('common.search')}
          </button>
        </div>

        <div className="library">
          <aside className="library-list">
            {results.map((r, i) => (
              <button
                key={`${r.book}-${i}`}
                className={`library-hit ${entry?.title === r.book ? 'active' : ''}`}
                onClick={() => void openEntry(r.book)}
              >
                <span className="hit-key">{r.book}</span>
                <span className="hit-snippet">{r.text}</span>
              </button>
            ))}
            {results.length === 0 && (
              <p className="empty">{t('library.help')}</p>
            )}
          </aside>
          <section className="library-read">
            {loadingEntry ? (
              <div className="empty">
                <span className="spinner" />
              </div>
            ) : entry ? (
              <>
                <div className="library-read-head">
                  {selected} · {entry.title}
                </div>
                <div className="scripture" dangerouslySetInnerHTML={{ __html: entry.html }} />
              </>
            ) : (
              <p className="empty">{t('library.selectEntry')}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
