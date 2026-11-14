# Licencias Hotmart — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Login email+contraseña en Keryx con licencia JWT Ed25519 emitida por un backend Cloudflare Workers, suscripciones registradas por webhook de Hotmart, trial 7 días y máx 3 dispositivos.

**Architecture:** Backend `_backend/` (Cloudflare Workers, Supabase vía REST con `service_role`) expone `/webhooks/hotmart`, `/auth/login`, `/license/activar|refrescar|desactivar`. La app (`packages/licencia` en el proceso main) valida el JWT offline con la clave pública embebida y guarda el token cifrado con `safeStorage` en `licencia.dat` dentro de userData. El renderer muestra LoginView/BloqueoView como gate del arranque; nada se borra jamás.

**Tech Stack:** TypeScript, Zod, jose (JWT EdDSA), bcryptjs, Vitest, Cloudflare Workers (sin framework), Supabase REST, Electron 37 (`safeStorage`, `node:crypto`), React 19 + Zustand + i18n propio.

**Spec:** `docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md`

## Global Constraints

- Zod valida TODOS los canales IPC nuevos (`packages/core`).
- Español como idioma fuente de i18n; `en` y `pt` obligatorias junto a `es` (el repo también trae `it/fr/de/zh` — se agregan todas).
- Sin comentarios en el código salvo que se pidan.
- Commits estilo repo: `feat:` / `fix:` / `docs:` / `chore:` en español.
- Los datos locales del usuario NUNCA se borran por bloqueo de licencia.
- `npm run eval` (9/9) y `npm run eval:trad` (0 fallos) intactos antes del commit de cierre.
- Respuestas backend con forma `Rta`: `{ ok: true, data }` | `{ ok: false, error, codigo? }`.
- Secretos (HOTTOK, SUPABASE_SERVICE_ROLE_KEY, LICENCIA_PRIVADA) SOLO en secrets del Worker; jamás en el repo ni en el chat.
- Eventos Hotmart reales: `PURCHASE_APPROVED`, `PURCHASE_COMPLETE`, `SUBSCRIPTION_RENEWAL` → activa; `SUBSCRIPTION_CANCELLATION`, `PURCHASE_CANCELED` → cancelada; `SUBSCRIPTION_EXPIRATION`, `PURCHASE_REFUNDED` → inactiva.

---

### Task 1: Workspace `_backend` + infraestructura de tests

**Files:**
- Modify: `package.json` (raíz: workspaces + devDeps)
- Modify: `vitest.config.ts` (include)
- Create: `_backend/package.json`
- Create: `_backend/tsconfig.json`
- Create: `_backend/src/tipos.ts`
- Create: `_backend/src/supabase-falso.ts` (fake REST para tests)
- Test: `_backend/src/supabase-falso.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces: `Env`, `Rta<T>`, `Suscripcion`, `Usuario`, `Dispositivo`, `rtaOk`, `rtaError` (tipos); `supabaseFalso()` que intercepta fetch de REST de Supabase. Tasks 2-6 dependen de estos nombres exactos.

- [ ] **Step 1: Añadir workspace y deps**

`package.json` raíz — `workspaces: ["apps/*", "packages/*", "_backend"]`; devDependencies añade `"jose": "^6.0.0"`, `"bcryptjs": "^3.0.2"`, `"@cloudflare/workers-types": "^4.20251014.0"`. Luego correr `npm install`.

Run: `npm install`
Expected: instala sin errores.

- [ ] **Step 2: `_backend/package.json`**

```json
{
  "name": "@keryx/backend",
  "private": true,
  "type": "module",
  "dependencies": {
    "jose": "^6.0.0",
    "bcryptjs": "^3.0.2"
  }
}
```

- [ ] **Step 3: `_backend/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["@cloudflare/workers-types", "node"],
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: `_backend/src/tipos.ts`**

```ts
export type EstadoSuscripcion = 'activa' | 'cancelada' | 'inactiva' | 'trial'

export interface Suscripcion {
  email: string
  estado: EstadoSuscripcion
  expira_at: string | null
  trial_hasta: string | null
  hotmart_comprador_id: string | null
  actualizado_at: string
}

export interface Usuario {
  email: string
  password_hash: string
  creado_at: string
}

export interface Dispositivo {
  email: string
  huella: string
  activado_at: string
}

export interface Env {
  HOTTOK: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  LICENCIA_PRIVADA: string
  LICENCIA_PUBLICA: string
}

export type Rta<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string; codigo?: string }

export function rtaOk<T>(data: T): Response {
  return Response.json({ ok: true, data })
}

export function rtaError(error: string, codigo?: string, status = 400): Response {
  return Response.json({ ok: false, error, codigo }, { status })
}
```

- [ ] **Step 5: Fake REST de Supabase — `_backend/src/supabase-falso.ts`**

Semántica mínima usada por las rutas: SELECT con `?tabla?email=eq.X&select=*`; upsert con `Prefer: resolution=merge-duplicates` (merge por `email`); INSERT sin Prefer; DELETE con `?email=eq.X&huella=eq.Y`.

```ts
import type { Dispositivo, Suscripcion, Usuario } from './tipos'

export interface BaseFalsa {
  suscripciones: Suscripcion[]
  usuarios: Usuario[]
  dispositivos: Dispositivo[]
}

export interface FetchFalso {
  (url: string, init?: RequestInit): Promise<Response>
}

export function supabaseFalso(
  base: BaseFalsa = { suscripciones: [], usuarios: [], dispositivos: [] }
): { base: BaseFalsa; fetch: FetchFalso } {
  const fetchFalso: FetchFalso = async (url, init) => {
    const u = new URL(url)
    const tabla = u.pathname.split('/rest/v1/')[1]?.split('?')[0] ?? ''
    const params = u.searchParams
    const prefer =
      init?.headers instanceof Headers
        ? init.headers.get('Prefer') ?? ''
        : String((init?.headers as Record<string, string> | undefined)?.Prefer ?? '')
    const cuerpo = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : null

    if (init?.method === 'POST' && prefer.includes('resolution=merge-duplicates')) {
      const filas = Array.isArray(cuerpo) ? cuerpo : [cuerpo]
      for (const fila of filas) {
        const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla]
        const idx = lista.findIndex((x) => x['email'] === fila['email'])
        if (idx >= 0) lista[idx] = { ...lista[idx], ...fila }
        else lista.push(fila)
      }
      return new Response('[]', { status: 201 })
    }

    if (init?.method === 'POST') {
      const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla]
      lista.push(cuerpo as Record<string, unknown>)
      return new Response('[]', { status: 201 })
    }

    if (init?.method === 'DELETE') {
      const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla]
      const email = params.get('email')
      const huella = params.get('huella')
      const restantes = lista.filter(
        (x) => x['email'] !== email || (huella !== null && x['huella'] !== huella)
      )
      ;(base as unknown as Record<string, Record<string, unknown>[]>)[tabla] = restantes
      return new Response('[]', { status: 204 })
    }

    const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla] ?? []
    let filtrada = lista
    for (const [clave, valor] of params.entries()) {
      if (clave === 'select') continue
      if (valor.startsWith('eq.')) filtrada = filtrada.filter((x) => x[clave] === valor.slice(3))
    }
    return Response.json(filtrada)
  }
  return { base, fetch: fetchFalso }
}
```

- [ ] **Step 6: Test del fake — `_backend/src/supabase-falso.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'

describe('supabaseFalso', () => {
  it('inserta y filtra por email eq', async () => {
    const falso = supabaseFalso()
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.c', estado: 'trial', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: 'hoy' })
    })
    const r = await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones?email=eq.a%40b.c&select=*')
    const filas = (await r.json()) as Array<{ email: string }>
    expect(filas).toHaveLength(1)
    expect(filas[0].email).toBe('a@b.c')
  })

  it('merge-duplicates actualiza la fila existente', async () => {
    const falso = supabaseFalso()
    const fila = { email: 'a@b.c', estado: 'trial', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: 'hoy' }
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', { method: 'POST', body: JSON.stringify(fila) })
    await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ email: 'a@b.c', estado: 'activa', expira_at: '2026-12-14', trial_hasta: null, hotmart_comprador_id: '111', actualizado_at: 'hoy2' })
    })
    const r = await falso.fetch('https://sb.supabase.co/rest/v1/suscripciones?email=eq.a%40b.c&select=*')
    const filas = (await r.json()) as Array<{ estado: string }>
    expect(filas).toHaveLength(1)
    expect(filas[0].estado).toBe('activa')
  })

  it('DELETE respeta huella', async () => {
    const falso = supabaseFalso()
    const base = falso.base as unknown as { dispositivos: Array<{ email: string; huella: string }> }
    base.dispositivos.push({ email: 'a@b.c', huella: 'h1' }, { email: 'a@b.c', huella: 'h2' })
    await falso.fetch('https://sb.supabase.co/rest/v1/dispositivos?email=eq.a%40b.c&huella=eq.h1', { method: 'DELETE' })
    expect(base.dispositivos).toHaveLength(1)
    expect(base.dispositivos[0].huella).toBe('h2')
  })
})
```

- [ ] **Step 7: `vitest.config.ts` — añadir `'_backend/**/*.test.ts'` al include**

```ts
include: ['packages/**/*.test.ts', 'apps/**/*.test.ts', 'scripts/**/*.test.ts', '_backend/**/*.test.ts']
```

- [ ] **Step 8: Correr tests**

Run: `npx vitest run _backend`
Expected: PASS (3 tests del fake).

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts _backend
git commit -m "feat: workspace _backend (Workers) con tipos, Rta y fake REST de Supabase para tests"
```

---

### Task 2: Acceso REST a Supabase (`_backend/src/db.ts`)

**Files:**
- Create: `_backend/src/db.ts`
- Test: `_backend/src/db.test.ts`

**Interfaces:**
- Consumes: `Env`, `Suscripcion`, `Usuario`, `Dispositivo` (Task 1); `FetchFalso` del fake.
- Produces (usados por Tasks 3-6; TODOS con `fetchFn: FetchFn = fetch` como último parámetro):
  - `suscripcionDe(env, email, fetchFn): Promise<Suscripcion | null>`
  - `upsertSuscripcion(env, envio: Partial<Suscripcion> & { email: string }, fetchFn): Promise<void>`
  - `usuarioDe(env, email, fetchFn): Promise<Usuario | null>`
  - `crearUsuario(env, email, passwordHash, fetchFn): Promise<void>`
  - `dispositivosDe(env, email, fetchFn): Promise<Dispositivo[]>`
  - `agregarDispositivo(env, email, huella, fetchFn): Promise<void>`
  - `borrarDispositivo(env, email, huella, fetchFn): Promise<void>`

- [ ] **Step 1: Test — `_backend/src/db.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'
import { suscripcionDe, upsertSuscripcion, usuarioDe, crearUsuario, dispositivosDe, agregarDispositivo, borrarDispositivo } from './db'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

