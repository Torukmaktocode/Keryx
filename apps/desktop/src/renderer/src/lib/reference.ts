import { CANONICAL_BOOKS } from '@keryx/core'

export interface ParsedRef {
  book: string
  chapter: number
  verse?: number
}

const index = new Map<string, string>()

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\.$/, '')
    .trim()
}

for (const book of CANONICAL_BOOKS) {
  for (const name of [book.code, book.name, book.nameEs]) {
    index.set(normalize(name), book.code)
  }
}

export function parseReference(input: string): ParsedRef | null {
  const match = input.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?$/)
  if (!match) {
    const book = index.get(normalize(input))
    return book ? { book, chapter: 1 } : null
  }
  const key = normalize(match[1])
  let code = index.get(key)
  if (!code && key.length >= 3) {
    for (const [name, value] of index) {
      if (name.startsWith(key)) {
        code = value
        break
      }
    }
  }
  if (!code) return null
  return {
    book: code,
    chapter: Number(match[2]),
    verse: match[3] ? Number(match[3]) : undefined
  }
}
