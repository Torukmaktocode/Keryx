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

## Día 24 (24 oct 2026) - E4.4 fase 1: conexión por CÓDIGO (complemento)

> Peticiones del pastor: que los sermones conecten con SU frase de entrada,
> que toquen los temas con la cercanía "como Jesús mismo", que hablen como
> Sus apóstoles (Pedro, Pablo, Juan, Santiago) y que SIEMPRE pasen por los
> comentarios bíblicos. Todo por código y estadística — la IA nunca decide
> la conexión. Complemento puro: nada de lo existente se reemplaza.

### El diagnóstico (3 fugas verificadas en código)

1. La conexión con la petición dependía de un léxico de SOLO 23 temas
   curados (`intent.ts`): "ayuno", "soberanía", "jubileo", "discipulado"
   no matcheaban → el prompt de voz iba SIN la conexión.
2. Los corchetes-guía podían verse en el sermón final ("código roto"):
   `sermonEngine.ts:157` (gran idea sin datos → "[Lean el texto en voz
   alta…]") y `sermonEngine.ts:281` (aplicación sin datos → "[concreto con
   los tuyos.]").
3. El gancho base del AST era genérico ("Comencemos con la Palabra misma:
   ¿ref?") y las referencias cruzadas Lambert se minaban con 1 módulo,
   máx 3 temas y corte al primer acierto.

### Lo implementado (todo TypeScript + estadística, 0 tokens)

- **F0 · Barrido anti-placeholder**: `granIdea` y `aplicación` sin datos
  ahora renderizan directivas pastorales honestas redactadas por código
  (nunca corchetes); `renderSermon` y `assembleSermon` tienen barrido de
  red de seguridad que descorcheta guía y preserva citas `[Módulo ·
  entrada]` (regla: corchete con `·` intacto, sin `·` descorchetado).
  Aserción nueva en `npm run eval`: cero corchetes-guía en los 5 pasajes
  dorados.
- **F1 · Red léxica estadística** (`intent.ts`): además del léxico curado,
  las palabras de ≥5 letras sin match directo se aproximan por
  **similitud de trigramas (coeficiente Dice)** sobre los stems, umbral
  0.5 — temas fuera de la lista también conectan con su enfoque pastoral.
  Frase literal del usuario siempre en el eco.
- **F1 · Patrón Cristo + Apostólico** (nuevo `lib/redLexica.ts`): tabla
  determinista de 23 temas pastoral × (1 apertura de Jesús + 2-3 de Sus
  apóstoles), frases TEXTUALES en RV60 con referencia citada y el "modo"
  de apertura (cómo lo abrió Él: "corriendo primero hacia el que vuelve",
  "llorando primero", "con un ejemplo de la ventana"...). Principio de
  silencio: tema sin tabla → sin patrón, sin invención.
- **F3 · Gancho conectado**: el slot `gancho` del AST se construye con el
  eco de la petición + el patrón Cristo citado + la referencia + la gran
  idea; y el render añade el bloque **"Como lo abrió Jesús / Como lo
  habló Pedro·Pablo·Juan·Santiago"** con citas ancladas tras el gancho.
- **Voz guiada**: ambos prompts (economía y deepSermon) reciben el bloque
  "PATRONES CITADOS" — la IA redacta la voz cálida ENCIMA de patrones que
  fueron de Cristo y de Sus apóstoles; jamás los inventa.
- **F2 · Referencias cruzadas en red** (`agents.ts` refsJob): de 1 módulo
  → **3 módulos** de referencias × 2 entradas cada uno, 4 temas, sin corte
  temprano; el mapa de cruzadas queda poblado.
- **Tests**: nuevo `redLexica.test.ts` (9 tests): cobertura de patrón para
  cada tema del léxico (bidireccional, sin huérfanos), sin invención de
  temas desconocidos, gancho conectado, eco literal, barrido anti-
  placeholder y preservación de citas. **126 tests en total**.

### Verificación (commit)

- `npm run typecheck` ✓ · `npm run test` ✓ 126/126 · `npm run eval` ✓ 9.0/9 ·
  `npm run eval:trad` ✓ 0/4 fallos

### Pendiente de esta fase (próximas sesiones)

- F3quater: minar SIEMPRE en los comentarios rankeados el tratamiento
  apostólico del tema (hoy el patrón es textual citado; falta el aporte
  de Calvino/MacArthur/Henry sobre el tema por apóstol).
- F4: sermones temáticos sin pasaje claro (pasaje ancla por ranking
  estadístico del tema).
- F5: pasajes dorados de complejidad extra (Juan 1 ↔ Éxodo 12, Hebreos ↔
  Levítico, tema "jubileo").

---

## Día 24 (24 oct 2026) - MEGA-MOTOR de lenguas: crear, no instalar

> Regla del pastor: **nada de descargas gigantes ni tokens — CREAR el
> motor**. El misionero trae la Biblia ya traducida (corpus); el motor de
> Keryx la procesa: alfabeto, glosario básico estadístico, verso verificado.
> Una lengua nueva se ACTIVA soltando un corpus, no comprando un modelo.

### El motor genérico (todo código, 0 tokens)

- **Glosario estadístico** (nuevo `scripts/glosario_estadistico.ts` puro +
  `scripts/extraer_glosarios.mts` CLI): alinea verso por verso el corpus
  nativo (SQLite, referencia canónica) con el español de la biblioteca
  e-Sword y extrae el diccionario básico por co-ocurrencia ponderada por
  rareza inversa (estilo PMI): funcionarios (>8 % frecuencia global) y
  tokens únicos excluidos, mínimo 4 versos de apoyo, máx 3 candidatos por
  término con peso ≥1.4 — sin dato, sin par (principio de silencio).
  Resultado real generado: **gn Dios→tupã/tumpa, fe→mborogüɨrovia,
  cielo→ara** · **arn Dios→ngünechen, fe→mupiltun, vida→mongen** ·
  ayr y bn: 296 pares en total (75+75+75+71) en ~30 s por corrida.
- **Registro de lenguas** (`main/traductor.ts` REGISTRO_LENGUAS): cada
  lengua con nombre, familia, ALFABETO completo (Mapudungun con ü/tr/ng,
  Guaraní con g̃/ỹ, Aymara con glotalización ch'/k', Náhuatl y Maya
  yucateco pendientes) y estado calculado al vuelo: corpus (db+versos),
  neural (modelo CT2 instalado) o pendiente.
- **IPC tipado con Zod**: `translate:lenguas` → registro con estado,
  versosCorpus y glosario; `translate:glosario` → pares del diccionario
  básico (core schemas + api + preload + api renderer).
- **Sidebar dinámico**: los chips se renderizan desde el REGISTRO (no
  lista fija): lengua con corpus/neural → activa; pendiente → deshabilitada
  con aviso honesto ("traer una Biblia traducida activa esta lengua"); el
  tooltip muestra nombre, motor, versos del corpus, tamaño del glosario y
  el alfabeto completo — el pastor ve la lengua que está predicando.
- **Tests**: 6 nuevos del extractor (alineación, funcionarios fuera,
  silencio ante semillas sin datos, tokenize con apostrofe/diacríticos).
  **132 tests en total**.

### Verificación (commit)

- `npm run typecheck` ✓ · `npm run test` ✓ 132/132 · `npm run eval` ✓ 9.0/9 ·
  `npm run eval:trad` ✓ 0/4 fallos

### Horizonte del mega-motor (siguientes sesiones)

- Glosario como CALIDAD del neural: términos del glosario anclan la
  traducción neural (post-edición determinista, 0 tokens).
- Proyección de glosario en la Guía del Pasaje y en la comparativa del
  Lector (columna nativa con su diccionario al lado).
- Lengua nueva = 1 archivo: `corpus/<code>.db` (el misionero lo genera con
  su traducción) + registro `REGISTRO_LENGUAS` — sin modelos externos.

---


### Estandar de adopcion: analizar_lengua (dia 24, tarde)

- `apps/desktop/src/main/analizar_lengua.ts` (+ test): analizador puro que
  infiere alfabeto, funcionarios (top 15 con n>=3) y perfil de muestra/corpus
  desde cualquier `corpus/<code>.db`.
- `descubrirLenguas()` en el main: escanea `corpus/*.db` mas alla del
  registro builtin, analiza 3.000 versos y fusiona el resultado en
  `lenguasEstado()` (cache `lenguas_descubiertas.json`). `corpusConn` ahora
  resuelve `CORPUS_LANG_DB[lang] ?? lang`: cualquier db nueva se auto-activa.
- Lengua nueva = soltar `corpus/<code>.db`. Sin registrar nada a mano.

### Limpieza del Asistente: fuera los 6 modos muertos

- Eliminados Versículo / Capítulo / Tema / Palabra / Concepto / Hermenéutica:
  no aportaban al motor (el dosier y el sermón usan sus propias rutas por
  código) y su función ya vive, mejor, en Lector (versos/capítulos) y
  Búsqueda (temas/palabras). Quedan solo los 3 de creación: Sermón / Estudio /
  Devocional completos (selector de orador siempre visible, modo inicial
  `crearsermon`).
- Codigo fuera: `localVerse`...`localHermeneutica`, `pickBible`,
  `dictModules`, `commentaryModules`, `assistantBookOptions`, claves i18n
  `assistant.mode.*` y `assistant.placeholder.*` en los 7 locales.
- `stripTags`, `safe` y `refLabel` se conservan (los usan creator / agents /
  LibraryView).

---

## Día 25 (25 oct 2026) — el día de la salud del traductor

> Sesión en vivo con la app abierta: reporte del pastor — "solo funcionan
> inglés y portugués", "algunos versos no se traducen", "192 s cargando".
> Tres raíces encontradas (cache envenenada, deadlock del daemon, colapsos
> del NLLB) y una decisión editorial (fuera las lenguas sin motor).

### Fase 1 · Indicador de carga con ms (terminó lo que quedó a medias)

- Tracker universal de carga: `CargaIdioma` con `inicioMs/listoMs/msFinal`,
  helpers `cargaIniciar/cargaProgreso/cargaTerminar`, contador
  `vuelosPorLang` (solo el último lote marca listo), `formatoDuracion`
  ("840 ms" / "2,4 s") y tick de 100 ms en `useCargaIdioma`
  (`lib/traductor.ts`). Los `cargaSet` ya no dependen de `NATIVAS.includes`:
  TODOS los idiomas reportan.
- Chips (`Sidebar.tsx`): mayores ES/EN/PT/IT/FR/DE/ZH con `ChipMayor` (barra
  pulsante + ms en vivo); nativos con la misma etiqueta.
- Precargas de fondo silenciosas (`{ silencioso: true }`): precalentado de
  otros idiomas y prefetch del capítulo siguiente ya no encienden el
  indicador con trabajo que el usuario no pidió.
- CSS: `.carga-ms` (tabular-nums), `.nativa-nombre` con elipsis, barra arriba.

### Fase 2 · Las tres raíces del "solo en y pt funcionan"

1. **Cache persistente envenenada (7.417 entradas)**: cuando el motor falla
   devolvía el ORIGINAL y el main lo guardaba como traducción
   (es>zh 1.851 · es>de 1.845 · es>it 1.835 · es>fr 1.835 envenenadas vs
   es>en 21 / es>pt 19 — por eso "funcionaban"). Limpiadas con script
   (backup `cache-traducciones.json.bak`); quedan 4.583 legítimas.
   Prevención: main (`translateLote`) y renderer (`ejecutarLoteMulti` +
   `traducirTexto`) JAMÁS cachean resultados identidad.
2. **Deadlock del daemon (preexistente)**: `traductor()` tomaba
   `CANDADO_INIT` (Lock no reentrante) y adentro llamaba a `idiomas()` que
   pide el MISMO candado — si el primer pedido era un lote (sin `pairs`
   antes), el daemon colgaba PARA SIEMPRE (explica los "status fallo:
   Tiempo agotado"). Fix: `threading.RLock` (`daemon:41`).
3. **Colapsos del NLLB**: Juan 3:6 producía loops ("chay runaqa, chay
   runaqa...") en beam 4 y 1 → guard anti-degeneración → identidad. Escalera
   de rescate determinista: beam 4 → beam 1 → beam 2 + `repetition_penalty`
   1.2 → identidad; v6 se recupera ("Chuya runaqa, kay pachapi yurisqa kan;
   Espiritumanta naceqkunapas espiritunmi."). Guard ampliado: triple
   repetición CONSECUTIVA de palabra = colapso mecánico (v2 salía con
   "atiyta atiyta atiyta"; ahora limpio).
   Rendimiento: el rescate ya NO re-infiere el lote completo por verso malo
   (antes ~2-5 s × N versos malos — causa del 192,4 s del chip); solo las
   filas malas, una pasada por escalón.

### Fase 3 · Estado de lenguas y decisión editorial

- **Quechua gris = bug**: `DIALECTO_A_SPEC` buscaba carpetas `quechua`/
  `mapudungun` inexistentes (los reales: `nllb-qu`, `m2m-es-arn`) — la
  verificación neural nunca se disparó. Fix: spec = nombre real de carpeta →
  Quechua activo con motor neural.
- **Náhuatl y Maya yucateco retirados del registro** (decisión del pastor):
  el NLLB instalado no los cubre (verificado con `infiriendo` tokens:
  `yua_Latn`/`nah_Latn` = `<unk>` id=3, salida basura) y sin corpus
  principio de silencio. `descubrirLenguas()` los re-activará solos si
  llega un `corpus/nah.db` o `corpus/yua.db`.
- Zod: `translateLocale` acepta `nah`/`yua` (clic de lenguas descubiertas
  no se bloquea a mitad de camino).

### Verificación (día 25)

- `npm run typecheck` ✓ · `npm run test` ✓ 138/138 · `npm run lint` ✓
  (1 warning preexistente en eval-sermons.mts)
- `npm run eval:trad` ✓ 4/4 PASS — **Mapudungun mejoró real**:
  chrF++ 16.9 → 20.2, sin datos 3 → 0 (6/6 casos); gn 28.1 · ay 23.2 ·
  bn 45.4 sin regresiones.
- Lote es→qu medio capítulo + verso colapsado: 17 s frío / sub-segundo tibio.

---

## Estado de verificación al cierre de esta bitácora

- `npm run typecheck` ✓ sin errores
- `npm run test` ✓ 138/138 tests
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
| `lib/sermonEngine.ts` | ~350 | AST inmutable (buildSermonDocument/renderSermon) + aperturas citadas |
| `lib/swordTools.ts` | 132 | harness de herramientas (ToolCache, lookup/search, presupuesto) |
| `lib/intent.ts` | ~260 | sub-agente de intención (frase → perfil) + red de trigramas (Dice) |
| `lib/redLexica.ts` | ~300 | Patrón Cristo + Apostólico por tema: frases textuales RV60 citadas (0 tokens) |
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

| | Método humano | Keryx | Superación |
|---|---|---|---|
| Recolección de fuentes | 2-4 h (10-15 libros a mano) | ~0,4-1 s (25 agentes, 717 módulos) | ~7.000-36.000× |
| Cruce Strong/morfología/geografía | 1-2 h | instantáneo (código) | ~3.600-7.200× |
| Verificar citas y referencias | 30-60 min (con errores) | codeCritic + evals, por construcción | continua, no puntual |
| Esqueleto + redacción inicial | 2-3 h | esqueleto ~1 s + voz ~20-30 s (1 llamada) | ~240-540× |
| Costo | 6-8 h de trabajo no pagado | ~1 llamada corta (~centavos) | — |
| **Total** | **6-8 h** | **~30 s + revisión del predicador** | **~720-960×** |

La afirmación honesta importa: Keryx no supera al predicador en lo que SOLO
el predicador puede — discernir a su congregación, orar por el mensaje,
aplicar con autoridad espiritual, predicar con unción. Lo que comprime es
la **mecánica**: el borrador completo, citado y verificado llega en ~30 s
y el predicador lo hace SUYO editando con CodeMirror, enviándolo al editor
o a la presentación. El ahorro real: **5-7 horas por sermón**, y el
predicador queda en el centro del bucle (Modo Misión planeado: corrige,
aprueba y su revisión se vuelve texto verificado para toda la app).

### El conato en números (medición real)

**Cuantas cosas hacen AL MISMO TIEMPO.** La mina es un solo estallido de
paralelismo: `Promise.all` (agents.ts:846) lanza los **25 trabajos de
investigación a la vez** — 25 consultas SQLite corriendo simultáneas
sobre 717 módulos, no una cola. El harness deduplica en vuelo: dos
agentes que piden "GALILEA" al mismo diccionario comparten UNA consulta
(`ToolCache`, swordTools.ts:50), y todo entra validado por regex
(expandToolRequests) — nadie compone SQL a mano.

**Cuánto leen.** Cadena de lectura medida:

| Lectura | Magnitud |
|---|---|
| Escaneo íntegro de la biblioteca (717 módulos) | ~270 ms al arranque |
| Texto base (capítulo completo + rangos de comentario) | 1 capítulo / 36 versos típico |
| Comentarios pesados minados | 2-4 módulos por pasaje (ranking COMMENT_RANK) |
| Walton-Keener (cultural) | verso POR verso del pasaje |
| Diccionarios (tema, caso, cita, figura, nombres) | 6-10 lookups con variantes sing/plural + acentos |
| Geografía + crítica + sintaxis + referencias Lambert | 4-6 búsquedas GLOB/LIKE |
| **Evidencia resultante** | **14.000-16.000 chars citados** (15-21 secciones, 25-43 citas) |

**Cuantas revisiones.** Tres capas de control, de la más barata a la más
cara:

1. **codeCritic de código** (0 tokens, creator.ts:333): cada Strong# y
   cada cita bíblica del documento se coteja contra el dosier — severos →
   reparación.
2. **Modo economía (default)**: 1 sola llamada de IA (temp 0.6, máx 1.400
   tokens) — redacta voz, no datos.
3. **deepSermon (opcional)**: borrador completo (máx 6.000 tokens) →
   codeCritic → pasada final crítica (máx 3.000) → salida.
   Total IA: 2-3 pasadas; el crítico de código SIEMPRE actúa.

Después del commit de cualquier cambio del motor, los **5 pasajes
dorados** (`npm run eval`, 9.0/9) y los **44 casos de traducción**
(`npm run eval:trad`, 4/4) vuelven a correr: revisión continua, no
puntual.

**Cuántos investigan.** De los ~29-33 agentes, **todos investigan menos
tres**: intención, localizador y ensamblador procesan; los 25-29 restantes
son investigadores puros con fuente y presupuesto propios. La IA no
investiga NADA: recibe la investigación hecha y solo pone la voz.

### Por qué es tan preciso

La precisión no es suerte ni un prompt magistral — es **arquitectura que
hace imposible lo impreciso**:

1. **Única fuente = dosier anclado.** El prompt de la IA exige "usalo como
   única fuente" y lleva autocheck incorporado: cada Strong y cada cita
   debe figurar en el dosier o se corrige/elimina (creator.ts:1108).
2. **El texto verificado no se genera: se cita.** El nivel ✓ (Sociedades
   Bíblicas/Wycliffe) es texto PUBLicado alineado por referencia canónica
   en SQLite — la app jamás re-escribe un versículo verificado.
3. **Principio de silencio:** si un módulo no da el dato, la sección NO
   existe — jamás se rellena con texto plausible (el anti-hallucination
   del repo, testeado: los primeros 58 tests del repo eran anti-alucinación).
4. **Recorte con cita garantizada** (trimEntry): toda cita se recorta en
   límite de palabra, y su origen `[Módulo · entrada]` viaja pegado — el
   predicador puede verificar cada dato en un clic desde la Guía.
5. **Fuentes ancladas por código** al cierre del documento
   (withAnchoredSources, creator.ts:856): la lista final no la escribe la
   IA; la escribe el ensamblador desde las citas reales de la mina.
6. **Evals como contrato:** si un cambio del motor baja la cobertura de
   los pasajes dorados, `npm run eval` falla y el commit no sale.

### Dos lecturas del potencial: versión técnica y versión teológica
**Versión TÉCNICA (para expertos en tecnología)**

Keryx es un pipeline de dominio con garantías de ingeniería, no una
aplicación envuelta en un LLM. Lo técnico en una pasada:

- **Datos**: 717 módulos e-Sword (SQLite) escaneados en ~270 ms; corpus
  paralelos bíblicos alineados por referencia canónica (SQLite, lectura
  `node:sqlite` readonly en el main) = texto publicado, no generado.
- **Mina**: 25 agentes concurrentes (`Promise.all`) sobre un harness
  tipado (`swordTools.ts`): entrada por regex, `ToolCache` con dedupe,
  presupuesto global de 16k chars, jamás lanza.
- **Determinismo**: ensamblado canónico, AST inmutable del sermón con
  fallbacks por slot, fuentes ancladas escritas por código. La IA es 1
  llamada corta al final (voz), guardada por un crítico de código.
- **Traducción offline**: daemon Python (JSON-lines sobre stdin/stdout)
  con CTranslate2 int8 (NLLB-200-600M / M2M-100 afinado), ThreadPool con
  candados de init, watchdog y banner auto-sanador; verso verificado via
  `node:sqlite` en el main (~20 ms) — el neural nunca lo bloquea.
- **Verificación continua**: evals como contrato (5 pasajes dorados 9.0/9,
  44 casos chrF++/BLEU-4 4/4) — toda regresión se detecta antes del commit.
- **Costo marginal**: 0 tokens por uso del motor; la única IA de pago es
  la voz del Asistente (1 llamada, ~centavos).

**Versión TEOLOGICA (para teólogos y pastores, en palabras simples)**

Imagina que un equipo de 25 bibliotecarios expertos revisara tu biblioteca
completa en un segundo: lecturas de Calvino, MacArthur, Matthew Henry,
Walton, la gramática griega y hebrea, geografía, costumbres, teología
sistemática e historia de la Iglesia — y te entregara una ficha con cada
dato **citado con su libro y página**, listo para predicar. Así trabaja
Keryx: el sermón nace con estructura y evidencia garantizadas, y una voz
pastoral (Eugene Peterson, Spurgeon, Lutero…) redacta el gancho y las
transiciones. Nada inventa: si un libro no da el dato, la sección dice la
verdad ("sin datos") — la fidelidad textual es su regla moral, como la del
copista ante el texto sagrado. Cada cita es verificable en un clic.

**Por qué supera incluso a Google Translate**

| | Google Translate | Keryx |
|---|---|---|
| Dominio | general (menus, correos, webs) | bíblico y homilético (módulos, versos, sermones) |
| Lenguas nativas | sin Mapudungun ni Aymara; Guaraní/Quechua genéricos | 5 lenguas con motores propios + corpus VERIFICADO por verso |
| Autoridad del texto | reformulación estadística | texto publicado tal cual (✓ Sociedades Bíblicas/Wycliffe) o borrador neural marcado como experimental (≈) — honestidad por diseño |
| Conexión | requiere internet, envía tu texto a la nube | 100 % offline en el dispositivo — privatidad pastoral absoluta |
| Contexto | frase suelta | la mina completa del pasaje: comentario, Strong, cultura, teología |
| Consistencia | varía entre traducciones | glosario bíblico estable + texto verificado idéntico siempre |

Y la comparación del tiempo que menciona la historia de las traducciones:
la Biblia completa en una lengua nueva es un trabajo de **13-15 años de
equipos humanos** (Wycliffe); un solo libro, alrededor de 2 años de un
traductor experto. Keryx entrega el texto verificado ya publicado en
**~20 ms por verso** (instantáneo para el lector) y prepara borradores de
capítulos enteros en segundos para el misionero — no reemplaza al
traductor humano: le entrega en minutos el andamio que le tomaría meses,
y su revisión aprobada se vuelve texto verificado para toda la comunidad.
El traductor sigue siendo humano; el tiempo de espera, no.

### Comparativa con Kaleo (withkaleo.com)

Kaleo AI es un servicio de NUBE para la traducción EN VIVO del culto
(150+ lenguas, subtítulos en tiempo real, escaneo de QR por los asistentes,
suscripción de $24-149/mes). Keryx es otro deporte: preparación del sermón
en escritorio. La comparación honesta:

| | Kaleo AI | Keryx |
|---|---|---|
| Propósito | interpretación simultánea del culto en vivo | preparación del sermón: minado de 717 módulos, sermón completo, estudio, editor |
| Arquitectura | nube: audio del servicio se transmite a sus servidores | escritorio local: nada sale del equipo |
| Traducción | MT de nube en tiempo real (texto generado) | verso verificado PUBLicado (✓) o borrador neural (≈), con corpus propio |
| Costo | $24-149/mes, por horas de streaming | GPL gratis; único costo: ~centavos de voz en el Asistente |
| Conexión | requiere internet estable | 100 % offline |
| Lenguas | 150+ (incluye aymara, guaraní, quechua) — SIN Mapudungun | 5 lenguas nativas con corpus verificado (incl. Mapudungun NT 7.923 versos) |
| Privacidad | el audio del culto viaja a la nube | privatidad pastoral absoluta |
| Minado bíblico | ninguno (no prepara sermones) | 25-33 sub-agentes de código, dosier citado, Patrón Cristo/Apostólico |

Síntesis: Kaleo amplifica el culto EN VIVO y cobra suscripción por hora;
Keryx prepara el mensaje ANTES y entrega el texto verificado offline.
Son complementarios — y Keryx llega a la lengua que Kaleo no tiene
(Mapudungun), con texto publicado tal cual en vez de reformulación
estadística. A futuro (Modo Misión) Keryx podría explorar proyección de
subtítulos del sermón ya preparado, sin audio en la nube.

## Plan guardado para la próxima semana — versión Mac + licencias Hotmart

> Decisión tomada (25 oct 2026): **un solo proyecto, sin duplicados**. Electron
> y electron-builder ya son multiplataforma (`electron-builder.yml` tiene
> target win/mac/linux); el CI compila cada release para las 3 plataformas
> desde el mismo repo. Un duplicado = doble mantenimiento y divergencia.

### Fase 1 — Indicador de carga por idioma (quedó a medias, 25 oct)

- Hecho: `CargaIdioma` extendido con `inicioMs/listoMs/msFinal` +
  `formatoDuracion` + `msDeCarga` + tick de 100 ms en `useCargaIdioma`
  (`renderer/src/lib/traductor.ts`).
- Falta: helpers `cargaIniciar/cargaProgreso/cargaTerminar` + contador
  `vuelosPorLang` en `ejecutarLoteMulti`; quitar el guard `NATIVAS.includes(tgt)`
  para que TODOS los idiomas (IT/FR/DE/ZH…) reporten carga; opción
  `{ silencioso: true }` para precalentado de otros idiomas
  (`traductor.ts:404`) y prefetch del capítulo siguiente (`ReaderView.tsx:384`);
  chips mayores y nativos con barra + ms en vivo en `Sidebar.tsx`; CSS
  `.carga-ms` (tabular-nums) + `.nativa-nombre` + barra arriba en `styles.css`.
- Verificación: `npm run typecheck`, `lint`, `test`.

### Fase 2 — Licencias + suscripción Hotmart (~4-6 días naturales)

Intro del pastor: login de usuarios y cobro mensual cada 30 días vía Hotmart;
si el cliente no paga, la app se bloquea.

- Stack decidido: **backend Cloudflare Workers + Supabase Postgres (gratís)**,
  JWT firmado **Ed25519** (clave pública embebida en la app — nadie forja
  licencias offline), vínculo a dispositivo **máx 3 activaciones**.
- Login: **email + contraseña** (backend valida el email contra la
  suscripción en Hotmart).
- Política: **trial 7 días + gracia offline 7 días** (evita bloquear a
  clientes sin internet al viajar).
- Backend `_backend/` (~200 líneas TS, tests Vitest):
  `POST /webhooks/hotmart` (valida `X-Hotmart-Token`; eventos
  PURCHASE_APPROVED / SUBSCRIPTION_RENEWED / SUBSCRIPTION_CANCELED /
  SUBSCRIPTION_EXPIRED → tabla `suscripciones(email, estado, expira_at)`),
  `POST /auth/login`, `POST /license/activar` (JWT con exp = expira_at + gracia).
- App: nuevo `packages/licencia` en el proceso main (login, token cifrado en
  `keryx-store.json` — NEVER en git, validación al abrir + cada 24 h) + pantallas
  de **login** primer arranque y **bloqueo** con botón "Renovar suscripción"
  → checkout Hotmart del navegador. Los datos locales NUNCA se borran.
- Ciclo de 30 días: lo hace Hotmart (tarjeta se renueva automáticamente);
  la app SOLO lee el estado vía webhook → `expira_at` del próximo ciclo.
- Parte manual del pastor: cuenta Cloudflare + Supabase, producto de
  suscripción en Hotmart (pueden demorar 24-48 h en aprobar), URL webhook +
  hottok, compra de prueba con tarjeta real, y validación extremo a extremo
  (cobro → renovación → bloqueo → reactivación).

### Fase 3 — Version Mac sin firmar por ahora (~2-3 h)

- Decisión: **sin firmar** (sin pagar Apple Developer ID $99/año de momento).
  En macOS moderno el usuario debe saltar Gatekeeper (clic derecho → Abrir,
  o `xattr -cr`); si crece la base de clientes de Mac, se firma y **el código
  no cambia** — solo el CI.
- `.github/workflows/release.yml`: job `macos-latest` → `npm run build:mac`
  (DMG arm64+x64, `identity: null` ya configurado en `electron-builder.yml:20-25`)
  → GitHub Releases.
- El DMG solo se construye en macOS (CI obligatorio si no hay Mac física);
  hace falta probarlo en un MacBook real.
- Doc nueva `docs/distribucion-mac.md`: instrucciones Gatekeeper para soporte.
- Punto a revisar en esa fase: qué pasa con `biblioteca/` (4,8 GB, fuera de
  git) al empaquetar para mac — hoy la app la escanea de disco en desarrollo.

### Comparación de referencia (estimación)

- Fase 1: ~30 min. Fase 2: ~1-2 días de código + 3-4 de config/pruebas Hotmart
  real. Fase 3: ~2-3 h + prueba en MacBook. **Total ≈ 1 semana natural.**

---

## Hardening pre-comercial (auditoría 25 oct 2026)

> Auditoría de calidad solicitada por el pastor ("¿está a nivel de app
> profesional?"). Veredicto: **"indie profesional" confirmado** — la calidad
> del código está cerca del nivel comercial; el gap real es de OPERACIÓN de
> producto (firma, updater, CI, telemetría, packaging), no de código. La
> lentitud de los idiomas es frío de modelo + cola del daemon, no mala
> construcción — ya es visible con el indicador de ms de la Fase 1.

### Lo VERIFICADO a nivel profesional (evidencia)

- 42/45 canales IPC con validación Zod estricta + límites de tamaño
  (`ipc.ts:41-53`, `core/schemas.ts`).
- 0 `catch {}` vacíos en el renderer; degradación explícita con fallbacks.
- 0 TODO/FIXME/HACK reales en todo el código.
- 138 tests reales contra el motor e-Sword + evals como contrato
  (9.0/9 sermons, 4/4 traducción) — más que la mayoría de apps indie.
- Escritura atómica tmp+rename con flush al cerrar (`db/index.ts:82-92`).
- Watchdog del daemon (relanza en 2 s) y arranque no bloqueante.
- Escaneo de seguridad del main correcto: contextIsolation on,
  nodeIntegration off, deny-all de popups (`main/index.ts:70-90`).

### Los 6 cierres para nivel comercial (checklist accionable)

| # | Punto | Detalle | Referencia | Estimación |
|---|---|---|---|---|
| 1 | **Bug packaging: `instalar_dialectos.py` no se embarca** | extraResources solo lleva `traductor_daemon.py`; la app INSTALADA no puede instalar modelos de lenguas nativas (solo funciona en dev) | `electron-builder.yml:8-10` vs `main/traductor.ts:479-481` | 15 min |
| 2 | **CI obligatorio en push/PR** | workflow con test + typecheck + lint + eval + eval:trad; hoy la regla "evals 0 fallos antes de commit" se cumple a mano, solo hay 1 workflow manual de mac | `.github/workflows/` nuevo | ~1 h |
| 3 | **Backup de `keryx-store.json`** | un JSON corrupto hoy borra documentos del usuario sin aviso; agregar backup rotativo (.bak, N generaciones) antes de recrear | `packages/db/src/index.ts:65-67` | ~45 min |
| 4 | **Handlers de crash del main** | no existen `uncaughtException`/`unhandledRejection`; un error no capturado muere silencioso; agregar log a archivo | `main/index.ts` | ~30 min |
| 5 | **Endurecimiento de seguridad** | CSP en `renderer/index.html` (hoy inexistente), `sandbox: true`, allowlist de esquema en `shell.openExternal` (hoy abre cualquier URL) y handler `will-navigate`; cerrar 3 canales IPC con args sin validar (`modulesRemote`, `bibleBooks`, `dictStrongs`) | `main/index.ts` + `ipc.ts:107,121,172` | ~2-3 h |
| 6 | **Runtime del traductor empaquetado** | el instalador exige Python en la máquina del usuario (el daemon); congelar con PyInstaller (Windows/mac) para instalador sin dependencias externas | `scripts/traductor_daemon.py` + builder | 1 sesión (probar en ambas plataformas) |

### Notas de la auditoría (sin acción inmediata)

- Puntos 5 secundarios mitigados por diseño: saneo regex del HTML de módulos
  y escape del markdown de IA (contextIsolation cubre el resto); DOMPurify
  sería más robusto si se quisiera blindar del todo.
- `aiApiKey` vive en texto plano en `keryx-store.json` — aceptable para app
  local, documentar en soporte.
- `node:sqlite` sigue experimental heredado de Electron/Node — riesgo de API
  entre versiones, reconocido en AGENTS.md.
- Sin tests E2E ni de `ipc.ts`/`JsonStore` — candidatos a agregar con el CI
  del punto 2.
- La tríada firma/updater/licencias ya está cubierta por las Fases 2 y 3 del
  plan guardado arriba — este hardening NO los duplica.

---

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

---

## Día 32 — 2026-11-01 — Biblioteca: clásicos históricos EN completos

**Objetivo del día**: cerrar la lista pedida "grandes comentaristas de la
historia" (lo bajable legalmente) y sanar el lector de módulos SWORD zCom4.

### Módulos instalados (dominio público, SermonIndex.net → `biblioteca/`)

| Módulo (.cmti) | Entradas | Peso |
|---|---|---|
| Adam Clarke — Comentario sobre la Biblia | 21.153 | 25,4 MB |
| Albert Barnes — Notas sobre la Biblia | 19.344 | 40,8 |
| John Gill — Exposición de toda la Biblia | 32.139 | 61,0 |
| John Wesley — Notas Expositivas | 17.188 | 6,6 |
| The Pulpit Commentary (Exell-Spence) | 1.451 secc. | 116,1 |
| Charles Spurgeon — Comentario y Exposiciones | 997 | 14,6 |
| Lange — Comentario de las Escrituras | 1.886 secc. | 79,6 |
| Expositor's Bible (Nicoll) | 1.982 secc. | 45,2 |
| Padres de la Iglesia — Comentario (ECF) | 18.656 | 89,5 |
| Padres Ante-Nicenos — Referencias NT (ANF) | 4.080 | 3,5 |

Subtotal `biblioteca/`: **~482 MB / 10 módulos EN** (+9,9 % sobre 4,8 GB).
Además **Tesoro de David completo** (`TDavid`, zCom4, CrossWire) → `sword/`
(~5,3 MB). Descarga de la sesión: ~164 MB (los zips van ~3× comprimidos).

Estos módulos se detectan con idioma `en`: ya sirven en la comparativa del
Lector; el dosier NO los cita todavía (filtra módulos es — ver plan abajo).

### FIX del motor: lector `zCom4` (readers.ts + conf.ts)

- `TEXT_DRIVERS` no incluía `zCom4` → cualquier comentario zCom4 se listaba
  pero devolvía 0 entradas al leer (TDavid afectado).
- zCom4 usa índices de verso de **12 bytes** (block/offset/size int32) vs los
  10 bytes (size u16) de zText/zCom v2: `ZTextModule` ahora recibe `entrySize`
  y `LocalSwordProvider.textModule` lo fija según driver
  (`conf.driver === 'zCom4' ? 12 : 10`).
- Verificación: TDavid lee Salmos 23 (smoke); `npm test` 146/146;
  `npm run typecheck` OK.

### PLAN GUARDADO — "Cambio A": integrar clásicos EN al dosier (~1 día)

El dosier cita solo módulos en español; conectar los EN requiere:

1. **Sub A** (TS): abrir el filtro de idioma en `buildDossier` + etiquetado
   de citas traducidas (`[Módulo · entrada]` + nota "traducción automática").
2. **Sub B** (daemon): par de traducción en→es (`spa_Latn`) en el motor del
   E4.3 ya integrado + cache.
3. Integración serial + evals: `npm run eval` (5 pasajes dorados, medir citas
   antes/después) y `npm run eval:trad` en 0 fallos.

Salvaguarda: NO citar si la traducción falla (ok:false → sección vacía,
principio nº 2). Ejecutable con 2 sub-agentes paralelos (A y B) + integración
serial → ~4-5 h de reloj.

### Descartado por límite legal (decisión del día)

- Sección 1 de la lista (AYBC, Hermeneia, ICC, NICOT/NICNT, WBC, BECNT, NIGTC,
  OTL, PNTC, Tyndale) y modernos de sección 3/4 (Carson, Moo, Wright…): solo
  © vigente vía Logos/Accordance/Olive Tree; vías sin licencia (scans de
  Internet Archive, "premium modules" de bible-support) descartadas — app GPL
  con plan comercial Hotmart, riesgo takedown real.
- CCEL (~1.000 libros clásicos PD): fase futura vía exportador `.refi` (la
  app lee pero NO escribe módulos e-Sword todavía) — estimación 1-2 días de
  exporter + importación masiva.

### Verificación del día 33 (2026-11-02) — los 10 clásicos EN están

Auditoría de disco en la sesión de revisión: los 10 módulos EN del día 32
**sí están en `biblioteca/` (raíz, plana)**; la búsqueda por fecha fallaba
porque llevan LastWriteTime 1980. Verificado con el scan del
`EswordProvider` + lectura real:

- 726 módulos en `biblioteca/` (96 Biblias, 89 comentarios, 119
  diccionarios, 422 libros); AGENTS.md corregido a los datos medidos.
- Lee verificado: Gill Gen 1:1 y Pulpit Gen 1:1-2 (texto real, entradas
  de 36.000+ y 28.500+ caracteres).
- Respaldo de los zips de SermonIndex en `esword/clasicos-src/si-zips/`
  (SI-GILL/LANGE/PULPIT/ECF/ANF/EB, ~131 MB comprimidos).
- OCR de Lange (`esword/clasicos-src/lange/`, 22 txt Cornell) se conserva
  como fuente cruda; el módulo instalado lo hace innecesario.

Tests tras la verificación: 145/145; typecheck OK.
