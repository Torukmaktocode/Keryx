export type AppLocale = 'es' | 'en' | 'pt' | 'it' | 'fr' | 'de' | 'zh'

const SOPORTADOS: AppLocale[] = ['es', 'en', 'pt', 'it', 'fr', 'de', 'zh']

/**
 * Detección del idioma del sistema (primer arranque): 'pt-BR' → 'pt',
 * 'zh-CN' → 'zh', 'en-US' → 'en'. Si el sistema habla un idioma no
 * soportado, cae a español (idioma fuente de la app).
 */
export function detectAppLocale(raw: string | undefined | null): AppLocale {
  const code = (raw ?? '').split(/[-_]/)[0].toLowerCase()
  return (SOPORTADOS as string[]).includes(code) ? (code as AppLocale) : 'es'
}
