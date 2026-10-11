import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useI18n } from '@keryx/i18n'
import { bookName, CANONICAL_BOOKS, type Verse } from '@keryx/core'
import { api } from '../lib/api'
import { languageRank } from '../lib/languages'
import { moduleOptionLabel } from '../lib/modules'
import { parseReference } from '../lib/reference'
import { useAppStore } from '../store/appStore'
import { HermeneuticPanel } from '../components/HermeneuticPanel'

const stripTags = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const extractStrongs = (html: string): string[] => {
  const found = new Set<string>()
  for (const match of html.matchAll(/data-strong="([GH]\d{1,6})"/gi)) found.add(match[1].toUpperCase())
  return [...found]
}

const commentaryCache = new Map<string, string | null>()

export function StudyView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const priorities = useAppStore((s) => s.settings.priorityModules)
  const sendToWriting = useAppStore((s) => s.sendToWriting)

  const rank = (name: string): number => (priorities.includes(name) ? 0 : 1)
  const sortBy = <T extends { name: string }>(list: T[]): T[] =>
    list.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
  const sortBibles = <T extends { name: string; lang?: string }>(list: T[]): T[] =>
    list.sort(
      (a, b) =>
        rank(a.name) - rank(b.name) ||
        languageRank(a.lang ?? '') - languageRank(b.lang ?? '') ||
        a.name.localeCompare(b.name)
    )

  const bibleModules = useMemo(
    () => sortBibles(modules.filter((m) => m.category === 'Bible')),
    [modules, priorities]
  )
  const commentaryOptions = useMemo(
    () => sortBy(modules.filter((m) => m.category === 'Commentary')),
    [modules, priorities]
  )
  const dictModules = useMemo(
    () => sortBy(modules.filter((m) => m.category === 'Lexicon' || m.category === 'Dictionary')),
    [modules, priorities]
  )

  const [verses, setVerses] = useState<Verse[]>([])
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [tab, setTab] = useState<'panes' | 'hermeneutics'>('panes')
  const [commentaryModule, setCommentaryModule] = useState('')
  const [commentary, setCommentary] = useState<Verse | null>(null)
  const [commentaryHtml, setCommentaryHtml] = useState<string | null>(null)
  const [commentaryLoading, setCommentaryLoading] = useState(false)
  const [dictModule, setDictModule] = useState('')
  const [dictKey, setDictKey] = useState('')
  const [dictResult, setDictResult] = useState<string | null>(null)
  const [dictLoading, setDictLoading] = useState(false)
  const [refInput, setRefInput] = useState('')

  const paneRef = useRef<HTMLDivElement>(null)
  const commentaryReq = useRef(0)
  const lastAutoKey = useRef('')
  const navBook = useAppStore((s) => s.navBook)
  const navChapter = useAppStore((s) => s.navChapter)
  const navVerse = useAppStore((s) => s.navVerse)
  const setNav = useAppStore((s) => s.setNav)
  const book = navBook
  const chapter = navChapter
  const currentBook = useMemo(
    () => CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0],
    [book]
  )

  const goChapter = (delta: number): void => {
    const index = CANONICAL_BOOKS.findIndex((b) => b.code === book)
    if (delta > 0) {
      if (chapter < currentBook.chapters) setNav(book, chapter + 1)
      else if (CANONICAL_BOOKS[index + 1]) setNav(CANONICAL_BOOKS[index + 1].code, 1)
    } else if (chapter > 1) setNav(book, chapter - 1)
    else if (CANONICAL_BOOKS[index - 1]) {
      const prev = CANONICAL_BOOKS[index - 1]
      setNav(prev.code, prev.chapters)
    }
    setSelectedVerse(1)
  }

  const jump = (): void => {
    const parsed = parseReference(refInput)
    if (!parsed) return
    setNav(parsed.book, parsed.chapter, parsed.verse)
    setRefInput('')
  }

  useEffect(() => {
    if (navVerse !== null) setSelectedVerse(navVerse)
    else setSelectedVerse(1)
  }, [navVerse])

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
    if (!commentaryModule) return
    const req = ++commentaryReq.current
    const conf = modules.find((m) => m.name === commentaryModule)

    if (conf && conf.category === 'Commentary') {
      setCommentaryHtml(null)
      setCommentaryLoading(true)
      api.bible
        .verse({ module: commentaryModule, book, chapter, verse: selectedVerse })
        .then((value) => {
          if (req === commentaryReq.current) setCommentary(value)
        })
        .catch(() => {
          if (req === commentaryReq.current) setCommentary(null)
        })
        .finally(() => {
          if (req === commentaryReq.current) setCommentaryLoading(false)
        })
      return
    }

    const cacheKey = `${commentaryModule}:${book}:${chapter}:${selectedVerse}`
    if (commentaryCache.has(cacheKey)) {
      setCommentary(null)
      setCommentaryHtml(commentaryCache.get(cacheKey) ?? null)
      return
    }

    setCommentary(null)
    setCommentaryHtml(null)
    setCommentaryLoading(true)
    const primary = conf?.lang === 'es' ? 'es' : 'pt'
    const fallback = primary === 'es' ? 'pt' : 'es'
    const searchChapter = async (loc: string): Promise<string | null> => {
      const query = `${bookName(currentBook, loc)} ${chapter}`
      const found = await api.bible.search({ query, modules: [commentaryModule], limit: 1 })
      if (!found[0]) return null
      return api.dict.lookup({ module: commentaryModule, key: found[0].book })
    }
    void (async () => {
      const html = (await searchChapter(primary)) ?? (await searchChapter(fallback))
      commentaryCache.set(cacheKey, html)
      if (req !== commentaryReq.current) return
      setCommentaryHtml(html)
    })()
      .catch(() => {
        if (req === commentaryReq.current) setCommentaryHtml(null)
      })
      .finally(() => {
        if (req === commentaryReq.current) setCommentaryLoading(false)
      })
  }, [commentaryModule, book, chapter, selectedVerse, modules, currentBook])

  useEffect(() => {
    const el = paneRef.current?.querySelector('.verse.selected')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedVerse, verses])

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedVerse((v) => Math.min(v + 1, verses.length ? verses[verses.length - 1].verse : v))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedVerse((v) => Math.max(1, v - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goChapter(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goChapter(-1)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [verses, book, chapter])

  const lookup = async (term?: string): Promise<void> => {
    const key = (term ?? dictKey).trim()
    if (!dictModule || !key) return
    setDictKey(key)
    setDictLoading(true)
    try {
      const entry = await api.dict.lookup({ module: dictModule, key })
      setDictResult(entry ?? 'â€”')
    } catch (error) {
      setDictResult(error instanceof Error ? error.message : t('common.error'))
    } finally {
      setDictLoading(false)
    }
  }

  const lookupSelection = (): void => {
    const selected = window.getSelection()?.toString().trim()
    if (!selected || selected.length > 40) return
    void lookup(selected.replace(/[.,;:!?Â¡Â¿"Â«Â»()[\]]+$/g, ''))
  }

  const handleVerseClick = (event: ReactMouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement
    const strong = target.closest('w[data-strong]')?.getAttribute('data-strong')
    if (strong) {
      void lookup(strong)
      return
    }
    const verseEl = target.closest('.verse')
    const num = Number(verseEl?.querySelector('.verse-num')?.textContent)
    if (Number.isFinite(num) && num > 0) setSelectedVerse(num)
  }

  useEffect(() => {
    if (!dictModule) return
    const conf = modules.find((m) => m.name === dictModule)
    if (!conf || (conf.category !== 'Lexicon' && conf.category !== 'Dictionary')) return
    const verse = verses.find((v) => v.verse === selectedVerse)
    if (!verse) return
    const strongs = extractStrongs(verse.text)
    if (strongs.length === 0) return
    if (lastAutoKey.current === `${book}:${chapter}:${selectedVerse}:${dictModule}`) return
    lastAutoKey.current = `${book}:${chapter}:${selectedVerse}:${dictModule}`
    void lookup(strongs[0])
  }, [selectedVerse, verses, dictModule, modules, book, chapter])

  const sendPassage = (): void => {
    const verse = verses.find((v) => v.verse === selectedVerse)
    const plain = stripTags(verse?.text ?? '')
    const commentaryText = commentaryHtml
      ? stripTags(commentaryHtml)
      : stripTags(commentary?.text ?? '')
    const parts = [
      `## ${bookName(currentBook, locale)} ${chapter}:${selectedVerse}`,
      '',
      `> ${plain}`
    ]
    if (commentaryText) {
      parts.push('', `**${t('study.commentary')} â€” ${commentaryModule}**`, '', commentaryText)
    }
    void sendToWriting(parts.join('\n'), `${bookName(currentBook, locale)} ${chapter}`)
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.study')}</h1>
        <div className="spacer" />
        <input
          className="input"
          style={{ width: 180 }}
          placeholder={t('study.referencePlaceholder')}
          value={refInput}
          onChange={(e) => setRefInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && jump()}
        />
        <button className="btn small ghost" onClick={() => goChapter(-1)} title={t('study.prevChapter')}>
          â€¹
        </button>
        <button className="btn small ghost" onClick={() => goChapter(1)} title={t('study.nextChapter')}>
          â€º
        </button>
        <button className="btn primary small" onClick={sendPassage}>
          {t('study.sendToEditor')}
        </button>
        <div className="segmented">
          <button className={tab === 'panes' ? 'active' : ''} onClick={() => setTab('panes')}>
            {t('study.tab.panes')}
          </button>
          <button
            className={tab === 'hermeneutics' ? 'active' : ''}
            onClick={() => setTab('hermeneutics')}
          >
            {t('study.tab.hermeneutics')}
          </button>
        </div>
      </header>
      <div className="view-body">
        {tab === 'hermeneutics' ? (
          <HermeneuticPanel
            reference={`${bookName(currentBook, locale)} ${chapter}:${selectedVerse}`}
          />
        ) : (
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
                    {moduleOptionLabel(m, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div
              className="pane-body scripture"
              style={{ fontSize: 17 }}
              ref={paneRef}
              onDoubleClick={lookupSelection}
              onClick={handleVerseClick}
              title={t('study.wordHint')}
            >
              {verses.map((verse) => (
                <div key={verse.verse}>
                  {verse.heading && <div className="verse-heading">{verse.heading}</div>}
                  <div
                    className={`verse ${selectedVerse === verse.verse ? 'selected' : ''}`}
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
                    {moduleOptionLabel(m, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div className="pane-body">
              <div className="pane-ref">
                {bookName(currentBook, locale)} {chapter}:{selectedVerse}
              </div>
              {commentaryLoading ? (
                <div className="empty">
                  <span className="spinner" />
                </div>
              ) : commentaryHtml ? (
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
                    {moduleOptionLabel(m, locale)}
                  </option>
                ))}
              </select>
            </div>
            <div className="pane-body">
              <div className="pane-ref">
                {bookName(currentBook, locale)} {chapter}:{selectedVerse}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  className="input"
                  style={{ flex: 1 }}
                  placeholder={t('study.strongsPlaceholder')}
                  value={dictKey}
                  onChange={(e) => setDictKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && void lookup()}
                />
                <button className="btn" onClick={() => void lookup()} disabled={dictLoading}>
                  {dictLoading ? t('study.searching') : t('common.search')}
                </button>
              </div>
              {dictLoading && (
                <div className="empty">
                  <span className="spinner" />
                </div>
              )}
              {!dictLoading && dictResult && (
                <div
                  className="scripture"
                  style={{ fontSize: 16, marginTop: 12 }}
                  dangerouslySetInnerHTML={{ __html: dictResult }}
                />
              )}
            </div>
          </section>
        </div>
        )}
      </div>
    </div>
  )
}
