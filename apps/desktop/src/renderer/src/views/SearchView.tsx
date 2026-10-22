import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type SearchResult } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { useEtiquetasModulos } from '../lib/titulos'
import { useAppStore } from '../store/appStore'
import { TextoTraducido } from '../components/TextoTraducido'
import { plainText } from '../lib/traductor'

type Scope = 'all' | 'ot' | 'nt'

export function SearchView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const modulesByName = useMemo(() => new Map(modules.map((m) => [m.name, m])), [modules])
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const setNav = useAppStore((s) => s.setNav)
  const setView = useAppStore((s) => s.setView)
  const notify = useAppStore((s) => s.notify)

  const bibles = useMemo(
    () => modules.filter((m) => m.category === 'Bible'),
    [modules]
  )
  const etiquetasBiblias = useEtiquetasModulos(bibles)
  const etiquetaBusqueda = (m: { name: string; lang: string }): string => {
    const index = bibles.findIndex((b) => b.name === m.name)
    const nombre = index >= 0 ? etiquetasBiblias[index] : m.name
    const lang = (m.lang || '').trim()
    if (!lang || lang === '?') return nombre
    return `${nombre} (${languageLabel(lang, locale)})`
  }

  const [query, setQuery] = useState('')
  const [module, setModule] = useState(selectedModule || bibles[0]?.name || '')
  const [allBibles, setAllBibles] = useState(false)
  const [scope, setScope] = useState<Scope>('all')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(300)
  const [suggestions, setSuggestions] = useState<Array<{ word: string }>>([])
  const [correction, setCorrection] = useState<string | null>(null)
  const [lastQuery, setLastQuery] = useState('')

  useEffect(() => {
    if (bibles.length && !bibles.some((m) => m.name === module)) {
      setModule(bibles[0].name)
    }
  }, [bibles, module])

  const run = async (value?: string, auto = false): Promise<void> => {
    const needle = (value ?? query).trim()
    if (value != null) setQuery(value)
    if (!needle || (!module && !bibles.length)) return
    if (!auto) setCorrection(null)
    setLastQuery(needle)
    setLoading(true)
    setTotal(null)
    setSuggestions([])
    setVisibleCount(300)
    try {
      // Agentes: una Biblia (7 lectores de canon en paralelo) o todas las
      // Biblias instaladas en tandas de 12, con progreso en vivo.
      if (allBibles) {
        const targets = bibles.map((m) => m.name)
        setProgress({ done: 0, total: targets.length })
        const merged: SearchResult[] = []
        for (let i = 0; i < targets.length; i += 12) {
          const slice = targets.slice(i, i + 12)
          const batches = await Promise.all(
            slice.map((name) =>
              api.bible
                .search({
                  query: needle,
                  modules: [name],
                  scope,
                  caseSensitive,
                  wholeWord,
                  limit: 2000
                })
                .then((list) => list.slice(0, 2000))
                .catch(() => [] as SearchResult[])
            )
          )
          merged.push(...batches.flat())
          setProgress({
            done: Math.min(i + slice.length, targets.length),
            total: targets.length
          })
        }
        merged.sort((a, b) => {
          const indexA = CANONICAL_BOOKS.findIndex((book) => book.code === a.book)
          const indexB = CANONICAL_BOOKS.findIndex((book) => book.code === b.book)
          return indexA - indexB || a.chapter - b.chapter || a.verse - b.verse
        })
        setResults(merged)
        setTotal(merged.length)
        if (merged.length === 0) {
          notify(t('study.noResults'))
          await recoverWithSuggestion(needle, auto)
        } else if (!auto) {
          void autocorrectAccents(needle)
        }
      } else {
        const found = await api.bible.search({
          query: needle,
          modules: [module],
          scope,
          caseSensitive,
          wholeWord,
          limit: 100000
        })
        setResults(found)
        if (found.length === 0 && !auto) {
          notify(t('study.noResults'))
          await recoverWithSuggestion(needle, auto)
        } else if (found.length > 0 && !auto) {
          void autocorrectAccents(needle)
        }
        setTotal(found.length)
        api.bible
          .searchCount({ query: needle, modules: [module], scope, caseSensitive, wholeWord })
          .then((real) => {
            if (real > found.length) setTotal(real)
          })
          .catch(() => setTotal(null))
      }
    } catch {
      notify(t('study.searchError'))
    } finally {
      setProgress(null)
      setLoading(false)
    }
  }

  /** Corrector automatico (0 tokens): ante cero resultados, si hay una palabra
   * cercana en el vocabulario de la Biblia, re-lanza la busqueda corregida. */
  const recoverWithSuggestion = async (needle: string, auto: boolean): Promise<void> => {
    const list = await api.bible
      .suggest({ query: needle, module: module || (bibles[0]?.name ?? ''), limit: 6 })
      .then((items) => items)
      .catch(() => [] as Array<{ word: string; score: number }>)
    setSuggestions(list)
    if (!auto && list.length && list[0].score > 0) {
      setCorrection(list[0].word)
      await run(list[0].word, true)
    }
  }

  /** Correccion silenciosa de acentos: si el vocabulario tiene la forma
   * acentuada de lo tecleado (distancia 0), corrige la caja sin repetir la
   * busqueda (el motor ya es tolerante a acentos). */
  const autocorrectAccents = async (needle: string): Promise<void> => {
    const items = await api.bible
      .suggest({ query: needle, module: module || (bibles[0]?.name ?? ''), limit: 1 })
      .catch(() => [] as Array<{ word: string; score: number }>)
    const top = items[0]
    if (top && top.score === 0 && top.word !== needle) setQuery(top.word)
  }

  const openVerse = (hit: SearchResult): void => {
    setSelectedModule(hit.module)
    setNav(hit.book, hit.chapter || 1, hit.verse || undefined)
    setView('reader')
  }
  const norm = (value: string): string =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

  const highlight = (text: string): string => {
    const tokens = [...new Set(norm(query.trim()).split(/\s+/).filter(Boolean))]
    if (!tokens.length) return text
    let hay = ''
    const map: number[] = []
    for (let i = 0; i < text.length; i++) {
      const piece = norm(text[i])
      if (!piece) continue
      hay += piece
      map.push(i)
    }
    const marks: Array<[number, number]> = []
    for (const token of tokens.sort((a, b) => b.length - a.length)) {
      let from = 0
      for (;;) {
        const idx = hay.indexOf(token, from)
        if (idx < 0) break
        marks.push([map[idx], (map[idx + token.length - 1] ?? text.length - 1) + 1])
        from = idx + token.length
      }
    }
    if (!marks.length) return text
    marks.sort((a, b) => a[0] - b[0])
    const merged: Array<[number, number]> = []
    for (const mark of marks) {
      const last = merged[merged.length - 1]
      if (last && mark[0] <= last[1]) last[1] = Math.max(last[1], mark[1])
      else merged.push(mark)
    }
    let out = ''
    let cursor = 0
    for (const [start, end] of merged) {
      out += text.slice(cursor, start)
      out += `<mark>${text.slice(start, end)}</mark>`
      cursor = end
    }
    return `${out}${text.slice(cursor)}`
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
              {etiquetaBusqueda(m)}
            </option>
          ))}
        </select>
      </header>
      <div className="view-body">
        <div className="filters">
          <input
            className="input"
            style={{ flex: 1, minWidth: 220 }}
            spellCheck={false}
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
          {loading && progress && (
            <span className="muted" style={{ fontSize: 13 }}>
              {progress.done}/{progress.total}
            </span>
          )}
          <label className="filter-check">
            <input
              type="checkbox"
              checked={allBibles}
              onChange={(e) => setAllBibles(e.target.checked)}
            />
            {t('search.allBibles')}
          </label>
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
            {correction && (
              <p className="muted" style={{ fontSize: 13 }}>
                {t('search.autoCorrection', { found: correction, typed: lastQuery })}
                <button
                  className="btn ghost small"
                  style={{ marginLeft: 8 }}
                  onClick={() => void run(lastQuery)}
                >
                  {t('search.searchTyped', { typed: lastQuery })}
                </button>
              </p>
            )}
            <p className="muted" style={{ fontSize: 13 }}>
              {t('search.count', { count: results.length })}
              {total != null && total > results.length
                ? ` · ${t('search.ofTotal', { total })}`
                : total != null && results.length > 0
                  ? ` · ${t('search.exact')}`
                  : ''}
            </p>
            <div className="search-list">
              {results.slice(0, visibleCount).map((hit, index) => {
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
                      {hit.module !== module ? ` Â· ${hit.module}` : ''}
                    </div>
                    <div className="text scripture-result">
                      <TextoTraducido
                        html={highlight(hit.text.replace(/<[^>]+>/g, ' '))}
                        plain={plainText(hit.text)}
                        lang={modulesByName.get(hit.module)?.lang}
                      />
                    </div>
                  </button>
                )
              })}
              {results.length === 0 && <p className="empty">{t('study.noResults')}</p>}
              {results.length === 0 && suggestions.length > 0 && (
                <div className="segmented" style={{ marginTop: 12, flexWrap: 'wrap' }}>
                  <span className="muted" style={{ alignSelf: 'center', fontSize: 13 }}>
                    {t('search.didYouMean')}
                  </span>
                  {suggestions.map((item) => (
                    <button key={item.word} className="chip" onClick={() => void run(item.word)}>
                      {item.word}
                    </button>
                  ))}
                </div>
              )}
              {results.length > visibleCount && (
                <button
                  className="btn"
                  style={{ marginTop: 12 }}
                  onClick={() => setVisibleCount((count) => count + 3000)}
                >
                  {t('search.showMore', { count: Math.min(3000, results.length - visibleCount) })}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
