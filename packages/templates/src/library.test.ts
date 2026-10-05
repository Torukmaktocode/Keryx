import { describe, expect, it } from 'vitest'
import {
  EMPTY_HERMENEUTIC_ANSWERS,
  HERMENEUTIC_STEPS,
  LIBRARY,
  RESOURCE_CATEGORIES,
  SERMON_FRAMEWORK,
  buildBibliography,
  buildDeliveryGuide,
  buildHermeneuticGuide,
  buildStudyFromChecklist
} from './library'

describe('Biblioteca del predicador', () => {
  it('tiene data completa por categoria', () => {
    expect(LIBRARY.length).toBeGreaterThanOrEqual(20)
    for (const category of RESOURCE_CATEGORIES) {
      expect(LIBRARY.some((book) => book.category === category)).toBe(true)
    }
    for (const book of LIBRARY) {
      expect(book.id).toBeTruthy()
      expect(book.title).toBeTruthy()
      expect(book.author).toBeTruthy()
      expect(book.summary.length).toBeGreaterThan(20)
    }
  })

  it('define el marco del sermon en 4 pasos', () => {
    expect(SERMOM_FRAMEWORK_LENGTH()).toBe(4)
    expect(SERMON_FRAMEWORK.map((s) => s.id)).toEqual(['hook', 'concept', 'example', 'challenge'])
  })

  it('define la checklist hermeneutica', () => {
    expect(HERMENEUTIC_STEPS.map((s) => s.id)).toEqual([
      'genre',
      'context',
      'originals',
      'figures',
      'bridge'
    ])
  })
})

function SERMOM_FRAMEWORK_LENGTH(): number {
  return SERMON_FRAMEWORK.length
}

describe('Builders de Markdown', () => {
  it('buildBibliography group por categoria con titulos y autores', () => {
    const md = buildBibliography()
    expect(md).toContain('# Biblioteca del predicador')
    expect(md).toContain('## hermeneutics')
    expect(md).toContain('Gordon D. Fee y Douglas Stuart')
  })

  it('buildStudyFromChecklist arma el documento completo', () => {
    const md = buildStudyFromChecklist({
      ...EMPTY_HERMENEUTIC_ANSWERS,
      reference: 'Filipenses 2:1-11',
      genre: 'Epístola con himno cristológico',
      bigIdea: 'Cristo vació su gloria: la humildad es el camino de la iglesia.'
    })
    expect(md).toContain('# Estudio hermenéutico: Filipenses 2:1-11')
    expect(md).toContain('## Gran idea')
    expect(md).toContain('Cristo vació su gloria')
  })

  it('buildHermeneuticGuide incluye todos los pasos', () => {
    const md = buildHermeneuticGuide()
    for (const step of HERMENEUTIC_STEPS) {
      expect(md).toContain(step.heading)
    }
    expect(md).toContain('Gran idea')
  })

  it('buildDeliveryGuide lista las tecnicas de oratoria', () => {
    const md = buildDeliveryGuide()
    expect(md).toContain('Respiración diafragmática')
    expect(md).toContain('Contacto visual por zonas')
  })
})
