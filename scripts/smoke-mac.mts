/**
 * Prueba de humo REAL del paquete (se ejecuta en el runner macOS contra el
 * .app ya empaquetado, y en local contra una raiz de biblioteca):
 *   npx tsx scripts/smoke-mac.mts apps/desktop/dist/mac/Keryx.app
 * Abraza todo el arranque sin electron: biblioteca e-Sword dentro del
 * paquete, corpus Coalicion, resolucion de Python y daemon Argos E2E.
 */
import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const AQUI = resolve(dirname(fileURLToPath(import.meta.url)), '..')
;(globalThis as unknown as { window: object }).window = {}
const { EswordProvider } = await import('../packages/sword/src/local/esword')
const { pythonBin } = await import('../apps/desktop/src/main/python-bin')

function dificil(mensaje: string): never {
  console.error(`[smoke] FALLO: ${mensaje}`)
  process.exit(1)
}

const dirApp = resolve(process.argv[2] ?? '')
if (!existsSync(dirApp)) dificil(`pasa el dir de la app: npx tsx scripts/smoke-mac.mts <app>`)

const recursosPosibles = [join(dirApp, 'Contents', 'Resources'), dirApp, join(dirApp, 'resources')]
const recursos = recursosPosibles.find((c) => existsSync(join(c, 'biblioteca'))) ?? ''
if (!recursos) dificil(`ni la app trae biblioteca: ${recursosPosibles.join(' | ')}`)
const carpetaBiblioteca = join(recursos, 'biblioteca')
const carpetaCoalicion = join(recursos, 'coalicion')

console.log(`[smoke] app: ${dirApp}`)
console.log(`[smoke] biblioteca: ${carpetaBiblioteca}`)

// 1) Escaneo REAL de la biblioteca empaquetada (mismo provider de la app)
const p = EswordProvider.create('esword', [carpetaBiblioteca])
if (!p) dificil('EswordProvider no disponible')
const mods = await p.listLocalModules()
const biblias = mods.filter((m) => m.category === 'Bible')
const bibEs = biblias.filter((m) => (m.lang || '').toLowerCase().startsWith('es'))
console.log(`[smoke] modulos: ${mods.length} totales · ${biblias.length} Biblias · ${bibEs.length} Biblias en español`)
console.log(`[smoke] ejemplos es: ${bibEs.slice(0, 3).map((m) => m.name).join(' | ')}`)
if (bibEs.length >= 50) {
  const candidatos = [...bibEs]
    .sort((a, b) =>
      (/reina valera/i.test(a.name) ? 0 : /strong/i.test(a.name) ? 1 : 2) -
      (/reina valera/i.test(b.name) ? 0 : /strong/i.test(b.name) ? 1 : 2) ||
      a.name.localeCompare(b.name)
    )
    .slice(0, 6)
  let prueba: { verse: number; text: string } | null = null
  let elegido = ''
  for (const c of candidatos) {
    prueba = (await p.getVerse(c.name, 'John', 3, 16)) ?? null
    if (prueba && prueba.text.length >= 20) {
      elegido = c.name
      break
    }
  }
  if (!prueba) dificil(`ninguna Biblia en español leyó Jn 3:16 (probadas: ${candidatos.map((c) => c.name).join(' | ')})`)
  console.log(`[smoke] lectura verificada: ${elegido} · Jn 3:16 => "${prueba!.text.slice(0, 70)}…"`)
} else {
  dificil(`solo ${bibEs.length} Biblias en español (el dosier caeria al ingles)`)
}
if (mods.length < 400) dificil(`biblioteca escasea: solo ${mods.length} modulos (esperados 700+)`)
if (biblias.length < 90) dificil(`solo ${biblias.length} Biblias`)

// 2) Corpus Coalicion dentro del paquete (el Asistente lo descubre ahi)
const jsonl = join(carpetaCoalicion, 'articulos.jsonl')
if (!existsSync(jsonl)) dificil('articulos.jsonl no viene en el paquete')
const mb = statSync(jsonl).size / 1048576
const primeras = readFileSync(jsonl, 'utf8').split('\n').filter((l) => l.trim()).slice(0, 3)
console.log(`[smoke] coalicion: ${mb.toFixed(1)} MB, muestra ${primeras.length} lineas validas`)
if (mb < 50) dificil(`corpus coalicion incompleto: ${mb.toFixed(1)} MB (esperados ~60)`)
try { JSON.parse(primeras[0]!) } catch { dificil('articulos.jsonl primera linea rota') }

