import { es } from './locales/es'

export type TranslationKey = keyof typeof es
export type Locale = 'es' | 'en' | 'pt' | 'it' | 'fr' | 'de' | 'zh'
export const LOCALES: Locale[] = ['es', 'en', 'pt', 'it', 'fr', 'de', 'zh']
