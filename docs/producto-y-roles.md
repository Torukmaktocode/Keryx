# Keryx — Producto, funciones y roles (v0.4)

> Descripción de la app, función por función, con la usabilidad por rol
> (pastor · liderazgo · presbítero · diácono), beneficios y la dimensión
> del trabajo pastoral (la aritmética de 10 años).
> Última actualización: 2026-11-04 · día 34 · v0.4.0

---

## 1. Qué es Keryx en una frase

**Keryx** (κῆρυξ, "heraldo") es un software de escritorio (Windows y macOS)
de **estudio bíblico y predicación en español**, con una biblioteca de
726 módulos e-Sword reales (96 Biblias, 89 comentarios, 119 diccionarios,
422 libros), **7.947 artículos** de Coalición por el Evangelio con texto
completo, un motor que mina esa biblioteca **por código (0 señores IA)** para
fabricar un dosier de estudio de 25-43 citas **verificadas y citadas**, y un
asistente que redacta sermones completos, estudios bíblicos y devocionales
con la voz del predicador — sin inventar nada: si el módulo no da el dato,
la sección no existe.

Todo corre **offline** en el dispositivo (biblioteca local, traducción
neuronal instalada, verso verificado por SQLite); la única pieza opcional
en la nube es la redacción final si el usuario activa IA.

---

## 2. Funciones una a una

### Lectura y comparación
1. **Lectura simple con pestañas de módulo** — cualquier Biblia instalada; preferencia bien-font (RV60 limpia primero, "con Strong" al final).
2. **Comparación experta 2/4/6** — abre del lado opuesto del perfil de tu Biblia: RV60 ↔ NVI; en modo 4 suma NTV (o LBLA) y Amplificada; en modo 6 suma LBLA y la original (BHS en AT; interlineal/textual en NT).
3. **Modo apilado por verso** — bloques RV60/NVI/NTV/LBLA por verso, con nombre y perfil de traducción en cada trama.
4. **Chips de perfil de traducción** (formal · dinámica · paráfrasis · ampliada · original) en todos los modos.
5. **Lenguas nativas en la comparación** — la columna base usa texto verificado local (guaraní GDC2006, aymara AYBOL, mapudungún, bengalí, quechua neural); las demás columnas traduc SU texto con el daemon Argos del dispositivo.

### Estudio
6. **Estudio con paneles sincronizados** — Biblia + Comentario + Diccionario + Libro; sincronía por versículo único "una sola fuente de verdad"; plantillas (Estudio completo/Lectura/Libros/Investigación/Personalizado) y splitters persistentes.
7. **Comentario versículo a versículo con rangos** — acordeón como e-Sword; chips ℹ de "comentarios que cubren este capítulo" con conteo de versos.
8. **Diccionario por clic** — clic (o doble clic) en cualquier palabra del texto bíblico abre la entrada; chips ℹ "diccionarios con este término" para saltar entre recursos.
9. **Strong# clicables** — las marcas del módulo abren la palabra griega/hebrea; claves sin entrada caen a los módulos Strong de la biblioteca; Morfología Robinson y análisis interlineal en la secciones de exégesis.
10. **Búsqueda y ortografía** — todo en la biblioteca (AT/NT, por módulos, con sugerencias) en ~270 ms de escaneo total.

### Asistente (motor de minado + redacción)
11. **Dosier automático por pasaje** — 15-21 secciones con 25-43 `[Módulo · entrada]` en 400-1000 ms, minadas por sub-agentes de código (0 tokens y verificado en contra del texto real de tu biblioteca).
12. **Sermón completo con AST inmutable** — gancho, gran idea, puntos con evidencia anclada, transiciones decididas por código; la IA solo redacta la voz (gancho/intro/puentes/meditación/oración) en "modo economía" (1 llamada) o **deepSermon** (borrador → crítico → final).
13. **12 oradores** con perfil de voz (estilo, frases típicas, forma oratoria) — o tu propia voz sin imitación.
14. **Crítico anti-alucinación** — detecta Strong y referencias sin ancla en la salida, y repara o elimina con el dosier como única fuente; los huecos se marcan [PUNTO POR COMPLETAR] en vez de inventarse.
15. **Estudio bíblico completo y Devocional** — con la misma anclar: Observación/Interpretación/Aplicación y 5 preguntas con referencia; devocional con versículo clave, reflexión de 2-3 párrafos, oración y frase para llevar.
16. **Corpus Coalición en el dosier** — citas de artículos con **autor, fecha y URL**, rankeadas por tema del pasaje o de la consulta.
17. **Claves i18n en 7 lenguas** de interfaz (es/en/pt/it/fr/de/zh) + traducción del contenido a lenguas nativas.

### Escritura y púlpito
18. **Escritura minimalista (iA Writer style)** — editor CodeMirror 6 con enfoque, typewriter, markdown, documentos locales con historial.
19. **Exportaciones** — .doc/.md/Copiar del sermón/estudio/devocional; **PowerPoint** (pptx) para el proyector.
20. **Modo presentación** — proyectar el sermón en pantalla mientras predicas.
21. **Plantillas propias** — presets de secciones ajustables por el usuario (sermón/estudio/devocional/en blanco).

