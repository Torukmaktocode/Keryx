import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LocalSwordProvider } from './local-provider'
import { normalizeText } from './search'

const SWORD_ROOT = resolve(process.cwd(), 'sword')
const hasModules = existsSync(resolve(SWORD_ROOT, 'mods.d', 'SpaRV1909.conf'))

describe.skipIf(!hasModules)('busqueda por palabras (regresion "amor" -> "jamor")', () => {
  it('no empata subcadenas dentro de otras palabras (Amorrheo)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const results = await provider.search({ query: 'amor', modules: ['SpaRV1909'], limit: 200 })
    expect(results.length).toBeGreaterThan(0)
    for (const hit of results) {
      const hay = normalizeText(hit.text)
      const boundary = /(^|[^\p{L}\p{N}])amor([^\p{L}\p{N}]|$)/u
      expect(hay, `${hit.book} ${hit.chapter}:${hit.verse}`).toMatch(boundary)
    }
    const gen1016 = results.find((r) => r.book === 'Gen' && r.chapter === 10 && r.verse === 16)
    expect(gen1016).toBeUndefined()
  }, 180000)

  it('encuentra el amor como palabra propia (1John 4:8)', async () => {
    const provider = LocalSwordProvider.create(SWORD_ROOT)!
    const results = await provider.search({ query: 'amor', modules: ['SpaRV1909'], limit: 200 })
    expect(results.some((r) => r.book === '1John' && r.chapter === 4 && r.verse === 8)).toBe(true)
  }, 180000)
})
