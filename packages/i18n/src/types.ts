import { es } from './locales/es'

export type TranslationKey = keyof typeof es
export type Locale = 'es' | 'en' | 'pt'
export const LOCALES: Locale[] = ['es', 'en', 'pt']
