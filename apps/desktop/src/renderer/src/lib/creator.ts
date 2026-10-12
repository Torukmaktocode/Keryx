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
/** Biografia breve de cada orador: quien es, como habla (frases y modismos
 * tipicos) y regla de la voz en la prédica. Todo determinista (sin IA). */
const PERSONA_BIO: Record<PersonaId, { bio: string; idioms: string }> = {
  lewis: {
    bio: 'Ese Oxford irlándes convertido en apologista: profesor en Oxford y Cambridge, escribió "Mero Cristianismo" y Las Crónicas de Narnia. Humor seco, lógica transparente, fe razonada.',
    idioms: 'Habla de "el mero cristianismo", la "alegría del anhelo (Sehnsucht)", los "cuerpos que tienen almas", y de "hacer pensar como cristiano".'
  },
  peterson: {
    bio: 'Pastor de Maryland y Montana, traductor al lenguaje llano de toda la Biblia ("The Message"). Pastor-poeta: devuelto a la vida común.',
    idioms: 'Habla de la "cocina, el tráfico y la mesa", "practicar la resurrección", el "sabado lento", y desconfía del "consumo religioso".'
  },
  spurgeon: {
    bio: 'El Príncipe de los Predicadores: Metropolitan Tabernacle de Londres, convertido a los 15, predicó a miles desde los 19 y fundó colegios de pastores.',
    idioms: 'Enciende con "el texto", "la sangre y la justicia", "¡Oh alma cansada!", y serumá alumbotron por "el gran pecador y el grande Salvador".'
  },
  lloydjones: {
    bio: 'El "Doctor": médico de Harley Street que dejó la medicina para Westminster Chapel, Londres. Dicático, doctrinal, sin prisa.',
    idioms: 'Diagnostica como médico: "el corazón del problema", "repasemos el argumento", y predica versículo por versículo durante años.'
  },
  edwards: {
    bio: 'Teólogo del Gran Despertar en Massachusetts, rector de Princeton. Intensidad serena: la majestad de Dios y los afectos.',
    idioms: 'Habla de "los afectos", "el sensorio divino", "sostener la mente bajo la luz del texto", y de la belleza de la santidad.'
  },
  calvino: {
    bio: 'Crisol de Ginebra: reformador expositivo, escribió la Institución de la Religión Cristiana a los 26 y sermones versículo por verso.',
    idioms: 'Habla de "la soberanía de Dios", "sola escritura", "las promesas que no mienten", en sobriedad expositiva.'
  },
  lutero: {
    bio: 'Monje agustino que desató la Reforma en Wittenberg (1517) con 95 tesis; traducto de la Biblia al alemán del pueblo.',
    idioms: 'Frase célebre: "Aquí estoy, no puedo hacer de otra manera"; aplica la ley que confronta y el evangelio que consuela; humor gordo.'
  },
  tozer: {
    bio: 'Pastor autodidacta de Chicago (Southside Alliance), autor de "La Búsqueda de Dios" y "El conocimiento del Santo". Voz profética del siglo XX.',
    idioms: 'Habla de "persiguiendo a Dios", "la santidad", y advertía de la "iglesia ligera". Sus oraciones eran largas y reverentes.'
  },
  keller: {
    bio: 'Fundó Redeemer Presbyterian Church en el Nueva York de los 2000, junto a Central Park. Apólogo a los escépticos urbanos; autor de "La Oración".',
    idioms: 'Habla de "idolatías del corazón", Extensiones de "el evangelio re-centra la vida", y dirige mensaje a tres oyentes a la vez.'
  },
  robinson: {
    bio: 'Padre de la homilética moderna: presidente de Gordon-Conwell y Denver Seminary, autor de "Preparación y Exposición de Sermones Homiléticos".',
    idioms: 'Habla de "la idea central (big idea)", "el sujeto emerge del texto", y de medir los pasos de respuesta.'
  },
  agustin: {
    bio: 'Obispo de Hipona (Norte de África, siglos IV-V). Converso de la retórica, escribir las Confesiones y La Ciudad de Dios: padre de la teología occidental.',
    idioms: 'Frase célebre: "Nos hiciste para Ti, y nuestro corazón está inquieto hasta que descanse en Ti"; predica con confesión y amor de la Iglesia.'
  },
  wesley: {
    bio: 'Predicador itinerante del avivamiento inglés (3 sermones a caballo por día a la edad de 80); fundó las sociedades metodistas.',
    idioms: 'Frase célebre: "El mundo es mi parroquia"; habla de "santificación", "la gracia preveniente", y de la vida santa alcanzada hoy.'
  }
}

