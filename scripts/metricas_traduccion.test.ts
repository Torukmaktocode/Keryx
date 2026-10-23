import { describe, expect, it } from 'vitest'
import { bleu4, chrFpp } from './metricas_traduccion'

describe('chrFpp', () => {
  it('da 100 para textos identicos', () => {
    expect(chrFpp('Tupã ojapo yvága ha yvy.', 'Tupã ojapo yvága ha yvy.')).toBe(100)
  })

  it('da 0 con sin solapamiento', () => {
    expect(chrFpp('zzz qqq', 'abc def')).toBeLessThan(5)
  })

  it('premia solapamiento parcial en orden', () => {
    const alta = chrFpp('En el principio creó Dios', 'En el principio creó Dios')
    const media = chrFpp('En el principio Dios creó', 'En el principio creó Dios')
    const baja = chrFpp('Dios creó al hombre', 'En el principio creó Dios')
    expect(alta).toBe(100)
    expect(media).toBeGreaterThan(baja)
    expect(media).toBeLessThan(100)
  })

  it('es sensible al orden de caracteres', () => {
    expect(chrFpp('casa', 'saca')).toBeLessThan(chrFpp('casa', 'casas'))
  })
})

describe('bleu4', () => {
  it('da 100 para textos identicos', () => {
    expect(bleu4('Tupã ojapo yvága ha yvy', 'Tupã ojapo yvága ha yvy')).toBe(100)
  })

  it('penaliza hipotesis mas corta (brevity penalty)', () => {
    const corta = bleu4('Dio Dio', 'Dio se acercaba a Jerusalén y llegó')
    expect(corta).toBeLessThan(50)
  })

  it('suaviza 4-gramas ausentes sin caer a cero', () => {
    const valor = bleu4('un uno', 'uno un dos tres cuatro cinco')
    expect(valor).toBeGreaterThan(0)
  })
})
