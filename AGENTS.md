# AGENTS.md — Contexto para IAs (leer antes de tocar código)

> Última actualización: 2026-11-01 · Etapa vigente: **E4.4/E4.5 — Biblioteca
> clásica EN + motor zCom4** (día 32) · Versión del paquete: `0.4.0`
> (ver `docs/etapas.md` para el mapa completo de etapas).

## 1. Qué es Keryx

App de escritorio (GPL-3.0) de **estudio bíblico y escritura en español**:
motor e-Sword (SQLite vía `node:sqlite`) + SWORD opcional, estudio con paneles
sincronizados estilo e-Sword, editor minimalista tipo iA Writer y un
**asistente híbrido** donde sub-agentes de CÓDIGO (0 tokens) minan 717 módulos
reales y la IA solo redacta encima de un dosier citado.

Nombre: κῆρυξ = heraldo.

## 2. Stack y versiones instaladas (no instalar otras)

| Componente | Versión | Nota |
|---|---|---|
| Electron | **37.10.3** | con `node:sqlite` experimental (usado por `packages/db`) |
| electron-vite | 5.0.0 | build main/preload/renderer |
| Vite | 7.3.6 | renderer |
| React | **19.3** | StrictMode, hooks |
| TypeScript | ~5.9 | tsconfig estricto desde `tsconfig.base.json` |
| Zod | 4.6 | validación de todos los canales IPC |
| Zustand | 5.0 | estado UI |
| Vitest | 5.0 | `npm test` (138 tests) |
| ESLint | 9 + typescript-eslint 8 | flat config |
| Node runtime | probado con Node 24 | requerido 20+ por README |

Solo Electron + React + Zod + Zustand: sin Redux, sin Tailwind, sin
i18next (i18n propio en `packages/i18n`), sin better-sqlite3 (usa `node:sqlite`
nativo).

## 3. Arquitectura (separación estricta de procesos)

```
apps/desktop/                 # main + preload + renderer (React)
packages/
  core/                       # tipos, contratos IPC, schemas Zod, layouts
  sword/                      # providers e-Sword/SWORD, búsqueda, Strong, cifrado
  db/                         # node:sqlite + keryx-store.json (ajustes/layout)
  ui/                         # tokens de diseño y temas
  editor/                     # CodeMirror 6 (enfoque, typewriter, markdown)
  i18n/                       # es / en / pt (provider propio)
  templates/                  # plantillas + generador de bosquejos
biblioteca/                   # 717 módulos e-Sword REALES (se escanean, no se copian)
esword/  sword/               # raíces de módulos adicionales (opcional)
scripts/                      # eval-sermons.mts, download-sword.mjs, pdf_to_esword.py
docs/                         # evolucion-y-logos.md, etapas.md, resumen-app.md
```

Flujo de datos: renderer → IPC tipado con Zod (`{ ok, data | error }`) → main
procesa con providers SQLite/SWORD → respuesta. Los módulos NUNCA se copian ni
convierten: `EswordProvider` escanea `biblioteca/` (recursivo) + `esword/` +
`sword/` en ~270 ms.

## 4. Estado actual (dónde estábamos → dónde estamos)

Detalles completos por etapa: **`docs/etapas.md`** (obligatorio leerlo si vas a
trabajar en el Asistente, Guía del Pasaje o SermonEngine).

Síntesis en una línea por hito:

- **E0 (2025)**: esqueleto Electron+React, lector demo, sin biblioteca real.
- **E1**: motor e-Sword real (SQLite), Biblioteca con 717 módulos ES, Lector
  con comparación paralela.
- **E2 (2026-10-11)**: Estudio avanzado — plantillas de layout, splitters
  persistentes, sincronía de versículo, acordeón de comentarios con rangos,
  diccionario por clic-palabra con `normTopic`, chips ℹ de cobertura,
  Strong# clicables.
- **E3**: sub-agentes de código (dosier de 17 secciones, ~390 ms, 0 tokens),
  Guía del Pasaje, ranking pesado de comentarios, Walton-Keener, teología
  sistemática + historia, paralelos Lambert.
