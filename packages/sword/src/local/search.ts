/**
 * Busqueda full-text con normalizacion de acentos, multi-palabra (AND en
 * cualquier orden), matching sobre texto limpio y ranking por frecuencia.
 */

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function tokenizeQuery(query: string): string[] {
  return normalizeText(query)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((token) => token.length > 0)
}

export interface SearchMatchOptions {
  caseSensitive: boolean
  wholeWord: boolean
}

/** Escrituras sin espacios (Han/Hiragana/Katakana/Hangul): el limite de palabra no aplica. */
const IDEOGRAPHIC_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u

/**
 * Verifica si el texto cumple la consulta (AND de tokens, tolerante a acentos).
 * `wholeWord` exige el limite de palabra para cada token, evitando falsos
 * positivos tipo "amor" dentro de "JAMOR" o "Amorrheo". Los tokens de
 * escrituras ideograficas se comparan por subcadena.
 */
export function matchesQuery(
  haystack: string,
  tokens: string[],
  options: SearchMatchOptions
): boolean {
  if (!tokens.length) return false
  const hay = options.caseSensitive ? haystack : normalizeText(haystack)
  for (const token of tokens) {
    const needle = options.caseSensitive ? token : normalizeText(token)
    if (!needle) continue
    if (options.wholeWord && !IDEOGRAPHIC_RE.test(needle)) {
      const boundary = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(needle)}([^\\p{L}\\p{N}]|$)`, 'u')
      if (!boundary.test(hay)) return false
    } else if (!hay.includes(needle)) {
      return false
    }
  }
  return true
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Recorta el texto en la primera coincidencia con contexto a ambos lados. */
export function buildSnippet(
  text: string,
  tokens: string[],
  radius = 110
): { snippet: string; highlighted: string } {
  const hay = normalizeText(text)
  let firstIndex = -1
  for (const token of tokens) {
    const index = hay.indexOf(normalizeText(token))
    if (index >= 0 && (firstIndex < 0 || index < firstIndex)) firstIndex = index
  }
  if (firstIndex < 0) firstIndex = 0
  const start = Math.max(0, firstIndex - radius)
  const end = Math.min(text.length, firstIndex + radius * 2)

  const raw = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
  return { snippet: raw, highlighted: highlightText(raw, tokens) }
}

export function highlightText(text: string, tokens: string[]): string {
  if (!tokens.length) return escapeHtml(text)
  const escapedHtml = escapeHtml(text)
  const pattern = tokens
    .map((token) => escapeRegExp(token))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .join('|')
  if (!pattern) return escapedHtml
  const accentless = new RegExp(`(${pattern})`, 'giu')
  return escapedHtml.replace(accentless, '<mark>$1</mark>')
}

/** Escapa HTML de forma segura (entidades montadas con safe_concat). */
const ampSign = String.fromCharCode(38)
const ENTITIES = {
  amp: [ampSign, 'amp;'].join(''),
  lt: [ampSign, 'lt;'].join(''),
  gt: [ampSign, 'gt;'].join(''),
}

function escapeHtml(value: string): string {
  return value
    .split(ampSign).join(ENTITIES.amp)
    .split('<').join(ENTITIES.lt)
    .split('>').join(ENTITIES.gt)
}

export function countMatches(text: string, tokens: string[]): number {
  const hay = normalizeText(text)
  let count = 0
  for (const token of tokens) {
    const needle = normalizeText(token)
    if (!needle) continue
    let index = 0
    while ((index = hay.indexOf(needle, index)) !== -1) {
      count += 1
      index += needle.length
    }
  }
  return count
}

/** Scope AT/NT por ordinal canónico (1-39 OT, 40-66 NT). */
export function inBookScope(code: string, scope: string | undefined): boolean {
  if (!scope || scope === 'all') return true
  for (let i = 0; i < CANONICAL_ORDINALS.length; i++) {
    if (CANONICAL_ORDINALS[i] !== code) continue
    const ordinal = i + 1
    if (scope === 'ot') return ordinal <= 39
    if (scope === 'nt') return ordinal >= 40
  }
  return true
}

export const CANONICAL_ORDINALS = [
  'Gen', 'Exod', 'Lev', 'Num', 'Deut', 'Josh', 'Judg', 'Ruth', '1Sam', '2Sam',
  '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra', 'Neh', 'Esth', 'Job', 'Ps', 'Prov',
  'Eccl', 'Song', 'Isa', 'Jer', 'Lam', 'Ezek', 'Dan', 'Hos', 'Joel', 'Amos',
  'Obad', 'Jonah', 'Mic', 'Nah', 'Hab', 'Zeph', 'Hag', 'Zech', 'Mal',
  'Matt', 'Mark', 'Luke', 'John', 'Acts', 'Rom', '1Cor', '2Cor', 'Gal', 'Eph',
  'Phil', 'Col', '1Thess', '2Thess', '1Tim', '2Tim', 'Titus', 'Phlm', 'Heb',
  'Jas', '1Pet', '2Pet', '1John', '2John', '3John', 'Jude', 'Rev'
]
