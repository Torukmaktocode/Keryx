import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type Verse } from '@keryx/core'
import { api } from '../lib/api'
import { languageLabel } from '../lib/languages'
import { useAppStore } from '../store/appStore'

export function StudyView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const priorities = useAppStore((s) => s.settings.priorityModules)

  const rank = (name: string): number => (priorities.includes(name) ? 0 : 1)
  const sortBy = <T extends { name: string }>(list: T[]): T[] =>
    list.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))

  const bibleModules = useMemo(
    () => sortBy(modules.filter((m) => m.category === 'Bible')),
    [modules, priorities]
  )
  const commentaryOptions = useMemo(
    () =>
      sortBy(
        modules.filter(
          (m) => m.category === 'Commentary' || m.name.toLowerCase().startsWith('champlin')
        )
      ),
    [modules, priorities]
  )
  const dictModules = useMemo(
    () => sortBy(modules.filter((m) => m.category === 'Lexicon' || m.category === 'Dictionary')),
    [modules, priorities]
  )

  const [book, setBook] = useState('John')
  const [chapter, setChapter] = useState(3)
  const [verses, setVerses] = useState<Verse[]>([])
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [commentaryModule, setCommentaryModule] = useState('')
  const [commentary, setCommentary] = useState<Verse | null>(null)
  const [commentaryHtml, setCommentaryHtml] = useState<string | null>(null)
  const [dictModule, setDictModule] = useState('')
  const [dictKey, setDictKey] = useState('')
  const [dictResult, setDictResult] = useState<string | null>(null)

  const currentBook = useMemo(
    () => CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0],
    [book]
  )

  useEffect(() => {
    if (!commentaryModule && commentaryOptions.length) {
      setCommentaryModule(commentaryOptions[0].name)
    }
  }, [commentaryOptions, commentaryModule])

  useEffect(() => {
    if (!dictModule && dictModules.length) setDictModule(dictModules[0].name)
  }, [dictModules, dictModule])

  useEffect(() => {
    if (!selectedModule) return
    api.bible
      .chapter({ module: selectedModule, book, chapter })
      .then(setVerses)
      .catch(() => setVerses([]))
  }, [selectedModule, book, chapter])

  useEffect(() => {
    if (verses.length && !verses.some((v) => v.verse === selectedVerse)) {
      setSelectedVerse(verses[0].verse)
    }
  }, [verses, selectedVerse])

  useEffect(() => {
    setCommentary(null)
    setCommentaryHtml(null)
    if (!commentaryModule) return
    const conf = modules.find((m) => m.name === commentaryModule)
    if (conf && conf.category === 'Commentary') {
      api.bible
        .verse({ module: commentaryModule, book, chapter, verse: selectedVerse })
        .then(setCommentary)
        .catch(() => setCommentary(null))
    } else {
      const query = `${bookName(currentBook, 'pt')} ${chapter}`
      api.bible
        .search({ query, modules: [commentaryModule], limit: 1 })
        .then(async (found) => {
          if (found[0]) {
            const html = await api.dict.lookup({ module: commentaryModule, key: found[0].book })
            setCommentaryHtml(html)
          }
        })
        .catch(() => setCommentaryHtml(null))
    }
  }, [commentaryModule, book, chapter, selectedVerse, modules, currentBook])

  const lookup = async (): Promise<void> => {
    if (!dictModule || !dictKey.trim()) return
    try {
      const entry = await api.dict.lookup({ module: dictModule, key: dictKey.trim() })
      setDictResult(entry ?? '—')
    } catch (error) {
      setDictResult(error instanceof Error ? error.message : t('common.error'))
    }
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.study')}</h1>
        <div className="spacer" />
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
        <div className="study-panes">
          <section className="pane">
            <div className="pane-head">
              <span>{t('study.bible')}</span>
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
            <div className="pane-body scripture" style={{ fontSize: 17 }}>
              {verses.map((verse) => (
                <div key={verse.verse}>
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
              {verses.length === 0 && (
                <p className="empty">{t('reader.noText', { module: selectedModule })}</p>
              )}
            </div>
          </section>

          <section className="pane">
            <div className="pane-head">
              <span>{t('study.commentary')}</span>
              <select
                className="select"
                value={commentaryModule}
                onChange={(e) => setCommentaryModule(e.target.value)}
              >
                {commentaryOptions.map((m) => (
                  <option key={`${m.driver}-${m.name}`} value={m.name}>
                    {m.name} ({languageLabel(m.lang, locale)})
                  </option>
                ))}
              </select>
            </div>
            <div className="pane-body">
              <div className="pane-ref">
                {bookName(currentBook, locale)} {chapter}:{selectedVerse}
              </div>
              {commentaryHtml ? (
                <div className="scripture" dangerouslySetInnerHTML={{ __html: commentaryHtml }} />
              ) : commentary?.text ? (
                <div
                  className="scripture"
                  style={{ fontSize: 16 }}
                  dangerouslySetInnerHTML={{ __html: commentary.text }}
                />
              ) : (
                <p className="empty">{t('study.noCommentary')}</p>
              )}
            </div>
          </section>

          <section className="pane">
            <div className="pane-head">
              <span>{t('study.dictionary')}</span>
              <select
                className="select"
                value={dictModule}
                onChange={(e) => setDictModule(e.target.value)}
              >
                {dictModules.map((m) => (
                  <option key={`${m.driver}-${m.name}`} value={m.name}>
                    {m.name} ({languageLabel(m.lang, locale)})
                  </option>
                ))}
              </select>
            </div>
            <div className="pane-body">
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  placeholder={t('study.strongsPlaceholder')}
                  value={dictKey}
                  onChange={(e) => setDictKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void lookup()}
                />
                <button className="btn" onClick={() => void lookup()}>
                  {t('common.search')}
                </button>
              </div>
              {dictResult && (
                <div
                  className="scripture"
                  style={{ fontSize: 16, marginTop: 12 }}
                  dangerouslySetInnerHTML={{ __html: dictResult }}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
