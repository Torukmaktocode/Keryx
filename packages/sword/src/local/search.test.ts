import { describe, expect, it } from 'vitest'
import {
  buildSnippet,
  countMatches,
  highlightText,
  inBookScope,
  matchesQuery,
  normalizeText,
  tokenizeQuery
} from './search'

describe('normalizeText / tokenizeQuery', () => {
  it('quita acentos y pasa a minúsculas', () => {
    expect(normalizeText('Jesús')).toBe('jesus')
    expect(normalizeText('ÁNGELES')).toBe('angeles')
  })
  it('trocea la consulta en palabras', () => {
    expect(tokenizeQuery('palabra de Dios')).toEqual(['palabra', 'de', 'dios'])
  })
})

describe('matchesQuery', () => {
  it('multi-palabra AND en cualquier orden, sin acentos', () => {
    const hay = 'Porque de tal manera amó Dios al mundo'
    expect(
      matchesQuery(hay, tokenizeQuery('manera mundo'), { caseSensitive: false, wholeWord: false })
    ).toBe(true)
    expect(
      matchesQuery(hay, tokenizeQuery('Dios manera'), { caseSensitive: false, wholeWord: false })
    ).toBe(true)
    expect(
      matchesQuery(hay, tokenizeQuery('jesus mundo'), { caseSensitive: false, wholeWord: false })
    ).toBe(false)
  })
  it('tolera acentos: "jesus" encuentra "Jesús"', () => {
    expect(
      matchesQuery('Jesús wept', tokenizeQuery('jesus'), { caseSensitive: false, wholeWord: false })
    ).toBe(true)
  })
  it('caseSensitive respeta mayúsculas (token crudo, sin tokenizer)', () => {
    expect(matchesQuery('Dios', ['Dios'], { caseSensitive: true, wholeWord: false })).toBe(true)
    expect(matchesQuery('Dios', ['Jehova'], { caseSensitive: true, wholeWord: false })).toBe(false)
  })
  it('wholeWord no empata subcadenas', () => {
    expect(matchesQuery('ando', tokenizeQuery('anda'), { caseSensitive: false, wholeWord: true })).toBe(false)
    expect(matchesQuery('ando', tokenizeQuery('ando'), { caseSensitive: false, wholeWord: true })).toBe(true)
  })
  it('wholeWord: "amor" no empata "JAMOR" ni "Amorrheo" (regresion)', () => {
    expect(
      matchesQuery('Y el jamor era de carga', tokenizeQuery('amor'), { caseSensitive: false, wholeWord: true })
    ).toBe(false)
    expect(
      matchesQuery('Y al Jebuseo, y al Amorrheo', tokenizeQuery('amor'), { caseSensitive: false, wholeWord: true })
    ).toBe(false)
    expect(
      matchesQuery('Dios es amor', tokenizeQuery('amor'), { caseSensitive: false, wholeWord: true })
    ).toBe(true)
    expect(
      matchesQuery('Dios es amor', tokenizeQuery('amor'), { caseSensitive: false, wholeWord: false })
    ).toBe(true)
  })
  it('wholeWord con acentos: "amor" encuentra "amór"', () => {
    expect(
      matchesQuery('el amór de Cristo', tokenizeQuery('amor'), { caseSensitive: false, wholeWord: true })
    ).toBe(true)
  })
  it('tokens ideograficos (CJK) se buscan por subcadena aunque wholeWord este activo', () => {
    expect(matchesQuery('神爱世人', tokenizeQuery('爱'), { caseSensitive: false, wholeWord: true })).toBe(true)
  })
})

describe('snippet y resaltado', () => {
  it('resalta la palabra buscada', () => {
    const { highlighted } = buildSnippet('Dios amó al mundo', ['mundo'])
    expect(highlighted).toContain('<mark>')
  })
  it('cuenta coincidencias sin acento', () => {
    expect(countMatches('Jesús, Jesus, Jesús', ['jesus'])).toBe(3)
  })
  it('highlightText escapa HTML previo', () => {
    const html = highlightText('<b>mundo</b>', ['mundo'])
    const amp = String.fromCharCode(38)
    expect(html).toContain(amp + 'lt;b' + amp + 'gt;')
    expect(html).toContain('<mark>')
  })
})

describe('inBookScope', () => {
  it('separa AT y NT', () => {
    expect(inBookScope('Gen', 'ot')).toBe(true)
    expect(inBookScope('Gen', 'nt')).toBe(false)
    expect(inBookScope('John', 'nt')).toBe(true)
    expect(inBookScope('Rev', 'all')).toBe(true)
  })
})
