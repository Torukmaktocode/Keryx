import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { api } from '../lib/api'

interface Props {
  module: string
  book: string
  chapter: number
  verse: number
  onSelectVerse: (verse: number) => void
}

const contentCache = new Map<string, string | null>()

const lookupKey = (module: string, book: string, chapter: number, verse: number): string =>
  `${module}:${book}:${chapter}:${verse}`

/** Acordeón verse-a-verse para comentarios e-Sword reales (.cmtx/.cmti). */
export function CommentaryAccordion({ module, book, chapter, verse, onSelectVerse }: Props) {
  const { t } = useI18n()
  const [verses, setVerses] = useState<number[]>([])
  const [openVerse, setOpenVerse] = useState<number | null>(null)
  const [content, setContent] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const req = useRef(0)

  useEffect(() => {
    const my = ++req.current
    setOpenVerse(null)
    setContent({})
    api.bible
      .commentaryVerses({ module, book, chapter })
      .then((list) => {
        if (my === req.current) setVerses(list)
      })
      .catch(() => {
        if (my === req.current) setVerses([])
      })
  }, [module, book, chapter])

  // sigue el versiculo seleccionado: abre la entrada que lo cubra
  useEffect(() => {
    if (!verses.length) return
    const lower = verses.filter((v) => v > 0 && v <= verse)
    const target = verse <= 0 ? verses[0] : lower.at(-1) ?? verses[0]
    if (target === openVerse) return
    setOpenVerse(target)
  }, [verses, verse])

  useEffect(() => {
    if (openVerse === null) return
    const key = lookupKey(module, book, chapter, openVerse)
    const cached = contentCache.get(key)
    if (cached !== undefined) {
      setContent((prev) => ({ ...prev, [openVerse]: cached ?? '' }))
      return
    }
    if (loading) return
    setLoading(true)
    api.bible
      .verse({ module, book, chapter, verse: openVerse })
      .then((entry) => {
        const text = entry?.text ?? ''
        contentCache.set(key, text)
        setContent((prev) => ({ ...prev, [openVerse]: text }))
      })
      .catch(() => contentCache.set(key, ''))
      .finally(() => setLoading(false))
  }, [module, book, chapter, openVerse])

  useEffect(() => {
    bodyRef.current
      ?.querySelector('.comment-item.open')
      ?.scrollIntoView({ block: 'nearest' })
  }, [openVerse, verses])

  if (!module) {
    return <p className="empty">{t('study.commentary.empty')}</p>
  }

  return (
    <div className="comment-accordion" ref={bodyRef}>
      {verses.length === 0 ? (
        <p className="empty">{t('study.commentary.empty')}</p>
      ) : (
        verses.map((v) => {
          const open = v === openVerse
          return (
            <div key={v} className={`comment-item ${open ? 'open' : ''}`}>
              <button
                className="comment-head"
                onClick={() => {
                  setOpenVerse(open ? null : v)
                  if (v > 0) onSelectVerse(v)
                }}
              >
                <span className="comment-ref">{v === 0 ? t('study.commentary.intro') : `v. ${v}`}</span>
                <span className={`comment-dot ${v === verse ? 'active' : ''}`} />
              </button>
              {open && (
                <div className="comment-body scripture">
                  {content[v] ? (
                    <div dangerouslySetInnerHTML={{ __html: content[v] }} />
                  ) : loading ? (
                    <div className="empty">
                      <span className="spinner" />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
