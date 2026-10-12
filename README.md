# Keryx

Aplicación de escritorio para **estudio bíblico y escritura**, con motor de módulos
**SWORD** y **e-Sword**, estudio avanzado con paneles sincronizados (estilo e-Sword,
pero más limpio y en español) y modo escritura minimalista tipo iA Writer.

> κήρυξ (keryx) = heraldo.

## Qué trae hoy (resumen)

### Biblioteca de recursos reales
- Escaneo directo de la carpeta `biblioteca/` (recursivo, sin copiar ni convertir):
  **717 módulos e-Sword** en español:
  - **96 Biblias** (`.bbli`/`.bblx`) — RV1960, RV1909, BHS hebrea, interlineales griegas,
    Jerusalén, NTV, NVI, etc.
  - **79 Comentarios** (`.cmti`) — Biblia Comentada, MacArthur, Adventista, Guzik,
    Pearlman, Beacon, Wiersbe, etc.
  - **120 Diccionarios y léxicos** (`.dcti`/`.lexi`/`.dctx`) — Lockward, Thompson,
    Strong en español, concordancias, nombres, etc.
  - **422 Libros** (`.refi`) — Bosquejos, enciclopedias, teología, sermones.
- La vista **Biblioteca** organiza con pestañas `Todos | Biblias | Comentarios |
  Diccionarios | Libros` (con contador), búsqueda por nombre/descripción y botones
  **Abrir en Estudio / Abrir en Lector** y coloca el recurso directo en el flujo.
- Otras carpetas de módulos siguen soportadas: `esword/` (principal) y `sword/`
  (formato SWORD/CrossWire opcional).

### Estudio (modo avanzado)
- **Plantillas de layout**: `Estudio completo` (Biblia + Comentario + Diccionario),
  `Lectura`, `Libros`, `Investigación` y `Personalizado` (se activa con cambios manuales).
- **Paneles ajustables**: separadores arrastrables entre columnas (los anchos se
  guardan), doble clic restaura el peso, layout apilado responsivo ≤ 1100 px.
- **Menú completo por panel** (☰): selector de módulo de su categoría, cambio de tipo
  de panel (Biblia / Comentario / Diccionario / Libro), fijar-soltar la sincronía del
  versículo y cerrar/abrir paneles (botón `+` para volver a añadirlos).
