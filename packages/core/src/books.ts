import type { BookInfo } from './types'

export type CanonicalBook = BookInfo

export const CANONICAL_BOOKS: CanonicalBook[] = [
  { code: 'Gen', name: 'Genesis', nameEs: 'Genesis', testament: 'OT', chapters: 50, ordinal: 1 },
  { code: 'Exod', name: 'Exodus', nameEs: 'Exodo', testament: 'OT', chapters: 40, ordinal: 2 },
  { code: 'Lev', name: 'Leviticus', nameEs: 'Levitico', testament: 'OT', chapters: 27, ordinal: 3 },
  { code: 'Num', name: 'Numbers', nameEs: 'Numeros', testament: 'OT', chapters: 36, ordinal: 4 },
  {
    code: 'Deut',
    name: 'Deuteronomy',
    nameEs: 'Deuteronomio',
    testament: 'OT',
    chapters: 34,
    ordinal: 5
  },
  { code: 'Josh', name: 'Joshua', nameEs: 'Josue', testament: 'OT', chapters: 24, ordinal: 6 },
  { code: 'Judg', name: 'Judges', nameEs: 'Jueces', testament: 'OT', chapters: 21, ordinal: 7 },
  { code: 'Ruth', name: 'Ruth', nameEs: 'Rut', testament: 'OT', chapters: 4, ordinal: 8 },
  { code: '1Sam', name: '1 Samuel', nameEs: '1 Samuel', testament: 'OT', chapters: 31, ordinal: 9 },
  { code: '2Sam', name: '2 Samuel', nameEs: '2 Samuel', testament: 'OT', chapters: 24, ordinal: 10 },
  { code: '1Kgs', name: '1 Kings', nameEs: '1 Reyes', testament: 'OT', chapters: 22, ordinal: 11 },
  { code: '2Kgs', name: '2 Kings', nameEs: '2 Reyes', testament: 'OT', chapters: 25, ordinal: 12 },
  {
    code: '1Chr',
    name: '1 Chronicles',
    nameEs: '1 Cronicas',
    testament: 'OT',
    chapters: 29,
    ordinal: 13
  },
  {
    code: '2Chr',
    name: '2 Chronicles',
    nameEs: '2 Cronicas',
    testament: 'OT',
    chapters: 36,
    ordinal: 14
  },
  { code: 'Ezra', name: 'Ezra', nameEs: 'Esdras', testament: 'OT', chapters: 10, ordinal: 15 },
  { code: 'Neh', name: 'Nehemiah', nameEs: 'Nehemias', testament: 'OT', chapters: 13, ordinal: 16 },
  { code: 'Esth', name: 'Esther', nameEs: 'Ester', testament: 'OT', chapters: 10, ordinal: 17 },
  { code: 'Job', name: 'Job', nameEs: 'Job', testament: 'OT', chapters: 42, ordinal: 18 },
  { code: 'Ps', name: 'Psalms', nameEs: 'Salmos', testament: 'OT', chapters: 150, ordinal: 19 },
  { code: 'Prov', name: 'Proverbs', nameEs: 'Proverbios', testament: 'OT', chapters: 31, ordinal: 20 },
  {
    code: 'Eccl',
    name: 'Ecclesiastes',
    nameEs: 'Eclesiastes',
    testament: 'OT',
    chapters: 12,
    ordinal: 21
  },
  {
    code: 'Song',
    name: 'Song of Solomon',
    nameEs: 'Cantares',
    testament: 'OT',
    chapters: 8,
    ordinal: 22
  },
  { code: 'Isa', name: 'Isaiah', nameEs: 'Isaias', testament: 'OT', chapters: 66, ordinal: 23 },
  { code: 'Jer', name: 'Jeremiah', nameEs: 'Jeremias', testament: 'OT', chapters: 52, ordinal: 24 },
  {
    code: 'Lam',
    name: 'Lamentations',
    nameEs: 'Lamentaciones',
    testament: 'OT',
    chapters: 5,
    ordinal: 25
  },
  { code: 'Ezek', name: 'Ezekiel', nameEs: 'Ezequiel', testament: 'OT', chapters: 48, ordinal: 26 },
  { code: 'Dan', name: 'Daniel', nameEs: 'Daniel', testament: 'OT', chapters: 12, ordinal: 27 },
  { code: 'Hos', name: 'Hosea', nameEs: 'Oseas', testament: 'OT', chapters: 14, ordinal: 28 },
  { code: 'Joel', name: 'Joel', nameEs: 'Joel', testament: 'OT', chapters: 3, ordinal: 29 },
  { code: 'Amos', name: 'Amos', nameEs: 'Amos', testament: 'OT', chapters: 9, ordinal: 30 },
  { code: 'Obad', name: 'Obadiah', nameEs: 'Obadias', testament: 'OT', chapters: 1, ordinal: 31 },
  { code: 'Jonah', name: 'Jonah', nameEs: 'Jonas', testament: 'OT', chapters: 4, ordinal: 32 },
  { code: 'Mic', name: 'Micah', nameEs: 'Miqueas', testament: 'OT', chapters: 7, ordinal: 33 },
  { code: 'Nah', name: 'Nahum', nameEs: 'Nahum', testament: 'OT', chapters: 3, ordinal: 34 },
  { code: 'Hab', name: 'Habakkuk', nameEs: 'Habacuc', testament: 'OT', chapters: 3, ordinal: 35 },
  { code: 'Zeph', name: 'Zephaniah', nameEs: 'Sofonias', testament: 'OT', chapters: 3, ordinal: 36 },
  { code: 'Hag', name: 'Haggai', nameEs: 'Hageo', testament: 'OT', chapters: 2, ordinal: 37 },
  { code: 'Zech', name: 'Zechariah', nameEs: 'Zacarias', testament: 'OT', chapters: 14, ordinal: 38 },
  { code: 'Mal', name: 'Malachi', nameEs: 'Malaquias', testament: 'OT', chapters: 4, ordinal: 39 },
  { code: 'Matt', name: 'Matthew', nameEs: 'Mateo', testament: 'NT', chapters: 28, ordinal: 40 },
  { code: 'Mark', name: 'Mark', nameEs: 'Marcos', testament: 'NT', chapters: 16, ordinal: 41 },
  { code: 'Luke', name: 'Luke', nameEs: 'Lucas', testament: 'NT', chapters: 24, ordinal: 42 },
  { code: 'John', name: 'John', nameEs: 'Juan', testament: 'NT', chapters: 21, ordinal: 43 },
  { code: 'Acts', name: 'Acts', nameEs: 'Hechos', testament: 'NT', chapters: 28, ordinal: 44 },
  { code: 'Rom', name: 'Romans', nameEs: 'Romanos', testament: 'NT', chapters: 16, ordinal: 45 },
  { code: '1Cor', name: '1 Corinthians', nameEs: '1 Corintios', testament: 'NT', chapters: 16, ordinal: 46 },
  { code: '2Cor', name: '2 Corinthians', nameEs: '2 Corintios', testament: 'NT', chapters: 13, ordinal: 47 },
  { code: 'Gal', name: 'Galatians', nameEs: 'Galatas', testament: 'NT', chapters: 6, ordinal: 48 },
  { code: 'Eph', name: 'Ephesians', nameEs: 'Efesios', testament: 'NT', chapters: 6, ordinal: 49 },
  {
    code: 'Phil',
    name: 'Philippians',
    nameEs: 'Filipenses',
    testament: 'NT',
    chapters: 4,
    ordinal: 50
  },
  { code: 'Col', name: 'Colossians', nameEs: 'Colosenses', testament: 'NT', chapters: 4, ordinal: 51 },
  {
    code: '1Thess',
    name: '1 Thessalonians',
    nameEs: '1 Tesalonicenses',
    testament: 'NT',
    chapters: 5,
    ordinal: 52
  },
  {
    code: '2Thess',
    name: '2 Thessalonians',
    nameEs: '2 Tesalonicenses',
    testament: 'NT',
    chapters: 3,
    ordinal: 53
  },
  { code: '1Tim', name: '1 Timothy', nameEs: '1 Timoteo', testament: 'NT', chapters: 6, ordinal: 54 },
  { code: '2Tim', name: '2 Timothy', nameEs: '2 Timoteo', testament: 'NT', chapters: 4, ordinal: 55 },
  { code: 'Titus', name: 'Titus', nameEs: 'Tito', testament: 'NT', chapters: 3, ordinal: 56 },
  { code: 'Phlm', name: 'Philemon', nameEs: 'Filemon', testament: 'NT', chapters: 1, ordinal: 57 },
  { code: 'Heb', name: 'Hebrews', nameEs: 'Hebreos', testament: 'NT', chapters: 13, ordinal: 58 },
  { code: 'Jas', name: 'James', nameEs: 'Santiago', testament: 'NT', chapters: 5, ordinal: 59 },
  { code: '1Pet', name: '1 Peter', nameEs: '1 Pedro', testament: 'NT', chapters: 5, ordinal: 60 },
  { code: '2Pet', name: '2 Peter', nameEs: '2 Pedro', testament: 'NT', chapters: 3, ordinal: 61 },
  { code: '1John', name: '1 John', nameEs: '1 Juan', testament: 'NT', chapters: 5, ordinal: 62 },
  { code: '2John', name: '2 John', nameEs: '2 Juan', testament: 'NT', chapters: 1, ordinal: 63 },
  { code: '3John', name: '3 John', nameEs: '3 Juan', testament: 'NT', chapters: 1, ordinal: 64 },
  { code: 'Jude', name: 'Jude', nameEs: 'Judas', testament: 'NT', chapters: 1, ordinal: 65 },
  {
    code: 'Rev',
    name: 'Revelation',
    nameEs: 'Apocalipsis',
    testament: 'NT',
    chapters: 22,
    ordinal: 66
  }
]

