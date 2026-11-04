# Keryx — Argumentario del predicador (v0.4)

> Documento público de producto: módulos, mejoras, comunidad de sermones,
> dimension del trabajo pastoral y objeciones con respuestas.
> Última actualización: 2026-11-04 · día 34 · v0.4.0

---

## 1. Qué traí Keryx — módulo por módulo

| Módulo (vista) | Qué hace |
|---|---|
| **Lector** | Biblia de estudio en pantalla: lectura simple, columna doble y comparación experta 2/4/6 (RV60 ↔ NVI ↔ NTV ↔ Amplificada, y en 6 columnas + LBLA + original/interlineal), modo apilado por verso estilo Logos, chips de perfil de traducción (formal · dinámica · paráfrasis · ampliada · original) y comparación con lenguas nativas (guaraní, aymara, mapudungún, bengalí, quechua) con verso verificado por SQLite local. |
| **Guía del Pasaje** (en el Lector) | Fichas de estudio por pasaje: texto, contexto histórico y social (Walton-Keener), cristológico, filológico, teológico, comentarios por cobertura, palabras originales, casos bíblicos, paralelos Lambert. 25-43 citas ancladas en 400-1000 ms, minadas por código (0 tokens IA). |
| **Estudio** | Estudio con paneles sincronizados (Biblia + Comentario + Diccionario + Libro), acordeón de comentarios verso a verso con rangos e-Sword, diccionario por clic de palabra y chips ℹ de cobertura, claves Strong clicables, plantillas de layout (Estudio completo, Lectura, Investigación, Personalizado) y splitters persistentes. |
| **Búsqueda** | Búsqueda en toda la biblioteca con filtros (AT/NT, módulos), conteo, sugerencias y corrección ortográfica — contra 726 módulos reales en ~270 ms de escaneo. |
| **Escritura** | Editor minimalista tipo iA Writer (CodeMirror 6) con enfoque, modo typewriter, markdown, documentos locales con historial y exportación a .doc/.md/Copiar. |
| **Asistente** | El corazón: tres generadores — **Sermón completo**, **Estudio bíblico** y **Devocional**. Sub-agentes deterministas minan 717 módulos reales + 7.947 artículos de Coalición por el Evangelio (0 tokens), arman un dosier de 15-21 secciones con 25-43 citas `[Módulo · entrada]`, y la IA solo redacta la voz encima. AST del sermón inmutable por código; crítico anti-alucinación (Strong y referencias sin ancla se reparan o eliminan); 12 oradores con perfil de voz; modo economía (1 llamada) y modo calidad deepSermon (borrador → crítico → final). |
| **Inspiración** | Escena del púlpito: texto del sermón con señales oratorias, meditación de cierre, frase final, y traducción a las lenguas instaladas de la congregación. |
| **Biblioteca** | Explorador de los 726 módulos e-Sword reales (Biblias/Comentarios/Diccionarios/Libros) + Corpus Coalición (7.947 artículos con texto completo, 180 temas); apertura directa en Estudio o Lector. |
| **Plantillas** | Presets del Estudio y creador de plantillas propias del usuario (secciones de sermón/estudio/devocional/en blanco, persistidas). |
| **Presentaciones** | Exporta el sermón a PowerPoint (pptx) y modo púlpito para proyectar mientras predicas. |
| **Módulos** | Instalador de recursos compatibles (e-Sword y SWORD/CrossWire): escaneo de carpetas sin copiar ni convertir; el usuario aporta su propia biblioteca legal. |
| **Ajustes** | Idioma de interfaz y de traducción (es/en/pt + nativas), ruta de biblioteca, claves de IA, marcadores Strong#, deepSermon y temas visuales. |

---

## 2. La vida detrás de un púlpito — la dimensión del trabajo

Un predicador fiel predica ~3 veces por semana y dedica ~8 horas por
sermón. El cómputo no es poético; es aritmética simple:

**Por año**
| Concepto | Resultado |
|---|---|
| Sermones | **156** |
| Horas de preparación | **1.248** (24 h/semana) |

**A 10 años**
| Total | Resultado |
|---|---|
| Predicaciones | **1.560** |
| Horas de investigación | **12.480** |
| Días completos investigando | **520** |
| Años de trabajo (8 h/día) | **6,5** |

Y eso sin contar lectura bíblica diaria, oración, consejería, visitas,
administración y formación. El predicador que predica 10 años ha
acumulado 1.560 investigaciones homiléticas — una biblioteca
intelectual propia que ninguna colección paga.

### La biblioteca detrás de Keryx

Una biblioteca de estudio de 500 volúmenes de ~300 páginas representa
**150.000 páginas de conocimiento especializado** (200 libros,
100 diccionarios y léxicos, 200 comentarios). transportarla, comprarla
y consultaría por completo: ningún pastor tiene eso en su estudio.

Keryx trae equivalentes listos y escaneados en una instalación:

- **726 módulos e-Sword** (96 Biblias, 89 comentarios — clásicos de dominio público y contemporáneos — 119 diccionarios, 422 libros).
- **7.947 artículos** de Coalición por el Evangelio con texto completo, indexados por 180 temas.
- Dosier por pasaje en **~1 segundo**: localiza, rankea y ancla la evidencia con **0 tokens del modelo** — la IA no consulta, ya recibió lo verificado.

El valor no es reemplazar el estudio del predicador — el púlpito sigue
siendo suyo — sino darle en segundos la profundidad de consulta que
a mano tomaría horas localizar.

