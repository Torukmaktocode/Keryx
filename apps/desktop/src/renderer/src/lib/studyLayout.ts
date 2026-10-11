import {
  STUDY_TEMPLATES,
  type StudyLayout,
  type StudyPaneKind,
  type StudyTemplate
} from '@keryx/core'
import type { TranslationKey } from '@keryx/i18n'

export const PANE_MIN_PX = 240
export const PANE_RESIZE_PX = 640

/** Ancho por defecto (peso relativo) de cada clase de panel. */
const DEFAULT_WEIGHTS: Record<StudyPaneKind, number> = {
  bible: 1.2,
  commentary: 1,
  dictionary: 1,
  book: 1.3
}

/** Aplica una plantilla conservando los modulos elegidos por el usuario. */
export function applyTemplate(id: StudyTemplate, current: StudyLayout): StudyLayout {
  const spec = STUDY_TEMPLATES.find((t) => t.id === id)
  if (!spec) return { ...current, template: 'custom' }
  return {
    template: id,
    panes: [...spec.panes],
    widths: [],
    closed: [],
    sync: current.sync,
    modules: current.modules
  }
}

/**
 * Calcula el ancho en px de cada panel visible: los sin anchura explicita
 * comparten el espacio restante segun peso.
 */
export function paneWidths(
  layout: StudyLayout,
  available: number,
  gap = 16
): number[] {
  const visible = layout.panes
  const gaps = Math.max(0, visible.length - 1) * gap
  let fixed = 0
  const explicit: number[] = visible.map((_, i) => {
    const stored = layout.widths[i] ?? 0
    if (stored > 0) {
      fixed += stored
      return stored
    }
    return 0
  })
  const remaining = available - gaps - fixed
  if (remaining <= 0) {
    // los explicitos ya colapsan el resto: poser minimos proporcionales
    return explicit.map((w) => (w > 0 ? Math.max(PANE_MIN_PX, w) : PANE_MIN_PX))
  }
  const weights = visible.map((kind, i) => (explicit[i] > 0 ? 0 : DEFAULT_WEIGHTS[kind]))
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1
  return explicit.map((w, i) =>
    w > 0
      ? Math.max(PANE_MIN_PX, w)
      : Math.max(PANE_MIN_PX, Math.round((remaining * weights[i]) / weightSum))
  )
}

/** Intercambia ancho entre paneles vecinos arrastrando el separador. */
export function resizePanes(
  widths: number[],
  indexLeft: number,
  rawWidthLeft: number,
  available: number,
  count: number,
  gap = 16
): number[] {
  if (count < 2) return widths
  const gaps = (count - 1) * gap
  const maxAvailable = Math.max(PANE_MIN_PX * count, available - gaps)
  const clamped = Math.max(PANE_MIN_PX, Math.min(PANE_RESIZE_PX, rawWidthLeft))
  const next = [...widths]
  next[indexLeft] = clamped
  next[indexLeft + 1] = Math.max(PANE_MIN_PX, maxAvailable - clamped)
  return next
}

/** Clase CSS del panel para identificar el chevron del menu. */
export const PANE_LABELS: Record<StudyPaneKind, TranslationKey> = {
  bible: 'study.bible',
  commentary: 'study.commentary',
  dictionary: 'study.dictionary',
  book: 'library.tab.books'
}
