import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LocalSwordProvider } from './local-provider'

const SWORD_ROOT = resolve(process.cwd(), 'sword')
const hasMHCC = existsSync(resolve(SWORD_ROOT, 'mods.d', 'mhcc.conf'))
const hasTCR = existsSync(resolve(SWORD_ROOT, 'mods.d', 'tcr.conf'))
const hasSpaRVG = existsSync(resolve(SWORD_ROOT, 'mods.d', 'sparvg.conf'))

describe.skipIf(!hasSpaRVG)('Biblias en espanol (CrossWire)', () => {
  it('lee un capitulo de SpaRVG', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const chapter = await provider.getChapter('SpaRVG', 'Gen', 1)
    expect(chapter.length).toBeGreaterThan(0)
    const plain = chapter[0]?.text.replace(/<[^>]+>/g, '')
    expect(plain?.length ?? 0).toBeGreaterThan(10)
  })
})

describe.skipIf(!hasMHCC)('MHCC (Matthew Henry Concise)', () => {
  it('lee el comentario del capitulo Juan 3', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const chapter = await provider.getChapter('MHCC', 'John', 3)
    const plain = chapter.map((v) => v.text.replace(/<[^>]+>/g, '')).join(' ')
    expect(plain.length).toBeGreaterThan(100)
  })
})

describe.skipIf(!hasTCR)('TCR (Thompson Chain Topics)', () => {
  it('devuelve una entrada del diccionario', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const keys = await provider.getDictKeys('TCR')
    expect(keys.length).toBeGreaterThan(100)
    const entry = await provider.lookupDict('TCR', keys[0])
    expect((entry ?? '').replace(/<[^>]+>/g, '').length).toBeGreaterThan(10)
  })
})
