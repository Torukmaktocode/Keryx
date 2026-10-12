import { CANONICAL_BOOKS } from '@keryx/core'

const TRANSLIT: Record<string, string> = {
  α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'ē', θ: 'th', ι: 'i',
  κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r',
  τ: 't', υ: 'y', φ: 'ph', χ: 'ch', ψ: 'ps', ω: 'ō'
}

export function transliterateGreek(lemma: string): string {
  let out = ''
  for (const char of lemma.toLowerCase()) {
    if (char === 'σ' || char === 'ς') out += 's'
    else if (char === 'υ') out += 'u'
    else if (char in TRANSLIT) out += (TRANSLIT[char] ?? '')
    else if (/[A-Za-z]/.test(char)) out += char
  }
  if (out.length > 0) {
    out = out.charAt(0).toUpperCase() + out.slice(1)
  }
  return out
}

/** Lema griego (primer token griego) de una definicion Strong/Ortiz ya decodificada. */
export function greekLemmaOf(text: string): string {
  const match = /[\u0370-\u03ff\u1f00-\u1fff]+/.exec(text)
  return match ? match[0] : ''
}

export function deaccent(word: string): string {
  const lower = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  return lower.replace(/[^a-zñü]/g, '')
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export function roman(num: number): string {
  return ROMAN[num] ?? String(num)
}

export type NtSection =
  | 'Evangelios'
  | 'Hechos'
  | 'Cartas de Pablo'
  | 'Cartas generales'
  | 'Apocalipsis'
  | 'AT'

const PAULINE = new Set([
  'Rom', '1Cor', '2Cor', 'Gal', 'Eph', 'Phil', 'Col', '1Th', '2Th', '1Tim', '2Tim', 'Tit', 'Phlm', 'Heb'
])
const GENERAL = new Set(['Jas', '1Pe', '2Pe', '1Jn', '2Jn', '3Jn', 'Jud'])
const GOSPELS = new Set(['Matt', 'Mark', 'Luke', 'Jn'])

export function ntSectionOf(code: string): NtSection {
  if (GOSPELS.has(code)) return 'Evangelios'
  if (code === 'Acts') return 'Hechos'
  if (PAULINE.has(code)) return 'Cartas de Pablo'
  if (GENERAL.has(code)) return 'Cartas generales'
  if (code === 'Rev') return 'Apocalipsis'
  return 'AT'
}

export interface Occurrence {
  book: string
  chapter: number
  verse: number
  word: string
  morphology: string
}

/** Sentidos BDAG-lite: cluster de ocurrencias por la palabra espanola que las traduce. */
export interface Sense {
  gloss: string
  count: number
  refs: Occurrence[]
}

export function clusterSenses(occ: Occurrence[], maxSenses = 6): Sense[] {
  if (!occ.length) return []
  const map = new Map<string, Sense>()
  for (const row of occ) {
    const gloss = row.word.replace(/[.,;:…]+$/, '').trim() || '—'
    const key = deaccent(gloss)
    const found = map.get(key)
    if (found) {
      found.count += 1
      found.refs.push(row)
    } else {
      map.set(key, { gloss, count: 1, refs: [row] })
    }
  }
  return [...map.values()]
    .sort((a, b) => b.count - a.count || a.gloss.localeCompare(b.gloss))
    .slice(0, maxSenses)
}

export function bookLabel(code: string): string {
  const book = CANONICAL_BOOKS.find((b) => b.code === code)
  return book?.nameEs ?? code
}

export function bookSectionCounts(occ: Occurrence[]): Array<{ section: string; count: number }> {
  const map = new Map<string, number>()
  for (const row of occ) {
    const section = ntSectionOf(row.book)
    map.set(section, (map.get(section) ?? 0) + 1)
  }
  return [...map.entries()]
    .map(([section, count]) => ({ section, count }))
    .sort((a, b) => b.count - a.count)
}
