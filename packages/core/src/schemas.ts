import { z } from 'zod'

export const moduleCategorySchema = z.enum([
  'Bible',
  'Commentary',
  'Lexicon',
  'Dictionary',
  'GenBook',
  'Devotional',
  'Unknown'
])

export const installModuleSchema = z.object({
  name: z.string().min(1),
  repository: z.string().optional()
})

export const uninstallModuleSchema = z.object({
  name: z.string().min(1)
})

export const chapterRequestSchema = z.object({
  module: z.string().min(1),
  book: z.string().min(1),
  chapter: z.number().int().positive()
})

export const verseRequestSchema = chapterRequestSchema.extend({
  verse: z.number().int().positive()
})

export const searchRequestSchema = z.object({
  query: z.string().min(1),
  scope: z.enum(['all', 'ot', 'nt']).optional(),
  caseSensitive: z.boolean().optional(),
  wholeWord: z.boolean().optional(),
  modules: z.array(z.string()).optional(),
  limit: z.number().int().positive().optional()
})

export const compareRequestSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  modules: z.array(z.string().min(1)).min(1)
})

export const dictLookupSchema = z.object({
  module: z.string().min(1),
  key: z.string().min(1)
})

export const dictEntriesSchema = z.object({
  module: z.string().min(1),
  prefix: z.string().optional()
})

export const strongsSchema = z.object({
  key: z.string().min(1)
})

export const suggestSchema = z.object({
  query: z.string().min(1),
  module: z.string().min(1),
  limit: z.number().int().positive().max(20).optional()
})

export const checkSpellingSchema = z.object({
  module: z.string().min(1),
  words: z.array(z.string().min(1)).min(1).max(400),
  limit: z.number().int().positive().max(6).optional()
})

export const coverageRequestSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive()
})

export const dictCoverageSchema = z.object({
  term: z.string().min(1)
})

export const fullscreenSchema = z.object({
  value: z.boolean().optional()
})

export const zoomSchema = z.object({
  value: z.number().min(0.5).max(3).optional()
})

export const studyPaneKindSchema = z.enum(['bible', 'commentary', 'dictionary', 'book'])

export const studyTemplateSchema = z.enum(['completo', 'lectura', 'libros', 'investigar', 'custom'])

const paneFlags = <T extends z.ZodType>(value: T) =>
  z
    .object({
      bible: value.optional(),
      commentary: value.optional(),
      dictionary: value.optional(),
      book: value.optional()
    })
    .default({})

export const studyLayoutSchema = z.object({
  template: studyTemplateSchema.default('completo'),
  panes: z.array(studyPaneKindSchema).default(['bible', 'commentary', 'dictionary']),
  widths: z.array(z.number()).default([]),
  closed: z.array(studyPaneKindSchema).default([]),
  sync: paneFlags(z.boolean()),
  modules: paneFlags(z.string().min(1))
})

export const documentIdSchema = z.object({
  id: z.string().min(1)
})

export const documentCreateSchema = z.object({
  title: z.string().min(1),
  kind: z.enum(['free', 'sermon', 'study', 'devotional']).default('free'),
  content: z.string().optional()
})

export const documentSaveSchema = z.object({
  id: z.string().min(1),
  content: z.string(),
  title: z.string().optional()
})

export const settingsPatchSchema = z.object({
  theme: z.enum(['light', 'dark', 'sepia']).optional(),
  uiLocale: z.string().optional(),
  readingFont: z.string().optional(),
  writingFont: z.string().optional(),
  measure: z.number().int().positive().optional(),
  focusMode: z.enum(['off', 'sentence', 'paragraph']).optional(),
  typewriter: z.boolean().optional(),
  fontSize: z.number().positive().optional(),
  lineHeight: z.number().positive().optional(),
  priorityModules: z.array(z.string()).optional(),
  sidebarHidden: z.boolean().optional(),
  aiEnabled: z.boolean().optional(),
  aiBaseUrl: z.string().optional(),
  aiModel: z.string().optional(),
  aiApiKey: z.string().optional(),
  bibliotecaEnabled: z.boolean().optional(),
  showStrongs: z.boolean().optional(),
  deepSermon: z.boolean().optional(),
  translateLocale: z
    .enum(['off', 'es', 'en', 'pt', 'it', 'fr', 'de', 'zh', 'qu', 'gn', 'arn', 'ay', 'bn'])
    .optional(),
  study: studyLayoutSchema.optional()
})

