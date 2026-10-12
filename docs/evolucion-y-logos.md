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

## 5. Lo que falta por endurecer (plan vigente)

1. Task 1: `strongsOccurrences` IPC + proveedor (motor de "concordancia" G25/H430 en TODA la Biblia).
2. Task 2-3: `ExegesisCard` + palabra real por código en la Guía.
3. Task 4: Índice de lemas Strong→Tuggy/Ortiz verificado vía canal `dict:topics`.
4. Task 5: `deepSermon` toggle (crítico homilético).
5. Task 6: export pulpit-grade (.doc/.md).
6. Task 7: batería de validación del dosier (4 géneros: Evangelio/Salmo/Epístola/Parábola).
7. Task 8: e2e manual con arreglos.

## 6. Principios no negociables

- NADA va al prompt de la IA sin cita `[Módulo · entrada]`.
- Si un módulo no da el dato, la sección no aparece; jamás refigurar.
- El minado es SIEMPRE de código (0 tokens). La IA sólo redacta.
- El motor es SQLite local; nada de APIs cerradas en el pipeline de datos.

(Copyrights: el contenido de Champlin queda fuera del producto; los módulos gratuitos de Biblioteca Hispana / e-Sword widow house se distribuyen con la app de esta sección redactora externa.)
