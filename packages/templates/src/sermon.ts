export interface TemplateSection {
  id: string
  heading: string
  hint?: string
}

export type TemplateId = 'free' | 'sermon' | 'study' | 'devotional' | 'expositive' | 'hermeneuticStudy'

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

import { HERMENEUTIC_STEPS, SERMON_FRAMEWORK } from './library'

export const EXPOSITIVE_SECTIONS: TemplateSection[] = SERMON_FRAMEWORK.map((step) => ({
  id: step.id,
  heading: step.heading,
  hint: step.description
}))

export const HERMENEUTIC_SECTIONS: TemplateSection[] = [  ...HERMENEUTIC_STEPS.map((step) => ({
    id: step.id,
    heading: step.heading,
    hint: step.help
  })),
  { id: 'bigIdea', heading: 'Gran idea', hint: 'Formula en una frase que afirma y exige el texto hoy' }
]

export function buildSermonSkeleton(title = 'Nueva predicacion'): string {
  const blocks = SERMON_SECTIONS.map((section) => {
    if (section.id === 'title') return `# ${title}\n`
    const suggestion = section.hint ? `> _Sugerencia: ${section.hint}_\n` : ''
    if (section.id === 'points') {
      return `## ${section.heading}\n\n${suggestion}\n### I. \n- \n- \n\n### II. \n- \n- \n\n### III. \n- \n- \n`
    }
    if (section.id === 'text') return `## ${section.heading}\n\n${suggestion}\n> \n`
    return `## ${section.heading}\n\n${suggestion}\n`
  })
  return blocks.join('\n')
}

export function buildFromSections(sections: TemplateSection[], title = 'Nuevo documento'): string {
  const hasTitle = sections.some((section) => section.id === 'title')
  const head = hasTitle ? '' : `# ${title}\n\n`
  const body = sections
    .filter((section) => section.id !== 'title')
    .map((section) => {
      const suggestion = section.hint ? `> _Sugerencia: ${section.hint}_\n` : ''
      return `## ${section.heading}\n\n${suggestion}\n`
    })
    .join('\n')
  return `${head}${body}`
}

export const STUDY_SECTIONS: TemplateSection[] = [
  { id: 'passage', heading: 'Pasaje', hint: 'referencia biblica principal' },
  { id: 'observation', heading: 'Observacion', hint: 'que dice el texto? Detalles, palabras clave, contexto' },
  { id: 'interpretation', heading: 'Interpretacion', hint: 'que significa? Compara con otros pasajes' },
  { id: 'application', heading: 'Aplicacion', hint: 'como lo vivo esta semana?' },
  { id: 'questions', heading: 'Preguntas', hint: 'preguntas para profundizar' }
]

export const DEVOTIONAL_SECTIONS: TemplateSection[] = [
  { id: 'verse', heading: 'Versiculo', hint: 'elige un versiculo clave' },
  { id: 'reflection', heading: 'Reflexion', hint: 'que te dice Dios a traves de este texto?' },
  { id: 'prayer', heading: 'Oracion', hint: 'responde a Dios en tus palabras' }
]

export type SectionPresetId = 'sermon' | 'devotional' | 'study' | 'blank'

export const SECTION_PRESETS: Record<SectionPresetId, TemplateSection[]> = {
  sermon: SERMON_SECTIONS,
  devotional: DEVOTIONAL_SECTIONS,
  study: STUDY_SECTIONS,
  blank: []
}

export function buildStudySkeleton(title = 'Nuevo estudio'): string {
  return `${buildFromSections(STUDY_SECTIONS, title)}> \n\n- \n`
}

export function buildDevotionalSkeleton(title = 'Nuevo devocional'): string {
  return `${buildFromSections(DEVOTIONAL_SECTIONS, title)}> \n`
}

/** Marco persuasivo: Gancho -> Concepto -> Ejemplo -> Desafio. */
export function buildExpositiveSkeleton(title = 'Predicacion expositiva'): string {
  return `# ${title}\n\n## Texto base\n\n> \n\n## Gancho\n\n> Conecta con una necesidad humana del auditorio\n\n- Necesidad: \n- Transicion: \n\n## Concepto (exegesis)\n\n> Extrae la gran idea del texto en su contexto original\n\n- Genero y contexto: \n- Termino clave (originales): \n- **Gran idea: **\n\n## Ejemplo\n\n> Aplica la verdad a la vida moderna\n\n- Caso cotidiano: \n- Analogia: \n\n## Desafio\n\n> Llamado a la accion claro y verificable\n\n- Accion esta semana: \n- Señal de cumplimiento: \n\n## Oracion\n\n## Notas y referencias\n\n> _Sugerencia: fee la checklist hermeneutica en Estudio para llenar el Concepto_\n`
}

/** Checklist hermeneutica en cinco pasos + gran idea. */
export function buildHermeneuticStudySkeleton(title = 'Estudio hermeneutico'): string {
  const steps = HERMENEUTIC_STEPS.map(
    (step) => `## ${step.heading}\n\n> ${step.help}\n\n\n`
  ).join('\n')
  return `# ${title}\n\n## Pasaje\n\n> \n\n${steps}## Gran idea\n\n> Formula en una frase que afirma y exige el texto hoy\n\n\n## Aplicacion\n\n- \n`
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
    sections: STUDY_SECTIONS,
    build: buildStudySkeleton
  },
  {
    id: 'devotional',
    name: 'Devocional',
    description: 'Versiculo, reflexion y oracion.',
    sections: DEVOTIONAL_SECTIONS,
    build: buildDevotionalSkeleton
  },
  {
    id: 'expositive',
    name: 'Predicación expositiva',
    description: 'Gancho → Concepto → Ejemplo → Desafío.',
    sections: EXPOSITIVE_SECTIONS,
    build: buildExpositiveSkeleton
  },
  {
    id: 'hermeneuticStudy',
    name: 'Estudio hermenéutico',
    description: 'Checklist de interpretación en cinco pasos.',
    sections: HERMENEUTIC_SECTIONS,
    build: buildHermeneuticStudySkeleton
  }
]

export function getTemplate(id: TemplateId): DocumentTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]
}
