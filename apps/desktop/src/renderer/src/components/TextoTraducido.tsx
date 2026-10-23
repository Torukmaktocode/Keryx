import type { JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import { useAppStore } from '../store/appStore'
import { normalizarIdioma, useTranslated } from '../lib/traductor'

/**
 * Muestra un bloque de contenido (HTML de módulo o texto plano) traducido en
 * tiempo real cuando el idioma elegido difiere del idioma del módulo. Con
 * badge TRA clicable que devuelve ese bloque al original. Si la traducción
 * no aplica (idioma igual, motor apagado) renderiza el original intacto.
 * Chip de nivel: ✓ verificado (corpus), ≈ experimental (motor), — sin datos.
 */
export function TextoTraducido({
  html,
  plain,
  lang,
  className
}: {
  html?: string
  plain: string
  lang?: string | null
  className?: string
}): JSX.Element {
  const { t } = useI18n()
  const target = useAppStore((s) => s.settings.translateLocale)
  const estado = useTranslated(plain, lang, target)
  const aplica = target !== 'off' && Boolean(normalizarIdioma(lang)) && normalizarIdioma(lang) !== target

  if (!aplica || estado.revertido) {
    if (html !== undefined) {
      return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
    }
    return <span className={className}>{plain}</span>
  }

  return (
    <span className={`texto-traducido ${className ?? ''}`}>
      {estado.cargando && !estado.out ? '…' : estado.out}
      {estado.nivel === 'verificado' && (
        <span
          className="nivel-chip nivel-verificado"
          title={`${t('traduccion.verificado')}${estado.fuente ? ` · ${estado.fuente}` : ''}`}
        >
          ✓
        </span>
      )}
      {estado.nivel === 'experimental' && (
        <span className="nivel-chip nivel-experimental" title={t('traduccion.experimental')}>
          ≈
        </span>
      )}
      {estado.nivel === 'original' && (
        <span className="nivel-chip nivel-original" title={t('traduccion.sinDatos')}>
          —
        </span>
      )}
      <button
        type="button"
        className="tra-badge"
        onClick={() => estado.revertir()}
        title="Traducido · clic para ver el original"
      >
        TRA
      </button>
    </span>
  )
}
