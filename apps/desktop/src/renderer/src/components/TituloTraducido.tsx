import type { JSX } from 'react'
import { useAppStore } from '../store/appStore'
import { normalizarIdioma, useTranslated } from '../lib/traductor'

/**
 * Titulo de modulo (boton, chip, etiqueta, fila) traducido en vivo. Sin badge:
 * el original queda como tooltip para identificar el modulo real.
 */
export function TituloTraducido({
  text,
  lang,
  className
}: {
  text: string
  lang?: string | null
  className?: string
}): JSX.Element {
  const target = useAppStore((s) => s.settings.translateLocale)
  const estado = useTranslated(text, lang, target)
  const aplica = target !== 'off' && Boolean(normalizarIdioma(lang)) && normalizarIdioma(lang) !== target
  if (!aplica) return <span className={className}>{text}</span>
  return <span className={className} title={text}>{estado.out}</span>
}