describe('db', () => {
  it('suscripcionDe devuelve null si no existe', async () => {
    const { fetch } = supabaseFalso()
    expect(await suscripcionDe(env, 'a@b.c', fetch)).toBeNull()
  })

  it('upsert crea y luego actualiza sin pisar lo demas', async () => {
    const { fetch } = supabaseFalso()
    await upsertSuscripcion(env, { email: 'a@b.c', estado: 'trial', trial_hasta: '2026-11-21T00:00:00Z' }, fetch)
    const s1 = await suscripcionDe(env, 'a@b.c', fetch)
    expect(s1?.estado).toBe('trial')
    await upsertSuscripcion(env, { email: 'a@b.c', estado: 'activa', expira_at: '2026-12-14T00:00:00Z' }, fetch)
    const s2 = await suscripcionDe(env, 'a@b.c', fetch)
    expect(s2?.estado).toBe('activa')
    expect(s2?.trial_hasta).toBe('2026-11-21T00:00:00Z')
  })

  it('usuarios y dispositivos', async () => {
    const { fetch } = supabaseFalso()
    await crearUsuario(env, 'a@b.c', 'hash', fetch)
    expect((await usuarioDe(env, 'a@b.c', fetch))?.password_hash).toBe('hash')
    await agregarDispositivo(env, 'a@b.c', 'huella1', fetch)
    await agregarDispositivo(env, 'a@b.c', 'huella2', fetch)
    expect(await dispositivosDe(env, 'a@b.c', fetch)).toHaveLength(2)
    await borrarDispositivo(env, 'a@b.c', 'huella1', fetch)
    expect((await dispositivosDe(env, 'a@b.c', fetch)).map((d) => d.huella)).toEqual(['huella2'])
  })

  it('usa la URL y cabeceras del env', async () => {
    let vista: { url: string; cabeceras: Record<string, string> } | null = null
    const fetchEspia = (async (url: string | URL | Request, init?: RequestInit) => {
      vista = { url: String(url), cabeceras: Object.fromEntries(new Headers(init?.headers).entries()) }
      return new Response('[]')
    }) as typeof fetch
    await suscripcionDe(env, 'x@y.z', fetchEspia)
    expect(vista?.url).toContain('https://sb.supabase.co/rest/v1/suscripciones')
    expect(vista?.cabeceras['apikey']).toBe('key')
    expect(vista?.cabeceras['Authorization']).toBe('Bearer key')
  })
})
```

- [ ] **Step 2: Correr — FAIL (el módulo db no existe)**

Run: `npx vitest run _backend/src/db.test.ts`
Expected: FAIL — no se puede resolver './db'.

- [ ] **Step 3: Implementación — `_backend/src/db.ts`**

```ts
import type { Dispositivo, Env, Suscripcion, Usuario } from './tipos'

type FetchFn = typeof fetch

async function sb(env: Env, path: string, init: RequestInit = {}, fetchFn: FetchFn = fetch): Promise<Response> {
  const cabeceras = new Headers(init.headers)
  cabeceras.set('apikey', env.SUPABASE_SERVICE_ROLE_KEY)
  cabeceras.set('Authorization', `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`)
  cabeceras.set('Content-Type', 'application/json')
  return fetchFn(`${env.SUPABASE_URL}${path}`, { ...init, headers: cabeceras })
}

async function primera<T>(r: Response): Promise<T | null> {
  const filas = (await r.json()) as T[]
  return filas[0] ?? null
}

export async function suscripcionDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Suscripcion | null> {
  const r = await sb(env, `/rest/v1/suscripciones?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return primera<Suscripcion>(r)
}

export async function upsertSuscripcion(env: Env, envio: Partial<Suscripcion> & { email: string }, fetchFn: FetchFn = fetch): Promise<void> {
  const fila = { actualizado_at: new Date().toISOString(), ...envio }
  await sb(env, '/rest/v1/suscripciones', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify(fila)
  }, fetchFn)
}

export async function usuarioDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Usuario | null> {
  const r = await sb(env, `/rest/v1/usuarios?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return primera<Usuario>(r)
}

export async function crearUsuario(env: Env, email: string, passwordHash: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, '/rest/v1/usuarios', {
    method: 'POST',
    body: JSON.stringify({ email, password_hash: passwordHash, creado_at: new Date().toISOString() })
  }, fetchFn)
}

export async function dispositivosDe(env: Env, email: string, fetchFn: FetchFn = fetch): Promise<Dispositivo[]> {
  const r = await sb(env, `/rest/v1/dispositivos?email=eq.${encodeURIComponent(email)}&select=*`, {}, fetchFn)
  return (await r.json()) as Dispositivo[]
}

export async function agregarDispositivo(env: Env, email: string, huella: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, '/rest/v1/dispositivos', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ email, huella, activado_at: new Date().toISOString() })
  }, fetchFn)
}

export async function borrarDispositivo(env: Env, email: string, huella: string, fetchFn: FetchFn = fetch): Promise<void> {
  await sb(env, `/rest/v1/dispositivos?email=eq.${encodeURIComponent(email)}&huella=eq.${encodeURIComponent(huella)}`, { method: 'DELETE' }, fetchFn)
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run _backend/src/db.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add _backend/src/db.ts _backend/src/db.test.ts
git commit -m "feat: acceso REST a Supabase en _backend (suscripciones, usuarios, dispositivos)"
```

---

### Task 3: Webhook Hotmart (`_backend/src/webhook.ts`)

**Files:**
- Create: `_backend/src/webhook.ts`
- Test: `_backend/src/webhook.test.ts`
- Modify: `docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md` (SQL: añadir tabla `usuarios`)

**Interfaces:**
- Consumes: `suscripcionDe`, `upsertSuscripcion` (Task 2); `rtaOk`, `rtaError`, `Env` (Task 1).
- Produces: `manejarWebhook(env, req, fetchFn): Promise<Response>` (la usa Task 6) y `MAPEO_EVENTOS: Record<string, 'activa' | 'cancelada' | 'inactiva'>` exportados.

- [ ] **Step 1: Test — `_backend/src/webhook.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { supabaseFalso } from './supabase-falso'
import { manejarWebhook } from './webhook'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

function pedido(evento: string, extra: Record<string, unknown> = {}): Request {
  return new Request('https://w.workers.dev/webhooks/hotmart', {
    method: 'POST',
    headers: { 'X-Hotmart-Token': 'tok', 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: evento, data: { subscriber: { email: 'cliente@mail.com' }, purchase: { next_cycle_date: '2027-01-13' }, ...extra } })
  })
}

