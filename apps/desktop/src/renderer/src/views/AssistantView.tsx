import { useEffect, useMemo, useState } from 'react'
import { downloadDocument, copyToClipboard } from '../lib/exportDoc'
import { useI18n, type TranslationKey } from '@keryx/i18n'
import type { AiStatus } from '@keryx/core'
import { api } from '../lib/api'
import {
  ASSISTANT_EXAMPLES,
  ASSISTANT_MODES,
  formatMs,
  runAssistant,
  type AssistantMode,
  type AssistantResult,
  type AssistantStepId
} from '../lib/assistant'
import { PERSONAS } from '../lib/creator'
import type { MineGroup } from '../lib/agents'
import { renderMarkdown } from '../lib/markdown'
import { documentDesdeTexto } from '../lib/presentation'
import { translateMarkdown, markdownTraducidoToHtml } from '../lib/traductor'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'
import { TituloTraducido } from '../components/TituloTraducido'

const CREATOR_MODES: AssistantMode[] = ['crearsermon', 'crearestudio', 'creardevocional']

const STEP_KEYS: Record<AssistantStepId, TranslationKey> = {
  intent: 'assistant.step.intent',
  locate: 'assistant.step.locate',
  search: 'assistant.step.search',
  dossier: 'assistant.step.dossier',
  compose: 'assistant.step.compose',
  voice: 'assistant.step.voice',
  critic: 'assistant.step.critic',
  repair: 'assistant.step.repair',
  final: 'assistant.step.final',
  sources: 'assistant.step.sources'
}

const SOURCE_ORDER: MineGroup[] = [
  'bible',
  'commentary',
  'dictionaries',
  'original',
  'context',
  'geo',
  'theology',
  'homiletics'
]

const SOURCE_KEYS: Record<MineGroup, TranslationKey> = {
  bible: 'assistant.src.bible',
  commentary: 'assistant.src.commentary',
  homiletics: 'assistant.src.homiletics',
  original: 'assistant.src.original',
  dictionaries: 'assistant.src.dictionaries',
  context: 'assistant.src.context',
  geo: 'assistant.src.geo',
  theology: 'assistant.src.theology'
}

const WORK_CREATOR: TranslationKey[] = [
  'assistant.work.a',
  'assistant.work.b',
  'assistant.work.c',
  'assistant.work.d',
  'assistant.work.e',
  'assistant.work.f',
  'assistant.work.g',
  'assistant.work.h'
]

const WORK_LOCAL: TranslationKey[] = ['assistant.work.i', 'assistant.work.j']

interface StepState {
  id: AssistantStepId
  detail?: string
  startedAt: number
  endedAt?: number
}

interface MineState {
  done: number
  total: number
  groups: MineGroup[]
}

