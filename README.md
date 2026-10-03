# Keryx

Aplicación de escritorio para **estudio bíblico y escritura**, con motor de módulos
**SWORD** y **e-Sword**, modo escritura minimalista (tipo iA Writer) y preparación de
predicaciones.

> κῆρυξ (keryx) = heraldo.

## Características

- **Lector**: navegación libro/capítulo/versículo, filtro por idioma, cada Biblia muestra
  su idioma entre paréntesis.
- **Estudio** (tres paneles sincronizados): Biblia · Comentario · Diccionario.
  - Salto por referencia (`Juan 3:16`).
  - Navegación con teclado (`↑/↓` versículo, `←/→` capítulo).
  - Auto-scroll al versículo seleccionado.
- **Enciclopedia / Recursos**: busca texto completo en diccionarios y enciclopedias y abre
  la entrada completa.
- **Escritura**: editor Markdown minimalista (CodeMirror 6) con modo enfoque, typewriter,
  conteo de palabras/tiempo de lectura, autoguardado y export MD/HTML.
- **Plantillas y modo consulta**: plantilla de predicación (10 secciones), estudio,
  devocional, y un asistente de 4 preguntas que genera un bosquejo.
- **Flujo investigación → predicación**: envía el pasaje + comentario al editor.
- **Módulos**:
  - SWORD (`zText`, `zCom`, `RawLD`, `RawLD4`, `zLD`), incluye descifrado (`CipherKey`).
  - e-Sword (`.bblx/.bbli`, `.dctx/.dcti`, `.cmtx/.cmti`, `.devx`, `.topx`) vía SQLite.
  - Instalación desde el repositorio CrossWire.
  - Prioridad (⭐) para destacar recursos.
- **Idioma de la interfaz**: español / inglés / portugués (conmutador ES | EN | PT).

## Requisitos

- Node.js 20+ (probado con Node 24)
- Python 3.10+ (solo para el conversor de PDF)

## Instalación y uso

```bash
npm install
npm run dev        # desarrollo
npm run build      # compilar
npm run build:win  # instalador Windows (electron-builder)
```

## Verificación

```bash
npm run typecheck
npm run lint
npm run test
```

## Módulos

La app busca módulos en estas carpetas (en la raíz del proyecto o en `userData`):

- `sword/` — módulos SWORD (`mods.d/*.conf` + `modules/...`)
- `esword/` — módulos e-Sword (`.bblx`, `.dctx`, `.cmtx`, …)

### Descargar módulos SWORD libres (CrossWire)

```bash
node scripts/download-sword.mjs            # set inicial (biblias multilingües + diccionarios + comentarios)
node scripts/download-sword.mjs --all      # todo el catálogo libre
node scripts/download-sword.mjs --all-bibles
```

### Convertir PDFs a módulos e-Sword (determinista, sin IA)

```bash
npm run convert:esword
```

Lee los PDFs de `Enciclopeia Champlin/` (o el directorio configurado) y genera módulos
`.dctx` en `esword/` con una entrada por página. Usa PyMuPDF + SQLite; **no usa IA ni OCR**.

## Estructura

```
apps/desktop/          # Electron (main + preload + renderer React)
packages/
  core/                # tipos, canales IPC, schemas Zod, libros canónicos
  sword/               # lectores SWORD/e-Sword (zText, zLD, RawLD, e-Sword, cifrado)
  db/                  # persistencia (documentos + ajustes)
  ui/                  # design tokens y temas
  editor/              # CodeMirror 6 (enfoque, typewriter, markdown)
  i18n/                # interfaz es / en / pt
  templates/           # plantillas + generador de bosquejos
scripts/               # descargador SWORD + conversor PDF→e-Sword
```

## Licencia

GPL-3.0-or-later. El motor SWORD/libsword y los módulos de terceros conservan sus
propias licencias. Los módulos descargados y los PDFs convertidos son responsabilidad del
usuario; verifica sus derechos antes de usarlos o distribuirlos.
