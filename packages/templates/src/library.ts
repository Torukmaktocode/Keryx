/**
 * Biblioteca del Predicador.
 *
 * Solo referencias bibliograficas (ficha + resumen propio). No se copia texto
 * de obras con derechos de autor; los resumenes son elaborados para Keryx.
 */

export type ResourceCategory =
  | 'hermeneutics'
  | 'homiletics'
  | 'oratory'
  | 'theology'
  | 'classics'
  | 'tools'
  | 'outlines'
  | 'champlin'

export interface ResourceBook {
  id: string
  title: string
  author: string
  category: ResourceCategory
  summary: string
}

export interface SermonFrameworkStep {
  id: 'hook' | 'concept' | 'example' | 'challenge'
  heading: string
  description: string
}

export interface DeliveryTechnique {
  id: string
  title: string
  summary: string
  steps: string[]
}

export interface HermeneuticStep {
  id: 'genre' | 'context' | 'originals' | 'figures' | 'bridge'
  heading: string
  help: string
  placeholder: string
}

// --------------------------------------------------------------------------- //
// Marco del sermon
// --------------------------------------------------------------------------- //
export const SERMON_FRAMEWORK: SermonFrameworkStep[] = [
  {
    id: 'hook',
    heading: 'Gancho',
    description: 'Conectar con una necesidad humana concreta del auditorio.'
  },
  {
    id: 'concept',
    heading: 'Concepto (exégesis)',
    description: 'Extraer la gran idea del texto en su contexto original.'
  },
  {
    id: 'example',
    heading: 'Ejemplo',
    description: 'Aplicar esa verdad a la vida moderna con casos y metáforas.'
  },
  {
    id: 'challenge',
    heading: 'Desafío',
    description: 'Terminar con un llamado a la acción claro y verificable.'
  }
]

// --------------------------------------------------------------------------- //
// Bibliografia por categorias
// --------------------------------------------------------------------------- //
export const HERMENEUTICS: ResourceBook[] = [
  {
    id: 'martinez-hermeneutica',
    title: 'Hermenéutica Bíblica',
    author: 'José M. Martínez',
    category: 'hermeneutics',
    summary:
      'Referencia indispensable en el mundo hispanohablante: bases lingüísticas, contexto histórico, profecía, figuras retóricas y parábolas.'
  },
  {
    id: 'fee-stuart-lectura',
    title: 'La Lectura Eficaz de la Biblia',
    author: 'Gordon D. Fee y Douglas Stuart',
    category: 'hermeneutics',
    summary:
      'Guía práctica por géneros literarios (epístolas, evangelios, salmos, apocalíptica) respetando el contexto original antes de aplicar al presente.'
  },
  {
    id: 'duvall-hays-viaje',
    title: 'Hermenéutica: Entendiendo la Palabra de Dios',
    author: 'J. Scott Duvall y J. Daniel Hays',
    category: 'hermeneutics',
    summary:
      'Método del "viaje interpretativo" para cruzar la brecha cultural entre el texto antiguo y el lector actual sin perder precisión.'
  }
]

export const HOMILETICS: ResourceBook[] = [
  {
    id: 'robinson-predicacion',
    title: 'La Predicación Bíblica',
    author: 'Haddon W. Robinson',
    category: 'homiletics',
    summary:
      'El estándar moderno de la predicación expositiva: extraer "la gran idea" del texto y estructurar el mensaje alrededor de ese concepto único.'
  },
  {
    id: 'crane-sermon',
    title: 'El Sermón Eficaz',
    author: 'James D. Crane',
    category: 'homiletics',
    summary:
      'Clásico metodológico: tema, exégesis, bosquejo, divisiones, introducción y conclusión, paso a paso.'
  },
  {
    id: 'spurgeon-discursos',
    title: 'Discursos a mis estudiantes (El Ministerio de la Predicación)',
    author: 'Charles H. Spurgeon',
    category: 'homiletics',
    summary:
      'Obra histórica con sabiduría práctica: uso de la voz, manejo del auditorio y actitud del orador.'
  },
  {
    id: 'keller-predicacion',
    title: 'La Predicación: Comunicar la fe en una época de escepticismo',
    author: 'Timothy Keller',
    category: 'homiletics',
    summary:
      'Cómo adaptar el discurso a audiencias modernas, conectando verdades antiguas con las inquietudes culturales e intelectuales de hoy.'
  }
]

