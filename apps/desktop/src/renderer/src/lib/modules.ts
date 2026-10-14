import type { SwordModule, TranslationProfile } from '@keryx/core'
import { languageLabel } from './languages'

export type { TranslationProfile }

/** Nombre completo del modulo: la descripcion del .conf (o el codigo si no hay). */
export function moduleLabel(m: SwordModule): string {
  const description = (m.description || '').trim()
  return description || m.name
}

/** Etiqueta compacta para filas de comparacion: sin sufijos de categoria. */
export function moduleShortLabel(m: SwordModule): string {
  return (m.description || '').replace(/\((?:Comentario|Diccionario)[^)]*\)/gi, '').trim() || m.name
}

/** Perfil de traduccion segun el enfoque que usan los biblistas evangelicos para comparar. */
export function moduleProfile(name: string): TranslationProfile | null {
  if (
    /interlineal/i.test(name) ||
    /septuaginta|vulgate|peshitta|textus|hebraica|stuttgart|bizantino|nestle|westcott|tischendorf|torah|griego/i.test(name)
  ) {
    return 'original'
  }
  if (/amplificada/i.test(name)) return 'ampliada'
  if (/reina valera|reina\b|1569|1862|1909|1960|1995|biblia textual|am.ricas/i.test(name)) {
    return 'formal'
  }
  if (
    /nueva version internacional|traduccion viviente|habla hoy|lenguaje sencillo|lenguaje actual|palabra de dios para todos|siglo xx/i.test(name)
  ) {
    return 'dinamica'
  }
  if (/parafrasis|biblia viva|al dia|lenguaje sencillo|nuestro pueblo|pueblo de dios/i.test(name)) {
    return 'parafrasis'
  }
  return null
}

/** Anota el perfil una sola vez, en el init de la aplicacion (bootstrap/refreshModules). */
export function annotateProfiles(modules: SwordModule[]): SwordModule[] {
  return modules.map((m) => (m.profile ? m : { ...m, profile: moduleProfile(m.name) }))
}

/** Etiqueta para selectores: nombre completo + idioma (sin parentesis si el idioma es desconocido). */
export function moduleOptionLabel(m: SwordModule, locale: string): string {
  const base = moduleLabel(m)
  const lang = (m.lang || '').trim()
  if (!lang || lang === '?') return base
  return `${base} (${languageLabel(lang, locale)})`
}
