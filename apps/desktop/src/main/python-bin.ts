import { execFileSync } from 'node:child_process'

let pythonCache: string | null = null

/** Python REAL de la maquina, multiplataforma:
 * - Windows: `where python` y se descarta el stub del pymanager/WindowsApps.
 * - macOS/Linux: `python3` (mac no trae `python`); el stub /usr/bin/python3
 *   exige Xcode CLT y sale con error sin colgar — escalera de rutas. */
export function pythonBin(): string {
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
    const candidatos = ['python3', '/usr/bin/python3', '/opt/homebrew/bin/python3', '/usr/local/bin/python3', 'python']
    for (const bin of candidatos) {
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
