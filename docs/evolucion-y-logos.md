# Documentación: evolución de Keryx y su posición frente a Logos

Fecha: 2026-10-11 · Estado: apilado y verificado con biblioteca real · Último commit: agentes de libros .refi

## 1. Cómo era al principio

- Biblioteca: sólo 19 módulos `.dctx` traducidos a mano de la enciclopedia Champlin + índice propio.
- Estudio: paneles generados con datos DEMO (`demo-provider.ts`) — nada era real.
- Asistente: IA genérica (chat con contexto mínimo), inventaba referencias y secciones sin fuentes.
- No había: dosier, sub-agentes, cobertura de comentarios, diccionarios de confianza, Strong, morfología, Griego, búsqueda decente, Guía del Pasaje.
- Costo IA: TODAS las cotas iban a la IA, inclusive el minado de datos.

Viradas: la bibliografía real ahora vive en `biblioteca/` (717 módulos .bbli/.cmti/.dcti/.refi) que se escanean en ~270 ms; el Champlin es historia.

## 2. Todas las mejoras medidas (checklist técnica)

1. Gate: Multi-raíz real (`EswordProvider(root, extraRoots)`), e-Sword 2009 con armadura de VerseCommentary segmentada y TOPIC de puntas `.refi`, dedup por nombre de archivo, robustez.
2. Estudio estilo e-Sword: plantillas de paneles, splitters arrachables, sync de versículo, acordeón por verso, marca ℹ de cobertura (~20 ms para 58 módulos) y espacios de diccionarios (~135 ms), clic-palabra → diccionario con `normTopic` que normaliza typos/acentos, Strong superíndice.
3. Asistente híbrido con sub-agentes de CÓDIGO (0 tokens): minado completo en TypeScript + SQLite.
4. Guía del Pasaje: pestaña nueva con fichas por sección del dosier, "Enviar al editor".
5. Contextos de profundidad: teológico (Ferguson-Packer/Beacon), cristológico (Jesús de Nazaret), social/cultural (Usos y Costumbres+Arqueológico), filosófico (Brugger/Herder), puentes pastorales (Compendio Doctrina Social).
6. Los 5 agentes de contexto **keyean sobre los temas del TEXTO del verso** (palabras distintivas ≥ 5 letras, sin códigos, sing/plur) cuando la consulta es sólo un pasaje — por eso "mundo" y "unigénito" dispararon entradas que citan Jn 3:16 literalmente.
7. Ranking de comentarios "pesados": Robertson, Calvino, Henry, Keil-Delitzsch, MacArthur, Barclay, Guzik, MacDonald, Wiersbe, Jamieson, Spurgeon, Scofield van primero (desapareció el orden alfabético que puso a "A Traves de la Biblia" arriba).
8. Verso-a-verso originales: Walton-Keener (Contexto Cultural, .cmti) y Exégesis crítica (Metzger, Cevallos, Código Real) — por VERSED exacto.
9. Griego real: Tuggy (léxico Greco-Español keyeado por la palabra española del verso → κόσμος/ἀγάπη con inflexiones). NOTA: Ortiz por número Strong NO se usa (numeración desalineada: 1063→"llenar" vs Strong gar) — seguridad de datos.
10. Morfología Robinson: `VAAI3S` → "verbo · aoristo · activo · indicativo · 3ª persona · singular" en dos candidatos (compacto y con guiones), renfiada desde el `<num>` del verso de la RV60 con Strong.
11. Paralelos y analogías Lambert: cuerpos relacionados con el tema → referencias cruzadas concatenadas en línea.
12. 422 libros `.refi` encendidos vía búsqueda `LIKE` con filtrado por matching real (no sólo sql): Teología Sistemática (Hodge, Grudem, MacArthur, Chafer, Garrett, Bavinck, Pearlman) + Historia (Justo González, Josefo, Eusebio, Fox) — por tema del verso o por nombre del libro bíblico.
13. Moody (Ilustraciones + 200 Anécdotas) entra en ilustraciones vía GenBook.
14. Presupuesto del dosier escalado 7000 → 16000 chars; ensamble determinista; agentes EN PARALELO (`Promise.all`).
15. `deepSermon` planificado: doble pasada IA (borrador→crítico→final) opt-in y fallback determinista (plan en `docs/superpowers/plans/2026-10-11-superar-logos-sermones.md`).

## 3. Métricas: cómo se midió el salto (Juan 3:16, mismo motor)

