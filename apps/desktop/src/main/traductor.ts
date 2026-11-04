/**
 * Sub-agente de traducción en el main process: mantiene vivo un daemon
 * Python (scripts/traductor_daemon.py) con Argos Translate (redes neuronales
 * offline, 0 tokens). Habla JSON-lines por stdin/stdout y expone canales IPC
 * tipados. Los paquetes de idioma se descargan UNA vez a userData; luego
 * todo corre offline en el dispositivo.
 */
import { app } from 'electron'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { spawn, execFileSync, type ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { analizarCorpus } from './analizar_lengua'
import {
  IPC,
  glosarioRequestSchema,
  translateBatchSchema,
  translatePairSchema,
  translateRequestSchema,
  versoBatchSchema,
  type TranslateStatusResult
} from '@keryx/core'

interface Pending {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: NodeJS.Timeout
}

let child: ChildProcess | null = null
let launching: Promise<void> | null = null
let quitting = false
const pending = new Map<number, Pending>()
let nextId = 1
let buffer = ''

export function prepararSalidaTraductor(): void {
  quitting = true
}

function daemonPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'scripts', 'traductor_daemon.py')
    : join(app.getAppPath(), '..', '..', 'scripts', 'traductor_daemon.py')
}

let pythonCache: string | null = null

/** Python REAL de la maquina: en Windows el PATH suele traer primero el stub
 * del Python install manager (WindowsApps/pymanager), que en vez de ejecutar
 * cuelga o abre el updater — rompe el daemon de forma intermitente. */
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
  } else {
    // macOS/Linux: el binario es python3 (mac no trae 'python'); el stub
    // /usr/bin/python3 exige Xcode CLT: si no está instalado sale con error
    // sin colgar — se recorre la escalera habitual.
    const candatos = ['python3', '/usr/bin/python3', '/opt/homebrew/bin/python3', '/usr/local/bin/python3', 'python']
    for (const bin of candatos) {
      try {
        execFileSync(bin, ['--version'], { timeout: 10_000, stdio: 'ignore' })
        pythonCache = bin
        break
      } catch {
        continue
      }
    }
    if (pythonCache === 'python') pythonCache = 'python3'
  }
  return pythonCache
}

function userDataDir(): string {
  return join(app.getPath('userData'), 'traduccion')
}

let instalandoPaquetes = false

/** pip instalador con escalera: sin flag → --break-system-packages (pip de
 * Homebrew, PEP 668), si "--user" se niega cae a "--break-system-packages"
 * solo. Devuelve true si pip terminó bien (o ya estaba instalado). */
async function pipInstalar(): Promise<boolean> {
  const escalera: string[][] = [
    ['-m', 'pip', 'install', '--user', 'argostranslate'],
    ['-m', 'pip', 'install', '--user', '--break-system-packages', 'argostranslate'],
    ['-m', 'pip', 'install', '--break-system-packages', 'argostranslate']
  ]
  for (const args of escalera) {
    const r = await new Promise<{ code: number; salida: string }>((ok) => {
      const proc = spawn(pythonBin(), args, { windowsHide: true })
      let salida = ''
      proc.stdout?.on('data', (c: Buffer) => { salida += c.toString() })
      proc.stderr?.on('data', (c: Buffer) => { salida += c.toString() })
      proc.on('exit', (code) => ok({ code: code ?? 1, salida }))
      proc.on('error', () => ok({ code: 127, salida: 'python inaccesible' }))
    })
    if (r.code === 0) return true
    if (r.salida.includes('already satisfied') || r.salida.includes('Requirement already')) {
      return true
    }
    if (!r.salida.includes('externally-managed-environment') && !r.salida.includes('break-system-packages')) return false
  }
  return false
}

/** Instala argostranslate UNA vez (marca en userData). Sin red o sin pip
 * queda en log y se reintenta al proximo arranque — el daemon sigue vivo. */
