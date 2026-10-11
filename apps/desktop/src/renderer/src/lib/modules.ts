import type { SwordModule } from '@keryx/core'
import { languageLabel } from './languages'

/** Nombre completo del modulo: la descripcion del .conf (o el codigo si no hay). */
export function moduleLabel(m: SwordModule): string {
  const description = (m.description || '').trim()
  return description || m.name
}

/** Etiqueta para selectores: nombre completo + idioma (sin parentesis si el idioma es desconocido). */
export function moduleOptionLabel(m: SwordModule, locale: string): string {
  const base = moduleLabel(m)
  const lang = (m.lang || '').trim()
  if (!lang || lang === '?') return base
  return `${base} (${languageLabel(lang, locale)})`
}
