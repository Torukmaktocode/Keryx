import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

export const keryxHighlightStyle = HighlightStyle.define([
  { tag: t.heading1, fontSize: '1.6em', fontWeight: '700', lineHeight: '1.3' },
  { tag: t.heading2, fontSize: '1.35em', fontWeight: '700', lineHeight: '1.3' },
  { tag: t.heading3, fontSize: '1.18em', fontWeight: '600' },
  { tag: t.heading4, fontWeight: '600' },
  { tag: t.strong, fontWeight: '700' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'var(--accent)', textDecoration: 'underline' },
  { tag: t.url, color: 'var(--accent)' },
  { tag: t.monospace, fontFamily: 'var(--font-mono)' },
  { tag: t.quote, color: 'var(--muted)', fontStyle: 'italic' },
  { tag: t.list, color: 'var(--accent)' },
  { tag: t.contentSeparator, color: 'var(--muted)' },
  { tag: t.comment, color: 'var(--muted)' }
])

export const keryxHighlight = syntaxHighlighting(keryxHighlightStyle)

export function keryxTheme(): ReturnType<typeof EditorView.theme> {
  return EditorView.theme({
    '&': {
      color: 'var(--fg)',
      backgroundColor: 'transparent',
      height: '100%',
      fontSize: 'var(--editor-font-size, 19px)'
    },
    '.cm-scroller': {
      fontFamily: 'var(--editor-font-family)',
      lineHeight: 'var(--editor-line-height, 1.7)',
      overflow: 'auto'
    },
    '.cm-content': {
      caretColor: 'var(--accent)',
      padding: '8vh 0',
      maxWidth: 'var(--editor-measure, 65ch)',
      margin: '0 auto'
    },
    '.cm-line': {
      padding: '0 8px'
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--accent)',
      borderLeftWidth: '2px'
    },
    '&.cm-focused': { outline: 'none' },
    '.cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'var(--selection)'
    },
    '.cm-activeLine': { backgroundColor: 'transparent' },
    '.cm-gutters': { display: 'none' },
    '.cm-dim': { opacity: '0.22', transition: 'opacity 220ms ease' },
    '.cm-focus': { opacity: '1', transition: 'opacity 220ms ease' },
    '.cm-focus-line': {
      backgroundColor: 'var(--accent-soft)',
      boxShadow: 'inset 2px 0 0 var(--accent)',
      transition: 'background-color 220ms ease'
    }
  })
}
