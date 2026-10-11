/**
 * Creador de sermones, estudios y devocionales "nivel grandes".
 *
 * Ensambla evidencia de TODOS los modulos instalados (Biblia, comentarios,
 * Strong griego/hebreo/arameo, historico-geografico ISBE/Easton, tematico
 * Nave) y produce un documento completo. Si hay IA, un prompt maestro con
 * persona de los grandes predicadores/escritores lo desarrolla; sin IA
 * entrega el documento local estructurado.
 */
import { CANONICAL_BOOKS, type Verse } from '@keryx/core'
import { api } from './api'
import {
  type AssistantContext,
  type AssistantPassage,
  type AssistantResult,
  commentaryModules,
  pickBible,
  refLabel,
  safe,
  stripTags
} from './assistant'
import { parseReference } from './reference'
export type CreatorKind = 'crearsermon' | 'crearestudio' | 'creardevocional'

export type PersonaId =
  | 'lewis'
  | 'peterson'
  | 'champlin'
  | 'spurgeon'
  | 'lloydjones'
  | 'edwards'
  | 'calvino'
  | 'lutero'
  | 'tozer'
  | 'keller'
  | 'robinson'
  | 'agustin'
  | 'wesley'

export interface Persona {
  id: PersonaId
  name: string
  style: string
}

/** Los grandes predicadores y escritores teologos de la historia. */
export const PERSONAS: Persona[] = [
  {
    id: 'lewis',
    name: 'C. S. Lewis',
    style:
      'Apologista e imaginativo: razonamiento calido y racional, analogias cotidianas (estilo "mero cristianismo"), honestidad intelectual, conecta el anhelo profundo con el evangelio.'
  },
  {
    id: 'peterson',
    name: 'Eugene H. Peterson',
    style:
      'Pastor-poeta (voz PRINCIPAL): lenguaje ordinario, concreto y sin adorno; te baja el texto a la cocina, el trafico y la mesa; discipulado lento, oracion y scripture vividos; huye de la religion de consumo y del ruido; frases cortas, imagenes caseras, honestidad cansada pero esperanzada.'
  },
  {
    id: 'champlin',
    name: 'R. N. Champlin',
    style:
      'Comentario verso por verso (profundidad EXEGETICA principal): analisis historico-gramatical de cada versiculo, terminos del original (hebreo/arameo/griego) con transliteracion, contexto cultural del mundo antiguo, variantes textuales, silogismo doctrinal y tono doxologico; erudito metodic y pastoral al mismo tiempo.'
  },
  {
    id: 'spurgeon',
    name: 'Charles H. Spurgeon',
    style:
      'El principe de los predicadores: evangelistico, texto sobre texto, ilustraciones vividas, franqueza sobre el pecado, centrado en la cruz, llamado apasionado con teologia reformada calida.'
  },
  {
    id: 'lloydjones',
    name: 'D. Martyn Lloyd-Jones',
    style:
      'Expositivo-diagnostico: examina al oyente como medico, doctrina aplicada al corazon, logica progresiva punto por punto, seriedad eterna y consuelo en Cristo.'
  },
  {
    id: 'edwards',
    name: 'Jonathan Edwards',
    style:
      'Teologia del afecto: la verdadera religion reside en los afectos santos del corazon; precision doctrinal, imagenes sublimes de la gloria de Dios, urgencia eterna.'
  },
  {
    id: 'calvino',
    name: 'Juan Calvino',
    style:
      'Reformado claro y sobrio: sola scriptura, exegesis fiel, brevedad, la gloria de Dios como fin del mensaje, consuelo en la providencia.'
  },
  {
    id: 'lutero',
    name: 'Martin Lutero',
    style:
      'Cristocentrico y paradójico: ley que rompe y evangelio que sana, la cruz antes que la gloria, franqueza vigorosa y pastoral.'
  },
  {
    id: 'tozer',
    name: 'A. W. Tozer',
    style:
      'Profetico-devocional: exaltacion de la santidad de Dios, denuncia de la religion superficial, frases afiladas, adoracion como centro.'
  },
  {
    id: 'keller',
    name: 'Timothy Keller',
    style:
      'Apologista urbano: de la gran idea a las idolatrias del corazon, responde objeciones de escepticos, gracia que desarma la religiosidad, aplicacion cultural sofisticada.'
  },
  {
    id: 'robinson',
    name: 'Haddon W. Robinson',
    style:
      'La gran idea: exegesis fiel del texto, un solo concepto central que ordena todo el mensaje, subestructuras claras y aplicacion concreta.'
  },
  {
    id: 'agustin',
    name: 'Agustin de Hipona',
    style:
      'Confesional: el corazon inquieto hasta descansar en Dios, amor como orden del ser, retorica luminosa, honestidad sobre la lucha interior.'
  },
  {
    id: 'wesley',
    name: 'John Wesley',
    style:
      'Santidad y llamado: gracia que capacita a vivir como Cristo, urgencia evangelistica, disciplina comunitaria, amor a todos.'
  }
]

