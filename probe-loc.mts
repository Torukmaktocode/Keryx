import { EswordProvider } from '../packages/sword/src/local/esword'
;(globalThis as unknown as { window: object }).window = {}
const { buildDossier } = await import('../apps/desktop/src/renderer/src/lib/agents')
const { locatePassageByTokens, queryTokensOf } = await import('../apps/desktop/src/renderer/src/lib/creator')

const p = EswordProvider.create('esword', ['biblioteca'])
const mods = await p!.listLocalModules()
const hook: import('../apps/desktop/src/renderer/src/lib/agents').AgentHook = {
  modules: mods,
  locale: 'es',
  priorityModules: [],
  selectedModule: '',
  chapter: async (m, b, c) => (await p!.getChapter(m, b, c)) ?? [],
  verse: async (m, b, c, v) => ((await p!.getVerse(m, b, c, v)) ?? null),
  coverage: async (b, c) => p!.commentaryCoverage(b, c),
  lookup: async (m, k) => ((await p!.lookupDict(m, k)) ?? null),
  strongs: async (k) => ((await p!.strongs(k)) ?? null),
  search: async (q, m, l) => ((await p!.search({ query: q, modules: m, limit: l })) ?? [])
}
const query = 'hablar sobre tomar la mano de la niña talita cumi'
const bibleName = hook.modules.find((m) => m.category === 'Bible')?.name ?? ''
console.log('bible:', bibleName)
const loc = await locatePassageByTokens(queryTokensOf(query), bibleName, async (w) =>
  ((await p!.search({ query: w, modules: [bibleName], limit: 60 })) ?? [])
)
console.log('located:', loc)
const d = await buildDossier(hook, 'crearsermon', query, loc ?? undefined)
console.log('kinds:', d.sections.map((s) => s.kind).join(','))
console.log('texto?', d.sections.find((s) => s.kind === 'texto')?.entries[0]?.slice(0, 80))
p?.dispose()
