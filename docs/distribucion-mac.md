# Distribución Keryx para macOS Big Sur (11.7.10)

Objetivo: **una sola instalación** — DMG con la app + biblioteca (726 módulos
e-Sword) + corpus Coalición (7947 artículos) dentro, sin configuración primera.

## Los 3 pasos (del desarrollador al equipo con Big Sur)

### Paso 1 — Subir los datos al release interno `datos` (una vez)

Desde la raíz del repo en Windows (requiere `gh` instalado y autenticado):

```bash
node scripts/datos-macos.mjs preparar   # crea tar.gz + partes de <= 1,8 GB
node scripts/datos-macos.mjs subir      # crea el release `datos` (prerelease interno)
```

El release `datos` es **interno del repo privado**. Si la biblioteca cambia,
repetir ambos comandos (los assets se suben con clobber).

### Paso 2 — Compilar los DMG en GitHub Actions

- GitHub → Actions → **build-mac** → *Run workflow*
  - `incluir_biblioteca`: **true**
  - `incluir_coalicion`: **true**
  - `etiqueta_release`: `mac-dmg`
- Sale **2 DMG** (uno por arquitectura, cada dentro del límite de asset de
  2 GB de GitHub):
  - `Keryx-arm64.dmg` — Macs M1/M2/M3 con Big Sur 11.x o posterior
  - `Keryx-x64.dmg` — Macs Intel (MacBook 2015+, iMac 2013+, etc.): el que
    corresponde a la máquina objetivo con Big Sur 11.7.10

La compilación publica en el release **"Keryx para macOS"**.

### Paso 3 — Instalar en Big Sur (sin firmar; Gatekeeper)

1. Descargar el DMG de la arquitectura correcta (Intel → `x64`).
2. Abrir el DMG y arrastrar **Keryx** a *Aplicaciones*.
3. **No abrir con doble clic la primera vez**: clic derecho sobre Keryx →
   **Abrir** → "¿Deseas abrirlo?" → **Abrir**.
4. Si aun así queda bloqueado, en Terminal:
   ```bash
   xattr -cr /Applications/Keryx.app
   ```

Primer arranque: biblioteca y corpus ya vienen dentro
(`/Applications/Keryx.app/Contents/Resources/biblioteca` y `/…/coalicion`);
la app los descubre sola. Los datos del usuario (`EswordPrincipal`,
escrituras, documentos) viven en `~/Library/Application Support/Keryx`.

## Salidas alternativas

- DMG **sin biblioteca** (`incluir_biblioteca=false`): primera ejecución pide
  elegir carpeta de módulos (Ajustes → Ruta de biblioteca).
- En cualquier Mac la ruta de biblioteca es sobreescible:
  - Variable de entorno `KERYX_BIBLIOTECA_PATH`
  - o copia a `~/Library/Application Support/Keryx/biblioteca`

## Notas de compatibilidad Big Sur

- `minimumSystemVersion: 11.0.0` ya está en `apps/desktop/electron-builder.config.js`.
- Electron 37 exige macOS 10.15+; un DMG compilado en un runner moderno
  funciona igual en 11.7.10.
- Los DMG van **sin firmar** (`identity: null`); con el paso 3 se abren igual
  en Big Sur. Para distribución comercial futura: Developer ID + notarización.

## Derechos (recordatorio)

Los módulos de `biblioteca/` (e-Sword/SermonIndex) y los artículos de Coalición
viajan con derechos de sus creadores: el DMG "con todo" es para uso personal y
pastoral; para distribución comercial usar la modalidad DMG sin biblioteca +
guía de descarga propia del usuario.
