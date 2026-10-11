import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode
} from 'react'
import { useI18n, type TranslationKey } from '@keryx/i18n'
import {
  STUDY_TEMPLATES,
  bookName,
  CANONICAL_BOOKS,
  type ModuleCoverage,
  type SearchResult,
  type StudyLayout,
  type StudyPaneKind,
  type SwordModule,
  type Verse
} from '@keryx/core'
import { api } from '../lib/api'
import { languageRank } from '../lib/languages'
import { parseReference } from '../lib/reference'
import { useAppStore } from '../store/appStore'
import { HermeneuticPanel } from '../components/HermeneuticPanel'
import { PaneShell } from '../components/PaneShell'
import { PaneSplitter } from '../components/PaneSplitter'
import { CommentaryAccordion } from '../components/CommentaryAccordion'
import { PassageGuide } from '../components/PassageGuide'
import { applyTemplate, normalizedWidths, resizePanes, resetPanePair, PANE_LABELS } from '../lib/studyLayout'

const PANE_KINDS: StudyPaneKind[] = ['bible', 'commentary', 'dictionary', 'book']

const stripTags = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

const extractStrongs = (html: string): string[] => {
  const found = new Set<string>()
  for (const match of html.matchAll(/data-strong="([GH]\d{1,6})"/gi)) found.add(match[1].toUpperCase())
  return [...found]
}