// 3) Python resuelto como hara la app (la falla original del mac)
const binario = String(pythonBin())
try {
  execFileSync(binario, ['--version'], { stdio: 'pipe', timeout: 15_000 })
  console.log(`[smoke] python: ${binario} responde`)
} catch {
  dificil(`el python elegido (${binario}) no ejecuta nada`)
}

// 4) Daemon Argos E2E (advisorio: si la red falla, avisa y no corta)
interface Resp { ok?: boolean; error?: string; text?: string; pairs?: string[] }
const temp = mkdtempSync(join(tmpdir(), 'keryx-smoke-'))
let id = 0
try {
  for (const bandera of [[], ['--break-system-packages']]) {
    try {
      execFileSync(binario, ['-m', 'pip', 'install', '--user', ...bandera, 'argostranslate'], { stdio: 'pipe', timeout: 900_000 })
      break
    } catch {
      continue
    }
  }
  const n = spawn(binario, [join(AQUI, 'scripts', 'traductor_daemon.py')], {
    env: {
      ...process.env,
      PYTHONUTF8: '1',
      XDG_DATA_HOME: join(temp, 'datos'),
      XDG_CACHE_HOME: join(temp, 'cache'),
      XDG_CONFIG_HOME: join(temp, 'config'),
      ARGOS_PACKAGES_DIR: join(temp, 'datos', 'argos-translate', 'packages')
    },
    stdio: ['pipe', 'pipe', 'pipe']
  })
  const respuestas = new Map<number, Resp>()
  let buffer = ''
  n.stdout?.setEncoding('utf8')
  n.stdout?.on('data', (chunk: string) => {
    buffer += chunk
    let index = buffer.indexOf('\n')
    while (index >= 0) {
      const linea = buffer.slice(0, index).trim()
      buffer = buffer.slice(index + 1)
      if (linea) {
        try {
          const o = JSON.parse(linea) as { id?: number; ok?: boolean; error?: string; text?: string; pairs?: string[] }
          if (typeof o.id === 'number') respuestas.set(o.id, o)
        } catch { /* linea de arranque */ }
      }
      index = buffer.indexOf('\n')
    }
  })
  n.stderr?.on('data', (c: Buffer) => console.log('[smoke-daemon]', c.toString().trimEnd().slice(0, 200)))
  const pedir = async (obj: Record<string, unknown>, esperaMs = 420_000): Promise<Resp | undefined> => {
    id += 1
    n.stdin?.write(JSON.stringify({ id, ...obj }) + '\n')
    const t0 = Date.now()
    while (Date.now() - t0 < esperaMs) {
      const r = respuestas.get(id)
      if (r) return r
      await new Promise((r) => setTimeout(r, 250))
    }
    return undefined
  }
  try {
    const instalar = await pedir({ op: 'install', source: 'en', target: 'es' })
    if (!instalar?.ok) {
      console.log(`[smoke] Aviso: instalacion en>es fallo (¿sin red?): ${instalar?.error ?? 'sin respuesta'}`)
    } else {
      const pares = await pedir({ op: 'pairs' })
      const par = pares?.pairs?.includes('en>es')
      if (par) {
        const traduccion = await pedir({ op: 'translate', source: 'en', target: 'es', text: 'Love one another' })
        if (traduccion?.ok && traduccion.text) {
          console.log(`[smoke] daemon Argos E2E OK: "Love one another" => "${traduccion.text.slice(0, 60)}"`)
        } else {
          console.log(`[smoke] Aviso: translate en>es no respondio: ${traduccion?.error ?? 'timeout'}`)
        }
      } else {
        console.log('[smoke] Aviso: reportado instalado pero pairs no lista en>es')
      }
    }
  } catch (e) {
    console.log(`[smoke] Aviso: daemon no alcanzo E2E: ${e instanceof Error ? e.message : String(e)}`)
  }
  n.kill()
} catch (e) {
  console.log(`[smoke] Aviso: impossible lanzar daemon: ${e instanceof Error ? e.message : String(e)}`)
} finally {
  rmSync(temp, { recursive: true, force: true })
}

console.log('[smoke] LISTO — paquete mac viable')
