# Bitácora de Keryx — registro histórico del proyecto

> κῆρυξ = heraldo. Registro cronológico de avances, día por día, desde el primer
> commit. El mapa técnico por etapas vive en `docs/etapas.md`; esta bitácora es
> la crónica (qué pasó, cuándo y por qué).

## Resumen

| Dato | Valor |
|---|---|
| Primer commit | **2026-10-03** (14:55) — `10c7cac` |
| Último registro | **2026-10-23** (00:23) — `31ea8aa` |
| Días transcurridos | **20** |
| Commits totales | 76 |
| Días activos | 8 (3, 4, 11, 12, 13, 14, 21, 23 de octubre) |
| Versión | 0.1.0 → 0.4.0 |

El arco en una frase: en 20 días y 76 commits, Keryx pasó de un esqueleto de
demo a una app completa — 717 módulos reales minados por código con **0 tokens
de IA**, sermones con AST inmutable validados por evals (9.0/9), y traducción
offline a 5 lenguas nativas con texto verificado de Sociedades Bíblicas/Wycliffe
donde existe y motor neural donde no — todo medible y protegido contra
regresiones.

---

## Día 1-2 (3-4 oct 2026) — E0/E1: el motor real

- Esqueleto Electron + React con lector demo; mismo día: **motor e-Sword real**
  (SQLite vía `node:sqlite`) reemplaza al demo.
- Búsqueda con acentos y multi-palabra, descompresión LZSS, Strong clicables
  y saneado XSS, pantalla completa + ocultar menú.
- Hermenéutica interactiva, biblioteca del predicador, guardado atómico.
- i18n ES/EN/PT, README.

## Día 9 (11 oct 2026) — E2/E3: el gran salto de estudio (~20 commits)

**E2 — Estudio avanzado:**
- Plantillas de layout y splitters persistentes (`keryx-store.json`).
- Sincronía de versículo entre paneles, acordeón de comentarios con rangos.
- Diccionario por clic-palabra con `normTopic`, chips ℹ de cobertura
  (~20 ms comentarios, ~135 ms diccionarios), Strong# clicables.

**E3 — Sub-agentes de código (0 tokens):**
- Dosier de 17 secciones en ~390 ms minado 100% por código; la IA solo
  redacta la voz encima del dosier citado.
- Guía del Pasaje (estilo FactBook), ranking pesado de comentarios,
  Walton-Keener, teología sistemática + historia, paralelos Lambert.

## Día 10-11 (12-13 oct 2026) — E4: SermonEngine + hardening

- SermonEngine con AST inmutable (`buildSermonDocument`/`renderSermon`,
  huecos imposibles), modo economía + deepSermon (borrador→crítico→final),
  12 oradores con perfil, exégesis BDAG-lite por Strong#.
- Export .doc/.md/Copiar; **evals medibles `npm run eval` — 9.0/9, 0 fallos,
  5 pasajes dorados**.
- E4.1: versiones multiplataforma (Win/Mac/Linux), instalador Windows.
- E4.2: comparativa del Lector estilo Logos — apilado Text Comparison para
  4/6, llenado experto (`expertPlan`: contrasta el polo opuesto a la base;
  RV60↔NVI, +NTV/LBLA, +Amplificada, +original), chips de perfil de
  traducción (formal/dinámica/paráfrasis/ampliada/original).
- Quitar el home: la app abre directo en el Lector; paloma de Noé articulada
  (última animación antes de retirarla).

## Día 12 (14 oct 2026) — Asistente en vivo

- Asistente con pasos en vivo y tiempo real: agentes de mina por grupos de
  fuentes, cronómetro por llamada, frases de pastor sin jerga ni IA.
- Biblioteca rediseñada a 3 columnas (recursos/índice/lectura) con nuevo
  canal `dict:entries` y auto-apertura.
- Búsqueda con agentes de canon Gén→Apoc (7 franjas paralelas, scope AT/NT
  real) y casilla de todas las Biblias en tandas.
- Búsqueda sin acentos: pre-filtro GLOB con clases `[aáAÁ]` y resaltado
  accent-tolerante.
- codeCritic de código (0 tokens): detecta Strong y referencias sin ancla,
  1 llamada por defecto con reparación dirigida.

## Día 18-19 (21 oct 2026) — E4.3: traducción + presentaciones

- Presentaciones PPTX con fondos reales (10 diapositivas del AST, vista
  previa proporcional con container queries, export por diálogo).
- **Traducción en tiempo real de todo el contenido** — daemon Argos offline
  (auto-instala pares, precarga al arranque y al cambiar idioma, pivote por
  inglés).
- Detección del idioma real de los 717 módulos e-Sword (detector lexical
  sobre contenido: 701 es / 2 en / 14 sin idioma).
- Títulos de módulos traducidos en selects/chips/filas; interfaz en 7 idiomas
  con auto-detección del idioma del sistema.
- Texto original griego/hebreo intocado en la comparativa 4/6.

## Día 20-21 (22-23 oct 2026) — lenguas nativas completas (esta sesión)

- **Verso verificado (Nivel 1) vía `node:sqlite` en el main**: SQLite local
  por referencia canónica — instantáneo y sin depender del daemon Python;
  los lotes neurales nunca bloquean el texto verificado (causa raíz de los
  falsos "Translation not available").
