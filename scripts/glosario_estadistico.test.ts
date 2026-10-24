import { describe, expect, it } from 'vitest'
import { extraerGlosario, SEMILLAS, tokenize } from './glosario_estadistico'

const mini: Array<{ es: string; nat: string }> = [
  { es: 'En el principio creó Dios el cielo y la tierra.', nat: 'teprincipio ornopã tumpa arayba ha yvy' },
  { es: 'El Señor es mi pastor; nada me faltará.', nat: 'pe ñandeya che pastor ha che nokirirĩ' },
  { es: 'Y Dios dijo: Sea la luz; y hubo luz.', nat: "ha tumpa he'i: toiko pe'a ha oiko pe'a" },
  { es: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito.', nat: "tumpa oayhu arapy ha'e ombo'e ita'ýra" },
  { es: 'El corazón del hombre es engañoso.', nat: "pe iɨa pe kuimba'e iñe'ẽvoi" },
  { es: 'Dios es amor.', nat: 'tumpa oayhu' },
  { es: 'La fe es por el oír, y el oír, por la palabra de Dios.', nat: "mborogüɨrovia oúkua ha'e ñe'ẽ tumpa" },
  { es: 'Jesús dijo: Yo soy la luz del mundo.', nat: "Jesu he'i: che pe'a arapy" },
  { es: 'Creó Dios al hombre a su imagen.', nat: 'tumpa moheoi kuimba*e' },
  { es: 'El Señor dijo a mi Señor.', nat: "pe ñandeya he'i che ñandeya" },
  { es: 'Abrahán llamó el nombre del lugar.', nat: "ha Abrahan heraku'i pe tenda rera" },
  { es: 'Y bendijo a los que bendicen.', nat: "ha ojopoi pe ojopoi va'ekuera" },
  { es: 'El pueblo escuchó con alegría.', nat: 'pe marandu oũ teko porã ha iko' },
  { es: 'Trabajo fue de sus manos.', nat: 'pe tembipurũ hekope ha opa' },
  { es: 'Los días se contaron.', nat: "pe ára omba'apo ha kóva" },
  { es: 'El nombre del lugar fue llamado Betel.', nat: "ha pe tenda rera he'i Betel peva" },
  { es: 'Y caminó el pueblo un día.', nat: 'ha oguata pe marandu kóva peva' },
  { es: 'El rey respondió con paz.', nat: 'pe mburuvicha moheoi peva ha iko' }
]

describe('motor de glosario estadistico (0 tokens)', () => {
  it('aligna y devuelve pares con peso para semillas presentes', () => {
    const pares = extraerGlosario(mini, ['Dios', 'amor', 'luz'])
    expect(pares.length).toBeGreaterThan(0)
    const dios = pares.filter((p) => p.es === 'Dios')
    expect(dios[0].peso).toBeGreaterThan(1)
    expect(dios.slice(0, 2).map((p) => p.nat)).toEqual(expect.arrayContaining(['tumpa']))
  })

  it('los funcionarios de alta frecuencia no se cuelan como traduccion', () => {
    const pares = extraerGlosario(mini, ['Dios'])
    expect(pares.every((p) => p.nat !== 'ha')).toBeTruthy()
  })

  it('semillas sin versos suficientes no inventan nada (principio de silencio)', () => {
    const pares = extraerGlosario(mini, ['teologia', 'escatologia'])
    expect(pares).toEqual([])
  })

  it('glosario vacio con corpus vacio', () => {
    expect(extraerGlosario([], SEMILLAS)).toEqual([])
  })

  it('todas las semillas son terminos biblicos nucleo', () => {
    expect(SEMILLAS).toContain('Dios')
    expect(SEMILLAS).toContain('Jesús')
    expect(SEMILLAS.length).toBeGreaterThanOrEqual(30)
  })

  it('tokenize separa palabras nativas con apostrofo y diacriticos', () => {
    expect(tokenize("he'i ñe'ẽ mborogüɨrovia")).toEqual(["he'i", "ñe'ẽ", 'mborogüɨrovia'])
  })
})
