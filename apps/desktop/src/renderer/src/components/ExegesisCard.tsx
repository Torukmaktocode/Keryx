import { useEffect, useMemo, useState } from 'react'
import { bookName, CANONICAL_BOOKS, type StrongsOccurrence } from '@keryx/core'
import { api } from '../lib/api'
import type { SwordModule } from '@keryx/core'

interface Props {
  code: string
  word: string
  definition: string | null
  modules: SwordModule[]
  onSend?: (markdown: string) => void
}

interface LemmaHit {
  module: string
  topic: string
  definition: string
}

export function ExegesisCard({ code, word, definition, modules, onSend }: Props) {
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

  const lemma = /G/.test(code) ? (definition ?? '').match(/([\u0370-\u03ff])[\u0370-\u03ff\s,;·’']+/u)?.[0] ?? '' : ''
  const lemmaClean = lemma.trim().split(/[\s,]/)[0]

  const lemmaHits = useLemmaHits(modules, lemmaClean)

  const byBook = useMemo(() => {
    const map = new Map<string, StrongsOccurrence[]>()
    for (const row of occ ?? []) {
      const list = map.get(row.book) ?? []
      list.push(row)
      map.set(row.book, list)
    }
    return [...map.entries()]
  }, [occ])

  const senses = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of occ ?? []) {
      const key = (row.word.replace(/[.,;:]+$/, '') || '—').trim()
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [occ])

  const morphology = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of occ ?? []) {
      const key = row.morphology.replace(/^(greek|hebrew)\s*/, '') || '—'
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [occ])

  const markdown = useMemo(() => {
    const lines: string[] = [`## Exégesis ${code} — ${word}`]
    if (definition) lines.push(`**Strong:** ${definition}`)
    for (const hit of lemmaHits) {
      lines.push(`**${hit.topic}** (${hit.module}): ${hit.definition}`)
    }
    if (senses.length) {
      lines.push('**Sentidos por traducción:** ' + senses.map(([w, n]) => `${w} ×${n}`).join(' · '))
    }
    if (morphology.length) {
      lines.push('**Formas:** ' + morphology.map(([m, n]) => `${m} ×${n}`).join(' · '))
    }
    if (byBook.length) {
      lines.push('**Ocurrencias:** ' + byBook.map(([b, rows]) => `${b} (${rows.map((r) => `${r.chapter}:${r.verse}`).slice(0, 12).join(' ')})`).join(' · '))
    }
    return lines.join('\n\n')
  }, [code, word, definition, lemmaHits, senses, morphology, byBook])

  return (
    <div className={`exeg-card ${open ? 'open' : ''}`}>
      <button className="exeg-head" onClick={() => setOpen(!open)}>
        <span className="exeg-code">{code}</span>
        <span className="exeg-word">{word}</span>
        <span className="exeg-count">{occ?.length ?? '…'}</span>
      </button>
      {open && (
        <div className="exeg-body">
          {definition && <p className="exeg-def">{definition}</p>}
          {lemmaHits.length > 0 && (
            <div className="exeg-lemma">
              {lemmaHits.map((hit) => (
                <p key={hit.module}>
                  <b>{hit.topic}</b> · {hit.module}: {hit.definition.slice(0, 220)}…
                </p>
              ))}
            </div>
          )}
          {senses.length > 0 && (
            <p className="exeg-senses">
              {senses.slice(0, 10).map(([w, n]) => `${w} ×${n}`).join(' · ')}
            </p>
          )}
          {morphology.length > 0 && (
            <p className="exeg-morph">
              {morphology.map(([m, n]) => `${m || '—'} ×${n}`).join(' · ')}
            </p>
          )}
          <ul className="exeg-occ">
            {byBook.map(([book, rows]) => (
              <li key={book}>
                <b>{bookName(CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0], 'es')}</b>{' '}
                {rows
                  .map((row) => `${row.chapter}:${row.verse}${row.word ? `·${row.word}` : ''}`)
                  .slice(0, 30)
                  .join(' ')}
              </li>
            ))}
          </ul>
          {onSend && (
            <button
              className="btn small"
              onClick={() => {
                onSend(markdown)
              }}
            >
              Exégesis → editor
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Lema → Ortiz (verificado por lema real). Cache por sesión. */
function useLemmaHits(modules: SwordModule[], lemma: string): LemmaHit[] {
  const [hits, setHits] = useState<LemmaHit[]>([])
  useEffect(() => {
    if (!lemma) return
    let alive = true
    const lexicos = modules.filter((m) => /ortiz|greco/i.test(m.name)).slice(0, 2)
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
