import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LocalSwordProvider } from './local-provider'

const SWORD_ROOT = resolve(process.cwd(), 'sword')
const hasModules = existsSync(resolve(SWORD_ROOT, 'mods.d', 'KJV.conf'))

describe.skipIf(!hasModules)('LocalSwordProvider (modulos reales)', () => {
  it('detecta modulos instalados', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)
    expect(provider).not.toBeNull()
    const modules = await provider!.listLocalModules()
    expect(modules.length).toBeGreaterThan(100)
    const bibles = modules.filter((m) => m.category === 'Bible')
    expect(bibles.length).toBeGreaterThan(40)
  })

  it('lee un versiculo en ingles (KJV Gen 1:1)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const chapter = await provider.getChapter('KJV', 'Gen', 1)
    expect(chapter.length).toBeGreaterThan(0)
    expect(chapter[0].text).toContain('In the beginning')
  })

  it('lee un versiculo en espanol (SpaRV1909 Juan 3:16)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const verse = await provider.getVerse('SpaRV1909', 'John', 3, 16)
    expect(verse?.text.toLowerCase()).toContain('de tal manera')
  })

  it('lee un diccionario Strong griego (G26)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const entry = await provider.lookupDict('StrongsGreek', 'G26')
    expect(entry?.toLowerCase()).toContain('love')
  })

  it('lee un comentario (Barnes Juan 3:16)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const verse = await provider.getVerse('Barnes', 'John', 3, 16)
    expect((verse?.text ?? '').length).toBeGreaterThan(20)
  })

  it('lee enciclopedias de dominio publico (ISBE, Easton, Smith)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const isbe = await provider.lookupDict('ISBE', 'Atonement')
    expect((isbe ?? '').length).toBeGreaterThan(20)
    const easton = await provider.lookupDict('Easton', 'Atonement')
    expect((easton ?? '').length).toBeGreaterThan(10)
    const smith = await provider.lookupDict('Smith', 'Atonement')
    expect((smith ?? '').length).toBeGreaterThan(10)
  })

  it('busca en las biblias', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const results = await provider.search({ query: 'shepherd', modules: ['KJV'], limit: 20 })
    expect(results.length).toBeGreaterThan(0)
  })
})