### Sistema
22. **Biblioteca sin copiar ni convertir** — escanea carpetas e-Sword (y SWORD/CrossWire) del usuario; cero migraciones; 726 módulos listos de fábrica.
23. **Instalación silenciosa en mac Big Sur** — DMG con biblioteca y corpus dentro, compilado en macOS real con prueba automática (727 módulos, lectura real de Jn 3:16, Argos traduciendo E2E).
24. **Traducción neuronal offline** — Argos/CTranslate2 en el dispositivo, sin tokens de pago; auto-instalación de paquetes la primera vez.

---

## 3. Usabilidad por rol

### Pastor (predica semanalmente)
- **Qué usará a diario**: Asistente → Sermón completo → exportar a pptx; Estudio como preparación; Lector para la lectura diaria.
- **Ritmo que habilitar**: 156 sermones x año. Con el dosier ya anclado (400-1000 ms) el tiempo de localizar y comparar se reduce de horas a minutos — la redacción, la oración y la meditación siguen siendo suyas.
- **Los textos salen listos para predicar en voz alta**: tiempo por seccion, señales oratorias y frase final en modo púulto.
- **Beneficio**: 1.248 h/año de preparación, ahora con acceso a 150.000 páginas de conocimiento en segundos.

### Líder (maestro de escuela dominical / de célula / jóvenes)
- **Qué usará**: Guía del Pasaje (fichas listas para dar clase), Estudio Bíblico completo del Asistente para preparar la clase, Búsqueda para armar series de tema.
- **No necesita IA activa si no quiere**: el dosier + estudio local bastan para una clase profundidad con citas que siempre pueden abrirse en el Estudio.
- **Beneficio**: pasa de "buscar en 5 libros" a una clase en minutos, con la evidencia citada en su mano.

### Presbítero / anciano (gobierno doctrinal)
- **Qué usará**: Estudio con Teología Sistemática + Historia + Consenso doctrinal (Hodge, Grudem, MacArthur, confesiones incluidas en el dosier) para deliberar decisiones de gobernanza.
- **Guía del Pasaje como minuta doctrinal** — fichas ancladas que se pegan en las actas del consejo con su cita.
- **Beneficio**: discier con las mismas fuentes históricas que consultarían en un seminario, sin depender de memoria ni de opiniones sueltas.

### Diácono (servicio, consejería básica, prácticas)
- **Qué usará**: Devocional para grupos pequeños (con la oración lista y frase para llevar), Casos bíblicos reales del dosier para consejería bíblica básica, Diccionario de clic para responder dudas concretas.
- **Beneficio**: material sólido sin entrenamiento formal — cada cosa que dice puede mostrar de qué módulo hace.

### Misionero / iglesia originaria
- **Qué usará**: Lector en lenguas nativas (guaraní/aymara/mapudungún/bengalí/quechua), traducción es→nativa offline del sermón/estudio/devocional en Inspiración y Guía; chips de carga y verso verificado para la confiabilidad del texto.
- **Beneficio**: enseñar en la lengua del pueblo, sin internet y sin pagar servicio.

---

## 4. La dimensión del trabajo pastoral (texto de referencia)

Un predicador fiel predica ~3 veces por semana con ~8 horas de
preparación por sermón:

| Por año | 10 años |
|---|---|
| Sermones: **156** | Predicaciones: **1.560** |
| Horas de preparación: **1.248** (24 h/semana) | Horas de investigación: **12.480** |
| | Días completos: **520** — **6,5 años laborales** |

Y eso sin contar lectura bíblica, oración, consejería, visitas,
administración y formación teológica. En una década, ese pastor
acumula **una biblioteca intelectual de 1.560 investigaciones
homiléticas**.

### La biblioteca equivalente

| Recurso | Volumenes | Páginas (×300) |
|---|---|---|
| Libros teológicos | 200 | 60.000 |
| Diccionarios y léxicos bíblicos | 100 | 30.000 |
| Comentarios bíblicos | 200 | 60.000 |
| **Total** | **500** | **150.000** |

| Actividad | Método tradicional | Con Keryx |
|---|---|---|
| Buscar significados originales | Léxicos físicos | Clic de palabra + Strong |
| Comparar interpretaciones | Varios libros abiertos | Acordeón de comentarios |
| Contexto histórico/geográfico | Varias fuentes | Ficha anclada de la Guía |
| Estudiar un pasaje | Volúmenes dispersos | Investigación integrada |
| Preparar el sermón | Investigación manual | Investigación asistida + tu voz |

La conclusión para Keryx: **no reemplaza el estudio del predicador** —
le entrega en segundos la profundidad de consulta que física sería
imposible de comprar, transportar o indexar, y deja la oración, la
redacción y la voz en el púlpito exactamente donde pertenecen:
en el predicador.

---

## 5. Beneficios en una lista

- **Tiempo**: de horas de localización y comparación a minutos anclados.
- **Firmeza doctrinal**: cada declaración citaba `[Módulo · entrada]` — auditatorio con un clic.
- **Anti-alucinación por diseño**: crítico de código + evals medibles 9.0/9.
- **Costo cero de minado**: 0 tokens para todo el estudio; IA opcional solo para la voz.
- **Offline total**: biblioteca, dosier, traducción neuronal y verso verificado en el dispositivo.
- **Alcance**: interfaces en ES/EN/PT (+4 lenguas de interfa), contenido traducible a lenguas nativas.
- **Instalable en una sola pieza** (Windows NSIS y mac Big Sur DMG con biblioteca y corpus dentro).
- **Cada rol sale servido**: pastor, líder, presbítero, diácono y misionero.
