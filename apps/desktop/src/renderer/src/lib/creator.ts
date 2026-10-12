/**
 * Creador de sermones, estudios y devocionales "nivel grandes".
 *
 * ARQUITECTURA: los sub-agentes (agents.ts, 0 tokens) anclan la evidencia de
 * los modulos reales en un dosier citado. La IA solo REDACTA encima del
 * dosier (cerebro). Sin IA (o si falla), el composer determinista crea el
 * documento COMPLETO con la misma logica pastoral, sin romper el mensaje,
 * y avisa explicitamente que fue ensamblado localmente.
 */
import type { AssistantContext, AssistantPassage, AssistantResult } from './assistant'
import { refLabel, stripTags } from './assistant'
import { api } from './api'
import { apiHook, buildDossier, dossierForPrompt, type Dossier } from './agents'
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
      'Pastor-poeta (voz PRINCIPAL): lenguaje ordinario, concreto y sin adorno; te baja el texto a la cocina, el trafico y la mesa; discipulado lento, oracion y Escritura vividas; huye de la religion de consumo y del ruido; frases cortas, imagenes caseras, honestidad cansada pero esperanzada.'
  },
  {
    id: 'champlin',
    name: 'R. N. Champlin',
    style:
      'Exegeta verso a verso: analisis historico-gramatical de cada versiculo, terminos del original con transliteracion, contexto cultural del mundo antiguo, variantes textuales, silogismo doctrinal y tono doxologico.'
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
    name: 'Juan Wesley',
    style:
      'Evangelista metodico: disciplina de santidad, predicacion al aire libre, amor perfecto, claro y directo al oyente comun.'
  }
]

export function getPersona(id: string): Persona {
  const found = PERSONAS.find((p) => p.id === id)
  if (found) return found
  return PERSONAS.find((p) => p.id === 'peterson') ?? PERSONAS[0]
}

/* ------------------------------------------------------------------ prompt */

export const MASTER_PROMPT = [
  'Eres un homiletico y teologo del nivel de los grandes predicadores y escritores de la historia cristiana.',
  'Produce un documento COMPLETO y profesional (900-1500 palabras), listo para predicar, en el idioma del usuario.',
  '',
  'REGLA DE ORO: usa EXCLUSIVAMENTE la evidencia del DOSSIER anclado. Cada afirmacion expositiva debe poder rastrearse a una cita [Modulo · entrada].',
  'No inventes citas biblicas, datos historicos, numeros Strong ni hechos; si algo no consta en el dosier, dilo con honestidad o dejalo como [PUNTO POR COMPLETAR].',
  '',
  'Estructura requerida (encabezados ##):',
  '1. "Texto base y gran idea": cita el pasaje y formula la gran idea en una frase.',
  '2. "Contexto historico y geografico": autor, fecha probable (si consta), destinatarios, geografia real y costumbres del DOSIER.',
  '3. "Palabras originales": terminos Strong transliterados con su rango semantico segun las definiciones citadas.',
  '4. "Comentario verso a versiculo": exegesis fiel siguiendo los comentarios anclados, con unidad literaria y sintaxis.',
  '5. "Hermeneutica": genero literario y reglas; puente honesto entre el mundo del texto y hoy.',
  '6. "Homiletica": Gancho (necesidad humana) -> Gran idea -> Ejemplo -> Desafio.',
  '7. "Ilustraciones": usa primero las del dosier; al menos dos si constan.',
  '8. "Aplicacion en la vida": concreta y medible (hogar, trabajo, iglesia).',
  '9. "Oracion final".',
  '',
  '- Cita referencias como "Libro Capitulo:Versiculo".',
  '- Densidad: nada de relleno; todo parrafo sostiene la gran idea.'
].join('\n')

function personaPrompt(persona: Persona): string {
  return `ESTILO DEL ORADOR: ${persona.name}. ${persona.style}\nEscribe/predica COMO ${persona.name}: su voz, su enfoque y sus prioridades.`
}

const SERMON_ADDENDUM =
  'Tipo: SERMON completo para predicar en voz alta, con tiempo estimado por seccion.'
const STUDY_ADDENDUM =
  'Tipo: ESTUDIO BIBLICO con secciones Observacion, Interpretacion, Aplicacion y 5 preguntas para profundizar.'
const DEVOTIONAL_ADDENDUM =
  'Tipo: DEVOCIONAL con Versiculo clave, Reflexion calorosa y personal, Oracion y Frase para llevar del dia.'

function addendum(kind: CreatorKind): string {
  if (kind === 'crearestudio') return STUDY_ADDENDUM
  if (kind === 'creardevocional') return DEVOTIONAL_ADDENDUM
  return SERMON_ADDENDUM
}