export const ORATORY: ResourceBook[] = [
  {
    id: 'carnegie-hablar',
    title: 'El arte de hablar en público',
    author: 'Dale Carnegie',
    category: 'oratory',
    summary:
      'Confianza, superación del miedo escénico y discursos persuasivos con conexión emocional genuina.'
  },
  {
    id: 'aristoteles-retorica',
    title: 'Retórica',
    author: 'Aristóteles',
    category: 'oratory',
    summary:
      'Tratado fundacional de la persuasión: ethos (credibilidad), pathos (emoción) y logos (argumentación).'
  },
  {
    id: 'anderson-ted',
    title: 'Charlas TED: La guía oficial TED para hablar en público',
    author: 'Chris Anderson',
    category: 'oratory',
    summary:
      'Empaquetar ideas complejas en presentaciones memorables con mínima dependencia de notas o apoyos visuales.'
  }
]

export const THEOLOGY: ResourceBook[] = [
  {
    id: 'grudem-sistematica',
    title: 'Teología Sistemática',
    author: 'Wayne Grudem',
    category: 'theology',
    summary: 'Doctrina evangélica por loci, con bibliografía y preguntas por capítulo.'
  },
  {
    id: 'berkhof-sistematica',
    title: 'Teología Sistemática',
    author: 'Louis Berkhof',
    category: 'theology',
    summary: 'La summa reformada clásica de referencia en seminarios.'
  }
]

export const CLASSICS: ResourceBook[] = [
  {
    id: 'henry-comentario',
    title: 'Comentario Bíblico de Matthew Henry',
    author: 'Matthew Henry',
    category: 'classics',
    summary: 'Archivo completo libro por libro; devocional y expositivo.'
  },
  {
    id: 'calvino-institucion',
    title: 'Institución de la Religión Cristiana',
    author: 'Juan Calvino',
    category: 'classics',
    summary: 'La columna de la teología reformada y modelo de exposición doctrinal.'
  },
  {
    id: 'puritanos-tratados',
    title: 'Tratados de los puritanos',
    author: 'Baxter, Owen, Watson',
    category: 'classics',
    summary: 'Examen de conciencia con rigor pastoral (El Reformador, La Mortificación del Pecado, Una Introducción de cuerpo de divinidad).'
  },
  {
    id: 'bunyan-peregrino',
    title: 'El Progreso del Peregrino',
    author: 'John Bunyan',
    category: 'classics',
    summary: 'Alegoría maestra del camino cristiano, fuente inagotable de ilustraciones.'
  }
]

export const TOOLS: ResourceBook[] = [
  {
    id: 'strong-concordancia',
    title: 'Concordancia Strong',
    author: 'James Strong',
    category: 'tools',
    summary: 'Índice exhaustivo con números por palabra original (griego/hebreo).'
  },
  {
    id: 'vine-diccionario',
    title: 'Diccionario Expositivo de Palabras del AT y NT',
    author: 'W. E. Vine',
    category: 'tools',
    summary: 'Matices semánticos de los términos originales y sus traducciones.'
  }
]

export const OUTLINES: ResourceBook[] = [
  {
    id: 'wiersbe-bosquejos',
    title: 'Bosquejos de sermones',
    author: 'Warren Wiersbe',
    category: 'outlines',
    summary: 'Esqueletos listos para adaptar con el propio estilo y anécdotas.'
  },
  {
    id: 'vila-bosquejos',
    title: 'Bosquejos de sermones (Samuel Vila)',
    author: 'Samuel Vila',
    category: 'outlines',
    summary: 'Amplia colección hispánica de esqueletos por textos y temas.'
  }
]

export const CHAMPLIN: ResourceBook[] = [
  {
    id: 'champlin-at',
    title: 'O Antigo Testamento Interpretado',
    author: 'R. N. Champlin',
    category: 'champlin',
    summary: 'Comentario versículo por versículo del AT con texto original hebreo.'
  },
  {
    id: 'champlin-nt',
    title: 'O Novo Testamento Interpretado',
    author: 'R. N. Champlin',
    category: 'champlin',
    summary: 'Comentario versículo por versículo del NT con texto griego.'
  },
  {
    id: 'champlin-enciclopedia',
    title: 'Enciclopedia de Biblia, Teología y Filosofía',
    author: 'R. N. Champlin',
    category: 'champlin',
    summary: 'Artículos temáticos con fotos, diagramas y mapas; apoyo histórico-filosófico.'
  }
]

