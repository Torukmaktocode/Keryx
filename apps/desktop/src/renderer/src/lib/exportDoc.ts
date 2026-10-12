/** Export de documentos Keryx a Word (.doc per HTML) y .md sin dependencias. */
export function markdownToHtmlBody(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let ulOpen = false
  for (const raw of lines) {
    const line = raw.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/^[\s>]/g, '')
    if (line.startsWith('### ')) {
      if (ulOpen) {
        out.push('</ul>')
        ulOpen = false
      }
      out.push(`<h3>${line.slice(4)}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (ulOpen) {
        out.push('</ul>')
        ulOpen = false
      }
      out.push(`<h2>${line.slice(3)}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      if (ulOpen) {
        out.push('</ul>')
        ulOpen = false
      }
      out.push(`<h1>${line.slice(2)}</h1>`)
      continue
    }
    if (line.startsWith('- ')) {
      if (!ulOpen) {
        out.push('<ul>')
        ulOpen = true
      }
      out.push(`<li>${line.slice(2)}</li>`)
      continue
    }
    if (ulOpen) {
      out.push('</ul>')
      ulOpen = false
    }
    if (line.trim() === '') continue
    out.push(`<p>${line}</p>`)
  }
  if (ulOpen) out.push('</ul>')
  return out.join('\n')
}

/** Descarga el sermon/documento como .doc (Word) o .md. */
export function downloadDocument(name: string, markdown: string, format: 'doc' | 'md' = 'doc'): void {
  const safeName = name.replace(/[\\/:*?"<>|]+/g, '-').slice(0, 80)
  if (format === 'md') {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    triggerDownload(blob, `${safeName}.md`)
    return
  }
  const body = markdownToHtmlBody(markdown)
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${safeName}</title>` +
    "<style>body{font-family:'Georgia',serif;max-width:640px;margin:auto;padding:2em}h1,h2,h3{color:#2c2c2c}blockquote{color:#555;border-left:3px solid #8b6f47;padding-left:10px;margin-left:0}</style>" +
    `</head><body>${body}</body></html>`
  const blob = new Blob(['\ufeff', html], { type: 'application/msword;charset=utf-8' })
  triggerDownload(blob, `${safeName}.doc`)
}

export function copyToClipboard(text: string): void {
  void navigator.clipboard?.writeText(text)
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
