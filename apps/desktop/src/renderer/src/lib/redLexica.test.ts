import { describe, expect, it } from 'vitest'
import { buildIntent, TEMAS_INTENT } from './intent'
import { PATRONES, patronDeTema, patronLineas } from './redLexica'
import { buildSermonDocument, renderSermon } from './sermonEngine'
import type { Dossier } from './agents'

const dossierVacio: Dossier = { query: '', section: 'Mateo 11:28', sections: [], citations: [], chars: 0 }

describe('red léxica estadística (0 tokens)', () => {
  it('cada tema del léxico de intención tiene su Patrón Cristo y apostólico', () => {
    for (const tema of TEMAS_INTENT) {
      const patron = patronDeTema(tema)
      expect(patron, `falta patrón para: ${tema}`).toBeDefined()
      expect(patron!.cristo.ref.length).toBeGreaterThan(4)
      expect(patron!.cristo.frase.length).toBeGreaterThan(8)
      expect(patron!.cristo.voz).toBe('Jesús')
      expect(patron!.apostoles.length).toBeGreaterThanOrEqual(2)
      for (const a of patron!.apostoles) expect(a.frase.length).toBeGreaterThan(8)
    }
  })

  it('cada clave de PATRONES es un tema real del léxico (sin huérfanos)', () => {
    for (const clave of Object.keys(PATRONES)) {
      expect(TEMAS_INTENT, `patrón huérfano: ${clave}`).toContain(clave)
    }
  })

  it('tema desconocido: sin patrón, sin invención (principio de silencio)', () => {
    expect(patronDeTema('tema que no existe')).toBeUndefined()
    expect(patronLineas('tema que no existe')).toEqual([])
  })

  it('las líneas citadas llevan la cita entre paréntesis y el modo', () => {
    const lines = patronLineas('el cansancio y la carga')
    expect(lines[0]).toContain('Como lo abrió Jesús')
    expect(lines[0]).toContain('Mateo 11:28')
    expect(lines[0]).toContain('Venid a mí')
    expect(lines.some((l) => l.includes('Como lo habló'))).toBe(true)
  })
})

describe('conexión con la petición por código', () => {
  it('el tema de la petición conecta el gancho con el Patrón Cristo', () => {
    const intent = buildIntent('un sermón para los que vienen agotados y cargados', 'crearsermon')
    expect(intent.tema).toBe('el cansancio y la carga')
    const doc = buildSermonDocument(dossierVacio, { id: 'none', name: 'Tu voz', style: '' }, 'Mateo 11', intent)
    const md = renderSermon(doc)
    expect(md).toContain('Como lo abrió Jesús')
    expect(md).toContain('Mateo 11:28')
  })

  it('sin tema reconocido: la frase literal llega al gancho (conexión igual garantizada)', () => {
    const intent = buildIntent('Juan 3:16', 'crearsermon')
    const doc = buildSermonDocument(dossierVacio, { id: 'none', name: 'Tu voz', style: '' }, 'Juan 3:16', intent)
    const md = renderSermon(doc)
    expect(md).toContain('Juan 3:16')
    expect(md).not.toContain('Como lo abrió Jesús')
  })

  it('sin tema: la frase literal va al gancho por el eco de la petición', () => {
    const intent = buildIntent('hablar de tomar la mano de la niña', 'crearsermon')
    const doc = buildSermonDocument(dossierVacio, { id: 'none', name: 'Tu voz', style: '' }, 'Marcos 5', intent)
    expect(doc.gancho.fallback).toContain(intent.raw)
  })
})

describe('barrido anti-placeholder (código, no IA)', () => {
  it('el render nunca deja corchetes-guía en el sermón final', () => {
    const doc = buildSermonDocument(dossierVacio, { id: 'none', name: 'Tu voz', style: '' }, 'Mateo 11', undefined)
    const md = renderSermon(doc)
    const guia = (md.match(/\[[^\]\n]{14,180}\]/g) ?? []).filter((m) => !m.includes('·'))
    expect(guia).toEqual([])
    expect(md).not.toContain('[Lean el texto en voz alta')
    expect(md).not.toContain('[concreto con')
  })

  it('las citas ancladas con módulo·entrada se conservan intactas', () => {
    const conCitas: Dossier = {
      query: '',
      section: 'Mateo 11:28',
      sections: [],
      citations: [{ kind: 'comentario', module: 'Calvino Mateo', entry: 'Mt 11:28' }],
      chars: 0
    }
    const doc = buildSermonDocument(conCitas, { id: 'none', name: 'Tu voz', style: '' }, 'Mateo 11', undefined)
    expect(renderSermon(doc)).toContain('[Calvino Mateo · Mt 11:28]')
  })
})
