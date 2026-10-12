import { useEffect, useMemo, useState } from 'react'
import type { StrongsOccurrence, SwordModule } from '@keryx/core'
import { api } from '../lib/api'
import { roman, clusterSenses, bookSectionCounts, bookLabel, greekLemmaOf, transliterateGreek, type Sense } from '../lib/greek'

interface Props {
  code: string
  word: string
  definition: string | null
  modules: SwordModule[]
  onOpenRef?: (book: string, chapter: number, verse: number) => void
  onSend?: (markdown: string) => void
}

interface LemmaHit {
  module: string
  topic: string
  definition: string
}

function useLemmaHits(modules: SwordModule[], lemma: string): LemmaHit[] {
  const [hits, setHits] = useState<LemmaHit[]>([])
  useEffect(() => {
    if (!lemma) return
    let alive = true
    const lexicos = modules.filter((m) => /ortiz|greco/i.test(m.name)).slice(0, 1)
    void (async () => {
      const results: LemmaHit[] = []
      for (const mod of lexicos) {
        const hit = await api.dict.lookupLemma({ module: mod.name, lemma }).catch(() => null)
        if (hit?.definition) results.push({ module: mod.name, topic: hit.topic, definition: hit.definition })
      }
      if (alive) setHits(results)
    })()
    return () => {
      alive = false
    }
  }, [lemma, modules])
  return hits
}

