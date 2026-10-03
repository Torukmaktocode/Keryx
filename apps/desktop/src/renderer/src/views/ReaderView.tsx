import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type Verse } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { useAppStore } from '../store/appStore'

export function ReaderView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)

  const [book, setBook] = useState('John')
  const [chapter, setChapter] = useState(3)
  const [verses, setVerses] = useState<Verse[]>([])
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [langFilter, setLangFilter] = useState('')

  const allBibles = useMemo(() => modules.filter((m) => m.category === 'Bible'), [modules])
  const languages = useMemo(
    () =>
      [
        ...new Set(
          allBibles
            .map((m) => (m.lang || '').toLowerCase().split(/[-_]/)[0])
            .filter(Boolean)
        )
      ].sort(),
    [allBibles]
  )
  const bibleModules = useMemo(
    () =>
      langFilter
        ? allBibles.filter((m) => (m.lang || '').toLowerCase().startsWith(langFilter))
        : allBibles,
    [allBibles, langFilter]
  )
  const currentBook = CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0]

  useEffect(() => {
    if (langFilter && bibleModules.length && !bibleModules.some((m) => m.name === selectedModule)) {
      setSelectedModule(bibleModules[0].name)
    }
  }, [langFilter, bibleModules, selectedModule, setSelectedModule])

  useEffect(() => {
    if (!selectedModule) return
    setLoading(true)
    api.bible
      .chapter({ module: selectedModule, book, chapter })
      .then((result) => setVerses(result))
      .catch(() => setVerses([]))
      .finally(() => setLoading(false))
  }, [selectedModule, book, chapter])

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
        <select
          className="select"
          value={book}
          onChange={(e) => {
            setBook(e.target.value)
            setChapter(1)
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
          onChange={(e) => setChapter(Number(e.target.value))}
        >
          {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </header>
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
          <div className="scripture">
            {verses.map((verse) => (
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
        )}
      </div>
    </div>
  )
}
