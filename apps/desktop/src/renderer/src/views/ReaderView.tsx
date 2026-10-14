import { Fragment, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { useI18n, type TranslationKey } from '@keryx/i18n'
import {
  bookName,
  booksByTestament,
  CANONICAL_BOOKS,
  type Verse
} from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel, languageRank } from '../lib/languages'
import { moduleOptionLabel, moduleShortLabel } from '../lib/modules'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

const COUNTS = [1, 2, 4, 6] as const
type CompareCount = (typeof COUNTS)[number]

const POLO_FORMAL: RegExp[] = [
  /reina valera/i,
  /am.ricas/i,
  /biblia textual/i,
  /interlineal/i
]

const RV: RegExp[][] = [
  [/^reina valera 1960$/i],
  [/reina valera 1960/i],
  [/^reina valera 1995$/i],
  [/reina valera 1995/i],
  [/nueva reina valera 2000/i],
  [/reina valera/i]
]

const LBLA: RegExp[][] = [
  [/la biblia de las am.ricas/i],
  [/nueva biblia de las am.ricas/i],
  [/biblia de las am.ricas/i]
]

const NVI: RegExp[][] = [[/nueva version internacional/i]]
const NTV: RegExp[][] = [[/traduccion viviente/i], [/nueva version internacional/i]]
const AMPLIADA: RegExp[][] = [[/amplificada/i]]

const ORIGINAL_OT: RegExp[][] = [
  [/hebraica stuttgart/i],
  [/transliterated hot/i],
  [/septuaginta/i],
  [/peshitta/i]
]

const ORIGINAL_NT: RegExp[][] = [
  [/interlineal/i],
  [/biblia textual/i],
  [/septuaginta/i],
  [/textus/i],
  [/hebraica stuttgart/i]
]

export const expertPlan = (count: number, baseName: string, testament: 'OT' | 'NT'): RegExp[][][] => {
  const baseFormal = POLO_FORMAL.some((re) => re.test(baseName))
  const original = testament === 'OT' ? ORIGINAL_OT : ORIGINAL_NT
  const pool = baseFormal ? [NVI, NTV, AMPLIADA, LBLA, original] : [RV, LBLA, AMPLIADA, NTV, original]
  return pool.slice(0, Math.max(count - 1, 0))
}

const PROFILE_KEYS: Record<string, TranslationKey> = {
  formal: 'reader.profile.formal',
  dinamica: 'reader.profile.dinamica',
  parafrasis: 'reader.profile.parafrasis',
  ampliada: 'reader.profile.ampliada',
  original: 'reader.profile.original'
}