describe('manejarWebhook', () => {
  it('rechaza hottok invalido con 403', async () => {
    const { fetch } = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', { method: 'POST', headers: { 'X-Hotmart-Token': 'otro' }, body: '{}' })
    const r = await manejarWebhook(env, req, fetch)
    expect(r.status).toBe(403)
  })

  it('PURCHASE_APPROVED activa y guarda expira_at desde next_cycle_date', async () => {
    const falso = supabaseFalso()
    const r = await manejarWebhook(env, pedido('PURCHASE_APPROVED'), falso.fetch)
    expect(r.status).toBe(200)
    const s = falso.base.suscripciones[0]
    expect(s.email).toBe('cliente@mail.com')
    expect(s.estado).toBe('activa')
    expect(s.expira_at).toContain('2027-01-13')
  })

  it('SUBSCRIPTION_RENEWAL mantiene una sola fila y re-fecha', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('PURCHASE_APPROVED', { purchase: { next_cycle_date: '2026-12-01' } }), falso.fetch)
    await manejarWebhook(env, pedido('SUBSCRIPTION_RENEWAL', { purchase: { next_cycle_date: '2026-12-31' } }), falso.fetch)
    expect(falso.base.suscripciones).toHaveLength(1)
    expect(falso.base.suscripciones[0].expira_at).toContain('2026-12-31')
  })

  it('SUBSCRIPTION_CANCELLATION deja estado cancelada conservando expira_at', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('PURCHASE_APPROVED'), falso.fetch)
    await manejarWebhook(env, pedido('SUBSCRIPTION_CANCELLATION'), falso.fetch)
    const s = falso.base.suscripciones[0]
    expect(s.estado).toBe('cancelada')
    expect(s.expira_at).toContain('2027-01-13')
  })

  it('SUBSCRIPTION_EXPIRATION y PURCHASE_REFUNDED ponen inactiva', async () => {
    const falso = supabaseFalso()
    await manejarWebhook(env, pedido('SUBSCRIPTION_EXPIRATION'), falso.fetch)
    expect(falso.base.suscripciones[0].estado).toBe('inactiva')
    await manejarWebhook(env, pedido('PURCHASE_REFUNDED'), falso.fetch)
    expect(falso.base.suscripciones[0].estado).toBe('inactiva')
  })

  it('evento desconocido responde 200 sin tocar la base', async () => {
    const falso = supabaseFalso()
    const r = await manejarWebhook(env, pedido('BILLET_GENERATED'), falso.fetch)
    expect(r.status).toBe(200)
    expect(falso.base.suscripciones).toHaveLength(0)
  })

  it('acepta buyer.email cuando no hay subscriber', async () => {
    const falso = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', {
      method: 'POST',
      headers: { 'X-Hotmart-Token': 'tok' },
      body: JSON.stringify({ event: 'PURCHASE_APPROVED', data: { buyer: { email: 'otro@mail.com' }, purchase: {} } })
    })
    await manejarWebhook(env, req, falso.fetch)
    expect(falso.base.suscripciones[0].email).toBe('otro@mail.com')
  })

  it('next_cycle_date ausente usa hoy + 30 dias', async () => {
    const falso = supabaseFalso()
    const req = new Request('https://w.workers.dev/webhooks/hotmart', {
      method: 'POST',
      headers: { 'X-Hotmart-Token': 'tok' },
      body: JSON.stringify({ event: 'PURCHASE_APPROVED', data: { subscriber: { email: 'c@mail.com' }, purchase: {} } })
    })
    await manejarWebhook(env, req, falso.fetch)
    const expira = new Date(falso.base.suscripciones[0].expira_at as string)
    const dias = (expira.getTime() - Date.now()) / 86400000
    expect(dias).toBeGreaterThan(28)
    expect(dias).toBeLessThan(32)
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run _backend/src/webhook.test.ts`
Expected: FAIL — './webhook' no existe.

- [ ] **Step 3: Implementación — `_backend/src/webhook.ts`**

```ts
import { suscripcionDe, upsertSuscripcion } from './db'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = typeof fetch

export const MAPEO_EVENTOS: Record<string, 'activa' | 'cancelada' | 'inactiva'> = {
  PURCHASE_APPROVED: 'activa',
  PURCHASE_COMPLETE: 'activa',
  SUBSCRIPTION_RENEWAL: 'activa',
  SUBSCRIPTION_CANCELLATION: 'cancelada',
  PURCHASE_CANCELED: 'cancelada',
  SUBSCRIPTION_EXPIRATION: 'inactiva',
  PURCHASE_REFUNDED: 'inactiva'
}

function fechaExpira(data: Record<string, unknown>): string {
  const compra = data['purchase'] as Record<string, unknown> | undefined
  const proximo = typeof compra?.['next_cycle_date'] === 'string' ? (compra['next_cycle_date'] as string) : null
  if (proximo) return new Date(`${proximo}T12:00:00Z`).toISOString()
  return new Date(Date.now() + 30 * 86400000).toISOString()
}

export async function manejarWebhook(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  if (req.headers.get('X-Hotmart-Token') !== env.HOTTOK) return rtaError('hottok invalido', 'hottok', 403)
  const cuerpo = (await req.json().catch(() => null)) as { event?: string; data?: Record<string, unknown> } | null
  const evento = cuerpo?.event ?? ''
  const data = cuerpo?.data ?? {}
  const destino = MAPEO_EVENTOS[evento]
  if (!destino) return rtaOk({ ignorado: evento })

  const sub = data['subscriber'] as Record<string, unknown> | undefined
  const buyer = data['buyer'] as Record<string, unknown> | undefined
  const email =
    typeof sub?.['email'] === 'string' ? (sub['email'] as string) : typeof buyer?.['email'] === 'string' ? (buyer['email'] as string) : null
  if (!email) return rtaError('sin email en el evento', 'sin_email', 400)
  const compradorId = typeof sub?.['subscriber_code'] === 'string' ? (sub['subscriber_code'] as string) : null

  const previa = await suscripcionDe(env, email, fetchFn)
  const expira_at = destino === 'activa' ? fechaExpira(data) : (previa?.expira_at ?? null)
  await upsertSuscripcion(env, { email, estado: destino, expira_at, hotmart_comprador_id: compradorId ?? previa?.hotmart_comprador_id ?? null }, fetchFn)
  return rtaOk({ evento, email, estado: destino })
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run _backend/src/webhook.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: SQL del spec — añadir tabla `usuarios`**

Editar `docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md` sección 6, añadir después del bloque `create table suscripciones (...);`:

```sql
create table usuarios (
  email text primary key,
  password_hash text not null,
  creado_at timestamptz not null default now()
);
```

- [ ] **Step 6: Commit**

```bash
git add _backend/src/webhook.ts _backend/src/webhook.test.ts docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md
git commit -m "feat: webhook Hotmart en _backend (hottok, 7 eventos reales, upsert de suscripcion)"
```

### Task 4: Login (`_backend/src/login.ts`)

**Files:**
- Create: `_backend/src/login.ts`
- Test: `_backend/src/login.test.ts`

**Interfaces:**
- Consumes: `usuarioDe`, `crearUsuario`, `suscripcionDe`, `upsertSuscripcion` (Task 2); `bcryptjs`; `jose`.
- Produces (Task 5 y 6 las usan):
  - `manejarLogin(env, req, fetchFn): Promise<Response>`
  - `signSesion(env, email): Promise<string>` — JWT EdDSA `{ tipo: 'sesion', sub: email }`, exp 600 s.
  - `verificarSesion(env, token): Promise<string | null>` — `sub` si es sesión válida no vencida, si no null.
  - `clavePrivada(env): Promise<CryptoKey>` / `clavePublica(env): Promise<CryptoKey>` (importPKCS8/importSPKI).

- [ ] **Step 1: Test — `_backend/src/login.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import bcrypt from 'bcryptjs'
import { generateKeyPairSync } from 'node:crypto'
import { supabaseFalso } from './supabase-falso'
import { manejarLogin } from './login'
import type { Env } from './tipos'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: PRIVADA, LICENCIA_PUBLICA: PUBLICA }

function pedidoLogin(email: string, password: string): Request {
  return new Request('https://w.workers.dev/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

describe('manejarLogin', () => {
  it('cuenta nueva sin suscripcion: crea usuario + trial 7 dias y devuelve token', async () => {
    const falso = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'secreta123'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: { token: string } }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data.token).toContain('.')
    expect(falso.base.usuarios).toHaveLength(1)
    expect(falso.base.suscripciones[0].estado).toBe('trial')
    const dias = (new Date(falso.base.suscripciones[0].trial_hasta as string).getTime() - Date.now()) / 86400000
    expect(dias).toBeGreaterThan(6.5)
    expect(dias).toBeLessThan(7.5)
    expect(await bcrypt.compare('secreta123', falso.base.usuarios[0].password_hash)).toBe(true)
  })

  it('contrasena incorrecta rechaza con codigo credenciales', async () => {
    const falso = supabaseFalso()
    await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'secreta123'), falso.fetch)
    const r = await manejarLogin(env, pedidoLogin('nuevo@mail.com', 'malapass99'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(401)
    expect(cuerpo.ok).toBe(false)
    expect(cuerpo.codigo).toBe('credenciales')
  })

  it('comprador de Hotmart que entra por primera vez: estado activa, sin trial', async () => {
    const falso = supabaseFalso()
    falso.base.suscripciones.push({ email: 'comprador@mail.com', estado: 'activa', expira_at: '2026-12-14T00:00:00Z', trial_hasta: null, hotmart_comprador_id: '123', actualizado_at: 'hoy' })
    const r = await manejarLogin(env, pedidoLogin('comprador@mail.com', 'secreta123'), falso.fetch)
    expect(r.status).toBe(200)
    expect(falso.base.suscripciones[0].estado).toBe('activa')
    expect(falso.base.suscripciones[0].trial_hasta).toBeNull()
  })

  it('trial agotado sin compra: codigo trial_agotado', async () => {
    const falso = supabaseFalso()
    falso.base.suscripciones.push({ email: 'viejo@mail.com', estado: 'trial', expira_at: null, trial_hasta: new Date(Date.now() - 86400000).toISOString(), hotmart_comprador_id: null, actualizado_at: 'hoy' })
    const r = await manejarLogin(env, pedidoLogin('viejo@mail.com', 'secreta123'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string; error?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('trial_agotado')
    expect(cuerpo.error).toContain('uscr')
  })

  it('email invalido: 400', async () => {
    const { fetch } = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('no-es-email', 'secreta123'), fetch)
    expect(r.status).toBe(400)
  })

  it('contrasena corta: 400', async () => {
    const { fetch } = supabaseFalso()
    const r = await manejarLogin(env, pedidoLogin('a@b.c', '123'), fetch)
    expect(r.status).toBe(400)
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run _backend/src/login.test.ts`
Expected: FAIL — './login' no existe.

- [ ] **Step 3: Implementación — `_backend/src/login.ts`**

```ts
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose'
import { crearUsuario, suscripcionDe, upsertSuscripcion, usuarioDe } from './db'
import { rtaError, rtaOk, type Env } from './tipos'

type FetchFn = typeof fetch

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function clavePrivada(env: Env): Promise<CryptoKey> {
  return importPKCS8(env.LICENCIA_PRIVADA, 'EdDSA')
}

export async function clavePublica(env: Env): Promise<CryptoKey> {
  return importSPKI(env.LICENCIA_PUBLICA, 'EdDSA')
}

export async function signSesion(env: Env, email: string): Promise<string> {
  return new SignJWT({ tipo: 'sesion' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime('600s')
    .sign(await clavePrivada(env))
}

export async function verificarSesion(env: Env, token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, await clavePublica(env))
    if (payload.tipo !== 'sesion') return null
    return String(payload.sub)
  } catch {
    return null
  }
}

export async function manejarLogin(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { email?: string; password?: string } | null
  const email = typeof cuerpo?.email === 'string' ? cuerpo.email.trim().toLowerCase() : ''
  const password = typeof cuerpo?.password === 'string' ? cuerpo.password : ''
  if (!EMAIL_RE.test(email)) return rtaError('email invalido', 'formato')
  if (password.length < 6 || password.length > 200) return rtaError('contrasena invalida', 'formato')

  const suscripcion = await suscripcionDe(env, email, fetchFn)
  const usuario = await usuarioDe(env, email, fetchFn)

  if (!usuario) {
    const trialVencido = suscripcion?.estado === 'trial' && suscripcion.trial_hasta && new Date(suscripcion.trial_hasta).getTime() < Date.now()
    if (suscripcion?.estado === 'inactiva' || trialVencido) {
      return rtaError('Trial agotado: suscribete para usar Keryx', 'trial_agotado', 403)
    }
    const hash = bcrypt.hashSync(password, 10)
    await crearUsuario(env, email, hash, fetchFn)
    if (!suscripcion) {
      await upsertSuscripcion(env, { email, estado: 'trial', trial_hasta: new Date(Date.now() + 7 * 86400000).toISOString(), expira_at: null, hotmart_comprador_id: null }, fetchFn)
    }
  } else if (!bcrypt.compareSync(password, usuario.password_hash)) {
    return rtaError('email o contrasena incorrectos', 'credenciales', 401)
  }

  return rtaOk({ token: await signSesion(env, email), email, estado: suscripcion?.estado ?? 'trial' })
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run _backend/src/login.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add _backend/src/login.ts _backend/src/login.test.ts
git commit -m "feat: auth/login en _backend (bcrypt, trial 7 dias, sesion JWT EdDSA 10 min)"
```

---

### Task 5: Activar / refrescar / desactivar (`_backend/src/licencia.ts`)

**Files:**
- Create: `_backend/src/licencia.ts`
- Test: `_backend/src/licencia.test.ts`

**Interfaces:**
- Consumes: `verificarSesion`, `clavePrivada`, `clavePublica` (Task 4); `suscripcionDe`, `dispositivosDe`, `agregarDispositivo`, `borrarDispositivo` (Task 2); `jose`.
- Produces (Task 6 las enruta):
  - `manejarActivar(env, req, fetchFn)` — body `{ tokenSesion, huella }` → `rtaOk({ licencia, expiraISO, estado })`; 401 `'sesion'`; 403 `'sin_acceso'` sin fin futuro; 403 `'limite_dispositivos'`.
  - `manejarRefrescar(env, req, fetchFn)` — body `{ licencia }` → nuevo `{ licencia, expiraISO, estado }`; 403 `'vencida'` si no verifica.
  - `manejarDesactivar(env, req, fetchFn)` — body `{ tokenSesion, huella }` → `rtaOk({ desactivado: true })`.
  - JWT licencia: `{ tipo: 'licencia', huella, estado, trial }`, sub=email, exp = finDeAcceso + GRACIA_MS.
  - `finDeAcceso(s): number | null` — max(expira_at, trial_hasta) en ms.
  - `GRACIA_MS = 7 * 86400000`, `MAX_DISPOSITIVOS = 3`.

- [ ] **Step 1: Test — `_backend/src/licencia.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import { supabaseFalso } from './supabase-falso'
import { manejarLogin } from './login'
import { manejarActivar, manejarRefrescar, manejarDesactivar, finDeAcceso } from './licencia'
import type { Env, Suscripcion } from './tipos'

const par = generateKeyPairSync('ed25519')
const env: Env = {
  HOTTOK: 'tok',
  SUPABASE_URL: 'https://sb.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'key',
  LICENCIA_PRIVADA: par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
  LICENCIA_PUBLICA: par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
}

type Falso = ReturnType<typeof supabaseFalso>

async function loginYActivar(falso: Falso, email = 'u@mail.com', estado: Suscripcion['estado'] = 'trial', finISO: string | null = new Date(Date.now() + 20 * 86400000).toISOString()) {
  falso.base.suscripciones.push({ email, estado, expira_at: estado === 'trial' ? null : finISO, trial_hasta: estado === 'trial' ? finISO : null, hotmart_comprador_id: null, actualizado_at: 'hoy' })
  const rl = await manejarLogin(env, new Request('https://w.dev/auth/login', { method: 'POST', body: JSON.stringify({ email, password: 'secreta123' }) }), falso.fetch)
  const { data } = (await rl.json()) as { ok: boolean; data: { token: string } }
  return data.token
}

function reqActivar(tokenSesion: string, huella: string): Request {
  return new Request('https://w.dev/license/activar', { method: 'POST', body: JSON.stringify({ tokenSesion, huella }) })
}

describe('finDeAcceso', () => {
  it('devuelve max(expira_at, trial_hasta)', () => {
    const s = { email: 'a', estado: 'activa', expira_at: '2026-12-01T00:00:00Z', trial_hasta: '2026-11-20T00:00:00Z', hotmart_comprador_id: null, actualizado_at: '' } as Suscripcion
    expect(finDeAcceso(s)).toBe(new Date('2026-12-01T00:00:00Z').getTime())
  })

  it('null sin fechas', () => {
    const s = { email: 'a', estado: 'inactiva', expira_at: null, trial_hasta: null, hotmart_comprador_id: null, actualizado_at: '' } as Suscripcion
    expect(finDeAcceso(s)).toBeNull()
  })
})

describe('manejarActivar', () => {
  it('activa trial: licencia con exp = fin + 7 dias de gracia', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    const r = await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; data: { licencia: string; expiraISO: string } }
    expect(cuerpo.ok).toBe(true)
    const fin = new Date(falso.base.suscripciones[0].trial_hasta as string).getTime()
    const expira = new Date(cuerpo.data.expiraISO).getTime()
    expect(expira - fin).toBeCloseTo(7 * 86400000, -3)
    expect(falso.base.dispositivos.map((d) => d.huella)).toEqual(['huella-eq1'])
  })

  it('idempotente: re-activar la misma huella no agrega fila', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    await manejarActivar(env, reqActivar(token, 'huella-eq1'), falso.fetch)
    expect(falso.base.dispositivos).toHaveLength(1)
  })

  it('limite de 3 dispositivos: el cuarto da 403 limite_dispositivos', async () => {
    const falso = supabaseFalso()
    falso.base.dispositivos.push({ email: 'u@mail.com', huella: 'h1' }, { email: 'u@mail.com', huella: 'h2' }, { email: 'u@mail.com', huella: 'h3' }, { email: 'u@mail.com', huella: 'h4' })
    const token = await loginYActivar(falso)
    const r = await manejarActivar(env, reqActivar(token, 'h5'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('limite_dispositivos')
  })

  it('suscripcion inactiva vencida: 403 sin_acceso', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso, 'vencido@mail.com', 'inactiva', new Date(Date.now() - 86400000).toISOString())
    const r = await manejarActivar(env, reqActivar(token, 'hx'), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('sin_acceso')
  })

  it('token de sesion invalido: 401', async () => {
    const falso = supabaseFalso()
    const r = await manejarActivar(env, reqActivar('no-es-jwt', 'hx'), falso.fetch)
    expect(r.status).toBe(401)
  })
})

describe('manejarRefrescar', () => {
  it('renueva con nueva firma y confirma el estado', async () => {
    const falso = supabaseFalso()
    const token = await loginYActivar(falso)
    const ra = await manejarActivar(env, reqActivar(token, 'huella-r1'), falso.fetch)
    const { data: da } = (await ra.json()) as { ok: boolean; data: { licencia: string } }
    const rr = await manejarRefrescar(env, new Request('https://w.dev/license/refrescar', { method: 'POST', body: JSON.stringify({ licencia: da.licencia }) }), falso.fetch)
    const cuerpo = (await rr.json()) as { ok: boolean; data: { licencia: string } }
    expect(cuerpo.ok).toBe(true)
    expect(cuerpo.data.licencia).toContain('.')
  })

  it('licencia invalida: 403 vencida (re-login)', async () => {
    const falso = supabaseFalso()
    const r = await manejarRefrescar(env, new Request('https://w.dev/license/refrescar', { method: 'POST', body: JSON.stringify({ licencia: 'garbage' }) }), falso.fetch)
    const cuerpo = (await r.json()) as { ok: boolean; codigo?: string }
    expect(r.status).toBe(403)
    expect(cuerpo.codigo).toBe('vencida')
  })
})

describe('manejarDesactivar', () => {
  it('libera la huella indicada con sesion valida', async () => {
    const falso = supabaseFalso()
    falso.base.dispositivos.push({ email: 'u@mail.com', huella: 'h1' })
    const token = await loginYActivar(falso)
    await manejarDesactivar(env, new Request('https://w.dev/license/desactivar', { method: 'POST', body: JSON.stringify({ tokenSesion: token, huella: 'h1' }) }), falso.fetch)
    expect(falso.base.dispositivos).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run _backend/src/licencia.test.ts`
Expected: FAIL — './licencia' no existe.

- [ ] **Step 3: Implementación — `_backend/src/licencia.ts`**

```ts
import { SignJWT, jwtVerify } from 'jose'
import { suscripcionDe, dispositivosDe, agregarDispositivo, borrarDispositivo } from './db'
import { verificarSesion, clavePrivada, clavePublica } from './login'
import { rtaError, rtaOk, type Env, type Suscripcion } from './tipos'

type FetchFn = typeof fetch

export const GRACIA_MS = 7 * 86400000
export const MAX_DISPOSITIVOS = 3

export function finDeAcceso(s: Suscripcion): number | null {
  const fechas = [s.expira_at, s.trial_hasta].filter((x): x is string => Boolean(x)).map((x) => new Date(x).getTime())
  return fechas.length ? Math.max(...fechas) : null
}

async function firmaLicencia(env: Env, email: string, huella: string, suscripcion: Suscripcion, fin: number): Promise<string> {
  return new SignJWT({ tipo: 'licencia', huella, estado: suscripcion.estado, trial: suscripcion.estado === 'trial' })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(new Date(fin + GRACIA_MS))
    .sign(await clavePrivada(env))
}

export async function manejarActivar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { tokenSesion?: string; huella?: string } | null
  if (!cuerpo?.tokenSesion || !cuerpo.huella) return rtaError('faltan datos', 'formato')
  const email = await verificarSesion(env, cuerpo.tokenSesion)
  if (!email) return rtaError('sesion invalida o vencida, inicia sesion de nuevo', 'sesion', 401)
  const huella = cuerpo.huella.slice(0, 64)

  const suscripcion = await suscripcionDe(env, email, fetchFn)
  const fin = suscripcion ? finDeAcceso(suscripcion) : null
  if (!fin || fin < Date.now()) return rtaError('sin suscripcion activa', 'sin_acceso', 403)

  const equipos = await dispositivosDe(env, email, fetchFn)
  if (!equipos.some((d) => d.huella === huella)) {
    if (equipos.length >= MAX_DISPOSITIVOS) {
      return rtaError('Limite de 3 equipos alcanzado: cierra sesion en uno para activar este', 'limite_dispositivos', 403)
    }
    await agregarDispositivo(env, email, huella, fetchFn)
  }

  const licencia = await firmaLicencia(env, email, huella, suscripcion, fin)
  return rtaOk({ licencia, expiraISO: new Date(fin + GRACIA_MS).toISOString(), estado: suscripcion.estado })
}

export async function manejarRefrescar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { licencia?: string } | null
  if (!cuerpo?.licencia) return rtaError('faltan datos', 'formato')
  try {
    const { payload } = await jwtVerify(cuerpo.licencia, await clavePublica(env))
    if (payload.tipo !== 'licencia') throw new Error('tipo')
    const email = String(payload.sub)
    const huella = String(payload.huella)
    const suscripcion = await suscripcionDe(env, email, fetchFn)
    const fin = suscripcion ? finDeAcceso(suscripcion) : null
    if (!fin || fin < Date.now()) return rtaError('suscripcion inactiva: renueva para seguir usando Keryx', 'sin_acceso', 403)
    const licencia = await firmaLicencia(env, email, huella, suscripcion, fin)
    return rtaOk({ licencia, expiraISO: new Date(fin + GRACIA_MS).toISOString(), estado: suscripcion.estado })
  } catch {
    return rtaError('licencia invalida o vencida: inicia sesion de nuevo', 'vencida', 403)
  }
}

export async function manejarDesactivar(env: Env, req: Request, fetchFn: FetchFn = fetch): Promise<Response> {
  const cuerpo = (await req.json().catch(() => null)) as { tokenSesion?: string; huella?: string } | null
  if (!cuerpo?.tokenSesion || !cuerpo.huella) return rtaError('faltan datos', 'formato')
  const email = await verificarSesion(env, cuerpo.tokenSesion)
  if (!email) return rtaError('sesion invalida', 'sesion', 401)
  await borrarDispositivo(env, email, cuerpo.huella.slice(0, 64), fetchFn)
  return rtaOk({ desactivado: true })
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run _backend/src/licencia.test.ts`
Expected: PASS (10 tests).

- [ ] **Step 5: Commit**

```bash
git add _backend/src/licencia.ts _backend/src/licencia.test.ts
git commit -m "feat: activar/refrescar/desactivar en _backend (JWT licencia EdDSA, gracia 7 dias, max 3 equipos)"
```

---

### Task 6: Router, rate limit y wrangler (`_backend/src/index.ts`)

**Files:**
- Create: `_backend/src/index.ts`
- Create: `_backend/wrangler.jsonc`
- Test: `_backend/src/index.test.ts`

**Interfaces:**
- Consumes: `manejarWebhook` (T3), `manejarLogin` (T4), `manejarActivar/Refrescar/Desactivar` (T5), `rtaError` (T1).
- Produces: `enrutador(req, env): Promise<Response>` (exportada para tests) y `export default { fetch }` (deploy). Rate limit: 5 req/min por IP (`CF-Connecting-IP`, fallback `'desconocida'`) en `/auth/login` vía mapa en memoria del isolate. Rutas: `POST /webhooks/hotmart`, `POST /auth/login`, `POST /license/activar`, `POST /license/refrescar`, `POST /license/desactivar`; resto 404.

- [ ] **Step 1: Test — `_backend/src/index.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { enrutador } from './index'
import type { Env } from './tipos'

const env: Env = { HOTTOK: 'tok', SUPABASE_URL: 'https://sb.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'key', LICENCIA_PRIVADA: '', LICENCIA_PUBLICA: '' }

describe('enrutador', () => {
  it('404 en ruta desconocida', async () => {
    const r = await enrutador(new Request('https://w.dev/no-existe', { method: 'POST' }), env)
    expect(r.status).toBe(404)
  })

  it('rate limit de login: la 6a peticion de la misma IP da 429', async () => {
    const pedidos = Array.from(
      { length: 6 },
      () =>
        new Request('https://w.dev/auth/login', {
          method: 'POST',
          headers: { 'CF-Connecting-IP': '1.2.3.4' },
          body: JSON.stringify({ email: 'a@b.c', password: 'secreta123' })
        })
    )
    for (let i = 0; i < 5; i++) await enrutador(pedidos[i], env)
    const sexta = await enrutador(pedidos[5], env)
    expect(sexta.status).toBe(429)
  })

  it('otra IP no esta limitada', async () => {
    const r = await enrutador(
      new Request('https://w.dev/auth/login', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': '9.9.9.9' },
        body: JSON.stringify({ email: 'a@b.c', password: 'secreta123' })
      }),
      env
    )
    expect(r.status).not.toBe(429)
  })

  it('webhook pasa por el router (403 sin hottok)', async () => {
    const r = await enrutador(new Request('https://w.dev/webhooks/hotmart', { method: 'POST', body: '{}' }), env)
    expect(r.status).toBe(403)
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run _backend/src/index.test.ts`
Expected: FAIL — './index' no existe.

- [ ] **Step 3: Implementación — `_backend/src/index.ts`**

```ts
import { manejarWebhook } from './webhook'
import { manejarLogin } from './login'
import { manejarActivar, manejarRefrescar, manejarDesactivar } from './licencia'
import { rtaError, type Env } from './tipos'

const VENTANA_MS = 60000
const MAX_POR_MINUTO = 5
const GOLPES = new Map<string, number[]>()

function limitar(ip: string, ahora = Date.now()): boolean {
  const previos = (GOLPES.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS)
  if (previos.length >= MAX_POR_MINUTO) return false
  previos.push(ahora)
  GOLPES.set(ip, previos)
  return true
}

export async function enrutador(req: Request, env: Env): Promise<Response> {
  const ruta = new URL(req.url).pathname
  const metodo = req.method

  if (metodo === 'POST' && ruta === '/webhooks/hotmart') return manejarWebhook(env, req)

  const ip = req.headers.get('CF-Connecting-IP') ?? 'desconocida'

  if (metodo === 'POST' && ruta === '/auth/login') {
    if (!limitar(ip)) return rtaError('demasiados intentos, espera un minuto', 'rate_limit', 429)
    return manejarLogin(env, req)
  }
  if (metodo === 'POST' && ruta === '/license/activar') return manejarActivar(env, req)
  if (metodo === 'POST' && ruta === '/license/refrescar') return manejarRefrescar(env, req)
  if (metodo === 'POST' && ruta === '/license/desactivar') return manejarDesactivar(env, req)

  return rtaError('ruta no encontrada', 'no_ruta', 404)
}

export default {
  fetch(req: Request, env: Env): Promise<Response> {
    return enrutador(req, env)
  }
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run _backend/src/index.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: `_backend/wrangler.jsonc`**

```jsonc
{
  "name": "keryx-licencias",
  "main": "src/index.ts",
  "compatibility_date": "2026-11-01",
  "compatibility_flags": ["nodejs_compat"]
}
```

- [ ] **Step 6: Commit**

```bash
git add _backend/src/index.ts _backend/src/index.test.ts _backend/wrangler.jsonc
git commit -m "feat: router del Worker con rate limit de login y config wrangler"
```

---

### Task 7: Verificación offline del JWT en la app (`packages/licencia`)

**Files:**
- Create: `packages/licencia/package.json`
- Create: `packages/licencia/tsconfig.json`
- Create: `packages/licencia/src/tipos.ts`
- Create: `packages/licencia/src/verificar.ts`
- Create: `packages/licencia/src/huella.ts`
- Test: `packages/licencia/src/verificar.test.ts`

**Interfaces:**
- Consumes: `jose` (devDep raíz), `node:crypto`.
- Produces (Tasks 8-10 los consumen):
  - `packages/licencia/src/tipos.ts`: `type EstadoLicencia = 'sin_licencia' | 'trial' | 'activa' | 'cancelada' | 'gracia' | 'expirada' | 'bloqueada'`; `interface EstadoActual { estado; email?; expiraISO?; diasRestantes? }`; `export const GRACIA_DIAS = 7`.
  - `verificarLicencia(jwt, publicaPem, huella): Promise<{ valido: boolean; email?: string; expiraMs?: number; trial?: boolean; estado?: string }>` — valida firma + `payload.huella === huella` + exp (jose jwtVerify).
  - `calcularHuella(piezas: string[]): string` — SHA-256 hex de piezas unidas con separador NUL.

- [ ] **Step 1: `packages/licencia/package.json` + `tsconfig.json`**

```json
{
  "name": "@keryx/licencia",
  "private": true,
  "type": "module",
  "main": "src/index.ts",
  "dependencies": {
    "jose": "^6.0.0"
  }
}
```

```json
{ "extends": "../../tsconfig.base.json", "include": ["src"] }
```

- [ ] **Step 2: `packages/licencia/src/tipos.ts`**

```ts
export type EstadoLicencia = 'sin_licencia' | 'trial' | 'activa' | 'cancelada' | 'gracia' | 'expirada' | 'bloqueada'

export interface EstadoActual {
  estado: EstadoLicencia
  email?: string
  expiraISO?: string
  diasRestantes?: number
}

export const GRACIA_DIAS = 7
```

- [ ] **Step 3: Test — `packages/licencia/src/verificar.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { SignJWT, importPKCS8 } from 'jose'
import { generateKeyPairSync } from 'node:crypto'
import { verificarLicencia, calcularHuella } from './verificar'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()

async function jwtDe(huella: string, exp: Date): Promise<string> {
  const clave = await importPKCS8(PRIVADA, 'EdDSA')
  return new SignJWT({ tipo: 'licencia', huella, estado: 'activa', trial: false })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject('p@mail.com')
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(clave)
}

describe('verificarLicencia', () => {
  it('valida firma + huella + exp', async () => {
    const jwt = await jwtDe('huella-1', new Date(Date.now() + 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(true)
    expect(r.email).toBe('p@mail.com')
    expect(r.trial).toBe(false)
  })

  it('huella distinta: invalido', async () => {
    const jwt = await jwtDe('otra', new Date(Date.now() + 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('exp vencido: invalido', async () => {
    const jwt = await jwtDe('huella-1', new Date(Date.now() - 3600000))
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('firma con otra clave: invalido (nadie forja licencias)', async () => {
    const parB = generateKeyPairSync('ed25519')
    const claveB = await importPKCS8(parB.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(), 'EdDSA')
    const jwt = await new SignJWT({ tipo: 'licencia', huella: 'huella-1' })
      .setProtectedHeader({ alg: 'EdDSA' })
      .setSubject('x@mail.com')
      .setIssuedAt()
      .setExpirationTime(new Date(Date.now() + 3600000))
      .sign(claveB)
    const r = await verificarLicencia(jwt, PUBLICA, 'huella-1')
    expect(r.valido).toBe(false)
  })

  it('calcularHuella es sha256 hex estable', () => {
    expect(calcularHuella(['a', 'b'])).toBe(calcularHuella(['a', 'b']))
    expect(calcularHuella(['a', 'b'])).toMatch(/^[0-9a-f]{64}$/)
    expect(calcularHuella(['b', 'a'])).not.toBe(calcularHuella(['a', 'b']))
  })
})
```

- [ ] **Step 4: Correr — FAIL**

Run: `npm install` y luego `npx vitest run packages/licencia`
Expected: FAIL — './verificar' no existe.

- [ ] **Step 5: Implementación**

`packages/licencia/src/huella.ts`:

```ts
import { createHash } from 'node:crypto'

export function calcularHuella(piezas: string[]): string {
  return createHash('sha256').update(piezas.join('\u0000')).digest('hex')
}
```

`packages/licencia/src/verificar.ts`:

```ts
import { jwtVerify, importSPKI } from 'jose'

export interface VerificacionLicencia {
  valido: boolean
  email?: string
  expiraMs?: number
  trial?: boolean
  estado?: string
}

export async function verificarLicencia(jwt: string, publicaPem: string, huella: string): Promise<VerificacionLicencia> {
  try {
    const clave = await importSPKI(publicaPem, 'EdDSA')
    const { payload } = await jwtVerify(jwt, clave)
    if (payload.tipo !== 'licencia' || payload.huella !== huella) return { valido: false }
    return {
      valido: true,
      email: String(payload.sub ?? ''),
      expiraMs: typeof payload.exp === 'number' ? payload.exp * 1000 : undefined,
      trial: payload.trial === true,
      estado: typeof payload.estado === 'string' ? payload.estado : undefined
    }
  } catch {
    return { valido: false }
  }
}
```

- [ ] **Step 6: Correr — PASS**

Run: `npx vitest run packages/licencia`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add packages/licencia package-lock.json
git commit -m "feat: packages/licencia - verificacion offline del JWT Ed25519 y huella de equipo"
```

---

### Task 8: Almacén cifrado del token (`packages/licencia/src/almacen.ts`)

**Files:**
- Create: `packages/licencia/src/almacen.ts`
- Test: `packages/licencia/src/almacen.test.ts`

**Interfaces:**
- Consumes: `node:fs`; `safeStorage` de Electron INYECTADO (el paquete no importa electron).
- Produces:
  - `interface SafeStorageMin { isEncryptionAvailable(): boolean; encryptString(texto: string): Buffer; decryptString(buffer: Buffer): string }`
  - `interface FsMin { escribir; leer(ruta): Buffer | null; existe; renombrar; borrar }`
  - `crearSafeStorageFalso(opciones?): SafeStorageMin` (para tests).
  - `crearAlmacen({ carpeta, safeStorage, fs? }): { guardar(jwt): void; leer(): string | null; borrar(): void }`
  - Formato `licencia.dat`: byte 0 `0x01` = safeStorage + bytes cifrados; `0x00` = base64 del JWT (fallback dev). Escritura atómica tmp+rename.

- [ ] **Step 1: Test — `packages/licencia/src/almacen.test.ts`**

```ts
import { describe, expect, it, beforeEach } from 'vitest'
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { crearAlmacen, crearSafeStorageFalso } from './almacen'

const carpeta = mkdtempSync(join(tmpdir(), 'licencia-'))

describe('crearAlmacen', () => {
  beforeEach(() => {
    rmSync(join(carpeta, 'licencia.dat'), { force: true })
  })

  it('cifra y descifra con safeStorage', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso() })
    almacen.guardar('jwt-ejemplo.123')
    expect(almacen.leer()).toBe('jwt-ejemplo.123')
    const bytes = readFileSync(join(carpeta, 'licencia.dat'))
    expect(bytes[0]).toBe(1)
    expect(bytes.subarray(1).toString('latin1')).not.toContain('jwt-ejemplo')
  })

  it('fallback base64 cuando safeStorage no esta disponible', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso({ disponible: false }) })
    almacen.guardar('jwt-plano')
    expect(readFileSync(join(carpeta, 'licencia.dat'))[0]).toBe(0)
    expect(almacen.leer()).toBe('jwt-plano')
  })

  it('leer sin archivo devuelve null; borrar elimina', () => {
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso() })
    expect(almacen.leer()).toBeNull()
    almacen.guardar('x')
    almacen.borrar()
    expect(existsSync(join(carpeta, 'licencia.dat'))).toBe(false)
    expect(almacen.leer()).toBeNull()
  })

  it('archivo corrupto devuelve null sin lanzar', () => {
    const falso = { escribir: () => {}, existe: () => true, leer: () => Buffer.from([9, 9]), renombrar: () => {}, borrar: () => {} }
    const almacen = crearAlmacen({ carpeta, safeStorage: crearSafeStorageFalso(), fs: falso })
    expect(almacen.leer()).toBeNull()
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run packages/licencia/src/almacen.test.ts`
Expected: FAIL — './almacen' no existe.

- [ ] **Step 3: Implementación — `packages/licencia/src/almacen.ts`**

```ts
import { renameSync, writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export interface SafeStorageMin {
  isEncryptionAvailable(): boolean
  encryptString(texto: string): Buffer
  decryptString(buffer: Buffer): string
}

export interface FsMin {
  escribir(ruta: string, bytes: Buffer): void
  leer(ruta: string): Buffer | null
  existe(ruta: string): boolean
  renombrar(de: string, a: string): void
  borrar(ruta: string): void
}

const fsReal: FsMin = {
  escribir: writeFileSync,
  leer: (ruta) => (existsSync(ruta) ? readFileSync(ruta) : null),
  existe: existsSync,
  renombrar: renameSync,
  borrar: unlinkSync
}

export function crearSafeStorageFalso(opciones: { disponible?: boolean } = {}): SafeStorageMin {
  const disponible = opciones.disponible ?? true
  return {
    isEncryptionAvailable: () => disponible,
    encryptString: (texto) => Buffer.concat([Buffer.from('FALSO-'), Buffer.from(texto, 'utf8')]),
    decryptString: (buffer) => buffer.subarray(6).toString('utf8')
  }
}

export interface Almacen {
  guardar(jwt: string): void
  leer(): string | null
  borrar(): void
}

export function crearAlmacen(opciones: { carpeta: string; safeStorage: SafeStorageMin; fs?: FsMin }): Almacen {
  const fs = opciones.fs ?? fsReal
  const ruta = join(opciones.carpeta, 'licencia.dat')
  const rutaTmp = `${ruta}.tmp`

  return {
    guardar(jwt: string): void {
      const cifrado = opciones.safeStorage.isEncryptionAvailable()
      const bytes = cifrado
        ? Buffer.concat([Buffer.from([1]), opciones.safeStorage.encryptString(jwt)])
        : Buffer.concat([Buffer.from([0]), Buffer.from(Buffer.from(jwt, 'utf8').toString('base64'), 'latin1')])
      fs.escribir(rutaTmp, bytes)
      fs.renombrar(rutaTmp, ruta)
    },
    leer(): string | null {
      const bytes = fs.leer(ruta)
      if (!bytes || bytes.length < 2) return null
      try {
        if (bytes[0] === 1) return opciones.safeStorage.decryptString(bytes.subarray(1))
        if (bytes[0] === 0) return Buffer.from(bytes.subarray(1).toString('latin1'), 'base64').toString('utf8')
        return null
      } catch {
        return null
      }
    },
    borrar(): void {
      if (fs.existe(ruta)) fs.borrar(ruta)
    }
  }
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run packages/licencia/src/almacen.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/licencia/src/almacen.ts packages/licencia/src/almacen.test.ts
git commit -m "feat: almacen cifrado del token (safeStorage, atomico, fallback base64)"
```

---

### Task 9: Cliente backend + orquestador (`packages/licencia/src`)

**Files:**
- Create: `packages/licencia/src/cliente.ts`
- Create: `packages/licencia/src/licencia.ts`
- Test: `packages/licencia/src/licencia.test.ts`

**Interfaces:**
- Consumes: `verificarLicencia`, `calcularHuella`, `crearAlmacen` (T7/T8), `EstadoActual/EstadoLicencia` (T7).
- Produces (Task 10 consume desde el main):
  - `class ClienteLicencia { constructor(backendUrl: string, fetchFn?: typeof fetch); tokenSesion(email, password): Promise<{ token: string } | { error: string; codigo?: string }>; activar(token, huella): Promise<LoginRta | { error; codigo? }>; refrescar(jwt): Promise<LoginRta | { error; codigo? }>; desactivar(token, huella): Promise<void> }` con `type LoginRta = { licencia: string; expiraISO: string; estado: string }`.
  - `estadoDesdeVerificacion(v: VerificacionLicencia, jwt: string | null): EstadoActual` — sin jwt o invalido → `sin_licencia`; `expiraMs <= ahora` → `expirada`; si no, estado del payload (`trial`|`activa`|`cancelada`) con `diasRestantes = round((expiraMs - ahora)/día - GRACIA_DIAS)`.
  - `crearLicencia(opciones): { estado(); iniciar(email, contra); verificar(); refrescarSiToca(); salir(); iniciarCron(); huella }`.
  - `OpcionesLicencia = { backendUrl, clavePublicaPem, piezasHuella?, carpeta, safeStorage, fetchFn?, msRevalidar? = 24h }`.
  - El paquete NO importa `electron` (mantener testable); Task 10 crea el puente en el main con `app.getPath('userData')` + `safeStorage`.

- [ ] **Step 1: Test — `packages/licencia/src/licencia.test.ts`**

```ts
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { SignJWT, importPKCS8 } from 'jose'
import { generateKeyPairSync } from 'node:crypto'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { crearLicencia, estadoDesdeVerificacion } from './licencia'
import { crearSafeStorageFalso } from './almacen'

const par = generateKeyPairSync('ed25519')
const PRIVADA = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const PUBLICA = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()
const carpeta = mkdtempSync(join(tmpdir(), 'licmain-'))
const FIN_REAL = Date.now() + 20 * 86400000

async function jwtDelBackend(huella: string): Promise<string> {
  const clave = await importPKCS8(PRIVADA, 'EdDSA')
  return new SignJWT({ tipo: 'licencia', huella, estado: 'activa', trial: false })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setSubject('p@mail.com')
    .setIssuedAt()
    .setExpirationTime(new Date(FIN_REAL + 7 * 86400000))
    .sign(clave)
}

function crearOrquestador(fetchEspia: typeof fetch) {
  return crearLicencia({
    backendUrl: 'https://w.dev',
    clavePublicaPem: PUBLICA,
    piezasHuella: ['maquina', 'instalacion'],
    carpeta,
    safeStorage: crearSafeStorageFalso(),
    fetchFn: fetchEspia
  })
}

describe('estadoDesdeVerificacion', () => {
  it('sin licencia', () => {
    expect(estadoDesdeVerificacion({ valido: false }, null).estado).toBe('sin_licencia')
  })
  it('expirada cuando exp <= ahora', () => {
    expect(estadoDesdeVerificacion({ valido: true, expiraMs: Date.now() - 1000, estado: 'activa' }, 'jwt').estado).toBe('expirada')
  })
  it('activa con diasRestantes = (exp - 7d) - ahora', () => {
    const e = estadoDesdeVerificacion({ valido: true, expiraMs: FIN_REAL + 7 * 86400000, estado: 'activa' }, 'jwt')
    expect(e.estado).toBe('activa')
    expect(e.diasRestantes).toBeCloseTo(20, 0)
  })
  it('cancelada mantiene estado del payload', () => {
    const e = estadoDesdeVerificacion({ valido: true, expiraMs: FIN_REAL + 7 * 86400000, estado: 'cancelada' }, 'jwt')
    expect(e.estado).toBe('cancelada')
  })
})

describe('orquestador con backend falso', () => {
  beforeEach(() => {
    rmSync(join(carpeta, 'licencia.dat'), { force: true })
  })

  it('estado inicial sin_licencia', () => {
    const licencia = crearOrquestador((async () => new Response('[]')) as typeof fetch)
    expect(licencia.estado().estado).toBe('sin_licencia')
  })

  it('iniciar hace login+activar+guardar y deja estado activa', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      if (ruta === '/license/activar' || ruta === '/license/refrescar') {
        return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
      }
      return new Response('[]')
    }) as typeof fetch)
    const e = await licencia.iniciar('p@mail.com', 'secreta123')
    expect(e.estado).toBe('activa')
    expect(e.email).toBe('p@mail.com')
    expect(e.diasRestantes).toBeCloseTo(20, 0)
    expect(licencia.estado().estado).toBe('activa')
  })

  it('credenciales malas propagan codigo del backend', async () => {
    const malo = crearOrquestador((async () => Response.json({ ok: false, error: 'email o contrasena incorrectos', codigo: 'credenciales' }, { status: 401 })) as typeof fetch)
    const e = await malo.iniciar('p@mail.com', 'malapass1')
    expect((e as unknown as { codigo?: string }).codigo).toBe('credenciales')
  })

  it('refrescarSiToca no revalida antes de 24h y mantiene el estado', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
    }) as typeof fetch)
    await licencia.iniciar('p@mail.com', 'secreta123')
    const espia = vi.spyOn({ m: () => {} }, 'm')
    void espia
    const e = await licencia.refrescarSiToca()
    expect(e.estado).toBe('activa')
  })

  it('salir borra el archivo y vuelve a sin_licencia', async () => {
    const licencia = crearOrquestador((async (url, init) => {
      const ruta = new URL(String(url)).pathname
      const cuerpo = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>
      if (ruta === '/auth/login') return Response.json({ ok: true, data: { token: 'sesion-token', email: cuerpo.email, estado: 'activa' } })
      return Response.json({ ok: true, data: { licencia: await jwtDelBackend(String(cuerpo.huella ?? 'huella-activa')), expiraISO: new Date(FIN_REAL + 7 * 86400000).toISOString(), estado: 'activa' } })
    }) as typeof fetch)
    await licencia.iniciar('p@mail.com', 'secreta123')
    licencia.salir()
    expect(licencia.estado().estado).toBe('sin_licencia')
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run packages/licencia/src/licencia.test.ts`
Expected: FAIL — './licencia' no existe.

- [ ] **Step 3: Implementación — `packages/licencia/src/cliente.ts`**

```ts
export interface LoginRta {
  licencia: string
  expiraISO: string
  estado: string
}

export type RtaBackend<T> = { ok: true; data: T } | { ok: false; error: string; codigo?: string }

export class ClienteLicencia {
  constructor(private backendUrl: string, private fetchFn: typeof fetch = fetch) {}

  private async post<T>(ruta: string, cuerpo: unknown): Promise<RtaBackend<T>> {
    const r = await this.fetchFn(`${this.backendUrl}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    })
    return (await r.json()) as RtaBackend<T>
  }

  async tokenSesion(email: string, password: string): Promise<{ token: string } | { error: string; codigo?: string }> {
    const rta = await this.post<{ token: string; email: string; estado: string }>('/auth/login', { email, password })
    return rta.ok ? { token: rta.data.token } : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async activar(token: string, huella: string): Promise<LoginRta | { error: string; codigo?: string }> {
    const rta = await this.post<LoginRta>('/license/activar', { tokenSesion: token, huella })
    return rta.ok ? rta.data : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async refrescar(jwt: string): Promise<LoginRta | { error: string; codigo?: string }> {
    const rta = await this.post<LoginRta>('/license/refrescar', { licencia: jwt })
    return rta.ok ? rta.data : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async desactivar(token: string, huella: string): Promise<void> {
    await this.post('/license/desactivar', { tokenSesion: token, huella })
  }
}
```

- [ ] **Step 4: Implementación — `packages/licencia/src/licencia.ts`**

```ts
import { hostname, userInfo } from 'node:os'
import { ClienteLicencia, type LoginRta } from './cliente'
import { crearAlmacen } from './almacen'
import { calcularHuella } from './huella'
import { verificarLicencia, type VerificacionLicencia } from './verificar'
import { GRACIA_DIAS, type EstadoActual, type EstadoLicencia } from './tipos'

const DIA_MS = 86400000

export function estadoDesdeVerificacion(v: VerificacionLicencia, jwt: string | null): EstadoActual {
  if (!jwt || !v.valido) return { estado: 'sin_licencia' }
  const expiraMs = v.expiraMs ?? 0
  if (expiraMs <= Date.now()) return { estado: 'expirada', email: v.email }
  const diasRestantes = Math.max(0, Math.round((expiraMs - Date.now()) / DIA_MS - GRACIA_DIAS))
  const estado: EstadoLicencia = v.estado === 'trial' ? 'trial' : v.estado === 'cancelada' ? 'cancelada' : 'activa'
  return { estado, email: v.email, expiraISO: new Date(expiraMs).toISOString(), diasRestantes }
}

export interface OpcionesLicencia {
  backendUrl: string
  clavePublicaPem: string
  piezasHuella?: string[]
  carpeta: string
  safeStorage: import('./almacen').SafeStorageMin
  fetchFn?: typeof fetch
  msRevalidar?: number
}

export function crearLicencia(opciones: OpcionesLicencia) {
  const huella = calcularHuella(opciones.piezasHuella ?? [hostname(), userInfo().username])
  const almacen = crearAlmacen({ carpeta: opciones.carpeta, safeStorage: opciones.safeStorage })
  const cliente = new ClienteLicencia(opciones.backendUrl, opciones.fetchFn)
  let ultimaRed = 0

  async function verificar(): Promise<EstadoActual> {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    return estadoDesdeVerificacion(await verificarLicencia(jwt, opciones.clavePublicaPem, huella), jwt)
  }

  function estado(): EstadoActual {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    try {
      const parsed = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8')) as { exp?: number; huella?: string }
      if (parsed.huella && parsed.huella !== huella) return { estado: 'bloqueada' }
      if (typeof parsed.exp === 'number' && parsed.exp * 1000 <= Date.now()) return { estado: 'expirada' }
      return { estado: 'gracia' }
    } catch {
      return { estado: 'expirada' }
    }
  }

  async function iniciar(email: string, password: string): Promise<EstadoActual | { error: string; codigo?: string }> {
    const sesion = await cliente.tokenSesion(email, password)
    if ('error' in sesion) return { error: sesion.error, codigo: sesion.codigo }
    const activada = await cliente.activar(sesion.token, huella)
    if ('error' in activada) return { error: activada.error, codigo: activada.codigo }
    almacen.guardar(activada.licencia)
    ultimaRed = Date.now()
    return await verificar()
  }

  async function refrescarSiToca(): Promise<EstadoActual> {
    const jwt = almacen.leer()
    if (!jwt) return { estado: 'sin_licencia' }
    const v = await verificarLicencia(jwt, opciones.clavePublicaPem, huella)
    if (!v.valido) return estadoDesdeVerificacion(v, jwt)
    if (Date.now() - ultimaRed < (opciones.msRevalidar ?? 24 * 3600000)) return estadoDesdeVerificacion(v, jwt)
    const renovada = await cliente.refrescar(jwt)
    if (!('error' in renovada)) {
      almacen.guardar(renovada.licencia)
      ultimaRed = Date.now()
    }
    return await verificar()
  }

  function salir(): void {
    almacen.borrar()
  }

  function iniciarCron(): void {
    setInterval(() => {
      void refrescarSiToca()
    }, opciones.msRevalidar ?? 24 * 3600000)
  }

  return { estado, iniciar, verificar, refrescarSiToca, salir, iniciarCron, huella }
}

export type { LoginRta }
```

Nota sobre `estado()` sincrónico: decodifica el payload SIN verificar firma (la firma se verifica en `verificar()` async al arrancar y cada 24 h); sirve para el arranque del renderer sin esperar red. El test de arriba lo cubre con `sin_licencia` inicial y `activa` tras `iniciar` (que llama `verificar()`).

- [ ] **Step 5: Correr — PASS**

Run: `npx vitest run packages/licencia`
Expected: PASS (T7 5 + T8 4 + T9 8 = 17 tests del paquete).

- [ ] **Step 6: Commit**

```bash
git add packages/licencia/src
git commit -m "feat: cliente backend y orquestador de licencia (login, activar, refrescar 24h, salir)"
```

---

### Task 10: IPC + puente en main (`packages/core`, preload, `apps/desktop/src/main`)

**Files:**
- Create: `packages/core/src/licencia.ts` (tipos compartidos + constantes de config)
- Modify: `packages/core/src/channels.ts` (canales)
- Modify: `packages/core/src/schemas.ts` (schemas Zod)
- Modify: `packages/core/src/api.ts` (namespace licencia de KeryxApi)
- Create: `apps/desktop/src/main/licencia-puente.ts`
- Create: `apps/desktop/src/main/clave-publica.ts`
- Modify: `apps/desktop/src/main/ipc.ts` (handlers)
- Modify: `apps/desktop/src/preload/index.ts` (namespace)
- Modify: `apps/desktop/package.json` (dep `@keryx/licencia`)

**Interfaces:**
- Consumes: `crearLicencia`, `calcularHuella`, `EstadoActual` (T7-T9); `safeStorage`, `shell` de Electron; patrón `register(IPC.x, handler)` y `store` de `ipc.ts`.
- Produces (Task 11 en renderer):
  - `window.keryx.licencia`: `estado(): Promise<EstadoActual>`, `login(args: { email; password }): Promise<EstadoActual | LicenciaError>`, `salir(): Promise<void>`, `checkout(): Promise<void>`, `refrescar(): Promise<EstadoActual>`.
  - `IPC.licenciaEstado = 'licencia:estado'`, `licenciaLogin = 'licencia:login'`, `licenciaSalir = 'licencia:salir'`, `licenciaCheckout = 'licencia:checkout'`, `licenciaRefrescar = 'licencia:refrescar'`.
  - `packages/core/src/licencia.ts`: `EstadoLicencia`, `EstadoActual`, `LicenciaError`, `BACKEND_URL = ''`, `CHECKOUT_URL = ''` (Task 12 llena URLs reales; vacío = funcionalidad deshabilitada, sin crash).

- [ ] **Step 1: `packages/core/src/licencia.ts`**

```ts
export type EstadoLicencia = 'sin_licencia' | 'trial' | 'activa' | 'cancelada' | 'gracia' | 'expirada' | 'bloqueada'

export interface EstadoActual {
  estado: EstadoLicencia
  email?: string
  expiraISO?: string
  diasRestantes?: number
}

export interface LicenciaError {
  error: string
  codigo?: string
}

export const BACKEND_URL = ''
export const CHECKOUT_URL = ''
```

- [ ] **Step 2: `packages/core/src/channels.ts` — añadir al objeto `IPC`**

```ts
licenciaEstado: 'licencia:estado',
licenciaLogin: 'licencia:login',
licenciaSalir: 'licencia:salir',
licenciaCheckout: 'licencia:checkout',
licenciaRefrescar: 'licencia:refrescar',
```

- [ ] **Step 3: `packages/core/src/schemas.ts` — añadir**

```ts
export const licenciaLoginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200)
})
```

- [ ] **Step 4: `packages/core/src/api.ts` — añadir namespace a `KeryxApi` (seguir el patrón de los demás)**

```ts
licencia: {
  estado(): Promise<EstadoActual>
  login(args: { email: string; password: string }): Promise<EstadoActual | LicenciaError>
  salir(): Promise<void>
  checkout(): Promise<void>
  refrescar(): Promise<EstadoActual>
}
```

con `import type { EstadoActual, LicenciaError } from './licencia'`. Si el tipo `KeryxApi` se ensambla con interfaces por namespace, crear `interface LicenciaApi` y añadirla a la unión/objeto igual que las existentes.

- [ ] **Step 5: `apps/desktop/package.json` — dependencies añadir `"@keryx/licencia": "*"` (revisar cómo están listadas las demás `@keryx/*` y copiar el patrón) y correr `npm install`.

- [ ] **Step 6: `apps/desktop/src/main/clave-publica.ts`**

```ts
export const CLAVE_PUBLICA = ''
```

(Task 12 reemplaza por el PEM real generado con el script; con cadena vacía `verificarLicencia` devuelve `valido: false` → la app queda en login en dev hasta configurar — no hay crash.)

- [ ] **Step 7: Puente main — `apps/desktop/src/main/licencia-puente.ts`**

```ts
import { app, safeStorage } from 'electron'
import { hostname, userInfo } from 'node:os'
import { crearLicencia } from '@keryx/licencia'
import { BACKEND_URL } from '@keryx/core/licencia'
import { CLAVE_PUBLICA } from './clave-publica'

export const licencia = crearLicencia({
  backendUrl: BACKEND_URL,
  clavePublicaPem: CLAVE_PUBLICA,
  piezasHuella: [hostname(), userInfo().username, app.getName()],
  carpeta: app.getPath('userData'),
  safeStorage
})
```

Si el import de submódulo `@keryx/core/licencia` falla por el `exports` de core, añadir en `packages/core/package.json` un export `"./licencia": "./src/licencia.ts"` (o re-exportar los tipos desde el índice principal de core, siguiendo cómo ya exporta `IPC`).

- [ ] **Step 8: Handlers — `apps/desktop/src/main/ipc.ts`, dentro de `registerIpc`**

```ts
import { licenciaLoginSchema } from '@keryx/core'
import { CHECKOUT_URL } from '@keryx/core/licencia'
import { shell } from 'electron'
import { licencia } from './licencia-puente'

licencia.iniciarCron()

register(IPC.licenciaEstado, () => licencia.verificar())
register(IPC.licenciaRefrescar, () => licencia.refrescarSiToca())
register(IPC.licenciaLogin, (args) => {
  const { email, password } = licenciaLoginSchema.parse(args[0])
  return licencia.iniciar(email, password)
})
register(IPC.licenciaSalir, () => {
  licencia.salir()
})
register(IPC.licenciaCheckout, () => {
  if (CHECKOUT_URL) void shell.openExternal(CHECKOUT_URL)
})
```

(los imports van arriba con los demás; `register` es el helper local existente).

- [ ] **Step 9: Preload — `apps/desktop/src/preload/index.ts`, añadir al objeto `api` siguiendo el patrón**

```ts
licencia: {
  estado: () => invoke(IPC.licenciaEstado),
  login: (args) => invoke(IPC.licenciaLogin, args),
  salir: () => invoke(IPC.licenciaSalir),
  checkout: () => invoke(IPC.licenciaCheckout),
  refrescar: () => invoke(IPC.licenciaRefrescar)
}
```

- [ ] **Step 10: Verificar**

Run: `npm run typecheck; if ($?) { npm run lint }`
Expected: 0 errores / solo warnings preexistentes.

- [ ] **Step 11: Commit**

```bash
git add packages/core packages/licencia apps/desktop package-lock.json
git commit -m "feat: IPC de licencia (estado/login/salir/checkout/refrescar) con Zod y puente en main"
```

---

### Task 11: Pantallas Login/Bloqueo + banner trial + i18n (renderer)

**Files:**
- Create: `apps/desktop/src/renderer/src/lib/licencia-ui.ts` (lógica pura)
- Test: `apps/desktop/src/renderer/src/lib/licencia-ui.test.ts`
- Create: `apps/desktop/src/renderer/src/views/LoginView.tsx`
- Create: `apps/desktop/src/renderer/src/views/BloqueoView.tsx`
- Create: `apps/desktop/src/renderer/src/components/BannerLicencia.tsx`
- Modify: `apps/desktop/src/renderer/src/App.tsx` (gate del arranque)
- Modify: `apps/desktop/src/renderer/src/styles.css` (`.licencia-*`)
- Modify: `packages/i18n/src/locales/{es,en,pt,it,fr,de,zh}.ts` (claves `licencia.*`)

**Interfaces:**
- Consumes: `api.licencia.*` (Task 10), `useI18n` del repo, `EstadoActual` de `@keryx/core/licencia`.
- Produces:
  - `mensajeDeEstado(estado): { clave: string; vars?: Record<string, unknown> }` → claves `licencia.estado.<estado>` con var `{ dias }` cuando hay `diasRestantes`.
  - `esErrorLogin(rta): rta is LicenciaError`; `codigoAKey(codigo?: string): string` → `licencia.error.<codigo|red>`.
  - `necesitaBanner(estado): boolean` — solo `trial` y `gracia`.
  - Gate en App.tsx: `const [vistaLicencia, setVistaLicencia] = useState<'cargando' | 'ok' | 'login' | 'bloqueo'>('cargando')` — en `login`/`bloqueo` se renderiza la vista EN LUGAR de Shell (gate total). `BannerLicencia` dentro del Shell.

- [ ] **Step 1: Test — `apps/desktop/src/renderer/src/lib/licencia-ui.test.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { mensajeDeEstado, esErrorLogin, necesitaBanner, codigoAKey } from './licencia-ui'
import type { EstadoActual } from '@keryx/core/licencia'

describe('mensajeDeEstado', () => {
  it('cada estado tiene su clave', () => {
    const estados = ['sin_licencia', 'trial', 'activa', 'cancelada', 'gracia', 'expirada', 'bloqueada'] as const
    for (const estado of estados) {
      const m = mensajeDeEstado({ estado })
      expect(m.clave).toBe(`licencia.estado.${estado}`)
    }
  })

  it('diasRestantes viaja como variable', () => {
    expect(mensajeDeEstado({ estado: 'trial', diasRestantes: 4 }).vars).toEqual({ dias: 4 })
  })
})

describe('esErrorLogin', () => {
  it('true para LicenciaError', () => {
    expect(esErrorLogin({ error: 'x', codigo: 'credenciales' })).toBe(true)
  })
  it('false para EstadoActual', () => {
    expect(esErrorLogin({ estado: 'activa' })).toBe(false)
  })
})

describe('codigoAKey', () => {
  it('mapea codigo o red', () => {
    expect(codigoAKey('limite_dispositivos')).toBe('licencia.error.limite_dispositivos')
    expect(codigoAKey(undefined)).toBe('licencia.error.red')
  })
})

describe('necesitaBanner', () => {
  it('solo trial y gracia', () => {
    expect(necesitaBanner({ estado: 'trial' })).toBe(true)
    expect(necesitaBanner({ estado: 'gracia' })).toBe(true)
    expect(necesitaBanner({ estado: 'activa' })).toBe(false)
  })
})
```

- [ ] **Step 2: Correr — FAIL**

Run: `npx vitest run apps/desktop/src/renderer/src/lib/licencia-ui.test.ts`
Expected: FAIL — './licencia-ui' no existe.

- [ ] **Step 3: Implementación — `licencia-ui.ts`**

```ts
import type { EstadoActual, LicenciaError } from '@keryx/core/licencia'

export function mensajeDeEstado(estado: EstadoActual): { clave: string; vars?: Record<string, unknown> } {
  const vars = estado.diasRestantes !== undefined ? { dias: estado.diasRestantes } : undefined
  return { clave: `licencia.estado.${estado.estado}`, vars }
}

export function esErrorLogin(rta: unknown): rta is LicenciaError {
  return typeof rta === 'object' && rta !== null && 'error' in rta
}

export function necesitaBanner(estado: EstadoActual): boolean {
  return estado.estado === 'trial' || estado.estado === 'gracia'
}

export function codigoAKey(codigo?: string): string {
  return `licencia.error.${codigo ?? 'red'}`
}
```

- [ ] **Step 4: Correr — PASS**

Run: `npx vitest run apps/desktop/src/renderer/src/lib/licencia-ui.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: `LoginView.tsx`** (estilo del repo: hooks, i18n, clases CSS propias)

```tsx
import { useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { api } from '../api'
import { esErrorLogin, codigoAKey } from '../lib/licencia-ui'

export function LoginView({ alListo }: { alListo: () => void }): JSX.Element {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function entrar(): Promise<void> {
    setCargando(true)
    setErrorKey(null)
    const rta = await api.licencia.login({ email, password })
    setCargando(false)
    if (esErrorLogin(rta)) {
      setErrorKey(t(codigoAKey((rta as { codigo?: string }).codigo)))
      return
    }
    alListo()
  }

  return (
    <div className="licencia-panel">
      <h1>Keryx</h1>
      <p className="licencia-sub">{t('licencia.loginTitulo')}</p>
      <label className="licencia-campo">
        <span>{t('licencia.email')}</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </label>
      <label className="licencia-campo">
        <span>{t('licencia.password')}</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {errorKey && <p className="licencia-error">{errorKey}</p>}
      <button className="licencia-boton" onClick={() => void entrar()} disabled={cargando || !email || password.length < 6}>
        {cargando ? t('app.loading') : t('licencia.entrar')}
      </button>
      <button className="licencia-enlace" onClick={() => void api.licencia.checkout()}>
        {t('licencia.comprar')}
      </button>
    </div>
  )
}
```

- [ ] **Step 6: `BloqueoView.tsx`**

```tsx
import { useI18n } from '@keryx/i18n'
import { api } from '../api'
import type { EstadoActual } from '@keryx/core/licencia'
import { mensajeDeEstado } from '../lib/licencia-ui'

export function BloqueoView({ estado, alListo }: { estado: EstadoActual; alListo: () => void }): JSX.Element {
  const { t } = useI18n()
  const mensaje = mensajeDeEstado(estado)
  return (
    <div className="licencia-panel">
      <h1>Keryx</h1>
      <p className="licencia-sub">{t(mensaje.clave as never, mensaje.vars as never)}</p>
      <button className="licencia-boton" onClick={() => void api.licencia.checkout()}>
        {t('licencia.renovar')}
      </button>
      <button className="licencia-enlace" onClick={() => void api.licencia.salir().then(alListo)}>
        {t('licencia.salir')}
      </button>
    </div>
  )
}
```

- [ ] **Step 7: `BannerLicencia.tsx`** (dentro del Shell, arriba de todo)

```tsx
import { useI18n } from '@keryx/i18n'
import type { EstadoActual } from '@keryx/core/licencia'
import { mensajeDeEstado, necesitaBanner } from '../lib/licencia-ui'

export function BannerLicencia({ estado }: { estado: EstadoActual }): JSX.Element | null {
  const { t } = useI18n()
  if (!necesitaBanner(estado)) return null
  const mensaje = mensajeDeEstado(estado)
  return <div className="licencia-banner">{t(mensaje.clave as never, mensaje.vars as never)}</div>
}
```

- [ ] **Step 8: Gate en `App.tsx`** — antes del return del Shell actual, añadir:

```tsx
const [vistaLicencia, setVistaLicencia] = useState<'cargando' | 'ok' | 'login' | 'bloqueo'>('cargando')
const [estadoLicencia, setEstadoLicencia] = useState<EstadoActual | null>(null)

useEffect(() => {
  void api.licencia
    .estado()
    .then((e) => {
      setEstadoLicencia(e)
      setVistaLicencia(e.estado === 'sin_licencia' ? 'login' : 'ok')
    })
    .catch(() => setVistaLicencia('login'))
}, [])

function aLogin(): void {
  setEstadoLicencia(null)
  setVistaLicencia('login')
}
```

y en el render, ANTES del render actual:

```tsx
if (vistaLicencia === 'cargando') return <div className="licencia-panel">{t('app.loading')}</div>
if (vistaLicencia === 'login') return <LoginView alListo={() => setVistaLicencia('ok')} />
if (vistaLicencia === 'bloqueo' && estadoLicencia) return <BloqueoView estado={estadoLicencia} alListo={aLogin} />
```

El bootstrap actual del Shell queda igual — se ejecuta solo cuando hay licencia (protege el arranque completo). Si `estadoLicencia.estado` pasa a `expirada`/`bloqueada` tras el `refrescar` del cron, la próxima llamada `api.licencia.estado()` del renderer decide; para la primera iteración basta el gate de arranque.

- [ ] **Step 9: i18n — añadir el bloque `licencia.*` a TODOS los locales (es fuente; en/pt traducción real; it/fr/de/zh copian el bloque traducido o el es si no hay traducción — seguir cómo manejan los locales existentes las claves nuevas)**

`packages/i18n/src/locales/es.ts`:

```ts
licencia: {
  loginTitulo: 'Entra con tu cuenta de Keryx',
  email: 'Correo electrónico',
  password: 'Contraseña',
  entrar: 'Entrar',
  comprar: 'Comprar suscripción',
  renovar: 'Renovar suscripción',
  salir: 'Cerrar sesión',
  estado: {
    sin_licencia: 'Entra con tu cuenta para usar Keryx.',
    trial: 'Prueba gratuita: te quedan {dias} días.',
    activa: 'Suscripción activa.',
    cancelada: 'Suscripción cancelada: puedes usar Keryx hasta el fin del ciclo.',
    gracia: 'Sin conexión: te quedan {dias} días de gracia.',
    expirada: 'Tu suscripción venció. Renueva para seguir usando Keryx.',
    bloqueada: 'Licencia de otro equipo. Cierra sesión en uno para activar este.'
  },
  error: {
    credenciales: 'Correo o contraseña incorrectos.',
    trial_agotado: 'Tu prueba terminó. Suscríbete para seguir usando Keryx.',
    limite_dispositivos: 'Límite de 3 equipos alcanzado. Cierra sesión en uno para activar este.',
    rate_limit: 'Demasiados intentos: espera un minuto.',
    sesion: 'Tu sesión venció. Entra de nuevo.',
    formato: 'Revisa el correo y la contraseña (mínimo 6 caracteres).',
    red: 'No se pudo conectar. Revisa tu internet.',
    red_de_fallback: 'No se pudo conectar. Revisa tu internet.'
  }
}
```

(en/pt/it/fr/de/zh: mismas claves; el bloque `error` en los demás locales traduce las 7 claves presentes en es menos `red_de_fallback` que es redundante — se copia igual a `red`. Quitar `red_de_fallback` y usar solo `red`.)

- [ ] **Step 10: CSS — añadir a `styles.css`**

```css
.licencia-panel { display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: center; min-height: 100vh; }
.licencia-sub { opacity: 0.75; }
.licencia-campo { display: flex; flex-direction: column; gap: 4px; width: 320px; }
.licencia-campo input { padding: 8px 10px; border: 1px solid var(--borde, #ccc); border-radius: 6px; background: transparent; color: inherit; }
.licencia-boton { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.licencia-boton:disabled { opacity: 0.5; cursor: default; }
.licencia-enlace { background: none; border: none; color: inherit; text-decoration: underline; cursor: pointer; }
.licencia-error { color: #c0392b; font-size: 13px; }
.licencia-banner { padding: 4px 12px; font-size: 12px; opacity: 0.85; background: rgba(127, 127, 127, 0.12); }
```

(si las variables de `packages/ui` tienen otro nombre para el color de borde, usar el que ya usen los componentes existentes).

- [ ] **Step 11: Verificar**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm test }`
Expected: 0 errores; 156 + tests nuevos PASS.

- [ ] **Step 12: Commit**

```bash
git add apps/desktop/src/renderer packages/i18n
git commit -m "feat: pantallas de login y bloqueo con banner de trial y i18n completo"
```

---

### Task 12: Script de claves + doc de config del pastor + batería final

**Files:**
- Create: `scripts/generar-claves-licencia.mjs`
- Create: `docs/licencias-config.md`
- Modify: `packages/core/src/licencia.ts` (BACKEND_URL/CHECKOUT_URL — solo si el pastor ya desplegó; si no, dejar vacío y documentar)
- Modify: `apps/desktop/src/main/clave-publica.ts` (solo si ya hay claves reales)

**Interfaces:**
- Consumes: `node:crypto generateKeyPairSync('ed25519')`.
- Produces: script que imprime (sin guardar en disco el PEM privado por defecto, solo `--archivo`):
  - `LICENCIA_PRIVADA` (PKCS8 PEM, para `wrangler secret put`)
  - `LICENCIA_PUBLICA` (SPKI PEM, para embeber en la app)
  - Doc con el checklist completo del pastor (Supabase SQL, Cloudflare secrets, Hotmart webhook del producto `8968763`).

- [ ] **Step 1: `scripts/generar-claves-licencia.mjs`**

```js
import { generateKeyPairSync } from 'node:crypto'

const par = generateKeyPairSync('ed25519')
const privada = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const publica = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()

console.log('=== LICENCIA_PRIVADA (solo para: npx wrangler secret put LICENCIA_PRIVADA) ===')
console.log(privada)
console.log('=== LICENCIA_PUBLICA (pegar en apps/desktop/src/main/clave-publica.ts) ===')
console.log(publica)
console.log('NUNCA guardes el PEM privado en el repo ni en el chat.')
```

Run: `node scripts/generar-claves-licencia.mjs`
Expected: imprime 2 PEM. El ejecutor NO los pega en el chat ni en archivos del repo (salvo la pública en `clave-publica.ts` si el pastor pide activarla ya).

- [ ] **Step 2: `docs/licencias-config.md`** — copiar del spec sección 8 con los datos reales:

```markdown
# Configuración de licencias (checklist del pastor)

Cuentas: Supabase `mxwdtlvbturopelyolli` · Cloudflare `c4010d4b7fa3981a6278aa49749734c7` · Hotmart producto `8968763`.

## 1. Supabase (una vez)

SQL Editor → ejecutar el SQL de la sección 6 del spec
(`docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md`):
tablas `suscripciones`, `usuarios`, `dispositivos`.
Copiar: Project URL y service_role secret (Settings → API). NO pegarlos en el chat.

## 2. Cloudflare (una vez)

1. `cd _backend && npx wrangler login`
2. `node scripts/generar-claves-licencia.mjs`
3. Secrets:
   - `npx wrangler secret put HOTTOK` (el hottok de Hotmart, paso 3)
   - `npx wrangler secret put SUPABASE_URL`
   - `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY`
   - `npx wrangler secret put LICENCIA_PRIVADA`
4. `npx wrangler deploy` → anota la URL (ej. `https://keryx-licencias.tu-subdomain.workers.dev`)
5. Pegar esa URL en `packages/core/src/licencia.ts` (BACKEND_URL) y el PEM
   público en `apps/desktop/src/main/clave-publica.ts`; correr batería + commit.

## 3. Hotmart (producto 8968763)

1. Herramientas → Webhook (API y notificaciones) → + Registrar webhook.
2. Eventos: "Compra aprobada/completada" + "Reembolso/Cancelación".
3. URL de destino: `https://<worker>.workers.dev/webhooks/hotmart`
4. Copiar el token (hottok) → usarlo en el secret HOTTOK del paso 2.
5. Área de miembros externa: usar la URL del checkout/descarga de la app.

## 4. Prueba extremo a extremo (con tarjeta real)

1. Comprar la suscripción → esperar aprobación.
2. Abrir Keryx → login con el email de la compra → debe entrar con estado activa.
3. Webhook de renovación (simular o esperar ciclo) → `expira_at` se re-fecha.
4. Cancelar/reembolsar en Hotmart → la app muestra bloqueo en el siguiente arranque.
5. Reactivar → la app vuelve a activa. Los datos locales nunca se pierden.
```

- [ ] **Step 3: Batería final obligatoria**

Run: `npm run typecheck; if ($?) { npm run lint }; if ($?) { npm test }; if ($?) { npm run eval }; if ($?) { npm run eval:trad }`
Expected: 0 fallos en TODO (evals 9.0/9 y 0/4 lenguas intactos).

- [ ] **Step 4: Commit de cierre**

```bash
git add scripts/generar-claves-licencia.mjs docs/licencias-config.md docs/superpowers/plans/2026-11-14-licencias-hotmart.md
git commit -m "docs: script de claves Ed25519 y checklist de configuracion de licencias"
git push
```

---

## Cobertura del spec (self-review)

- Sección 2 (arquitectura): Tasks 1-6 (backend) + 10 (puente).
- Sección 3 (webhook): Task 3. Login: Task 4. Activar/refrescar/desactivar: Task 5. Router+rate limit: Task 6.
- Sección 4 (app): Task 7 (verificar/huella), 8 (almacén cifrado), 9 (orquestador + cron 24h), 10 (IPC/preload/main), 11 (pantallas + estados).
- Sección 5 (seguridad): Ed25519 T7/T10; bcrypt T4; secrets solo en Worker T12; rate limit T6; token cifrado T8.
- Sección 6 (SQL): Tasks 3 y 12 (SQL con tabla `usuarios` añadida en el spec por T3; doc del pastor T12).
- Sección 7 (testing): cada task TDD; batería completa T12.
- Sección 8 (checklist): Task 12.
- Fuera de alcance (sección 9): nada de lo excluido aparece en los tasks.

