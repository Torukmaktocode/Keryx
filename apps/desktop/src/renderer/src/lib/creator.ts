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
import type { AssistantStepReporter } from './assistant'
import type { MineProgressReporter } from './agents'
import { refLabel, stripTags } from './assistant'
import { api } from './api'
import { apiHook, buildDossier, dossierForPrompt, type Dossier } from './agents'
import { parseReference } from './reference'
import { buildSermonDocument, renderSermon } from './sermonEngine'
import type { SearchResult } from '@keryx/core'

export type CreatorKind = 'crearsermon' | 'crearestudio' | 'creardevocional'

export type PersonaId =
  | 'none'
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
/** Perfil completo de cada orador: biografia breve, modismos, frases tipicas,
 * forma homiletica preferida, como abre, como cierra y lente de aplicacion.
 * Todo determinista (0 tokens): la voz cambia el cuerpo del sermOn. */
interface PersonaProfile {
  bio: string
  idioms: string
  phrases: string[]
  shape: string
  opening: string
  closing: string
  application: string
  directive: string
}

const PERSONA_PROFILE: Record<PersonaId, PersonaProfile> = {
  none: {
    bio: 'Tu propia voz: sin estilo prestado. El esqueleto del sermón es tuyo para llenarlo con tu idioma, tus exemplear y tu iglesia.',
    idioms: 'Los tuyos: no se impone ninguna muletilla ni tono.',
    phrases: [],
    shape: 'Expositiva neutra: texto / significado / aplicación — a tu manera',
    opening: '',
    closing: '',
    application: 'La aplicación la escribes tu: la Guía del Pasaje y el dosier sostiene los datos.',
    directive: ''
  },
  lewis: {
    bio: 'Apologista de Oxford y Cambridge, irlandes; autor de "Mero Cristianismo" y de Narnia. Logica calida, humor seco, fe razonada.',
    idioms: 'Habla del "mero cristianismo", del anhelo (Sehnsucht), de que somos "almas que tienen un cuerpo", y de pensar como cristiano.',
    phrases: ['El cristianismo, si es falso, no importa; si es verdadero, lo es todo.', 'Ten paciencia con los que aun no ven.'],
    shape: 'Apologetica: pregunta honesta / razonamiento / esperanza',
    opening: 'Comencemos por la pregunta que todos evadimos:',
    closing: 'El anhelo que sentimos hoy es la senal de que fuimos hechos para otro mundo.',
    application: 'La aplicacion va por la razon: examina la escusa que te frena y nombrg el anhelo que el evangelio contesta.',
    directive: 'Aplica con razonamiento calido y una analogia cotidiana entre mayusculas entitled por el anhelo con el evangelio.'
  },
  peterson: {
    bio: 'Pastor de Maryland y Montana, tradujo la Biblia al lenguaje llano ("The Message"). Pastor-poeta de la vida comun.',
    idioms: 'La cocina, el trafico y la mesa; "practicar la resurreccion"; desconfia del consumo religioso.',
    phrases: ['La vida con Dios es larga y lenta.', 'Empieza donde estas.'],
    shape: 'Narrativa de la vida ordinaria: relato / cocina-mesa / caminar lento',
    opening: 'Ayer, entre el trafico y la olla de la sopa, el texto me desarmo:',
    closing: 'Ve a la mesa y practica la resurreccion en lo ordinario.',
    application: 'La aplicacion baja al suelo de todos los dias: los platos, la escuela, la sopa de la casa.',
    directive: 'Baja cada punto a la vida ordinaria (cocina, trafico, mesa); frases cortas y sin adorno; discipulado lento.'
  },
  spurgeon: {
    bio: 'El Principe de los Predicadores: Metropolitan Tabernacle de Londres; convertido a los 15, predico a miles desde los 19.',
    idioms: 'El texto como trono, la sangre y la justicia, "Oh alma cansada", el gran pecador y el grande Salvador.',
    phrases: ['Ven tal como eres.', 'El texto predica por si mismo; mi tarea es abrirle la puerta.'],
    shape: 'Centrada en el texto: texto / doctrina / aplicacion / llamado', 
    opening: 'Vengamos al texto mismo, porque el texto va al punto:',
    closing: 'Ven a Cristo como estas; lleva el texto contigo como un tesoro toda la semana.',
    application: 'La aplicacion termina evangelistica: advertencia sobre el pecado y oferta apasionada de gracia.',
    directive: 'Cierra con llamado evangelistico directo: la cruz al centro, advertencia del pecado y oferta apasionada de gracia.'
  },
  lloydjones: {
    bio: 'El "Doctor": medico de Harley Street que dejo la medicina por Westminster Chapel. Docente doctrinal, sin prisa.',
    idioms: 'Diagnostica como medico: "el corazon del problema", "repasemos el argumento", versiculo por versiculo por anos.',
    phrases: ['El problema nunca es el primero que parece.', 'El evangelio no consuela a quien no se dejo diagnosticar.'],
    shape: 'Diagnostico y consuelo: sintomas / diagnostico / gracia',
    opening: 'Pongamos el diagnostico antes del remedio:',
    closing: 'Solo quien vio su miseria reconoce la gracia como gracia.',
    application: 'La aplicacion confronta el corazon con un diagnostico honesto antes de dar la cura.',
    directive: 'Sigue la logica doctrinal punto por punto y confronta el corazon antes del consuelo.'
  },
  edwards: {
    bio: 'Teologo del Gran Despertar en Massachusetts; rector de Princeton. Intensidad serena: majestad y afectos.',
    idioms: 'Los afectos, "el sentido divino", la belleza de la santidad, saborear lo que la mente entiende.',
    phrases: ['No basta conocer: hay que saborear.', 'La majestad de Dios no se explica: se siente.'],
    shape: 'Doctrina / impresion de los afectos / bienaventuranza',
    opening: 'Detengamosnos ante la majestad de lo que el texto declara:',
    closing: 'Que tu alma saboree hoy lo que tu mente entendi.',
    application: 'La aplicacion apunta a los afectos: no solo saber la verdad, sino temblar el alma ante ella.',
    directive: 'Despierta los afectos con la majestad de Dios y confronta la autocomplacencia con intensidad serena.'
  },
  calvino: {
    bio: 'Reformador de Ginebra; la Institucion escrita a los 26; sermones versiculo por versiculo. Sobriedad expositiva.',
    idioms: 'La soberania de Dios, sola escritura, las promesas que no mienten.',
    phrases: ['Dios no miente ni cambia.', 'La Escritura es la regla de toda verdad.'],
    shape: 'Expositiva sobria: verso / doctrina / exhortacion',
    opening: 'El texto dice una sola cosa y la dice clara:',
    closing: 'Sujetate a la promesa: Dios no miente.',
    application: 'La aplicacion reafirma la soberania y la promesa, con exhortacion sobria.',
    directive: 'Cierra reafirmando la soberania y promesa de Dios, con sobriedad expositiva.'
  },
  lutero: {
    bio: 'Monje que desato la Reforma en Wittenberg (1517); traductor de la Biblia al aleman del pueblo.',
    idioms: '"Aqui estoy, no puedo hacer de otra manera"; la ley acusa, el evangelio consuela; humor directo.',
    phrases: ['La ley acusa; el evangelio revive.', 'La Biblia en tu idioma, en tu casa.'],
    shape: 'Ley y evangelio en cada punto',
    opening: 'Escucha primero lo que te acusa, para que sepas lo que te salva:',
    closing: 'Cristo hizo todo por ti: descansa, esta hecho.',
    application: 'La aplicacion distingue ley y evangelio: confronta el pecado y consuela con la gracia, en lenguaje llano.',
    directive: 'Aplica la distincion ley-evangelio en cada punto: confronta con la ley y consuela con el evangelio.'
  },
  tozer: {
    bio: 'Pastor autodidacta de Chicago; autor de "La Busqueda de Dios" y "El conocimiento del Santo". Voz profetica del siglo XX.',
    idioms: 'Persiguiendo a Dios, la santidad personal, la advertencia contra la "iglesia ligera", oraciones largas.',
    phrases: ['Lo que pienses de Dios es lo mas importante de ti.', 'Dios no busca adoradores de alquiler.'],
    shape: 'Reverencia / asombro / rompimiento con lo mundano',
    opening: 'Arrodillemos el corazon antes de abrir la boca:',
    closing: 'Deja lo mundano esta semana y persigue a Dios.',
    application: 'La aplicacion exhorta a la santidad y al rompimiento con lo mundano, elevando la reverencia.',
    directive: 'Exhorta a la santidad personal y al romper con lo mundano; busca reverencia y asombro.'
  },
  keller: {
    bio: 'Fundo Redeemer Presbyterian en Manhattan; apologo de los escepticos urbanos; autor de "La Oracion".',
    idioms: 'Las idolatrias del corazon, "el evangelio re-centra la vida", hablarle a tres oyentes a la vez.',
    phrases: ['Un idolo es algo bueno convertido en absoluto.', 'La religion dice: haz y logra; la gracia dice: esta hecho, vive.'],
    shape: 'Cristocentrica: problema / Cristo en el texto / tres oyentes',
    opening: 'Digamos la verdad: el problema no esta afuera, espera afuera de tu puerta:',
    closing: 'Elige a que le obedece tu vida esta semana.',
    application: 'La aplicacion apunta al esceptico, al religioso y al cansado a la vez, conectando el texto con Cristo.',
    directive: 'Aplica a tres oyentes a la vez (esceptico, religioso, cansado) y conecta el texto con Cristo en cada punto.'
  },
  robinson: {
    bio: 'Padre de la homiletica moderna; presdio Gordon-Conwell y Denver Seminary; padre de la metodologia "big idea".',
    idioms: 'La idea central (big idea); sujeto y complemento que emergen del texto; pasos de respuesta.',
    phrases: ['Predica la idea central, no tres ideas.', 'El texto manda el punto.'],
    shape: 'Idea central: sujeto / complemento / pasos de respuesta',
    opening: 'Antes de opinar, clarifiquemos la idea central que el texto sostiene:',
    closing: 'Decide esta semana que haras con la idea central.',
    application: 'La aplicacion mide respuesta: pasos concretos que obedecen la idea central.',
    directive: 'Cada punto nace del texto con su idea central definida; cierra midiendo la respuesta de la congregacion.'
  },
  agustin: {
    bio: 'Obispo de Hipona (siglos IV-V); de la retorica a la gracia; las Confesiones y La Ciudad de Dios.',
    idioms: 'El corazon inquieto, la confesion, el amor a la Iglesia, la Ciudad de Dios frente a la ciudad del hombre.',
    phrases: ['Nos hiciste para Ti, y el corazon anda inquieto.', 'Ama, y haz lo que quieras.'],
    shape: 'Confesional: inquietud / gracia / descanso',
    opening: 'Empiezo confesando: este texto tambien me precede:',
    closing: 'El corazon inquieto descansa solo en Ti.',
    application: 'La aplicacion va en clave de confesion y amor a la Iglesia; termina en el descanso de Dios.',
    directive: 'Concluye en clave del corazon inquieto: aplica con confession y amor a la Iglesia.'
  },
  wesley: {
    bio: 'Predicador itinerante del avivamiento ingles; a caballo, tres sermones por dia hasta los 80; sociedades metodistas.',
    idioms: '"El mundo es mi parroquia", la santificacion practica, la gracia preveniente.',
    phrases: ['La santidad es alcanzable hoy.', 'Ve y no peques mas.'],
    shape: 'Avivamiento: conviccion / santificacion / caminar en gracia',
    opening: 'El mundo es mi parroquia, y hoy esta parroquia es esta sala:',
    closing: 'La gracia ya te alcanzo: camina en santidad la semana.',
    application: 'La aplicacion llama a la santificacion practica: vida santa alcanzable hoy por la gracia.',
    directive: 'Cierra con enfasis de santificacion: la vida santa es alcanzable hoy con la gracia.'
  }
}

