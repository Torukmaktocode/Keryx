# Distribución Keryx para macOS Big Sur (11.7.10)

Objetivo: **una sola instalación** — DMG con la app + biblioteca (726 módulos
e-Sword) + corpus Coalición (7947 artículos) dentro, sin configuración primera.

## Paso 1b — Datos del traductor (lenguas nativas)

La traducción ya NO exige Python en la máquina del usuario: el workflow
compila el daemon congelado (`scripts/daemon-pyinstaller.sh`, PyInstaller)
y lo embarca en el DMG. Los modelos neuronales de lenguas nativas
(~2,3 GB: `nllb-qu`, `m2m-es-arn`, `m2m-arn-es`) no caben en el DMG:

1. **Una vez (desde Windows):** preparar y subir corpus + glosarios al
   release interno `datos` (los lleva el DMG):
   ```bash
   node scripts/datos-macos.mjs preparar-traductor   # desde build/datos
   node scripts/datos-macos.mjs subir
   ```
2. **Una vez:** subir los 3 `*.tar.gz` de modelos a un dataset público de
   HuggingFace (por ejemplo `huggingface.co/datasets/Torukmaktocode/keryx-traductor`,
   mismos nombres: `nllb-qu.tar.gz`, `m2m-es-arn.tar.gz`, `m2m-arn-es.tar.gz`).
   Otra URL distinta se fija con la variable `KERYX_MODELOS_URL`.
3. La app los descarga sola en el primer arranque (barra de progreso en la
   barra lateral) y luego traduce offline para siempre.

Los corpus verificados (`corpus/*.db` + `glosario_*.json`, ~35 MB) sí viajan
dentro del DMG y se copian a userData en el primer arranque.

## Pack completo (una sola descarga)

Con `pack_completo: true` el workflow arma un DMG con TODO dentro:
biblioteca + corpus Coalición + corpus verificado + daemon congelado + los
3 modelos neuronales. El usuario instala y traduce offline sin esperar nada
(`prepararModelosLocales` copia los modelos a userData en el primer arranque).

Como el DMG (~4,5 GB) supera el límite de 2 GB por asset de GitHub Releases,
el workflow lo **parte en trozos de <1,9 GB** y publica en el release
`mac-dmg` las partes (`Keryx-full.dmg.001`, `.002`, ...) más
**`Instalar-Keryx.command`** y `LEEME.txt`.

Experiencia del usuario de Mac:
1. Descarga todas las partes + `Instalar-Keryx.command` a una misma carpeta.
2. Clic derecho sobre `Instalar-Keryx.command` → Abrir → Abrir.
3. El script junta las partes, abre el DMG y solo queda arrastrar Keryx a
   Aplicaciones.

Requiere `nllb-qu.tar.gz`, `m2m-es-arn.tar.gz` y `m2m-arn-es.tar.gz` en el
release interno `datos` (`node scripts/datos-macos.mjs preparar-traductor`
+ `subir` desde la máquina con los modelos instalados).
Disco en el runner: biblioteca + modelos + build suman ~12 GB; macos-15
alcanza pero justo.

## Idiomas grandes incluidos (offline desde la instalacion)

El workflow baja los paquetes Argos de es↔en/pt/it/fr/de/zh (presupuesto
~850 MB) y los embarca en `Resources/argos-preload`. El daemon los instala
al primer arranque (`preinstalar_incluidos`) — no hay descarga al primer uso.
Cualquier par no incluido (o que exceda el presupuesto) se baja del indice
publico de Argos al usarse por primera vez, como siempre.

Los modelos nativos (guaraní, quechua, mapudungun…) siguen fuera: quedan
activos con `pack_completo: true`, con `KERYX_MODELOS_URL`, o con el pack
de traducción aparte.

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
