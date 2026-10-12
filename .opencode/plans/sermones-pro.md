# Plan: Sermones PRO — introducciones/puentes con datos, parábolas, geografía y oradores nuevos

Estado: investigación verificada con la biblioteca real (sondas SQLite) + fuentes públicas de estilo de Dante Gebel.Sin cambios de código aún (plan mode).

## Diagnóstico de lo que aún se siente "pobre"

1. **Introducción y puentes = voz con poca materia prima.** La llamada de voz recibe el esqueleto, pero no lleva una lista condensada de DATOS reales (histórico/cultural/geo/casos) para usar; el fallback determinista es genérico (`"Hoy abrimos {ref}…"`) y en modo "Ninguno" queda chato.
2. **Falta "toque profesional": parábolas y figuras del lenguaje.** Jesús usaba parábolas; hay módulos reales listos y sin explotar:
   - `Lenguaje Popular Religioso.dcti` tiene entradas **PARABOLA** y **GALILEA** (verificado).
   - `Diccionario de Figuras de Diccion.dcti`, `Figuras e Ilustraciones.dcti` (figuras retóricas).
3. **Datos históricos/geográficos demasiado cortos en el cuerpo.** El `geoJob` keyea solo por NOMBRE del libro ("Juan"); no busca las palabras geográficas del propio verso (Galilea, Cafarnaúm) en Martens/Pfeiffer/Tidwell.
4. **Oradores**: falta Dante Gebel; el de Lewis puede profundizarse con "Cristianismo puro y simple" (Mere Christianity).

## Tareas

### T1 · DATOS en la voz (intro y puentes con materia prima real)
**Archivos:** `apps/desktop/src/renderer/src/lib/creator.ts`
**Interfaces:** `assembleSermon` y el bloque economía arman un `datosBrief`:
```
const datosBrief = [historico, cultural, geo, caso].flat().slice(0,4).map(shortEntry(160)).join('\n')
```
- Se agrega al `ask` de la llamada de voz bajo `DATOS DEL PASAJE (usá al menos uno en la intro o en un puente; son reales y anclados, no inventes otros):`.
- Resultado: la intro cita un dato concreto ("Cafarnaúm era…") en vez de frases vacías.
- Test: mock de IA que devuelve intro sin datos → sigue pasando; test nuevo con mock que los usa → markdown de la intro contiene el dato.

### T2 · Modo "Ninguno — mi propio estilo" con resultados pro
**Archivos:** `creator.ts` (solo composeSermonSkeleton/assembleSermon fallbacks)
- **Fallback de intro determinista enriquecido**: 3 plantillas rotando según hash del ref (cronológica — "antes que todo esto…"; pregunta directa; detalle del texto).
- **FALLBACK_BRIDGES**: de 3 a 7 variantes (pregunta, contraste, evidencia→vida, etc.) rotando por índice de punto.
- **Oración fallback** incluye la referencia y la gran idea (ya la usa; mantener).
- Test: dos llamadas sin IA con refs distintas → intros distintas; `## Introducción` nunca vacía.

### T3 · Agentes de parábolas y figuras (kind 'figura' + 'parabola')
**Archivos:** `agents.ts` (job nuevo), `PassageGuide.tsx` (title key), i18n ×3, `creator.ts` (compositor + esqueleto usan la sección), `agents.test.ts`.
- `deviceJob`: temas = [libro, themeForCtx, verseThemes]; módulos en orden: `Lenguaje Popular Religioso` → topics `PARABOLA`/`FIGURA`; `Diccionario de Figuras de Diccion` + `Figuras e Ilustraciones` por las palabras del verso.
- Solo entradas ≥120 chars (patrón del casoJob); citation kind `'figura'`.
- En el esqueleto: `## Parábola o figura del lenguaje` (punto de analogía para el predicador). En compositor full-AI igual.

### T4 · Geografía e historia del VERSO (no solo del libro)
**Archivos:** `agents.ts` (extender geoJob o nuevo `geoVerseJob`), i18n, tests.
- Extraer palabras propias del texto del verso ya disponibles (`verseThemes`) y busacarlas en `Diccionario de Geografia Biblica - H Martens` / `Geografia` / `Geografia Tidwel Pierson` / `Usos y Costumbres` / Pfeiffer (arqueológico) — trayendo **entrada del lugar** (Galilea, Cafarnaúm) al dosier.
- Estas líneas entran al `datosBrief` de T1 (los datos concretos fluyen a la voz).

### T5 · Orador Dante Gebel (id `gebel`) + Lewis potenciado
**Archivos:** `creator.ts` (PERSONAS + PERSONA_PROFILE), `agents.test.ts` opcional.
`gebel` — todo descriptivo (sin citas largas de nadie):
- bio: argentino del conurbano; River Church (Anaheim, EE.UU.); "La Divina Noche" (TV); Martín Fierro 2023; llegó al millón de reproducciones con una narrativa criolla.
- idioms/modismos: "pibe", "el banco de suplentes", "golazo en el último tiempo", "el estilo de Dios", "caballo de Troya" (entra por la cultura, sale por Jesús).
- shape: **3 actos**: relato ordinario con humor → paralelo bíblico (caso real del dosier) → giro final a Jesús y llamado.
- opening: "Arranco con una historia que no parece de iglesia…"
- closing: gira a Jesús al final ("ahora sí, déjame presentarte al dueño de la historia").
- application: moderna, ejemplos de trabajo/deporte/familia, con humor cariñoso y nada de moralina.
- NOTA de rigor: sermón de Gebel estudiado como ESTILO (estructura estratégica-humorativa), sin reproducir frases largas con ©; "el estilo de Dios" se usa el CONCEPTO como gancho homilético.
`lewis` potenciado — de "Cristianismo puro y simple": idioms 'la ley de la naturaleza humana', "no vino a enseñar moral sino a hacer de nosotros pequeñas encarnaciones", 'la建军 del catérico'…
(solo descriptores cortos y referencias de títulos/líneas conceptuales).

### T6 · Batería de calidad en tests (+ retry de localización)
**Archivos:** `agents.test.ts`, `creator.test.ts`
- Nuevo it: dosier Juan 3:16 contiene secciones `caso` (`'Donde Hallarlo'` o Nave) y (T3) `figura`.
- Nuevo it esqueleto: la intro del fallback tiene dato cuando hay contexto; con IA, la intro pedida va en el formato ==INTRO==.
- Localización extra: si 0 hits en todos los tokens → probar con lista de sinónimos por distancia? (queda solo si trivial).

## Orden de ejecución
T2 → T1 → T3 → T4 → T5 → T6 (cada una con commit; ~sesión mediana).

## Riesgos
- `Diccionario de Figuras de Diccion` está keyeado de forma desconocida (sonda pendiente en execución): si no keyea por palabra, el job de figuras queda solo con Lenguaje Popular + Figuras e Ilustraciones (≥1 fuente).
- i18n: claves nuevas ×3 idiomas.
- Tokens: el `datosBrief` agrega ~600-800 chars de entrada (~200 tokens); salida sigue ≤700-900 tokens (1 llamada).
