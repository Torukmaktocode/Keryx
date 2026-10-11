import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { AiStatus } from '@keryx/core'
import { api } from '../lib/api'
import {
  ASSISTANT_EXAMPLES,
  ASSISTANT_MODES,
  runAssistant,
  type AssistantMode,
  type AssistantResult
} from '../lib/assistant'
import { PERSONAS } from '../lib/creator'
import { renderMarkdown } from '../lib/markdown'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

const CREATOR_MODES: AssistantMode[] = ['crearsermon', 'crearestudio', 'creardevocional']

export function AssistantView() {
  const { t, locale } = useI18n()
  const settings = useAppStore((s) => s.settings)
  const modules = useAppStore((s) => s.modules)
  const selectedModule = useAppStore((s) => s.selectedModule)
  const sendToWriting = useAppStore((s) => s.sendToWriting)
  const notify = useAppStore((s) => s.notify)

  const [mode, setMode] = useState<AssistantMode>('verse')
  const [personaId, setPersonaId] = useState('peterson')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AssistantResult | null>(null)
  const [status, setStatus] = useState<AiStatus | null>(null)

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
    try {
      const res = await runAssistant(
        { locale, settings, modules, selectedModule, personaId },
        mode,
        text
      )
      setResult(res)
      if (res.notice) notify(res.notice)
    } finally {
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
            <div className="empty">
              <span className="spinner" />
            </div>
          )}

          {!loading && result && result.markdown && (
            <article className="assistant-result">
              <div className="assistant-tools">
                <button
                  className="btn ghost small"
                  onClick={() => {
                    void sendToWriting(result.markdown, query)
                  }}
                >
                  {t('assistant.sendToEditor')}
                </button>
              </div>
              <div
                className="scripture assistant-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(result.markdown) }}
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
