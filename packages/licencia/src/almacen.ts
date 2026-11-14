import { renameSync, writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export interface SafeStorageMin {
  isEncryptionAvailable(): boolean
  encryptString(texto: string): Buffer
  decryptString(buffer: Buffer): string
}

export interface FsMin {
  escribir(ruta: string, bytes: Buffer): void
  leer(ruta: string): Buffer | null
  existe(ruta: string): boolean
  renombrar(de: string, a: string): void
  borrar(ruta: string): void
}

const fsReal: FsMin = {
  escribir: writeFileSync,
  leer: (ruta) => (existsSync(ruta) ? readFileSync(ruta) : null),
  existe: existsSync,
  renombrar: renameSync,
  borrar: unlinkSync
}

const XOR_FAKE = 0x5a

function xorBuffer(buffer: Buffer): Buffer {
  const salida = Buffer.from(buffer)
  for (let i = 0; i < salida.length; i++) salida[i] ^= XOR_FAKE
  return salida
}

export function crearSafeStorageFalso(opciones: { disponible?: boolean } = {}): SafeStorageMin {
  const disponible = opciones.disponible ?? true
  return {
    isEncryptionAvailable: () => disponible,
    encryptString: (texto) => Buffer.concat([Buffer.from('FALSO-'), xorBuffer(Buffer.from(texto, 'utf8'))]),
    decryptString: (buffer) => xorBuffer(buffer.subarray(6)).toString('utf8')
  }
}

export interface Almacen {
  guardar(jwt: string): void
  leer(): string | null
  borrar(): void
}

export function crearAlmacen(opciones: { carpeta: string; safeStorage: SafeStorageMin; fs?: FsMin }): Almacen {
  const fs = opciones.fs ?? fsReal
  const ruta = join(opciones.carpeta, 'licencia.dat')
  const rutaTmp = `${ruta}.tmp`

  return {
    guardar(jwt: string): void {
      const cifrado = opciones.safeStorage.isEncryptionAvailable()
      const bytes = cifrado
        ? Buffer.concat([Buffer.from([1]), opciones.safeStorage.encryptString(jwt)])
        : Buffer.concat([Buffer.from([0]), Buffer.from(Buffer.from(jwt, 'utf8').toString('base64'), 'latin1')])
      fs.escribir(rutaTmp, bytes)
      fs.renombrar(rutaTmp, ruta)
    },
    leer(): string | null {
      const bytes = fs.leer(ruta)
      if (!bytes || bytes.length < 2) return null
      try {
        if (bytes[0] === 1) return opciones.safeStorage.decryptString(bytes.subarray(1))
        if (bytes[0] === 0) return Buffer.from(bytes.subarray(1).toString('latin1'), 'base64').toString('utf8')
        return null
      } catch {
        return null
      }
    },
    borrar(): void {
      if (fs.existe(ruta)) fs.borrar(ruta)
    }
  }
}