function prepararPaquetes(): void {
  const dir = userDataDir()
  if (instalandoPaquetes || existsSync(join(dir, '.paquetes-ok'))) return
  instalandoPaquetes = true
  console.log('[traductor] primera instalacion de paquetes pip (una vez, ~1-10 min)...')
  void pipInstalar().then((bien) => {
    instalandoPaquetes = false
    if (bien) {
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, '.paquetes-ok'), 'ok')
      console.log('[traductor] paquetes instalados; reiniciando daemon con Argos listo')
      child?.kill()
    } else {
      console.log('[traductor] pip no pudo instalar (sin red, CLT de Xcode o pip ausente); se reintentara en el proximo arranque')
    }
  })
}

function launchDaemon(): Promise<void> {
  if (child) return Promise.resolve()
  if (launching) return launching
  launching = new Promise<void>((resolve, reject) => {
    try {
      const dir = userDataDir()
      const proc = spawn(pythonBin(), [daemonPath()], {
        env: {
          ...process.env,
          PYTHONUTF8: '1',
          XDG_DATA_HOME: join(dir, 'datos'),
          XDG_CACHE_HOME: join(dir, 'cache'),
          XDG_CONFIG_HOME: join(dir, 'config'),
          ARGOS_PACKAGES_DIR: join(dir, 'datos', 'argos-translate', 'packages'),
          KERYX_DIALECTOS_DIR: join(dir, 'dialectos'),
          KERYX_CORPUS_DIR: dir
        },
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      })
      child = proc
      buffer = ''
      console.log('[traductor] daemon lanzado:', proc.spawnargs.join(' '))
      prepararPaquetes()
      proc.stdout?.setEncoding('utf8')
      proc.stdout?.on('data', (chunk: string) => {
        buffer += chunk
        let index = buffer.indexOf('\n')
        while (index >= 0) {
          const line = buffer.slice(0, index).trim()
          buffer = buffer.slice(index + 1)
          if (line) {
            console.log('[traductor] <-', line.slice(0, 200))
            handleLine(line)
          }
          index = buffer.indexOf('\n')
        }
      })
      proc.stderr?.setEncoding('utf8')
      proc.stderr?.on('data', (chunk: string) => {
        // El stderr de Argos (avisos de stanza) no es fatal; se registra en dev.
        console.log('[traductor-daemon] ', chunk.trimEnd().slice(0, 300))
      })
      proc.on('exit', (code) => {
        console.log('[traductor] daemon salió con código', code)
        child = null
        launching = null
        for (const [, entry] of pending) {
          clearTimeout(entry.timer)
          entry.reject(new Error('El motor de traducción se detuvo'))
        }
        pending.clear()
        /* Watchdog: si el daemon muere en vuelo (OOM, crash de python) la
         * traduccion no queda muerta hasta reiniciar la app — se relanza en
         * 2 s mientras la ventana siga abierta. */
        if (!quitting) {
          setTimeout(() => {
            if (!quitting) void launchDaemon().catch(() => undefined)
          }, 2_000)
        }
      })
      proc.on('error', (error) => {
        console.log('[traductor] error de spawn:', error.message)
        child = null
        launching = null
        reject(error)
      })
      // El daemon arranca en vivo aunque no haya paquetes aún.
      setTimeout(() => resolve(), 300)
    } catch (error) {
      launching = null
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  })
  return launching
}

function handleLine(line: string): void {
  let message: { id?: number; ok?: boolean; error?: string; [key: string]: unknown }
  try {
    message = JSON.parse(line)
  } catch {
    return
  }
  const id = Number(message.id)
  const entry = pending.get(id)
  if (!entry) return
  clearTimeout(entry.timer)
  pending.delete(id)
  if (message.ok === false) {
    entry.reject(new Error(String(message.error ?? 'Error de traducción')))
    return
  }
  entry.resolve(message)
}

async function request<T>(payload: Record<string, unknown>, timeoutMs = 60_000): Promise<T> {
  await launchDaemon()
  if (!child || !child.stdin?.writable) throw new Error('El motor de traducción no está disponible')
  const id = nextId++
  console.log(`[traductor] -> ${JSON.stringify(payload).slice(0, 160)}`)
  const message = JSON.stringify({ id, ...payload })
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error('Tiempo agotado en la traducción'))
    }, timeoutMs)
    pending.set(id, { resolve: resolve as (value: unknown) => void, reject, timer })
    child?.stdin?.write(`${message}\n`)
  })
}

