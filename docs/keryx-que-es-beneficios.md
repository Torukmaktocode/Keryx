# Keryx — Qué es, para qué sirve y por qué le cambia la semana al pastor

> Resumen completo de producto · v0.4.0 · 2026-11-27

---

## 1. Qué es Keryx

**Keryx** (κῆρυξ = *heraldo*) es una aplicación de escritorio para
**estudio bíblico, inspiración y predicación**, hecha para pastores,
líderes y maestros de la Palabra de habla hispana.

Funciona **offline en Windows y Mac** y trae dentro, en una sola
instalación, una biblioteca completa de estudio:

- **726 módulos e-Sword reales**: 96 Biblias, 89 comentarios
  (clásicos de dominio público + contemporáneos), 119 diccionarios y
  léxicos, 422 libros.
- **7.947 artículos** de Coalición por el Evangelio, indexados por 180 temas.
- Motor de traducción neuronal **offline** a lenguas originarias.

Todo el minado de información lo hace **código determinista (0 tokens
de IA)**: la IA solo redacta la voz final, y jamás mete un dato que no
venga de la biblioteca con su cita `[Módulo · entrada]`.

---

## 2. Para qué sirve — los 6 pilares

### 1) Leer y comparar (Lector)
Biblia de estudio con lectura simple, doble columna y **comparación
experta de 2, 4 y 6 traducciones** (RV60 ↔ NVI ↔ NTV ↔ Amplificada ↔
LBLA ↔ original/interlineal), con chips que explican el perfil de cada
traducción (formal, dinámica, paráfrasis, ampliada, original).

### 2) Estudiar en profundidad (Estudio + Guía del Pasaje)
Paneles sincronizados estilo e-Sword: Biblia + Comentario +
Diccionario + Libro al mismo tiempo, comentarista que salta al verso,
diccionario con un clic en la palabra, claves Strong clicables y
marcas ℹ que dicen qué módulos hablan del pasaje.
La **Guía del Pasaje** entrega una ficha completa (contexto histórico,
cristológico, teológico, palabras originales, paralelos) con
**25–43 citas reales en ~1 segundo**.

### 3) Inspirar y predicar (Asistente + Inspiración + Presentaciones)
- **Sermón completo, estudio bíblico y devocional** generados sobre un
  dosier citado y verificado: el esqueleto, la estructura y la
  evidencia son de código; el escritor elige orador, tono y voz entre
  **12 perfiles de orador** (o el suyo propio).
- **Inspiración**: escena del púlpito con señales oratorias,
  meditación de cierre y frase final listas para predicar.
- **Exportación** a .doc, .md, copiar, y **PowerPoint con modo
  púlpito** para proyectar mientras predica.

### 4) Ver el original: griego y hebreo (interlineal)
- **Lector interlineal**: cada versículo en líneas por palabra —
  transliteración · texto original (G = griego · H = hebreo) · español ·
  parsing gramatical · **número de Strong**.
- **Léxicos del original**: léxico griego del NT (Tuggy) consultado por la
  palabra real del versículo, diccionarios Strong (G26, H430...) clicables
  en Estudio y Lector.
- **Exégesis crítica**: Metzger, aparato crítico, interlineal Cevallos y
  comentarios del texto griego, priorizados automáticamente en el dosier.
- Nombres hebreos con su significado (Hitchcock) y sintaxis exegética.

### 5) Paralelos y referencias cruzadas (Lambert)
Sección del dosier que cruza los **temas del versículo con el diccionario
Lambert de Paralelos-Concordancias-Analogías**: pasa de un texto a los
pasajes hermanos de toda la Escritura, con cita anclada, en milisegundos.

### 6) Sermón en menos de 60 segundos
El flujo rápido es real: se elige el pasaje → los sub-agentes minan
los 726 módulos en **~400–1000 ms (0 tokens)** → el motor arma el AST
del sermón completo → una sola llamada de IA pone la voz.
**En menos de un minuto el predicador tiene un sermón completo,
estructurado, con citas verificadas y exportable** — lo que a mano
toma 8 horas de localizar, comparar y redactar.

---

## 3. Beneficios concretos para pastores y líderes