const byCode = new Map(CANONICAL_BOOKS.map((b) => [b.code.toLowerCase(), b]))

const PT_NAMES: Record<string, string> = {
  Gen: 'Gênesis',
  Exod: 'Êxodo',
  Lev: 'Levítico',
  Num: 'Números',
  Deut: 'Deuteronômio',
  Josh: 'Josué',
  Judg: 'Juízes',
  Ruth: 'Rute',
  '1Sam': '1 Samuel',
  '2Sam': '2 Samuel',
  '1Kgs': '1 Reis',
  '2Kgs': '2 Reis',
  '1Chr': '1 Crônicas',
  '2Chr': '2 Crônicas',
  Ezra: 'Esdras',
  Neh: 'Neemias',
  Esth: 'Ester',
  Job: 'Jó',
  Ps: 'Salmos',
  Prov: 'Provérbios',
  Eccl: 'Eclesiastes',
  Song: 'Cantares',
  Isa: 'Isaías',
  Jer: 'Jeremias',
  Lam: 'Lamentações',
  Ezek: 'Ezequiel',
  Dan: 'Daniel',
  Hos: 'Oseias',
  Joel: 'Joel',
  Amos: 'Amós',
  Obad: 'Obadias',
  Jonah: 'Jonas',
  Mic: 'Miqueias',
  Nah: 'Naum',
  Hab: 'Habacuque',
  Zeph: 'Sofonias',
  Hag: 'Ageu',
  Zech: 'Zacarias',
  Mal: 'Malaquias',
  Matt: 'Mateus',
  Mark: 'Marcos',
  Luke: 'Lucas',
  John: 'João',
  Acts: 'Atos',
  Rom: 'Romanos',
  '1Cor': '1 Coríntios',
  '2Cor': '2 Coríntios',
  Gal: 'Gálatas',
  Eph: 'Efésios',
  Phil: 'Filipenses',
  Col: 'Colossenses',
  '1Thess': '1 Tessalonicenses',
  '2Thess': '2 Tessalonicenses',
  '1Tim': '1 Timóteo',
  '2Tim': '2 Timóteo',
  Titus: 'Tito',
  Phlm: 'Filemom',
  Heb: 'Hebreus',
  Jas: 'Tiago',
  '1Pet': '1 Pedro',
  '2Pet': '2 Pedro',
  '1John': '1 João',
  '2John': '2 João',
  '3John': '3 João',
  Jude: 'Judas',
  Rev: 'Apocalipse'
}

export function bookName(book: BookInfo, locale: string): string {
  if (locale === 'en') return book.name
  if (locale === 'pt') return PT_NAMES[book.code] ?? book.nameEs
  return book.nameEs
}

export function findBook(code: string): CanonicalBook | undefined {
  return byCode.get(code.toLowerCase())
}

export function booksByTestament(testament: 'OT' | 'NT'): CanonicalBook[] {
  return CANONICAL_BOOKS.filter((b) => b.testament === testament)
}
