export type ModuleCategory =
  | 'Bible'
  | 'Commentary'
  | 'Lexicon'
  | 'Dictionary'
  | 'GenBook'
  | 'Devotional'
  | 'Unknown'

export type ModuleSource = 'local' | 'remote'

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
  aiApiKey: ''
}
