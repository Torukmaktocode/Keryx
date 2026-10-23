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
| Tokens por llamada | entrada ~4-5k (dosier 14-16k chars + persona) · salida máx 1.400 |
| Minado, dosier, traducción, evals | **0 tokens** (todo código/SQLite/CTranslate2) |

Nota honesta: la app aún no registra el `usage` real de las respuestas del
proveedor (candidato: contabilizar tokens por sermón en Ajustes); las cifras
del Asistente son estimación por diseño (una llamada, contexto del dosier).

### Tokens gastados en la CONSTRUCCIÓN de la app (MEDIDO)

Fuente: base de sesiones de opencode (`~/.local/share/opencode/opencode.db`,
tabla `message` → campo `tokens` por cada mensaje del asistente). Cifras
reales al 23 de octubre de 2026, atribuidas por directorio de sesión:

| Concepto (proyecto Keryx) | Tokens |
|---|---|
| Entrada directa (contexto enviado: código, logs, herramientas) | 58.502.331 |
| Salida directa (código escrito, ediciones, respuestas) | 1.768.735 |
| Razonamiento (reasoning) | ~1.214.883 |
| **Subtotal procesado directo** | **61.485.949** |
| Cache leído (re-lectura de contexto entre pasos) | 1.073.616.768 |
| **Total procesado incluyendo cache** | **~1.135 millones** |

- Ratio de la agencia: por cada token de salida hay ~33 de entrada — el
  costo real de construir con agentes es LEER (el 95 % de los tokens son
  lectura de código/logs), no escribir.
- Sesión más cara de Keryx: "Generador de presentaciones PPTX para
  sermones" (13,7 M tokens), seguida de "Activación de aplicación"
  (13,2 M) e "Integrar 7 volúmenes de Champlin" (10,1 M).
- Modelos usados en construcción: **glm-5.3-flash** (principal), y para
  tareas puntuales deepseek-v4-flash(-vision), nemotron-3-ultra-free,
  muse-spark-1.2/1.3-contributor-free, mimo-v2.5/2.6-free — todos en plan
  de suscripción gratuito (campo `cost` = 0 en los mensajes).
- El resto de proyectos del desarrollador (gravitysymbiosis, Gravity
  Interior, webhula, voxcraft…) suman ~20,4 M tokens adicionales — fuera de
  esta bitácora.

En contraste con el producto: TODO el motor de Keryx (minado de 717 módulos,
dosier, SermonEngine, traducción nativa, evals) corre por código local con
**0 tokens de IA de pago** por cada uso — el usuario no gasta tokens en la
función central de la app; solo la voz del Asistente consume gpt-4o-mini.

---

## Anatomía: cómo se crea un sermón (todo el código detrás)

### El esquema completo