export function getPersona(id: string): Persona {
  const found = PERSONAS.find((p) => p.id === id)
  if (found) return found
  // Estilo por defecto: Eugene Peterson (voz pastoral) — pedido del usuario.
  return PERSONAS.find((p) => p.id === 'peterson') ?? PERSONAS[0]
}

// --------------------------------------------------------------------------- //
// Evidencia
// --------------------------------------------------------------------------- //
const extractStrongs = (html: string): string[] => {
  const found = new Set<string>()
  for (const match of html.matchAll(/data-strong="([GH]\d{1,6})"/gi)) found.add(match[1].toUpperCase())
  return [...found]
}

interface Evidence {
  bible: string
  commentaries: string
  strongs: string
  historyGeo: string
  topics: string
  passages: AssistantPassage[]
}

async function gatherEvidence(ctx: AssistantContext, query: string): Promise<Evidence> {
  const parsed = parseReference(query)
  const bible = pickBible(ctx)
  const passages: AssistantPassage[] = []
  let bibleText = ''
  let verseHtml = ''

  // 1) Texto biblico del pasaje (capitulo completo si no hay versiculo)
  if (parsed && bible) {
    const verses = await safe(api.bible.chapter({ module: bible, book: parsed.book, chapter: parsed.chapter }), [] as Verse[])
    if (verses.length) {
      const list = parsed.verse
        ? verses.filter((v) => v.verse === parsed.verse)
        : verses.slice(0, Math.min(verses.length, 8))
      const lines: string[] = []
      for (const verse of list) {
        const ref = refLabel(ctx, parsed.book, parsed.chapter, verse.verse)
        const text = stripTags(verse.text)
        lines.push(`**${ref}** — ${text}`)
        passages.push({ ref, module: bible, text })
        if (!verseHtml) verseHtml = verse.text
      }
      bibleText = lines.join('\n')
    }
  }

  // 2) Comentarios verso a verso (hasta 3 modulos)
  const comments: string[] = []
  if (parsed) {
    for (const commentary of commentaryModules(ctx).slice(0, 3)) {
      const comment = await safe(
        api.bible.verse({
          module: commentary.name,
          book: parsed.book,
          chapter: parsed.chapter,
          verse: parsed.verse ?? 1
        }),
        null
      )
      const plain = comment?.text ? stripTags(comment.text) : ''
      if (plain) comments.push(`[${commentary.name}] ${plain.slice(0, 2400)}`)
    }
  }

  // 3) Palabras originales (griego/hebreo/arameo via Strong)
  const strongs: string[] = []
  const keys = verseHtml ? extractStrongs(verseHtml).slice(0, 6) : []
  for (const key of keys) {
    const entry = await safe(api.dict.strongs(key), null)
    if (entry) strongs.push(`**${entry.key}** (${entry.language}) — ${entry.definition.slice(0, 700)}`)
  }

  // 4) Historico-geografico: entrada del libro en ISBE / Easton
  const history: string[] = []
  if (parsed) {
    const en = CANONICAL_BOOKS.find((b) => b.code === parsed.book)?.name ?? parsed.book
    for (const dictName of ['ISBE', 'Easton']) {
      const entry = await safe(api.dict.lookup({ module: dictName, key: en }), null)
      if (entry) history.push(`[${dictName} · ${en}] ${stripTags(entry).slice(0, 1600)}`)
    }
  }

  // 5) Tema en Nave (topical), si esta instalado
  let topics = ''
  const theme = firstThemeWord(query)
  const nave = ctx.modules.find((m) => m.name.toLowerCase() === 'nave')
  if (nave && theme) {
    const entry = await safe(api.dict.lookup({ module: nave.name, key: theme }), null)
    if (entry) topics = `[Nave · ${theme}] ${stripTags(entry).slice(0, 1600)}`
  }

  return {
    bible: bibleText,
    commentaries: comments.join('\n\n'),
    strongs: strongs.join('\n'),
    historyGeo: history.join('\n\n'),
    topics,
    passages
  }
}

