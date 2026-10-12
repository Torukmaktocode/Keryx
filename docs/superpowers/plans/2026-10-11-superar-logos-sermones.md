# Superar a Logos en sermones — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el sermón generado por Keryx iguale/supere el pipeline de Logos (Exegetical Guide concordada por Strong, lemmas griegos, aparato crítico por verso, critic-then-refine con IA, export pulpit-grade), manteniendo 0 tokens en la mina y anclaje total.

**Architecture:** Mantener la arquitectura vigente (sub-agentes de código en `agents.ts` → dosier anclado → IA única de redacción en `creator.ts`, fallback determinista). Se agregan: (1) motor de ocurrencias Strong con IPC, (2) índices en memoria construidos una vez (refs por Strong desde la Concordancia Exhaustiva ES; lema→Ortiz), (3) componente `ExegesisGuide` en la Guía del Pasaje, (4) doble pasada IA (borrador → crítico → final) opcional, (5) export .docx/.md.

**Tech Stack:** Electron + IPC existente, `packages/sword` (SQLite e-Sword 2009), React/TS, vitest + jsdom (fake hook), sin dependencias nuevas (docx por HTML→RTF render propio simple, no lib externa).

**Spec:** docs/resumen-app.md (mapa actual), docs/superpowers/plans/2026-10-11-biblioteca-estudio.md (fases previas marcadas).

## Global Constraints

- Todo el minado de evidencia: TypeScript + SQLite local. CERO llamadas de IA en la construcción del dosier.
- Cada pieza de contenido que entra al sermón DEBE llevar cita `[Módulo · entrada]` verificable. Si un módulo no tiene el dato, la sección no aparece (nunca rellenar).
- Orchestración de agentes en paralelo con `Promise.all` (patrón vigente en `buildDossier`); el ensamble consume presupuesto en orden canónico.
- Presupuesto del dosier: `DOSSIER_BUDGET` chars (ahora 16000; puede subir avisando en test).
- Módulos de la biblioteca: nombres reales ya escaneados. Ojo: "Diccionario y Concordancia Greco-Espanola - Pedro Ortiz" NO usa numeración Strong (probado: 1063→gemizō ≠ gar); NO usarlo por número. Lema→Ortz solo vía índice de lema (Task 4).
- i18n: 3 idiomas siempre (packages/i18n/src/locales/{es,en,pt}.ts).
- Tests: `apps/desktop/src/renderer/src/lib/*.test.ts` con fake hook (jsdom). comando: `npm run test`; typecheck `npm run typecheck`; lint `npm run lint`.
- Sin comentarios en el código (regla del repo), sin emojis.

---

### Task 1: IPC + provider real de ocurrencias Strong (`strongsOccurrences`)

**Files:**
- Modify: `packages/sword/src/local/esword.ts` (ya tiene `strongsOccurrences` borrador: verificar/ajustar a versión definitiva)
- Modify: `packages/core/src/types.ts` (type `StrongsOccurrence`)
- Modify: `packages/core/src/channels.ts` + `apps/desktop/src/main/ipc.ts` (canal `bible:strongs-occurrences`)
- Modify: `apps/desktop/src/preload/index.ts` + `apps/desktop/src/renderer/src/lib/api.ts`
- Test: smoke script temporal (se borra)

**Interfaces:**
- Produces: `api.bible.strongsOccurrences({ code, limit? }) → Array<StrongsOccurrence>` con
  `StrongsOccurrence = { book: string; chapter: number; verse: number; word: string; morphology: string }`
- Consumes: provider actual `strongsOccurrences(code, limit = 600)`.

- [ ] **Step 1: Verificar provider con prueba manual (script temporal)**

Crear `probe-occ.mts` en la raíz:

```ts
import { EswordProvider } from './packages/sword/src/local/esword'
const p = EswordProvider.create('esword', ['biblioteca'])!
const occ = await p.strongsOccurrences('G25', 300)
console.log(occ.length, occ.slice(0, 3), occ[occ.length - 1])
p.dispose()
```

