# Biblioteca nueva + Modo Estudio rediseñado + limpieza Champlin

> **Para agentes:** implementar tarea por tarea con checkboxes. Ejecutado inicialmente en
> `docs/superpowers/plans/2026-10-11-biblioteca-estudio.md` (esta copia).

**Goal:** Integrar los ~800 módulos reales de `biblioteca/` (96 Biblias, 79 Comentarios,
120 Diccionarios, 422 Libros), rediseñar el Modo Estudio (paneles con menú por zona,
plantillas de layout, columnas arrastrables, sincronía de versículo estilo e-Sword,
marcas Strong#) y retirar todo lo de Champlin que quedó frágil.

**Architecture:** `EswordProvider` multi-root (escanea `biblioteca/*` recursivo a 2
niveles; `esword/` queda vacío). El Modo Estudio usa un layout engine en el appStore
(`studyPanes/studyWidths/studyTemplate`) con paneles intercambiables
`bible | commentary | dictionary | book`, el acordeón de comentarios generalizado a
`.cmti` reales vía `commentaryVerses()`, y `navVerse` como única fuente de verdad.

**Tech Stack:** Electron 37, React 19, TypeScript, node:sqlite, vitest, zod, i18n es/en/pt.

## Especificaciones aprobadas por el usuario
1. Escaneo directo de `biblioteca/` (sin copiar archivos, sin `.rar`).
2. Limpieza: borrar módulos esword/ viejos + `esword/index/` + scripts py Champlin +
   código del app (IPC, ChamplinPane, i18n, package.json, extraResources). PDFs de
   `Enciclopeia Champlin/` y `sword/` quedan en disco sin usarse.
3. El acordeón verse-por-verse se generaliza a comentarios `.cmti` reales.
4. Paneles con menú completo (módulo, cambiar tipo, pin de sincronía, ampliar, cerrar)
   + botón `+` para restaurar cerrados.
5. Layout: plantillas elegibles (completo/lectura/comparar/libros/custom) + anchos
   arrastrables persistidos.
6. Marcas = sincronía de versículo (chip/resaltado en todos los paneles) + Strong#
   visibles clicables con toggle en settings.

## Tasks
- [x] Task 0: limpieza (módulos, scripts, código, i18n, package.json, extraResources)
- [x] Task 1: multi-root scan (`EswordProvider(roots[])`, recursivo 2 niveles, dedupe,
      `SwordModule.source`, `resolveBibliotecaPath()` en main)
- [x] Task 2: detección Topical/.refi (`dictTable` += `/topical|book|article/i`)
- [x] Task 3: `commentaryVerses(module, book, chapter): number[]` + IPC
      `bibleCommentaryVerses` + `api.bible.commentaryVerses`
- [x] Task 4: settings zod + AppSettings (`bibliotecaEnabled, showStrongs, studyTemplate,
      studyWidths, studyPanes, studyClosed, studyModules, paneSync`)
- [x] Task 5: `lib/studyLayout.ts` (TEMPLATES/clampWidth/applyTemplate),
      `PaneSplitter.tsx`, `PaneShell.tsx`
- [x] Task 6: StudyView rewrite (flex + splitters + `paneContent(kind)` + acordeón
      generalizado + fallback de módulos inexistentes)
- [x] Task 7: marcas Strong CSS `.show-strongs w[data-strong]::after` + toggle
- [x] Task 8: LibraryView tabs `Todos|Biblias|Comentarios|Diccionarios|Libros` + acciones
- [x] Task 9: i18n es/en/pt
- [x] Task 10: verificación (vitest, typecheck, lint, dev smoke)