- **AT Guaraní fusionado en corpus**: Biblia Guaraní DC 2006 (Sociedad
  Bíblica Paraguaya, misma variante que guiNT) → `gn.db`: +22.666 versos /
  39 libros; fusión por libro con `solo_testamento`.
- **Guaraní neural conectado**: `grn_Latn` en el modelo NLLB ya instalado
  (sin descargas nuevas), par es>gn en `pairs`, auto-instalación.
- **Daemon con hilos workers** (CTranslate2 libera el GIL): `pairs`/`status`
  responde instantáneo bajo carga pesada; stdout bajo candado.
- **Watchdog**: si el daemon muere en vuelo, se relanza en 2 s.
- **Banner auto-sanador**: el estado negativo del motor no se cachea; se
  revalida al cambiar de idioma.
- **Barra de progreso por idioma**: % animado en el chip mientras carga el
  capítulo + punto verde "listo" esta sesión.
- **Comparativa por columna**: en modo 4/6 el corpus verificado alimenta
  SOLO la columna Base; las demás traducen su propio texto — comparar
  traducciones conserva el matiz.
- **Traducción global cerrada**: Guía del Pasaje (entradas de fichas) e
  Inspiración (escena, predicación, introducción, texto, bosquejo, citas,
  gran idea, aplicación, bio) pasan por `TextoTraducido`.
- **Asistente por lote**: el sermón completo se traduce en 1-2 llamadas
  (`translateMarkdownLote`) en vez de N llamadas encadenadas, con indicador
  "⟳ Traduciendo el sermón…".
- **Resolver de Python real**: en Windows el stub del Python install manager
  (WindowsApps/pymanager) colgaba el daemon intermitentemente; ahora se
  resuelve el binario real filtrando stubs.
- **Evals de traducción `npm run eval:trad`**: set de control es→nativa
  contra el daemon real, métricas chrF++/BLEU-4 propias
  (`metricas_traduccion.ts`, tests unitarios), handshake de arranque y
  stderr drenado — **4/4 lenguas PASS** (arn 16.9 · gn 28.3 · ay 23.2 ·
  bn 45.4 chrF++).
- Robustez fina: dedupe de lotes en vuelo, espera de hooks 90 s para
  nativas (sin estampida individual), beam 2 en lotes (2× más rápido),
  filtro de versos cortos <12→<4 chars.
- Fix del crash del Estudio: `useEffect` duplicado de precarga usaba
  `currentBook` antes de su declaración.
- Corpus y modelos verificados: arn 7.923 (NT), gn 30.580 (AT+NT),
  ayr 30.817 (completa), bn 7.957 (NT); modelos CT2 int8 ~622 MB c/u.

---

## Estado de verificación al cierre de esta bitácora

- `npm run typecheck` ✓ sin errores
- `npm run test` ✓ 117/117 tests
- `npm run eval` ✓ 9.0/9, 0 fallos (5 pasajes dorados)
- `npm run eval:trad` ✓ 4/4 lenguas, 0 fallos

## Modelos usados y gasto de tokens

### Traducción (todo local y gratuito, 0 tokens IA)

| Componente | Modelo | Nota |
|---|---|---|
| Lenguas mayores (es↔en/pt/it/fr/de/zh) | Paquetes Argos Translate (CTranslate2) | descargados 1 vez, pivote por inglés |
| Quechua / Aymara / Bengali / Guaraní | **NLLB-200-distilled-600M** int8 (~622 MB) | `quy_Latn` / `ayr_Latn` / `ben_Beng` / `grn_Latn` |
| Mapudungun | **M2M-100 600M afinado por dirección** (byumatrixlab) int8 | m2m-es-arn / m2m-arn-es |
| Texto verificado (Nivel 1 ✓) | Corpus SQLite: arnNT, guiNT, GDC2006, AYBOL 1986, Bengali ERV | texto real publicado, no generado |

### Asistente (única IA de pago del sistema)

| Dato | Valor |
|---|---|
| Proveedor/modelo configurado | OpenAI · **gpt-4o-mini** |
| Llamadas por sermón | 1 (2 con deepSermon activado) |
| Tokens por llamada | entrada ~4-5k (dosier 14-16k chars + persona) · salida máx 1.200 |
| Minado, dosier, traducción, evals | **0 tokens** (todo código/SQLite/CTranslate2) |

Nota honesta: la app aún no registra el `usage` real de las respuestas del
proveedor (candidato: contabilizar tokens por sermón en Ajustes); las cifras
del Asistente son estimación por diseño (una llamada, contexto del dosier).

## Siguiente (candidatos, sin compromiso)

- **Modo Misión**: editor de traducción por verso para misioneros (borrador
  neural → corrección humana → revisión aprobada como Nivel 1 en toda la
  app), memoria de traducción + glosario teológico determinista, export/
  import USFM (Paratext), proyectos de traducción con % de avance.
- Afinado del modelo con los ~77.000 pares es↔nativa propios (LoRA local,
  0 tokens) para subir la calidad del borrador neural.
- NLLB 1.3B opcional (calidad +8-15 pts chrF, ~1.4 GB).
- Corpus quechua: sin fuente pública verificable hoy (documentado en
  `instalar_corpus_dialectos.py`); queda en motor neural (≈).
