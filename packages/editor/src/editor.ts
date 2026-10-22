import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { keryxHighlight, keryxTheme } from './theme'
import { focusModeFacet, focusPlugin, type FocusMode } from './focus'
import { typewriterExtension, typewriterFacet } from './typewriter'

export interface EditorStats {
  words: number
  characters: number
  readingMinutes: number
}

export interface EditorOptions {
  initialValue?: string
  focusMode?: FocusMode
  typewriter?: boolean
  fontFamily?: string
  fontSize?: number
  lineHeight?: number
  measure?: number
  onChange?: (value: string) => void
  onStats?: (stats: EditorStats) => void
}

const WORDS_PER_MINUTE = 200

function computeStats(text: string): EditorStats {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  return {
    words,
    characters: text.length,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE))
  }
}

export class KeryxEditor {
  private readonly view: EditorView
  private readonly focusCompartment = new Compartment()
  private readonly typewriterCompartment = new Compartment()

  constructor(
    private readonly parent: HTMLElement,
    options: EditorOptions = {}
  ) {
    this.applyTypography(options)

    const state = EditorState.create({
      doc: options.initialValue ?? '',
      extensions: [
        history(),
        markdown(),
        keryxTheme(),
        keryxHighlight,
        EditorView.lineWrapping,
        keymap.of([...defaultKeymap, ...historyKeymap]),
        this.focusCompartment.of([
          focusModeFacet.of(options.focusMode ?? 'off'),
          focusPlugin
        ]),
        this.typewriterCompartment.of([
          typewriterFacet.of(options.typewriter ?? false),
          typewriterExtension
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            options.onChange?.(update.state.doc.toString())
          }
          if (update.docChanged || update.selectionSet) {
            options.onStats?.(computeStats(update.state.doc.toString()))
          }
        })
      ]
    })

    this.view = new EditorView({ state, parent })
    options.onStats?.(computeStats(this.view.state.doc.toString()))
  }

  private applyTypography(options: EditorOptions): void {
    const style = this.parent.style
    if (options.fontFamily) style.setProperty('--editor-font-family', options.fontFamily)
    if (options.fontSize) style.setProperty('--editor-font-size', `${options.fontSize}px`)
    if (options.lineHeight) style.setProperty('--editor-line-height', String(options.lineHeight))
    if (options.measure) style.setProperty('--editor-measure', `${options.measure}ch`)
  }

  getValue(): string {
    return this.view.state.doc.toString()
  }

  setValue(value: string): void {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: value }
    })
  }

  /** Reemplaza TODAS las ocurrencias de palabra completa (para el corrector). */
  replaceWord(word: string, replacement: string): void {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'gu')
    const text = this.view.state.doc.toString()
    const changes: Array<{ from: number; to: number; insert: string }> = []
    for (const match of text.matchAll(pattern)) {
      const from = match.index ?? 0
      changes.push({ from, to: from + match[0].length, insert: replacement })
    }
    if (changes.length) this.view.dispatch({ changes })
  }

  setFocusMode(mode: FocusMode): void {
    this.view.dispatch({
      effects: this.focusCompartment.reconfigure([focusModeFacet.of(mode), focusPlugin])
    })
  }

  setTypewriter(enabled: boolean): void {
    this.view.dispatch({
      effects: this.typewriterCompartment.reconfigure([
        typewriterFacet.of(enabled),
        typewriterExtension
      ])
    })
  }

  setTypography(options: EditorOptions): void {
    this.applyTypography(options)
  }

  focus(): void {
    this.view.focus()
  }

  destroy(): void {
    this.view.destroy()
  }
}

export { focusModeFacet, type FocusMode } from './focus'
export { typewriterFacet } from './typewriter'