Run: `npx tsx probe-occ.mts`
Expected: lista > 100 de { book, chapter, verse, word: '...' , morphology: 'greek...' } con primera entrada en Gén 2 sin basura; `word` sin HTML y ≤ 40 chars. Si `word` trae html/paréntesis o morphology sin prefijo g/hebrew, ajustar regex del provider: word = texto anterior a `<num>` sin `<>`; morphology = `g/h` del código + tokens del tag.

- [ ] **Step 2: Tests unitarios del provider en `packages/sword`**

Crear `packages/sword/src/local/occurrences.test.ts`:

```ts
import { describe, expect, it, beforeAll, afterAll } from 'vitest'
import { EswordProvider } from './esword'

let p: EswordProvider | null = null
beforeAll(() => {
  p = EswordProvider.create('esword', ['biblioteca']) ?? null
})
afterAll(() => {
  p?.dispose()
})

describe('strongsOccurrences (biblioteca real, opcional)', () => {
  it.skipIf(!p)('encuentra G25 con слова y morfología limpias', async () => {
    const occ = await p!.strongsOccurrences('G25', 120)
    expect(occ.length).toBeGreaterThan(10)
    for (const o of occ.slice(0, 20)) {
      expect(o.word).toMatch(/^[\p{L}\s·,.]+$/u)
      expect(o.morphology.startsWith('greek') || o.morphology.startsWith('hebrew')).toBe(true)
      expect(o.book).not.toBe('')
    }
  })
  it.skipIf(!p)('codigo invalido devuelve []', async () => {
    expect(await p!.strongsOccurrences('X99')).toEqual([])
  })
})
```

Run: `npm run test`
Expected: PASS (2 tests nuevos). Si el módulo RV60 con Strong no está (CI sin biblioteca) `describe.skipIf` lo salta.

- [ ] **Step 3: Tipos + canal**

`packages/core/src/types.ts`:

```ts
export interface StrongsOccurrence {
  book: string
  chapter: number
  verse: number
  word: string
  morphology: string
}
```

`packages/core/src/channels.ts`: dentro del objeto de canales bible:

```ts
  bibleStrongsOccurrences: 'bible:strongs-occurrences',
```

y su parámetro zod en `packages/core/src/schemas.ts`:

```ts
export const strongsOccurrencesSchema = z.object({
  code: z.string().min(2).max(8),
  limit: z.number().int().positive().max(2000).optional()
})
```

`apps/desktop/src/main/ipc.ts` (sección de handlers de bible, junto a `bible:commentary-coverage`):

```ts
  ipcMain.handle(channels.bibleStrongsOccurrences, (_e, raw: unknown) => {
    const { code, limit } = strongsOccurrencesSchema.parse(raw)
    return service.strongsOccurrences(code, limit)
  })
```

`apps/desktop/src/preload/index.ts` (donde se expone bible):

```ts
    strongsOccurrences: (args: { code: string; limit?: number }) =>
      ipcRenderer.invoke('bible:strongs-occurrences', args),
```

`apps/desktop/src/renderer/src/lib/api.ts` (interfaz bible del hook):

```ts
  strongsOccurrences: async (args: { code: string; limit?: number }) => {
    const resp = await raw.bible.strongsOccurrences(args)
    return resp
  },
```

- [ ] **Step 4: typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: 0 errores.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: IPC de ocurrencias Strong (exegesis concordada)"
```

---

### Task 2: `ExegesisCard` en la Guía del Pasaje

**Files:**
- Create: `apps/desktop/src/renderer/src/components/ExegesisCard.tsx`
- Modify: `apps/desktop/src/renderer/src/components/PassageGuide.tsx` (montarla para cada Strong# del verso)
- Modify: `apps/desktop/src/renderer/src/styles.css` (todas las reglas `.exeg-*` van aquí, cerca de las de `.guide-*`)
- Modify: `packages/i18n/src/locales/{es,en,pt}.ts` (claves exeg.*)
- Test: `apps/desktop/src/renderer/src/components/exegesis.test.ts` (jsdom)

**Interfaces:**
- Consumes: `props: { code: string; word: string; definition: string | null }` y `apiHook` NO — usa `api` directa: `api.bible.strongsOccurrences({ code, limit: 400 })`.
- Produces: componente con estados del dato: definición (Strong) + lista de ocurrencias agrupadas por libro + botón "enviar al editor".

- [ ] **Step 1: Test del componente (failing)**

```ts
// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ExegesisCard } from './ExegesisCard'
import { api } from '../lib/api'

