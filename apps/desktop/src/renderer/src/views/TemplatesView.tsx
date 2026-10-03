import { useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { TranslationKey } from '@keryx/i18n'
import {
  CONSULTA_QUESTIONS,
  TEMPLATES,
  createOutlineGenerator,
  type SermonAnswers,
  type TemplateId
} from '@keryx/templates'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'

const EMPTY_ANSWERS: SermonAnswers = {
  topic: '',
  emphasis: '',
  audience: '',
  aim: ''
}

const AIM_OPTIONS: TranslationKey[] = [
  'consulta.aim.teach',
  'consulta.aim.exhort',
  'consulta.aim.evangelize',
  'consulta.aim.console',
  'consulta.aim.confront',
  'consulta.aim.worship'
]

export function TemplatesView() {
  const { t } = useI18n()
  const setActiveDocumentId = useAppStore((s) => s.setActiveDocumentId)
  const setView = useAppStore((s) => s.setView)
  const notify = useAppStore((s) => s.notify)

  const [mode, setMode] = useState<'gallery' | 'consulta'>('gallery')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<SermonAnswers>(EMPTY_ANSWERS)
  const [generating, setGenerating] = useState(false)

  const kindFor = (id: TemplateId): 'free' | 'sermon' | 'study' | 'devotional' =>
    id === 'sermon' || id === 'study' || id === 'devotional' ? id : 'free'

  const useTemplate = async (id: TemplateId): Promise<void> => {
    const template = TEMPLATES.find((item) => item.id === id)
    if (!template) return
    const name = t(`template.${id}.name`)
    const content = template.build(name)
    const doc = await api.documents.create({ title: name, kind: kindFor(id), content })
    setActiveDocumentId(doc.id)
    setView('write')
  }

  const generate = async (): Promise<void> => {
    setGenerating(true)
    try {
      const generator = createOutlineGenerator('guided')
      const outline = await generator.generate(answers)

      const refs = new Set<string>()
      for (const topic of outline.suggestedTopics.slice(0, 3)) {
        try {
          const found = await api.bible.search({ query: topic, limit: 5 })
          for (const r of found) refs.add(`${r.book} ${r.chapter}:${r.verse} (${r.module})`)
        } catch {
          // busqueda opcional
        }
      }

      const passages = refs.size
        ? `\n## ${t('templates.passages')}\n\n${[...refs].map((r) => `- ${r}`).join('\n')}\n`
        : ''
      const content = `${outline.markdown}${passages}`

      const doc = await api.documents.create({ title: outline.title, kind: 'sermon', content })
      setActiveDocumentId(doc.id)
      notify(t('templates.generated'))
      setView('write')
    } catch (error) {
      notify(error instanceof Error ? error.message : t('templates.generateError'))
    } finally {
      setGenerating(false)
    }
  }

  if (mode === 'consulta') {
    const question = CONSULTA_QUESTIONS[step]
    const value = answers[question.id as keyof SermonAnswers]
    const isLast = step === CONSULTA_QUESTIONS.length - 1

    return (
      <div className="view">
        <header className="view-header">
          <h1 className="view-title">{t('templates.consulta')}</h1>
          <div className="spacer" />
          <button className="btn ghost small" onClick={() => setMode('gallery')}>
            {t('templates.back')}
          </button>
        </header>
        <div className="view-body">
          <div className="wizard">
            <div className="wizard-progress">
              {CONSULTA_QUESTIONS.map((_, index) => (
                <span key={index} className={index <= step ? 'done' : ''} />
              ))}
            </div>
            <h2 className="wizard-question">{t(`consulta.${question.id}.title`)}</h2>
            <p className="wizard-help">{t(`consulta.${question.id}.help`)}</p>

            {question.type === 'choice' ? (
              <div className="choice-grid">
                {AIM_OPTIONS.map((optionKey) => {
                  const label = t(optionKey)
                  return (
                    <button
                      key={optionKey}
                      className={`choice ${value === label ? 'active' : ''}`}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [question.id]: label }) as SermonAnswers)
                      }
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            ) : (
              <textarea
                className="textarea"
                placeholder={t(`consulta.${question.id}.placeholder` as TranslationKey)}
                value={value}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }) as SermonAnswers)
                }
              />
            )}

            <div className="wizard-actions">
              <button
                className="btn ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                {t('common.previous')}
              </button>
              {isLast ? (
                <button className="btn primary" onClick={() => void generate()} disabled={generating}>
                  {generating ? t('templates.generating') : t('templates.generate')}
                </button>
              ) : (
                <button className="btn primary" onClick={() => setStep((s) => s + 1)}>
                  {t('common.next')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('templates.title')}</h1>
        <div className="spacer" />
        <button className="btn primary" onClick={() => setMode('consulta')}>
          <Icon name="templates" size={14} /> {t('templates.consulta')}
        </button>
      </header>
      <div className="view-body">
        <div className="grid">
          {TEMPLATES.map((template) => (
            <div
              className="card"
              key={template.id}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <strong style={{ fontFamily: 'var(--font-scripture)', fontSize: 18 }}>
                {t(`template.${template.id}.name`)}
              </strong>
              <p className="muted" style={{ margin: 0, fontSize: 13, flex: 1 }}>
                {t(`template.${template.id}.description`)}
              </p>
              <button className="btn" onClick={() => void useTemplate(template.id)}>
                {t('templates.use')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
