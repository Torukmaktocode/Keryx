function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(value: string): string {
  return value
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

/** Renderizador Markdown minimo y seguro para respuestas del asistente. */
export function renderMarkdown(source: string): string {
  const lines = escapeHtml(source).split(/\r?\n/)
  const html: string[] = []
  let listOpen = false
  let quoteOpen = false

  const closeList = (): void => {
    if (listOpen) {
      html.push('</ul>')
      listOpen = false
    }
  }
  const closeQuote = (): void => {
    if (quoteOpen) {
      html.push('</blockquote>')
      quoteOpen = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      closeList()
      closeQuote()
      continue
    }
    if (line.startsWith('### ')) {
      closeList()
      closeQuote()
      html.push(`<h4>${inline(line.slice(4))}</h4>`)
    } else if (line.startsWith('## ')) {
      closeList()
      closeQuote()
      html.push(`<h3>${inline(line.slice(3))}</h3>`)
    } else if (line.startsWith('# ')) {
      closeList()
      closeQuote()
      html.push(`<h2>${inline(line.slice(2))}</h2>`)
    } else if (/^[-*]\s+/.test(line)) {
      closeQuote()
      if (!listOpen) {
        html.push('<ul>')
        listOpen = true
      }
      html.push(`<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
    } else if (line.startsWith('> ')) {
      closeList()
      if (!quoteOpen) {
        html.push('<blockquote>')
        quoteOpen = true
      }
      html.push(`<p>${inline(line.slice(2))}</p>`)
    } else {
      closeList()
      closeQuote()
      html.push(`<p>${inline(line)}</p>`)
    }
  }
  closeList()
  closeQuote()
  return html.join('\n')
}
