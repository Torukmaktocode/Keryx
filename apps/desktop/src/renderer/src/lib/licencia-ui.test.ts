import { describe, expect, it } from 'vitest'
import { mensajeDeEstado, esErrorLogin, necesitaBanner, codigoAKey } from './licencia-ui'

describe('mensajeDeEstado', () => {
  it('cada estado tiene su clave', () => {
    const estados = ['sin_licencia', 'trial', 'activa', 'cancelada', 'gracia', 'expirada', 'bloqueada'] as const
    for (const estado of estados) {
      const m = mensajeDeEstado({ estado })
      expect(m.clave).toBe(`licencia.estado.${estado}`)
    }
  })

  it('diasRestantes viaja como variable', () => {
    expect(mensajeDeEstado({ estado: 'trial', diasRestantes: 4 }).vars).toEqual({ dias: 4 })
  })
})

describe('esErrorLogin', () => {
  it('true para LicenciaError', () => {
    expect(esErrorLogin({ error: 'x', codigo: 'credenciales' })).toBe(true)
  })
  it('false para EstadoActual', () => {
    expect(esErrorLogin({ estado: 'activa' })).toBe(false)
  })
})

describe('codigoAKey', () => {
  it('mapea codigo o red', () => {
    expect(codigoAKey('limite_dispositivos')).toBe('licencia.error.limite_dispositivos')
    expect(codigoAKey(undefined)).toBe('licencia.error.red')
  })
})

describe('necesitaBanner', () => {
  it('solo trial y gracia', () => {
    expect(necesitaBanner({ estado: 'trial' })).toBe(true)
    expect(necesitaBanner({ estado: 'gracia' })).toBe(true)
    expect(necesitaBanner({ estado: 'activa' })).toBe(false)
  })
})
