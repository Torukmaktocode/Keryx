import { useEffect, useMemo, useRef, useState } from 'react'
import { useI18n, type TranslationKey } from '@keryx/i18n'
import type { DossierSection } from '../lib/agents'
import { apiHook, buildDossier } from '../lib/agents'
import { useAppStore } from '../store/appStore'
import { Icon } from './Icon'
import { downloadDocument } from '../lib/exportDoc'
import { ExegesisCard } from './ExegesisCard'

const KIND_TITLE_KEY: Record<DossierSection['kind'], string> = {
  texto: 'guide.texto',
  comentario: 'guide.comentario',
  bosquejo: 'guide.bosquejo',
  strongs: 'guide.strongs',
  tema: 'guide.tema',
  historico: 'guide.historico',
  ilustracion: 'guide.ilustracion',
  referencia: 'guide.referencia',
  teologico: 'guide.teologico',
  cultural: 'guide.cultural',
  cristologico: 'guide.cristologico',
  filosofico: 'guide.filosofico',
  aplicacion: 'guide.aplicacion',
  idiomas: 'guide.idiomas',
  morfologia: 'guide.morfologia',
  critico: 'guide.critico',
  sistematica: 'guide.sistematica',
  historia: 'guide.historia',
  caso: 'guide.caso',
  cita: 'guide.cita',
  figura: 'guide.figura',
  geografia: 'guide.geografia',
  consenso: 'guide.consenso',
  sintaxis: 'guide.sintaxis',
  nombres: 'guide.nombres'
}

interface Props {
  book: string
  chapter: number
  verse: number
  bookLabel: string
}

/** Guía del Pasaje (estilo FactBook): fichas generadas por sub-agentes de código. */
export function PassageGuide({ book, chapter, verse, bookLabel }: Props) {
  const { t, locale } = useI18n()
  const modules = useAppStore((s) => s.modules)
  const priorityModules = useAppStore((s) => s.settings.priorityModules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const sendToWriting = useAppStore((s) => s.sendToWriting)

  const [dossier, setDossier] = useState<Awaited<ReturnType<typeof buildDossier>> | null>(null)
  const [loading, setLoading] = useState(false)
  const req = useRef(0)

  useEffect(() => {
    const my = ++req.current
    setLoading(true)
    void buildDossier(
      apiHook({ modules, locale, priorityModules, selectedModule }),
      'crearsermon',
      `${bookLabel} ${chapter}:${verse}`,
      { book, chapter, verse }
    )
      .then((value) => {
        if (my === req.current) setDossier(value)
      })
      .catch(() => {
        if (my === req.current) setDossier(null)
      })
      .finally(() => {
        if (my === req.current) setLoading(false)
      })
  }, [book, chapter, modules])

  const citations = useMemo(() => {
    const byModule = new Map<string, string[]>()
    for (const citation of dossier?.citations ?? []) {
      const list = byModule.get(citation.module) ?? []
      list.push(citation.entry)
      byModule.set(citation.module, list)
    }
    return [...byModule.entries()]
  }, [dossier])

  const strongCodes = useMemo(
    () =>
      (dossier?.citations ?? [])
        .filter((c) => c.kind === 'strongs')
        .map((c) => c.entry)
        .filter((e) => /^[GH]\d{1,5}$/.test(e)),
    [dossier]
  )

  if (loading) {
    return (
      <div className="guide">
        <div className="empty">
          <span className="spinner" />
        </div>
      </div>
    )
  }

  if (!dossier) {
    return <p className="empty">{t('guide.noData')}</p>
  }

  return (
    <div className="guide">
      <div className="guide-head">
        <h3>
          {bookLabel} {chapter}:{verse}
        </h3>
        <button
          className="btn primary small"
          onClick={() => {
            const md = dossier.sections
              .map((section) => `## ${t(KIND_TITLE_KEY[section.kind] as TranslationKey)}\n\n${section.entries.map((e) => `- ${e}`).join('\n')}`)
              .join('\n\n')
            void sendToWriting(`# Guía del Pasaje — ${bookLabel} ${chapter}:${verse}\n\n${md}`, `${bookLabel} ${chapter}`)
          }}
        >
          {t('guide.send')}
        </button>
        <button
          className="btn ghost small"
          onClick={() => {
            const md = dossier.sections
              .map((section) => `## ${t(KIND_TITLE_KEY[section.kind] as TranslationKey)}\n\n${section.entries.map((e) => `- ${e}`).join('\n')}`)
              .join('\n\n')
            downloadDocument(`Guia ${bookLabel} ${chapter}-${verse}`, `# Guía del Pasaje — ${bookLabel} ${chapter}:${verse}\n\n${md}`, 'doc')
          }}
        >
          Exportar
        </button>
      </div>

      <div className="guide-grid">
        {dossier.sections.map((section) => (
          <section className={`guide-card guide-${section.kind}`} key={section.kind}>
            <div className="guide-card-head">
              <Icon
                name={
                  section.kind === 'texto'
                    ? 'reader'
                    : section.kind === 'bosquejo'
                      ? 'book'
                      : section.kind === 'ilustracion'
                        ? 'spark'
                        : section.kind === 'cristologico'
                          ? 'star'
                          : section.kind === 'aplicacion'
                            ? 'write'
                            : section.kind === 'tema'
                              ? 'search'
                              : 'library'
                }
                size={15}
              />
              <span>{t(KIND_TITLE_KEY[section.kind] as TranslationKey)}</span>
            </div>
            <ul>
              {section.entries.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </section>
        ))}
        {dossier.sections.length === 0 && <p className="empty">{t('guide.noData')}</p>}
      </div>

      {strongCodes.length > 0 && (
        <div className="exeg-list">
          {strongCodes.slice(0, 6).map((code) => (
            <ExegesisCard
              key={code}
              code={code}
              word="—"
              definition={null}
              modules={modules}
              onOpenRef={(refBook, refChapter, refVerse) => {
                void useAppStore.getState().setNav(refBook, refChapter, refVerse)
              }}
              onSend={(md) => void sendToWriting(md, `Exégesis ${code}`)}
            />
          ))}
        </div>
      )}

      {citations.length > 0 && (
        <div className="guide-sources">
          <span className="coverage-label">
            {t('assistant.sources', { count: citations.length })}
          </span>
          {citations.map(([module, entries]) => (
            <span
              key={module}
              className="coverage-chip"
              title={`${module} — ${entries.join(', ')}`}
            >
              {module.length > 30 ? `${module.slice(0, 28)}…` : module}
              {entries.length > 1 ? ` (${entries.length})` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
