export interface TemplateSection {
  id: string
  heading: string
  hint?: string
}

export type TemplateId = 'free' | 'sermon' | 'study' | 'devotional'

export interface DocumentTemplate {
  id: TemplateId
  name: string
  description: string
  sections: TemplateSection[]
  build: (title?: string) => string
}

export const SERMON_SECTIONS: TemplateSection[] = [
  { id: 'title', heading: 'Titulo', hint: 'Un titulo claro y memorable' },
  { id: 'text', heading: 'Texto base', hint: 'Referencia biblica principal' },
  { id: 'intro', heading: 'Introduccion', hint: 'Gancho, contexto y necesidad' },
  { id: 'idea', heading: 'Idea central', hint: 'La predicacion en una sola frase' },
  { id: 'points', heading: 'Puntos principales', hint: 'I, II, III con subpuntos' },
  { id: 'illustrations', heading: 'Ilustraciones', hint: 'Historias, ejemplos, apoyos' },
  { id: 'application', heading: 'Aplicacion', hint: 'Como vivirlo esta semana' },
  { id: 'call', heading: 'Llamado / conclusion', hint: 'Apelacion y cierre' },
  { id: 'prayer', heading: 'Oracion', hint: 'Oracion de cierre' },
  { id: 'notes', heading: 'Notas y referencias', hint: 'Fuentes, comentarios, lexicos' }
]

export function buildSermonSkeleton(title = 'Nueva predicacion'): string {
  const blocks = SERMON_SECTIONS.map((section) => {
    if (section.id === 'title') return `# ${title}\n`
    if (section.id === 'points') {
      return `## Puntos principales\n\n### I. \n- \n- \n\n### II. \n- \n- \n\n### III. \n- \n- \n`
    }
    if (section.id === 'text') return `## Texto base\n\n> \n`
    return `## ${section.heading}\n\n`
  })
  return blocks.join('\n')
}

export function buildStudySkeleton(title = 'Nuevo estudio'): string {
  return `# ${title}\n\n## Pasaje\n\n> \n\n## Observacion\n\n## Interpretacion\n\n## Aplicacion\n\n## Preguntas\n\n- \n`
}

export function buildDevotionalSkeleton(title = 'Nuevo devocional'): string {
  return `# ${title}\n\n## Versiculo\n\n> \n\n## Reflexion\n\n## Oracion\n\n`
}

export const TEMPLATES: DocumentTemplate[] = [
  {
    id: 'free',
    name: 'Modo libre',
    description: 'Documento en blanco, 100% minimalista.',
    sections: [],
    build: () => ''
  },
  {
    id: 'sermon',
    name: 'Plantilla de predicacion',
    description: 'Bosquejo completo con 10 secciones.',
    sections: SERMON_SECTIONS,
    build: buildSermonSkeleton
  },
  {
    id: 'study',
    name: 'Estudio biblico',
    description: 'Observacion, interpretacion y aplicacion.',
    sections: [],
    build: buildStudySkeleton
  },
  {
    id: 'devotional',
    name: 'Devocional',
    description: 'Versiculo, reflexion y oracion.',
    sections: [],
    build: buildDevotionalSkeleton
  }
]

export function getTemplate(id: TemplateId): DocumentTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