export async function translateStatus(target?: string): Promise<TranslateStatusResult> {
  try {
    await launchDaemon()
    if (!child) return { available: false, pairs: [] }
    const reply = await request<{ pairs: string[] }>({ op: 'pairs' }, 30_000)
    if (target && target !== 'es' && target !== 'off') void precalentarPar(target)
    return { available: true, pairs: reply.pairs ?? [] }
  } catch (error) {
    console.log(
      '[traductor] status fallo:',
      error instanceof Error ? error.message : String(error)
    )
    return { available: false, pairs: [] }
  }
}

/** Precarga en segundo plano: instala el par si falta y mata el arranque en frio. */
export async function precalentarPar(target: string): Promise<void> {
  const fuente = 'es'
  if (!target || fuente === target || target === 'off') return
  if (ES_DIALECTO.has(target)) {
    // Lenguas nativas: modelos CTranslate2 propios; se descargan una vez.
    try {
      await translateOnce(fuente, target, 'Keryx.')
      return
    } catch {
      const instalado = await instalarDialecto(target)
      if (instalado) {
        try {
          await translateOnce(fuente, target, 'Keryx.')
          return
        } catch {
          // modelo instalado pero fallo de inferencia: degrada al original
        }
      }
    }
    return
  }
  try {
    await translateOnce(fuente, target, 'Keryx.')
  } catch {
    try {
      await translateInstall(fuente, target)
      await translateOnce(fuente, target, 'Keryx.')
    } catch {
      // Sin red: la descarga quedara para el primer uso real.
    }
  }
}

const ES_DIALECTO = new Set(['qu', 'gn', 'arn', 'ay', 'bn'])
/* Spec = nombre REAL de carpeta en userData/dialectos: qu/ay/bn/gn comparten
 * el NLLB-600M (nllb-qu) y arn expone el M2M afinado (m2m-es-arn; su inverso
 * m2m-arn-es no cuenta como disponibilidad es->nativo para el estado). */
const DIALECTO_A_SPEC = new Map([
  ['qu', 'nllb-qu'],
  ['ay', 'nllb-qu'],
  ['bn', 'nllb-qu'],
  ['gn', 'nllb-qu'],
  ['arn', 'm2m-es-arn']
])

/* Registro de LENGUAS NATIVAS: motor generico hecho en Keryx. Cada lengua se
 * activa con corpus (texto verificado que trae el misionero, db SQLite) o con
 * motor neural instalado; nada requiere descarga para CREAR una lengua nueva:
 * basta soltar el corpus en userData/corpus/<code>.db. */
export interface LenguaRegistro {
  code: string
  nombre: string
  familia: string
  alfabeto: string
  corpusDb: string | null
}

const REGISTRO_LENGUAS: LenguaRegistro[] = [
  {
    code: 'arn',
    nombre: 'Mapudungun',
    familia: 'lengua aislada (Chile, Argentina)',
    alfabeto: 'a ch d e f g i k l m n ñ ng p r s t tr u w y ü z',
    corpusDb: 'arn'
  },
  {
    code: 'gn',
    nombre: 'Guaraní',
    familia: 'Tupí-Guaraní (Paraguay, Bolivia, Argentina)',
    alfabeto: "a ã e ẽ g g̃ i ĩ j k l mb n nd ng nt ñ o õ p r rr s t u ũ y ỹ '",
    corpusDb: 'gn'
  },
  {
    code: 'qu',
    nombre: 'Quechua',
    familia: 'Quechua (Perú, Bolivia, Ecuador)',
    alfabeto: "a ch chh ch' i j k kh k' l ll m n ñ p ph p' q qh q' r s t th t' u w y",
    corpusDb: 'quy'
  },
  {
    code: 'ay',
    nombre: 'Aymara',
    familia: 'Aymara (Bolivia, Perú, Chile)',
    alfabeto: "a ch chh ch' i ij j k kh k' l ll m n ñ p ph p' q qh q' r s t th t' u w x y",
    corpusDb: 'ayr'
  },
  {
    code: 'bn',
    nombre: 'Bengalí',
    familia: 'Indoaria (Bangladesh, India)',
    alfabeto:
      'অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ ণ ত থ দ ধ ন প ফ ব ভ ম য র ল শ ষ স হ',
    corpusDb: 'bn'
  }
  /* Nota: Náhuatl y Maya yucateco salieron del registro (25 oct 2026, decisión
   * del pastor): el NLLB instalado no los cubre (token <unk> verificado) y sin
   * corpus no hay texto para traducir — mejor que verlos grises para siempre.
   * Si una Biblia traducida se suelta como corpus/nah.db o corpus/yua.db,
   * descubrirLenguas() los re-activa solos (código no se toca). */
]

