import { Facet, type Range } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from '@codemirror/view'

export type FocusMode = 'off' | 'sentence' | 'paragraph'

export const focusModeFacet = Facet.define<FocusMode, FocusMode>({
  combine: (values) => values[values.length - 1] ?? 'off'
})

function sentenceRange(text: string, rel: number): [number, number] {
  const boundary = /[.!?\u2026](\s|$)/g
  let start = 0
  let end = text.length
  let match: RegExpExecArray | null
  while ((match = boundary.exec(text)) !== null) {
    const boundaryEnd = match.index + match[0].length
    if (boundaryEnd <= rel) {
      start = boundaryEnd
    } else {
      end = boundaryEnd
      break
    }
  }
  return [start, end]
}

function paragraphRange(view: EditorView, lineNumber: number): [number, number] {
  const doc = view.state.doc
  let startLine = lineNumber
  while (startLine > 1 && doc.line(startLine - 1).text.trim() !== '') startLine -= 1
  let endLine = lineNumber
  while (endLine < doc.lines && doc.line(endLine + 1).text.trim() !== '') endLine += 1
  return [doc.line(startLine).from, doc.line(endLine).to]
}

const dimLine = Decoration.line({ class: 'cm-dim' })
const focusLine = Decoration.line({ class: 'cm-focus-line' })
const focusMark = Decoration.mark({ class: 'cm-focus' })
const dimMark = Decoration.mark({ class: 'cm-dim' })

class FocusPlugin {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = this.build(view)
  }

  update(update: ViewUpdate): void {
    if (update.docChanged || update.selectionSet || update.viewportChanged) {
      this.decorations = this.build(update.view)
    }
  }

  private build(view: EditorView): DecorationSet {
    const mode = view.state.facet(focusModeFacet)
    if (mode === 'off') return Decoration.none

    const head = view.state.selection.main.head
    const line = view.state.doc.lineAt(head)

    let from = line.from
    let to = line.to
    if (mode === 'paragraph') {
      const range = paragraphRange(view, line.number)
      from = range[0]
      to = range[1]
    } else {
      const [s, e] = sentenceRange(line.text, head - line.from)
      from = line.from + s
      to = line.from + e
    }

    const highlightParagraph = mode === 'paragraph'
    const ranges: Range<Decoration>[] = []
    for (const visible of view.visibleRanges) {
      let pos = visible.from
      while (pos <= visible.to) {
        const l = view.state.doc.lineAt(pos)
        if (l.to < from || l.from > to) {
          ranges.push(dimLine.range(l.from))
        } else if (highlightParagraph) {
          ranges.push(focusLine.range(l.from))
        } else {
          if (from > l.from) ranges.push(dimMark.range(l.from, from))
          if (to < l.to) ranges.push(dimMark.range(to, l.to))
        }
        if (l.to >= view.state.doc.length) break
        pos = l.to + 1
      }
    }
    if (to > from) ranges.push(focusMark.range(from, to))
    return Decoration.set(ranges, true)
  }
}

export const focusPlugin = ViewPlugin.fromClass(FocusPlugin, {
  decorations: (plugin) => plugin.decorations
})
