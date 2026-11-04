import { describe, expect, it } from 'vitest'
import { citasUnicas, esStrongClave, mdSinFuentes, refDeEntrada } from './citations'

describe('citasAncladas (helpers)', () => {
  it('esStrongClave detecta claves Strong y rechaza temas y refs', () => {
    expect(esStrongClave('H2088')).toBe(true)
    expect(esStrongClave('G26')).toBe(true)
    expect(esStrongClave('H 08059')).toBe(true)
    expect(esStrongClave('PERDON')).toBe(false)
    expect(esStrongClave('Deut 15:2')).toBe(false)
    expect(esStrongClave('')).toBe(false)
  })

  it('citasUnicas deduplica por modulo+entrada preservando orden', () => {
    const citas = [
      { module: 'MacArthur', entry: 'Deut 15:2', kind: 'comentario' },
      { module: 'H2088', entry: 'H2088', kind: 'strongs' },
      { module: 'MacArthur', entry: 'Deut 15:2', kind: 'comentario' },
      { module: 'H1697', entry: 'H1697', kind: 'strongs' }
    ]
    const result = citasUnicas(citas)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual(citas[0])
    expect(result[2]).toEqual(citas[3])
  })

  it('citasUnicas mantiene la misma entrada en modulos distintos', () => {
    const citas = [
      { module: 'A', entry: 'PERDON', kind: 'tema' },
      { module: 'B', entry: 'PERDON', kind: 'tema' }
    ]
    expect(citasUnicas(citas)).toHaveLength(2)
  })

  it('refDeEntrada resuelve comentarios y rechaza temas y Strong', () => {
    const ref = refDeEntrada('Deut 15:2')
    expect(ref?.book).toBe('Deut')
    expect(ref?.chapter).toBe(15)
    expect(ref?.verse).toBe(2)
    expect(refDeEntrada('PERDON')).toBeNull()
    expect(refDeEntrada('H2088')).toBeNull()
  })

  it('mdSinFuentes separa el cuerpo y detecta la seccion', () => {
    const md = '# Sermón\n\n## Aplicación\n\n- cita\n\n## Fuentes ancladas\n\n- [MacArthur · Deut 15:2]\n'
    const { body, hayFuentes } = mdSinFuentes(md)
    expect(hayFuentes).toBe(true)
    expect(body).toContain('## Aplicación')
    expect(body).not.toContain('Fuentes ancladas')
    expect(body.endsWith('\n')).toBe(true)
  })

  it('mdSinFuentes conserva el markdown completo sin la seccion', () => {
    const md = '# Sermón sin fuentes\n\n## Aplicación\n\n- cita\n'
    const { body, hayFuentes } = mdSinFuentes(md)
    expect(hayFuentes).toBe(false)
    expect(body).toBe(md)
  })
})
