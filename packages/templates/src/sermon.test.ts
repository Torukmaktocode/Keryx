import { describe, expect, it } from 'vitest'
import { customTemplateSchema } from '@keryx/core'
import {
  DEVOTIONAL_SECTIONS,
  SECTION_PRESETS,
  STUDY_SECTIONS,
  TEMPLATES,
  buildFromSections,
  type TemplateSection
} from './sermon'

describe('buildFromSections', () => {
  it('genera el esqueleto OIA con encabezados, sugerencias y titulo', () => {
    const markdown = buildFromSections(STUDY_SECTIONS, 'Romanos 8')
    const lines = markdown.split('\n')
    expect(lines[0]).toBe('# Romanos 8')
    expect(markdown).toContain('## Pasaje')
    expect(markdown).toContain('## Observacion')
    expect(markdown).toContain('## Interpretacion')
    expect(markdown).toContain('## Aplicacion')
    expect(markdown).toContain('## Preguntas')
    expect(markdown).toContain('> _Sugerencia: referencia biblica principal_')
    expect(markdown).toContain('> _Sugerencia: que dice el texto? Detalles, palabras clave, contexto_')
    expect(markdown).toContain('> _Sugerencia: como lo vivo esta semana?_')
  })

  it('respeta el orden de las secciones', () => {
    const sections: TemplateSection[] = [
      { id: 'a', heading: 'Primera', hint: 'una' },
      { id: 'b', heading: 'Segunda', hint: 'dos' }
    ]
    const swapped: TemplateSection[] = [sections[1], sections[0]]
    expect(buildFromSections(sections).indexOf('## Segunda')).toBeGreaterThan(
      buildFromSections(sections).indexOf('## Primera')
    )
    expect(buildFromSections(swapped).indexOf('## Segunda')).toBeLessThan(
      buildFromSections(swapped).indexOf('## Primera')
    )
  })

  it('omite secciones sin sugerencia y usa titulo por defecto', () => {
    const markdown = buildFromSections([{ id: 'x', heading: 'Notas' }])
    expect(markdown.startsWith('# Nuevo documento')).toBe(true)
    expect(markdown).toContain('## Notas')
    expect(markdown).not.toContain('Sugerencia')
  })
})

describe('SECTION_PRESETS', () => {
  it('ofrece el set por tipo: sermon, devocional, estudio OIA y en blanco', () => {
    const ids = Object.keys(SECTION_PRESETS)
    expect(ids).toEqual(['sermon', 'devotional', 'study', 'blank'])
    expect(SECTION_PRESETS.sermon).toHaveLength(10)
    expect(SECTION_PRESETS.study.map((s) => s.heading)).toEqual([
      'Pasaje',
      'Observacion',
      'Interpretacion',
      'Aplicacion',
      'Preguntas'
    ])
    expect(SECTION_PRESETS.devotional.map((s) => s.heading)).toEqual([
      'Versiculo',
      'Reflexion',
      'Oracion'
    ])
    expect(SECTION_PRESETS.devotional).toEqual(DEVOTIONAL_SECTIONS)
    expect(SECTION_PRESETS.blank).toEqual([])
  })

  it('las plantillas fijas exponen sus secciones para duplicar', () => {
    const study = TEMPLATES.find((tpl) => tpl.id === 'study')
    const devotional = TEMPLATES.find((tpl) => tpl.id === 'devotional')
    expect(study?.sections).toEqual(STUDY_SECTIONS)
    expect(devotional?.sections).toEqual(DEVOTIONAL_SECTIONS)
  })
})

describe('customTemplateSchema', () => {
  it('acepta una plantilla del usuario', () => {
    const parsed = customTemplateSchema.parse({
      id: 'abc',
      name: 'Mi estudio de oracion',
      kind: 'study',
      sections: [{ id: 'passage', heading: 'Pasaje', hint: 'referencia' }]
    })
    expect(parsed.kind).toBe('study')
    expect(parsed.sections).toHaveLength(1)
  })

  it('aplica defaults y rechaza datos invalidos', () => {
    const parsed = customTemplateSchema.parse({ id: 'abc', name: 'Libre' })
    expect(parsed.kind).toBe('free')
    expect(parsed.sections).toEqual([])
    expect(() => customTemplateSchema.parse({ id: '', name: 'x' })).toThrow()
    expect(() =>
      customTemplateSchema.parse({ id: 'a', name: 'x', kind: 'otro' })
    ).toThrow()
    expect(() =>
      customTemplateSchema.parse({
        id: 'a',
        name: 'x',
        sections: [{ id: 's', heading: '' }]
      })
    ).toThrow()
  })
})
