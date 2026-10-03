import { describe, expect, it } from 'vitest'
import { CONSULTA_QUESTIONS, GuidedGenerator } from './generator'

describe('GuidedGenerator', () => {
  it('expone 4 preguntas calibradas', () => {
    expect(CONSULTA_QUESTIONS).toHaveLength(4)
    expect(CONSULTA_QUESTIONS.map((q) => q.id)).toEqual([
      'topic',
      'emphasis',
      'audience',
      'aim'
    ])
  })

  it('genera un bosquejo de predicacion', async () => {
    const generator = new GuidedGenerator()
    const result = await generator.generate({
      topic: 'La gracia que transforma (Tito 2:11)',
      emphasis: 'gracia, esperanza, identidad',
      audience: 'jovenes, 30 minutos',
      aim: 'Ensenar'
    })

    expect(result.title).toContain('gracia')
    expect(result.markdown).toContain('## Puntos principales')
    expect(result.markdown).toContain('## Aplicacion')
    expect(result.suggestedTopics.length).toBeGreaterThan(0)
  })
})
