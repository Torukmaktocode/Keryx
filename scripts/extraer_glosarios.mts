/**
 * CLI: extrae el glosario estadistico de cada corpus verificado local.
 * Alinea verso por verso (espanol de la biblioteca e-Sword ↔ corpus nativo
 * por referencia canonica) y escribe glosario_<db>.json en userData.
 * Uso: npx tsx scripts/glosario_estadistico.mts [--db arn]
 */
import { DatabaseSync } from 'node:sqlite'
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { EswordProvider } from '../packages/sword/src/local/esword'
import { extraerGlosario, SEMILLAS, type VersoAlineado } from './glosario_estadistico'

const RAIZ = join(process.env.APPDATA ?? '', '@keryx', 'desktop', 'traduccion')

/** Auto-descubrimiento: TODOS los corpus en corpus/*.db (registrados y nuevos). */
function descubrirDbs(): string[] {
  const dir = join(RAIZ, 'corpus')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.db'))
    .map((f) => f.slice(0, -3))
}

async function main(): Promise<void> {
  const argDb = process.argv.find((a) => a.startsWith('--db='))?.slice(5)
  const dbs = argDb ? [argDb] : descubrirDbs()
  const p = EswordProvider.create('esword', ['biblioteca'])
  if (!p) {
    console.error('sin biblioteca e-Sword; no hay lado espanol para alinear')
    return
  }
  const mods = await p.listLocalModules()
  const biblia =
    mods.find((m) => m.category === 'Bible' && /reina|valera/i.test(m.name)) ??
    mods.find((m) => m.category === 'Bible')
  if (!biblia) {
    console.error('sin Biblia espanola en biblioteca')
    p.dispose()
    return
  }
  console.log(`lado espanol: ${biblia.name}`)
  mkdirSync(RAIZ, { recursive: true })

  for (const db of dbs) {
    const ruta = join(RAIZ, 'corpus', `${db}.db`)
    if (!existsSync(ruta)) {
      console.log(`[omitido] corpus ${db}.db no existe`)
      continue
    }
    const started = Date.now()
    const con = new DatabaseSync(ruta, { readOnly: true })
    const capitulos = con
      .prepare('SELECT DISTINCT code, chapter FROM versos ORDER BY code, chapter')
      .all() as Array<{ code: string; chapter: number }>
    const stmtNat = con.prepare(
      'SELECT text FROM versos WHERE code=? AND chapter=? ORDER BY verse'
    )
    const pares: VersoAlineado[] = []
    for (const { code, chapter } of capitulos) {
      const nat = (stmtNat.all(code, chapter) as Array<{ text: string }>).map((f) => f.text)
      const es = await p.getChapter(biblia.name, code, chapter)
      if (!es) continue
      for (let i = 0; i < Math.min(nat.length, es.length); i += 1) {
        const esTexto = typeof es[i] === 'string' ? (es[i] as string) : ((es[i] as { text?: string }).text ?? '')
        if (!esTexto || !nat[i]) continue
        pares.push({ es: esTexto, nat: nat[i] })
      }
    }
    con.close()
    const glosario = extraerGlosario(pares, SEMILLAS)
    const salida = join(RAIZ, `glosario_${db}.json`)
    writeFileSync(salida, JSON.stringify({ db, versos: pares.length, pares: glosario }, null, 1))
    console.log(
      `[ok] ${db}: ${pares.length} versos alineados → ${glosario.length} pares · ${Date.now() - started}ms`
    )
  }
  p.dispose()
}

void main()
