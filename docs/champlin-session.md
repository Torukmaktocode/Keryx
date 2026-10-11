# Champlin AT — Resumen de sesión (compacto)

## Objetivo
- Poner a funcionar en el app los 7 tomos de "Comentario Bíblico Champlin – Antiguo Testamento" (PDFs en `Enciclopeia Champlin\Comentario AT\`, ya traducidos PT→ES en `esword\ChamplinAT1-7.dctx`).
- **Fase 1 (actual):** generar índice completo de tópicos por versículo (`Verses` + `esword\index\champlin-at.json`) para los 929 capítulos del AT.
- **Fase 2 (pendiente):** canal IPC `champlin.index`, paneles en `StudyView` y strings i18n.

## Detalles importantes
- Parser en `scripts/champlin_verse_index.py`: layout por página (columna en x<310), header de página y<55 como alias del libro activo, switch de libro por streak de headers (≥2, con cold-start de 1 si no hay libro previo), saltos de capítulo restringidos (n-1/n/n+1, o explícitos vía `CAPITULO n`), capítulos fuera de rango → stash `_pending` y rehidratación.
- Formato PDF: anclas de versículo en líneas exclusivas (`5.3`, `5.5,6`, `5.9-11`), rangos `(3.1-24)`, títulos `CAPITULO N`, intro del libro → capítulo 0.
- Workflow: `python scripts/champlin_verse_index.py --vol N [--dump CODE] [--check]` — escribe tabla `Verses` con `scan_name='CHAMPLIN-AT-N'` (una fila `{chapter, verse, topic}` por bloque, `verse 0` = intro), JSON índice, y `--check` contra capítulos esperados (total 929).
- Comandos largos: la consola parece congelada pero sigue trabajando; usar redirección `*> "$env:TEMP\opencode\vN.log"` con timeout generoso (1800s) y leer el log al terminar. Un tomo tarda ~2.5 min.
- Copyright: el comentario Champlin tiene copyright (las traducciones bíblicas no); prohibido reproducir pasajes extensos; el trabajo se limita al código del parser.

## Estado
### Completado (Fase 1 — 11 oct 2026)
- Cobertura **929/929 capítulos (100%)**, 0 pendientes sin resolver. Índice completo en `esword/index/champlin-at.json` (39 libros; 2Sam 24 caps, Job 42 caps, 1Cr 8 presentes).
- Raíces de los gaps: headers OCR `Il SAMUEL` (=2 Samuel) y `JÃ` (=JÓ, 174 págs. en v3) nunca matcheaban; el título del mapa "AS CIDADES LEVÍTICAS ... ENTRE JOSUÉ 21" (franja superior de v3 p.131-133) etiquetaba `Josh` y se perdían las páginas de 1Cr 8.
- Fixes: aliases OCR en `BOOK_ALIASES` (`IL SAMUEL`/`II SAMUEL`, `Job: ["JOB","JA","JO"]`); fallback de tokenslimitado a headers ≤4 tokens; `--dry-run` para diagnóstico sin escribir; `--vol` multi-tomo con `ProcessPoolExecutor` (5 tomos ≈18 min → ~10 min wall, actual ran 1079s con check incluido).
- Diagnóstico rápido nuevo: `scripts/champlin_headers.py --vol N [--page a-b]` escanea solo la franja y<55 con clip y lista strings de header con rangos de páginas.
- **Fase 2 completa:** pasarela índice↔UI terminada (ver abajo). lint/typecheck/42 tests OK.

### Fase 2 — archivos
- `packages/core/src/types.ts`: `ChamplinBlock`, `ChamplinIndex`.
- `packages/core/src/schemas.ts`: `champlinBlockSchema`, `champlinIndexSchema` (gener Studio required).
- `packages/core/src/channels.ts`: `champlinGet: 'champlin:get'`.
- `packages/core/src/api.ts`: `KeryxApi.champlin.get()`.
- `apps/desktop/src/main/ipc.ts`: handler carga + valida `esword/index/champlin-at.json` (cache perezosa; null si no existe/corrupto).
- `apps/desktop/src/preload/index.ts` + `apps/desktop/src/renderer/src/lib/api.ts`: `api.champlin.get()`.
- `apps/desktop/src/renderer/src/components/ChamplinPane.tsx`: acordeón verse-by-verse (usa `dict.lookup` por `p.NNNN` sobre módulo `ChamplinAT{vol}`; auto-expand del rango que cubre el versículo, scroll-into-view, cache de index y de topics, botón enviar al editor).
- `StudyView.tsx`: pane al tope con clase `has-champlin` cuando el capítulo actual tiene bloques.
- `styles.css`: grilla 4 columnas + estilos acordeón.
- i18n: `study.champlin.title/intro/empty` en es/en/pt.
- `electron-builder.yml`: `extraResources` de `esword/index` → recursos empaquetados.

## Fase 1 — detalles técnicos
- `RecursionError` en `to_int` (~línea 156): fallback recursivo → iterativo (decenas/unidades de numerales multi-palabra).
- `build_index` con dedupe: una entrada por (código libro, capítulo, topic); conserva primer versículo o prefiere versículo ≠ 0; salida ordenada por topic, luego verse. 0 pendientes sin resolver.
- `dump()`: nuevo `resolve_code(raw)` (match case-insensitive contra códigos de BOOKS; antes `code.upper()` fallaba con códigos de 3 letras como `Gen`).
- Cold-start del streak: `count >= 1 and code != self.book and (self.book is None or self.book != code)` — recupera páginas de intro huérfanas.
- Vol 1 verificado: 5083 entradas / 31 pendientes; switches exactos: p.0026 None→Gen, p.0318 Gen→Exod, p.0494 Exod→Lev, p.0614 Lev→Num; cobertura completa Gen 1-50, Exod 1-40, Lev 1-27, Num 1-36.
- `--check` completo (5 tomos): 5083/31, 4912/18, 3795/13, 4375/16, 6103/47 (entradas/pendientes); **862/929 capítulos (92.8%)**, 4899 bloques anclados a versículo, 5903 páginas indexadas.
- Perf: layout ~0.2s/página, regex sin backtracking catastrófico.

### Activo
- Depurar los 67 capítulos faltantes: **2Sam 24 (tomos 2)**, **Job 42 (tomo 3)**, **1Cr cap. 8**.
- 2Sam diagnosticado: en tomo 2 el log muestra `1Sam -> 1Kgs` en p.0579 sin transición a 2Sam — las páginas de 2Sam quedan etiquetadas como 1Sam (capítulos 13+ van a `_pending` y se pierden). Probable alias `2SAMUEL`/`1SAMUEL` sin match en `HEADER_NAME_RE`/mapa, o headers ilegibles (1Sam aparece completa porque las páginas de 2Sam la infla).
- La causa en tomo 3 (1Kgs→Job) quedó sin diagnosticar: el comando combinado (tomos 2 + 3) cayó por timeout a mitad del tomo 3 y no produjo el log.
- Importante: el último `--vol 2` **pisó** `esword/index/champlin-at.json` con datos solo del tomo 2; tras arreglar, re-generar todo con `--check`.

## Próximo paso
1. Correr solo el tomo 3 redirigido: `python scripts/champlin_verse_index.py --vol 3 *> "$env:TEMP\opencode\v3.log"` y revisar el log de switches (verificar alias `2SAMUEL` entre ~p.363-579 del tomo 2, y manejo de `JOB` en el límite 1Reyes→Job del tomo 3).
2. Arreglar alias faltantes, re-correr `--check` completo objetivo ≥99% (1Cr 8 quizá no exista realmente), restaurar `champlin-at.json` completo y pasar a Fase 2.

## Fase 2 (pendiente)
- Canal IPC `champlin.index`: `packages/core/src/channels.ts`, `packages/core/src/schemas.ts`, `packages/core/src/api.ts`, `apps/desktop/src/main/ipc.ts` (handler que carga `esword/index/champlin-at.json`).
- `apps/desktop/src/preload/index.ts` + `apps/desktop/src/renderer/src/lib/api.ts` — exponer `api.champlin.get`.
- `apps/desktop/electron-builder.yml` — `extraResources` para el JSON de índice.
- Acordión `ChamplinPane` en `apps/desktop/src/renderer/src/views/StudyView.tsx` (prioridad al tope, sync ↑/↓ de versículo seleccionado, `sendToWriting`, i18n en `packages/i18n/src/locales/{es,en,pt}.ts`).

## Archivos relevantes
- `scripts/champlin_verse_index.py` — parser/core de Fase 1, en depuración
- `Enciclopeia Champlin\Comentario AT\Comentario de Champlin AT V.1..7.pdf` — PDFs fuente
- `esword\ChamplinAT1-7.dctx` — módulos e-Sword ya traducidos; tabla `Verses` la escribe el script
- `esword\index\champlin-at.json` — índice; **actualmente solo contiene datos del tomo 2**
- `$env:TEMP\opencode\v2.log`, `runfull.log` — logs anteriores; `v3.log` aún no existe
