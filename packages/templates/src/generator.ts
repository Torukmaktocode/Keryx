export interface ConsultaQuestion {
  id: 'topic' | 'emphasis' | 'audience' | 'aim' | 'genre' | 'delivery'
  title: string
  help?: string
  placeholder?: string
  type: 'textarea' | 'choice'
  options?: string[]
}

export const CONSULTA_QUESTIONS: ConsultaQuestion[] = [
  {
    id: 'topic',
    title: '¿Qué quieres predicar hoy?',
    help: 'Un tema, un pasaje o una pregunta que te mueve.',
    placeholder: 'Ej: La gracia que transforma (Tito 2:11-14)',
    type: 'textarea'
  },
  {
    id: 'emphasis',
    title: '¿Qué temas o énfasis tienes en mente?',
    help: 'Ángulos, subtemas, palabras clave.',
    placeholder: 'Ej: gracia, arrepentimiento, esperanza, identidad',
    type: 'textarea'
  },
  {
    id: 'audience',
    title: '¿A quién predicas y cuánto tiempo?',
    help: 'Audiencia y duración estimada.',
    placeholder: 'Ej: congregación general, 30 minutos',
    type: 'textarea'
  },
  {
    id: 'aim',
    title: '¿Cuál es el objetivo o tono?',
    help: 'La dirección que quieres dar al mensaje.',
    type: 'choice',
    options: [
      'consulta.aim.teach',
      'consulta.aim.exhort',
      'consulta.aim.evangelize',
      'consulta.aim.console',
      'consulta.aim.confront',
      'consulta.aim.worship'
    ]
  },
  {
    id: 'genre',
    title: '¿Qué género literario es el texto?',
    help: 'Define cómo interpretar y aplicar (si el tema no es un pasaje, déjalo libre).',
    type: 'choice',
    options: [
      'consulta.genre.narrative',
      'consulta.genre.law',
      'consulta.genre.prophecy',
      'consulta.genre.poetry',
      'consulta.genre.wisdom',
      'consulta.genre.gospel',
      'consulta.genre.parable',
      'consulta.genre.epistle',
      'consulta.genre.apocalyptic',
      'consulta.genre.free'
    ]
  },
  {
    id: 'delivery',
    title: '¿Con qué estilo lo vas a entregar?',
    help: 'Incluye técnicas de oratoria en la preparación final.',
    type: 'choice',
    options: [
      'consulta.delivery.expositive',
      'consulta.delivery.narrative',
      'consulta.delivery.evangelistic',
      'consulta.delivery.apologetic',
      'consulta.delivery.pentecostal',
      'consulta.delivery.didactic'
    ]
  }
]

export interface SermonAnswers {
  topic: string
  emphasis: string
  audience: string
  aim: string
  genre?: string
  delivery?: string
}

export interface OutlineResult {
  title: string
  markdown: string
  suggestedTopics: string[]
}

export interface OutlineGenerator {
  readonly kind: 'guided' | 'ai'
  generate(answers: SermonAnswers): Promise<OutlineResult>
}

export interface ChatRequest {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  temperature?: number
  maxTokens?: number
}

export type ChatFn = (request: ChatRequest) => Promise<{ text: string; model: string }>

function titleFromTopic(topic: string): string {
  const firstLine = topic.split('\n')[0].trim()
  if (!firstLine) return 'Nueva predicacion'
  return firstLine.length > 70 ? `${firstLine.slice(0, 67)}...` : firstLine
}

export class GuidedGenerator implements OutlineGenerator {
  readonly kind = 'guided' as const

