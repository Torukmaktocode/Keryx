# Plan v4 — Cerrar los 3 huecos frente a Logos con la biblioteca real

Objetivo: elevar Keryx al nivel/supera Logos en los 3 puntos honestos pendientes,
usando EXCLUSIVAMENTE la biblioteca local ya escaneada (0 tokens en el minado).

## PUNTO 1 · "BDAG/HALOT interno" → Exégesis Pro por verso

La biblioteca ya traía (verificado): Tuggy, Ortiz (por lema), Strong ES,
Robinson, Morphological Codes, **Aparato Crítico NT**, **Interlineal Cevallos**,
**Sintaxis Exegética del NT Griego — R Hanna**, **Ayuda para el Estudio del NT
Griego — R Hanna**, **Aprendamos Griego — Clarence Hale**, 21 Nombres de Dios,
Hitchcock/Enlow (nombres hebreos).

**T1a · agenta `sintaxisJob` (kind 'sintaxis')** — `agents.ts`
- búsqueda por Strong# y temes del verso en los 3 módulos Hanna/Hale;
  kind 'sintaxis', recorte ≤520, citas `[módulo · entrada]`.
**T1b · agenta hebreo** (mismo idiomasJob extendido): lookup por tema en
  'Diccionario de Nombres Biblicos - Hitchcock' y '21 Nombres de Dios'
  para claves H-*; código determinista.
**T1c · ExegesisCard → "BDAG-lite Pro"**: la ficha como una sola vista:
  lema + sentidos + formas + Ortex + **sintaxis (T1a)** + **aparato crítico del verso**
  (el agenta `criticoJob` ya existe; se pasa al interior de la ficha) + hebreo (T1b).
**T1d · export del bloque exegético completo** (Markdown ya disponible).

## PUNTO 2 · "Autores doct rinales" → Consenso doctrinal automático

La biblioteca trae 6 teologías sistemáticas (Hodge, Grudem, MacArthur,
Chafer/Garrett, Bavinck + Pearlman) y homilética (Vila Púlpito, Reeves,
Alvarenga).

**T2a · agenta `consensoJob` (kind 'consenso')** — `agents.ts`
- búsqueda por tema (libro/del verso) en Hodge/Grudem/MacArthur/Chafer/Bavinck
  (máximo 4 fuentes ancladas, una por autor).
- salida con formato de CONSENSO: fragmentos por autor con `[Autor · tema]`.
**T2b · creador + esqueleto**: sección `## Consenso doctrinal` en el cuerpo
  del sermón (antes de Aplicación) y en `composeFromDossier` (mod's full-AI).
**T2c · Presupuestos**: DOSSIER_BUDGET 16000 → 18000 para absorber consenso.

## PUNTO 3 · Pulido final: export, validación, exegesis en Estudio

**T3a · Export .docx/.md** de la ficha Exegésis/Guía/sermón (transparentes
  con `Blob` + Word MIME, ya diseñado en plan previo Task 6).
**T3b · batería de validación** (agents.test): mínimos por 4 géneros
  (evangelio/epístola/salmo/parábola via `at`): texto+comentario+historico+caso
  y (ahora) consenso/sintaxis cuando el pasaje los tiene.
**T3c · revalidación localizador**: caso de regresión "hablar...talita-cumi".

## Orden de ejecución
T1a → T1c → T2a → T2b → T3a → T3b (commits por bloque; smoke con biblioteca real).

## Reglas no negociables (iguales a siempre)
- Todo minado 0 tokens; IA solo redacta encima del dosier (modo economía).
- Si un módulo no da el dato, la sección no aparece.
- i18n ×3 idiomas para lign clave nueva.
- Sin dependencias nuevas para export.
