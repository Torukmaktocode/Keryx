import { describe, expect, it } from 'vitest'
import { parseReference, resolveBook, toOsisRef } from './reference'

describe('reference', () => {
  it('resuelve nombres en espanol', () => {
    expect(resolveBook('Juan')?.code).toBe('John')
    expect(resolveBook('Salmos')?.code).toBe('Ps')
  })

  it('resuelve codigos OSIS', () => {
    expect(resolveBook('Gen')?.ordinal).toBe(1)
  })

  it('parsea una referencia completa', () => {
    const ref = parseReference('Juan 3:16')
    expect(ref?.book.code).toBe('John')
    expect(ref?.chapter).toBe(3)
    expect(ref?.verse).toBe(16)
  })

  it('construye una referencia OSIS', () => {
    expect(toOsisRef('Juan', 3, 16)).toBe('John.3.16')
    expect(toOsisRef('Gen', 1)).toBe('Gen.1')
  })
})
