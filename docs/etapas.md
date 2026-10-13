# Keryx â€” EvoluciÃ³n por etapas (mapa para humanos e IAs)

> Quien trabaje en el Asistente, GuÃ­a del Pasaje o SermonEngine DEBE leer la
> etapa vigente y la anterior: aquÃ­ estÃ¡ el porquÃ© de cada decisiÃ³n.
> Ãndice rÃ¡pido: E0 esqueleto â†’ E1 motor real â†’ E2 estudio â†’ E3 dosier â†’
> E4 SermonEngine (vigente). Complemento comparativo:
> `docs/evolucion-y-logos.md`.

Formato: cada etapa tiene **estado**, **fecha**, **versiÃ³n sugerida**,
**quÃ© entrÃ³**, **cÃ³mo se verifica** y **lÃ­mites conocidos** (para que una IA
sepa no sÃ³lo dÃ³nde estÃ¡bamos, sino quÃ© pendientes heredan los cambios futuros).

---

## E0 â€” Esqueleto (2025) Â· versiÃ³n `0.1.0`

- Electron + React + TS + workspaces. `demo-provider.ts` con datos falsos.
- Chat de IA genÃ©rico sin fuentes (alucinaba citas y comentarios).
- Casa de la biblioteca: 19 mÃ³dulos `.dctx` traducidos a mano (experimento
  Champlin) â€” retirado en oct-2026.
- No habÃ­a: Strong, morfologÃ­a, cobertura, bÃºsqueda seria, GuarÃ­a del Pasaje,
  sub-agentes.

## E1 â€” Motor e-Sword real Â· `0.1.x`

- `EswordProvider` sobre `node:sqlite` (experimental en Electron 37):
  `Bible`, `VerseCommentary` e-Sword 2009 con rangos
  (`ChapterBegin/VerseBegin..End`), `ChapterCommentary`, `BookCommentary`,
  `Dictionary(Topic, Definition)` y `Reference(Chapter, Content)` para
  `.refi`.
- Escaneo de `biblioteca/` recursivo + `esword/` + `sword/` en ~270 ms â†’
  **717 mÃ³dulos reales** (96 Biblias / 79 comentarios / 120 diccionarios /
  422 libros), sin copiar ni convertir.
- `packages/i18n` propio (es fuente; en/pt aÃ±adidas juntas).
- Persistencia Ãºnica: `userData/keryx-store.json` (escritura atÃ³mica).
- VerificaciÃ³n: fixtures multi-raÃ­z, esquemas e-Sword 2009, bÃºsqueda
  normalizada multi-palabra con y sin acentos.

## E2 â€” Estudio avanzado (2026-10-11) Â· plan `docs/superpowers/plans/2026-10-11-biblioteca-estudio.md`

- Plantillas de layout (`completo | lectura | libros | investigar | custom`)
  + splitters arrastrables con anchos persistidos (renormalizados) + apilado responsivo â‰¤ 1100 px.
- SincronÃ­a de versÃ­culo como Ãºnica fuente de verdad; pin por panel.
- AcordeÃ³n de comentarios verse-por-verse respetando rangos (la entrada que
  *cubre* el verso).
- Diccionario por clic-palabra con `normTopic` (acentos, numeraciÃ³n
  inicial, prefijos `\b`) + fallback a Strong `G26/H430`.
- Chips â„¹ de cobertura: comentarios por capÃ­tulo (~20 ms) y diccionarios por
  tÃ©rmino (~135 ms).
- Strong# clicables (toggle en Ajustes); `lookupLemma` indexa por **lema
  griego real** (NFD, sin acentos).

## E3 â€” Sub-agentes de cÃ³digo + GuÃ­a del Pasaje Â· `0.3.0`

- Sub-agentes deterministas (0 tokens) en paralelo (`Promise.all`) minan los
  717 mÃ³dulos y arman un dosier citado `[MÃ³dulo Â· entrada]`:
  15â€“21 secciones, 25â€“43 citas, ~400â€“1000 ms.
