import { useEffect, useMemo, useState, type ReactElement } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type Verse } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel, languageRank } from '../lib/languages'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

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
  const [secondaryModule, setSecondaryModule] = useState('')
  const [secondaryVerses, setSecondaryVerses] = useState<Verse[]>([])
  const [secondaryLoading, setSecondaryLoading] = useState(false)

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

  useEffect(() => {
    if (langFilter && bibleModules.length && !bibleModules.some((m) => m.name === selectedModule)) {
      setSelectedModule(bibleModules[0].name)
    }
  }, [langFilter, bibleModules, selectedModule, setSelectedModule])

  useEffect(() => {
    if (navVerse !== null) setSelectedVerse(navVerse)
  }, [navVerse])

  useEffect(() => {
    if (!selectedModule) return
    setLoading(true)
    api.bible
      .chapter({ module: selectedModule, book, chapter })
      .then((result) => setVerses(result))
      .catch(() => setVerses([]))
      .finally(() => setLoading(false))
  }, [selectedModule, book, chapter])

  useEffect(() => {
    if (!compare) return
    if (secondaryModule && secondaryModule !== selectedModule) return
    const other = bibleModules.find((m) => m.name !== selectedModule)
    if (other) setSecondaryModule(other.name)
  }, [compare, secondaryModule, selectedModule, bibleModules])

  useEffect(() => {
    if (!compare || !secondaryModule) return
    setSecondaryLoading(true)
    api.bible
      .chapter({ module: secondaryModule, book, chapter })
      .then((result) => setSecondaryVerses(result))
      .catch(() => setSecondaryVerses([]))
      .finally(() => setSecondaryLoading(false))
  }, [compare, secondaryModule, book, chapter])

  const renderVerses = (list: Verse[]): ReactElement => (
    <div className="scripture">
      {list.map((verse) => (
        <div key={`${verse.chapter}-${verse.verse}`}>
          {verse.heading && <div className="verse-heading">{verse.heading}</div>}
          <div
            className={`verse ${selectedVerse === verse.verse ? 'selected' : ''}`}
            onClick={() => setSelectedVerse(verse.verse)}
          >
            <span className="verse-num">{verse.verse}</span>
            <span dangerouslySetInnerHTML={{ __html: verse.text }} />
          </div>
        </div>
      ))}
    </div>
  )

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
                {m.name} ({languageLabel(m.lang, locale)})
              </option>
            ))}
          </select>
        )}
        <button
          className={`btn small ${compare ? 'primary' : 'ghost'}`}
          onClick={() => setCompare((value) => !value)}
          title={t('reader.compareHint')}
        >
          <Icon name="columns" size={14} /> {t('reader.compare')}
        </button>
        {compare && (
          <button
            className="btn ghost small"
            onClick={() => {
              setSelectedModule(secondaryModule)
              setSecondaryModule(selectedModule)
            }}
            title={t('reader.swap')}
          >
            ⇄
          </button>
        )}
        <select
          className="select"
          value={book}
          onChange={(e) => {
            setNav(e.target.value, 1)
            setSelectedVerse(null)
          }}
        >
          {CANONICAL_BOOKS.map((b) => (
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
      </header>
      {compare ? (
        <div className="view-body flush">
          <div className="cols compare">
            <section className="col">
              <div className="col-head">
                <select
                  className="select"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  {bibleModules.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({languageLabel(m.lang, locale)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-body">
                {loading ? (
                  <div className="empty">
                    <span className="spinner" />
                  </div>
                ) : verses.length === 0 ? (
                  <div className="empty">{t('reader.noText', { module: selectedModule })}</div>
                ) : (
                  renderVerses(verses)
                )}
              </div>
            </section>
            <section className="col">
              <div className="col-head">
                <select
                  className="select"
                  value={secondaryModule}
                  onChange={(e) => setSecondaryModule(e.target.value)}
                >
                  {bibleModules.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({languageLabel(m.lang, locale)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-body">
                {secondaryLoading ? (
                  <div className="empty">
                    <span className="spinner" />
                  </div>
                ) : secondaryVerses.length === 0 ? (
                  <div className="empty">{t('reader.noText', { module: secondaryModule })}</div>
                ) : (
                  renderVerses(secondaryVerses)
                )}
              </div>
            </section>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}