function firstThemeWord(query: string): string {
  const word = query.trim().split(/\s+/)[0] ?? ''
  return word.length > 3 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
}

// --------------------------------------------------------------------------- //
// Prompt maestro + personas
// --------------------------------------------------------------------------- //
export const MASTER_PROMPT = [
  'Eres un homiletico y teologo del nivel de los grandes predicadores y escritores de la historia cristiana.',
  'Produce un documento COMPLETO y profesional (600-1200 palabras), listo para usar, en el idioma del usuario.',
  '',
  'Estructura requerida (encabezados ##):',
  '1. "Texto base y gran idea": cita el pasaje y formula la gran idea en una frase.',
  '2. "Contexto historico y geografico": autor, fecha, destinatarios, lugares (geografia real: ciudades, rutas, clima), costumbres y situacion politica-religiosa.',
  '3. "Palabras originales": hebreo, arameo o griego transliterado (numero Strong si consta), rango semantico y peso teologico.',
  '4. "Comentario verso a versiculo": exegesis compleja y honesta del pasaje, unidad literaria, sintaxis y retorica.',
  '5. "Hermeneutica": genero literario y sus reglas; puente cultural entre el mundo del texto y el hoy.',
  '6. "Homiletica": Gancho (necesidad humana) -> Concepto (exegesis) -> Ejemplo (vida moderna) -> Desafio (llamado a la accion).',
  '7. "Ilustraciones": al menos dos, concretas y memorables.',
  '8. "Aplicacion en la vida": concreta y medible para esta semana (hogar, trabajo, iglesia).',
  '9. "Oracion final".',
  '',
  'Reglas:',
  '- Cita referencias como "Libro Capitulo:Versiculo".',
  '- Usa la evidencia de los modulos instalados: sintetizala y atribuyela, no la copies entera.',
  '- No inventes citas, numeros ni datos; si algo no consta, dilo con honestidad.',
  '- Densidad: nada de relleno; cada parrafo sostiene la gran idea.'
].join('\n')

function personaPrompt(persona: Persona): string {
  return `ESTILO DEL ORADOR: ${persona.name}. ${persona.style}\nEscribe/predica COMO ${persona.name}: su voz, su enfoque y sus prioridades.`
}

const SERMON_ADDENDUM =
  'Ajusta el documento a un SERMON completo para predicar en voz alta, con tiempo estimado por seccion.'
const STUDY_ADDENDUM =
  'Ajusta el documento a un ESTUDIO BIBLICO: secciones Observacion, Interpretacion, Aplicacion y 5 Preguntas para profundizar.'
const DEVOTIONAL_ADDENDUM =
  'Ajusta el documento a un DEVOCIONAL: Versiculo clave, Reflexion calorosa y personal, Oracion y una Frase para llevar del dia.'

function addendum(kind: CreatorKind): string {
  if (kind === 'crearestudio') return STUDY_ADDENDUM
  if (kind === 'creardevocional') return DEVOTIONAL_ADDENDUM
  return SERMON_ADDENDUM
}