- **GuÃ­a del Pasaje** pestaÃ±a en Estudio con fichas del dosier y "Enviar al
  editor".
- Ranking pesado de comentarios (Robertson, Calvino, MacArthur, Henry,
  Keil-Delitzsch, Barclay, Guzikâ€¦) â€” ya no orden alfabÃ©tico.
- Walton-Keener por verso (contexto cultural), exÃ©gesis crÃ­tica (Metzger,
  Cevallos), teologÃ­a sistemÃ¡tica (Hodge/Grudem/Chafer/Bavinck/Pearlman),
  historia (Josefo/Fox/Eusebio/Justo GonzÃ¡lez), paralelos Lambert, Moody en
  ilustraciones vÃ­a GenBook.
- Griego: Tuggy por palabra espaÃ±ola del verso; morfologÃ­a Robinson
  (`VAAI3S` â†’ aoristo activo indicativo 3Âª sg.); Ortiz SOLO por lema real
  (su numeraciÃ³n Strong estÃ¡ desalineada â€” no confiar en el nÃºmero).
- LocalizaciÃ³n de pasaje por texto libre con puntaje multi-palabra
  ("talita cumi" â†’ Marcos 5:41).
- Contextos teolÃ³gico/cristolÃ³gico/social-filosÃ³fico keyeados por las
  palabras del TEXTO del verso (no cÃ³digos).

## E4 â€” SermonEngine + hardening (2026-10-12/13, vigente) Â· `0.4.0` plan `docs/superpowers/plans/2026-10-11-superar-logos-sermones.md` (T1â€“T6 ejecutados)

- `lib/swordTools.ts` â€” registro **tipado de herramientas** (schema, budget,
  cache intra-build, timeout grupal): los agentes componen herramientas,
  jamÃ¡s SQL suelto.
- Gap-analysis con **2Âª pasada dirigida** en `buildDossier` (variantes de
  acento, diccionarios generales) antes de rendir.
- `lib/sermonEngine.ts` â€” **AST inmutable del sermÃ³n**
  (`buildSermonDocument`) + `renderSermon` 1:1: estructura oratoria
  completa por cÃ³digo (gancho â†’ intro con dato real â†’ seÃ±ales
  Â«Primeramenteâ€¦Â» â†’ puntos con evidencia â†’ citas Vila/Ruiz â†’ ilustraciÃ³n
  con caso bÃ­blico â†’ meditaciÃ³n â†’ cierre con bendiciÃ³n â†’ oraciÃ³n â†’ fuentes
  ancladas). Cada slot tiene fallback: **huecos imposibles**, con o sin IA.
- Modos: **economÃ­a** (default, IA solo voz, 1 llamada â‰¤700 tokens) y
  **deepSermon** (borradorâ†’crÃ­tico homilÃ©ticoâ†’final; fallback local si
  falla).
- 12 oradores con perfil completo (bio, modismos, frases, forma
  homilÃ©tica, apertura/cierre, lente de aplicaciÃ³n) + "Ninguno".
- ExÃ©gesis **BDAG-lite** por Strong# en `ExegesisCard`: lema griego,
  transliteraciÃ³n, sentidos agrupados por traducciÃ³n ES real con refs
  clicables, distribuciÃ³n por secciones del NT, formas gramaticales.
- Export `.doc` / `.md` / Copiar en Asistente y GuÃ­a del Pasaje.
- Agentes nuevos: consenso doctrinal, sintaxis exegÃ©tica (Hanna/Hale),
  nombres hebreos (Hitchcock/21 Nombres/Enlow).
- **Evals medibles**: `scripts/eval-sermons.mts` â€” 5 pasajes dorados
  (evangelio/epÃ­stola/salterio/parÃ¡bola/texto-libre), score automÃ¡tico 9
  criterios (cobertura por gÃ©nero, citas â‰¥5, presupuesto, sin marcadores,
  slots completos):