- **E4 (vigente, 2026-10-12/13)**: Registro de herramientas tipado (`swordTools.ts`),
  gap-analysis con 2ª pasada dirigida en `buildDossier`, SermonEngine con AST
  inmutable (`buildSermonDocument`/`renderSermon`, huecos imposibles), modo
  economía + deepSermon (borrador→crítico→final), 12 oradores con perfil,
  exégesis BDAG-lite por Strong# en ExegesisCard, export .doc/.md/Copiar,
  evals medibles `npm run eval` — **9.0/9, 0 fallos, 5 pasajes dorados**.
  E4.2: comparativa del Lector completa — apilado Logos para 4/6, llenado
  por metodología experta (`expertPlan`: contrasta el polo opuesto a la
  base; RV60↔NVI, +NTV/LBLA, +Amplificada, +original) y chips de perfil de
  traducción (formal/dinámica/paráfrasis/ampliada/original) anotados en el
  init vía `annotateProfiles`.
  **E4.3 (2026-10-22)**: lenguas nativas completas — verso verificado via
  `node:sqlite` en el main (instantáneo, sin bloqueos del daemon), AT Guaraní
  GDC2006 fusionado en corpus (+22.666 versos), Guaraní neural `grn_Latn`,
  daemon con hilos workers (status instantáneo bajo carga), watchdog +
  banner auto-sanador, barra de progreso por idioma, comparativa por columna
  (Base corpus / demás su propio texto), Guía e Inspiración traducidas,
  evals `npm run eval:trad` chrF++/BLEU-4 4/4 PASS.
  **E4.4 — salud del traductor (2026-10-25)**, día 25:
  - **Indicador de carga ms** en los chips de idioma (mayores y nativos,
    `formatoDuracion`, tick 100 ms, precargas de fondo `{ silencioso: true }`).
  - **Cache de traducciones nunca guarda identidad**: si el motor devuelve el
    original, no se cachea (main + renderer) — jamás un idioma "pegado".
  - **Daemon**: `CANDADO_INIT` es `RLock` (deadlock del primer lote
    resuelto); fallo = `ok:false` (NO identidad); escalera de rescate
    beam 4 → beam 1 → beam 2 + `repetition_penalty` 1.2 → identidad; guard
    anti-colapso con triple repetición consecutiva; el rescate re-infiere
    SOLO las filas malas (nada de re-lotes completos — causa del "192 s").
  - **Quechua activo**: `DIALECTO_A_SPEC` usa dirs reales (`nllb-qu`,
    `m2m-es-arn`), no nombres fantasmas; bengalí/aymara/guaraní por corpus.
  - **Náhuatl y Maya yucateco REMOVIDOS** del registro (NLLB no los cubre,
    `<unk>` verificado; decisión del pastor) — `descubrirLenguas()` los
    re-activará si llega `corpus/nah.db` o `corpus/yua.db`.
  - Verificación del día: 138/138 tests, eval:trad 4/4 (arn 16.9 → 20.2
    chrF++, sin datos 3 → 0). Cache envenenada limpiada (7.417 entradas
    identidad; backup `.bak` junto a `cache-traducciones.json`).

### Planes guardados para la próxima semana (ver docs/bitacora.md)

1. **Fase 2 — Licencias Hotmart**: login email+contraseña, backend
   Cloudflare Workers + Supabase (gratis), JWT Ed25519, trial 7 días +
   gracia 7 días, máx 3 dispositivos; app bloqueada al expirar sin borrar
   datos. `POST /webhooks/hotmart` valida hottok y actualiza `expira_at`.
2. **Fase 3 — Mac sin firmar**: CI GitHub Actions `macos-latest` →
   `npm run build:mac` (DMG arm64+x64, `identity: null`) → GitHub Releases +
   instrucciones Gatekeeper (`docs/distribucion-mac.md`).