/** Directivas deterministas por orador: cambiar la voz cambia el CUERPO del
 * sermón (aplicación, cierre, tono de la evidencia) incluso sin IA. */
const PERSONA_DIRECTIVE: Record<PersonaId, string> = {
  lewis:
    'Aplica con razonamiento cálido y una analogía cotidiana (estilo "Mero Cristianismo"); cierra mostrando cómo el anhelo profundo apunta al evangelio.',
  peterson:
    'Baja cada punto a la vida ordinaria (cocina, tráfico, mesa); frases cortas y sin adorno; cierra con discipulado lento, no con atajos.',
  spurgeon:
    'Cierra con llamado evangelístico directo: la cruz al centro, advertencia sobre el pecado y oferta apasionada de gracia.',
  lloydjones:
    'Sigue la lógica doctrinal punto por punto y termina confrontando el diagnóstico del corazón humano antes del consuelo.',
  edwards:
    'Despierta los afectos con la majestad de Dios y confronta la autocomplacencia con intensidad serena.',
  calvino:
    'Cierra reafirmando la soberanía y promesa de Dios, con sobriedad expositiva y sin efectos retóricos vacíos.',
  lutero:
    'Aplica la distinción ley-evangelio en cada punto: confronta con la ley y consuela con el evangelio, en lenguaje llano.',
  tozer:
    'Exhorta a la santidad personal y al romper con lo mundano; busca reverencia y asombro.',
  keller:
    'Aplica a tres oyentes a la vez (escéptico, religioso, cansado) y conecta el texto con Cristo en cada punto.',
  robinson:
    'Cada punto nace del texto con su idea central definida; cierra midiendo la respuesta de la congregación.',
  agustin:
    'Concluye en clave del corazón inquieto: aplica con confesión y amor a la Iglesia.',
  wesley:
    'Cierra con énfasis de santificación: la vida santa es alcanzable hoy con la gracia; exhorta al disciplina del espíritu.'
}

