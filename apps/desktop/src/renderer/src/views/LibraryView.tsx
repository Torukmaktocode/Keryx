import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type ModuleCategory, type SearchResult, type StudyPaneKind } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { moduleLabel } from '../lib/modules'
import { verseThemeWords } from '../lib/agents'
import { stripTags } from '../lib/assistant'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

type TabId = 'all' | 'Commentaries' | 'Dictionaries' | 'Books'

const TAB_CATEGORIES: Record<Exclude<TabId, 'all'>, ModuleCategory[]> = {
  Commentaries: ['Commentary'],
  Dictionaries: ['Lexicon', 'Dictionary', 'Devotional'],
  Books: ['GenBook']
}

const ALL_CATEGORIES: ModuleCategory[] = [...TAB_CATEGORIES.Commentaries, ...TAB_CATEGORIES.Dictionaries, ...TAB_CATEGORIES.Books]

const PANE_FOR: Partial<Record<ModuleCategory, StudyPaneKind>> = {
  Bible: 'bible',
  Commentary: 'commentary',
  Dictionary: 'dictionary',
  Lexicon: 'dictionary',
  GenBook: 'book',
  Devotional: 'dictionary'
}

interface LibraryEntry {
  module: string
  title: string
  html: string
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
  const [activeModule, setActiveModule] = useState('')
  const [resourceQuery, setResourceQuery] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [entries, setEntries] = useState<Array<{ topic: string }>>([])
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [entry, setEntry] = useState<LibraryEntry | null>(null)
  const [searching, setSearching] = useState(false)
  const [loadingEntry, setLoadingEntry] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [passage, setPassage] = useState<{ ref: string; text: string; words: string[] } | null>(null)
  const navBook = useAppStore((s) => s.navBook)
  const navChapter = useAppStore((s) => s.navChapter)
  const navVerse = useAppStore((s) => s.navVerse)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const sendToWriting = useAppStore((s) => s.sendToWriting)

  const currentBook = useMemo(
    () => CANONICAL_BOOKS.find((b) => b.code === navBook) ?? CANONICAL_BOOKS[0],
    [navBook]
  )
  const bookLabel = useMemo(() => bookName(currentBook, locale), [currentBook, locale])
  const passageRef = navVerse
    ? `${bookLabel} ${navChapter}:${navVerse}`
    : `${bookLabel} ${navChapter}`

  const ranked = useMemo(() => {
    const score = (name: string): number => (priorities.includes(name) ? 0 : 1)
    return [...modules].sort(
      (a, b) => score(a.name) - score(b.name) || a.name.localeCompare(b.name)
    )
  }, [modules, priorities])

  const byTab = useMemo(
    () =>
      tab === 'all'
        ? ranked.filter((m) => ALL_CATEGORIES.includes(m.category))
        : ranked.filter((m) => TAB_CATEGORIES[tab].includes(m.category)),
    [ranked, tab]
  )

  const resourceFiltered = useMemo(() => {
    const needle = resourceQuery.trim().toLowerCase()
    if (!needle) return byTab
    return byTab.filter(
      (m) => m.name.toLowerCase().includes(needle) || m.description.toLowerCase().includes(needle)
    )
  }, [byTab, resourceQuery])

  const counts = useMemo(() => {
    const out: Record<string, number> = {
      all: modules.filter((m) => ALL_CATEGORIES.includes(m.category)).length
    }
    for (const key of Object.keys(TAB_CATEGORIES) as Exclude<TabId, 'all'>[]) {
      out[key] = modules.filter((m) => TAB_CATEGORIES[key].includes(m.category)).length
    }
    return out
  }, [modules])

  useEffect(() => {
    if (!byTab.length) return
    if (!byTab.some((m) => m.name === activeModule)) setActiveModule(byTab[0].name)
  }, [byTab, activeModule])

  useEffect(() => {
    setResults([])
    setEntry(null)
    setTopicFilter('')
  }, [activeModule, tab])

  const targets = useMemo(() => byTab.map((m) => m.name), [byTab])

  const bibleTargets = useMemo(
    () => ranked.filter((m) => m.category === 'Bible').map((m) => m.name),
    [ranked]
  )

  const grouped = useMemo(() => {
    const groups: Array<{ module: string; hits: SearchResult[] }> = []
    for (const hit of results) {
      const last = groups[groups.length - 1]
      if (last && last.module === hit.module) last.hits.push(hit)
      else groups.push({ module: hit.module, hits: [hit] })
    }
    return groups.sort((a, b) => b.hits.length - a.hits.length)
  }, [results])

  const hasResults = grouped.length > 0

