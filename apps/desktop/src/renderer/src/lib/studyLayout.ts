import {
  STUDY_TEMPLATES,
  type StudyLayout,
  type StudyPaneKind,
  type StudyTemplate
} from '@keryx/core'
import type { TranslationKey } from '@keryx/i18n'

export const PANE_MIN_PX = 220
export const PANE_GAP_PX = 16

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
 * Normaliza los anchos guardados (px) al ancho real disponible.
 * - 0 = sin preferencia: reparte segun peso del tipo de panel.
 * - Si la suma guardada no calza, se re-escala a lo disponible.
 * Siempre devuelve anchos absolutos que SUMAN exactamente lo disponible.
 */
export function normalizedWidths(
  layout: StudyLayout,
  available: number
): number[] {
  const visible = layout.panes
  const count = visible.length
  if (count === 0) return []
  const total = Math.max(count * PANE_MIN_PX, available - (count - 1) * PANE_GAP_PX)
  const raw = visible.map((_, i) => Math.max(0, layout.widths[i] ?? 0))
  const fixedSum = raw.reduce((a, b) => a + (b > 0 ? b : 0), 0)
  const zeros = visible.map((_, i) => (raw[i] === 0 ? i : -1)).filter((i) => i >= 0)
  if (zeros.length === count) {
    // todo por defecto
    const weightSum = visible.reduce((a, k) => a + DEFAULT_WEIGHTS[k], 0) || 1
    return visible.map((k) => Math.round((total * DEFAULT_WEIGHTS[k]) / weightSum))
  }
  // re-escala los fijos si se salen del contenedor
  const roomForFixed = Math.max(
    PANE_MIN_PX * (count - zeros.length),
    total - PANE_MIN_PX * zeros.length
  )
  const scale = fixedSum > roomForFixed ? roomForFixed / fixedSum : 1
  const fixed = raw.map((w) => (w > 0 ? Math.round(w * scale) : 0))
  const usedFixed = fixed.reduce((a, b) => a + b, 0)
  const remaining = total - usedFixed
  const weightSum = zeros.reduce((a, i) => a + DEFAULT_WEIGHTS[visible[i]], 0)
  if (zeros.length === 0 || remaining <= 0) {
    // solo fijos: corrige para que sumen exacto (ajusta el primero)
    if (count > 0 && remaining !== 0) {
      fixed[0] = Math.max(PANE_MIN_PX, fixed[0] + remaining)
    }
    return fixed
  }
  const out = [...fixed]
  let distributed = 0
  for (const i of zeros) {
    const share = Math.round((remaining * DEFAULT_WEIGHTS[visible[i]]) / weightSum)
    out[i] = Math.max(PANE_MIN_PX, share)
    distributed += out[i]
  }
  // ajusta el ultimo cero para cerrar la suma exacta
  const lean = distributed - remaining
  if (lean !== 0) {
    const lastZero = zeros[zeros.length - 1]
    out[lastZero] = Math.max(PANE_MIN_PX, out[lastZero] - lean)
  }
  return out
}

/** Arrastre entre paneles vecinos: el par comparte el espacio del par. */
export function resizePanes(
  current: number[],
  indexLeft: number,
  rawLeft: number
): number[] {
  if (indexLeft < 0 || indexLeft + 1 >= current.length) return current
  const next = [...current]
  const pairOriginal = next[indexLeft] + next[indexLeft + 1]
  const left = Math.max(
    PANE_MIN_PX,
    Math.min(pairOriginal - PANE_MIN_PX, Math.round(rawLeft))
  )
  next[indexLeft] = left
  next[indexLeft + 1] = pairOriginal - left
  return next
}

/** Restaura el peso por defecto de un par (doble clic en el separador). */
export function resetPanePair(current: number[], indexLeft: number): number[] {
  const next = [...current]
  next[indexLeft] = 0
  next[indexLeft + 1] = 0
  return next
}

export const PANE_LABELS: Record<StudyPaneKind, TranslationKey> = {
  bible: 'study.bible',
  commentary: 'study.commentary',
  dictionary: 'study.dictionary',
  book: 'library.tab.books'
}
