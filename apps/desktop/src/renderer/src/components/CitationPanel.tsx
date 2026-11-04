import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { esStrongClave, refDeEntrada, type CitaAnclada } from '../lib/citations'
import type { SwordModule } from '@keryx/core'
import { useI18n, type TranslationKey } from '@keryx/i18n'
import { TituloTraducido } from './TituloTraducido'
import { Icon } from './Icon'

const KIND_LABELS: Record<string, TranslationKey> = {
  texto: 'citacion.kind.texto',
  comentario: 'citacion.kind.comentario',
  strongs: 'citacion.kind.strong',
  idiomas: 'citacion.kind.idiomas',
  morfologia: 'citacion.kind.morfologia',
  tema: 'citacion.kind.tema',
  cita: 'citacion.kind.cita',
  bosquejo: 'citacion.kind.bosquejo',
  caso: 'citacion.kind.caso',
  ilustracion: 'citacion.kind.caso',
  aplicacion: 'citacion.kind.caso',
  cultural: 'citacion.kind.comentario',
  critico: 'citacion.kind.comentario',
  geografia: 'citacion.kind.tema',
  historia: 'citacion.kind.caso',
  sistematica: 'citacion.kind.tema',
  teologico: 'citacion.kind.tema',
  referencia: 'citacion.kind.caso',
  figura: 'citacion.kind.tema',
  consenso: 'citacion.kind.tema',
  coalicion: 'citacion.kind.coalicion'
}

export interface StudyTarget {
  commentary?: string
  dictionary?: string
  dictKey?: string
  book?: string
  chapter?: number
  verse?: number
}

interface Props {
  citation: CitaAnclada
  moduleInfo?: SwordModule
  onClose: () => void
  onOpenStudy: (target: StudyTarget) => void
  width?: number
}

const MAX_CHARS = 8000

function clipHtml(html: string): string {
  if (html.length <= MAX_CHARS) return html
  let cut = html.lastIndexOf('>', MAX_CHARS)
  if (cut < MAX_CHARS / 2) cut = MAX_CHARS
  return `${html.slice(0, cut + 1)} …`
}

export function CitationPanel({ citation, moduleInfo, onClose, onOpenStudy, width }: Props): React.JSX.Element {
  const { t } = useI18n()
  const [content, setContent] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'sin' | 'error'>('loading')

  const esBiblia = moduleInfo?.category === 'Bible'
  const esComentario = moduleInfo?.category === 'Commentary'
  const ref = esBiblia || esComentario ? refDeEntrada(citation.entry) : null
  const tipo: 'verse' | 'strong' | 'dict' = esStrongClave(citation.entry)
    ? 'strong'
    : (esBiblia || esComentario) && ref
      ? 'verse'
      : 'dict'

  useEffect(() => {
    let alive = true
    setState('loading')
    setContent(null)
    const run = async (): Promise<void> => {
      try {
        if (tipo === 'strong') {
          const entry = await api.dict.strongs(citation.entry.replace(/\s/g, '').toUpperCase())
          if (!alive) return
          if (!entry) {
            setContent('')
            setState('sin')
            return
          }
          setContent(`<p><b>${entry.key}</b> (${entry.language}) — ${entry.definition}</p>`)
          setState('ok')
          return
        }
        if (tipo === 'verse' && ref) {
          const target = ref.verse ?? 1
          const rows = await api.bible.chapter({
            module: citation.module,
            book: ref.book,
            chapter: ref.chapter
          })
          if (!alive) return
          const anchors = rows.filter((row) => row.verse > 0 && row.verse <= target)
          const chosen = anchors.at(-1) ?? rows.find((row) => row.verse === 0) ?? null
          if (!chosen?.text) {
            setContent('')
            setState('sin')
            return
          }
          setContent(clipHtml(chosen.text))
          setState('ok')
          return
        }
        let entry = await api.dict.lookup({ module: citation.module, key: citation.entry })
        if (!entry) {
          entry = await api.dict.lookup({ module: citation.module, key: citation.entry.toUpperCase() })
        }
        if (!alive) return
        if (!entry) {
          setContent('')
          setState('sin')
          return
        }
        setContent(clipHtml(entry))
        setState('ok')
      } catch {
        if (alive) setState('error')
      }
    }
    void run()
    return () => {
      alive = false
    }
  }, [citation.module, citation.entry, tipo])

  const studyTarget: StudyTarget =
    tipo === 'verse'
      ? {
          commentary: moduleInfo?.category === 'Commentary' ? citation.module : undefined,
          book: ref?.book,
          chapter: ref?.chapter,
          verse: ref?.verse ?? 1
        }
      : { dictionary: citation.module, dictKey: citation.entry }

  const kindLabel =
    moduleInfo?.category === 'Bible'
      ? KIND_LABELS.texto
      : (KIND_LABELS[citation.kind] ?? KIND_LABELS.caso)

  return (
    <aside className="citation-panel" style={width ? { width, flex: 'none' } : undefined}>
      <header className="citation-panel-header">
        <div className="citation-panel-title">
          <span className={`badge ${tipo === 'verse' ? '' : 'muted'}`}>{t(kindLabel)}</span>
          <strong>
            <TituloTraducido text={citation.module} lang={moduleInfo?.lang} />
          </strong>
        </div>
        <button className="btn ghost small" onClick={onClose} title={t('citacion.cerrar')}>
          <Icon name="close" size={14} />
        </button>
      </header>
      <div className="citation-panel-anchor">
        <small className="muted">{t('citacion.entrada')}</small>
        <code>{citation.entry}</code>
      </div>
      <div className="citation-panel-body scripture">
        {state === 'loading' && (
          <span className="citation-panel-status">
            <span className="spinner small" /> {t('citacion.cargando')}
          </span>
        )}
        {state === 'ok' && content != null && (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
        {state === 'sin' && <small className="muted">{t('citacion.sinEntrada')}</small>}
        {state === 'error' && <small className="muted">{t('citacion.error')}</small>}
      </div>
      <footer className="citation-panel-footer">
        <button
          className="btn ghost small"
          onClick={() => onOpenStudy(studyTarget)}
          title={t('citacion.abrirEstudioHint')}
        >
          <Icon name="book" size={14} /> {t('citacion.abrirEstudio')}
        </button>
      </footer>
    </aside>
  )
}
