// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import {
  buildDossier,
  dossierForPrompt,
  renderDossier,
  DOSSIER_BUDGET,
  type AgentHook
} from './agents'

function fakeHook(overrides: Partial<AgentHook> = {}): AgentHook {
  return {
    modules: [
      {
        name: 'Reina Valera 1960',
        description: 'RV60',
        category: 'Bible',
        lang: 'es',
        driver: 'e-Sword .bbli',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Comentario Real',
        description: '',
        category: 'Commentary',
        lang: 'es',
        driver: 'e-Sword .cmti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Indice Tematico de la Biblia NAVE',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario de Geografia Biblica - H Martens',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario de Anecdotas',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario Teologico Enciclopedico',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario de Filosofia Brugger',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Usos y Costumbres de las Tierras Biblicas - Fred Wight',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Lexico Griego-Espanol del NT - Alfred Tuggy',
        description: '',
        category: 'Lexicon',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario Morfologico Robinson',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Diccionario Lambert - Paralelos-Concordancias-Analogias',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Teologia Sistematica - Charles Hodge',
        description: '',
        category: 'GenBook',
        lang: 'es',
        driver: 'e-Sword .refi',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Historia del Cristianismo - Justo Gonzalez',
        description: '',
        category: 'GenBook',
        lang: 'es',
        driver: 'e-Sword .refi',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Donde Hallarlo en la Biblia - K Anderson',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Enciclopedia de Citas Morales - Samuel Vila',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      },
      {
        name: 'Lenguaje Popular Religioso',
        description: '',
        category: 'Dictionary',
        lang: 'es',
        driver: 'e-Sword .dcti',
        encoding: 'UTF-8',
        version: '',
        installed: true,
        source: 'local'
      }
    ],
    locale: 'es',
    priorityModules: [],
    selectedModule: '',
    chapter: async () => [{ verse: 16, text: '<w data-strong="G26">amor</w> de Dios' }],
    verse: async () => ({ verse: 16, text: 'Comentario anclado del verso.' }),
    coverage: async () => [{ module: 'Comentario Real', hits: 3 }],
    lookup: async (module, key) => `Entrada de ${module} para ${key}. `.repeat(3),
    strongs: async () => ({ key: 'G26', language: 'greek', definition: 'amore agape def' }),
    search: async () => [
      { module: 'Diccionario de Anecdotas', book: 'Paciencia', chapter: 0, verse: 0, text: 'a…' }
    ],
    ...overrides
  }
}

