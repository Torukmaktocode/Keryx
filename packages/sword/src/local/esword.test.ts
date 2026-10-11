import { mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { EswordProvider } from './esword'

const ROOT = join(tmpdir(), `keryx-esword-test-${process.pid}`)
const PRINCIPAL = join(ROOT, 'esword')
const BIBLIOTECA = join(ROOT, 'biblioteca')

let createdProvider: EswordProvider | null = null

const makeProvider = (principal: string, extra: string[]): EswordProvider | null => {
  createdProvider?.dispose()
  createdProvider = EswordProvider.create(principal, extra)
  return createdProvider
}

/** Crea un modulo e-Sword SQLite minimo en `path` con el nombre de archivo dado. */
function buildModule(
  path: string,
  filename: string,
  table: string,
  columns: string,
  rows: unknown[][],
  details: Record<string, string>
): void {
  mkdirSync(join(path), { recursive: true })
  const db = new DatabaseSync(join(path, filename))
  db.exec('CREATE TABLE Details (Description TEXT, Abbreviation TEXT, Language TEXT, Comments TEXT)')
  db.prepare(
    'INSERT INTO Details (Description, Abbreviation, Language, Comments) VALUES (?, ?, ?, ?)'
  ).run(details.Description ?? '', details.Abbreviation ?? '', details.Language ?? '', '')
  db.exec(`CREATE TABLE ${table} (${columns})`)
  const insert = db.prepare(`INSERT INTO ${table} VALUES (${rows[0].map(() => '?').join(', ')})`)
  for (const row of rows as unknown[][]) {
    insert.run(...(row as [(string | number | null)]))
  }
  db.close()
}

beforeAll(() => {
  rmSync(ROOT, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
  mkdirSync(PRINCIPAL, { recursive: true })

  const biblia = new DatabaseSync(join(PRINCIPAL, 'TestBiblia.bbli'))
  biblia.exec('CREATE TABLE Details (Description TEXT, Abbreviation TEXT, Language TEXT)')
  biblia.exec('CREATE TABLE Bible (Book INT, Chapter INT, Verse INT, Scripture TEXT)')
  biblia
    .prepare(
      "INSERT INTO Bible VALUES (1, 1, 1, 'En el principio creó Dios los cielos'), (1, 1, 2, 'Y la tierra estaba desordenada')"
    )
    .run()
  biblia.prepare("INSERT INTO Details SELECT 'Biblia de prueba', 'TB', 'Spanish'").run()
  biblia.close()

  // Biblioteca: comentario, libro topical y diccionario en subcarpetas (2 niveles)
  buildModule(
    join(BIBLIOTECA, 'COMENTARIOS'),
    'TestComentario.cmti',
    'VerseCommentary',
    'Book INT, ChapterBegin INT, VerseBegin INT, ChapterEnd INT, VerseEnd INT, Comments TEXT',
    [[1, 1, 1, 1, 3, '{\\rtf1 Comentario del range uno a tres.}']],
    { Description: 'Comentario prueba', Language: 'Spanish' }
  )
  buildModule(
    join(BIBLIOTECA, 'LIBROS', 'Sub'),
    'TestLibro.refi',
    'Topical',
    'Topic TEXT, Definition TEXT',
    [['Cielos', '{\\rtf1 Definicion del tema Cielos en el libro topical.}']],
    { Description: 'Libro topical', Language: 'Spanish' }
  )
  buildModule(
    join(BIBLIOTECA, 'DICCIONARIOS'),
    'TestLexico.lexi',
    'Lexicon',
    'Topic TEXT, Definition TEXT',
    [['AGUA ', '{\\rtf1 Léxico: agua en hebreo Mayim.}']],
    { Description: 'Léxico AGUA', Language: 'Spanish' }
  )
})

afterAll(() => {
  createdProvider?.dispose()
  rmSync(ROOT, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 })
})

describe('EswordProvider multi-raiz (fixtures)', () => {
  it('escanea la biblioteca recursivamente (2 niveles) por categoria', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])
    expect(provider).not.toBeNull()
    const modules = await provider!.listLocalModules()
    expect(modules.map((m) => m.name)).toEqual(
      expect.arrayContaining(['TestBiblia', 'TestComentario', 'TestLibro', 'TestLexico'])
    )
    const biblia = modules.find((m) => m.name === 'TestBiblia')
    expect(biblia?.library).toBe('principal')
    expect(biblia?.lang).toBe('es')
    const comentario = modules.find((m) => m.name === 'TestComentario')
    expect(comentario?.library).toBe('biblioteca')
    expect(comentario?.category).toBe('Commentary')
    const libro = modules.find((m) => m.name === 'TestLibro')
    expect(libro?.category).toBe('GenBook')
    expect(libro?.lang).toBe('es')
  })

  it('lee un capitulo de la Biblia principal', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])!
    const verses = await provider.getChapter('TestBiblia', 'Gen', 1)
    expect(verses.length).toBe(2)
    expect(verses[0].text).toContain('En el principio')
  })

  it('no expande los rangos: una entrada anclada en VerseBegin', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])!
    const verses = await provider.commentaryVerses('TestComentario', 'Gen', 1)
    expect(verses).toEqual([1])
    const chapter = await provider.getChapter('TestComentario', 'Gen', 1)
    expect(chapter.map((v) => v.verse)).toEqual([1])
  })

  it('getVerse devuelve la entrada que CUBRE el versiculo pedido', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])!
    const covered = await provider.getVerse('TestComentario', 'Gen', 1, 2)
    expect(covered?.verse).toBe(1)
    expect(covered?.text).toContain('Comentario del range uno a tres')
    const exact = await provider.getVerse('TestComentario', 'Gen', 1, 1)
    expect(exact?.verse).toBe(1)
  })

  it('abre libros Topicales (.refi) via lookupDict', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])!
    const entry = await provider.lookupDict('TestLibro', 'Cielos')
    expect(entry ?? '').toContain('Definicion del tema Cielos')
  })

  it('busca en diccionarios escaneados', async () => {
    const provider = makeProvider(PRINCIPAL, [BIBLIOTECA])!
    const found = await provider.search({
      query: 'agua',
      modules: ['TestLexico'],
      limit: 5
    })
    expect(found.length).toBeGreaterThan(0)
  })

  it('devuelve null si no hay raices con modulos', () => {
    expect(makeProvider(join(ROOT, 'nada'), [join(ROOT, 'tambien-nada')])).toBeNull()
  })
})
