/**
 * Sub-agente de traducción en el main process: mantiene vivo un daemon
 * Python (scripts/traductor_daemon.py) con Argos Translate (redes neuronales
 * offline, 0 tokens). Habla JSON-lines por stdin/stdout y expone canales IPC
 * tipados. Los paquetes de idioma se descargan UNA vez a userData; luego
 * todo corre offline en el dispositivo.
 */
import { app } from 'electron'
import { spawn, type ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import {
  IPC,
  translatePairSchema,
  translateRequestSchema,
  type TranslateStatusResult
} from '@keryx/core'

interface Pending {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: NodeJS.Timeout
}

let child: ChildProcess | null = null
let launching: Promise<void> | null = null
const pending = new Map<number, Pending>()
let nextId = 1
let buffer = ''

function daemonPath(): string {
  return app.isPackaged
    ? join(process.resourcesPath, 'scripts', 'traductor_daemon.py')
    : join(app.getAppPath(), '..', '..', 'scripts', 'traductor_daemon.py')
}

function userDataDir(): string {
  return join(app.getPath('userData'), 'traduccion')
}

function launchDaemon(): Promise<void> {
  if (child) return Promise.resolve()
  if (launching) return launching
  launching = new Promise<void>((resolve, reject) => {
    try {
      const dir = userDataDir()
      const proc = spawn('python', [daemonPath()], {
        env: {
          ...process.env,
          PYTHONUTF8: '1',
          XDG_DATA_HOME: join(dir, 'datos'),
          XDG_CACHE_HOME: join(dir, 'cache'),
          XDG_CONFIG_HOME: join(dir, 'config'),
          ARGOS_PACKAGES_DIR: join(dir, 'datos', 'argos-translate', 'packages')
        },
        windowsHide: true,
        stdio: ['pipe', 'pipe', 'pipe']
      })
      child = proc
      buffer = ''
      console.log('[traductor] daemon lanzado:', proc.spawnargs.join(' '))
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
  } catch {
    return { available: false, pairs: [] }
  }
}

/** Precarga en segundo plano: instala el par si falta y mata el arranque en frio. */
export async function precalentarPar(target: string): Promise<void> {
  const fuente = 'es'
  if (!target || fuente === target || target === 'off') return
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

export async function translateOnce(source: string, target: string, text: string): Promise<string> {
  const reply = await request<{ text: string }>({ op: 'translate', source, target, text }, 120_000)
  return reply.text ?? text
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
  register(IPC.translateInstall, (args) => {
    const req = translatePairSchema.parse(args[0])
    return translateInstall(req.source, req.target)
  })
}
