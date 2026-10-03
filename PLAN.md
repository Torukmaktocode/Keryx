# Keryx — Plan de proyecto

> App de escritorio multiplataforma, open source (GPL-3.0), de estudio bíblico y
> escritura. Motor **SWORD** completo, **modo escritura minimalista tipo iA Writer**
> y **modo estudio elegante tipo e-Sword**, más un **modo predicación guiado**.

---

## 1. Visión

Keryx (κῆρυξ = heraldo) es una aplicación para:

- Ver **todas** las Biblias, enciclopedias y diccionarios disponibles en SWORD
  (griego, hebreo, latín, inglés, español, portugués, etc.).
- Escribir en un **modo minimalista** inspirado en iA Writer.
- Estudiar en un **modo avanzado** inspirado en e-Sword, pero más elegante y minimalista.
- Preparar predicaciones con un **modo consulta guiado**.

---

## 2. Decisiones confirmadas

| Tema | Decisión |
|---|---|
| Stack | Electron + React + TypeScript |
| Plataformas | Windows + macOS + Linux |
| Licencia | GPL-3.0 (permite `node-sword-interface` / libsword, que son GPL-2.0+) |
| Motor bíblico | SWORD vía `node-sword-interface` (opción A — recomendada, pendiente confirmar) |
| Modo consulta | Guiado sin IA ahora; arquitectura lista para IA después |
| Las 4 preguntas | Tema/pasaje · énfasis · audiencia+duración · objetivo/tono |
| Plantilla de predicación | Set de 10 secciones aprobado |
| Alcance MVP | Las 4 áreas: lector, escritura, estudio, instalador de módulos |

---

## 3. Stack técnico

| Área | Elección |
|---|---|
| Shell | Electron + `electron-vite` |
| UI | React 18 + TypeScript + Vite |
| Estilos | Tailwind CSS + Radix UI (headless, accesible) |
| Estado | Zustand |
| Editor | CodeMirror 6 (markdown + extensiones propias) |
| Datos locales | `better-sqlite3` (notas, resaltados, marcadores, documentos) |
| Motor bíblico | `node-sword-interface` (N-API sobre libsword) |
| Validación IPC | Zod |
| Empaquetado | `electron-builder` (NSIS / DMG / AppImage + deb) |
| i18n UI | i18next |

---

## 4. Arquitectura

Separación estricta de procesos (Electron):

- **Main (Node):** dueño de `node-sword-interface`, SQLite, filesystem, instalación
  de módulos y exportación. Los binarios nativos viven **solo** aquí.
- **Preload:** `contextBridge` con API tipada (sin `nodeIntegration`).
- **Renderer (React):** solo UI; consume la API por IPC validada con Zod.

### Estructura de carpetas

```
keryx/
  apps/
    desktop/        # main + preload (electron-vite)
    renderer/       # React UI
  packages/
    core/           # tipos + contratos IPC + schemas Zod
    sword/          # wrapper SWORD (registry, installer, reader)
    db/             # SQLite: schema, migraciones, repositorios
    ui/             # design system (tokens, temas, componentes)
    editor/         # CodeMirror 6 + focus/typewriter/syntax-highlight
    templates/      # plantillas + OutlineGenerator (guided | ai)
  resources/        # fuentes iA Writer Quattro, iconos
  build/            # electron-builder + CI
```

---

## 5. Formato SWORD (motor de carga ligera)

El "peso ligero" de SWORD se basa en índices por offset y bloques comprimidos,
sin base de datos.

### 5.1 Archivo `.conf` (texto)

`mods.d/<ModName>.conf` describe el módulo. Campos clave:

| Campo | Función |
|---|---|
| `DataPath` | carpeta del módulo bajo `modules/` |
| `ModDrv` | driver: `zText`, `RawText`, `RawText4`, `RawLD`, `RawLD4`, `zLD`, `RawGenBook`, `zCom`, `RawCom`, `HREFCom`, `RawFiles` |
| `SourceType` | `OSIS` / `ThML` / `GBF` (markup interno) |
| `CompressType` | `ZIP` / `LZSS` (autoritativo, no la extensión) |
| `BlockType` | `Book` / `Chapter` / `Verse` (granularidad de compresión) |
| `BlockCount` | entradas por bloque en `zLD` (def. 200) |
| `Lang`, `Encoding` | idioma y codificación (`UTF-8`) |
| `GlobalOptionFilter` | activa Strong's, morfología, notas, headings, red-letter |
| `CipherKey` | clave de descifrado |
| `DistributionLicense`, `TextSource` | licencia y origen |

### 5.2 Estructura de carpetas fija

