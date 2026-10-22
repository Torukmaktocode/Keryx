/**
 * Sub-agente de intención (0 tokens): interpreta la frase del usuario
 * palabra por palabra ANTES de minar los módulos. Léxico determinista en
 * código: cada palabra reconocida se anota con su tema y su acercamiento
 * pastoral. La IA no participa aquí; solo RECIBE esta lectura como
 * "conexión con la petición" para redactar la voz acercándose a lo pedido.
 */
export interface IntentWord {
  word: string
  tema: string
  enfoque: string
}

export interface IntentProfile {
  raw: string
  tema: string
  enfoque: string
  palabras: IntentWord[]
  /** Relectura amable de lo pedido ('' si no hay tema reconocido). */
  frase: string
  /** Palabras útiles para ubicar el pasaje (sin ruido de cortesía). */
  searchTerms: string[]
}

interface Llave {
  stems: string[]
  tema: string
  enfoque: string
}

const LEXICO: Llave[] = [
  {
    stems: ['miedo', 'temor', 'ansiedad', 'angust', 'preocup', 'panico', 'inquiet'],
    tema: 'el miedo y la ansiedad',
    enfoque: 'consolar de tú a tú y dejar la paz de Dios en el corazón'
  },
  {
    stems: ['consol', 'duelo', 'luto', 'aflicc', 'perdid', 'tristez', 'llant'],
    tema: 'el dolor y el duelo',
    enfoque: 'acompañar con ternura a quien llora'
  },
  {
    stems: ['sufrim', 'sufrir', 'dolor'],
    tema: 'el sufrimiento',
    enfoque: 'sostener con esperanza en medio del dolor'
  },
  {
    stems: ['esperan', 'anhel'],
    tema: 'la esperanza',
    enfoque: 'levantar la mirada hacia la esperanza que no falla'
  },
  {
    stems: ['desanim', 'anim'],
    tema: 'el desánimo',
    enfoque: 'animar con cercanía y renovar las fuerzas'
  },
  {
    stems: ['cansanc', 'cansad', 'agotad', 'fatigad', 'cargad', 'carga'],
    tema: 'el cansancio y la carga',
    enfoque: 'invitar al descanso junto a Jesús'
  },
  {
    stems: ['descans'],
    tema: 'el descanso',
    enfoque: 'invitar a descansar en Dios'
  },
  {
    stems: ['gratitud', 'gracias', 'agradec'],
    tema: 'la gratitud',
    enfoque: 'despertar un corazón agradecido'
  },
  {
    stems: ['perdon', 'reconcil', 'resenti', 'rencor'],
    tema: 'el perdón',
    enfoque: 'abrir camino al perdón recibido y dado'
  },
  {
    stems: ['amor', 'amar'],
    tema: 'el amor',
    enfoque: 'encender el amor de Dios en el día a día'
  },
  {
    stems: ['matrimon', 'familia', 'hijos', 'hijas', 'padres', 'pareja', 'hogar'],
    tema: 'la familia y el hogar',
    enfoque: 'fortalecer la casa con la Palabra'
  },
  {
    stems: ['fe', 'confiar', 'confianza', 'crey'],
    tema: 'la fe',
    enfoque: 'fortalecer la confianza en Dios'
  },
  {
    stems: ['proposito', 'llamado', 'vocacion', 'destino', 'decision', 'direccion'],
    tema: 'el propósito y el llamado',
    enfoque: 'orientar cada paso hacia el llamado de Dios'
  },
  {
    stems: ['paz', 'tranquil', 'quietud'],
    tema: 'la paz',
    enfoque: 'dejar que la paz de Dios gobierne el corazón'
  },
  {
    stems: ['gozo', 'alegr'],
    tema: 'el gozo',
    enfoque: 'devolver la alegría aun en lo ordinario'
  },
  {
    stems: ['prueba', 'adversid', 'tormenta', 'batalla', 'lucha', 'resisten', 'perseveran', 'fortalec'],
    tema: 'la adversidad',
    enfoque: 'fortalecer para perseverar sin rendirse'
  },
  {
    stems: ['dinero', 'provision', 'finanzas', 'deuda', 'pobreza', 'necesidad'],
    tema: 'la provisión',
    enfoque: 'confiar en el Padre que provee'
  },
  {
    stems: ['sanidad', 'enferm', 'sanar'],
    tema: 'la sanidad',
    enfoque: 'acompañar con la esperanza del que sana'
  },
  {
    stems: ['oracion', 'orar', 'interces'],
    tema: 'la oración',
    enfoque: 'animar a orar con confianza'
  },
  {
    stems: ['evangelio', 'evangeliz', 'mision', 'testimoni'],
    tema: 'el evangelio y la misión',
    enfoque: 'enviar a compartir lo recibido'
  },
  {
    stems: ['arrepenti', 'pecad', 'regreso'],
    tema: 'el arrepentimiento',
    enfoque: 'llamar con gracia al regreso a casa'
  },
  {
    stems: ['santidad', 'santific', 'integridad', 'caracter'],
    tema: 'la santidad',
    enfoque: 'invitar a una vida santa, alcanzable por gracia'
  },
  {
    stems: ['sabidur', 'sabio', 'consejo'],
    tema: 'la sabiduría',
    enfoque: 'iluminar las decisiones con la Palabra'
  }
]