  async generate(answers: SermonAnswers): Promise<OutlineResult> {
    const title = titleFromTopic(answers.topic)
    const emphasis = answers.emphasis.trim()
    const aim = answers.aim || 'Enseñar'
    const audience = answers.audience.trim()
    const genre = (answers.genre ?? '').trim()
    const delivery = (answers.delivery ?? '').trim()

    const markdown = [
      `# ${title}`,
      '',
      '## Texto base',
      '',
      answers.topic.includes(':') || /\d/.test(answers.topic) ? `> ${answers.topic}` : '> ',
      '',
      '## Gancho',
      '',
      '- Necesidad humana que responde: ',
      '- Transición al texto: ',
      '',
      '## Concepto (exégesis)',
      '',
      genre ? `Género literario: ${genre}` : '',
      '- Gran idea del texto: ',
      '- Contexto histórico-literario: ',
      '',
      emphasis ? emphasis : '',
      '',
      '## Puntos principales',
      '',
      '### I. ',
      '- ',
      '- ',
      '',
      '### II. ',
      '- ',
      '- ',
      '',
      '### III. ',
      '- ',
      '- ',
      '',
      '## Ejemplo',
      '',
      '- Caso cotidiano: ',
      '- Analogía: ',
      '',
      '## Aplicacion',
      '',
      audience ? `Dirigido a: ${audience}` : '',
      '',
      '- ',
      '',
      '## Desafío',
      '',
      '- Acción concreta esta semana: ',
      '',
      `## Llamado / conclusion`,
      '',
      `Objetivo: ${aim}.`,
      delivery ? `Estilo de entrega: ${delivery} (ver guía de oratoria).` : '',
      '',
      '## Oracion',
      '',
      '## Notas y referencias',
      '',
      '> Biblioteca del predicador: Hermenéutica Bíblica (Martínez); La Predicación Bíblica (Robinson).'
    ]
      .filter(Boolean)
      .join('\n')

    const suggestedTopics = Array.from(
      new Set(
        [answers.topic, ...emphasis.split(/[\n,;]+/), aim]
          .map((item) => item.trim())
          .filter((item) => item.length > 2)
          .slice(0, 6)
      )
    )

    return { title, markdown, suggestedTopics }
  }
}

const AI_SYSTEM_PROMPT = [
  'Eres un asistente de estudio biblico y predicacion, fiel a la Escritura y pastoral.',
  'Respondes SIEMPRE en Markdown, en el idioma del usuario, con tono claro y devocional.',
  'Estructura el bosquejo con estas secciones exactas como encabezados ##:',
  'Texto base, Gancho, Concepto (exegesis), Puntos principales (I, II, III con subpuntos),',
  'Ejemplo, Aplicacion, Desafio, Llamado / conclusion, Oracion, Notas y referencias.',
  'Sigue el marco persuasivo: Gancho (conecta con una necesidad humana) ->',
  'Concepto (extrae la gran idea del texto en su contexto original) -> Ejemplo (aplica la',
  'verdad a la vida moderna) -> Desafio (llamado a la accion claro y verificable).',
  'Cita referencias biblicas en el formato "Libro Capitulo:Versiculo".',
  'Si recibes un genero literario, respeta sus reglas de interpretacion.',
  'No inventes citas textuales: si no estas seguro, describe la idea sin comillas.'
].join(' ')

export class AiGenerator implements OutlineGenerator {
  readonly kind = 'ai' as const

  constructor(private readonly chat: ChatFn) {}

  async generate(answers: SermonAnswers): Promise<OutlineResult> {
    const prompt = [
      `Tema o pasaje: ${answers.topic || '(sin especificar)'}`,
      `Enfasis / subtemas: ${answers.emphasis || '(libre)'}`,
      `Audiencia y duracion: ${answers.audience || '(general)'}`,
      `Objetivo o tono: ${answers.aim || 'Ensenar'}`,
      answers.genre ? `Genero literario del texto: ${answers.genre}` : '',
      answers.delivery ? `Estilo de entrega: ${answers.delivery}` : '',
      '',
      'Genera el bosquejo completo en Markdown, listo para predicar.'
    ]
      .filter(Boolean)
      .join('\n')

    const { text } = await this.chat({
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      temperature: 0.65,
      maxTokens: 1600
    })

    const markdown = text.trim()
    const heading = markdown.match(/^#\s+(.+)$/m)
    const title = heading?.[1]?.trim() || titleFromTopic(answers.topic)
    const suggestedTopics = Array.from(
      new Set(
        [answers.topic, ...answers.emphasis.split(/[\n,;]+/), answers.aim]
          .map((item) => item.trim())
          .filter((item) => item.length > 2)
          .slice(0, 6)
      )
    )
    return { title, markdown, suggestedTopics }
  }
}

export function createOutlineGenerator(
  kind: 'guided' | 'ai' = 'guided',
  chat?: ChatFn
): OutlineGenerator {
  if (kind === 'ai' && chat) return new AiGenerator(chat)
  return new GuidedGenerator()
}