---

## 3. Keryx Comunidad — "Cargala como fue"

Feature próxima (Fase 3, junto al backend de licencias):
**Comunidad de Sermones** para que los predicadores compartan su trabajo.

- **"Mi sermón, como lo viví"**: al compartir, el predicador agrega al
  sermón su testimonio — cómo se preparó, qué pasó en el púlpito ese
  día, cómo respondió la congregación. El sermón llega con historia,
  no solo con bosquejo.
- Flujo en la app: al terminar el sermón → botón **Compartir** →
  formulario de meta (pasaje, tema, iglesia, duración real, testigo
  del momento) → subida al backend (Cloudflare Workers + Supabase,
  infraestructura ya definida para la Fase 2 de licencias).
- Licencia de uso comunitario (CC BY-SA style): otros predicadores
  pueden leerlo, cargarlo en Keryx y predicarlo con atribución.
- Moderación simple (una cola de aprobación editorial en los primeros
  meses) para mantener la calidad y la doctrina de la casa.
- El archivo completo se convierte en una **nueva fuente minada por
  código**: los sermones de la comunidad se indexan por pasaje/tema y
  el Asistente puede citarlos otra predicadores reales — la sabiduría
  de quiénes ya lo predicaron.

---

## 4. Mejoras lanzadas (journey 0.4)

1. Dosier anti-alucinación verificable: 25-43 citas reales por pasaje, crítico de código que detecta Strong/referencias inventadas y las repara o elimina.
2. Corpus Coalición por el Evangelio (7.947 artículos) en el dosier y el Asistente, con autor, fecha y URL.
3. Comparación del Lector experta (RV60↔NVI; 4/6 columnas; interlineal en NT; BHS en AT) con perfiles de traducción.
4. Traducción neuronal OFFLINE a 5+ lenguas con verso verificado local (SQLite) — la iglesia hispana sirviendo a pueblos originarios.
5. Sermón con AST inmutable + 12 oradores + modo economía/calidad + export PowerPoint.
6. Instalación mac Big Sur silenciosa: biblioteca completa dentro del DMG, compilada en macOS real con humo automático (727 módulos, lectura real, daemon Argos E2E).
7. Evalu defends medida: `npm run eval` 9.0/9 en 5 pasajes dorados, 152 tests, evals de traducción 4/4 lenguas nativas.

---

## 5. Objeciones que lanzarán los pastores (y respuestas)

| Objeción | Respuesta |
|---|---|
| "La IA va a reemplazar la obra del Espíritu" | La IA no genera un solo dato: mina TU biblioteca por código y te entrega las citas; tú escoges, ordenas y predicas. Es el asistente, no el autor. ¿Se objeta poner un automatizado de Strong y un estudio? No — se objeta content fingir que fueron reveladas las citas. |
| "No confío en las alucinaciones de los modelos" | Nuestra arquitectura existe PRECISAMENTE contra eso: cualquier dato recomendado al prompt lleva `[Módulo · entrada]` verificable; el crítico de código detecta Strong y referencias sin ancla y los repara o elimina antes de entregarte el texto. Evals medibles 9.0/9. |
| "El estudio del púlpito es personal, no se puede atajar" | Keryx no atajará el estudio: reduce el tiempo de LOCALIZAR y COMPARAR (las 24 h/semana no son todas meditación: gran parte es buscar). El estudio de la palabra, la oración y la redacción te las dejamos contigo. |
| "¿Y si la IA inventa?" | No puede: si el módulo no provee el dato, capítulo no existe — se marca [PUNTO POR COMPLETAR] en lugar de rellenarlo. |
| "Mi computadora de la iglesia es vieja / no quiero pagar bibliotecas" | Keryx corre offline en Windows y mac ( Big Sur incluido) con biblioteca local; los módulos clásicos son de dominio público y el corpus Coalición es freely re-producible de su plataforma. Sin suscripción obligatoria a la core. |
| "¿Funciona sin internet?" | Sí: motor, biblioteca, dosier y traducción neuronal corren en el dispositivo. La IA (voz del sermón) es opcional y configurable. |
| "Es solo para pastores jóvenes; soy de papel" | La vista Estudio no es diferente de libros+diccionarios abiertos; abristro un módulo y lees. El Asistente es opcional — muchos usan Keryx solo como lector con comparación y Strong. |
| "No tengo los derechos de esos módulos" | Los clásicos dominio público y Coalición sí se pueden compartir; para módulos con autor vigente el instalador soporta la biblioteca propia del usuario (cada quien aporta la suya, como e-Sword siempre funcionó). |
| "¿Qué pasa con mis sermones? Son privados" | Nada se sube a ningún lado por defecto: documentos vivos en tu disco, no en ningún servidor. La opción de compartir de la comunidad es opt-in, con licencia y moderación. |
| "La app es complicada" | Layout de pestañas simples; el Agente tiene 3 modos (Sermón/Estudio/Devocional) y una barra de progreso visible; los usuarios que solo leen y escriben no tocan la IA nunca. |
| "¿Por qué 0 tokens importa?" | Por costo y por control: minar la biblioteca no gasta créditos ni envía tu contenido a la nube; solo la redacción final llama al modelo elegido — que puede ser local. |
| "No me fío de mac" | Compilamos en macOS real con prueba automática dentro del runner (módulos, lectura, corpus y traducción daemon verificados); el DMG va firmado por hashes y disponible para Windows igual. |