- **Sincronía del versículo** (única fuente de verdad, `Estudio`): el versículo
  activo en la Biblia gobierna los demás paneles:
  - El **Comentario** es un acordeón verse-por-verse sobre los comentarios
    e-Sword reales (`.cmti`), respetando rangos como e-Sword (una entrada por
    `VerseBegin`; `getVerse` devuelve la entrada que *cubre* el versículo).
  - El **Diccionario** muestra la entrada del término y una fila de chips
    "ℹ Diccionarios con 'X'" para saltar al recurso que sí la tiene;
    busqueda con un **clic sobre cualquier palabra** del texto bíblico,
    doble clic también, y las marcas **Strong#** (clicables) si el módulo las trae
    (control en Ajustes → *Marcas Strong#*). Claves `G26/H430` sin entrada en el
    módulo activo caen a los módulos Strong de la biblioteca (como e-Sword).
  - La barra de **"ℹ Habla de {Libro} {capítulo}"** marca los comentarios que
    cubren el capítulo actual (con la cantidad de versos) y **"Diccionarios con
    '{término}'"** los recursos que tienen el término; clic en el chip abre allí
    esa entrada.
- **Hermenéutica**: pestaña con guía interactiva de estudio (observación,
  interpretación, aplicación) que se envía al editor.
- **Guía del Pasaje**: pestaña que arma el dosier del versículo con sub-agentes
  de código (~400 ms, 0 tokens de IA): texto base, comentarios con cobertura
  (Robertson/MacArthur los pesados van primero), Walton-Keener verso a verso,
  Strong, lemas griegos (Ortiz por lema real), morfología Robinson
  (`VAAI3S` = aoristo activo 3ª persona), paralelos Lambert, teología
  sistemática (Hodge/Grudem/Chafer/Bavinck), historia (Fox/Josefo/Eusebio),
  contextos teológico/cristológico/social(filosófico) y puentes pastorales.
- **Exégesis "BDAG-lite"** (100% código): por cada Strong# del verso, la ficha
  desplegable muestra el lema griego + transliteración, la entrada Ortiz
  indexada **por lema** (no por número), **sentidos en uso** agrupados por la
  traducción española real (con referencias clicables que saltan al versículo),
  distribución por secciones del NT y formas gramaticales; exportación al
  editor en Markdown.
- Salto por referencia, navegación de teclado (`↑/↓` versículo, `←/→` capítulo)
  y envío del pasaje + comentario al editor.

### Escritura
- Editor Markdown (CodeMirror 6) minimalista: modo enfoque por oración/párrafo,
  typewriter, conteo de palabras y lectura, autoguardado atómico, export MD/HTML.
- El botón **Enviar al editor** desde Lector/Estudio/Guía inserta el pasaje,
  comentario o exégesis en el documento activo (o crea uno nuevo).

### Asistente híbrido (código primero, IA solo cerebro)
- **Sub-agentes deterministas** (0 tokens) minan 717 módulos reales y arman un
  dosier citado `[Módulo · entrada]`; la IA nunca inventa: el dosier es su
  única fuente y los modos no-creadores son 100% locales.
- **Sermón "código más que IA"** (modo economía, default): el cuerpo — puntos,
  evidencia, gran idea, contextos, ilustración — lo ensambla el composer de
  código; la IA solo rinde la voz (gancho/puentes/oración) en 1 llamada corta
  (~700 tokens máx de salida). Si la IA falla o está apagada, fallbacks
  deterministas completan la voz (documento sin marcadores sueltos).
- **`deepSermon`** (opt-in, Ajustes → IA): doble pasada de calidad
  (borrador → crítico homilético → final aplicando correcciones), 3 llamadas
  cortas; si cualquier paso falla, fallback local.
- Creadores: sermón, estudio devocional y devocional, con personas de estilo
  y aviso cuando se usó IA o salió todo de código.

### Módulos y motor
- **SWORD** completo vía lector local (`zText`, `zCom`, `RawLD`, `RawLD4`, `zLD`,
  descifrado `CipherKey`, Strong, marcado `<w data-strong>`), instalación desde
  repositorios CrossWire y descarga con `scripts/download-sword.mjs`.
- **e-Sword** vía SQLite (`node:sqlite`): Bibles (tabla `Bible`), comentarios
  e-Sword 2009 (`VerseCommentary` con rangos `ChapterBegin/VerseBegin..End`,
  `ChapterCommentary`, `BookCommentary`), diccionarios (`Dictionary(Topic, Definition)`,
  `Reference(Chapter, Content)` para libros), resolución tolerante de temas
  (acentos, numeración inicial, prefijos `\b`) y nombres únicos ante la
  interfaz cuando un mismo título existe en varias categorías.
- **Motor exegetico Strong**: `strongsOccurrences(code)` escanea la biblia con
  Strong (`<num>G25 …</num>` / `data-strong`) con filtro de frontera de dígito
  (G25 no empata G251) y dirmodología limpia; `lookupLemma(module, lemma)`
  decodifica entidades HTML (`&gamma;`…) e indexa léxicos **por lema griego
  real** (NFD, comparación de acentos eliminada). Buses : `bible:strongs-occurrences`,
  `dict:lemma`.

## Flujo de la aplicación

```
Biblioteca ──abrir──▶ Estudio ──(plantilla, paneles, versículo)──▶ ℹ marcas
      │                     │
      │                     ├─ Guía del Pasaje ──▶ fichas + Exégesis Strong
      │                     │        │ enviar dosier/exégesis ──▶ Escritura
      │                     ├─ enviar pasaje + comentario ──▶ Escritura
      │                     └─ Asistente (dosier 0 tokens → sermón código+voz)
      └──abrir en Lector ──────────────────────────────────▶ exportar MD/HTML
```

1. **Biblioteca**: encuentra el recurso (biblia, comentario, diccionario, libro)
   y ábrelo en Estudio o Lector.
2. **Estudio**: eligen plantilla según la tarea (leer, investigar, consultar
   libros); navegan el versículo — cada panel se marca y sincroniza; los chips ℹ
   muestrean que módulos tienen contenido del versículo/tema y saltan directo.
3. **Escritura**: building del sermón/estudio con el material enviado; exportación
   final.

## Requisitos

- Node.js 20+ (probado con Node 24) y npm 10+.
- (Opcional) Python 3.10+ con PyMuPDF para los scripts auxiliares de `scripts/`.

## Instalación y uso

```bash
npm install
npm run dev        # desarrollo (electron-vite)
npm run build      # compilar
npm run build:win  # instalador Windows (electron-builder)
```

## Verificación

```bash
npm run typecheck
npm run lint
npm run test      # vitest (motor SWORD/e-Sword, búsqueda, i18n, fixtures)
```

## Estructura

```
apps/desktop/            # Electron (main + preload + renderer React)
packages/
  core/                  # tipos, IPC queries, schemas Zod, biblias canónicas, layouts
  sword/                 # lectores SWORD/e-Sword (providers, búsqueda, Strong, cifrado)
  db/                    # persistencia (documentos + ajustes/estudios layout)
  ui/                    # design tokens y temas
  editor/                # CodeMirror 6 (enfoque, typewriter, markdown)
  i18n/                  # interfaz es / en / pt
  templates/             # plantillas + generador de bosquejos
biblioteca/              # módulos e-Sword reales (BIBLIAS/COMENTARIOS/DICCIONARIOS/LIBROS)
esword/                  # módulos e-Sword principales (opcional, vacío por defecto)
sword/                   # módulos SWORD CrossWire (opcional)
scripts/                 # download-sword.mjs, pdf_to_esword.py, traductores opcionales
docs/                    # plan y resumen (incluye docs/resumen-app.md)
```

## Licencia

GPL-3.0-or-later. El motor SWORD/libsword y los módulos de tercero conservan sus
propias licencias. Los módulos descargados y los contenidos de `biblioteca/` son
responsabilidad del usuario: verificar sus derechos antes de usarlos o distribuirlos.