describe('buildDossier (sub-agentes 0 tokens)', () => {
  it('ancla texto + comentario + strongs + temas + geo + ilustraciones con citas', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const kinds = dossier.sections.map((s) => s.kind)
    expect(kinds).toContain('texto')
    expect(kinds).toContain('comentario')
    expect(kinds).toContain('strongs')
    expect(kinds).toContain('tema')
    expect(kinds).toContain('historico')
    expect(kinds).toContain('ilustracion')
    expect(dossier.citations.length).toBeGreaterThan(3)
    expect(dossier.chars).toBeLessThanOrEqual(DOSSIER_BUDGET)
  })

  it('recorta las entradas largas y respeta el presupuesto', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    for (const section of dossier.sections) {
      for (const entry of section.entries) expect(entry.length).toBeLessThan(950)
    }
  })

  it('extrae los Strong# del markup del verso', async () => {
    const dossier = await buildDossier(fakeHook(), 'verse', 'Juan 3:16')
    const strongs = dossier.sections.find((s) => s.kind === 'strongs')
    expect(strongs?.entries[0]).toContain('G26')
  })

  it('trata un tema sin referencia (topic mode) via Nave', async () => {
    const dossier = await buildDossier(fakeHook(), 'topic', 'esperanza de la gloria')
    const temas = dossier.sections.find((s) => s.kind === 'tema')
    expect(temas?.title).toContain('Esperanza')
  })

  it('render markdown y prompt contienen las secciones citadas', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const md = renderDossier(dossier)
    const prompt = dossierForPrompt(dossier)
    expect(md).toContain('## Comentario')
    expect(prompt).toContain('### Temas')
    expect(prompt.length).toBeLessThanOrEqual(DOSSIER_BUDGET * 1.2)
  })

  it('sin pasaje ni tema no explota', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearestudio', 'sobre la merced')
    expect(dossier.sections.length).toBeGreaterThan(0)
  })

  it('contextos de profundidad: teologico/cultural/filosofico anclados por tema y verso', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const kinds = dossier.sections.map((s) => s.kind)
    expect(kinds).toContain('teologico')
    expect(kinds).toContain('cultural')
    expect(kinds).toContain('filosofico')
    const theo = dossier.sections.find((s) => s.kind === 'teologico')
    expect(theo?.entries[0]).toContain('Diccionario Teologico Enciclopedico')
  })

  it('temas del verso alimentan los diccionarios generales cuando la consulta es solo referencia', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const cultural = dossier.sections.find((s) => s.kind === 'cultural')
    expect(cultural?.entries[0]).toContain('Usos y Costumbres')
  })

  it('idiomas originales: lexico griego keyeado por palabra del verso (Tuggy)', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const idiomas = dossier.sections.find((s) => s.kind === 'idiomas')
    expect(idiomas?.entries[0]).toContain('Tuggy')
    expect(idiomas?.entries[0]).toContain('**AMOR**')
  })

  it('morfologia gramatical: codigo del verso resuelto por Robinson', async () => {
    const hook = fakeHook({
      chapter: async () => [
        { verse: 16, text: '<w data-strong="G26">amor</w> <num>G25 VAAI3S</num> mundo' }
      ]
    })
    const dossier = await buildDossier(hook, 'crearsermon', 'Juan 3:16')
    const morph = dossier.sections.find((s) => s.kind === 'morfologia')
    expect(morph?.entries[0]).toContain('VAAI3S')
    expect(morph?.entries[0]).toContain('Robinson')
  })

  it('paralelos y analogias via Lambert con temas del verso', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const refs = dossier.sections.find((s) => s.kind === 'referencia')
    expect(refs?.entries[0]).toContain('Lambert')
  })

  it('libros .refi: teologia sistematica e historia por busqueda con portadas excluidas', async () => {
    const hook = fakeHook({
      search: async (_q, modules) =>
        (modules?.[0] ?? '').includes('Hodge')
          ? [
              { module: 'm', book: 'Contenido', chapter: 0, verse: 0, text: 'indice' },
              { module: 'm', book: 'Capítulo 1: El método', chapter: 2, verse: 0, text: 'parrafo sobre amor del verso' }
            ]
          : [{ module: 'm', book: 'Portada', chapter: 0, verse: 0, text: 'portada de la historia' }]
    })
    const dossier = await buildDossier(hook, 'crearsermon', 'Juan 3:16')
    const syst = dossier.sections.find((s) => s.kind === 'sistematica')
    expect(syst?.entries[0]).toContain('Teologia Sistematica - Charles H')
    expect(syst?.entries[0]).toContain('Capítulo 1')
    const hist = dossier.sections.find((s) => s.kind === 'historia')
    expect(hist).toBeUndefined()
  })

  it('exegesis critica por verso (Metzger/aparato/interlineal) y prioriza comentarios pesados', async () => {
    const hook = fakeHook({
      modules: [
        ...fakeHook().modules,
        {
          name: 'Un Comentario Textual al NT Griego - Bruce M Metzger',
          description: '',
          category: 'Commentary',
          lang: 'es',
          driver: 'e-Sword .cmti',
          encoding: 'UTF-8',
          version: '',
          installed: true,
          source: 'local'
        },
        {
          name: 'Comentario Juan Calvino',
          description: '',
          category: 'Commentary',
          lang: 'es',
          driver: 'e-Sword .cmti',
          encoding: 'UTF-8',
          version: '',
          installed: true,
          source: 'local'
        }
      ],
      coverage: async () => [
        { module: 'A Traves de la Biblia - Myer Pearlman', hits: 9 },
        { module: 'Comentario Juan Calvino', hits: 9 },
        { module: 'Un Comentario Textual al NT Griego - Bruce M Metzger', hits: 9 }
      ]
    })
    const dossier = await buildDossier(hook, 'crearsermon', 'Juan 3:16')
    const coment = dossier.sections.find((s) => s.kind === 'comentario')
    expect(coment?.entries[0]).toMatch(/Calvino|Metzger|Traves/)
    expect(coment?.entries.some((e) => e.includes('Calvino'))).toBe(true)
    const critico = dossier.sections.find((s) => s.kind === 'critico')
    expect(critico?.entries[0]).toContain('Grie…')
  })

  it('casos biblicos reales: ancla Nave/DondeHallarlo por libro o tema del verso', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const caso = dossier.sections.find((s) => s.kind === 'caso')
    expect(caso?.entries[0]).toContain('Donde Hallarlo')
  })

  it('citas sabias (Vila) y figuras (Lenguaje Popular) ancladas por tema', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const citas = dossier.sections.find((s) => s.kind === 'cita')
    expect(citas?.entries[0]).toContain('Vila')
    const figura = dossier.sections.find((s) => s.kind === 'figura')
    expect(figura?.entries[0]).toContain('Lenguaje Popular Re')
  })

  it('geografia del verso: lugares y usos encontrados por tema', async () => {
    const dossier = await buildDossier(fakeHook(), 'crearsermon', 'Juan 3:16')
    const geo = dossier.sections.find((s) => s.kind === 'geografia')
    expect(geo?.entries.length).toBeGreaterThan(0)
    expect(geo?.entries[0]).toMatch(/Martens|Geografia|Usos|Arqueolog/i)
  })
})

// debug