/** Palabra bajo el cursor usando CaretPosition (barra/problemas de seleccion). */
function wordUnderClick(event: ReactMouseEvent): string {
  const target = event.target as HTMLElement
  if (target.closest('w[data-strong]') || target.closest('.verse-num')) return ''
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null
  }
  let node: Text | null = null
  let offset = 0
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(event.clientX, event.clientY)
    if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
      node = range.startContainer as Text
      offset = range.startOffset
    }
  } else if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(event.clientX, event.clientY)
    if (pos) {
      node = pos.offsetNode as Text
      offset = pos.offset
    }
  }
  if (!node) return ''
  const text = node.textContent ?? ''
  const before = text.slice(0, offset)
  const after = text.slice(offset)
  const head = before.match(/[\p{L}\p{N}'’áéíóúñÁÉÍÓÚÑüÜ-]+$/u)?.[0] ?? ''
  const tail = after.match(/^[\p{L}\p{N}'’áéíóúñÁÉÍÓÚÑüÜ-]+/u)?.[0] ?? ''
  return (head + tail).replace(/^['’\-—]+|['’\-—,.;:!?]+$/g, '')
}

/** Modulo efectivo: preferencia del layout si existe; si no, el primero disponible. */
function effective(list: { name: string }[], wanted: string | undefined): string {
  if (wanted && list.some((m) => m.name === wanted)) return wanted
  return list[0]?.name ?? ''
}

/* ============================== Contenido: Libros ================================= */

function BookBody({ module: name }: { module: string }) {
  const initial = useRef('')
  const { t } = useI18n()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [text, setText] = useState<string | null>(null)
  const [current, setCurrent] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    initial.current = name
    setResults([])
    setText(null)
    setCurrent('')
  }, [name])

  const run = async (): Promise<void> => {
    if (!name || !query.trim()) return
    setBusy(true)
    try {
      setResults(await api.bible.search({ query: query.trim(), modules: [name], limit: 40 }))
    } catch {
      setResults([])
    } finally {
      setBusy(false)
    }
  }

  const open = async (topic: string): Promise<void> => {
    setCurrent(topic)
    api.dict
      .lookup({ module: name, key: topic })
      .then(setText)
      .catch(() => setText(null))
  }

  return (
    <div className="pane-book">
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder={t('study.bookSearch')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && void run()}
        />
        <button className="btn" onClick={() => void run()} disabled={busy}>
          {t('common.search')}
        </button>
      </div>
      {text !== null ? (
        <div className="article-view">
          <div className="pane-ref" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className="btn small ghost"
              onClick={() => {
                setText(null)
                setCurrent('')
              }}
            >
              ‹ {t('common.back')}
            </button>
            <span>{current}</span>
          </div>
          <div className="scripture" style={{ fontSize: 16 }} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      ) : results.length > 0 ? (
        <div className="list" style={{ marginTop: 12 }}>
          {results.map((item) => (
            <button key={`${item.book}-${item.chapter}`} className="list-item" onClick={() => void open(item.book)}>
              <div className="meta">
                <strong>{item.book}</strong>
                <small>{stripTags(item.text)}</small>
              </div>
            </button>
          ))}
        </div>
      ) : (
        !busy && <p className="empty">{t('study.bookHint')}</p>
      )}
    </div>
  )
}

/* ================================== Vista ========================================= */

export function StudyView() {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const setSelectedModule = useAppStore((s) => s.setSelectedModule)
  const priorities = useAppStore((s) => s.settings.priorityModules)
  const showStrongs = useAppStore((s) => s.settings.showStrongs)
  const sendToWriting = useAppStore((s) => s.sendToWriting)
  const updateStudy = useAppStore((s) => s.updateStudy)
  const settings = useAppStore((s) => s.settings)

  const study = settings.study
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
  const bookModules = useMemo(
    () => sortBy(modules.filter((m) => m.category === 'GenBook')),
    [modules, priorities]
  )
  const optionsFor = (kind: StudyPaneKind): SwordModule[] =>
    kind === 'bible'
      ? bibleModules
      : kind === 'commentary'
        ? commentaryOptions
        : kind === 'dictionary'
          ? dictModules
          : bookModules

  const [verses, setVerses] = useState<Verse[]>([])
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [tab, setTab] = useState<'panes' | 'hermeneutics' | 'guia'>('panes')
  const [dictKey, setDictKey] = useState('')
  const [dictResult, setDictResult] = useState<string | null>(null)
  const [dictLoading, setDictLoading] = useState(false)
  const [refInput, setRefInput] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [coverage, setCoverage] = useState<ModuleCoverage[]>([])
  const [dictCoverage, setDictCoverage] = useState<ModuleCoverage[]>([])

  const paneRef = useRef<HTMLDivElement>(null)
  const flexRef = useRef<HTMLDivElement>(null)
  const lastAutoKey = useRef('')
  const commentaryReq = useRef(0)
  const lastDictKey = useRef('')
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
  const bibleModule =
    study.modules.bible && bibleModules.some((m) => m.name === study.modules.bible)
      ? study.modules.bible
      : selectedModule && bibleModules.some((m) => m.name === selectedModule)
        ? selectedModule
        : (bibleModules[0]?.name ?? '')
  const commentaryModule = effective(commentaryOptions, study.modules.commentary)
  const dictModule = effective(dictModules, study.modules.dictionary)
  const bookModule = effective(bookModules, study.modules.book)

  // ---------- layout ----------
  const [containerWidth, setContainerWidth] = useState(1400)
  const [widths, setWidths] = useState<number[]>(study.widths)
  useEffect(() => setWidths(study.widths), [study.widths])

  const renderedWidths = useMemo(
    () => normalizedWidths({ ...study, widths }, containerWidth),
    [study, widths, containerWidth]
  )

  const observerRef = useRef<ResizeObserver | null>(null)
  // callback ref: al re-montar .study-flex (ej. volver desde Hermeneutica)
  // reconecta el observer y re-mide, evitando anchos desactualizados
  const setFlexNode = useCallback((node: HTMLDivElement | null): void => {
    observerRef.current?.disconnect()
    observerRef.current = null
    flexRef.current = node
    if (node) {
      setContainerWidth(node.clientWidth)
      observerRef.current = new ResizeObserver(() => setContainerWidth(node.clientWidth))
      observerRef.current.observe(node)
    }
  }, [])

  const patch = (next: Partial<StudyLayout>): void => void updateStudy(next)

  const changeTemplate = (id: string): void => {
    const next = applyTemplate(id as StudyLayout['template'], study)
    setWidths([])
    patch(next)
  }

  const onDrag = (leftIndex: number, dx: number): void => {
    const w = resizePanes(renderedWidths, leftIndex, renderedWidths[leftIndex] + dx)
    setWidths(w)
  }

  const onDragEnd = (): void => {
    patch({ widths, template: 'custom' })
  }

  const onResetSplit = (leftIndex: number): void => {
    const base = resetPanePair(widths, leftIndex)
    setWidths(base)
    patch({ widths: base, template: 'custom' })
  }

  const closePane = (kind: StudyPaneKind): void => {
    patch({
      panes: study.panes.filter((p) => p !== kind),
      closed: [...study.closed, kind],
      template: 'custom',
      widths: []
    })
    setWidths([])
  }
  const addPane = (kind: StudyPaneKind): void => {
    patch({
      panes: [...study.panes, kind],
      closed: study.closed.filter((p) => p !== kind),
      template: 'custom',
      widths: []
    })
    setWidths([])
    setAddOpen(false)
  }
  const changeKind = (index: number, kind: StudyPaneKind): void => {
    const nextPanes = [...study.panes]
    nextPanes[index] = kind
    patch({ panes: nextPanes, template: 'custom', widths: [], modules: { ...study.modules, [kind]: '' } })
    setWidths([])
  }
  const setPaneModule = (kind: StudyPaneKind, name: string): void => {
    patch({ modules: { ...study.modules, [kind]: name } })
    if (kind === 'bible') setSelectedModule(name)
  }
  const toggleSync = (kind: StudyPaneKind): void =>
    patch({ sync: { ...study.sync, [kind]: !study.sync[kind] } })

  // ---------- navegacion ----------
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
    if (!bibleModule) return
    api.bible
      .chapter({ module: bibleModule, book, chapter })
      .then(setVerses)
      .catch(() => setVerses([]))
  }, [bibleModule, book, chapter])

  useEffect(() => {
    if (verses.length && !verses.some((v) => v.verse === selectedVerse)) {
      setSelectedVerse(verses[0].verse)
    }
  }, [verses, selectedVerse])

  // marcas e-Sword: comentarios que hablan del capitulo actual
  useEffect(() => {
    const req = ++commentaryReq.current
    api.bible
      .commentaryCoverage({ book, chapter })
      .then((list) => {
        if (req === commentaryReq.current) setCoverage(list)
      })
      .catch(() => {
        if (req === commentaryReq.current) setCoverage([])
      })
  }, [book, chapter])

  // diccionarios con el termino activo (palabra Strong o busqueda manual)
  useEffect(() => {
    const term = dictKey.trim() || extractStrongs(verses.find((v) => v.verse === selectedVerse)?.text ?? '')[0] || ''
    if (!term) {
      setDictCoverage([])
      return
    }
    api.dict
      .coverage({ term })
      .then(setDictCoverage)
      .catch(() => setDictCoverage([]))
  }, [dictKey, verses, selectedVerse, book, chapter])

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
    lastDictKey.current = key
    setDictKey(key)
    setDictLoading(true)
    try {
      let entry = await api.dict.lookup({ module: dictModule, key })
      // Clave Strong (G26/H430) sin entrada en el modulo activo del diccionario:
      // resuelve usando el/los modulos Strong de la biblioteca (igual que e-Sword).
      if (!entry && /^[GH]0?\d{1,5}(\w)?$/i.test(key.replace(/\s/g, ''))) {
        const strongs = await api.dict.strongs(key.replace(/\s/g, '').toUpperCase())
        if (strongs) entry = `<p><b>${strongs.key}</b> — ${strongs.definition}</p>`
      }
      setDictResult(entry ?? '—')
    } catch (error) {
      setDictResult(error instanceof Error ? error.message : t('common.error'))
    } finally {
      setDictLoading(false)
    }
  }

  // al cambiar el diccionario activo (chip de cobertura o selector), re-busca
  // el termino pendiente como hace e-Sword
  useEffect(() => {
    if (dictModule && lastDictKey.current) void lookup(lastDictKey.current)
  }, [dictModule])

  const lookupSelection = (): void => {
    const selected = window.getSelection()?.toString().trim()
    if (!selected || selected.length > 40) return
    void lookup(selected.replace(/[.,;:!?¡¿"«»()[\]]+$/g, ''))
  }

  const handleVerseClick = (event: ReactMouseEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement
    const strong = target.closest('w[data-strong]')?.getAttribute('data-strong')
    if (strong) {
      void lookup(strong)
      return
    }
    // clic sobre una palabra del texto: la busca en el diccionario activo
    const word = wordUnderClick(event)
    if (word && word.length >= 2 && /[A-Za-zÀ-ÿ]/.test(word)) {
      void lookup(word)
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

  const sendPassage = async (): Promise<void> => {
    const verse = verses.find((v) => v.verse === selectedVerse)
    const plain = stripTags(verse?.text ?? '')
    const entry = commentaryModule
      ? await api.bible.verse({ module: commentaryModule, book, chapter, verse: selectedVerse }).catch(() => null)
      : null
    const commentaryText = entry?.text ? stripTags(entry.text) : ''
    const parts = [`## ${bookName(currentBook, locale)} ${chapter}:${selectedVerse}`, '', `> ${plain}`]
    if (commentaryText) {
      parts.push('', `**${t('study.commentary')} — ${commentaryModule}**`, '', commentaryText)
    }
    void sendToWriting(parts.join('\n'), `${bookName(currentBook, locale)} ${chapter}`)
  }

  const paneContent = (kind: StudyPaneKind): ReactNode => {
    if (kind === 'bible') {
      return (
        <div
          className={`pane-body scripture ${showStrongs ? 'show-strongs' : ''}`}
          style={{ fontSize: 17 }}
          ref={paneRef}
          onDoubleClick={lookupSelection}
          onClick={handleVerseClick}
          title={t('study.wordHint')}
        >
          {verses.map((verse) => (
            <div key={verse.verse}>
              {verse.heading && <div className="verse-heading">{verse.heading}</div>}
              <div className={`verse ${selectedVerse === verse.verse ? 'selected' : ''}`}>
                <span className="verse-num">{verse.verse}</span>
                <span dangerouslySetInnerHTML={{ __html: verse.text }} />
              </div>
            </div>
          ))}
          {verses.length === 0 && (
            <p className="empty">{t('reader.noText', { module: bibleModule })}</p>
          )}
        </div>
      )
    }
    if (kind === 'commentary') {
      return (
        <div className="pane-body">
          <CommentaryAccordion
            module={commentaryModule}
            book={book}
            chapter={chapter}
            verse={selectedVerse}
            onSelectVerse={setSelectedVerse}
          />
        </div>
      )
    }
    if (kind === 'dictionary') {
      return (
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
      )
    }
    return (
      <div className="pane-body">
        {bookModule ? <BookBody module={bookModule} /> : <p className="empty">{t('study.noCommentary')}</p>}
      </div>
    )
  }

  const shortName = (name: string): string => name.length > 26 ? `${name.slice(0, 24)}…` : name

  const coverageStrip = (
    <div className="coverage-strip">
      {coverage.length > 0 && (
        <div className="coverage-row">
          <span className="coverage-label">
            {t('study.speakOf', { ref: `${bookName(currentBook, locale)} ${chapter}` })}
          </span>
          <div className="coverage-chips">
            {coverage.map((item) => (
              <button
                key={item.module}
                className={`coverage-chip ${commentaryModule === item.module ? 'active' : ''}`}
                title={`${item.module} — ${item.hits} ${item.hits === 1 ? 'verso' : 'versos'}`}
                onClick={() => setPaneModule('commentary', item.module)}
              >
                {shortName(item.module)}
                {item.hits > 1 && <b>{item.hits}</b>}
              </button>
            ))}
          </div>
        </div>
      )}
      {dictCoverage.length > 0 && (
        <div className="coverage-row">
          <span className="coverage-label">
            {t('study.dictHave', { term: dictKey.trim() || 'Strong#' })}
          </span>
          <div className="coverage-chips">
            {dictCoverage.map((item) => (
              <button
                key={item.module}
                className={`coverage-chip dict ${dictModule === item.module ? 'active' : ''}`}
                title={item.module}
                onClick={() => setPaneModule('dictionary', item.module)}
              >
                {shortName(item.module)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const refLabel = `${bookName(currentBook, locale)} ${chapter}:${selectedVerse}`

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.study')}</h1>
        <select
          className="select"
          style={{ width: 140 }}
          value={study.template}
          title={t('study.template.title')}
          onChange={(e) => changeTemplate(e.target.value)}
        >
          {STUDY_TEMPLATES.map((spec) => (
            <option key={spec.id} value={spec.id}>
              {t(`study.template.${spec.id}` as TranslationKey)}
            </option>
          ))}
          {study.template === 'custom' && (
            <option value="custom">{t('study.template.custom')}</option>
          )}
        </select>
        <button
          className="btn small ghost"
          title={t('study.menu.add')}
          onClick={() => setAddOpen((v) => !v)}
        >
          +
        </button>
        {addOpen && (
          <div className="pane-menu-pop add-pop">
            {PANE_KINDS.filter((k) => !study.panes.includes(k)).map((k) => (
              <button key={k} className="pane-menu-item" onClick={() => addPane(k)}>
                {t(PANE_LABELS[k])}
              </button>
            ))}
          </div>
        )}
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
          ‹
        </button>
        <button className="btn small ghost" onClick={() => goChapter(1)} title={t('study.nextChapter')}>
          ›
        </button>
        <button className="btn primary small" onClick={() => void sendPassage()}>
          {t('study.sendToEditor')}
        </button>
        <div className="segmented">
          <button className={tab === 'panes' ? 'active' : ''} onClick={() => setTab('panes')}>
            {t('study.tab.panes')}
          </button>
          <button className={tab === 'guia' ? 'active' : ''} onClick={() => setTab('guia')}>
            {t('study.tab.guia')}
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
        ) : tab === 'guia' ? (
          <PassageGuide
            book={book}
            chapter={chapter}
            verse={selectedVerse}
            bookLabel={bookName(currentBook, locale)}
          />
        ) : (
          <>
            {coverageStrip}
            <div className="study-flex" ref={setFlexNode}>
              {study.panes.map((kind, index) => (
                <div
                  key={`${kind}-${index}`}
                  className="pane-slot"
                  style={{ flex: `0 0 ${Math.round(renderedWidths[index] ?? 480)}px` }}
                >
                  <PaneShell
                    kind={kind}
                    modules={optionsFor(kind)}
                    moduleId={
                      kind === 'bible'
                        ? bibleModule
                        : kind === 'commentary'
                          ? commentaryModule
                          : kind === 'dictionary'
                            ? dictModule
                            : bookModule
                    }
                    sync={study.sync[kind] ?? true}
                    refLabel={refLabel}
                    onModuleChange={(name) => setPaneModule(kind, name)}
                    onToggleSync={() => toggleSync(kind)}
                    onChangeKind={(next) => changeKind(index, next)}
                    onClose={() => closePane(kind)}
                  >
                    {paneContent(kind)}
                  </PaneShell>
                  {index < study.panes.length - 1 && (
                    <PaneSplitter
                      onResize={(dx) => onDrag(index, dx)}
                      onEnd={onDragEnd}
                      onReset={() => onResetSplit(index)}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

