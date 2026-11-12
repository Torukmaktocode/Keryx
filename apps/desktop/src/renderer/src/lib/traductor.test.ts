// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import {
  normalizarIdioma,
  plainText,
  translateMarkdownCon,
  type TraductorFn
} from './traductor'

vi.mock('./api', () => ({
  api: {
    translate: {
      status: vi.fn(async () => ({ available: true, pairs: [] })),
      translate: vi.fn(async (req: { text: string }) => req.text.split('').reverse().join('')),
      install: vi.fn(async () => [])
    }
  }
}))

const identidad: TraductorFn = async (text) => `T:${text}`

describe('normalizarIdioma (idioma por módulo, sin detector)', () => {
  it('normaliza códigos BCP-47 y variantes chinas', () => {
    expect(normalizarIdioma('es-ES')).toBe('es')
    expect(normalizarIdioma('pt-BR')).toBe('pt')
    expect(normalizarIdioma('zh-CN')).toBe('zh')
    expect(normalizarIdioma('GR')).toBe('gr')
    expect(normalizarIdioma('')).toBe('')
    expect(normalizarIdioma(undefined)).toBe('')
  })
})

describe('plainText (los módulos viajan como HTML)', () => {
  it('limpia etiquetas y entidades preservando el texto', () => {
    expect(plainText('<p>Porque de&nbsp;tal manera</p> <w data-strong="G26">amó</w>')).toBe(
      'Porque de tal manera amó'
    )
  })

  it('decodifica entidades acentuadas nombradas (causa de "Jes & Uacute")', () => {
    expect(plainText('<p>Jes&uacute;s, Jerusal&eacute;n y secci&oacute;n</p>')).toBe(
      'Jesús, Jerusalén y sección'
    )
    expect(plainText('<i>bauti&acute;s</i>')).toBe('bauti´s')
    expect(plainText('San Ju&aacute;n')).toBe('San Juán')
  })

  it('decodifica entidades numéricas y hexadecimales', () => {
    expect(plainText('&#225;ngel y &#xE1;rbol')).toBe('ángel y árbol')
  })

  it('limpia el marcado doblemente escapado (&lt;i&gt;texto&lt;/i&gt;)', () => {
    expect(plainText('Este es &lt;i&gt;negrita&lt;/i&gt; del módulo')).toBe(
      'Este es negrita del módulo'
    )
  })

  it('preserva un ampersand suelto sin corromper', () => {
    expect(plainText('R&amp;B y Rock & Roll')).toBe('R&B y Rock & Roll')
  })
})

describe('translateMarkdownCon (estructura y citas intactas)', () => {
  const md = [
    '# Sermón: Juan 3:16',
    '',
    '> Voz: **Peterson** — narrativo',
    '> 💬 **Tu petición:** «gracia» — la entendí como tu frase, tomada tal cual.',
    '## Gran idea',
    '',
    'El amor de Dios entrega lo más precioso.',
    '- En casa: repite la frase con los tuyos.',
    '- [Comentario Real · Juan 3:16]',
    '',
    '> Dosier: 15000 caracteres de módulos reales.'
  ].join('\n')

  it('traduce encabezados, texto y viñetas', async () => {
    const out = await translateMarkdownCon(md, identidad)
    expect(out).toContain('# T:Sermón: Juan 3:16')
    expect(out).toContain('## T:Gran idea')
    expect(out).toContain('T:El amor de Dios entrega lo más precioso.')
    expect(out).toContain('- T:En casa: repite la frase con los tuyos.')
  })

  it('jamás traduce las citas ancladas [Módulo · entrada]', async () => {
    const out = await translateMarkdownCon(md, identidad)
    expect(out).toContain('- [Comentario Real · Juan 3:16]')
    expect(out).not.toContain('T:[Comentario Real')
  })

  it('preserva la voz/orador, la petición y la línea del dosier', async () => {
    const out = await translateMarkdownCon(md, identidad)
    expect(out).toContain('> Voz: **Peterson** — narrativo')
    expect(out).toContain('> 💬 **Tu petición:**')
    expect(out).toContain('> Dosier: 15000 caracteres de módulos reales.')
  })

  it('traduce versículos dentro de citas (> texto) pero guarda las estructurales', async () => {
    const verse = '> 16 Porque de tal manera amó Dios al mundo.'
    const out = await translateMarkdownCon(verse, identidad)
    expect(out).toBe('> T:16 Porque de tal manera amó Dios al mundo.')
  })

  it('preserva líneas vacías y determinismo', async () => {
    const out1 = await translateMarkdownCon(md, identidad)
    const out2 = await translateMarkdownCon(md, identidad)
    expect(out1).toBe(out2)
    expect(out1.split('\n').length).toBe(md.split('\n').length)
  })
})
