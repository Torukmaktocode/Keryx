export type ModuleCategory =
  | 'Bible'
  | 'Commentary'
  | 'Lexicon'
  | 'Dictionary'
  | 'GenBook'
  | 'Devotional'
  | 'Unknown'

export type ModuleSource = 'local' | 'remote'

/** Enfoque de traduccion para comparar biblias (espectro de equivalencia experto). */
export type TranslationProfile = 'formal' | 'dinamica' | 'parafrasis' | 'ampliada' | 'original'

export interface SwordModule {
  name: string
  description: string
  category: ModuleCategory
  lang: string
  driver: string
  encoding: string
  version: string
  installed: boolean
  source: ModuleSource
  repository?: string
  /** library = "principal" (esword/) or "biblioteca" folder (scan bibliography/). */
  library?: 'principal' | 'biblioteca'
  hasStrongs?: boolean
  cipherKey?: boolean
  profile?: TranslationProfile | null
}

export interface Repository {
  name: string
  url: string
  type: 'Master' | 'Local' | 'Remote'
  lastUpdated?: string
}

export interface Verse {
  book: string
  chapter: number
  verse: number
  text: string
  heading?: string
  isHeading?: boolean
}

export interface BookInfo {
  code: string
  name: string
  nameEs: string
  testament: 'OT' | 'NT'
  chapters: number
  ordinal: number
}

export interface SearchResult {
  module: string
  book: string
  chapter: number
  verse: number
  text: string
  score?: number
}

export interface SearchOptions {
  query: string
  scope?: 'all' | 'ot' | 'nt'
  caseSensitive?: boolean
  wholeWord?: boolean
  modules?: string[]
  limit?: number
}

export interface StrongsEntry {
  key: string
  transliteration?: string
  pronunciation?: string
  definition: string
  language: 'greek' | 'hebrew' | 'unknown'
}

/** Marcas al estilo e-Sword: que modulos tienen contenido para la referencia/tema. */
export interface StrongsOccurrence {
  book: string
  chapter: number
  verse: number
  word: string
  morphology: string
}

export interface ModuleCoverage {
  module: string
  /** Comentarios: versiculos cubiertos del capitulo. Diccionarios: 1 si existe entrada. */
  hits: number
}

export interface DocumentMeta {
  id: string
  title: string
  kind: 'free' | 'sermon' | 'study' | 'devotional'
  createdAt: string
  updatedAt: string
  wordCount: number
}

export interface Document extends DocumentMeta {
  content: string
  meta?: Record<string, unknown>
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'sepia'
  uiLocale: string
  readingFont: string
  writingFont: string
  measure: number
  focusMode: 'off' | 'sentence' | 'paragraph'
  typewriter: boolean
  fontSize: number
  lineHeight: number
  priorityModules: string[]
  sidebarHidden: boolean
  aiEnabled: boolean
  aiBaseUrl: string
  aiModel: string
  aiApiKey: string
  /** Mostrar biblioteca (escanea biblioteca/). */
  bibliotecaEnabled: boolean
  /** Superindices Strong# visibles en la Biblia del modo Estudio. */
  showStrongs: boolean
  /** Doble pasada IA para creadores (borrador / criticado / final). */
  deepSermon: boolean
  /** Traducción en tiempo real del contenido ('off' o código BCP-47 corto). */
  translateLocale: string
  /** Layout del modo Estudio (plantilla, paneles, anchos, sincronia). */
  study: StudyLayout
}

export type StudyPaneKind = 'bible' | 'commentary' | 'dictionary' | 'book'

export type StudyTemplate = 'completo' | 'lectura' | 'libros' | 'investigar' | 'custom'

/** Anchos relativos (%) por panel; 0 = peso por defecto. */
export interface StudyLayout {
  template: StudyTemplate
  panes: StudyPaneKind[]
  widths: number[]
  closed: StudyPaneKind[]
  /** Fijar/soltar la sincronia del versiculo por panel (default true). */
  sync: Partial<Record<StudyPaneKind, boolean>>
  /** Modulo seleccionado por clase de panel. */
  modules: Partial<Record<StudyPaneKind, string>>
}

/** Especifica una plantilla: paneles base + pesos relativos. */
export interface StudyTemplateSpec {
  id: StudyTemplate
  panes: StudyPaneKind[]
  weights: number[]
}

export const STUDY_TEMPLATES: StudyTemplateSpec[] = [
  { id: 'completo', panes: ['bible', 'commentary', 'dictionary'], weights: [1.2, 1, 1] },
  { id: 'lectura', panes: ['bible', 'commentary'], weights: [1.4, 1] },
  { id: 'libros', panes: ['bible', 'book'], weights: [1, 1.4] },
  { id: 'investigar', panes: ['bible', 'dictionary'], weights: [1, 1] }
]

export const DEFAULT_STUDY: StudyLayout = {
  template: 'completo',
  panes: [...STUDY_TEMPLATES[0].panes],
  widths: [],
  closed: [],
  sync: {},
  modules: {}
}

export type AiRole = 'system' | 'user' | 'assistant'

export interface AiMessage {
  role: AiRole
  content: string
}

export interface AiChatRequest {
  messages: AiMessage[]
  temperature?: number
  maxTokens?: number
}

export interface AiChatResult {
  text: string
  model: string
}

export interface AiStatus {
  configured: boolean
  source: 'settings' | 'opencode' | 'env' | 'none'
  baseUrl: string
  model: string
  models: string[]
  error?: string
}

export interface Result<T> {
  ok: boolean
  data?: T
  error?: string
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  uiLocale: 'es',
  readingFont: 'serif',
  writingFont: 'iA Writer Quattro',
  measure: 65,
  focusMode: 'off',
  typewriter: false,
  fontSize: 19,
  lineHeight: 1.7,
  priorityModules: [],
  sidebarHidden: false,
  aiEnabled: true,
  aiBaseUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-4o-mini',
  aiApiKey: '',
  bibliotecaEnabled: true,
  showStrongs: false,
  deepSermon: false,
  translateLocale: 'off',
  study: DEFAULT_STUDY
}
