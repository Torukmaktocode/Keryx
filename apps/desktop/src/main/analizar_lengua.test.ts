import { describe, expect, it } from 'vitest'
import {
  analizarCorpus,
  inferirAlfabeto,
  inferirFuncionarios,
  analizarMuestra,
  tokenize
} from './analizar_lengua'

const nat = [
  'ha tumpa he\u2019i: toiko pe\u2019a ha oiko pe\u2019a',
  'tumpa oayhu arapy ha\u2019e ombo\u2019e ita\u2019ýra',
  'pe ñandeya che pastor ha che nokirirĩ',
  'mborogüɨrovia oúkua ha\u2019e ñe\u2019ẽ tumpa',
  'pe marandu oũ teko porã ha iko peva',
  'ha oguata pe marandu kóva peva ha iko'
]

describe('analizador de lengua nueva (estándar de adopción, 0 tokens)', () => {
  it('infiere el alfabeto del contexto: letras, diacríticos y glotal', () => {
    const alfabeto = inferirAlfabeto(nat)
    expect(alfabeto).toContain('ã')
    expect(alfabeto).toContain('ɨ')
    expect(alfabeto).toContain('ñ')
    expect(alfabeto).not.toContain('x')
    expect(alfabeto.length).toBeGreaterThan(10)
  })

  it('detecta funcionarios por frecuencia (ha/pe) y no inventa sin datos', () => {
    const funcs = inferirFuncionarios(nat)
    expect(funcs).toContain('ha')
    expect(funcs).toContain('pe')
    expect(inferirFuncionarios([])).toEqual([])
  })

  it('la muestra completa lleva alfabeto, funcionarios y estadística', () => {
    const muestra = analizarMuestra(nat)
    expect(muestra.tokensUnicos).toBeGreaterThan(15)
    expect(muestra.mediaPalabrasVerso).toBeGreaterThan(3)
  })

  it('analizarCorpus arma el perfil completo con meta y cobertura', () => {
    const analisis = analizarCorpus(
      'nah',
      nat,
      { nombre: 'Náhuatl classical', fuente: 'Wycliffe México' },
      { versos: 7921, libros: 27, capitulos: 260 }
    )
    expect(analisis.nombre).toBe('Náhuatl classical')
    expect(analisis.familia).toBe('Wycliffe México')
    expect(analisis.versos).toBe(7921)
    expect(analisis.libros).toBe(27)
    expect(analisis.alfabeto.length).toBeGreaterThan(10)
  })

  it('sin meta: nombre y familia honestos por defecto', () => {
    const analisis = analizarCorpus('xyz', nat)
    expect(analisis.nombre).toBe('Lengua xyz')
    expect(analisis.familia).toBe('lengua indígena')
  })

  it('tokenize mantiene glotal y diacríticos, descarta números', () => {
    expect(tokenize("he'i ñe'ẽ mborogüɨrovia 3x")).toEqual(["he'i", "ñe'ẽ", 'mborogüɨrovia'])
  })
})
