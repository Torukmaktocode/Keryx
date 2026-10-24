/**
 * Evals de calidad del dosier (golden passages): cobertura mínima por género,
 * latencia, presupuesto e invariante de render (sin marcadores sueltos).
 * Corre con biblioteca real si está disponible (`npm run eval`).
 */
import { EswordProvider } from '../packages/sword/src/local/esword'
;(globalThis as unknown as { window: object }).window = {}
const { buildDossier, DOSSIER_BUDGET } = await import('../apps/desktop/src/renderer/src/lib/agents')
const { buildSermonDocument, renderSermon } = await import('../apps/desktop/src/renderer/src/lib/sermonEngine')
const { PERSONAS, locatePassageByTokens, queryTokensOf } = await import('../apps/desktop/src/renderer/src/lib/creator')

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

interface GoldenCase {
  name: string
  query: string
  requiring: string[]
}

const CASES: GoldenCase[] = [
  { name: 'evangelio', query: 'Juan 3:16', requiring: ['texto', 'comentario', 'historico'] },
  { name: 'epistola', query: 'Romanos 8:28', requiring: ['texto', 'comentario', 'historico'] },
  { name: 'salterio', query: 'Salmo 23:1', requiring: ['texto', 'comentario'] },
  { name: 'parabola', query: 'Lucas 10:25', requiring: ['texto', 'comentario'] },
  { name: 'texto-libre', query: 'hablar sobre tomar la mano de la niña talita cumi', requiring: ['texto'] }
]

const scores: number[] = []
let failed = 0
console.log('Golden passages (biblioteca real):')
for (const gold of CASES) {
  const started = Date.now()
  const { parseReference } = await import('../apps/desktop/src/renderer/src/lib/reference')
  let at: { book: string; chapter: number; verse?: number } | undefined
  if (!parseReference(gold.query)) {
    const bibleName = hook.modules.find((m) => m.category === 'Bible')?.name ?? ''
    const located = await locatePassageByTokens(
      queryTokensOf(gold.query),
      bibleName,
      async (word) => ((await p!.search({ query: word, modules: [bibleName], limit: 60 })) ?? [])
    )
    at = located ?? undefined
  }
  const dossier = await buildDossier(hook, 'crearsermon', gold.query, at)
  const ms = Date.now() - started
  const kinds = new Set(dossier.sections.map((s) => s.kind))
  const missing = gold.requiring.filter((kind) => !kinds.has(kind))
  const okKinds = missing.length === 0
  const citationOk = dossier.citations.length >= 5
  const budgetOk = dossier.chars <= 20000
  const preacher = PERSONAS.find((x) => x.id === 'peterson')!
  const doc = buildSermonDocument(dossier, preacher, gold.query)
  const markdown = renderSermon(doc)
  const noLooseMarkers = !markdown.includes('[[')
  const markerAt = markdown.indexOf('[[')
  if (markerAt >= 0) console.log('  MARKER @', markerAt, JSON.stringify(markdown.slice(markerAt - 40, markerAt + 40)))
  const corchetesGuia = (markdown.match(/\[[^\]\n]{14,180}\]/g) ?? []).filter((m) => !m.includes('·'))
  const noGuideBrackets = corchetesGuia.length === 0
  if (!noGuideBrackets) console.log('  CORCHETES-GUIA:', corchetesGuia.slice(0, 3).join(' | '))
  const completeSlots = markdown.length > 800
  const passed = okKinds && citationOk && budgetOk && noLooseMarkers && noGuideBrackets && completeSlots
  const score = (okKinds ? 4 : 0) + (citationOk ? 2 : 0) + (budgetOk ? 1 : 0) + (noLooseMarkers ? 2 : 0)
  scores.push(score)
  if (!passed) failed += 1
  console.log(
    `${passed ? PASS : FAILF} ${gold.name.padEnd(10)} ${ms}ms · ${kinds.size} secciones · ${dossier.citations.length} citas · ${dossier.chars}c · score ${score}/9${missing.length ? ` · faltan: ${missing.join(',')}` : ''}`
  )
  if (missing.length) console.log('    kinds:', [...kinds].join(','))
}
const avg = scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length)
console.log(`\nResult: ${failed}/${CASES.length} fallos · score medio ${avg.toFixed(1)}/9`)
p?.dispose()

function PASS(str: string): string {
  return str
}
function FAILF(str: string): string {
  return str.toUpperCase() + ' ✗'
}