/** Ruido de cortesía: no sirve para ubicar pasajes ni para minar temas. */
const RUIDO = new Set([
  'crea', 'creame', 'crear', 'hace', 'hazme', 'hacer', 'quiero', 'quisiera',
  'necesito', 'dame', 'favor', 'sobre', 'para', 'como', 'cuando', 'donde',
  'esto', 'este', 'esta', 'tambien', 'sermon', 'sermones', 'estudio',
  'devocional', 'predicar', 'predicacion', 'mensaje', 'verso', 'versiculo',
  'pasaje', 'texto', 'frase', 'hablar', 'dijo', 'quiere', 'detalle'
])

const deacc = (word: string): string =>
  word.normalize('NFD').replace(/\p{Diacritic}/gu, '')

const KIND_LABEL: Record<string, string> = {
  crearsermon: 'un sermón',
  crearestudio: 'un estudio bíblico',
  creardevocional: 'un devocional'
}

/** Interpreta la frase palabra por palabra (0 tokens, determinista). */
export function buildIntent(query: string, kind: string): IntentProfile {
  const raw = query.trim()
  const words = raw
    .toLowerCase()
    .split(/[^\p{L}]+/u)
    .filter((w) => w.length >= 3)

  const palabras: IntentWord[] = []
  const counts = new Map<string, number>()
  const enfoques = new Map<string, string>()

  for (const word of words) {
    const norm = deacc(word)
    for (const entry of LEXICO) {
      const hit = entry.stems.some((stem) =>
        stem.length < 4 ? norm === stem : norm.startsWith(stem)
      )
      if (!hit) continue
      if (!palabras.some((p) => p.word === word)) {
        palabras.push({ word, tema: entry.tema, enfoque: entry.enfoque })
      }
      counts.set(entry.tema, (counts.get(entry.tema) ?? 0) + 1)
      enfoques.set(entry.tema, entry.enfoque)
      break
    }
  }

  let tema = ''
  let max = 0
  for (const [key, count] of counts) {
    if (count > max) {
      tema = key
      max = count
    }
  }
  const enfoque = tema ? (enfoques.get(tema) ?? '') : ''

  const label = KIND_LABEL[kind] ?? 'tu mensaje'
  const frase = tema ? `${label} sobre ${tema}, para ${enfoque}` : ''

  const terms = [...new Set(
    words
      .filter((w) => w.length >= 4 && !RUIDO.has(deacc(w)))
      .flatMap((w) => (w.length >= 5 && w.endsWith('s') ? [w, w.slice(0, -1)] : [w]))
  )].sort((a, b) => b.length - a.length)

  return { raw, tema, enfoque, palabras, frase, searchTerms: terms }
}

/** Bloque amable "conexión con la petición" para prompts y documentos. */
export function intentBlock(intent: IntentProfile): string[] {
  const lines: string[] = []
  if (intent.tema) {
    lines.push(`> 💬 **Tu petición:** «${intent.raw}»`)
    lines.push(`> La entendí como ${intent.frase}.`)
    if (intent.palabras.length) {
      lines.push(
        `> *Conexión por palabra:* ${intent.palabras
          .slice(0, 6)
          .map((p) => `*${p.word}* → ${p.tema}`)
          .join(' · ')}.`
      )
    }
  } else {
    lines.push(`> 💬 **Tu petición:** «${intent.raw}» — la tomo tal cual y la busco en tus módulos.`)
  }
  return lines
}