;(() => {
  const g = globalThis as unknown as {
    __personaDirective?: (p: unknown) => string
    __personaShape?: (p: unknown) => string
    __personaClosing?: (p: unknown) => string
    __personaLente?: (id: string) => string
  }
  g.__personaDirective = (p: unknown) => personaDirective(p as Persona)
  g.__personaShape = (p: unknown) => PERSONA_PROFILE[(p as Persona).id]?.shape ?? 'expositiva'
  g.__personaClosing = (p: unknown) => PERSONA_PROFILE[(p as Persona).id]?.closing ?? ''
  g.__personaLente = (id: string) => PERSONA_PROFILE[id as PersonaId]?.application ?? ''
})()

function personaDirective(persona: Persona): string {
  return PERSONA_PROFILE[persona.id]?.directive ?? ''
}

export const PERSONAS: Persona[] = [
  {
    id: 'none',
    name: 'Ninguno — mi propio estilo',
    style: 'Sin estilo prestado: la voz del sermón es la tuya. El cuerpo anclado se mantiene y tú escribes a tu manera.'
  },
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
  'Produce un documento COMPLETO, PROFUNDO y profesional (1400-2400 palabras), listo para predicar, en el idioma del usuario.',
  '',
  'REGLA DE ORO: usa EXCLUSIVAMENTE la evidencia del DOSSIER anclado. Cada afirmacion expositiva debe poder rastrearse a una cita [Modulo · entrada].',
  'No inventes citas biblicas, datos historicos, numeros Strong ni hechos; si algo no consta en el dosier, dilo con honestidad o dejalo como [PUNTO POR COMPLETAR].',
  '',
  'PROFUNDIDAD (obligatoria): desarrolla, no resumas. Cada apartado en 2-3 parrafos de 80-150 palabras. Amplia cada termino, costumbre o doctrina con TODO el material del dosier (mismo tema en otros modulos, horizontes historicos, teologia). Si el dosier trae mas material del que puedes usar en un parrafo, usa mas parrafos, no lo dejes fuera.',
  '',
  'Estructura requerida (encabezados ##):',
  '1. "Texto base y gran idea": cita el pasaje y formula la gran idea en una frase; luego desarrolla por que esa idea es el eje del texto (2-3 parrafos).',
  '2. "Contexto historico y geografico": autor, fecha probable (si consta), destinatarios, geografia real y costumbres del DOSIER; explica como CADA dato cambia el modo de leer el texto.',
  '3. "Palabras originales": terminos Strong transliterados con su rango semantico completo segun las definiciones citadas (no una sola definicion), incluyen usos ejemplares citados del dosier.',
  '4. "Comentario verso a versiculo": divide el pasaje en UNIDADES literarias: sintaxis, flujo argumental y conexiones logicas segun los comentarios anclados; 2-3 parrafos por unidad mayor.',
  '5. "Hermeneutica": genero literario y reglas; puente honesto entre el mundo del texto y hoy.',
  '6. "Horizonte teologico": como el pasaje conecta con las doctrinas y con la historia cristiana que trae el DOSIER (teologia sistematica, historia de la iglesia, Walton-Keener); 2-3 parrafos citados.',
  '7. "Homiletica": Gancho (necesidad humana) -> Gran idea -> varios ejemplos -> Desafio.',
  '8. "Ilustraciones": usa primero las del dosier desarrolladas en 3-5 lineas cada una; al menos dos si constan; suma un caso biblico del dosier si hay.',
  '9. "Aplicacion en la vida": tres esferas concretas y medibles (vida personal, familia, iglesia-mundo) con al menos un paso accionable por esfera.',
  '10. "Oracion final": primera persona plural, citando al menos una referencia del texto.',
  '',
  '- Cita referencias como "Libro Capitulo:Versiculo".',
  '- Densidad: nada de relleno; todo parrafo sostiene la gran idea o abre el texto con la evidencia del dosier.'
].join('\n')

