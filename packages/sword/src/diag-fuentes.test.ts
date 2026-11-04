import { describe, it } from 'vitest'
import { join } from 'node:path'
import { SwordService } from './service'

const LIB = join(process.cwd(), 'biblioteca')
const SWORD_ROOT = join(process.cwd(), 'sword')

describe('diagnostico fuentes ancladas', () => {
  it('getChapter/getVerse por servicio', async () => {
    const service = await SwordService.create(SWORD_ROOT, undefined, LIB)
    console.log('providerKind:', service.providerKind)
    const mods = await service.listLocalModules()
    const nombres = mods.map((m) => m.name)
    for (const needle of ['MacArthur', 'Spurgeon', 'Keil', 'Wiersbe', 'Keil-Delitzsch']) {
      console.log(needle, '->', nombres.filter((n) => n.toLowerCase().includes(needle.toLowerCase())))
    }
    for (const [mod, cap] of [
      ['Charles Spurgeon - Comentario y Exposiciones (EN)', 49],
      ['Comentario al AT - Keil-Delitzsch', 49],
      ['Biblia de Estudio MacArthur (Comentario)', 49]
    ] as const) {
      if (!nombres.some((n) => n.startsWith(mod))) {
        console.log('名 no existe:', mod)
        continue
      }
      const rows = await service.getChapter(mod, 'Gen', cap).catch((e) => ['ERR:' + String(e).slice(0, 120)])
      console.log(mod.slice(0, 28), '| filas:', Array.isArray(rows) ? rows.length : 'ERR', '| v18:', (rows as Array<{ verse: number; text?: string }>).find?.((r) => r.verse === 18 ? r.text?.slice(0, 60) : undefined))
      const verse = await service.getVerse(mod, 'Gen', cap, 18).catch(() => null)
      console.log('   getVerse 18:', verse ? verse.text?.slice(0, 60) : 'null')
    }
  })
}, 120_000)
