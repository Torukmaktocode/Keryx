/**
 * eval_traduccion.mts — Evals de calidad de traduccion contra el daemon real
 * (0 tokens IA): set de control es->nativa alineado por referencia canonica,
 * metricas chrF++ / BLEU-4 (scripts/metricas_traduccion.ts) y deteccion de
 * degradacion (identidad = sin datos). Uso: `npm run eval:trad`.
 *
 * Con corpus de control a 300 pares: ampliar CONTROL_REFS por lengua y el
 * script escala sin cambios (muestreo determinista sobre el corpus).
 */
import { spawn, execFileSync, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { bleu4, chrFpp } from './metricas_traduccion'
import { EswordProvider } from '../packages/sword/src/local/esword'
;(globalThis as unknown as { window: object }).window = {}

const __dirname = dirname(fileURLToPath(import.meta.url))

const args = process.argv.slice(2)

function plainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const flag = (nombre: string): string | undefined => {
  const i = args.indexOf(`--${nombre}`)
  return i >= 0 ? args[i + 1] : undefined
}

function raizTraduccion(): string {
  const explicita = flag('raiz')
  if (explicita) return explicita
  if (platform() === 'win32') {
    return join(
      process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming'),
      '@keryx',
      'desktop',
      'traduccion'
    )
  }
  return join(homedir(), '.local', 'share', '@keryx', 'desktop', 'traduccion')
}

const CODIGOS = [
  'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam',
  '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov',
  'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos',
  'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal',
  'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph',
  'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb',
  'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev'
]

const ORDEN_CAP_VER: Array<[number, number]> = [[1, 1], [1, 2], [1, 3], [3, 16], [23, 1], [10, 25]]

const DB_POR_LANG: Record<string, string> = {
  arn: 'arn',
  gn: 'gn',
  ay: 'ayr',
  ayr: 'ayr',
  bn: 'bn',
  qu: 'quy',
  quy: 'quy'
}

const MODELOS: Record<string, { dir: string; umbralChrF: number; maxSinDatos: number }> = {
  arn: { dir: 'm2m-es-arn', umbralChrF: 14, maxSinDatos: 3 },
  gn: { dir: 'nllb-qu', umbralChrF: 15, maxSinDatos: 1 },
  ay: { dir: 'nllb-qu', umbralChrF: 15, maxSinDatos: 1 },
  bn: { dir: 'nllb-qu', umbralChrF: 15, maxSinDatos: 1 }
}

interface Pending {
  resolve: (value: Record<string, unknown>) => void
  reject: (error: Error) => void
  timer: NodeJS.Timeout
}

let pythonCache: string | null = null

function pythonBin(): string {
  if (pythonCache) return pythonCache
  pythonCache = 'python'
  if (process.platform === 'win32') {
    try {
      const salida = execFileSync('where.exe', ['python'], { encoding: 'utf8', timeout: 15_000 })
      const reales = salida
        .split(/\r?\n/)
        .map((linea) => linea.trim())
        .filter(Boolean)
        .filter((ruta) => !/WindowsApps|pymanager/i.test(ruta))
      if (reales.length) pythonCache = reales[0]
    } catch {
      // sin where.exe: cae al PATH
    }
  }
  return pythonCache
}

let daemon: ChildProcess | null = null
let buffer = ''
let nextId = 1
const pending = new Map<number, Pending>()

function launch(): Promise<void> {
  const raiz = raizTraduccion()
  return new Promise((resolve, reject) => {
    daemon = spawn(pythonBin(), [join(__dirname, 'traductor_daemon.py')], {
      env: {
        ...process.env,
        PYTHONUTF8: '1',
        KERYX_DIALECTOS_DIR: join(raiz, 'dialectos'),
        KERYX_CORPUS_DIR: raiz
      },
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    daemon.stdout?.setEncoding('utf8')
    /* Drenar stderr SIEMPRE: si el pipe se llena (avisos de transformers,
     * ~64 KB), python se bloquea escribiendo stderr y nunca responde. */
    daemon.stderr?.setEncoding('utf8')
    daemon.stderr?.on('data', (chunk: string) => {
      if (process.env.KERYX_EVAL_VERBOSE) process.stdout.write(`  [daemon] ${chunk}`)
    })
    daemon.stdout?.on('data', (chunk: string) => {
      buffer += chunk
      let i = buffer.indexOf('\n')
      while (i >= 0) {
        const linea = buffer.slice(0, i).trim()
        buffer = buffer.slice(i + 1)
        if (linea) {
          try {
            const msg = JSON.parse(linea) as { id?: number; ok?: boolean; error?: string }
            const id = Number(msg.id)
            const entry = pending.get(id)
            if (!entry) continue
            clearTimeout(entry.timer)
            pending.delete(id)
            if (msg.ok === false) entry.reject(new Error(String(msg.error ?? 'error')))
            else entry.resolve(msg as Record<string, unknown>)
          } catch {
            // linea no-JSON (avisos de transformers): se ignora
          }
        }
        i = buffer.indexOf('\n')
      }
    })
    daemon.on('exit', (code) => {
      console.log(`[eval] daemon salió con código ${code}`)
      daemon = null
      for (const [, entry] of pending) entry.reject(new Error('daemon salio'))
      pending.clear()
    })
    daemon.on('error', (error) => {
      console.log('[eval] error de spawn:', error.message)
      reject(error)
    })
    /* Handshake de arranque: los imports de Argos pueden tardar (o el proceso
     * puede morir al arrancar); pairs barato confirma que el daemon vive. */
    request({ op: 'pairs' }, 120_000)
      .then(() => resolve())
      .catch((error) => reject(error))
  })
}

function request<T extends Record<string, unknown>>(payload: Record<string, unknown>, timeoutMs = 600_000): Promise<T> {
  if (!daemon?.stdin?.writable) return Promise.reject(new Error('daemon no disponible'))
  const id = nextId++
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error('Tiempo agotado'))
    }, timeoutMs)
    pending.set(id, { resolve: resolve as (v: Record<string, unknown>) => void, reject, timer })
    daemon?.stdin?.write(`${JSON.stringify({ id, ...payload })}\n`)
  })
}