const TITLE_FOR: Record<CreatorKind, string> = {
  crearsermon: 'Sermón',
  crearestudio: 'Estudio bíblico',
  creardevocional: 'Devocional'
}

const LOCAL_NOTICE =
  '> ⚠ **Documento ensamblado localmente (sin IA).** El mensaje bíblico está intacto y anclado a tus fuentes; revisa los espacios marcados con [ … ] y personaliza el estilo antes de predicar.'

/* ---------------------------------------------------------------- composer */

function firstSentence(text: string): string {
  const plain = stripTags(text)
  const cut = plain.search(/[.!?](\s|$)/)
  const sentence = cut > 0 ? plain.slice(0, cut + 1) : plain
  return sentence.length > 220 ? `${sentence.slice(0, 218)}…` : sentence
}

function sectionEntries(dossier: Dossier, kind: Dossier['sections'][number]['kind']): string[] {
  return dossier.sections.filter((s) => s.kind === kind).flatMap((s) => s.entries)
}

/** Composer determinista: documento COMPLETO desde el dosier (IA off/caida). */
export function composeFromDossier(
  kind: CreatorKind,
  ctx: AssistantContext,
  query: string,
  dossier: Dossier,
  persona: Persona
): string {
  const parsed = parseReference(query)
  const ref = parsed ? refLabel(ctx, parsed.book, parsed.chapter, parsed.verse) : query
  const textLines = sectionEntries(dossier, 'texto')
  const commentLines = sectionEntries(dossier, 'comentario')
  const outlineLines = sectionEntries(dossier, 'bosquejo')
  const strongLines = sectionEntries(dossier, 'strongs')
  const topicLines = sectionEntries(dossier, 'tema')
  const historyLines = sectionEntries(dossier, 'historico')
  const illusLines = sectionEntries(dossier, 'ilustracion')
  const theoLines = sectionEntries(dossier, 'teologico')
  const culturalLines = sectionEntries(dossier, 'cultural')
  const christLines = sectionEntries(dossier, 'cristologico')
  const philoLines = sectionEntries(dossier, 'filosofico')
  const bridgeLines = sectionEntries(dossier, 'aplicacion')
  const critLines = sectionEntries(dossier, 'critico')

  const lines: string[] = [
    `# ${TITLE_FOR[kind]}: ${ref}`,
    '',
    LOCAL_NOTICE,
    '',
    `> Estilo sugerido: voz de **${persona.name}** · Fuentes ancladas: **${dossier.citations.length}** de ${dossier.citations.length} módulos · Dosier: ${dossier.chars} caracteres.`,
    ''
  ]

  // 1) Texto base y gran idea
  lines.push('## Texto base y gran idea', '')
  if (textLines.length) {
    const gran = firstSentence(commentLines[0] ?? topicLines[0] ?? '')
    lines.push(`**${dossier.section ?? ref}**`)
    lines.push(...textLines)
    lines.push(
      '',
      `**Gran idea (borrador):** ${gran || '[Completa la gran idea leyendo el pasaje en voz alta.]'}`,
      ''
    )
  } else {
    lines.push(`(sin pasaje biblico anclado para "${query}" — define la referencia)`, '')
  }

  // 2) Contexto historico y geografico
  lines.push('## Contexto historico y geografico', '')
  if (historyLines.length) {
    lines.push(...historyLines.map((entry) => `- ${entry}`), '')
  } else {
    lines.push('[Punto por completar: autor, fecha y destinatarios del pasaje — consulta la Guía del Pasaje.]', '')
  }

  // 2b) Contextos de profundidad (solo secciones con contenido anclado)
  if (theoLines.length) {
    lines.push(
      '## Contexto teologico y sistematico',
      '',
      ...theoLines.map((entry) => `- ${entry}`),
      ''
    )
  }
  if (christLines.length) {
    lines.push('## Contexto cristologico', '', ...christLines.map((entry) => `- ${entry}`), '')
  }
  if (culturalLines.length) {
    lines.push('## Contexto social y cultural', '', ...culturalLines.map((entry) => `- ${entry}`), '')
  }
  if (philoLines.length) {
    lines.push('## Contexto filosofico', '', ...philoLines.map((entry) => `- ${entry}`), '')
  }
  if (critLines.length) {
    lines.push('## Exegesis critica e interlineal', '', ...critLines.map((entry) => `- ${entry}`), '')
  }

  // 3) Palabras originales
  if (strongLines.length) {
    lines.push('## Palabras originales (Strong)', '', ...strongLines.map((entry) => `- ${entry}`), '')
  } else {
    lines.push(
      '## Palabras originales (Strong)',
      '',
      '[Punto por completar: usa una biblia con Strong# o la Guía Exegética del Estudio.]',
      ''
    )
  }

  // 4) Comentario verso a verso
  lines.push('## Comentario verso a versiculo', '')
  lines.push(...(commentLines.length ? commentLines : ['[Punto por completar: elige un comentario con cobertura en el Estudio.]']), '')

  // 5) Bosquejo anclado (Sermones y Bosquejos / Wiersbe)
  if (outlineLines.length) {
    lines.push('## Bosquejo homiletico anclado', '', ...outlineLines, '')
  }

  // 6) Hermeneutica guiada
  lines.push(
    '## Hermeneutica',
    '',
    '- **Genero literario y reglas:** [marca el genero: relato, ley, profecia, sabiduria, parabola, epistola…] y sus reglas de lectura.',
    '- **Puente al presente:** [donde se repite hoy la situacion del texto.]',
    ''
  )

  // 7) Homiletica: gancho → concepto → ejemplo → desafio
  lines.push('## Homiletica', '')
  lines.push('1. **Gancho (necesidad humana):** [la herida o el hambre real que este texto contesta.]')
  lines.push(`2. **Gran idea (concepto exegético):** ${firstSentence(commentLines[0] ?? topicLines[0] ?? '[sintesis doctrinal del pasaje.]')}`)
  if (illusLines.length) {
    lines.push(`3. **Ejemplo:** ${firstSentence(illusLines[0])}`)
  } else {
    lines.push('3. **Ejemplo:** [caso moderno concreto.]')
  }
  lines.push('4. **Desafio:** [llamado concreto para esta semana.]', '')

  // 8) Temas e ilustraciones ancladas
  if (topicLines.length) {
    lines.push('## Temas (concordancias tematicas)', '', ...topicLines.map((entry) => `- ${entry}`), '')
  }
  if (illusLines.length) {
    lines.push('## Ilustraciones ancladas', '', ...illusLines.map((entry) => `- ${entry}`), '')
  }

  // 9) Puentes pastorales y aplicacion
  if (bridgeLines.length) {
    lines.push('## Puentes pastorales (fuentes ancladas)', '', ...bridgeLines.map((entry) => `- ${entry}`), '')
  }
  lines.push(
    '## Aplicacion en la vida',
    '',
    '- **En casa:** [concreto con los tuyos.]',
    '- **En el trabajo/estudio:** [concreto con colegas.]',
    '- **En la iglesia:** [concreto con la congregacion.]',
    '',
    '## Oracion final',
    '',
    '[Redacta la oración del mensaje, en una sola voz con la Escritura citada arriba.]'
  )
  return lines.join('\n')
}