3. **Hardening pre-comercial** (6 cierres): bug `instalar_dialectos.py` en
   extraResources, CI obligatorio push/PR, backup de `keryx-store.json`,
   handlers `uncaughtException`, CSP/sandbox/openExternal + 3 canales IPC
   sin validar, daemon empaquetado con PyInstaller.
4. **Cambio A — clásicos EN al dosier** (día 32, bitácora): los 10 módulos
   EN en `biblioteca/` + TDavid ya leen, pero el dosier filtra es. Abrir
   filtro de idioma en `buildDossier` (Sub A) + par en→es en el daemon
   (Sub B) + nota "traducción automática" en las citas; evals (eval +
   eval:trad) en 0 fallos. Salvaguarda: traducción fallida ⇒ sin cita.
   Con 2 sub-agentes + integración serial: ~4-5 h.

## 5. Principios no negociables (romper uno = regresión)

1. NADA va al prompt de IA sin cita `[Módulo · entrada]`.
2. Si un módulo no da el dato, la sección no existe; JAMÁS rellenar con texto.
3. El minado de datos es SIEMPRE de código (0 tokens). La IA solo redacta la voz.
4. El AST del sermón (`buildSermonDocument`) es inmutable: la IA solo llena
   slots de voz; estructura y evidencia son de código.
5. Cada cambio en el motor se valida con `npm run eval` (9.0/9 vigente)
   y `npm run eval:trad` (4/4 lenguas).
6. `npm run eval` y `npm run eval:trad` deben mantenerse en 0 fallos antes
   de cualquier commit de features.

## 6. Comandos

```bash
npm run dev            # electron-vite (main+preload+renderer) — ventana Electron
npm run typecheck      # tsc --noEmit (workspace desktop)
npm run lint           # eslint .
npm run test           # vitest run (138 tests: anti-alucinación + engine + export + métricas)
npm run eval           # evals de golden passages — DEBE dar 9.0/9
npm run eval:trad      # evals de traducción es→nativa contra el daemon — DEBE dar 0 fallos
npm run build:win      # instalador Windows
```

## 7. Convenciones del repo

- COMMITS: mismo estilo que `git log`: `feat:`, `fix:`, `docs:`, `chore:`,
  `perf:` en español, sin cuerpo largo.
- Sin comentarios en el código salvo que se pidan.
- Español como idioma de historia de usuario i18n (la fuente es `es`);
  `en` y `pt` se agregan juntas al añadir claves en `packages/i18n`.
- Un mismo título en varias categorías e-Sword levanta con sufijo
  " (Comentario)" / " (Diccionario)" — no deduplicarlos.
- `keryx-store.json` (userData) es la única persistencia de ajustes: escritura
  atómica, clave `study.*` guarda layout completo del Estudio.

## 8. Datos y tamaños medidos

- `biblioteca/` = ~4,5 GB / 726 módulos verificados en disco (96 Biblias,
  89 comentarios — incluye 10 clásicos EN de dominio público raíz: Clarke,
  Barnes, Gill, Wesley, Pulpit, Spurgeon, Lange, Nicoll, ECF, ANF —,
  119 diccionarios, 422 libros) · escaneo completo ~270 ms.
  Fuentes de la descarga del día 32 (zips SI-*.cmti.zip, respaldo) en
  `esword/clasicos-src/si-zips/`; OCR crudo de Lange en
  `esword/clasicos-src/lange/` (ya no hace falta: hay módulo instalado).
- `sword/` = ~0,74 GB (opcional; incluye `TDavid`/) · código de la app ~11 MB ·
  repo total ~8,7 GB.
- Lector zCom4: fix día 32 — índices de verso de 12 bytes (`readers.ts`
  `entrySize`); sin él los comentarios zCom4 listan pero no leen.
- Dosier por pasaje: 15–21 secciones, 25–43 citas, ~400–1000 ms, 0 tokens IA.
- Latencia de cobertura ℹ: ~20 ms (comentarios), ~135 ms (diccionarios).
