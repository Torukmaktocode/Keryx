import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { ModuleCategory, SearchResult, StudyPaneKind } from '@keryx/core'
import { api } from '../lib/api'
import { moduleOptionLabel } from '../lib/modules'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

type TabId = 'all' | 'Bibles' | 'Commentaries' | 'Dictionaries' | 'Books'

const TAB_CATEGORIES: Record<Exclude<TabId, 'all'>, ModuleCategory[]> = {
  Bibles: ['Bible'],
  Commentaries: ['Commentary'],
  Dictionaries: ['Lexicon', 'Dictionary', 'Devotional'],
  Books: ['GenBook']
}

const PANE_FOR: Partial<Record<ModuleCategory, StudyPaneKind>> = {
  Bible: 'bible',
  Commentary: 'commentary',
  Dictionary: 'dictionary',
  Lexicon: 'dictionary',
  GenBook: 'book',
  Devotional: 'dictionary'
}

export function LibraryView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const setView = useAppStore((s) => s.setView)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const updateStudy = useAppStore((s) => s.updateStudy)
  const notify = useAppStore((s) => s.notify)
  const priorities = useAppStore((s) => s.settings.priorityModules)
  const studyModules = useAppStore((s) => s.settings.study.modules)

  const [tab, setTab] = useState<TabId>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [entry, setEntry] = useState<{ title: string; html: string } | null>(null)
  const [searching, setSearching] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(false)

  const ranked = useMemo(() => {
    const score = (name: string): number => (priorities.includes(name) ? 0 : 1)
    return [...modules].sort(
      (a, b) => score(a.name) - score(b.name) || a.name.localeCompare(b.name)
    )
  }, [modules, priorities])

  const byTab = useMemo(() => {
    const list = tab === 'all' ? ranked : ranked.filter((m) => TAB_CATEGORIES[tab].includes(m.category))
    const needle = query.trim().toLowerCase()
    if (!needle) return list
    return list.filter(
      (m) => m.name.toLowerCase().includes(needle) || m.description.toLowerCase().includes(needle)
    )
  }, [ranked, tab, query])

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: modules.length }
    for (const key of Object.keys(TAB_CATEGORIES) as Exclude<TabId, 'all'>[]) {
      out[key] = modules.filter((m) => TAB_CATEGORIES[key].includes(m.category)).length
    }
    return out
  }, [modules])

  useEffect(() => {
    if (!byTab.length) return
    if (!byTab.some((m) => m.name === selected)) setSelected(byTab[0].name)
  }, [byTab, selected])

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

  const openIn = (mode: 'study' | 'reader'): void => {
    const mod = modules.find((m) => m.name === selected)
    if (!mod) return
    if (mode === 'reader' && mod.category === 'Bible') {
      setSelectedModule(selected)
      setView('reader')
      return
    }
    const pane = PANE_FOR[mod.category]
    if (!pane) {
      notify(t('library.notFound'))
      return
    }
    void updateStudy({ modules: { ...studyModules, [pane]: selected } })
    if (mode === 'reader') setSelectedModule(selected)
    setView('study')
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('library.title')}</h1>
        <div className="spacer" />
        <div className="segmented">
          {(['all', 'Bibles', 'Commentaries', 'Dictionaries', 'Books'] as TabId[]).map((id) => (
            <button
              key={id}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {t(`library.tab.${id}` as 'library.tab.all')} {counts[id] ? `(${counts[id]})` : ''}
            </button>
          ))}
        </div>
      </header>
      <div className="view-body">
        <div className="filters">
          <select
            className="select"
            style={{ width: 280 }}
            value={selected}
            title={t('library.moduleHint')}
            onChange={(e) => setSelected(e.target.value)}
          >
            {byTab.map((m) => (
              <option key={`${m.driver}-${m.name}`} value={m.name}>
                {moduleOptionLabel(m, locale)}
              </option>
            ))}
          </select>
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
          <button className="btn" onClick={() => openIn('study')} title={t('library.openStudy')}>
            <Icon name="study" size={14} /> {t('library.openStudy')}
          </button>
          <button className="btn" onClick={() => openIn('reader')} title={t('library.openReader')}>
            <Icon name="reader" size={14} /> {t('library.openReader')}
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
            {results.length === 0 && <p className="empty">{t('library.help')}</p>}
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
