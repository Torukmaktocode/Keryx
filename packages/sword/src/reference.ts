import { CANONICAL_BOOKS, findBook, type CanonicalBook } from '@keryx/core'

const nameIndex = new Map<string, CanonicalBook>()
for (const book of CANONICAL_BOOKS) {
  nameIndex.set(book.code.toLowerCase(), book)
  nameIndex.set(book.name.toLowerCase(), book)
  nameIndex.set(book.nameEs.toLowerCase(), book)
  nameIndex.set(book.nameEs.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), book)
}

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ').replace(/\.$/, '')
}

export function resolveBook(input: string): CanonicalBook | undefined {
  const key = normalize(input)
  if (nameIndex.has(key)) return nameIndex.get(key)
  const deaccented = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (nameIndex.has(deaccented)) return nameIndex.get(deaccented)
  for (const book of CANONICAL_BOOKS) {
    if (book.code.toLowerCase() === key) return book
    if (book.name.toLowerCase().startsWith(key) && key.length >= 3) return book
  }
  return undefined
}

export interface ParsedReference {
  book: CanonicalBook
  chapter: number
  verse?: number
}

export function parseReference(input: string): ParsedReference | null {
  const match = input.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?$/)
  if (!match) {
    const book = findBook(input)
    return book ? { book, chapter: 1 } : null
  }
  const book = resolveBook(match[1])
  if (!book) return null
  return {
    book,
    chapter: Number(match[2]),
    verse: match[3] ? Number(match[3]) : undefined
  }
}

export function toOsisRef(book: string, chapter: number, verse?: number): string {
  const canonical = resolveBook(book)
  const code = canonical ? canonical.code : book
  return verse ? `${code}.${chapter}.${verse}` : `${code}.${chapter}`
}