function personaDirective(persona: Persona): string {
  return PERSONA_DIRECTIVE[persona.id] ?? ''
}

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
  const systLines = sectionEntries(dossier, 'sistematica')
  const histLines = sectionEntries(dossier, 'historia')

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
  if (systLines.length) {
    lines.push('## Teologia sistematica', '', ...systLines.map((entry) => `- ${entry}`), '')
  }
  if (histLines.length) {
    lines.push('## Historia y contexto cristiano', '', ...histLines.map((entry) => `- ${entry}`), '')
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

/* ---------------------------------------------------------- esqueleto codig */

const SNIPPET_SYSTEM =
  'Eres un redactor homiletico de voces cortas y vivas. Te daran el ESQUELETO de un sermon ya ' +
  'construido con fuentes biblicas ancladas por codigo (sub-agentes, 0 tokens). Tu trabajo SOLO ' +
  'es de voz humana: (1) gancho inicial de 40-60 palabras que enfrenta la necesidad humana del texto, ' +
  '(2) puente ligero de 1-2 frases ANTES de cada punto empezado (no repitas contenido, solo transicion), ' +
  '(3) oracion final de 3-5 lineas en primera plural, citando la referencia del texto. NO agregues datos, ' +
  'NO inventes referencias, NO reescribas puntos ni evidencia. Formato EXACTO de marcadores:\n' +
  '==GANCHO==\n...\n==PUENTE 1==\n...\n==PUENTE 2==\n...\n==PUENTE 3==\n...\n==ORACION==\n...'

interface VoicePieces {
  hook?: string
  bridges: string[]
  prayer?: string
}

function parseSnippets(text: string): VoicePieces {
  const grab = (marker: string): string => {
    const match = new RegExp(`==\\s*${marker}\\s*==\\n?([\\s\\S]*?)(?=$|==\\s*(?:PUENTE|GANCHO|ORACION))`, 'i').exec(text)
    return (match?.[1] ?? '').trim()
  }
  const bridges: string[] = []
  for (let index = 1; index <= 5; index += 1) {
    const value = grab(`PUENTE ${index}`)
    if (!value) break
    bridges.push(value)
  }
  return { hook: grab('GANCHO') || undefined, bridges, prayer: grab('ORACION') || undefined }
}

const FALLBACK_BRIDGES = [
  '¿Y esto qué tiene que ver contigo? Veamos el primer punto.',
  'Ahora bien: este dato trae consecuencias directas para tu vida.',
  'Llegamos a lo esencial: cómo vivir esto esta semana.'
]

const FALLBACK_HOOKS = [
  'Hay una frase en la Escritura que confronta algo que casi todos callamos:',
  'Todos sentimos la misma grieta interior. El texto de hoy la nombra con precisión:',
  'Comencemos con la Palabra misma, porque ella no rodea: va al punto.'
]

function defaultPrayer(ref: string): string {
  return `Dios, gracias porque tu Palabra habló primero a otro mundo y hoy nos habla con la misma autoridad. Grábala en nosotros. Que lo que oyeron de ${ref} se vuelva vida esta semana antes que llegue el domingo. Amén.`
}

function pointTitles(outlineLines: string[], commentLines: string[]): string[] {
  const raw = outlineLines
    .join('\n')
    .split('\n')
    .map((line) => line.replace(/^[#*>-\s]+/, '').trim())
    .filter((line) => /^\d+[).]\s+.{8,90}$/.test(line) || /^[IVX]+\.\s+.{8,90}$/i.test(line))
  const titles = raw
    .slice(0, 3)
    .map((line) => line.replace(/^\d+[).\s]+|^[IVX]+\.\s+/i, '').trim())
  if (titles.length >= 2) return titles
  return commentLines
    .slice(0, 3)
    .map((line) => firstSentence(line.replace(/^[^:]{0,36}:/, '')))
    .filter(Boolean)
}

function shortEntry(entry: string, max = 330): string {
  const plain = entry.replace(/\[\[?[^\]]+\]\]?/g, '').trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}, …`
}

function depthShort(list: string[], max = 280): string {
  const plain = list.join(' — ')
  if (plain.length <= max) return plain
  return `${plain.slice(0, max)}…`
}

/** Esqueleto del sermón 100% código: estructura, puntos, evidencia, citas. Los
 * marcadores de voz ([[GANCHO]] etc.) los llena assembleSermon. */
export function composeSermonSkeleton(kind: CreatorKind, query: string, dossier: Dossier, persona: Persona): string {
  if (kind !== 'crearsermon') return ''
  const parsed = parseReference(query)
  const ref = dossier.section ?? (parsed ? refEntry2(parsed.book, parsed.chapter, parsed.verse) : query)
  const textLines = sectionEntries(dossier, 'texto')
  const commentLines = sectionEntries(dossier, 'comentario')
  const outlineLines = sectionEntries(dossier, 'bosquejo')
  const strongLines = sectionEntries(dossier, 'strongs')
  const topicLines = sectionEntries(dossier, 'tema')
  const historyLines = sectionEntries(dossier, 'historico')
  const culturalLines = sectionEntries(dossier, 'cultural')
  const theoLines = sectionEntries(dossier, 'teologico')
  const christLines = sectionEntries(dossier, 'cristologico')
  const bridgeLines = sectionEntries(dossier, 'aplicacion')
  const illusLines = sectionEntries(dossier, 'ilustracion')

  const gran = firstSentence(commentLines[0] ?? topicLines[0] ?? '')
  const points = pointTitles(outlineLines, commentLines)
  const evidences = commentLines.length ? commentLines : []

  const lines: string[] = [
    `# ${TITLE_FOR.crearsermon}: ${ref}`,
    '',
    `> Voz: **${persona.name}** — ${personaDirective(persona)} · Ensamblado por sub-agentes de codigo · Fuentes ancladas: **${dossier.citations.length}** de ${new Set(dossier.citations.map((c) => c.module)).size} módulos.`,
    '',
    '## Gancho',
    '',
    '[[GANCHO]]',
    '',
    '## La voz de hoy',
    '',
    `> **${persona.name}** — ${PERSONA_BIO[persona.id]?.bio ?? persona.style}`,
    `> *Así habla:* ${PERSONA_BIO[persona.id]?.idioms ?? '—'}`,
    `> *Regla en esta prédica:* ${personaDirective(persona)}`,
    ''
  ]

  lines.push(`## Texto: ${ref}`, '')
  if (textLines.length) lines.push(...textLines.map((entry) => `> ${entry}`), '')

  lines.push('## Gran idea', '', gran || '[Lean el texto en voz alta: se busca la frase que resuma el mensaje de hoy.]', '')
  lines.push('## Contexto', '')
  if (historyLines.length) lines.push(`- **Histórico:** ${depthShort(historyLines)}`)
  if (culturalLines.length) lines.push(`- **Cultural:** ${depthShort(culturalLines)}`)
  if (theoLines.length) lines.push(`- **Teológico:** ${depthShort(theoLines)}`)
  if (christLines.length) lines.push(`- **Christológico:** ${depthShort(christLines)}`)
  if (historyLines.length || culturalLines.length || theoLines.length || christLines.length) lines.push('')
  else lines.push('[Punto por completar: activa más módulos de la Guía del Pasaje para este contexto.]', '')

  if (strongLines.length) {
    lines.push('## Palabras originales', '')
    lines.push(...strongLines.slice(0, 2).map((entry) => `- ${shortEntry(entry, 240)}`), '')
  }

  lines.push('## El mensaje', '')
  if (!points.length) {
    lines.push('1. **El texto dice:**', `   ${shortEntry(evidences[0] ?? ref)}`, '')
    lines.push('2. **Qué significa:**', `   ${shortEntry(topicLines[0] ?? stepGran(gran))}`, '')
    lines.push('3. **Cómo vivimos hoy:**', '   Conecta la gran idea con casa, trabajo y congregación.', '', '[[PUENTE 1]]', '', '[[PUENTE 3]]', '')
  } else {
    const page = points.length
    points.forEach((title, index) => {
      const evidence = shortEntry(evidences[index] ?? illusLines[index] ?? '')
      lines.push(`### ${index + 1}. ${title}`)
      if (evidence) lines.push('', `${evidence}`)
      lines.push('', `*Puente:* [[PUENTE ${index + 1}]]`, '')
    })
    void page
  }

  if (illusLines.length) {
    lines.push('## Ilustración', '')
    lines.push(shortEntry(illusLines[0], 420), '')
  }

  lines.push('## Aplicación', '')
  lines.push(`> **Regla de la voz (${persona.name}):** ${personaDirective(persona)}`, '')
  if (bridgeLines.length) {
    lines.push(...bridgeLines.slice(0, 2).map((entry) => `- ${shortEntry(entry, 260)}`), '')
  } else {
    lines.push('- **En casa:** [concreto con los tuyos.]', '- **En el trabajo:** [concreto con colegas.]', '- **En la iglesia:** [concreto con la congregación.]', '')
  }
  lines.push('## Oración final', '', '[[ORACION]]', '', `> Dosier: ${dossier.chars} caracteres de módulos reales [cita verifiable por apartado].`)
  return lines.join('\n')
}

