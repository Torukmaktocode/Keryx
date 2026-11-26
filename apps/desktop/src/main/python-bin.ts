import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

let pythonCache: string | null = null
let sondeado = false

/** Python portatil autoinstalado por Keryx (python-build-standalone) en userData. */
export function pythonPortatil(): string | null {
  const base = process.env['KERYX_PYTHON_PORTATIL']
  if (!base) return null
  const candidatos = [join(base, 'bin', 'python3'), join(base, 'python.exe')]
  for (const bin of candidatos) {
    if (existsSync(bin)) return bin
  }
  return null
}

/** Descarta el cache del sondeo (tras instalar el Python portatil). */
export function reiniciarSondeoPython(): void {
  sondeado = false
  pythonCache = null
}

/** Python REAL de la maquina, multiplataforma. Devuelve null si no hay
 * interprete util — el llamador debe degradar con elegancia (sin daemon).
 * - Windows: `where python` y se descarta el stub del pymanager/WindowsApps.
 * - macOS: NUNCA se ejecuta el python3 del sistema ni /usr/bin/python3 —
 *   son stubs de Apple que disparan la ventana de Xcode CLT en cada llamada
 *   para usuarios sin herramientas de desarrollador. Solo rutas de Python
 *   real (Homebrew, python.org). El resultado se cachea (tambien el fallo). */
export function pythonBin(): string | null {
  if (sondeado) return pythonCache
  sondeado = true
  pythonCache = null
  const portatil = pythonPortatil()
  if (portatil) {
    pythonCache = portatil
    return pythonCache
  }
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
      // sin where.exe: sin python util
    }
  } else if (process.platform === 'darwin') {
    const candidatos: string[] = ['/opt/homebrew/bin/python3', '/usr/local/bin/python3']
    const base = '/Library/Frameworks/Python.framework/Versions'
    try {
      if (existsSync(base)) {
        const versiones = readdirSync(base)
          .filter((v) => /^\d+\./.test(v))
          .sort()
          .reverse()
        for (const v of versiones) candidatos.push(join(base, v, 'bin', 'python3'))
      }
    } catch {
      // sin framework de python.org
    }
    for (const bin of candidatos) {
      if (!existsSync(bin)) continue
      try {
        execFileSync(bin, ['--version'], { timeout: 10_000, stdio: 'ignore' })
        pythonCache = bin
        break
      } catch {
        continue
      }
    }
  } else {
    for (const bin of ['python3', 'python']) {
      try {
        execFileSync(bin, ['--version'], { timeout: 10_000, stdio: 'ignore' })
        pythonCache = bin
        break
      } catch {
        continue
      }
    }
  }
  return pythonCache
}
