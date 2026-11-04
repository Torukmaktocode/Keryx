import { execFileSync } from 'node:child_process'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CARPETA = join(RAIZ, 'build', 'datos')
const MAX_PARTE = 1_800_000_000
const TAG = 'datos'

const gh = (args) => execFileSync('gh', args, { stdio: 'inherit' })

async function tarGz(serie, salida) {
  execFileSync('tar', ['-czf', salida, ...serie], { cwd: RAIZ, stdio: 'inherit' })
  console.log(`creado ${salida} (${(statSync(salida).size / 1e9).toFixed(2)} GB)`)
}

function partir(origen, base) {
  const total = statSync(origen).size
  const partes = Math.ceil(total / MAX_PARTE)
  const promesas = []
  let inicio = 0
  for (let n = 1; n <= partes; n++) {
    const desde = inicio
    const hasta = Math.min(total, inicio + MAX_PARTE)
    inicio = hasta
    const nombre = join(CARPETA, `${base}.${String(n).padStart(3, '0')}`)
    promesas.push(
      new Promise((ok, mal) => {
        const src = createReadStream(origen, { start: desde, end: hasta - 1 })
        const dst = createWriteStream(nombre)
        src.pipe(dst)
        dst.on('finish', () => {
          console.log(`${base}.${String(n).padStart(3, '0')} (${((hasta - desde) / 1e9).toFixed(2)} GB)`)
          ok()
        })
        dst.on('error', mal)
      })
    )
  }
  return Promise.all(promesas)
}

function ghDisponible() {
  try {
    execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const modo = process.argv[2] ?? 'ayuda'
if (!ghDisponible()) {
  console.error('Se requiere la CLI gh instalada y autenticada (gh auth login).')
  process.exit(1)
}

if (modo === 'preparar') {
  if (!existsSync(join(RAIZ, 'biblioteca'))) {
    console.error('No hay biblioteca/ en la raíz del repo.')
    process.exit(1)
  }
  rmSync(CARPETA, { recursive: true, force: true })
  mkdirSync(CARPETA, { recursive: true })
  await tarGz(['biblioteca'], join(RAIZ, 'biblioteca.tar.gz'))
  await partir(join(RAIZ, 'biblioteca.tar.gz'), 'biblioteca.tar.gz')
  rmSync(join(RAIZ, 'biblioteca.tar.gz'), { force: true })
  await tarGz(['-C', 'coalicion', 'articulos.jsonl'], join(RAIZ, 'coalicion.tar.gz'))
  await partir(join(RAIZ, 'coalicion.tar.gz'), 'coalicion.tar.gz')
  rmSync(join(RAIZ, 'coalicion.tar.gz'), { force: true })
  console.log('Listo en build/datos — sube con: node scripts/datos-macos.mjs subir')
} else if (modo === 'subir') {
  if (!existsSync(CARPETA)) {
    console.error('No hay build/datos; corre primero: node scripts/datos-macos.mjs preparar')
    process.exit(1)
  }
  let datosExiste = true
  try {
    execFileSync('gh', ['release', 'view', TAG], { stdio: 'ignore' })
  } catch {
    datosExiste = false
  }
  if (!datosExiste) {
    gh(['release', 'create', TAG, '-t', 'Datos de instalación Keryx', '-n', 'biblioteca + corpus Coalición (uso interno del repo privado)', '--prerelease'])
  }
  for (const parte of readdirSync(CARPETA)) {
    gh(['release', 'upload', TAG, join(CARPETA, parte), '--clobber'])
  }
  console.log('Subido. Ahora dispara el workflow build-mac en GitHub Actions.')
} else if (modo === 'limpiar') {
  rmSync(CARPETA, { recursive: true, force: true })
} else {
  console.log('uso: node scripts/datos-macos.mjs preparar | subir | limpiar')
}
