import { describe, expect, it } from 'vitest'
import { buildIntent, intentBlock } from './intent'

describe('sub-agente de intención (0 tokens)', () => {
  it('interpreta cada palabra clave de la frase y su enfoque pastoral', () => {
    const intent = buildIntent('quiero un sermón para animar a los que viven con miedo y cansancio', 'crearsermon')
    expect(intent.palabras.map((p) => p.word)).toEqual(expect.arrayContaining(['miedo', 'cansancio']))
    expect(intent.tema).not.toBe('')
    expect(intent.frase).toContain('sermón')
    expect(intent.frase).toContain('para ')
  })

  it('limpia el ruido de cortesía para ubicar el pasaje', () => {
    const intent = buildIntent('crea un sermón sobre talita cumi la niña', 'crearsermon')
    expect(intent.searchTerms).not.toContain('sermon')
    expect(intent.searchTerms.join(' ')).toContain('talita')
  })

  it('sin tema reconocido, la frase va tal cual', () => {
    const intent = buildIntent('Juan 3:16', 'crearsermon')
    expect(intent.tema).toBe('')
    expect(intent.frase).toBe('')
  })

  it('el bloque de conexión es amable y no deja marcadores', () => {
    const intent = buildIntent('necesito consolar a una familia en duelo', 'crearsermon')
    const block = intentBlock(intent).join('\n')
    expect(block).toContain('Tu petición')
    expect(block).toContain('duelo')
    expect(block).not.toContain('[[')
  })
})
