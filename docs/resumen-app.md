# Keryx — Resumen de la aplicación y sus flujos (octubre 2026)

Documento mapa: qué tiene hoy la app, cómo está construida y qué flujo sigue el
usuario. La referencia rápida de comandos vive en `README.md`; el plan original,
en `PLAN.md`; el mapa de etapas E0→E4, en **`docs/etapas.md`**; el contexto para
IAs, en `AGENTS.md`.

## 1. Vista general

Keryx es una app de escritorio (Electron 37 + React 19 + TypeScript) para:

- **Leer la Biblia** desde una biblioteca de **717 recursos e-Sword en
  español** (96 Biblias, 79 comentarios, 120 diccionarios y léxicos, 422
  libros) + módulos SWORD de CrossWire opcionales.
- **Estudiar** con paneles sincronizados al estilo e-Sword (sincronía de
  versículo, marcas ℹ de qué módulos hablan del pasaje, acordeón de
  comentarios, diccionario con un clic en la palabra).
- **Predicar/escribir** con editor minimalista (iA Writer), plantillas y
  asistente de consulta, con export MD/HTML.

## 2. Módulos y motor

### Escaneo (biblioteca/)
`EswordProvider` (`packages/sword/src/local/esword.ts`) escanea `esword/`
(principal, plano) + `biblioteca/` (recursivo 2 niveles, por categorías) en
~270 ms para ~717 archivos. De cada módulo lee:

- `Details`: título/abreviatura → etiqueta de UI; idioma de `Details.Language`
  si existe.
- Biblias: tabla `Bible(Book, Chapter, Verse, Scripture)`.
- Comentarios e-Sword 2009: `VerseCommentary(Book, ChapterBegin, VerseBegin,
  ChapterEnd, VerseEnd, Comments)` **con rangos no expandidos** (una entrada
  por `VerseBegin`; buscar un versículo devuelve la entrada que lo *cubre*),
  `ChapterCommentary(Book, Chapter, Comments)` y `BookCommentary(Book,
  Comments)` (el acordeón muestra esos niveles como "Introducción").
- Diccionarios: `Dictionary(Topic, Definition)` con resolución tolerante del
  tema (exacto NOCASE → prefijo LIKE → **normalización en JS** sin acentos,
  numeración inicial "01." y prefijo `\b`), y `Reference(Chapter, Content)`
  para libros `.refi` (elegidos del predicador / enciclopedias).
- Búsqueda: LIKE pre-filtrado + filtro real multi-palabra (AND en cualquier
  orden, sin acentos, palabra completa) en `search.ts`; Strong# al vuelo
  (`<w data-strong>`).
- Marcas de cobertura: `commentaryCoverage(book, chapter)` (una query
  indexada por comentario, ~20 ms para toda la biblioteca) y
  `dictCoverage(term)` (con índices Topic).