export const LIBRARY: ResourceBook[] = [
  ...HERMENEUTICS,
  ...HOMILETICS,
  ...ORATORY,
  ...THEOLOGY,
  ...CLASSICS,
  ...TOOLS,
  ...OUTLINES,
  ...CHAMPLIN
]

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  'hermeneutics',
  'homiletics',
  'oratory',
  'theology',
  'classics',
  'tools',
  'outlines',
  'champlin'
]

export function booksByCategory(category: ResourceCategory): ResourceBook[] {
  return LIBRARY.filter((book) => book.category === category)
}

// --------------------------------------------------------------------------- //
// Tecnicas de oratoria (Polito y aplicacion pentecostal)
// --------------------------------------------------------------------------- //
export const DELIVERY_TECHNIQUES: DeliveryTechnique[] = [
  {
    id: 'adrenalina',
    title: 'Control de adrenalina',
    summary: 'Domina el miedo escénico antes de subir al púlpito.',
    steps: [
      'Ensayo final en voz alta la víspera (no improvises la apertura).',
      'Respira 4-7-8 un minuto antes de predicar.',
      'Memoriza solo las dos primeras frases: arrancar seguro dispara la confianza.',
      'Recorrido físico: camina hasta el púlpito con paso tranquilo.'
    ]
  },
  {
    id: 'pausas',
    title: 'Pausas con propósito',
    summary: 'El silencio es la herramienta retórica más potente del púlpito.',
    steps: [
      'Pausa de 2 segundos tras cada frase clave (deja descargar la verdad).',
      'Pausa antes de cada punto principal: anuncia el cambio de ciclo.',
      'Sustituye muletillas ("eh", "verdad") por silencio + mirada.',
      'Pausa larga antes del llamado final: prepara el desafío.'
    ]
  },
  {
    id: 'contacto-visual',
    title: 'Contacto visual por zonas',
    summary: 'Conecta con toda la asamblea, no con la pared del fondo.',
    steps: [
      'Divide el auditorio en tres zonas: izquierda, centro, derecha.',
      'Sostén la mirada 3-5 segundos por persona, no recorridos rápidos.',
      'Al cerrar una idea, clava la vista en alguien concreto.',
      'Incluye también verjas laterales y balcón (quienes se ven olvidados dejan de escuchar).'
    ]
  },
  {
    id: 'respiracion',
    title: 'Respiración diafragmática',
    summary: 'Voz fuerte sin desgastar las cuerdas vocales.',
    steps: [
      'Inhala por la nariz 4 tiempos, sostén 4, exhala 8.',
      'Proyecta desde el abdomen: volumen, no gritos.',
      'Frases cortas en los puntos de fervor; recarga aire antes de subirlas.',
      'Hidrátate con sorbos pequeños: evita tos y carraspeo en pleno mensaje.'
    ]
  },
  {
    id: 'fervor-estructura',
    title: 'Fervor con estructura (pentecostal)',
    summary:
      'Aplicación a la Asamblea de Dios y congregaciones pentecostales: ferviente sin perder el hilo ni la voz.',
    steps: [
      'Bosquejo fijo antes de subir: fervor dentro de la estructura, no en su lugar.',
      'Carga emocional en aplicaciones e ilustraciones; exégesis con voz serena.',
      'Cuando se mueva el Espíritu, anota mentalmente dónde estabas para retomar la gran idea.',
      'Cierra cada dinámica volviendo al texto: la gran idea manda.'
    ]
  }
]

// --------------------------------------------------------------------------- //
// Pasos hermeneuticos (checklist interactiva)
// --------------------------------------------------------------------------- //
export const HERMENEUTIC_STEPS: HermeneuticStep[] = [
  {
    id: 'genre',
    heading: '1. Género literario',
    help: '¿Qué clase de texto es? (narrativa, ley, profecía, salmo, sabiduría, evangelio, parábola, epístola, apocalíptica).',
    placeholder: 'Ej: Epístola paulina a los Filipenses, tono de gratitud y exhortación…'
  },
  {
    id: 'context',
    heading: '2. Contexto histórico-literario',
    help: '¿Quién escribe, a quién, cuándo, con qué propósito? ¿Qué viene justo antes y después?',
    placeholder: 'Ej: Pablo preso en Roma (c. 61 d.C.) escribe a una iglesia unida…'
  },
  {
    id: 'originals',
    heading: '3. Palabras clave en el original',
    help: 'Términos griego/hebreo clave (transliterados o Strong), con su rango semántico.',
    placeholder: 'Ej: φρονέω (phroneo, Strong G5426): "pensar/mirar como"…'
  },
  {
    id: 'figures',
    heading: '4. Figuras, parábolas y profecía',
    help: 'Imágenes, símbolos, tipos, cumplimientos o parábolas presentes en el texto.',
    placeholder: 'Ej: metáfora de la ciudadanía en los cielos (politeuma)…'
  },
  {
    id: 'bridge',
    heading: '5. Puente al presente',
    help: '¿Qué diferencia hay entre el entonces y el hoy? ¿Qué principio eterno se mantiene?',
    placeholder: 'Ej: la unidad en el evangelio ya no se expresa en una ciudad griega…'
  }
]