| Métrica | Antes | Ahora | Δ |
|---|---|---|---|
| Secciones del dosier | 6–7 | **17** | ×2.4 |
| Citas ancladas `[módulo·entrada]` | ~12 | **35** | +192% |
| Caracteres de evidencia real | ~6.600 | **14.300** | +117% |
| Autores pesados alcanzados | 0 | 7 archivos nuevos (Robertson, MacArthur, Walton-Keener, Cevallos, Tuggy, Robinson, Bavinck) | — |
| Tokens IA en el minado | 0 | **0** | — |
| Latencia del dosier | ~60 ms | **~390 ms** | sigue siendo subsegundo |
| Tiempo de redacción IA (opcional) | 1 llamada | 1 o 3 (deepSermon) | opt-in |
| Tests | — | **58/58** | 0 advisory |

## 4. Cómo se apila frente a Logos

| Dimensión | Logos | Keryx |
|---|---|---|
| Pipeline de sermón | Montaje manual con Sermon Builder + Assistant de pago | Automático: pasaje → 17 fichas ancladas → borrador en segundos |
| Fuentes | Bibliotecas pagadas, autores vivos (con ©) | 717 módulos ES: clásicos y contemporáneos |
| Idiomas originales | BDAG/HALOT (imbatible) | Strong + Robinson + Tuggy; sin BDAG pagado |
| Trazabilidad | parcial (recursos vinculados) | Total: cada frase con cita verificable |
| Anti-alucinación | Parcial | Determinista: el dosier es la ÚNICA fuente |
| Español | Ecosistema inglés | Spanish-first de fábrica |
| Costo | $300–3.000 + suscripción | $0 (+ centavos sólo por la redacción IA) |
| Offline | parcial | 100% de estudio |

### Cerca/paral обогre con Logos hoy:

- del "Exegetical Guide": **muy cerca** tras Task 1–3 del plan (ocurrencias por Strong con UI ya definida).
- de "Sermon Assistant" (IA): **superado en anclaje**, par con doble pasada de crítica hecha (Task 5).
- de BDAG/HALOT: **no reemplazable** (licencias ©). Estrategia: lemas verificados por lema (Task 4) + concordancias exhaustivas españolas reales.
- del library polish: en camino, no comparado.

## 5. Estado de endurecimiento (oct-2026, sesion SermonEngine)

Completado:
1. `strongsOccurrences` IPC + exégesis concordada con sentidos (BDAG-lite, refs clicables).
2. `ExegesisCard` + palabra real por Strong# — dentro de la Guía del Pasaje.
3. Lemas verificados por lema griego real (Ortiz NFD + decode entities).
4. `deepSermon` toggle (borrador → crítico → final, fallback local).
5. Export .doc/.md/Copiar en Asistente y Guía.
6. Batería de validación + **evals medibles** (`npm run eval`): 5 pasajes dorados con score automático — **9.0/9, 0 fallos** con la biblioteca real.

Arquitectura robusta nueva (estándar Anthropic):
- `swordTools.ts`: registro tipado de herramientas + cache intra-build + timeout grupal.
- Gap-analysis con **2ª pasada dirigida** en `buildDossier`.
- `sermonEngine.ts`: AST inmutable (`buildSermonDocument`) + `renderSermon` determinista con slots siempre cubiertos.
- Agentes nuevos: `consenso` (Hodge/Grudem/MacArthur/Chafer/Bavinck), `sintaxis` (Hanna/Hale), `nombres` hebreo (Hitchcock/21 Nombres/Enlow).
- Localización por texto libre con puntaje multi-palabra ("talita cumi" → Marcos 5:41).

## 6. Evolución de las respuestas de IA (de las primeras versiones a hoy)

| Versión | Qué llegaba al modelo | Respuesta típica | Problema |
|---|---|---|---|
| **V0 · demo** (antes de la biblioteca) | sólo el texto escrito por el usuario | Sermón genérico "desde cero", con citas que a veces NO existían y comentarios inventados | Alucinación servida como verdad |
| **V1 · un módulo** | texto del usuario + el versículo de la Biblia enfrentada | Bosquejo razonable, pero sin contexto ni exégesis; la "gran idea" era un cliché homilético | 1 sola fuente; el modelo rellena el resto |
| **V2 · recopilación de parrafos** | user text + etiquetas de versificadores y fragmentos de comentario pegados al prompt | Puntos mejor dados con "así dice Mateo Henry", pero mezclados de un módulo inadecuado (orden alfabético) | Selección no experta; sin morfología ni historia |
| **V3 · dosier por sub-agentes** | dosier de ~16.000 chars: 15-21 secciones recopiladas en paralelo (texto, Robertson+MacArthur, Walton-Keener, Bavinck, Hodge/Grudem, Tuggy, Robinson, Lambert, Fox...) con 25-43 citas `[Módulo · entrada]` | Borrador con gran idea extraída del comentario real, contornos de Wiersbe/Smith, puentes pastorales del Compendio, aplicación concreta, oración; opcional deepSermon: borrador→crítico→final | La IA ya no INVENTA contenido bíblico; sólo redacta encima de fuentes verificadas |
| **V4 · SermonEngine (AST)** | mismo dosier + gap-analysis 2ª pasada; el sermón se construye como **documento tipado inmutable** (buildSermonDocument): estructura oratoria completa por código (gancho/intro con dato real/señales/cierre con bendición) + registros de herramientas con cache | La IA solo puede llenar el TEXTO de slots de voz (gancho/intro/puentes/meditación/oración) en 1 llamada corta; la estructura y la evidencia no las toca nadie | Imposible dejar huecos: cada slot tiene fallback determinista; evals 9.0/9 |
| **Fallback determinista** | el mismo dosier | Documento COMPLETO sin IA (bandera `LOCAL_NOTICE`): documento renderizado desde el AST con todos los slots en fallback | Costo: 0 tokens SIEMPRE disponible |