export interface LenguaEstado {
  code: string
  nombre: string
  familia: string
  alfabeto: string
  motor: 'corpus' | 'neural' | 'pendiente'
  versosCorpus: number
  glosario: number
}

export function lenguasEstado(): LenguaEstado[] {
  const base = REGISTRO_LENGUAS.map((lengua) => {
    let motor: LenguaEstado['motor'] = 'pendiente'
    let versosCorpus = 0
    if (lengua.corpusDb) {
      const con = corpusConn(lengua.code)
      if (con) {
        try {
          const fila = con.prepare('SELECT COUNT(*) AS n FROM versos').get() as { n?: number }
          versosCorpus = fila?.n ?? 0
          if (versosCorpus > 0) motor = 'corpus'
        } catch {
          versosCorpus = 0
        }
      }
    }
    if (motor === 'pendiente' && DIALECTO_A_SPEC.has(lengua.code)) {
      const spec = DIALECTO_A_SPEC.get(lengua.code)!
      if (existsSync(join(userDataDir(), 'dialectos', spec, 'model.bin'))) motor = 'neural'
    }
    let glosario = 0
    try {
      const ruta = join(userDataDir(), `glosario_${lengua.corpusDb ?? lengua.code}.json`)
      if (existsSync(ruta)) {
        const data = JSON.parse(readFileSync(ruta, 'utf-8')) as { pares?: unknown[] }
        glosario = data.pares?.length ?? 0
      }
    } catch {
      glosario = 0
    }
    return {
      code: lengua.code,
      nombre: lengua.nombre,
      familia: lengua.familia,
      alfabeto: lengua.alfabeto,
      motor,
      versosCorpus,
      glosario
    }
  })
  return [...base, ...descubrirLenguas()]
}

/* ---- ESTANDAR de adopcion de lengua nueva (0 tokens) ----
 * Un corpus soltado en userData/corpus/<code>.db se detecta al vuelo: el
 * analizador infiere alfabeto y funcionarios por contexto, el nombre/familia
 * vienen de la tabla meta del corpus, el analisis se persiste en
 * lenguas_descubiertas.json y la lengua aparece en la seccion nativa sola. */

interface LenguaDescubierta {
  code: string
  nombre: string
  familia: string
  alfabeto: string
}

const ARCHIVO_DESCUBIERTAS = 'lenguas_descubiertas.json'

function leerDescubiertas(): Record<string, LenguaDescubierta> {
  try {
    const ruta = join(userDataDir(), ARCHIVO_DESCUBIERTAS)
    if (!existsSync(ruta)) return {}
    return JSON.parse(readFileSync(ruta, 'utf-8')) as Record<string, LenguaDescubierta>
  } catch {
    return {}
  }
}

function glosarioPares(db: string): Array<{ es: string; nat: string; peso: number }> {
  try {
    const ruta = join(userDataDir(), `glosario_${db}.json`)
    if (!existsSync(ruta)) return []
    const data = JSON.parse(readFileSync(ruta, 'utf-8')) as {
      pares?: Array<{ es: string; nat: string; peso: number }>
    }
    return data.pares ?? []
  } catch {
    return []
  }
}

