export interface ConsultaQuestion {
  id: 'topic' | 'emphasis' | 'audience' | 'aim'
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
    options: ['Enseñar', 'Exhortar', 'Evangelizar', 'Consolar', 'Confrontar', 'Adorar']
  }
]

export interface SermonAnswers {
  topic: string
  emphasis: string
  audience: string
  aim: string
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

    const markdown = [
      `# ${title}`,
      '',
      '## Texto base',
      '',
      answers.topic.includes(':') || /\d/.test(answers.topic) ? `> ${answers.topic}` : '> ',
      '',
      '## Introduccion',
      '',
      '- Gancho: ',
      '- Necesidad que responde: ',
      '',
      '## Idea central',
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
      '## Ilustraciones',
      '',
      '- ',
      '',
      '## Aplicacion',
      '',
      audience ? `Dirigido a: ${audience}` : '',
      '',
      '- ',
      '',
      '## Llamado / conclusion',
      '',
      `Objetivo: ${aim}. `,
      '',
      '## Oracion',
      '',
      '## Notas y referencias',
      ''
    ].join('\n')

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

export function createOutlineGenerator(_kind: 'guided' | 'ai' = 'guided'): OutlineGenerator {
  // La implementacion 'ai' se añadira mas adelante sin tocar la UI.
  return new GuidedGenerator()
}