```
<root>/                      # ~/.sword  ó  %APPDATA%\Sword
  mods.d/<ModName>.conf
  modules/
    texts/{ztext,rawtext,rawtext4}/<mod>/
    comments/{zcom,rawcom,hrefcom,rawfiles}/<mod>/
    lexdict/{zld,rawld,rawld4}/<mod>/
    genbook/rawgenbook/<mod>/
```

### 5.3 Formatos binarios por offset (sin base de datos)

| Tipo | Archivos | Registro / layout | Peso |
|---|---|---|---|
| **zText** (Biblias) | `.bzz` / `.bzv` / `.bzs` (zlib `.cz*`, xz `.xz*`, bzip2 `.bz*`) | `.bzv` 10 B: `u32 bloque, u32 offset, u16 len`; `.bzs` 12 B: `u32 offset, u32 compSize, u32 uncompSize`; `.bzz` = bloques comprimidos independientes | Biblia entera ~1–4 MB |
| **RawText / RawText4** | `.vss` + `.vdt` / `.dat` | `.vss` 6 B: `u32 start, u16 len` | rápido, más grande |
| **RawLD / RawLD4** (léxicos) | `.idx` + `.dat` | `.idx` 6 B: `u32 offset, u16 size`; `.dat`: `clave\n\ntexto`, búsqueda binaria | muy compacto |
| **zLD** (léxicos comprimidos) | `.idx` + `.dat` + bloques | como RawLD pero comprimido, `BlockCount` entradas por bloque | mínimo |
| **RawGenBook** (enciclopedias/libros) | `.bdt` + `.dat` + `.idx` | árbol jerárquico tipo FS: `$$$/Libro/Capítulo/Sección` | variable |
| **zCom / RawCom** (comentarios) | igual que text/rawtext | — | variable |

### 5.4 Mecánica de carga

1. Se lee el `.conf`.
2. Se abren los binarios y se hace `seek` / `read` por índice, con caché de bloques.
3. No se parsea el archivo completo ni se usa DB → carga instantánea y ligera.

### 5.5 Instalación

- SWORD lee `masterRepoList.conf` → lista módulos remotos por idioma/tipo →
  descarga el ZIP → coloca `.conf` + binarios.
- **Drop-in:** basta copiar una carpeta de módulo + su `.conf` y refrescar.

### 5.6 e-Sword

e-Sword (`.bblx`, `.bbli`, `.dctx`, `.cmtx`, `.topx`, `.devx`) usa **SQLite** y es
**incompatible** con SWORD. Solo importable/convertible (fase posterior).

---

## 6. Opción de implementación del motor

| | **A) Motor SWORD (`node-sword-interface`)** | **B) Parser propio en TypeScript** |
|---|---|---|
| Cargar módulos existentes | Automático, todos los formatos | Hay que implementar cada driver |
| Instalar desde repos | Ya incluido | Hay que implementarlo |
| Dependencia nativa | Sí (libsword, GPL) | No |
| Esfuerzo | Bajo | Alto (empezar por `zText` + `RawLD` cubre ~90%) |
| Peso de datos | Igual de ligero | Igual de ligero, sin binario nativo |

**Recomendación:** opción **A** para el MVP; opción **B** como capa opcional después.

---

## 7. Modo escritura (minimalista, fiel a iA Writer)

- **Cero cromo:** la barra de título se oculta al escribir; sin toolbars ni paneles.
- **Una columna centrada**, medida ~65 caracteres, tipografía profesional fija.
- **Modo enfoque:** atenúa todo salvo la frase / el párrafo / las 3 líneas activas.
- **Typewriter scrolling:** el cursor queda centrado verticalmente.
- **Auto-Markdown** (`Ctrl/Cmd+B`, `I`, …), sin botones.
- **Resaltado de sintaxis sutil** (markdown + sustantivos/verbos/adjetivos).
- **Contador de palabras/caracteres + tiempo de lectura**.
- **Tipografía:** bundle de **iA Writer Quattro** (SIL OFL 1.1, modificable) +
  fallback IBM Plex / Source Serif; serif para Escritura.
- **Export:** Markdown, HTML, PDF (print). Pantalla completa.
- Sin ajustes por defecto (un panel de tipografía discreto y opcional).

---

## 8. Menú "Plantillas"

- **Modo libre** — documento en blanco, 100% minimalista (por defecto).
- **Plantilla de predicación** — esqueleto estructurado y editable.
- **Modo consulta** — wizard de 4 preguntas calibradas que genera el bosquejo.
- Extensible luego: devocional, estudio, notas de sermón.