| Beneficio | Qué significa en la semana real |
|---|---|
| **Ahorra horas** | El pastor predica ~3 veces/semana y dedica ~8 h por sermón: 1.248 h al año. Keryx elimina la parte de *buscar y comparar* (la mayor parte del tiempo), no la meditación. |
| **Profundidad de una biblioteca de 150.000 páginas** | 500 volúmenes equivalentes consultables al instante; ningún estudio físico paga eso. |
| **Cero alucinaciones** | Todo dato lleva cita `[Módulo · entrada]`; un crítico de código repara o elimina referencias inventadas. Evals medibles: **9.0/9, 0 fallos**. |
| **Privacidad total** | Nada se sube a la nube por defecto: los sermones viven en el disco del usuario. |
| **Funciona sin internet y sin suscripción obligatoria** | Motor, biblioteca, dosier y traducción corren en el dispositivo; la IA es opcional y configurable (puede ser local). |
| **Simple para quien "es de papel"** | Quien solo quiere leer y estudiar no toca la IA nunca: Estudio y Lector funcionan como los libros de siempre. |

---

## 4. Comunidad — subir, descubrir y predicar sermones

Sección integrada en **Inspiración** con backend propio (Cloudflare
Workers + Supabase), ya implementada:

- **Subir mi sermón**: el predicador publica el sermón que tiene en el
  editor con su meta (pasaje, tema, iglesia, ciudad, país, contexto,
  minutos, experiencia real en el púlpito).
- **Descubrir**: lista de sermones recientes y **ranking de los más
  apreciados**; perfil público con todos los sermones de cada autor.
- **Interactuar**: likes, comentarios, y **seguir autores** (con
  contador de seguidores) para no perderse a los predicadores que
  edifican.
- El archivo compartido se convierte en una fuente minada por código:
  el Asistente puede citar sermones de **otros predicadores reales**
  que ya pasaron por ese texto.

## 5. Comunidad de Oración — "Orad unos por otros" (Santiago 5:16)

Vista completa de intercesión con backend propio:

- **Pedir oración**: formulario con nombre, país, categoría (salud,
  familia, trabajo, economía, gratitud, salvación, perdón, fe,
  esperanza, amor, enseñanza…) y el anliegen.
- **Llamita**: botón "Estoy orando por esto" — el que pide ve cuánta
  gente está intercediendo por su petición en tiempo real.
- **Testimonio**: el que pidió marca la petición como respondida y
  comparte **cómo Dios contestó**.
- **Comentarios y palabras de ánimo** en cada petición, pestañas de
  recientes y **ranking de apoyo**.

---

## 6. Multilenguaje y lenguas nativas

- **Interfaz en 7 idiomas**: español, inglés, portugués, alemán,
  francés, italiano y chino (fuente `es`).
- **Lector y traducción a lenguas originarias, offline**: guaraní,
  aymara, mapudungún (quechua activo), bengalí y más — con verso
  verificado localmente por SQLite (la app muestra *el texto real del
  corpus*, nunca una invención del modelo).
- La **Guía, la Inspiración y los sermones pueden traducirse** a las
  lenguas instaladas de la congregación: una iglesia hispana puede
  servir a pueblos originarios sin depender de internet.
- Evals de traducción con métrica chrF++/BLEU: **4/4 lenguas PASS**.
- Comparativa del Lector por columna: cada lengua muestra su propio
  texto junto a la base del corpus, para leer en paralelo.
- Los módulos de original (griego/hebreo/interlineales) **nunca se
  traducen**: se protegen como idioma de origen.

---

## 7. La aritmética que lo resume

| Concepto | A mano | Con Keryx |
|---|---|---|
| Localizar y comparar fuentes | Horas por sermón | **~1 segundo** (dosier citado) |
| Sermón completo estructurado | 8 h | **< 60 segundos** de espera + tu edición |
| Traducir a lengua nativa | Imposible sin traductor | **Offline, en la app** |
| Biblioteca de 150.000 páginas | $ y espacio | **Incluida en la instalación** |

**El púlpito sigue siendo del pastor. Keryx solo le pone la
biblioteca completa, verificada y en su idioma — y el de su
congregación — a un clic.**