```
evangelio   Juan 3:16      ~516 ms Â· 19 secciones Â· 43 citas Â· 9/9
epistola    Romanos 8:28   ~564 ms Â· 19 secciones Â· 40 citas Â· 9/9
salterio    Salmo 23:1     ~574 ms Â· 15 secciones Â· 25 citas Â· 9/9
parabola    Lucas 10:25    ~600 ms Â· 17 secciones Â· 35 citas Â· 9/9
texto-libre talita-cumi    ~974 ms Â· 16 secciones Â· 36 citas Â· 9/9
Result: 0/5 fallos Â· score medio 9.0/9
```

## E4.1 — Versiones multiplataforma (2026-10-13) · commits `853ddf7..89978e3+`

- **Windows**: instalador liviano 74,6 MB (compression maximum, locales
  es/en-US/pt-BR/pt-PT, electron 37.10.3 exacto, NSIS sin differentialPackage);
  biblioteca se lee del disco local, NUNCA se empaqueta en Windows. Editor
  con carga perezosa (React.lazy): bundle 2.558 → 1.613 kB.
- **Repo**: `biblioteca/` fuera de la historia de git (filter-repo, −~1 GB);
  .rar redundantes borrados del disco (−778 MB). `npm run eval` verificado
  9.0/9 antes y después.
- **macOS (CI)**: `build-mac.yml` en GitHub Actions; descarga
  `biblioteca.7z` (869 MB) del release `biblioteca-v1` de ESTE repo privado,
  extrae con py7zr, verifica ≥717 módulos, corre `npm run eval` como gate,
  produce DMGs arm64+x64 y los publica en el release `mac-dmg` (los assets de
  Release no cuentan contra la cuota de Actions; cada uno <2 GiB).
- **Postura de redistribución**: el repo es PRIVADO; la biblioteca (módulos
  e-Sword gratuitos de Biblioteca Hispana, derechos no claros) vive en el
  release `biblioteca-v1` y en los DMG. No distribuirla públicamente; DMG
  solo para uso personal/personas de confianza.
- **DMG sin firmar**: `mac.identity: null` explícito. Primer arranque:
  clic derecho → Abrir (o `xattr -cr /Applications/Keryx.app`). Firmar y
  notarizar antes de cualquier distribución pública.
- Pendiente E5: app web Netlify (Lector+Estudio+Escritura, módulos locales
  vía File System Access + SQLite WASM).

## Siguiente (candidatos, sin compromiso)

- E5: builder de bosquejos desde el AST (editar en vivo), bajar latencia
  con Ã­ndices persistentes de dictionary/commentary, tests de i18n,
  instalador firmado, baza BDAG-real vÃ­a licencia.

---

## MÃ©tricas acumuladas (motor, no opiniÃ³n)

| MÃ©trica | E0 | E3 | E4 (hoy) |
|---|---|---|---|
| Secciones dosier | 6â€“7 | 17 | 15â€“21 |
| Citas ancladas | ~12 | 35 | 25â€“43 |
| Chars evidencia | ~6.600 | 14.300 | 14.000â€“16.000 |
| Tokens IA en minado | todos | **0** | **0** |
| Latencia dosier | ~60 ms | ~390 ms | 400â€“1000 ms |
| Tests | 0 | 58 | **70** |
| Evals golden pasaje | â€” | â€” | **9.0/9, 0 fallos** |

## Principios invariables desde E3

1. Nada al prompt de IA sin cita `[MÃ³dulo Â· entrada]`.
2. Si el mÃ³dulo no da el dato, la secciÃ³n no existe.
3. Minado SIEMPRE de cÃ³digo (0 tokens); IA solo voz.
4. AST inmutable del sermÃ³n.
5. Todo cambio del motor se valida con `npm run eval`.