// --------------------------------------------------------------------------- //
// Documento local (sin IA)
// --------------------------------------------------------------------------- //
function composeLocal(
  kind: CreatorKind,
  ctx: AssistantContext,
  query: string,
  evidence: Evidence
): string {
  const parsed = parseReference(query)
  const ref = parsed ? refLabel(ctx, parsed.book, parsed.chapter, parsed.verse) : query
  const title = kind === 'crearestudio' ? 'Estudio biblico' : kind === 'creardevocional' ? 'Devocional' : 'Sermón'
  const lines: string[] = [`# ${title}: ${ref}`, '']

  if (evidence.bible) lines.push('## Texto base', '', evidence.bible, '')
  if (evidence.historyGeo) lines.push('## Contexto historico y geografico', '', evidence.historyGeo, '')
  if (evidence.strongs) lines.push('## Palabras originales (Strong)', '', evidence.strongs, '')
  if (evidence.topics) lines.push('## Temas relacionados (Nave)', '', evidence.topics, '')
  if (evidence.commentaries) lines.push('## Comentario', '', evidence.commentaries.slice(0, 3000), '')

  lines.push(
    '## Hermeneutica',
    '',
    '- Genero literario y reglas: ',
    '- Puente al presente: ',
    '',
    '## Homiletica',
    '',
    '1. **Gancho** — Necesidad humana: ',
    '2. **Concepto (exegesis)** — Gran idea: ',
    '3. **Ejemplo** — Caso moderno: ',
    '4. **Desafio** — Accion concreta: ',
    '',
    '## Aplicacion en la vida',
    '',
    '- En casa: ',
    '- En el trabajo/estudio: ',
    '- En la iglesia: ',
    '',
    '## Oracion',
    ''
  )
  if (!evidence.bible && !evidence.commentaries) {
    lines.unshift(
      `> Sin IA activa ni coincidencias exactas para **${query}**; esqueleto listo para completar.`,
      ''
    )
  }
  return lines.join('\n')
}

// --------------------------------------------------------------------------- //
// Entrada principal
// --------------------------------------------------------------------------- //
export async function runCreator(
  ctx: AssistantContext,
  kind: CreatorKind,
  query: string,
  personaId: string
): Promise<AssistantResult> {
  const trimmed = query.trim()
  if (!trimmed) return { markdown: '', passages: [], aiUsed: false }

  const evidence = await gatherEvidence(ctx, trimmed)
  const local = composeLocal(kind, ctx, trimmed, evidence)

  if (!ctx.settings.aiEnabled) {
    return { markdown: local, passages: evidence.passages, aiUsed: false }
  }

  try {
    const language = ctx.locale === 'en' ? 'English' : ctx.locale === 'pt' ? 'Portuguese' : 'Spanish'
    const persona = getPersona(personaId)
    const user = [
      personaPrompt(persona),
      addendum(kind),
      '',
      `Tema o pasaje: ${trimmed}`,
      '',
      'EVIDENCIA DE LOS MODULOS INSTALADOS (sintetizala y atribuyela):',
      evidence.bible ? `--- Texto base ---\n${evidence.bible}` : '',
      evidence.commentaries ? `--- Comentarios ---\n${evidence.commentaries}` : '',
      evidence.strongs ? `--- Palabras originales ---\n${evidence.strongs}` : '',
      evidence.historyGeo ? `--- Historico/geografico ---\n${evidence.historyGeo}` : '',
      evidence.topics ? `--- Tematico ---\n${evidence.topics}` : ''
    ]
      .filter(Boolean)
      .join('\n\n')

    const result = await api.ai.chat({
      messages: [
        { role: 'system', content: `${MASTER_PROMPT}\n\nResponde en ${language}.` },
        { role: 'user', content: user }
      ],
      temperature: 0.55,
      maxTokens: 3600
    })
    return { markdown: result.text, passages: evidence.passages, aiUsed: true }
  } catch (error) {
    return {
      markdown: local,
      passages: evidence.passages,
      aiUsed: false,
      notice: error instanceof Error ? error.message : String(error)
    }
  }
}