export const presentationSaveSchema = z.object({
  name: z.string().min(1).max(120),
  base64: z.string().min(100)
})

export const translateRequestSchema = z.object({
  source: z.string().min(2).max(8),
  target: z.string().min(2).max(8),
  text: z.string().max(20_000)
})

export const translateBatchSchema = z.object({
  source: z.string().min(2).max(8),
  target: z.string().min(2).max(8),
  items: z.array(z.string().max(20_000)).max(900)
})

export const translatePairSchema = z.object({
  source: z.string().min(2).max(8),
  target: z.string().min(2).max(8)
})

export const versoRefSchema = z.object({
  lang: z.string().min(2).max(8),
  code: z.string().min(3).max(6),
  cap: z.number().int().positive().max(200),
  ver: z.number().int().positive().max(200)
})

export const versoBatchSchema = z.object({
  items: z.array(versoRefSchema).max(900)
})

export const versoResultadoSchema = z.object({
  texto: z.string(),
  nivel: z.enum(['verificado', 'experimental', 'original']),
  fuente: z.string().max(200).optional()
})

export const lenguaEstadoSchema = z.object({
  code: z.string().min(2).max(8),
  nombre: z.string().max(60),
  familia: z.string().max(80),
  alfabeto: z.string().max(400),
  motor: z.enum(['corpus', 'neural', 'pendiente']),
  versosCorpus: z.number().int().nonnegative(),
  glosario: z.number().int().nonnegative()
})

export const glosarioRequestSchema = z.object({
  lang: z.string().min(2).max(8)
})

export const glosarioParSchema = z.object({
  es: z.string().max(60),
  nat: z.string().max(60),
  peso: z.number()
})

export const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string()
      })
    )
    .min(1),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional()
})

export type InstallModuleInput = z.infer<typeof installModuleSchema>
export type ChapterRequest = z.infer<typeof chapterRequestSchema>
export type VerseRequest = z.infer<typeof verseRequestSchema>
export type SearchRequest = z.infer<typeof searchRequestSchema>
export type CompareRequest = z.infer<typeof compareRequestSchema>
export const dictLemmaSchema = z.object({
  module: z.string(),
  lemma: z.string().min(1)
})
export const strongsOccurrencesSchema = z.object({
  code: z.string().min(2).max(8),
  limit: z.number().int().positive().max(2000).optional()
})

export type DictLookupInput = z.infer<typeof dictLookupSchema>
export type SettingsPatch = z.infer<typeof settingsPatchSchema>
export type AiChatInput = z.infer<typeof aiChatSchema>
export type FullscreenInput = z.infer<typeof fullscreenSchema>
export type ZoomInput = z.infer<typeof zoomSchema>
export type PresentationSaveInput = z.infer<typeof presentationSaveSchema>
export type TranslateRequestInput = z.infer<typeof translateRequestSchema>
export type TranslateBatchInput = z.infer<typeof translateBatchSchema>
export type TranslatePairInput = z.infer<typeof translatePairSchema>
export type VersoRef = z.infer<typeof versoRefSchema>
export type VersoBatchInput = z.infer<typeof versoBatchSchema>
export type VersoResultado = z.infer<typeof versoResultadoSchema>
export type LenguaEstado = z.infer<typeof lenguaEstadoSchema>
export type GlosarioRequest = z.infer<typeof glosarioRequestSchema>
export type GlosarioPar = z.infer<typeof glosarioParSchema>