### 8.1 Plantilla de predicación (secciones por defecto, editables)

1. Título
2. Texto base
3. Introducción / gancho
4. Idea central
5. Puntos principales (I / II / III + subpuntos)
6. Ilustraciones
7. Aplicación
8. Llamado / conclusión
9. Oración
10. Notas / referencias

### 8.2 Modo consulta — 4 preguntas calibradas

1. **¿Qué quieres predicar hoy?** (tema, pasaje o pregunta)
2. **¿Qué temas o énfasis tienes en mente?** (ángulos / subtemas)
3. **¿A quién predicas y cuánto tiempo?** (audiencia + duración)
4. **¿Cuál es el objetivo / tono?** (enseñar, exhortar, evangelizar, consolar,
   confrontar, adorar)

**Salida:** bosquejo que rellena la plantilla + **pasajes sugeridos** buscados en
los módulos SWORD instalados.

### 8.3 Arquitectura AI-ready

Interfaz `OutlineGenerator` con implementaciones intercambiables sin tocar la UI:

- `GuidedGenerator` (ahora) — preguntas + búsqueda en módulos, 100% offline.
- `AiGenerator` (después) — IA local (Ollama/llama.cpp) o en la nube (API).

---

## 9. Fases

### Fase 0 — Andamiaje
- Monorepo (npm workspaces), `electron-vite`, TS estricto, ESLint/Prettier, Vitest.
- Integrar `node-sword-interface` + `@electron/rebuild`; **validar build nativo en
  las 3 plataformas con GitHub Actions** (riesgo principal).
- Capa IPC tipada con Zod. Schema SQLite + migraciones.
- Design system: tokens, temas claro/oscuro/sepia, tipografía (serif para
  Escritura, sans para UI).

### Fase 1 — Motor + lector de Biblias
- `packages/sword`:
  - `ModuleRegistry`: parsea `mods.d/*.conf`, detecta tipo/driver/idioma, indexa en
    SQLite para listar/filtrar.
  - `ModuleInstaller`: sync de `masterRepoList.conf`, descarga/instala/desinstala/
    actualiza con progreso, maneja `CipherKey`.
  - `ModuleReader`: apertura por offset con caché de bloques (vía libsword).
  - Soporte **drop-in**: carpeta + `.conf` nueva aparece tras refrescar.
- Lector: navegación libro/capítulo/versículo, filtro por idioma (`grc`, `he`,
  `la`, `en`, `es`, `pt`), render OSIS/HTML con toggles (Strong's, morfología,
  notas, headings, red-letter).
- Vistas paralelas 2–4 con scroll sincronizado; comparador de versículos en tabla.
- Búsqueda dentro de módulo.

### Fase 2 — Estudio avanzado
- Paneles de comentario, diccionario/léxico y referencias cruzadas.
- Click en palabra → entrada léxica; popup Strong's griego/hebreo.
- Búsqueda avanzada multi-módulo (boolean, regex, scope, resaltado).
- Notas, resaltados, marcadores y etiquetas en SQLite ligados a refs OSIS.
- Listas temáticas de versículos; armonía de evangelios.
- (Opcional) Importar módulos e-Sword `.bblx`/`.dctx` como lectura auxiliar.

### Fase 3 — Escritura + plantillas + consulta
- Editor iA Writer minimalista (ver sección 7).
- Menú Plantillas: modo libre, plantilla de predicación, modo consulta (ver sección 8).
- `packages/editor`: extensiones de focus/typewriter/syntax-highlight.
- `packages/templates`: plantillas + `OutlineGenerator`.

### Fase 4 — Pulido y distribución
- Command palette (`Ctrl/Cmd+K`), atajos, i18n de UI (es/en/pt).
- Accesibilidad, auto-update, instaladores firmados.
- CI/CD por plataforma, documentación.

---

## 10. Riesgos y mitigación

- **Build nativo por OS/arch:** CI en Win/macOS/Linux desde Fase 0; usar prebuilds
  si existen, si no compilar con `@electron/rebuild`.
- **Licencias de módulos:** respetar copyrights; solo distribuir módulos libres, el
  resto se instala desde repos.
- **GPL:** publicar fuentes del proyecto.
- **Alcance amplio:** entregas por fase, cada una usable de punta a punta.

---

## 11. Verificación

- `npm run lint`
- `npm run typecheck`
- `npm run test` (definidos en Fase 0)
- Build de humo en las 3 plataformas.

---

## 12. Punto pendiente

Confirmar el motor: **opción A** (libsword vía `node-sword-interface`, recomendada)
u **opción B** (parser propio en TypeScript).