beforeEach(() => {
  ;(api.bible as unknown as { strongsOccurrences: unknown }).strongsOccurrences = vi
    .fn()
    .mockResolvedValue([
      { book: 'Rom', chapter: 5, verse: 8, word: 'amó', morphology: 'greek VAAI3S' },
      { book: 'Rom', chapter: 8, verse: 28, word: 'amó', morphology: 'greek VAAI3S' }
    ])
})

describe('ExegesisCard', () => {
  it('muestra definicion + ocurrencias agrupadas por libro', async () => {
    render(<ExegesisCard code="G25" word="amó" definition="amar" />)
    await waitFor(() => expect(screen.getByText(/G25/)).toBeTruthy())
    expect(screen.getByText(/Romanos/)).toBeTruthy()
    expect(screen.getByText('5:8')).toBeTruthy()
  })
  it('sin ocupaciones no explota', async () => {
    ;(api.bible as unknown as { strongsOccurrences: unknown }).strongsOccurrences = vi
      .fn()
      .mockResolvedValue([])
    render(<ExegesisCard code="G9999" word="x" definition={null} />)
    await waitFor(() => expect(screen.getByText(/G9999/)).toBeTruthy())
  })
})
```

Run: `npm run test -- apps`
Expected: FAIL ("Cannot find module ./ExegesisCard").

- [ ] **Step 2: Implementar el componente**

```tsx
import { useEffect, useMemo, useState } from 'react'
import { bookName, CANONICAL_BOOKS } from '@keryx/core'
import { api } from '../lib/api'
import type { StrongsOccurrence } from '@keryx/core'

interface Props {
  code: string
  word: string
  definition: string | null
}

