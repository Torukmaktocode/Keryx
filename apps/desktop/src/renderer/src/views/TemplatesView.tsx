import { useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { TranslationKey } from '@keryx/i18n'
import {
  CONSULTA_QUESTIONS,
  TEMPLATES,
  buildFromSections,
  createOutlineGenerator,
  type SermonAnswers,
  type TemplateId
} from '@keryx/templates'
import type { CustomTemplate } from '@keryx/core'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'
import { TemplateEditorFields, type TemplateEditorSeed } from './TemplateEditorFields'

const EMPTY_ANSWERS: SermonAnswers = {
  topic: '',
  emphasis: '',
  audience: '',
  aim: '',
  genre: '',
  delivery: ''
}

interface ExpandedState {
  seed: TemplateEditorSeed
  builtinId: TemplateId | null
}

export function TemplatesView() {
  const { t } = useI18n()
  const setActiveDocumentId = useAppStore((s) => s.setActiveDocumentId)
  const setView = useAppStore((s) => s.setView)
  const notify = useAppStore((s) => s.notify)
  const settings = useAppStore((s) => s.settings)
  const saveCustomTemplate = useAppStore((s) => s.saveCustomTemplate)
  const removeCustomTemplate = useAppStore((s) => s.removeCustomTemplate)
  const customTemplates = settings.templates?.custom ?? []

  const [mode, setMode] = useState<'gallery' | 'consulta'>('gallery')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<SermonAnswers>(EMPTY_ANSWERS)
  const [generating, setGenerating] = useState(false)
  const [expanded, setExpanded] = useState<ExpandedState | null>(null)

  const kindFor = (id: TemplateId): 'free' | 'sermon' | 'study' | 'devotional' => {
    if (id === 'expositive') return 'sermon'
    if (id === 'hermeneuticStudy') return 'study'
    if (id === 'sermon' || id === 'study' || id === 'devotional') return id
    return 'free'
  }

  const openDocument = async (title: string, kind: CustomTemplate['kind'], content: string) => {
    const doc = await api.documents.create({ title, kind, content })
    setActiveDocumentId(doc.id)
    setView('write')
  }

  const useTemplate = async (id: TemplateId): Promise<void> => {
    const template = TEMPLATES.find((item) => item.id === id)
    if (!template) return
    const name = t(`template.${id}.name`)
    const content = template.build(name)
    await openDocument(name, kindFor(id), content)
  }

  const useCustomTemplate = async (template: CustomTemplate): Promise<void> => {
    const content = buildFromSections(
      template.sections.map((section) => ({ ...section })),
      template.name
    )
    await openDocument(template.name, template.kind, content)
  }

  const expandBuiltin = (id: TemplateId): void => {
    if (expanded && expanded.builtinId === id) {
      setExpanded(null)
      return
    }
    const template = TEMPLATES.find((item) => item.id === id)
    if (!template) return
    setExpanded({
      builtinId: id,
      seed: {
        id: null,
        name: t(`template.${id}.name`),
        kind: kindFor(id),
        sections: template.sections.map((section) => ({ ...section }))
      }
    })
  }

  const expandCustom = (template: CustomTemplate): void => {
    if (expanded && expanded.seed.id === template.id) {
      setExpanded(null)
      return
    }
    setExpanded({
      builtinId: null,
      seed: {
        id: template.id,
        name: template.name,
        kind: template.kind,
        sections: template.sections.map((section) => ({ ...section }))
      }
    })
  }

  const expandNew = (): void => {
    if (expanded && expanded.seed.id === null && expanded.builtinId === null) {
      setExpanded(null)
      return
    }
    setExpanded({ builtinId: null, seed: { id: null, name: '', kind: 'study', sections: [] } })
  }

  const handleSaveAndClose = async (template: CustomTemplate): Promise<void> => {
    await saveCustomTemplate(template)
    setExpanded(null)
    notify(t('templates.editor.saved'))
  }

  const handleSaveAndUse = async (
    template: CustomTemplate,
    markdown: string
  ): Promise<void> => {
    await saveCustomTemplate(template)
    setExpanded(null)
    await openDocument(template.name, template.kind, markdown)
    notify(t('templates.editor.saved'))
  }

  const generate = async (): Promise<void> => {
    setGenerating(true)
    try {
      const generator = settings.aiEnabled
        ? createOutlineGenerator('ai', (req) => api.ai.chat(req))
        : createOutlineGenerator('guided')
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
                {(question.options ?? []).map((optionKey) => {
                  const label = t(optionKey as TranslationKey)
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

  const editorRow = (seed: TemplateEditorSeed, keyLabel: string) => (
    <div
      className="card"
      key={keyLabel}
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'var(--bg-elevated, var(--bg-card, rgba(127, 127, 127, 0.08)))'
      }}
    >
      <strong style={{ fontFamily: 'var(--font-scripture)', fontSize: 17 }}>
        {t('templates.editor.title')}
      </strong>
      <TemplateEditorFields
        seed={seed}
        onSave={handleSaveAndClose}
        onSaveAndUse={handleSaveAndUse}
        onCancel={() => setExpanded(null)}
      />
    </div>
  )

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('templates.title')}</h1>
        <div className="spacer" />
        <button className="btn" onClick={expandNew}>
          <Icon name="plus" size={14} /> {t('templates.editor.new')}
        </button>
        <button className="btn primary" onClick={() => setMode('consulta')}>
          <Icon name="templates" size={14} /> {t('templates.consulta')}
        </button>
      </header>
      <div className="view-body">
        <div className="grid">
          {TEMPLATES.map((template) => {
            const isExpanded = expanded?.builtinId === template.id
            if (isExpanded) return editorRow(expanded.seed, template.id)
            return (
              <div
                className="card"
                key={template.id}
                onClick={() => expandBuiltin(template.id)}
                style={{ display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
              >
                <strong style={{ fontFamily: 'var(--font-scripture)', fontSize: 18 }}>
                  {t(`template.${template.id}.name`)}
                </strong>
                <p className="muted" style={{ margin: 0, fontSize: 13, flex: 1 }}>
                  {t(`template.${template.id}.description`)}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      void useTemplate(template.id)
                    }}
                  >
                    {t('templates.use')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <h2 style={{ fontSize: 15, margin: '18px 0 10px' }}>{t('templates.editor.mine')}</h2>
        {customTemplates.length === 0 && !(expanded && expanded.seed.id === null && expanded.builtinId === null) ? (
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            {t('templates.editor.mineEmpty')}
          </p>
        ) : (
          <div className="grid">
            {customTemplates.map((template) => {
              const isExpanded = expanded?.seed.id === template.id
              if (isExpanded && expanded)
                return editorRow(expanded.seed, template.id)
              return (
                <div
                  className="card"
                  key={template.id}
                  onClick={() => expandCustom(template)}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
                >
                  <strong style={{ fontFamily: 'var(--font-scripture)', fontSize: 18 }}>
                    {template.name}
                  </strong>
                  <p className="muted" style={{ margin: 0, fontSize: 13, flex: 1 }}>
                    {t(`templates.editor.kind.${template.kind}` as TranslationKey)} ·{' '}
                    {template.sections.length} {t('templates.editor.sectionsCount')}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        void useCustomTemplate(template)
                      }}
                    >
                      {t('templates.use')}
                    </button>
                    <button
                      className="btn ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        void removeCustomTemplate(template.id)
                      }}
                      title={t('templates.editor.delete')}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
            {expanded && expanded.builtinId === null && expanded.seed.id === null
              ? editorRow(expanded.seed, 'new')
              : null}
          </div>
        )}
      </div>
    </div>
  )
}