const cleanVerseHtml = (html: string): string =>
  html
    .replace(/<p[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '')
    .replace(/^(?:\s|&nbsp;|<br\s*\/?>)+/i, '')

export function ReaderView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const navBook = useAppStore((s) => s.navBook)
  const navChapter = useAppStore((s) => s.navChapter)
  const navVerse = useAppStore((s) => s.navVerse)
  const setNav = useAppStore((s) => s.setNav)

  const book = navBook
  const chapter = navChapter

  const [verses, setVerses] = useState<Verse[]>([])
  const [selectedVerse, setSelectedVerse] = useState<number | null>(navVerse)
  const [loading, setLoading] = useState(false)
  const [langFilter, setLangFilter] = useState('')
  const [compare, setCompare] = useState(false)
  const [compareCount, setCompareCount] = useState<CompareCount>(2)
  const [aligned, setAligned] = useState(false)
  const [colModules, setColModules] = useState<string[]>([])
  const [colVerses, setColVerses] = useState<Record<string, Verse[]>>({})
  const [colLoading, setColLoading] = useState<Record<string, boolean>>({})
  const fetchedRef = useRef<Record<string, string>>({})
  const [testament, setTestament] = useState<'all' | 'OT' | 'NT'>('all')

  const allBibles = useMemo(() => modules.filter((m) => m.category === 'Bible'), [modules])
  const languages = useMemo(
    () =>
      [
        ...new Set(
          allBibles
            .map((m) => (m.lang || '').toLowerCase().split(/[-_]/)[0])
            .filter(Boolean)
        )
      ].sort((a, b) => languageRank(a) - languageRank(b) || a.localeCompare(b)),
    [allBibles]
  )
  const bibleModules = useMemo(
    () =>
      (langFilter
        ? allBibles.filter((m) => (m.lang || '').toLowerCase().startsWith(langFilter))
        : allBibles
      )
        .slice()
        .sort(
          (a, b) => languageRank(a.lang) - languageRank(b.lang) || a.name.localeCompare(b.name)
        ),
    [allBibles, langFilter]
  )
  const currentBook = CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0]
  const displayedBooks = useMemo(
    () => (testament === 'all' ? CANONICAL_BOOKS : booksByTestament(testament)),
    [testament]
  )

  useEffect(() => {
    if (testament !== 'all' && currentBook.testament !== testament) {
      const first = booksByTestament(testament)[0]
      if (first) {
        setNav(first.code, 1)
        setSelectedVerse(null)
      }
    }
  }, [testament, currentBook, setNav])

  const selectVerse = (num: number): void => {
    setSelectedVerse(num)
    setNav(book, chapter, num)
  }

  useEffect(() => {
    if (langFilter && bibleModules.length && !bibleModules.some((m) => m.name === selectedModule)) {
      setSelectedModule(bibleModules[0].name)
    }
  }, [langFilter, bibleModules, selectedModule, setSelectedModule])

  useEffect(() => {
    if (navVerse !== null) setSelectedVerse(navVerse)
  }, [navVerse])

  useEffect(() => {
    if (selectedVerse === null) return
    const sync = (container: HTMLElement, el: HTMLElement): void => {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      const top =
        container.scrollTop + eRect.top - cRect.top - container.clientHeight / 2 + eRect.height / 2
      container.scrollTo({ top, behavior: 'smooth' })
    }
    for (const body of document.querySelectorAll<HTMLElement>('.col-body')) {
      const el = body.querySelector<HTMLElement>(`[data-verse-num="${selectedVerse}"]`)
      if (el) sync(body, el)
    }
    const single =
      document.querySelector<HTMLElement>('.compare-stack') ??
      document.querySelector<HTMLElement>('.compare-vs') ??
      document.querySelector<HTMLElement>('.view-body:not(.flush)')
    if (single) {
      const el = single.querySelector<HTMLElement>(`[data-verse-num="${selectedVerse}"]`)
      if (el) sync(single, el)
    }
  }, [selectedVerse])

  useEffect(() => {
    if (!selectedModule) return
    setLoading(true)
    api.bible
      .chapter({ module: selectedModule, book, chapter })
      .then((result) => setVerses(result))
      .catch(() => setVerses([]))
      .finally(() => setLoading(false))
  }, [selectedModule, book, chapter])

  const nextDifferentModule = (used: string[]): string =>
    bibleModules.find((m) => m.name !== selectedModule && !used.includes(m.name))?.name ??
    bibleModules.find((m) => m.name !== selectedModule)?.name ??
    selectedModule

  useEffect(() => {
    if (!compare) return
    setColModules((prev) => {
      const filled = prev.length ? prev.filter(Boolean) : [selectedModule]
      const used = new Set(filled)
      const expert = expertPlan(compareCount, selectedModule, currentBook.testament)
      for (let i = filled.length; i < compareCount; i++) {
        let pick = ''
        for (const alt of expert[i - 1] ?? []) {
          const found = bibleModules.find(
            (m) => alt.some((re) => re.test(m.name)) && !used.has(m.name) && m.name !== selectedModule
          )
          if (found) {
            pick = found.name
            break
          }
        }
        if (!pick) pick = nextDifferentModule([...used])
        used.add(pick)
        filled.push(pick)
      }
      return filled.slice(0, compareCount)
    })
  }, [compare, compareCount, selectedModule, bibleModules, currentBook.testament])

  useEffect(() => {
    if (!compare || !colModules.length) return
    const originalSlots = currentBook.testament === 'OT' ? ORIGINAL_OT : ORIGINAL_NT
    const used = new Set(colModules.slice(0, compareCount).filter(Boolean))
    const next = colModules.slice()
    let changed = false
    colModules.slice(0, compareCount).forEach((name, i) => {
      if (!name || modulesByName.get(name)?.profile !== 'original') return
      for (const alternatives of originalSlots) {
        const found = bibleModules.find(
          (m) =>
            alternatives.some((re) => re.test(m.name)) &&
            !used.has(m.name) &&
            m.name !== name &&
            m.name !== selectedModule
        )
        if (found) {
          used.delete(name)
          used.add(found.name)
          next[i] = found.name
          changed = true
          break
        }
      }
    })
    if (changed) setColModules(next)
  }, [currentBook.testament, compare])

  useEffect(() => {
    if (compare) setAligned(false)
  }, [compare, compareCount])

  const colKey = colModules.slice(0, compareCount).join('\n')
  useEffect(() => {
    if (!compare || !colKey) return
    const list = colKey.split('\n')
    for (const moduleName of list) {
      if (!moduleName) continue
      const fetchKey = `${moduleName}#${book}#${chapter}`
      if (fetchedRef.current[moduleName] === fetchKey && colVerses[moduleName] !== undefined) continue
      fetchedRef.current[moduleName] = fetchKey
      setColLoading((prev) => ({ ...prev, [moduleName]: true }))
      api.bible
        .chapter({ module: moduleName, book, chapter })
        .then((result) => setColVerses((prev) => ({ ...prev, [moduleName]: result })))
        .catch(() => setColVerses((prev) => ({ ...prev, [moduleName]: [] })))
        .finally(() => setColLoading((prev) => ({ ...prev, [moduleName]: false })))
    }
  }, [compare, colKey, book, chapter, colVerses])

  const reflowChapter = (list: string[]): void => {
    for (const moduleName of list) {
      if (!moduleName) continue
      const fetchKey = `${moduleName}#${book}#${chapter}`
      if (fetchedRef.current[moduleName] === fetchKey && colVerses[moduleName] !== undefined) continue
      fetchedRef.current[moduleName] = fetchKey
      setColLoading((prev) => ({ ...prev, [moduleName]: true }))
      api.bible
        .chapter({ module: moduleName, book, chapter })
        .then((result) => setColVerses((prev) => ({ ...prev, [moduleName]: result })))
        .catch(() => setColVerses((prev) => ({ ...prev, [moduleName]: [] })))
        .finally(() => setColLoading((prev) => ({ ...prev, [moduleName]: false })))
    }
  }

  const setColModule = (index: number, name: string): void => {
    setColModules((prev) => {
      const next = [...prev]
      next[index] = name
      reflowChapter([next[index]])
      return next
    })
  }

  const renderVerses = (list: Verse[]): ReactElement => (
    <div className="scripture">
      {list.map((verse) => (
        <div key={`${verse.chapter}-${verse.verse}`}>
          {verse.heading && <div className="verse-heading">{verse.heading}</div>}
          <div
            className={`verse ${selectedVerse === verse.verse ? 'selected' : ''}`}
            data-verse-num={verse.verse}
            onClick={() => setSelectedVerse(verse.verse)}
          >
            <span className="verse-num">{verse.verse}</span>
            <span dangerouslySetInnerHTML={{ __html: cleanVerseHtml(verse.text) }} />
          </div>
        </div>
      ))}
    </div>
  )

  const modulesByName = useMemo(() => new Map(modules.map((m) => [m.name, m])), [modules])

  const profileKey = (moduleName: string): TranslationKey | null => {
    const profile = modulesByName.get(moduleName ?? '')?.profile
    return profile ? (PROFILE_KEYS[profile] ?? null) : null
  }

  const renderProfile = (moduleName: string): ReactElement | null => {
    const key = profileKey(moduleName)
    return key ? <span className="head-profile">{t(key)}</span> : null
  }

  const renderColSelect = (index: number, moduleName: string): ReactElement => {
    const title = profileKey(moduleName)
    return (
      <select
        className="select"
        value={moduleName ?? ''}
        title={title ? t(title) : undefined}
        onChange={(e) => setColModule(index, e.target.value)}
      >
        {bibleModules.map((m) => (
          <option key={m.name} value={m.name}>
            {moduleOptionLabel(m, locale)}
          </option>
        ))}
      </select>
    )
  }

  const renderAlignedRows = (): ReactElement => {
    const mods = colModules.slice(0, compareCount)
    const baseVerses = colVerses[mods[0] ?? '']
    if (!baseVerses) {
      return (
        <Fragment>
          <div className="empty">
            <span className="spinner" />
          </div>
        </Fragment>
      )
    }
    return (
      <>
        {baseVerses.map((baseVerse) =>
          mods.map((moduleName, colIndex) => {
            const list = colVerses[moduleName]
            const verse = list?.find((v) => v.verse === baseVerse.verse)
            return (
              <div
                className={`vs-cell ${colIndex === 0 ? 'base' : ''}`}
                key={`${baseVerse.verse}-${colIndex}`}
                data-verse-num={baseVerse.verse}
                onClick={() => setSelectedVerse(baseVerse.verse)}
              >
                {!list ? (
                  <span className="vs-loading">
                    <span className="spinner" />
                  </span>
                ) : verse ? (
                  <>
                    {colIndex === 0 && <span className="verse-num">{baseVerse.verse}</span>}
                    <span dangerouslySetInnerHTML={{ __html: cleanVerseHtml(verse.text) }} />
                  </>
                ) : (
                  <span className="vs-missing">�</span>
                )}
              </div>
            )
          })
        )}
      </>
    )
  }

  const renderStackedVerses = (): ReactElement => {
    const mods = colModules.slice(0, compareCount)
    const baseVerses = colVerses[mods[0] ?? '']
    const altMods = mods.slice(1).filter(Boolean)
    if (!baseVerses) {
      return (
        <div className="empty">
          <span className="spinner" />
        </div>
      )
    }
    return (
      <>
        {baseVerses.map((baseVerse) => (
          <section className="vs-block" key={baseVerse.verse} data-verse-num={baseVerse.verse}>
            {baseVerse.heading && <div className="vs-block-heading">{baseVerse.heading}</div>}
            <div
              className={`vs-base-row ${selectedVerse === baseVerse.verse ? 'selected' : ''}`}
              onClick={() => setSelectedVerse(baseVerse.verse)}
            >
              <span className="verse-num">{baseVerse.verse}</span>
              <span className="vs-text" dangerouslySetInnerHTML={{ __html: cleanVerseHtml(baseVerse.text) }} />
            </div>
            {altMods.map((moduleName) => {
              const list = colVerses[moduleName]
              const verse = list?.find((v) => v.verse === baseVerse.verse)
              const mod = allBibles.find((b) => b.name === moduleName)
              const labelKey = profileKey(moduleName)
              return (
                <div
                  className="vs-alt-row"
                  key={moduleName}
                  onClick={() => setSelectedVerse(baseVerse.verse)}
                >
                  <span />
                  <span className="vs-label">
                    {mod ? moduleShortLabel(mod) : moduleName}
                    {labelKey && <small>{t(labelKey)}</small>}
                  </span>
                  <span className="vs-alt-text">
                    {!list ? (
                      <span className="spinner" />
                    ) : verse ? (
                      <span
                        className="vs-text"
                        dangerouslySetInnerHTML={{ __html: cleanVerseHtml(verse.text) }}
                      />
                    ) : (
                      <span className="vs-missing">—</span>
                    )}
                  </span>
                </div>
              )
            })}
          </section>
        ))}
      </>
    )
  }

  const visibleCols = compare ? colModules.slice(0, compareCount) : []
  const paneLayout = (() => {
    const items = visibleCols.map((name, index) => ({
      name: name ?? '',
      index,
      original: modulesByName.get(name ?? '')?.profile === 'original'
    }))
    const perRow = compareCount === 6 ? 3 : compareCount === 4 ? 2 : compareCount
    const rows = Math.ceil(items.length / perRow)
    return { items, perRow, rows }
  })()

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">
          {bookName(currentBook, locale)} {chapter}
        </h1>
        <div className="spacer" />
        <select
          className="select"
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
        >
          <option value="">{t('reader.allLanguages')}</option>
          {languages.map((code) => (
            <option key={code} value={code}>
              {languageLabel(code, locale)}
            </option>
          ))}
        </select>
        {!compare && (
          <select
            className="select"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            {bibleModules.map((m) => (
              <option key={m.name} value={m.name}>
                {moduleOptionLabel(m, locale)}
              </option>
            ))}
          </select>
        )}
        <button
          className={`btn small ${compare ? 'primary' : 'ghost'}`}
          onClick={() => {
            if (!compare && !colModules.length) setColModules([selectedModule])
            setCompare((value) => !value)
          }}
          title={t('reader.compareHint')}
        >
          <Icon name="columns" size={14} /> {t('reader.compare')}
        </button>
        {compare && (
          <div className="seg" title={t('reader.compareCount')}>
            {COUNTS.map((n) => (
              <button
                key={n}
                className={`seg-btn ${compareCount === n ? 'active' : ''}`}
                onClick={() => setCompareCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
        {compare && (
          <div className="seg">
            <button
              className={`seg-btn ${!aligned ? 'active' : ''}`}
              onClick={() => setAligned(false)}
            >
              {t('reader.panels')}
            </button>
            <button
              className={`seg-btn ${aligned ? 'active' : ''}`}
              onClick={() => setAligned(true)}
            >
              {t('reader.aligned')}
            </button>
          </div>
        )}
        {compare && compareCount === 2 && !aligned && (
          <button
            className="btn ghost small"
            onClick={() => {
              setColModules(([a, b]) => [b, a])
              reflowChapter([colModules[0], colModules[1]])
            }}
            title={t('reader.swap')}
          >
            ?
          </button>
        )}
        <div className="seg">
          <button
            className={`seg-btn ${testament === 'all' ? 'active' : ''}`}
            onClick={() => setTestament('all')}
          >
            {t('reader.testament.all')}
          </button>
          <button
            className={`seg-btn ${testament === 'OT' ? 'active' : ''}`}
            onClick={() => setTestament('OT')}
          >
            {t('reader.testament.ot')}
          </button>
          <button
            className={`seg-btn ${testament === 'NT' ? 'active' : ''}`}
            onClick={() => setTestament('NT')}
          >
            {t('reader.testament.nt')}
          </button>
        </div>
        <select
          className="select"
          value={book}
          onChange={(e) => {
            setNav(e.target.value, 1)
            setSelectedVerse(null)
          }}
        >
          {displayedBooks.map((b) => (
            <option key={b.code} value={b.code}>
              {bookName(b, locale)}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={chapter}
          onChange={(e) => {
            setNav(book, Number(e.target.value))
            setSelectedVerse(null)
          }}
        >
          {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {verses.length > 0 && (
          <select
            className="select"
            value={selectedVerse ?? ''}
            onChange={(e) => e.target.value && selectVerse(Number(e.target.value))}
            title={t('reader.verse')}
          >
            <option value="">{t('reader.verse')}</option>
            {verses.map((v) => (
              <option key={v.verse} value={v.verse}>
                {v.verse}
              </option>
            ))}
          </select>
        )}
      </header>
      {compare && aligned ? (
        <div className="view-body flush">
          {compareCount > 2 ? (
            <div className="compare-stack">
              <div className="vs-alt-heads">
                {colModules.slice(0, compareCount).map((moduleName, index) => (
                  <div className={`vs-alt-head ${index === 0 ? 'base' : ''}`} key={`h-${index}`}>
                    {index === 0 && <span className="vs-tag">{t('reader.base')}</span>}
                    {renderColSelect(index, moduleName ?? '')}
                  </div>
                ))}
              </div>
              {renderStackedVerses()}
            </div>
          ) : (
            <div
              className="compare-vs"
              style={{ gridTemplateColumns: `repeat(${compareCount}, minmax(0, 1fr))` }}
            >
              {colModules.slice(0, compareCount).map((moduleName, index) => (
                <div className={`vs-head ${index === 0 ? 'base' : ''}`} key={`h-${index}`}>
                  {index === 0 && <span className="vs-tag">{t('reader.base')}</span>}
                  {renderColSelect(index, moduleName ?? '')}
                  {renderProfile(moduleName)}
                </div>
              ))}
              {renderAlignedRows()}
            </div>
          )}
        </div>
      ) : null}
      {compare && !aligned ? (
        <div className="view-body flush">
          <div className="cols compare" data-count={compareCount}>
            {paneLayout.items.map((item) => (
              <section
                className={`col ${item.original ? 'original-pair' : ''}`}
                key={`${item.index}-${item.name}`}
                style={{
                  flex: `1 1 calc(${100 / paneLayout.perRow}% - 8px)`,
                  height: `calc(${100 / paneLayout.rows}% - 10px)`
                }}
              >
                  <div className={`col-head ${item.index === 0 ? 'vs-head-base' : ''}`}>
                    {item.index === 0 && <span className="vs-tag">{t('reader.base')}</span>}
                    {renderColSelect(item.index, item.name)}
                    {renderProfile(item.name)}
                  </div>
                  <div className="col-body">
                    {item.original && <div className="orig-legend">{t('reader.orig.legend')}</div>}
                    {colLoading[item.name] ? (
                      <div className="empty">
                        <span className="spinner" />
                      </div>
                    ) : (colVerses[item.name] ?? []).length === 0 ? (
                      <div className="empty">{t('reader.noText', { module: item.name })}</div>
                    ) : (
                      renderVerses(colVerses[item.name] ?? [])
                    )}
                  </div>
                </section>
            ))}
          </div>
        </div>
      ) : null}
      {!compare ? (
        <div className="view-body">
          {loading ? (
            <div className="empty">
              <span className="spinner" />
            </div>
          ) : verses.length === 0 ? (
            <div className="empty">
              {t('reader.noText', { module: selectedModule })}
              <br />
              {t('reader.installHint')}
            </div>
          ) : (
            renderVerses(verses)
          )}
        </div>
      ) : null}
    </div>
  )
}