```
        PETICIÓN DEL USUARIO («habla sobre el amor de dios», Juan 3:16, Salmo 23:1…)
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        │            1. SUB-AGENTES DE ENTRADA (0 tokens)          │
        │                                                          │
        │  • intención   buildIntent (lib/intent.ts)               │
        │    interpreta la frase → perfil: tema, necesidad,       │
        │    términos de búsqueda, "conexión con la petición"      │
        │                                                          │
        │  • localizador  parseReference + locatePassageByTokens   │
        │    (lib/reference.ts + creator.ts:896)                   │
        │    referencia directa… o búsqueda puntuada: gana el      │
        │    versículo que cumple MÁS palabras de la consulta      │
        └────────────────────────────┬────────────────────────────┘
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        │        2. LA MINA — 25 agentes de código (0 tokens)      │
        │                                                          │
        │   buildDossier (lib/agents.ts:229) ejecuta en paralelo:  │
        │                                                          │
        │   texto base (capítulo/versículo e-Sword)                │
        │   ├─ comentario pesado      commentJob  (ranking)        │
        │   ├─ bosquejo homilético    outlineJob                  │
        │   ├─ Strong / léxico        strongsJob                  │
        │   ├─ idiomas (BDAG-lite)    idiomasJob                  │
        │   ├─ morfología Robinson    morfologiaJob               │
        │   ├─ tema/diccionarios      themeJob (+variantes)       │
        │   ├─ geografía              geoJob + geoVerseJob        │
        │   ├─ Walton/Keener          waltonJob        (contexto) │
        │   ├─ crítica textual        criticoJob                  │
        │   ├─ teología sistemática   sistematicaJob              │
        │   ├─ historia de la Iglesia historiaJob                 │
        │   ├─ caso de estudio        casoJob                     │
        │   ├─ citas                  citaJob                     │
        │   ├─ figuras de lenguaje    figuraJob                   │
        │   ├─ consenso de fuentes    consensoJob                 │
        │   ├─ sintaxis del original  sintaxisJob                 │
        │   ├─ nombres propios        nombresJob                  │
        │   ├─ referencias cruzadas   refsJob  (Lambert)          │
        │   └─ ilustraciones          illusJob                    │
        │   + 5 trabajos de contexto intercalados (Walton-Keener, │
        │     historia, teología, homilética)                     │
        │                                                          │
        │   Harness: lib/swordTools.ts — ToolCache (dedupe SQLite),│
        │   lookupTool/searchTool validados, entrada por regex,   │
        │   presupuesto global 16.000 chars (ENTRY_MAX 620,        │
        │   máx 3 entradas/sección). "jamás lanza".                │
        │                                                          │
        │   Gap-analysis: el motor inspecciona su propia cobertura │
        │   y hace una 2ª pasada dirigida con variantes de acentos│
        └────────────────────────────┬────────────────────────────┘
                                     │
                       DOSIER: 15-21 secciones · 25-43 citas
                       ancladas [Módulo · entrada] · ~400-1000 ms
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        │      3. AST INMUTABLE — SermonEngine (0 tokens)          │
        │                                                          │
        │   buildSermonDocument (lib/sermonEngine.ts:114):         │
        │   el documento nace COMPLETO — todos los slots con       │
        │   fallback determinista extraído del dosier (gran idea,  │
        │   contexto Histórico/Cultural/Teológico/Cristológico,    │
        │   puntos con evidencia, citas, caso real, aplicación,    │
        │   meditación, cierre, bendición, oración, fuentes).      │
        │   La IA NO puede tocar la estructura ni la evidencia.    │
        └────────────────────────────┬────────────────────────────┘
                                     │
                       esqueleto renderizado (renderSermon)
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        │     4. LA VOZ — la ÚNICA llamada de IA de pago           │
        │                                                          │
        │   Modo economía (default): 1 llamada corta (máx 1.400    │
        │   tokens, temp 0.6) que SOLO redacta marcadores:         │
        │     ==GANCHO== ==INTRO== ==PUENTE N== ==MEDITACION==     │
        │     ==ORACION==                                          │
        │   parseSnippets los extrae y assembleSermon              │
        │   (creator.ts:833) los inyecta en el AST con fallbacks   │
        │   deterministas: si la IA falla, el sermón sale igual.   │
        │                                                          │
        │   deepSermon (opcional): 1 llamada completa con el       │
        │   dosier entero (máx 6.000 tokens) → codeCritic de       │
        │   CÓDIGO (0 tokens, creator.ts:333) verifica cada        │
        │   Strong# y cada cita contra el dosier → si hay          │
        │   hallazgos severos, 1 reparación dirigida (máx 3.000)   │
        └────────────────────────────┬────────────────────────────┘
                                     │
        ┌────────────────────────────┴────────────────────────────┐
        │   5. GARANTÍAS DE SALIDA (código, nunca IA)              │
        │                                                          │
        │   • withAnchoredSources: fuentes ancladas al final       │
        │   • sin marcadores sueltos (assembleSermon limpia)       │
        │   • [Módulo · entrada] citado en todo lo usado           │
        │   • evals: npm run eval — 5 pasajes dorados, 9.0/9       │
        └─────────────────────────────────────────────────────────┘
```

### Conteo exacto

| Rol | Cuántos | Tokens |
|---|---|---|
| Agentes de entrada (intención + localizador) | 2 | 0 |
| Agentes de mina del dosier | 20 + 5 de contexto = **25** | 0 |
| Gap-analysis / 2ª pasada | dinámico (0-4) | 0 |
| Crítico de código (codeCritic) | 1 | 0 |
| Ensamblador (AST + render + fuentes) | 1 | 0 |
| **Total sub-agentes de código** | **~29-33** | **0** |
| Llamada de IA (voz) | 1 (2-3 con deepSermon) | única IA |

### Los archivos detrás (mapa del código)

| Archivo | Líneas | Rol |
|---|---|---|
| `lib/agents.ts` | ~970 | buildDossier: los 25 agentes, presupuesto, gap-analysis, apiHook |
| `lib/creator.ts` | ~1.218 | runCreator, 12 oradores, skeleton, assembleSermon, codeCritic, localizador |
| `lib/sermonEngine.ts` | ~318 | AST inmutable (buildSermonDocument/renderSermon) |
| `lib/swordTools.ts` | 132 | harness de herramientas (ToolCache, lookup/search, presupuesto) |
| `lib/intent.ts` | — | sub-agente de intención (frase → perfil) |
| `lib/assistant.ts` | — | contexto y mina auxiliar |
| `main/ai.ts` | — | puente IPC a OpenAI-compatible (única IA de pago) |
| `scripts/eval-sermons.mts` | ~90 | evals de los 5 pasajes dorados |

### Por qué NO es solo un buscador

Un buscador devuelve resultados; Keryx devuelve un **documento con
garantías**. La diferencia está en lo que ocurre DESPUÉS de buscar:

1. **Ranking experto** (`COMMENT_RANK`, agents.ts:137): no mina cualquier
   comentario primero — prioriza Calvino, MacArthur, Matthew Henry,
   Keil-Delitzsch, Robertson, Barclay, Walton, Keener, Metzger… el orden de
   las fuentes es una decisión editorial de código, no un ORDER BY.
2. **Presupuesto determinista** (16.000 chars, agents.ts:249): el dosier
   consume en ORDEN CANÓNICO fijo; cuando el presupuesto se agota, las
   secciones siguientes no entran — nunca un dosier desbordado ni
   truncado a mitad de cita.
3. **Auto-inspección (gap-analysis)**: el motor mira su propia cobertura y
   si faltan zonas críticas (ej. sin contexto histórico) relanza una
   **2ª pasada dirigida** con variantes de acentos sobre otros módulos —
   un buscador no sabe lo que no encontró.
4. **Estructura garantizada (AST inmutable)**: el documento nace completo
   con fallbacks extraídos del dosier; la IA solo puede redactar la voz.
   El "buscar" es la etapa 1 de 5 — el valor está en las otras 4.

### Por qué supera a Claude / Gemini / ChatGPT en ESTA tarea

Ser justo: no es una comparación de inteligencia general — es una ventaja
de **diseño de dominio**. Un chat de IA es una moneda de muchas caras;
Keryx es un motor de una sola pieza, construido para este trabajo:

| Límite del chat de IA | Lo que hace Keryx |
|---|---|
| No tiene TU biblioteca: reproduce datos de entrenamiento, caduca y alucina | Mina 717 módulos REALES locales (4,8 GB) en ~400-1000 ms — Sociedades Bíblicas, Wycliffe, Calvino, BDAG-lite: texto que existe en tu disco |
| Cita Strong mal y "casi" cita versículos | codeCritic de CÓDIGO rechaza cada Strong#/referencia que no esté anclada en el dosier; la reparación dirigida solo actúa si hay hallazgos severos |
| Ensayo no reproducible: la misma pregunta da otro sermón | Pipeline determinista: misma consulta → mismo dosier → misma estructura; los evals (9.0/9, 5 pasajes dorados) bloquean regresiones ANTES del commit |
| Genera la respuesta entera de un tirón (tokens caros, lento) | 29-33 sub-agentes de código (0 tokens) construyen todo; 1 llamada corta (máx 1.400 tokens) solo redacta gancho/intro/puentes/meditación/oración |
| Si el modelo cae, no hay sermón | Fallbacks deterministas: sin IA el sermón sale igual (texto guía completo, fuentes ancladas) |
| No traduce a lenguas nativas con texto verificado | Corpus verificado (✓) de Sociedades Bíblicas/Wycliffe + motor neural offline (≈) para AT y NT en 5 lenguas — 0 tokens |

La "magia" detrás: **la IA es el último eslabón, no el motor**. Todo lo
difícil (buscar en 717 módulos, rankear, presupuestar, cruzar Strong con
morfología Robinson, Walton verse-por-verse, verificar, ensamblar, evaluar)
es TypeScript + SQLite local. Por eso el resultado es verificable línea a
línea: cada frase del sermón que usa datos lleva su cita
`[Módulo · entrada]`, y las Fuentes ancladas las escribe el código al
cierre — jamás la IA.

### Por qué supera el método humano de 6-8 horas

El predicador que prepara a mano dedica esas horas sobre todo a **labores
mecánicas**: abrir 10-15 libros, buscar el pasaje en cada comentario,
cruzar el Strong con la morfología, buscar geografía y costumbres, copiar
citas, escribir el bosquejo, redactar, revisar que nada esté mal citado.
Eso es exactamente lo que la mina de 25 agentes hace en ~1 segundo.

| | Método humano | Keryx |
|---|---|---|
| Recolección de fuentes | 2-4 h (10-15 libros a mano) | **~0,4-1 s** (25 agentes, 717 módulos) |
| Cruce Strong/morfología/geografía | 1-2 h | instantáneo (código) |
| Verificar citas y referencias | 30-60 min (y con errores) | codeCritic + evals, por construcción |
| Esqueleto + redacción inicial | 2-3 h | esqueleto ~1 s + voz ~20-30 s (1 llamada) |
| Costo | 6-8 h de trabajo no pagado o la suscripción de un tool caro | ~1 llamada corta (~centavos) |
| **Total** | **6-8 h** | **~30 s + la revisión del predicador** |

La afirmación honesta importa: Keryx no supera al predicador en lo que SOLO
el predicador puede — discernir a su congregación, orar por el mensaje,
aplicar con autoridad espiritual, predicar con unción. Lo que comprime es
la ** mecánica**: el borrador completo, citado y verificado llega en ~30 s
y el predicador lo hace SUYO editando con CodeMirror, enviándolo al editor
o a la presentación. El ahorro real: **5-7 horas por sermón**, y el
predicador queda en el centro del bucle (Modo Misión planeado: corrige,
aprueba y su revisión se vuelve texto verificado para toda la app).

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