/* ----------------------------------------------------------------- entrada */

export async function runCreator(
  ctx: AssistantContext,
  kind: CreatorKind,
  query: string,
  personaId: string
): Promise<AssistantResult> {
  const trimmed = query.trim()
  if (!trimmed) return { markdown: '', passages: [], aiUsed: false }

  const dossier = await buildDossier(
    apiHook({
      modules: ctx.modules,
      locale: ctx.locale,
      priorityModules: ctx.settings.priorityModules ?? [],
      selectedModule: ''
    }),
    kind,
    trimmed
  )

  const passages: AssistantPassage[] = dossier.citations
    .filter((citation) => citation.kind === 'texto')
    .map((citation) => ({ ref: citation.entry, module: citation.module, text: '' }))

  const persona = getPersona(personaId)
  const local = composeFromDossier(kind, ctx, trimmed, dossier, persona)

  if (!ctx.settings.aiEnabled) {
    return { markdown: local, passages, aiUsed: false, citations: dossier.citations, dossierChars: dossier.chars }
  }

  try {
    const language = ctx.locale === 'en' ? 'English' : ctx.locale === 'pt' ? 'Portuguese' : 'Spanish'
    const user = [
      personaPrompt(persona),
      addendum(kind),
      '',
      `Tema o pasaje solicitado: ${trimmed}`,
      '',
      'DOSSIER ANCLADO (recogido por sub-agentes de codigo; usalo como unica fuente):',
      dossierForPrompt(dossier)
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
    return {
      markdown: result.text,
      passages,
      aiUsed: true,
      citations: dossier.citations,
      dossierChars: dossier.chars
    }
  } catch (error) {
    return {
      markdown: local,
      passages,
      aiUsed: false,
      notice: error instanceof Error ? error.message : String(error),
      citations: dossier.citations,
      dossierChars: dossier.chars
    }
  }
}
