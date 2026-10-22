import { describe, expect, it } from 'vitest'
import { buildSlides, takeLines, truncate, TARGET_SLIDES } from './presentation'
import type { SermonDocument, Slot } from './sermonEngine'

const slot = (fallback: string): Slot => ({ fallback })

function mkDoc(overrides: Partial<SermonDocument> = {}): SermonDocument {
  const base: SermonDocument = {
    ref: 'Juan 3:16',
    orador: 'Peterson',
    personaId: 'peterson',
    voiceHeader: 'Peterson — narrativo',
    gancho: slot('Comencemos con la Palabra misma: «Juan 3:16». El amor de Dios se anuncia de entrada.'),
    intro: slot('Hoy abrimos Juan 3:16: el amor de Dios entrega lo más precioso.'),
    texto: [
      '16 Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
      '17 Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.'
    ],
    granIdea: 'El amor de Dios entrega lo más precioso por la vida del mundo.',
    contexto: [
      { label: 'Histórico', text: 'Nicodemo vino de noche, con preguntas honestas y miedo al juicio.' },
      { label: 'Cultural', text: 'El encuentro de madrugada era señal de urgencia y discreción.' }
    ],
    palabras: ['**G25**: agapao (amar): el texto lo ancla con el número Strong.'],
    forma: 'narrativa',
    puntos: [
      { signal: 'Primeramente…', title: 'La fuente del amor', evidence: 'Dios amó primero y el texto lo declara con claridad.', bridge: slot('') },
      { signal: 'En segundo lugar…', title: 'La entrega del amor', evidence: 'La medida del amor es la cruz, no el discurso.', bridge: slot('El puente de la entrega concreta.') },
      { signal: 'Y para concluir…', title: 'La vida del amor', evidence: 'Vida eterna para todo aquel que en él cree.', bridge: slot('') }
    ],
    citas: ['«El amor no es una teoría, es una entrega.» — Anónimo'],
    casoReal: ['El discípulo que amó hasta el final dejó escrito este pasaje.'],
    ilustracion: ['La imagen del sol que amanece sin pedir permiso.'],
    consenso: ['La iglesia confiesa el amor de Dios como dato primero.'],
    aplicacion: ['En casa: repite la frase con los tuyos.', 'En el trabajo: la entrega se mide en gestos concretos.'],
    meditacion: slot('Lleva contigo esta semana: «Juan 3:16».'),
    cierre: {
      recap: 'Vuelve al texto central y repítelo a la congregación.',
      llamado: 'Invita a tu familia a leerlo esta noche.',
      bendicion: 'El Señor te bendiga y te guarde.'
    },
    oracion: slot('Dios, gracias porque tu Palabra habló primero a otro mundo y hoy nos habla a nosotros.'),
    fuentes: [],
    dossierChars: 100
  }
  return { ...base, ...overrides }
}

function withDoc(overrides: Partial<SermonDocument>): SermonDocument {
  return mkDoc(overrides)
}

describe('sub-agente de presentación (buildSlides, 0 tokens)', () => {
  it('siempre devuelve exactamente 10 diapositivas', () => {
    expect(buildSlides(mkDoc())).toHaveLength(TARGET_SLIDES)
  })

  it('aún con 0 puntos y sin contexto llena hasta 10 con piezas reales del AST', () => {
    const doc = withDoc({ puntos: [], contexto: [], texto: [] })
    const slides = buildSlides(doc)
    expect(slides).toHaveLength(TARGET_SLIDES)
    for (const slide of slides) {
      const hasContent = slide.title.length > 0 || slide.lines.some(Boolean) || Boolean(slide.quote)
      expect(hasContent).toBe(true)
    }
  })

  it('ninguna diapositiva queda vacía (título + líneas o cita)', () => {
    const doc = withDoc({ aplicacion: [], citas: [], casoReal: [], ilustracion: [], consenso: [], palabras: [] })
    for (const slide of buildSlides(doc)) {
      expect(slide.title.length).toBeGreaterThan(0)
      expect(slide.lines.some((l) => l.length > 0) || (slide.quote ?? '').length > 0).toBe(true)
    }
  })

  it('legibilidad: ninguna línea supera el presupuesto de caracteres', () => {
    for (const slide of buildSlides(mkDoc())) {
      for (const line of slide.lines) {
        expect(line.length).toBeLessThanOrEqual(192)
      }
      expect(slide.quote?.length ?? 0).toBeLessThanOrEqual(310)
    }
  })

  it('determinista: dos llamadas producen el mismo deck', () => {
    const doc = mkDoc()
    expect(buildSlides(doc)).toEqual(buildSlides(doc))
  })

  it('la primera es el título con la referencia y la última el cierre con la oración', () => {
    const slides = buildSlides(mkDoc())
    expect(slides[0].kind).toBe('titulo')
    expect(slides[0].title).toBe('Juan 3:16')
    expect(slides[TARGET_SLIDES - 1].kind).toBe('cierre')
    expect(slides[TARGET_SLIDES - 1].quote).toContain('Dios, gracias')
  })

  it('los tres puntos del bosquejo aparecen como diapositivas con su señal', () => {
    const puntos = buildSlides(mkDoc()).filter((s) => s.kind === 'punto')
    expect(puntos).toHaveLength(3)
    expect(puntos.map((p) => p.title)).toEqual(['La fuente del amor', 'La entrega del amor', 'La vida del amor'])
    expect(puntos[0].kicker).toBe('Primeramente…')
  })

  it('usa el puente de voz cuando existe y cae a la evidencia cuando no', () => {
    const slides = buildSlides(mkDoc()).filter((s) => s.kind === 'punto')
    expect(slides[1].lines[0]).toContain('puente de la entrega')
    expect(slides[0].lines[0]).toContain('amó primero')
  })

  it('con muchos puntos usa solo los primeros 3 y mantiene 10', () => {
    const doc = withDoc({
      puntos: ['a', 'b', 'c', 'd', 'e'].map((letter, index) => ({
        signal: `Señal ${index}`,
        title: `Punto ${letter}`,
        evidence: `Evidencia del punto ${letter}.`,
        bridge: slot('')
      }))
    })
    const slides = buildSlides(doc)
    expect(slides).toHaveLength(TARGET_SLIDES)
    expect(slides.filter((s) => s.kind === 'punto')).toHaveLength(3)
  })
})

describe('recortes legibles (takeLines / truncate)', () => {
  it('truncate corta en frontera de palabra con elipsis', () => {
    const out = truncate('una frase corta y una frase muy larguisima despues de la frontera', 22)
    expect(out.length).toBeLessThanOrEqual(23)
    expect(out.endsWith('…')).toBe(true)
  })

  it('truncate respeta textos cortos sin recortar', () => {
    expect(truncate('texto breve', 40)).toBe('texto breve')
  })

  it('takeLines devuelve al menos una línea si hay texto y respeta el máximo', () => {
    const lines = takeLines('Primera frase. Segunda frase. Tercera frase. Cuarta frase.', 3, 40)
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.length).toBeLessThanOrEqual(3)
    for (const line of lines) expect(line.length).toBeLessThanOrEqual(41)
  })
})
