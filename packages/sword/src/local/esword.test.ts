import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { EswordProvider } from './esword'

const ESWORD_ROOT = resolve(process.cwd(), 'esword')
const hasModules = existsSync(resolve(ESWORD_ROOT, 'BHS5.bbli'))

describe.skipIf(!hasModules)('EswordProvider (modulos reales)', () => {
  it('detecta modulos e-Sword', async () => {
    const provider = EswordProvider.create(ESWORD_ROOT)
    expect(provider).not.toBeNull()
    const modules = await provider!.listLocalModules()
    expect(modules.length).toBeGreaterThan(0)
  })

  it('lee un versiculo de la Biblia hebrea (BHS5 Gen 1:1)', async () => {
    const provider = EswordProvider.create(ESWORD_ROOT)!
    const chapter = await provider.getChapter('BHS5', 'Gen', 1)
    expect(chapter.length).toBeGreaterThan(0)
  })

  it('lee un diccionario e-Sword (ETCBC)', async () => {
    const provider = EswordProvider.create(ESWORD_ROOT)!
    const keys = await provider.listLocalModules()
    expect(keys.some((m) => m.name === 'ETCBC')).toBe(true)
  })

  it('lee y busca un modulo Champlin convertido desde PDF', async () => {
    const provider = EswordProvider.create(ESWORD_ROOT)!
    const modules = await provider.listLocalModules()
    if (!modules.some((m) => m.name === 'ChamplinEnc3')) return
    const entry = await provider.lookupDict('ChamplinEnc3', 'p.0100')
    expect((entry ?? '').length).toBeGreaterThan(20)
    // Termino neutral de idioma: "de" existe tanto en portugues como en espanol.
    const found = await provider.search({
      query: 'de',
      modules: ['ChamplinEnc3'],
      limit: 5
    })
    expect(found.length).toBeGreaterThan(0)
  })
})