export function descubrirLenguas(): LenguaEstado[] {
  const dir = join(userDataDir(), 'corpus')
  if (!existsSync(dir)) return []
  const conocidas = new Set(REGISTRO_LENGUAS.map((l) => l.corpusDb ?? l.code))
  const cache = leerDescubiertas()
  let cambio = false
  const estados: LenguaEstado[] = []
  for (const archivo of readdirSync(dir)) {
    if (!archivo.endsWith('.db')) continue
    const db = archivo.slice(0, -3)
    if (conocidas.has(db)) continue
    try {
      const con = new DatabaseSync(join(dir, archivo), { readOnly: true })
      const fila = con.prepare('SELECT COUNT(*) AS n FROM versos').get() as { n?: number }
      const versos = fila?.n ?? 0
      if (versos <= 0) {
        con.close()
        continue
      }
      const libros = (con.prepare('SELECT COUNT(DISTINCT code) AS n FROM versos').get() as { n?: number })?.n ?? 0
      const meta = corpusMetaDe(con)
      const muestra = con
        .prepare('SELECT text FROM versos LIMIT 3000')
        .all() as Array<{ text: string }>
      con.close()
      const previa = cache[db]
      const analisis = analizarCorpus(db, muestra.map((f) => f.text), meta, {
        versos,
        libros,
        capitulos: 0
      })
      const registro: LenguaDescubierta = {
        code: db,
        nombre: previa?.nombre || meta.nombre || analisis.nombre,
        familia: previa?.familia || meta.fuente || 'lengua indígena',
        alfabeto: previa?.alfabeto || analisis.alfabeto
      }
      if (JSON.stringify(previa) !== JSON.stringify(registro)) {
        cache[db] = registro
        cambio = true
      }
      estados.push({
        code: db,
        nombre: registro.nombre,
        familia: registro.familia,
        alfabeto: registro.alfabeto,
        motor: 'corpus',
        versosCorpus: versos,
        glosario: glosarioPares(db).length
      })
    } catch {
      // corpus ilegible: se omite, la biblioteca sigue intacta
    }
  }
  if (cambio) {
    try {
      writeFileSync(
        join(userDataDir(), ARCHIVO_DESCUBIERTAS),
        JSON.stringify(cache, null, 1),
        'utf-8'
      )
    } catch {
      // persistencia del analisis: la proxima corrida lo reintenta
    }
  }
  return estados
}

export function glosarioDe(lang: string): Array<{ es: string; nat: string; peso: number }> {
  const lengua = REGISTRO_LENGUAS.find((l) => l.code === lang)
  const db = lengua?.corpusDb ?? CORPUS_LANG_DB[lang] ?? lang
  return glosarioPares(db)
}