function stepGran(gran: string): string {
  return gran ? `La frase exegética: ${gran}` : 'Sintetiza el versiculo en una sola oración exegética.'
}

function refEntry2(book: string, chapter: number, verse?: number): string {
  return `${book} ${chapter}${verse ? `:${verse}` : ''}`
}

/** ensambla sermon: código base + voz (IA o fallback determinista). Nunca deja marcadores. */
export function assembleSermon(skeleton: string, pieces: VoicePieces, ref: string, bridgeLines: string[] = []): string {
  const bridgeDefault = (index: number): string =>
    (bridgeLines[index % Math.max(1, bridgeLines.length)] ? shortEntry(bridgeLines[index % Math.max(1, bridgeLines.length)], 160) : '') ||
    FALLBACK_BRIDGES[index % FALLBACK_BRIDGES.length]
  let out = skeleton
  out = out.replace('[[GANCHO]]', (pieces.hook ?? '').trim() || `${FALLBACK_HOOKS[0]} «${ref}».`)
  for (let index = 1; index <= 6; index += 1) {
    out = out.replaceAll(`[[PUENTE ${index}]]`, '⇒ ' + ((pieces.bridges[index - 1] ?? '').trim() || bridgeDefault(index - 1)))
  }
  out = out.replace('[[ORACION]]', (pieces.prayer ?? '').trim() || defaultPrayer(ref))
  return out.replace(/\[\[[A-ZÑ ]+\d*\]\]/g, '')
}

