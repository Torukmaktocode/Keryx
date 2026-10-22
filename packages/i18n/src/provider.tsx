import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { es } from './locales/es'
import { en } from './locales/en'
import { pt } from './locales/pt'
import { it } from './locales/it'
import { fr } from './locales/fr'
import { de } from './locales/de'
import { zh } from './locales/zh'
import { LOCALES, type Locale, type TranslationKey } from './types'

const DICTS: Record<Locale, Record<TranslationKey, string>> = { es, en, pt, it, fr, de, zh }

export interface I18nValue {
  locale: Locale
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const fallback: I18nValue = { locale: 'es', t: (key) => es[key] ?? key }
const I18nContext = createContext<I18nValue>(fallback)

export function I18nProvider({
  locale,
  children
}: {
  locale: string
  children: ReactNode
}) {
  const value = useMemo<I18nValue>(() => {
    const active: Locale = (LOCALES as string[]).includes(locale) ? (locale as Locale) : 'es'
    const dict = DICTS[active]
    const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
      let text = dict[key] ?? es[key] ?? key
      if (params) {
        for (const [name, raw] of Object.entries(params)) {
          text = text.split(`{${name}}`).join(String(raw))
        }
      }
      return text
    }
    return { locale: active, t }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  return useContext(I18nContext)
}
