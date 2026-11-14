import { describe, expect, it, beforeEach } from 'vitest'
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { crearAlmacen, crearSafeStorageFalso } from './almacen'

const carpeta = mkdtempSync(join(tmpdir(), 'licencia-'))

describe('crearAlmacen', () => {
  beforeEach(() => {
    rmSync(join(carpeta, 'licencia.dat'), { force: true })
  })

  it('cifra y descifra con safeStorage', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso() })
    almacen.guardar('jwt-ejemplo.123')
    expect(almacen.leer()).toBe('jwt-ejemplo.123')
    const bytes = readFileSync(join(carpeta, 'licencia.dat'))
    expect(bytes[0]).toBe(1)
    expect(bytes.subarray(1).toString('latin1')).not.toContain('jwt-ejemplo')
  })

  it('fallback base64 cuando safeStorage no esta disponible', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso({ disponible: false }) })
    almacen.guardar('jwt-plano')
    expect(readFileSync(join(carpeta, 'licencia.dat'))[0]).toBe(0)
    expect(almacen.leer()).toBe('jwt-plano')
  })

  it('leer sin archivo devuelve null; borrar elimina', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso() })
    expect(almacen.leer()).toBeNull()
    almacen.guardar('x')
    almacen.borrar()
    expect(existsSync(join(carpeta, 'licencia.dat'))).toBe(false)
    expect(almacen.leer()).toBeNull()
  })

  it('archivo corrupto devuelve null sin lanzar', () => {
    const falso = { escribir: () => {}, existe: () => true, leer: () => Buffer.from([9, 9]), renombrar: () => {}, borrar: () => {} }
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso(), fs: falso })
    expect(almacen.leer()).toBeNull()
  })
})