  useEffect(() => {
    if (!activeModule || hasResults) return
    let cancelled = false
    setEntriesLoading(true)
    api.dict
      .entries({ module: activeModule })
      .then((list) => {
        if (!cancelled) setEntries(list)
        if (!cancelled && list.length) void openEntry(activeModule, list[0].topic)
      })
      .catch(() => {
        if (!cancelled) setEntries([])
      })
      .finally(() => {
        if (!cancelled) setEntriesLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeModule, hasResults])

  const visibleEntries = useMemo(() => {
    const needle = topicFilter.trim().toLowerCase()
    if (!needle) return entries
    return entries.filter((e) => e.topic.toLowerCase().includes(needle))
  }, [entries, topicFilter])

  const fanOut = async (needle: string): Promise<SearchResult[]> => {
    const merged: SearchResult[] = []
    const totalTargets = bibleTargets.length + targets.length
    // Agentes 1: LAS BIBLIAS (cada una cubre Génesis->Apocalipsis completo).
    for (let i = 0; i < bibleTargets.length && merged.length < 240; i += 12) {
      const slice = bibleTargets.slice(i, i + 12)
      const batches = await Promise.all(
        slice.map((name) =>
          api.bible
            .search({ query: needle, modules: [name], limit: 8 })
            .then((list) => list.slice(0, 8))
            .catch(() => [] as SearchResult[])
        )
      )
      merged.push(...batches.flat())
      setProgress({ done: targets.length + Math.min(i + slice.length, bibleTargets.length), total: totalTargets })
    }
    // Agentes 2: los recursos de la pestaña (comentarios, diccionarios, libros).
    for (let i = 0; i < targets.length && merged.length < 240; i += 40) {
      const slice = targets.slice(i, i + 40)
      const batches = await Promise.all(
        slice.map((name) =>
          api.bible
            .search({ query: needle, modules: [name], limit: 10 })
            .then((list) => list.slice(0, 10))
            .catch(() => [] as SearchResult[])
        )
      )
      merged.push(...batches.flat())
      setProgress({ done: Math.min(i + slice.length, targets.length), total: totalTargets })
    }
    return merged
  }

  const runSearch = async (): Promise<void> => {
    if (!query.trim() || !targets.length) return
    setSearching(true)
    setEntry(null)
    setPassage(null)
    setProgress({ done: 0, total: targets.length })
    try {
      const merged = await fanOut(query.trim())
      setResults(merged)
      if (merged.length === 0) notify(t('study.noResults'))
    } catch {
      notify(t('study.searchError'))
    } finally {
      setProgress(null)
      setSearching(false)
    }
  }

  /** Modo pasaje: lee el verso actual del Lector/Estudio y consulta los recursos con sus palabras. */
  const runPassage = async (): Promise<void> => {
    if (!selectedModule) return
    setSearching(true)
    setEntry(null)
    setQuery('')
    setProgress({ done: 0, total: targets.length })
    const anchorBook = navBook
    const anchorChapter = navChapter
    try {
      const verseData = await api.bible.verse({
        module: selectedModule,
        book: anchorBook,
        chapter: anchorChapter,
        verse: navVerse ?? 1
      })
      const text = verseData?.text ? stripTags(verseData.text) : ''
      const words = verseThemeWords(text).slice(0, 4)
      if (!words.length) {
        notify(t('library.noPassageWords'))
        return
      }
      setPassage({
        ref: passageRef,
        text,
        words
      })
      let merged: SearchResult[] = []
      for (const attempt of [words, words.slice(0, 2), words.slice(0, 1)]) {
        merged = await fanOut(attempt.join(' '))
        setResults(merged)
        if (merged.length) break
      }
      if (merged.length === 0) notify(t('study.noResults'))
    } catch {
      notify(t('study.searchError'))
    } finally {
      setProgress(null)
      setSearching(false)
    }
  }

  /** Exporta la entrada al editor con su cita anclada [Modulo · entrada]. */
  const sendQuote = async (): Promise<void> => {
    if (!entry) return
    const decoder = document.createElement('textarea')
    decoder.innerHTML = stripTags(entry.html).replace(/<br\s*\/?>/gi, ' ')
    const clean = (decoder.value || '').replace(/\s+/g, ' ').trim()
    const cut = clean.length > 700 ? `${clean.slice(0, 697).trimEnd()}…` : clean
    const block = `> ${cut}\n\n— **[${entry.module} · ${entry.title}]** (${t('library.quoteSource')})`
    await sendToWriting(block, entry.title)
    notify(t('library.sentQuote'))
  }

  const openEntry = async (moduleName: string, key: string): Promise<void> => {
    if (!moduleName || !key) return
    setLoadingEntry(true)
    try {
      const html = await api.dict.lookup({ module: moduleName, key })
      setEntry({
        module: moduleName,
        title: key,
        html: html ?? `<p>${t('library.notFound')}</p>`
      })
    } catch {
      setEntry({ module: moduleName, title: key, html: `<p>${t('common.error')}</p>` })
    } finally {
      setLoadingEntry(false)
    }
  }

  const openIn = (mode: 'study' | 'reader'): void => {
    const name = entry?.module ?? activeModule
    const mod = modules.find((m) => m.name === name)
    if (!mod) return
    if (mode === 'reader' && mod.category === 'Bible') {
      setSelectedModule(name)
      setView('reader')
      return
    }
    const pane = PANE_FOR[mod.category]
    if (!pane) {
      notify(t('library.notFound'))
      return
    }
    void updateStudy({ modules: { ...studyModules, [pane]: name } })
    if (mode === 'reader') setSelectedModule(name)
    setView('study')
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('library.title')}</h1>
        <div className="spacer" />
        <div className="segmented">
          {(['all', 'Commentaries', 'Dictionaries', 'Books'] as TabId[]).map((id) => (
            <button
              key={id}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {t(`library.tab.${id.toLowerCase()}` as 'library.tab.all')}{' '}
              {counts[id] ? `(${counts[id]})` : ''}
            </button>
          ))}
        </div>
      </header>
      <div className="view-body">
        <div className="passage-bar">
          <span className="passage-bar-ref">✦ {passageRef}</span>
          <button
            className="btn primary small"
            onClick={() => void runPassage()}
            disabled={searching || !selectedModule}
            title={t('library.askPassageHint')}
          >
            {searching ? t('study.searching') : t('library.askPassage')}
          </button>
        </div>
        <div className="filters">
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder={t('library.searchPlaceholderAll')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void runSearch()}
          />
          <button
            className="btn primary"
            onClick={() => void runSearch()}
            disabled={searching}
            title={t('library.allResourcesHint')}
          >
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
          <aside className="library-resources">
            <input
              className="input"
              placeholder={t('library.filterResources')}
              value={resourceQuery}
              onChange={(e) => setResourceQuery(e.target.value)}
            />
            <div className="library-resource-list">
              {resourceFiltered.map((m) => (
                <button
                  key={`${m.driver}-${m.name}`}
                  className={`library-resource-item ${m.name === activeModule ? 'active' : ''}`}
                  onClick={() => setActiveModule(m.name)}
                >
                  <strong>{moduleLabel(m)}</strong>
                  <small>
                    {m.category}
                    {m.lang ? ` - ${languageLabel(m.lang, locale)}` : ''}
                  </small>
                </button>
              ))}
              {!resourceFiltered.length && <p className="empty">{t('modules.empty')}</p>}
            </div>
          </aside>

          <section className="library-index">
            {passage && (
              <div className="passage-anchored">
                <div className="passage-anchored-ref">{passage.ref}</div>
                <p>{passage.text}</p>
                <div className="passage-anchored-words">
                  {passage.words.map((word) => (
                    <span key={word} className="chip ghost">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {searching && (
              <p className="empty">
                <span className="spinner" />
                <span style={{ marginLeft: 8 }}>
                  {t('library.searchingProgress', {
                    done: progress?.done ?? 0,
                    total: progress?.total ?? 0
                  })}
                </span>
              </p>
            )}
            {!searching && hasResults && (
              <>
                <p className="library-meta">
                  {t('library.resultsIn', {
                    count: results.length,
                    modules: grouped.length
                  })}
                </p>
                <div className="library-index-list">
                  {grouped.map((group) => (
                    <div key={group.module} className="library-group">
                      <div className="library-group-head">
                        <strong>{group.module}</strong>
                        <span>({group.hits.length})</span>
                      </div>
                      {group.hits.map((r, i) => (
                        <button
                          key={`${group.module}-${r.book}-${i}`}
                          className={`library-index-hit ${entry?.module === group.module && entry?.title === r.book ? 'active' : ''}`}
                          onClick={() => void openEntry(group.module, r.book)}
                        >
                          <span className="hit-key">{r.book}</span>
                          <span className="hit-snippet">{r.text}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
            {!searching && !hasResults && (
              <>
                <div className="library-index-head">
                  <strong>{activeModule}</strong>
                  <span className="library-meta">
                    {t('library.entriesCount', { count: visibleEntries.length })}
                  </span>
                </div>
                <input
                  className="input"
                  placeholder={t('library.filterTopics')}
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                />
                {entriesLoading || loadingEntry ? (
                  <div className="empty">
                    <span className="spinner" />
                  </div>
                ) : (
                  <div className="library-index-list">
                    {visibleEntries.map((e) => (
                      <button
                        key={e.topic}
                        className={`library-index-hit ${entry?.module === activeModule && entry?.title === e.topic ? 'active' : ''}`}
                        onClick={() => void openEntry(activeModule, e.topic)}
                      >
                        {e.topic}
                      </button>
                    ))}
                    {!visibleEntries.length && <p className="empty">{t('library.noEntries')}</p>}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="library-read">
            {entry ? (
              <>
                <div className="library-read-head">
                  <span>
                    {entry.module} · {entry.title}
                  </span>
                  <button
                    className="btn primary small"
                    onClick={() => void sendQuote()}
                    title={t('library.sendQuoteHint')}
                  >
                    {t('library.sendQuote')}
                  </button>
                </div>
                <div className="scripture" dangerouslySetInnerHTML={{ __html: entry.html }} />
              </>
            ) : (
              <p className="empty">{t('library.selectResource')}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