function LemmaList({ senses, onOpenRef }: { senses: Sense[]; onOpenRef?: Props['onOpenRef'] }) {
  return (
    <ol className="bdag-senses">
      {senses.map((sense, index) => (
        <li key={`${sense.gloss}-${index}`}>
          <span className="bdag-gloss">{sense.gloss}</span>
          <span className="bdag-count" title="usos con esta traducción">
            {sense.count}
          </span>
          <span className="bdag-refs">
            {sense.refs.slice(0, 8).map((row, i) => (
              <button
                key={`${row.book}${row.chapter}${row.verse}-${i}`}
                className="bdag-ref"
                onClick={() => onOpenRef?.(row.book, row.chapter, row.verse)}
                title={`${bookLabel(row.book)} ${row.chapter}:${row.verse} — ${row.word}`}
              >
                {bookLabel(row.book).slice(0, 3)} {row.chapter}:{row.verse}
              </button>
            ))}
            {sense.refs.length > 8 && <span className="bdag-more">+{sense.refs.length - 8}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}

export function ExegesisCard({ code, word, definition, modules, onOpenRef, onSend }: Props) {
  const [occ, setOcc] = useState<StrongsOccurrence[] | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    void api.bible
      .strongsOccurrences({ code, limit: 400 })
      .then((rows) => {
        if (alive) setOcc(rows.slice(0, 400))
      })
      .catch(() => {
        if (alive) setOcc([])
      })
    return () => {
      alive = false
    }
  }, [code])

  const lemma = useMemo(() => greekLemmaOf(definition ?? ''), [definition])
  const translit = useMemo(() => transliterateGreek(lemma), [lemma])
  const lemmaHits = useLemmaHits(modules, lemma)

  const senses = useMemo(() => (occ ? clusterSenses(occ) : []), [occ])
  const sections = useMemo(() => (occ ? bookSectionCounts(occ) : []), [occ])
  const forms = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of occ ?? []) {
      const key = row.morphology.replace(/^(greek|hebrew)\s*/, '') || '—'
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [occ])

  const byBook = useMemo(() => {
    const map = new Map<string, StrongsOccurrence[]>()
    for (const row of occ ?? []) {
      const list = map.get(row.book) ?? []
      list.push(row)
      map.set(row.book, list)
    }
    return [...map.entries()]
  }, [occ])

  const markdown = useMemo(() => {
    const lines = [`## Exégesis ${code} (${lemma ? `${lemma} — ${translit}` : word})`]
    if (definition) lines.push(`**Strong:** ${definition}`)
    for (const hit of lemmaHits) {
      lines.push(`**Lema (${hit.topic}):** ${hit.definition}`)
    }
    if (senses.length) {
      lines.push(
        '**Sentidos en uso:**',
        ...senses.map((sense, index) => `${roman(index + 1)}. ${sense.gloss} ×${sense.count} — ${sense.refs.slice(0, 8).map((row) => `${bookLabel(row.book)} ${row.chapter}:${row.verse}`).join(', ')}`)
      )
      lines.push('')
    }
    if (forms.length) {
      lines.push(
        '**Formas:** ' +
          forms.map(([morph, n]) => `${morph || '—'} ×${n}`).join(' · ')
      )
    }
    if (sections.length) {
      lines.push('**Distribución:** ' + sections.map((s) => `${s.section} ${s.count}`).join(' · '))
    }
    if (byBook.length) {
      lines.push(
        '**Libros:** ' +
          byBook.map(([b, rows]) => `${bookLabel(b)} (${rows.length})`).join(' · ')
      )
    }
    return lines.join('\n')
  }, [code, word, lemma, translit, definition, lemmaHits, senses, forms, sections, byBook])

  return (
    <article className={`bdag ${open ? 'open' : ''}`}>
      <button className="bdag-head" onClick={() => setOpen(!open)}>
        <span className="bdag-code">{code}</span>
        <span className="bdag-titles">
          {lemma ? (
            <>
              <b className="bdag-lemma">{lemma}</b>
              <span className="bdag-translit">{translit}</span>
            </>
          ) : (
            <b className="bdag-word">{word}</b>
          )}
        </span>
        <span className="bdag-total">{occ?.length ?? '…'} usos</span>
      </button>

      {open && (
        <div className="bdag-body">
          {definition && <p className="bdag-strong">{definition}</p>}

          {lemmaHits.map((hit) => (
            <div className="bdag-lex" key={hit.module}>
              <span className="bdag-lex-source">{hit.module}</span>
              <span className="bdag-lex-topic">{hit.topic}</span>
              <p>{hit.definition}</p>
            </div>
          ))}

          {senses.length > 0 && (
            <div className="bdag-block">
              <h4>Sentidos en uso</h4>
              <LemmaList senses={senses} onOpenRef={onOpenRef} />
            </div>
          )}

          <div className="bdag-grid">
            {sections.length > 0 && (
              <div className="bdag-block">
                <h4>Distribución</h4>
                <ul className="bdag-sections">
                  {sections.map((s) => (
                    <li key={s.section}>
                      <span>{s.section}</span>
                      <span className="bdag-bar" style={{ width: `${Math.min(100, s.count)}px` }} />
                      <span className="bdag-n">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {forms.length > 0 && (
              <div className="bdag-block">
                <h4>Formas gramaticales</h4>
                <ul className="bdag-forms">
                  {forms.map(([morph, n]) => (
                    <li key={morph}>
                      <code>{morph || '—'}</code>
                      <span className="bdag-n">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {byBook.length > 0 && (
            <details className="bdag-occ">
              <summary>Concordancias ({byBook.length} libros)</summary>
              <ul>
                {byBook.map(([book, rows]) => (
                  <li key={book}>
                    <b>{bookLabel(book)}</b> {rows.length} —{' '}
                    {rows
                      .map((row) => (
                        <button
                          key={`o${row.chapter}${row.verse}${row.word}`}
                          className="bdag-ref"
                          onClick={() => onOpenRef?.(row.book, row.chapter, row.verse)}
                        >
                          {row.chapter}:{row.verse}
                        </button>
                      ))
                      .slice(0, 40)}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {onSend && (
            <button
              className="btn primary small bdag-send"
              onClick={() => {
                onSend(markdown)
              }}
            >
              Exégesis → editor
            </button>
          )}
        </div>
      )}
    </article>
  )
}