/** Instala el modelo de una lengua nativa (descarga una vez; sub-agente de codigo). */
async function instalarDialecto(target: string): Promise<boolean> {
  const spec = DIALECTO_A_SPEC.get(target)
  if (!spec) return false
  const script = app.isPackaged
    ? join(process.resourcesPath, 'scripts', 'instalar_dialectos.py')
    : join(app.getAppPath(), '..', '..', 'scripts', 'instalar_dialectos.py')
  try {
    await new Promise<void>((resolve, reject) => {
      const proc = spawn(pythonBin(), [script, '--raiz', join(userDataDir(), 'dialectos'), '--dialecto', spec], {
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      })
      proc.stdout?.on('data', (chunk) => console.log('[dialectos]', chunk.toString().trim().slice(0, 200)))
      proc.stderr?.on('data', (chunk) => console.log('[dialectos] ', chunk.toString().trim().slice(0, 300)))
      const timer = setTimeout(() => reject(new Error('Instalación de dialecto excedió 30 min')), 1_800_000)
      proc.on('exit', (code) => {
        clearTimeout(timer)
        if (code === 0) resolve()
        else reject(new Error(`instalar_dialectos salió con código ${code}`))
      })
      proc.on('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
    })
    return true
  } catch (error) {
    console.log('[dialectos] fallo de instalación:', error instanceof Error ? error.message : String(error))
    return false
  }
}

export async function translateOnce(source: string, target: string, text: string): Promise<string> {
  const enCache = cacheConsegue(source, target, text)
  if (enCache !== undefined) return enCache
  const reply = await request<{ text: string }>({ op: 'translate', source, target, text }, 120_000)
  const salida = reply.text ?? text
  cacheGuarda(source, target, text, salida)
  return salida
}

export interface VersoRef {
  lang: string
  code: string
  cap: number
  ver: number
}

export interface VersoResultado {
  texto: string
  nivel: 'verificado' | 'experimental' | 'original'
  fuente?: string
}

/* Memoria de traduccion Nivel 1 (verificado): verso por referencia canonica,
 * SQLite local instantaneo en el main process (sin depender del daemon
 * neural: los lotes largos nunca bloquean el texto verificado). */

const CORPUS_LANG_DB: Record<string, string> = {
  arn: 'arn',
  gn: 'gn',
  ay: 'ayr',
  ayr: 'ayr',
  bn: 'bn',
  qu: 'quy',
  quy: 'quy'
}

const corpusConns = new Map<string, DatabaseSync>()

function corpusConn(lang: string): DatabaseSync | null {
  /* ESTANDAR de adopcion: db registrada por tabla; cualquier otra lengua se
   * resuelve por su propio nombre — un corpus nuevo en corpus/<code>.db se
   * activa solo, sin tocar codigo. */
  const db = CORPUS_LANG_DB[lang] ?? lang
  if (!db) return null
  let conn = corpusConns.get(db)
  if (!conn) {
    const ruta = join(userDataDir(), 'corpus', `${db}.db`)
    if (!existsSync(ruta)) return null
    try {
      conn = new DatabaseSync(ruta, { readOnly: true })
    } catch {
      return null
    }
    corpusConns.set(db, conn)
  }
  return conn
}

function corpusMetaDe(con: DatabaseSync): Record<string, string> {
  try {
    const filas = con.prepare('SELECT key, value FROM meta').all() as Array<{
      key: string
      value: string
    }>
    return Object.fromEntries(filas.map((f) => [f.key, f.value]))
  } catch {
    return {}
  }
}

export async function versoLote(
  items: VersoRef[]
): Promise<{ versos: Record<string, string | null>; meta: Record<string, Record<string, string>> }> {
  const porLang = new Map<string, VersoRef[]>()
  for (const item of items) {
    const lista = porLang.get(item.lang) ?? []
    lista.push(item)
    porLang.set(item.lang, lista)
  }
  const versos: Record<string, string | null> = {}
  const meta: Record<string, Record<string, string>> = {}
  for (const [lang, lista] of porLang) {
    const con = corpusConn(lang)
    if (!con) continue
    try {
      const metaTabla = corpusMetaDe(con)
      if (Object.keys(metaTabla).length) meta[lang] = metaTabla
      const stmt = con.prepare('SELECT text FROM versos WHERE code=? AND chapter=? AND verse=?')
      for (const { code, cap, ver } of lista) {
        const fila = stmt.get(code, cap, ver) as { text?: string } | undefined
        versos[`${lang}:${code}:${cap}:${ver}`] = fila?.text ?? null
      }
    } catch {
      // corpus ilegible: los versos caen al motor neural
    }
  }
  return { versos, meta }
}

export async function translateLote(source: string, target: string, items: string[]): Promise<string[]> {  const salida: string[] = []
  const pendientes: Array<{ index: number; text: string }> = []
  for (const [index, item] of items.entries()) {
    const enCache = cacheConsegue(source, target, item)
    if (enCache !== undefined) salida[index] = enCache
    else pendientes.push({ index, text: item })
  }
  if (pendientes.length) {
    const LOTE = 120
    for (let base = 0; base < pendientes.length; base += LOTE) {
      const chunk = pendientes.slice(base, base + LOTE)
      const reply = await request<{ texts: string[] }>(
        { op: 'translate_batch', source, target, items: chunk.map((p) => p.text) },
        300_000
      )
      const textos = reply.texts ?? []
      for (const [pos, pendiente] of chunk.entries()) {
        const traducido = textos[pos] ?? pendiente.text
        salida[pendiente.index] = traducido
        /* Identidad = degradación del motor (respuestas originales): jamás
         * en cache — si se guardara, el idioma quedaría "pegado" al original
         * para siempre sin reintentar el motor. */
        if (traducido !== pendiente.text) cacheGuarda(source, target, pendiente.text, traducido)
      }
    }
  }
  return salida
}

/* ── Cache persistente de traducciones (userData; instantaneo entre sesiones) ── */

const CACHE_FILE = (): string => join(app.getPath('userData'), 'traduccion', 'cache-traducciones.json')
const CACHE_MAX = 12_000
const FLUSH_CADA = 150
const cacheMemoria = new Map<string, string>()
let cacheSucia = false
let sinDescargar = 0

function cacheClave(source: string, target: string, text: string): string {
  return `${source}>${target}:${text}`
}

function cacheConsegue(source: string, target: string, text: string): string | undefined {
  if (!cacheMemoria.size) cacheCarga()
  const key = cacheClave(source, target, text)
  const value = cacheMemoria.get(key)
  if (value === undefined) return undefined
  cacheMemoria.delete(key)
  cacheMemoria.set(key, value)
  return value
}

function cacheGuarda(source: string, target: string, text: string, traduccion: string): void {
  if (!cacheMemoria.size) cacheCarga()
  const key = cacheClave(source, target, text)
  cacheMemoria.delete(key)
  cacheMemoria.set(key, traduccion)
  if (cacheMemoria.size > CACHE_MAX) {
    const masVieja = cacheMemoria.keys().next().value
    if (masVieja !== undefined) cacheMemoria.delete(masVieja)
  }
  cacheSucia = true
  sinDescargar += 1
  if (sinDescargar >= FLUSH_CADA) {
    sinDescargar = 0
    cacheDescarga()
  }
}

function cacheCarga(): void {
  try {
    if (!existsSync(CACHE_FILE())) return
    const datos = JSON.parse(readFileSync(CACHE_FILE(), 'utf8')) as Record<string, string>
    for (const [key, value] of Object.entries(datos)) cacheMemoria.set(key, value)
  } catch {
    // cache corrupta o inexistente: arranca vacia
  }
}

export function cacheDescarga(): void {
  if (!cacheSucia) return
  cacheSucia = false
  try {
    const datos: Record<string, string> = {}
    for (const [key, value] of cacheMemoria.entries()) datos[key] = value
    writeFileSync(CACHE_FILE(), JSON.stringify(datos), 'utf8')
  } catch {
    // sin escritura disponible: se pierde solo el cache
  }
}

export async function translateInstall(source: string, target: string): Promise<string[]> {
  const reply = await request<{ pairs: string[] }>(
    { op: 'install', source, target },
    900_000
  )
  return reply.pairs ?? []
}

export function registerTraductorIpc(
  register: (channel: string, handler: (args: unknown[]) => Promise<unknown> | unknown) => void,
  idiomaTraduccion?: () => string
): void {
  register(IPC.translateStatus, () => translateStatus(idiomaTraduccion?.()))
  register(IPC.translateRequest, (args) => {
    const req = translateRequestSchema.parse(args[0])
    return translateOnce(req.source, req.target, req.text)
  })
  register(IPC.translateBatch, (args) => {
    const req = translateBatchSchema.parse(args[0])
    return translateLote(req.source, req.target, req.items)
  })
  register(IPC.versoBatch, (args) => {
    const req = versoBatchSchema.parse(args[0])
    return versoLote(req.items)
  })
  register(IPC.translateInstall, (args) => {
    const req = translatePairSchema.parse(args[0])
    return translateInstall(req.source, req.target)
  })
  register(IPC.translateLenguas, () => lenguasEstado())
  register(IPC.translateGlosario, (args) => {
    const req = glosarioRequestSchema.parse(args[0])
    return { lang: req.lang, pares: glosarioDe(req.lang) }
  })
}
