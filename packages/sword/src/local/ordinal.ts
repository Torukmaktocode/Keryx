import { CANONICAL_BOOKS } from '@keryx/core'
import { KJV_CHAPTER_VERSES } from './versification'

export interface VerseSlot {
  testament: 1 | 2
  slot: number
}

const bookIndex = new Map(CANONICAL_BOOKS.map((b, i) => [b.code.toLowerCase(), i]))

/**
 * Calcula la posicion (slot) de un versiculo dentro del archivo del testamento,
 * segun la versificacion KJV usada por SWORD:
 *   [intro modulo][intro testamento] + por libro [intro libro]
 *   + por capitulo [intro capitulo] + versiculos.
 */
export function verseSlot(bookCode: string, chapter: number, verse: number): VerseSlot | null {
  const index = bookIndex.get(bookCode.toLowerCase())
  if (index === undefined) return null
  const global = KJV_CHAPTER_VERSES[index]
  if (!global || chapter < 1 || chapter > global.length) return null

  const testament: 1 | 2 = index < 39 ? 1 : 2
  const firstIndex = testament === 1 ? 0 : 39

  let slot = 2
  for (let b = firstIndex; b < index; b++) {
    const chapters = KJV_CHAPTER_VERSES[b]
    const verses = chapters.reduce((sum, n) => sum + n, 0)
    slot += 1 + chapters.length + verses
  }
  slot += 1
  for (let c = 0; c < chapter - 1; c++) {
    slot += 1 + global[c]
  }
  slot += 1
  slot += verse - 1
  return { testament, slot }
}

export function chapterVerseCount(bookCode: string, chapter: number): number {
  const index = bookIndex.get(bookCode.toLowerCase())
  if (index === undefined) return 0
  const global = KJV_CHAPTER_VERSES[index]
  if (!global || chapter < 1 || chapter > global.length) return 0
  return global[chapter - 1]
}

export function buildSlotLookup(): Map<string, { book: string; chapter: number; verse: number }> {
  const map = new Map<string, { book: string; chapter: number; verse: number }>()
  CANONICAL_BOOKS.forEach((book, index) => {
    const chapters = KJV_CHAPTER_VERSES[index]
    if (!chapters) return
    for (let chapter = 1; chapter <= chapters.length; chapter++) {
      for (let verse = 1; verse <= chapters[chapter - 1]; verse++) {
        const slotInfo = verseSlot(book.code, chapter, verse)
        if (slotInfo) {
          map.set(`${slotInfo.testament}:${slotInfo.slot}`, { book: book.code, chapter, verse })
        }
      }
    }
  })
  return map
}
