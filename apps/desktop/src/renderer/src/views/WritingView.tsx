import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { KeryxEditor, type EditorStats, type FocusMode } from '@keryx/editor'
import type { DocumentMeta } from '@keryx/core'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

export function WritingView() {
  const { t } = useI18n()
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const activeDocumentId = useAppStore((s) => s.activeDocumentId)
  const setActiveDocumentId = useAppStore((s) => s.setActiveDocumentId)
  const notify = useAppStore((s) => s.notify)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const modules = useAppStore((s) => s.modules)

  const mountRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<KeryxEditor | null>(null)
  const idRef = useRef<string | null>(null)
  const titleRef = useRef('')
  const saveTimer = useRef<number | null>(null)
  const checkTimer = useRef<number | null>(null)
  const onChangeRef = useRef<() => void>(() => {})
  const onStatsRef = useRef<(stats: EditorStats) => void>(() => {})

  const [docs, setDocs] = useState<DocumentMeta[]>([])
  const [title, setTitle] = useState('')
  const [stats, setStats] = useState<EditorStats>({ words: 0, characters: 0, readingMinutes: 0 })
  const [saving, setSaving] = useState(false)
  const [zen, setZen] = useState(false)
  const [spelling, setSpelling] = useState<Array<{ word: string; suggestions: string[] }>>([])

  const bibleModule = useMemo(() => {
    const bibles = modules.filter((m) => m.category === 'Bible')
    const spanish = bibles.find((m) => (m.lang || '').toLowerCase().startsWith('es'))
    return (spanish ?? bibles[0])?.name ?? ''
  }, [modules])

  const writingFont =
    settings.writingFont && settings.writingFont !== 'iA Writer Quattro'
      ? `'${settings.writingFont}', var(--font-writing)`
      : 'var(--font-writing)'

  const refreshDocs = useCallback(async () => {
    setDocs(await api.documents.list())
  }, [])

  const doSave = useCallback(async () => {
    const id = idRef.current
    const editor = editorRef.current
    if (!id || !editor) return
    setSaving(true)
    try {
      await api.documents.save({ id, content: editor.getValue(), title: titleRef.current })
      await refreshDocs()
    } catch {
      notify(t('write.saveError'))
    } finally {
      setSaving(false)
    }
  }, [notify, refreshDocs, t])

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => void doSave(), 800)
  }, [doSave])

  /** Corrector automatico (0 tokens): tras una pausa de tipeo compara las
   * palabras del documento con el vocabulario de la Biblia base. */
  const scheduleCheck = useCallback(() => {
    if (checkTimer.current) window.clearTimeout(checkTimer.current)
    checkTimer.current = window.setTimeout(() => {
      void (async () => {
        const editor = editorRef.current
        if (!editor || !bibleModule) return
        const value = editor.getValue()
        const words = [...new Set(value.match(/[\p{L}]{4,}/gu) ?? [])].slice(0, 400)
        if (!words.length) {
          setSpelling([])
          return
        }
        try {
          setSpelling(await api.bible.checkSpelling({ module: bibleModule, words, limit: 3 }))
        } catch {
          setSpelling([])
        }
      })()
    }, 1200)
  }, [bibleModule])

  const fixWord = useCallback((word: string, replacement: string): void => {
    editorRef.current?.replaceWord(word, replacement)
    onChangeRef.current()
  }, [])

  onChangeRef.current = () => {
    scheduleSave()
    scheduleCheck()
  }
  onStatsRef.current = setStats

  useEffect(() => {
    void refreshDocs()
  }, [refreshDocs])

  useEffect(() => {
    if (!mountRef.current) return
    const editor = new KeryxEditor(mountRef.current, {
      initialValue: '',
      focusMode: settings.focusMode,
      typewriter: settings.typewriter,
      fontFamily: writingFont,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      measure: settings.measure,
      onChange: () => onChangeRef.current(),
      onStats: (value) => onStatsRef.current(value)
    })
    editorRef.current = editor
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      void doSave()
      editor.destroy()
      editorRef.current = null
    }
  }, [])

  useEffect(() => {
    editorRef.current?.setFocusMode(settings.focusMode)
  }, [settings.focusMode])

  useEffect(() => {
    editorRef.current?.setTypewriter(settings.typewriter)
  }, [settings.typewriter])

  useEffect(() => {
    editorRef.current?.setTypography({
      fontFamily: writingFont,
      fontSize: settings.fontSize,
      lineHeight: settings.lineHeight,
      measure: settings.measure
    })
  }, [settings.fontSize, settings.lineHeight, settings.measure, writingFont])

  useEffect(() => {
    if (!activeDocumentId || !editorRef.current) return
    if (idRef.current === activeDocumentId) return
    void api.documents.get(activeDocumentId).then((doc) => {
      if (!doc || !editorRef.current) return
      idRef.current = doc.id
      titleRef.current = doc.title
      setTitle(doc.title)
      editorRef.current.setValue(doc.content)
      editorRef.current.focus()
    })
  }, [activeDocumentId])

  const createDocument = async (): Promise<void> => {
    const doc = await api.documents.create({
      title: t('write.titlePlaceholder'),
      kind: 'free',
      content: ''
    })
    await refreshDocs()
    setActiveDocumentId(doc.id)
  }

  const openDocument = (id: string): void => {
    if (id === idRef.current) return
    void doSave().then(() => setActiveDocumentId(id))
  }

  const removeDocument = async (id: string): Promise<void> => {
    await api.documents.remove(id)
    if (idRef.current === id) {
      idRef.current = null
      titleRef.current = ''
      setTitle('')
      editorRef.current?.setValue('')
      setActiveDocumentId(null)
    }
    await refreshDocs()
  }

  const exportDocument = (format: 'md' | 'html'): void => {
    const editor = editorRef.current
    if (!editor) return
    const content = editor.getValue()
    const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const body =
      format === 'md'
        ? content
        : `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body><pre style="white-space:pre-wrap;font-family:serif;max-width:70ch;margin:40px auto;font-size:19px;line-height:1.7">${escaped}</pre></body></html>`
    const blob = new Blob([body], { type: format === 'md' ? 'text/markdown' : 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${title || 'documento'}.${format}`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const focusLabel = useMemo(() => {
    if (settings.focusMode === 'sentence') return t('write.focus.sentence')
    if (settings.focusMode === 'paragraph') return t('write.focus.paragraph')
    return t('write.focus.off')
  }, [settings.focusMode, t])

  const cycleFocus = (): void => {
    const order: FocusMode[] = ['off', 'sentence', 'paragraph']
    const next = order[(order.indexOf(settings.focusMode) + 1) % order.length]
    void updateSettings({ focusMode: next })
  }

  const toggleZen = (): void => {
    setZen((value) => !value)
    void toggleSidebar()
  }

  return (
    <div className={`writing ${zen ? 'zen' : ''}`}>
      <aside className="docs">
        <button className="btn small" onClick={() => void createDocument()}>
          <Icon name="plus" size={14} /> {t('write.new')}
        </button>
        {docs.length === 0 && (
          <p className="muted" style={{ fontSize: 12 }}>
            {t('write.noDocuments')}
          </p>
        )}
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`doc-item ${idRef.current === doc.id ? 'active' : ''}`}
            onClick={() => openDocument(doc.id)}
          >
            <span>{doc.title}</span>
            <small>
              {t(`doc.kind.${doc.kind}`)} - {t('write.words', { count: doc.wordCount })}
            </small>
          </div>
        ))}
      </aside>

      <div className="editor-shell">
        <div className="writing-bar">
          <input
            className="title-input"
            value={title}
            placeholder={t('write.titlePlaceholder')}
            onChange={(e) => {
              setTitle(e.target.value)
              titleRef.current = e.target.value
              scheduleSave()
            }}
          />
          <span className="stat">{saving ? t('write.saving') : t('write.saved')}</span>
          <span className="stat">{t('write.words', { count: stats.words })}</span>
          <span className="stat">{t('write.minutes', { count: stats.readingMinutes })}</span>
          <button
            className={`btn ghost small ${settings.focusMode !== 'off' ? 'primary' : ''}`}
            onClick={cycleFocus}
            title={t('settings.focusHint')}
          >
            {focusLabel}
          </button>
          <button
            className={`btn ghost small ${settings.typewriter ? 'primary' : ''}`}
            onClick={() => void updateSettings({ typewriter: !settings.typewriter })}
          >
            {t('write.typewriter')}
          </button>
          <button
            className={`btn ghost small ${zen ? 'primary' : ''}`}
            onClick={toggleZen}
            title={t('write.zenHint')}
          >
            {t('write.zen')}
          </button>
          <button className="btn ghost small" onClick={() => exportDocument('md')}>
            MD
          </button>
          <button className="btn ghost small" onClick={() => exportDocument('html')}>
            HTML
          </button>
          <button
            className="btn ghost small"
            onClick={() => idRef.current && void removeDocument(idRef.current)}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
        {spelling.length > 0 && (
          <div className="spelling-bar">
            <span className="spelling-label">
              {t('write.spelling', { count: spelling.length })}
            </span>
            {spelling.slice(0, 12).map((item) => (
              <span key={item.word} className="spelling-item">
                <strong>{item.word}</strong>
                {item.suggestions.map((sug) => (
                  <button
                    key={sug}
                    className="chip ghost"
                    title={t('write.spellingFix', { word: sug })}
                    onClick={() => fixWord(item.word, sug)}
                  >
                    {sug}
                  </button>
                ))}
              </span>
            ))}
          </div>
        )}
        <div className="editor-mount" ref={mountRef} />
      </div>
    </div>
  )
}