interface Caso {
  lang: string
  code: string
  cap: number
  ver: number
  fuente: string
  referencia: string
}

async function main(): Promise<number> {
  const raiz = raizTraduccion()
  const corpusDir = join(raiz, 'corpus')
  if (!existsSync(corpusDir)) {
    console.log('eval-traduccion: sin corpus local — nada que medir (no es fallo)')
    return 0
  }
  const p = EswordProvider.create('esword', ['biblioteca'])
  const mods = await p!.listLocalModules()
  const sinStrong = mods.filter((m) => m.category === 'Bible' && !/strong/i.test(m.name))
  const biblia =
    sinStrong.find((m) => /Reina Valera 1960/i.test(m.name)) ??
    sinStrong.find((m) => m.lang === 'es') ??
    sinStrong.find((m) => m.category === 'Bible') ??
    mods.find((m) => m.category === 'Bible')
  if (!biblia) {
    console.log('eval-traduccion: sin Biblia en biblioteca — nada que medir')
    return 0
  }
  await launch()
  const casos: Caso[] = []
  for (const [lang, conf] of Object.entries(MODELOS)) {
    const ruta = join(raiz, 'dialectos', conf.dir, 'model.bin')
    const dbRuta = join(corpusDir, `${DB_POR_LANG[lang] ?? lang}.db`)
    if (!existsSync(ruta) || !existsSync(dbRuta)) {
      console.log(`${lang}: sin modelo o sin corpus — se omite`)
      continue
    }
    const db = new DatabaseSync(dbRuta, { readOnly: true })
    for (const [cap, ver] of ORDEN_CAP_VER) {
      for (const ordinal of [1, 40, 19]) {
        const code = CODIGOS[ordinal - 1]
        const fila = db
          .prepare('SELECT text FROM versos WHERE code=? AND chapter=? AND verse=?')
          .get(code, cap, ver) as { text?: string } | undefined
        if (!fila?.text) continue
        const fuente = await p!.getVerse(biblia.name, code, cap, ver)
        const texto = plainText(typeof fuente === 'string' ? fuente : (fuente?.text ?? ''))
        if (!texto.trim()) continue
        casos.push({ lang, code, cap, ver, fuente: texto, referencia: fila.text })
      }
    }
  }
  if (!casos.length) {
    console.log('eval-traduccion: sin casos de control — nada que medir')
    return 0
  }
  console.log(`eval-traduccion (${biblia.name}, ${casos.length} casos de control):`)
  const porLang = new Map<string, Caso[]>()
  for (const caso of casos) {
    const lista = porLang.get(caso.lang) ?? []
    lista.push(caso)
    porLang.set(caso.lang, lista)
  }
  let failed = 0
  for (const [lang, lista] of porLang) {
    const umbral = MODELOS[lang].umbralChrF
    const maxSinDatos = MODELOS[lang].maxSinDatos
    const started = Date.now()
    const valores: Array<{ caso: Caso; hipotesis: string; chrf: number; bleu: number }> = []
    let degradados = 0
    for (const caso of lista) {
      const reply = await request<{ text?: string }>({
        op: 'translate',
        source: 'es',
        target: lang,
        text: caso.fuente
      })
      const hipotesis = String(reply.text ?? caso.fuente)
      if (!hipotesis.trim() || hipotesis === caso.fuente) {
        degradados += 1
        continue
      }
      valores.push({
        caso,
        hipotesis,
        chrf: chrFpp(hipotesis, caso.referencia),
        bleu: bleu4(hipotesis, caso.referencia)
      })
    }
    const ms = Date.now() - started
    const mediaChrF = valores.length
      ? valores.reduce((a, v) => a + v.chrf, 0) / valores.length
      : 0
    const mediaBleu = valores.length
      ? valores.reduce((a, v) => a + v.bleu, 0) / valores.length
      : 0
    const ok = mediaChrF >= umbral && degradados <= maxSinDatos
    if (!ok) failed += 1
    console.log(
      `${ok ? 'PASS' : 'FAIL'} ${lang.padEnd(4)} chrF++ ${mediaChrF.toFixed(1)} (umbral ${umbral}) · BLEU-4 ${mediaBleu.toFixed(1)} · ${degradados} sin datos · ${ms}ms · ${valores.length}/${lista.length} casos`
    )
    const peor = [...valores].sort((a, b) => a.chrf - b.chrf)[0]
    if (peor) {
      console.log(
        `     peor: ${peor.caso.code} ${peor.caso.cap}:${peor.caso.ver} chrF ${peor.chrf.toFixed(1)} → ${JSON.stringify(peor.hipotesis.slice(0, 70))}`
      )
    }
  }
  p?.dispose()
  console.log(`\nResult: ${failed}/${porLang.size} lenguas en fallo`)
  return failed ? 1 : 0
}

main()
  .then((code) => process.exit(code))
  .catch((error) => {
    console.error('eval-traduccion fallo:', error)
    process.exit(1)
  })