export function AssistantView() {
  const { t, locale } = useI18n()
  const settings = useAppStore((s) => s.settings)
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const sendToWriting = useAppStore((s) => s.sendToWriting)
  const sendToPresentation = useAppStore((s) => s.sendToPresentation)
  const notify = useAppStore((s) => s.notify)
  const modulesByName = useMemo(() => new Map(modules.map((m) => [m.name, m])), [modules])

  const [mode, setMode] = useState<AssistantMode>('verse')
  const [personaId, setPersonaId] = useState('peterson')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssistantResult | null>(null)
  const [status, setStatus] = useState<AiStatus | null>(null)
  const [steps, setSteps] = useState<StepState[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [mining, setMining] = useState<MineState>({ done: 0, total: 0, groups: [] })
  const [workPhrase, setWorkPhrase] = useState(0)
  const [traducido, setTraducido] = useState<string | null>(null)
  const translateLocale = useAppStore((s) => s.settings.translateLocale)

  useEffect(() => {
    if (!result?.markdown || translateLocale === 'off' || translateLocale === 'es') {
      setTraducido(null)
      return
    }
    let alive = true
    void translateMarkdown(result.markdown, translateLocale)
      .then((md) => {
        if (alive) setTraducido(md)
      })
      .catch(() => {
        if (alive) setTraducido(null)
      })
    return () => {
      alive = false
    }
  }, [result, translateLocale])

  useEffect(() => {
    if (!loading) return
    const timer = window.setInterval(() => setWorkPhrase((index) => index + 1), 4500)
    return () => window.clearInterval(timer)
  }, [loading])

  useEffect(() => {
    api.ai
      .status()
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [settings.aiEnabled, settings.aiBaseUrl, settings.aiModel, settings.aiApiKey])

  const examples = useMemo(() => ASSISTANT_EXAMPLES[mode], [mode])

  const run = async (value?: string): Promise<void> => {
    const text = (value ?? query).trim()
    if (!text) return
    setQuery(text)
    setLoading(true)
    setResult(null)
    setSteps([])
    setElapsed(0)
    setMining({ done: 0, total: 0, groups: [] })
    const started = performance.now()
    const timer = window.setInterval(() => setElapsed(performance.now() - started), 50)
    try {
      const res = await runAssistant(
        { locale, settings, modules, selectedModule, personaId },
        mode,
        text,
        (id, detail) => {
          setSteps((prev) => [
            ...prev.map((step) => (step.endedAt ? step : { ...step, endedAt: performance.now() })),
            { id, detail, startedAt: performance.now() }
          ])
        },
        (group, done, total) => {
          setMining((prev) => ({
            done,
            total,
            groups: prev.groups.includes(group) ? prev.groups : [...prev.groups, group]
          }))
        }
      )
      setSteps((prev) => prev.map((step) => (step.endedAt ? step : { ...step, endedAt: performance.now() })))
      setElapsed(res.elapsedMs ?? 0)
      setResult(res)
      if (res.notice) notify(res.notice)
    } finally {
      window.clearInterval(timer)
      setLoading(false)
    }
  }

  const badge = status?.configured
    ? status.source === 'opencode'
      ? t('assistant.ai.opencode')
      : t('assistant.ai.ready')
    : t('assistant.ai.offline')

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.assistant')}</h1>
        <div className="spacer" />
        <span className={`badge ${status?.configured ? '' : 'muted'}`} title={status?.error ?? ''}>
          {badge}
        </span>
      </header>
      <div className="view-body">
        <div className="assistant">
          <div className="assistant-modes">
            {ASSISTANT_MODES.map((item) => (
              <button
                key={item}
                className={`chip ${mode === item ? 'active' : ''}`}
                onClick={() => setMode(item)}
              >
                {t(`assistant.mode.${item}`)}
              </button>
            ))}
          </div>

          <div className="assistant-search">
            <input
              className="input"
              placeholder={t(`assistant.placeholder.${mode}`)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void run()}
            />
            <button className="btn primary" onClick={() => void run()} disabled={loading}>
              <Icon name="search" size={14} /> {loading ? t('assistant.thinking') : t('assistant.ask')}
            </button>
          </div>

          {CREATOR_MODES.includes(mode) && (
            <div className="creator-options">
              <div className="creator-option">
                <label className="creator-option-label" htmlFor="assistant-persona">
                  {t('assistant.persona')}
                </label>
                <select
                  id="assistant-persona"
                  className="select"
                  value={personaId}
                  onChange={(e) => setPersonaId(e.target.value)}
                  title={t('assistant.personaHint')}
                >
                  {PERSONAS.map((persona) => (
                    <option key={persona.id} value={persona.id}>
                      {persona.name}
                    </option>
                  ))}
                </select>
                <p className="creator-option-desc">
                  {PERSONAS.find((p) => p.id === personaId)?.style}
                </p>
              </div>
            </div>
          )}

          <div className="assistant-examples">
            {examples.map((example) => (
              <button key={example} className="chip ghost" onClick={() => void run(example)}>
                {example}
              </button>
            ))}
          </div>

          {loading && (
            <div className="assistant-steps">
              <div className="assistant-progress-title">
                {t(
                  mode === 'crearsermon'
                    ? 'assistant.progress.crearsermon'
                    : mode === 'crearestudio'
                      ? 'assistant.progress.crearestudio'
                      : mode === 'creardevocional'
                        ? 'assistant.progress.creardevocional'
                        : 'assistant.progress.generic'
                )}
              </div>
              <div className="assistant-progress-phrase">
                {t((CREATOR_MODES.includes(mode) ? WORK_CREATOR : WORK_LOCAL)[workPhrase % (CREATOR_MODES.includes(mode) ? WORK_CREATOR.length : WORK_LOCAL.length)])}
              </div>
              <div className="assistant-timer">
                <span className="spinner small" />
                <strong>{formatMs(elapsed)}</strong>
              </div>
              {steps.map((step, index) => (
                <div
                  key={`${step.id}-${index}`}
                  className={`step ${step.endedAt ? 'done' : 'active'}`}
                >
                  <span className="step-mark">{step.endedAt ? '✓' : '»'}</span>
                  <span className="step-label">
                    {t(STEP_KEYS[step.id])}
                    {step.detail ? <small> · {step.detail}</small> : null}
                  </span>
                  {step.endedAt && (
                    <span className="step-time">{formatMs(step.endedAt - step.startedAt)}</span>
                  )}
                </div>
              ))}
              {mining.total > 0 && (
                <div className="mine-block">
                  <small className="mine-count">
                    {t('assistant.step.mining', { done: mining.done, total: mining.total })}
                  </small>
                  <div className="mine-grid">
                    {SOURCE_ORDER.map((group) => (
                      <span
                        key={group}
                        className={`mine-chip ${mining.groups.includes(group) ? 'done' : ''}`}
                      >
                        {mining.groups.includes(group) ? '✓' : '·'} {t(SOURCE_KEYS[group])}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && result && result.markdown && (
            <article className="assistant-result">
              <div className="assistant-tools">
                <span
                  className={`badge ${result.aiUsed ? '' : 'muted'}`}
                  title={
                    result.aiUsed
                      ? t('assistant.brain.aiHint', { chars: result.dossierChars ?? 0 })
                      : t('assistant.brain.localHint', { chars: result.dossierChars ?? 0 })
                  }
                >
                  {result.aiUsed
                    ? t('assistant.brain.ai', { chars: result.dossierChars ?? 0 })
                    : t('assistant.brain.local', { chars: result.dossierChars ?? 0 })}
                </span>
                {result.elapsedMs != null && (
                  <span className="badge muted">
                    {t('assistant.time', { time: formatMs(result.elapsedMs) })}
                  </span>
                )}
                <button
                  className="btn ghost small"
                  onClick={() => {
                    void sendToWriting(result.markdown, query)
                  }}
                >
                  {t('assistant.sendToEditor')}
                </button>
                <button
                  className="btn ghost small"
                  onClick={() => {
                    const kicker =
                      mode === 'crearsermon'
                        ? 'Sermón'
                        : mode === 'crearestudio'
                          ? 'Estudio'
                          : mode === 'creardevocional'
                            ? 'Devocional'
                            : 'Mensaje'
                    sendToPresentation(result.sermonDoc ?? documentDesdeTexto(query || 'Documento', result.markdown, kicker))
                  }}
                >
                  {t('assistant.sendToPresentation')}
                </button>
                <button
                  className="btn ghost small"
                  onClick={() => {
                    downloadDocument(query || 'documento', result.markdown, 'doc')
                  }}
                >
                  .doc
                </button>
                <button
                  className="btn ghost small"
                  onClick={() => {
                    downloadDocument(query || 'documento', result.markdown, 'md')
                  }}
                >
                  .md
                </button>
                <button
                  className="btn ghost small"
                  onClick={() => {
                    copyToClipboard(result.markdown)
                  }}
                >
                  Copiar
                </button>
              </div>
              {result.citations && result.citations.length > 0 && (
                <div className="coverage-row" style={{ margin: '4px 0 10px' }}>
                  <span className="coverage-label">
                    {t('assistant.sources', { count: result.citations.length })}
                  </span>
                  <div className="coverage-chips">
                    {[...new Set(result.citations.map((c) => c.module))].map((module) => (
                      <span key={module} className="coverage-chip" title={module}>
                        <TituloTraducido
                          text={module.length > 30 ? `${module.slice(0, 28)}…` : module}
                          lang={modulesByName.get(module)?.lang}
                        />
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="scripture assistant-content"
                dangerouslySetInnerHTML={{
                  __html: traducido ? markdownTraducidoToHtml(traducido) : renderMarkdown(result.markdown)
                }}
              />
            </article>
          )}

          {!loading && result && result.passages.length > 0 && (
            <div className="assistant-passages">
              <h4>{t('assistant.passages')}</h4>
              {result.passages.map((passage, index) => (
                <div className="list-item" key={`${passage.ref}-${index}`}>
                  <div className="meta">
                    <strong>{passage.ref}</strong>
                    <small>{passage.module}</small>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !result && (
            <p className="muted assistant-hint">{t('assistant.hint')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