Un mismo título puede existir en varias categorías (ej. "Biblia de Estudio
MacArthur" como comentario `.cmti` y diccionario `.dcti`): levantan como
módulos separados con sufijo " (Diccionario)" / " (Comentario)" para que los
buscadores por nombre y la UI no los confundan.

### IPC (canales principales)
`module:list/refresh/…`, `bible:books|chapter|verse|commentary-verses|
commentary-coverage|search|compare`, `dict:lookup|strongs|coverage`,
`documents:*`, `settings:*`, `ai:*`, `window:*`, `app:*`. Schemas Zod en
`packages/core/src/schemas.ts`; respuestas `{ ok, data | error }`.

### Ajustes persistentes (packages/db)
Tema, tipografías y editor; `priorityModules` (estrella); `showStrongs`;
`bibliotecaEnabled`; y el **layout completo del estudio**: `study.template |
panes | widths | closed | sync | modules` — guardado en
`userData/keryx-store.json` con escritura atómica.

## 3. Vistas y flujo

### Biblioteca (`LibraryView.tsx`)
- Pestañas `Todos(717) | Biblias(96) | Comentarios(79) | Diccionarios(120) |
  Libros(422)` + caja de filtro por nombre; cada módulo muestra categoría e
  idioma.
- Acciones: **Abrir en Estudio** (coloca el módulo en el panel correspondiente
  y cambia a Estudio), **Abrir en Lector** (biblias) o leer la entrada en la
  propia vista (buscador de términos + visor).

### Lector (`ReaderView.tsx`)
Lectura simple: selector de biblia ordenado por idioma, navegación
`←/→` de capítulo, salto por referencia, comparación paralela de biblias.

### Estudio (`StudyView.tsx` + PaneShell/PaneSplitter/CommentaryAccordion)
- **Layout**: plantillas (`completo`, `lectura`, `libros`, `investigar`,
  `custom`) con paneles `bible | commentary | dictionary | book`. Los anchos
  guardados se renormalizan exactamente al ancho medido del contenedor
  (`normalizedWidths`); separadores arrastrables por par con persistencia al
  soltar, doble clic restaura el peso; apilado responsivo ≤ 1100 px.
- **Menú por panel** (componente `PaneShell`): módulo de su categoría,
  "cambiar tipo de panel" (los 4 tipos), fijar/soltar sincronía (pin),
  cerrar; botón `+` reabre cerrados; chip de referencia sincronizada
  `Libro cap:vers` con indicador de sincronía (`verse-mark`).
- **Panel Biblia**: resaltado del versículo activo, Strong# visibles y
  clicables cuando el módulo las trae (interruptor en Ajustes), **clic en una
  palabra → diccionario** (además del doble clic), navegación con teclado
  (`↑/↓` versículo, `←/→` capítulo).
- **Panel Comentario**: acordeón de las entradas del capítulo del comentario
  activo (anclas `VerseBegin` + Introducción), auto-apertura de la entrada
  que **cubre** el versículo; carga perezosa con caché.
- **Panel Diccionario**: búsqueda manual, clic en palabra, resultado
  render (RTF/HTML del provider), fallback Strong (`G26/H430`) cuando el
  módulo no los trae, y re-búsqueda automática al cambiar de diccionario.
- **Marcas ℹ (estilo e-Sword)**: barra superior con chips
  `Habla de {Libro cap}` (comentarios con contenido del capítulo y nº de
  versos cubiertos) y `Diccionarios con "{término}"`; un clic abre ese módulo
  en su panel.
- **Hermenéutica**: pestaña con guía interactiva (observación / interpretación
  / aplicación) que se envía al editor.

### Escritura + plantillas + consulta
- Editor CodeMirror 6 minimalista: modo enfoque, typewriter, conteo de
  palabras/lectura, autoguardado atómico, export MD/HTML.
- Plantillas: sermón (10 secciones), estudio devocional, guía paso a paso.
- Asistente de consulta (4 preguntas) → bosquejo inicial en el editor.
- **Enviar al editor**: pasaje + comentario actual → documento activo (o crea
  uno nuevo) con notificación.

## 4. Flujo tipo (preparar una prédica)

```
Biblioteca → (biblia + comentario, ej. MacArthur) → "Abrir en Estudio"
      ↓
Estudio → plantilla "Estudio completo" → navegar versículos (↑/↓)
      ↓                          ↓ (marcas ℹ)
clic en palabra → diccionario   saltar al comentario que cubre el verso
      ↓
"Enviar al editor" → Escritura (pasaje + comentario en el borrador)
      ↓
Plantillas / Consulta (4 preguntas) → bosquejo → redacción → export MD/HTML
```

## 5. Estado de calidad

- `npm run typecheck` / `lint` / `test` limpios (70 pruebas: fixtures
  multi-raíz, esquemas e-Sword 2009, búsqueda normalizada, sub-agentes,
  SermonEngine, deepSermon, export).
- **Evals medibles**: `npm run eval` — 5 pasajes dorados con score automático
  (cobertura por género, citas ≥5, presupuesto, sin marcadores, slots
  completos): **9.0/9, 0 fallos** con la biblioteca real.
- Biblioteca real verificada: 717 módulos en ~270 ms; dosier completo en
  ~0.5-1.2 s (evangelio/epístola/salterio/parábola/texto-libre); exégesis
  concordada por Strong# con sentidos y ocurrencias reales.

### Arquitectura del generador de sermones (oct-2026)

- `lib/swordTools.ts` — registro tipado de herramientas + cache intra-build.
- `lib/agents.ts` — sub-agentes en paralelo + **gap-analysis con 2ª pasada
  dirigida**; dosier citado `[Módulo · entrada]`.
- `lib/sermonEngine.ts` — AST inmutable del sermón (`buildSermonDocument`)
  + `renderSermon` determinista; slots con fallback garantizado (con o sin
  IA el documento está completo).
- `lib/creator.ts` — modos: economía (IA solo voz, 1 llamada corta) y
  `deepSermon` (borrador→crítico→final); 12 oradores con perfil completo
  + "Ninguno — mi propio estilo"; localización por texto libre con puntaje
  multi-palabra; fuentes ancladas SIEMPRE al final.
- `lib/exportDoc.ts` — export .doc/.md/Copiar (Asistente y Guía).

## 6. Histórico relevante (docs/)

- `AGENTS.md` — contexto para IAs (estado vigente, stack, principios).
- **`docs/etapas.md`** — mapa E0→E4 con métricas y verificación por etapa.
- `PLAN.md` — visión y decisiones del proyecto original.
- `docs/champlin.md`, `docs/champlin-session.md` — historial del experimento
  Champlin (retirado en oct-2026; los PDFs quedan en disco, fuera del escaneo).
- `docs/superpowers/plans/2026-10-11-biblioteca-estudio.md` — plan ejecutado
  de biblioteca + rediseño del estudio (todas las tareas marcadas hechas).
- `docs/superpowers/plans/2026-10-11-superar-logos-sermones.md` — plan de
  sermones (T1-T6 ejecutados).
- `docs/evolucion-y-logos.md` — evolución y comparativa vs Logos/ChatGPT/
  Claude/Gemini.
