/**
 * Instalador automatico de Python portatil (sin permisos de admin).
 * Cuando la maquina del usuario no tiene Python real (el caso del Mac:
 * /usr/bin/python3 es un stub de Apple que abre la ventana de Xcode),
 * la app baja un CPython precompilado de python-build-standalone
 * (los mismos binarios que usa uv/ruff, ~70 MB) y lo extrae en userData.
 * Despues el flujo existente de pip (prepararPaquetes) instala Argos solo.
 */
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import { app } from 'electron'
import { reiniciarSondeoPython, pythonBin } from './python-bin'

const RELEASE = '20250106'
const VERSION = 'cpython-3.12.8+20250106'

export interface EstadoPython {
  estado: 'completo' | 'instalando' | 'pendiente' | 'error'
  error?: string
}

let estado: EstadoPython = { estado: 'pendiente' }
let instalando = false

export function estadoPython(): EstadoPython {
  if (pythonBin() && estado.estado !== 'instalando') return { estado: 'completo' }
  return estado
}

function extraer(tarball: string, destino: string): Promise<void> {
  return new Promise((ok, mal) => {
    mkdirSync(destino, { recursive: true })
    const proc = spawn('tar', ['-xzf', tarball, '-C', destino], { windowsHide: true })
    let err = ''
    proc.stderr?.on('data', (c: Buffer) => { err += c.toString() })
    proc.on('exit', (code) => (code === 0 ? ok() : mal(new Error(err || `tar salio con ${code}`))))
    proc.on('error', mal)
  })
}

async function bajar(url: string, destino: string): Promise<void> {
  const r = await fetch(url, { redirect: 'follow' })
  if (!r.ok || !r.body) throw new Error(`servidor respondio ${r.status} para Python portatil`)
  await pipeline(Readable.fromWeb(r.body as never), createWriteStream(destino))
}

/** Instala el Python portatil si hace falta; resuelve true si al final hay python. */
export async function instalarPythonPortatil(): Promise<boolean> {
  if (process.platform === 'win32') return false
  if (pythonBin()) return true
  if (instalando) return false
  instalando = true
  estado = { estado: 'instalando' }
  try {
    const destino = process.env['KERYX_PYTHON_PORTATIL'] ?? join(app.getPath('userData'), 'python')
    const binario =
      process.platform === 'darwin' ? join(destino, 'bin', 'python3') : join(destino, 'bin', 'python3')
    if (!existsSync(binario)) {
      const plataforma =
        process.platform === 'darwin' ? 'apple-darwin' : 'unknown-linux-gnu'
      const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64'
      const url = `https://github.com/astral-sh/python-build-standalone/releases/download/${RELEASE}/${VERSION}-${arch}-${plataforma}-install_only.tar.gz`
      const tarball = join(app.getPath('userData'), 'python.tar.gz')
      console.log('[python] instalando Python portatil:', url)
      await bajar(url, tarball)
      // El tarball trae carpeta python/ en la raiz: se extrae a userData.
      await extraer(tarball, dirname(destino))
      rmSync(tarball, { force: true })
    }
    reiniciarSondeoPython()
    if (!pythonBin()) throw new Error('el Python portatil no responde')
    estado = { estado: 'completo' }
    console.log('[python] Python portatil listo:', pythonBin())
    return true
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : String(error)
    console.log('[python] fallo instalando Python portatil:', mensaje)
    estado = { estado: 'error', error: mensaje }
    return false
  } finally {
    instalando = false
  }
}
