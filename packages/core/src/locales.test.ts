import { describe, expect, it } from 'vitest'
import { detectAppLocale } from './locales'

describe('detectAppLocale (primer arranque por idioma del sistema)', () => {
  it('mapea códigos regionales a los 7 idiomas soportados', () => {
    expect(detectAppLocale('pt-BR')).toBe('pt')
    expect(detectAppLocale('pt-PT')).toBe('pt')
    expect(detectAppLocale('en-US')).toBe('en')
    expect(detectAppLocale('en-GB')).toBe('en')
    expect(detectAppLocale('zh-CN')).toBe('zh')
    expect(detectAppLocale('zh-TW')).toBe('zh')
    expect(detectAppLocale('es-MX')).toBe('es')
    expect(detectAppLocale('it-IT')).toBe('it')
    expect(detectAppLocale('fr-FR')).toBe('fr')
    expect(detectAppLocale('de-DE')).toBe('de')
  })

  it('acepta códigos simples y underscores', () => {
    expect(detectAppLocale('pt')).toBe('pt')
    expect(detectAppLocale('zh')).toBe('zh')
    expect(detectAppLocale('en_US')).toBe('en')
  })

  it('idiomas no soportados caen a español', () => {
    expect(detectAppLocale('ru-RU')).toBe('es')
    expect(detectAppLocale('ja')).toBe('es')
    expect(detectAppLocale('')).toBe('es')
    expect(detectAppLocale(undefined)).toBe('es')
    expect(detectAppLocale(null)).toBe('es')
  })
})
