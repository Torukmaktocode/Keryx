import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type SearchResult } from '@keryx/core'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'

type Scope = 'all' | 'ot' | 'nt'

export function SearchView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const setNav = useAppStore((s) => s.setNav)
  const setView = useAppStore((s) => s.setView)
  const notify = useAppStore((s) => s.notify)

  const bibles = useMemo(
    () => modules.filter((m) => m.category === 'Bible'),
    [modules]
  )

  const [query, setQuery] = useState('')
  const [module, setModule] = useState(selectedModule || bibles[0]?.name || '')
  const [scope, setScope] = useState<Scope>('all')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[] | null>(null)

  useEffect(() => {
    if (bibles.length && !bibles.some((m) => m.name === module)) {
      setModule(bibles[0].name)
    }
  }, [bibles, module])

  const run = async (): Promise<void> => {
    const needle = query.trim()
    if (!needle || !module) return
    setLoading(true)
    try {
      const found = await api.bible.search({
        query: needle,
        modules: [module],
        scope,
        caseSensitive,
        wholeWord,
        limit: 200
      })
      setResults(found)
      if (found.length === 0) notify(t('study.noResults'))
    } catch {
      notify(t('study.searchError'))
    } finally {
      setLoading(false)
    }
  }

  const openVerse = (hit: SearchResult): void => {
    setSelectedModule(hit.module)
    setNav(hit.book, hit.chapter || 1, hit.verse || undefined)
    setView('reader')
  }
  const highlight = (text: string): string => {
    const needle = query.trim()
    if (!needle) return text
    const index = text.toLowerCase().indexOf(needle.toLowerCase())
    if (index === -1) return text
    return [
      text.slice(0, index),
      `<mark>${text.slice(index, index + needle.length)}</mark>`,
      text.slice(index + needle.length)
    ].join('')
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.search')}</h1>
        <div className="spacer" />
        <select
          className="select"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          title={t('search.moduleHint')}
        >
          {bibles.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
      </header>
      <div className="view-body">
        <div className="filters">
          <input
            className="input"
            style={{ flex: 1, minWidth: 220 }}
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void run()}
          />
          <select
            className="select"
            value={scope}
            onChange={(e) => setScope(e.target.value as Scope)}
          >
            <option value="all">{t('study.scope.all')}</option>
            <option value="ot">{t('search.scope.ot')}</option>
            <option value="nt">{t('search.scope.nt')}</option>
          </select>
          <label className="filter-check">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
            />
            {t('search.caseSensitive')}
          </label>
          <label className="filter-check">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
            />
            {t('search.wholeWord')}
          </label>
          <button className="btn primary" onClick={() => void run()} disabled={loading}>
            {loading ? t('study.searching') : t('common.search')}
          </button>
        </div>

        {results === null && <p className="empty">{t('search.hint')}</p>}

        {results !== null && (
          <>
            <p className="muted" style={{ fontSize: 13 }}>
              {t('search.count', { count: results.length })}
            </p>
            <div className="search-list">
              {results.map((hit, index) => {
                const book = CANONICAL_BOOKS.find((b) => b.code === hit.book)
                const ref = `${book ? bookName(book, locale) : hit.book} ${hit.chapter}:${hit.verse}`
                return (
                  <button
                    key={`${hit.module}-${hit.book}-${hit.chapter}-${hit.verse}-${index}`}
                    className="search-result"
                    onClick={() => void openVerse(hit)}
                  >
                    <div className="ref">
                      {ref}
                      {hit.module !== module ? ` · ${hit.module}` : ''}
                    </div>
                    <div
                      className="text scripture-result"
                      dangerouslySetInnerHTML={{
                        __html: highlight(hit.text.replace(/<[^>]+>/g, ' '))
                      }}
                    />
                  </button>
                )
              })}
              {results.length === 0 && <p className="empty">{t('study.noResults')}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