/** Citas ancladas por código al final del documento (nunca dependen de la IA). */
function withAnchoredSources(markdown: string, dossier: Dossier): string {
  const byModule = new Map<string, string[]>()
  for (const citation of dossier.citations) {
    const list = byModule.get(citation.module) ?? []
    if (!list.includes(citation.entry)) list.push(citation.entry)
    byModule.set(citation.module, list)
  }
  if (!byModule.size || markdown.includes('## Fuentes ancladas')) return markdown
  const sources = ['', '## Fuentes ancladas', '']
  for (const [module, entries] of byModule) {
    sources.push(`- [${module} · ${entries.slice(0, 4).join(' · ')}${entries.length > 4 ? ' …' : ''}]`)
  }
  return `${markdown.trimEnd()}\n${sources.join('\n')}`
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

  /** Localizador por texto: si la consulta no es una referencia, busca las
   * palabras clave en la biblia activa y devuelve la primera ubicación real. */
  const locatePassage = async (): Promise<{ book: string; chapter: number; verse?: number } | undefined> => {
    const direct = parseReference(trimmed)
    if (direct) return direct
    const bibleName =
      ctx.settings.priorityModules.find((name) =>
        ctx.modules.some((m) => m.name === name && m.category === 'Bible')
      ) ?? ctx.modules.find((m) => m.category === 'Bible')?.name
    if (!bibleName) return undefined
    const words = [...new Set(trimmed.split(/[^\p{L}]{2,}/u).filter((word) => word.length >= 4))]
      .sort((a, b) => b.length - a.length)
    try {
      for (const word of words.slice(0, 6)) {
        const hits = await api.bible.search({ query: word, modules: [bibleName], limit: 10 })
        if (hits.length) {
          const hit = hits[0]
          return { book: hit.book, chapter: hit.chapter, verse: hit.verse || undefined }
        }
      }
    } catch {
      return undefined
    }
    return undefined
  }

  const located = await locatePassage()
  const dossier = await buildDossier(
    apiHook({
      modules: ctx.modules,
      locale: ctx.locale,
      priorityModules: ctx.settings.priorityModules ?? [],
      selectedModule: ''
    }),
    kind,
    trimmed,
    located && !parseReference(trimmed) ? located : undefined
  )

  const passages: AssistantPassage[] = dossier.citations
    .filter((citation) => citation.kind === 'texto')
    .map((citation) => ({ ref: citation.entry, module: citation.module, text: '' }))

  const persona = getPersona(personaId)
  const local = composeFromDossier(kind, ctx, trimmed, dossier, persona)

  const language = ctx.locale === 'en' ? 'English' : ctx.locale === 'pt' ? 'Portuguese' : 'Spanish'
  const citationsData = { citations: dossier.citations, dossierChars: dossier.chars }

  // Modo economia (default): el CUERPO del sermón lo construye el composer de
  // codigo; la IA solo la voz (gancho/puentes/oracion) en 1 llamada corta.
  if (kind === 'crearsermon' && !ctx.settings.deepSermon) {
    const skeleton = composeSermonSkeleton(kind, trimmed, dossier, persona)
    const bridgeLines = dossier.sections.filter((s) => s.kind === 'aplicacion').flatMap((s) => s.entries)
    if (!ctx.settings.aiEnabled) {
      return {
        markdown: assembleSermon(skeleton, { bridges: [] }, dossier.section ?? trimmed, bridgeLines),
        passages,
        aiUsed: false,
        notice: 'Sermón ensamblado 100% por código desde tus módulos (sin IA).',
        ...citationsData
      }
    }
    try {
      const ask = [
        personaPrompt(persona),
        `Regla de voz obligatoria: ${personaDirective(persona)}`,
        '',
        'REFERENCIA:',
        dossier.section ?? trimmed,
        '',
        'ESQUELETO (estructura y evidencia ya garantizadas; no las reescribas):',
        skeleton.length > 6000 ? `${skeleton.slice(0, 6000)}…[truncado]` : skeleton,
        '',
        'Devuelve EXACTAMENTE el formato de marcadores del sistema.'
      ].join('\n')
      const result = await api.ai.chat({
        messages: [
          { role: 'system', content: `${SNIPPET_SYSTEM}\n\nResponde en ${language}.` },
          { role: 'user', content: ask }
        ],
        temperature: 0.6,
        maxTokens: 700
      })
      const pieces = parseSnippets(result.text)
      return {
        markdown: withAnchoredSources(assembleSermon(skeleton, pieces, dossier.section ?? trimmed, bridgeLines), dossier),
        passages,
        aiUsed: true,
        notice: 'Cuerpo 100% código; solo gancho/puentes/oración de IA (1 llamada corta).',
        ...citationsData
      }
    } catch (error) {
      return {
        markdown: assembleSermon(skeleton, { bridges: [] }, dossier.section ?? trimmed, bridgeLines),
        passages,
        aiUsed: false,
        notice: error instanceof Error ? error.message : String(error),
        ...citationsData
      }
    }
  }

  if (!ctx.settings.aiEnabled) {
    return { markdown: local, passages, aiUsed: false, ...citationsData }
  }

  try {
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

    let markdown = result.text

    // deepSermon (opt-in): borrador / crítico homilético / final con correcciones.
    if (ctx.settings.deepSermon) {
      const critique = await api.ai.chat({
        messages: [
          {
            role: 'system',
            content:
              'Actua como critico homiletico experto. Revisa el borrador SOLO contra el dosier anclado ' +
              'que te dare. Verifica: (1) cada cita biblica es real y coincide con el texto anclado, ' +
              '(2) no hay afirmaciones o historias que ausenten del dosier, (3) los contextos ' +
              'historico/cultural/teologico del dosier se aprovechan, (4) la aplicacion es concreta, ' +
              '(5) se respeta el estilo pedido. Devuelve SOLO una lista de correcciones concretas ' +
              'numerada, cada una con el punto del sermón que corriges. Sin alargar el sermón. ' +
              `Responde en ${language}.`
          },
          {
            role: 'user',
            content: `BORRADOR:\n\n${markdown}\n\nDOSSIER ANCLADO:\n\n${dossierForPrompt(dossier)}`
          }
        ],
        temperature: 0.3,
        maxTokens: 900
      })

      const final = await api.ai.chat({
        messages: [
          {
            role: 'system',
            content: `${MASTER_PROMPT}\n\nResponde en ${language}. Tu trabajo es reescribir el borrador aplicando las correcciones del revisor, sin quitar secciones ni reducir las citas ancladas.`
          },
          {
            role: 'user',
            content: `BORRADOR:\n\n${markdown}\n\nCORRECCIONES:\n\n${critique.text}`
          }
        ],
        temperature: 0.5,
        maxTokens: 3600
      })
      markdown = final.text
    }

    // Citas ancladas SIEMPRE al final (por código, nunca depende de la IA).
    markdown = withAnchoredSources(markdown, dossier)

    return {
      markdown,
      passages,
      aiUsed: true,
      ...citationsData
    }
  } catch (error) {
    return {
      markdown: local,
      passages,
      aiUsed: false,
      notice: error instanceof Error ? error.message : String(error),
      ...citationsData
    }
  }
}