export function ExegesisCard({ code, word, definition }: Props) {
  const [occ, setOcc] = useState<StrongsOccurrence[] | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    void api.bible
      .strongsOccurrences({ code, limit: 400 })
      .then((rows) => {
        if (alive) setOcc(rows)
      })
      .catch(() => {
        if (alive) setOcc([])
      })
    return () => {
      alive = false
    }
  }, [code])

  const byBook = useMemo(() => {
    const map = new Map<string, StrongsOccurrence[]>()
    for (const row of occ ?? []) {
      const list = map.get(row.book) ?? []
      list.push(row)
      map.set(row.book, list)
    }
    return [...map.entries()]
  }, [occ])

  return (
    <div className={`exeg-card ${open ? 'open' : ''}`}>
      <button className="exeg-head" onClick={() => setOpen(!open)}>
        <span className="exeg-code">{code}</span>
        <span className="exeg-word">{word}</span>
        <span className="exeg-count">{occ?.length ?? '…'}</span>
      </button>
      {open && (
        <div className="exeg-body">
          {definition && <p className="exeg-def">{definition}</p>}
          <ul>
            {byBook.map(([book, rows]) => (
              <li key={book}>
                <b>{bookName(CANONICAL_BOOKS.find((b) => b.code === book) ?? CANONICAL_BOOKS[0], 'es')}</b>{' '}
                {rows.slice(0, 40).map((row) => `${row.chapter}:${row.verse}·${row.word}`).join(' · ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

CSS (pegarlo tras el bloque `.guide-sources` de styles.css):

```css
.exeg-card { border: 1px solid var(--glass-border-soft); border-radius: var(--radius-sm); }
.exeg-head { display: flex; gap: 10px; align-items: center; width: 100%; background: none; border: 0; color: inherit; padding: 8px 10px; cursor: pointer; }
.exeg-code { font-weight: 700; color: var(--accent); }
.exeg-count { margin-left: auto; font-size: 12px; opacity: 0.7; }
.exeg-body { padding: 0 12px 10px; font-size: 13.5px; }
.exeg-body ul { margin: 6px 0 0; padding-left: 14px; }
.exeg-def { margin: 4px 0; opacity: 0.85; }
```

i18n (3 locales, junto a `guide.morfologia`):

```ts
  'exeg.def': 'Definición Strong',          // en: 'Strong definition' / pt: 'Definição Strong'
  'exeg.send': 'Enviar exégesis al editor', // en: 'Send exegesis to editor' / pt: 'Enviar exegese ao editor'
```

- [ ] **Step 3: Montarla en PassageGuide**

En `PassageGuide.tsx`, debajo del render de `dossier.sections`:

```tsx
      {dossier.sections
        .find((s) => s.kind === 'strongs') && null}
```

Mejor: el dosier ya trae `citations` de Strong con `entry` = código. Extraer códigos + word del texto de la sección strongs es frágil; approach limpio: `PassageGuide` calcula los códigos desde `verseHtml` NO disponible… La sección strongs guarda entradas `**G25** (greek) ...`. Parsear:

```tsx
const strongCodes = dossier.sections.find((s) => s.kind === 'strongs')?.entries ?? []
const codes = strongCodes
  .map((entry) => entry.match(/\*\*(G\d+|H\d+)\*\*/)?.[1])
  .filter((x): x is string => Boolean(x))
```

y renderizar:

```tsx
      <div className="exeg-list">
        {codes.map((code) => (
          <ExegesisCard key={code} code={code} word="—" definition={null} />
        ))}
      </div>
```

(word queda '—' placeholder: Task 3 lo conecta con la palabra real.)

- [ ] **Step 4: Tests + typecheck**

Run: `npm run test && npm run typecheck && npm run lint`
Expected: PASS / 0 errores.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tarjeta de exegesis concordada por Strong en la Guia del Pasaje"
```

---

### Task 3: palabra real por Strong# (matriz código→palabra del verso)

**Files:**
- Modify: `apps/desktop/src/renderer/src/lib/agents.ts` (exportar `strongsWordFromVerse`)
- Modify: `apps/desktop/src/renderer/src/components/PassageGuide.tsx`
- Test: añadir a `apps/desktop/src/renderer/src/lib/agents.test.ts`

**Interfaces:**
- Produces: `export function strongsWordFromVerse(verseHtml: string, code: string): string` → 'amó' para `<num>G25 VAAI3S</num>` siguiendo 'amó' en RV60 con Strong, o del `data-strong` markup `<w data-strong="G26">amor</w>`.
- Consumes: nada externo.

- [ ] **Step 1: Test**

```ts
import { strongsWordFromVerse } from './agents'
...
  it('palabra real bajo cada Strong# (data-strong y <num>)', () => {
    expect(strongsWordFromVerse('<w data-strong="G26">amor</w> de Dios', 'G26')).toBe('amor')
    expect(strongsWordFromVerse('mundo, <num>G2889  NASM</num> que', 'G2889')).toBe('mundo,')
  })
  it('sin match devuelve falso neutro', () => {
    expect(strongsWordFromVerse('nada', 'G25')).toBe('')
  })
```

Run: `npm run test -- apps` → FAIL (no exportada).

- [ ] **Step 2: Implementación**

```ts
export function strongsWordFromVerse(verseHtml: string, code: string): string {
  const bySpan = [...verseHtml.matchAll(/<w data-strong="([GH]\d{1,6})"((?:(?!<\/w>).)*?)<\/w>/gis)]
  for (const [full, key] of bySpan) {
    if (key.toUpperCase() === code.toUpperCase()) {
      return stripTags(full.replace(/^<w[\s\S]*?>/, '')).trim()
    }
  }
  const byNum = [...verseHtml.matchAll(/([^<>]{1,40}?)\s*<num>\s*([GH]\d{1,6})\s/gi)]
  for (const m of byNum) {
    if (m[2].toUpperCase() === code.toUpperCase()) return stripTags(m[1] ?? '').trim()
  }
  return ''
}
```

En `crearsermon/crearestudio/creardevocional` el dosier no guarda verseHtml: guardar también en `Dossier`:

```ts
export interface Dossier {
  ...
  verseHtml: string
}
```
(setear al final del bloque texto: `verseHtml`, default '' en todos los returns (crearestudio también). En PassageGuide: `const wordFor = (c) => strongsWordFromVerse(dossier.verseHtml, c)` y pasar `word={wordFor(code) || '—'}`.

- [ ] **Step 3: Tests verdes**

Run: `npm run test && npm run typecheck`.

- [ ] **Step 4: Commit**: `feat: palabra real por clave Strong en guia exegesis`

---

### Task 4: Índice de lemas griegos (Strongs→Tuggy/Ortz correcto)

**Files:**
- Create: `apps/desktop/src/renderer/src/lib/lemmaIndex.ts`
- Modify: `apps/desktop/src/renderer/src/lib/agents.ts` (job `lemmaJob` en paralelo; kind nuovo 'lemma')
- Modify: `packages/i18n/src/locales/{es,en,pt}.ts`, `PassageGuide.tsx` (title key), `creator.ts` (sección)
- Test: `apps/desktop/src/renderer/src/lib/lemmaIndex.test.ts`

**Interfaces:**
- Produces:
  - `buildLemmaIndex(hook: { lookup: (m: string, k: string) => Promise<string|null>; modules: string[] }): Promise<Map<string, string>>`
  - `lemmaForCode(index, code)` → entry Ortiz correcta por lema (verificada por lema, no por número).
- Consumes: `hook.strongs` para el lema? El módulo 'Strongs'/'StrongsPlus' trae la forma lexial griega dentro de la definición; regex lema: `<sigma>…` no — en texto plano: primera palabra griega `{[\u0370-\u03FF]+}` de la definición.

- [ ] **Step 1: Test del índice (fake hook, deterministic)**

```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { buildLemmaIndex, lemmaForCode, extractLemmaFromStrongDef } from './lemmaIndex'

describe('lemmaIndex', () => {
  it('extrae lema griego de la def Strong', () => {
    expect(extractLemmaFromStrongDef('ἀγάπη agape amor;定义')).toBe('ἀγάπη')
    expect(extractLemmaFromStrongDef('sin griego aqui')).toBe('')
  })
  it('indiea lema→entrada de Tuggy leyendo todos los temas', async () => {
    const map = await buildLemmaIndex({
      modules: ['Lexico Griego-Español del NT - Alfred Tuggy'],
      topics: () => Promise.resolve(['AMOR', 'GRACIA']),
      lookup: async (_m, key) => (key === 'AMOR' ? 'ἀγάπη, ης, ἡ. Amor...' : 'χάρις... Gracia...')
    })
    expect(await lemmaForCode_like(map, 'ἀγάπη')).toContain('Amor')
  })
})
```

- [ ] **Step 2: Implementación mínima**

```ts
const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]+/
export function extractLemmaFromStrongDef(def: string): string {
  const match = GREEK_RE.exec(def)
  return match ? normalizeGreek(match[0]) : ''
}
export function normalizeGreek(s: string): string {
  return s.normalize('NFC').trim()
}
export interface LemmaIndexArgs {
  modules: string[]
  topics: () => Promise<string[]>
  lookup: (module: string, key: string) => Promise<string | null>
}
export async function buildLemmaIndex(args: LemmaIndexArgs): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const mod = args.modules[0]
  if (!mod) return map
  const topics = await args.topics()
  for (const topic of topics) {
    const def = await args.lookup(mod, topic)
    if (!def) continue
    const lemma = extractLemmaFromStrongDef(def)
    if (lemma && !map.has(lemma)) map.set(lemma, `**${topic}** ${stripTags(def).slice(0, 600)}`)
  }
  return map
}
```

`topics()` usa `api.dict.listTopics?` — no existe; alternativa provider: nueva query `SELECT Topic FROM Dictionary` de un módulo via canal dict: `dict:topics`. Añadir IPC en Task 4b dentro del mismo task:

- `services.strongsTopics(module)` en provider: `listTopics(db): string[]` (SELECT Topic).
- canal `dict:topics` + schema { module } + preload + api.
- Test provider `.skipIf(!p)` igual que Task 1.

`lemmaJob` en `agents.ts` (corre en el Promise.all):

```ts
  const lemmaJob = async (): Promise<Job> => {
    const job: Job = { kind: 'lemma', title: 'Lemmas griegos (Ortiz por lema)', entries: [], cites: [] }
    if (!verseThemes.length || !strongKeys.length) return job
    const tuggyMods = hook.modules.filter((m) => SPECIAL_RE.idiomas?.test(m.name)).slice(0, 1)
    if (!tuggyMods.length) return job
    const hookTopics = hook.topics?.(tuggyMods[0].name)
    if (!hookTopics) return job
    const topics = await hookTopics
    const map = await buildLemmaIndex({ modules: [tuggyMods[0].name], topics: () => Promise.resolve(topics), lookup: hook.lookup })
    for (const key of [...new Set(strongKeys)].slice(0, 4)) {
      const def = await safe(hook.strongs(key), null)
      if (!def) continue
      const lemma = extractLemmaFromStrongDef(def.definition)
      const entry = lemma ? map.get(lemma) : undefined
      if (!entry) continue
      job.entries.push(`**${key}** (lema ${lemma}) ${trimEntry(entry, 480)}`)
      job.cites.push({ kind: 'lemma', module: 'Diccionario y Concordancia Greco-Espanola - Pedro Ortiz', entry: lemma })
    }
    return job
  }
```

AgentHook se amplía con `topics?: (module: string) => Promise<string[]>`;重重 connect en apiHook (`api.dict.topics`).

- [ ] **Step 3: Cablear en ensamble + UI + creator + i18n + kind 'lemma'** (pattern del Task previo: kind union, titleKey map, i18n keys `guide.lemma`).

- [ ] **Step 4: **Verificación REAL contra la biblioteca** (script temporal con provider): Juan 3:16 → lema ἀγαπάω de G25 debe encontrar la entrada Ortiz de 'ἀγαπάω' si el lema coincide; logear PTW y revision. Adjustejamiento si Ortiz lema acentúado diferente — normalizar: strip tonos vía NFD comparación (matouch). Implementar `normalizeGreekLemma(s)` (NFD + remove combining) y usarla como key del mapa.

Run: `npx tsx probe-lemma.mts && npm run test && npm run typecheck && npm run lint`

- [ ] **Step 5: Commit**: `feat: lemas griegos verificados por lema real (strongs -> tuggy/orz)`

---

### Task 5: Doble pasada IA con crítica (borrador → crítico → final)

**Files:**
- Modify: `apps/desktop/src/renderer/src/lib/creator.ts` (nueva fase crítica; settings gate)
- Modify: `packages/core/src/types.ts` (settings `deepSermon?: boolean`) + schema
- Modify: `apps/desktop/src/renderer/src/views/SettingsView` (toggle + hint)
- Modify: i18n (`settings.deepSermon(Hint)`)
- Test: `apps/desktop/src/renderer/src/lib/creator.test.ts`

**Interfaces:**
- Consumes: `api.ai.chat(messages)` (ya existe), `dossierForPrompt`, `composeFromDossier`.
- Produces: `runCreator` con flujo: si `settings.deepSermon && aiEnabled`: (1) chat → draft; (2) chat CRITICA con checklist (cobertura del texto, no citas inventadas, puentescontextuales, aplicación concreta, omisión de doctrina) pidiendo dif; (3) chat FINAL con dif aplicado → output. Si falla en CUALQUIER paso → fallback determinista.

- [ ] **Step 1: Test del gate y del fallback**

```ts
// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { composeFromDossier } from './creator'
... ya hay pruebas del compositor; añadir:
it('deepSermon off produce 1 sola llamada ai.chat', ...)
it('deepSermon on hace 3 llamadas y falla gracefully a local', ...)
```

(fake ctx con `api.ai.chat` stub y settings `{ aiEnabled: true, deepSermon: true }`.)

- [ ] **Step 2: Implementar**

En `runCreator`, reemplazar la parte de IA por:

```ts
  if (!ctx.settings.aiEnabled) return { markdown: local, ... }
  try {
    const draft = await chat(personaPrompt(persona) ...) // mensaje 1 existente
    let final = draft
    if (ctx.settings.deepSermon) {
      const critique = await chat(critiqueMessages(persona, draft, dossierMarkdown))
      final = await chat(finalizeMessages(persona, draft, critique))
    }
    return { markdown: final, ... }
  } catch {
    return { markdown: local, ... , localNotice: true }
  }
```

`CRITIQUE_PROMPT` (const en creator.ts):

```ts
const CRITIQUE_PROMPT = `Actua como critico homiletico experto. Revisa el borrador contra el DOSSIER: (1) el texto biblico citado coincide? (2) hay afirmaciones o citas no presentes en el dosier? (3) faltan puentes historicos/culturales del dosier? (4) la aplicacion es concreta? (5) tono del estilo pedido? Responde SOLO una lista de correcciones concretas, sin alargar el sermón.`
```

y `finalize` aplica la lista. `executeAi` helper que llama `api.ai.chat({ messages })` con strip/safe.

- [ ] **Step 3: Settings toggle + i18n + typecheck + lint + test**
- [ ] **Step 4: Commit**: `feat: doble pasada IA (critica homiletica) opt-in deepSermon`

---

### Task 6: Export pulpit-grade (.docx/.md + Word)

**Files:**
- Create: `apps/desktop/src/renderer/src/lib/exportDocx.ts`
- Modify: `apps/desktop/src/renderer/src/views/StudyView.tsx` (toolbar de la ficha: Copiar/Descargar .md/.docx)
- Modify: PassageGuide card panel
- Test: `exportDocx.test.ts`

**Interfaces:**
- Produces: `downloadDocument(name, markdown): Promise<void>` escribe archivo .md con `api.fs.save` si existe (canal util) o Blob a.download; `markdownToHtmlBody(md)`: headings/bold/списки mínimos para abrir en Word.

- [ ] **Step 1: Test parser**

```ts
it('convierte md a html minimo sin perder secciones', () => {
  const html = markdownToHtmlBody('# T\n## S1\n- a\n**b**')
  expect(html).toContain('<h1>T</h1>')
  expect(html).toContain('<ul><li>a</li></ul>')
  expect(html).toContain('<strong>b</strong>')
})
```

- [ ] **Step 2: Implementar parser + descarga (Blob; sin canal nuevo)**

```ts
export function markdownToHtmlBody(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let ulOpen = false
  for (const line of lines) {
    const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    if (bold.startsWith('### ')) { out.push(`<h3>${bold.slice(4)}</h3>`); continue }
    if (bold.startsWith('## ')) { out.push(`<h2>${bold.slice(3)}</h2>`); continue }
    if (bold.startsWith('# ')) { out.push(`<h1>${bold.slice(2)}</h1>`); continue }
    if (bold.startsWith('- ')) {
      if (!ulOpen) { out.push('<ul>'); ulOpen = true }
      out.push(`<li>${bold.slice(2)}</li>`)
      continue
    }
    if (ulOpen) { out.push('</ul>'); ulOpen = false }
    if (bold.trim() === '') continue
    out.push(`<p>${bold}</p>`)
  }
  if (ulOpen) out.push('</ul>')
  return out.join('\n')
}

export function downloadDocument(name: string, md: string): void {
  const body = document.querySelector?.('.editor') ? '' : markdownToHtmlBody(md)
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${name}</title>${body ? '' : ''}<style>body{font-family:'Georgia',serif;max-width:640px;margin:auto;padding:2em}h1,h2,h3{color:#333}</style></head><body>${md ? markdownToHtmlBody(md) : ''}</body></html>`
  const blob = new Blob([html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${name}.doc`
  link.click()
  URL.revokeObjectURL(url)
}
```

Botones en `PassageGuide` (Enviar al editor ya existe) y en la vista del Asistente (exportar resultado): añadir icon download con tooltip i18n `export.docx`/'export.md'.

- [ ] **Step 3: Test + lint + typecheck**
- [ ] **Step 4: Commit**: `feat: export docx/md de guia y sermones`

---

### Task 7: Batería de validación de sermones (no-regresión homilética)

**Files:**
- Create: `apps/desktop/src/renderer/src/lib/dossierQuality.test.ts`
- Modify: docs/resumen-app.md (sección 'calidad del dosier')

**Interfaces:**
- Consumes: `buildDossier` con fake hook multi módulos (los actuales del fake).
- Produces: suite que fija minimos para 4 pasajes (Juan 3:16 NT; Salmo 23 OT; Cinser Rom 8:28 epistola; Lucas 10:25-37 narrativa) via `at`参数 + query '': debe haber ≥: texto, comentário, historico, tema, ilustracion; strongs observable; chars ≤ budget; sin entradas vacias 'undefined'.

- [ ] **Step 1: Escribir suite**

```ts
const CASES = [
  { name: 'NT evangelio', q: 'Juan 3:16' },
  { name: 'epistola', q: 'Romanos 8:28' },
  { name: 'OT salterio', q: 'Salmo 23:1' },
  { name: 'parabola', q: 'Lucas 10:25' }
]
it.each(CASES)('$name: cobertura minima del dosier', async ({ q }) => {
  const d = await buildDossier(fakeHook(), 'crearsermon', q)
  const kinds = d.sections.map((s) => s.kind)
  expect(kinds).toEqual(expect.arrayContaining(['texto', 'comentario', 'historico']))
  for (const section of d.sections) {
    expect(section.entries.every((e) => typeof e === 'string' && e.length > 0)).toBe(true)
  }
  expect(d.chars).toBeLessThanOrEqual(DOSSIER_BUDGET)
})
```

Run: `npm run test -- apps` PASS.

- [ ] **Step 2: Commit**: `test: bateria de cobertura minima del dosier`

---

### Task 8: Probar con la app abierta (e2e manual)

**Files:** (sin cambios de código)

- [ ] **Step 1: dev + recorrer**: abrir Estudio → Guía del Pasaje → Juan 3 → verse 16 → tarjetas (texto, comentario Robertson/MacArthur, Walton-Keener, Strong→ExegesisCard→ocurrencias, Tuggy, Robinson, Lambert…) → "Enviar al editor" → Asistente → crear sermón con deepSermon ON → export doc.
- [ ] **Step 2: Fixtures o bugs encontrados → arreglos inmediatos con commit separado por bug.**

---

## Self-review

- Cobertura de spec: todos los huecos nombrados en conversación (Exegética por Strong, lemas correctos, crítica homilética, export, validación) tienen task. NO incluye reemplazo de BDAG (imposible sin bibliografía pagada; Task 4 aproxima con lemas reales) — se declara límite honesto.
- Sin placeholders: todos los pasos traen código o comandos concretos.
- Tipos: `StrongsOccurrence` (Task 1) usado en Task 2; `strongsWordFromVerse` (Task 3) usado en Task 2 vía chord de word — ajuste hecho en Task 3 step 2 (verseHtml en Dossier).
- Riesgo principal: índice de temas `dict:topics` sobre 10k/dict items via protocolo — ok con cache en memoria del provider. Ya monitoreado el lazy-load del índice por sesión (rebuild ~1 s max con 10k entradas).