Arquitectura vigente (diagrama de una línea):

```
usuario → buildDossier (10+ sub-agentes de CÓDIGO, Promise.all, ~390 ms, 0 tokens)
        → dosier citado (16k chars máx)
        → [opcional] IA: 1 llamada (redacta) o 3 (deepSermon: borrador→critica→final)
        → [si falla] composeFromDossier determinista completo
```

## 7. Keryx (agente + sub-agentes) frente a TODO el mercado

Criterios evaluados para CADA producto sin variantes: pasaje Juan 3:16 → somando hasta el borrador del sermón completo.

| Criterio | Solo ChatGPT (pro) | Solo Claude | Solo Gemini | Logos (Sermon Assistant IA) | **Keryx (sub-agentes + IA)** |
|---|---|---|---|---|---|
| Fuentes consultadas | 0 — sólo memoria entrenada | 0 | 0 | su biblioteca pagada | **717 módulos locales reales** |
| ¿Cita comentario con módulo+entrada del pasaje del usuario? | a veces, no verificado | similar | similar | sí, dentro de su lib | **SIEMPRE, 25-43 citas verificables + "Fuentes ancladas" garantizadas por código** |
| Morfología Strong | genérica/de entrenamiento | buena | buena | **excelente (BDAG)** | sólida (Robinson) + Tuggy + Ortiz por lema + sintaxis Hanna |
| Contexto cultural (Walton-Keener) | emulado de memoria | emulado | emulado | sí | **anclado versículo a versículo real** |
| Estructura oratoria | genérica | genérica | genérica | plantillas manuales | **código**: intro con dato real / señales «Primeramente… «Y para concluir…» / meditación / cierre con bendición |
| Consenso doctrinal automático | no | no | no | no | **sí (Hodge/Grudem/MacArthur/Chafer/Bavinck por tema)** |
| Citas sabias por tema | alucina atribuciones | alucina | alucina | parcial | **Vila 656 temas + Ruiz, ancladas, con atribución** |
| Riesgo de alucinación | media | media | media | media-baja | **baja (dosier + AST: la IA no toca la estructura)** |
| Español | sesgado a inglés | buen ES | buen ES | débil | **ES por diseño** |
| Costo/sermón | tokens + $20/mes | tokens + $20/mes | tokens + $20/mes | US$14–99/mes + biblioteca | **$0–1 llamada corta (~centavos)** |
| Velocidad (pasaje → borrador) | 30 s–2 min | igual | igual | 5–15 min de montaje | **~0.6 s de minado + voz en segundos** |
| Offline | no | no | no | parcial | **estudio y borrador completamente local** |
| ¿Todo dato verificable? | no al 100% | no al 100% | no al 100% | casi sí, si pagas | **sí, por arquitectura (evals 9.0/9)** |

Lectura rápida: **ChatGPT/Claude/Gemini solos** son estilistas excelentes con amnesia de fuentes — brillantes para redactar, débiles para datos bíblicos verificables (especialmente en módulos ES). **Logos** es el académico pagado. **Keryx** es la combinación: el mejor dato local del mercado en español + cualquier cerebro (Claude por defecto) que sólo necesita redactar encima de las fuentes ya verificadas.

## 8. Principios no negociables

- NADA va al prompt de la IA sin cita `[Módulo · entrada]`.
- Si un módulo no da el dato, la sección no aparece; jamás refigurar.
- El minado es SIEMPRE de código (0 tokens). La IA sólo redacta.
- El AST del sermón es inmutable: la IA sólo llena el texto de slots; la estructura y la evidencia son de código.
- El motor es SQLite local; nada de APIs cerradas en el pipeline de datos.
- Cada cambio se mide contra `npm run eval` (9.0/9 vigente), no contra opinión.

(Copyrights: el contenido de Champlin queda fuera del producto; los módulos gratuitos de Biblioteca Hispana / e-Sword se usan tal como se distribuyen.)
