/**
 * SermonEngine: AST inmutable del sermon (documento completo por codigo).
 * buildSermonDocument es PURO: entrada (dossier + orador) → documento tipado
 * con todos los slots cubiertos (con fallback). La IA solo puede rellenar
 * el texto de un slot; jamas la estructura. renderSermon es el render
 * determinista 1:1. Invariante: el markdown final jamas contiene marcadores.
 */
import { parseReference } from './reference'
import type { Dossier } from './agents'
import type { IntentProfile } from './intent'

export interface OradorInfo {
  id: string
  name: string
  style: string
}

export interface Slot {
  /** Voz humana/IA (opcional). */
  text?: string
  /** Garantia: si no hay voz, este texto determinista aparece. */
  fallback: string
}

export interface Punto {
  signal: string
  title: string
  evidence: string
  bridge: Slot
}

export interface CitationLine {
  module: string
  entry: string
  kind: string
}

export interface SermonDocument {
  readonly ref: string
  readonly orador: string
  readonly personaId: string
  readonly voiceHeader: string
  readonly peticion?: IntentProfile
  /** Etiqueta de la primera diapositiva (Sermón/Estudio/Devocional); si falta se deduce de orador. */
  readonly presentacionKicker?: string
  readonly gancho: Slot
  readonly intro: Slot
  readonly texto: string[]
  readonly granIdea: string
  readonly contexto: Array<{ label: string; text: string }>
  readonly palabras: string[]
  readonly forma: string
  readonly puntos: readonly Punto[]
  readonly citas: string[]
  readonly casoReal: string[]
  readonly ilustracion: string[]
  readonly consenso: string[]
  readonly aplicacion: readonly string[]
  readonly meditacion: Slot
  readonly cierre: { recap: string; llamado: string; bendicion: string }
  readonly oracion: Slot
  readonly fuentes: readonly CitationLine[]
  readonly dossierChars: number
}

const SEÑALES = ['Primeramente…', 'En segundo lugar…', 'Y para concluir…', 'Para el punto 4…', 'Para el punto 5…']

const BENEDICCION =
  'El Señor te bendiga y te guarde; haga resplandecer su rostro sobre ti y se favorable a ti.'

export function slot(fallback: string, text?: string): Slot {
  return { fallback, text: text?.trim() || undefined }
}

function firstSentence(text: string): string {
  const plain = text.replace(/\[\[?[^\]]+\]\]?/g, '').trim()
  const cut = plain.split(/(?<=[.!?])\s/)[0] ?? plain
  return cut.slice(0, 220)
}

