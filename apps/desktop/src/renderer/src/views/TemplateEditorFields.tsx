import { useState } from 'react'
import { useI18n } from '@keryx/i18n'
import type { TranslationKey } from '@keryx/i18n'
import {
  SECTION_PRESETS,
  type SectionPresetId,
  type TemplateSection
} from '@keryx/templates'
import type { CustomTemplate } from '@keryx/core'
import { Icon } from '../components/Icon'

export interface TemplateEditorSeed {
  id: string | null
  name: string
  kind: 'free' | 'sermon' | 'study' | 'devotional'
  sections: TemplateSection[]
}

const KIND_OPTIONS: CustomTemplate['kind'][] = ['sermon', 'study', 'devotional', 'free']
const PRESET_OPTIONS: SectionPresetId[] = ['sermon', 'study', 'devotional', 'blank']

export function TemplateEditorFields({
  seed,
  onSave,
  onSaveAndUse,
  onCancel
}: {
  seed: TemplateEditorSeed
  onSave: (template: CustomTemplate) => Promise<void>
  onSaveAndUse: (template: CustomTemplate, markdown: string) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(seed.name)
  const [kind, setKind] = useState<CustomTemplate['kind']>(seed.kind)
  const [sections, setSections] = useState<TemplateSection[]>(seed.sections)
  const [saving, setSaving] = useState(false)

  const validName = name.trim().length > 0

  const updateSection = (index: number, patch: Partial<TemplateSection>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  const moveSection = (index: number, delta: number) => {
    setSections((prev) => {
      const target = index + delta
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
  }

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: `sec-${prev.length + 1}-${Date.now().toString(36)}`, heading: '', hint: '' }
    ])
  }

  const loadPreset = (preset: SectionPresetId) => {
    setSections(
      SECTION_PRESETS[preset].map((section) => ({ ...section, hint: section.hint ?? '' }))
    )
  }

  const build = (): CustomTemplate => ({
    id: seed.id ?? crypto.randomUUID(),
    name: name.trim(),
    kind,
    sections: sections
      .filter((section) => section.heading.trim().length > 0)
      .map((section) => ({
        id: section.id.trim() || section.heading.trim().toLowerCase(),
        heading: section.heading.trim(),
        hint: section.hint?.trim() || undefined
      }))
  })

  const customMarkdown = (): string => {
    const clean = build().sections
    const blocks = clean.map((section) => {
      const suggestion = section.hint ? `> _Sugerencia: ${section.hint}_\n` : ''
      return `## ${section.heading}\n\n${suggestion}\n`
    })
    return `# ${name.trim()}\n\n${blocks.join('\n')}`
  }

  const handleSave = async (): Promise<void> => {
    if (!validName) return
    setSaving(true)
    try {
      await onSave(build())
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAndUse = async (): Promise<void> => {
    if (!validName) return
    setSaving(true)
    try {
      await onSaveAndUse(build(), customMarkdown())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder={t('templates.editor.name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="input"
          value={kind}
          onChange={(e) => setKind(e.target.value as CustomTemplate['kind'])}
          style={{ width: 160 }}
        >
          {KIND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`templates.editor.kind.${option}` as TranslationKey)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontSize: 12 }}>
          {t('templates.editor.loadSections')}
        </span>
        {PRESET_OPTIONS.map((preset) => (
          <button
            key={preset}
            className="btn ghost small"
            onClick={() => loadPreset(preset)}
            type="button"
          >
            {t(`templates.editor.preset.${preset}` as TranslationKey)}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sections.map((section, index) => (
          <div key={section.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="muted" style={{ fontSize: 12, width: 18, textAlign: 'right' }}>
              {index + 1}
            </span>
            <input
              className="input"
              style={{ width: 180 }}
              value={section.heading}
              placeholder={t('templates.editor.heading')}
              onChange={(e) => updateSection(index, { heading: e.target.value })}
            />
            <input
              className="input"
              style={{ flex: 1 }}
              value={section.hint ?? ''}
              placeholder={t('templates.editor.hint')}
              onChange={(e) => updateSection(index, { hint: e.target.value })}
            />
            <button
              className="btn ghost small"
              onClick={() => moveSection(index, -1)}
              disabled={index === 0}
              title={t('templates.editor.moveUp')}
              type="button"
            >
              ↑
            </button>
            <button
              className="btn ghost small"
              onClick={() => moveSection(index, 1)}
              disabled={index === sections.length - 1}
              title={t('templates.editor.moveDown')}
              type="button"
            >
              ↓
            </button>
            <button
              className="btn ghost small"
              onClick={() => removeSection(index)}
              title={t('templates.editor.remove')}
              type="button"
            >
              <Icon name="trash" size={12} />
            </button>
          </div>
        ))}
        <button className="btn ghost" onClick={addSection} type="button" style={{ width: 130 }}>
          + {t('templates.editor.addSection')}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn ghost" onClick={onCancel} disabled={saving}>
          {t('templates.editor.cancel')}
        </button>
        <button className="btn" onClick={() => void handleSave()} disabled={saving || !validName}>
          {t('templates.editor.save')}
        </button>
        <button
          className="btn primary"
          onClick={() => void handleSaveAndUse()}
          disabled={saving || !validName}
        >
          <Icon name="templates" size={14} /> {t('templates.editor.saveAndUse')}
        </button>
      </div>
    </div>
  )
}
