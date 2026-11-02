import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, normalize } from 'node:path'
import type { ModuleCategory } from '@keryx/core'

export interface ModuleConf {
  name: string
  dataFull: string
  moduleDir: string
  prefix: string
  driver: string
  sourceType: string
  encoding: string
  compressType: string
  blockType: string
  lang: string
  description: string
  cipherKey: string | null
  category: ModuleCategory
  versification: string
  hasStrongs: boolean
}

export function parseConf(text: string): Record<string, string> {
  const map: Record<string, string> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || line.startsWith('[')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    if (key in map) continue
    map[key] = line.slice(eq + 1).trim()
  }
  return map
}

function categoryFor(conf: Record<string, string>): ModuleCategory {
  const path = (conf.DataPath ?? '').toLowerCase()
  const feature = conf.Feature ?? ''
  if (path.includes('/texts/')) return 'Bible'
  if (path.includes('/comments/')) return 'Commentary'
  if (path.includes('/genbook/')) return 'GenBook'
  if (path.includes('/lexdict/')) {
    if (/GreekDef|HebrewDef|Greek|Hebrew/i.test(feature)) return 'Lexicon'
    return 'Dictionary'
  }
  if (path.includes('/devotional/')) return 'Devotional'
  return 'Unknown'
}

const TEXT_DRIVERS = new Set(['zText', 'RawText', 'RawText4', 'zCom', 'zCom4', 'RawCom', 'RawCom4'])
const LD_DRIVERS = new Set(['zLD', 'RawLD', 'RawLD4'])

export function resolveModuleDir(root: string, dataPath: string): { dataFull: string; moduleDir: string; prefix: string } {
  const clean = dataPath.replace(/^\.\//, '').replace(/[\\/]+$/, '')
  const dataFull = normalize(join(root, clean))
  const moduleDir = dirname(dataFull)
  const prefix = basename(dataFull)
  return { dataFull, moduleDir, prefix }
}

export function loadConfFile(filePath: string, root: string): ModuleConf | null {
  const text = readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '')
  const conf = parseConf(text)
  if (!conf.DataPath || !conf.ModDrv) return null
  const { dataFull, moduleDir, prefix } = resolveModuleDir(root, conf.DataPath)
  const driver = conf.ModDrv
  const sectionName = /\[([^\]]+)\]/.exec(text)?.[1]?.trim()
  return {
    name: sectionName || basename(filePath).replace(/\.conf$/i, ''),
    dataFull,
    moduleDir: TEXT_DRIVERS.has(driver) ? dataFull : moduleDir,
    prefix: TEXT_DRIVERS.has(driver) ? prefix : prefix,
    driver,
    sourceType: conf.SourceType ?? 'OSIS',
    encoding: conf.Encoding ?? 'UTF-8',
    compressType: conf.CompressType ?? 'ZIP',
    blockType: conf.BlockType ?? 'BOOK',
    lang: conf.Lang ?? 'en',
    description: conf.Description ?? '',
    cipherKey: conf.CipherKey ?? null,
    category: categoryFor(conf),
    versification: conf.Versification ?? 'KJV',
    hasStrongs: /Strongs/i.test(conf.Feature ?? '') || /Strongs/i.test(conf.GlobalOptionFilter ?? '')
  }
}

export function scanModules(root: string): ModuleConf[] {
  const modsDir = join(root, 'mods.d')
  if (!existsSync(modsDir)) return []
  const result: ModuleConf[] = []
  for (const file of readdirSync(modsDir)) {
    if (!file.toLowerCase().endsWith('.conf')) continue
    try {
      const conf = loadConfFile(join(modsDir, file), root)
      if (conf) result.push(conf)
    } catch {
      // conf invalido: se ignora
    }
  }
  return result.sort((a, b) => a.name.localeCompare(b.name))
}

export function isTextDriver(driver: string): boolean {
  return TEXT_DRIVERS.has(driver)
}

export function isLdDriver(driver: string): boolean {
  return LD_DRIVERS.has(driver)
}