function shortEntry(text: string, max = 320): string {
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (plain.length <= max) return plain
  const cut = plain.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(' '))}, …`
}

function depthShort(entries: string[], max = 300): string {
  const plain = entries.join(' — ')
  return shortEntry(plain, max)
}

function entriesOf(dossier: Dossier, kind: string): string[] {
  return dossier.sections.filter((s) => s.kind === kind).flatMap((s) => s.entries)
}

function pointTitles(outlineLines: string[], commentLines: string[]): string[] {
  const raw = outlineLines
    .join('\n')
    .split('\n')
    .map((line) => line.replace(/^[#*>-\s]+/, '').trim())
    .filter((line) => /^\d+[).]\s+.{8,90}$/.test(line) || /^[IVX]+\.\s+.{8,90}$/i.test(line))
  const titles = raw
    .slice(0, 5)
    .map((line) => line.replace(/^\d+[).\s]+|^[IVX]+\.\s+/i, '').trim())
  if (titles.length >= 2) return titles
  return commentLines
    .slice(0, 5)
    .map((line) => firstSentence(line.replace(/^[^:]{0,36}:/, '')))
    .filter(Boolean)
}

/** Construye el documento COMPLETO (todos los slots con fallback). */
export function buildSermonDocument(
  dossier: Dossier,
  persona: OradorInfo,
  query: string,
  peticion?: IntentProfile
): SermonDocument {
  const parsed = parseReference(query)
  const ref = dossier.section ?? (parsed ? `${parsed.book} ${parsed.chapter}${parsed.verse ? `:${parsed.verse}` : ''}` : query)
  const textLines = entriesOf(dossier, 'texto')
  const commentLines = entriesOf(dossier, 'comentario')
  const outlineLines = entriesOf(dossier, 'bosquejo')
  const strongLines = entriesOf(dossier, 'strongs')
  const topicLines = entriesOf(dossier, 'tema')
  const gran = firstSentence(commentLines[0] ?? topicLines[0] ?? '')
  const isNone = persona.id === 'none'

  const introFallback = gran
    ? `Hoy abrimos ${ref}: ${gran} Este texto no vino a decorar la semana: vino a acompañarte en ella.`
    : `Hoy abrimos ${ref}; acércate con calma: esta Palabra también te busca a ti.`

  const textoPlano = textLines[0] ?? ''
  const meditationFallback = textoPlano
    ? `Lleva contigo esta semana: «${shortEntry(textoPlano.replace(/^\s*\d+\s*/, ''), 110)}» — ${ref}`
    : `Lleva contigo esta semana el nucleo de ${ref}.`

  const puntos = pointTitles(outlineLines, commentLines).map((title, index) => ({
    signal: SEÑALES[index] ?? `Para el punto ${index + 1}…`,
    title,
    evidence: shortEntry(commentLines[index] ?? '', 340),
    bridge: slot('', undefined)
  }))

  return {
    ref,
    orador: isNone ? 'tu propio estilo' : persona.name,
    personaId: persona.id,
    voiceHeader: isNone
      ? 'Tu propia voz: el cuerpo anclado queda intacto; escribe a tu manera.'
      : `${persona.name} — ${personaDirectiveOf(persona)}`,
    peticion,
    gancho: slot(`Comencemos con la Palabra misma: «${ref}». ${gran}`, undefined),
    intro: slot(introFallback, undefined),
    texto: textLines.map((line) => shortEntry(line, 400)),
    granIdea: gran || '[Lean el texto en voz alta: busca la frase que resuma el mensaje.]',
    contexto: [
      { label: 'Histórico', text: depthShort(entriesOf(dossier, 'historico')) },
      { label: 'Cultural', text: depthShort(entriesOf(dossier, 'cultural')) },
      { label: 'Teológico', text: depthShort(entriesOf(dossier, 'teologico')) },
      { label: 'Cristológico', text: depthShort(entriesOf(dossier, 'cristologico')) }
    ].filter((line) => line.text.length > 2),
    palabras: strongLines.slice(0, 2).map((entry) => shortEntry(entry, 240)),
    forma: personaShapeOf(persona),
    puntos,
    citas: entriesOf(dossier, 'cita').slice(0, 2).map((entry) => shortEntry(entry, 320)),
    casoReal: entriesOf(dossier, 'caso').map((entry) => shortEntry(entry, 420)),
    ilustracion: entriesOf(dossier, 'ilustracion').slice(0, 1).map((entry) => shortEntry(entry, 420)),
    consenso: entriesOf(dossier, 'consenso').slice(0, 3),
    aplicacion: [...entriesOf(dossier, 'aplicacion').slice(0, 2).map((entry) => shortEntry(entry, 260))],
    meditacion: slot(meditationFallback, undefined),
    cierre: {
      recap: gran || 'Vuelve al texto central y repítelo a la congregación.',
      llamado: isNone
        ? 'Tu llamado de cierre: resume el mensaje en una frase y da la invitación concreta para esta semana.'
        : `${persona.name}: ${personaClosingOf(persona)}`,
      bendicion: BENEDICCION
    },
    oracion: slot(oracionFallbackOf(ref), undefined),
    fuentes: dossier.citations.map((c) => ({ module: c.module, entry: c.entry, kind: c.kind })),
    dossierChars: dossier.chars
  }
}

export function personaDirectiveOf(persona: OradorInfo): string {
  // import tardio evitable: creator importa sermonEngine, no al reves.
  const mod = (globalThis as unknown as { __personaDirective?: (p: OradorInfo) => string }).__personaDirective
  return mod ? mod(persona) : persona.style
}

function personaShapeOf(persona: OradorInfo): string {
  const mod = (globalThis as unknown as { __personaShape?: (p: OradorInfo) => string }).__personaShape
  return mod ? mod(persona) : 'expositiva'
}

function personaClosingOf(persona: OradorInfo): string {
  const mod = (globalThis as unknown as { __personaClosing?: (p: OradorInfo) => string }).__personaClosing
  return mod ? mod(persona) : ''
}

function oracionFallbackOf(ref: string): string {
  return `Dios, gracias porque tu Palabra habló primero a otro mundo y hoy nos habla a nosotros, con la misma autoridad y la misma paciencia. Grábala en nosotros, sostén lo que hoy pesa, y que lo que oyeron de ${ref} se vuelva vida esta semana. Amén.`
}

/** Render Markdown determinista: sin regex, sin marcadores, 1:1 con el AST. */
export function renderSermon(doc: SermonDocument): string {
  const lines: string[] = []
  const push = (...xs: string[]): void => {
    lines.push(...xs)
  }

  push(`# Sermón: ${doc.ref}`, '')
  push(`> Voz: **${doc.orador}** — ${doc.voiceHeader} · Fuentes ancladas: **${doc.fuentes.length}** de ${new Set(doc.fuentes.map((f) => f.module)).size} módulos.`, '')

  if (doc.peticion && (doc.peticion.tema || doc.peticion.palabras.length)) {
    push(`> 💬 **Tu petición:** «${doc.peticion.raw}» — la entendí como ${doc.peticion.frase || 'tu frase, tomada tal cual'}.`)
    if (doc.peticion.palabras.length) {
      push(
        `> *Conexión por palabra:* ${doc.peticion.palabras
          .slice(0, 6)
          .map((p) => `*${p.word}* → ${p.tema}`)
          .join(' · ')}.`
      )
    }
    push('')
  }

  push('## Gancho', '', slotText(doc.gancho), '')
  push('## Introducción', '', slotText(doc.intro), '')

  push('## Texto: ' + doc.ref, '')
  for (const line of doc.texto) push(`> ${line}`)
  push('')

  push('## Gran idea', '', doc.granIdea, '')
  if (doc.contexto.length) {
    push('## Contexto', '')
    for (const line of doc.contexto) push(`- **${line.label}:** ${line.text}`)
    push('')
  }
  if (doc.palabras.length) {
    push('## Palabras originales', '')
    for (const line of doc.palabras) push(`- ${line}`)
    push('')
  }

  push('## El mensaje', '')
  if (doc.forma && doc.orador !== 'tu propio estilo') push(`> Forma de la voz: ${doc.forma}`, '')
  doc.puntos.forEach((punto, index) => {
    push(`> *Señal para predicar:* «${punto.signal}»`, '')
    push(`### ${index + 1}. ${punto.title}`)
    if (punto.evidence) push('', punto.evidence)
    push('', `*Puente:* ⇒ ${slotText(punto.bridge)}`, '')
  })

  if (doc.citas.length) {
    push('## Citas (frases sabias)', '')
    for (const line of doc.citas) push(line, '')
  }
  if (doc.casoReal.length) {
    push('## Ilustración bíblica (caso real)', '')
    for (const line of doc.casoReal) push(line, '')
  } else if (doc.ilustracion.length) {
    push('## Ilustración', '', doc.ilustracion[0], '')
  }

  if (doc.consenso.length) {
    push('## Consenso doctrinal', '')
    for (const line of doc.consenso) push(`- ${line}`)
    push('')
  }

  push('## Aplicación', '')
  if (doc.orador !== 'tu propio estilo') {
    push(`> **Lente de la voz (${doc.orador}):** ${lenteOf(doc)}`, '')
  }
  if (doc.aplicacion.length) {
    for (const line of doc.aplicacion) push(`- ${line}`)
  } else {
    push('- **En casa:** [concreto con los tuyos.]', '- **En el trabajo:** [concreto con colegas.]', '- **En la iglesia:** [concreto con la congregación.]')
  }
  push('')

  push('## Frase para meditar', '', slotText(doc.meditacion), '')
  push('> **Señal para predicar:** «Y para concluir…»', '')
  push('## Cierre del sermón', '')
  push(`- Recapitulación: ${doc.cierre.recap}`)
  if (doc.cierre.llamado) push(`- Llamado: ${doc.cierre.llamado}`)
  push(`- **Benedicción:** ${doc.cierre.bendicion}`, '')
  push('## Oración final', '', slotText(doc.oracion), '')
  push(`> Dosier: ${doc.dossierChars} caracteres de módulos reales.`)
  push('')
  push('## Fuentes ancladas', '')
  const byModule = new Map<string, string[]>()
  for (const f of doc.fuentes) {
    const list = byModule.get(f.module) ?? []
    if (!list.includes(f.entry)) list.push(f.entry)
    byModule.set(f.module, list)
  }
  for (const [module, entries] of byModule) {
    push(`- [${module} · ${entries.slice(0, 4).join(' · ')}${entries.length > 4 ? ' …' : ''}]`)
  }
  return lines
    .join('\n')
    .replace(/\[\[([^\]]*)\]\]/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
}

function slotText(slot: Slot): string {
  return (slot.text?.trim() || slot.fallback).trim()
}

function lenteOf(doc: SermonDocument): string {
  // import tardio igual que personaDirectiveOf
  const mod = (globalThis as unknown as { __personaLente?: (id: string) => string }).__personaLente
  return mod ? mod(doc.personaId) : doc.cierre.llamado
}