/* ------------------------------------------------- crítico de código (0 tokens) */

export interface CodeCriticism {
  severe: string[]
  minor: string[]
}

/** Verifica el borrador contra el dosier SIN usar IA: Strong inventados,
 *  referencias biblicas sin ancla, huecos marcados y secciones ausentes. */
export function codeCritic(markdown: string, dossier: Dossier): CodeCriticism {
  const anchored = dossierForPrompt(dossier).toUpperCase().replace(/\s+/g, ' ')
  const severe: string[] = []
  const minor: string[] = []

  const strongs = [...markdown.matchAll(/\b[GH]\d{3,5}\b/g)].map((m) => m[0].toUpperCase())
  const inventedStrongs = [...new Set(strongs)].filter(
    (key) => !anchored.includes(key) && key !== 'G0' && key !== 'H0'
  )
  if (inventedStrongs.length) {
    severe.push(`Numeros Strong SIN ancla en el dosier: ${inventedStrongs.join(', ')}`)
  }

  const refs = [...markdown.matchAll(/\b[1-3]?\s?[A-ZÁÉÍÓÚÑÜa-záéíóúñü]{4,}\s+\d{1,3}:\d{1,3}\b/g)]
    .map((m) => m[0].replace(/\s+/g, ' '))
    .map((ref) => (ref.endsWith('.') ? ref.slice(0, -1) : ref))
  const ghostRefs = [...new Set(refs)].filter((ref) => !anchored.includes(ref.toUpperCase()))
  if (ghostRefs.length > 1) {
    severe.push(`Referencias biblicas sin ancla en el dosier: ${ghostRefs.slice(0, 5).join(' · ')}`)
  }

  const slack = (markdown.match(/\[PUNTO POR COMPLETAR\]/g) ?? []).length
  if (slack > 2) minor.push(`${slack} huecos marcados [PUNTO POR COMPLETAR]`)

  const heads = [...markdown.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].toLowerCase())
  for (const need of ['texto base', 'contexto', 'palabras', 'aplicacion']) {
    if (!heads.some((head) => head.includes(need))) minor.push(`Falta la seccion que incluye "${need}".`)
  }

  return { severe, minor }
}

