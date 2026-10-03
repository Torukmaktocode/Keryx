import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(HERE, '..')
const OUT_DIR = process.env.KERYX_SWORD_PATH
  ? resolve(process.env.KERYX_SWORD_PATH)
  : join(REPO_ROOT, 'sword')
const CACHE_DIR = join(OUT_DIR, '.cache')
const BASE = 'https://www.crosswire.org/ftpmirror/pub/sword/packages/rawzip/'

const STARTER_BIBLES = [
  'KJV', 'ASV', 'BSB', 'YLT', 'Darby', 'Geneva1599', 'Wycliffe', 'Webster',
  'TR', 'Byz', 'SBLGNT', 'WHNU', 'Nestle1904', 'Tisch', 'LXX', 'MorphGNT',
  'WLC', 'Aleppo', 'OSHB', 'HebModern', 'HebDelitzsch',
  'Vulgate', 'VulgClementine', 'VulgSistine', 'VulgHetzenauer', 'VulgConte',
  'SpaRV1909', 'SpaRV1865', 'SpaRV', 'SpaPlatense', 'SpaTDP', 'SpaVNT', 'SpaScioNT', 'SpaRVG',
  'PorAlmeida1911', 'PorBLivre', 'PorBLivreTR', 'PorCap', 'PorNVA',
  'GerElb1871', 'GerSch', 'GerBoLut', 'GerHfa2002',
  'FreJND', 'FreSegond1910', 'FreCrampon', 'FreBDM1744', 'FreGeneve1669',
  'ItaDio', 'ItaRive', 'RomCor', 'PolGdanska', 'RusSynodal', 'UkrOgienko',
  'DutSVV', 'Swe1917', 'NorBroed', 'HunKar', 'CzeBKR', 'AraSVD', 'ChiUn',
  'JapKougo', 'KorRV', 'Viet', 'Tagalog', 'Esperanto'
]

const CATEGORY_FILES = ['Dictionaries', 'Commentaries', 'Books', 'Devotionals', 'Glossaries']

function readList(name) {
  const file = join(HERE, 'lists', `${name}.txt`)
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf-8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

async function download(name) {
  const confPath = join(OUT_DIR, 'mods.d', `${name}.conf`)
  if (existsSync(confPath)) return 'skip'
  const zipPath = join(CACHE_DIR, `${name}.zip`)
  if (!existsSync(zipPath)) {
    const url = `${BASE}${name}.zip`
    try {
      const res = await fetch(url)
      if (!res.ok) return `http-${res.status}`
      const buffer = Buffer.from(await res.arrayBuffer())
      writeFileSync(zipPath, buffer)
    } catch (error) {
      return `err:${error.message}`
    }
  }
  const extract = spawnSync('tar', ['-xf', zipPath, '-C', OUT_DIR], { stdio: 'pipe' })
  if (extract.status !== 0) return `unzip-${extract.status}`
  return 'ok'
}

async function main() {
  const all = process.argv.includes('--all')
  const allBibles = process.argv.includes('--all-bibles')
  mkdirSync(OUT_DIR, { recursive: true })
  mkdirSync(CACHE_DIR, { recursive: true })

  const bibles = allBibles || all ? readList('Bibles') : STARTER_BIBLES
  const others = all ? CATEGORY_FILES.flatMap((name) => readList(name)) : CATEGORY_FILES.flatMap(readList)
  const names = [...new Set([...bibles, ...others])]

  console.log(`Descargando ${names.length} modulos SWORD a ${OUT_DIR}`)
  let ok = 0
  let skip = 0
  const failed = []
  for (const name of names) {
    const result = await download(name)
    if (result === 'ok') ok += 1
    else if (result === 'skip') skip += 1
    else failed.push(`${name} (${result})`)
    process.stdout.write(`\r${ok + skip}/${names.length}  ${name}        `)
  }
  console.log(`\nListo. nuevos=${ok} existentes=${skip} fallidos=${failed.length}`)
  if (failed.length) console.log('Fallidos:\n' + failed.join('\n'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