export function buildDeliveryGuide(): string {
  const lines: string[] = [
    '# Guía de entrega del mensaje',
    '',
    '> Técnicas de oratoria aplicadas al púlpito (Polito, Carnegie, Aristóteles, TED).',
    ''
  ]
  for (const technique of DELIVERY_TECHNIQUES) {
    lines.push(`## ${technique.title}`)
    lines.push('')
    lines.push(technique.summary, '')
    for (const step of technique.steps) lines.push(`- ${step}`)
    lines.push('')
  }
  return lines.join('\n')
}

// --------------------------------------------------------------------------- //
// Builders de Markdown
// --------------------------------------------------------------------------- //
export function buildBibliography(category?: ResourceCategory): string {
  const categories = category ? [category] : RESOURCE_CATEGORIES
  const lines: string[] = [
    '# Biblioteca del predicador',
    '',
    '> Referencias recomendadas de Hermenéutica, Homilética y Oratoria para armar sermones y estudios.',
    ''
  ]
  for (const cat of categories) {
    const books = booksByCategory(cat)
    if (!books.length) continue
    lines.push(`## ${cat}`, '')
    for (const book of books) {
      lines.push(`- **${book.title}** — ${book.author}.`, `  ${book.summary}`, '')
    }
  }
  return lines.join('\n')
}

export function buildSermonFramework(): string {
  const lines: string[] = [
    '# Marco del sermón',
    '',
    '> Estructura persuasiva en cuatro movimientos.',
    ''
  ]
  for (const [index, step] of SERMON_FRAMEWORK.entries()) {
    lines.push(
      `## ${index + 1}. ${step.heading}`,
      '',
      step.description,
      '',
      '- Requisitos: ',
      '- Apoyo bíblico: ',
      ''
    )
  }
  return lines.join('\n')
}

export interface HermeneuticAnswers {
  reference: string
  genre: string
  context: string
  originals: string
  figures: string
  bridge: string
  bigIdea: string
}

export const EMPTY_HERMENEUTIC_ANSWERS: HermeneuticAnswers = {
  reference: '',
  genre: '',
  context: '',
  originals: '',
  figures: '',
  bridge: '',
  bigIdea: ''
}

export function buildStudyFromChecklist(answers: HermeneuticAnswers): string {
  return [
    `# Estudio hermenéutico: ${answers.reference || '(pasaje)'}`,
    '',
    `## Pasaje`,
    '',
    `> ${answers.reference || ''}`,
    '',
    `## 1. Género literario`,
    '',
    answers.genre,
    '',
    `## 2. Contexto histórico-literario`,
    '',
    answers.context,
    '',
    `## 3. Palabras clave en el original`,
    '',
    answers.originals,
    '',
    `## 4. Figuras, parábolas y profecía`,
    '',
    answers.figures,
    '',
    `## 5. Puente al presente`,
    '',
    answers.bridge,
    '',
    `## Gran idea`,
    '',
    answers.bigIdea,
    ''
  ].join('\n')
}

export function buildHermeneuticGuide(): string {
  const lines: string[] = [
    '# Guía hermenéutica',
    '',
    '> Método para interpretar el texto en su contexto antes de aplicarlo al presente.',
    ''
  ]
  for (const step of HERMENEUTIC_STEPS) {
    lines.push(`## ${step.heading}`, '', step.help, '', '• Notas: ', '')
  }
  lines.push(
    '## Gran idea',
    '',
    'Formula en una sola frase qué afirma y que exige el pasaje hoy.',
    ''
  )
  return lines.join('\n')
}
