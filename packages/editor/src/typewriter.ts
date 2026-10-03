import { EditorState, Facet } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const typewriterFacet = Facet.define<boolean, boolean>({
  combine: (values) => values[values.length - 1] ?? false
})

export const typewriterExtension = EditorState.transactionExtender.of((tr) => {
  if (!tr.state.facet(typewriterFacet)) return null
  if (!tr.docChanged && !tr.selection) return null
  return {
    effects: EditorView.scrollIntoView(tr.state.selection.main.head, { y: 'center' })
  }
})