/** Material del dosier que el borrador no aprovecho (guias para la pasada final). */
export function unusedDossierMaterial(markdown: string, dossier: Dossier, limit = 6): string[] {
  const pending: string[] = []
  for (const section of dossier.sections) {
    for (const entry of section.entries) {
      const head = entry.replace(/\s+/g, ' ').slice(0, 40)
      if (head.length < 20) continue
      if (!markdown.replace(/\s+/g, ' ').includes(head)) {
        pending.push(`${section.title}: ${shortEntry(entry, 150)}`)
        if (pending.length >= limit) return pending
      }
    }
  }
  return pending
}

function personaPrompt(persona: Persona): string {  if (persona.id === 'none') {
    return 'ESTILO DEL ORADOR: el propio predicador. Usa tu voz natural y la de tu congregacion; no imites a nadie. El cuerpo del sermon ya esta anclado; solo redacta la voz human en tus propias palabras.'
  }
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
  const casoLines = sectionEntries(dossier, 'caso')
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
  if (casoLines.length) {
    lines.push('## Ilustracion biblica (caso real)', '', ...casoLines.map((entry) => `- ${entry}`), '')
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
  'Eres un redactor homiletico de voces amplias y vivas. Te daran el ESQUELETO de un sermon ya ' +
  'construido con fuentes biblicas ancladas por codigo (sub-agentes, 0 tokens). Tu trabajo SOLO ' +
  'es de voz humana: (1) gancho inicial de 60-90 palabras que enfrente la necesidad humana del texto con una imagen concreta, ' +
  '(2) INTRODUCCION de 5-7 frases que presente el pasaje, su contexto esencial y por que nos toca hoy, ' +
  '(3) puente ligero de 2-3 frases ANTES de cada punto (no repitas contenido, solo transicion que prepare el punto), ' +
  '(4) meditacion de 90-140 palabras que abraze la frase para meditar y la vuelva oracion del corazon, ' +
  '(5) oracion final de 5-8 lineas en primera plural, citando la referencia del texto y el deseo del mensaje. ' +
  'NO agregues datos, NO inventes referencias, NO reescribas puntos ni evidencia. Formato EXACTO de marcadores:\n' +
  '==GANCHO==\n...\n==INTRO==\n...\n==PUENTE 1==\n...\n==PUENTE 2==\n...\n==MEDITACION==\n...\n==ORACION==\n...'

interface VoicePieces {
  hook?: string
  intro?: string
  bridges: string[]
  meditation?: string
  prayer?: string
}

function parseSnippets(text: string): VoicePieces {
  const grab = (marker: string): string => {
    const match = new RegExp(`==\\s*${marker}\\s*==\\n?([\\s\\S]*?)(?=$|==\\s*(?:PUENTE|GANCHO|INTRO|ORACION|MEDITACION))`, 'i').exec(text)
    return (match?.[1] ?? '').trim()
  }
  const bridges: string[] = []
  for (let index = 1; index <= 6; index += 1) {
    const value = grab(`PUENTE ${index}`)
    if (!value) break
    bridges.push(value)
  }
  return {
    hook: grab('GANCHO') || undefined,
    intro: grab('INTRO') || undefined,
    bridges,
    meditation: grab('MEDITACION') || undefined,
    prayer: grab('ORACION') || undefined
  }
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
  const casoLines = sectionEntries(dossier, 'caso')

  const gran = firstSentence(commentLines[0] ?? topicLines[0] ?? '')
  const points = pointTitles(outlineLines, commentLines)
  const evidences = commentLines.length ? commentLines : []

  const lines: string[] = [
    `# ${TITLE_FOR.crearsermon}: ${ref}`,
    '',
    `> Voz: **${persona.id === 'none' ? 'tu propio estilo' : persona.name}** — ${personaDirective(persona) || 'sin estilo prestado'} · Ensamblado por sub-agentes de codigo · Fuentes ancladas: **${dossier.citations.length}** de ${new Set(dossier.citations.map((c) => c.module)).size} módulos.`,
    '',
    '## Gancho',
    '',
    '[[GANCHO]]',
    '',
    '## Introducción',
    '',
    '[[INTRO]]',
    ''
  ]

  if (persona.id !== 'none') {
    lines.push(
      '## La voz de hoy',
      '',
      `> **${persona.name}** — ${PERSONA_PROFILE[persona.id]?.bio ?? persona.style}`,
      `> *Así habla:* ${PERSONA_PROFILE[persona.id]?.idioms ?? '—'}`,
      `> *Frases suyas:* ${PERSONA_PROFILE[persona.id]?.phrases.join(' · ') ?? '—'}`,
      `> *Forma:* ${PERSONA_PROFILE[persona.id]?.shape ?? '—'}`,
      `> *Regla en esta prédica:* ${personaDirective(persona)}`,
      ''
    )
  } else {
    lines.push('## La voz de hoy', '', '> Tu propia voz: el cuerpo anclado queda intacto; escribe a tu manera.', '')
  }

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
  if (persona.id !== 'none') {
    lines.push(`> Forma de la voz: ${PERSONA_PROFILE[persona.id]?.shape ?? 'expositiva'}`, '')
  }
  if (!points.length) {
    lines.push('1. **El texto dice:**', `   ${shortEntry(evidences[0] ?? ref)}`, '')
    lines.push('2. **Qué significa:**', `   ${shortEntry(topicLines[0] ?? stepGran(gran))}`, '')
    lines.push('3. **Cómo vivimos hoy:**', '   Conecta la gran idea con casa, trabajo y congregación.', '', '*Puente:* [[PUENTE 1]]', '', '*Puente:* [[PUENTE 3]]', '')
  } else {
    const page = points.length
    const SIGNALS = ['Primeramente…', 'En segundo lugar…', 'Y para concluir…']
    points.forEach((title, index) => {
      const evidence = shortEntry(evidences[index] ?? illusLines[index] ?? '')
      lines.push(`> *Señal para predicar:* «${SIGNALS[index] ?? `Para el punto ${index + 1}, te pido que mires…`}»`, '')
      lines.push(`### ${index + 1}. ${title}`)
      if (evidence) lines.push('', `${evidence}`)
      lines.push('', `*Puente:* [[PUENTE ${index + 1}]]`, '')
    })
    void page
  }

  const citaLines = sectionEntries(dossier, 'cita')
  if (citaLines.length) {
    lines.push('## Citas (frases sabias)', '')
    lines.push(...citaLines.slice(0, 2).map((entry) => shortEntry(entry, 320)), '')
  }

  if (illusLines.length || casoLines.length) {
    if (casoLines.length) {
      lines.push('## Ilustración bíblica (caso real)', '')
      lines.push(...casoLines.map((entry) => shortEntry(entry, 420)), '')
      if (illusLines.length) lines.push(`*Contemporary:* ${shortEntry(illusLines[0], 300)}`, '')
    } else {
      lines.push('## Ilustración', '')
      lines.push(shortEntry(illusLines[0], 420), '')
    }
  }

  lines.push('## Aplicación', '')
  if (persona.id !== 'none') {
    lines.push(`> **Lente de la voz (${persona.name}):** ${PERSONA_PROFILE[persona.id]?.application ?? personaDirective(persona)}`, '')
  }
  if (bridgeLines.length) {
    lines.push(...bridgeLines.slice(0, 2).map((entry) => `- ${shortEntry(entry, 260)}`), '')
  } else {
    lines.push('- **En casa:** [concreto con los tuyos.]', '- **En el trabajo:** [concreto con colegas.]', '- **En la iglesia:** [concreto con la congregación.]', '')
  }
  if (persona.id !== 'none') {
    lines.push(
      '## Cierre de la voz',
      '',
      `**${persona.name}:** ${PERSONA_PROFILE[persona.id]?.closing ?? ''}`,
      ''
    )
  }
  lines.push('## Frase para meditar', '', '[[MEDITACION]]', '')
  lines.push('> **Señal para predicar:** «Y para concluir…»', '')

  const recap = gran || 'Vuelve al texto central y repítelo a la congregación.'
  if (persona.id !== 'none') {
    lines.push(
      '## Cierre del sermón',
      '',
      `- Recapitulación: ${recap}`,
      `- Llamado de ${persona.name}: ${PERSONA_PROFILE[persona.id]?.closing ?? personaDirective(persona)}`,
      '- **Benedicción:** El Señor te bendiga y te guarde; haga resplandecer su rostro sobre ti y se favorable a ti.',
      ''
    )
  } else {
    lines.push(
      '## Cierre del sermón',
      '',
      `- Recapitulación: ${recap}`,
      '- Tu llamado de cierre: resume el mensaje en una frase y vendita la invitación concreta para esta semana.',
      '- **Benedicción:** El Señor te bendiga y te guarde; haga resplandecer su rostro sobre ti y se favorable a ti.',
      ''
    )
  }
  lines.push(
    '## Oración final',
    '',
    '[[ORACION]]',
    '',
    `> Dosier: ${dossier.chars} caracteres de módulos reales [cita verifiable por apartado].`
  )
  return lines.join('\n')
}

function stepGran(gran: string): string {
  return gran ? `La frase exegética: ${gran}` : 'Sintetiza el versiculo en una sola oración exegética.'
}

function refEntry2(book: string, chapter: number, verse?: number): string {
  return `${book} ${chapter}${verse ? `:${verse}` : ''}`
}

/** ensambla sermon: código base + voz (IA o fallback determinista). Nunca deja marcadores. */
export function assembleSermon(
  skeleton: string,
  pieces: VoicePieces,
  ref: string,
  bridgeLines: string[] = [],
  introFallback = '',
  meditationFallback = ''
): string {
  const bridgeDefault = (index: number): string =>
    (bridgeLines[index % Math.max(1, bridgeLines.length)] ? shortEntry(bridgeLines[index % Math.max(1, bridgeLines.length)], 160) : '') ||
    FALLBACK_BRIDGES[index % FALLBACK_BRIDGES.length]
  let out = skeleton
  out = out.replace('[[GANCHO]]', (pieces.hook ?? '').trim() || `${FALLBACK_HOOKS[0]} «${ref}».`)
  out = out.replace('[[INTRO]]', (pieces.intro ?? '').trim() || introFallback)
  for (let index = 1; index <= 6; index += 1) {
    out = out.replaceAll(`[[PUENTE ${index}]]`, '⇒ ' + ((pieces.bridges[index - 1] ?? '').trim() || bridgeDefault(index - 1)))
  }
  out = out.replace('[[MEDITACION]]', (pieces.meditation ?? '').trim() || meditationFallback || `Lleva contigo esta semana el núcleo de ${ref}.`)
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

const QUERY_STOP = new Set([
  'sobre', 'hablar', 'dijo', 'quiere', 'hacer', 'predicar', 'sermon', 'estudio',
  'pasaje', 'texto', 'detalle', 'mensaje', 'sense'
])

export interface PassageHint {
  book: string
  chapter: number
  verse?: number
}

export function queryTokensOf(query: string): string[] {
  return [...new Set(
    query
      .toLowerCase()
      .split(/[^\p{L}]+/u)
      .filter((word) => word.length >= 4 && !QUERY_STOP.has(word))
  )].sort((a, b) => b.length - a.length)
}

/** Puntaje multi-palabra: gana el versiculo que cumple MAS palabras de la
 * consulta. Ej: "talita cumi niña mano" puntua Marcos 5:41 (4) sobre un
 * verso cualquiera con "hablar" (1). Empate: la palabra mas rara primero. */
export async function locatePassageByTokens(
  tokens: string[],
  _module: string,
  search: (query: string) => Promise<Array<SearchResult>>
): Promise<PassageHint | undefined> {
  if (!tokens.length) return undefined
  const perToken = new Map<string, Array<SearchResult>>()
  for (const word of tokens.slice(0, 8)) {
    let hits: Array<SearchResult> = []
    try {
      hits = (await search(word)) ?? []
    } catch {
      hits = []
    }
    if (hits.length) perToken.set(word, hits)
  }
  if (!perToken.size) return undefined
  let best: { hit: SearchResult; score: number } | null = null
  for (const [, hits] of perToken) {
    for (const hit of hits) {
      const text = (hit.text ?? '').toLowerCase()
      let score = 0
      for (const word of perToken.keys()) {
        if (text.includes(word)) score += 1
      }
      if (!best || score > best.score) best = { hit, score }
    }
  }
  if (!best) return undefined
  return {
    book: best.hit.book,
    chapter: best.hit.chapter,
    verse: best.hit.verse || undefined
  }
}



export async function runCreator(
  ctx: AssistantContext,
  kind: CreatorKind,
  query: string,
  personaId: string,
  onStep?: AssistantStepReporter,
  onProgress?: MineProgressReporter
): Promise<AssistantResult> {
  const trimmed = query.trim()
  if (!trimmed) return { markdown: '', passages: [], aiUsed: false, aiMs: 0 }

  let aiMs = 0

  /** Localizador por texto: los resultados se PUNTUAN por cuantas palabras de
   * la consulta cumple cada versiculo (la frase real gana sobre palabras
   * comunes sueltas). Devuelve la ubicacion con mejor puntaje. */
  const locatePassage = async (): Promise<PassageHint | undefined> => {
    const direct = parseReference(trimmed)
    if (direct) return direct
    const bibles = [
      ...(ctx.settings.priorityModules ?? []).filter((name) =>
        ctx.modules.some((m) => m.name === name && m.category === 'Bible')
      ),
      ...ctx.modules.filter((m) => m.category === 'Bible').map((m) => m.name)
    ].slice(0, 2)
    for (const bibleName of bibles) {
      const found = await locatePassageByTokens(queryTokensOf(trimmed), bibleName, async (query) =>
        api.bible.search({ query, modules: [bibleName], limit: 60 })
      )
      if (found) return found
    }
    return undefined
  }

  onStep?.('locate')
  const located = await locatePassage()
  onStep?.('dossier')
  const dossier = await buildDossier(
    apiHook({
      modules: ctx.modules,
      locale: ctx.locale,
      priorityModules: ctx.settings.priorityModules ?? [],
      selectedModule: ''
    }),
    kind,
    trimmed,
    located && !parseReference(trimmed) ? located : undefined,
    onProgress
  )

  const passages: AssistantPassage[] = dossier.citations
    .filter((citation) => citation.kind === 'texto')
    .map((citation) => ({ ref: citation.entry, module: citation.module, text: '' }))

  const persona = getPersona(personaId)
  onStep?.('compose')
  const local = composeFromDossier(kind, ctx, trimmed, dossier, persona)

  const language = ctx.locale === 'en' ? 'English' : ctx.locale === 'pt' ? 'Portuguese' : 'Spanish'
  const citationsData = { citations: dossier.citations, dossierChars: dossier.chars }

  // Modo economia (default): AST del sermón construido por codigo
  // (buildSermonDocument) y la IA solo llena los slots de voz.
  if (kind === 'crearsermon' && !ctx.settings.deepSermon) {
    const doc = buildSermonDocument(dossier, persona as unknown as { id: string; name: string; style: string }, trimmed)
    if (!ctx.settings.aiEnabled) {
      return {
        markdown: renderSermon(doc),
        passages,
        aiUsed: false,
        aiMs,
        notice: 'Sermón ensamblado con tus módulos (sin redacción del modelo).',
        ...citationsData
      }
    }
    try {
      const datosBrief = [...dossier.sections
        .filter((x) => ['geografia', 'caso', 'historico'].includes(x.kind))
        .flatMap((x) => x.entries)].slice(0, 3).map((entry) => shortEntry(entry, 170))
      const skeletonForAi = renderSermon(doc)
      const ask = [
        personaPrompt(persona),
        `Regla de voz obligatoria: ${personaDirective(persona)}`,
        `Forma: ${PERSONA_PROFILE[persona.id]?.shape ?? 'expositiva'}. Frases típicas del orador (tono, no copiar literal): ${PERSONA_PROFILE[persona.id]?.phrases.join(' | ') ?? ''}`,
        '',
        'DATOS REALES ANCLADOS (úsalos tal cual en la intro o en un puente; son verificados, no inventes otros):',
        ...(datosBrief.length ? datosBrief : ['(sin datos disponibles para este pasaje)']),
        '',
        'REFERENCIA:',
        doc.ref,
        '',
        'ESQUELETO (estructura y evidencia ya garantizadas; no las reescribas):',
        skeletonForAi.length > 7000 ? `${skeletonForAi.slice(0, 7000)}…[truncado]` : skeletonForAi,
        '',
        'Devuelve EXACTAMENTE el formato de marcadores del sistema.'
      ].join('\n')
      onStep?.('voice')
      const t0 = performance.now()
      const result = await api.ai.chat({
        messages: [
          { role: 'system', content: `${SNIPPET_SYSTEM}\n\nResponde en ${language}.` },
          { role: 'user', content: ask }
        ],
        temperature: 0.6,
        maxTokens: 1400
      })
      aiMs += performance.now() - t0
      const pieces = parseSnippets(result.text)
      const voiced = {
        ...doc,
        gancho: { ...doc.gancho, text: pieces.hook },
        intro: { ...doc.intro, text: pieces.intro },
        meditacion: { ...doc.meditacion, text: pieces.meditation },
        oracion: { ...doc.oracion, text: pieces.prayer },
        puntos: doc.puntos.map((punto, index) => ({
          ...punto,
          bridge: { ...punto.bridge, text: pieces.bridges[index] }
        }))
      }
      return {
        markdown: renderSermon(voiced),
        passages,
        aiUsed: true,
        aiMs,
        notice: 'Estructura y fuentes garantizadas; solo gancho/intro/puentes/meditación/oración redactados (1 pasada corta).',
        ...citationsData
      }
    } catch (error) {
      return {
        markdown: renderSermon(doc),
        passages,
        aiUsed: false,
        aiMs,
        notice: error instanceof Error ? error.message : String(error),
        ...citationsData
      }
    }
  }

  if (!ctx.settings.aiEnabled) {
    return { markdown: local, passages, aiUsed: false, aiMs, ...citationsData }
  }

  try {
    const user = [
      personaPrompt(persona),
      addendum(kind),
      '',
      `Tema o pasaje solicitado: ${trimmed}`,
      '',
      'AUTOCHQUE antes de responder: cada numero Strong citado debe figurar en el DOSIER y cada cita biblica Libro C:V debe estar en el DOSIER o en el texto anclado; corrige o elimina lo que no conste.',
      '',
      'DOSSIER ANCLADO (recogido por sub-agentes de codigo; usalo como unica fuente):',
      dossierForPrompt(dossier)
    ]
      .filter(Boolean)
      .join('\n\n')

    onStep?.('voice')
    const t0 = performance.now()
    const result = await api.ai.chat({
      messages: [
        { role: 'system', content: `${MASTER_PROMPT}\n\nResponde en ${language}.` },
        { role: 'user', content: user }
      ],
      temperature: 0.55,
      maxTokens: 6000
    })
    aiMs += performance.now() - t0

    let markdown = result.text

    // Crítico de CÓDIGO (0 tokens): si la IA invento Strong o referencias sin ancla,
    // una unica pasada de reparacion dirigida (solo cuando hace falta).
    onStep?.('critic')
    const criticism = codeCritic(markdown, dossier)
    if (criticism.severe.length) {
      onStep?.('repair')
      try {
        const t1 = performance.now()
        const repair = await api.ai.chat({
          messages: [
            {
              role: 'system',
              content:
                'Repara SOLO los hallazgos listados, usando el dosier anclado como unica fuente: ' +
                'sustituye o elimina cada numero Strong y cada referencia biblica que no este anclada. ' +
                'No cambies nada mas del documento. Devuelve el documento completo corregido.'
            },
            {
              role: 'user',
              content: `HALLAZGOS:\n${criticism.severe
                .map((issue, index) => `${index + 1}) ${issue}`)
                .join('\n')}\n\nBORRADOR:\n\n${markdown}\n\nDOSSIER ANCLADO:\n\n${dossierForPrompt(dossier)}`
            }
          ],
          temperature: 0.4,
          maxTokens: 3000
        })
        aiMs += performance.now() - t1
        if (repair.text && repair.text.length > 200) markdown = repair.text
      } catch {
        // la reparacion es optativa: el borrador anclado sigue siendo utilizable
      }
    }

    if (ctx.settings.deepSermon) {
      // Pasada final (calidad): desarrolla el material del dosier que el borrador no uso.
      onStep?.('final')
      const pending = unusedDossierMaterial(markdown, dossier)
      const finalParts = [
        'BORRADOR:',
        markdown,
        '',
        pending.length
          ? `MATERIAL DEL DOSIER AUN NO USADO (desarrollalo en la seccion que corresponda):\n${pending
              .map((item, index) => `${index + 1}) ${item}`)
              .join('\n')}`
          : '',
        criticism.minor.length
          ? `POLISH:\n${criticism.minor.map((issue, index) => `${index + 1}) ${issue}`).join('\n')}`
          : ''
      ].filter(Boolean)
      const t2 = performance.now()
      const final = await api.ai.chat({
        messages: [
          {
            role: 'system',
            content: `${MASTER_PROMPT}\n\nResponde en ${language}. Tu trabajo es reescribir el borrador desarrollando profundamente el material sin usar y aplicando el pulido; secciones completas, nunca una frase suelta. No quites secciones ni reduzcas las citas ancladas. El resultado debe superar al borrador en profundidad y extension.`
          },
          { role: 'user', content: finalParts.join('\n\n') }
        ],
        temperature: 0.5,
        maxTokens: 6000
      })
      aiMs += performance.now() - t2
      markdown = final.text
    }

    // Citas ancladas SIEMPRE al final (por código, nunca depende de la IA).
    onStep?.('sources')
    markdown = withAnchoredSources(markdown, dossier)

    return {
      markdown,
      passages,
      aiUsed: true,
      aiMs,
      ...citationsData
    }
  } catch (error) {
    return {
      markdown: local,
      passages,
      aiUsed: false,
      aiMs,
      notice: error instanceof Error ? error.message : String(error),
      ...citationsData
    }
  }
}
