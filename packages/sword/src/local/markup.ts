const HTML_ALLOWED = new Set([
  'p', 'br', 'i', 'b', 'em', 'strong', 'div', 'span', 'a', 'sup', 'sub', 'ul', 'ol', 'li',
  'w', 'seg', 'tcav'
])

function decodeEntities(input: string): string {
  return input
    .replace(/&#8211;|#8211;/g, '–')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&amp;/g, '&')
}

function stripUnknownTags(input: string): string {
  return input.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, name: string) =>
    HTML_ALLOWED.has(name.toLowerCase()) ? match : ''
  )
}

/** Elimina manejadores de eventos y URLs peligrosos de las etiquetas permitidas. */
function sanitizeAttributes(html: string): string {
  return html
    .replace(/(<[a-zA-Z][^>]*?)\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '$1')
    .replace(
      /(<[a-zA-Z][^>]*?\s(?:href|src|action)\s*=\s*)("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]*)/gi,
      '$1"#"'
    )
    .replace(/(<[a-zA-Z][^>]*?\s(?:href|src)\s*=\s*)("\s*data:[^"]*"|'\s*data:[^']*')/gi, '$1"#"')
}

export interface StrongWord {
  strong: string
}

/**
 * Traduce marcas de Strong del marcado original a atributos clenicos:
 *   OSIS:   <w lemma="strong:G26">…</w>
 *   THML:   <sync type="strong" value="H15">…
 * Devuelve el HTML con <w data-strong="G26">listo para UIs clicables.
 */
function markStrongs(raw: string): string {
  let s = raw
  s = s.replace(
    /<w\b([^>]*?)>/gi,
    (_, attrs: string): string => {
      const lemma =
        /(?:xl\.)?lemma\s*=\s*"?\s*strong:\s*([GH]\d{1,6})/i.exec(attrs) ??
        /(?:xl\.)?lemma\s*=\s*[^>']*strong:\s*([GH]\d{1,6})/i.exec(attrs)
      if (!lemma) return `<w${attrs}>`
      return `<w${attrs} data-strong="${lemma[1].toUpperCase()}">`
    }
  )
  s = s.replace(
    /<sync\b([^>]*?)>/gi,
    (match, attrs: string): string => {
      if (!/type\s*=\s*"?\s*strong/i.test(attrs)) return match
      const value = /value\s*=\s*"?\s*([GH]\s?\d{1,6})/i.exec(attrs)
      if (!value) return match
      const strong = value[1].replace(/\s+/g, '').toUpperCase()
      return `<w data-strong="${strong}">`
    }
  )
  return s
}

function renderOsis(raw: string): string {
  let s = markStrongs(decodeEntities(raw))
  s = s.replace(/<note\b[^>]*>[\s\S]*?<\/note>/g, '')
  s = s.replace(/<note\b[^>]*\/>/g, '')
  s = s.replace(/<milestone\b[^>]*\/?>/g, '')
  s = s.replace(/<catchWord\b[^>]*>[\s\S]*?<\/catchWord>/g, '')
  s = s.replace(/<lb\b[^>]*\/?>/g, '<br/>')
  s = s.replace(/<l\b[^>]*>/g, '<br/>')
  s = s.replace(/<\/l>/g, '')
  s = s.replace(/<lg\b[^>]*>/g, '<div>')
  s = s.replace(/<\/lg>/g, '</div>')
  s = s.replace(/<title\b[^>]*>/g, '<div class="verse-heading">')
  s = s.replace(/<\/title>/g, '</div>')
  s = s.replace(/<head\b[^>]*>/g, '<div class="verse-heading">')
  s = s.replace(/<\/head>/g, '</div>')
  s = s.replace(/<hi\b[^>]*type="[^"]*italic[^"]*"[^>]*>/gi, '<i>')
  s = s.replace(/<hi\b[^>]*type="[^"]*bold[^"]*"[^>]*>/gi, '<b>')
  s = s.replace(/<hi\b[^>]*>/gi, '<i>')
  s = s.replace(/<\/hi>/gi, '</i>')
  s = s.replace(/<transChange\b[^>]*>/g, '<i>')
  s = s.replace(/<\/transChange>/g, '</i>')
  s = s.replace(/<divineName\b[^>]*>/g, '<span class="divine">')
  s = s.replace(/<\/divineName>/g, '</span>')
  s = s.replace(/<q\b[^>]*>/g, '"')
  s = s.replace(/<\/q>/g, '"')
  s = s.replace(/<p\b[^>]*>/g, '<p>')
  s = s.replace(/<\/p>/g, '</p>')
  return sanitizeAttributes(stripUnknownTags(s))
}

function renderTei(raw: string): string {
  let s = markStrongs(decodeEntities(raw))
  s = s.replace(/<note\b[^>]*>[\s\S]*?<\/note>/g, '')
  s = s.replace(/<entryFree\b[^>]*>/g, '<div class="entry">')
  s = s.replace(/<\/entryFree>/g, '</div>')
  s = s.replace(/<lb\b[^>]*\/?>/g, '<br/>')
  s = s.replace(/<orth\b[^>]*>/g, '<b>')
  s = s.replace(/<\/orth>/g, '</b>')
  s = s.replace(/<pron\b[^>]*>/g, ' [')
  s = s.replace(/<\/pron>/g, ']')
  s = s.replace(/<pos\b[^>]*>/g, '<i>')
  s = s.replace(/<\/pos>/g, '</i>')
  s = s.replace(/<def\b[^>]*>/g, '')
  s = s.replace(/<\/def>/g, '')
  s = s.replace(/<sense\b[^>]*>/g, '<div>')
  s = s.replace(/<\/sense>/g, '</div>')
  s = s.replace(/<cit\b[^>]*>/g, '<span>')
  s = s.replace(/<\/cit>/g, '</span>')
  s = s.replace(/<quote\b[^>]*>/g, '<i>')
  s = s.replace(/<\/quote>/g, '</i>')
  s = s.replace(/<hi\b[^>]*>/g, '')
  s = s.replace(/<\/hi>/g, '')
  return sanitizeAttributes(stripUnknownTags(s))
}

function renderThml(raw: string): string {
  let s = markStrongs(decodeEntities(raw))
  s = s.replace(/<note\b[^>]*>[\s\S]*?<\/note>/g, '')
  s = s.replace(/<sync\b[^>]*\/?>/g, '')
  s = s.replace(/<div\b[^>]*>/g, '<div>')
  s = s.replace(/<\/div>/g, '</div>')
  s = s.replace(/<p\b[^>]*>/g, '<p>')
  s = s.replace(/<\/p>/g, '</p>')
  s = s.replace(/<br\b[^>]*\/?>/g, '<br/>')
  s = s.replace(/<hi\b[^>]*type="[^"]*italic[^"]*"[^>]*>/gi, '<i>')
  s = s.replace(/<hi\b[^>]*type="[^"]*bold[^"]*"[^>]*>/gi, '<b>')
  s = s.replace(/<hi\b[^>]*>/gi, '')
  s = s.replace(/<\/hi>/gi, '')
  return sanitizeAttributes(stripUnknownTags(s))
}

function renderGbf(raw: string): string {
  return sanitizeAttributes(stripUnknownTags(raw))
}

export function renderMarkup(sourceType: string, raw: string): string {
  const type = (sourceType || 'OSIS').toUpperCase()
  let html: string
  switch (type) {
    case 'TEI':
      html = renderTei(raw)
      break
    case 'THML':
      html = renderThml(raw)
      break
    case 'GBF':
      html = renderGbf(raw)
      break
    default:
      html = renderOsis(raw)
  }
  return html.trim()
}

export function stripMarkup(sourceType: string, raw: string): string {
  return renderMarkup(sourceType, raw)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
