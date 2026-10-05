import { useState } from 'react'
import { useI18n } from '@keryx/i18n'
import {
  EMPTY_HERMENEUTIC_ANSWERS,
  HERMENEUTIC_STEPS,
  buildHermeneuticGuide,
  buildStudyFromChecklist,
  type HermeneuticAnswers
} from '@keryx/templates'
import { useAppStore } from '../store/appStore'

interface Props {
  reference: string
}

export function HermeneuticPanel({ reference }: Props) {
  const { t } = useI18n()
  const sendToWriting = useAppStore((s) => s.sendToWriting)
  const [answers, setAnswers] = useState<HermeneuticAnswers>({
    ...EMPTY_HERMENEUTIC_ANSWERS,
    reference
  })
  const [done, setDone] = useState<Set<string>>(new Set())

  const mark = (id: string): void => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const submit = (guide: boolean): void => {
    const md = guide
      ? buildHermeneuticGuide()
      : buildStudyFromChecklist({ ...answers, reference: answers.reference || reference })
    void sendToWriting(md, answers.reference || reference)
  }

  return (
    <div className="herm">
      <div className="herm-head">
        <label className="herm-ref">
          {t('hermeneutics.reference')}
          <input
            className="input"
            value={answers.reference}
            onChange={(e) => setAnswers((prev) => ({ ...prev, reference: e.target.value }))}
            placeholder={reference}
          />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => submit(true)}>
            {t('hermeneutics.guide')}
          </button>
          <button className="btn primary" onClick={() => submit(false)}>
            {t('hermeneutics.send')}
          </button>
        </div>
      </div>

      <div className="herm-progress muted">
        {t('hermeneutics.progress', { done: done.size, total: HERMENEUTIC_STEPS.length })}
      </div>

      {HERMENEUTIC_STEPS.map((step) => {
        const isDone = done.has(step.id)
        return (
          <div className={`herm-step ${isDone ? 'done' : ''}`} key={step.id}>
            <div className="herm-step-head">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={isDone} onChange={() => mark(step.id)} />
                <strong>{t(`hermeneutics.step.${step.id}.title`)}</strong>
              </label>
            </div>
            <span className="muted" style={{ fontSize: 12 }}>
              {t(`hermeneutics.step.${step.id}.help`)}
            </span>
            <textarea
              className="textarea"
              placeholder={t(`hermeneutics.step.${step.id}.placeholder`)}
              value={answers[step.id]}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [step.id]: e.target.value }) as HermeneuticAnswers)
              }
            />
          </div>
        )
      })}

      <div className="herm-step">
        <div className="herm-step-head">
          <strong>{t('hermeneutics.bigIdea.title')}</strong>
        </div>
        <span className="muted" style={{ fontSize: 12 }}>
          {t('hermeneutics.bigIdea.help')}
        </span>
        <textarea
          className="textarea"
          placeholder={t('hermeneutics.bigIdea.placeholder')}
          value={answers.bigIdea}
          onChange={(e) => setAnswers((prev) => ({ ...prev, bigIdea: e.target.value }))}
        />
      </div>
    </div>
  )
}
