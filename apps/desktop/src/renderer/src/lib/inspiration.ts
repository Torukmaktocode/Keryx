/**
 * Inspiración: los grandes sermones de la historia cristiana.
 * Fichas de dominio público o resumen crítico: contexto y ocasión, texto base,
 * estructura, citas representativas, estilo e impacto histórico.
 */
export interface InspirationSermon {
  id: string
  title: string
  author: string
  year: number
  place: string
  occasion: string
  themes: string[]
  text: string
  style: string
  impact: string
  outline: string[]
  quotes: string[]
  duration: string
  bigIdea?: string
  application?: string[]
  /** fiabilidad de la ficha: documentado = sermon con registro historico; reconstruido = estilo fiel del predicador. */
  veracity?: 'documentado' | 'reconstruido'
  /** Como fue la predicacion en vivo: escenario, audiencia y manera de hablar. */
  preached?: string
  /** Como abrio el sermón: el primer movimiento retorico antes del texto. */
  introduction?: string
  /** Frases y formulas retoricas que uso (ademas de las citas fijas). */
  phrases?: string[]
  /** El puente retorico hacia cada punto de la estructura (mismo orden). */
  bridges?: string[]
}

export interface InspirationAuthor {
  id: string
  name: string
  era: string
  tradition: string
  bio: string
  style: string
}

export const AUTHORS: InspirationAuthor[] = [
  {
    id: 'agustin',
    name: 'Agustín de Hipona',
    era: '354-430',
    tradition: 'Padre latino de la Iglesia',
    bio: 'Obispo de Hipona y el teólogo más influyente de Occidente. Se conservan más de quinientos sermones suyos predicados a la comunidad de Hipona.',
    style: 'Confesional y retóricamente luminoso: el corazón inquieto hasta descansar en Dios.'
  },
  {
    id: 'chrysostom',
    name: 'Juan Crisóstomo',
    era: 'c. 347-407',
    tradition: 'Padre griego de la Iglesia',
    bio: 'Apodado "boca de oro" por su elocuencia; arzobispo de Constantinopla y cima de la homilética oriental.',
    style:
      'Exégesis moralmente ardiente: aplica el texto directo a la conciencia, denuncia avaricia y vanidad.'
  },
  {
    id: 'luther',
    name: 'Martín Lutero',
    era: '1483-1546',
    tradition: 'Reformador / luterano',
    bio: 'Monje agustino, profesor de Wittenberg y padre de la Reforma; sus sermones marcaron la piedad alemana.',
    style:
      'Cristocéntrico y paradójico: ley que rompe y evangelio que sana; la cruz antes que la gloria.'
  },
  {
    id: 'calvino',
    name: 'Juan Calvino',
    era: '1509-1564',
    tradition: 'Reformado / ginebrino',
    bio: 'Reformador de Ginebra; predijo versículo por versículo en St. Pierre casi sin apuntes, casi todos los días.',
    style:
      'Reformado claro y sobrio: sola scriptura, exégesis fiel, la gloria de Dios como fin del sermón.'
  },
  {
    id: 'bossuet',
    name: 'Jacques-Bénigne Bossuet',
    era: '1627-1704',
    tradition: 'Oratoria sagrada francesa',
    bio: 'Obispo de Meaux, máxima figura de la elocuencia sagrada del siglo XVII; predicador de la corte de Luis XIV.',
    style:
      'Grandeza y solemnidad clásica: orden perfecto, meditación inminente de la brevedad de la vida.'
  },
  {
    id: 'edwards',
    name: 'Jonathan Edwards',
    era: '1703-1758',
    tradition: 'Congregacionalista / Gran Despertar',
    bio: 'Teólogo del Gran Despertar norteamericano, pastor de Northampton y luego misionero; figura de la teología del afecto.',
    style:
      'Teología del afecto: precisión doctrinal, imágenes sublimes de la gloria de Dios, urgencia eterna.'
  },
  {
    id: 'whitefield',
    name: 'George Whitefield',
    era: '1714-1770',
    tradition: 'Metodista / calvinista',
    bio: 'Voz del avivamiento anglo-americano; predicó al aire libre a decenas de miles en Gran Bretaña y América.',
    style:
      'Evangelístico y teatral: imágenes vívidas, apelación directa al corazón, urgencia del nuevo nacimiento.'
  },
  {
    id: 'wesley',
    name: 'John Wesley',
    era: '1703-1791',
    tradition: 'Metodista / arminiano',
    bio: 'Fundador del metodismo; predicó más de cuarenta mil sermones y organizó el discipulado en clases y bandas.',
    style:
      'Santidad y llamado: gracia que capacita a vivir como Cristo, urgencia evangelística y disciplina comunitaria.'
  },
  {
    id: 'spurgeon',
    name: 'Charles H. Spurgeon',
    era: '1834-1892',
    tradition: 'Bautista reformado',
    bio: 'El "príncipe de los predicadores": pastor del Tabernáculo Metropolitano de Londres; sus sermones impresos circulan hasta hoy.',
    style:
      'Centrado en la cruz: evangelístico, ilustraciones vivas, franqueza sobre el pecado, calvinismo cálido.'
  },
  {
    id: 'lloydjones',
    name: 'D. Martyn Lloyd-Jones',
    era: '1899-1981',
    tradition: 'Presbiteriano / calvinista',
    bio: 'Ex-médico y pastor de Westminster Chapel, Londres; sus exposiciones de Romans marcaron medio siglo.',
    style:
      'Expositivo-diagnóstico: examina al oyente como un médico, doctrina aplicada al corazón, lógica progresiva.'
  },
  {
    id: 'tozer',
    name: 'A. W. Tozer',
    era: '1897-1963',
    tradition: 'Alianza Cristiana y Misionera',
    bio: 'Pastor profético en Chicago; denunció la superficialidad del cristianismo de su época en libros y púlpito.',
    style:
      'Profético-devocional: exaltación de la santidad de Dios, frases afiladas, adoración como centro.'
  },
  {
    id: 'keller',
    name: 'Timothy Keller',
    era: '1950-2023',
    tradition: 'Presbiteriano (PCA)',
    bio: 'Fundador de Redeemer Presbyterian Church en Nueva York; pionero del evangelismo urbano intelectual.',
    style:
      'Apologista urbano: de la gran idea a las idolatrías del corazón; responde a los escépticos con gracia.'
  },
  {
    id: 'graham',
    name: 'Billy Graham',
    era: '1918-2018',
    tradition: 'Bautista / evangelista global',
    bio: 'El evangelista más influyente del siglo XX: predicó delante de más de doscientos millones de personas en decenas de países durante más de sesenta años.',
    style:
      'Evangelismo claro y apurado: apelación directa a la cruz, llamado público al arrepentimiento, lenguaje sencillo y solemnidad a la vez.'
  },
  {
    id: 'macarthur',
    name: 'John MacArthur',
    era: '1939-2025',
    tradition: 'Bautista independiente / reformado',
    bio: 'Pastor de Grace Community Church de Los Ángeles durante más de cincuenta años y fundador de Grace to You; figura de la exposición bíblica moderna.',
    style:
      'Expositivo versículo por versículo: doctrina transparente, sin anécdotas largas, defensa constante de la suficiencia de la Escritura.'
  },
  {
    id: 'stanley',
    name: 'Charles Stanley',
    era: '1932-2023',
    tradition: 'Bautista evangélico',
    bio: 'Fundador de In Touch Ministries y pastor de First Baptist Church de Atlanta durante casi cincuenta años; pionero de la enseñanza por televisión y radio.',
    style:
      'Devocional directo: aplicación práctica de la Escritura, obediencia y confianza en una vida guiada por Dios.'
  },
  {
    id: 'osteen',
    name: 'Joel Osteen',
    era: '1963-actualidad',
    tradition: 'Bautista / Lakewood',
    bio: 'Pastor principal de Lakewood Church de Houston, el templo más grande de Estados Unidos; su programa televisivo y pastorales alcanzan decenas de países.',
    style:
      'Motivacional devocional: aliento diario, fe declarada y gracia de Dios; lenguaje sencillo y caloroso con equilibrio doctrinal.'
  },
  {
    id: 'evans',
    name: 'Tony Evans',
    era: '1948-actualidad',
    tradition: 'Bautista independiente',
    bio: 'Pastor de Oak Cliff Bible Fellowship de Dallas y fundador de The Urban Alternative; reconocido por su visión del Reino de Dios.',
    style:
      'Agenda del Reino: la visión de Dios para la vida, la familia y la ciudad; lenguaje vivo, imágenes claras y llamado a la acción.'
  },
  {
    id: 'cho',
    name: 'David Yonggi Cho',
    era: '1936-2021',
    tradition: 'Pentecostal coreano',
    bio: 'Fundador y pastor de la iglesia Yoido Full Gospel de Seúl, la de mayor asistencia del mundo durante décadas; pionero del discipulado por células y de la oración comunitaria.',
    style:
      'Oración y fe declarada: el cuarto de oración y la proclamación de la Palabra como motor de la vida de la iglesia local.'
  },
  {
    id: 'gebel',
    name: 'Dante Gebel',
    era: '1968-actualidad',
    tradition: 'Evangélico / River Church, Anaheim',
    bio: 'Pastor y conferencista argentino radicado en Estados Unidos; la voz más reconocida de la predicación hispana en Anaheim y más allá, con miles de oyentes cada semana y una generación marcada por sus charlas.',
    style:
      'Narrativo-humorístico: anécdotas llenas de ironía que llegan a la emoción, predicación de superación personal y fe de fuego, con oferta de gracia.'
  },
  {
    id: 'witt',
    name: 'Marcos Witt',
    era: '1962-actualidad',
    tradition: 'Evangélico / adoración',
    bio: 'Adorador y pastor mexicano-estadounidense; figura mayor de la adoración en español durante décadas, hoy pastor de la congregación en español de Lakewood, Houston.',
    style:
      'Adoración como estilo de vida: enseña que el culto a Dios no se detiene en la música, sino que abarca toda la existencia; voz calorosa y animadora.'
  },
  {
    id: 'luna',
    name: 'Cash Luna',
    era: '1975-actualidad',
    tradition: 'Evangélico / Casa de Dios',
    bio: 'Pastor principal de Casa de Dios en Guatemala, una de las congregaciones más grandes de Latinoamérica; su ministerio de poder y sanidad ha alcanzado audiencias en todo el continente.',
    style:
      'Sobre el poder de Dios y la sanidad: predicación con expectativa, fe declarada, ambiente de adoración y testimonios de milagros.'
  },
  {
    id: 'maldonado',
    name: 'Guillermo Maldonado',
    era: '1965-actualidad',
    tradition: 'Evangélico / Casa Internacional del Padre',
    bio: 'Pastor hondureño radicado en Houston, fundador y maestro de Casa Internacional del Padre (Kingdom City); su ministerio se centra en lo sobrenatural.',
    style:
      'Sobre lo sobrenatural: fe acción, proclamación del poder de Dios y ministerio según intención de la Palabra escrita.'
  },
  {
    id: 'latimer',
    name: 'Hugh Latimer',
    era: '1487-1555',
    tradition: 'Reforma inglesa / obispo de Worcester',
    bio: 'Obispo reformador inglés, predicador de la corte de Eduardo VI y voz llana del campo inglés; quemado junto a Ridley en Oxford en 1555.',
    style:
      'Llanura campesina y fuego: imágenes del arado y del campo, humor cortante, la predicación vernácula como tesoro nacional.'
  },
  {
    id: 'baxter',
    name: 'Richard Baxter',
    era: '1615-1691',
    tradition: 'Puritano anglicano',
    bio: 'Pastor de Kidderminster y autor de El pastor reformado y El descanso perpetuo de los santos; el médico del ministerio pastoral puritano.',
    style:
      'Precisión pastoral y urgencia médica: cura de almas con inventario honesto, la eternidad pesando en cada decisión.'
  },
  {
    id: 'finney',
    name: 'Charles G. Finney',
    era: '1792-1875',
    tradition: 'Presbiteriano evangélico / avivamiento',
    bio: 'Abogado convertido y arquitecto del avivamiento de segunda generación en EE. UU.; sus lecturas sobre el avivamiento fundaron la homilética revivalista.',
    style:
      'Razonamiento forense y apelación directa: el avivamiento como ley moral, la decisión del oyente al centro.'
  },
  {
    id: 'mcheyne',
    name: 'Robert Murray M\u2019Cheyne',
    era: '1813-1843',
    tradition: 'Presbiteriano escocés',
    bio: 'Pastor de St. Peter\u2019s, Dundee, muerto a los 29 años; su canon de sermones y su plan de lectura bíblica alimentaron el avivamiento de Dundee de 1839.',
    style:
      'Tierno y grave: Cristo en cada texto, lirismo escocés, la mortalidad como amigo del evangelio.'
  },
  {
    id: 'evans',
    name: 'Christmas Evans',
    era: '1766-1838',
    tradition: 'Bautista calvinista galés',
    bio: 'El predicador más célebre de Gales, llamado el Bunyan galés; escribió sus sermones de memoria y predicó una sola vez cada uno.',
    style:
      'Imaginación galesa y drama del pacto: imágenes monumentales, el evangelio como épica del campo.'
  },
  {
    id: 'massillon',
    name: 'Jean-Baptiste Massillon',
    era: '1663-1742',
    tradition: 'Oratoria sagrada francesa',
    bio: 'Obispo de Clermont y predicador de la corte; su Petit Carême ante Luis XV y su oración fúnebre por Luis XIV son cumbres del género.',
    style:
      'Ternura moral bajo solemnidad: la corte desarmada con lentitud, la conciencia humana al desnudo.'
  },
  {
    id: 'bourdaloue',
    name: 'Louis Bourdaloue',
    era: '1632-1704',
    tradition: 'Oratoria sagrada jesuita',
    bio: 'Jesuita de las Cuaresmas de la corte de Luis XIV; maestro de la lógica moral, tan claro que Voltaire lo estudió como modelo de razón.',
    style:
      'Lógica moral impecable: examen del vicio punto por punto, estilo que convence antes que conmueve.'
  },
  {
    id: 'morgan',
    name: 'G. Campbell Morgan',
    era: '1863-1945',
    tradition: 'Congregacionalista',
    bio: 'Pastor de Westminster Chapel, Londres, y príncipe de los expositores; leía cada libro de la Biblia cuarenta veces antes de predicarlo.',
    style:
      'Exposición arquitectónica: el libro entero en la cabeza, el sermón como lectura de la estructura del texto.'
  },
  {
    id: 'sunday',
    name: 'Billy Sunday',
    era: '1862-1935',
    tradition: 'Bautista / evangelista de tabernáculos',
    bio: 'Ex-jugador de béisbol profesional convertido en el evangelista más frenético de EE. UU.; predicó en tabernáculos a decenas de millones.',
    style:
      'Atletismo homilético: saltos, mímica, frases de una patada; el pecado nombrado sin anestesia.'
  },
  {
    id: 'king',
    name: 'Martin Luther King Jr.',
    era: '1929-1968',
    tradition: 'Bautista afroamericana',
    bio: 'Pastor de Dexter Avenue y Ebenezer, conductor del movimiento por los derechos civiles; su homilética entrelaza profetas, evangelios y la lucha de su pueblo.',
    style:
      'Oratoria profética: anáfora creciente, imágenes del éxodo, la justicia de Dios cruzada con la esperanza americana.'
  },
  {
    id: 'washer',
    name: 'Paul Washer',
    era: '1961-actualidad',
    tradition: 'Bautista reformado / HeartCry',
    bio: 'Misionero en Perú y fundador de HeartCry Missionary Society; su mensaje juvenil de 2002 despertó una generación al arrepentimiento radical.',
    style:
      'Diagnóstico sin anestesia: pregunta incisiva, gracia sola en Cristo, la conversión como realidad y no como folklore.'
  },
  {
    id: 'sproul',
    name: 'R. C. Sproul',
    era: '1939-2017',
    tradition: 'Presbiteriano reformado / Ligonier',
    bio: 'Fundador de Ligonier Ministries y pastor de St. Andrew\u2019s Chapel; docente magistral de la santidad de Dios y de la teología clásica.',
    style:
      'Docencia que escala a predicación: definiciones exactas, analogías históricas, la santidad como categoría madre.'
  },
  {
    id: 'piper',
    name: 'John Piper',
    era: '1946-actualidad',
    tradition: 'Bautista reformada / Desiring God',
    bio: 'Pastor de Bethlehem Baptist Church, Minneapolis, durante treinta y tres años y fundador de Desiring God; predicó siempre de manuscrito y publicó sus textos completos gratis.',
    style:
      'Placer cristocéntrico: Dios como felicidad suprema, argumento escalonado, frases que condensan gozo y sacrificio.'
  }
]

export const THEMES = [
  'Evangelismo',
  'Arrepentimiento',
  'Gracia',
  'Firma y certeza',
  'Crisis y prueba',
  'Oración',
  'Muerte y eternidad',
  'Santidad',
  'Adoración',
  'Poder sobrenatural',
  'Anhelos humanos',
  'Idolatría del corazón',
  'Penitencia'
] as const

export const SERMONS: InspirationSermon[] = [
  // ------------------------------------------------------------------ //
  {
    id: 'edwards-sinners',
    author: 'Jonathan Edwards',
    veracity: 'documentado',    title: 'Pecadores en las manos de un Dios airado',
    year: 1741,
    place: 'Enfield, Connecticut',
    occasion:
      'Predicado por primera vez en su congregación de Northampton y repetido el 8 de julio de 1741 en Enfield, Connecticut, durante el Gran Despertar. Los oyentes gritaron, lloraron y se aferaron a los bancos.',
    themes: ['Arrepentimiento', 'Muerte y eternidad'],
    text: 'Deuteronomio 32:35 — "Mía es la venganza y yo pagaré; a su tiempo se tambaleará su pie, porque el día de su calamidad está cerca."',
    style:
      'Contraste absoluto entre ira y misericordia; imágenes físicas (abismo, telaraña, represa) sostenidas por una lógica impecable; tono sereno y medido que hace aún más estremecedor el contenido; sin anécdotas ni humor.',
    impact:
      'El sermón más famoso de la historia norteamericana. Encendió el Despertar en Nueva Inglaterra y define la predicación de juicio hasta hoy.',
    outline: [
      'El texto no distingue: nadie está exento, y ningún sano puede librarse a sí mismo de la ira de Dios.',
      'Será poderosa: la ira de Dios es como las aguas de una represa que solo la paciencia divina detiene.',
      'Será merecida: Dios no castigará por debajo de lo que cada uno merece, sino en justicia exacta.',
      'Será inminente: nada garantiza otro día, ni una hora; el pie ya resbala en el abismo.',
      'Será inaguantable: ningún poder humano, ningún rey, puede salvar del brazo de Dios.',
      'Será eterna: la misericordia ya no se ofrecerá después de la muerte.'
    ],
    quotes: [
      '"No hay nada entre ti y el infierno más que el aire; solo el poder y el mero agrado de Dios te sostienen."',
      '"Dios te sostiene sobre el pozo del infierno, como quien sostiene una araña o algún insecto repugnante sobre el fuego."',
      '"El arco de la ira de Dios está tensado, la flecha apunta a tu corazón, y solo el puro agrado de un Dios airado retiene un momento la flecha."'
    ],
    preached:
      'Edwards no predicaba: leía. Se le describe como una figura menuda y pálida que, con el manuscrito al nivel de los ojos por su miopía, declamaba con voz uniforme, sin gestos y sin elevar el tono, dejando que el contenido hiciera el trabajo. Predicado primero en su congregación de Northampton, alcanzó su forma legendaria el 8 de julio de 1741 en Enfield, Connecticut, desde el púlpito de la iglesia local durante un encuentro de avivamiento. Según los relatos contemporáneos, antes de terminar la primera parte los oyentes gritaban, gemían y se aferaban a los bancos; varios preguntaban qué debían hacer para ser salvos. El contraste entre la calma del predicador y el estallido del auditorio se volvió proverbial.',
    introduction:
      'Abre leyendo el texto de Deuteronomio 32:35 y lo fija de inmediato: las palabras del cántico de Moisés contra Israel parecen dirigidas a un pueblo que se creía seguro. Su primer movimiento es extraer una doctrina aterradoramente simple de esa aparente seguridad: que no hay cosa alguna que los pecadores hagan para librarse de la ira de Dios. A continuación anuncia que considerará varios puntos, uno a uno, con rigor lógico.',
    phrases: [
      '"mía es la venganza y yo pagaré": repite las palabras del texto como un martillo para fijar la autoridad de la sentencia.',
      'la imagen del pie que ya resbala en el abismo: traduce la doctrina en sensación física de caída inminente.',
      'la represa que solo la paciencia divina detiene: convierte la ira en aguas represadas para hacer tangible la tensión.',
      'la tela de telaraña que el pecador teje para sostenerse: ridiculiza las seguridades humanas con una imagen de fragilidad extrema.',
      'la gradación de la ira del hombre a la ira del Dios infinito: escala el temor paso a paso hasta lo inconmensurable.',
      'el cierre con apelación: que todo el que quiera librarse de la ira venidera huya a Cristo, virando del juicio a la puerta de la misericordia.'
    ],
    bridges: [
      'Del texto a la primera observación pasa por el contraste: Moisés advierte a un Israel que se creía a salvo, y Edwards concluye que el texto no distingue entre personas; nadie sano puede librarse a sí mismo.',
      'Entra al punto de la potencia de la ira con la imagen del caudal: como las aguas de una represa presionan la presa, la ira de Dios se acumula y solo la paciencia divina la contiene.',
      'Al tratar la merecida proporción del castigo apela a la lógica de la conciencia: Dios no castiga por capricho ni por debajo del merecido, sino en justicia exacta; el oyente debe confesar que nada pedirá rebaja.',
      'Pasa a la inminencia con una pregunta directa al oyente: ¿qué garantía tienes de otro día, de una sola hora? Con ello convierte la doctrina en tiempo presente del oyente.',
      'Ante la impotencia humana despliega una anáfora de poderes que no alcanzan a salvar: ningún príncipe, ningún ejército, ningún brazo humano contra el brazo de Dios, acumulando casos para agotar toda esperanza natural.',
      'Cierra con apelación solemne: tras el repaso de los seis puntos, advierte que la misericordia ya no se ofrecerá después de la muerte, y vuelve del abismo a la única puerta abierta, que es huir ahora a Cristo.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'edwards-divine-light',
    author: 'Jonathan Edwards',
    veracity: 'documentado',    title: 'Una luz divina y sobrenatural',
    year: 1733,
    place: 'Northampton, Massachusetts',
    occasion:
      'Explicó a su congregación la experiencia de conversión que muchos jóvenes estaban viviendo al inicio del despertar de Northampton.',
    themes: ['Gracia', 'Santidad'],
    text: '2 Corintios 4:6 — "Porque Dios, que mandó que de las tinieblas resplandeciese la luz, es el que ha resplandecido en nuestros corazones."',
    style:
      'Exposición doctrinal en tono razonado: define primero lo que NO es la gracia (ni emoción, ni aprobación moral, ni imaginación) antes de explicar lo que sí es; apelación al corazón al final.',
    impact:
      'Da nombre a la experiencia clásica de conversión de los avivamientos y funda la teología del avivamiento del siglo XVIII.',
    outline: [
      'No es: la gracia no se recibe por mero conocimiento doctrinal, ni es discurso teológico.',
      'No es: tampoco son impresiones de la imaginación ni sentidos corporales.',
      'No es: tampoco la aprobación moral que demonios y réprobos también pueden tener.',
      'Es: una nueva percepción de la gloria divina en el rostro de Cristo, directa y sobrenatural.',
      'Es: convence al alma de la realidad de las cosas santas de manera racional y experimental a la vez.',
      'Es: produce la fe que abandona la confianza propia y descansa en Dios.'
    ],
    quotes: [
      '"El alma percibe la gloria de las cosas divinas bajo una nueva manera: no le es nueva doctrina, sino nueva luz."'
    ],
    preached:
      'Predicado en Northampton en 1733, ante la congregación que Edwards pastoreaba y, muy especialmente, ante los jóvenes que al inicio del despertar reportaban experiencias de conversión que otros despreciaban como exaltación. Edwards, como siempre, leyó su manuscrito con voz clara y razonada, sin clamor ni dramatización, en el tono de un argumento doctrinal cuidado. La reacción fue de convicción serena: el sermón dio a los conversos un criterio para discernir su experiencia y a los escépticos un límite. Según los relatos, esta predicación ayudó a ordenar el avivamiento de la ciudad y se convirtió en texto de referencia para el propio Edwards en años posteriores.',
    introduction:
      'Abre con 2 Corintios 4:6 y despliega su paralelo favorito: como Dios mandó al principio que de las tinieblas resplandeciese la luz, así obra en el corazón convertido. Su primer movimiento retórico es de demarcación pedagógica: antes de decir qué es la luz, se dispone a mostrar qué no lo es, para que nadie confunda la obra de Dios con sus imitaciones naturales.',
    phrases: [
      '"Dios, que mandó que de las tinieblas resplandeciese la luz": usa el texto como clave de lectura de todo el sermón, creacionismo y re-creación en paralelo.',
      'un sentido espiritual del corazón: introduce su categoría central, la facultad nueva por la que el alma percibe lo santo.',
      'la luz no se persuade: se ve: condensa su argumento contra la mera persuasión racional con una fórmula memorable.',
      'saborear las cosas divinas: usa el gusto como analogía de la percepción nueva, más honda que el saber.',
      'los demonios conocen mucho y no aman nada: despliega el caso límite de los demonios para separar conocimiento y gracia.',
      'no le es nueva doctrina, sino nueva vista: resume el cambio de categoría del conocimiento al percibir, sin repetir la fórmula de su cita principal.'
    ],
    bridges: [
      'De la introducción al primer punto entra por negación: si la conversión no es obra de la luz natural, tampoco puede ser mero conocimiento doctrinal, por elevado que sea; así marca el primer límite de la demarcación.',
      'Continúa el ascenso de las negaciones con un contraste: tampoco son impresiones de la imaginación ni de los sentidos corporales, y para ilustrarlo recurre a la analogía del ojo que ve frente al que solo sueña que ve.',
      'El tercer demarcador entra como prueba de fuego: ni siquiera la aprobación moral de las cosas santas es gracia, pues los demonios y los réprobos pueden tenerla; el contraste esteriliza toda falsa seguridad.',
      'Pasa de lo negativo a lo positivo con una analogía luminosa: así como el que recibe el sentido de la vista descubre de pronto la gloria que rodeaba sin verla, el alma recibe un sentido nuevo de la gloria divina en el rostro de Cristo.',
      'Al segundo aspecto positivo entra por síntesis: esta percepción convence al alma de la realidad de las cosas santas de manera a la vez racional y experimental, resolviendo la tensión que la introducción había dejado abierta.',
      'Cierra con apelación al corazón: del discernimiento doctrinal pasa al fruto, la fe que abandona la confianza propia y descansa en Dios, invitando a cada oyente a pedir esa luz.'
    ],
    duration: '35 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'edwards-eagerness',
    author: 'Jonathan Edwards',
    veracity: 'documentado',    title: 'La diligencia aceptable',
    year: 1735,
    place: 'Northampton, Massachusetts',
    occasion:
      'Llamó a sus oyentes a dejar la indolencia espiritual; parte de cuando su congregación se preguntaba cómo "correr" tras la salvación.',
    themes: ['Eternidad'],
    text: 'Isaías 32:17 — "Y la obra de justicia será paz; y la labor de justicia, reposo y seguridad para siempre."',
    style:
      'Exégesis calvinista con énfasis en la labor del alma que "trabaja" en la gracia; estructura suficiente-motivación-aplicación.',
    impact: 'Balance clásico entre la soberanía de Dios y el llamado a la vigilancia espiritual.',
    outline: [
      'La paz es fruto de la justicia, no de la ociosidad.',
      'La conciencia pesada no da reposo; el descanso verdadero nace de la obra de Cristo.',
      'El descuido espiritual es la raíz de la infelicidad del creyente.'
    ],
    quotes: [
      '"El que ama el descanso, ama también la labor de la justicia; pues la obra de justicia es paz."'
    ],
    preached:
      'Predicado en Northampton en 1735, en el año cumbre del avivamiento de la ciudad, cuando su congregación se preguntaba cómo correr tras la salvación y otros se refugiaban en la indolencia espiritual. Edwards, fiel a su manera, leyó el sermón con voz serena y uniforme, sin concesiones retóricas al aplauso; la fuerza estaba en la paradoja del texto y en la aplicación paciente. La reacción fue la de una iglesia que se reconocía diagnosticada: unos se afirmaron en la promesa de paz, otros se vieron señalados en el descuido. Según la tradición, formó parte de su esfuerzo por ordenar los frutos del despertar en disciplina personal.',
    introduction:
      'Abre con el aparente contradicción de Isaías 32:17: la paz, que todos anhelan, se promete como fruto de la obra de la justicia, es decir, de la labor. Su primer movimiento es plantear esa paradoja y dejarla pendiente sobre la congregación: ¿cómo puede el descanso ser salario del trabajo? Sobre esa pregunta construirá toda la exposición.',
    phrases: [
      '"la obra de justicia será paz": toma las palabras del texto como estribillo que reaparece cada vez que la paradoja necesita reafirmarse.',
      'el alma ociosa no halla reposo: polariza el sermón entre dos condiciones del alma para exigir una elección.',
      'correr hacia Cristo: traduce la diligencia en dirección, no en mérito, guardando la gracia de la exhortación.',
      'la conciencia pesada no duerme: usa la imagen del peso para diagnosticar la falsa paz del descuido.',
      'la indolencia es la madre del temor: condensa el diagnóstico moral en una sentencia aforística.'
    ],
    bridges: [
      'De la introducción al primer punto entra por el contraste: frente a todo el que espera paz sin labor, el texto la declara fruto de la justicia, como la cosecha es fruto de la labranza.',
      'Al segundo punto llega por diagnóstico: si la obra de justicia da paz, la conciencia cargada que no halla reposo delata que su descanso no nace de sí misma, y así pivota hacia el descanso que solo la obra de Cristo da.',
      'Cierra con apelación pastoral directa: del descanso verdadero baja a la raíz de la miseria, el descuido espiritual, y exhorta a los negligentos a dejar la ociosidad antes de que la eternidad la juzgue.'
    ],
    duration: '30 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'spurgeon-blood',
    author: 'Charles H. Spurgeon',
    veracity: 'documentado',    title: 'La sangre preciosa de Cristo',
    year: 1858,
    place: 'Surrey Chapel, Londres',
    occasion:
      'Sermón joven y evangelístico celebrado por los contemporáneos: predica el precio de la redención cuando tenía veinticuatro años.',
    themes: ['Gracia', 'Evangelismo'],
    text: '1 Pedro 1:19 — "...sino con la sangre preciosa de Cristo, como de un cordero sin tacha y sin contaminación."',
    style:
      'Exposición evangelística cálida: analogías del valor relativo de las cosas, llamadas directas al corazón, lenguaje pictórico; el centro siempre es Cristo crucificado.',
    impact:
      'Una de las exposiciones más celebradas del calvinismo cálido del siglo XIX y modelo de evangelismo reformado.',
    outline: [
      'La sangre es preciosa por su origen: no es la de un hombre común, sino la del Hijo unigénito.',
      'La sangre es preciosa por su inocencia: cordero sin mancha, contraste con la sangre contaminada del pecador.',
      'La sangre es preciosa por su eficacia: limpió la conciencia y abrió el camino al Lugar Santísimo.',
      'La sangre es preciosa por su finalidad: fue derramada por mandato del Padre para los suyos.'
    ],
    quotes: [
      '"digo que no hay nada en el mundo tan precioso como la sangre de Cristo; hizo que la justicia y la paz se abrazaran en la cruz."'
    ],
    preached:
      'En 1858, con apenas veinticuatro años, Spurgeon subió al púlpito de Surrey Chapel de Londres, templo asociado a la memoria de Rowland Hill y escenario habitual de predicadores invitados ante grandes multitudes. Según los relatos de la época, el joven orador ya atraía por entonces a miles de oyentes, y este sermón evangelístico fue celebrado por los contemporáneos como muestra acabada de su calvinismo cálido. Quienes lo escucharon destacaban la potencia de su voz y la llaneza con que hablaba del sacrificio de Cristo, sin cobardía doctrinal pero sin frialdad académica. Fue uno de los sermones de juventud que consagraron su fama antes incluso del Tabernáculo.',
    introduction:
      'Abría con una observación sobre el valor relativo de las cosas: lo que unos estiman en oro, otros lo desdeñan, pues nada vale por sí mismo sino por quién lo aprecia. Sobre esa comparación preparaba la pregunta decisiva: ¿cuánto vale, entonces, la sangre de Cristo? Solo después leía 1 Pedro 1:19.',
    phrases: [
      'Solía retar a su audiencia: "preguntad a los redimidos cuánto vale la sangre", fórmula con que remitía la valoración no a la lógica sino a la experiencia de los santos.',
      'Contraponía al Cordero "la sangre contaminada del pecador", gesto retórico que dejaba al oyente sin ilusiones sobre su propio caudal moral.',
      'Repetía la orden de "mirad la fuente, mirad la sangre": fijaba así la mirada del auditorio en la cruz antes de cualquier aplicación.',
      'Apelaba al testimonio interno afirmando que "la conciencia sabe si está lavada": convertía la doctrina en un examen personal.',
      'Antes de cada aplicación usaba el vocativo de "queridos oyentes": marcaba el tránsito de la exposición a la exhortación al corazón.'
    ],
    bridges: [
      'Del valor relativo de las cosas saltaba al origen: "si queréis tasar algo, mirad de dónde viene", y así pasaba de las comparaciones humanas a la persona del Hijo unigénito, primer punto de la tasación.',
      'Establecida la persona de quien la sangre procede, contraponía su inocencia a la corrupción del oyente: "¿y qué somos nosotros?", pregunta con que abría el punto del cordero sin mancha frente a la sangre manchada del pecador.',
      'De la calidad de la sangre descendía a sus efectos: preguntaba qué ha obrado en la historia de los santos y entraba así en la eficacia que limpia la conciencia y abre el camino al Lugar Santísimo.',
      'Desde la eficacia experimentada ascendía al propósito: "¿quién ordenó este derramamiento?", con lo cual entraba al punto final sobre el mandato del Padre y la sangre derramada por los suyos.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'spurgeon-anchor',
    author: 'Charles H. Spurgeon',
    veracity: 'documentado',    title: 'El ancla del alma',
    year: 1870,
    place: 'Tabernáculo Metropolitano, Londres',
    occasion:
      'Imagen falseable a cualquier hogar londinense en crisis: la embarcación en medio de la tempestad tocaba la vida de miles de trabajadores industriales.',
    themes: ['Crisis y prueba', 'Firma y certeza'],
    text: 'Hebreos 6:19 — "Tenemos como segura y firme ancla del alma, la cual penetra hasta dentro del velo."',
    style:
      'Exposición práctica y calorosa: de la analogía marítima a la esperanza de la inmortalidad, aplicación directa a la vida de cada hogar.',
    impact: 'Se ha vuelto un clásico devocional para tiempos de angustia.',
    outline: [
      'Qué es la esperanza: un ancla que no está al alcance de los ojos.',
      'Cómo actúa: penetra dentro del velo; el creyente se apoya en lo que ve por fe.',
      'Por qué firme: se apoya en el propósito eterno, el juramento y el sacerdocio de Cristo.',
      'A dónde arrastra: a una esperanza que asegura el corazón en medio de la tormenta.'
    ],
    quotes: ['"El ancla no conserva la nave sola: cuando la fe decayó, la esperanza la sostuvo."'],
    preached:
      'En 1870 Spurgeon era ya el pastor más célebre de Londres: cada domingo el Tabernáculo Metropolitano se llenaba con varios miles de personas de todos los oficios, muchas de ellas trabajadores de la Londres industrial. La imagen del buque en medio de la tempestad tocaba de lleno las crisis cotidianas de esa audiencia: enfermedad, penuria, incertidumbre del pan. Según los relatos, la analogía marítima, familiar para un pueblo isleño, mantuvo a la congregación pendiente de cada frase. Su voz grave y cálida, que alternaba ternura y solemnidad, hacía sentirse interpelado a cada hogar presente en el auditorio.',
    introduction:
      'Comenzaba evocando la escena del buque azotado por la tormenta: cuando el marinero lo ha perdido casi todo, echa el ancla y espera el alba. Preguntaba a sus oyentes qué ancla echan ellos cuando las olas de la vida los sacuden, y con esa pregunta pendiente leía Hebreos 6:19.',
    phrases: [
      'Explicaba que "el velo está descorrido por dentro": con esa fórmula mostraba que la esperanza cristiana entra donde ninguna sonda humana llega.',
      'Distinguía cuidadosamente "no es ancla de hierro, es ancla de esperanza": separaba la figura bíblica del mero utensilio material.',
      'Convertía la imagen en consejo pastoral con la exhortación "echad el ancla antes de la tormenta": preparación espiritual antes de la crisis.',
      'Resumía el fundamento hablando de "el juramento de Dios, dos cosas inmutables": así condensaba la base objetiva de la esperanza.',
      'Cerraba cada sección con la antítesis "la tormenta hará lo suyo; la ancla hará más": consuelo que sostenía el ánimo del oyente afligido.'
    ],
    bridges: [
      'De la pregunta inicial sobre el ancla personal pasaba a definir qué es la esperanza bíblica: subrayaba que es segura y firme precisamente porque no está al alcance de los ojos, y así abría el primer punto.',
      'Definida la esperanza, preguntaba adónde ha de echarse el ancla: la respuesta, "dentro del velo", daba entrada al punto de lo que el creyente ve por fe y no por vista.',
      'Del interior del velo descendía al fundamento: ¿por qué puede confiarse esa esperanza? Con esa interrogante entraba en el propósito eterno, el juramento y el sacerdocio de Cristo.',
      'Con el fundamento puesto, volvía a la escena de la tormenta del arranque: ahora el ancla arrastra la nave con seguridad, y así entraba en la aplicación final al corazón asegurado en medio de la prueba.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'lloydjones-spiritual-depression',
    author: 'D. Martyn Lloyd-Jones',
    veracity: 'documentado',    title: '¿Por qué te abates, oh alma mía?',
    year: 1954,
    place: 'Westminster Chapel, Londres',
    occasion:
      'Primera de la famosa serie sobre la Depresión Espiritual, dirigida a creyentes que se sentían decaídos aunque la fe profesaban.',
    themes: ['Crisis y prueba', 'Firma y certeza'],
    text: 'Salmos 42:5 — "¿Por qué te abates, oh alma mía, y te turbas dentro de mí? Espera en Dios, porque aún he de alabarle."',
    style:
      'Diagnóstico de un médico: examina la infelicidad del creyente, la causa de su turbación y su único remedio; aplicación doctrinal progresiva.',
    impact: 'Un clásico de la consejería pastoral reformada del siglo XX.',
    outline: [
      'El salmista habla a sí mismo en vez de escuchar a sí mismo: este es el primer gesto del doctor.',
      'La infelicidad del cristiano nace de escuchar sus sentimientos y no la verdad de Dios.',
      'La autocompasión es la causa de la mayoría de las depresiones espirituales.',
      'El remedio: hablarse la fe — "espera en Dios, porque aún he de alabarle".'
    ],
    quotes: ['"El arte principal de la vida espiritual es saber hablarte, no escucharte."'],
    preached:
      'En 1954 Lloyd-Jones inauguró en Westminster Chapel su célebre serie sobre la depresión espiritual, dirigida a creyentes honestos que profesaban la fe y sin embargo se sentían vencidos. La congregación londinense de posguerra escuchó al ex-médico aplicar al alma los hábitos del diagnóstico clínico. Según los relatos, muchos oyentes confesaron que por primera vez alguien describía su decaimiento sin culparlos ni burlarse de ellos. Su modo de hablar, pausado y acumulativo, creaba el efecto de una consulta a la que toda la capilla había sido citada; la serie se volvió un clásico de la consejería pastoral reformada.',
    introduction:
      'Abría reconociendo el cuadro clínico: hay cristianos infelices, y no por falta de fe profesada sino por un desorden interior no tratado. Antes del texto presentaba la pregunta del salmo como la queja más honesta de toda la Escritura, y con esa puerta entraba en Salmo 42:5.',
    phrases: [
      'Señalaba el gesto clave del texto repitiendo "el salmista se habla a sí mismo": el primer acto del doctor es ese diálogo interno.',
      'Condensaba toda la serie en el imperativo "habla a ti mismo, no escuches a tu corazón": la posición del creyente frente a sus sentimientos.',
      'Encadenaba diagnóstico y remedio con la paradoja "vosotros sois vuestro mayor problema y vuestra mayor esperanza": la responsabilidad vuelve al oyente.',
      'Desarmaba el punto central con la sentencia "la autocompasión es el pecado más común de los piadosos": golpe directo a la audiencia devota.',
      'Fundaba el remedio en la gramática del texto: "aún he de alabarle: habla en futuro, no en presente", la fe que se anticipa.'
    ],
    bridges: [
      'De la queja introductoria pasaba a observar el gesto del salmista: se habla a sí mismo en vez de escucharse, primer gesto del doctor que inaugura el diagnóstico.',
      'Del gesto observado sacaba el principio general: la infelicidad del creyente nace de escuchar sus sentimientos en lugar de la verdad de Dios, y así abría la causa.',
      'Profundizando en esa escucha equivocada, nombraba el trastorno de fondo: la autocompasión, transición con que entraba en su denuncia central.',
      'Con la causa nombrada, giraba hacia el remedio del propio texto: si la cura es hablarse la fe, entonces "espera en Dios" se convierte en la prescripción final del médico.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'tozer-following-hard',
    author: 'A. W. Tozer',
    veracity: 'documentado',    title: 'Seguir de cerca a Dios',
    year: 1948,
    place: 'Southside Alliance Church, Chicago',
    occasion:
      'Predicó a mediados del siglo XX, cuando la comodidad religiosa amenazaba la experiencia viva de Dios; parte de su obra mayor sobre el anhelo espiritual.',
    themes: ['Santidad', 'Anhelos humanos'],
    text: 'Salmos 63:8 — "Mi alma está apegada a ti; tu diestra me sustiene."',
    style:
      'Profético: imágenes contundentes, denuncia de la religión de tono superficial, y a la vez meditación luminosa de la santidad de Dios.',
    impact:
      'Se convirtió en el capítulo más citado de su pensamiento sobre la experiencia personal de Dios.',
    outline: [
      'Dios puede ser hallado por la diligencia del alma que lo busca.',
      'La búsqueda de Dios debe ser la principal de todas las búsquedas.',
      'La búsqueda es personal: nadie puede buscar a Dios por nosotros.',
      'La búsqueda crea respuestas: cuando lo buscamos, Dios se deja hallar.'
    ],
    quotes: [
      '"Seguir de cerca a Dios es el secreto del Cristiano; nadie más puede hacernos ese favor."'
    ],
    preached:
      'En 1948, el mismo año en que maduraba La búsqueda de Dios, Tozer predicó en Southside Alliance Church de Chicago esta meditación sobre el alma que sigue de cerca a Dios. La congregación lo escuchaba en vivo, y el mensaje circularía después entre los capítulos más citados de su pensamiento sobre el anhelo espiritual. Quienes conocieron su púlpito lo describen avanzando como quien escala: primero la denuncia de la comodidad religiosa, luego la sed de Dios como única salida. Según los relatos, el silencio al terminar era tan elocuente como el sermón mismo.',
    introduction:
      'Abría señalando que la debilidad de la iglesia no está en sus programas sino en su falta de hambre: mucha religión y poco seguimiento. Preguntaba a los presentes si alguno conocía por experiencia propia lo que es seguir de cerca a Dios, y con esa pregunta pendiente entraba en Salmo 63:8.',
    phrases: [
      'Condensaba el diagnóstico con la fórmula "el hambre de Dios es la prueba del alma viva": la sed delante de Dios como signo de vida espiritual.',
      'Abría el punto de la intransferibilidad diciendo "Dios no se deja hallar por delegación": nadie puede buscar en nombre de otro.',
      'Sostenía la dinámica de la búsqueda con la paradoja "el que no busca no halla; el que busca siempre halla más": el hallazgo crece con el anhelar.',
      'Denunciaba el enemigo del anhelo con la contraposición "la religión cómoda es enemiga del Dios viviente": la comodidad como anestesia.',
      'Glosaba el equilibrio del texto afirmando "tu diestra me sustiene: Él sostiene mientras tú sigues": gracia y esfuerzo en un mismo versículo.'
    ],
    bridges: [
      'De la falta de hambre denunciada en la introducción pasaba al axioma primero: Dios puede ser hallado, pero por el alma diligente que lo busca de verdad.',
      'Establecida la posibilidad del hallazgo, subía la apuesta: entre todas las búsquedas de la vida humana, esta ha de ser la principal, transición con que abría el segundo punto.',
      'De la prioridad de la búsqueda descendía a su carácter intransferible: nadie puede buscar a Dios por nosotros, y con esa exclusiva entraba al tercer punto.',
      'Con la búsqueda hecha personal, cerraba el círculo con la promesa: cuando el alma sigue de cerca, Dios se deja hallar, y así entraba en la respuesta que la propia búsqueda crea.'
    ],
    duration: '35 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'keller-prodigal',
    author: 'Timothy Keller',
    veracity: 'documentado',    title: 'Los dos hermanos perdidos',
    year: 2005,
    place: 'Redeemer Presbyterian Church, Nueva York',
    occasion:
      'Predicado el 11 de septiembre de 2005 (serie «The Vision of Redeemer»). Su lectura del hijo pródigo se volvió su sermón más conocido y fundó su libro El Dios prodigo (2008).',
    themes: ['Gracia', 'Anhelos humanos'],
    text: 'Lucas 15:11-32 — La parábola del hijo pródigo.',
    style:
      'Lectura de los "dos hermanos": separa el pecado de la independencia (hermano menor) del pecado de la religiosidad moral (hermano mayor) para mostrar la decisión genuina del evangelio.',
    impact:
      'Reformuló el evangelismo urbano del siglo XXI; base de The Prodigal God (2008), su libro sobre la gracia más influyente.',
    outline: [
      'Perdido está el hijo menor: rebeldía abierta, la autoproducción del yo.',
      'Perdido está el hijo mayor: obediencia externa, resentimiento y rechazo del hermano.',
      'Todos estamos perdidos: la parábola se llama en realidad "los dos hermanos perdidos".',
      'El evangelio es la fiesta del padre: convertirnos no es ser religioso, sino venir a la celebración del Padre.'
    ],
    quotes: [
      '"Hay dos maneras, no una, de ser tu propio Salvador y Señor: romper todas las reglas morales y trazar tu propio rumbo, o guardarlas todas buscando ganar el favor del cielo. Ambas son estrategias para evitar a Dios."',
      '"El propósito de Jesús no es entibiar nuestro corazón, sino estrellar nuestras categorías."'
    ],
    preached:
      'En sus predicaciones de los domingos por la noche en Redeemer Presbyterian Church, en Manhattan, Keller solía dirigirse a profesionales universitarios y escépticos: abogados, financieros, artistas que jamás habrían entrado a un culto evangélico tradicional. Abría con voz serena, razonando despacio, como quien sostiene una conversación entre iguales; nadie gritaba, nadie manipulaba. Los oyentes llegaban con objeciones intelectuales y salían sorprendidos: su lectura de la parábola, según la cual la religiosidad moral es otra forma de estar lejos de Dios, desarmaba a piadosos y libertinos por igual, y muchos reaccionaban con un silencio pensativo o con risas nerviosas cuando el punto caía sobre el hermano mayor. Sobre esta predicación maduró El Dios prodigo (2008), su libro de mayor alcance.',
    introduction:
      'Keller suele abrir cuestionando la lectura familiar de la parábola: todos creemos conocer la historia del hijo pródigo y, precisamente por eso, no la hemos entendido. Su primer movimiento era preguntar a quién se la contó Jesús —a fariseos y escribas que murmuraban porque se acercaban los pecadores— para señalar que el centro no es un hijo perdido, sino dos hermanos y un Padre extravagante. Solo entonces leía el texto de Lucas 15.',
    phrases: [
      '«Todos sabemos cómo se pierde un hijo menor, pero muy pocos reconocen cómo se pierde un hermano mayor»: la fórmula con que voltea la expectativa del oyente.',
      '«La respetabilidad religiosa es una manera más sofisticada de dirigir tu propia vida»: así nombra el pecado del fariseo sin aliviar al rebelde.',
      '«El evangelio no es un consejo moral: es una noticia sobre lo que el Padre ha hecho»: su declaración de método antes de aplicar el texto.',
      '«Usted no necesita ser mejor para volver a casa: necesita ser perdonado para poder quedarse en ella»: la aplicación al corazón escéptico del auditorio.',
      '«El libertino y el fariseo beben de la misma fuente: la independencia del corazón»: síntesis que iguala a ambos hermanos ante la sala de Manhattan.',
      '«La parábola no termina con el hijo en la casa: termina con el hermano afuera»: la observación exegética con que abre su lectura más discutida.'
    ],
    bridges: [
      'Tras preparar la escena con la murmuración de los fariseos, Keller toma el camino del hijo menor: pide la herencia, hace las maletas hacia una tierra lejana, y presenta la rebeldía abierta como la autoproducción del yo.',
      'Con el menor hundido en el peor de los corrales, entra el giro clásico del púlpito de Redeemer: «pero la parábola no termina aquí»; Keller voltea a la escena fuera de la casa y desenmascara al hermano mayor, obediente por fuera, resentido por dentro.',
      'Del retrato de los dos hermanos pasa con una pregunta directa a la conciencia del oyente: ¿cuál de los dos eres tú?, para afirmar que ambos usan a Dios —uno vendiendo su herencia, el otro facturando su obediencia— y que la parábola debía llamarse «los dos hermanos perdidos».',
      'Ante la silla vacía del hermano mayor, Keller sube la apuesta hacia la fiesta: el evangelio no consiste en ser religioso ni antirreligioso, sino en aceptar la invitación a la celebración del Padre, que ya salió a buscar a sus hijos.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'luther-heidelberg',
    author: 'Martín Lutero',
    veracity: 'documentado',    title: 'El que es verdaderamente sabio es llamado pecador (Heidelberg)',
    year: 1518,
    place: 'Heidelberg, Alemania',
    occasion:
      'Presentó su teología de la cruz en la Disputa de Heidelberg ante los monjes agustinos, antes de excomulgarse de Roma.',
    themes: ['Gracia', 'Penitencia'],
    text: '1 Corintios 1:23 — "...mas nosotros predicamos a Cristo crucificado."',
    style:
      'Afirmaciones escolásticas extensas: cada tesis es breve pero citada con argumentación escolástica clásica y frases pastorales vigorosas.',
    impact:
      'Fue fundamento de la teología de la cruz: el corazón de la Reforma doctrinal luterana.',
    outline: [
      'Las obras del hombre no son obra de Dios: la gloria del hombre no salva.',
      'El que se cree sabio y justo por sus obras no recibe a Cristo.',
      'El que verdaderamente sabe y confiesa que es pecador merece la gracia.',
      'La obra de Dios es toda y nuestra nada: "simul justus et peccator" (justo y pecador a la vez).'
    ],
    quotes: [
      '"El que se apoya en sus obras para pronunciar la verdad no alcanza la gracia; solo el que confiesa su miseria la alcanza."'
    ],
    preached:
      'Según los relatos, en la primavera de 1518 el capítulo general de los agustinos alemanes se reunió en Heidelberg, y las tesis de Lutero se presentaron en la disputa celebrada en el aula de la universidad, ante monjes agustinos, teólogos y estudiantes. Lutero no habló como predicador de cámara sino como maestro: afirmaciones breves y cortantes, seguidas de argumentación escolástica y aplicaciones pastorales vigorosas. La audiencia, educada en la escolástica tardía, escuchó con perplejidad; algunos, como Martín Bucer, se sintieron conquistados y se convirtieron en defensores de la nueva teología. Probablemente las tesis se leyeron con voz firme y pausada, y luego se defendieron punto por punto en discusión académica. El tono era sobrio, pero la lógica golpeaba como un martillo.',
    introduction:
      'Lutero no abrió con narración ni anécdota: puso sobre la mesa un axioma deliberadamente provocador. Antes de llegar al texto, contrapuso dos maneras de hacer teología, la que busca a Dios en la gloria y la que lo busca en la cruz, y anunció que todo el orden de la disputa dependía de esa distinción.',
    phrases: [
      'La tesis condensada «la cruz sola es nuestra teología»: fórmula breve que resumió todo el programa y bautizó la teología de la Reforma.',
      'El lema antitético entre «teología de la gloria» y «teología de la cruz»: clasificó a los teólogos en dos bandos antes de entrar en materia.',
      'La sentencia paradójica como unidad de argumento: cada tesis breve se enuncia y luego se golpea, imitando el esquema de las disputas escolásticas.',
      'El pronombre «nosotros» enfrentado a «los que se apoyan en obras»: opuso constantemente a los predicadores de la cruz a los admiradores de la virtud humana.',
      'La ironía contra los «arquitectos» de la salvación: retomó las metáforas escolásticas de la construcción y las invirtió contra sus propios dueños.'
    ],
    bridges: [
      'Desde el anuncio de las dos teologías pasó a la primera tesis por vía de negación: si Dios se conoce en la cruz, entonces las obras del hombre no son obra de Dios. El contraste inicial funcionó de bisagra y quedó fijado como primer enunciado.',
      'Para entrar al segundo punto invirtió la figura del sabio: quien se apoya en sus obras se vuelve incapaz de recibir a Cristo. El recurso fue la paradoja del entendimiento engañado por su propia aparente rectitud.',
      'El tercer punto entró por inversión completa: al que la gloria considera sabio, ante la cruz se le llama pecador. Lutero lo formuló como sentencia que sorprende al oyente y a la vez lo alivia.',
      'Cerró el movimiento con la conclusión que recogía las tesis previas: la obra de Dios es toda y la nuestra es nada. La fórmula latina de justo y pecador a la vez sirvió de sello para la aplicación final.'
    ],
    duration: '30 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'calvino-galatians',
    author: 'Juan Calvino',
    veracity: 'documentado',    title: 'La justificación por la sola fe',
    year: 1551,
    place: 'St. Pierre, Ginebra',
    occasion:
      'Exposición verse-by-verse de Gálatas predicada en Ginebra ante una comunidad de refugiados de toda Europa, en el corazón de la Reforma.',
    themes: ['Gracia', 'Firma y certeza'],
    text: 'Gálatas 2:16 — "...sabiendo que el hombre no es justificado por las obras de la ley, sino por la fe de Jesucristo."',
    style:
      'Exposición directa y sobria, predicada sin notas en cadencias extemporáneas, precisión doctrinal y brevedad.',
    impact: 'Define el modelo genebrino de predicación continua y cascada del Evangelio.',
    outline: [
      'Qué es la justificación: Dios sentado en juicio pronuncia la sentencia de justicia.',
      'Sobre qué fundamento: nunca las obras, siempre Cristo.',
      'Por qué medio: la fe sola, que recibe la justificación completa de Cristo.',
      'Qué frutos produce: gozo, paz, gratitud y obediencia motivada por el amor, no por el miedo.'
    ],
    quotes: [
      '"El creyente no debe comenzar su confianza en su propia integridad, sino descansar en Cristo, que es completo y suficiente."'
    ],
    preached:
      'Calvino predicaba con regularidad casi diaria en la catedral de San Pedro de Ginebra, a primeras horas de la mañana, ante una congregación formada en gran parte por refugiados franceses, italianos, ingleses y alemanes. Según los relatos, subía al púlpito sin papeles y exponía el texto versículo a versículo en cadencias extemporáneas; el notario Denis Raguenier, gracias a un sistema de taquigrafía, tomó sus palabras casi íntegras. Los oyentes tomaban notas por su cuenta y copias manuscritas circularon entre las iglesias. Su voz era clara y su tempo regular, sin gestos aparatosos: la fuerza estaba en la lógica del argumento y en la aplicación directa a la conciencia. Al llegar a la doctrina de la justificación se detenía más, repitiendo la fórmula con variaciones para fijarla en la memoria.',
    introduction:
      'Calvino abría leyendo el versículo y situándolo de inmediato en el conflicto con los falsos maestros de Galacia. Su primer movimiento retórico fue definir el problema del oyente: la conciencia que busca seguridad en sí misma antes de que la doctrina siquiera se nombre.',
    phrases: [
      'La fórmula forense «Dios, sentado en su tribunal, pronuncia sentencia»: tradujo la justificación a imagen de juicio para que el oyente se viera dentro del proceso.',
      'La antítesis repetida «la ley condena, la fe recibe»: marcó el paso de cada sección y fijó el contraste paulino en la memoria del auditorio.',
      'El interrogatorio catequético «qué es... sobre qué fundamento... por qué medio... qué frutos»: estructuró la exposición como preguntas y respuestas, al modo de su catecismo.',
      'El giro «no de ti, sino en Cristo»: la negación que vacía al hombre precede siempre al llenado de Cristo, como regla del argumento.',
      'La apelación a la conciencia: «busca fuera de ti aquello que en ti no hallas»: dirigía la doctrina al creyente sentado en la banca más que al debate teórico.'
    ],
    bridges: [
      'Del problema de la conciencia pasó a la primera pregunta, «qué es la justificación», y la respondió con la imagen del tribunal. La definición doctrinal se dio como sentencia que el oyente escucha pronunciada sobre su propia cabeza.',
      'Definido el qué, entró al fundamento con pregunta retórica que anticipaba el error: ¿podría el hombre añadir algo a la sentencia ya pronunciada? La negación fue rotunda y preparó el paso a Cristo como único fundamento.',
      'El tercer punto entró respondiendo al «por qué medio»: la fe no como mérito sino como mano vacía que recibe. La imagen de la recepción separó el instrumento de la causa y dejó toda la eficacia del lado de Cristo.',
      'Para cerrar hizo el movimiento típico de su doctrina: de la causa a los frutos. Contrapuso el gozo y la gratitud al miedo, mostrando que la obediencia nace del amor y no de la amenaza.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'agustin-blessed-mercy',
    author: 'Agustín de Hipona',
    veracity: 'documentado',    title: 'Sobre la bienaventuranza de la misericordia',
    year: 392,
    place: 'Hipona, África romana',
    occasion:
      'Sermón a la comunidad cristiana de Hipona, muchas veces a nuevos convertidos del paganismo.',
    themes: ['Gracia', 'Penitencia'],
    text: 'Mateo 5:7 — "Bienaventurados los misericordiosos, porque ellos alcanzarán misericordia."',
    style:
      'Retórica de la Iglesia primitiva: antítesis, preguntas, climas morales; amor a la Escritura y estructura retórica luminosa.',
    impact:
      'Definió la misericordia cristiana para Occidente y el modelo de la pastoral de los años iniciales de la Iglesia.',
    outline: [
      'La misericordia es una necesidad que siente el corazón hacia los demás, no condescendencia.',
      'Los misericordiosos: los que se sienten deudores de la misericordia propia y del hermano.',
      'Alcanzan misericordia: el que la da recibe; el que la niega, es juicio a sí mismo.'
    ],
    quotes: [
      '"Si aprendes a darte misericordia a ti mismo, te estás volviendo capaz de vivirla con tu hermano."'
    ],
    preached:
      'Agustín predicaba a la comunidad de Hipona en la basílica, con frecuencia sentado en la cátedra junto al lector, según la costumbre africana, ante fieles muchos de ellos de reciente conversión del paganismo. Se conserva el uso de que el pueblo interrumpía con aplausos y exclamaciones, algo que él corregía con humor o con severidad según el caso. Su voz no era potente sino clara, y su tempo se aceleraba cuando la antítesis encadenaba las frases; en la aplicación moral bajaba el ritmo y se acercaba a los oyentes con preguntas. Probablemente estos discursos se transcribían en acto por taquígrafos y él los revisaba después para publicarlos. El tono era el de un maestro que se siente deudor de la misma misericordia que predica.',
    introduction:
      'Agustín solía abrir repitiendo la bienaventuranza despacio, como quien la hace resonar en el oído del auditorio. Su primer movimiento fue interrogar la palabra antes de definirla: preguntó al público qué creía que era la misericordia, para luego corregir la idea común de la condescendencia desde arriba.',
    phrases: [
      'La antítesis fundadora: la misericordia no es condescendencia, sino necesidad que el corazón siente: definió la virtud negando primero lo que el público suponía.',
      'La pregunta dirigida al oyente: «¿qué haces con tu alma cuando cierras tu mano?»: devolvía el escrutinio a la vida cotidiana del auditorio.',
      'El lema del deudor: quien ha recibido misericordia queda deudor de darla: convirtió la bienaventuranza en ética de la deuda contraída.',
      'El golpe de espejo: «el que no quiere dar se niega a sí mismo la misericordia que pide»: invirtió sobre el oyente la lógica del padrenuestro.',
      'El clímax escalonado de necesidad, deuda y promesa: el crescendo moral encadenó los tres movimientos hasta cerrar en la bienaventuranza.'
    ],
    bridges: [
      'De la pregunta inicial pasó al primer punto por vía de corrección: la misericordia no es favor desde arriba, sino necesidad que el corazón siente hacia el hermano. La imagen del que no puede menos que socorrer abrió la exhortación.',
      'Al segundo punto entró con el argumento del espejo: los misericordiosos son los que se saben deudores, porque primero recibieron. La reminiscencia del perdón pedido en la oración del Señor sostuvo el tránsito.',
      'El tercer punto se abrió por vía de promesa y amenaza entrelazadas: el que da recibe, el que niega se juzga a sí mismo. Cerró con la promesa literal del Evangelio, dándole fuerza de sentencia final.'
    ],
    duration: '25 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'chrysostom-paschal',
    author: 'Juan Crisóstomo',
    veracity: 'documentado',    title: 'Homilía pascual',
    year: 400,
    place: 'Constantinopla',
    occasion:
      'Se lee cada Pascua ante los recién bautizados en la liturgia de la Iglesia Ortodoxa desde hace más de 1,600 años.',
    themes: ['Gracia', 'Muerte y eternidad'],
    text: '1 Corintios 15:54-55 — "Tragada ha sido la muerte en victoria. ¿Dónde está, oh muerte, tu aguijón?"',
    style:
      'Ritmo oratorio escalonado, exclamaciones gozosas, arranque crescendo; corto, cargado de luz escatológica.',
    impact:
      'El sermón más reproducido de la historia cristiana: se canta y se proclama cada Pascua en la liturgia oriental.',
    outline: [
      'Que entre todo el que sea devoto: la mesa del Señor recibe al primero y al último.',
      'La muerte ya no tiene poder: el infierno fue despojado por Aquel que descendió.',
      'Cristo ha resucitado: la vida reina y la oscuridad ha sido deshecha.'
    ],
    quotes: [
      '"¿Dónde está, oh muerte, tu aguijón? ¿Dónde, oh infierno, tu victoria? Cristo ha resucitado, y tú has sido derribada."'
    ],
    preached:
      'Esta homilía se proclama cada Pascua en la liturgia bizantina durante la celebración pascual, de pie ante los recién bautizados que acaban de salir de la piscina bautismal, después de la vigilia nocturna. Se conserva como pieza ceremonial: su tono es de trompeta, con frases breves y exclamaciones que el pueblo recibe como un coro. No se dirige a los piadosos de siempre sino a los que llegan tarde: llama al que ayuna y al que no, al primero y al último, en un crescendo que no baja. Probablemente Juan la pronunció en Constantinopla con su elocuencia de costumbre, aunque su texto fijo se debe a que fue compuesta para repetirse cada año. Su brevedad, unos cinco minutos, contrasta con la densidad extrema de sus imágenes.',
    introduction:
      'La homilía abre con una invitación insistente, como el padre de la parábola llamando a todos a la mesa. El primer movimiento retórico no es doctrinal sino convivial: convida al devoto y al indigno por igual antes de anunciar a Cristo vencedor.',
    phrases: [
      'El doble llamado por parejas: «el rico y el pobre, celebrad juntos»: exclamación solemne que iguala a todos ante la mesa pascual antes de decir una sola doctrina.',
      'La anáfora negativa de consuelo: «que nadie llore por sus pecados, porque el perdón ha brotado del sepulcro»: acumuló consolaciones cancelando toda excusa de exclusión.',
      'La imagen del saqueo: «el infierno fue saqueado»: convirtió el descenso de Cristo en escena bélica invertida, donde el vencedor roba vidas al enemigo.',
      'La personificación burlada de la muerte: la muerte está furiosa por haber sido pisoteada: desarmó al adversario mostrándolo derrotado y casi ridículo.',
      'El «todos» en anáfora como lista de invitados: rico, pobre, primero y último: la repetición acumulativa aplastó la lógica del mérito.'
    ],
    bridges: [
      'De la invitación universal pasó a la mesa del Señor declarando que la misma recibe al primero y al último. El banquete funcionó como imagen de la gracia que no examina méritos.',
      'Del banquete saltó al infierno vacío por contraste dramático: la misma noche que da la mesa ha despojado a la muerte. La imagen del descenso de Cristo sostuvo el paso al segundo punto.',
      'El tercer punto entró en exclamación pura: Cristo ha resucitado y la vida reina. La oda final elevó el tono hasta la luz que deshace las tinieblas, cerrando sin apelación, solo con gozo.'
    ],
    duration: '5 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'whitefield-method',
    author: 'George Whitefield',
    veracity: 'documentado',    title: 'El método de la gracia',
    year: 1741,
    place: 'Londres (predicado al aire libre)',
    occasion:
      'Cuando las iglesias anglicanas le cerraron las puertas, Whitefield predicó en los campos; miles oyeron el evangelio mientras las puertas del templo se cerraban.',
    themes: ['Evangelismo', 'Arrepentimiento'],
    text: 'Génesis 17:7 — "...para establecer mi pacto entre yo y ti, y tu descendencia después de ti, por sus generaciones, por pacto eterno."',
    style:
      'Evangelismo de campo abierto: voz teatral, imágenes de campo y cielo, campanas al aire libre que arrastraban a oyentes que jamás entraban a una iglesia.',
    impact:
      'Se estima que predicó 18,000 sermones a decenas de millones de oyentes; este sermón los significaba a todos.',
    outline: [
      'El pacto de gracia es eterno: la esperanza no descanza en lo que hicimos sino en lo que Dios prometió.',
      'La fe es el brazo del alma para asir el pacto.',
      'Es indispensable el nuevo nacimiento: sin él nadie ve el reino de Dios.'
    ],
    quotes: [
      '"El método de la gracia siempre lleva al pecador a descansar todo su peso en el pacto eterno de Dios."'
    ],
    preached:
      'Predicado al aire libre en los campos alrededor de Londres en 1741, cuando las iglesias anglicanas le cerraron sus puertas y los púlpitos le fueron prohibidos. Whitefield se subía a cualquier eminencia o carro, y su voz entrenada, poderosa y teatral, alcanzaba según los relatos a veinte mil oyentes o más; se dice que se le podía oír a grandes distancias, algo sin precedente. Predicaba con el rostro dramatizado, gesticulando, a veces con lágrimas, modulando el tempo entre el murmullo y el estruendo; se contaba que bastaba pronunciar la palabra Mesías con su entonación para estremecer a la multitud. Las multitudes lloraban y los campesinos y obreros que jamás entraban a un templo escuchaban el evangelio a cielo abierto.',
    introduction:
      'Abre leyendo la promesa del pacto a Abraham en Génesis 17:7 y la convierte en espejo de su situación: si las puertas del templo se cierran, la promesa eterna de Dios no conoce paredes. Su primer movimiento es ese contraste entre templo cerrado y campo abierto, que justifica de entrada la predicación al aire libre y pone a toda la multitud, dentro y fuera de las iglesias, en el mismo plano de la promesa.',
    phrases: [
      '"pacto eterno": repite la expresión del texto como sello que recorre todo el sermón.',
      'las puertas del templo se cierran y el campo se abre: convierte la persecución eclesiástica en argumento de la universalidad de la promesa.',
      'la fe es el brazo del alma: usa la imagen corporal para definir la fe como acción de asir y no de merendar.',
      'la promesa no se compra: se recibe: condensa la tesis del pacto de gracia en una sentencia antitética.',
      'venid como estáis: lanza el llamado evangelístico sin condiciones de preparación previa.',
      'la campana del campo: alude a su voz como campana al aire libre que llamaba a quienes nunca escucharían campana de iglesia.'
    ],
    bridges: [
      'De la introducción al primer punto entra por repaso de la promesa: desde Abraham hasta el presente, la esperanza del pacto nunca descansó en lo que el hombre hizo, sino en lo que Dios prometió; el repaso bíblico funda la eternidad del pacto.',
      'Al segundo punto entra con una pregunta lanzada a la multitud: ¿cómo tomará un pobre pecador una herencia que no puede pagar? La respuesta es la imagen del brazo del alma: la fe que asir el pacto.',
      'Al tercer punto entra por apelación urgente y advertencia: no basta asir el pacto de lejos; sin el nuevo nacimiento nadie verá el reino de Dios, y con esa sentencia escalona del pacto a la puerta ineludible del sermón.'
    ],
    duration: '55 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'wesley-almost',
    author: 'John Wesley',
    veracity: 'documentado',    title: 'El casi cristiano',
    year: 1741,
    place: 'Kingswood, Bristol',
    occasion:
      'Wesley observa la religiosidad social de la Inglaterra del siglo XVIII: hay muchas personas decentes, veraces y devotas que sin embargo son solo "casi" cristianos.',
    themes: ['Arrepentimiento', 'Santidad'],
    text: 'Hechos 26:28 — "Casi me persuades a ser cristiano."',
    style:
      'Precisión analítica y clasificación metódica: separa lo que no es, con tono imperturbable; termina con un llamado directo.',
    impact: 'Base de la piedad metodista y de su "santa disciplina" comunitaria.',
    outline: [
      'No es: honestidad civil (veracidad, honor y justicia para con el prójimo) — eso es "algo".',
      'No es: mera religión externa o asistir a la iglesia y los sacramentos.',
      'Qué es: el temor de Dios, la gracia que redime del yo, y el amor a Dios sobre todas las cosas.',
      'El golpe final: amar a Dios sobre todas las cosas — "casi" no salva.'
    ],
    quotes: ['"Casi me persuades a ser cristiano: casi te vale de algo, pero no te salva."'],
    preached:
      'Predicado en 1741 en Kingswood, Bristol, según la ficha, en el corazón de la Inglaterra de la religiosidad social: Wesley golpeaba a las personas decentes, veraces, caritativas y devotas que sin embargo eran solo casi cristianos. Su estilo era la antítesis de Whitefield: voz medida, tono imperturbable, clasificación paciente, sin teatro; la precisión analítica hacía el trabajo que en otros hacía el volumen. Los oyentes, acostumbrados a ser elogiados por su decencia, se veían contados, catalogados y desmontados punto por punto. Según los relatos, el contraste entre la cortesía del tono y la dureza del diagnóstico fue el recurso que dejó la marca en la conciencia de la audiencia.',
    introduction:
      'Abre con la confesión de Agripa en Hechos 26:28, casi me persuades a ser cristiano, y la convierte en espejo del oyente: un rey escuchaba a Pablo y se quedó a las puertas. Su primer movimiento es el retrato de ese casi, y anuncia que distinguirá con rigor qué es un casi cristiano y qué es un cristiano entero, prometiendo una clasificación metódica y sin nostalgia.',
    phrases: [
      '"casi cristiano": convierte la expresión del texto en categoría analítica que repite a lo largo del sermón.',
      'esto es algo; mas no es todo: usa la fórmula de distinguo para conceder lo que corresponda y negar lo decisivo.',
      'la honestidad no es la santidad: separa con una antítesis concisa la virtud civil de la gracia.',
      'amar a Dios con todo el corazón: presenta la marca positiva que la clasificación va construyendo hacia el clímax.',
      'el casi no atraviesa la puerta: metáfora de la frontera que el casi nunca cruza, cerrando el argumento con imagen.'
    ],
    bridges: [
      'De la introducción al primer punto entra por el distingo: concede de entrada que la honestidad civil es algo; la veracidad, el honor y la justicia para con el prójimo son reales, pero ese algo no es todo, y el caso de Agripa ya lo probaba.',
      'Al segundo punto entra por repaso negativo de las prácticas: ni siquiera la religión externa, el asistir a la iglesia y a los sacramentos, alcanza; con ello acumula dos negaciones antes de abrir lo positivo.',
      'Al tercer punto entra por ascenso: agotadas las imitaciones, pasa a declarar qué es ser cristiano entero: el temor de Dios, la gracia que redime del yo, y el amor a Dios sobre todas las cosas, construyendo la definición por capas.',
      'Cierra con apelación directa a la conciencia: vuelve al espejo de Agripa y descarga el golpe final, casi no salva, obligando a cada oyente decente a decidir si su religión es algo o es todo.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'bossuet-funeral',
    author: 'Jacques-Bénigne Bossuet',
    veracity: 'documentado',    title: 'Oración fúnebre por Enriqueta Ana de Inglaterra',
    year: 1670,
    place: 'Abadía de Saint-Denis, París',
    occasion:
      'Funeral de la duquesa de Orleans, cuñada de Luis XIV, muerta de forma repentina a los veintiséis años; Bossuet predicó ante toda la corte conmovida.',
    themes: ['Muerte y eternidad', 'Crisis y prueba'],
    text: 'Eclesiastés 9:10 — "Todo lo que te viniere a la mano para hacer, hazlo con tus fuerzas; porque no habrá obra, ni pensamiento, ni ciencia, ni sabiduría en el sepulcro."',
    style:
      'Oratoria clásica francesa: estructura perfecta, frases graves, la muerte protagonista de la meditación; revolución del sermón fúnebre.',
    impact:
      'Modelo ideal de la elocuencia sagrada occidental; texto de referencia en historia de la retórica.',
    outline: [
      'La muerte sorprendió en medio de la vida, la gloria y la juventud.',
      'Todo lo humano es vanidad: la dignidad más alta no frena la entrada al sepulcro.',
      'El consuelo: solo el que vive con el pensamiento puesto en la eternidad está preparado.'
    ],
    quotes: [
      '"Oh vanidad, oh incurable sed de gloria humana: la muerte no distingue entre príncipes y burgueses."'
    ],
    preached:
      'En agosto de 1670 Bossuet predicó el funeral de Enriqueta Ana de Inglaterra, duquesa de Orleans, muerta de forma repentina a los veintiséis años, en la basílica de Saint-Denis ante toda la corte de Luis XIV. Según los relatos, la asamblea estaba conmovida: la muerte súbita de la princesa, los rumores que corrieron después, el duelo de la familia real. Bossuet se hizo oír con su voz de orador sacro, grave y medida, que bajaba al lamento y subía a la sentencia; el famoso grito «¡Madame se muere! ¡Madame está muerta!» rompió la cadencia clásica y logró que la asamblea estallara en llanto. Probablemente pronunció la oración ante el féretro, con la pompa fúnebre al fondo, sin que nadie respondiera palabra: la muerte misma parecía predicar.',
    introduction:
      'Bossuet abrió sorprendiendo a la corte: en lugar de elogiar a la difunta, la presentó como figura de una lección sobre la muerte. Su primer movimiento fue contraponer la pompa fúnebre que llenaba la basílica con la desnudez de la muerte que se había llevado a la princesa.',
    phrases: [
      'El grito interrumpido «¡Madame se muere! ¡Madame está muerta!» —ruptura deliberada del período clásico—: cortó la elocuencia para que la muerte hablara sola.',
      'La anáfora del «todo» tomada de Eclesiastés: obra, pensamiento, ciencia y sabiduría citadas en serie para vaciar de seguridad lo que el hombre presume.',
      'El inventario de grandezas derrotadas: juventud, gloria, dignidad, cuna real: la acumulación mostraba al sepulcro igualando a los príncipes con los demás.',
      'La apóstrofe a la vanidad dirigida a la corte: se volvió hacia los grandes presentes y los interrogó sobre su propia sed de gloria.',
      'La imagen del sepulcro como único lugar igualitario: recurso fúnebre clásico que quita toda preeminencia delante de la muerte.'
    ],
    bridges: [
      'De la sorpresa inicial pasó al primer punto narrando la muerte como acontecimiento que cortó la vida en pleno esplendor. La narración fúnebre situó a la princesa joven, gloriosa y de pronto sin defensa.',
      'Del relato saltó a la meditación general por vía de universalización: lo que la muerte hizo con una princesa lo hará con toda grandeza humana. La acumulación de vanidades sirvió de bisagra hacia el segundo punto.',
      'Para el consuelo final cambió de registro: de la sentencia sobre la vanidad pasó a la apelación a la eternidad. El último punto se abrió girando del juicio al consuelo: solo quien vive pensando en la eternidad está preparado.'
    ],
    duration: '60 min'
  },
  // ------------------------------------------------------------------ //
  // Predicadores contemporáneos: síntesis editorial de temas centrales de
  // sus mensajes públicos (no texto verbatim).
  {
    id: 'graham-cross',
    author: 'Billy Graham',
    veracity: 'documentado',    title: 'La cruz y el llamado',
    year: 1949,
    place: 'Cruzada de Los Ángeles',
    occasion:
      'La cruzada de Los Ángeles de 1949 lo lanzó a la fama: semanas seguidas de mensajes ante miles de oyentes en la carpa de Washington y Hill, mientras los medios descasaban la predicación del evangelio.',
    themes: ['Evangelismo', 'Arrepentimiento'],
    text: 'Juan 3:16 — "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."',
    style:
      'Evangelismo claro y apurado: la caída y la esperanza en la cruz, invitación pública al arrepentimiento, lenguaje sencillo y solemnidad a la vez.',
    impact:
      'Definió el evangelismo masivo del siglo XX y lanzó una voz que llegó a decenas de países.',
    outline: [
      'El pecado es real: nadie escapa de la necesidad del arrepentimiento.',
      'La cruz es la única manera: no hay salvación por las obras humanas.',
      'La fe de cada uno: cada oyente es llamado personalmente por Dios.',
      'La decisión: hoy es el día; mañana no está garantizado.'
    ],
    quotes: [
      '"Someday you will read or hear that Billy Graham is dead. Don\'t you believe a word of it. I shall be more alive than I am now." — (Algún día se leerá que Billy Graham murió; no lo creas, porque estaré más vivo que ahora.)'
    ],
    preached:
      'En la cruzada de Los Ángeles de 1949, semanas seguidas de reuniones bajo la gran carpa que llamaron la catedral de lona, Graham predicaba a multitudes que llenaban los asientos: familias, veteranos y buscadores atraídos por lo que decían los periódicos. Hablaba con su voz sureña, directa y sin adornos, señalando los versículos en la Biblia abierta y explicando el evangelio como quien anuncia una noticia urgente. Los oyentes reaccionaban con la quietud tensa de la convicción, y al final, tras el coro, muchos bajaban del graderío hacia el campo para responder a la invitación pública. Ese modo —el pecado, la cruz, el llamado— se convirtió en su firma durante sesenta años y lo lanzó a los estadios del mundo.',
    introduction:
      'Graham solía abrir sin rodeos declarando el asunto: la Biblia tiene la respuesta al problema más urgente del hombre, y ese problema tiene nombre, el pecado. Su primer movimiento retórico era la urgencia —vivimos días decisivos, la hora no espera— antes de abrir Juan 3:16 y recorrerlo frase por frase ante la multitud.',
    phrases: [
      '«La Biblia lo dice, y yo la creo»: la fórmula de autoridad con que sellaba cada afirmación del mensaje.',
      '«El problema de hoy es el mismo de siempre: el corazón humano»: así universalizaba el diagnóstico antes de señalar la solución.',
      '«Dios tomó la iniciativa: la cruz no es nuestro acercamiento a él, es su venida a nosotros»: la definición con que protegía la gracia de toda malinterpretación.',
      '«Nadie es demasiado bueno para necesitar la cruz, y nadie está demasiado lejos para alcanzarla»: la frase con que cerraba el paso al orgulloso y abría la puerta al perdido.',
      '«Yo no puedo convertir a nadie: solo presento a Cristo; la decisión es entre usted y Dios»: su descargo habitual antes del llamado.',
      '«Ahora mismo, donde está sentado, puede tomar la decisión más grande de su vida»: la transición fija que desembocaba en el coro y el pasillo.'
    ],
    bridges: [
      'Tras declarar la urgencia de los días, Graham baja al diagnóstico con Juan 3:16 abierto: nombra primero la razón del llamado —el pecado es real, y nadie escapa de la necesidad del arrepentimiento.',
      'Del pecado pasa a la única salida con el gesto de señalar la cruz: Dios hizo lo que usted no puede hacer, y por eso toda salvación por obras humanas queda excluida.',
      'De la obra universal de Cristo entra al plano personal con un cambio de pronombre: de «Dios amó al mundo» a «todo aquel que en él cree» —y «todo aquel» es usted—, llamado personalmente por Dios.',
      'Con el corazón preparado, Graham apura la decisión: mañana no está garantizado y hoy es el día, de modo que cuando el coro empieza, la predicación misma se convierte en pasillo.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'macarthur-scripture',
    author: 'John MacArthur',
    veracity: 'documentado',    title: 'La suficiencia de la Escritura',
    year: 1990,
    place: 'Grace Community Church, Los Ángeles',
    occasion:
      'Defense frontal de la Palabra frente a la experiencia subjetiva de la época, delante de una iglesia cada vez más influida por el sentimentalismo religioso.',
    themes: ['Firma y certeza', 'Santidad'],
    text: '2 Timoteo 3:16-17 — "Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia..."',
    style:
      'Expositivo-versículo-a-versículo: doctrina transparente, sin anécdotas largas, argumento cerrado que persigue cada objeción.',
    impact:
      'Símbolo de la regresión de la exposición bíblica frente al sentimentalismo, y de Grace to You en la enseñanza reformada.',
    outline: [
      'La Escritura es inspirada y completa: no falta nada que Dios deba añadir.',
      'Es suficiente: es una dama absoluta de enseñanza, corrección y instrucción.',
      'Es eficaz: hace al hombre de Dios completo, equipado para toda obra buena.',
      'Es final: la experiencia no reemplaza a la Palabra, se corregida por ella.'
    ],
    quotes: [
      '"La verdad es la verdad aunque la mayoría diga lo contrario; depende de la Palabra, no de las personas."'
    ],
    preached:
      'En Grace Community Church, en Sun Valley, California, MacArthur predicaba con la Biblia abierta sobre el atril, recorriendo 2 Timoteo 3:16-17 frase por frase ante una congregación que lo escuchaba con cuadernos abiertos. En una época en que la experiencia subjetiva y el sentimentalismo religioso ganaban terreno incluso entre evangélicos, su mensaje sonaba como una defensa frontal: no era una conferencia académica, sino una exhortación pastoral sobre la autoridad de la Palabra. Su voz era firme y precisa, sin artificios retóricos, y sostenía cada argumento hasta cerrar toda objeción; solía dejar pausas breves tras cada aseveración para que el oyente la sopesara. La reacción habitual era de solemnidad y gratitud por la claridad, y muchos oyentes de su ministerio de enseñanza tomaban estas horas como su catecismo de la exposición bíblica.',
    introduction:
      'Antes de leer el texto, MacArthur solía describir la crisis de la hora: una cristiandad hambrienta de experiencias que había degradado la Palabra a la condición de apéndice. Su primer movimiento retórico era señalar que el problema no era carencia de revelación, sino desconfianza en la revelación ya dada. Luego leía 2 Timoteo 3:16-17 y anunciaba que el texto respondería, de una sola vez, a los cuatro atributos de la Escritura.',
    phrases: [
      '«Inspirada por Dios, no dictada a medias»: fórmula con que afirmaba el origen divino de cada palabra del texto.',
      'En sus predicaciones insistía en que «la Escritura no necesita actualizarse: necesita creerse», definición que cortaba de raíz toda pretensión de modernizarla.',
      '«Dios no envía a un soldado incompleto al campo de batalla»: imagen con que explicaba el equipamiento del hombre de Dios.',
      'Preguntaba a su audiencia: «¿Qué experiencia puede corregir lo que la Escritura corrige?», interrogación retórica que subordinaba toda vivencia a la Palabra.',
      'Solía cerrar cada bloque afirmando que «no hay una sola cosa que la Escritura no alcance», acumulación con que subrayaba su suficiencia absoluta.'
    ],
    bridges: [
      'De la introducción sobre la crisis del sentimentalismo entraba al primer punto mediante la lectura lenta de 2 Timoteo 3:16, deteniéndose en el término traducido «inspirada por Dios» para fundamentar la inspiración plena.',
      'Del origen divino pasaba a la suficiencia enumerando los cuatro usos del texto —enseñar, redargüir, corregir, instruir—, que desplegaba uno por uno ante la congregación.',
      'El puente hacia el tercer punto era la pregunta de para qué sirve una Escritura tan completa: la respuesta del versículo 17, hacer completo al hombre de Dios, introducía la eficacia y el equipamiento para toda obra buena.',
      'Al llegar al punto final contraponía la experiencia subjetiva a la Palabra que la juzga, mostrando que la Escritura es el tribunal final ante el que toda pretensión espiritual debe presentarse.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'stanley-obedience',
    author: 'Charles Stanley',
    veracity: 'reconstruido',
    title: 'Obediencia y bendición',
    year: 1998,
    place: 'First Baptist Church, Atlanta',
    occasion:
      'Su Principio de Vida N.º 2 —«Obedece a Dios y deja las consecuencias en sus manos»—, que aprendió de su abuelo George Washington Stanley en 1949, predicado a millones por televisión y radio.',
    themes: ['Firma y certeza', 'Oración'],
    text: 'Deuteronomio 28:1-2 — "...si oyeres atentamente la voz de tu Dios... vendrán sobre ti todas estas bendiciones."',
    style:
      'Devocional directo: aplicación práctica de la Escritura paso por paso, con voz paternal y evidencia bíblica.',
    impact: 'Base devocional de In Touch Ministries y modelo de aplicación sencilla y fiel.',
    outline: [
      'La obediencia no es opcional: es el camino de la fe obediente.',
      'Los resultados pueden retrasar, pero nunca faltarán.',
      'La obediencia guarda, y también abre la puerta de la bendición del corazón.'
    ],
    quotes: ['"Obedece a Dios y deja las consecuencias en sus manos."'],
    preached:
      'En el santuario de la First Baptist Church de Atlanta, Charles Stanley predicaba con tono pausado y paternal, avanzando por pasos numerados que sus oyentes podían anotar para la semana. Este mensaje formaba parte de la enseñanza que transmitía a millones de hogares a través del programa In Touch, por televisión y radio, y su estilo devocional directo convertía el principio aprendido de su abuelo en un camino práctico. La congregación lo escuchaba con la atención serena de quien recibe consejo de un padre; en las casas, muchas familias copiaban la frase central en tarjetas para recordarla. Hablaba despacio, con una confianza apacible, y repetía la aplicación hasta dejarla instalada en la memoria del oyente.',
    introduction:
      'Stanley solía abrir este tipo de mensaje contando cómo su abuelo le enseñó el principio de la obediencia cuando era un muchacho que debía decidir si seguía a Dios. Su primer movimiento retórico era presentarlo no como un lema memorable, sino como un camino probado durante décadas de ministerio. Después leía Deuteronomio 28:1-2 y anunciaba que la obediencia es la puerta por la que entra la bendición.',
    phrases: [
      '«La obediencia siempre cuesta, pero el desobedecer cuesta más»: sentencia con que pesaba las dos opciones ante la audiencia.',
      '«Entrega el resultado a Dios y verás lo que él hace con él»: explicaba la dimensión de fe que sostiene el principio central.',
      'En sus predicaciones repetía que «no puedes bendecir a Dios con una vida desordenada», advertencia que conectaba la conducta cotidiana con la adoración.',
      '«Cuando Dios habla, el asunto deja de ser negociable»: fórmula con que definía la autoridad de la voz divina.',
      'Preguntaba con frecuencia: «¿Qué te ha pedido Dios que aún no has hecho?», interrogación que convertía el sermón en examen personal.',
      '«La demora no es negación»: expresión breve con que resumía la paciencia que exige la bendición prometida.'
    ],
    bridges: [
      'Desde la historia del abuelo pasaba al texto deuteronómico con un puente sencillo: el principio de la familia se confirma en la Escritura, y Deuteronomio 28 mostraba que la obediencia nunca fue opcional para el pueblo de Dios.',
      'Tras afirmar que la obediencia no admite negociación, anticipaba la objeción natural de la audiencia —¿y si la bendición no llega?—; esa pregunta abría el segundo punto sobre los resultados que pueden tardar.',
      'Del tiempo de espera regresaba a la vida cotidiana: la obediencia que guarda no era doctrina abstracta, sino la puerta del corazón por la que Dios derrama su provisión.'
    ],
    duration: '30 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'osteen-favor',
    author: 'Joel Osteen',
    veracity: 'reconstruido',
    title: 'Declaro favor',
    year: 2009,
    place: 'Lakewood Church, Houston',
    occasion:
      'Sermón de su serie sobre la declaración de fe para millones de oyentes y televidentes: cómo hablar las palabras de Dios sobre cada área de la vida.',
    themes: ['Firma y certeza', 'Anhelos humanos'],
    text: 'Salmos 5:12 — "...con favor rodearás de corona al justo."',
    style:
      'Motivacional devocional: aliento simple y afirmaciones repetidas de fe, con verdades bíblicas que sostienen el ánimo de cada día.',
    impact:
      'Uno de sus mensajes más repetidos en la cristiandad moderna y el más asociado a sus palabras de fe diarias.',
    outline: [
      'Las palabras crean: lo que declaramos se convierte en la atmósfera de la vida.',
      'El favor de Dios: mucho más que calma, es la mecánica que avanza lo que Dios ya ha diseñado.',
      'Declarar en acción: cada oración y cada palabra de fe es una semilla del corazón enviada al cielo.'
    ],
    quotes: ['"No estoy donde debería estar, pero gracias a Dios no estoy donde estaba."'],
    preached:
      'En sus predicaciones en Lakewood Church de Houston, instalada desde 2003 en el que fuera el estadio de los Houston Rockets, Osteen predica ante decenas de miles de personas: la antigua arena deportiva se convierte en un anfiteatro de aliento donde la sonrisa pausada del predicador marca el compás del mensaje. Suele abrir con una palabra amable a los televidentes de todo el mundo y repetir sin prisa fórmulas de bendición hasta que la congregación las hace suyas. Este sermón, predicado en 2009 como parte de su serie sobre la declaración de fe, lleva su estilo característico: frases cortas, verdades bíblicas sencillas y un ánimo sostenido que convierte el favor de Dios en práctica de cada día.',
    introduction:
      'Suele abrir con un saludo caluroso y una sonrisa extendida hacia la cámara y la congregación, preguntando con tono cordial si alguien ha notado que algunos días todo sale bien. Su primer movimiento retórico es personalizar el favor: describe a la gente que repite quejas desde la mañana y luego se extraña de que la jornada se torne oscura. Solo entonces cita el Salmo 5:12 para fijar la premisa: la corona de favor ya existe, lo que falta es declararla.',
    phrases: [
      '"Declaro favor sobre mi vida." La fórmula que repite varias veces para que la congregación la pronuncie con él y la lleve a casa de memoria.',
      'El favor de Dios no es privilegio de pocos: es la herencia de todo hijo. Con esta aclaración amplía el Salmo 5:12 de la élite espiritual al creyente común.',
      'Tus palabras son semillas: siembra lo que quieres cosechar. La imagen agrícola le permite enlazar la declaración con la paciencia del tiempo.',
      'Cuando declaras, el cielo está de acuerdo. Frase puente que muestra la concordancia entre la boca del creyente y la promesa de Dios.',
      'No salgas de casa sin tu corona. Cierre memorable que convierte la metáfora del texto en un hábito diario.'
    ],
    bridges: [
      'Del retrato de las quejas matutinas pasa al primer punto preguntando quién fabrica en realidad la atmósfera del hogar, y responde: las palabras. Así el saludo cordial se convierte en tesis: declarar es crear.',
      'Para pasar de las palabras al favor, retoma el texto ya leído del Salmo 5:12 y pregunta por qué Dios corona al justo: porque el favor es el motor que empuja lo que Dios ya diseñó, no un premio ocasional.',
      'Para el último punto invita a la congregación a pasar de la teoría a la voz: pide repetir en voz alta una declaración de favor, explicando que cada palabra de fe es una semilla del corazón enviada al cielo.'
    ],
    duration: '28 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'evans-kingdom',
    author: 'Tony Evans',
    veracity: 'reconstruido',
    title: 'La agenda del Reino',
    year: 2000,
    place: 'Oak Cliff Bible Fellowship, Dallas',
    occasion:
      'Predicó su visión de que la iglesia está para dominar la ciudad no por política sino por ser la agencia del Reino; su mensaje más celebrado.',
    themes: ['Firma y certeza', 'Santidad'],
    text: 'Mateo 6:33 — "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas serán añadidas."',
    style:
      'Agenda del Reino: lenguaje vivo, imágenes urbanas claras y apelación a la acción concreta de la iglesia.',
    impact:
      'Fundamentó el ministerio evaporado ciudad, The Urban Alternative, y su modelo extendido en iglesias de viviendas por los países.',
    outline: [
      'El Reino es la agenda real: la iglesia no está llamada a sostener un cristianismo privado, sino a dominar la ciudad espiritualmente.',
      'La familia es la primera agencia del Reino: es la intención de Dios para todos.',
      'La ciudad se alcanza por medio de la iglesia local: cada congregación es un centro del Reino de Dios.'
    ],
    quotes: [
      '"El problema no es la ciudad: el problema es que la iglesia perdió la visión del Reino."'
    ],
    preached:
      'Desde el púlpito osado de Oak Cliff Bible Fellowship en Dallas, Evans predica con ritmo docente y confrontativo: define términos con precisión de maestro, ejemplifica con la vida urbana del sur de la ciudad y después confronta sin rodeos la comodidad de la iglesia. Este mensaje de 2000 condensa su tesis central: el Reino de Dios es el gobierno real de Dios en la historia y la iglesia es su agencia visible. La congregación responde con amens mientras él alterna definición, anécdota y pregunta retórica, dejando a cada oyente la agenda del Reino como un encargo personal, no como un ideal lejano.',
    introduction:
      'Suele abrir con una pregunta que desarma: si la iglesia está en la ciudad, por qué su presencia no se nota en las estadísticas del barrio. Antes de tocar el texto, su primer movimiento retórico es definitorio: aclara que «Reino» no significa territorio ni nostalgia, sino el gobierno activo de Dios. Ese rigor previo prepara al oyente para recibir la crítica como doctrina y no como agravio.',
    phrases: [
      '"El Reino de Dios es el gobierno de Dios poniéndose en práctica." Definición compacta que repite al inicio para fijar el vocabulario de todo el sermón.',
      '"La iglesia no tiene una agenda: la agenda del Reino tiene una iglesia." La inversión gramatical le sirve para colocar a la congregación bajo la misión y no al revés.',
      'Cuando Dios quiere hacer algo en la tierra, no envía ángeles: envía a la iglesia. Frase que confronta la pasividad y traslada la responsabilidad al auditorio.',
      'Jesús no vino a hacernos religiosos: vino a hacernos ciudadanos del Reino. Contraste que separa el culto privado del encargo público.',
      'Si el Reino no gobierna tu casa, no gobernará tu ciudad. Máxima que antecede a su enseñanza sobre la familia como primera agencia.'
    ],
    bridges: [
      'Desde la definición inicial del Reino avanza hasta el primer punto citando Mateo 6:33: buscar primeramente el Reino significa que la agenda de Dios precede a la nuestra, y que el cristianismo privado no es suficiente para dominar la ciudad espiritualmente.',
      'Para descender del ideal a la escala más pequeña usa una imagen doméstica: todo gobierno prueba su fuerza primero en el hogar, y por eso la familia es la primera agencia del Reino antes que cualquier programa de la iglesia.',
      'Con los dos puntos anteriores en la mano, sube de nuevo a la escala urbana con una imagen de barricadas: la ciudad no se conquista por presión política sino por congregaciones que funcionan como centros del Reino en cada cuadra.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'cho-prayer',
    author: 'David Yonggi Cho',
    veracity: 'reconstruido',
    title: 'Oración y fe declarada',
    year: 1990,
    place: 'Yoido Full Gospel Church, Seúl',
    occasion:
      'Explicaba ante miles el secreto que sostuvo a la iglesia más grande del mundo: la oración continua y la proclamación de la Palabra.',
    themes: ['Oración', 'Poder sobrenatural'],
    text: 'Marcos 11:24 — "Por tanto, os digo que todo lo que pidáis orando, creed que lo recibís, y os será hecho."',
    style:
      'Oración y fe declarada: el cuarto de oración, la meditación bíblica intensa y la proclamación de la Palabra.',
    impact:
      'Fundamento del discipulado por células y de la oración comunitaria en los cinco continentes.',
    outline: [
      'La oración no es acción: es comunión que sostiene cada empeño de la vida.',
      'El cuarto de oración: cada creyente tiene una cita fija con Dios como lugar de refugio y poder.',
      'La fe se declara: la Palabra proclamada es semilla que no vuelve vacía.'
    ],
    quotes: [
      '"La oración es la llave que abre la mano de Dios; sin oración la vida cristiana se hace mentira."'
    ],
    preached:
      'En el santuario de Yoido Full Gospel Church de Seúl, capaz de reunir a cientos de miles entre el recinto principal y las salas satélite con traducción simultánea, Cho predica en coreano con voz firme y gestos precisos que el intérprete reproduce para los miles de visitantes extranjeros. Pastor experto en oración, explica ante miles el secreto que sostuvo a la iglesia más grande del mundo: la oración continua, la meditación intensa de la Escritura y la proclamación de la Palabra. En estas predicaciones de 1990 suele abrir contando cómo él mismo aprendió a orar en medio de la enfermedad, y cierra instando a cada creyente a fijar una cita diaria con Dios.',
    introduction:
      'Suele abrir negando la idea popular de que la oración es un recurso de emergencia: la compara con la respiración, algo que no se interrumpe nunca sin consecuencias. Su primer movimiento retórico es autobiográfico y doctrinal a la vez: recuerda cómo descubrió que sin comunión diaria el ministerio se apaga, y solo después lee Marcos 11:24. Con ello instala la tesis desde el inicio: primero creer, luego declarar, y todo sostenido por el cuarto de oración.',
    phrases: [
      '"Orar es respirar el aire del cielo." Comparación que repite para desmontar la idea de la oración como actividad ocasional.',
      '"Quítele una hora al sueño y désela a Dios." Exhortación directa con la que traduce la disciplina espiritual en un costo concreto y medible.',
      '"Cree que lo recibes, y declara que ya es tuyo." Fórmula derivada de Marcos 11:24 con la que ordena el movimiento de la fe: creer primero, hablar después.',
      'El cuarto de oración es la central eléctrica del cristiano. Imagen con la que explica por qué la comunión privada sostiene el servicio público.',
      'La Palabra proclamada nunca vuelve vacía. Confesión que cierra sus argumentos anclándolos en la eficacia del texto bíblico.'
    ],
    bridges: [
      'Con la comparación de la respiración ya instalada, pasa al primer punto añadiendo un matiz: respirar no es un trabajo sino comunión, y por eso la oración sostiene cada empeño de la vida en lugar de interrumpirlo.',
      'Para pasar de la comunión al lugar, pregunta a la congregación dónde y a qué hora se encuentra realmente con Dios, y de ahí introduce el cuarto de oración como cita fija de refugio y poder.',
      'Para el punto final retoma Marcos 11:24 y lo convierte en instrucción: si ya creyó y ya oró, ahora debe hablar, porque la Palabra proclamada es la semilla que no vuelve vacía.'
    ],
    duration: '35 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'gebel-superheroe',
    author: 'Dante Gebel',
    veracity: 'reconstruido',
    title: 'Súper héroe',
    year: 2004,
    place: 'River Church, Anaheim (antes El Río), Conferencia de Adolescentes',
    occasion:
      'Su charla más icónica, repetida durante años en la Conferencia de Adolescentes: miles de jóvenes atestan cada verano el auditorio para escucharla.',
    themes: ['Gracia', 'Anhelos humanos'],
    text: '2 Corintios 4:7 — "...tenemos este tesoro en vasos de barro, para que la excelencia del poder sea de Dios, y no de nosotros."',
    style:
      'Narrativo-humorístico: anécdotas con ironía cargada que terminan golpeando al corazón; el mensaje del "perdedor elegido" y el llamáu del capote de Dios.',
    impact:
      'Sello y punto de reunión de la generación latina de fe en Estados Unidos: miles testigos cada año, y de ahora en adelante la serie de libros en español y en páginas del evangelista de Los Ángeles.',
    outline: [
      'Todos viste piedad para poder ser un superhéroe: pero Dios no usa capes, usa lenguaje.',
      'El llamado: Dios escoge a los perdedores para hacerlos campeones.',
      'Tu tarea: no eres tan terrible como para que Dios no pueda usarte, ni tan bueno como para no necesitarlo.'
    ],
    quotes: [
      '"No eres tan terrible como para que Dios no pueda usarte, ni tan bueno como para no necesitarlo."'
    ],
    preached:
      "En sus predicaciones de la Conferencia de Adolescentes de River Church en Anaheim, repartidas cada verano ante miles de jóvenes atestando el auditorio, Gebel solía abrir confesando sus propias decepciones con el humor afilado que lo hizo famoso: relatos de fracasos, de invitaciones rechazadas, de sueños postergados, contados con voz de locutor que se burla de sí mismo. El mensaje del 'perdedor elegido' avanzaba por capas de ironía hasta el momento en que la risa se quebraba: el vaso de barro no es un defecto de fábrica, es el diseño. Luego venía el llamamiento del capote de Dios, ese gesto de echar el manto sobre el que nadie eligió, y el auditorio respondía de pie, muchos con lágrimas, reconociéndose en el elegido improbable.",
    introduction:
      'Abría preguntando a los jóvenes qué superhéroe quisieran ser y burlándose de las respuestas, para revelar enseguida que todos cargan la misma fantasía: poder, capa y ausencia de debilidad. El primer movimiento retórico era la confesión: Gebel se presentaba como el anti-superhéroe, el que falló, antes de anunciar que 2 Corintios 4:7 iba a desmontar la fantasía completa.',
    phrases: [
      '"Dios no usa capas, usa vasos de barro": fórmula que invertía la fantasía de poder para redefinir el instrumento divino.',
      '"El tesoro no está en la vitrina: está en la vasija rota": la usaba para dignificar la fragilidad del oyente.',
      '"Tu debilidad es tu credencial": frase que resignificaba el complejo como requisito del llamado.',
      '"Dios rastrea perdedores": la repetía con humor para luego bajarla a solemnidad: es la gracia la que busca.',
      '"La excelencia del poder es de Dios, no del portador": fórmula exegética que mantenía el mensaje en el terreno de la gracia.'
    ],
    bridges: [
      'Del catálogo de superhéroes pasaba al primer punto derribando el disfraz: el auditorio soñaba con capas, pero el texto hablaba de lenguaje, de lo que Dios busca no es el traje sino el vaso.',
      'Para el segundo punto saltaba de la vasija al llamado: si el recipiente es barro, el escándalo es que Dios lo escoge a propósito, y ahí desarrollaba la tesis del elegido improbable.',
      'Del llamado al tercer punto entraba con la aplicación personal: el joven que esperaba ser suficiente someday descubre que nunca lo será ni lo necesita ser, porque la ecuación del reino funciona al revés.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'witt-worship',
    author: 'Marcos Witt',
    veracity: 'reconstruido',
    title: 'La adoración como estilo de vida',
    year: 2005,
    place: 'Conferencia de Adoración, Ciudad de México',
    occasion:
      'Sesión magistral de su conferencia de adoración, dirigida a miles de adoradores y líderes en español en Houston, México y Latinoamérica.',
    themes: ['Adoración', 'Oración'],
    text: 'Romanos 12:1 — "...presentéis vuestros cuerpos en sacrificio vivo, santo, agradable a Dios: éste es vuestro culto racional."',
    style:
      'Adoración como estilo de vida: enseña que adorar no se detiene en la música sino que abarca toda la existencia; voz calorosa y didáctica.',
    impact:
      'Moldeó la adoración congregacional en español de una generación: enseñanzas que siguen vivas hoy.',
    outline: [
      'La adoración no es solo música: es una manera de existir.',
      'El verdadero culto: el cuerpo entero del creyente puesto en el altar.',
      'El fruto: la vida diaria se convierte en un himno viviente.'
    ],
    quotes: [
      '"La adoración no es solo la canción: es la manera en que vives todos los días delante de Él."'
    ],
    preached:
      'En sus predicaciones de la Conferencia de Adoración en Ciudad de México, ante miles de adoradores y líderes de toda Latinoamérica, Marcos Witt operaba como maestro de gremio: enseñaba con voz cálida, pausada y didáctica, alternando la exposición bíblica con sus décadas de experiencia como salmista. Solía abrir confesando el malentendido que él mismo había alimentado: una generación entera confundió adoración con repertorio musical. Sesión magistral y sin prisa, la enseñanza avanzaba de la definición a la práctica: el altar de Romanos 12 no es el escenario, es la vida entera del creyente. Los líderes de adoración en el auditorio anotaban frases que luego circularían por iglesias de todo el mundo hispano.',
    introduction:
      'Witt abría con una confesión desarmante: después de tantas grabaciones y conciertos, él mismo se descubrió adorando la canción más que a Aquel de quien cantaba. Ese primer movimiento retórico de autocrítica desarmaba a los especialistas del auditorio y habilitaba la pregunta central: ¿dónde termina la música y empieza la adoración? Solo después presentaba Romanos 12:1 como la definición que nada tenía que ver con el escenario.',
    phrases: [
      '"La adoración no se apaga con la última canción": la empleaba para deslindar el evento del estilo de vida.',
      '"El sacrificio vivo es el cuerpo entero sobre el altar": fórmula exegética que materializaba el culto racional de Romanos 12.',
      '"Dios no quiere tu música: quiere tu existencia": la repetía para desafiar a los músicos del auditorio a ir más allá del don.',
      '"Adorar es existir delante de Él": frase de síntesis que reducía la definición a su núcleo cotidiano.',
      '"Que tu semana sea tu himno": la usaba como aplicación final para traducir la doctrina a la vida ordinaria.'
    ],
    bridges: [
      'De la confesión inicial pasaba al primer punto con la distinción entre el género y la existencia: la música es vehículo, no territorio, y por eso la adoración puede empezar cuando termina la canción.',
      'Para el segundo punto Witt traía el texto de Romanos 12:1 y lo leía contra el trasfondo de los altares: el culto racional del Nuevo Testamento no es un rito del domingo sino la entrega del cuerpo en vivo.',
      'Del altar al tercer punto entraba con la consecuencia natural: si el cuerpo está en el altar todos los días, entonces la vida diaria —el trabajo, la casa, la calle— se convierte en un himno viviente que nadie aplaude pero Dios escucha.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'luna-healing',
    author: 'Cash Luna',
    veracity: 'reconstruido',
    title: 'Poder para sanar',
    year: 2010,
    place: 'Casa de Dios, Guatemala',
    occasion:
      'Sermón principal de sus congresos de poder y sanidad, con miles de personas y testimonios de milagros que marcaron a Guatemala.',
    themes: ['Poder sobrenatural', 'Oración'],
    text: 'Santiago 5:15 — "Y la oración de fe salvará al enfermo, y el Señor lo levantará."',
    style:
      'Sobre el poder de Dios y la sanidad: fe declarada, ambiente de adoración y expectativa de milagros que produce al fondo el testimonio real.',
    impact:
      'Una de las voces mayores de la cristiandad de Guatemala y de las iglesias de América; marcó la manera en que una comunidad se enamora de la sanidad y del poder.',
    outline: [
      'Dios quiere sanar hoy: el milagro no es el final, es el principio del mensaje.',
      'La oración de fe: no es fuerza requerida, sino confianza en ya tenido el poder de Dios.',
      'El testimonio regresa: cada sanidad, testis de adoración de muchos.'
    ],
    quotes: [
      '"Dios quiere sanarte hoy: el milagro no del paso absoluto, es el significado del mensaje."'
    ],
    preached:
      'En sus predicaciones de los congresos de poder y sanidad en Casa de Dios, Guatemala, Cash Luna conducía la reunión desde la atmósfera de adoración hasta la expectativa del milagro con una pedagogía de fe deliberada: enseñaba primero, proclamaba después, y en medio dejaba espacio para que el testimonio real confirmara la Palabra. Ante miles de personas —muchas enfermas, muchas escépticas—, solía abrir bajando el ritmo: la sanidad no es espectáculo de altar, es naturaleza del Padre. Luego declaraba Santiago 5:15 con autoridad sencilla, repetía la fórmula de la oración de fe y esperaba: los testimonios de sanidades que marcó a Guatemala no eran el final del mensaje sino su principio, porque el milagro predicaba por sí mismo.',
    introduction:
      'Luna abría a menudo recordando un testimonio reciente de sanidad, contado sin estridencias, casi en tono de conversación, para colocar a la congregación en clima de expectativa. El primer movimiento retórico era el testigo: antes de enseñar sobre la fe, traía un caso real que ya había sucedido, y sobre esa evidencia viva sustentaba la pregunta que abría la enseñanza: ¿quisiera Dios sanar hoy o ese capítulo se cerró con los apóstoles?',
    phrases: [
      '"El milagro no es el final del mensaje: es el principio": la empleaba para invertir la expectativa de que la sanidad corona el culto.',
      '"La oración de fe no es esfuerzo: es confianza": fórmula que aliviaba a los que creían que sanar dependía de su intensidad emocional.',
      '"Dios no sanó ayer: Él sigue siendo el mismo hoy": la repetía para anclar la doctrina en la inmutabilidad divina.',
      '"No ores pidiendo que Dios se acerque: Él ya se ha acercado": frase que reorientaba la oración del desespero a la certeza.',
      '"El testimonio de uno siembra la fe de mil": la usaba para explicar por qué la congregación escucha casos antes de la proclamación.'
    ],
    bridges: [
      'Del testimonio inicial pasaba al primer punto declarando la disposición del Padre: si Dios sanó en el relato que acababa de contar, la pregunta no es si puede, sino si quiere, y la respuesta es que quiere hoy.',
      'Para el segundo punto Luna tomaba Santiago 5:15 y lo despiezaba con calma: la oración de fe no fuerza nada, porque no pide un poder que no existe, sino que confía en el poder que Dios ya otorgó en Cristo.',
      'Del terreno de la oración al tercer punto entraba con la lógica del reino: lo que Dios hace en un cuerpo, lo hace testigo de una congregación, y por eso cada sanidad regresa al altar convertido en adoración.'
    ],
    duration: '60 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'maldonado-supernatural',
    author: 'Guillermo Maldonado',
    veracity: 'reconstruido',
    title: 'Lo sobrenatural de Dios',
    year: 2005,
    place: 'Casa Internacional del Padre (Kingdom City), Houston',
    occasion:
      'Enseño central de sus congresos sobre lo sobrenatural: la misma obra de Dios en los milagros y transformaciones alcanzan a muy miles de hoy.',
    themes: ['Poder sobrenatural', 'Santidad'],
    text: 'Lucas 10:19 — "He aquí os doy potestad para hollar serpientes y escorpiones, y sobre toda fuerza del enemigo, y nada os dañará."',
    style:
      'Sobre lo sobrenatural: la autoridad del creyente, la fe puesta en práctica y la proclamación de la Palabra escrita; enseñanza firme y directa.',
    impact:
      'Ama vasta audiencia en Latinoamérica y Estados Unidos: enseñanza de ministerios sobrenaturales que usan tensas iglesias.',
    outline: [
      'Lo sobrenatural es el ambiente normal de los hijos de Dios.',
      'La autoridad es delegada, no pretendida: viene solo de la Palabra.',
      'La fe se actúa: la proclamación crea la apertura que el milagro requiere.'
    ],
    quotes: [
      '"Lo sobrenatural es lo natural de los hijos de Dios; si no lo vives, vives menos que la intención de tu Padre."'
    ],
    preached:
      "En sus predicaciones de los congresos sobre lo sobrenatural en King Jesus International Church, Guillermo Maldonado enseñaba con firmeza y directa, sin concesiones al oyente pasivo: la sesión avanzaba como instrucción militar del Reino, con definiciones precisas, mandatos de actuar y demostraciones que invitaban a la fe puesta en práctica. En su enseñanza central sobre Lucas 10:19, solía abrir declarando que lo sobrenatural no es privilegio de élites espirituales sino ambiente normal de los hijos de Dios, y que la frase 'si no lo vives, vives menos que la intención de tu Padre' resumía su tesis. El tono autoritario carismático se oía en las órdenes: proclama, actúa, no lo pienses más. Miles salían de sus congresos convencidos de que el milagro era cuestión de autoridad ejercida, no de suerte.",
    introduction:
      'Maldonado abría diagnosticando el estado de la iglesia: una generación de creyentes que teoriza sobre el poder sin ejercerlo, y lo hacía con severidad, casi con reproche pastoral. El primer movimiento retórico era el diagnóstico negativo: enumeraba lo que el creyente común no hace —no autoriza, no proclama, no actúa— para crear la tensión que solo el texto de Lucas 10:19 resolvería con la potestad delegada.',
    phrases: [
      '"El creyente no pide autoridad: la recibió y no la usa": la empleaba para confrontar la pasividad del auditorio.',
      '"La fe que no se actúa es teoría": fórmula que empujaba la doctrina al terreno de la práctica inmediata.',
      '"La Palabra proclamada crea la apertura": la repetía para fundar el milagro en la proclamación escrita, no en la improvisación.',
      '"No vienes a escuchar: vienes a activarte": frase que definía su concepto de congreso como activación y no como conferencia.',
      '"Nada os dañará: esa es la cobertura de la obediencia": la usaba para asegurar al creyente que actúa bajo delegación divina.'
    ],
    bridges: [
      'Del diagnóstico sobre la iglesia teórica pasaba al primer punto con la declaración fundacional: lo sobrenatural no es lo extraordinario del creyente, es lo natural, y quien no lo vive vive por debajo del diseño de su Padre.',
      'Para el segundo punto Maldonado distinguía autoridad pretendida de autoridad delegada: el oyente no puede ordenar por carisma propio, sino solo por la Palabra escrita que sostiene cada mandato, y ahí citaba Lucas 10:19 como diploma delegado por Cristo mismo.',
      'De la delegación al tercer punto entraba con la demostración: la fe no se ejercita en el pensamiento sino en el acto, y por eso la proclamación no es oratoria sino apertura, el acto que crea el espacio donde el milagro entra.'
    ],
    duration: '60 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'edwards-dependence',
    author: 'Jonathan Edwards',
    veracity: 'documentado',    title: 'Dios glorificado en la dependencia del hombre',
    year: 1731,
    place: 'Boston, Massachusetts',
    occasion:
      'Su primer sermón publicado, predicado como conferencia anual ante los ministros de Boston; el racionalismo de su época quería darle a la razón el lugar de la gracia.',
    themes: ['Gracia', 'Penitencia'],
    text: '1 Corintios 1:29-30 — "...para que ninguna carne se gloríe en su presencia; mas por él estáis vosotros en Cristo Jesús."',
    style:
      'Exposición doctrinal con la precisión de un teólogo joven: define tres dependencias —gracia, justicia y gloria— todas dadas por Dios.',
    impact:
      'Primer libro impreso de Edwards; fundó su teología de la total dependencia de Dios para la salvación.',
    outline: [
      'Dependencia de la gracia: la salvación es absolutamente gratuita.',
      'Dependencia de la justicia: no la nuestra, sino la de Cristo imputada.',
      'Dependencia de la gloria: ni la luz ni el poder de santificar salen de nosotros.'
    ],
    quotes: [
      '"No hay virtud verdadera que el hombre posea por sí mismo; todo bien que tiene, lo tiene por Dios."'
    ],
    preached:
      'Predicado en Boston en 1731, siendo Edwards un joven de veintiocho años, como conferencia anual ante los ministros reunidos de la ciudad, en un clima intelectual donde el racionalismo tendía a dar a la razón y la virtud natural el lugar de la gracia. Leyó el discurso con la precisión de un teólogo y la voz pareja de siempre; no había épica, sino definiciones. La reacción de los ministros fue de estupefacción respetuosa ante la precisión del joven: el sermón se publicó por su insistencia y se convirtió en su primer impreso, fundando su teología de la total dependencia.',
    introduction:
      'Abre con 1 Corintios 1:29-30 y enmarca el texto contra el espíritu de la época: el orgullo humano quiere gloriarse delante de Dios reduciendo la salvación a mérito natural. Su primer movimiento es anunciar la tesis: el hombre está en Cristo por pura dependencia, y esa dependencia se extiende a todo: gracia, justicia y gloria. Anuncia los tres campos que recorrerá uno a uno.',
    phrases: [
      '"que ninguna carne se gloríe en su presencia": usa la cláusula paulina como espada contra toda forma de orgullo espiritual.',
      '"por él estáis vosotros en Cristo Jesús": fija la fórmula del texto como la respuesta a cada pregunta del sermón.',
      'tres dependencias, un solo origen: articula el esquema de gracia, justicia y gloria como repetición de una misma verdad.',
      'el yo no es fuente de ningún bien: formula la tesis negativa que atraviesa los tres puntos.',
      'la fuente y el manantial: recurre a la imagen hidrológica para distinguir el don de su origen.'
    ],
    bridges: [
      'De la introducción al primer punto entra por antítesis: frente al mérito que el racionalismo reivindica, el texto declara la salvación absolutamente gratuita; la primera dependencia es de la gracia.',
      'Al segundo punto entra con una pregunta que apela a la conciencia del oyente: ¿con qué justicia comparecerás ante Dios? La respuesta no puede ser la propia, sino la de Cristo imputada; así pasa de la gracia a la justicia.',
      'Cierra con apelación contra el orgullo espiritual: ni siquiera la luz del entendimiento ni el poder de santificar salen de nosotros; aun lo más elevado del alma es dependencia, y por ello toda gloria vuelve a Dios.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'spurgeon-heart',
    author: 'Charles H. Spurgeon',
    veracity: 'documentado',    title: 'El corazón del evangelio',
    year: 1885,
    place: 'Tabernáculo Metropolitano, Londres',
    occasion:
      'Predicó sobre Juan 3:16 en la madurez de su ministerio; declaró que quería "predicar el evangelio una vez más, simple y entero".',
    themes: ['Gracia', 'Evangelismo'],
    text: 'Juan 3:16 — "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito..."',
    style:
      'Exposición calorosa del texto más citado: frase por frase, con llamadas al corazón del oyente y al simple creyente.',
    impact:
      'Se publicó en Metropolitano Tabernacle Pulpit y sigue siendo su sermón sobre el evangelio más difundido.',
    outline: [
      'La manera del amor de Dios: "de tal manera" que se mide en la cruz.',
      'El regalo del amor: su Hijo unigénito, no un ángel ni una nación.',
      'El alcance del amor: "todo aquel que en él cree", sin muros.',
      'La vida eterna: el fruto que ya se goza y después se hereda.'
    ],
    quotes: [
      '"El evangelio no es un recetario de mandatos: es una carta de amor escrita con la sangre de Cristo."'
    ],
    preached:
      'Predicado en 1885, en el ocaso del ministerio de Spurgeon, cuando la enfermedad ya lo minaba pero su púlpito en el Tabernáculo Metropolitano seguía reuniendo a miles. Declaró a los suyos que quería "predicar el evangelio una vez más, simple y entero", y eligió para ello el versículo más citado del Nuevo Testamento. Según los relatos, los oyentes recibieron la exposición frase por frase con asombro renovado: Juan 3:16 parecía nuevo bajo su lupa. La madurez del predicador se notaba en la calma con que desplegaba cada palabra, sin prisa y sin adorno superfluo, mientras el sermón pasaba al Metropolitan Tabernacle Pulpit.',
    introduction:
      'Admitió de entrada que Juan 3:16 es "el texto de textos", tan conocido que podría parecer gastado; pero propuso tratarlo como una joya que jamás se ha mirado con lupa. Anunció que recorrería el versículo palabra por palabra, y con ese programa entraba en el texto.',
    phrases: [
      'Resumía su plan diciendo que "el versículo es el evangelio en miniatura": señal de que expondría el texto entero como mapa de la salvación.',
      'Señalaba el manantial con la fórmula "Dios amó: allí está la fuente": el origen del plan divino precede a todo mérito humano.',
      'Insistía en la matización "no dijo solo que amó, dijo de tal manera amó": la intensidad del amor se mide en la cruz.',
      'Glosaba el alcance diciendo que "todo aquel: la puerta no tiene cerrojo": la invitación a creer no excluye a nadie que venga.',
      'Remachaba el presente de la salvación afirmando que "el que cree tiene vida ya, no la espera": contra todo Cristianismo de mera expectativa futura.'
    ],
    bridges: [
      'Del anuncio de la joya bajo la lupa pasaba a la primera palabra en tensión: "de tal manera", y mostraba que la manera del amor de Dios solo se lee clavada en la cruz.',
      'Medido el amor en su manera, preguntaba qué dio Dios: con esa transición entraba al punto del regalo, el Hijo unigénito, ni ángel ni nación.',
      'Del regalo dado preguntaba para quién es: la frase "todo aquel que en él cree" abría el punto del alcance del amor sin muros.',
      'Con el alcance establecido, miraba el desenlace del versículo: "no se pierda, mas tenga vida eterna", transición con que entraba en la vida que ya se goza y después se hereda.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'lloydjones-purpose',
    author: 'D. Martyn Lloyd-Jones',
    veracity: 'documentado',    title: 'El propósito de Dios en todas las cosas',
    year: 1960,
    place: 'Westminster Chapel, Londres',
    occasion:
      'Sermón de su monumental serie sobre Romanos que llenó la capilla cada viernes durante años; la exposición de Romanos 8:28 se volvió su legado pastoral.',
    themes: ['Crisis y prueba', 'Firma y certeza'],
    text: 'Romanos 8:28 — "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien."',
    style:
      'Expositivo-diagnóstico: define primero qué no significa el texto, luego qué sí significa; el Dr. examina la ansiedad del oyente como un médico.',
    impact: 'Considerado por muchos el mejor comentario homilético de Romanos del siglo XX.',
    outline: [
      'Qué no significa: ni que todo sea bueno, ni que el mal no exista.',
      'Qué significa: Dios gobierna sobre todas las cosas para el bien de los que lo aman.',
      'El bien supremo: ser conformes a la imagen de Cristo.',
      'La lógica de la providencia: el mal se convierte en instrumento de la gloria.'
    ],
    quotes: [
      '"El cristiano no escapa de la tormenta: pasa a través de ella con Cristo que camina en la misma barca."'
    ],
    preached:
      'Hacia 1960 Lloyd-Jones llevaba años exponiendo Romanos los viernes por la noche en Westminster Chapel de Londres, serie que llenaba la capilla de estudiantes, obreros, médicos y ministros. Romanos 8:28 se predicó en ese contexto como bálsamo pastoral para oyentes marcados todavía por la guerra y la incertidumbre de posguerra. Los oyentes describían sus sermones como diagnósticos: hablaba despacio, con lógica acumulativa, como quien examina a un paciente. Se conservan testimonios de quienes salían de la capilla convencidos de que el doctor había visto el fondo exacto de su ansiedad.',
    introduction:
      'Solía abrir describiendo la enfermedad de la época: la ansiedad como epidemia espiritual, incluso entre creyentes sinceros. Antes de leer el texto avisaba que había que depurar las lecturas superficiales del versículo, anunciando que primero diría qué no significa; con ese aviso médico entraba en Romanos 8:28.',
    phrases: [
      'Abría el análisis con la fórmula "empecemos por las negativas": método con que depuraba las falsas interpretaciones del texto.',
      'Sostenía el argumento con la antítesis "no dice que todas las cosas sean buenas; dice que todas ayudan": precisión léxica que blindaba la doctrina.',
      'Preguntaba en voz alta "¿qué es a bien? vayamos a la Escritura": remitía la definición del bien al contexto inmediato de Romanos 8:29.',
      'Glosaba la providencia afirmando que "el mal no tiene la última palabra; la tiene Dios, que lo usa": fórmula del gobierno divino sobre lo adverso.',
      'Sometía la vida del oyente al criterio bíblico pidiendo "pongámonos bajo la plomada del texto": imagen del examen personal.'
    ],
    bridges: [
      'Del aviso de que hay que depurar lecturas falsas entraba en la primera negativa: ni todo es bueno ni el mal desaparece del camino del creyente.',
      'Descartado lo que el texto no dice, levantaba la afirmación positiva: Dios gobierna sobre todas las cosas, transición con que abría el segundo punto.',
      'Pero, preguntaba, ¿qué es ese bien? La definición lo llevaba al propósito de Dios: ser conformes a la imagen de Cristo, y así abría el tercer punto.',
      'Con el bien definido, daba el paso final de la lógica: si Dios ordena todas las cosas a ese fin, el mal mismo se vuelve instrumento, y entraba en la lógica de la providencia gloriosa.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'tozer-fear',
    author: 'A. W. Tozer',
    veracity: 'documentado',    title: 'El temor de Dios',
    year: 1955,
    place: 'Southside Alliance Church, Chicago',
    occasion:
      'Predicó contra la irreverencia que crecía en la iglesia de la posguerra: un Dios domesticado, útil, pero sin santidad.',
    themes: ['Santidad'],
    text: 'Proverbios 1:7 — "El temor de Dios es el principio de la sabiduría."',
    style:
      'Profético: frases afiladas que desmontan la religión cómoda y exaltan la santidad y la majestad de Dios.',
    impact:
      'Definió el vocabulario de su generación sobre la reverencia; antecedente directo de La búsqueda de Dios.',
    outline: [
      'El temor de Dios no es espanto: es reverencia ante el Uno y Santo.',
      'El pecado del siglo: un Dios a la medida del hombre.',
      'La sabiduría empieza donde termina la autosuficiencia.'
    ],
    quotes: [
      '"El que pierde el temor de Dios no pierde una doctrina: pierde el ojo de su propia alma."'
    ],
    preached:
      'A mediados de los años cincuenta Tozer predicaba cada domingo en Southside Alliance Church de Chicago ante una congregación devota y atenta, mientras su voz alcanzaba a un público mayor por la radio de la Alianza y sus libros. Este sermón de 1955 lo situó contra corriente: la iglesia de posguerra celebraba a un Dios útil y afable, y Tozer diagnosticó allí un "Dios a la medida del hombre". Los relatos de su púlpito describen una voz mesurada pero cargada, frases que caían como sentencias y silencios que pesaban tanto como las palabras. Muchos oyentes decían salir con la conciencia despierta y con el Dios de la Biblia recuperado.',
    introduction:
      'Abría con un diagnóstico de la época: el mayor peligro de la iglesia no es la irreligión abierta sino un dios falso al que se llama cristianamente. Con esa acusación ya plantada, leía Proverbios 1:7 y advertía que todo el sermón dependía de qué se entiende por temor.',
    phrases: [
      'Distinguía de entrada "no es el miedo del esclavo; es el asombro del hijo": separaba la reverencia filial del terror servil.',
      'Desnudaba al ídolo moderno con la sentencia "un Dios al que no se teme es un ídolo con vocabulario": crítica afilada a la religión cómoda.',
      'Glosaba el pecado del siglo diciendo "la alteza de Dios no se degrada: nosotros degradamos nuestra idea de Él": la culpa vuelve al hombre, no al cielo.',
      'Preparaba el punto final con la imagen "la autosuficiencia cierra la puerta por dentro": el hombre es el guardián de su propia ceguera.',
      'Unía las dos palabras del texto afirmando que "adonde entra el temor de Dios, entra la sabiduría con él": inseparabilidad de reverencia y conocimiento.'
    ],
    bridges: [
      'De la advertencia sobre el significado del temor entraba en la primera definición: no es espanto ni ansiedad, es reverencia ante el Uno y Santo.',
      'Definida la reverencia, la volvía contra su época: el dios domesticado y útil de la posguerra es la negación exacta de esa reverencia, y con ese contraste abría el diagnóstico del pecado del siglo.',
      'Con el diagnóstico puesto, daba el paso lógico final: si el ídolo nace de la autosuficiencia, entonces la sabiduría empieza justo donde esa autosuficiencia termina.'
    ],
    duration: '35 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'keller-servant',
    author: 'Timothy Keller',
    veracity: 'documentado',    title: 'El Siervo sustituto',
    year: 2003,
    place: 'Redeemer Presbyterian Church, Nueva York',
    occasion:
      'Exposición de Isaías 53 ante la elite escéptica de Manhattan: cómo el sufrimiento sustitutivo es el centro del evangelio y la respuesta al dolor.',
    themes: ['Gracia', 'Crisis y prueba'],
    text: 'Isaías 53:5 — "...por sus llagas fuimos nosotros sanados."',
    style:
      'Apologista: empieza con las objeciones del escéptico moderno (¿por qué un sustituto?) y las responde con exégesis y filosofía.',
    impact:
      'Base de su enseñanza sobre el sufrimiento y del evangelio "del pecador sustituido" en el urbanismo cristiano.',
    outline: [
      'El Siervo es despreciado y rechazado: el escándalo del método de Dios.',
      'El sustituto: llevó el castigo que nos da la paz.',
      'El resultado: sanidad, perdón e intercesión perpetua.',
      'La respuesta al sufrimiento: no la explicación, sino el Siervo que sufrió por ti.'
    ],
    quotes: ['"Dios no da una explicación del dolor: da una respuesta en un cuerpo, en la cruz."'],
    preached:
      'En sus exposiciones dominicales en Redeemer Presbyterian Church, Keller predicaba Isaías 53 ante el auditorio escéptico de Manhattan: profesionales para quienes el sufrimiento era el argumento definitivo contra la existencia de Dios. Hablaba sin estridencias: plantaba primero la objeción —¿por qué un sustituto?, ¿no es irracional e incluso inmoral?— y luego la respondía con exégesis y filosofía, en el registro de quien discute con colegas. Los oyentes no recibían una apelación emocional, sino un argumento que tomaba en serio sus dudas, y muchos describían la experiencia como escuchar a alguien respetar su inteligencia mientras la desarmaba. De esa predicación nacieron su enseñanza sobre el dolor y el evangelio del pecador sustituido.',
    introduction:
      'Keller solía abrir nombrando la objeción del escéptico moderno antes de leer el texto: el lenguaje de sustitución le parece a nuestra época injusto e incomprensible. Después situaba a Isaías en su propio siglo —un poema dirigido a oyentes a quienes el Siervo también escandalizaba— y solo entonces desplegaba el cántico del capítulo 53.',
    phrases: [
      '«La objeción moderna no es contra la sustitución: es contra la gratuidad»: la sentencia con que invierte el ataque del escéptico.',
      '«Isaías lo escribió siglos antes de la cruz, y aun así describe un cuerpo que llevaba lo mío»: así abre la brecha histórica para la exégesis.',
      '«El sufrimiento no se resuelve con una teoría: se resuelve con una cara»: su fórmula para pasar de la filosofía a la encarnación.',
      '«El escándalo no es que Dios castigue: es que Dios se pone en el lugar del castigo»: la paradoja que deja resonar antes de la aplicación.',
      '«Usted no necesita un manual sobre el dolor: necesita a Alguien que lo cargó»: el giro pastoral del final del argumento.',
      '«Pregunte no por qué sufre, sino por quién sufre»: la reformulación con que devolvía la pregunta a la sala.'
    ],
    bridges: [
      'Después de plantear la objeción filosófica contra el sustituto, Keller abre el poema por el extremo que nadie espera: el Siervo es despreciado y rechazado, y con ese contraste presenta el escándalo del método de Dios.',
      'Una vez aceptado que el Siervo sufrió, el argumento se cierra sobre el porqué: los «por nuestras transgresiones» de Isaías convierten el sufrimiento en sustitución, la clave que el escéptico de Manhattan no anticipaba.',
      'Del mecanismo del sustituto pasa al fruto con la lógica de la consecuencia: sanidad, perdón e intercesión perpetua brotan de las llagas del Siervo, no de los esfuerzos del oyente.',
      'Con el poema completo, Keller regresa a la objeción inicial de la sala: a quien exige una explicación del dolor no se le entrega una teoría, sino un cuerpo traspasado —el Siervo que sufrió por ti.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'keller-two-builders',
    author: 'Timothy Keller',
    veracity: 'documentado',    title: 'Las dos casas',
    year: 2006,
    place: 'Redeemer Presbyterian Church, Nueva York',
    occasion:
      'Sermón sobre Mateo 7:24-27 en su serie sobre el Sermón del Monte: la diferencia entre oír y hacer no es intensidad, sino fundamento.',
    themes: ['Firma y certeza', 'Crisis y prueba'],
    text: 'Mateo 7:24-27 — La parábola del prudente que edificó sobre la roca y del insensato que edificó sobre la arena.',
    style:
      'Expositivo urbano: la construcción de la casa como metáfora de una vida entera; muestra la tormenta como reveladora de fundamento.',
    impact:
      'Se convirtió en su resumen favorito del cristianismo: lo que sostiene la vida cuando llega la tormenta.',
    outline: [
      'Dos casas: mismas tormentas, mismos materiales externos.',
      'La diferencia es el fundamento: roca = oír y hacer; arena = oír y no hacer.',
      'La tormenta no crea el problema: lo revela.',
      'La roca es Cristo y sus palabras: obedecer por gracia, no por miedo.'
    ],
    quotes: [
      '"Las tormentas de la vida no hacen tu casa caer: revelan sobre qué fundamento la edificaste."'
    ],
    preached:
      'En la serie del Sermón del Monte en Redeemer Presbyterian Church, Keller predicaba Mateo 7 ante su congregación habitual de Manhattan: profesionales educados, acostumbrados a evaluar ideas por su solidez, muchos de ellos atravesando tormentas reales —carreras fracturadas, matrimonios en crisis, diagnósticos recientes—. Su voz era expositiva y tranquila, casi de arquitecto: describía las dos casas con detalle y sin prisa, dejando que la imagen trabajara sola. Los oyentes reconocían el escenario urbano, porque en Nueva York todos construyen algo y nadie piensa en el fundamento hasta que la tormenta llega; la reacción era de autoexamen silencioso más que de emoción, con cuadernos llenos. Este sermón se volvió su resumen favorito del cristianismo entero.',
    introduction:
      'Keller solía abrir con una observación urbana: en una ciudad donde todos edifican carreras, reputaciones y seguridad, Jesús termina el Sermón del Monte no con una regla nueva sino con una parábola sobre cimientos. Su primer movimiento advertía que las dos casas eran idénticas por fuera —mismo viento, misma lluvia, misma fachada—: la diferencia no se ve, y por eso nadie la examina.',
    phrases: [
      '«Jesús no dice que la tormenta vendrá si fallas: dice que vendrá cuando llegue»: la corrección con que quita toda falsa seguridad del oyente.',
      '«No es intensidad de devoción, sino profundidad de fundamento»: la antítesis que organiza todo el sermón.',
      '«Oír el sermón sin hacer el sermón es edificar en la arena más cara del mundo»: la aplicación urbana que clava el punto.',
      '«La crisis no pregunta cuánto tenías: pregunta sobre qué estabas parado»: la sentencia con que da vuelta la tormenta en reveladora.',
      '«Todos adoramos algo; la tormenta solo demuestra cuál fue tu dios»: el puente hacia la idolatría del corazón, su terreno favorito.'
    ],
    bridges: [
      'Desde la advertencia de Jesús contra los que solo dicen «Señor, Señor», Keller pasa a la imagen: dos casas alzadas sobre dos terrenos, mismas tormentas, mismos materiales externos, de modo que el oyente todavía no puede distinguirlas.',
      'Entre las casas idénticas y el desenlace entra la única pregunta que importa —¿qué hay debajo?—, y con ella nombra la diferencia: roca es oír y hacer; arena, oír y no hacer; la metáfora se convierte en diagnóstico.',
      'Con la distinción ya establecida, Keller introduce a la tormenta como actriz principal: no viene a crear el derrumbe sino a revelarlo, porque la crisis revela el fundamento que la calma escondía.',
      'Del diagnóstico pasa al nombre: la roca no es una actitud sino Cristo y sus palabras, y obedecerlo por gracia —no por miedo— es el único motivo capaz de sostener una casa entera.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'luther-priesthood',
    author: 'Martín Lutero',
    veracity: 'documentado',    title: 'El sacerdocio de todos los creyentes',
    year: 1520,
    place: 'Wittenberg, Alemania',
    occasion:
      'De los tratados de la Reforma de 1520, predicado y escrito contra la idea de que solo el clérigo tiene acceso a Dios.',
    themes: ['Gracia', 'Santidad'],
    text: '1 Pedro 2:9 — "...vosotros sois linaje escogido, real sacerdocio, nación santa."',
    style:
      'Firmeza polemista y calorosa pastoral: cada creyente es sacerdote, rey y profeta por su bautismo en Cristo.',
    impact:
      'Base de la eclesiología protestante: el sacerdocio universal cambió la historia de la Iglesia.',
    outline: [
      'Cada cristiano es sacerdote: tiene acceso directo a Dios por la sangre de Cristo.',
      'Cada cristiano es rey: reina con Cristo sobre el pecado y la muerte.',
      'El oficio no es la casta: el ministerio sirve, no sustituye a la gracia.'
    ],
    quotes: [
      '"No hay muros entre el creyente y Dios: solo la gloria de Cristo en medio, y esa no separa, une."'
    ],
    preached:
      'En 1520 Lutero era en Wittenberg un predicador constante: ocupaba el púlpito de la iglesia de la ciudad y la cátedra de la universidad, y predicaba en alemán a burgueses, estudiantes, monjes y artesanos. Los escritos de la Reforma de ese año, entre ellos la doctrina del sacerdocio universal, nacieron de esa predicación y de la polémica con Roma, y circularon después impresos en numerosas ediciones. Según los relatos, hablaba con firmeza de polemista, pero siempre con calor pastoral, alternando la sentencia cortante con la consolación dirigida al creyente común. Se conserva la idea de que las autoridades consideraban peligrosas sus palabras contra la casta clerical, mientras el pueblo las acogía como una liberación. Su tempo era rápido, con repeticiones que martillaban una misma verdad.',
    introduction:
      'Lutero abrió con la lógica del bautismo: lo que el cristiano es no depende de su oficio, sino de la sangre de Cristo. Antes de entrar al texto, desmontó la idea del acceso reservado preguntando al oyente si su bautismo era verdad o una formalidad vacía.',
    phrases: [
      'La tríada bautismal: sacerdote, rey y profeta: sirvió de esquema del discurso, repitiendo cada título para cada condición del creyente.',
      'La antítesis del oficio y la casta: el ministerio sirve, no sustituye: separó la función humana del privilegio pretendidamente divino.',
      'La sentencia de libertad: «tienes derecho de entrar libremente donde tu Padre está»: dirigía la doctrina a la conciencia del creyente temeroso.',
      'La imagen del muro derribado: el velo del templo rasgado como abolición de todo acceso reservado a unos pocos.',
      'El tono de manifiesto con pastoral: alternaba la proclamación pública contra Roma con el «tú» que consuela al ánimo atribulado.'
    ],
    bridges: [
      'De la pregunta sobre el bautismo pasó al primer punto afirmando el acceso directo: cada cristiano es sacerdote por la sangre de Cristo. La imagen del muro derribado sostuvo la transición del oficio al derecho del creyente.',
      'Del sacerdocio saltó al reinado por extensión del mismo título: si el cristiano entra libremente, también reina con Cristo sobre el pecado y la muerte. El paralelismo de los tres títulos encadenó el segundo punto.',
      'El tercer punto entró por vía de corrección: negar que la abolición de la casta elimine el oficio del ministerio. Contrapuso la casta al servicio, mostrando que el ministerio existe para la gracia y no en su lugar.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'calvino-prayer',
    author: 'Juan Calvino',
    veracity: 'documentado',    title: 'Cómo orar correctamente',
    year: 1550,
    place: 'St. Pierre, Ginebra',
    occasion:
      'Exposición del Padrenuestro en su predicación continua del Evangelio: la oración como "el principal ejercicio de la fe".',
    themes: ['Oración'],
    text: 'Mateo 6:9 — "Vosotros oraréis así: Padre nuestro que estás en los cielos."',
    style:
      'Sobrio y pastoral: recorre las peticiones del Padrenuestro como mapa de toda la vida de oración, con reglas prácticas.',
    impact:
      'Su capítulo sobre la oración en la Institución nació de esta predicación: cimiento del culto reformado.',
    outline: [
      'La oración es el principal ejercicio de la fe y el trato diario con el Padre.',
      'Las seis peticiones ordenan el corazón: primero la gloria de Dios, luego nuestro bien.',
      'Reglas: orar con reverencia, con necesidad sentida, con esperanza y en el nombre de Cristo.'
    ],
    quotes: ['"Sin oración la fe es un candelero sin aceite: la luz del corazón se apaga."'],
    preached:
      'En la Ginebra de 1550 Calvino predicaba a diario: entre semana, al alba, en San Pedro, ante ciudadanos y refugiados de toda Europa. Se conserva la costumbre de que el pueblo traía consigo las Biblias y tomaba notas; los transcriptores copiaban sus palabras casi al pie de la letra. Hablaba sin notas, con voz clara y tempo mesurado, marcando las peticiones del padrenuestro con pausas, como quien recorre un mapa. Los oyentes escuchaban con la atención propia de una iglesia disciplinada, aunque se sabe que las guerras, la peste y el exilio encendían a veces la emoción colectiva. Cuando aplicaba una regla práctica, descendía al caso concreto del artesano, del enfermo o del comerciante, para que la doctrina tocara la semana y no solo el domingo.',
    introduction:
      'Calvino abría con la sentencia que repetiría a lo largo del sermón: la oración es el principal ejercicio de la fe, el trato diario del alma con el Padre. Su primer movimiento retórico fue ordenar: antes de las palabras del texto, situó al orante delante de Dios como un hijo que entra en la casa del padre.',
    phrases: [
      'La definición filial: orar es «conversar con el Padre»: recortó la oración de todo ceremonial para dejarla en trato de hijo con su padre.',
      'La regla de la necesidad sentida: no se puede orar de palabra lo que el corazón no siente: formuló como condición del corazón lo que otros enseñaban como técnica.',
      'La regla del nombre de Cristo: nada se alcanza si no se pide en él: cerró el acceso a toda oración fuera del Mediador.',
      'El orden de las peticiones como índice: primero la gloria de Dios, luego el pan, el perdón y la guarda: hizo del padrenuestro un mapa de toda la vida cristiana.',
      'La apelación al «nuestro»: la oración nunca es solitaria: corrigió el individualismo dirigiendo al oyente hacia el cuerpo de la Iglesia.'
    ],
    bridges: [
      'Del lema inicial pasó al primer punto afirmando que la oración es el aliento de la fe: sin ella, el creyente se ahoga. La imagen del aliento movió la doctrina al hábito cotidiano del oyente.',
      'Al segundo punto entró con el método de recorrido: leyó las seis peticiones como itinerario que ordena el corazón. La gradación —primero la gloria de Dios, después el bien del hombre— sostuvo la transición.',
      'Para la parte final cambió el registro de la doctrina a las reglas: presentó las condiciones de la oración con la forma de un catecismo. La enumeración —reverencia, necesidad sentida, esperanza, nombre de Cristo— cerró el sermón como manual de uso.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'calvino-cross',
    author: 'Juan Calvino',
    veracity: 'documentado',    title: 'La cruz y la disciplina del Señor',
    year: 1552,
    place: 'St. Pierre, Ginebra',
    occasion:
      'Predicó el consuelo de la cruz a una comunidad de refugiados perseguidos: la tribulación como instrumento de la paternidad de Dios.',
    themes: ['Crisis y prueba', 'Firma y certeza'],
    text: 'Hebreos 12:6 — "...a quien ama el Señor, lo disciplina; azota a todo el que recibe por hijo."',
    style:
      'Sobrio y pastoral: la cruz del cristiano como escuela de obediencia, con consuelo en la providencia.',
    impact:
      'Su capítulo "El consuelo de la cruz" en la Institución brotó de esta predicación a los perseguidos.',
    outline: [
      'La cruz no castiga al creyente: lo forma como hijo.',
      'El padecimiento doma la presunción y despierta la oración.',
      'El consuelo: el padecer con Cristo es camino a la gloria con él.'
    ],
    quotes: [
      '"El que lleva su cruz con Cristo, nunca la lleva solo: el que la cargó primero la sostiene."'
    ],
    preached:
      'Calvino predicó esta doctrina en San Pedro de Ginebra a una congregación afluente de refugiados: hombres y mujeres que habían dejado casa, bienes y familiares por el Evangelio, muchos llegados de Francia tras las persecuciones. Se conserva la práctica de la predicación extemporánea sin notas, tomada al pie de la letra por transcriptores; según los relatos, los atribulados pedían que se les repitieran estas enseñanzas en la visita pastoral. Su voz era sobria, sin declamación: la fuerza estaba en la lógica del consuelo, no en el gesto. El tempo se volvía más lento en las aplicaciones, cuando se detenía en el detalle del padecimiento concreto de un artesano o de una madre exiliada. El tono pastoral convertía la doctrina de la providencia en ternura con autoridad.',
    introduction:
      'Calvino abrió corrigiendo una idea común: la aflicción no es señal de rechazo divino sino de filiación. Su primer movimiento retórico fue leer el texto de Hebreos y girarlo contra la lectura del oyente que se sentía castigado en su propio sufrimiento.',
    phrases: [
      'La corrección inicial: la cruz no castiga, disciplina: deshizo la lectura del sufrimiento como venganza antes de construirla como pedagogía del Padre.',
      'La imagen de la escuela: el cristiano es alumno del Padre: volvió la doctrina oficio de aprendizaje y no sentencia de condena.',
      'La antítesis de la presunción y la oración: lo que la prosperidad inflama, la tribulación lo doma: contrapuso dos frutos del mismo padecer.',
      'La apelación a la experiencia común: todos reconocen en la aflicción lo que la prosperidad esconde: acercó la doctrina al caso concreto del oyente.',
      'El sello de la filiación: «todo el que recibe por hijo»: repitió el giro del texto hasta que el oyente lo oyó como consuelo y no como amenaza.'
    ],
    bridges: [
      'De la corrección inicial pasó al primer punto por el argumento de la filiación: si el Señor disciplina a los que ama, la cruz es marca de hijo y no de castigo. La lectura contraria del texto sirvió de bisagra.',
      'Del título de hijo saltó al efecto del padecimiento con la antítesis: lo que la prosperidad inflama, la tribulación lo doma. La imagen de la presunción derribada abrió el segundo punto.',
      'El consuelo final entró con cambio de horizonte: del efecto interior de la cruz al destino del que la comparte con Cristo. La promesa de la gloria cerró el sermón girando del presente del padecer al futuro compartido.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'agustin-pastors',
    author: 'Agustín de Hipona',
    veracity: 'documentado',    title: 'Sobre los pastores',
    year: 423,
    place: 'Hipona, África romana',
    occasion:
      'Sermón a los obispos y clérigos reunidos sobre Ezequiel 34: el pastor que se apacienta a sí mismo y el que apacienta el rebaño.',
    themes: ['Santidad', 'Penitencia'],
    text: 'Ezequiel 34:2 — "¡Ay de los pastores de Israel que se apacientan a sí mismos! ¿No deberían los pastores apacentar los rebaños?"',
    style:
      'Confesional y valiente: el obispo se incluye entre los acusados; retórica luminosa aplicada al corazón del líder.',
    impact:
      'Textura fundacional de la pastoral cristiana: se lee en los concilios y en la formación pastoral hasta hoy.',
    outline: [
      'El pastor que se apacienta: bebe la leche del rebaño, se viste con su lana.',
      'El pastor que apacienta: fortalece al débil, sana al enfermo, busca el perdido.',
      'El juicio del Buen Pastor: la medida del pastor es el cuidado, no el provecho.'
    ],
    quotes: ['"El rebaño no es del pastor: es del Señor; el pastor es siervo, no dueño."'],
    preached:
      'Agustín era ya obispo anciano cuando predicó sobre Ezequiel 34 a obispos y clérigos reunidos: según la tradición, en una asamblea eclesiástica donde los propios pastores eran los oyentes y él se contaba entre ellos. El auditorio estaba formado por colegas del episcopado africano, hombres acostumbrados a predicar y ahora llamados a escuchar juicio. Probablemente conservó su tono confesional: primero se incluyó a sí mismo entre los acusados, y solo después alzó la voz contra el abuso. Su estilo envejecido era más grave que el de sus años mozos, pero la retórica seguía luminosa: antítesis, preguntas, imágenes tomadas del propio rebaño. Se sabe que este texto se leyó luego en los concilios africanos como espejo de obispos, y su fuerza venía de que el acusador se había juzgado primero a sí mismo.',
    introduction:
      'Agustín abrió leyendo la amenaza de Ezequiel y aplicándola antes de explicarla: dijo a los obispos que la profecía los nombraba a ellos primero. Su primer movimiento fue confesional: contó que él mismo, al leer el texto, se sintió sorprendido como uno de los pastores juzgados.',
    phrases: [
      'La confesión inicial del acusado: «yo también soy pastor»: colocó al predicador dentro del grupo juzgado y desarmó la defensiva del auditorio.',
      'La imagen del abuso doméstico: beber la leche del rebaño y vestirse con su lana: hizo visible la explotación con las metáforas del propio texto.',
      'La lista de oficios del buen pastor: fortalecer al débil, sanar al enfermo, buscar el perdido: acumulación tomada de Ezequiel como examen de conciencia.',
      'La pregunta retórica al colega: «¿qué buscas del rebaño, su bien o el tuyo?»: interrogó al obispo como a un administrador ante su auditor.',
      'El contraste de provecho y cuidado: la medida del pastor no es lo que recibe sino lo que sostiene: antítesis final que cerró la exhortación.'
    ],
    bridges: [
      'De la confesión inicial pasó al primer punto describiendo al pastor que se apacienta: bebe la leche del rebaño y se viste con su lana. La imagen de la explotación doméstica sostuvo la transición del juicio general al retrato concreto.',
      'Del retrato negativo saltó al positivo por contraste: el pastor verdadero fortalece, sana y busca. La enumeración de Ezequiel sirvió de espejo opuesto al abuso descrito antes.',
      'El último punto se abrió por vía de juicio: el Buen Pastor medirá el cuidado y no el provecho. La sentencia final devolvió la profecía a sus oyentes como examen de cara al propio oficio.'
    ],
    duration: '30 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'chrysostom-paul',
    author: 'Juan Crisóstomo',
    veracity: 'documentado',    title: 'Elogio de San Pablo',
    year: 398,
    place: 'Antioquía, Siria',
    occasion:
      'Su homilía más celebrada, predicada al celebrarse la memoria del apóstol: una biografía elocuente del Pablo que fue y del que llegó a ser.',
    themes: ['Gracia', 'Arrepentimiento'],
    text: '2 Timoteo 4:7 — "He combatido el buen combate, he acabado la carrera, he guardado la fe."',
    style:
      'Retórica ascendente: retrato vivo del apóstol, elocuencia contagiosa, exégesis moral y calorosa.',
    impact:
      'Modelo del "elogio sagrado" y de la pastoral de la gracia sobre el perseguidor convertido.',
    outline: [
      'Quién fue: perseguidor, fariseo, orgullosamente perfecto.',
      'Qué alcanzó: la gracia lo derribó y lo levantó apóstol de las naciones.',
      'Cómo terminó: en cadenas, pero más libre que César.',
      'La lección: nadie está más allá de la gracia que llama.'
    ],
    quotes: ['"Nada es tan poderoso como el discípulo que ama: ni Roma, ni el hierro, ni el mar."'],
    preached:
      'Crisóstomo predicó este elogio en Antioquía con ocasión de la memoria del apóstol, según su costumbre de que la catedral se llenara hasta desbordar: se conserva que el pueblo, educado en sus homilías, interrumpía con aplausos, y él respondía corrigiendo esas manifestaciones con humor. Su voz era legendaria por su intensidad —de ahí el nombre de «boca de oro»—, con tempos que alternaban el relato apresurado con la pausa que clavaba la sentencia. El auditorio escuchó una biografía completa: el perseguidor caído, el apóstol levantado, el prisionero más libre que César. Según los relatos, se conmovía al retratar el final del apóstol, y el pueblo lloraba con él. La elocuencia era contagiosa: los oyentes repetían las frases en las plazas después del culto.',
    introduction:
      'Crisóstomo abrió con la sentencia del texto paulino sobre el combate y la carrera, y enseguida confesó la incapacidad de su boca: el primer movimiento retórico fue el elogio por disculpa, proclamar que ninguna lengua basta para alabar al apóstol.',
    phrases: [
      'El retrato por contraste: perseguidor, luego predicador; orgullo, luego humildad: cada etapa de la vida de Pablo se contó como inversión de la anterior.',
      'La disculpa de la elocuencia: «¿qué lengua, qué boca bastará?»: fórmula del encomio antiguo que enaltecía al sujeto rebajando al orador.',
      'La imagen del rayo: la luz que derribó al perseguidor en el camino: convirtió la conversión en escena bélica invertida por el cielo.',
      'La paradoja de las cadenas: en la cárcel, más libre que César: antítesis que elevó el final de la biografía por encima del poder imperial.',
      'La apelación final al oyente: «tú, que te crees incapaz, mira al que decía lo mismo»: cerró el elogio girándolo hacia la vida del auditorio.'
    ],
    bridges: [
      'De la disculpa elocutiva pasó al primer retrato mostrando lo que Pablo fue: perseguidor, fariseo, orgulloso de su perfección. La acumulación de títulos negativos preparó el abismo del que la gracia lo levantaría.',
      'Del retrato del perseguidor saltó al apóstol por el vértice de la conversión: el rayo derribó y levantó al mismo tiempo. La imagen de la luz sirvió de bisagra entre la caída y la misión a las naciones.',
      'Del apóstol en marcha pasó al prisionero en cadenas por contraste: más encadenado que nunca, más libre que el emperador. La antítesis entre Roma y la cárcel sostuvo el tránsito al final de la biografía.',
      'Para la lección final salió de la biografía hacia el oyente: si la gracia derribó al perseguidor, nadie queda fuera de su alcance. La aplicación giró el elogio del santo hacia la esperanza del pecador que escuchaba.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'whitefield-newbirth',
    author: 'George Whitefield',
    veracity: 'documentado',    title: 'El nuevo nacimiento',
    year: 1739,
    place: 'Moorfields, Londres (al aire libre)',
    occasion:
      'Su sermón distintivo, predico al aire libre a miles que jamás habían pisado una iglesia: "debes nacer de nuevo" frente a la religión de costumbre.',
    themes: ['Evangelismo', 'Arrepentimiento'],
    text: 'Juan 3:3 — "...el que no naciere de nuevo, no puede ver el reino de Dios."',
    style:
      'Teatral y apurado: dirección directa al oyente, imágenes de nacimiento y oscuridad, urgencia de decidir.',
    impact:
      'Uno de los sermones más repetidos del avivamiento; marcó el vocabulario del nuevo nacimiento en el mundo angloparlante.',
    outline: [
      'No naces cristiano: la religión de costumbre no salva.',
      'El nuevo nacimiento es obra del Espíritu, no de la reforma moral.',
      'Las señales: nuevo corazón, nuevo amo, nuevo afecto.',
      'La urgencia: "no puedes ver el reino" sin él.'
    ],
    quotes: ['"La religión de tu familia no te salva: debes nacer de nuevo por ti mismo."'],
    preached:
      'Predicado en Moorfields, Londres, en 1739, al aire libre, ante miles de oyentes que según los relatos jamás habían pisado una iglesia: laceros, aprendices, soldados y muchedumbre de los arrabales. Whitefield estaba en su máxima potencia vocal y teatral: gesticulaba, imitaba voces, dibujaba escenas con el cuerpo, alternaba el susurro con el grito, y su voz, extraordinariamente proyectada, se decía audible a distancia asombrosa. La multitud respondía con llantos, exclamaciones y alboroto; algunos cronistas describieron blancos ojos de mil pares en el crepúsculo. Su señal repetida, "debes nacer de nuevo", se volvió el grito del avivamiento en todo el mundo angloparlante.',
    introduction:
      'Abre con Juan 3:3 y de inmediato pone en escena al oyente del texto: Nicodemo, doctor religioso, maestro de Israel, que fue a Jesús de noche. Su primer movimiento retórico es proyectar ese caso sobre la multitud con una pregunta personal: si un hombre tan religioso necesitaba nacer de nuevo, ¿qué hace tu religión de costumbre por ti? Con ello convierte la escena en espejo y exige respuesta.',
    phrases: [
      '"debes nacer de nuevo": su grito distintivo, repetido con variaciones a lo largo de la predicación como clavo donde todo se cuelga.',
      'Nicodemo yendo de noche: usa la imagen del nocturno visitante para pintar la religión que busca a Jesús sin dejar de ser de sí misma.',
      'el bautismo no basta: ataca la seguridad sacramental de la costumbre con una negación frontal.',
      'un nuevo corazón, un nuevo amo, un nuevo afecto: despliega la tríada de señales en anáfora, lista para el repaso.',
      '¿has nacido tú?: devuelve la doctrina al oyente en pregunta corta, cortante, sin apelación a la teología.'
    ],
    bridges: [
      'De la introducción al primer punto entra por el contraste entre cuna y Espíritu: si el propio Nicodemo no nació cristiano, tampoco nace cristiano ningún hijo de familia piadosa; la religión heredada no salva.',
      'Al segundo punto entra distinguiendo: la reforma moral solo lava por fuera, como quien limpia la tumba; el nuevo nacimiento es obra del Espíritu, nueva creación, y no simple corrección de costumbres.',
      'Al tercer punto entra por repaso acumulativo: para que el oyente reconozca la obra, enumera las señales con la anáfora de lo nuevo: nuevo corazón, nuevo amo, nuevo afecto, una tras otra como testigos.',
      'Cierra con apelación directa y urgente: abandona la descripción y señala al oyente con la amenaza amorosa del texto, no puedes ver el reino de Dios sin nacer de nuevo, dejando la multitud sin salida y con una decisión que tomar hoy.'
    ],
    duration: '50 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'wesley-circumcision',
    author: 'John Wesley',
    veracity: 'documentado',    title: 'La circuncisión del corazón',
    year: 1733,
    place: 'Oxford, Inglaterra',
    occasion:
      'Su primer sermón importante, predicado en la Universidad de Oxford: la religión verdadera es del corazón, no de la norma externa.',
    themes: ['Santidad', 'Arrepentimiento'],
    text: 'Romanos 2:29 — "...la circuncisión es la del corazón, en espíritu, y no en letra."',
    style:
      'Precisión analítica y tono teológico: define la religión del corazón por sus marcas —humildad, fe, esperanza y amor—, con llamada final a la santidad.',
    impact: 'Sermon 17 de sus Sermones estándar; cimiento de la santidad metodista.',
    outline: [
      'No es la señal externa: la piedad exterior puede estar muerta.',
      'Es humildad: el corazón que se abate ante Dios.',
      'Es fe y esperanza: confía en el único Redentor.',
      'Es amor: el amor a Dios que expulsa el pecado y llena el alma.'
    ],
    quotes: ['"La religión del corazón no es obra de un día: es la gracia que se vive cada hora."'],
    preached:
      'Predicado en Oxford en 1733, ante la Universidad, en su primer sermón importante: Wesley, joven don y sacerdote anglicano, se dirigió a estudiantes y clérigos en el tono escolástico y ordenado que la casa exigía, sin clamor y sin anécdotas. Leyó con la dicción cuidada de un académico, desplegando definiciones y distinciones con paso lento y seguro. La audiencia universitaria, formada en la religión de la norma externa, escuchó una conferencia que poco a poco se volvió espejo: la piedad exterior, tan visible en Oxford, podía estar muerta. Según los relatos, el sermón pasó a ser el decimoséptimo de sus Sermones estándar y cimiento de la santidad metodista.',
    introduction:
      'Abre con Romanos 2:29 y recupera el argumento de Pablo contra el judío que confiaba en la señal: la alabanza no viene de la letra, sino de lo que Dios hace en el espíritu. Su primer movimiento es traducir ese contraste antiguo al mundo de sus oyentes: toda religión de norma externa, sea señal o costumbre universitaria, está bajo el mismo juicio; solo la del corazón cuenta.',
    phrases: [
      '"en espíritu, y no en letra": toma la fórmula paulina como tijera con que separar en cada caso lo externo de lo real.',
      'la religión del corazón: su categoría central, repetida como título de todas las marcas que irá enumerando.',
      'la piedad exterior puede estar muerta: advierte con sobriedad que la señal visible no garantiza vida interior.',
      'la humildad es el cimiento: ordena las marcas del corazón circuncidado partiendo de la más baja y necesaria.',
      'el amor expulsa el pecado y llena el alma: cierra la escalera de las marcas con la antítesis de expulsión y llenura.',
      'la alabanza que viene de Dios: usa la conclusión del versículo para apuntar la recompensa al fin, no al principio.'
    ],
    bridges: [
      'De la introducción al primer punto entra por contraste entre letra y espíritu: la señal externa, como la circuncisión judía, puede acompañar un corazón muerto; el repaso del ejemplo de Pablo funda la primera negación.',
      'Al segundo punto entra por gradación: si lo externo no basta, ¿por dónde empieza lo interno? Por el escalón primero y más bajo, la humildad, el corazón que se abate ante Dios, sin la cual nada más se edifica.',
      'Al tercer punto continúa la escalera: del corazón abatido pasa al corazón que confía y espera, la fe y la esperanza puestas en el único Redentor, encadenando las marcas una tras otra como peldaños.',
      'Cierra con el clímax y la llamada final a la santidad: la cima de la escalera es el amor a Dios, que expulsa el pecado y llena el alma, y sobre esa cima invita al oyente a la gracia que se vive cada hora.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'bossuet-ambition',
    author: 'Jacques-Bénigne Bossuet',
    veracity: 'documentado',    title: 'Sermón sobre la ambición',
    year: 1662,
    place: 'Capilla real, París',
    occasion:
      'Predicó ante la corte de Luis XIV contra la ambición: el sermón más célebre de su carrera temprana, valiente ante el poder que lo escuchaba.',
    themes: ['Santidad', 'Muerte y eternidad'],
    text: 'Marcos 9:35 — "Si alguno quiere ser el primero, será el último de todos, y el servidor de todos."',
    style:
      'Oratoria clásica francesa: gradación grave, antítesis poder/vanidad, valentía al predicar contra el príncipe.',
    impact: 'Lo lanzó a la fama en la corte y definió su coraje como predicador de reyes.',
    outline: [
      'La ambición: un hambre que crece al alimentarse.',
      'La grandeza según el mundo: poseer y ser visto; según Cristo: servir y pasar.',
      'La verdad: el primero es el que sirve; el que exalta su alma, será abatido.'
    ],
    quotes: [
      '"La ambición sube por una escalera que se desploma: solo la humildad edifica en roca."'
    ],
    preached:
      'Bossuet era aún un orador joven cuando predicó ante la corte de Luis XIV contra la ambición, y según los relatos el sermón lo lanzó a la fama en París y en los salones del reino. El auditorio era el más peligroso de Francia: el rey, la reina madre, los grandes del reino, todos señalados por la ambición que el predicador iba a desenmascarar. Hablaba con la cadencia clásica francesa, períodos largos que caían en sentencia, sin grito y sin miedo; se conserva la tradición de que los cortesanos se sentían descritos uno por uno y no podían apartar la mirada. Su voz grave y su pulso firme daban a cada antítesis el peso de un fallo judicial. El joven orador predicó al poder sin pedirle permiso, y ese coraje definió su carrera.',
    introduction:
      'Bossuet abrió con el texto de Marcos sobre el que quiere ser el primero, y lo volvió inmediatamente contra el auditorio de príncipes. Su primer movimiento retórico fue el diagnóstico: antes de condenar, describió la ambición como una enfermedad que los mismos oyentes reconocerían en sí mismos.',
    phrases: [
      'La imagen del hambre que crece al alimentarse: definió la ambición con una paradoja fisiológica que el auditorio reconoció como propia.',
      'La antítesis de las dos grandezas: poseer y ser visto, contra servir y pasar: opuso la definición del mundo a la definición de Cristo en un solo movimiento.',
      'La sentencia invertida: el primero es el que sirve: giró la palabra del Evangelio hacia la corte como espejo que nadie podía esquivar.',
      'La apóstrofe directa a los grandes: «¿qué buscas al subir, el mando o el bien?»: interrogó al príncipe sin rodeos y sin nombrar a nadie.',
      'La gradación grave del período clásico: frases largas que caen en golpe final: técnica de la oratoria sacra francesa que daba autoridad de fallo a cada tesis.'
    ],
    bridges: [
      'Del diagnóstico pasó al primer punto profundizando la paradoja: la ambición se agranda al comerse a sí misma. La imagen del hambre creciente sostuvo la transición del retrato general al mecanismo íntimo del vicio.',
      'Del mecanismo interno saltó a la comparación de las dos grandezas por antítesis: lo que el mundo llama grandeza, Cristo lo llama servicio. La palabra de Marcos sirvió de bisagra entre el análisis y el juicio.',
      'El punto final se abrió como sentencia: el primero es el que sirve, y el que exalta su alma será abatido. El fallo final cayó sobre la corte con peso de veredicto, dejando el texto del Evangelio como ley pronunciada.'
    ],
    duration: '55 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'graham-second-coming',
    author: 'Billy Graham',
    veracity: 'documentado',    title: 'La segunda venida de Cristo',
    year: 1962,
    place: 'Cruzada de São Paulo y Buenos Aires',
    occasion:
      'Predicó la esperanza del regreso de Cristo en las cruzadas sudamericanas ante multitudes que llenaban estadios.',
    themes: ['Muerte y eternidad', 'Evangelismo'],
    text: 'Juan 14:3 — "...vendré otra vez, y os tomaré a mí mismo, para que donde yo estoy, vosotros estéis también."',
    style:
      'Evangelismo claro: la esperanza del regreso como consuelo y llamada; final siempre apuntaba a la decisión presente.',
    impact: 'Uno de sus temas más repetidos en más de 400 cruzadas en el mundo.',
    outline: [
      'Él viene: la promesa personal del propio Jesús.',
      'No sabemos el día: por eso la vigilancia y la pureza.',
      'El consuelo: los que duermen en Cristo resucitan primero.',
      'La decisión: estar listo no es saber la fecha, es conocer al Señor.'
    ],
    quotes: [
      '"El hecho de que Cristo venga otra vez es la gran esperanza del creyente y la gran pregunta del no creyente: ¿estás listo?"'
    ],
    preached:
      'En las cruzadas sudamericanas, ante estadios repletos como los de São Paulo y Buenos Aires, Graham predicaba la segunda venida de Cristo a la vez como esperanza y como advertencia. Subía al púlpito después de los coros gigantescos y hablaba con su voz clara del sur de Estados Unidos, traducida al portugués y al español para multitudes que lo escuchaban en su propia lengua. Describía la venida con imágenes sencillas —nubes, trompetas, una separación visible en el cielo— y los estadios respondían con el silencio solemne de quien oye hablar de su propia eternidad. Al cierre, el llamado llegaba más apurado que nunca: si Cristo viene, ¿estás listo? Fue uno de sus temas más repetidos a lo largo de más de cuatrocientas cruzadas.',
    introduction:
      'Graham solía abrir recordando la última promesa del libro de Dios: «Ciertamente vengo prestamente», y preguntaba al estadio si creía que Cristo podía volver. Su primer movimiento retórico era demostrar que el regreso no es una leyenda de la iglesia sino una promesa pronunciada por labios del propio Jesús, antes de leer Juan 14:3 con la multitud de pie.',
    phrases: [
      '«La Biblia no termina con el hombre subiendo a Dios, sino con Dios bajando a nosotros»: la observación con que encuadraba todo el mensaje.',
      '«El mismo Jesús que se fue, ese mismo vendrá»: la repetición literal del ángel de Hechos con que afianzaba la certeza.',
      '«No pedimos saber la fecha: pedimos estar listos cuando llegue»: la antítesis que separaba la curiosidad de la vigilancia.',
      '«El cielo no es una idea consoladora: es un lugar preparado para gente preparada»: la frase con que hacía concreta la esperanza.',
      '«Si esta noche sonara la última trompeta, ¿qué diría su corazón?»: la pregunta final con que volvía la escatología hacia la conciencia de cada oyente.'
    ],
    bridges: [
      'Después de mostrar que la promesa sale de los labios del propio Jesús, Graham la lee con el estadio en pie: «vendré otra vez» es una promesa personal, no una figura retórica, y con eso abre el primer punto: Él viene.',
      'De la certeza del regreso pasa de inmediato a lo que no sabemos: el día y la hora no nos fueron dados, y esa ignorancia no es castigo sino propósito, de donde nacen la vigilancia y la pureza.',
      'Del llamado a velar entra al consuelo que más apretaba los corazones del estadio: muchos habían perdido seres queridos, y Graham les apunta a la resurrección —los que duermen en Cristo resucitan primero—.',
      'Con la esperanza ya proclamada, apura el único asunto pendiente: la fecha no se puede fijar, pero al Señor sí se le puede conocer; estar listo no es saber cuándo, es saber a quién, y ahí se abre el llamado.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'macarthur-narrow-gate',
    author: 'John MacArthur',
    veracity: 'documentado',    title: 'La puerta estrecha',
    year: 1985,
    place: 'Grace Community Church, Los Ángeles',
    occasion:
      'Exposición de Mateo 7:13-14 en su serie del Sermón del Monte: la confrontación del evangelio fácil con el evangelio de Cristo.',
    themes: ['Evangelismo', 'Firma y certeza'],
    text: 'Mateo 7:13-14 — "Entrad por la puerta estrecha; porque ancha es la puerta, y espacioso el camino que lleva a la perdición."',
    style:
      'Expositivo sin rodeos: doctrina cerrada, confrontación directa de la falsa seguridad religiosa.',
    impact: 'Uno de sus sermones más citados sobre el evangelio verdadero frente al falso.',
    outline: [
      'Dos puertas: la espaciosa del camino popular, la estrecha de Cristo.',
      'Dos caminos: el que pega a la multitud y el que pega al Señor.',
      'Dos multitudes: las que se pierden con la mayoría, las que se salvan contracorriente.',
      'Dos destinos: destrucción y vida.'
    ],
    quotes: [
      '"Cristo no ofrece un destino sin camino: la puerta estrecha y el camino angosto son el mismo Cristo."'
    ],
    preached:
      'En sus predicaciones en el púlpito de Grace Community Church, en Sun Valley, al norte de Los Ángeles, John MacArthur solía abrir la Biblia sobre el atril y recorrer el texto versículo por versículo, sin anécdotas largas ni recursos emotivos. Al exponer Mateo 7:13-14 dentro de su serie sobre el Sermón del Monte, se dirigía a una congregación formada en la Escritura y a oyentes que lo seguían semana tras semana; muchos describían la experiencia como incómoda y liberadora a la vez, porque la falsa seguridad religiosa quedaba al desnudo. Hablaba con voz firme que apenas se elevaba, dejando que la lógica del texto presionara la conciencia; los oyentes reaccionaban con un silencio sobrio y, a menudo, con decisiones de arrepentimiento. La confrontación directa con el evangelio fácil era su sello pastoral.',
    introduction:
      'Este tipo de sermón no comenzaba con humor ni relato personal: MacArthur solía entrar directamente en el flujo del Sermón del Monte, recordando que Jesús cierra su mensaje con una advertencia solemne. Su primer movimiento retórico era plantear la pregunta incomodante de cuántos de los que oyen a Jesús están en realidad perdidos. De ahí pasaba al texto para mostrar que el propio Cristo distingue dos puertas desde el inicio.',
    phrases: [
      '«La palabra clave aquí es entrar: no basta admirar la puerta, hay que pasar por ella», señal con que exigía decisión y no mera aprobación del texto.',
      'En sus predicaciones repetía que «el camino ancho no se ve mal: solo se ve fácil», fórmula que desarmaba la seducción de la multitud.',
      'Preguntaba a la congregación: «¿Por la puerta que estás pasando, o por la puerta que crees que estás pasando?», interrogación con que examinaba la seguridad personal de cada oyente.',
      'Solía advertir que «Jesús no es el abridor de opciones: es la única puerta», frase que cerraba el pluralismo y afirmaba la exclusividad evangélica.',
      'Recordaba que «la estrechez no es crueldad: es misericordia que marca el camino», explicación del carácter pastoral de la advertencia de Cristo.'
    ],
    bridges: [
      'Desde la advertencia contra los falsos profetas de los versículos previos pasaba al contraste de las dos puertas señalando que no todos los que dicen «Señor, Señor» son verdaderos: así introducía la primera distinción del texto.',
      'Una vez abiertas las dos puertas, recorría el trazado de cada una: el contraste entre lo espacioso y lo estrecho servía de puente hacia la segunda pareja de imágenes.',
      'Del camino pasaba a quienes lo recorren, mencionando a la multitud que había seguido a Jesús y confrontándola con la minoría que avanza contracorriente.',
      'El cierre llegaba por la lógica inevitable del contraste: si solo hay dos caminos, solo hay dos destinos, y la advertencia sobre la destrucción conducía al llamado final a entrar por la puerta estrecha.'
    ],
    duration: '45 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'stanley-gods-time',
    author: 'Charles Stanley',
    veracity: 'reconstruido',
    title: 'Confiar en el tiempo de Dios',
    year: 2001,
    place: 'First Baptist Church, Atlanta',
    occasion:
      'Enseñanza a una congregación en tiempos de incertidumbre: la espera no es castigo, es formación.',
    themes: ['Crisis y prueba', 'Oración'],
    text: 'Habacuc 2:3 — "...aunque tardare, espéralo; porque ciertamente vendrá, no tardará."',
    style:
      'Devocional directo: pasos prácticos para esperar con fe, con voz paternal y anclada en la Escritura.',
    impact: 'Mensaje recurrente de In Touch Ministries en tiempos de crisis personal.',
    outline: [
      'El tiempo de Dios no es el nuestro, pero nunca se atrasa.',
      'La espera forma lo que la prisa destruye.',
      'Confiar es obedecer mientras se espera, no solo orar mientras se espera.'
    ],
    quotes: [
      '"Dios nunca llega tarde: llega en el momento en que su gloria y tu bien se abrazan."'
    ],
    preached:
      'En la First Baptist Church de Atlanta, en el marco del programa In Touch que llevaba sus mensajes a millones de hogares, Charles Stanley enseñaba con su tono inconfundible: pausado, pastoral, sin dramatismos. En tiempos de incertidumbre, la congregación y la audiencia televisiva escuchaban a un pastor que no prometía milagros inmediatos, sino formación en la espera; muchos testimonios posteriores lo recuerdan como palabra oportuna para crisis personales. Con la Biblia abierta en Habacuc 2:3, avanzaba por pasos prácticos que cualquier oyente podía retener; su voz sosegada invitaba a respirar hondo y a confiar. La reacción habitual era un consuelo sereno más que una emoción efusiva.',
    introduction:
      'Stanley solía comenzar preguntando a la audiencia por aquello que llevan años pidiendo a Dios sin respuesta aparente. Su primer movimiento retórico era redefinir la espera: no castigo ni abandono, sino formación. Después leía Habacuc 2:3 y planteaba la tesis del mensaje: el reloj de Dios no se equivoca, aunque al hombre le parezca lento.',
    phrases: [
      '«La espera no es interrupción del plan: es parte del plan», máxima con que reeducaba la impaciencia de sus oyentes.',
      '«Dios no trabaja con tu reloj: trabaja con su propósito», fórmula que separaba la agenda humana de la agenda divina.',
      'En sus predicaciones repetía que «lo que Dios hace en ti mientras esperas vale más que lo que estás esperando», frase que volvía el foco del regalo hacia el formador.',
      '«Ora mientras esperas, obedece mientras esperas»: pareado con que resumía la actitud del que confía.',
      'Preguntaba con dulzura: «¿Confías en Dios solo cuando el tiempo corre a tu favor?», interrogación que examinaba la fe real de la audiencia.'
    ],
    bridges: [
      'De la redefinición de la espera pasaba al primer punto comparando los dos relojes: el del hombre mide urgencia y el de Dios mide propósito, y Habacuc 2:3 afirmaba que la visión ciertamente vendrá.',
      'Del contraste entre los dos tiempos entraba al segundo punto con la imagen del alfarero: la prisa rompe la vasija y la espera la moldea, mostrando así qué forma la espera en el creyente.',
      'Para el punto final trasladaba la doctrina a la práctica: si el tiempo pertenece a Dios, la tarea del creyente mientras espera no es desesperar sino obedecer, y de ahí derivaba su definición de la confianza.'
    ],
    duration: '28 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'osteen-i-am',
    author: 'Joel Osteen',
    veracity: 'reconstruido',
    title: 'Yo soy lo que Dios dice que soy',
    year: 2014,
    place: 'Lakewood Church, Houston',
    occasion:
      'Su serie "Yo soy": enseñó a declarar la identidad bíblica sobre la vida, después de las palabras que cada persona se dice a sí misma.',
    themes: ['Anhelos humanos', 'Firma y certeza'],
    text: 'Génesis 1:26-27 — "...creó Dios al hombre a su imagen, a imagen de Dios lo creó."',
    style:
      'Motivacional devocional: aliento simple y afirmaciones de fe repetidas, con la imagen de Dios como identidad.',
    impact: 'Uno de sus mensajes más difundidos en su programa semanal en más de cien países.',
    outline: [
      'Las palabras que dices sobre ti forman el espejo donde te miras.',
      'Dios ya habló: su declaración sobre ti pesa más que la de nadie.',
      'Yo soy: lo que declaras hoy es la semilla de lo que cosechas mañana.'
    ],
    quotes: [
      '"No puedes dibujarte a ti mismo con los comentarios de otros: Dios ya dibujó tu retrato."'
    ],
    preached:
      'En las predicaciones de su serie «Yo soy», en Lakewood Church de Houston, Osteen enseña ante miles de asistentes y millones de televidentes que la identidad se construye con palabras. Con su sonrisa serena y sus pausas calculadas, repite la fórmula que da título a la serie hasta que la congregación la murmura con él y la repite en casa. La enseñanza de 2014, difundida luego en su programa semanal a más de cien países, propone un ejercicio sencillo: reemplazar la autocrítica de cada mañana por lo que Dios ya declaró sobre cada persona desde la creación.',
    introduction:
      'Suele abrir preguntando qué se dice la gente a sí misma en la madrugada, cuando nadie escucha: esas frases que repiten la voz de un padre ausente o de un maestro duro. Su primer movimiento retórico es el espejo: invita a imaginar la imagen que cada uno proyecta y a advertir que fue pintada con palabras ajenas. Después lee Génesis 1:26-27 para reencuadrar la identidad desde el Creador.',
    phrases: [
      '"Yo soy amado, yo soy fuerte, yo soy capaz." Cadena de declaraciones que repite en voz alta con la congregación para entrenar un nuevo vocabulario interior.',
      'La voz de Dios pesa más que la voz de tu pasado. Frase que resume el giro del sermón: la identidad se recibe, no se hereda de las heridas.',
      'Deja de decir lo que no eres y empieza a decir lo que Dios dice que eres. Instrucción paralela que convierte la tesis en un mandato verbal concreto.',
      'Cada «yo soy» es una profecía sobre tu mañana. Advertencia solemne con la que subraya el peso de las palabras que uno mismo pronuncia.',
      'La crítica solo te define si la firmas. Dicho breve con el que exime al oyente de las etiquetas que no ha aceptado.'
    ],
    bridges: [
      'Del inventario de frases privadas pasa al primer punto explicando el recurso del espejo: las palabras que dices sobre ti no describen el rostro, lo fabrican, y por eso forman el espejo donde te miras cada día.',
      'Para introducir el segundo punto contrapone dos testimonios: el del comentario ajeno y el de la declaración divina, mostrando con Génesis 1:26-27 que Dios ya habló y su veredicto pesa más que el de nadie.',
      'Para el cierre convierte la enseñanza en ejercicio: pide a la congregación decir en voz alta los «yo soy» de la fe, porque lo que se declara hoy es la semilla de lo que se cosechará mañana.'
    ],
    duration: '28 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'evans-free',
    author: 'Tony Evans',
    veracity: 'reconstruido',
    title: 'Libres de verdad',
    year: 2010,
    place: 'Oak Cliff Bible Fellowship, Dallas',
    occasion:
      'Predicó la libertad de Cristo a una comunidad urbana marcada por cadenas visibles e invisibles.',
    themes: ['Gracia', 'Anhelos humanos'],
    text: 'Juan 8:36 — "Si el Hijo os libertare, seréis verdaderamente libres."',
    style:
      'Agenda del Reino: lenguaje urbano vivo, imágenes de prisiones y llaves, llamado a la libertad concreta.',
    impact: 'Base de su ministerio urbano de restauración familiar y comunitaria en Dallas.',
    outline: [
      'Hay cadenas que se ven y cadenas que no se ven.',
      'La libertad verdadera no es hacer lo que quieres: es dejar de ser esclavo de lo que no eliges.',
      'El Hijo libera: la autoridad que rompe la cadena pertenece a Cristo.'
    ],
    quotes: [
      '"Libertad no es hacer lo que quieres: es dejar de ser esclavo de lo que no elegiste."'
    ],
    preached:
      'Desde el púlpito de Oak Cliff Bible Fellowship en Dallas, Evans predica la libertad a una comunidad urbana marcada por cadenas visibles e invisibles: adicciones, deudas, historias familiares rotas. Su ritmo docente-confrontativo avanza por definiciones —qué es esclavitud, qué es libertad— y luego golpea con imágenes de celdas y llaves que cualquiera del barrio reconoce. En este mensaje de 2010 se ve su modo característico: tratar al oyente como responsable y no como víctima, y anclar cada liberación en la autoridad del Hijo en lugar de en la fuerza de la voluntad.',
    introduction:
      'Suele abrir con una paradoja que incomoda: personas que celebran su libertad el domingo y vuelven el lunes a la misma celda. Su primer movimiento retórico es distinguir libertad de libertinaje, para que nadie confunda el evangelio con licencia. Solo entonces lee Juan 8:36, y la frase del Hijo queda instalada como la única llave que el resto del sermón desarrollará.',
    phrases: [
      '"Una cadena no necesita ser de hierro: basta con que te hayas acostumbrado a ella." Definición con la que prepara la distinción entre cadenas visibles e invisibles.',
      'La libertad que Cristo da no es permiso: es poder. Frase que cierra la puerta del libertinaje y conserva el rigor moral del mensaje.',
      'El pecado no es tu maestro: es un dueño usurpador. Metáfora jurídica con la que reordena la relación del creyente con su pasado.',
      '"Jesús no vino a mejorar tu celda: vino a abrir la puerta." Imagen carcelaria que condensa el evangelio de Juan 8 en una sola línea memorable.',
      'Si el Hijo tiene la llave, nadie puede declararte preso de nuevo. Afirmación de autoridad con la que sella la seguridad del liberado.'
    ],
    bridges: [
      'Desde la paradoja del domingo feliz y el lunes prisionero, organiza la primera distinción: hay cadenas que se ven en las manos y cadenas que se esconden en los hábitos, y ambas exigen un liberador.',
      'Para el segundo punto confronta la definición moderna de libertad como capricho satisfecho, y la sustituye por la suya: libre es el que dejó de ser esclavo de lo que nunca eligió.',
      'Para el punto final sujeta todo el argumento a la cita ya leída de Juan 8:36: la cadena no se rompe desde adentro ni por esfuerzo, sino por la autoridad del Hijo que tiene la llave.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'cho-dreams',
    author: 'David Yonggi Cho',
    veracity: 'reconstruido',
    title: 'Visiones y sueños',
    year: 1995,
    place: 'Yoido Full Gospel Church, Seúl',
    occasion:
      'Su mensaje más famoso fuera de Corea: enseñó a una congregación de cientos de miles a pedir a Dios visión, no solo alivio.',
    themes: ['Oración', 'Anhelos humanos'],
    text: 'Hechos 2:17 — "...vuestros jóvenes verán visiones, y vuestros ancianos soñarán sueños."',
    style:
      'Oración y fe declarada: de la visión personal a la iglesia entera; enseñanza práctica de escribir y proclamar la visión.',
    impact: 'Formó la visión de discipulado por células en las iglesias de los cinco continentes.',
    outline: [
      'El Espíritu derrama visiones: Dios quiere mostrarte algo antes de hacerlo.',
      'La visión escrita: lo que no se escribe, no se proclama.',
      'La visión se sostiene en oración: el cuarto de oración da luz al sueño.'
    ],
    quotes: ['"Dios no responde a las necesidades: responde a la visión que le pides."'],
    preached:
      'En Yoido Full Gospel Church de Seúl, ante una congregación de cientos de miles, Cho predica su mensaje más famoso fuera de Corea: enseñar a pedir a Dios visión, no solo alivio. Con traducción simultánea para los miles de visitantes extranjeros, avanza como instructor más que como orador: manda tomar notas, pide que cada uno escriba su visión en el papel y la proclame en voz alta. Esta enseñanza de 1995, apoyada en Hechos 2:17 y en el clásico «escribe la visión» de Habacuc, convirtió el sueño personal en disciplina comunitaria para iglesias de los cinco continentes.',
    introduction:
      'Suele abrir distinguiendo entre necesidad y visión: la mayoría ora por resolver el mes, pero Dios espera que se le pida el mapa del futuro. Su primer movimiento retórico es provocar un descontento sagrado, preguntando quién recuerda la última vez que soñó algo tan grande que necesitará a Dios para lograrlo. Después lee Hechos 2:17 para mostrar que soñar no es vanidad juvenil, sino promesa derramada del Espíritu.',
    phrases: [
      '"Escribe la visión." Orden tomada de Habacuc con la que detiene el sermón y convierte a la audiencia en escribiente de su propio futuro.',
      '"Visión sin oración es fantasía; oración sin visión es rutina." Paralelismo con el que ata las dos disciplinas que sostienen todo su ministerio.',
      'Los sueños de Dios siempre son más grandes que tu bolsillo. Frase con la que mide el alcance de un sueño verdadero por su dependencia de Dios.',
      'Tu sueño de hoy es la congregación de mañana. Convicción autobiográfica con la que conecta la visión personal con el crecimiento de la iglesia.',
      'Dios habla primero: muestra el plano antes de construir la casa. Imagen arquitectónica con la que explica por qué el Espíritu derrama visiones antes de la obra.'
    ],
    bridges: [
      'Desde la pregunta que despertó el descontento sagrado, entra al primer punto con Hechos 2:17: el Espíritu derrama visiones porque Dios quiere mostrarte el plano antes de poner manos a la obra.',
      'Para el segundo punto cambia el tono a instrucción práctica: pide bolígrafos y papel, y explica con Habacuc que lo que no se escribe no se proclama, y lo que no se proclama no se sostiene.',
      'Para el punto final ata la visión al lugar que ya enseñó antes: el cuarto de oración es la habitación donde el sueño recibe luz y resistencia, porque la visión que no se ora se seca.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'gebel-campeon',
    author: 'Dante Gebel',
    veracity: 'reconstruido',
    title: 'El campeón',
    year: 2010,
    place: 'River Church, Anaheim',
    occasion:
      'Su charla clásica sobre David y Goliat, convertida en uno de los mensajes más compartidos de la predicación hispana; miles repiten sus frases cada semana.',
    themes: ['Gracia', 'Anhelos humanos'],
    text: '1 Samuel 17:45 — "...tú vienes contra mí con espada y lanza, pero yo vengo a ti en el nombre de Dios de los ejércitos."',
    style:
      'Narrativo-humorístico: la historia narrada como película, con giros de ironía que terminan golpeando el corazón; el "perdedor elegido" otra vez.',
    impact:
      'Convertido en libro y en frase común de la fe hispana; su charla de referencia para una generación.',
    outline: [
      'Nadie cuenta la historia del que pierde: por eso Dios la cuenta.',
      'David no fue al campo a luchar: fue al campo a obedecer.',
      'Goliat era la excusa: el miedo era el verdadero gigante.',
      'El campeón: el que vence no es el más fuerte, es el que va en otro nombre.'
    ],
    quotes: ['"Dios no elige a los que ya son campeones: hace campeones a los que él elige."'],
    preached:
      "En sus predicaciones en River Church de Anaheim, Dante Gebel convertía el púlpito en una pantalla de cine: narraba David y Goliat como si la congregación estuviera viendo la película, con voz de locutor que baja y sube de intensidad, pausas dramáticas y golpes de humor que desarmaban al auditorio. Ante miles de jóvenes y familias de la generación latina, solía abrir con anécdotas personales de fracaso y de 'predicar de rumba' antes de tocar el texto. El relato avanzaba por escenas: el valle de Ela, el gigante que insulta, el padre que olvida a su hijo, hasta que la ironía se volvía silencio y el corazón de los oyentes quedaba descubierto. Cerraba siempre volviendo al valle: el campeón no es el más fuerte, es el que va en otro nombre.",
    introduction:
      'Gebel abría con una escena reconstruible y cercana: la sala de un hogar, un padre viendo el partido, un hijo que espera ser notado, y de ahí saltaba con humor a la pregunta de quién escribe la historia de los que pierden. El primer movimiento retórico era la identificación: hacer que cada oyente se viera en David antes de pronunciar siquiera el nombre del valle de Ela. Solo entonces citaba 1 Samuel 17 con efecto de sorpresa.',
    phrases: [
      '"Nadie cuenta la historia del que pierde": la empleaba como tesis emocional para capturar a los que se sienten marginados del relato de los ganadores.',
      '"El miedo es el verdadero gigante": frase bisagra que trasladaba la batalla del valle al interior del oyente.',
      '"David no fue al campo a luchar: fue al campo a obedecer": la usaba para reorientar el relato desde la hazaña hacia la fidelidad cotidiana.',
      '"Tú vienes con espada y lanza, yo vengo en el nombre": fórmula que sacaba del texto para convertirla en grito de identidad del oyente.',
      '"Goliat era la excusa": la repetía para nombrar los sustitutos con que la gente disfraza sus temores reales.'
    ],
    bridges: [
      'Del prólogo anedótico pasaba al primer punto con la pregunta de quién escribe la historia de los derrotados: si el mundo solo filma a los ganadores, Dios es el único que entrevista al que perdió.',
      'Para el segundo punto, Gebel bajaba del relato épico al detalle humilde del encargo del padre: David buscaba quesos para Jesse, y en ese gesto de obediencia pequeña nacía la grandeza.',
      'Del obediencia al tercer punto entraba con un giro psicológico: el ejército miraba al gigante, pero Gebel forzaba al auditorio a mirarse a sí mismo, porque el miedo vestía armadura ajena.',
      'Al punto final llegaba con la voz baja y el silencio del auditorio: la piedra que vuela en el relato ya no era de David, era la del oyente, y el nombre que la lanzaba decidía todo.'
    ],
    duration: '60 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'witt-seeker',
    author: 'Marcos Witt',
    veracity: 'reconstruido',
    title: 'El adorador que Dios busca',
    year: 2008,
    place: 'Lakewood Español, Houston',
    occasion:
      'Enseñanza sobre Juan 4 en su congregación en español: Dios no busca primero músicos ni voces, busca adoradores.',
    themes: ['Adoración', 'Gracia'],
    text: 'Juan 4:23 — "...el Padre busca a los que le adoren en espíritu y en verdad."',
    style:
      'Adoración didáctica y calorosa: la samaritana como espejo de toda vida; adoración que trasciende el escenario.',
    impact: 'Formó la cultura de adoración en español de una generación de iglesias.',
    outline: [
      'Dios busca adoradores, no espectadores.',
      'En espíritu: desde el corazón, no solo desde los labios.',
      'En verdad: según lo que Dios es, no según lo que conviene sentir.'
    ],
    quotes: ['"Dios no busca la mejor voz: busca el corazón que lo pone en su lugar."'],
    preached:
      'En sus predicaciones en Lakewood Español de Houston, Marcos Witt bajaba del púlpito casi recién salido de cantar, todavía con la cultura de alabanza en el ambiente, y pasaba con naturalidad del escenario a la enseñanza pausada y cálida que lo caracteriza. Ante su congregación hispana, tomaba Juan 4 con calma de maestro: primero pintaba la escena del pozo de Sicar, el mediodía, la sed, la mujer evitada, y luego la vuelta al oyente con esa amabilidad que no confronta sino que invita. Insistía en que Dios no busca primero músicos ni voces —palabra que pesaba en una iglesia llena de cantores—, sino adoradores. La enseñanza terminaba bajando la voz: el Padre sigue buscando, y la pregunta es si alguien lo busca de vuelta.',
    introduction:
      'Witt abría reconociendo el contexto inmediato: acababan de adorar juntos, y él preguntaba en voz alta si aquello fue adoración o solo canción bien ejecutada. El primer movimiento retórico era el espejo: colocar a la congregación frente a la samaritana antes de leer el texto, para que el relato de Juan 4 no se oyera como historia ajena sino como biografía anticipada.',
    phrases: [
      '"Dios busca adoradores, no espectadores": la usaba como contraste fundacional para distinguir asistencia de participación.',
      '"Adorar en espíritu es adorar desde adentro": fórmula didáctica que localizaba el culto en el corazón antes que en los labios.',
      '"En verdad es adorar según lo que Dios es, no según lo que me conviene sentir": la repetía para cortar toda adoración autoindulgente.',
      '"El pozo es el lugar donde Dios pregunta por tu sed": frase que conectaba la escena evangélica con la vida real del oyente.',
      '"La mejor voz no lo impresiona; el corazón rendido sí": la empleaba para desarmar la obsesión ministerial por el talento.'
    ],
    bridges: [
      'De la pregunta inicial sobre si aquello fue adoración pasaba al primer punto con la declaración de Juan 4:23: el verbo buscar del Padre reordena toda la escena y convierte al oyente en objeto de la búsqueda divina.',
      "Para el segundo punto Witt se detenía en la frase 'en espíritu': explicaba que la samaritana quería debatir de lugares de culto, y Jesús la llevaba del templo al corazón.",
      'Del espíritu al tercer punto entraba señalando que el corazón puede adorar sinceramente lo que no es Dios: por eso la medida no es el fervor, sino la verdad de quién es Él.'
    ],
    duration: '40 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'luna-name',
    author: 'Cash Luna',
    veracity: 'reconstruido',
    title: 'El nombre de Jesús',
    year: 2015,
    place: 'Casa de Dios, Guatemala',
    occasion:
      'Sermón sobre la autoridad del nombre de Jesús en sus congresos de poder, con testimonios que sostienen la predicación.',
    themes: ['Poder sobrenatural', 'Oración'],
    text: 'Hechos 4:12 — "...en ningún otro hay salvación, porque no hay otro nombre bajo el cielo dado a los hombres en que podamos ser salvos."',
    style:
      'Fe declarada y adoración: la autoridad del nombre proclamada con expectativa y testimonios reales.',
    impact:
      'Una de sus enseñanzas más difundidas en Latinoamérica y en las congregaciones hispanas de Estados Unidos.',
    outline: [
      'Un nombre sobre todo nombre: la autoridad pertenece a Cristo.',
      'El nombre en la oración: orar en su nombre es orar con su poder.',
      'El nombre en el testimonio: lo que proclamas con fe, Dios lo sostiene.'
    ],
    quotes: ['"Todo lo que pides, pídelo en su nombre: es la única firma válida en el cielo."'],
    preached:
      'En sus predicaciones de los congresos de poder en Casa de Dios, Guatemala, Cash Luna construía el mensaje sobre la autoridad del nombre de Jesús como quien levanta un edificio: cada peldaño de la enseñanza terminaba en proclamación, y cada proclamación en expectativa. Ante miles de personas, solía abrir con testimonios que sostenían la predicación —casos de oraciones respondidas, emergencias resueltas— y de ahí subía a Hechos 4:12 con solemnidad creciente: no hay otro nombre bajo el cielo. Su estilo de fe declarada se oía en la repetición rítmica de frases que la congregación terminaba recitando con él, y la atmósfera de adoración cerraba el círculo: el nombre proclamado era también el nombre adorado.',
    introduction:
      'Luna abría con la pregunta de a qué nombre recurre la gente cuando todo falla: nombres de médicos, de bancos, de influyentes amigos, y los enumeraba con ironía suave hasta dejarlos vacíos. El primer movimiento retórico era el contraste: exponer la impotencia de los nombres humanos para que, cuando pronunciara el Nombre, el auditorio lo oyera por contraste y no por costumbre.',
    phrases: [
      '"El nombre de Jesús no es una palabra: es una autoridad": la empleaba para impedir que la frase se volviera fórmula mágica.',
      '"Orar en su nombre es orar con su poder": fórmula didáctica que explicaba la cláusula final del Padrenuestro.',
      '"Es la única firma válida en el cielo": la usaba como imagen de legitimidad para la oración presentada ante el Padre.',
      '"Cuando lo proclamas, no le pides permiso: lo declaras": frase que distinguía la súplica de la proclamación de fe.',
      '"No hay segundo nombre bajo el cielo": la repetía con solemnidad para cerrar todo relativismo sobre la salvación.'
    ],
    bridges: [
      'De la enumeración de nombres que fallan pasaba al primer punto con Filipenses 2:9-11: Dios exaltó a Cristo y le dio un nombre sobre todo nombre, y por eso la autoridad no se reparte sino que pertenece a Él.',
      'Para el segundo punto Luna bajaba la doctrina a la oración: si toda autoridad le pertenece, entonces orar en su nombre no es añadir una fórmula final, sino presentarse ante el Padre con el respaldo del Hijo.',
      'Del cuarto de oración al tercer punto entraba con la vida pública del creyente: lo que se aprende a declarar en privado se proclama en público, y los testimonios de la congregación venían a demostrar que Dios sostiene lo que su pueblo proclama con fe.'
    ],
    duration: '55 min'
  },
  // ------------------------------------------------------------------ //
  {
    id: 'maldonado-glory',
    author: 'Guillermo Maldonado',
    veracity: 'reconstruido',
    title: 'La gloria de Dios',
    year: 2008,
    place: 'Casa Internacional del Padre (Kingdom City), Houston',
    occasion:
      'Enseñanza central de sus congresos: la gloria como presencia manifiesta de Dios que transforma al que la busca.',
    themes: ['Poder sobrenatural', 'Adoración'],
    text: 'Éxodo 33:18 — "Te ruego que me muestres tu gloria."',
    style:
      'Enseñanza firme y directa: la gloria no es el espectáculo, es la presencia; fe puesta en práctica.',
    impact: 'Una de sus enseñanzas más replicadas en iglesias de Latinoamérica y Estados Unidos.',
    outline: [
      'La gloria es la presencia de Dios manifestada, no una atmósfera fabricada.',
      'Moisés pidió ver la gloria: la intimidad precede al poder.',
      'La gloria transforma: lo que toca, cambia.'
    ],
    quotes: [
      '"No busques la mano de Dios sin buscar su rostro: la gloria empieza en la intimidad."'
    ],
    preached:
      'En sus predicaciones en King Jesus International Church, Guillermo Maldonado combinaba la enseñanza doctrinal firme con el tono autoritario carismático que define su ministerio: instrucciones concretas al auditorio, mandatos de levantarse, de buscar, de no conformarse con la visita de Dios sino con su permanencia. En sus congresos sobre la gloria, solía abrir interrogando la sed del auditorio: cuántos vienen por bendición y cuántos por Presencia. La síntesis editorial de su mensaje gira en torno a Éxodo 33: la gloria no es atmósfera fabricada ni espectáculo, es la Presencia manifiesta que se busca en intimidad y que transforma lo que toca. Predicaba de pie, avanzando por el escenario, con transiciones que ordenaban más que sugerían.',
    introduction:
      'Maldonado abría separando a la audiencia en dos clases con una pregunta directa: ¿quieres la mano de Dios o su rostro? Ese primer movimiento retórico de dicotomía preparaba el terreno de Éxodo 33: Moisés no pidió milagros, pidió ver la gloria, y en esa petición estaba toda la diferencia entre usar a Dios y buscarlo. Antes del texto, solía advertir que lo que venía no era información sino invitación.',
    phrases: [
      '"La gloria no se fabrica: se busca": la empleaba para distinguir la Presencia manifestada de la atmósfera producida por técnicas de culto.',
      '"Moisés no pidió cosas: pidió ver a Dios": fórmula que elevaba la petición del texto sobre toda oración de consumo.',
      '"La intimidad precede al poder": la repetía como ley espiritual que ordena toda su doctrina de la gloria.',
      '"Todo lo que la gloria toca, cambia": frase de síntesis que anticipaba el efecto transformador de la Presencia.',
      '"No te conformes con la visita: busca la permanencia": la usaba para lanzar el desafío final al auditorio de pie.'
    ],
    bridges: [
      'De la dicotomía entre mano y rostro pasaba al primer punto definiendo la materia del mensaje: la gloria es Presencia manifestada, y por eso no se produce con música adecuada ni se explica con teología sola, se busca.',
      'Para el segundo punto Maldonado entraba en Éxodo 33 con Moisés como mapa: el hombre que ya había visto milagros entendió que nada de eso era suficiente, y su petición enseña que el acceso al poder corre por la vía de la intimidad.',
      'Del deseo de ver la gloria al tercer punto llegaba con la advertencia que Dios mismo hizo a Moisés: nadie ve la gloria y sale igual, porque lo que la Presencia toca no permanece intacto, y eso era exactamente lo que él quería para su congregación.'
    ],
    duration: '60 min'
  }
]

export function inspiracionSermones(): InspirationSermon[] {
  return SERMONS
}

export function inspiracionAuthors(): InspirationAuthor[] {
  return AUTHORS
}

export function inspiracionThemes(): readonly string[] {
  return THEMES
}

// --------------------------------------------------------------------------- //
// Búsqueda: insensible a acentos y mayúsculas, multi-palabra (todas deben
// aparecer), con puntaje por campo y recorte de contexto para los resultados.
// --------------------------------------------------------------------------- //
export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

export interface InspirationHit {
  sermon: InspirationSermon
  score: number
  snippet: string
  authorInfo: InspirationAuthor | undefined
}

interface FieldSpec {
  text: string
  weight: number
  label: string
}

const FIELD_SPECS = (sermon: InspirationSermon): FieldSpec[] => [
  { text: sermon.title, weight: 6, label: '' },
  { text: sermon.author, weight: 4, label: '' },
  { text: sermon.themes.join(' '), weight: 3, label: '' },
  { text: sermon.text, weight: 2, label: 'Texto base' },
  { text: sermon.occasion, weight: 2, label: 'Ocasión' },
  { text: sermon.place, weight: 2, label: '' },
  { text: sermon.impact, weight: 2, label: 'Impacto' },
  { text: sermon.preached ?? '', weight: 2, label: 'Predicación' },
  { text: sermon.introduction ?? '', weight: 1, label: 'Introducción' },
  { text: sermon.outline.join(' '), weight: 1, label: 'Estructura' },
  { text: sermon.quotes.join(' '), weight: 1, label: 'Citas' },
  { text: (sermon.phrases ?? []).join(' '), weight: 1, label: 'Frases' },
  { text: (sermon.bridges ?? []).join(' '), weight: 1, label: 'Puentes' },
  { text: sermon.style, weight: 1, label: 'Estilo' }
]

function snippetFrom(sermon: InspirationSermon, words: string[]): string {
  if (!words.length) return sermon.text
  for (const spec of FIELD_SPECS(sermon)) {
    const normalized = normalizeText(spec.text)
    if (!normalized) continue
    const hit = words.findIndex((word) => normalized.includes(word))
    if (hit === -1) continue
    const source = spec.text
    const lower = source.toLowerCase()
    let index = -1
    for (const word of words) {
      const probe = source.toLowerCase().indexOf(word)
      if (probe !== -1) {
        index = probe
        break
      }
      const accentProbe = lower.search(new RegExp(word.replace(/[^a-z0-9]/g, '.{0,1}'), 'i'))
      if (accentProbe !== -1) {
        index = accentProbe
        break
      }
    }
    if (index === -1) {
      return source.slice(0, 160) + (source.length > 160 ? '…' : '')
    }
    const start = Math.max(0, index - 60)
    const end = Math.min(source.length, index + 110)
    return (
      (start > 0 ? '…' : '') + source.slice(start, end).trim() + (end < source.length ? '…' : '')
    )
  }
  return sermon.text.slice(0, 160)
}

export function searchInspiration(query: string, author: string, theme: string): InspirationHit[] {
  const needle = normalizeText(query)
  const words = needle.split(' ').filter(Boolean)
  const hits: InspirationHit[] = []

  for (const sermon of ALL_SERMONS) {
    if (author && sermon.author !== author) continue
    if (theme && !sermon.themes.includes(theme)) continue
    if (!words.length) {
      hits.push({
        sermon,
        score: 0,
        snippet: sermon.text,
        authorInfo: AUTHORS.find((a) => a.name === sermon.author)
      })
      continue
    }
    let score = 0
    for (const spec of FIELD_SPECS(sermon)) {
      const normalized = normalizeText(spec.text)
      if (!normalized) continue
      for (const word of words) {
        if (normalized.includes(word)) score += spec.weight
      }
    }
    if (score === 0) continue
    hits.push({
      sermon,
      score,
      snippet: snippetFrom(sermon, words),
      authorInfo: AUTHORS.find((a) => a.name === sermon.author)
    })
  }

  return hits.sort((a, b) => b.score - a.score || a.sermon.year - b.sermon.year)
}

// --------------------------------------------------------------------------- //
// Catálogo ampliado: semillas compactas que se expanden a fichas completas.
// Los sermones contemporáneos son síntesis editorial de sus mensajes públicos
// (no texto verbatim); los históricos usan títulos y datos reales conocidos.
// --------------------------------------------------------------------------- //
export interface ExtraSeed {
  a: string
  t: string
  y: number
  p: string
  o: string
  x: string
  th: string[]
  ol: string[]
  q: string[]
  i?: string
  g?: string
  ap?: string[]
}

const AUTHOR_BY_ID = new Map<string, InspirationAuthor>(AUTHORS.map((a) => [a.id, a]))

const slugifySeed = (value: string): string =>
  normalizeText(value).replace(/\s+/g, '-').slice(0, 48)

const DURATION_BY_YEAR = (year: number): string =>
  year <= 500 ? '10 min' : year <= 1650 ? '45 min' : '40 min'

function expandSeed(seed: ExtraSeed): InspirationSermon {
  const info = AUTHOR_BY_ID.get(seed.a)
  const bigIdea =
    seed.g ??
    `La gran idea de este mensaje gira alrededor de ${seed.th[0]?.toLowerCase()}: hasta el corazón desde la voz de ${info?.name ?? seed.a}.`
  const application = seed.ap ?? [
    `Lee ${seed.x.split('—')[0].trim()} en tu lengua y compara su escena con la tuya.`,
    `Repite en voz alta la frase central: ${seed.q[0]}`,
    `Elige uno de los puntos de la estructura como eje de tu propia prédica esta semana.`
  ]
  return {
    id: `${seed.a}-${slugifySeed(seed.t)}`,
    title: seed.t,
    author: info?.name ?? seed.a,
    year: seed.y,
    place: seed.p,
    occasion: seed.o,
    themes: seed.th,
    text: seed.x,
    style: info?.style ?? '',
    impact: seed.i ?? `Recogido del púlpito y de los escritos de ${info?.name ?? seed.a}.`,
    outline: seed.ol,
    quotes: seed.q,
    duration: DURATION_BY_YEAR(seed.y),
    bigIdea,
    application
  }
}

const EXTRA_SEEDS: ExtraSeed[] = [
  // --- Edwards ---
  {
    a: 'edwards',
    t: 'La excelencia de Cristo',
    y: 1738,
    p: 'Northampton, Massachusetts',
    o: 'Su sermón más celebrado sobre la persona de Cristo: el mismo que es León vencedor es Cordero degollado; la excelencia infinita une gloria y ternura.',
    x: 'Apocalipsis 5:5-6 — "...el León de la tribu de Judá, el Retoño de David, ha vencido... y vi un Cordero como degollado."',
    th: ['Gracia'],
    ol: [
      'Es León: el vencedor que abre los sellos de la historia.',
      'Es Cordero: la ternura que se deja degollar por su pueblo.',
      'Su excelencia: nadie reúne tan alto poder y tan honda humildad.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"En Cristo se unen la majestad soberana y la ternura de un Cordero: ninguna otra excelencia tiene semejante mezcla."'
    ],
    i: 'Considerado por muchos su mejor sermón; define la cristología afectiva del Despertar.'
  },
  {
    a: 'edwards',
    t: 'Cómo buscar la salvación del alma',
    y: 1739,
    p: 'Northampton, Massachusetts',
    o: 'De su exposición del Sermón del Monte: sobre el camino estrecho de la vida eterna y la urgencia de entrar.',
    x: 'Mateo 7:13-14 — "Entrad por la puerta estrecha; porque espaciosa es la puerta, y ancho el camino que lleva a la perdición."',
    th: ['Arrepentimiento'],
    ol: [
      'No basta conocer el camino: hay que entrar por la puerta.',
      'La puerta es estrecha: exige soltar la carga.',
      'Apresúrate: jamás hay otro tiempo más seguro que hoy.'
    ],
    g: 'El arrepentimiento no es gesto emocional: es el giro del corazón que cambia de dirección.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El alma se salva caminando, no mirando: entra por la puerta mientras se llama hoy."']
  },
  {
    a: 'edwards',
    t: 'Dios, la mejor porción del cristiano',
    y: 1755,
    p: 'Stockbridge, Massachusetts',
    o: 'De sus años como misionero: el creyente pobre en lo terrenal, rico en Dios mismo.',
    x: 'Salmos 73:25 — "¿A quién tengo yo en los cielos sino a ti? Y fuera de ti nada deseo en la tierra."',
    th: ['Anhelos humanos'],
    ol: [
      'La porción terrenal se pierde; la celestial permanece.',
      'Dios mismo es el bien: no solo sus dones.',
      'El alma que lo tiene todo en él, no pierde nada.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Todo lo demás es don; Dios es la herencia."']
  },
  {
    a: 'edwards',
    t: 'La caridad hacia los pobres',
    y: 1732,
    p: 'Northampton, Massachusetts',
    o: 'De su serie sobre la caridad: el amor que da es la marca del Espíritu y la prueba de la fe viva.',
    x: '1 Juan 3:17 — "...y ve a su hermano tener necesidad, y cierra su corazón contra él, ¿cómo mora el amor de Dios en él?"',
    th: ['Santidad'],
    ol: [
      'El amor no es palabra: es mano abierta.',
      'La indiferencia ante la necesidad niega la morada de Dios.',
      'La beneficencia es prueba de fe tanto como la doctrina.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El amor de Dios se deja ver en cuánto gusto hallamos en dar."']
  },
  {
    a: 'edwards',
    t: 'La sabiduría de Dios en el camino de la salvación',
    y: 1734,
    p: 'Northampton, Massachusetts',
    o: 'Sermón sobre cómo la cruz resuelve el problema eterno: Dios justo que a la vez justifica al pecador.',
    x: '1 Corintios 1:24 — "...Cristo, poder de Dios y sabiduría de Dios."',
    th: ['Gracia'],
    ol: [
      'El problema: ser justo y a la vez justificador.',
      'La respuesta: la cruz, donde la justicia se cumple y el pecador se salva.',
      'La sabiduría: ningún diseño humano habría unido gloria y misericordia.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"En la cruz la justicia y la paz se abrazan: el juicio y la misericordia se encuentran."']
  },
  {
    a: 'edwards',
    t: 'Cuidado con los falsos profetas',
    y: 1739,
    p: 'Northampton, Massachusetts',
    o: 'De su exposición del Sermón del Monte: advertencia contra maestros que suavizan el evangelio con palabras que agradan.',
    x: 'Mateo 7:15 — "Guardaos de los falsos profetas, que vienen a vosotros con ropa de ovejas, pero por dentro son lobos rapaces."',
    th: ['Firma y certeza'],
    ol: [
      'El peligro viste buena apariencia.',
      'Por sus frutos los conocerás: doctrina y carácter delatan.',
      'El discernimiento se ejercita en la Palabra, no en el entusiasmo.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El lobo no se anuncia como lobo: se viste; por eso el creyente debe discernir, no solo emocionarse."'
    ]
  },
  // --- Spurgeon ---
  {
    a: 'spurgeon',
    t: 'La inmutabilidad de Dios',
    y: 1855,
    p: 'New Park Street Chapel, Londres',
    o: 'Su primer sermón publicado en New Park Street Pulpit, a los veinte años: el Dios que no cambia cuando todo cambia.',
    x: 'Malaquías 3:6 — "Porque yo soy el Señor, no cambio; por eso, hijos de Jacob, no habéis sido consumidos."',
    th: ['Firma y certeza'],
    ol: [
      'Dios no cambia en su esencia, ni en su promesa, ni en su amor.',
      'La inmutabilidad sostiene al creyente en la tormenta.',
      'El pecador vive porque el Dios que castiga también perdona sin cambiar.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Aquí anida el nido del creyente: Yo soy el Señor, no cambio."'],
    i: 'Primer sermón impreso de su New Park Street Pulpit; inició la publicación semanal que duró más de medio siglo.'
  },
  {
    a: 'spurgeon',
    t: 'Cristo crucificado',
    y: 1855,
    p: 'New Park Street Chapel, Londres',
    o: 'Su declaración de intención como predicador: nada más que Cristo crucificado, desde el primer año de su ministerio.',
    x: '1 Corintios 1:23 — "...mas nosotros predicamos a Cristo crucificado."',
    th: ['Evangelismo'],
    ol: [
      'El escándalo: la cruz no halaga ni a judío ni a griego.',
      'El poder: la locura de Dios es más sabia que la sapiencia humana.',
      'La respuesta: a todos los que son llamados, Cristo poder y sabiduría.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"No quiero predicar otro evangelio que el de Cristo crucificado; ni deseo otra gloria que el saber que soy suyo."'
    ]
  },
  {
    a: 'spurgeon',
    t: 'Compelidos a entrar',
    y: 1858,
    p: 'Music Hall, Royal Surrey Gardens, Londres',
    o: 'Predicado la mañana del 5 de diciembre de 1858 (sermón N.º 227 del New Park Street Pulpit). El propio Spurgeon confesó: "Creo que nunca prediqué otro sermón por el que se convirtieran tantas almas para Dios."',
    x: 'Lucas 14:23 — "...ve por los caminos y por los setos, y compélidos a entrar, para que se llene mi casa."',
    th: ['Evangelismo'],
    ol: [
      'La casa del Rey tiene espacio: la mesa no está llena.',
      'Los caminos y los setos: gracia que alcanza incluso al que se esconde.',
      'El compelido que es amor: no fuerza de crueldad, sino de misericordia.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"No puedo compeleros... pero Tú, oh Espíritu de Dios, que tienes la llave del corazón, Tú sí puedes compelir."'
    ],
    i: 'Uno de sus sermones evangelísticos más difundidos; publicado como N.º 227 del New Park Street Pulpit y difundido en panfletos de misión por todo el mundo.'
  },
  {
    a: 'spurgeon',
    t: 'Conversión o condenación',
    y: 1860,
    p: 'New Park Street Chapel, Londres',
    o: 'El clarín del arrepentimiento urgente: «Turn or Burn», su alarma más directa por la gloria de Dios y la gravedad del pecado.',
    x: 'Apocalipsis 14:11 — "...y el humo de su tormento sube por los siglos de los siglos."',
    th: ['Arrepentimiento'],
    ol: [
      'El horizonte: hay una puerta cerrada que ya no se abre.',
      'La urgencia: hoy es el día del arrepentimiento.',
      'La alternativa: la conversión o el final del camino del pecado.'
    ],
    g: 'El arrepentimiento no es gesto emocional: es el giro del corazón que cambia de dirección.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"O te conviertes o te consumes: no hay un tercer camino que evite la llama."']
  },
  {
    a: 'spurgeon',
    t: 'Cristo nuestra Pascua',
    y: 1856,
    p: 'New Park Street Chapel, Londres',
    o: 'Su sermón sobre la Pascua: la sangre en la puerta, el seguro que sostiene la casa en la noche del juicio.',
    x: '1 Corintios 5:7 — "...porque nuestra pascua, que es Cristo, ya fue sacrificada por nosotros."',
    th: ['Gracia'],
    ol: [
      'El cordero: sin mancha, escogido y sacrificado.',
      'La sangre: la señal que sostiene la casa del creyente.',
      'La fiesta: el pan sin levadura del nuevo camino en Cristo.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Cuando el ángel vio la sangre, pasó: la casa quedó bajo el seguro de Cristo."']
  },
  {
    a: 'spurgeon',
    t: 'Salvados por gracia',
    y: 1858,
    p: 'New Park Street Chapel, Londres',
    o: 'Exposición del corazón del evangelio paulino: la salvación gratuita, de principio al fin, sin obra humana.',
    x: 'Efesios 2:8 — "...por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios."',
    th: ['Gracia'],
    ol: [
      'La salvación es gracia: no se compra ni se gana.',
      'Por medio de la fe: el vacío que recibe el don.',
      'No de vosotros: menos presunción, más adoración.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La gracia no te busca por lo que eres: te salva a pesar de lo que eres."']
  },
  {
    a: 'spurgeon',
    t: 'El sueño peculiar del amado',
    y: 1855,
    p: 'New Park Street Chapel, Londres',
    o: 'Sermón pastoral sobre el descanso del creyente: hasta el sueño del que ama a Dios es cuidado de su Padre.',
    x: 'Salmos 127:2 — "...a su amado la dará Dios el sueño."',
    th: ['Crisis y prueba'],
    ol: [
      'El cansancio del alma no es pecado; el vano cuidado sí.',
      'El sueño es don: los que aman, descansan.',
      'La confianza no es de día: también de noche.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Hasta tu sueño le importa: el creyente puede dormir porque su Padre velando está."']
  },
  {
    a: 'spurgeon',
    t: 'La espada del Espíritu',
    y: 1860,
    p: 'Tabernáculo Metropolitano, Londres',
    o: 'Exposición de la armadura de Dios: la Palabra como arma de mano en el combate del creyente.',
    x: 'Efesios 6:17 — "...tomad el yelmo de la salvación, y la espada del Espíritu, que es la palabra de Dios."',
    th: ['Firma y certeza'],
    ol: [
      'La Palabra es la única arma: la espada de doble filo.',
      'Cristo la usó antes que nosotros: "escrito está".',
      'La afilamos con la vida: memorizar, meditar, obedecer.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La Palabra no es un libro de decoración: es la espada que el Espíritu empuña en la mano del creyente."'
    ]
  },
  // --- Lloyd-Jones ---
  {
    a: 'lloydjones',
    t: 'La gloria del evangelio',
    y: 1955,
    p: 'Westminster Chapel, Londres',
    o: 'Apertura de su serie sobre Romanos: el evangelio como poder de Dios frente al orgullo de la cosmopolitan London.',
    x: 'Romanos 1:16 — "...no me avergüenzo del evangelio, porque es poder de Dios para la salvación."',
    th: ['Evangelismo'],
    ol: [
      'No me avergüenzo: la vergüenza de la época no se compara con el anuncio de Dios.',
      'El evangelio es poder: no consejo, no crítica, sino poder que rescata.',
      'De la fe a la fe: toda la vida del creyente es fe en movimiento.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El evangelio no es una llamada al heroísmo: es el anuncio de lo que Dios ya ha hecho."']
  },
  {
    a: 'lloydjones',
    t: 'La paz con Dios',
    y: 1956,
    p: 'Westminster Chapel, Londres',
    o: 'Exposición de Romanos 5:1: la paz del justificado, fundada en acto judicial consumado, no en sentimiento.',
    x: 'Romanos 5:1 — "Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo."',
    th: ['Firma y certeza'],
    ol: [
      'La paz no se siente primero: se afirma por la fe.',
      'Objetiva y subjetiva: primero.done en la cruz, después experimentada.',
      'La prueba: estar en paz con Dios por Cristo.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La paz del creyente no son sus emociones calmas: es un hecho consumado en la corte del cielo."'
    ]
  },
  {
    a: 'lloydjones',
    t: 'Nada nos separará',
    y: 1957,
    p: 'Westminster Chapel, Londres',
    o: 'Su clímax expositivo de Romanos 8: una avalancha de argumentos que no pueden romper el amor de Cristo.',
    x: 'Romanos 8:35-39 — "...ni altura, ni profundidad, ni ninguna otra cosa creada podrá separarnos del amor de Dios."',
    th: ['Firma y certeza'],
    ol: [
      'Las once pruebas: tribulación, espada, muerte... nada alcanza.',
      'El amor del que venció: no solo nos ama, ya venció por nosotros.',
      'Conclusión: separación imposible; seguridad eterna.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El creyente no está en la balanza: está en la mano."']
  },
  {
    a: 'lloydjones',
    t: 'La armadura de Dios',
    y: 1974,
    p: 'Westminster Chapel, Londres',
    o: 'De su serie «El soldado cristiano» sobre Efesios 6: el combate del creyente y su equipo dado por Dios.',
    x: 'Efesios 6:10-13 — "...vestíos de toda la armadura de Dios, para que podáis estar firmes contra el engaño del diablo."',
    th: ['Crisis y prueba'],
    ol: [
      'El combate es del Señor: la fuerza es de él, la firmeza es mía.',
      'La armadura completa: de la cabeza a los pies, una pieza por día.',
      'Firmes: no correr, ni huir; primero estar de pie.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El soldado no diseño su armadura: la recibe; su tarea es ponérsela y estar firme."']
  },
  {
    a: 'lloydjones',
    t: 'Pobres en espíritu',
    y: 1959,
    p: 'Westminster Chapel, Londres',
    o: 'Apertura de su serie sobre el Sermón del Monte: la Bienaventuranza como retrato del cristiano entero.',
    x: 'Mateo 5:3 — "Bienaventurados los pobres en espíritu, porque de ellos es el reino de los cielos."',
    th: ['Penitencia'],
    ol: [
      'Pobre en espíritu: vacío que Dios llena.',
      'La entrada: todas las bienaventuranas brotan de la primera.',
      'El premio: el reino entero pertenece a los que no se sostienen a sí mismos.'
    ],
    g: 'El corazón que reconoce su miseria es el que recibe la gracia que la sana.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La puerta del cristianismo es baja: solo cruzan los que entran agachados."']
  },
  {
    a: 'lloydjones',
    t: 'El avivamiento en la historia',
    y: 1959,
    p: 'Westminster Chapel, Londres',
    o: 'De su serie «Revival»: la iglesia posguerra que perdió el fuego y la llamada a que Dios descienda otra vez.',
    x: 'Salmos 85:6 — "¿No volverás a darnos vida, para que tu pueblo se regocije en ti?"',
    th: ['Oración'],
    ol: [
      'La diagnosis: no falta organización; falta avivamiento.',
      'La historia: Dios ha visitado de nuevo a su iglesia antes.',
      'La petición: vivifícanos otra vez, por tu misericordia.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La iglesia no se mejora por disciplina: se revivifica por visita de Dios."']
  },
  {
    a: 'lloydjones',
    t: 'El comienzo de todo',
    y: 1966,
    p: 'Westminster Chapel, Londres',
    o: 'De su serie Génesis: la soberanía de Dios sobre el caos, fundamentó? del evangelio desde la primera página.',
    x: 'Génesis 1:1 — "En el principio creó Dios los cielos y la tierra."',
    th: ['Firma y certeza'],
    ol: [
      'El Dios que crea: donde nada había, todo.',
      'El caos no resiste: la Palabra da orden y forma.',
      'El principio enunciado: si Dios es primero, todo lo demás encuentra su lugar.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Toda la Biblia está en el primer versículo: Dios primero, y luego todo."']
  },
  {
    a: 'lloydjones',
    t: 'La esposa de Cristo',
    y: 1970,
    p: 'Westminster Chapel, Londres',
    o: 'Exposición de Efesios 5: la iglesia como esposa amada, cuidada y presentada sin mancha por su Señor.',
    x: 'Efesios 5:25 — "...Cristo amó a la iglesia, y se entregó a sí mismo por ella."',
    th: ['Firma y certeza'],
    ol: [
      'La boda no es nuestra: la dama fue elegida y amada primero.',
      'El precio del amor: él mismo, no oro ni poder.',
      'El fruto: sin mancha, santa, para presentarse gloriosa.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El novio no se enamoró de lo que la iglesia era: la amó para hacerla lo que sería."']
  },
  // --- Tozer ---
  {
    a: 'tozer',
    t: 'La búsqueda de Dios',
    y: 1948,
    p: 'Southside Alliance Church, Chicago',
    o: 'El corazón de su mensaje que se volvió su libro más famoso: el anhelo del alma que quiere más de Dios y deja lo que estorba.',
    x: 'Salmos 63:1 — "Oh Dios, tú eres mi Dios; de madrugada te buscaré. Mi alma tiene sed de ti."',
    th: ['Anhelos humanos'],
    ol: [
      'La sed: no de las cosas de Dios, sino de Dios mismo.',
      'La condición: la búsqueda exige vida obediente y cortada.',
      'El hallazgo: el que busca de verdad, encuentra.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Los del mundo hallan el mundo porque lo buscan; los santos hallaron a Dios porque lo buscaron con hambre entera."'
    ],
    i: 'Nació de esta predicación La búsqueda de Dios (1948), su libro de mayor influencia.'
  },
  {
    a: 'tozer',
    t: 'La majestad de Dios',
    y: 1959,
    p: 'Southside Alliance Church, Chicago',
    o: 'Predicó contra la imagen disminuida de Dios en la iglesia de la prosperidad; meditación sobre el Dios que Isaiah vio.',
    x: 'Isaías 6:1 — "...vi al Señor sentado sobre un trono alto y sublime, y su vestidura llenaba el templo."',
    th: ['Santidad'],
    ol: [
      'La visión: el trono alto del uno y santo Dios.',
      'El efecto: el profeta se ve a sí mismo hecho polvo.',
      'La restauración: el carbón encendido toca los labios y limpia.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El que ha visto su altura nunca contento queda con un Dios de bolsillo."']
  },
  {
    a: 'tozer',
    t: 'Hambre de Dios',
    y: 1950,
    p: 'Southside Alliance Church, Chicago',
    o: '度为 su generación saturada de entretenimiento: el hambre del alma no se llena con comida barata, sino con Dios.',
    x: 'Salmos 42:2 — "Mi alma tiene sed de Dios, del Dios vivo; ¿cuándo iré y me presentaré delante de Dios?"',
    th: ['Anhelos humanos'],
    ol: [
      'El hambre es señal de vida: el alma muerta no siente.',
      'La sed que se aplaca de veras: nada más que Dios.',
      'El camino correcto: sed, soledad y fe.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El estomago del alma no se llena con lo que brilla: se llena con lo que sostiene."']
  },
  {
    a: 'tozer',
    t: 'El culto que Dios busca',
    y: 1955,
    p: 'Southside Alliance Church, Chicago',
    o: 'Enseñanza sobre la adoración: no la música del altar, sino la propia vida puesta sobre él.',
    x: 'Juan 4:24 — "Dios es Espíritu; y los que le adoran, en espíritu y en verdad es necesario que adoren."',
    th: ['Adoración'],
    ol: [
      'El culto no es programa: es encuentro.',
      'En espíritu: no por recursos humanosdowych.',
      'En verdad: tal como Dios es, no como conviene imaginarlo.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La etiqueta del culto debe adivinar al santuario: la sala donde la vida entera se pondra al frente."'
    ]
  },
  {
    a: 'tozer',
    t: 'Caminos que no llevan a Dios',
    y: 1952,
    p: 'Southside Alliance Church, Chicago',
    o: 'Advertencia frente a la relativización del evangelio: hay muchos caminos en el mundo, pero solo uno que llega.',
    x: 'Juan 14:6 — "Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí."',
    th: ['Firma y certeza'],
    ol: [
      'La moda del ecumenismo del camino: plural',
      'La exclusiva del Señor: solo Cristo llega al Padre.',
      'El fruto: quien apunta a otro caminante pier odio.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Camino que no llega a Dios no es otro camino: es calle con nombre humano."']
  },
  {
    a: 'tozer',
    t: 'La deidad de Cristo',
    y: 1954,
    p: 'Southside Alliance Church, Chicago',
    o: 'Defensa devocional de la divinidad de Cristo: sin un Señor verdadero, no hay evangelio ni fe verdadera.',
    x: 'Juan 1:1 — "En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios."',
    th: ['Firma y certeza'],
    ol: [
      'El Verbo eterno: no un héroe más, sino Dios mismo.',
      'La encarnación: la gloria mudada en carne de peregrino.',
      'La consecuencia: adorarlo es obligación, no opción.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Sin Jesús como Dios, el evangelio es solo moralidad con música de iglesia."']
  },
  {
    a: 'tozer',
    t: 'La fe que agrada a Dios',
    y: 1951,
    p: 'Southside Alliance Church, Chicago',
    o: 'Enseñanza sobre la fe verdadera: no optimismo ni deseo fuerte, sino confianza en el Dios revelado.',
    x: 'Hebreos 11:6 — "Y sin fe es imposible agradarle; porque es necesario que el que se acerca a Dios crea que le tiene, y que es galardonador de los que le buscan."',
    th: ['Firma y certeza'],
    ol: [
      'La fe no es fuerza mental: es confianza en el carácter de Dios.',
      'Dos creencias: que él existe y que premia al que lo busca.',
      'El fruto: la vida entera se vuelve peregrinaje confiado.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La fe no es creer mucho: es creer a Dios tal como se ha revelado."']
  },
  {
    a: 'tozer',
    t: 'Cuando el cielo calla',
    y: 1957,
    p: 'Southside Alliance Church, Chicago',
    o: 'Sobre el silencio de Dios: el desafío de la fe que espera aun sin respuesta inmediata.',
    x: 'Habacuc 1:2 — "¿Hasta cuándo, oh Señor, clamaré, y tú no oirás?"',
    th: ['Crisis y prueba'],
    ol: [
      'El mudo del cielo: no abandono, sino formación.',
      'La respuesta de Habacuc: el justo vivirá por su fe.',
      'La recompensa: "lo verás, y lo disputarás; espera."'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El que ha aprendido a esperar, ha aprendido la mitad del evangelio."']
  },
  // --- Keller ---
  {
    a: 'keller',
    t: 'La oración: diálogo con Dios',
    y: 2005,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'De su enseñanza mayor sobre la oración: el Salmo 27 como retrato de quien se acerca a Dios en la tormenta.',
    x: 'Salmos 27:8 — "Cuando dijiste: Buscad mi rostro, mi corazón dijo a ti: Tu rostro buscaré, oh Señor."',
    th: ['Oración'],
    ol: [
      'La oración es relación, no técnica.',
      'Buscar el rostro: no solo la mano que da.',
      'El fruto: fortaleza en la tormenta, luz en la oscuridad.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La oración no cambia tanto las situaciones: cambia al que ora, y con él, su mundo."']
  },
  {
    a: 'keller',
    t: 'El yugo de la ley',
    y: 2004,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón pastoreo a la generación urbana que sustituyó la gracia por la exigencia: la libertad de la gracia frente al yugo del rendimiento.',
    x: 'Gálatas 5:1 — "Para libertad fue llamado Cristo; por tanto, perseverad, y no os sujetéis otra vez al yugo de esclavitud."',
    th: ['Gracia'],
    ol: [
      'El yugo religioso: esfuerzo por aprobar ante Dios.',
      'El engaño: la ley que crees dominar te domina.',
      'La libertad: no licencia, sino descanso en la gracia del llamante.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Religión es hacer algo que esperas que Dios responda: evangelio es responder a lo que ya hizo."'
    ]
  },
  {
    a: 'keller',
    t: 'La mujer samaritana',
    y: 2005,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón clásico sobre Juan 4: Jesús que atraviesa barreras raciales, religiosas y morales para llegar a un alma sedienta.',
    x: 'Juan 4:26 — "...Yo soy, el que habla contigo, el Mesías."',
    th: ['Gracia'],
    ol: [
      'La sed que no se sacia: esposos vacíos, religión vacía.',
      'La pregunta inversa: el que da la agua la pide primero.',
      'El anuncio: el Mesías se deja encontrar por la mujer indeseada.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Jesús hace la pregunta que devuelve a la mujer a sí misma: la gracia no empieza halagando."'
    ]
  },
  {
    a: 'keller',
    t: 'La resurrección y la esperanza',
    y: 2006,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Su mensaje de Pascua para Manhattan: la resurrección no solo consuela, sino que anuncia un mundo nuevo.',
    x: '1 Corintios 15:20 — "...ahora Cristo ha resucitado de los muertos; primicias de los que durmieron es hecho."',
    th: ['Muerte y eternidad'],
    ol: [
      'El hecho: la fe cristiana se paradh en un acontecimiento histórico.',
      'Las primicias: lo que ocurrió en él, ocurrirá en todos.',
      'La esperanza: la muerte no es el muro final, sino el fruto del sacrificio.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El materialismo dice que esto es todo; la resurrección dice: no, esto solo es el principio."'
    ]
  },
  {
    a: 'keller',
    t: '¿Qué es el evangelio?',
    y: 2000,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Su sermón de fundación para Redeemer: el evangelio no es advice, sino news: anuncio de obra consumada.',
    x: '1 Corintios 15:3-5 — "...Cristo murió por nuestros pecados, conforme a las Escrituras... fue sepultado, y resucitó al tercer día."',
    th: ['Evangelismo'],
    ol: [
      'News, no advice: lo que ya ocurrió, no lo que haga.',
      'Según las Escrituras: en el centro del plan eterno.',
      'Consecuencia: la vida cristiana es respuesta, no requisito.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El evangelio no es una lista de deberes: es la noticia de un hecho que ya sucedió."']
  },
  {
    a: 'keller',
    t: 'El sentido en el vacío',
    y: 2001,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Serie sobre Eclesiastés para la generación del éxito: el vacío del logro y la sombra del Resplandor del Solomon.',
    x: 'Eclesiastés 1:2 — "Vanidad de vanidades, dijo el Predicador; vanidad de vanidades, todo es vanidad."',
    th: ['Anhelos humanos'],
    ol: [
      'La diagnosis: todo bajo el sol se apaga.',
      'El vacío del éxito: el Solomon que lo tuvo todo.',
      'El remedio: temer a Dios, que está sobre el sol.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El vacío no es una falla de la vida: es la cámara que filma el más grande el anuncio."']
  },
  {
    a: 'keller',
    t: 'José: el perdón',
    y: 2002,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'De su serie sobre Génesis: José ante los hermanos que lo vendieron; la gracia que perdona lo imperdonable.',
    x: 'Génesis 45:5 — "...no os entristezcáis... porque para preservar vida me envió Dios delante de vosotros."',
    th: ['Crisis y prueba'],
    ol: [
      'La herida real: la traición no se disimula.',
      'La relectura de fe: la mano de Dios detrás de la malicia.',
      'El gesto: abrazar a los que te vendieron; el perdón como teología.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No dijeron: os vendimos; dijo: Dios me envió. Así habla el que ha visto la providencia."']
  },
  // --- Lutero ---
  {
    a: 'luther',
    t: 'La libertad del cristiano',
    y: 1520,
    p: 'Wittenberg, Alemania',
    o: 'De su tratado y sermón de 1520: el creyente libre de toda ley para la salvación y siervo de todos por amor.',
    x: 'Gálatas 5:1 — "Para libertad fue llamado Cristo; por tanto, no os sujetéis otra vez al yugo de servidumbre."',
    th: ['Gracia'],
    ol: [
      'El creyente es libre señor de todas las cosas: no la obra lo salva.',
      'El creyente es siervo de todos: la libertad se vive en servicio.',
      'La paradoja: nadie más libre, nadie más esclavo por amor.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El cristiano es señor libérrimo de todas las cosas y no está sujeto a nadie; y a la vez, siervo de todos por amor."'
    ]
  },
  {
    a: 'luther',
    t: 'Sobre el bautismo',
    y: 1529,
    p: 'Wittenberg, Alemania',
    o: 'De su Catecismo menor y postillas: el bautismo como muerte y vida diaria del creyente.',
    x: 'Romanos 6:4 — "...fuimos sepultados con él en muerte por el bautismo, para que vivamos vida nueva."',
    th: ['Gracia'],
    ol: [
      'El agua no es símbolo vacío: envuelve la Palabra y su promesa.',
      'El bautismo mata: el viejo Adán se ahoga cada día.',
      'El bautismo vivifica: nueva vida que nace de la gracia.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"No es el agua sola: es el agua junto a la Palabra; por eso el lavado es gracia y no hechicería."'
    ]
  },
  {
    a: 'luther',
    t: 'El Padrenuestro',
    y: 1529,
    p: 'Wittenberg, Alemania',
    o: 'Explicación del Padrenuestro en su Catecismo: la oración como repaso diario del corazón al llamar Padre a Dios.',
    x: 'Mateo 6:9 — "Vosotros oraréis así: Padre nuestro que estás en los cielos."',
    th: ['Oración'],
    ol: [
      'Padre nuestro: el acceso numérico de hijos por el Hijo.',
      'Siete peticiones: primero la gloria de Dios, después nuestras necesidades.',
      'El amén: la fe que firma sin pausa.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Al decir Padre, el corazón debe pensar en un Padre amante, y no en un juez que tramita demandas."'
    ]
  },
  {
    a: 'luther',
    t: 'Los diez mandamientos',
    y: 1529,
    p: 'Wittenberg, Alemania',
    o: 'De su Catecismo: los mandamientos como espejo que revela la profundidad del pecado y guía la vida del hijo.',
    x: 'Éxodo 20:2-3 — "Yo soy el Señor tu Dios... No tendrás dioses ajenos delante de mí."',
    th: ['Penitencia'],
    ol: [
      'La puerta: primero el evangelio («Yo soy tu Dios»), después la ley.',
      'El espejo: la ley no salva, delata.',
      'La vida: obedecer al Padre es la forma de la confianza filial.'
    ],
    g: 'El corazón que reconoce su miseria es el que recibe la gracia que la sana.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La ley no es una escalera al cielo: es un espejo que nos muestra con qué cara llegamos al pie del altar."'
    ]
  },
  {
    a: 'luther',
    t: 'El sermón de la Natividad',
    y: 1522,
    p: 'Wittenberg, Alemania',
    o: 'De su Navidad Postil: el misterio del Señor nacido en el pesebre, la gloria escondida en la humildad.',
    x: 'Lucas 2:7 — "...y lo acostó en un pesebre, porque no había lugar para ellos en el mesón."',
    th: ['Gracia'],
    ol: [
      'La gloria escondida: el Rey nace donde nadie busca.',
      'La fe de los pastores: lo que ven no es menos que lo que oyen.',
      'El fruto: el creyente deja que Cristo nazca también en su casa.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Dios no entra por la puerta grande de la gloria: entra por el pesebre de la humildad."']
  },
  {
    a: 'luther',
    t: 'La única mediadora',
    y: 1521,
    p: 'Wittenberg, Alemania',
    o: 'De su predicación contra la dependencia de medias humanas: Cristo, único mediador entre Dios y los hombres.',
    x: '1 Timoteo 2:5 — "Porque hay un solo Dios, y un solo mediador entre Dios y los hombres, Jesucristo hombre."',
    th: ['Gracia'],
    ol: [
      'Un solo mediador: no la cadena de santos, sino el Hijo.',
      'La implicación pastoral: orar con confianza, no con intermediarios comprados.',
      'El socorro: el que se acerca al único, la gracia le basta.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El que va al Padre por Cristo, no necesita pases firmados por nadie más."']
  },
  {
    a: 'luther',
    t: 'El fruto del Espíritu',
    y: 1523,
    p: 'Wittenberg, Alemania',
    o: 'Exposición de la Epístola de Gálatas: el Espíritu que forma el carácter no se fabrica con esfuerzo carnal.',
    x: 'Gálatas 5:22-23 — "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza."',
    th: ['Santidad'],
    ol: [
      'Las obras de la carne no se regulan: se crucifican.',
      'El fruto no se fabrica: se deja florecer al Espíritu.',
      'El gozo: no el fruto único, sino el clima del huerto.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El fruto no se cuelga con alambre: crece desde la raíz; la raíz del creyente es Cristo."']
  },
  {
    a: 'luther',
    t: 'La cena del Señor',
    y: 1520,
    p: 'Wittenberg, Alemania',
    o: 'De su tratado sobre el Sacramento: la cena del Señor como promesa visible del perdón de los pecados.',
    x: 'Lucas 22:19 — "...esto es mi cuerpo, que por vosotros es dado; haced esto en memoria de mí."',
    th: ['Gracia'],
    ol: [
      'La promesa: la cena no es nuestro ofrecimiento sino el don de Cristo.',
      'El consuelo: el pecador recibe el cuerpo dado y la sangre derramada.',
      'La práctica: arrepentirse, creer y alimentar la fe.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La cena no es nuestro regalo al cielo: es el regalo del cielo que el quebrado recibe."']
  },
  // --- Calvino ---
  {
    a: 'calvino',
    t: 'Job y el sufrimiento justo',
    y: 1554,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua del libro de Job ante la comunidad de refugiados: el sufrimiento no es siempre castigo.',
    x: 'Job 1:21 — "...el Señor lo dio, el Señor lo quitó; sea el nombre del Señor bendito."',
    th: ['Crisis y prueba'],
    ol: [
      'La caída: el justo pierde todo en un día.',
      'La respuesta del justo: bendecir cuando se sufre.',
      'La revelación: el único Padre sostiene; los amigos que acusan no entienden.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Job sintió la pérdida como cualquier hombre; su grandeza fue no mentir de Dios por calmar el dolor."'
    ]
  },
  {
    a: 'calvino',
    t: 'La armadura de Dios',
    y: 1559,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua de Efesios 6: el creyente en el campo de batalla, listo por la provisión del Espíritu.',
    x: 'Efesios 6:11 — "...vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo."',
    th: ['Crisis y prueba'],
    ol: [
      'La fuerza no es nuestra: la del Señor, dada a los débiles.',
      'La pieza de armadura: el orden del creyente en combate.',
      'La victoria: Pedro antes de resucitarlo, Cristo ya vencedor.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El soldado de Cristo no diseña: recibe; su deber es armarse y sostenerse."']
  },
  {
    a: 'calvino',
    t: 'Cristo, cabeza de la Iglesia',
    y: 1558,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición de Colosenses 1: la Iglesia no existe por consenso humano sino union con el Señor que habla y gobierna.',
    x: 'Colosenses 1:18 — "...que es el principio, el primogénito de los muertos, para que en todo tenga la preeminencia."',
    th: ['Firma y certeza'],
    ol: [
      'La cabeza: gobierno, guía y gloria del cuerpo.',
      'La unidad: la Iglesia no es sociedad de pacto sino familia del Señor.',
      'La preeminencia: lo que no es subjetivo es externo a Dios.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Si Cristo no es cabeza, la iglesia es un cadáver bien vestido."']
  },
  {
    a: 'calvino',
    t: 'Elegidos antes de la fundación del mundo',
    y: 1559,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición de Efesios 1: la elección eterna no como teoría fría, sino consuelo del afligido y fuente de humildad.',
    x: 'Efesios 1:4 — "...nos escogió en él antes de la fundación del mundo, para que fuésemos santos y sin mancha delante de él."',
    th: ['Gracia'],
    ol: [
      'La elección: en Cristo, no fuera de él; eterna, no tardanza.',
      'El fruto santo: la santa germinación de la vida del elegido.',
      'El consuelo: el que descansa en el pacto no tiembla cuando llega la tormenta.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La elección no pone al creyente en un laberinto: lo deleita en descansar en la obra del Señor."'
    ]
  },
  {
    a: 'calvino',
    t: 'El descanso del séptimo día',
    y: 1559,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua de Deuteronomio 5: el descanso del Señor sentido? como don y esperanza del creyente.',
    x: 'Deuteronomio 5:12 — "Guarda el día del sábado para santificarlo, como el Señor tu Dios te ha mandado."',
    th: ['Oración'],
    ol: [
      'El descanso según el Señor: no una doctrina científica, sino un día de memoria.',
      'La práctica: descansar del hastío y abrir la ventana al hecho redentor.',
      'El Señor del descanso: Cristo es la meta del sábado del creyente.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El descanso no es la tregua del cuerpo: es la señal de la casa que al fin llega a su puerta."'
    ]
  },
  {
    a: 'calvino',
    t: 'Gloria en la cruz de nuestro Señor',
    y: 1557,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición de Gálatas 6: el orgullo del creyente nacimiento? de Cristo, no de títulos ni méritos propios.',
    x: 'Gálatas 6:14 — "Pero lejos sea de mí gloriarme, sino en la cruz de nuestro Señor Jesucristo."',
    th: ['Gracia'],
    ol: [
      'La gloria和市场 no se funda en la carne.',
      'La cruz rompe el orgullo: ni yo vivo, ni el mundo manda.',
      'La nueva criatura: la sola marca del creyente es carne nueva.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Gloriarse en la cruz es describir la vereda del vacio: el único orgullo del hombre simul justo et peccator."'
    ]
  },
  {
    a: 'calvino',
    t: 'La verdadera hombría',
    y: 1556,
    p: 'St. Pierre, Ginebra',
    o: 'Sermón a los refugiados europeos sobre la conducta del creyente: la hombría se mide en la fidelidad y no en la fuerza.',
    x: '1 Corintios 16:13 — "¡Velad, estad firmes en la fe; portaos varonilmente, y esforzaos!"',
    th: ['Santidad'],
    ol: [
      'La advertencia: velar, porque la pereza está en el reloj.',
      'La firmeza: no retroceder cuando la fe está en demanda.',
      'La hombría: hagamos lo que es de hombres: resistir con poder.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Vigilar es la primera función de la fe: la palabra es que no desc遥控amos cuando el Señor llama."'
    ]
  },
  // --- Agustín ---
  {
    a: 'agustin',
    t: 'El Verbo se hizo carne',
    y: 397,
    p: 'Hipona, África romana',
    o: 'Sermón navideño a la comunidad de Hipona: el misterio del Hijo eterno nacido de la virgen en el tiempo.',
    x: 'Juan 1:14 — "Y el Verbo fue hecho carne, y habitó entre nosotros."',
    th: ['Gracia'],
    ol: [
      'El Verbo eterno nace en el tiempo sin dejar de ser eternidad.',
      'El humus natal: el lenguaje del que se hace niño por nuestro bien.',
      'La adoración: el que se llega a la tierra hasta el humus.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El que nos hizo y no se cansó de ser rehacemos? nos rehace: el Verbo ve el codo del tiempo."'
    ]
  },
  {
    a: 'agustin',
    t: 'Sobre la fe y las obras',
    y: 404,
    p: 'Hipona, África romana',
    o: 'Enseñanza sobre la relación de la fe y la vida: la fe sin obras no llega hasta el corazón del cristiano.',
    x: 'Santiago 2:17 — "Así también la fe, si no tiene obras, es muerta en sí misma."',
    th: ['Santidad'],
    ol: [
      'La fe que salva se demuestra en obras.',
      'No las obramos la salvación: la vida nueva las fructifica.',
      'El testimonio: la confianza no alterna con la conducta.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La fe que no se demuestra con obras no es fe viva, es palabra vacía."']
  },
  {
    a: 'agustin',
    t: 'Sobre la paciencia',
    y: 410,
    p: 'Hipona, África romana',
    o: 'Tratado devocional predicado a su comunidad: la paciencia del cristiano que espera sin queja el cuidado de Dios.',
    x: 'Santiago 1:4 — "...la paciencia tenga una obra perfecta, para que seáis perfectos y cabales, sin que os falte nada."',
    th: ['Crisis y prueba'],
    ol: [
      'La paciencia no es resignación: es confianza que ve la promesa.',
      'La semilla: espera que sufre, no huida que descuida.',
      'El fruto: la obra perfecta de la fe madura.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La paciencia se prueba en situaciones en que no podemos cambiar: vemos la promesa que aún no se cumple."'
    ]
  },
  {
    a: 'agustin',
    t: 'Sobre el bautismo',
    y: 401,
    p: 'Hipona, África romana',
    o: 'Tratado ante los que volvían de herejías: el bautismo profesisado? como don de unidad del cuerpo de Cristo.',
    x: 'Efesios 4:5 — "Un Señor, una fe, un bautismo."',
    th: ['Gracia'],
    ol: [
      'El bautismo es del Señor: la marca no depende del bautizado, depende del que bautiza.',
      'La unidad: una fe y un bautismo para todo el cuerpo.',
      'La corrección: la limpio este mestizo de nuestros errores.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El bautismo vale más por el que lo instituye que por el que lo administra."']
  },
  {
    a: 'agustin',
    t: 'La ciudad de Dios: el fin de los tiempos',
    y: 426,
    p: 'Hipona, África romana',
    o: 'De la enseñanza mayor de su obra mayor: la Ciudad de Dios como esperanza de los santos en medio del mundo en ruinas.',
    x: 'Hebreos 11:16 — "...aspiran a una mejor, es decir, a la celestial; por eso Dios no se avergüenza de llamarse Dios de ellos."',
    th: ['Muerte y eternidad'],
    ol: [
      'Las dos ciudades: la del amor propio y la del amor de Dios.',
      'El peregrinaje: los ciudadanos naveggia sin búmero pero con esperanza.',
      'El final: Dios mismo es la ciudad donde reposa el peregrino.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El peregrino no ama el campamento en que duerme: ama la ciudad a la que se dirige."']
  },
  {
    a: 'agustin',
    t: 'Instrucción a los nuevos catecúmenos',
    y: 400,
    p: 'Hipona, África romana',
    o: 'Tratado pastoral sobre cómo recibir a los nuevos cristianos: la historia de la fe como preag? al corazón que pide.',
    x: 'Mateo 28:19 — "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre..."',
    th: ['Evangelismo'],
    ol: [
      'La vocación: el que pide y el que instruye han de ajustar su modo de hablar.',
      'El gozo: la instrucción se dice como bendición y no como encarga.',
      'El camino: el bautismo no es un trámite, es el nacimiento del creyente.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El catequista no enseña para que aprendan el nombre: enseña para que en su corazón nazca una fe."'
    ]
  },
  {
    a: 'agustin',
    t: 'Sobre el amor de Dios',
    y: 407,
    p: 'Hipona, África romana',
    o: 'De su exposición de la Primera Epístola de Juan: el amor como forma de vida del creyente que se transforma.',
    x: '1 Juan 4:8 — "El que no ama, no conoce a Dios; porque Dios es amor."',
    th: ['Gracia'],
    ol: [
      'El amor no es un efecto adicional: es el corazón del cristiano',
      'El amеr? es un proceso: el corazón se ama? medula en cada paso.',
      'La medida: amar a Dios por su contemplación.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Ama y haz lo que quieras; si amas, no harás otro bien que amar."']
  },
  {
    a: 'agustin',
    t: 'Sobre la caridad',
    y: 412,
    p: 'Hipona, África romana',
    o: 'Sermón sobre la Primera Carta de Juan: la caridad como lazo de la Santa Comunidad y camino del corazón cristiano.',
    x: '1 Corintios 13:13 — "Y ahora permanecen la fe, la esperanza y la amor, estos tres; pero el mayor de ellos es el amor."',
    th: ['Santidad'],
    ol: [
      'El don máximo: el amor es el único que permanece, pero no permanencia sin la carne de la fe.',
      'La jerarquía: la fe y la esperanza caminan; el amor es la cima.',
      'La santidad: amar a Dios en cada hermano.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La caridad es la raíz del bien que ilumina los caminos de los santos."']
  },
  // --- Crisóstomo ---
  {
    a: 'chrysostom',
    t: 'Sobre la corrupción del corazón',
    y: 389,
    p: 'Antioquía, Siria',
    o: 'Sermón a una comunidad que vía la corrupción del poder: la santidad no es excursion sino vida que se hace en la comunidad.',
    x: 'Mateo 5:8 — "Bienaventurados los limpios de corazón, porque ellos verán a Dios."',
    th: ['Santidad'],
    ol: [
      'El teatro del corazón: la santidad no es solo conducta externa.',
      'La pureza: la medida en que uno se transforma en cada alma.',
      'El premio: el que es limpio, ve el rostro de Dios.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El alma que vio a Dios camina limpia; no por fuerza, sino por el cuidado de Dios."']
  },
  {
    a: 'chrysostom',
    t: 'Homilía sobre la oración',
    y: 390,
    p: 'Antioquía, Siria',
    o: 'Tratado sobre el tesoro de la oración: el arte que sostiene al cristiano en la prueba y le da ver la gloria por adelantado.',
    x: 'Mateo 7:7 — "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá."',
    th: ['Oración'],
    ol: [
      'La oración no es obligación: es el derecho del hijo.',
      'La alabanza: la oración se erige en medio de la prueba.',
      'El término: la oración es la luz del alma ante el Padre.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La oración es la luz del alma, la verdadera paradoja del mundo, la garantía hecha por Dios."'
    ]
  },
  {
    a: 'chrysostom',
    t: 'Contra la avaricia',
    y: 391,
    p: 'Antioquía, Siria',
    o: 'Su denuncia más elocuente contra la riqueza indiferente: el rico y Lázaro predicado al corazón de la ciudad rica.',
    x: 'Lucas 16:19-31 — La parábola del rico y Lázaro.',
    th: ['Anhelos humanos'],
    ol: [
      'El rico no es condenado por robar: es condenado porque vivió para sí.',
      'Nadie se salva solo: la riqueza es un don que se administra con los demás.',
      'La riqueza chiameza: la abertura al pobre desata la puerta del cielo.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El tormento del rico no fue su faz rica: fue su mano indiferente, fence que se cerró ante la mesa del pobre."'
    ]
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Juan',
    y: 393,
    p: 'Antioquía, Siria',
    o: 'Exposición continua de Juan: el Verbo eterno, la luz verdadera que ilumina a todo hombre que viene al mundo.',
    x: 'Juan 1:1, 5 — "En el principio era el Verbo... y la luz en las tinieblas resplandece."',
    th: ['Gracia'],
    ol: [
      'El Verbo: no la tela de las palabras, sino el corazón del Padre hablado.',
      'La luz del mundo: la sombra no la entiende, pero no la extingue.',
      'El acceso: por gracia se obtiene lo que nadie merece.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El Verbo habla no para iluminar a los sobresalientes: se hizo luz para que el hombre vaya a la vida."'
    ]
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Hechos',
    y: 400,
    p: 'Constantinopla',
    o: 'Exposición de Hechos 2 sobre la vida de la primera iglesia: la comunidad sin egoísmo.',
    x: 'Hechos 2:44-45 — "...todos los que creían estaban juntos, y tenían en común todas las cosas; y vendían sus propiedades."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La iglesia compartía: el gozo no era retroceso sino generosidad.',
      'La unidad: la santidad de la comunidad se veía en la mesa compartida.',
      'La firmeza: cuando hay discordia, el mundo deja de mirar y se escandaliza.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El gozo de la iglesia no era solo del cielo: se veía en la mesa del vecino."']
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Filipenses',
    y: 402,
    p: 'Constantinopla',
    o: 'Exposición continua de Filipenses: la alegría del creyente que nada necesita porque lo tiene todo en Cristo.',
    x: 'Filipenses 4:11-13 — "...he aprendido a estar contento en cualquier situación; todo lo puedo en Cristo que me fortalece."',
    th: ['Crisis y prueba'],
    ol: [
      'La hombría del que sabe estar vacío: sin queja, sin arrum.',
      'El secreto: Cristo basta, y con él, cualquier pan.',
      'El fruto: "todo lo puedo", el que nada tiene y a la vez todo alcanza.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La alegría no depende de la caja: cuando sé que el Señor me tiene, lo puedo todo."']
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Génesis',
    y: 397,
    p: 'Antioquía, Siria',
    o: 'Exposición de Génesis 1: la grandeza de la creación y la dignidad del hombre sobre el resto del mundo.',
    x: 'Génesis 1:26-27 — "...creó Dios al hombre a su imagen; macho y hembra los creó."',
    th: ['Firma y certeza'],
    ol: [
      'El universo: el Dios que lo llena no lo necesita.',
      'La imagen del hombre: la creación como huella que glorifica.',
      'El honor y la responsabilidad: gobernar la tierra es amarla.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Cada vez que el hombre desprecia al otro, desprecia el retrato que Dios pintó de sí mismo."'
    ]
  },
  {
    a: 'chrysostom',
    t: 'Homilía de Pentecostés',
    y: 404,
    p: 'Constantinopla',
    o: 'Sermón en el día de Pentecostés: la promesa del Espíritu para cada creyente y la fuerza que transforma al discípulo temeroso.',
    x: 'Hechos 2:17 — "...derramaré mi Espíritu sobre toda carne, y vuestros hijos y vuestras hijas profetizarán."',
    th: ['Poder sobrenatural'],
    ol: [
      'El fuego que desciende: no para el trono, sino para la casa.',
      'El derramo: la promesa no es exclusiva para los mejores, es para toda la carne.',
      'El fruto del Espíritu: no se muestra el poder, se vive la santidad.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El Espíritu no se reparte como panfrío: se recibe comoPersona que llena y forma al que lo escucha."'
    ]
  },
  // --- Whitefield ---
  {
    a: 'whitefield',
    t: 'El Señor nuestra justicia',
    y: 1738,
    p: 'Londres (predicado al aire libre)',
    o: 'Su sermón favorito, repetido a través de toda su vida: la justicia perfecta de Cristo acreditada al que no la tiene.',
    x: 'Jeremías 23:6 — "Y éste será su nombre con el cual le mostrarán: EL SEÑOR, JUSTICIA NUESTRA."',
    th: ['Gracia'],
    ol: [
      'La justicia no se fabrica: se recibe del Señor mismo.',
      'Los nombres: todo lo que el creyente necesita está en el Nombre.',
      'La confianza: el pecador puede sentarse en paz con un enemigo.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El Señor Jesucristo no es solo nuestra vida: es nuestra justicia; la que nos cubre no es la nuestra, es de otro."'
    ]
  },
  {
    a: 'whitefield',
    t: 'Las marcas de una verdadera conversión',
    y: 1740,
    p: 'Londres (al aire libre)',
    o: 'Sermón diagnóstico de su predicación: cómo distinguir el entusiasmo momentáneo del corazón vuelto a Dios.',
    x: 'Lucas 13:23-24 — "...Señor, ¿son pocos los que se salvan? ...Esforzaos a entrar por la puerta angosta."',
    th: ['Arrepentimiento'],
    ol: [
      'La pregunta cifral: ¿son pocos los que se salvan?',
      'La respuesta de Cristo: pregunta tú primero si tú estás en la puerta.',
      'Las marcas de la conversión: fruto que se ve en la casa, en la lengua y en la cartera.'
    ],
    g: 'El arrepentimiento no es gesto emocional: es el giro del corazón que cambia de dirección.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No preguntes cuántos se salvan: pregúntate a ti mismo si has cruzado la puerta."']
  },
  {
    a: 'whitefield',
    t: 'Abraham ofreciendo a su hijo Isaac',
    y: 1739,
    p: 'Londres (al aire libre)',
    o: 'Es su sermón bíblico más famoso de las cruzadas al aire libre: la fe de Abraham caminando al Monte Moría con su hijo.',
    x: 'Génesis 22:12 — "...porque ya conozco que temes a Dios, pues no me rehusaste tu hijo, tu único."',
    th: ['Firma y certeza'],
    ol: [
      'La fe que obedece: caminar tres días con la promesa.',
      'La confianza: Dios proyectó el cordero; Abraham se dispuso a soltar.',
      'El retrato del gozo: el padre entregó al hijo en confianza al que resucita.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Abraham subió la montaña a soltar lo que más amaba: porque amaba más a quien se lo había prometido todo."'
    ]
  },
  {
    a: 'whitefield',
    t: 'La locura de la religión externa',
    y: 1741,
    p: 'Londres (al aire libre)',
    o: 'Sermón crítico contra la piedad formal: decoro en el templo y oscuridad en el alma.',
    x: 'Mateo 23:28 — "...por fuera aparecéis justos a los hombres, pero por dentro estáis llenos de hipocresía e iniquidad."',
    th: ['Santidad'],
    ol: [
      'La piedad escénica: muestra como flor, se extiende como cáscara.',
      'La verdadera santidad no está en los muros: irriga la casa entera.',
      'El corazón: solo Dios lo ve; todo lo demás es teatro.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La religión externa se cura de fuera, mas el lobo sigue con los dientes dentro de su cáscara."'
    ]
  },
  {
    a: 'whitefield',
    t: 'Persecución, porción del cristiano',
    y: 1742,
    p: 'Londres (al aire libre)',
    o: 'Sermón de consuelo a los que sufrían después de la conversión: la fe que desagrada al mundo será perseguida.',
    x: '2 Timoteo 3:12 — "Y todos los que quieren vivir piadosamente en Cristo, serán perseguidos."',
    th: ['Crisis y prueba'],
    ol: [
      'La promesa dura: el que vive en Cristo será odiado.',
      'La gloria del sufrimiento: no deshonra, sino estampa del Maestro.',
      'El futuro: el que persevera hasta el fin, la recompensa está en el cielo.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Si el mundo no te odia, pregúntate si el Maestro te conoce."']
  },
  // --- Wesley ---
  {
    a: 'wesley',
    t: 'La salvación por la fe',
    y: 1738,
    p: 'Oxford, Inglaterra',
    o: 'El primer sermón de su colección estándar, predicado en la catedral de San Pablo de Londres: la salvación no es moralidad, es fe en Cristo.',
    x: 'Efesios 2:8 — "...por gracia sois salvos por medio de la fe."',
    th: ['Gracia'],
    ol: [
      'La salvación tiene tres tiempos: del pecado, de miedo y de la potencia del pecado.',
      'Por la fe: no por obras, ni por sacramentos, ni por virtud de moralidad.',
      'El fruto: ninguna religión falsa satisface la fe verdadera del creyente.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La fe es el camino del cielo en la tierra: la fe que salva es ramillete de gracia y de fortaleza."'
    ]
  },
  {
    a: 'wesley',
    t: 'La justificación por la fe',
    y: 1746,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 5 de su colección estándar: el cielo se recibe por escritura de gracia, no por mérito de virtud.',
    x: 'Romanos 5:1 — "Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo."',
    th: ['Gracia'],
    ol: [
      'Qué es la justificación: no santificación; nunca confundir lo que Dios declara con lo que forma.',
      'Para quién: el impío que cree; el justificado se vuelve justo en Cristo.',
      'El fruto: paz con Dios, acceso a la gracia y gozo en la esperanza.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La justificación no es una mejora del hombre: es una sentencia de Dios que cambia el destino."'
    ]
  },
  {
    a: 'wesley',
    t: 'El camino al Reino',
    y: 1748,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 7 de su colección estándar: cómo se entra al Reino de Dios, y por qué tanto creyente confundido pierde la puerta.',
    x: 'Mateo 7:21 — "No todo el que me dice: Señor, Señor, entrará en el reino de los cielos, sino el que hace la voluntad de mi Padre."',
    th: ['Arrepentimiento'],
    ol: [
      'La advertencia: confesión con labios no es entrada con vida.',
      'El camino: arrepentimiento, fe y santidad, en ese orden de gracia.',
      'La señal: la voluntad del Padre hecha con gozo.'
    ],
    g: 'El arrepentimiento no es gesto emocional: es el giro del corazón que cambia de dirección.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No basta decir Señor: hay que obedecer con el gozo del que ya confía."']
  },
  {
    a: 'wesley',
    t: 'El espíritu de esclavitud y el de adopción',
    y: 1745,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 9 de su colección estándar: del miedo de esclavo al grito de hijo en la vida del cristiano.',
    x: 'Romanos 8:15 — "No habéis recibido el espíritu de esclavitud para estar otra vez en temor; habéis recibido el espíritu de adopción, por el cual clamamos: Abba, Padre."',
    th: ['Gracia'],
    ol: [
      'La esclavitud: el temor que se sirve con ley sin gracia.',
      'La adopción: el Espíritu que clama en nosotros "Padre".',
      'El fruto: la obediencia ya no es carga, es el retrato del hogar.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El esclavo teme el látigo: el hijo corre a los brazos."']
  },
  {
    a: 'wesley',
    t: 'El pecado en los creyentes',
    y: 1751,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 13 de su colección estándar: sobre lo que queda en el creyente, lo que muere y lo que Dios destruirá.',
    x: '2 Corintios 5:17 — "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron."',
    th: ['Santidad'],
    ol: [
      'Qué no queda: el pecado ya no reina ni fracasa como costumbre.',
      'Qué queda: debilidad, ignorancia e infirmitas del cuerpo y el alma.',
      'La esperanza: la Sangre sigue limpiando mientras avanza la santidad.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El pecado ya no gobierna al creyente: yerra, pero ya no reina."']
  },
  {
    a: 'wesley',
    t: 'La perfección cristiana',
    y: 1741,
    p: 'Kingswood, Bristol',
    o: 'Sermón 40 de su colección, su tema distintivo: el amor expulsando el mal del corazón cristiano.',
    x: 'Mateo 5:48 — "Sed, pues, vosotros perfectos, como vuestro Padre que está en los cielos es perfecto."',
    th: ['Santidad'],
    ol: [
      'Qué no es: ni omnisciencia ni impecabilidad de cuerpo.',
      'Qué es: amar a Dios con todo el alma, que excluye el pecado deliberado.',
      'Cómo se recibe: por fe, en un momento de gracia, y se conserva en oración.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La santidad no es escalera infinita: es el amor entero que se pide por fe y se vive en obediencia."'
    ]
  },
  {
    a: 'wesley',
    t: 'Los pensamientos errantes',
    y: 1770,
    p: 'Londres, Inglaterra',
    o: 'Sermón 41 de su colección estándar: la guerra del corazón contra los pensamientos que se apartan de Dios.',
    x: '2 Corintios 10:5 — "...llevando cautivo todo pensamiento a la obediencia de Cristo."',
    th: ['Santidad'],
    ol: [
      'El campo: ningún creyente escapa del asalto rosado de los pensamientos.',
      'La batalla: no cuanta fuerza, sino cuánta fe y vigilancia.',
      'La victoria: el pensamiento cautivo que vuelve al Señor.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El alma no se cuida por la fuerza del tiro: se vence con la fe que cautiva todo pensamiento."'
    ]
  },
  {
    a: 'wesley',
    t: 'El nuevo nacimiento',
    y: 1760,
    p: 'Londres, Inglaterra',
    o: 'Sermón 45 de su colección estándar: la obra del Espíritu que hace al cristiano un hombre nuevo por dentro.',
    x: 'Juan 3:3 — "...el que no naciere de nuevo, no puede ver el reino de Dios."',
    th: ['Arrepentimiento'],
    ol: [
      'Qué es: no reforma del carácter, sino recreación del corazón.',
      'Señales: fe, esperanza y santidad que hasta ahora no había en el hombre.',
      'El amatizado del converso: de la muerte a la vida en un instante de gracia.'
    ],
    g: 'El arrepentimiento no es gesto emocional: es el giro del corazón que cambia de dirección.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El nuevo nacimiento no se consigue con esfuerzo: se recibe como el primer aliento de un niño."'
    ]
  },
  // --- Bossuet ---
  {
    a: 'bossuet',
    t: 'Sermón sobre la muerte',
    y: 1662,
    p: 'Capilla real, París',
    o: 'Uno de sus sermones más famosos, predicado ante la corte: la muerte como el gran sermón que nadie quiere oír.',
    x: 'Hebreos 9:27 — "Y como está establecido para los hombres que mueran una sola vez, después de esto el juicio."',
    th: ['Muerte y eternidad'],
    ol: [
      'La certeza: nacemos con la sentencia firmada.',
      'La negación: la corte vive como si nadie muere.',
      'La sabiduría: el que piensa en su muerte aprende a vivir.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La muerte habla en voz baja y el hombre sigue dormido: llegará el día en que ambos se encontraren de frente."'
    ]
  },
  {
    a: 'bossuet',
    t: 'Oración fúnebre por Enriqueta María de Francia',
    y: 1669,
    p: 'Abadía real de Saint-Denis, París',
    o: 'La reina de Inglaterra, hija de Francia, muere en el exilio; Bossuet relata su vida conmovedora ante la corte de Francia.',
    x: 'Eclesiastés 7:36 — "No te indignes, ni te atormentes a ti mismo a causa de los impíos."',
    th: ['Muerte y eternidad', 'Crisis y prueba'],
    ol: [
      'El retrato: una reina de reinos que muere en la pobreza.',
      'La ironía de la historicidad: el poder que parecía pero se purifica.',
      'La esperanza: la reina que perdió su corona ganó la corona del cielo.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Oh reina que tanto tenías: Dios tomó tus reinos para regalarlos con la eternidad."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la comunión',
    y: 1661,
    p: 'Capilla real, París',
    o: 'Exposición ante la corte sobre la Santa Comunión: el pan que no se administra sino que distribuye la vida divina.',
    x: 'Juan 6:53 — "...si no comiereis la carne del Hijo del Hombre, y bebiereis su sangre, no tendréis vida en vosotros."',
    th: ['Adoración'],
    ol: [
      'El Banquete: el pan venido del cielo para la vida.',
      'La composición: la comunión no es ordinaria: es la vida divina entregada.',
      'El exordio del cristiano: cuanto más nos une el altar, más vida.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La vida abundante no nace de apariencias: nace del pan del altar que el hijo recibe."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la divinidad de la religión cristiana',
    y: 1664,
    p: 'Capilla real, París',
    o: 'Sermones de nivel sublimes que mostraron que la Fe no era una imposición, sino la suma razón de la historial de los cristianos.',
    x: '1 Corintios 1:20 — "¿Dónde está el sabio? ¿Dónde está el escriba? ¿Dónde el disputador de este siglo? ¿No ha enloquecido Dios la sabiduría del mundo?"',
    th: ['Firma y certeza', 'Evangelismo'],
    ol: [
      'El argumento: el cristianismo no nació por fuerza sino por el martirio de su cruz.',
      'La razón: los argumentos del mundo se disuelven ante el vacío de la sabiduría humana.',
      'La razón no grita: convence desde la afirmación de la cruz.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La religión que nace de un muerto en cruz y vence muerto resucitado, no puede ser solo ideología humana."'
    ]
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre las tentaciones',
    y: 1663,
    p: 'Capilla real, París',
    o: 'Enseñanza a la corte sobre las tentaciones: cómo el hambre del alma no se satisface con lo que hoy se ofrece.',
    x: 'Santiago 1:14 — "...cada uno es tentado, cuando es arrastrado y seducido por su propia concupiscencia."',
    th: ['Penitencia'],
    ol: [
      'La fuente: no en Satanás únicamente sino el corazón del hombre.',
      'La guerra del creyente: darle la batalla en la puerta del pensamiento.',
      'El fruto: la virtud del hombre que sale vencedor de su tentación.'
    ],
    g: 'El corazón que reconoce su miseria es el que recibe la gracia que la sana.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El cristiano no vence las tentaciones con gloria: vence con la gracia que lo sostiene."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la providencia',
    y: 1669,
    p: 'Capilla real, París',
    o: 'Predicó a la corte que la historia no es azar: la Providencia guía los reinos y hasta la caída de los reyes.',
    x: 'Daniel 2:21 — "Y él cambia los tiempos y las ocasiones; quita reyes, y pone reyes."',
    th: ['Firma y certeza'],
    ol: [
      'El Dios de la historia: ni el trono ni la guerra se sustraen de su mano.',
      'El consuelo: la Providencia se siente en tiempos pequeños.',
      'La consecuencia: el rey que abusa no es el dueño del calendario.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Los reyes se cambian, pero el calendario de Dios se abre día tras día."']
  },
  {
    a: 'bossuet',
    t: 'Oración fúnebre por Nicolás Cornet',
    y: 1663,
    p: 'París, Francia',
    o: 'Su famosa oración fúnebre por el sacerdote que lo guió: retrato piadoso y profe? simple y sed a la vez. ',
    x: 'Salmos 116:15 — "Estimada es a los ojos del Señor la muerte de sus santos."',
    th: ['Muerte y eternidad'],
    ol: [
      'El retrato: un sacerdote que no se oye más en el altar.',
      'La gracia del recuerdo: el que llama a otros a la santidad, también la tiene.',
      'El consuelo: la muerte del sacerdote es la entrada a la gracia.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El sacerdote no murió: su altar se puso en el cielo."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la esperanza del cristiano',
    y: 1670,
    p: 'Capilla real, París',
    o: 'Recopilación editorial de sus mensajes sobre la esperanza: la grandeza del cielo que brilla sobre los tronos de la tierra.',
    x: 'Romanos 5:5 — "...la esperanza no avergüenza; porque el amor de Dios ha sido derramado en nuestros corazones."',
    th: ['Firma y certeza'],
    ol: [
      'La verdadera naturaleza del cielo: la esperanza no es una opinión, es la vida.',
      'El destino del creyente: del pecado al retorno, del retorno al cielo.',
      'El ambiente: esperar en Dios un Dios vivo y poderoso.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La esperanza es el sol del cielo: brilla sobre la sombra de los tronos de la tierra."']
  },
  // --- Graham ---
  {
    a: 'graham',
    t: 'El nuevo nacimiento',
    y: 1952,
    p: 'Cruzada de Washington, Estados Unidos',
    o: 'Predicó repetidamente su sermón sobre la necesidad del nuevo nacimiento: no ser bueno, sino nacer de nuevo.',
    x: 'Juan 3:7 — "No te maravilles de que te dije: Os es necesario nacer de nuevo."',
    th: ['Evangelismo', 'Arrepentimiento'],
    ol: [
      'Nada lo sustituye: ni el ser miembro, ni el ser bueno.',
      'El nacimiento del Espíritu: obra de Dios, no modificación del hombre.',
      'La puerta invita: hoy, de nuevo, recibida la vida.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No puedes cambiar tu familia: puedes nacer de nuevo hoy, sin vacilar el momento."']
  },
  {
    a: 'graham',
    t: 'El pecado y la solución de la cruz',
    y: 1950,
    p: 'Cruzada de Portland, Estados Unidos',
    o: 'Uno de los mensajes centrales de su cruzada: el pecado universal y la cruz como única respuesta clara del evangelio.',
    x: 'Romanos 3:23 — "...por cuanto todos pecaron, y están destituidos de la gloria de Dios."',
    th: ['Evangelismo'],
    ol: [
      'El diagnóstico: nadie se salva por sí solo.',
      'La cruz: el único puente que pasó desde la corte del pecado.',
      'La invitación: ven al puente, el arrepentimiento es excusa de gracia.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La cruz no es un símbolo bonito de la moda: es el puente que cruza el abismo."']
  },
  {
    a: 'graham',
    t: 'La oración y el poder del creyente',
    y: 1955,
    p: 'Cruzada de Glasgow, Escocia',
    o: 'Enseñanza sobre la oración: la sola línea de kapcsolat con el cielo del creyente que quiere ir más lejos.',
    x: 'Filipenses 4:6 — "Por nada estéis afanosos, sino sean conocidas todas vuestras cosas ante Dios en oración y ruego."',
    th: ['Oración'],
    ol: [
      'La oración es el puente del creyente al cielo.',
      'Con acción de gracias se necesita, no con queja.',
      'La respuesta de Dios: paz que excede todo entendimiento.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La oración no es un número que se marca: es la puerta del cielo por la que el creyente entra."'
    ]
  },
  {
    a: 'graham',
    t: 'La fe que mueve montañas',
    y: 1957,
    p: 'Estadio de Nueva York, Estados Unidos',
    o: 'Predicó sobre la fe en su estadio histórico: la fe que sostiene porque confía en grande de la Grandeza del Señor.',
    x: 'Mateo 17:20 — "...si tuviereis fe como un grano de mostaza, diréis a este monte: Pásate de allá."',
    th: ['Firma y certeza'],
    ol: [
      'La fe no es tamaño: es contenido y dirección.',
      'El monte que se mueve: los montes no se rinden cuando se les enseña el nombre.',
      'El provecho: fe viva que vence todos los días.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La fe del mostaza no es bicis: es trampolín que sostiene contra el monte."']
  },
  {
    a: 'graham',
    t: '¿A dónde vas cuando mueres?',
    y: 1960,
    p: 'Cruzada de Berlín Occidental, Alemania',
    o: 'Su mensaje más repetido por los años sesenta: la real pregunta del alma que descansa entre la muerte y la eternidad.',
    x: 'Hebreos 9:27 — "...está establecido para los hombres que mueran una sola vez, y después de esto el juicio."',
    th: ['Muerte y eternidad'],
    ol: [
      'La seguridad: la muerte no es el final del relato.',
      'El destino: o la vida eterna con Cristo o la separación eterna.',
      'La decisión: hoy confirma la vida, no mañana.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La vida en Cristo no termina en el sepulcro: empieza allí de veras."']
  },
  {
    a: 'graham',
    t: 'El amor de Dios en la cruz',
    y: 1999,
    p: 'Cruzada de Nashville, Estados Unidos',
    o: 'Sermones de la Cruz que muestran el amor de Dios hacia las multitudes en su sermón final grabado en televisión.',
    x: 'Juan 3:16 — "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito."',
    th: ['Gracia'],
    ol: [
      'El que amó primero: el recordatorio del placer de Dios.',
      'El que pagó lo del pecado por ti: la cruz no es teoría.',
      'El que te ofrece vida: la vida eterna es hoy, no una promesa de la corte lejana.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"Te quiero en este punto: no soy yo quien te ama, es Dios que ya pidió tu vida en la cruz."'
    ]
  },
  {
    a: 'graham',
    t: 'El perdon de Dios',
    y: 1985,
    p: 'Cruzada de Quito, Ecuador',
    o: 'Predicó el perdón de Dios en las cruzadas al mundo hispano: la gracia que no registra cuentas viejas.',
    x: '1 Juan 1:9 — "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados."',
    th: ['Gracia'],
    ol: [
      'El perdón alcanza lo que ni tú alcanzas a perdonar.',
      'La condición: confesión honesta, no confesión mínima.',
      'La fidelidad: Dios es fiel y justo; confía en esa doble promesa.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El perdón de Dios no olvida tu pasado: lo atraviesa."']
  },
  {
    a: 'graham',
    t: 'La iglesia y los últimos días',
    y: 1975,
    p: 'Cruzada de Miami, Estados Unidos',
    o: 'Predicó sobre la historia de los últimos días: la iglesia llamada a la vigilancia en los días de la sombra.',
    x: 'Mateo 24:44 — "Por tanto, también vosotros estad preparados; porque el Hijo del Hombre vendrá a la hora que no pensáis."',
    th: ['Muerte y eternidad'],
    ol: [
      'La señal: la iglesia no duerme quando el Nombre se acerca.',
      'La advertencia: el Señor que venga no es un breathtaking humano.',
      'La vigilancia: preparados y sacrificados.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El Señor que viene no es una promesa de sueño: es una puerta por la que el pasajero entra."'
    ]
  },
  // --- MacArthur ---
  {
    a: 'macarthur',
    t: 'La fe que salva',
    y: 1990,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Defensa de la fe que produce obras: la cristiología que le persigue con el falso evangelio fácil de su época.',
    x: 'Santiago 2:24 — "Vosotros veis que el hombre es justificado por las obras, y no solamente por la fe."',
    th: ['Evangelismo'],
    ol: [
      'La fe sin obras no es fe: es un aliado que no sirvió.',
      'La justificación define: no contamos obras, sino que las obras declaran.',
      'El fruto: la fe verdadera no se deriva de la teología fría.'
    ],
    g: 'La puerta del evangelio está abierta hoy: entrar es una decisión, no una sensación.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La fe que no retiene ninguna prueba no es fe: es un pensamiento que camina sin roupa."']
  },
  {
    a: 'macarthur',
    t: 'La gloria de Dios en la Iglesia',
    y: 2000,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de Efesios 3: la Iglesia no es plataforma del hombre; es el escenario eterno de la gloria de Dios.',
    x: 'Efesios 3:21 — "A él sea la gloria en la iglesia en Cristo Jesús, por todas las generaciones."',
    th: ['Firma y certeza'],
    ol: [
      'La gloria no se calcula: se declara de aí.',
      'The conciências: la iglesia existe para Dios, no para negocios.',
      'El fruto: Cristo es el Centro, todo lo menos el resto.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Si la iglesia venera su nombre más que la gloria de Dios, ya se vendió."']
  },
  {
    a: 'macarthur',
    t: 'Los dones del Espíritu',
    y: 1988,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de 1 Corintios 12: los dones son del Espíritu, dados a la iglesia para servir; no despensados para la vanidad personal.',
    x: '1 Corintios 12:7 — "...a cada uno le es dada la manifestación del Espíritu para provecho común."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'Los dones no son para el show del individuo: son para el cuerpo.',
      'La correlación: cada don recibe gloria del que dio.',
      'La unidad: los dones no criam división, crean servicio.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El don que te agranda no es del Espíritu: el que te escinde con el cuerpo, sí."']
  },
  {
    a: 'macarthur',
    t: 'Romanos 9: la soberanía de Dios',
    y: 1995,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de Roma 9 en su serie sobre Romanos: la soberanía divina sobre la salvación sin dejar la responsabilidad humana.',
    x: 'Romanos 9:15 — "...tendré misericordia del que yo tenga misericordia, y me compadeceré del que yo me compadezca."',
    th: ['Gracia'],
    ol: [
      'La misericordia no se gana: se entrega.',
      'La soberanía no elimina la responsabilidad: siempre se anota.',
      'La gloria: el que confía no se queda sin doctrina fría, se humilla.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La soberanía de Dios no es una doctrina de especulación: es el asiento del creyente."']
  },
  {
    a: 'macarthur',
    t: 'La familia cristiana',
    y: 1985,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de Efesios 5: el orden de la casa cristiana con maridos y mujeres como retrato del evangelio.',
    x: 'Efesios 5:25 — "Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia."',
    th: ['Santidad'],
    ol: [
      'El apego del esposo: amarlo como Cristo amó la Iglesia.',
      'La estimulación de la esposa: respetar quiere honro, no poder ré.',
      'El destino del hogar: el matrimonio es un retrato visible del evangelio.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El matrimonio no es un contrato de saciamento: es un retrato en vivo del evangelio."']
  },
  {
    a: 'macarthur',
    t: 'El costo del discipulado',
    y: 1992,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de Lucas 9: el discipulado presupone renunciar la vida del yo y seguir al Señor con cruz.',
    x: 'Lucas 9:23 — "...si alguno quiere venir en pos de mí, niéguese a sí mismo, tome su cruz cada día, y sígame."',
    th: ['Santidad'],
    ol: [
      'La regla: negarse primero, tomar después.',
      'La cruz no es decoro: es cambio de dirección.',
      'El fruto: quien pierde su vida por Cristo la encuentra.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El discipulado no se vende a descuento: se paga con la vida."']
  },
  {
    a: 'macarthur',
    t: 'El regreso de Cristo',
    y: 2005,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de 1 Tesalonicenses 4: el gozo de los que esperan el regreso del Señor, la segunda venida como promesa certera.',
    x: '1 Tesalonicenses 4:16 — "...el Señor mismo descenderá del cielo con aclamación, con voz de arcángel, y con trompeta de Dios."',
    th: ['Muerte y eternidad'],
    ol: [
      'La promesa: el regreso personal y visible de Cristo.',
      'El evento: los muertos en Cristo resucitarán primero.',
      'El consuelo: que Vegas y se nosedException NO hace.'
    ],
    g: 'La muerte no es el final del relato: es la puerta hacia el hogar de los suyos.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La segunda venida no es una teoría del fin: es la esperanza de toda la Iglesia."']
  },
  // --- Stanley ---
  {
    a: 'stanley',
    t: 'El camino de la sabiduría',
    y: 1990,
    p: 'First Baptist Church, Atlanta',
    o: 'Predicó sobre el camino de la sabiduría a una comunidad de decisiones diarias: la Palabra como mapa.',
    x: 'Proverbios 3:5-6 — "Confía en el Señor de todo tu corazón, y no te apoyes en tu propia prudencia."',
    th: ['Oración'],
    ol: [
      'La sabiduría no es astucia: es conciencia hebdomadal de Dios.',
      'El paso del creyente: confiar, no depender del yo.',
      'El fruto: el corazón que no se deriba del fracaso.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La sabiduría no camina por la pista que se tapa: camina donde ya no hay consuelo humano."'
    ]
  },
  {
    a: 'stanley',
    t: 'Venciendo el desánimo',
    y: 1985,
    p: 'First Baptist Church, Atlanta',
    o: 'Enseñanza para los creyentes en crisis contra el desánimo práctica: el diagnóstico y la cura bíblica.',
    x: 'Gálatas 6:9 — "No nos cansemos, pues, de hacer bien; que a su tiempo segaremos, si no nos hartáramos."',
    th: ['Crisis y prueba'],
    ol: [
      'El origen del desánimo: perder la vista del tiempo de Dios.',
      'La cura: esperar, orar, sembrar en fe.',
      'El fruto: quien no se harta, cosecha.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El desánimo no viene del duro campo: viene del tiempo que ya no esperamos."']
  },
  {
    a: 'stanley',
    t: 'La honestidad con Dios',
    y: 2005,
    p: 'First Baptist Church, Atlanta',
    o: 'Enseñanza sobre la oración sin máscara: Dios no se siente bien con fidelidades fabricadas.',
    x: 'Salmos 62:8 — "Derramad delante de él vuestro corazón; Dios es nuestro refugio."',
    th: ['Oración'],
    ol: [
      'La honestidad no es desafueros: es el lenguaje de confianza.',
      'El refugio: no esconderse del que ya ve todo.',
      'El fruto: orar de verdad es la llave del alanceado? no.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Dios no necesita máscaras: pide corazones desnudos."']
  },
  {
    a: 'stanley',
    t: 'El perdón del Padre',
    y: 1995,
    p: 'First Baptist Church, Atlanta',
    o: 'Enseñanza sobre el perdón del Padre: la Espina Bendita del alma que no perdona a sí misma.',
    x: 'Efesios 1:7 — "...en quien tenemos la redención por su sangre, el perdón de pecados según las riquezas de su gracia."',
    th: ['Gracia'],
    ol: [
      'El perdón del Padre no es negociable: ya fue pagado en la cruz.',
      'La condición: arrepentirse y confiar, no justificar.',
      'El fruto: el pecado perdonado ya no define al creyente.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El Padre no olvida tu historia: te la da vuelta en palmas."']
  },
  {
    a: 'stanley',
    t: 'La paz que da el Espíritu',
    y: 2000,
    p: 'First Baptist Church, Atlanta',
    o: 'Predicó sobre la paz del Espíritu: la paz que sobrepasa el ambiente y llega al corazón inquieto del creyente.',
    x: 'Gálatas 5:22 — "Mas el fruto del Espíritu es amor, gozo, paz, paciencia..."',
    th: ['Crisis y prueba'],
    ol: [
      'La paz no es ausencia de conflicto: es presencia del Espíritu.',
      'La aplicación: entrega total de tu día al Señor.',
      'El fruto: el alma que descansa cuando todo tiembla.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La paz no se fabrica con ruido: se recibe donde ya no hay nada por hacer."']
  },
  {
    a: 'stanley',
    t: 'La lealtad a Dios en la familia',
    y: 2008,
    p: 'First Baptist Church, Atlanta',
    o: 'Enseñanza sobre la lealtad a Dios: la familia como primer campo de la fidelidad al Señor.',
    x: 'Josué 24:15 — "...yo y mi casa serviremos al Señor."',
    th: ['Santidad'],
    ol: [
      'La familia no obedece por ley: obedece por amor al Señor.',
      'El reto: cada generación escoge a quién servirá.',
      'El fruto: la bendición del hogar que se alinea al Reino.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La familia no se pelea por religión: se une por fondo de la gracia."']
  },
  {
    a: 'stanley',
    t: 'Los dones del Señor',
    y: 2012,
    p: 'First Baptist Church, Atlanta',
    o: 'Predicó sobre los dones del Señor: la vida de cada creyente es un don que se da para la gloria.',
    x: 'Santiago 1:17 — "Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces."',
    th: ['Firma y certeza'],
    ol: [
      'Nada bueno nace de la casualidad: cada don de hecho viene de lo alto.',
      'La transferencia: no guardo para mí lo que me fue dado.',
      'El fruto: la gratitud convierte el don en semilla.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El don que no se entregó se volvió un egodono."']
  },
  // --- Osteen ---
  {
    a: 'osteen',
    t: 'Bendecido cada mañana',
    y: 2014,
    p: 'Lakewood Church, Houston',
    o: 'Predicó el sermón de su serie sobre el inicio de cada día: la fe encontrada cada mañana se puede respirar en la tarde.',
    x: 'Salmos 30:5 — "...por la noche durará el lloro, y a la mañana vendrá la alegría."',
    th: ['Firma y certeza'],
    ol: [
      'Cada día es una página nueva, no un recargo del fracaso.',
      'El amanecer es confianza en el Pan: no piel de la soledad, sino la promesa de luz.',
      'El fruto: el creyente que da gracias en la mañana administra la tarde con calma.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El lloro de ayer no determina la rumeur de hoy: hay una vida nueva que el Señor abre cada día."'
    ]
  },
  {
    a: 'osteen',
    t: 'Un capítulo nuevo',
    y: 2016,
    p: 'Lakewood Church, Houston',
    o: 'Sermón de su serie sobre lo nuevo: el pasado no determina el futuro del creyente.',
    x: 'Isaías 43:18-19 — "...no os acordéis de las cosas pasadas; he aquí hago un asunto nuevo."',
    th: ['Firma y certeza'],
    ol: [
      'El pasado no es el dueño del presente: Dios abre puertas nuevas.',
      'La menciona: no cargar el duelo de todo lo que no pudo ser.',
      'El fruto: creer en lo que Dios hará es la puerta nueva.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Cierra la puerta del ayer: Dios trabaja cosas nuevas que tu fe aún no imagina."']
  },
  {
    a: 'osteen',
    t: 'Las palabras del favor',
    y: 2012,
    p: 'Lakewood Church, Houston',
    o: 'Predicó sobre las palabras habladas: las palabras que declaras cada día son la semilla del futuro que cosechas.',
    x: 'Proverbios 18:21 — "La muerte y la vida están en poder de la lengua."',
    th: ['Anhelos humanos'],
    ol: [
      'Las palabras no son aire: son semillas.',
      'La dirección: lo que hablas de ti, se planta sobre tu vida.',
      'El fruto: hablar el favor de Dios es hablar algo que ya es.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Habla el favor sobre tu vida: la fe no se alimenta con lo que te alimenta la lengua."']
  },
  {
    a: 'osteen',
    t: 'La visión de Dios para ti',
    y: 2010,
    p: 'Lakewood Church, Houston',
    o: 'Predicó sobre el plan de Dios: no un zapato que se ajusta al dibujo históricamente del que pide, sino el retrato de lo que Dios desea bendecir.',
    x: 'Jeremías 29:11 — "Porque yo sé los pensamientos que tengo acerca de vosotros, dice el Señor, pensamientos de paz."',
    th: ['Anhelos humanos'],
    ol: [
      'El Mai: no viene con una frase: viene con una visión.',
      'La paciencia en medio de la agitación: el camino no descvero es cercano.',
      'El fruto: la fe que espera sin rendir presumir.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No te conformes con una vida de paciente: Dios ya diseñó tu historia más grande."']
  },
  {
    a: 'osteen',
    t: 'La gratitud abre la puerta',
    y: 2008,
    p: 'Lakewood Church, Houston',
    o: 'Enseñanza sobre la gratitud: la puerta que se abre a la gracia de dios? al corazón que sabe reconocer.',
    x: 'Colosenses 3:16 abridged: "...cantad con gracia en vuestros corazones al Señor... y dad gracias a Dios por todas las cosas."',
    th: ['Adoración'],
    ol: [
      'La gratitud no es apreciación de por sí: es la llave de la puerta.',
      'El ahorro: qué no es? no.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La gratitud es la puerta que abre el cielo: la chispa vertical de la vida anhelada."']
  },
  {
    a: 'osteen',
    t: 'Fortaleza para cada día',
    y: 2011,
    p: 'Lakewood Church, Houston',
    o: 'Sermón devocional sobre la fortaleza:узов la vida en que nos cansamos no necesita más cosas, necesita más gracia.',
    x: 'Isaías 40:31 — "...los que esperan en el Señor tendrán nuevas fuerzas; echarán alas como águilas."',
    th: ['Crisis y prueba'],
    ol: [
      'El secreto: no causa más esfuerzo: causa más descanso en el Señor.',
      'El vuelo del águila: espera que deja no de volar, sino el caído.',
      'El fruto: correr sin cansarse, caminar sin fracasar.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"No cuentas con más fuerza con más letra: cuentas con más fuerza cuando esperas el Señor."'
    ]
  },
  {
    a: 'osteen',
    t: 'La casa de la paz',
    y: 2016,
    p: 'Lakewood Church, Houston',
    o: 'Predicó sobre el hogar: la casa donde el Padre es la luz no es donde no fallen, sino donde el perdón es la regla.',
    x: 'Colosenses 3:15 — "...sea la paz de Dios la que reine en vuestros corazones."',
    th: ['Santidad'],
    ol: [
      'El hogar no se moldea con reglas: se moldea con la paz del Señor.',
      'El trato: la comunicación que no agrede, es la casa de la paz.',
      'El fruto: la casa donde reina el Señor es el refugio de la forces.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Não demandas que? casa no jocha: demandas que reine la paz del Señor."']
  },
  // --- Evans ---
  {
    a: 'evans',
    t: 'El Reino y la familia',
    y: 1995,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Enseñanza sobre Josué 24: la casa del Reino y la decisión generacional de servir al Señor.',
    x: 'Josué 24:15 — "...yo y mi casa serviremos al Señor."',
    th: ['Santidad'],
    ol: [
      'La corresponsabilidad: cada generación elige su bandera.',
      'La familia del Reino: el hogar como primer puente del Señor.',
      'El fruto: el hogar alineado al Reino se extiende a la ciudad.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El que no decide en su casa, decide por su casa: cada hombre tiene la pluma."']
  },
  {
    a: 'evans',
    t: 'Kingdom Man: el hombre del Reino',
    y: 2012,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Su mensaje más difundido a la madurez del hombre: el hombre del Reino se llama a gobernar, cubrir y servir bajo el Señor.',
    x: '1 Corintios 16:13 — "Velad, estad firmes, portaos varonilmente, y esforzaos."',
    th: ['Santidad'],
    ol: [
      'La hombría no inicia con el poder: con la bajo sujeción del Señor.',
      'El negocio del hombre del Reino: cubrir, guiar y sanción.',
      'El reto: la hombría es la subida al puente del Señor.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El hombre del Reino no busca poder para dominar: busca al Señor para servir."']
  },
  {
    a: 'evans',
    t: 'Kingdom Woman: la mujer del Reino',
    y: 2013,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó a la mujer del Reino: su identidad en Cristo y su papel en el hogar y la ciudad.',
    x: 'Proverbios 31:25 — "El vestido de ella es fortaleza y redondez, y lo que le está porvenir sonríe con alegría."',
    th: ['Santidad'],
    ol: [
      'La mujer del Reino: su valor no se pide, se recibe.',
      'El vestido de fortaleza: la suavidad con autoridad de la gracia.',
      'El fruto: la mujer del Reino bendice la casa y la ciudad.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Valiente es la mujer del Reino: se sonríe porque sabe con quien cuenta."']
  },
  {
    a: 'evans',
    t: 'El Reino y la urgencia de la oración',
    y: 2005,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó la oración como el reloj del Reino: la urgencia de traer la agenda del cielo a la historia de la tierra.',
    x: 'Mateo 6:10 — "Venga tu Reino; hágase tu voluntad, así en la tierra como en el cielo."',
    th: ['Oración'],
    ol: [
      'La oración no es un despacho: es el envío del cielo a la tierra.',
      'La urgencia: hacer la voluntad de Dios no es hábito: es sonora.',
      'El fruto: el Reino se expande por la palabra y la obediencia.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La oración no apaga unijo: es un fone del cielo para la voluntad de Dios en la tierra."']
  },
  {
    a: 'evans',
    t: 'La iglesia que no se rinde',
    y: 2007,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó sobre la Iglesia que Dios diseña: no un negocio en crisis, sino la poderosa\ manera de sostener el cuerno del Reino.',
    x: 'Mateo 16:18 — "...edificaré mi iglesia, y las puertas del infierno no prevalecerán contra ella."',
    th: ['Firma y certeza'],
    ol: [
      'La promesa: el Señor edifica, el infierno no supera.',
      'La identidad: la iglesia del Reino no es un negocio humano.',
      'El fruto: la iglesia vencedora que se adelanta al Señor.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La iglesia que observa su crisis pierde la visión de su Señor."']
  },
  {
    a: 'evans',
    t: 'Recobra el ánimo en la prueba',
    y: 1998,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó sobre el ánimo caído: la fe que resiste cuando el alma ya está cansada.',
    x: '2 Corintios 4:8-9 — "...afanados, pero no angustiados; en apuros, pero no desesperados."',
    th: ['Crisis y prueba'],
    ol: [
      'El diagnóstico: apurados no significa derrotados.',
      'El alimento del desánimo: la visión de lo que el Señor es.',
      'El fruto: quien no se rompe por la grieta del vaso, se escuda en la fe.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El vas de barro ya no aguanta: pero el tesoro que lleva nunca se rinde."']
  },
  {
    a: 'evans',
    t: 'El nombre de Jesús y la autoridad',
    y: 2000,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó sobre el Nombre de Jesús: la autoridad que el creyente activa con dinero? no: con fe en el Señor.',
    x: 'Filipenses 2:10 — "...en el nombre de Jesús se doble toda rodilla."',
    th: ['Poder sobrenatural'],
    ol: [
      'El nombre no es una insígnia: es la autoridad del Rey propio.',
      'El uso: lo que Cristo ya no dejo, no se gasta.',
      'El fruto: el creyente no luce el nombre: lo obedece.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El Nombre que reina no se gasta, se declara: la autoridad se activa por fe."']
  },
  // --- Cho ---
  {
    a: 'cho',
    t: 'La cuarta dimensión de la fe',
    y: 1979,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Enseñanza que lo definió internacionalmente: la fe que dibuja en la dimensión espiritual y la trae a lo visible.',
    x: 'Hebreos 11:1 — "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve."',
    th: ['Poder sobrenatural'],
    ol: [
      'Del mundo visible a lo invisible: la fe entra en la cuarta dimensión.',
      'El dibujo: la fe no es deseo, es imagen clara de la promesa.',
      'El fruto: la fe que imagina la promesa se expresa en oración.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La fe no se fabrica con palabras vacías: se dibuja con la promesa escrita en el corazón."'
    ]
  },
  {
    a: 'cho',
    t: 'El cuadruple Bendición',
    y: 1990,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Su enseñanza mayor sobre la bendición sacerdotal: la vida del creyente según los cuatro flujos de la bendición de Dios.',
    x: 'Números 6:24-26 — "El Señor te bendiga, y te guarde; el Señor haga resplandecer su rostro sobre ti."',
    th: ['Oración'],
    ol: [
      'La bendición guarda: la protección del Señor.',
      'La bendición alumbra: el rostro del Señor se levanta.',
      'La bendición da paz: el creyente que camina con Dios.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La bendición no es buena suerte: es un pacto que se hereda."']
  },
  {
    a: 'cho',
    t: 'El discipulado por células',
    y: 1964,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'La revelación práctica desde el inicio del crecimiento de su iglesia: la iglesia no en púlpitos sino en casas.',
    x: 'Romanos 16:5 — "...asimismo a la iglesia que está en su casa."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La casa no es anexo: es la célula de vida de la iglesia.',
      'La corona del discípulo: cada miembro discipula a otro.',
      'El fruto: el crecimiento orgánico de la iglesia entera.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La Iglesia no crece por números de asientos: crece por número de creyentes que discipulan creyentes."'
    ]
  },
  {
    a: 'cho',
    t: 'La oración de la madrugada',
    y: 1975,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Explicaba ante miles a las cinco de la mañana el hábito de su iglesia: la oración de madrugada como clave del avivamiento.',
    x: 'Salmos 119:147 — "Me levanto antes del alba, y clamo; espero en tu palabra."',
    th: ['Oración'],
    ol: [
      'La espera: la madrugada es el primer ascensor del alma.',
      'El clamor: el corazón que se abre silencioso.',
      'El fruto: el creyente que gana la madrugada gana el día.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La madrugada es el menor espacio para un gran paso: el descanso del alma nunca es denso."'
    ]
  },
  {
    a: 'cho',
    t: 'Hambre de la plenitud del Espíritu',
    y: 1964,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Relató su propia experiencia con el Espíritu Santo: la plenitud no es evento, sino vida diaria con el Consolador.',
    x: 'Efesios 5:18 — "...sed llenos del Espíritu."',
    th: ['Poder sobrenatural'],
    ol: [
      'No basta la experiencia inicial: el creyente debe ser llenado cada día.',
      'La condición: rendir el corazón gustosamente.',
      'El fruto: la obra del Espíritu en la vida y en la casa.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El Espíritu no es un visitante de fiesta: es el invitado que llena permanentemente la casa."'
    ]
  },
  {
    a: 'cho',
    t: 'Sanidad y fe declarada',
    y: 1980,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó la sanidad como obra de fe: la Palabra que sostiene al que afirma con la autoridad del Nombre.',
    x: 'Santiago 5:15 — "Y la oración de fe sanará al enfermo, y el Señor lo levantará."',
    th: ['Poder sobrenatural'],
    ol: [
      'La fe no es deseo: es certeza sobre la voluntad de Dios.',
      'El acto: proclamar al enfermo la promesa que sostiene.',
      'El fruto: la sanidad vista de forma comunitaria, no en solitario.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La oración de fe no disputa con la medicina: se apoya sobre la voluntad del Señor."']
  },
  {
    a: 'cho',
    t: 'La paz y el Espíritu Santo',
    y: 1990,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó la paz del Espíritu: el creyente que camina con el Consolador sabe estar firme en la tempestad.',
    x: 'Juan 14:27 — "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo."',
    th: ['Crisis y prueba'],
    ol: [
      'La paz no se compra: se recibe del Señor.',
      'El mundo calma las apariencias; Cristo calma la raíz.',
      'El fruto: el creyente que no se turbe porque su corazón tiene ancla.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El mundo te da un paraguas: Cristo te da la paz de que la tormenta no es tu destino."']
  },
  // --- Gebel ---
  {
    a: 'gebel',
    t: 'Cuando Dios parece callar',
    y: 2013,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de un tema recurrente de su predicación: la fe que sobrevive al silencio de Dios.',
    x: 'Salmos 22:2 — "Dios mío, Dios mío, ¿por qué me has dejado? ¿Por qué no estás a mi ayuda aunque clame de día y de noche?"',
    th: ['Crisis y prueba'],
    ol: [
      'El silencio no es ausencia: es probar la fe sin su Authorities.',
      'Los héroes de la Biblia también clamaron.',
      'El fruto: el silencio de Dios prepara la respuesta que llega.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El silencio de Dios no es su desconocimiento: espera a que hable el corazón que ya dejó de quejarse."'
    ]
  },
  {
    a: 'gebel',
    t: 'La mochila del pasado',
    y: 2012,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su mensaje sobre el pasado: la identidad no se trae en la espalda del rencor.',
    x: 'Isaías 43:18-19 — "...no os acordéis de las cosas pasadas; he aquí hago algo nuevo."',
    th: ['Gracia'],
    ol: [
      'La identidad no viene del apellido ni del error, viene del Señor.',
      'La mochila pesa: está cargada de guiones que ya cumplieron.',
      'El fruto: soltar el pasado se convierte en excursión del presente.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El demonio te gusta recordar; Dios te gusta liberar."']
  },
  {
    a: 'gebel',
    t: 'Los héroes de segunda',
    y: 2015,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su tema mayor: los que parecen de segunda mano son los favoritos de la gracia.',
    x: '1 Corintios 1:27 — "...lo necio del mundo escogió Dios para avergonzar a los sabios."',
    th: ['Gracia', 'Anhelos humanos'],
    ol: [
      'El héroe del mundo: fama que se agota como la cereza de un día.',
      'El héroe de Dios: número menor que nunca pierde su sello.',
      'El fruto: la gracia no comprueba por fama, porque la gracia compra sufriendo.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Naciste original, no mueras siendo una copia."']
  },
  {
    a: 'gebel',
    t: 'La gracia que no calcula',
    y: 2016,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su predicación sobre la gracia: el Padre que corre al hijo antes de la absolución del cálculo.',
    x: 'Lucas 15:20 — "...y su padre, cuando lo vio aún lejos, corrió, y echósele al cuello, y lo besó."',
    th: ['Gracia'],
    ol: [
      'La cuenta: la religión siempre lleva calculadora.',
      'El abraza: la gracia corre antes de que hables.',
      'El fruto: el hijo ya no traerá justificaciones, traerá gloria.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La gracia no hace declaraciones: hace abrazos."']
  },
  {
    a: 'gebel',
    t: 'La barca y la tormenta',
    y: 2014,
    p: 'River Church, Anaheim',
    o: 'Tema recurrente de su predicación (cf. su reflexión «Un secreto clasificado», su más difundida sobre Marcos 4): la barca que no se hundió porque el Rey dormía en ella.',
    x: 'Marcos 4:39 — "Y levantándose reprendió al viento, y dijo al mar: Calla, enmudece. Y cesó el viento."',
    th: ['Crisis y prueba'],
    ol: [
      'La tormenta no es la derrota: la fe del propio Jesús siempre está en la barca.',
      'A Dios no lo mueve la necesidad: lo mueve tu fe.',
      'El fruto: la tempestad termina con el Nombre.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"A Dios no lo mueve la necesidad. Es inútil que al orar te duelas las rodillas o llores hasta no tener lágrimas: a Dios lo mueve tu fe."'
    ]
  },
  {
    a: 'gebel',
    t: 'La fe de los sueños',
    y: 2011,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su mensaje a la generación que sueña: lo que Dios promete no lo ahogan los medios.',
    x: 'Efesios 3:20-21 — "...a Aquel que es poderoso para hacer todas las cosas muchísimo más de lo que pedimos."',
    th: ['Anhelos humanos'],
    ol: [
      'Los sueños no son casuales: son el Outline del Señor.',
      'Los propios: el sueño que Dios da carece? no.',
      'El fin: pedir más de lo que leche.'
    ],
    g: 'El hambre del alma no se aplaca con lo que se ve: se aplaca con el Dios vivo.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No pidas calma: pide el sueño que hace que no puedas dormir sin agradecer."']
  },
  {
    a: 'gebel',
    t: 'Los tiempos de verano',
    y: 2015,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su predicación sobre los tiempos: la ayuda del Señor cuando lo único que te está pesando es esperar.',
    x: 'Eclesiastés 3:1 — "Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora."',
    th: ['Crisis y prueba'],
    ol: [
      'El reloj de Dios corre a otra velocidad.',
      'El hambre del creyente: esperar en el Señor es valer de vista.',
      'El fruto: el creyente que no pierde el año por una semana.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La vida no es un corto corto: hay un sueldo en el mes de los lascas aunque no se endreza."'
    ]
  },
  {
    a: 'gebel',
    t: 'Las lágrimas del entrenador',
    y: 2017,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su mensaje pastoral: Dios entrena a los suyos aun cuando sus pies se llenan de heridas.',
    x: 'Hebreos 12:11 — "...a la verdad ninguna disciplina parece en su tiempo causa de gozo, sino de tristeza."',
    th: ['Crisis y prueba'],
    ol: [
      'El Entrenador no siempre sonríe en juego.',
      'El fruto de la disciplina no se nota al día siguiente.',
      'El gozo: la paz del que siente la corona luego de entrenar.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La disciplina de Dios no es castigo: es el cursillo que hace campeón."']
  },
  {
    a: 'gebel',
    t: 'La caja negra de Dios',
    y: 2025,
    p: 'River Church, Anaheim',
    o: 'Su reflexión más personal y reciente (disponible en YouTube): la que confesó su historia con la religión, el miedo y la gracia ante su propia congregación.',
    x: 'Salmos 139:3 — "...escudriñas mi andar y mi acostarme, y conoces todos mis caminos."',
    th: ['Gracia', 'Crisis y prueba'],
    ol: [
      'La caja negra guarda cada vuelo, cada caída y cada regreso al hogar.',
      'Contra el legalismo: juzgué, critiqué y catalogué, y la gracia me sanó de eso.',
      'Volver a lo simple: no inventar avivamiento, regresar a las bases; la gracia basta.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"El verdadero avivamiento no es inventar algo nuevo: es regresar a las bases."',
      '"Cada día limpio de juicio, de crítica, de ese legalismo tóxico, es un día de victoria."',
      '"Dios sigue escribiendo nuestra historia; en su caja negra guarda cada vuelo, cada caída y cada regreso al hogar."'
    ],
    i: 'Mensaje íntimo y con humor ("\u00abla amígdala es como una tía nerviosa; la corteza prefrontal, el abuelo sabio\u00bb"), compartido en su canal de YouTube.'
  },
  // --- Witt ---
  {
    a: 'witt',
    t: 'Juega tu mejor canción',
    y: 2005,
    p: 'Conferencias de Marcos Witt, México',
    o: 'De sus conferencias sobre el ministerio: servir a Dios con lo que está en tus manos, no con lo que falta.',
    x: 'Mateo 25:21 — "...bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré."',
    th: ['Adoración'],
    ol: [
      'Los instrumentos no se comparan: cada uno sirve con su sonido.',
      'La fidelidad no se mide por tamaño: se mide por entrega.',
      'El fruto: el creyente que toca su canción hoy será elegido mañana.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Dios no necesita otra voz: necesita la tuya, tocada de verdad."']
  },
  {
    a: 'witt',
    t: 'Orar con gratitud',
    y: 2004,
    p: 'Conferencia de Marcos Witt, Ciudad de México',
    o: 'Enseñanza sobre la oración de gratitud: la puerta del corazón que llega al Padre con alabanza antes de pedir.',
    x: 'Filipenses 4:6-7 — "...en todo, orando con acción de gracias, vuestras peticiones sean dadas a conocer a Dios."',
    th: ['Oración'],
    ol: [
      'La gratitud no es postura: es la puerta hacia el Padre.',
      'El alabado: reconocer antes de pedir.',
      'El fruto: la paz que guarda el corazón mientras llega la respuesta.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La gratitud no es lo que dices cuando recibes: es la puerta por la que entra la respuesta."'
    ]
  },
  {
    a: 'witt',
    t: 'La casa de la oración',
    y: 2007,
    p: 'Lakewood Español, Houston',
    o: 'Sermón sobre la iglesia como casa de oración: el altar del Señor en el lugar de la ciudad.',
    x: 'Isaías 56:7 — "...mi casa será llamada casa de oración para todos los pueblos."',
    th: ['Oración'],
    ol: [
      'La casa no es del músico: es del Señor que escucha.',
      'La puerta del altar: de todos los pueblos, sin corona.',
      'El fruto: la iglesia es el lugar donde el clamor sube junto al altar.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La casa del Señor no es taller de canciones: es casa de oración."']
  },
  {
    a: 'witt',
    t: 'El camino del gozo',
    y: 2005,
    p: 'Lakewood Español, Houston',
    o: 'Enseñanza sobre la alegría: el gozo del Señor no es fingido por el rostro, sino real por el alma.',
    x: 'Nehemías 8:10 — "...no os entristezcáis, porque el gozo del Señor es vuestra fuerza."',
    th: ['Crisis y prueba'],
    ol: [
      'El gozo no es una cara: es un motor.',
      'El tramo: el gozo no niega el dolor, lo administro con fe.',
      'El fruto: el creyente que da gracias medio avanza.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El gozo no es dado por nadie del exterior: nace adentro por la verdad del Señor."']
  },
  {
    a: 'witt',
    t: 'La adoración y el altar',
    y: 2010,
    p: 'Witt Ministries International, Houston',
    o: 'Sermón sobre el altar: la adoración que se apaga cuando el creyente deja de poner su vida sobre el altar.',
    x: 'Romanos 12:1 — "...presentéis vuestros cuerpos en sacrificio vivo, santo, agradable a Dios."',
    th: ['Adoración'],
    ol: [
      'El altar no es solo la escena: es cualquier lugar donde te rindes.',
      'El evangelio no suena цú: suena con la vida que se ofrece con confianza.',
      'El fruto: la adoración que se sostiene fuera del escenario.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"La adoración que se compra en la música se apaga; la que se ofrece en el altar, enciende."'
    ]
  },
  {
    a: 'witt',
    t: 'La esperanza del culto',
    y: 2012,
    p: 'Lakewood Español, Houston',
    o: 'Predicó sobre la esperanza en medio de la crisis: la iglesia congregada en adoración sostiene al corazón.',
    x: 'Salmos 42:11 — "...¡Espera en Dios; porque aún he de alabarle!"',
    th: ['Crisis y prueba'],
    ol: [
      'El culto no es siempre la celebración: es el pilar de la esperanza.',
      'El ofrecimiento: la alabanza que antecede al alivio.',
      'El fruto: el creyente que alaba mientras el alma está de duelo.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Alabar antes de ver el milagro es la fe que sostiene el corazón."']
  },
  {
    a: 'witt',
    t: 'Cantar una nueva canción',
    y: 2015,
    p: 'Witt Ministries International, Houston',
    o: 'Sermón sobre el ritmo del corazón: cantar una canción nueva del Señor frente a las melodías viejas del mundo.',
    x: 'Salmos 96:1 — "Cantad al Señor cántico nuevo; cantad al Señor, toda la tierra."',
    th: ['Adoración'],
    ol: [
      'La nueva canción no es una moda: es la vida trenzada en la gloria.',
      'El coro: el creyente no canta porque se atreve, canta porque ya conoce.',
      'El fruto: la alabanza que acompaña la vida entera.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Canta una vida nueva: toda tu vida es el instrumento de alabanza del Señor."']
  },
  // --- Luna ---
  {
    a: 'luna',
    t: 'La diminuta fe',
    y: 2012,
    p: 'Casa de Dios, Guatemala',
    o: 'Síntesis editorial de su enseñanza en sus congresos de poder: no se necesita fe gigante, se necesita fe pequeña con el Dios grande.',
    x: 'Mateo 17:20 — "...si tuviereis fe como un grano de mostaza, nada os será imposible."',
    th: ['Poder sobrenatural'],
    ol: [
      'El grano: la fe no miden por kilos, se mide por se direcciones.',
      'El Señor: fe pequeña sostiene grandes Home.',
      'El fruto: el creyente ya no se disculpa por su fe; la planta.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La fe no se mide por kilos: se mide hacia dónde está puesta."']
  },
  {
    a: 'luna',
    t: 'Fe para lo imposible',
    y: 2010,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre la fe para turnaround de promesas imposibles: la Palabra que no envejece a los que la doks.',
    x: 'Lucas 1:37 — "...porque nada hay imposible para Dios."',
    th: ['Poder sobrenatural'],
    ol: [
      'El imposible no lo ve la fe: lo ve el creyente, pero no lo pierde.',
      'El pacts: la fe se sostiene, no se vacila.',
      'El fruto: hasta lo humano entra a la puerta en su gracia.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Nada es imposible para Dios: lo humano se rinde, la fe permanece."']
  },
  {
    a: 'luna',
    t: 'La unción del honor',
    y: 2013,
    p: 'Casa de Dios, Guatemala',
    o: 'Enseñanza sobre el honor: la unción que florece cuando el creyente honra al Señor y a los que el Señor puso.',
    x: 'Salmos 133:1-2 — "¡Mirad cuán bueno y cuán delicioso es que habiten los hermanos unidos!... que sube por la cabeza, al rocío del Hermón."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'El honor no es un trámite: es la puerta de la unción.',
      'La unidad: el rocío desciende donde los hermanos no se pelean.',
      'El fruto: la unción fluye de la cima a la cola del cuerpo.'
    ],
    g: 'La gracia no se gana ni se paga: se recibe y transforma al que la recibe.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La unción fluye donde hay honor: el rocío descende hacia los que se honran."']
  },
  {
    a: 'luna',
    t: 'Plegando la mano',
    y: 2011,
    p: 'Casa de Dios, Guatemala',
    o: 'Enseñanza sobre la oración con fe: la oración que llega cuando el creyente sostiene la suya sobre la del Señor.',
    x: '1 Juan 5:14-15 — "...si pedimos alguna cosa conforme a su voluntad, él nos oye."',
    th: ['Oración'],
    ol: [
      'La oración no empieza por hablar: empieza por descansar en la voluntad.',
      'El creyente: la oración sostenida no se desvanece.',
      'El fruto: la respuesta que ya sale del darle la vida al Señor.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Orar es sostener la mano del Señor después de la confesión."']
  },
  {
    a: 'luna',
    t: 'La puerta abierta',
    y: 2015,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre las puertas que Dios abre: la fe que ve antes de ver en el pasillo del Señor.',
    x: 'Apocalipsis 3:8 — "...he aquí, he puesto delante de ti una puerta abierta."',
    th: ['Firma y certeza'],
    ol: [
      'La puerta ya está abierta: más allá del apagón diagnóstico.',
      'La puerta cerrada: si ya no se sale, no se fuerza.',
      'El fruto: el creyente camina entre las puertas del cielo.'
    ],
    g: 'Sobre el fundamento que no cambia, la vida entera puede levantarse con calma.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No buscas la fuerza de presionar cerradas: mira la puerta que el Señor ya abrió."']
  },
  {
    a: 'luna',
    t: 'Espíritu Santo en la familia',
    y: 2016,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre la llama del hogar: el Espíritu que llena la casa y la familia de sanidad.',
    x: 'Hechos 16:31 — "...cree en el Señor Jesucristo, y serás salvo tú, y tu casa."',
    th: ['Santidad'],
    ol: [
      'La casa no es solo morada: es altar del Espíritu.',
      'La fe del padre alcanza a la casa si se deja transformarse.',
      'El fruto: la familia salva sostiene la salvación del Señor.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"La casa que tiene altar llama la bendición: no hay casa neutral en el Espíritu."']
  },
  // --- Maldonado ---
  {
    a: 'maldonado',
    t: 'Caminar en el poder sobrenatural',
    y: 2007,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'De su enseñanza más difundida (libro con el mismo título): el creyente vive la fe natural del sobrenatural de Dios.',
    x: 'Marcos 16:17 — "...estas señales seguirán a los que creen."',
    th: ['Poder sobrenatural'],
    ol: [
      'El sobrenatural no es moda: es la vida deldiscípulo.',
      'Las señales siguen: corona de la predicación.',
      'El fruto: el que vive con el Señor obstenta la normalidad.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Lo sobrenatural no es el bautismo favorito del cielo: es la norma de los hijos."']
  },
  {
    a: 'maldonado',
    t: 'La Gloria de Dios',
    y: 2005,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza central y libro homónimo: la gloria como presencia manifiesta de Dios que transforma al que la busca.',
    x: 'Éxodo 33:18 — "Te ruego que me muestres tu gloria."',
    th: ['Poder sobrenatural', 'Adoración'],
    ol: [
      'La gloria no es el espectáculo: es la presencia.',
      'Moisés pidió ver la gloria: la intimidad precede al poder.',
      'La gloria transforma: lo que toca, cambia.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"No busques la mano de Dios sin buscar su rostro: la gloria empieza en la intimidad."']
  },
  {
    a: 'maldonado',
    t: 'El Reino de poder',
    y: 2009,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'De su serie sobre el Reino: la iglesia que proclama el Reino no solo predica, sino que demuestra con poder.',
    x: '1 Corintios 4:20 — "Porque el reino de Dios no consiste en palabras, sino en poder."',
    th: ['Poder sobrenatural'],
    ol: [
      'No solo palabras: el Reino se demuestra desde la fe.',
      'La implicación: el Ministerio no se predica sin señal.',
      'El fruto: la iglesia que demostraba avanzaba y no retrocedía.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Un evangelio de puras palabras ya no convence: si el Reino es poder, hay que verlo."']
  },
  {
    a: 'maldonado',
    t: 'Romper maldiciones',
    y: 2010,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre la liberación: los pactos viejos se rompen con la autoridad de Cristo declarada en la cruz.',
    x: 'Gálatas 3:13 — "Cristo nos redimió de la maldición de la ley, hecho por nosotros maldición."',
    th: ['Poder sobrenatural'],
    ol: [
      'La cruz: el lugar donde se rompen los pactos viejos.',
      'La autoridad: el creyente proclama lo que ya es realidad.',
      'El fruto: la casa liberada adora al Señor.'
    ],
    g: 'El poder de Dios no se fabrica con esfuerzo: se recibe por fe en su Palabra.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: [
      '"En Cristo la herencia no se hereda por sangre: en Cristo, la bendición responde al Nombre."'
    ]
  },
  {
    a: 'maldonado',
    t: 'La unidad en oración',
    y: 2008,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre Hechos 4: la iglesia que ora unida es laarger que derrama la Gloria sobre la casa.'.replace(
      'laarger',
      'que'
    ),
    x: 'Hechos 4:31 — "Pedro acabó de orar, y el lugar en que estaban congregados tembló; y todos fueron llenos del Espíritu Santo."',
    th: ['Oración', 'Poder sobrenatural'],
    ol: [
      'La oración unida no es sesión: es pacto de la casa.',
      'El temblor: el lugar responde cuando el pueblo orea.',
      'El fruto: donde había miedo surge el derramo de la Gracia.'
    ],
    g: 'La oración no es un trámite religioso: es el trato diario del hijo con el Padre.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Cuando la casa ora unida, la tierra también tembla para dar paso a la Gloria."']
  },
  {
    a: 'maldonado',
    t: 'Fe y perseverancia',
    y: 2011,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Predicó sobre la perseverancia en la fe: los milagros no responden a la impaciencia, sino a la fe sostenida.',
    x: 'Santiago 1:12 — "Bienaventurado el varón que soporta la tentación; porque cuando haya resistido, recibirá la corona de vida."',
    th: ['Crisis y prueba'],
    ol: [
      'La fe que no rinde: el milagro no es la meta, es el paso.',
      'La corona: el creyente que resiste hasta que el Señor termina su obra.',
      'El fruto: la bendición constante en el creyente que espera.'
    ],
    g: 'La tormenta no define al creyente: lo define el Señor que camina con él en la barca.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El Señor no deja a medias: la perseverancia sostiene el milagro que viene."']
  },
  {
    a: 'maldonado',
    t: 'Santidad y poder',
    y: 2013,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre el orden del poder: no hay poder duradero sin santidad que lo sostiene.',
    x: '2 Timoteo 2:21 — "...si alguno se purificare de estas cosas, será vaso de honra, santificado y útil para los usos del maestro."',
    th: ['Santidad'],
    ol: [
      'La santidad no es opcional: es la dirección del poder.',
      'El vaso: limpio sostiene, sucio se derrama.',
      'El fruto: la unción dura en el que se conserva.'
    ],
    g: 'La santidad no es reto de perfección: es el corazón entregado en obediencia diaria.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"El poder sin santidad se evapora: solo el vaso limpio sostiene launción del Señor."']
  },
  {
    a: 'maldonado',
    t: 'El altar del creyente',
    y: 2014,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre el altar: la vida de oración del creyente que siempre se queda cerca de la Porta del Señor.',
    x: 'Génesis 8:20 — "...edificó Noé un altar al Señor, y tomó animales limpios y ofreció holocausto."',
    th: ['Adoración'],
    ol: [
      'El altar no es solo piedra: es el corazón que responde.',
      'La existencia del altar: mantener la puerta del Señor abierta.',
      'El fruto: la casa del creyente sostenida por las manos del Señor.'
    ],
    g: 'La adoración no es solo música: es la vida entera puesta sobre el altar.',
    ap: [
      'Antes de predicar, repasa la escena original: una sola frase de la ocasión ya es tu gancho.',
      'Construye 3 movimientos con la estructura del sermón; no agregues un cuarto si tu oyente no lo necesita.',
      'Cierra repitiendo la frase central dos veces: una en la emoción de la escena, otra en el desafío final.'
    ],
    q: ['"Sin altar no hay puente al cielo: vuelve cada día al momento de entregar."']
  },
  // --- Edwards (ampliación) ---
  {
    a: 'edwards',
    t: 'El peregrino cristiano',
    y: 1733,
    p: 'Northampton, Massachusetts',
    o: 'Sermón clásico sobre la fe de los patriarcas: el creyente vive aquí como peregrino de una patria mejor.',
    x: 'Hebreos 11:13-14 — "...confesando que son extranjeros y peregrinos en la tierra, porque buscan una patria."',
    th: ['Muerte y eternidad'],
    ol: [
      'La fe confiesa que esta vida no es el hogar.',
      'El peregrino camina con esperanza aunque no llegue a verla.',
      'La patria prometida es mejor que la de origen.'
    ],
    q: ['"El peregrino muere sin heredar; pero su fe hereda lo que el ojo no vio."']
  },
  {
    a: 'edwards',
    t: 'La eternidad de los tormentos del infierno',
    y: 1739,
    p: 'Northampton, Massachusetts',
    o: 'Sermón sobre Mateo 25:46: la gravedad de la separación eterna defendida contra los que suavizaban el final del impío.',
    x: 'Mateo 25:46 — "E irán éstos al castigo eterno, y los justos a la vida eterna."',
    th: ['Muerte y eternidad'],
    ol: [
      'El mismo adjetivo describe la vida y el castigo: eternos.',
      'La eternidad no divide la ira: la intensifica sin fin.',
      'El consuelo del justo: su vida también es eterna.'
    ],
    q: [
      '"La misma palabra que dice vida eterna dice castigo eterno: quien corta la una, corta la otra."'
    ]
  },
  {
    a: 'edwards',
    t: 'La justicia de Dios en la condenación de los pecadores',
    y: 1734,
    p: 'Northampton, Massachusetts',
    o: 'Sermón que blinda la justicia divina frente a las acusaciones del hombre: nadie puede acusar a Dios de tiranía.',
    x: 'Romanos 3:19 — "...para que toda boca se cierre, y todo el mundo sea sujeto al juicio de Dios."',
    th: ['Penitencia'],
    ol: [
      'Toda boca se cierra: la conciencia testifica primero.',
      'El juicio de Dios es exacto: nadie recibe más de lo que merece.',
      'La salida: solo la justicia de Cristo cubre al culpable.'
    ],
    q: ['"Antes de acusar al juez, cierra tu boca y clama por misericordia."']
  },
  {
    a: 'edwards',
    t: 'Esforzarse por entrar en el Reino',
    y: 1735,
    p: 'Northampton, Massachusetts',
    o: 'Sermón sobre la tensión del evangelio: la salvación es gracia, y aun así pide a los hombres esforzarse.',
    x: 'Lucas 16:16 — "...desde entonces el reino de Dios es anunciado, y todos se esfuerzan por entrar en él."',
    th: ['Arrepentimiento'],
    ol: [
      'El esfuerzo no es meritorio: es el hambre que busca.',
      'El pretexto mata: quien espera sentir, pierde el día.',
      'El vencedor: el que se hace violencia a sí mismo para entrar.'
    ],
    q: ['"No entran los fuertes ni los sabios: entran los que se empeñan hasta el final."']
  },
  {
    a: 'edwards',
    t: 'Sermón de despedida',
    y: 1750,
    p: 'Northampton, Massachusetts',
    o: 'Su sermón al dejar Northampton tras el conflicto de la membresía: despedida dolorosa, pastoral y lúcida ante la congregación que lo expulsó.',
    x: '2 Corintios 4:5 — "Porque no nos predicamos a nosotros mismos, sino a Cristo Jesús el Señor."',
    th: ['Crisis y prueba'],
    ol: [
      'No predico mi nombre: predico al Señor que me envió.',
      'El consuelo: los lazos de la fe no se rompen con la distancia.',
      'El deseo: verlos a todos con gozo en el día del Señor.'
    ],
    q: ['"No os he predicado a mí: os he predicado a Cristo; mi despedida no os quita nada."']
  },
  // --- Spurgeon (ampliación) ---
  {
    a: 'spurgeon',
    t: 'La tumba de Jesús',
    y: 1861,
    p: 'Tabernáculo Metropolitano, Londres',
    o: 'Sermón pascual sobre el sepulcro vacío: la tumba no es derrotada por el llanto sino por el ángel que la abre.',
    x: 'Mateo 28:6 — "No está aquí, pues ha resucitado."',
    th: ['Muerte y eternidad'],
    ol: [
      'La tumba no pudo retenerlo: el sello se rompió desde dentro.',
      'El mensaje del ángel: no está aquí, ha resucitado.',
      'El consuelo: el sepulcro del creyente ya no es puerta de fin.'
    ],
    q: ['"Ve a su tumba y arranca el lirio: el sepulcro de Jesús no tiene muerto, tiene vencedor."']
  },
  {
    a: 'spurgeon',
    t: 'El gran depósito',
    y: 1859,
    p: 'Tabernáculo Metropolitano, Londres',
    o: 'Sermón pastoral sobre el corazón: el depósito del que brotan las acciones de la vida entera.',
    x: 'Proverbios 4:23 — "Sobre toda cosa guardada, guarda tu corazón; porque de él mana la vida."',
    th: ['Santidad'],
    ol: [
      'El corazón es el depósito: lo que sale, sale de allí.',
      'El cuidado: no solo vigilar la boca, sino la fuente.',
      'El fruto: el corazón lleno de Cristo rebosa vida.'
    ],
    q: ['"Guarda el depósito: el río nunca se limpia si su fuente está sucia."']
  },
  {
    a: 'spurgeon',
    t: 'La sangre derramada',
    y: 1861,
    p: 'Tabernáculo Metropolitano, Londres',
    o: 'Sermón sobre Hebreos 9:22: sin derramamiento de sangre no hay remisión; el corazón del pacto antiguo y del nuevo.',
    x: 'Hebreos 9:22 — "...y sin derramamiento de sangre no se hace remisión."',
    th: ['Gracia'],
    ol: [
      'El principio antiguo: la vida por la vida.',
      'El cumplido: la sangre de Cristo es suficiente una vez para siempre.',
      'El consuelo: la conciencia limpiada no teme la presencia de Dios.'
    ],
    q: ['"La puerta del cielo está rociada, no decorada."']
  },
  {
    a: 'spurgeon',
    t: 'La muerte del cristiano',
    y: 1877,
    p: 'Tabernáculo Metropolitano, Londres',
    o: 'Sermón sobre Apocalipsis 14:13: la muerte del creyente es bienaventuranza, no tragedia.',
    x: 'Apocalipsis 14:13 — "...Bienaventurados de aquí en adelante los muertos que mueren en el Señor."',
    th: ['Muerte y eternidad'],
    ol: [
      'La bienaventuranza: morir en el Señor, no en la desesperación.',
      'El descanso: cesan sus trabajos, sus obras siguen.',
      'El consuelo para los que quedan: la partida es ganancia.'
    ],
    q: ['"Para el creyente, la muerte no es el fin de la vida: es el final del pecado."']
  },
  {
    a: 'spurgeon',
    t: 'Justificación por gracia',
    y: 1856,
    p: 'New Park Street Chapel, Londres',
    o: 'Sermón doctrinal de su juventud: el justo declarado gratuito, no por mérito de santos ni de pecadores.',
    x: 'Romanos 3:24 — "...siendo justificados gratuitamente por su gracia, mediante la redención que es en Cristo Jesús."',
    th: ['Gracia'],
    ol: [
      'Gratuitamente: el precio lo pagó otro.',
      'Mediante la redención: el rescate en la persona de Cristo.',
      'El fruto: el justificado no presume, adora.'
    ],
    q: ['"La fe no paga la entrada: solo entrega el billete que ya pagó Cristo."']
  },
  // --- Lloyd-Jones (ampliación) ---
  {
    a: 'lloydjones',
    t: 'El viejo hombre',
    y: 1960,
    p: 'Westminster Chapel, Londres',
    o: 'Exposición de Romanos 6:6: el creyente ya no es la persona que era; la muerte y la vida de la identidad nueva.',
    x: 'Romanos 6:6 — "...nuestro viejo hombre fue crucificado juntamente con él, para que el cuerpo del pecado sea destruido."',
    th: ['Firma y certeza'],
    ol: [
      'El hecho consumado: el viejo ya murió, no agoniza.',
      'La consecuencia: el pecado ya no es dueño, solo huésped con pretensiones.',
      'La práctica: considérate muerto al pecado y vivo para Dios.'
    ],
    q: [
      '"No peles con el viejo hombre: él ya está muerto; tú vives la vida nueva que él ya no puede habitar."'
    ]
  },
  {
    a: 'lloydjones',
    t: 'Conozco a quién he creído',
    y: 1962,
    p: 'Westminster Chapel, Londres',
    o: 'Sermón sobre 2 Timoteo 1:12: la seguridad del creyente no está en la fuerza de su fe sino en la fidelidad del objeto de su fe.',
    x: '2 Timoteo 1:12 — "...yo sé a quién he creído, y estoy seguro que es poderoso para guardar mi depósito."',
    th: ['Firma y certeza'],
    ol: [
      'No sé qué pasará: sé quién tiene la mano.',
      'El depósito guardado: mi fe descansa en su fidelidad.',
      'El fruto: la calma del que no depende de sí mismo.'
    ],
    q: ['"La seguridad del cristiano no mira adentro: mira afuera, al que lo guardó primero."']
  },
  {
    a: 'lloydjones',
    t: 'El Espíritu ayuda nuestra debilidad',
    y: 1961,
    p: 'Westminster Chapel, Londres',
    o: 'Exposición de Romanos 8:26: la oración que no sabemos hacer, la hace el Espíritu con gemidos indecibles.',
    x: 'Romanos 8:26 — "...el Espíritu nos ayuda en nuestra debilidad; lo que hemos de pedir no lo sabemos."',
    th: ['Oración'],
    ol: [
      'La debilidad no descalifica: invita la ayuda.',
      'El gemido que habla: el Espíritu intercede según Dios.',
      'El consuelo: ni tu oración rota queda fuera del trono.'
    ],
    q: ['"Cuando tu oración es un gemido, el Espíritu la traduce al idioma del cielo."']
  },
  {
    a: 'lloydjones',
    t: 'Gozo indecible',
    y: 1969,
    p: 'Westminster Chapel, Londres',
    o: 'De su serie que originó su libro Joy Unspeakable: la experiencia gozosa del Espíritu en el creyente, sin exceso ni freno.',
    x: '1 Pedro 1:8 — "...y gozáis con gozo indecible y lleno de gloria."',
    th: ['Crisis y prueba'],
    ol: [
      'El gozo sin ver: aman a quien no ven.',
      'El gozo indecible: más de lo que las palabras alcanzan.',
      'El fruto: la alegría como evidencia de la gloria futura.'
    ],
    q: ['"El gozo del creyente no lo enseña la pluma: lo da el Espíritu, y sobra."']
  },
  {
    a: 'lloydjones',
    t: 'Seréis testigos míos',
    y: 1965,
    p: 'Westminster Chapel, Londres',
    o: 'Sermón sobre Hechos 1:8: el poder del Espíritu no es adorno sino misión, desde Jerusalén hasta lo último de la tierra.',
    x: 'Hechos 1:8 — "...recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos."',
    th: ['Evangelismo'],
    ol: [
      'El poder es para el testimonio: no para el show.',
      'Los cuatro círculos: Jerusalén primero, luego la tierra entera.',
      'El fruto: la iglesia que testifica, no la que solo celebra.'
    ],
    q: ['"El Espíritu no desciende para que descanses: desciende para que testifiques."']
  },
  // --- Tozer (ampliación) ---
  {
    a: 'tozer',
    t: 'La soberanía de Dios',
    y: 1959,
    p: 'Southside Alliance Church, Chicago',
    o: 'De la enseñanza de su obra El conocimiento del Santo: Dios gobierna sin pedir permiso al hombre.',
    x: 'Romanos 11:36 — "Porque de él, y por él, y para él, son todas las cosas."',
    th: ['Firma y certeza'],
    ol: [
      'Dios reina: ni el infierno ni el hombre lo votan.',
      'La verdad que consuela: la soberanía sostiene al que sufre.',
      'El fruto: el creyente que lo cree, duerme.'
    ],
    q: ['"Dios no pide permiso a nadie para ser Dios."']
  },
  {
    a: 'tozer',
    t: 'Lo que piensas de Dios lo es todo',
    y: 1961,
    p: 'Southside Alliance Church, Chicago',
    o: 'Su frase más citada predicada: la teología popular forma la vida; un Dios pequeño produce un creyente pequeño.',
    x: 'Salmos 50:21 — "...pensabas que yo era como tú."',
    th: ['Santidad'],
    ol: [
      'La acusación: te hiciste un Dios a tu imagen.',
      'La gravedad: de tu idea de Dios brota tu vida entera.',
      'El remedio: volver a la Escritura y su retrato fiel.'
    ],
    q: ['"Lo que venga a tu mente cuando piensas en Dios, eso es lo más importante de ti."']
  },
  {
    a: 'tozer',
    t: 'La cruz mata el yo',
    y: 1953,
    p: 'Southside Alliance Church, Chicago',
    o: 'Predicó la muerte del yo como la entrada a la vida: la cruz no es decorado sino ejecución.',
    x: 'Gálatas 2:20 — "Con Cristo estoy juntamente crucificado, y ya no vivo yo, sino vive Cristo en mí."',
    th: ['Santidad'],
    ol: [
      'La cruz no dialoga con el yo: lo ejecuta.',
      'La vida nueva: no el yo mejorado, sino Cristo viviendo.',
      'El fruto: menos ansiedad, más calma.'
    ],
    q: ['"El yo que murió ya no puede ofenderse."']
  },
  {
    a: 'tozer',
    t: 'El deleite de Dios en los santos',
    y: 1955,
    p: 'Southside Alliance Church, Chicago',
    o: 'Sermón devocional sobre el gozo de Dios: no soporta a sus hijos de mala gana, se deleita en ellos.',
    x: 'Salmos 149:4 — "Porque el Señor tiene contento en su pueblo; hermoseará a los humildes con la salvación."',
    th: ['Gracia'],
    ol: [
      'Dios no soporta: se deleita.',
      'El hermoseado: el humilde recibe la salvación como vestido.',
      'El fruto: la adoración sin miedo.'
    ],
    q: ['"Dios no te tolera con un suspiro: te mira con un gozo que el cielo no puede callar."']
  },
  {
    a: 'tozer',
    t: 'La guía del Espíritu de verdad',
    y: 1952,
    p: 'Southside Alliance Church, Chicago',
    o: 'Predicó la guía del Espíritu para la vida cotidiana: no revelaciones nuevas, sino la verdad ya escrita aplicada.',
    x: 'Juan 16:13 — "Pero cuando venga el Espíritu de verdad, él os guiará a toda la verdad."',
    th: ['Oración'],
    ol: [
      'El Espíritu no inventa: habla de Cristo y su Palabra.',
      'La guía: la verdad aplicada a tu decisión concreta.',
      'El fruto: sensibilidad para el futuro, anclada en lo escrito.'
    ],
    q: ['"El que busca guía aparte de la Palabra, busca otro espíritu."']
  },
  // --- Keller (ampliación) ---
  {
    a: 'keller',
    t: 'El beso del Padre',
    y: 1998,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón de su serie El hijo pródigo y el hermano mayor: la amorosa bienvenida del padre antes que la confesión termine.',
    x: 'Lucas 15:20 — "...su padre lo vio, y corrió, y echósele al cuello, y le besó."',
    th: ['Gracia'],
    ol: [
      'El beso antes del discurso: la gracia corre primero.',
      'El abrazo del oriente: el amor que no calcula vergüenza.',
      'El fruto: la experiencia de Dios, no solo la doctrina de Dios.'
    ],
    q: ['"No necesitas solo la doctrina del Padre: necesitas su beso."']
  },
  {
    a: 'keller',
    t: 'El baile de Dios',
    y: 1998,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Segunda parte de su serie sobre el hermano mayor: el Padre sale también a buscar al moralista que no entra a la fiesta.',
    x: 'Lucas 15:31-32 — "...hijo, tú siempre estás conmigo... era necesario hacer fiesta."',
    th: ['Gracia'],
    ol: [
      'El hermano mayor también está perdido: su religión lo excluye.',
      'El padre sale otra vez: la gracia busca al decente también.',
      'El final abierto: ¿entrarás al baile?'
    ],
    q: [
      '"Dios no pide que mejores para entrar a la fiesta: pide que dejes de tratarte como empleado."'
    ]
  },
  {
    a: 'keller',
    t: 'La sabiduría verdadera',
    y: 2007,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón sobre Proverbios 3: la sabiduría no es información ni técnica, sino temor del Señor transformando el corazón.',
    x: 'Proverbios 3:5-6 — "...en todas tus cosas reconócelo, y él enderezará tus veredas."',
    th: ['Oración'],
    ol: [
      'La sabiduría empieza por confianza, no por análisis.',
      'El consejo: no apoyarte en tu propia prudencia.',
      'El fruto: veredas enderezadas por la gracia del Señor.'
    ],
    q: ['"La sabiduría no es saber más: es saber dónde poner el peso de la vida."']
  },
  {
    a: 'keller',
    t: 'La sanación de la ira',
    y: 2006,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón pastoral sobre la ira: su raíz, su engaño y su cura en la gracia que recibe todo de gracia.',
    x: 'Efesios 4:31 — "Quítense de vosotros toda amargura, y enojo, e ira, y gritería, y maledicencia."',
    th: ['Crisis y prueba'],
    ol: [
      'La raíz: la ira nace de un ídolo herido.',
      'El engaño: creer que el enojo da control cuando lo roba.',
      'El fruto: la amargura se desmonta donde la gracia entra.'
    ],
    q: ['"No hay ira sin un ídolo: algo que querías más que a Dios se rompió."']
  },
  {
    a: 'keller',
    t: 'La guerra entre tus mismos',
    y: 1992,
    p: 'Redeemer Presbyterian Church, Nueva York',
    o: 'Sermón sobre Romanos 7: la interioridad del creyente dividido, entre la ley del pecado y la ley del Espíritu.',
    x: 'Romanos 7:21-25 — "...hallo esta ley: que queriendo hacer el bien, el mal se me presenta."',
    th: ['Crisis y prueba'],
    ol: [
      'La guerra interna no es falta de conversión: es señal de vida nueva.',
      'El desespero: ¿quién me librará?',
      'El socorro: la gracia de Dios por Jesucristo Señor nuestro.'
    ],
    q: ['"El impío vive en paz consigo; el creyente vive en guerra, y esa guerra es esperanza."']
  },
  // --- Lutero (ampliación) ---
  {
    a: 'luther',
    t: 'El sermón de la Pasión',
    y: 1522,
    p: 'Wittenberg, Alemania',
    o: 'De su Postilla de Cuaresma: la pasión de Cristo narrada como consuelo del pecador que ve el precio de su rescate.',
    x: 'Isaías 53:5 — "...y por sus llagas fuimos nosotros sanados."',
    th: ['Gracia'],
    ol: [
      'La escena: el inocente cargando la culpa ajena.',
      'El propósito: no el drama, sino la redención cumplida.',
      'El consuelo: tu conciencia encuentra paz en sus heridas.'
    ],
    q: ['"Mira tus pecados en las llagas de Cristo: allí fueron puestos y allí fueron pagados."']
  },
  {
    a: 'luther',
    t: 'El deudor sin pago',
    y: 1527,
    p: 'Wittenberg, Alemania',
    o: 'Postilla sobre la parábola del siervo implacable: la deuda imposible que el Rey perdonó y la petty porción que no quiso perdonar.',
    x: 'Mateo 18:27 — "...compadecido aquel señor de su siervo, le perdió la deuda y le dejó ir."',
    th: ['Gracia', 'Penitencia'],
    ol: [
      'La deuda: diez mil talentos, imposibles de pagar.',
      'La compasión: el Rey pierde la deuda que nadie podía cubrir.',
      'El peligro: el perdonado que no perdona rompe el retrato de la gracia.'
    ],
    q: ['"Dios perdió la cuenta de tu deuda para que tú no tengas la corota de otra."']
  },
  {
    a: 'luther',
    t: 'Sobre el matrimonio',
    y: 1525,
    p: 'Wittenberg, Alemania',
    o: 'Sermón en su propia boda y en las bodas de la ciudad: el matrimonio como escuela de fe y refugio de gracia.',
    x: 'Génesis 2:24 — "...por tanto, dejará el hombre a su padre y a su madre, y se unirá a su mujer."',
    th: ['Santidad'],
    ol: [
      'El matrimonio es obra de Dios: no trato de posesiones.',
      'La escuela: en el hogar se aprende lo que no enseña el púlpito.',
      'El consuelo: el amor cotidiano es forma de fe.'
    ],
    q: ['"Casa sin cruz no forma cristianos: en la mesa del hogar se aprende a perdonar."']
  },
  {
    a: 'luther',
    t: 'La confesión',
    y: 1521,
    p: 'Wittenberg, Alemania',
    o: 'De su enseñanza sobre la confesión: la que sana no es la lista minuciosa, sino la fe que se dirige al único que perdona.',
    x: 'Santiago 5:16 — "...confesaos vuestras ofensas unos a otros, y orad unos por otros, para que seáis sanados."',
    th: ['Penitencia'],
    ol: [
      'La confesión sana al que la hace: el peso se alivia.',
      'La dirección correcta: al hermano y al Señor, no al mercado de acusaciones.',
      'El consuelo: la absolución es palabra de Cristo, no trámite humano.'
    ],
    q: ['"Confesar es abrir la ventana: el pecado que se airea, se seca."']
  },
  {
    a: 'luther',
    t: 'El siervo implacable',
    y: 1526,
    p: 'Wittenberg, Alemania',
    o: 'Exposición del mismo capítulo de Mateo 18 en su predicación continua: el perdón recibido que no perdonar.',
    x: 'Mateo 18:35 — "Así también mi Padre celestial hará con vosotros, si no perdonáis de todo corazón."',
    th: ['Penitencia'],
    ol: [
      'El perdón recibido obliga: el perdonado vive perdonando.',
      'El encierro: la cadena del rencor la forja el que la lleva.',
      'El fruto: el corazón blando del que se acordó de su propia deuda.'
    ],
    q: ['"El que se acuerda de cuánto le perdonaron, no puede pedirle la cadena a su hermano."']
  },
  // --- Calvino (ampliación) ---
  {
    a: 'calvino',
    t: 'Gedeón y la lana',
    y: 1560,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua del libro de Jueces: la fe pequeña del héroe que pide señales y el Dios que las concede con paciencia.',
    x: 'Jueces 6:36-37 — "...y haré extender la lana en el piso."',
    th: ['Firma y certeza'],
    ol: [
      'La debilidad no lo descalifica: el héroe es el cobarde que obedece.',
      'La lana: Dios confirma la fe que tiembla.',
      'El ejército menguado: la victoria es del Señor, no del número.'
    ],
    q: ['"Dios no desprecia la fe temblorosa: la sostiene hasta que camina sola."']
  },
  {
    a: 'calvino',
    t: 'La amistad de Jonatán',
    y: 1555,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua de 1 Samuel: Jonatán, heredero del trono que cede su lugar a la promesa de otro.',
    x: '1 Samuel 20:17 — "...Jonatán volvió a jurar a David, porque le amaba como a sí mismo."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La amistad que ama más que el trono.',
      'La humildad: el heredero que se alegra del que ocupará su lugar.',
      'El retrato: Jonatán figura del que desciende para dar su herencia.'
    ],
    q: ['"La verdadera amistad cristiana se prueba cuando la bendición del otro no te cuesta."']
  },
  {
    a: 'calvino',
    t: 'Enarración del Salmo 1: los dos caminos',
    y: 1552,
    p: 'St. Pierre, Ginebra',
    o: 'De sus comentarios orales a los Salmos, recopilados por sus discípulos: el árbol junto a las aguas contra la paja del viento.',
    x: 'Salmos 1:3 — "Será como el árbol plantado junto a corrientes de aguas."',
    th: ['Santidad'],
    ol: [
      'El consejo no sigue: los impíos se pasean, el justo no acompaña.',
      'El alimento: la ley del Señor meditada de día y de noche.',
      'El fruto en su tiempo: lo que da raíz, no se marchita.'
    ],
    q: ['"El árbol no se esfuerza por dar fruto: da porque bebe; meditar es beber."']
  },
  {
    a: 'calvino',
    t: 'Enarración del Salmo 50: la misericordia',
    y: 1552,
    p: 'St. Pierre, Ginebra',
    o: 'Su exposición más celebrada de los Salmos: el salmo del perdón de David como espejo de la misericordia divina.',
    x: 'Salmos 50:12 — "Descubre mi culpa, libérame del pecado de mi sangre."',
    th: ['Gracia'],
    ol: [
      'El asalto: contra Dios y solo contra Dios pecó.',
      'La petición: el corazón nuevo no se fabrica, se crea.',
      'El fruto: el perdonado enseña a otros su camino.'
    ],
    q: ['"El perdón no borra solo la falta: crea el corazón que no volverá a vivir de ella."']
  },
  {
    a: 'calvino',
    t: 'Los cuatro pilares de la comunidad',
    y: 1550,
    p: 'St. Pierre, Ginebra',
    o: 'Exposición continua de Hechos: la iglesia devota que perseveró en doctrina, comunión, pan y oraciones.',
    x: 'Hechos 2:42 — "...perseveraban en la doctrina de los apóstoles, en la comunión unos con otros, en el partimiento del pan, y en las oraciones."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La doctrina: la Palabra no se negocia.',
      'La comunión: el cuerpo se sostiene si comparte.',
      'La oración: el horno del que sale el fuego de la comunidad.'
    ],
    q: ['"Una iglesia que descuida el cuarto pilar, envejece el edificio que la sostiene."']
  },
  // --- Agustín (ampliación) ---
  {
    a: 'agustin',
    t: 'Enarración del Salmo 30: de la angustia al gozo',
    y: 400,
    p: 'Hipona, África romana',
    o: 'Exposición de su comunidad en tribulación: el salmo que enseña a pasar del llanto a la alabanza con la misma boca.',
    x: 'Salmos 30:5 — "Su ira dura un momento; en su voluntad está la vida."',
    th: ['Crisis y prueba'],
    ol: [
      'La queja honesta: el salmo empieza en el llanto.',
      'El giro: la misma boca que lloró, alaba.',
      'El fruto: la tristeza de la noche no es el final del día.'
    ],
    q: ['"El salmo enseña a llorar con la boca abierta: se queja y alaba con la misma voz."']
  },
  {
    a: 'agustin',
    t: 'Enarración del Salmo 22: el Buen Pastor',
    y: 400,
    p: 'Hipona, África romana',
    o: 'Exposición del salmo más predicado de la historia cristiana temprana: el Señor que no me falta.',
    x: 'Salmos 22:1 — "El Señor es mi pastor; nada me faltará."',
    th: ['Firma y certeza'],
    ol: [
      'La provisión: el pastor provee antes de que el rebaño pregunte.',
      'El valle: el peligro no lo saca del salmo.',
      'La casa: el final del peregrinaje es la mesa del Padre.'
    ],
    q: ['"El salmo no promete camino sin valle: promete Pastor en el valle."']
  },
  {
    a: 'agustin',
    t: 'Enarración del Salmo 118: la ley del amor',
    y: 404,
    p: 'Hipona, África romana',
    o: 'Exposición del salmo más largo en sus series sobre los Salmos: la ley del Señor como medicina y no como carga.',
    x: 'Salmos 118:105 — "Lámpara es a mis pies tu palabra, y lumbrera a mi camino."',
    th: ['Oración'],
    ol: [
      'La lámpara: la Palabra no ilumina la pregunta, ilumina el paso.',
      'La ley del amor: obedecer con gusto, no con reloj.',
      'El fruto: el creyente que ama la ley, se libera del miedo a la vida.'
    ],
    q: ['"La ley de Dios se pisa con pies ligeros cuando el corazón la ama primero."']
  },
  {
    a: 'agustin',
    t: 'Sobre el espíritu y la letra',
    y: 412,
    p: 'Hipona, África romana',
    o: 'Tratado contra los que volvían a la ley: la letra que mata y el espíritu que vivifica, predicado con la fuerza del evangelio.',
    x: '2 Corintios 3:6 — "...la letra mata, mas el espíritu vivifica."',
    th: ['Gracia'],
    ol: [
      'La letra mata: la ley que promete y no da fuerza.',
      'El espíritu vivifica: la gracia que da lo que la ley exigía.',
      'El fruto: menos acusación, más alabanza.'
    ],
    q: ['"La ley demandaba lo que no daba; la gracia da lo que demandaba."']
  },
  {
    a: 'agustin',
    t: 'Sobre la gracia y el libre albedrío',
    y: 426,
    p: 'Hipona, África romana',
    o: 'Tratado pastoral a los monjes de Adrumeto: la gracia que no anula la voluntad sino que la sana y la capacita.',
    x: 'Filipenses 2:13 — "Porque Dios es el que en vosotros produce así el querer como el hacer."',
    th: ['Gracia'],
    ol: [
      'El albedrío herido no pierde su valor: pierde su sanidad.',
      'La gracia sana el querer: Dios produce el querer y el hacer.',
      'El fruto: la libertad no se pierde, se recupera.'
    ],
    q: ['"La gracia no rompe tu voluntad: la repara para que pueda querer lo que la libera."']
  },
  // --- Crisóstomo (ampliación) ---
  {
    a: 'chrysostom',
    t: 'Homilías sobre Efesios: el matrimonio',
    y: 403,
    p: 'Constantinopla',
    o: 'Sus homilías matrimoniales más famosas: el amor del esposo retratado en el amor de Cristo a la Iglesia.',
    x: 'Efesios 5:25 — "Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia."',
    th: ['Santidad'],
    ol: [
      'El amor del esposo no es dominio: es entrega.',
      'El peso del amor: llevar el costo primero.',
      'El fruto: el hogar que refleja el evangelio.'
    ],
    q: ['"No es señor el que ama primero: es siervo; y en ese siervo está la casa."']
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Hebreos: la fe de los vencedores',
    y: 402,
    p: 'Constantinopla',
    o: 'Exposición de Hebreos 11: los que vencieron no por fuerza sino por fe, con la lista de los que el mundo no valió.',
    x: 'Hebreos 11:33-34 — "...por la fe conquistaron reinos, hicieron justicia, alcanzaron promesas."',
    th: ['Firma y certeza'],
    ol: [
      'Los vencedores: la fe que no mide el oponente.',
      'Los sufrientes: el mundo no era digno de ellos.',
      'El fruto: la lista del cielo no la escriben las estadísticas.'
    ],
    q: ['"El mundo no era digno de los que la fe sostuvo."']
  },
  {
    a: 'chrysostom',
    t: 'Sobre la vana gloria y la educación de los hijos',
    y: 390,
    p: 'Antioquía, Siria',
    o: 'Discurso célebre a los padres de Antioquía: la educación de los hijos como primer campo de la santidad.',
    x: 'Proverbios 22:6 — "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él."',
    th: ['Santidad'],
    ol: [
      'La primera escuela: la casa, no la ciudad.',
      'El padre maestro: el ejemplo pesa más que la advertencia.',
      'El fruto: el hijo que ve a Dios en la casa no lo pierde en la calle.'
    ],
    q: ['"No hay maestro como el ejemplo del padre: el hijo no escucha la doctrina, ve la casa."']
  },
  {
    a: 'chrysostom',
    t: 'Los sermones de las Estatuas',
    y: 387,
    p: 'Antioquía, Siria',
    o: 'Su serie más dramática: predicó ante la ciudad que esperaba el castigo del emperador; la misericordia que salva la comunidad entera.',
    x: 'Jonás 3:10 — "...y Dios se apartó del mal que había dicho que les haría."',
    th: ['Penitencia'],
    ol: [
      'La ciudad tembló: el púlpito llamó a arrepentirse colectivamente.',
      'El ejemplo de Nínive: la ciudad que se convirtió y fue perdonada.',
      'El desenlace real: el emperador perdonó; los sermones salvaron la ciudad.'
    ],
    q: ['"La ciudad que se arrepiente de veras no recibe el golpe: la misericordia la adopta."']
  },
  {
    a: 'chrysostom',
    t: 'Homilías sobre Romanos: el cuerpo vivo',
    y: 392,
    p: 'Antioquía, Siria',
    o: 'Exposición de Romanos 12: presentar el cuerpo como sacrificio vivo, el culto cotidiano del creyente.',
    x: 'Romanos 12:1 — "...presentéis vuestros cuerpos en sacrificio vivo, santo, agradable a Dios."',
    th: ['Adoración'],
    ol: [
      'El sacrificio vivo: no muerto, no escondido, entregado.',
      'El culto racional: la vida diaria como ofrenda.',
      'El fruto: la transfiguración del creyente en su calle.'
    ],
    q: ['"El sacrificio vivo no vive para sí: vive para el altar que lo recibió."']
  },
  // --- Whitefield (ampliación) ---
  {
    a: 'whitefield',
    t: 'La gloria de la gracia de Dios',
    y: 1739,
    p: 'Londres (al aire libre)',
    o: 'Sermón sobre Efesios 1:6: la gracia que no se mide por el mérito del que la recibe sino por la gloria del que la da.',
    x: 'Efesios 1:6 — "...haciéndonos aceptos a sí en el Amado."',
    th: ['Gracia'],
    ol: [
      'La gracia alabada: el acepto está en el Amado, no en mí.',
      'El orgullo roto: nadie puede jactarse ante la gloria de la gracia.',
      'El fruto: el creyente que se goza de ser acepto por otro.'
    ],
    q: [
      '"Dios no te hace acepto por tu mérito: te hace acepto en el Amado; tu mérito es el de otro."'
    ]
  },
  {
    a: 'whitefield',
    t: 'Caminar con Dios',
    y: 1738,
    p: 'Londres (al aire libre)',
    o: 'Sermón sobre Enoc, su favorito pastoral: la fe que camina con Dios en la vida cotidiana del creyente.',
    x: 'Génesis 5:24 — "Caminó, pues, Enoc con Dios, y desapareció, porque le llevó Dios."',
    th: ['Santidad'],
    ol: [
      'Caminar: no es un episodio, es un trayecto.',
      'Con Dios: el compañero que no se cansa.',
      'El fruto: el trayecto que termina en el cielo sin pasar por la tumba.'
    ],
    q: ['"Enoc caminó trescientos años y no fue, porque su camino terminó en el cielo."']
  },
  {
    a: 'whitefield',
    t: 'El gran deber de la religión familiar',
    y: 1740,
    p: 'Londres (al aire libre)',
    o: 'Sermón sobre Josué 24: la casa como primer templo del creyente; el deber de orar en familia.',
    x: 'Josué 24:15 — "...yo y mi casa serviremos al Señor."',
    th: ['Oración'],
    ol: [
      'La casa decide: cada generación elige su altar.',
      'El altar cotidiano: orar en familia es el templo diario.',
      'El fruto: la casa que ora sobrevive a la casa que solo critica.'
    ],
    q: ['"No hay casa más segura que la que cada noche cierra con una oración."']
  },
  {
    a: 'whitefield',
    t: 'El poder de la resurrección de Cristo',
    y: 1741,
    p: 'Londres (al aire libre)',
    o: 'Sermón pascual de su predicación al aire libre: la resurrección como la fuerza que sostiene al creyente entero.',
    x: 'Filipenses 3:10 — "...conociendo el poder de su resurrección."',
    th: ['Muerte y eternidad'],
    ol: [
      'El poder: no solo doctrina, sino energía nueva.',
      'La analogía: el creyente vive de la vida de otro.',
      'El fruto: la esperanza que no depende del sepulcro.'
    ],
    q: ['"La fuerza del creyente no viene de su fuerza: viene de la vida que se levantó primero."']
  },
  {
    a: 'whitefield',
    t: 'La luz del mundo',
    y: 1742,
    p: 'Londres (al aire libre)',
    o: 'Sermón sobre Mateo 5:14: el creyente que es luz no por mérito propio sino por la gracia que lo prende.',
    x: 'Mateo 5:14 — "Vosotros sois la luz del mundo."',
    th: ['Santidad'],
    ol: [
      'La luz no se justifica: brilla.',
      'La similitud: una ciudad no se esconde.',
      'El fruto: el mundo ve por el creyente que no se apaga.'
    ],
    q: ['"La lámpara no discute con la oscuridad: enciende y deja que el mundo vea."']
  },
  {
    a: 'whitefield',
    t: 'La oración de la fe',
    y: 1743,
    p: 'Londres (al aire libre)',
    o: 'Sermón sobre Santiago 5: la oración del justo que avanza porque Dios la escucha de verdad.',
    x: 'Santiago 5:16 — "...la oración ferviente del justo, mucho puede."',
    th: ['Oración'],
    ol: [
      'La oración ferviente: no es intensidad de voz, sino de confianza.',
      'El justo: no perfecto, sino perdonado.',
      'El fruto: mucho puede la oración que Dios escucha.'
    ],
    q: ['"La oración ferviente no grita al cielo: le confía."']
  },
  // --- Wesley (ampliación) ---
  {
    a: 'wesley',
    t: 'Despiértate, tú que duermes',
    y: 1742,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 3 de su colección estándar, predicado con Whitefield entre los oyentes: la llamada a la iglesia dormida.',
    x: 'Efesios 5:14 — "Despiértate, tú que duermes, y alzate de los muertos, y te alumbra Cristo."',
    th: ['Arrepentimiento'],
    ol: [
      'La llamada no es para impíos: es para la iglesia dormida.',
      'El levantarse: de los muertos, no solo de la silla.',
      'El consuelo: Cristo mismo alumbra al que se levanta.'
    ],
    q: ['"El mayor peligro del creyente no es el infierno: es dormir de pie."']
  },
  {
    a: 'wesley',
    t: 'El cristianismo escriturario',
    y: 1741,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 4 de su colección estándar, predicado en la Universidad de Oxford: qué es cristianismo según la Escritura, no según la moda.',
    x: 'Hechos 4:31 — "...y hablaban la palabra de Dios con confianza."',
    th: ['Firma y certeza'],
    ol: [
      'La definición: no costumbre, no moral, no religión de moda.',
      'La médula: la fe viva que habla con confianza.',
      'El fruto: el creyente que no le teme a la Palabra.'
    ],
    q: [
      '"El cristianismo no es un vestido que se cambia de moda: es el cuerpo que no se sustituye."'
    ]
  },
  {
    a: 'wesley',
    t: 'La justicia de la fe',
    y: 1747,
    p: 'Oxford, Inglaterra',
    o: 'Sermón 6 de su colección estándar: la justicia que no se fabrica sino que se recibe por fe.',
    x: 'Romanos 10:6 — "...la justicia que es por la fe, dice así: No digas en tu corazón: ¿Quién subirá al cielo?"',
    th: ['Gracia'],
    ol: [
      'No subas: la justicia ya bajó con Cristo.',
      'ElAccessType: la fe que no fabrica, recibe.',
      'El fruto: el creyente que deja de contar sus méritos.'
    ],
    q: [
      '"La justicia de la fe no fabrica: recibe; y la que recibe, se hace visible en el prójimo."'
    ]
  },
  {
    a: 'wesley',
    t: 'Sobre el Sermón del Monte: las bienaventuranzas',
    y: 1750,
    p: 'Bristol, Inglaterra',
    o: 'Sermón 8, su primera exposición del Sermón del Monte: el retrato completo del cristiano que bendice por gracia.',
    x: 'Mateo 5:1-12 — Las bienaventuranzas.',
    th: ['Santidad'],
    ol: [
      'El retrato: las bienaventuranzas no son consejos, son el rostro de Cristo.',
      'El centro: el pobre en espíritu que deja de apoyarse en sí.',
      'El fruto: la bendición que no se calcula, se recibe.'
    ],
    q: [
      '"Las bienaventuranzas no describen a los especiales: describen a los que se dejaron describir por la gracia."'
    ]
  },
  {
    a: 'wesley',
    t: 'El gran privilegio de los hijos de Dios',
    y: 1765,
    p: 'Londres, Inglaterra',
    o: 'Sermón sobre Juan 1:12: el derecho dado a los que creen de llegar a ser hijos de Dios.',
    x: 'Juan 1:12 — "Mas a todos los que le recibieron, les dio potestad de ser hechos hijos de Dios."',
    th: ['Gracia'],
    ol: [
      'El privilegio no lo heredan: lo reciben los que creen.',
      'La filiación: no nombre, sino naturaleza nueva.',
      'El fruto: la casa del Padre ya no es ajena.'
    ],
    q: ['"El que recibe a Cristo recibe el nombre de hijo: ya no es huésped, es familia."']
  },
  // --- Bossuet (ampliación) ---
  {
    a: 'bossuet',
    t: 'Oración fúnebre del Príncipe de Condé',
    y: 1687,
    p: 'Capilla del Convento de los Jesuitas, París',
    o: 'Su oración fúnebre más célebre: el gran general rebelde de Francia retratado con grandeza y juicio a la vez.',
    x: 'Salmos 89:48 — "¿Qué hombre vivirá y no verá muerte?"',
    th: ['Muerte y eternidad'],
    ol: [
      'La grandeza humana: victorias que el tiempo devuelve al polvo.',
      'La rebelión: el hombre grande que se batió contra su rey.',
      'La misericordia: el Dios que perdona lo que el mundo no olvida.'
    ],
    q: ['"El héroe muere con su espada: pero su alma depende de otra mano."']
  },
  {
    a: 'bossuet',
    t: 'Oración fúnebre por María Teresa de Austria',
    y: 1683,
    p: 'Iglesia de Saint-Denis, París',
    o: 'Predicó ante la corte la muerte de la reina consorte: la humildad de una reina que vivió en silencio y murió sin ruido.',
    x: 'Proverbios 31:28 — "...y su marido la alaba."',
    th: ['Muerte y eternidad'],
    ol: [
      'La reina silenciosa: la grandeza que no habla.',
      'El dolor real: la corte entera ante el vacío del palacio.',
      'La lección: la humildad que sirve es la que dura.'
    ],
    q: ['"Hay grandezas que solo se ven cuando la tumba las tapa."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la Circuncisión',
    y: 1681,
    p: 'Capilla real, París',
    o: 'De sus sermones de Año Nuevo sobre la Circuncisión del Señor: el primer día de la vida de Cristo en la ley.',
    x: 'Lucas 2:21 — "...cumplidos los ocho días para circuncidar al niño, se llamó su nombre JESÚS."',
    th: ['Gracia'],
    ol: [
      'El octavo día: el Salvador se somete a la ley que vino a cumplir.',
      'El nombre: Jesús, el que salva, ya está puesto.',
      'El fruto: el creyente que comienza el año sometido a la Palabra.'
    ],
    q: [
      '"El Rey se sometió a la ley el día de su nombre: al creyente le basta guardar el suyo con fe."'
    ]
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la penitencia',
    y: 1660,
    p: 'Capilla real, París',
    o: 'De sus sermones de Cuaresma ante la corte: la penitencia como el arrepentimiento que llega antes del final.',
    x: 'Lucas 13:5 — "...si no os arrepintiereis, todos pereceréis."',
    th: ['Penitencia'],
    ol: [
      'La advertencia: no esperes el golpe para mirar el corazón.',
      'La penitencia real: no gesto externo, sino vuelta sincera.',
      'El fruto: la misericordia abraza al que vuelve de veras.'
    ],
    q: ['"El que espera el último suspiro para arrepentirse, espera el imposible."']
  },
  {
    a: 'bossuet',
    t: 'Sermón sobre la humildad',
    y: 1666,
    p: 'Capilla real, París',
    o: 'De sus sermones morales ante la corte de Versalles: la humildad como la virtud que ni el trono puede fabricar.',
    x: 'Lucas 14:11 — "...todo el que se ensalza, será humillado; y el que se humilla, será ensalzado."',
    th: ['Santidad'],
    ol: [
      'La soberbia se pasea en los grandes salones.',
      'La humildad: no se fabrica con esfuerzo, se recibe con la gracia.',
      'El fruto: el que se abaja, el cielo lo sube.'
    ],
    q: ['"La humildad no es algo que el hombre se pone: es algo que la gracia le da."']
  },
  // --- Graham (ampliación) ---
  {
    a: 'graham',
    t: 'El mensaje de la cruz',
    y: 1999,
    p: 'Grabación de televisión mundial',
    o: 'Su mensaje final grabado para televisión y proyectado en decenas de países después de su retiro: la cruz como el mensaje que no cambia.',
    x: '1 Corintios 1:18 — "Porque la palabra de la cruz es locura a los que se pierden; pero a los que se salvan, es poder de Dios."',
    th: ['Evangelismo', 'Gracia'],
    ol: [
      'La cruz: locura para los sabios, poder para el creyente.',
      'El mensaje no cambia: ni por moda, ni por época.',
      'El fruto: el que lo cree, vive diferente para siempre.'
    ],
    q: ['"La cruz no pide que seas mejor: pide que reconozcas tu necesidad y vengas."']
  },
  {
    a: 'graham',
    t: 'El cielo',
    y: 2005,
    p: 'Últimos mensajes públicos, Estados Unidos',
    o: 'Su predicación sobre el hogar eterno, recogida en su libro final: el cielo no es una conjetura sino una herencia.',
    x: 'Juan 14:2 — "En la casa de mi Padre muchas moradas hay."',
    th: ['Muerte y eternidad'],
    ol: [
      'El cielo no es un estado mental: es un lugar real preparado.',
      'La esperanza del creyente: la herencia que no se corrompe.',
      'El fruto: vivir hoy como quien ya sabe a dónde va.'
    ],
    q: ['"El cielo no es una conjetura humana: es una casa preparada."']
  },
  {
    a: 'graham',
    t: '¿Quién es Jesús?',
    y: 1958,
    p: 'Cruzada de San Francisco, Estados Unidos',
    o: 'Sermón evangelístico sobre la identidad de Cristo: la pregunta que ningún adulto se salva de responder.',
    x: 'Mateo 16:15 — "¿Quién decís que soy yo?"',
    th: ['Evangelismo'],
    ol: [
      'La pregunta de Jesús: personal, no teórica.',
      'Las respuestas del mundo: profeta, maestro, héroe... y no bastan.',
      'La confesión: el Cristo vivo, Hijo de Dios.'
    ],
    q: [
      '"La pregunta de Jesús no tiene sustitutos: o lo recibes o lo rechazas; no hay tercera puerta."'
    ]
  },
  {
    a: 'graham',
    t: 'La paz con Dios',
    y: 1963,
    p: 'Cruzada de Bogotá, Colombia',
    o: 'Sermón evangelístico en tiempos de agitación social: la paz que el mundo no puede dar y Dios sí entrega.',
    x: 'Romanos 5:1 — "Justificados, pues, por la fe, tenemos paz para con Dios."',
    th: ['Gracia'],
    ol: [
      'El mundo busca la paz por fuera: Dios la da por dentro.',
      'La paz no es acuerdo: es reconciliación con Dios.',
      'El fruto: el creyente en paz no vive en guerra consigo mismo.'
    ],
    q: ['"La paz del mundo se negocia; la de Dios se recibe."']
  },
  {
    a: 'graham',
    t: 'La victoria en Cristo',
    y: 1965,
    p: 'Cruzada de Lima, Perú',
    o: 'Predicó la victoria del creyente: no el triunfo del que se esfuerza, sino el del que ya está en Cristo.',
    x: '1 Corintios 15:57 — "Mas gracias sean dadas a Dios, que nos da la victoria por medio de nuestro Señor Jesucristo."',
    th: ['Firma y certeza'],
    ol: [
      'La victoria no se gana: se recibe en Cristo.',
      'El enemigo mayor: la muerte, ya desarmada.',
      'El fruto: el creyente firme que no vive de sus emociones.'
    ],
    q: ['"La victoria no es una promesa del futuro: es un hecho del presente en Cristo."']
  },
  // --- MacArthur (ampliación) ---
  {
    a: 'macarthur',
    t: 'El perdón de los pecados',
    y: 1987,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Sermón sobre Colosenses 2: la deuda cancelada en la cruz; el perdón como acto legal consumado.',
    x: 'Colosenses 2:13-14 — "...os dio vida juntamente con él, perdonándoos todos los pecados; anuló el acta de los decretos contra nosotros."',
    th: ['Gracia'],
    ol: [
      'El acta clavada en la cruz: la deuda legal cancelada.',
      'El perdón completo: no hay cargos pendientes.',
      'El fruto: la conciencia que deja de negociar con el cielo.'
    ],
    q: ['"El acta de tu deuda no está pendiente: está clavada en la cruz."']
  },
  {
    a: 'macarthur',
    t: 'El justo vivirá por la fe',
    y: 1993,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Exposición de Romanos 1:17: la frase que encendió la Reforma, explicada sin adornos para la iglesia de hoy.',
    x: 'Romanos 1:17 — "...el justo por la fe vivirá."',
    th: ['Firma y certeza'],
    ol: [
      'La revelación: en el evangelio se descubre la justicia de Dios.',
      'De fe en fe: la vida entera del creyente se sostiene igual.',
      'El fruto: la vida diaria no cambia de método.'
    ],
    q: [
      '"No se empieza por fe y se continúa por esfuerzo: el justo vivirá por la fe de principio al fin."'
    ]
  },
  {
    a: 'macarthur',
    t: 'La mentira de la prosperidad',
    y: 1998,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Confrontación directa del evangelio de la prosperidad: la piedad como medio de ganancia refutada con la Escritura.',
    x: '1 Timoteo 6:6 — "...es gran ganancia la piedad, cuando se acompaña de contentamiento."',
    th: ['Idolatría del corazón'],
    ol: [
      'El evangelio no es un medio de ganancia: es la vida en Cristo.',
      'El contentamiento: la ganancia verdadera del creyente.',
      'El peligro: la fe que se fabrica para vender se corrompe.'
    ],
    q: ['"Un evangelio que enriquece al predicador empobrece al oyente."']
  },
  {
    a: 'macarthur',
    t: 'El liderazgo del siervo',
    y: 2002,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Sermón sobre Marcos 10: el liderazgo cristiano invertido: el que quiere ser grande, siervo de todos.',
    x: 'Marcos 10:45 — "...el Hijo del Hombre no vino para ser servido, sino para servir."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'El modelo: Cristo, el líder que lavó pies.',
      'La inversión: grandeza por servicio, no por cargo.',
      'El fruto: la iglesia que se sirve a sí misma, no se sostiene.'
    ],
    q: ['"El líder cristiano no escala: desciende; su trono es una toalla."']
  },
  {
    a: 'macarthur',
    t: 'La columna y apoyo de la verdad',
    y: 1995,
    p: 'Grace Community Church, Los Ángeles',
    o: 'Sermón sobre 1 Timoteo 3:15: la iglesia como sostén de la verdad en una época de doctrinas sueltas.',
    x: '1 Timoteo 3:15 — "...la casa de Dios, que es la iglesia del Dios vivo, columna y apoyo de la verdad."',
    th: ['Firma y certeza'],
    ol: [
      'La iglesia sostiene la verdad: no la inventa.',
      'El peligro: doctrinas que se estiran para agradar.',
      'El fruto: el creyente que no cambia la columna por el papel pintado.'
    ],
    q: ['"Si la columna se pinta de modas, la casa entera se cae."']
  },
  // --- Stanley (ampliación) ---
  {
    a: 'stanley',
    t: 'Cómo conocer la voluntad de Dios',
    y: 1992,
    p: 'First Baptist Church, Atlanta',
    o: 'Su Principio de Vida N.º 3: Dios mueve cielo y tierra para revelar su voluntad al que de verdad la quiere conocer y cumplir.',
    x: 'Salmos 32:8 — "Te haré entender, y te enseñaré el camino en que debes andar."',
    th: ['Oración'],
    ol: [
      'La condición: querer conocer, no solo saber.',
      'El método: Dios revela paso a paso, no todo de golpe.',
      'El fruto: el creyente que camina con mapa y con mano.'
    ],
    q: ['"Dios no esconde su voluntad de los que de verdad la quieren cumplir."']
  },
  {
    a: 'stanley',
    t: 'La disciplina del Señor',
    y: 2003,
    p: 'First Baptist Church, Atlanta',
    o: 'Enseñanza sobre Hebreos 12: el castigo no es rechazo; la disciplina es prueba de filiación.',
    x: 'Hebreos 12:7 — "Si soportáis el castigo, Dios os trata como a hijos."',
    th: ['Crisis y prueba'],
    ol: [
      'La disciplina prueba: el hijo que se disciplina es el que se ama.',
      'La forma: dolor breve que produce fruto duradero.',
      'El fruto: el creyente que entiende la mano, no la confunde con el abandono.'
    ],
    q: ['"El castigo de Dios nunca es rechazo: siempre es formación."']
  },
  {
    a: 'stanley',
    t: 'El gozo de la presencia de Dios',
    y: 1999,
    p: 'First Baptist Church, Atlanta',
    o: 'Sermón devocional sobre el Salmo 16: la vida en la presencia del Señor como el camino del gozo.',
    x: 'Salmos 16:11 — "...me mostrarás la senda de la vida; en tu presencia hay plenitud de gozo."',
    th: ['Adoración'],
    ol: [
      'La senda: la vida se aprende en su presencia.',
      'La plenitud: el gozo que sobra, no el que se compra.',
      'El fruto: el creyente que vive de la presencia, no de la opinión.'
    ],
    q: ['"Nada llena como su presencia: el gozo del creyente no se termina en el altar."']
  },
  {
    a: 'stanley',
    t: 'Las consecuencias de la desobediencia',
    y: 2001,
    p: 'First Baptist Church, Atlanta',
    o: 'Sermón sobre 1 Samuel 15: la advertencia de Saúl: la desobediencia que se disfraza de religión.',
    x: '1 Samuel 15:22 — "...más es la obediencia que el sacrificio."',
    th: ['Penitencia'],
    ol: [
      'El truco: la religión que compensa la desobediencia.',
      'La advertencia: el sacrificio no sustituye la obediencia.',
      'El fruto: el creyente que obedece no necesita pedir perdón doble.'
    ],
    q: ['"No compensa lo que no se hizo: el altar no paga la cuenta del corazón."']
  },
  {
    a: 'stanley',
    t: 'La bendición de la fidelidad',
    y: 2010,
    p: 'First Baptist Church, Atlanta',
    o: 'Sermón sobre Mateo 25: la fidelidad en lo poco como la medida del Reino.',
    x: 'Mateo 25:21 — "...bien, buen siervo y fiel; sobre poco has sido fiel, sobre mucho te pondré."',
    th: ['Santidad'],
    ol: [
      'La medida: la fidelidad se prueba en lo poco primero.',
      'La promesa: sobre mucho, al que no se cansa.',
      'El fruto: el creyente fiel no vive de resultados, vive de obediencia.'
    ],
    q: ['"No te mide Dios por el tamaño de la tarea: te mide por la fidelidad con que la hiciste."']
  },
  // --- Osteen (ampliación) ---
  {
    a: 'osteen',
    t: 'Tu mejor vida ahora',
    y: 2004,
    p: 'Lakewood Church, Houston',
    o: 'Sermón central de su serie (del libro homónimo): la vida que Dios quiere bendecir empieza en el corazón que se alinea con su favor.',
    x: 'Juan 10:10 — "...yo he venido para que tengan vida, y la tengan en abundancia."',
    th: ['Anhelos humanos'],
    ol: [
      'La vida abundante: no solo mañana, sino ahora.',
      'El espejo interior: cambia el retrato que cargas de ti.',
      'El fruto: el creyente que espera bien, vive bien.'
    ],
    q: ['"La vida abundante no empieza cuando todo cambia: empieza cuando tú cambias."']
  },
  {
    a: 'osteen',
    t: 'No mires atrás',
    y: 2012,
    p: 'Lakewood Church, Houston',
    o: 'Sermón sobre Lot y la llamada a no mirar atrás: el pasado que pierde al que lo mira demasiado.',
    x: 'Lucas 9:62 — "...nadie que poniendo su mano en el arado y mira atrás, es apto para el reino de Dios."',
    th: ['Firma y certeza'],
    ol: [
      'El espejo retrovisor consume el camino.',
      'La promesa del futuro no se ve desde el pasado.',
      'El fruto: el creyente que sigue caminando hacia adelante.'
    ],
    q: ['"El que maneja mirando el retrovisor, choca con el futuro."']
  },
  {
    a: 'osteen',
    t: 'La actitud del creyente',
    y: 2009,
    p: 'Lakewood Church, Houston',
    o: 'Sermón sobre la actitud: la fe se demuestra también en la cara y en el tono de cada día.',
    x: 'Filipenses 4:8 — "...todo lo que es verdadero... en esto pensad."',
    th: ['Anhelos humanos'],
    ol: [
      'El pensamiento forma la actitud: lo que piensas, eso se siente.',
      'La selección: pensar lo verdadero, no lo que asusta.',
      'El fruto: el creyente alegre no niega la realidad, la supera.'
    ],
    q: ['"No puedes controlar todo lo que pasa: controla lo que piensas de lo que pasa."']
  },
  {
    a: 'osteen',
    t: 'Los ojos en la promesa',
    y: 2013,
    p: 'Lakewood Church, Houston',
    o: 'Predicó la fe que mira la promesa: los ojos fijos en lo que Dios dijo, no en lo que el día dice.',
    x: '2 Corintios 4:18 — "...no mirando las cosas que se ven, sino las que no se ven."',
    th: ['Firma y certeza'],
    ol: [
      'La vista doble: lo visible y lo prometido.',
      'El ancla: lo invisible no se desmorona.',
      'El fruto: el creyente que no se hunde con la crisis.'
    ],
    q: ['"El que solo mira lo que ve, vive a merced de lo que ve."']
  },
  {
    a: 'osteen',
    t: 'La semilla de la fe',
    y: 2017,
    p: 'Lakewood Church, Houston',
    o: 'Sermón sobre la siembra: el pequeño acto de fe de hoy es la cosecha de mañana.',
    x: 'Gálatas 6:7 — "...el que siembra, también segará."',
    th: ['Firma y certeza'],
    ol: [
      'La semilla no se rinde en la tierra oscura.',
      'La cosecha: no se adelanta, pero no falta.',
      'El fruto: el creyente que sigue sembrando aunque no vea brotar.'
    ],
    q: ['"La semilla que hoy siembras en fe, mañana es la cosecha que no esperabas."']
  },
  // --- Evans (ampliación) ---
  {
    a: 'evans',
    t: 'El Reino en la ciudad',
    y: 2002,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó a la iglesia sobre la ciudad: la comunidad que no se esconde del barrio que la rodea.',
    x: 'Jeremías 29:7 — "Buscad el bien de la ciudad adonde os he llevado."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La ciudad no es el enemigo: es el campo del Reino.',
      'El bien buscado: prosperidad compartida, no aislamiento.',
      'El fruto: la iglesia que se hace útil donde está plantada.'
    ],
    q: ['"La iglesia que le da la espalda al barrio, pierde el púlpito que Dios le dio."']
  },
  {
    a: 'evans',
    t: 'Venciendo el cansancio espiritual',
    y: 2005,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Enseñanza sobre el agotamiento del que sirve: la fuerza que se renueva cuando se espera en el Señor.',
    x: 'Isaías 40:29 — "Él da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningún vigor."',
    th: ['Crisis y prueba'],
    ol: [
      'El cansancio no es pecado: la autonomía sí.',
      'La renovación: no más esfuerzo, más espera.',
      'El fruto: el creyente que vuelve volando del valle.'
    ],
    q: ['"No lo hagas solo: el que sirve en su propia fuerza, se quema."']
  },
  {
    a: 'evans',
    t: 'La espiritualidad del Reino',
    y: 2008,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó contra la espiritualidad de consumo: el Reino que transforma el carácter, no solo el fin de semana.',
    x: 'Gálatas 5:25 — "Si vivimos del Espíritu, andemos también según el Espíritu."',
    th: ['Santidad'],
    ol: [
      'La espiritualidad real se vive de lunes a viernes.',
      'El andar: lo que el creyente hace cotidianamente.',
      'El fruto: la vida que refleja al Señor donde nadie mira.'
    ],
    q: ['"Lo espiritual que solo aparece el domingo es un traje, no una vida."']
  },
  {
    a: 'evans',
    t: 'El poder de la unidad',
    y: 2015,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó sobre la unidad de la iglesia: el poder que desciende donde los hermanos se sostienen juntos.',
    x: 'Salmos 133:1 — "¡Mirad cuán bueno y cuán delicioso es que habiten los hermanos unidos!"',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La unidad no es acuerdo: es pacto de vida.',
      'El rocío que desciende: la bendición va a la unidad.',
      'El fruto: el cuerpo que se sostiene, no el que se corta.'
    ],
    q: ['"Dios unge a la casa unida: el cuerpo dividido pierde el rocío."']
  },
  {
    a: 'evans',
    t: 'El Reino y la oración de los hijos',
    y: 2017,
    p: 'Oak Cliff Bible Fellowship, Dallas',
    o: 'Predicó sobre la oración filial: el hijo que pide como heredero, no como mendigo.',
    x: 'Mateo 6:9 — "Vosotros oraréis así: Padre nuestro que estás en los cielos."',
    th: ['Oración'],
    ol: [
      'La oración del hijo: con derecho de herencia.',
      'El padre que escucha: la relación antes que la petición.',
      'El fruto: la oración que no mendiga, clama.'
    ],
    q: ['"El mendigo pide por lástima; el hijo pide por herencia."']
  },
  // --- Cho (ampliación) ---
  {
    a: 'cho',
    t: 'El poder de la Palabra hablada',
    y: 1983,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó la Palabra como semilla proclamada: el creyente que declara lo que Dios dijo, no lo que el ambiente grita.',
    x: 'Proverbios 18:21 — "La muerte y la vida están en poder de la lengua."',
    th: ['Poder sobrenatural'],
    ol: [
      'La Palabra no se recita: se declara con fe.',
      'El poder: lo que Dios dijo ya es válido en el cielo.',
      'El fruto: el creyente que habla la promesa, no el miedo.'
    ],
    q: ['"No hables el ambiente: habla la promesa."']
  },
  {
    a: 'cho',
    t: 'El ayuno y la oración',
    y: 1985,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Enseñanza sobre el ayuno en la vida de la iglesia: la disciplina que afina la oración del creyente.',
    x: 'Mateo 6:17-18 — "...y tu Padre que ve en lo secreto te recompensará."',
    th: ['Oración'],
    ol: [
      'El ayuno no es alarde: es silencio ante el Padre.',
      'El objetivo: más oración, no más hambre.',
      'El fruto: el creyente que se vacía para llenarse de verdad.'
    ],
    q: ['"El ayuno no compra el milagro: afina la antena del alma."']
  },
  {
    a: 'cho',
    t: 'La familia del creyente',
    y: 1990,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó sobre la familia: la casa del creyente como primer campo del discipulado.',
    x: 'Hechos 16:31 — "...cree en el Señor Jesucristo, y serás salvo tú, y tu casa."',
    th: ['Santidad'],
    ol: [
      'La casa del creyente no es ajena al Reino.',
      'El padre discipulador: cada hogar es una célula.',
      'El fruto: la familia salva sostiene la iglesia entera.'
    ],
    q: ['"El discípulo que no discipula su casa, no la tiene bien cultivada."']
  },
  {
    a: 'cho',
    t: 'El gozo del creyente',
    y: 2000,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó el gozo del Espíritu: la alegría que no depende del ambiente sino del Consolador que vive dentro.',
    x: 'Gálatas 5:22 — "Mas el fruto del Espíritu es amor, gozo, paz..."',
    th: ['Crisis y prueba'],
    ol: [
      'El gozo no es felicidad de circunstancia: es fruto de Espíritu.',
      'El Consolador: la presencia que llena incluso el hueco.',
      'El fruto: el creyente gozoso que no vive de lo que recibe.'
    ],
    q: ['"La felicidad depende de lo que pasa; el gozo depende de quién vive en ti."']
  },
  {
    a: 'cho',
    t: 'La visión que se sostiene',
    y: 2005,
    p: 'Yoido Full Gospel Church, Seúl',
    o: 'Predicó la visión que se escribe y se sostiene: la iglesia que no pierde el rumbo por la crisis.',
    x: 'Habacuc 2:2 — "...escribe la visión, y declárala en tablas, para que corra el que la leyere."',
    th: ['Oración'],
    ol: [
      'La visión escrita sobrevive al olvido.',
      'El corre el que lee: la visión se comparte, no se guardo.',
      'El fruto: la iglesia que sabe a dónde va.'
    ],
    q: ['"La visión que no se escribe se pierde en la conversación."']
  },
  // --- Gebel (ampliación) ---
  {
    a: 'gebel',
    t: 'La ironía de la fe',
    y: 2018,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su tema distintivo: la fe no es la ausencia de duda, sino la confianza que sobrevive a la ironía de la vida.',
    x: 'Marcos 9:24 — "Creo; ayuda mi incredulidad."',
    th: ['Gracia'],
    ol: [
      'La fe que confiesa: creo y aún así tengo dudas.',
      'El espacio de la gracia: Dios no necesita la fe perfecta.',
      'El fruto: el creyente honesto que sigue caminando.'
    ],
    q: ['"La fe no es no dudar: es no rendirse mientras dudas."']
  },
  {
    a: 'gebel',
    t: 'El barrio y la gloria',
    y: 2017,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su predicación sobre el origen: Dios no usa la gloria de tu barrio para medirte.',
    x: 'Juan 1:46 — "¿Puede algo bueno venir de Nazaret?"',
    th: ['Anhelos humanos'],
    ol: [
      'El prejuicio del lugar: lo bueno no viene de donde nosotros decimos.',
      'La gracia que se nutre del origen: Nazaret sí tuvo huésped.',
      'El fruto: el creyente que no se disculpa por de dónde viene.'
    ],
    q: ['"Dios nació en un pueblo del que nadie esperaba nada: deja de disculparte por tu origen."']
  },
  {
    a: 'gebel',
    t: 'Volver a casa',
    y: 2019,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su tema pastoral: el regreso del hijo que se fue y el hogar que lo espera sin acusaciones.',
    x: 'Lucas 15:24 — "...mi hijo estaba muerto y ha revivido; estaba perdido y es hallado."',
    th: ['Gracia'],
    ol: [
      'La huida: el hijo que pensó que la casa lo limitaba.',
      'El regreso: el hogar que no pide explicaciones.',
      'El fruto: la gracia que no calcula.'
    ],
    q: [
      '"La casa no te pide a que vuelvas con tu discurso de justificación: te pide solo que entres."'
    ]
  },
  {
    a: 'gebel',
    t: 'La risa y la cruz',
    y: 2016,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su mensaje distintivo: la risa no es la ausencia de la cruz; es su fruto cuando llega la gracia.',
    x: 'Salmos 126:2 — "Entonces nuestra boca se llenó de risa."',
    th: ['Crisis y prueba'],
    ol: [
      'El regreso de los cautivos: la risa que sobra.',
      'La risa no es insensatez: es testimonio de gracia.',
      'El fruto: el creyente que aprende a reírse en la tormenta.'
    ],
    q: ['"La risa no es ausencia de cruz: es fruto de la gracia que la cruz traerá."']
  },
  {
    a: 'gebel',
    t: 'El último minuto',
    y: 2020,
    p: 'River Church, Anaheim',
    o: 'Síntesis editorial de su tema evangelístico: la gracia que actúa en el último instante de la vida.',
    x: 'Lucas 23:43 — "...hoy estarás conmigo en el paraíso."',
    th: ['Gracia', 'Evangelismo'],
    ol: [
      'El ladrón: nadie tenía esperanza para él.',
      'La gracia de la última hora: hoy, no mañana.',
      'El fruto: el creyente que no pierde la esperanza por nadie.'
    ],
    q: ['"Nadie está tan lejos como para que la gracia no lo alcance hoy."']
  },
  // --- Witt (ampliación) ---
  {
    a: 'witt',
    t: 'Cantar en la prueba',
    y: 2007,
    p: 'Lakewood Español, Houston',
    o: 'Síntesis editorial de su mensaje sobre Pablo y Silas: el cántico que abre las puertas de la cárcel.',
    x: 'Hechos 16:25 — "...orando cantaban himnos a Dios, y los presos los oían."',
    th: ['Crisis y prueba'],
    ol: [
      'El canto no es consuelo de la desesperanza: es fe hecha sonido.',
      'El efecto: las puertas que se abren cuando el creyente canta.',
      'El fruto: el testigo que se convierte en testimonio.'
    ],
    q: ['"El cántico no niega la cárcel: abre sus puertas."']
  },
  {
    a: 'witt',
    t: 'El favor de la presencia',
    y: 2009,
    p: 'Lakewood Español, Houston',
    o: 'Predicó sobre la presencia de Dios: el favor que no se gana con talento sino con intimidad.',
    x: 'Éxodo 33:15-16 — "...si tu presencia no va conmigo, no nos hagas subir."',
    th: ['Adoración'],
    ol: [
      'Sin presencia no vale la pena subir.',
      'El favor de la presencia no se negocia con esfuerzo.',
      'El fruto: el creyente que prefiere la mano del Señor antes que el altar.'
    ],
    q: ['"No subas sin su presencia: el monte sin el Señor es solo montaña."']
  },
  {
    a: 'witt',
    t: 'El ministerio de la música',
    y: 2006,
    p: 'Witt Ministries International, Houston',
    o: 'Enseñanza a los músicos y líderes de adoración: la música no es plataforma personal, es servicio en el altar.',
    x: 'Salmos 33:3 — "Cantadle cántico nuevo; hacédle excelso con salterio y arpa."',
    th: ['Adoración'],
    ol: [
      'La música sirve: no se sirve a sí misma.',
      'El escenario no es el altar: el altar es el corazón.',
      'El fruto: el que toca para la gloria, no para su aplauso.'
    ],
    q: ['"El que toca para el aplauso pierde el altar: el que toca para el Señor, no lo pierde."']
  },
  {
    a: 'witt',
    t: 'Aviva el altar',
    y: 2011,
    p: 'Witt Ministries International, Houston',
    o: 'Sermón sobre el altar apagado: la llamada a mantener el fuego de la adoración en la casa.',
    x: 'Levítico 6:12-13 — "...el fuego arderá continuamente en el altar, no se apagará."',
    th: ['Adoración'],
    ol: [
      'El fuego del altar no se fabrica una vez: se mantiene cada día.',
      'La casa que cuida el fuego no se apaga.',
      'El fruto: la adoración que no depende del estado de ánimo.'
    ],
    q: ['"El altar que se descuida se apaga: aviva el fuego cada mañana."']
  },
  {
    a: 'witt',
    t: 'La casa del Padre',
    y: 2013,
    p: 'Lakewood Español, Houston',
    o: 'Predicó sobre la casa del Padre: el hogar eterno que da sentido a la adoración entera.',
    x: 'Juan 14:2 — "En la casa de mi Padre muchas moradas hay."',
    th: ['Muerte y eternidad'],
    ol: [
      'La casa no es una promesa lejana: es la casa del Padre.',
      'Las moradas: lugar para todos los que creen.',
      'El fruto: la adoración que ya vive como en casa.'
    ],
    q: ['"El creyente que sabe a dónde va, alaba en el camino."']
  },
  // --- Luna (ampliación) ---
  {
    a: 'luna',
    t: 'Fe que declara',
    y: 2013,
    p: 'Casa de Dios, Guatemala',
    o: 'Síntesis editorial de su enseñanza: la fe que no solo cree, sino que habla lo que cree.',
    x: 'Romanos 10:9 — "...si confesares con tu boca que Dios le levantó de los muertos, serás salvo."',
    th: ['Poder sobrenatural'],
    ol: [
      'La fe que no declara se queda en la cabeza.',
      'La boca: la puerta del corazón.',
      'El fruto: el creyente que habla la fe, no la guarda.'
    ],
    q: ['"La fe que no sale de tu boca no llega a tu vida."']
  },
  {
    a: 'luna',
    t: 'La gloria en la casa',
    y: 2014,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre la Gloria en la iglesia local: el ambiente que Dios crea cuando su pueblo busca su rostro.',
    x: '2 Crónicas 5:14 — "...la gloria del Señor llenó la casa."',
    th: ['Adoración', 'Poder sobrenatural'],
    ol: [
      'La Gloria no es entretenimiento: es presencia.',
      'La casa que la busca: los sacerdotes que no se sostienen por el peso.',
      'El fruto: la casa donde el Señor se deja ver.'
    ],
    q: ['"La Gloria que llena la casa no se explica: se adora."']
  },
  {
    a: 'luna',
    t: 'El Congreso del Poder',
    y: 2008,
    p: 'Casa de Dios, Guatemala (congreso anual)',
    o: 'Síntesis editorial de su congreso anual de poder y sanidad, con miles de asistentes cada año: la fe que espera el milagro.',
    x: 'Lucas 5:17 — "...y el poder del Señor estaba con él para sanar."',
    th: ['Poder sobrenatural'],
    ol: [
      'El Congreso no es show: es la casa donde el milagro se espera.',
      'El poder del Señor presente: no un título, sino un acontecimiento.',
      'El fruto: los que salen con testimonio regresan con fe mayor.'
    ],
    q: ['"Cuando el pueblo busca el rostro del Señor, el poder no se demora."']
  },
  {
    a: 'luna',
    t: 'La sanidad de las heridas',
    y: 2016,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre las heridas del alma: el poder del Señor que sana lo que el tiempo no toca.',
    x: 'Salmos 147:3 — "Sana a los quebrantados de corazón, y vende sus heridas."',
    th: ['Crisis y prueba'],
    ol: [
      'La herida que el tiempo no toca: solo el Señor la toca.',
      'El vendaje: la gracia que no se avergüenza del pasado.',
      'El fruto: el creyente que no carga lo que ya se vendó.'
    ],
    q: ['"El tiempo no sana la herida: la entierra; solo el Señor la venda."']
  },
  {
    a: 'luna',
    t: 'La unión del Espíritu',
    y: 2012,
    p: 'Casa de Dios, Guatemala',
    o: 'Predicó sobre la unión con el Espíritu: la vida del creyente que camina en comunión con Dios, no en distancia.',
    x: 'Gálatas 5:16 — "Andad en el Espíritu, y no satisfagáis los deseos de la carne."',
    th: ['Poder sobrenatural', 'Santidad'],
    ol: [
      'La comunión no es una experiencia aislada: es un caminar diario.',
      'La carne no se suple: se gobierna por el Espíritu.',
      'El fruto: el creyente unido que no se aparta del Consolador.'
    ],
    q: ['"Caminar en el Espíritu no es un salto: es un paso a la vez."']
  },
  // --- Maldonado (ampliación) ---
  {
    a: 'maldonado',
    t: 'El poder de la Palabra declarada',
    y: 2006,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre la Palabra proclamada: lo que Dios dijo, el creyente lo declara hasta que se manifiesta.',
    x: 'Romanos 10:17 — "...la fe es por el oír, y el oír, por la palabra de Dios."',
    th: ['Poder sobrenatural'],
    ol: [
      'La fe nace del oír la Palabra, no del entusiasmo.',
      'La declaración: lo que proclamas, lo sostienes.',
      'El fruto: el creyente que vive de lo que escucha.'
    ],
    q: ['"Lo que no proclamas, no sostienes; la fe que declara, se arraiga."']
  },
  {
    a: 'maldonado',
    t: 'La unción del liderazgo',
    y: 2010,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre el liderazgo con unción: el líder que no depende de su talento sino de la presencia del Señor.',
    x: '1 Samuel 16:13 — "...y desde aquel día en adelante el Espíritu del Señor vino sobre David."',
    th: ['Cuerpo de Cristo'],
    ol: [
      'La unción no se compra ni se hereda: se recibe del Señor.',
      'El líder uncido: no talentoso, sino disponible.',
      'El fruto: el ministerio que dura el que se sostiene en la presencia.'
    ],
    q: ['"El talento abre la puerta: la unción la sostiene."']
  },
  {
    a: 'maldonado',
    t: 'El ayuno que abre el cielo',
    y: 2008,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Predicó sobre el ayuno: la disciplina que abre la puerta del sobrenatural en la vida del creyente.',
    x: 'Isaías 58:6 — "¿No es éste el ayuno que yo escogí... desatar las ligaduras de impiedad?"',
    th: ['Oración', 'Poder sobrenatural'],
    ol: [
      'El ayuno no es hambre: es disciplina que desata.',
      'El propósito: quebrar las ligaduras, no la mesa.',
      'El fruto: la luz que entra donde la puerta se abre.'
    ],
    q: ['"El ayuno no rompe el cuerpo: rompe las cadenas."']
  },
  {
    a: 'maldonado',
    t: 'La Gloria y la intimidad',
    y: 2012,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Enseñanza sobre la intimidad con Dios: la Gloria que desciende cuando el creyente busca el rostro antes que la mano.',
    x: 'Éxodo 33:14 — "Mi presencia irá contigo, y te daré descanso."',
    th: ['Adoración'],
    ol: [
      'La intimidad no es privacidad: es apertura total.',
      'El descanso: la presencia que sostiene antes que la victoria.',
      'El fruto: el creyente que pide presencia antes que señal.'
    ],
    q: ['"Pide su rostro antes que su mano: la gloria desciende donde la intimidad sube."']
  },
  {
    a: 'maldonado',
    t: 'La puerta del sobrenatural',
    y: 2015,
    p: 'Casa Internacional del Padre (Kingdom City), Houston',
    o: 'Sermón sobre la fe que entra: el creyente que no se conforma con lo natural, porque su Padre no lo es.',
    x: 'Marcos 9:23 — "Si puedes creer, al que cree todo le es posible."',
    th: ['Poder sobrenatural'],
    ol: [
      'El límite no lo pone Dios: lo pone la fe pequeña.',
      'El creyente que se atreve: el que se atreve a creer, se atreve a vivir.',
      'El fruto: el que camina con fe, no vive en el límite del ambiente.'
    ],
    q: ['"Tu fe es la puerta del sobrenatural: si no la abres, la señal no entra."']
  },
  // --- Latimer ---
  {
    a: 'latimer',
    t: 'El sermón del arado',
    y: 1548,
    p: 'St. Paul\u2019s Cross, Londres',
    o: 'Primer sermón de la corte de Eduardo VI ante miles de oyentes: Latimer ataca el clero que predica en latín y dice que su arado está casi podrido mientras el reino se pierde.',
    x: 'Romanos 15:4 — "...todo lo que está escrito antes, para nuestra enseñanza lo escribió, para que por la paciencia y consolación de las Escrituras tengamos esperanza."',
    th: ['Crisis y prueba', 'Firma y certeza'],
    ol: [
      'El arado podrido: la predicación de la nación está descuidada y nadie lo confiesa.',
      'La Escritura escrita para nuestra enseñanza: la Palabra en la lengua del pueblo, no en la del claustro.',
      'La esperanza que sale del texto: un reino predicado se sostiene, un reño encerrado en latín se muere.'
    ],
    q: [
      '"Mi arado está casi podrido: no lo afiló nadie en toda esta tierra."',
      '"El predicar de la Palabra de Dios es el mejor oficio de todos: por eso el diablo no lo quiere."'
    ],
    i: 'Sermón fundacional de la homilética anglicana; fijó la predicación vernácula como deber del país. Latimer murió quemado en Oxford en 1555 y su llamamiento sobrevivió a la hoguera.'
  },
  {
    a: 'latimer',
    t: 'Los sermones de las cartas',
    y: 1529,
    p: 'Inglaterra (predicado en parroquia, editado por la Parker Society)',
    o: 'El joven capellán convierte el juego de cartas en pedagogía del alma: cada baraja enseña lo que el jugador esconde; uno de los sermones más reeditados de la Reforma inglesa temprana.',
    x: 'Mateo 13:52 — "...todo escriba instruido en el reino de los cielos es semejante a un padre de familia que saca de su tesoro cosas nuevas y viejas."',
    th: ['Anhelos humanos', 'Penitencia'],
    ol: [
      'El tesoro del escriba: cosas nuevas y viejas sacadas para el mismo mesa.',
      'Las cartas sobre la mesa: lo que el jugador mira con avidez revela el corazón que juega.',
      'El libro de la conciencia: la baraja que no se baraja; lo que nadie revuelve delante de Dios.'
    ],
    q: [
      '"Saca tu baraja y mírala bien: ahí está pintado tu corazón."'
    ],
    i: 'Pedagogía popular de la Reforma: predica con el vocabulario de la taberna para arrancar la conciencia de la mesa.'
  },
  // --- Baxter ---
  {
    a: 'baxter',
    t: 'El pastor reformado',
    y: 1656,
    p: 'Asociación ministerial de Worcestershire, Kidderminster',
    o: 'Sermón sinodal ante ministros que se volvió el libro clásico de la cura de almas: Baxter toma la cuenta que Pedro heredó del Señor y la pasa a la pastoral de su condado.',
    x: 'Hechos 20:28 — "...tomad cuidado de toda la grey, en la cual el Espíritu Santo os ha puesto por obispos, para apacentar la iglesia del Señor."',
    th: ['Santidad', 'Crisis y prueba'],
    ol: [
      'La grey es de Dios: ni parroquia ni clientela; el pastor la cuenta como quien responde por cada cabeza.',
      'El cuidado que cansa: el pastor que conoce a su grey uno por uno, y por eso vive desvelado.',
      'El ministerio que se predica a sí mismo: antes de reformar el rebaño, el pastor se reforma a sí.'
    ],
    q: [
      '"Es mejor despertar a mil hombres con el sermón que entretener a uno con la elocuencia."',
      '"Predica como un moribundo a moribundos: como si no volverías a predicar nunca más."'
    ],
    i: 'Se convirtió en el manual pastoral de tres siglos: el ministerio como consulta médica del alma, no como oficio retórico.'
  },
  {
    a: 'baxter',
    t: 'El descanso de los santos',
    y: 1650,
    p: 'Kidderminster (meditaciones nacidas de su enfermedad, editadas como libro en 1650)',
    o: 'Escrito durante una tuberculosis que casi lo mata en 1647: confinado en cama, Baxter medita sobre el descanso que la gloria prepara y sale con el libro devocional más leído del puritanismo.',
    x: 'Hebreos 4:9 — "Por tanto, queda un descanso para el pueblo de Dios."',
    th: ['Muerte y eternidad', 'Anhelos humanos'],
    ol: [
      'El descanso que queda: no es pausa del cansancio, es fin de la guerra del alma.',
      'El espejo de la enfermedad: el cuerpo que falla enseña lo que el mundo disimula.',
      'La vida desde la puerta: quien sabe de dónde va, ordena lo que hoy pesa.'
    ],
    q: [
      '"Un día en el cielo vale por mil años de gloria humana."'
    ],
    i: 'Nacida de la cama de enfermo, movió generaciones de pastores a vivir con la puerta de la eternidad abierta.'
  },
  // --- Finney ---
  {
    a: 'finney',
    t: 'Lecturas sobre el avivamiento',
    y: 1835,
    p: 'Iglesias libres de Nueva York',
    o: 'Ciclo de lecturas predicadas en las iglesias libres de Nueva York y publicadas ese mismo año: el ex-abogado argumenta que el avivamiento no es milagro incontrolable sino ley moral que Dios bendice.',
    x: 'Romanos 13:11 — "...ya es hora de levantarnos del sueño; porque ahora está más cerca de nosotros nuestra salvación que cuando aceptamos."',
    th: ['Evangelismo', 'Oración'],
    ol: [
      'El avivamiento no es milagro: es el resultado correcto del uso correcto de los medios que Dios ya dio.',
      'La iglesia dormida: el texto dice la hora y la culpa; el sueño es decisión, no destino.',
      'La oración que se atreve: pedir el avivamiento como quien reclama una deuda prometida.'
    ],
    q: [
      '"Un avivamiento no es otra cosa que una nueva obediencia a Dios."'
    ],
    i: 'El libro de homilética revivalista más influyente del siglo XIX; formó a una generación de evangelistas y cambió la práctica del púlpito americano.'
  },
  {
    a: 'finney',
    t: 'La oración que prevalece',
    y: 1859,
    p: 'Glasgow, Escocia (gira británica)',
    o: 'Durante su gira británica de avivamiento, Finney predica sobre la oración que agarra a Dios: el creyente que reclama la promesa y no suelta hasta verla; en estilo fiel a sus conferencias de la década.',
    x: '1 Juan 5:14 — "Y esta es la confianza que tenemos para con él, que si pedimos alguna cosa conforme a su voluntad, él nos oye."',
    th: ['Oración', 'Firma y certeza'],
    ol: [
      'La condición del oír: pedir conforme a la voluntad revelada, no al antojo del corazón.',
      'La insistencia que honra: la oración que prevalece no importa, declara y repite la promesa.',
      'El resultado visible: la iglesia que aprende a reclamar deja de mendigar y empieza a mover.'
    ],
    q: [
      '"La oración prevaleciente no ruega al aire: cita la promesa delante del trono."'
    ],
    i: 'Marca el temperamento orante del movimiento de Oberlin: oración tratada como litigio ganado con la Palabra.'
  },
  // --- M'Cheyne ---
  {
    a: 'mcheyne',
    t: 'El buen pastor',
    y: 1839,
    p: 'St. Peter\u2019s, Dundee',
    o: 'Desde el púlpito de Dundee, el joven pastor expone al Pastor que da la vida: un sermón del estilo y canon de su colección póstuma de 1863, en los años del avivamiento que su enfermedad dejaba respirar.',
    x: 'Juan 10:11 — "Yo soy el buen pastor; el buen pastor su vida da por las ovejas."',
    th: ['Gracia', 'Crisis y prueba'],
    ol: [
      'El pastor que no alquila: el mercenario huye y el Dueño se queda.',
      'La vida dada: no la convenience ni la fama, sino la sangre como precio del rebaño.',
      'Las ovejas que conocen su voz: la seguridad del creyente no está en su agarre sino en el suyo.'
    ],
    q: [
      '"Por cada oveja del rebaño, el Pastor pagó con su propia sangre; descansa tu alma en eso."'
    ],
    i: 'Ficha reconstruida del estilo de su colección: su pastoral fue tan joven como su muerte; a los 29 años la grey lloraba al pastor que la había contado casa por casa.'
  },
  {
    a: 'mcheyne',
    t: 'Preparen el camino del Señor',
    y: 1839,
    p: 'St. Peter\u2019s, Dundee (avivamiento con W. C. Burns)',
    o: 'En los meses del avivamiento de Dundee de 1839 —con William Chalmers Burns predicando mientras M\u2019Cheyne viajaba a Israel—, la iglesia aprendió a pedir camino en el desierto.',
    x: 'Isaías 40:3 — "Voz que clama en el desierto: Preparad camino a Jehová; enderezad vereda en la llanura a nuestro Dios."',
    th: ['Arrepentimiento', 'Evangelismo'],
    ol: [
      'El desierto no es castigo: es lugar de camino; lo que parece vacío se ordena para el Rey.',
      'La voz que clama: nadie clama lo que no ha oído; el predicador primero fue oyente.',
      'La gloria revelada: el camino preparado no es esfuerzo humano, es el Señor que viene a quedarse.'
    ],
    q: [
      '"No pidas explicación al desierto: pídelle camino."'
    ],
    i: 'Ficha reconstruida del clima de su iglesia: el avivamiento de Dundee llegó cuando el pastor estaba ausente, y volvió a una grey sedienta.'
  },
  // --- Christmas Evans ---
  {
    a: 'evans',
    t: 'El grano de mostaza',
    y: 1820,
    p: 'Gales (predicado en sus giras por las capillas bautistas galesas)',
    o: 'Su sermón más célebre, predicho repetidas veces en las giras galesas: la semilla que el enemigo siembra de noche y la iglesia que crece hasta dar sombra a las naciones.',
    x: 'Mateo 13:31-32 — "...el reino de los cielos es semejante al grano de mostaza, que un hombre tomó y sembró en su campo."',
    th: ['Firma y certeza', 'Evangelismo'],
    ol: [
      'La semilla mínima: el reino no llega por tamaño, llega por siembra.',
      'El enemigo de noche y la planta de día: la historia de la iglesia en una sola imagen.',
      'La sombra de las naciones: el pájaro que hoy se anida en sus ramas empezó bajo la tierra.'
    ],
    q: [
      '"No desprecies la semilla pequeña: los pájaros del cielo ya están mirando su rama."'
    ],
    i: 'El sermón galés más traducido; la versión impresa fija el texto de un predicador que nunca predicó lo mismo dos veces.'
  },
  {
    a: 'evans',
    t: 'El muro derribado',
    y: 1825,
    p: 'Capillas de Gales (estilo fiel de su predicación del pacto)',
    o: 'En el corazón del metodismo galés que él conocía por dentro, Evans expone el muro que Cristo derribó: el evangelio del pacto como épica que une lo que el pecado separó.',
    x: 'Efesios 2:14 — "Porque él es nuestra paz, que de ambos pueblos hizo uno, derribando la pared intermedia de separación."',
    th: ['Gracia', 'Muerte y eternidad'],
    ol: [
      'El muro que Dios puso y Cristo quitó: la ley como separación y la cruz como demolición.',
      'Dos pueblos, un hombre nuevo: la paz no es acuerdo, es nueva humanidad.',
      'El acceso al Padre: derribado el muro, el lejos y el cerca entran por la misma puerta.'
    ],
    q: [
      '"Cristo no escaló el muro: lo tiró abajo piedras por piedras."'
    ],
    i: 'Ficha reconstruida del estilo de sus sermones del pacto: la épica galesa puesta al servicio de la reconciliación.'
  },
  // --- Massillon ---
  {
    a: 'massillon',
    t: 'Oración fúnebre de Luis XIV',
    y: 1715,
    p: 'Basílica de Saint-Denis, París',
    o: 'Muerto el Rey Sol después de setenta y dos años de reinado, Massillon predica ante el regente Felipe de Orleans: "Solo Dios es grande" como sentencia que desarma a la corte entera.',
    x: '1 Pedro 1:24 — "Toda carne es como hierba, y toda la gloria del hombre como flor de la hierba... mas la palabra del Señor permanece para siempre."',
    th: ['Muerte y eternidad', 'Idolatría del corazón'],
    ol: [
      'Solo Dios es grande: la frase que vacía el trono vacante de todo lo que lo llenó.',
      'El inventario del reinado: conquistas, palacios y abismos morales de la gloria de un hombre.',
      'La lección al regente: el poder que hereda es la misma hierba que ayer se admiraba.'
    ],
    q: [
      '"Solo Dios es grande, señores; y en esa frase cabe todo lo que debemos humillarnos."'
    ],
    i: 'El sermón más citado del siglo XVIII francés: Voltaire lo estudió como derrota de la vanidad por la elocuencia; su texto bíblico exacto no se fijó en las ediciones al español y la ficha usa el pasaje representativo del género.'
  },
  {
    a: 'massillon',
    t: 'El pequeño número de los elegidos',
    y: 1704,
    p: 'Capilla del palacio de Versalles, Cuaresma ante Luis XIV',
    o: 'Su obra maestra predicada ante el Rey Sol en Cuaresma: la estrechez del camino eterno predicada sin miedo a la corte, con tal maestría que el rey mandó reimprimirla para el pueblo.',
    x: 'Mateo 22:14 — "Porque muchos son llamados, y pocos escogidos."',
    th: ['Penitencia', 'Muerte y eternidad'],
    ol: [
      'Muchos llamados: la gracia no es escasa, la respuesta sí.',
      'Pocos escogidos: la corte como espejo del reino; todos los grandes no llenan el camino estrecho.',
      'La decisión del oyente: el llamado que hoy suena puede ser el último que escuche.'
    ],
    q: [
      '"Muchos son llamados, señores: el número de los escogidos no se decide en el salón, se decide en el altar."'
    ],
    i: 'La pieza que lo consagró como primer predicador de Francia; su Petit Carême ante Luis XV nació de la misma vena y se convirtió en clásico devocional.'
  },
  // --- Bourdaloue ---
  {
    a: 'bourdaloue',
    t: 'El pensamiento de la muerte',
    y: 1670,
    p: 'Cuaresma de la corte de Luis XIV, París',
    o: 'En una de sus Cuaresmas de corte, el jesuita predica el pensamiento de la muerte no como terror sino como lógica: la cuenta que nadie puede aplazar; fecha puntual no conservada en las ediciones.',
    x: 'Salmos 90:12 — "Enséñanos de tal modo a contar nuestros días, que nuestro corazón adquiera sabiduría."',
    th: ['Muerte y eternidad', 'Penitencia'],
    ol: [
      'Contar los días: la aritmética que la vida evita y la muerte obliga.',
      'El pensamiento que ordena: quien sabe el número deja de despilfarrar el resto.',
      'La sabiduría del corazón: no es miedo, es administración sabia del tiempo prestado.'
    ],
    q: [
      '"El hombre que no piensa en la muerte, piensa mal en todo lo demás."'
    ],
    i: 'Muestra el método que la corte temía: sin teatro, la lógica del examen moral desarmaba a los oyentes que venían a admirar.'
  },
  {
    a: 'bourdaloue',
    t: 'Sobre las riquezas',
    y: 1668,
    p: 'Cuaresma de la corte de Luis XIV, París',
    o: 'Ante la corte más rica de Europa, el jesuita separa dos señores con lógica de cuchillo: el servicio que divide no admite compartidos; fecha aproximada de sus Cuaresmas parisienses.',
    x: 'Mateo 6:24 — "Ninguno puede servir a dos señores; porque o aborrecerá al uno y amará al otro, o estimará al uno y menospreciará al otro. No podéis servir a Dios y a las riquezas."',
    th: ['Idolatría del corazón', 'Santidad'],
    ol: [
      'Dos señores, un corazón: la división no es debilidad, es matemática moral.',
      'El aborrecimiento que sorprende: el amo despreciado siempre es el invisible.',
      'La riqueza desarmada: no es malo tener, es malo mandar; el que sirve al oro no ama a Dios.'
    ],
    q: [
      '"El corazón que reparte, ya eligió: el invisible nunca gana el reparto."'
    ],
    i: 'Su sermón de moral más reeditado; contra el quietismo y contra el lujo con la misma lógica implacable.'
  },
  // --- G. Campbell Morgan ---
  {
    a: 'morgan',
    t: 'Los propósitos de la Encarnación',
    y: 1910,
    p: 'Westminster Chapel, Londres (impreso en The Fundamentals, tomo I)',
    o: 'Su ensayo-sermón para la serie fundacional que defendió la fe histórica ante el modernismo: la gran verdad piadosa de la música antigua como clave de la lectura del misterio.',
    x: '1 Timoteo 3:16 — "E indiscutiblemente, grande es el misterio de la piedad: Dios fue manifestado en carne."',
    th: ['Firma y certeza', 'Adoración'],
    ol: [
      'El misterio grande: la piedad no es sentimiento, es el hecho de Dios en carne.',
      'Los propósitos cumplidos: revelación, redención y reunión leídas en una sola perícopa.',
      'La fe que defiende: la Encarnación no se explica con menor fuerza de la que el texto reclama.'
    ],
    q: [
      '"La Encarnación no es un episodio de la historia: es el propósito que ordena la historia."'
    ],
    i: 'Impreso en The Fundamentals, el documento que dio nombre al fundamentalismo; su firma expositiva enseñó a predicar la doctrina desde el texto y no desde la polémica.'
  },
  {
    a: 'morgan',
    t: 'La carta a Laodicea',
    y: 1930,
    p: 'Westminster Pulpit, Londres (estilo fiel de su ciclo de Apocalipsis)',
    o: 'En su predicación del Apocalipsis en Westminster Chapel, Morgan toma el mensaje al rico que se cree rico: la carta a Laodicea como diagnóstico de la iglesia engreída.',
    x: 'Apocalipsis 3:17 — "Dices: Yo soy rico, y me he enriquecido, y no tengo necesidad de ninguna cosa; y no sabes que eres un pobre, miserable, pobre, ciego y desnudo."',
    th: ['Idolatría del corazón', 'Penitencia'],
    ol: [
      'El inventario falso: lo que la iglesia dice de sí y lo que el Dueño ve son dos listas distintas.',
      'El tibio que vomita: ni frío ni calor, la indiferencia como sentencia final.',
      'El que llama a la puerta: la carta que golpea desde fuera y cena con el que abre.'
    ],
    q: [
      '"La iglesia no está en peligro por el mundo afuera: está en peligro por el tibio adentro."'
    ],
    i: 'Ficha reconstruida del ciclo expositivo de Westminster: su método del libro entero en la cabeza aplicado a las siete cartas.'
  },
  // --- Billy Sunday ---
  {
    a: 'sunday',
    t: 'El licor',
    y: 1908,
    p: 'Tabernáculos de gira, Estados Unidos (Chicago, Detroit, Filadelfia)',
    o: 'El sermón más famoso de sus campañas: el ex-beisbolista ataca la industria del alcohol con el cuerpo entero; sus ataques colaboraron con el clima que llevó a la Prohibición.',
    x: 'Proverbios 20:1 — "El vino es escarnecedor, la sidra altercadora, y cualquiera que en ellos yerre no será sabio."',
    th: ['Idolatría del corazón', 'Penitencia'],
    ol: [
      'El escarnecedor de casa: el licor entra risueño y sale rompiendo la mesa.',
      'La aritmética del tabernáculo: salarios bebidos, viudas contadas, celdas llenas.',
      'El firmar del corazón: la decisión en la línea del tabernáculo; el que cruza, no vuelve igual.'
    ],
    q: [
      '"El infierno es lleno de barriles y cada barril tiene una familia detrás."'
    ],
    i: 'El sermón antialcohol más predicado de la historia de EE. UU.; texto conservado por la prensa y por la edición de 1914 del evangelista (dominio público).'
  },
  {
    a: 'sunday',
    t: 'El pecado imperdonable',
    y: 1910,
    p: 'Tabernáculos de gira, Estados Unidos',
    o: 'Uno de sus sermones de campaña más reeditados: el pecado que nadie quiere cometer dos veces y que muchos temen sin haberlo cometido; fecha puntual no conservada, la ficha toma la versión de sus campañas.',
    x: 'Mateo 12:31-32 — "...el pecado contra el Espíritu Santo no será perdonado, ni en este siglo ni en el venidero."',
    th: ['Penitencia', 'Muerte y eternidad'],
    ol: [
      'Lo que no es: la culpa que atormenta no es el pecado imperdonable; el temor ya prueba sensibilidad.',
      'Lo que sí es: el endurecimiento final contra la luz que ya se vio.',
      'La puerta que se cierra: no por ira de Dios, sino por mano del que la cierra desde adentro.'
    ],
    q: [
      '"Si te angustias por haberlo cometido, ya es prueba de que no lo cometiste: el que lo hizo no siente nada."'
    ],
    i: 'Ficha de la versión de campaña: Sunday desarmaba el pánico del pecado imperdonable con teología de calle y pastoral dura.'
  },
  // --- Martin Luther King Jr. ---
  {
    a: 'king',
    t: 'El instinto del tambor mayor',
    y: 1968,
    p: 'Ebenezer Baptist Church, Atlanta',
    o: 'Predicado dos meses antes de su asesinato: King disecciona el deseo humano de adelantarse a la fila —también dentro de la iglesia— y lo pasa por el lavatorio del Maestro; se leyó en su funeral.',
    x: 'Marcos 10:43-44 — "Mas así no será entre vosotros, sino el que quiera hacerse grande entre vosotros será vuestro servidor, y el que de vosotros quiera ser el primero, será siervo de todos."',
    th: ['Idolatría del corazón', 'Santidad'],
    ol: [
      'El instinto universal: ser el tambor mayor de la banda, primero en la fila, y no se escapa ni el púlpito.',
      'El lavatorio que redefine: el Maestro no prohíbe la grandeza, cambia su dirección.',
      'La grandeza posible: todos pueden servir; la fila que Dios mira se mide por toallas, no por banderines.'
    ],
    q: [
      '"Todos pueden ser grandes, porque todos pueden servir."'
    ],
    i: 'Su última gran homilía en Ebenezer: dos meses después le escucharon en el funeral con la misma grabación; transcripción académica del King Papers de Stanford (solo con fines de estudio, © King Estate).'
  },
  {
    a: 'king',
    t: 'Amar a los enemigos',
    y: 1957,
    p: 'Dexter Avenue Baptist Church, Montgomery',
    o: 'En el punto más duro del boicot de Montgomery, King predica lo más difícil del Sermón del Monte: el amor que no negocía con la injusticia pero tampoco se hunde en su odio.',
    x: 'Mateo 5:44 — "Pero yo os digo: Amad a vuestros enemigos, bendecid a los que os maldicen, haced bien a los que os aborrecen, y orad por los que os ultrajan y os persiguen."',
    th: ['Crisis y prueba', 'Santidad'],
    ol: [
      'El mandato que corta: amar al que te persigue no es debilidad, es obediencia incómoda.',
      'El amor griego leído: agape como decisión, no simpatía; el bien actuado por el que te hace el mal.',
      'El amor que salva al amante: el odio corroe la jeringa del odiador antes que al odiado.'
    ],
    q: [
      '"El odio oscurece la vida y el amor la ilumina: eligiendo amar, me salvo a mí mismo."'
    ],
    i: 'Fue el punto más duro del boicot de Montgomery: la no violencia predicada desde el texto, semanas después de la bomba en su casa.'
  },
  // --- Paul Washer ---
  {
    a: 'washer',
    t: 'El mensaje que escandalizó',
    y: 2002,
    p: 'Conferencia juvenil, Estados Unidos',
    o: 'El sermón de 2002 que quedó grabado en la historia del avivamiento juvenil: a una sala de adolescentes acostumbrada a fiestas de gimnasio, Washer les predijo la puerta estrecha sin adornos.',
    x: 'Mateo 7:13-14 — "...estrecha es la puerta, y angosto el camino que lleva a la vida, y pocos son los que la hallan."',
    th: ['Arrepentimiento', 'Penitencia'],
    ol: [
      'El diagnostico incómodo: la puerta es estrecha y su cultura dice lo contrario.',
      'La oración repetida no salva: la conversión no es un ticket del recuerdo, es una vida nueva.',
      'La seguridad verdadera: no descansar en una decisión de la niñez, sino en Cristo vivo hoy.'
    ],
    q: [
      '"Si tu conversión es solo un recuerdo de la niñez, quizá nunca naciste de nuevo: mira tu vida, no tu pasado."'
    ],
    i: 'Las grabaciones superaron las cuatrocientas mil reproducciones y abrieron el ministerio global de HeartCry; una generación de jóvenes volvió al examen de conciencia.'
  },
  {
    a: 'washer',
    t: 'Lo que el hombre no es',
    y: 2011,
    p: 'Conferencia de HeartCry Missionary Society',
    o: 'De su predicación contra la psicología del ego: el hombre no es rico por fingirlo y no es feliz por proclamarlo; Washer desarma el evangelio del yo con el espejo de Proverbios.',
    x: 'Proverbios 13:7 — "Hay algunos que simulan ser ricos, y sin embargo no tienen nada; y hay algunos que simulan ser pobres, y sin embargo tienen muchas riquezas."',
    th: ['Idolatría del corazón', 'Anhelos humanos'],
    ol: [
      'El simulador de riqueza: la vida proyectada que esconde al hombre vacío.',
      'El simulador de pobreza: la humildad falsa que negocia aplausos.',
      'El hombre verdadero: no lo que proclama, sino lo que delante de Dios es.'
    ],
    q: [
      '"El problema del hombre no es la autoestima baja: es la adoración alta de sí mismo."'
    ],
    i: 'Sermón icónico de su crítica al evangelio terapéutico: el diagnóstico bíblico contra la cultura del yo.'
  },
  // --- R. C. Sproul ---
  {
    a: 'sproul',
    t: 'La santidad de Dios',
    y: 1985,
    p: 'St. Andrew\u2019s Chapel, Florida (serie fundacional de Ligonier)',
    o: 'La predicación que abrió toda la obra de Ligonier: el trono de Isaías 6 como categoría madre de la teología; la fecha puntual de la serie no se conserva, la ficha sigue su versión canónica.',
    x: 'Isaías 6:3 — "Santo, santo, santo, Jehová de los ejércitos; toda la tierra está llena de su gloria."',
    th: ['Adoración', 'Firma y certeza'],
    ol: [
      'La repetición que pesa: la única perfección que Dios proclama tres veces de sí mismo.',
      'El hombre que se deshace: la santidad no consuela primero, descompone; ay de mí antes de aquí estoy.',
      'El carbón que limpia: el altar que toca la boca del profeta es gracia después del juicio.'
    ],
    q: [
      '"Dios no es simplemente santo: es el Santo de los santos; la santidad no es un atributo más, es la forma de ser de todos sus atributos."'
    ],
    i: 'El sermón-libro que definió el ministerio de Sproul: la santidad como tema transversal de toda la teología reformada popular de las últimas décadas.'
  },
  {
    a: 'sproul',
    t: 'La justicia imputada',
    y: 1995,
    p: 'St. Andrew\u2019s Chapel, Florida (estilo fiel de su exposición de Romanos y 2 Corintios)',
    o: 'En su docencia constante sobre la justificación, Sproul toma el intercambio del Calvario: la cuenta que se cruza sin abuso del juez, porque el juez paga él mismo la deuda.',
    x: '2 Corintios 5:21 — "Al que no conoció pecado, lo hizo pecado por nosotros, para que nosotros seamos hechos justicia de Dios en él."',
    th: ['Gracia', 'Firma y certeza'],
    ol: [
      'El intercambio imposible: Cristo hecho pecado sin serlo; nosotros hechos justicia sin merecerla.',
      'El juez que no corrompe: la imputación no es ficción legal, es traslado real al sustituto.',
      'La seguridad doble: mi cuenta en la cruz y su justicia en mi expensa, a la vez.'
    ],
    q: [
      '"No soy justo porque lo soy: soy justo porque Él lo es; y eso, ni el infierno lo apela."'
    ],
    i: 'Ficha reconstruida de su doctrina central: la justificación por fe sola como la verdad que la iglesia siempre reconfirma o pierde.'
  },
  // --- John Piper ---
  {
    a: 'piper',
    t: 'Jactarse solo en la cruz',
    y: 2000,
    p: 'Conferencia OneDay (Passion), Memphis, Tennessee',
    o: 'Predicado de madrugada ante decenas de miles de estudiantes: el sermón que nació del manuscrito que Piper creía destinado a otra cosa y que se volvió el llamado del avivamiento juvenil del 2000.',
    x: 'Gálatas 6:14 — "Pero lejos sea de mí jactarme de otra cosa que de la cruz de nuestro Señor Jesucristo, por quien el mundo me es crucificado a mí, y yo al mundo."',
    th: ['Firma y certeza', 'Idolatría del corazón'],
    ol: [
      'El jactarse corregido: la cruz no es una doctrina entre otras, es el único pedestal del creyente.',
      'La cruz que crucifica: el mundo muerto para mí y yo muerto para el mundo, las dos direcciones del mismo clavo.',
      'El gozo mayor: renunciar a la gloria del mundo porque ya se gustó una gloria mejor.'
    ],
    q: [
      '"No hay comparación: la cruz vale más que el mundo entero, y el que la gusta, suelta el resto sin pesar."'
    ],
    i: 'Miles de estudiantes lloraron y se comprometieron a misiones; el manuscrito completo está publicado gratis en DesiringGod y el audio es de los más descargados del ministerio.'
  },
  {
    a: 'piper',
    t: 'No malgastes tu vida',
    y: 2004,
    p: 'Bethlehem Baptist Church, Minneapolis (serie que fundó el libro homónimo)',
    o: 'De la predicación que dio origen a su libro más citado por estudiantes y misioneros: una vida que se gasta en el confort es la que se pierde, y la que se vierte por Cristo es la que se halla.',
    x: 'Filipenses 1:20-21 — "...con toda firmeza de ánimo, magnificando a Cristo en mi cuerpo, o viviendo o muriendo. Porque para mí el vivir es Cristo, y el morir es ganancia."',
    th: ['Anhelos humanos', 'Crisis y prueba'],
    ol: [
      'La vida que se magnifica: el cuerpo como escena donde Cristo aparece grande.',
      'El cálculo imposible: morir es ganancia; si la muerte ya es ganancia, el riesgo no arruina.',
      'La apuesta del gozo: soltar el confort no es heroísmo, es la lógica del que ya probó algo mejor.'
    ],
    q: [
      '"No malgastes tu vida: al final te darás cuenta de que la única vida que se conserva es la que se entrega."'
    ],
    i: 'El manuscrito completo está publicado gratis en DesiringGod (Piper predicó siempre de manuscrito); el libro derivado circula en decenas de lenguas y movió campamentos estudiantiles enteros a misiones.'
  },
  {
    a: 'piper',
    t: 'Deléitate en Jehová',
    y: 1983,
    p: 'Bethlehem Baptist Church, Minneapolis (serie fundacional de Desiring God)',
    o: 'La serie de sermones que fundó el cristianismo del gozo: el deleite en Dios no es recompensa aparte, es el mandato que ordena todo el cristiano; de aquí nació el libro Desiring God.',
    x: 'Salmos 37:4 — "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón."',
    th: ['Adoración', 'Anhelos humanos'],
    ol: [
      'El deleite mandado: no es sugerencia de temperamento, es orden del Señor.',
      'El corazón que se concede: cuando el deleite está en Dios, sus deseos ya están reformados.',
      'La certeza del gozo: no es hedonismo del mundo invertido, es hedonismo sometido al Rey.'
    ],
    q: [
      '"Dios es más glorificado en nosotros cuando nosotros estamos más satisfechos en Él."'
    ],
    i: 'La semilla de toda una escuela homilética: el gozo como obligación y como motor; decenas de miles de pastores la adoptaron como eje de su predicación.'
  },
  {
    a: 'piper',
    t: 'El tesoro escondido en el campo',
    y: 1986,
    p: 'Bethlehem Baptist Church, Minneapolis',
    o: 'De sus sermones tempranos sobre el reino: la parábola del tesoro como el hallazgo que reordena la economía del corazón; uno de los mensajes más citados de su primera década.',
    x: 'Mateo 13:44 — "...el reino de los cielos es semejante a un tesoro escondido en un campo, el cual un hombre halla, y lo esconde de nuevo; y gozoso va y vende todo lo que tiene, y compra aquel campo."',
    th: ['Firma y certeza', 'Anhelos humanos'],
    ol: [
      'El hallazgo que ordena: el gozo no viene después de la venta, lo produce el tesoro ya visto.',
      'La venta gozosa: soltarlo todo no es sacrificio heroico, es aritmética del hallazgo.',
      'El campo comprado: la vida entera remanejada porque algo más grande ocupa su centro.'
    ],
    q: [
      '"El que vendió todo no lo hizo con lágrimas: el gozo del tesoro hizo barata la venta."'
    ],
    i: 'Imagen que Piper reutilizó tres décadas en sermones y libros: el gozo como lógica del sacrificio, no su sustituto.'
  },
  {
    a: 'piper',
    t: 'El centro llameante',
    y: 2003,
    p: 'Bethlehem Baptist Church, Minneapolis (serie The Blazing Center)',
    o: 'La serie que fijó su proverbio central: la gloria de Dios es el centro que no se mueve, y el gozo del creyente es la órbita donde esa gloria brilla al máximo.',
    x: 'Salmos 73:25-26 — "¿A quién tengo yo en los cielos sino a ti? Y fuera de ti nada deseo en la tierra. Mi carne y mi corazón desfallecen; Mas la fortaleza de mi corazón y mi porción es Dios para siempre."',
    th: ['Adoración', 'Firma y certeza'],
    ol: [
      'El sol que no se mueve: toda la existencia gira alrededor de la gloria de Dios.',
      'El corazón que desfallece y no cae: la porción eterna sostiene al que ya no tiene nada.',
      'La satisfacción máxima: el creyente satisfecho es el que mejor muestra quién vale más.'
    ],
    q: [
      '"Cuando Jesús desfallece en tu deseo, el universo entero pierde su sol."'
    ],
    i: 'El eslogan nacido de la serie —Dios es más glorificado cuando somos más satisfechos— se convirtió en la bisagra de su ministerio entero y de los congresos juveniles de Passion.'
  },
  {
    a: 'piper',
    t: 'Cómo beber jugo de naranja para la gloria de Dios',
    y: 1995,
    p: 'Bethlehem Baptist Church, Minneapolis (serie de la gracia futura)',
    o: 'El sermón de la serie de la gracia futura que lo hizo famoso por su título: beber un vaso de jugo con gratitud es un acto de adoración; lo ordinario cultiva la fe que descansa en promesas futuras.',
    x: '1 Corintios 10:31 — "...si coméis o bebéis o hacéis alguna otra cosa, hacedlo todo para la gloria de Dios."',
    th: ['Adoración', 'Gracia'],
    ol: [
      'Lo común también glorifica: comer y beber se vuelven culto cuando brotan de la gratitud.',
      'La fe contra el descontento: beber con gozo es confiar en las promesas que el vaso anticipa.',
      'La vida sin zonas secularizadas: no hay rincurón del creyente donde Dios no reciba la gloria.'
    ],
    q: [
      '"Bebe tu jugo con gratitud y ya predicaste: la mesa es púlpito de la fe."'
    ],
    i: 'El título lo hizo célebre en radio y libros; enseñó a una generación que la gloria de Dios no vive solo en lo extraordinario.'
  },
  {
    a: 'piper',
    t: 'La guerra contra la ansiedad',
    y: 1994,
    p: 'Bethlehem Baptist Church, Minneapolis (serie sobre la incredulidad a vencer)',
    o: 'De su larga serie sobre batallas de fe: la ansiedad como incredulidad tratable, no como temperamento condenado; la oración y la promesa como armas del creyente desasosegado.',
    x: 'Filipenses 4:6 — "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias."',
    th: ['Crisis y prueba', 'Oración'],
    ol: [
      'La ansiedad nombrada: no es malfunction del temperamento, es pelea por la confianza.',
      'La conversión de la preocupación: lo que inquieta se convierte en petición con gratitud.',
      'La paz que guarda: el resultado no es control de la vida, es custodia del corazón.'
    ],
    q: [
      '"La ansiedad se derrota con promesa y oración, no con fuerza de carácter."'
    ],
    i: 'Material que se volvió su libro sobre la incredulidad: el pastor como médico del alma que receta promesas concretas.'
  },
  {
    a: 'piper',
    t: 'Dios es el evangelio',
    y: 2004,
    p: 'Bethlehem Baptist Church, Minneapolis (de la predicación que fundó el libro homónimo)',
    o: 'Su tesis más discutida: el evangelio no es buena noticia si solo perdona y no lleva a Dios; la perla del mensaje es Cristo mismo, no sus beneficios desanclados.',
    x: 'Filipenses 3:8 — "...así que todas las cosas las tengo por pérdida por la excelencia del conocimiento de Cristo Jesús, mi Señor."',
    th: ['Adoración', 'Gracia'],
    ol: [
      'El perdón no es la meta final: es la puerta; la sala es el gozo en Dios mismo.',
      'La pérdida que gana: todo lo demás se considera pérdida frente al conocerlo.',
      'El evangelio que brilla: cuando se predica Dios como regalo, la cruz brilla en su lugar.'
    ],
    q: [
      '"El evangelio no es buena noticia si solo nos salva de algo y no nos lleva a Alguien."'
    ],
    i: 'Reconfiguró la conversación evangélica sobre el motivó central de la fe; libro y sermones formaron a una generación de pastores que predicaban el don antes que los regalos.'
  },
  {
    a: 'piper',
    t: 'Cuando no deseo a Dios',
    y: 2004,
    p: 'Bethlehem Baptist Church, Minneapolis (serie que fundó el libro de la pelea por el gozo)',
    o: 'La continuación honesta de Desiring God: ¿qué hacer cuando el corazón está seco? Piper responde con la pelea por el gozo: el deseo perdido no se denuncia, se combate.',
    x: 'Salmos 51:12 — "Devuélveme el gozo de tu salvación, y firme espíritu me sostenga."',
    th: ['Penitencia', 'Crisis y prueba'],
    ol: [
      'El gozo perdido no es sinónimo de fe muerta: es señal de batalla abierta.',
      'Las armas de la pelea: la Palabra dicha en voz alta, la oración, el cuerpo disciplinado.',
      'El gozo devuelto: no es nostalgia de la conversión, es promesa que Dios reface.'
    ],
    q: [
      '"El gozo en Dios no se presume: se pelea; y la pelea ya es gozo en germen."'
    ],
    i: 'Dio vocabulario pastoral a miles de creyentes secos: la espiritualidad como combate gozoso, no como performance emocional.'
  },
  {
    a: 'piper',
    t: 'Dios se complace en hacer',
    y: 1988,
    p: 'Bethlehem Baptist Church, Minneapolis (serie Los placeres de Dios)',
    o: 'La serie que miró del otro lado del pacto: ¿qué complace a Dios? El texto afirma que hace lo que quiere y que se alegra en hacerlo; la soberanía como placer, no como máquina.',
    x: 'Salmos 115:3 — "Nuestro Dios está en los cielos; todo lo que quiso, ha hecho."',
    th: ['Firma y certeza', 'Adoración'],
    ol: [
      'La soberanía gozosa: Dios no hace por obligación; hace lo que se complace en hacer.',
      'El placer revelado: la Biblia habla de deleites de Dios concretos, no de un capricho abstracto.',
      'La confianza que libera: si Dios se complace en su plan, el creyente puede descansar en él.'
    ],
    q: [
      '"Dios no es un rey atado: es un Padre que goza; y su gozo incluye tu rescate."'
    ],
    i: 'El libro derivado marcó su década: la soberanía presentada como placer gozoso y no como determinismo frío.'
  },
  {
    a: 'piper',
    t: 'Nacidos de nuevo para una esperanza viva',
    y: 2009,
    p: 'Bethlehem Baptist Church, Minneapolis (serie que fundó el libro sobre el nuevo nacimiento)',
    o: 'De su exposición larga sobre el nuevo nacimiento: la regeneración como milagro de gracia que produce la esperanza viva; la serie se editó como libro para desarmar la conversión folclórica.',
    x: '1 Pedro 1:3 — "...según su gran misericordia, nos ha hecho nacer de nuevo para una esperanza viva, por la resurrección de Jesucristo de los muertos."',
    th: ['Gracia', 'Firma y certeza'],
    ol: [
      'El nacimiento que no se fabrica: nadie se hace nacer; se es nacido.',
      'La esperanza viva: no es optimismo, es el fruto de la resurrección como hecho presente.',
      'La herencia guardada: lo que nace de Dios guarda lo que Dios guarda.'
    ],
    q: [
      '"El nuevo nacimiento no es una decisión recordada: es un milagro vivido."'
    ],
    i: 'Culminó su década de expositiva sobre la conversión: la regeneración como obra de Dios y no como folklore del recuerdo infantil.'
  },
  {
    a: 'piper',
    t: 'No malgastes tu cáncer',
    y: 2011,
    p: 'Bethlehem Baptist Church, Minneapolis (meditación predicada y escrita con David Powlison)',
    o: 'Nacida de su propio diagnóstico de cáncer de próstata: Piper elige no desperdiciar la enfermedad; la meditación se volvió folleto pastoral de manos a pacientes en todo el mundo.',
    x: 'Job 1:21 — "Desnudo salí del vientre de mi madre, y desnudo tornaré allá; Jehová lo dio, y Jehová lo quitó; sea el nombre de Jehová bendito."',
    th: ['Crisis y prueba', 'Muerte y eternidad'],
    ol: [
      'Las dos preguntas prohibidas: ¿por qué? y ¿para qué?; la segunda salva, la primera paraliza.',
      'El trabajo de la enfermedad: el cáncer puede despilfarrarse con rabia o gastarse en eternidad.',
      'La fe que pronuncia bendición: el texto de Job como gramática del corazón herido.'
    ],
    q: [
      '"No malgastes tu cáncer: puedes perderlo todo y ganar lo que no se pierde."'
    ],
    i: 'El folleto llegó a hospitales y capellanías de medio mundo; su doctorado personal fue leído por miles de pacientes como retrato de la fe ante la propia muerte.'
  },
  {
    a: 'piper',
    t: 'Descubre mis ojos',
    y: 2013,
    p: 'Bethlehem Baptist Church, Minneapolis (serie de la lectura sobrenatural de la Biblia)',
    o: 'De su larga serie sobre cómo leer las Escrituras: la Biblia no se lee solo con método, se lee con milagro; la petición del salmista es la puerta de toda lectura fructífera.',
    x: 'Salmos 119:18 — "Descubre mis ojos, para que contemple las maravillas de tu ley."',
    th: ['Oración', 'Firma y certeza'],
    ol: [
      'La petición que presupone ceguera: nadie lee bien sin ser liberado para leer.',
      'Las maravillas, no las letras: la meta no es información, es contemplación.',
      'El método sometido al milagro: la buena hermenéutica pide, y la oración abre lo que el estudio afina.'
    ],
    q: [
      '"El milagro no reemplaza el método: lo anima; ora mientras lees y lee mientras ora."'
    ],
    i: 'El marco de su enseñanza tardía sobre la Biblia: la lectura como acto dependiente del Espíritu, dada a decenas de miles en sus plataformas gratis.'
  },
  {
    a: 'piper',
    t: 'La gloria de Dios en el rostro de Cristo',
    y: 2014,
    p: 'Bethlehem Baptist Church, Minneapolis (de su exposición de 2 Corintios)',
    o: 'De su serie sobre el ministerio de la gloria: el dios de este siglo ciega, y solo el Creador que dijo que brille la luz puede abrirla; la predicación como obra de luz, no de retórica.',
    x: '2 Corintios 4:6 — "Porque Dios, que mandó que de las tinieblas resplandeciese la luz, es el que resplandeció en nuestros corazones, para iluminación del conocimiento de la gloria de Dios en la faz de Jesucristo."',
    th: ['Adoración', 'Crisis y prueba'],
    ol: [
      'La ceguera que fabrica el dios de este siglo: no ve porque no quiere ver la gloria.',
      'El mismo que hizo la luz: la conversión no es persuasión humana, es creación nueva.',
      'La faz de Jesucristo: la gloria no es un concepto, es una persona mirada.'
    ],
    q: [
      '"Nadie ve la gloria con ojos de ciencia: la ve el corazón que Dios ilumina."'
    ],
    i: 'Textículo central de su homilética: el predicador como portador de luz y no como artesano de efectos; sermón citado en su defensa de la predicación sobrenatural.'
  },
  {
    a: 'piper',
    t: 'Una ambición santa por las naciones',
    y: 2001,
    p: 'Bethlehem Baptist Church, Minneapolis (de su predicación misionera)',
    o: 'Su sermón clásico de misiones: la ambición de predicar donde nadie lo hizo; Piper ordena su iglesia alrededor del gozo que las naciones todavía no han probado.',
    x: 'Romanos 15:20-21 — "...nunca predicó donde Cristo fuese nombrado, para no edificar sobre cimiento ajeno, sino como está escrito: Aquellos a quienes no fue anunciado de él, verán; y los que no han oído de él, entenderán."',
    th: ['Evangelismo', 'Firma y certeza'],
    ol: [
      'La ambición que no compite: no edifica sobre cimiento ajeno; va a donde falta el anuncio.',
      'El plan de Pablo: la palabra del texto como estrategia de las naciones, no como anécdota.',
      'El gozo que viaja: la misión es exportar satisfacción, no exportar cultura.'
    ],
    q: [
      '"Hay gozo en las naciones que todavía nadie les ha contado: por eso existe la misión."'
    ],
    i: 'El marco de su visión misionera: Bethlehem se convirtió en iglesia que envía y sostiene obreros, con la ambición santa como brújula de la casa.'
  },
  {
    a: 'piper',
    t: 'Armonía étnica para el evangelio',
    y: 1994,
    p: 'Bethlehem Baptist Church, Minneapolis (de su serie sobre la hostilidad étnica)',
    o: 'En el clima tenso de los años del conflicto racial en EE. UU., Piper predica que el evangelio no puede coexistir con la hostilidad étnica: el muro derribado es su argumento.',
    x: 'Efesios 2:14-16 — "Porque él es nuestra paz... derribando la pared intermedia de separación... y mediante la cruz reconciliar con Dios a ambos en un solo cuerpo."',
    th: ['Crisis y prueba', 'Gracia'],
    ol: [
      'El muro que la cruz derribó: la hostilidad étnica no es cultura, es calvario desobedecido.',
      'El un solo cuerpo: la reconciliación con Dios produce reconciliación con el otro.',
      'La iglesia como espectáculo: el mundo ve el evangelio cuando ve la mesa compartida.'
    ],
    q: [
      '"Una iglesia que se divide por etnia predica con silencio lo contrario del evangelio."'
    ],
    i: 'Lo convirtió en línea de ministerio de su iglesia: la armonía étnica como cumplimiento visible del evangelio, no como agenda social aparte.'
  },
  {
    a: 'piper',
    t: 'El matrimonio como imitación del evangelio',
    y: 2009,
    p: 'Bethlehem Baptist Church, Minneapolis (de la serie que fundó su libro sobre el matrimonio)',
    o: 'De su predicación sobre Efesios 5: el matrimonio no es un contrato de satisfacción, es una escenografía del amor que se entrega; el esposo que no muere por su esposa no ha entendido el texto.',
    x: 'Efesios 5:25 — "Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia, y se entregó a sí mismo por ella."',
    th: ['Santidad', 'Gracia'],
    ol: [
      'El comparador que asusta: así como Cristo amó; el patrón no es la felicidad, es el Calvario.',
      'La entrega que santifica: el matrimonio existe para que dos se parezcan a Cristo.',
      'La gracia que sostiene: ningún matrimonio sobrevive a la comparación sin la gracia del modelo.'
    ],
    q: [
      '"El matrimonio no fue inventado para hacerte feliz, sino para hacerte santo: y esa santidad resulta gozosa."'
    ],
    i: 'Su libro derivado se volvió lectura estándar de preparación matrimonial en iglesias reformadas del mundo entero.'
  },
  {
    a: 'piper',
    t: 'El sufrimiento y la soberanía de Dios',
    y: 2005,
    p: 'Bethlehem Baptist Church, Minneapolis (de su serie sobre el dolor y la gloria)',
    o: 'En la década que enterró amigos y padeció cáncer, Piper predica el sufrimiento bajo soberanía: no es explicación fría, es la casa donde el dolor deja de ser destino.',
    x: 'Romanos 8:18 — "...los sufrimientos del tiempo presente no son dignos de ser comparados con la gloria que será manifestada en nosotros."',
    th: ['Crisis y prueba', 'Muerte y eternidad'],
    ol: [
      'La aritmética de la gloria: el sufrimiento se pesa contra una gloria desproporcionada.',
      'La soberanía que no escamotea: Dios no promete explicar el dolor, promete custodiarlo.',
      'El gozo que atraviesa: el afán del texto no niega el llanto, lo orienta a la manifestación.'
    ],
    q: [
      '"Dios no explica el dolor: lo pesa contra una gloria que el dolor no puede tocar."'
    ],
    i: 'Marco de su pastoral en años de tragedia: la soberanía presentada como consuelo del creyente y no como desafío del teólogo.'
  },
  {
    a: 'piper',
    t: 'La sed que Dios quiere calmar',
    y: 2008,
    p: 'Bethlehem Baptist Church, Minneapolis (estilo fiel de su ciclo sobre Juan 7)',
    o: 'En su exposición del capítulo de las fiestas de Juan, Piper toma el grito de Jesús en la fiesta de los tabernáculos: el creyente que viene a Él es el que bebe y de donde salen ríos.',
    x: 'Juan 7:37-38 — "Si alguno tiene sed, venga a mí y beba. El que cree en mí, como dice la Escritura, de su interior correrán ríos de agua viva."',
    th: ['Anhelos humanos', 'Adoración'],
    ol: [
      'La sed reconocida: el creyente no disfraza su hambre, la lleva al lugar correcto.',
      'Venir y beber: la fe como consumo de Cristo, no como gesto de cortesía.',
      'Los ríos que corren: la satisfacción que desborda al prójimo no se guarda.'
    ],
    q: [
      '"No vengas con corazón de observador: ven con sed, y bebe."'
    ],
    i: 'Ficha reconstruida del ciclo de Juan: su cristianismo del gozo aplicado a la sed como retórica central del evangelio de Juan.'
  },
  {
    a: 'piper',
    t: 'La adoración como banquete',
    y: 2007,
    p: 'Bethlehem Baptist Church, Minneapolis (estilo fiel de su enseñanza sobre la adoración)',
    o: 'En sus enseñanzas sobre la adoración, Piper expone el salmista que prefiere la casa de Dios: el culto no es concierto ni ceremonia, es banquete del alma donde se saborea a Dios mismo.',
    x: 'Salmos 63:5-6 — "Mi alma estará satisfecha como con tu manjar sustancioso; y con labores gozosas te alabaré, cuando me acuerde de ti en mi cama, y medite de ti en las velas de la noche."',
    th: ['Adoración', 'Anhelos humanos'],
    ol: [
      'El manjar sustancioso: la adoración no admira el ambiente, saborea a Dios.',
      'El recuerdo nocturno: la adoración que no cabe en el culto sigue en la cama y en la vela.',
      'Las labores gozosas: la alabanza no es descanso del trabajo, es trabajo con sabor.'
    ],
    q: [
      '"La adoración no es entretenimiento que calma: es banquete que alimenta y luego desborda en alabanza."'
    ],
    i: 'Ficha reconstruida de su doctrina de la adoración: el culto como satisfacción del alma en Dios, lección que formó el clima musical de su iglesia.'
  },
  {
    a: 'piper',
    t: 'La carrera y el gozo',
    y: 2003,
    p: 'Bethlehem Baptist Church, Minneapolis (del corpus que dio origen a No malgastes tu vida)',
    o: 'Del discurso de despedida de Pablo a los ancianos de Éfeso, Piper toma la estima de la vida: el que no hace de su vida un ídolo puede gastarla por el evangelio sin miedo.',
    x: 'Hechos 20:24 — "Pero de mi vida no hago caso en absoluto, como que para mí la vida es preciosa, con tal de que acabe mi carrera, y cumpla con alegría el ministerio que recibí del Señor Jesús, para dar testimonio del evangelio de la gracia de Dios."',
    th: ['Evangelismo', 'Anhelos humanos'],
    ol: [
      'La vida que no se idolatra: el que la estima por lo que sirve, no por lo que guarda.',
      'La carrera con alegría: el ministerio no se cumple con diente apretado, se cumple con gozo.',
      'El testimonio de la gracia: la meta no es ser recordado, es dar testimonio.'
    ],
    q: [
      '"El que no suelta su vida, la pierde; el que la gasta por el evangelio, la encuentra gozosa."'
    ],
    i: 'Texto central del capítulo que dio nombre a su libro más citado por misioneros: la vida como combustible del testimonio.'
  },
  {
    a: 'piper',
    t: 'Riesgo y gloria: la apuesta de la fe',
    y: 2013,
    p: 'Bethlehem Baptist Church, Minneapolis (de la predicación que fundó su libro sobre el riesgo)',
    o: 'De su mensaje sobre el riesgo cristiano: la fe que ama al prójimo acepta el riesgo porque la seguridad definitiva ya está ganada; el amar sin riesgo es amar con recinto.',
    x: 'Ester 4:14 — "...¿y quién sabe si para este tiempo has llegado al reino?"',
    th: ['Crisis y prueba', 'Evangelismo'],
    ol: [
      'La seguridad que libera: el que está escondido en Dios puede arriesgar lo demás.',
      'El amor que calcula: el cálculo no es del peligro, es del gozo del prójimo.',
      'La hora del reino: la providencia pone al creyente en el lugar y el día; callar es perder.'
    ],
    q: [
      '"El riesgo no es falta de fe: es fe que se niega a amar desde la cueva."'
    ],
    i: 'El marco que reorientó su predicación tardía sobre el llamado: el creyente como agente en la historia, no como espectador protegido.'
  },
  {
    a: 'latimer',
    t: 'Siete sermones sobre el Padrenuestro',
    y: 1552,
    p: 'Casa de Grimsthorpe, Lincolnshire (serie predicada en 1552 ante lady Katherine, duquesa de Suffolk, editada por la Parker Society)',
    o: 'Serie completa predicada a petición de la duquesa de Suffolk para su casa y criados: el obispo anciano toma la plegaria que el reino reza sin entenderla y la convierte en espejo de toda la nación. No escribió para teólogos: escribió para que cada arador supiera qué pide su lengua cuando reza.',
    x: 'Mateo 6:9 — "Padre nuestro que estás en los cielos, santificado sea tu nombre."',
    th: ['Oración', 'Santidad'],
    ol: [
      'Abre la serie midiendo la distancia entre los labios y el corazón: toda Inglaterra recita el Padrenuestro, pero pocos entienden que al decir Padre nuestro se comprometen con sus hermanos y renuncian a orar solos.',
      'Gasta la segunda mitad en la petición del perdón, y de ahí salta al perdón que debemos: quien reza con rencor en el pecho acusa su propia causa delante del juez que escucha.',
      'Cierra con la tentación y el reino final, recordando al rey y a la corte que la corona misma vive bajo peticiones ajenas: el poder de Inglaterra reza cada día contra su propia soberbia.',
    ],
    q: [
      '"Quien reza el Padrenuestro y no perdona a su hermano, reza contra sí mismo"',
      '"La oración que todos saben de memoria es la escuela donde la nación entera aprende a hablar con Dios"',
    ],
    i: 'La serie consolidó la predicación doctrinal en lengua llana como tesoro nacional y pasó íntegra a la edición de la Parker Society de 1844.',
  },
  {
    a: 'latimer',
    t: 'La segunda ronda de las cartas',
    y: 1530,
    p: 'Londres (estilo fiel de su serie de sermones de las cartas, Parker Society)',
    o: 'Tras el gran sermón de Pascua de 1529 ante la corte, la serie volvió al tablero de las cartas para otra ronda ante el pueblo de la ciudad, con el truco campesino de enseñar doctrina con el juego de mano que todos conocían. Es síntesis editorial de esa continuación: el método es suyo, la fecha aproximada.',
    x: 'Juan 3:21 — "Mas el que hace la verdad, viene a la luz, para que sea manifiesto que sus obras son hechas en Dios."',
    th: ['Gracia', 'Firma y certeza'],
    ol: [
      'Vuelve al tablero y baraja de nuevo: la carta del triunfo no la juega el jugador sino la mano, porque el corazón regenerado no gana por destreza propia sino por el reparto que la gracia le da.',
      'Contrapone al pecador que tapa sus cartas de la luz al creyente que las tiende sobre la mesa: la fe verdadera no teme el examen, porque su juego entero depende de otro mejor jugador.',
      'Cierra advirtiendo que no bastan las cartas bautizadas de la costumbre: hay que ver qué carta sostiene la mano cuando nadie mira, y ahí se decide si hay fe o solo juego.',
    ],
    q: [
      '"La carta que gana no la juega el hombre: se la reparte la gracia"',
      '"La fe que no se atreve a tender sus cartas a la luz juega con naipe falso"',
    ],
    i: 'Mantiene vivo el método didáctico que hizo célebre al primer sermón de las cartas y muestra cómo Latimer reutilizaba una misma figura para públicos sucesivos.',
  },
  {
    a: 'latimer',
    t: 'La semilla y los suelos',
    y: 1550,
    p: 'Cuaresma de corte (estilo fiel de la Parker Society)',
    o: 'Predicación sobre la parábola del sembrador dentro de sus sermones de corte, donde el viejo obispo venido de la labranza halló en el campo la imagen completa de la predicación: el mismo grano cae en cuatro clases de tierra, y el predicador no controla el suelo. Es síntesis editorial de su serie, no pieza datada.',
    x: 'Mateo 13:23 — "Pero el que fue sembrado en buena tierra, éste es el que oye y entiende la palabra, y da fruto a cien, a sesenta y a treinta por uno."',
    th: ['Evangelismo', 'Crisis y prueba'],
    ol: [
      'Fija la responsabilidad donde el texto la pone: el sembrador es fiel si siembra, pero el fruto se decide en el suelo, y por eso cada oyente debe reconocer qué clase de campo es su corazón.',
      'Desmenuza los suelos pedregosos y espinosos con humor cortante: la fe que nace del entusiasmo de un sermón y muere con la persecución, y la palabra ahogada por los negocios y las riquezas de esta era.',
      'Termina consolando al predicador perseguido y al arador escuchado: no mida el hombre su ministerio por la cosecha del día, porque la semilla buena tarda, y el fruto del buen suelo es paciencia.',
    ],
    q: [
      '"El mismo grano cae en cuatro suelos: la diferencia no está en el sembrador sino en el corazón"',
      '"La paciencia es el fruto que delata que la tierra era buena"',
    ],
  },
  {
    a: 'latimer',
    t: 'La fe que se demuestra en obras',
    y: 1549,
    p: 'Londres (estilo fiel de su predicación sobre la epístola de Santiago, Parker Society)',
    o: 'Dentro de su predicación continua sobre la epístola de Santiago, Latimer se atrevió con el párrafo que separaba a luteranos y católicos, y lo leyó como campesino: la fe sola salva, pero la fe que se queda sola no existe. Es síntesis editorial de esa predicación, no sermón datado con precisión.',
    x: 'Santiago 2:17 — "Así también la fe, si no tiene obras, es muerta en sí misma."',
    th: ['Gracia', 'Santidad'],
    ol: [
      'Niega que el texto dé a las obras la llave del cielo, pero niega con más dureza la fe muerta que se contenta con la profesión: el árbol justificado por la raíz se conoce por el fruto.',
      'Ejemplifica con la caridad cotidiana del pueblo: el que ve al pobre y le desea calor sin encender el fuego tiene una fe de palabras que ni el diablo discute.',
      'Aplica el espejo a la corte reformada: la nueva doctrina no vino para cambiar de discursos sino de obras, y Inglaterra sería juzgada por sus limosnas y sus tribunales, no por sus artículos.',
    ],
    q: [
      '"La fe sola salva, pero la fe que queda sola muere"',
      '"El árbol no se justifica por el fruto, pero se conoce por él"',
    ],
    i: 'Ofrece la vía inglesa media entre Roma y Wittenberg sobre fe y obras, con la llaneza que hizo popular la doctrina en la gente común.',
  },
  {
    a: 'latimer',
    t: 'La homilía de la Navidad',
    y: 1552,
    p: 'Inglaterra (estilo fiel de su predicación festiva, Parker Society)',
    o: 'Sermón de Nochebuena ante Eduardo VI, en el que el predicador de la corte sostiene la noche con la escena de los pastores: no hubo para el nacimiento ni palacio ni pluma, sino campo, rebaño y noticia dicha en llano. Es síntesis editorial de su predicación navideña en esas series.',
    x: 'Lucas 2:10 — "No temáis; porque he aquí os anuncio buenas nuevas de gran gozo, que será para todo el pueblo."',
    th: ['Adoración', 'Gracia'],
    ol: [
      'Señala el contraste del cielo con la corte: el ángel no eligió al rey ni a los sabios para la primera noticia, sino a pastores desvelados, porque el evangelio nació hablando en lengua de campo.',
      'Desnuda la pobreza del pesebre contra toda pompa del clero: el Señor del cielo nació sin cuna, y así prueba que no vino a comprar nada sino a dar lo que ningún dinero alcanza.',
      'Aplica el gozo a la nación: si la noticia es para todo el pueblo, también la corte ha de doblar la rodilla, y el rey niño de Inglaterra y el niño de Belén caben en la misma noche.',
    ],
    q: [
      '"Dios eligió a pastores para la primera predicación del nacimiento: el evangelio habla en llano"',
    ],
    i: 'Modelo de homilía festiva reformada en inglés temprano, citada por la Parker Society como muestra de su llaneza ante la corte.',
  },
  {
    a: 'latimer',
    t: 'Contra la avaricia de los señores',
    y: 1549,
    p: 'Corte de Eduardo VI (estilo fiel de su predicación contra los cercamientos de tierras, Parker Society)',
    o: 'Predicación ante el rey contra los señores que cercaban tierras comunes y expulsaban aradores para engordar rebaños: el obispo que había sido arador habló del campo con nombres propios y sin tapujos. Es síntesis editorial de esa línea de sus sermones públicos.',
    x: 'Lucas 12:15 — "Mirad, y guardaos de toda codicia; porque la vida de cualquiera no consiste en la abundancia de los bienes que posee."',
    th: ['Idolatría del corazón', 'Crisis y prueba'],
    ol: [
      'Nombra el pecado por su nombre de campo: el señor que cercó la tierra de los pobres hizo de la oveja su dios, y donde la bolsa gobierna el corazón no cabe corona ni obispado.',
      'Acusa los cercamientos como heridas de la república: las aldeas vacías y los aradores despedidos son testigos mudos contra los dueños que convirtieron el pan del pueblo en lana para vender.',
      'Advierte que Dios cuenta las cercas: la riqueza mal obtenida no se hereda a los hijos, sino el clamor de los despojados, que sube más deprisa que cualquier pleito de los tribunales.',
    ],
    q: [
      '"El señor que cercó el campo del pobre hizo de su rebaño un ídolo"',
      '"Dios oye el clamor de los despojados mejor que los tribunales de los señores"',
    ],
    i: 'Su denuncia de los cercamientos pasó al testimonio parlamentario y es una de las voces sociales más citadas de la Reforma inglesa.',
  },
  {
    a: 'latimer',
    t: 'Las heridas de Inglaterra',
    y: 1535,
    p: 'Londres, predicación ante la corte y el rey (estilo fiel de sus sermones públicos, Parker Society)',
    o: 'De sus sermones de los años treinta ante la corte, cuando predicó la justicia de los tribunales y el sostén de los pobres como deuda del reino y no como limosna: era la línea que lo llevó a la Torre y a la hoguera sin desdecirse. Es síntesis editorial de esa década de predicación.',
    x: 'Miqueas 6:8 — "Oh hombre, él te ha declarado lo que es bueno, y qué pide de ti Jehová: solamente hacer justicia, y amar misericordia, y humillarte ante tu Dios."',
    th: ['Crisis y prueba', 'Santidad'],
    ol: [
      'Diagnostica la nación como un cuerpo llagado: los pobres a los que no se juzga con justicia son las llagas por donde entra la mortandad, y el rey que las ignora sangra por su cuenta.',
      'Convierte el púlpito en tribunal: el oficio del predicador es decir verdad al príncipe sobre los jueces venales, porque la justicia mal vendida cuesta más que ninguna guerra exterior.',
      'Pide reformas concretas y no retóricas: jueces pagados, leyes para el pobre y magistrados que conozcan el precio del pan, porque el evangelio se prueba en el reino por las sentencias.',
    ],
    q: [
      '"Las llagas del pobre son las heridas del reino, y el rey que no las cura sangra por su cuenta"',
      '"Predicar al príncipe la justicia es oficio del púlpito, no traición"',
    ],
  },
  {
    a: 'latimer',
    t: 'La preparación de la muerte',
    y: 1555,
    p: 'Oxford (marco del testimonio ante la hoguera; enseñanza fiel a sus últimos sermones)',
    o: 'Enseñanza sobre la muerte bien preparada tomada de sus últimos sermones y sellada por su propio fin: el 16 de octubre de 1555, en la hoguera junto a Ridley, dio a la frase su prueba final cuando la llama alcanzó su pecho. Es síntesis editorial, no pieza única datada.',
    x: 'Filipenses 1:21 — "Porque para mí el vivir es Cristo, y el morir es ganancia."',
    th: ['Muerte y eternidad', 'Firma y certeza'],
    ol: [
      'Ordena preparar la muerte de día y no de noche: quien ajusta sus cuentas con Dios cada semana no negocia el pánico en el lecho, porque la conciencia limpia es el mejor testamento.',
      'Rechaza las muletas con que el mundo muere: reliquias, bulas y cuentas compradas no sostienen el último paso, y la gracia prestada de otro se cae justo cuando el peso es mayor.',
      'Sella la doctrina con su ejemplo: en Oxford no invocó méritos ni disputas, sino la promesa, y así enseñó a Inglaterra cómo se muere la fe que se enseñó de día.',
    ],
    q: [
      '"La muerte se prepara de día, no de noche, y con promesa y no con bulas"',
      '"La gracia prestada de otro no sostiene el último paso"',
    ],
    i: 'Su muerte en la hoguera con Ridley es conmemorada en el Martyrs Memorial de Oxford y fijó su enseñanza sobre la muerte como testimonio nacional.',
  },
  {
    a: 'latimer',
    t: 'La ley que espanta y el evangelio que cura',
    y: 1550,
    p: 'Cuaresma de corte (estilo fiel de las series ante Eduardo VI, Parker Society)',
    o: 'De sus series de corte, la lección que divide toda la Escritura en dos voces: la ley que descubre la llaga y el evangelio que la cura, y un orden invertido mata al paciente. Es síntesis editorial de esa enseñanza en sus sermones públicos.',
    x: 'Gálatas 3:24 — "De manera que la ley ha sido nuestro tutor, para llevarnos a Cristo, a fin de que fuésemos justificados por la fe."',
    th: ['Gracia', 'Arrepentimiento'],
    ol: [
      'Define los oficios: la ley es el espejo donde el hombre ve la suciedad de su rostro, pero ningún espejo lava, y usar el espejo para lavarse es la religión falsa más común.',
      'Advierte el doble error del orden: predicar evangelio sin ley produce presunción, y predicar ley sin evangelio produce desesperación, y ambas matan al oyente por caminos distintos.',
      'Ilustra con la casa campesina: primero el diagnóstico del médico que espanta, después el jarabe que cura, y el buen predicador debe saber cuál de las dos voces conviene a su parroquia esa semana.',
    ],
    q: [
      '"La ley descubre la llaga y el evangelio la cura, y el orden invertido mata"',
      '"Ningún espejo lava el rostro que muestra"',
    ],
    i: 'Articula la distinción entre ley y evangelio en la lengua del pueblo inglés, pieza central de su teología predicada según la Parker Society.',
  },
  {
    a: 'latimer',
    t: 'El Padrenuestro como escuela de la nación',
    y: 1552,
    p: 'Casa de Grimsthorpe, Lincolnshire (estilo fiel de las series sobre el Padrenuestro, Parker Society)',
    o: 'De la misma serie de 1552, el sermón donde la oración deja de ser devoción privada para volverse programa de gobierno: pide que la corte, los tribunales y las parroquias oren y gobiernen conforme a lo que la lengua ya sabe decir. Es síntesis editorial de la serie.',
    x: '1 Timoteo 2:1 — "Antes de todo, exhorto que se hagan rogativas, oraciones, peticiones y acciones de gracias por todos los hombres."',
    th: ['Oración', 'Crisis y prueba'],
    ol: [
      'Sostiene que el reino ya sabe orar pero no gobierna orando: si las cortes dijeran en hechos lo que repiten los labios, ni los pobres pedirían pan a puertas cerradas.',
      'Ordena la escalera de la petición pública: rogativas por el rey, por los jueces y por el pan de cada día, porque la política del cristiano empieza en la rodilla y termina en el consejo.',
      'Cierra uniendo el altar y el tribunal: la nación que ora da gracias por la justicia que oye, y la que no la tiene no puede fingir la voz, así que reformar tribunales es parte del culto.',
    ],
    q: [
      '"El reino que reza bien ha de gobernar conforme a lo que reza"',
      '"La política del cristiano empieza en la rodilla y termina en el consejo"',
    ],
  },
  {
    a: 'baxter',
    t: 'La conversión que se examina',
    y: 1658,
    p: 'Kidderminster (estilo fiel de A Call to the Unconverted, 1658)',
    o: 'Nacida de su llamada a los no convertidos, obra que en Kidderminster se enfrentó casa por casa: si el ministerio era cura de almas, la conversión debía tomarse el pulso, y el pastor debía preguntar con datos y no con frases de púlpito. Es síntesis editorial de esa obra y su predicación.',
    x: 'Ezequiel 33:11 — "Diles: Vivo yo, dice Jehová el Señor, que no quiero la muerte del impío, sino que se vuelva el impío de su camino, y viva."',
    th: ['Evangelismo', 'Arrepentimiento'],
    ol: [
      'Pone al oyente ante el inventario: no pregunte si asistió al culto sino si nació de nuevo, porque el nombre en el registro de la parroquia no borra el nombre que falta en el libro de la vida.',
      'Razona desde el juramento divino: Dios declara que no quiere la muerte del impío, de modo que la condena nunca la firma el cielo primero, sino el pecador que rehúsa volver.',
      'Convierte la llamada en método pastoral: el ministro que no conoce el estado de cada oveja no puede llamar a ninguna, y por eso Baxter catequizó a ochocientas familias una por una.',
    ],
    q: [
      '"Dios no firma primero la sentencia: la firma el pecador que rehúsa volver"',
      '"El nombre en el registro de la parroquia no salva: lo que salva es nacer de nuevo"',
    ],
    i: 'A Call to the Unconverted marcó a generaciones de pastores evangélicos y la tradición lo cuenta entre los libros que más conversiones produjeron en su siglo.',
  },
  {
    a: 'baxter',
    t: 'Ahora o nunca',
    y: 1658,
    p: 'Kidderminster (estilo fiel de su llamada Now or Never, en A Call to the Unconverted)',
    o: 'Segunda pieza de su llamada al no convertido, donde la urgencia reemplaza al argumento: si la eternidad pesa sobre cada decisión, el aplazamiento es la peor de las decisiones, y el pastor médico no receta remedios para mañana. Es síntesis editorial de esa parte de la obra.',
    x: '2 Corintios 6:2 — "he aquí ahora el tiempo propicio; he aquí ahora el día de salvación."',
    th: ['Arrepentimiento', 'Crisis y prueba'],
    ol: [
      'Mide el aplazamiento con la aritmética del alma: cada día de dilación entrena el corazón en el hábito del no, y nadie se arrepiente de golpe el día que decide no arrepentirse.',
      'Descalifica las mañanas prometidas: la juventud presume huelga y la vejez presume plazo, pero la puerta del arrepentimiento no se agenda, se cruza cuando se abre.',
      'Cierra con la lógica del médico: el que sabe que enferma y rehúsa la medicina en el único día en que surte efecto decide su muerte con plena conciencia.',
    ],
    q: [
      '"El aplazamiento es la peor de las decisiones"',
      '"Nadie se arrepiente de golpe el día que decide no arrepentirse"',
    ],
  },
  {
    a: 'baxter',
    t: 'La puerta estrecha del cielo',
    y: 1650,
    p: 'Kidderminster (de The Saints Everlasting Rest, segunda parte)',
    o: 'Parte de la meditación que escribió convaleciente, esperando su propia muerte cada semana, sobre la gloria que espera tras la puerta: pocos la hallan no porque sea difícil de describir, sino porque exige despojarse de lo que el corazón sostiene. Es síntesis editorial de esa parte de la obra.',
    x: 'Mateo 7:14 — "porque estrecha es la puerta, y angosto el camino que lleva a la vida, y pocos son los que la hallan."',
    th: ['Muerte y eternidad', 'Gracia'],
    ol: [
      'Mide la estrechez desde dentro: la puerta no excluye por su medida sino por lo que no cabe en ella, y el corazón que quiere entrar con el mundo abrazado no pasa por la jamba.',
      'Describe la gloria de la otra parte sin números ni feudos: luz sin sombra, amor sin rival, descanso sin hastío, el gozo que ni la salud ni el tiempo pueden rebajar.',
      'Vuelve del cielo a la parroquia con la pregunta pastoral: si tal gloria espera a los pocos, la tarea del pastor es hacer que su gente la piense cada domingo hasta que el camino angosto se vuelva costumbre.',
    ],
    q: [
      '"La puerta no excluye por su medida sino por lo que no cabe en ella"',
      '"El gozo de la otra parte no lo rebajan ni la salud ni el tiempo"',
    ],
  },
  {
    a: 'baxter',
    t: 'La dirección de la familia',
    y: 1656,
    p: 'Kidderminster (del capítulo doméstico de The Reformed Pastor, estilo fiel)',
    o: 'De su programa de pastoreo reformado: la parroquia se convierte cuando las casas se catequizan, y el padre que no instruye a los suyos delega en el ministro un oficio que Dios le dio a él. Es síntesis editorial de esa parte de la obra y de su práctica en Kidderminster.',
    x: 'Deuteronomio 6:7 — "Y las repetirás a tus hijos, y hablarás de ellas estando en tu casa, y andando por el camino, y al acostarte, y cuando te levantes."',
    th: ['Santidad', 'Evangelismo'],
    ol: [
      'Devuelve el oficio a su dueño: el ministro predica a la parroquia una vez por semana, pero el padre predica en casa todos los días, y ninguna evangelización pública suple esa agenda.',
      'Ordena el método que practicó: catecismo por la tarde, examen de conciencia por la noche, oración en la mesa, de modo que la doctrina entre por los oídos de los niños antes que por las riñas del mundo.',
      'Advierte la cuenta final: el padre comparecerá ante Dios con los hijos que descuidó, y no lo escudará el ministro fiel a quien pagó para hacer su trabajo doméstico.',
    ],
    q: [
      '"El padre predica en casa todos los días, quiera o no"',
      '"El padre comparecerá ante Dios con los hijos que descuidó"',
    ],
    i: 'Su catecismo doméstico alimentó siglos de instrucción familiar protestante y define el pastoreo como negocio de casas antes que de púlpitos.',
  },
  {
    a: 'baxter',
    t: 'Los pensamientos del que muere',
    y: 1688,
    p: 'Londres (estilo fiel de Dying Thoughts, sus meditaciones escritas cerca de la propia muerte)',
    o: 'En la última década de su vida, con la salud quebrada y la expulsión de 1662 a cuestas, Baxter escribió sus pensamientos de moribundo sobre el deseo de partir y estar con Cristo: el pastor que enseñó a otros a preparar la muerte se la prepara a sí mismo por escrito. Es síntesis editorial de esa obra.',
    x: 'Filipenses 1:23 — "Porque de ambas cosas estoy en conflicto, teniendo deseo de partir y estar con Cristo, lo cual es muchísimo mejor."',
    th: ['Muerte y eternidad', 'Firma y certeza'],
    ol: [
      'Sopesa el conflicto del texto: el apostol que no sabe si elegir fruto o descanso enseña al moribundo que el deseo de partir no es deserción sino madurez de amor.',
      'Examina el miedo que sobra: el que teme a la muerte más de lo que confía en Cristo suele haber confiado en el propio oficio, y el inventory del último año corrige esa cuenta.',
      'Cierra con la herencia del ministerio: el moribundo que deja promesas, no testamentos de mérito, enseña a su grey que la última palabra del pastor se dice con la Escritura abierta.',
    ],
    q: [
      '"El deseo de partir no es deserción: es madurez de amor"',
      '"El último sermón del pastor se predica con la Escritura abierta y la respiración corta"',
    ],
    i: 'Sus meditaciones finales circularon como testamento espiritual del gran puritano y retratan al pastor que se aplicó a sí mismo la cura que había predicado tres décadas.',
  },
  {
    a: 'baxter',
    t: 'El inventario del corazón',
    y: 1650,
    p: 'Kidderminster (de la parte introductoria de The Saints Everlasting Rest, estilo fiel)',
    o: 'De la introducción de su obra mayor, escrita cuando la enfermedad le dictó el registro de su propia muerte: antes de meditar la eternidad hay que tomar el inventario del corazón, y ese asiento contable se practica solo, con la Escritura abierta. Es síntesis editorial de esa parte.',
    x: '2 Corintios 13:5 — "Examinaos a vosotros mismos si estáis en la fe; probaos a vosotros mismos."',
    th: ['Santidad', 'Firma y certeza'],
    ol: [
      'Ordena el examen con criterios verificables: no pregunte qué sintió en el éxtasis sino qué ama, qué teme, qué espera y adónde van su bolsa y sus horas, porque esos asientos no mienten.',
      'Descalifica los testimonios falsos del corazón: la costumbre religiosa, el afecto al partido y el temor a la muerte pasan por gracia, y solo la prueba de las obras separa el inventario real del deseado.',
      'Conecta el asiento con la eternidad: quien conoce el estado de su alma puede esperar la muerte como el mercader espera el cierre del año, con las cuentas sabidas y el balance en la mano.',
    ],
    q: [
      '"Pregunte qué ama y qué teme: esos asientos no mienten"',
      '"La costumbre religiosa pasa por gracia hasta que llegan las cuentas"',
    ],
  },
  {
    a: 'baxter',
    t: 'La enfermedad aprovechada',
    y: 1660,
    p: 'Kidderminster (estilo fiel de sus escritos sobre la enfermedad y la debilidad, Practical Works)',
    o: 'Escrita desde su enfermedad crónica, que lo llevó al borde de la muerte en la década de 1650 y dejó su voz frágil para el resto del ministerio: el pastor que no podía andar el distrito convirtió el lecho en púlpito. Es síntesis editorial de esa línea de su obra.',
    x: '2 Corintios 12:9 — "Bástate mi gracia; porque mi poder se perfecciona en la debilidad."',
    th: ['Crisis y prueba', 'Gracia'],
    ol: [
      'Lee el padecimiento como seminario: la enfermedad desmonta la presunción del ministro sano, le enseña a morir por adelantado y le da la gramática con que consolará a los suyos.',
      'Convierte el límite del cuerpo en agenda pastoral: quien no puede visitar a ochocientas familias escribe libros que visitan por él, y la debilidad multiplica el oficio en vez de cerrarlo.',
      'Guarda el consuelo en su sitio: no predicó el sufrimiento por gusto ni la sanidad prometida por contrato, sino la gracia que basta, probada en la silla donde el médico no dio más plazo.',
    ],
    q: [
      '"La debilidad multiplica el oficio del ministro en vez de cerrarlo"',
      '"La enfermedad le enseña al pastor a morir por adelantado"',
    ],
  },
  {
    a: 'baxter',
    t: 'Los pobres de la ciudad',
    y: 1673,
    p: 'Londres (del Christian Directory, estilo fiel de sus casos de conciencia)',
    o: 'Del directorio cristiano, donde la misericordia aparece como caso de conciencia resuelto con reglas y no como sentimiento: al rico, la voluntad ciega lo convierte en despojador, y deberá responder por su bolsa ante el tribunal de su propia fe. Es síntesis editorial de esos casos.',
    x: 'Mateo 25:40 — "De cierto os digo que en cuanto lo hicisteis a uno de estos mis hermanos más pequeños, a mí lo hicisteis."',
    th: ['Anhelos humanos', 'Santidad'],
    ol: [
      'Convierte la limosna en contabilidad moral: el rico no es dueño sino mayordomo con cuentas que rendir, y lo que gasta en su lujo mientras el pobre muere lo gasta en su contra.',
      'Desarma las excusas del rico con la lógica del inventario: si el exceso del mundo no lo hace más feliz, guardar el sobrante cuando el vecino no tiene pan es necedad duplicada.',
      'Manda la obra ordenada y no el consuelo verbal: escuelas, trabajo y pan administrados con reglas, porque la misericordia sin método abandona al pobre al año siguiente.',
    ],
    q: [
      '"El rico no es dueño sino mayordomo con cuentas que rendir"',
      '"La misericordia sin método abandona al pobre al año siguiente"',
    ],
    i: 'Sus casos de conciencia sobre la limosna pasaron a la tradición cristiana como manual de caridad organizada antes de la era de las instituciones.',
  },
  {
    a: 'baxter',
    t: 'La gloria que pesa',
    y: 1650,
    p: 'Kidderminster (de la parte final de The Saints Everlasting Rest, estilo fiel)',
    o: 'De la parte final de la obra nacida junto a su lecho de enfermo, donde la meditación de la eternidad se propone como ejercicio semanal y no como pirotecnia: un cuarto de hora al día pesando la gloria cambia el precio de todas las cosas de este lado. Es síntesis editorial de esa parte.',
    x: '2 Corintios 4:17 — "Porque nuestra leve aflicción momentánea produce en nosotros un cada vez más excelente y eterno peso de gloria."',
    th: ['Muerte y eternidad', 'Anhelos humanos'],
    ol: [
      'Define el método de la meditación: tomar la gloria descrita en la Escritura y sostenerla ante el corazón hasta que pese, porque la fe se mide por lo que el alma siente al calcular.',
      'Contrapone las dos balanzas: la aflicción leve de un instante contra el peso eterno, y muestra que el ánimo humano erra cuando pesa los siglos con las escalas de un día.',
      'Deriva la ética: el que ha pesado bien la eternidad no negocia ya con la concupiscencia, porque toda tentación se vuelve pequeña al lado de la esperanza que lo sostiene.',
    ],
    q: [
      '"Pesa los siglos con escalas de eternidad y no con las de un día"',
      '"La fe se mide por lo que el alma siente al calcular la gloria"',
    ],
  },
  {
    a: 'baxter',
    t: 'El día del Señor bien guardado',
    y: 1650,
    p: 'Kidderminster (estilo fiel de su defensa del domingo, que originó The Saints Everlasting Rest)',
    o: 'De la práctica que originó su obra mayor: la tarde de cada domingo destinada a catequizar a los enfermos y a meditar el descanso eterno, contra la costumbre inglesa de gastar el día en el vino y los pleitos. Es síntesis editorial de esa línea de su obra.',
    x: 'Isaías 58:13 — "Si retrajeres del sábado tu pie, de hacer tu voluntad en mi día santo, y lo llamares delicia, santo, glorioso de Jehová."',
    th: ['Adoración', 'Santidad'],
    ol: [
      'Defiende el día como antídoto del mundo: seis días el corazón corre tras el pan, y si el séptimo corre igual, el alma no vuelve a su dueño ni una vez por semana.',
      'Ordena el uso doble que practicó: culto público por la mañana y visitas a los enfermos por la tarde, porque el descanso del Señor es obra y no ocio.',
      'Muestra el fruto de su parroquia: fue guardando así el domingo como encontró a su gente catequizada y en paz, y de esas tardes nació el libro que definirá su memoria.',
    ],
    q: [
      '"Si el séptimo día corre igual tras el pan, el alma nunca vuelve a su dueño"',
      '"El descanso del Señor es obra y no ocio"',
    ],
    i: 'The Saints Everlasting Rest, nacida de esas tardes de domingo, fue uno de los libros devocionales más reimpresos de la lengua inglesa.',
  },
  {
    a: 'finney',
    t: 'Los estorbos del avivamiento',
    y: 1835,
    p: 'Lecturas sobre el avivamiento (Hindrances to Revivals, lección de su curso de Nueva York)',
    o: 'Lección de su curso sobre avivamientos de 1835: si el avivamiento es obra del Espíritu según leyes moralmente conocidas, entonces su ausencia tiene causas nombrables, y la iglesia debe examinar las suyas antes de culpar al cielo. Documentado en el índice de sus lecturas.',
    x: '1 Tesalonicenses 5:19 — "No apaguéis al Espíritu."',
    th: ['Poder sobrenatural', 'Arrepentimiento'],
    ol: [
      'Nombra el estorbo principal en la portería: una iglesia que confiesa con la boca y vive en deuda con su propia conciencia cierra la puerta por dentro, y el Espíritu no fuerza moradas amuebladas contra él.',
      'Revisa los estorbos con nombres propios: el rencor no confesado, la cuenta pagada a plazos, el escándalo del miembro prominente, porque el mundo juzga al evangelio por las deudas que la iglesia no honra.',
      'Concluye con la lógica de la responsabilidad: si Dios ha dicho que derramará su Espíritu y no lo hace, la cerradura está del lado humano, y el avivamiento empieza con un registro de cerraduras.',
    ],
    q: [
      '"La cerradura del avivamiento está del lado humano"',
      '"El mundo juzga al evangelio por las deudas que la iglesia no honra"',
    ],
    i: 'La lección fijó el principio de responsabilidad moral de la iglesia que distinguió a Finney del calvinismo de su época y alimentó el movimiento de avivamiento posterior.',
  },
  {
    a: 'finney',
    t: '¿Pueden dos andar juntos?',
    y: 1827,
    p: 'Nueva York (sermón de 1827, documentado en el índice de sus obras)',
    o: 'Sermón de su etapa de Nueva York de 1827, tomado de la pregunta del profeta y volcado al oyente: la comunión con Dios es acuerdo verificable de voluntades, no sentimiento de culto, y donde no hay acuerdo el andar es fingido. Documentado en el índice de sus sermones.',
    x: 'Amós 3:3 — "¿Andarán dos juntos, si no estuvieren de acuerdo?"',
    th: ['Firma y certeza', 'Arrepentimiento'],
    ol: [
      'Traduce la pregunta a su forma forense: dos voluntades andan juntas cuando quieren lo mismo para el mismo fin, y por eso la comunión con Dios se prueba comparando la agenda del hombre con la del cielo.',
      'Desmonta la comunión nominal: la persona que ora por la voluntad de Dios y se enoja cuando la descubre no camina con Dios sino delante de él, con su propia brújula.',
      'Cierra con el llamado: el desacuerdo no se resuelve con lágrimas ni servicios largos, sino con la entrega de la voluntad en el punto exacto donde el creyente sabe que resiste.',
    ],
    q: [
      '"La comunión con Dios se prueba comparando agendas"',
      '"Quien ora por la voluntad de Dios y se enoja al hallarla no camina con él"',
    ],
    i: 'Uno de sus sermones tempranos más difundidos, citado en el índice documentado de su obra completa y típico de su razonamiento forense de la etapa de Nueva York.',
  },
  {
    a: 'finney',
    t: 'El espíritu de oración',
    y: 1849,
    p: 'Oberlin (sermón de 1849, documentado)',
    o: 'Sermón predicado en Oberlin en 1849, sobre el espíritu que produce la oración respondida: no es la técnica del verbo sino el estado del corazón que quiere lo que Dios quiere, con la intensidad necesaria para pedirlo hasta verlo. Documentado en sus sermones de Oberlin.',
    x: 'Romanos 8:26 — "el Espíritu nos ayuda en nuestra debilidad; pues qué hemos de pedir como conviene, no lo sabemos, pero el Espíritu mismo intercede por nosotros con gemidos indecibles."',
    th: ['Oración', 'Poder sobrenatural'],
    ol: [
      'Nombra el defecto de la oración estéril: muchos piden contra su propia vida, y Dios no financia con su Espíritu los deseos que el peticionario no compra con obediencia.',
      'Define el espíritu de oración como aguante compasivo: el Espíritu carga al creyente con el peso de las almas hasta que la petición deja de ser palabras y se vuelve fardo que la voluntad lleva.',
      'Enseña la prueba del círculo: la oración de fe persiste hasta la respuesta porque el que la reza ha recibido ya la certeza, y el silencio del cielo no apaga lo que el Espíritu encendió.',
    ],
    q: [
      '"Dios no financia los deseos que el peticionario no compra con obediencia"',
      '"La oración de fe persiste porque el que la reza ya recibió la certeza"',
    ],
    i: 'Sermón de Oberlin recogido en sus obras completas, es la articulación clásica de su doctrina de la oración prevaleciente de la década de 1840.',
  },
  {
    a: 'finney',
    t: 'Las escusas del pecador',
    y: 1842,
    p: 'Llamadas de avivamiento (estilo fiel de sus llamadas de altar, obras completas)',
    o: 'Síntesis editorial de sus llamadas a los oyentes que se levantan del avivamiento con pretextos: Finney trataba cada escusa como una declaración forense, porque el que excusa confiesa que sabe lo que debe. Estilo fiel de sus llamadas, no sermón datado.',
    x: 'Lucas 14:18 — "Y todos a una comenzaron a excusarse."',
    th: ['Evangelismo', 'Arrepentimiento'],
    ol: [
      'Lee la escusa como confesión involuntaria: el que dice mañana reconoce hoy el deber, y el que cita el campo o la boda admite que el banquete está servido y él prefiere su negocio.',
      'Clasifica las escusas en tres cajas: las de tiempo, las de dignidad y las de escrúpulo, y demuestra que las tres dicen lo mismo con distinto traje, que el corazón manda el no y la lengua lo justifica.',
      'Aprieta el llamado en la puerta: el avivamiento no espera parejas de razones, y la única escusa que el evangelio no puede excusar es la del oyente que ya sabe y se queda sentado.',
    ],
    q: [
      '"El que excusa confiesa que sabe lo que debe"',
      '"Las escusas dicen lo mismo con distinto traje"',
    ],
    i: 'Típico de sus llamadas de altar en los avivamientos de las décadas de 1830 y 1840, recogidas en la tradición de sus obras publicadas.',
  },
  {
    a: 'finney',
    t: 'La gloria de Dios como fin',
    y: 1840,
    p: 'Oberlin (estilo fiel de su enseñanza sobre el fin moral del hombre, obras completas)',
    o: 'Síntesis editorial de su enseñanza en Oberlin sobre el fin último: el yo no puede ser fin último de un ser moral, y toda vida que se ordena a sí misma es idolatría, aunque vaya vestida de devoción. Estilo fiel de esa enseñanza en sus años de Oberlin.',
    x: '1 Corintios 10:31 — "si coméis o bebéis, o hacéis otra cosa, hacedlo todo para la gloria de Dios."',
    th: ['Santidad', 'Idolatría del corazón'],
    ol: [
      'Razona el fundamento: un ser finito no puede ser su propio fin último sin mentir sobre su naturaleza, y por eso el egoísmo no es un vicio entre otros sino el pecado de fondo de toda elección.',
      'Desmascara el altruismo religioso del yo: hay obras de caridad hechas por el placer de sentirse bueno, y ese fin corrompe el mérito de la obra desde la raíz del propósito.',
      'Aplica la prueba del detalle: si Dios es el fin, hasta comer y beber son culto, y si el yo es el fin, hasta el altar es mercado, porque el fin colorea todo el camino.',
    ],
    q: [
      '"El egoísmo no es un vicio entre otros: es el pecado de fondo de toda elección"',
      '"Si el yo es el fin, hasta el altar es mercado"',
    ],
    i: 'Principio central de la teología de Oberlin que reorientó la ética del avivamiento americano hacia la benevolencia como fin moral del ser racional.',
  },
  {
    a: 'finney',
    t: 'La iglesia despierta',
    y: 1835,
    p: 'Lecturas sobre el avivamiento (estilo fiel de su enseñanza sobre la cooperación del creyente con el Espíritu)',
    o: 'Síntesis editorial de su lección sobre la cooperación: el avivamiento no desciende sobre una iglesia dormida como una tormenta sobre una ciudad vallada, sino que exige el instrumento afilado, porque el Espíritu usa medios y agentes despiertos. Estilo fiel de sus lecturas.',
    x: 'Efesios 5:14 — "Despiértate, tú que duermes, y levántate de los muertos, y te iluminará Cristo."',
    th: ['Poder sobrenatural', 'Evangelismo'],
    ol: [
      'Denuncia el sueño de la iglesia como pecado nombrable: no es cansancio sino desacuerdo con lo que la iglesia dice pedir, y el culto de un cuerpo dormido es la imagen más fiel de su estado.',
      'Ordena el despertar por oficios: el comerciante afila su verdad en la balanza, el maestro su ejemplo en el aula, cada miembro su oficio, porque el avivamiento entra por los roles que la sociedad ya conoce.',
      'Cierra con la promesa condicional: Cristo ilumina al que se levanta, no al que pide luz para seguir en la cama, y por eso la primera obra del avivamiento es siempre la del propio umbral.',
    ],
    q: [
      '"El culto de un cuerpo dormido es la imagen más fiel de su estado"',
      '"Cristo ilumina al que se levanta, no al que pide luz para seguir en la cama"',
    ],
  },
  {
    a: 'finney',
    t: 'El arrepentimiento verdadero',
    y: 1836,
    p: 'Conferencias sobre el arrepentimiento (estilo fiel de sus lecturas, obras completas)',
    o: 'De sus conferencias sobre el arrepentimiento, donde la penitencia deja de ser sentimiento y se define como cambio de gobierno del alma: el corazón que cambia de fin no llora primero y obedece después, cambia y prueba a la vez. Síntesis editorial de esas conferencias.',
    x: '2 Corintios 7:10 — "Porque la tristeza que es según Dios produce arrepentimiento para salvación, de que no hay que arrepentirse; pero la tristeza del mundo produce muerte."',
    th: ['Arrepentimiento', 'Penitencia'],
    ol: [
      'Separa las dos tristezas con bisturí: la del mundo llora la consecuencia del pecado y vuelve al mismo mercado, la que es según Dios aborrece el pecado mismo y cambia de fin en el acto.',
      'Define el arrepentimiento como acto de la voluntad y no como emoción: las lágrimas pueden acompañarlo, pero la prueba es si el apetito que mandaba el alma ha perdido el trono.',
      'Advierte contra el arrepentimiento diferido: el corazón que aplaza la rendición entrena la rebeldía con cada culto, y la emoción acumulada sin rendición es deuda que crece con intereses.',
    ],
    q: [
      '"La prueba del arrepentimiento es si el apetito que mandaba ha perdido el trono"',
      '"La emoción acumulada sin rendición es deuda que crece con intereses"',
    ],
    i: 'Su doctrina del arrepentimiento como cambio de gobierno del alma pasó a ser estándar del avivamiento americano del siglo diecinueve.',
  },
  {
    a: 'finney',
    t: 'El joven que preguntó por la vida eterna',
    y: 1840,
    p: 'Llamadas de avivamiento (estilo fiel de sus llamadas sobre la riqueza espiritual, obras completas)',
    o: 'Síntesis editorial de sus llamadas a jóvenes con talentos y bolsas llenas: el hombre rico del evangelio no era un escándalo distante sino el retrato del oyente que quiere la vida eterna sin renunciar al ídolo que gobierna su cálculo. Estilo fiel de esas llamadas.',
    x: 'Marcos 10:21 — "Entonces Jesús, mirándole, amó, y le dijo: Una cosa te falta: ve, vende lo que tienes, y dalo a los pobres, y tendrás tesoro en el cielo; y ven, sígueme."',
    th: ['Idolatría del corazón', 'Evangelismo'],
    ol: [
      'Señala lo que el joven no entendió: guardó los mandamientos como partitura, pero nunca pidió al Maestro la dirección de su bolsa, y ahí estaba la única puerta de su corazón cerrada con llave.',
      'Explica la operación del bisturí: Jesús no pide la limosna por el dinero sino por el ídolo, porque mientras la bolsa gobierne la voluntad el discipulado vive como inquilino en el piso alto del corazón.',
      'Vuelve la escena al auditorio: el dolor del joven al irse es la mejor prueba de que el llamado era amoroso, y la exigencia al auditorio es el mismo examen del tesoro antes del próximo culto.',
    ],
    q: [
      '"Mientras la bolsa gobierne la voluntad, el discipulado es inquilino del piso alto"',
      '"El ídolo no se confiesa con labios: se descubre por lo que la mano no suelta"',
    ],
    i: 'Ejemplo clásico de cómo las llamadas de Finney convierten una escena evangélica en examen directo del auditorio, en la línea de sus sermones publicados.',
  },
  {
    a: 'finney',
    t: 'El fuego del Espíritu',
    y: 1840,
    p: 'Predicación de avivamiento (estilo fiel de su enseñanza sobre el bautismo del Espíritu, obras completas)',
    o: 'Síntesis editorial de su predicación sobre el bautismo del Espíritu: el fuego del sacrificio no era ceremonia sino investigación, y la promesa de la era es que el fuego desciende sobre carne consagrada y no sobre altares decorados. Estilo fiel de esa enseñanza.',
    x: 'Levítico 9:24 — "Y salió fuego de delante de Jehová, y consumió el holocausto con la grosura; lo cual viendo todo el pueblo, dieron voces de júbilo, y se postraron sobre sus rostros."',
    th: ['Poder sobrenatural', 'Adoración'],
    ol: [
      'Lee el fuego del Levítico como sentencia del altar: lo que el fuego consume demuestra lo que el cielo acepta, y la iglesia moderna huye del fuego porque no quiere saber qué de su culto es grosura.',
      'Define el bautismo del Espíritu como unción para el oficio: no es un diploma de identidad espiritual sino el poder que prepara al testigo para la obra del día, y se recibe en consagración y no en exhibición.',
      'Concluye con la alternativa forense: o la iglesia invoca el fuego sabiendo que consumirá lo suyo, o confiesa con su silencio que prefiere un altar sin prueba a un sacrificio aceptado.',
    ],
    q: [
      '"Lo que el fuego consume demuestra lo que el cielo acepta"',
      '"El bautismo del Espíritu se recibe en consagración y no en exhibición"',
    ],
  },
  {
    a: 'finney',
    t: 'La deuda con los hombres',
    y: 1840,
    p: 'Llamadas al ministerio (estilo fiel de su sermón sobre la obligación de predicar, obras completas)',
    o: 'Síntesis editorial de su llamado sobre la obligación de predicar: la palabra no se debe al oyente por caridad sino por justicia, porque el conocimiento del evangelio engendra deuda, y el silencio del sabio es desfalco. Estilo fiel de esa línea de sus llamadas.',
    x: 'Romanos 1:14 — "A griegos y a no griegos, a sabios y a no sabios soy deudor."',
    th: ['Evangelismo', 'Santidad'],
    ol: [
      'Define la deuda con rigor forense: el que ha recibido el conocimiento que salva debe la difusión a quien no lo ha recibido, y ninguna vocación particular cancela el adeudo universal del testigo.',
      'Cuenta el desfalco: talentos gastados en el círculo propio, aprender para no predicar y púlpitos defendidos por conveniencia son formas respetables de quedarse con el bien ajeno.',
      'Cierra con el pago inmediato: la deuda se paga con el esfuerzo de hoy y en el lugar donde uno está, porque el deudor que espera condiciones mejores está negociando la condena del prójimo.',
    ],
    q: [
      '"El conocimiento del evangelio engendra deuda, y el silencio del sabio es desfalco"',
      '"La deuda del testigo se paga hoy y donde uno está"',
    ],
    i: 'Su doctrina de la obligación moral de predicar sostuvo el envío de evangelistas del avivamiento americano y el ideal de Oberlin de formación para el servicio.',
  },
{
    a: 'mcheyne',
    t: 'El corazón quebrantado',
    y: 1837,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Predicado a su congregación obrera de Dundee durante los años de despertamiento, cuando M\u2019Cheyne volvía de sus viajes por la ciudad buscando a las ovejas perdidas casa por casa. El sermón nace de su convicción de que Dios no pide obras adornadas sino un espíritu roto que sólo la gracia produce.',
    x: 'Salmo 51:17 — "Los sacrificios de Dios son el espíritu quebrantado; al corazón contrito y humillado no desprecias tú, oh Dios."',
    th: ['Arrepentimiento', 'Gracia', 'Santidad'],
    ol: [
      'El salmista descubre que el cielo no hace inventario de incienso ni de toros, sino que se inclina ante la grieta interior, porque allí donde el hombre se quiebra entra el Médico sin que la carne le estorbe.',
      'David había perdido el gozo de la salvación y la alegre presencia de Dios, y aprende que ni el templo ni el sacerdocio pueden recomprarlo: sólo el sacrificio espiritual de un corazón hecho polvo vuelve a abrir las cortinas.',
      'El quebrantamiento no es mérito sino receptor, un vaso vacío levantado hacia la lluvia; por eso el más vil pecador de Dundee que llora sobre su pecado está más cerca del altar que el religioso pulcro que nunca sintió su podredumbre.',
    ],
    q: ['"Dios no desprecia el corazón roto, porque lo quebrantado es la puerta por donde Él mismo entra a morar."'],
    i: 'Se convirtió en texto de cabecera del presbiterianismo escocés para enseñar la contrición real frente a la moralidad sin lágrimas.',
  },
  {
    a: 'mcheyne',
    t: 'Contar los días para saciarse de misericordia',
    y: 1840,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Sermón sobre el Salmo 90 en una época en que la fiebre y la tuberculosis arrebataban niños del barrio de Dundee cada invierno. M\u2019Cheyne, con su propia salud destrozada, enseñaba a una parroquia que enterraba hijos a aprender el arte de contar los días con sabiduría.',
    x: 'Salmo 90:14 — "Oh, saciarnos ahora de tu misericordia cada mañana, para que cantemos y nos gocemos todos nuestros días."',
    th: ['Oración', 'Muerte y eternidad', 'Anhelos humanos'],
    ol: [
      'Moisés, que vio morir a una generación entera en el desierto, pide dos cosas juntas: sabiduría para contar los días que pasan y misericordia que sacie cada amanecer, porque la mortalidad sola amarga y la misericordia sola adormece.',
      'El creyente no pide días largos sino días llenos, una saciedad temprana que convierta cada mañana en bodega y cada noche en canción, de modo que hasta los años tristes pasen cantando entre las asperezas.',
      'Quien aprende a pedir la misericordia de madrugada deja de temer al sepulcro, porque encuentra que el Dios que acorta los días es el mismo que los endulza, y su mortalidad se vuelve consejera y no verdugo.',
    ],
    q: ['"Cuenta tus días como pesos de oro y pide misericordia como quien pide pan: el que se sacia de mañana no teme la noche."'],
    i: 'Está entre los textos más citados de su colección para el consuelo de los enfermos y la pedagogía cristiana del tiempo.',
  },
  {
    a: 'mcheyne',
    t: 'Cristo el único camino',
    y: 1839,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Explicación pastoral de la despedida del Señor a sus discípulos, predicada a una congregación donde abundaban los que buscaban a Dios por el camino del bautismo, la moral o el temperamento piadoso. M\u2019Cheyne desarma todos los caminos inventados y muestra al Cristo que habla a la vista de su cruz.',
    x: 'Juan 14:6 — "Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí."',
    th: ['Firma y certeza', 'Evangelismo', 'Anhelos humanos'],
    ol: [
      'El corazón humano levanta escaleras a mano hacia el cielo, unas de ceremonias y otras de moral, y Cristo no discute sus méritos: las llama caminos rotos y se ofrece a sí mismo como la única puerta abierta al Padre.',
      'No dice enseñar el camino ni mostrarlo de lejos, sino serlo: un camino donde el andar del pecador es el propio Hijo avanzando, de modo que el débil no va al Padre por esfuerzo sino estando dentro de Cristo.',
      'La afirmación no es orgullo de dogmático sino ternura de quien conoce la casa: en la misma noche en que Judas salió a venderlo, Jesús ocupó el atrio del corazón de sus discípulos para que nadie durmiera sin saber por dónde se entra a Dios.',
    ],
    q: ['"Todos los caminos del hombre a Dios terminan en un muro; el camino de Dios al hombre termina en un hermano que dice: yo soy."'],
  },
  {
    a: 'mcheyne',
    t: 'La oración sacerdotal',
    y: 1838,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Sermón sobre la última oración del Señor antes de la cruz, cuando M\u2019Cheyne promovía entre sus fieles las sociedades de oración y la unión por los judíos y las misiones. Presenta la unidad cristiana no como proyecto humano sino como petición puesta en labios de Cristo agonizante.',
    x: 'Juan 17:21 — "para que todos sean uno; como tú, oh Padre, en mí, y yo en ti, que también ellos sean uno en nosotros; para que el mundo crea que tú me enviaste."',
    th: ['Oración', 'Poder sobrenatural', 'Evangelismo'],
    ol: [
      'Antes de morir, Cristo no pide riquezas ni larga vida para los suyos sino que sean uno como el Padre y el Hijo, de modo que la unidad de la iglesia es algo más sagrado que cualquier pacto humano: es forma visible del cielo.',
      'La unidad pedida no es uniformidad de rito ni frialdad de convenio, sino el calor de una familia que comparte la vida del Padre, y por eso el mundo no puede fabricarla ni el pecado tolerarla.',
      'Cristo puso la conversión del mundo como fruto de esa unión: cuando Dundee vea a los creyentes amarse como el Padre ama al Hijo, será más fuerte que cualquier púlpito y preguntará quién es este Dios que así junta a los suyos.',
    ],
    q: ['"Cuando los hermanos sean uno, el mundo que no lee los Evangelios leerá la iglesia."'],
    i: 'Alimentó el celo misionero y las sociedades de oración que M\u2019Cheyne impulsó en Escocia hacia los judíos y las naciones.',
  },
  {
    a: 'mcheyne',
    t: 'No me avergüenzo del evangelio',
    y: 1836,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Predicado en su primer período en Dundee, frente a una ciudad que admiraba la elocuencia escocesa y sospechaba de la predicación de la cruz como cosa vulgar de predicadores de campo. M\u2019Cheyne toma la confesión de Pablo como bandera para un púlpito joven y ceñido al mensaje simple.',
    x: 'Romanos 1:16 — "Porque no me avergüenzo del evangelio, porque es poder de Dios para salvación de todo aquel que cree; al judío primeramente y también al griego."',
    th: ['Evangelismo', 'Poder sobrenatural', 'Firma y certeza'],
    ol: [
      'El mundo escoge sus vergüenzas con calculadora: vergüenza del pobre, del fallido, del predicador entusiasmado; Pablo confiesa la suya y la arranca de raíz, porque ha probado que el mensaje despreciado es la dinamita de Dios para los muertos.',
      'El evangelio no necesita ayuda del orador ni del público: es poder de Dios, una fuerza que actúa sola sobre el corazón de piedra, y por eso el predicador puede ser débil mientras el mensaje sostiene la tierra.',
      'Cree todo aquel, dice el texto: el poder no es para los nobles de razón ni los límpidos de conciencia, sino para el creyente, y así el último bankero de la calle de Dundee tiene el mismo cielo que el apóstol.',
    ],
    q: ['"El evangelio no es un consejo para el sabio sino un poder para el muerto: no instruye al vivo, resucita al sepulcro."'],
  },
  {
    a: 'mcheyne',
    t: 'La Sabiduría llama a los simples',
    y: 1842,
    p: 'Dundee, Escocia (St. Peter\u2019s, año aproximado)',
    o: 'Sermón sobre Proverbios 8 predicado a fines de su ministerio, cuando la ciudad de Dundee llenaba la iglesia para oírlo y muchos llegaban curiosos sin cultura bíblica. M\u2019Cheyne presenta a la Sabiduría personal de Dios como un heraldo en las plazas que no escoge a los doctos.',
    x: 'Proverbios 8:4 — "¡A vosotros, oh hombres, llamo; y mi voz es a los hijos de los hombres!"',
    th: ['Evangelismo', 'Anhelos humanos', 'Gracia'],
    ol: [
      'La Sabiduría eterna no hace su corte entre palacios ni escuelas, sino que se planta en las encrucijadas y clama a los simples, porque su gloria es doble: ser la más alta de las cosas y bajar al nivel de la voz humana.',
      'Los hombres confunden altura con mérito y creen que Dios habla el idioma de los doctos; pero Cristo predicó su evangelio al nivel del arado y del horno, y la única razón por la que un hombre no oye es que prefiere el silencio de sus ídolos.',
      'La llamada sigue abierta mientras se vive: los necios murieron por desprecio y no por falta de invitación, y por eso el oyente de Dundee que tiene hoy la voz en el oído no sabe si la tendrá mañana en la calle.',
    ],
    q: ['"No hay oído demasiado rustico para la Sabiduría; hay sólo oídos que fingen sordera para seguir amando sus yerros."'],
  },
  {
    a: 'mcheyne',
    t: 'La viña del Señor',
    y: 1840,
    p: 'Dundee, Escocia (estilo fiel de su colección de sermones de 1863, año aproximado)',
    o: 'Síntesis editorial del mensaje de M\u2019Cheyne sobre la parábola de la viña de Isaías, en la línea de sus sermones de corteza y fruto que predicó a su parroquia escocesa. No hay registro fechado de la prédica concreta, pero el texto y el tono pertenecen a su colección impresa.',
    x: 'Isaías 5:1 — "Mi amado tenía una viña en una ladera muy fértil."',
    th: ['Crisis y prueba', 'Idolatría del corazón', 'Santidad'],
    ol: [
      'Isaías canta el amor de Dios como un hortelano que despeja una ladera, quita las piedras y la planta con cepa escogida, y luego espera uvas; el escándalo de la canción es que después de tanta misericordia da uvas silvestres.',
      'El profeto hace juzgar al viñadero por los propios hombres de Jerusalén, que condenan la viña estéril sin saber que son la viña, porque el pecado vive del anonimato y muere cuando se descubre el dueño del campo.',
      'M\u2019Cheyne aplica la ladera fértil a una parroquia que goza de templo, Biblia y ministerio, y pregunta qué fruto buscan los cielos en ella; la viña sin uvas no es defecto de la tierra sino traición del huerto.',
    ],
    q: ['"Dios no demanda uvas perfectas, pero sí uvas verdaderas: la viña que da agavancos ha amado el estéril amparo de su esterilidad."'],
  },
  {
    a: 'mcheyne',
    t: 'La puesta de sol de la vida',
    y: 1842,
    p: 'Dundee, Escocia (estilo fiel de su colección de sermones de 1863, año aproximado)',
    o: 'Síntesis editorial de su predicación sobre la vejez creyente, construida sobre el pedido de David anciano y en la línea de sus sermones de consuelo a los viejos de su parroquia y su hermana mayor. No está atestiguada la prédica fechada, pero el texto y la aplicación pertenecen a su colección.',
    x: 'Salmo 71:18 — "Y hasta la vejez y las canas, oh Dios, no me desampares, hasta que haya anunciado tu brazo a esta generación, y tu poder a todo el que ha de venir."',
    th: ['Muerte y eternidad', 'Anhelos humanos', 'Gracia'],
    ol: [
      'El anciano creyente no pide desapego del mundo ni fuerza de juventud, sino el mismo sostén de siempre hasta el final: pide que el Dios que lo sostuvo al nacer no lo suelte en el brillo de sus canas.',
      'La vejez del santo no es balcón desde el que se despide, sino pulpito desde el que se cuenta el brazo de Dios a la generación siguiente; sus días caídos son peldaños, no escombros, porque sirven de relación.',
      'En el creyente la tarde no tiene amargura sino madurez, porque mientras el cuerpo se apaga la fe se alimenta de memoria y de esperanza, y el sol que se pone en Dundee se levanta en la ciudad eterna.',
    ],
    q: ['"El creyente no envejece hacia el sepulcro sino hacia el abrazo: sus canas son coronas de nieve de un verano que viene."'],
  },
  {
    a: 'mcheyne',
    t: 'El llanto por los que duermen',
    y: 1841,
    p: 'Dundee, Escocia (estilo fiel de su colección de sermones de 1863, en marco fúnebre de la parroquia, año aproximado)',
    o: 'Síntesis editorial de su consuelo fúnebre sobre los que duermen en Jesús, predicado en una Dundee donde la fiebre arrebataba amigos y hermanos del rebaño y el pastor mismo velaba muertos queridos. No hay registro fechado de la prédica concreta, pero el texto y el consuelo son propios de su colección.',
    x: '1 Tesalonicenses 4:13 — "Tampoco queremos que ignoréis acerca de los que duermen, para que no entristezcáis como los otros que no tienen esperanza."',
    th: ['Muerte y eternidad', 'Crisis y prueba', 'Firma y certeza'],
    ol: [
      'Pablo no prohíbe las lágrimas sino la desesperación: distingue un duelo con cielo de un duelo sin horizonte, porque el cristiano llora sobre una puerta y el pagano sobre una pared.',
      'El sueño es vocabulario de amor y no de mentira: los que duermen en Jesús no se disolvieron, sino que están en la más honda vigilia, esperando el alba en que el Señor traerá consigo a los suyos.',
      'M\u2019Cheyne llora con Dundee sus muertos de fiebre y enseñanza a un luto que espera, donde cada sepultura es un piso menos en la casa y la reunión del cielo se hace más atractiva que la de la tierra.',
    ],
    q: ['"El cristiano llora a los que duermen como quien deja la ventana abierta, no como quien tapa un agujero sin fondo."'],
  },
  {
    a: 'mcheyne',
    t: 'El avivamiento de Dundee',
    y: 1839,
    p: 'Dundee, Escocia (St. Peter\u2019s, marco documentado del despertamiento con W. C. Burns como predicador invitado; título editorial)',
    o: 'En el verano de 1839 M\u2019Cheyne viajó a Israel con los ministros que luego escribieron la misión de exploración a los judíos, y W. C. Burns predicó en su lugar en St. Peter\u2019s mientras caía el despertamiento que llenó la ciudad de quejas y conversos. A su regreso, M\u2019Cheyne escribió a su rebaño aquella carta célebre en que pide no hacer el avivamiento un dios y pone a Cristo por encima del fuego, y esa madera es la que esta ficha recoge.',
    x: 'Habacuc 3:2 — "Oh Jehová, oí tu palabra, y temí; aviva tu obra, oh Jehová, en medio de los tiempos."',
    th: ['Poder sobrenatural', 'Oración', 'Evangelismo'],
    ol: [
      'El avivamiento no es una máquina de multitudes sino la visita de Dios a su obra tardía, y por eso Habacuc no pide prodigios nuevos sino la vitalidad de los antiguos: aviva tu obra, oh Jehová, en medio de los años.',
      'Cuando Burns predicó y la ciudad lloró por sus pecados, M\u2019Cheyne aprendió al volver que Dios no espera al pastor favorito: el Espíritu sopla donde quiere, y el pastor fiel debe alegrarse de que Cristo sea predicado aunque no sea por su voz.',
      'La carta del regreso advierte el riesgo del templo del avivamiento, porque las almas pueden amarse a sí mismas en su emoción religiosa; el remedio no es apagar el fuego sino mirar la obra entera a la luz de Cristo crucificado.',
    ],
    q: ['"No pongas el avivamiento en lugar de Cristo: no lo ames por su llama, ama la casa que la llama ilumina."'],
    i: 'El despertamiento de 1839 llenó St. Peter\u2019s y consagró a Burns como predicador de avivamientos; la carta de M\u2019Cheyne a su rebaño se convirtió en clásico de la pedagogía del discernimiento espiritual.',
  },
  {
    a: 'evans',
    t: 'La mesa del amor soberano',
    y: 1805,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la gran cena de Lucas 14, en la línea de sus parábolas dramáticas predicadas en las casas y patios de Gales a mineros y campesinos. No está atestiguada la prédica fechada, pero el tema y la imaginación pertenecen a su colección impresa.',
    x: 'Lucas 14:17 — "Venid, porque ya todo está preparado."',
    th: ['Gracia', 'Evangelismo', 'Anhelos humanos'],
    ol: [
      'Un gran señor hace un banquete y los invitados de su libranza se escusan con tierras, bueyes y esposa recién tomada, porque el corazón humano desprecia lo que le viene regalado y compra lo que le viene sangrando.',
      'El amo no cancela la mesa sino que la ensancha: envía al criado a las calles y los callejones a traer pobres, mancos, cojos y ciegos, y así la exclusiva de Israel se convierte en el festín de los desechados de la tierra.',
      'Evans dibuja la mesa como una muralla de amor sobrado, donde el lugar sobrante es el puesto del predicador y el hambre de los montes galeses es la razón de la invitación que aún grita: ya todo está preparado.',
    ],
    q: ['"El hombre siempre inventa una excusa que le parezca digna, porque ningún pecador confiesa que rechaza el cielo por amar su barro."'],
  },
  {
    a: 'evans',
    t: 'El faro de la costa',
    y: 1808,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la iglesia como luz del mundo, imaginada para comunidades marineras de las costas de Gales, donde los faros y las mareas eran la geografía diaria. No está atestiguada la prédica fechada, pero el símbolo y el tono pertenecen a su colección impresa.',
    x: 'Mateo 5:14 — "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder."',
    th: ['Evangelismo', 'Poder sobrenatural', 'Santidad'],
    ol: [
      'El faro no discute con la tormenta ni vende mapas de calma: se planta en la roca del puro peligro y arde, porque su oficio no es explicar el mar sino decir a los barcos dónde está la muerte y dónde el puerto.',
      'Cristo no pide a su iglesia que sea sabia como el mundo ni brillante como las cortes, sino que arda en lo alto, visible para el barco borracho y para el barco honrado, y que su luz cueste aceite y horas.',
      'Una iglesia apagada es peor que un faro roto, porque el faro roto se ve negro desde lejos y la iglesia tibia miente con su señales: Evans predicaba que el alba de Gales se jugaba en el aceite de sus santos.',
    ],
    q: ['"No preguntes si el mar está en calma: pregunta si tu luz arde, porque los barcos no naufragan por tormenta sino por falta de faro."'],
  },
  {
    a: 'evans',
    t: 'El pacto de sangre',
    y: 1810,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la sangre de la alianza, en la línea de sus grandes dramatizaciones del pacto que llenaban las capillas de Gales con la épica del Sinaí y del Calvario. No está atestiguada la prédica fechada, pero el tema y la imaginación pertenecen a su colección impresa.',
    x: 'Éxodo 24:8 — "Y Moisés tomó la sangre y roció sobre el pueblo, y dijo: He aquí la sangre del pacto que Jehová ha hecho con vosotros sobre todas estas cosas."',
    th: ['Gracia', 'Firma y certeza', 'Adoración'],
    ol: [
      'En el Sinaí la sangre baña el pueblo que acaba de prometer y ya quebrará, porque los pactos humanos mueren en la palabra y los de Dios viven en la sangre; así la fe no se apoya en lo que el hombre dice sino en lo que Dios derrama.',
      'Evans pone las dos montañas frente a frente: el rollo rociado al pie del Sinaí y la copa de la última cena, mostrando que el Calvario no deroga el pacto sino que lo paga con un Cordero en lugar de toros.',
      'La certeza del creyente no es la firmeza de su promesa sino la de la firma divina, y por eso puede mirar su propio corazón roto sin desesperar, porque el pacto no se escribe en su pecho sino en la sangre del Hijo.',
    ],
    q: ['"Todo pacto de palabra muere con la palabra; el pacto de Dios vive porque se firmó con sangre y se guarda en un cuerpo que resucitó."'],
  },
  {
    a: 'evans',
    t: 'La puerta que Dios cerró',
    y: 1813,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre el arca de Noé y sus entradas, en la línea de sus sermones dramáticos sobre el diluvio que sostenían la imaginación de sus oyentes rurales. No está atestiguada la prédica fechada, pero el tema y las imágenes pertenecen a su colección impresa.',
    x: 'Génesis 7:16 — "Y entraron macho y hembra de toda carne, como Dios había mandado a Noé; y Jehová cerró la puerta tras él."',
    th: ['Crisis y prueba', 'Firma y certeza', 'Muerte y eternidad'],
    ol: [
      'El diluvio tiene una sola puerta y un solo carpintero: la salvación no depende del ingenio del que se ahoga sino de la obediencia de entrar por donde Dios puso la entrada, cuando aún queda hora de entrar.',
      'La mano que cerró la puerta no fue la de Noé sino la de Jehová, y ahí Evans instala la doctrina del cuidado divino: el creyente dentro del arca no depende de su fuerza para sostener el madero, sino del Dios que sella el lado de afuera.',
      'Fuera del arca hay bueyes y palacios y gritos; dentro hay estiércol y hambruna y jaula; sin embargo el estiércol dentro del plan de Dios vale más que el palacio fuera de él, porque el agua no negocia con la altura de las torres.',
    ],
    q: ['"Nadie puso un dedo en la puerta del arca desde adentro ni desde afuera: la salvación se abre por donde Dios la abre y se cierra como Él la cierra."'],
  },
  {
    a: 'evans',
    t: 'Él debe crecer',
    y: 1816,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la palabra del Bautista, en la línea de sus sermones sobre la gloria de Cristo y el anonadamiento del siervo que predicó a sus capillas galesas. No está atestiguada la prédica fechada, pero el tema y el tono pertenecen a su colección impresa.',
    x: 'Juan 3:30 — "Es necesario que él crezca, mas yo mengüe."',
    th: ['Santidad', 'Adoración', 'Gracia'],
    ol: [
      'Juan no se apaga por envidia vencida a empujones sino por una ley que reconoce gozoso: cuando el novio está presente, el amigo del novio se aleja del novio para no robarle la mirada que ha venido a conducir.',
      'Evans dibuja el sol de mediodía y la lámpara del alba: la lámpara no se ofende cuando llega el día, porque fue encendida precisamente para eso, y el siervo fiel mide su éxito por la sombra que le queda.',
      'La mengua del hombre es el crecimiento de Cristo en la historia y en el corazón, y por eso la santidad no es inflarse de Dios sino vaciarse a su medida, hasta que el creyente sea apenas la mano que señala.',
    ],
    q: ['"Feliz la lámpara que se funde en el amanecer: su aceite no se gastó en vano, sino en dar tiempo a que el sol saliera."'],
  },
  {
    a: 'evans',
    t: 'Los dos caminos del valle',
    y: 1820,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la puerta angosta del Sermón del Monte, en la línea de sus contraposiciones dramáticas de vida y muerte, tan del gusto de sus oyentes que caminaban montañas y senderos. No está atestiguada la prédica fechada, pero el texto y las imágenes pertenecen a su colección impresa.',
    x: 'Mateo 7:13-14 — "Entrad por la puerta angosta; porque ancha es la puerta y espacioso el camino que lleva a la perdición, y muchos son los que entran por ella; pero angosta es la puerta y estrecho el camino que lleva a la vida, y muy pocos son los que la hallan."',
    th: ['Arrepentimiento', 'Muerte y eternidad', 'Evangelismo'],
    ol: [
      'El camino ancho no necesita entrada ni esfuerzo: se entra de espaldas y sin saber, guiado por la multitud, mientras que la puerta angosta exige arrodillarse y soltar lo cargado, porque el pecado no cabe doblado por el marco de la cruz.',
      'Evans ve a Gales entera caminando por la llanura cómoda hacia un despeñadero que nadie mira, y pide a cada oyente que cuente las pisadas alrededor: la compañía no prueba el rumbo, y el abismo agradece la compañía.',
      'El estrecho no es estrecho de injusticia sino de verdad: excluye cargamentos, no personas, y el que entra despojado descubre al final que salió del valle con las manos más llenas que nunca.',
    ],
    q: ['"La multitud no es mapa: el camino ancho es siempre el más lleno de pies y el más vacío de destino."'],
  },
  {
    a: 'evans',
    t: 'El barco en la tormenta',
    y: 1823,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la tempestad calmada del mar de Galilea, imaginada para una tierra de costas y pesquerías donde la tormenta era vecina. No está atestiguada la prédica fechada, pero la escena y el tono pertenecen a su colección impresa.',
    x: 'Marcos 4:38 — "y le despertaron, y le dijeron: Maestro, ¿no tienes cuidado que perecemos?"',
    th: ['Crisis y prueba', 'Poder sobrenatural', 'Firma y certeza'],
    ol: [
      'El barco llevaba al Señor dormido sobre un cojín, y esa imagen es la teología entera del creyente en la tormenta: la nave que se hunde lleva dentro a Aquel por quien el mar fue hecho, y su sueño no es olvido sino calma anticipada.',
      'Los discípulos preguntan con enojo si no le importa que perezcan, y aprenden que el cuidado de Cristo no se mide por el ruido de su respuesta sino por el peso de su palabra: una sola orden y el viento enmudece como criatura en su corral.',
      'Evans aplica la escena a la iglesia perseguida y al creyente en su noche, mostrando que la tormenta conduce al barco donde Cristo está, y que el peligro real no era el agua sino el miedo que olvida quién viaja en la popa.',
    ],
    q: ['"Si Cristo duerme en tu barco, la tormenta no es naufragio sino lección: despiértalo y verás que el mar era suyo desde antes de tu miedo."'],
  },
  {
    a: 'evans',
    t: 'La piedra desechada',
    y: 1826,
    p: 'Caerphilly, Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre la piedra que los constructores desecharon, predicada en su período de Caerphilly a obreros y canteros que conocían el arte de construir y desechar. No está atestiguada la prédica fechada, pero el símbolo y el tono pertenecen a su colección impresa.',
    x: 'Salmo 118:22 — "La piedra que desecharon los edificadores ha venido a ser cabeza del ángulo."',
    th: ['Firma y certeza', 'Poder sobrenatural', 'Crisis y prueba'],
    ol: [
      'Los constructores del templo esquivaron una piedra por pobre y torcida, y esa misma piedra, que nadie quiso cargar, terminó en la cabeza del edificio porque el plano no era de los canteros sino del Rey.',
      'Evans ve en el rechazo de Nazaret la primera medición errada de la historia: los doctos medían al Mesías con la vara de su expectativa y lo declararon inservible, sin saber que la promesa pesaba más que su vara.',
      'La piedra desechada es el consuelo de los desechados: el evangelio gira alrededor de lo que el mundo rechazó, y el creyente que se siente sobrante del edificio descubre que su valor no lo fija la mano humana sino el ángulo donde Dios lo coloca.',
    ],
    q: ['"El plano no se corrige con la piedra: cuando el mundo desecha lo que Dios escogió, la caída del muro enseñará aritmética a los constructores."'],
  },
  {
    a: 'evans',
    t: 'Los campos blancos de Gales',
    y: 1829,
    p: 'Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre los campos blancos para la siega, en la línea de su celo por el despertamiento de los montes galeses y de las Sierras del país. No está atestiguada la prédica fechada, pero el tema y la aplicación pertenecen a su colección impresa.',
    x: 'Juan 4:35 — "Alzad vuestros ojos y mirad los campos, porque ya están blancos para la siega."',
    th: ['Evangelismo', 'Anhelos humanos', 'Poder sobrenatural'],
    ol: [
      'Los discípulos miraban la comarca con el hambre en el cuerpo y no vieron pueblo; Jesús la miró con el hambre de cumplir la voluntad del Padre y vio cosecha: el ojo decide lo que el campo es.',
      'El tiempo de la siega no es el de la costumbre agrícola sino el de la gracia: entre la siembra y la espiga pasaban meses, y sin embargo la palabra sembrada por el pozo ya estaba blanca, porque Dios madura más rápido que la luna.',
      'Evans pide a Gales alzar los ojos de sus disputas y sus rencillas de capilla para ver los campos: el que siega recibe salario y junta fruto para vida eterna, y el que espera el momento perfecto llega tarde a la hoz.',
    ],
    q: ['"El campo ya está blanco cuando tú todavía estás discutiendo el mes: el único tiempo de la siega es el que hoy respira tu vecino."'],
  },
  {
    a: 'evans',
    t: 'El estandarte del Rey',
    y: 1832,
    p: 'Caerphilly, Gales (estilo fiel de su colección de sermones, ed. Cross, Gutenberg #42340; años aproximados)',
    o: 'Síntesis editorial de su predicación sobre el estandarte alzado por causa de la verdad, en la línea de su visión guerrera y pactista de la iglesia, heredera del lenguaje de batalla del Antiguo Testamento. No está atestiguada la prédica fechada, pero el símbolo y el tono pertenecen a su colección impresa.',
    x: 'Salmo 60:4 — "Has dado a los que te temen bandera, para que se alcen a causa de la verdad. Selah"',
    th: ['Firma y certeza', 'Poder sobrenatural', 'Santidad'],
    ol: [
      'El estandarte no se da para decorar el campamento sino para concentrarlo: en la dispersión de la batalla, la tropa no se reúne por gritos ni por heroes individuales sino por el paño del Rey que se levanta sobre la confusión.',
      'Dios alza la bandera para los que lo temen, no para los fuertes: el temor de Dios es la mano que puede agarrar el asta, y la verdad es la razón por la que la tela sube, de modo que ni el miedo ni la moda pueden derribarla.',
      'Evans manda a la iglesia de su tierra enarbolar la verdad en vez de negociar pausas con el error, porque el ejército que baja el estandarte para conversar con el enemigo termina acampando en el lado equivocado del valle.',
    ],
    q: ['"La bandera no se iza para que la admire la tropa sino para que la tropa sepa dónde está el Rey: quítale la verdad y te quedas con un trapo."'],
  },
  {
    a: 'massillon',
    t: 'La oración de la corte',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Primer sermón del Petit Carême que Massillon pronunció ante el rey niño de catorce años en la capilla de Versalles durante la Cuaresma de 1718. Predica ante un soberano la oración privada como la única sala donde no hay espaldas de seda ni ojos de favor, y el silencio de la corte sirve de contrapeso.',
    x: 'Mateo 6:6 — "Pero tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en secreto; y tu Padre que ve en lo secreto te recompensará en público."',
    th: ['Oración', 'Santidad', 'Idolatría del corazón'],
    ol: [
      'El gran mundo rezaba poco y bien adornado, y Massillon descubre ante el rey la raíz del mal: se ora para ser oído por hombres, y en cuanto se quita la galería se cae la devoción, porque era teatro y no aliento.',
      'El aposento cerrado es la única corte verdadera donde el soberano de Versalles se vuelve criatura, y allí aprende lo que ninguna audiencia le da: que su corona no le ha comprado un minuto de atención ante Dios sin el corazón.',
      'La oración no es un ornamento del creyente sino su respiración en secreto, la apertura del cielo sobre un cuarto pobre, y el que la descubre descubre también que la ausencia de testigos no empobrece el tesoro sino que lo protege.',
    ],
    q: ['"En la corte se aprende a hablar ante los hombres; sólo en el aposento se aprende a estar ante Dios."'],
    i: 'El Petit Carême ante Luis XV se imprimió y circuló por toda Europa como modelo de oratoria sagrada al servicio de la reformación moral de los grandes.',
  },
  {
    a: 'massillon',
    t: 'Las tentaciones del grande',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Sermón del Petit Carême sobre las tentaciones, pronunciado ante la corte durante la Cuaresma de 1718. Massillon describe la situación del poderoso como una escuela donde la adulación hace invisible el peligro, y advierte al rey adolescente que su trono es el lugar donde caer es más fácil y más caro.',
    x: '1 Corintios 10:12 — "Así que, el que se cree estar, mire no caiga."',
    th: ['Santidad', 'Arrepentimiento', 'Idolatría del corazón'],
    ol: [
      'El pobre tropieza y se levanta con cicatriz; el grande cae y no lo sabe, porque cien cortesanos le aplauden el tropiezo, y Massillon enseña que la altura no es seguridad sino caída más lenta y con menos testigos honestos.',
      'Las tentaciones del poder no son las del hambre sino las del aplauso: la vanidad, la cólera, la pereza piadosa, y todas visten uniforme de deber, de modo que el grande necesita más vigilancia que el campesino y la obtiene menos.',
      'El que se cree estar es el hombre más expuesto del reino, y el remedio no es la desconfianza amarga sino la verdad de un espejo donde la corte no pinta: la oración, el confesor fiel y la memoria de los que cayeron desde más alto.',
    ],
    q: ['"Nadie cae tan bajo como el grande, porque nadie le ha dicho jamás la palabra alta que lo habría detenido."'],
  },
  {
    a: 'massillon',
    t: 'La muerte que se olvida',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Sermón del Petit Carême sobre la muerte, predicado ante la corte en la Cuaresma de 1718, donde Massillon denuncia que los grandes han expulsado la muerte de sus palacios con ornato y palabras suaves. Ante el rey niño pide que se le enseñe a contar sus días antes de que la corte le enseñe a olvidarlos.',
    x: 'Salmo 90:12 — "Enséñanos de modo que contemos nuestros días, y traigamos al corazón sabiduría."',
    th: ['Muerte y eternidad', 'Arrepentimiento', 'Idolatría del corazón'],
    ol: [
      'Los hombres no ignoran que han de morir: lo saben como se saben las cuentas ajenas, y por eso la ignorancia más peligrosa no es la del dato sino la del corazón que ha cesado de sentirlo.',
      'Massillon pinta la muerte expulsada de la corte: se la nombra con apodos, se la aleja a los hospitalarios y a los pobres, y de este modo el palacio se convierte en una casa donde todos preparan un viaje que juran no hacer.',
      'La sabiduría pedida por Moisés no es melancolía sino aritmética del corazón: contar los días para no desperdiciarlos, y esa cuenta, hecha en la juventud de un rey, vale más que todas las leyes de su edad madura.',
    ],
    q: ['"El corazón que ha dejado de contar sus días no ha perdido la fe en la muerte: ha perdido la fe en su propio tiempo."'],
  },
  {
    a: 'massillon',
    t: 'El Cristo que la corte no conoce',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Sermón del Petit Carême sobre el poco conocimiento que los cristianos tienen de Jesucristo, pronunciado ante la corte en la Cuaresma de 1718. Massillon muestra que el nombre de Cristo se pronuncia constantemente en Versalles y casi nunca se le conoce, y que el cristiano de gran mundo vive del sobrenombre sin comprar la mercancía.',
    x: 'Filipenses 3:8 — "Y ciertamente, aun estimo todas las cosas en pérdida por la excelencia del conocimiento de Cristo Jesús, mi Señor."',
    th: ['Anhelos humanos', 'Adoración', 'Gracia'],
    ol: [
      'Los cristianos saben de Cristo lo que sabe de una provincia quien sólo ha leído su mapa: nombres, fechas, fronteras, y viven contentos con esa geografía muerta sin sospechar que el conocimiento del Señor es un tesoro por el que Pablo dio todo lo demás.',
      'Massillon desarma las razones del desconocimiento: la pereza del corazón que no quiere leer, el bullicio de la corte que no deja escuchar, y sobre todo el temor secreto de que, conocido de verdad, este Señor costaría demasiado.',
      'Quien conoce a Cristo de verdad lo estima como pérdida todo lo que antes llamaba ganancia, y esa aritmética nueva es la única que puede reformar un reino, porque un monarca que ha visto la excelencia del Señor ya no confunde su corona con el cielo.',
    ],
    q: ['"Hay cristianos que llevan el nombre de Cristo como un perfume: lo usan para que huela bien su vida y jamás para que les cueste nada."'],
  },
  {
    a: 'massillon',
    t: 'La caridad de los grandes',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Sermón del Petit Carême sobre la caridad para con el prójimo, predicado ante la corte durante la Cuaresma de 1718, con la parábola del buen samaritano puesta ante el soberano. Massillon convierte el camino de Jericó en el camino real de Francia, donde los caídos abundan y los que pasan de largo están muy bien vestidos.',
    x: 'Lucas 10:33 — "Mas un samaritano, que iba de camino, vino junto a él, y al verle, fue movido a misericordia."',
    th: ['Santidad', 'Anhelos humanos', 'Arrepentimiento'],
    ol: [
      'El sacerdote y el levita no faltaron a la ley: faltaron al hombre, y Massillon enseña que la religión puede ser el vehículo más cómodo del desamor, porque excusa el pasar de largo con la palabra deber.',
      'El samaritano no hace obra de fundador sino de hombre: ve, se conmueve, se acerca, paga, y su caridad no espera decreto ni gloria, mientras que la de los grandes se administra por interpósita conciencia y se paga con moneda de mandato.',
      'Ante el rey, el predicador lanza la pregunta invertida de la parábola: quién fue prójimo del caído, y aplica que el reino entero será juzgado no por sus códigos de caridad sino por sus caminos de Jericó, por lo que sus grandes hicieron al ver la sangre.',
    ],
    q: ['"La compasión que se queda en el pensamiento es una limosna que el rico hace a su propia dulzura."'],
  },
  {
    a: 'massillon',
    t: 'La muerte de los justos',
    y: 1718,
    p: 'Versalles, Francia (Le Petit Carême, predicado ante Luis XV)',
    o: 'Sermón del Petit Carême sobre la muerte de los justos, predicado ante la corte en la Cuaresma de 1718. Massillon separa las dos muertes: la que asusta a los grandes por pérdida y la que abre al justo por descanso, y enseña ante el rey que la santidad es la única herencia que mejora con el fin.',
    x: 'Salmo 116:15 — "Estimada es a los ojos de Jehová la muerte de sus santos."',
    th: ['Muerte y eternidad', 'Firma y certeza', 'Gracia'],
    ol: [
      'El mundo cuenta la muerte por lo que quita, y Dios la cuenta por lo que recibe: la muerte de su santo no es una pérdida en su reino sino la entrada de un precioso, y esa doble contabilidad separa a los dos pueblos que viven mezclados.',
      'La muerte del justo no es más suave en el cuerpo pero es distinta en el sentido: muere despidiéndose de miseria y no de bienes, de taberna y no de palacio, y por eso lo que al impío le arranca gritos al santo le sirve de puerta.',
      'Massillon enseña a la corte que la vida del justo es la larga preparación de su muerte y su muerte el primer día de su posesión, de modo que el único modo de bien morir es el único modo de bien vivir.',
    ],
    q: ['"Dios no asiste a la muerte de su santo como médico de urgencia, sino como padre que recibe el precio de la sangre de su Hijo."'],
  },
  {
    a: 'massillon',
    t: 'La oración fúnebre del Delfín',
    y: 1711,
    p: 'París, Francia (oración fúnebre documentada por el Delfín, hijo de Luis XIV)',
    o: 'Oración fúnebre por Luis, gran Delfín de Francia, muerto en 1711 tras la corte en la iglesia, predicada por Massillon, entonces obispo de Metz y predicator del rey. El heredero muerto antes que el rey abría ante Francia la lección de que la sucesión no es propiedad del hombre, y Massillon la desarmó con lentitud ante la familia real.',
    x: 'Eclesiastés 12:1 — "Acuérdate de tu Creador en los días de tu juventud, antes que vengan los días malos, y lleguen los años en los cuales no digas: No hay en ellos contentamiento."',
    th: ['Muerte y eternidad', 'Crisis y prueba', 'Idolatría del corazón'],
    ol: [
      'Francia entierro a su esperanza y no a un anciano, y Massillon hace oír ante el trono que el Delfín también se acordó tarde: los días malos llegaron, y la majestad de la casa real no compró ni un contentamiento más.',
      'La oración fúnebre es un espejo puesto ante los príncipes vivos: si el heredero del mayor trono del mundo no pudo posponer su cuenta con Dios, cada oyente de rango y de seda debe preguntar dónde pone su juventud.',
      'Massillon no clava el diente en la desesperación sino en la juventud que aún puede acordarse: el grito del Eclesiastés es una misericordia, porque la memoria del Creador guardada en la juventud es el único seguro contra los días malos.',
    ],
    q: ['"La corona no pospone la muerte: sólo consigue que la muerte llegue vestida de púrpura."'],
    i: 'La oración por el Delfín consagró a Massillon como el predicator de la casa real y preparó el Petit Carême ante el futuro Luis XV.',
  },
  {
    a: 'massillon',
    t: 'La esperanza de Francia enterrada',
    y: 1712,
    p: 'París, Francia (oración fúnebre documentada por el duque de Borgoña, nieto de Luis XIV)',
    o: 'Oración fúnebre por el duque de Borgoña, nieto de Luis XIV y esperanza del trono, muerto en 1712 con veinte años pocos días después de su padre, cuando Francia contaba ya con él como futuro Luis XV. Massillon predicó ante la familia real el duelo de un reino que enterraba dos veces en un año su sucesión entera.',
    x: 'Job 14:1-2 — "El nacido de mujer es corto de días, y harto de inquietud. Nace como la flor, y es cortado, y huye como la sombra, y no persevera."',
    th: ['Muerte y eternidad', 'Crisis y prueba', 'Anhelos humanos'],
    ol: [
      'El príncipe de veinte años no murió en el campo ni en la guerra sino en la flor misma de la promesa, y Massillon toma la palabra de Job para enseñar a Francia que la flor no negocia con la hoz: la promesa de mañana es una merced, no un título.',
      'El duelo del reino es la lección del reino: los que contaban dynastías y matrimonios aprenden que la historia no se firma en la voluntad de los hombres, y que la esperanza puesta en la carne es siempre una cuenta abierta.',
      'Massillon no deja la corte en el duelo sino en la pregunta: si la esperanza de Francia era flores, ¿qué deben hacer los que sobreviven al príncipe muerto?, y la respuesta del sermón es la de Job: la fijeza no está en el hombre sino en su Redentor.',
    ],
    q: ['"Los reinos ponen su esperanza en la flor más cara del jardín, y la hoz no pregunta el precio de la flor."'],
    i: 'La doble oración fúnebre por el Delfín y su hijo marcó el fin de la confianza dinástica de Luis XIV y cimentó la fama europea de Massillon.',
  },
  {
    a: 'massillon',
    t: 'El engaño de los siglos',
    y: 1704,
    p: 'Versalles, Francia (estilo fiel de su Cuaresma de 1704 ante la corte, año aproximado)',
    o: 'Síntesis editorial de su predicación sobre la vanidad de las cosas, en la línea de la Cuaresma que Massillon predicó ante la corte en 1704, cuando su palabra desarmaba lentamente la solemnidad de Versalles. No está atestiguada la prédica fechada concreta, pero el texto y la crítica a la vanidad de los siglos pertenecen a su colección.',
    x: 'Eclesiastés 1:2 — "Vanidad de vanidades, dijo el Predicador; vanidad de vanidades, todo es vanidad."',
    th: ['Idolatría del corazón', 'Muerte y eternidad', 'Anhelos humanos'],
    ol: [
      'El Predicador no condona una vanidad: condona la suma de todas, y Massillon aplica la cuenta a los grandes, que multiplican vanidades con más esmero y las llaman gloria, honor, correspondencia y trato, nombres nuevos para el vaho viejo.',
      'Cada siglo se cree distinto del anterior y hereda sus ídolos con la moda cambiada: la corte de Versalles adora lo que adoró Babilonia con sillas más cómodas, y por eso la palabra vanidad no es arqueología sino el presente mismo.',
      'La frase todo es vanidad no es desesperación sino escalera: quien la ha pronunciado en serio se ha quedado sin suelo para edificar idolatría alguna, y desde ese vacío el corazón empieza, por fin, a buscar lo que no pasa.',
    ],
    q: ['"Las generaciones cambian de ropa a sus ídolos y se creen nuevas; el Predicador, que ha visto pasar los siglos, no cambió ni una palabra."'],
  },
  {
    a: 'massillon',
    t: 'La Natividad ante la corte',
    y: 1704,
    p: 'Versalles, Francia (estilo fiel de su colección de sermones de Adviento y solemnidades ante la corte, año aproximado)',
    o: 'Síntesis editorial de su predicación navideña sobre el nacimiento del Salvador, en la línea de los sermones de solemnidad que Massillon pronunció ante la corte real. No está atestiguada la prédica fechada concreta, pero el texto y la aplicación del pesebre a la grandeza cortesana pertenecen a su colección.',
    x: 'Lucas 2:11 — "porque os ha nacido hoy, en la ciudad de David, un Salvador, que es Cristo el Señor."',
    th: ['Adoración', 'Gracia', 'Anhelos humanos'],
    ol: [
      'El Salvador no nace en palacio ni en campaña sino en un establo prestado, y Massillon pone el pesebre frente a Versalles: la primera lección de la fe es que el Señor eligió la pobreza donde la grandeza no puede entrar sin despojarse.',
      'El ángel anuncia gran gozo para todo el pueblo y no para la corte exclusivamente, y esta igualdad del pesebre desarma la jerarquía de la sala: ante el niño de Belén el príncipe se arrodilla al nivel del pastor y sólo conserva su lugar si conserva su esterilidad de corazón.',
      'La Natividad es el mayor escándalo de la historia del orgullo: Dios hecho niño deshereda toda la vanagloria de los hombres, y el que no aprende a inclinarse ante un establo jamás entenderá qué buscaba Dios al hacerse tan pequeño.',
    ],
    q: ['"Dios bajó hasta el pesebre para que ningún hombre pudiera alegar que el cielo está a altura imposible: la única altura es la del corazón."'],
  },
{
    a: 'bourdaloue',
    t: 'La oración que piensa',
    y: 1668,
    p: 'París (Cuaresma predicada ante la corte de Luis XIV, estilo fiel de sus Obras completas, ed. 1864)',
    o: 'Predicado en el marco de sus Cuaresmas de la corte, cuando Bourdaloue atacaba de frente la religión tibia de los grandes: una devoción que reza sin pensar. El sermón desmonta el quietismo devoto que confunde abandono con abandono del deber.',
    x: 'Mateo 26:41 — "Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, mas la carne es débil."',
    th: ['Oración', 'Santidad'],
    ol: [
      'La oración sin atención es un hábito de la boca que deja intacto el corazón, y Bourdaloue demuestra punto por punto que el olvido de velar precede siempre a la caída.',
      'El espíritu está dispuesto, dice el Señor, y esa disposición es un tesoro que la pereza disipa cuando la voluntad no sostiene lo que el entendimiento ya sabe.',
      'Orar es pensar delante de Dios: examinar la conciencia, nombrar el vicio propio sin rodeos y pedir la gracia concreta contra la tentación concreta que nos amenaza hoy.'
    ],
    q: [
      'La oración que no piensa no es piedad: es el descanso disfrazado de devoción.'
    ],
    i: 'Modelo de oratoria sagrada contra el quietismo; influyó en la espiritualidad moral del clero francés del siglo XVII.'
  },
  {
    a: 'bourdaloue',
    t: 'La pasión contemplada',
    y: 1669,
    p: 'París (estilo fiel de su colección de sermones sobre la Pasión, Obras completas, ed. 1864)',
    o: 'Sermon de Semana Santa ante oyentes acostumbrados a la devoción decorativa de la corte: Bourdaloue se niega a mover lágrimas y se propone leer la cruz con lógica. Cada sufrimiento del Señor es examinado como una lección moral exigente.',
    x: 'Juan 19:30 — "Cuando Jesús hubo tomado el vinagre, dijo: Consumado es. Y habiendo inclinado la cabeza, entregó el espíritu."',
    th: ['Crisis y prueba', 'Gracia'],
    ol: [
      'El Hijo de Dios no termina su obra con queja ni con resignación pasiva: la palabra consumado declara que cada gesto de su pasión tuvo propósito y medida.',
      'Contemplar la cruz con razón es descubrir que la obediencia que sufrió hasta el fin juzga nuestra vida cristiana a medias, cómoda y sin precio.',
      'Quien mira el madero y no cambia nada en su conducta ha hecho del mayor sacrificio de la historia un espectáculo, no un sacramento de conversión.'
    ],
    q: [
      'La cruz es el tratado moral más severo que jamás se predicó, y está escrito en un cuerpo que sangra.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La penitencia aplazada',
    y: 1670,
    p: 'París (estilo fiel de sus sermones sobre la penitencia, Obras completas, ed. 1864)',
    o: 'Bourdaloue dedicó varias cuaresmas a desenmascarar la ingeniería de posponer la conversión: el pecador culto que admite su estado y fija la enmienda para una edad futura. El sermón analiza esa economía del aplazamiento como la más elegante forma de dureza de corazón.',
    x: 'Hebreos 3:15 — "Si oyereis su voz, no endurezcáis vuestros corazones, como en la provocación en el día de la tentación."',
    th: ['Penitencia', 'Arrepentimiento', 'Muerte y eternidad'],
    ol: [
      'La penitencia aplazada no es prudencia sino desprecio calculado: se convierte la salud del alma en asunto que puede esperar mientras corre el negocio y la ambición.',
      'El endurecimiento del corazón no llega con escándalos: se fabrica lentamente con cada aviso escuchado y desechado, hasta que la voz de Dios deja de romper el hielo.',
      'Convertirse mañana es la divisa con que el hombre rinde hoy su voluntad al vicio, y mañana jamás llega porque el hábito de demora crece con los años.'
    ],
    q: [
      'Decir mañana es el modo más cortés de decir nunca.'
    ],
    i: 'Sus análisis de la impeniencia final se citaron durante siglos como manual de examen para conversos tibios.'
  },
  {
    a: 'bourdaloue',
    t: 'La complacencia en sí mismo',
    y: 1671,
    p: 'París (estilo fiel de sus Cuaresmas de la corte, Obras completas, ed. 1864)',
    o: 'Sermón contra la complacencia, vicio que Bourdaloue describe como el amor propio disfrazado de virtud entre personas de mérito real. Frente a sus oyentes cultos, dibuja al fariseo del templo como un hombre de buenas obras y corazón cerrado.',
    x: 'Lucas 18:13 — "Mas el publicano, estando lejos, no quería ni aun alzar los ojos al cielo, sino que se golpeaba el pecho, diciendo: Dios, sé propicio a mí, pecador."',
    th: ['Santidad', 'Idolatría del corazón'],
    ol: [
      'El amor propio se disfraza de conciencia: el hombre se complace en su devoción, en su honestidad y en su celo, y esa satisfacción vuela el lugar donde Dios debía reinar.',
      'El fariseo ayuna, diezma y ora, y con todo ello no baja del templo justificado, porque sus virtudes eran espejos donde se miraba a sí mismo.',
      'El publicano enseña la única postura que abre el cielo: la oración breve del pecador que no se excusa, que no compara, y que pide propiciación como quien pide la vida.'
    ],
    q: [
      'Hay virtudes tan llenas de nosotros mismos que dejan en el alma menos sitio para Dios que los pecados.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La mentira de la corte',
    y: 1672,
    p: 'París (Cuaresma predicada ante Luis XIV, estilo fiel de sus sermones sobre la veracidad, Obras completas, ed. 1864)',
    o: 'Ningún predicador del siglo se atrevió a tratar la mentira ante el rey con la frialdad geométrica de Bourdaloue: sin anécdotas, divide la falsedad en especies y condena una por una las palabras dobles de la vida pública.',
    x: 'Proverbios 12:22 — "Los labios mentirosos son abominación a Jehová; mas los que obran la verdad le son de su agrado."',
    th: ['Santidad', 'Firma y certeza'],
    ol: [
      'La mentira tiene grados y cortesías, pero toda palabra que sabe que es falsa corrompe al que la pronuncia, porque divide al hombre interior entre lo que dice y lo que es.',
      'En la corte, como en el comercio, la palabra doble se ha vuelto moneda corriente: se engaña con tonos, con silencios y con medias verdades tan eficaces como falsedades completas.',
      'La veracidad es una cuestión de gloria de Dios antes que de honor humano, porque la lengua es instrumento consagrado al que dio la palabra.'
    ],
    q: [
      'Un hombre que miente con destreza ha perdido más que su crédito: ha perdido su propia compañía.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La ambición que sube',
    y: 1673,
    p: 'París (estilo fiel de sus Cuaresmas de la corte, Obras completas, ed. 1864)',
    o: 'Ante la corte más ambiciosa de Europa, Bourdaloue predica contra la ambición sin citar nombres: examina el deseo de subir como una pasión que se disfraza de diligencia y de celo, y opone a su escalera la lógica invertida del Evangelio.',
    x: 'Marcos 10:43 — "pero el que quiera hacerse grande entre vosotros será vuestro servidor."',
    th: ['Idolatría del corazón', 'Santidad'],
    ol: [
      'La ambición no pregunta qué debe hacerse, sino qué hará brillar al que lo hace, y así convierte los empleos, el ministerio y aun la piedad en peldaños.',
      'Cristo no restringe la grandeza: la redefine, y con esa redefinición tumba toda carrera edificada sobre el provecho propio y el anhelo de ser visto.',
      'Servir es la única ascensión que el Evangelio bendice, porque en el reino de Dios se sube inclinándose y se gana perdiendo lo que la carne llama ganancia.'
    ],
    q: [
      'La ambición es un hambre que crece con cada alimento que recibe y no conoce otro límite que la tumba.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La caridad ordenada',
    y: 1674,
    p: 'París (estilo fiel de sus sermones sobre la caridad, Obras completas, ed. 1864)',
    o: 'Bourdaloue se niega a predicar el amor como sentimiento: analiza el capítulo trece de la primera carta a los corintios como un código de conducta, y somete a examen la benevolencia elegante que solo dona lo que no cuesta.',
    x: '1 Corintios 13:4 — "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece."',
    th: ['Santidad', 'Anhelos humanos'],
    ol: [
      'La caridad no es un afecto tierno sino una justicia hacia Dios y hacia el prójimo, y por eso puede describirse en actos: sufrir, ceder, no envidiar, no inflarse.',
      'El limosnero que da con desprecio ha perdido la mitad de su limosna, porque la caridad se mide por lo que cuesta dar y no por lo que se entrega.',
      'Sin caridad, los dones más brillantes son moneda sin curso: la elocuencia, la ciencia y hasta el martirio no valen nada en la balanza donde se pesa el alma.'
    ],
    q: [
      'La caridad que no cuesta nada es rara vez caridad: es vanidad que ha encontrado un pasatiempo piadoso.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La providencia que gobierna',
    y: 1675,
    p: 'París (estilo fiel de sus sermones sobre la providencia, Obras completas, ed. 1864)',
    o: 'En tiempos de guerra y de penuria, cuando los grandes discutían la fortuna, Bourdaloue predica la providencia como doctrina práctica: no como consuelo flojo, sino como la verdad que desarma la ansiedad y juzga la inquietud de los que no confían.',
    x: 'Mateo 10:29 — "¿No se venden dos pajarillos por un cuarto? Y ni uno de ellos cae a la tierra sin vuestro Padre."',
    th: ['Firma y certeza', 'Crisis y prueba', 'Oración'],
    ol: [
      'El padrecito que cae al suelo no muere por azar: si lo mínimo del creado está gobernado, la vida del hombre bautizado está gobernada con más razón todavía.',
      'La inquietud excesiva por el mañana es una herejía práctica: confiesa con la boca al Padre que gobierna y vive como si el mundo dependiera de nuestro cálculo.',
      'Confiar en la providencia no exime del trabajo: obliga a él con serenidad, porque el que cree que Dios gobierna hace su deber y deja a Dios el resultado.'
    ],
    q: [
      'No hay providencia de Dios que pueda leerse en el transcurso del día, pero toda se lee al final del libro.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'El día del Señor',
    y: 1676,
    p: 'París (estilo fiel de sus sermones sobre el domingo, Obras completas, ed. 1864)',
    o: 'Contra la profanación elegante del domingo en la corte, donde el día del Señor se gastaba en diversiones y visitas, Bourdaloue defiende la asamblea como la que santifica el tiempo: predicado a oyentes que ya no creían necesitarla.',
    x: 'Éxodo 20:8 — "Acuérdate del día del reposo para santificarlo."',
    th: ['Adoración', 'Santidad'],
    ol: [
      'El mandamiento del reposo no es una ley de cancillería sino un regalo: Dios reserva un día y lo consagra para que el alma respire y recuerde a quién debe el aliento.',
      'El que gasta el domingo entero sin Dios ha robado el tiempo dos veces: de la gloria que se le debía y del descanso que su propio corazón necesitaba.',
      'La asamblea santifica el tiempo porque reúne a los dispersos: el cristiano que ora solo es firme, pero el que ora con la Iglesia es indestructible.'
    ],
    q: [
      'El hombre que no santifica un día a la semana terminará por no santificar ninguno.'
    ]
  },
  {
    a: 'bourdaloue',
    t: 'La anatomía de la tentación',
    y: 1677,
    p: 'París (estilo fiel de sus Cuaresmas de la corte, Obras completas, ed. 1864)',
    o: 'Sermón de método más que de fuego: Bourdaloue disecciona la tentación como un anatomista, distinguiendo la sugerencia, el deleite y el consentimiento, para enseñar dónde exactamente muere la libertad y nace el pecado.',
    x: 'Santiago 1:14 — "sino que cada uno es tentado cuando de su propia concupiscencia es atraído y atrapado."',
    th: ['Santidad', 'Crisis y prueba'],
    ol: [
      'La tentación no entra por fuerza en el alma: encuentra en ella una concupiscencia que le abre, y el demonio no hace más que llamar a la puerta que nuestro apetito deja entreabierta.',
      'Entre la sugestión y el pecado hay un espacio de libertad: el deleite que se aloja, el pensamiento que se demora y el consentimiento que ya no se retira son los grados de la caída.',
      'Vencer la tentación no es heroicidad de un instante sino vigilancia ordinaria: cortar el deleite en su nacimiento es más fácil que arrancar el hábito cuando ya echa raíces.'
    ],
    q: [
      'El demonio tienta poco: la mayor parte del trabajo la hacemos nosotros mismos con nuestra propia concupiscencia.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis del bautismo',
    y: 1903,
    p: 'Londres (capítulo nacido de su serie de predicación, luego fijado en The Crises of the Christ)',
    o: 'Morgan leía el Evangelio como una arquitectura de crisis decisivas: aquí expone el Jordán como el momento en que el Hijo se presenta públicamente y el cielo se abre. La homilía muestra su método de ver el libro entero antes de entrar en el detalle.',
    x: 'Mateo 3:17 — "y hubo una voz de los cielos que decía: Este es mi Hijo amado, en quien tengo complacencia."',
    th: ['Firma y certeza', 'Poder sobrenatural'],
    ol: [
      'El bautismo de Jesús no es un acto de penitencia sino una presentación: el que no tenía pecado se pone de pie entre los que vienen confesando, para identificarse con la nación que necesita lavarse.',
      'El cielo que se abre sobre el Jordán rompe el silencio de cuatro siglos: la voz que había callado desde Malaquías vuelve a nombrar a un Hijo.',
      'Toda la obra que sigue, hasta la cruz, arranca de esta aprobación pública del Padre: el Señor no trabaja para ganar el amor del cielo, sino desde ese amor ya pronunciado.'
    ],
    q: [
      'El Hijo no descendió al río para buscar una bendición: descendió para convertirse en la puerta por donde la bendición bajaría al mundo.'
    ],
    i: 'El capítulo fijo el método de The Crises of the Christ: leer la vida de Cristo como una escalera de momentos fundacionales.'
  },
  {
    a: 'morgan',
    t: 'La crisis del desierto',
    y: 1903,
    p: 'Londres (de su serie sobre las crisis de Cristo, luego en The Crises of the Christ)',
    o: 'Morgan expone las tres tentaciones como el examen del Hijo: la prueba no es si el diablo es fuerte, sino si el Hijo se mantendrá dentro del método de Dios. La homilía muestra su costumbre de estructurar el pasaje antes de predicarlo.',
    x: 'Mateo 4:4 — "Escrito está: No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios."',
    th: ['Crisis y prueba', 'Santidad'],
    ol: [
      'El Hijo vence no discutiendo con el tentador sino refugiándose en el texto escrito: cada golpe de su resistencia es un pasaje del Antiguo Testamento hecho arma.',
      'Las tres tentaciones son una sola invitación con tres disfraces: tomar el rey sin la cruz, forzar al Padre con el gesto espectacular y adorar a otro para heredar sin padecer.',
      'El desierto es la escuela del ministerio: quien no ha aprendido allí que se vive de la palabra de Dios se venderá después por pan a la primera hambruna del éxito.'
    ],
    q: [
      'La tentación no pregunta si puedes, sino si vas a hacerlo por el camino de Dios o por el atajo del diablo.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis del monte de la transfiguración',
    y: 1905,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'Predicado en su ciclo sobre el Evangelio de Mateo: Morgan veía en la transfiguración la gloria que arde bajo la carne, el momento en que la humanidad velada del Señor deja ver por un instante lo que siempre fue.',
    x: 'Mateo 17:2 — "y se transfiguró delante de ellos; y su rostro resplandeció como el sol, y sus vestidos se hicieron blancos como la luz."',
    th: ['Poder sobrenatural', 'Adoración'],
    ol: [
      'La transfiguración no añade nada al Hijo: descubre lo que ya era, porque la carne no escondía la gloria por defecto sino por misericordia hacia los que todavía no podían sostenerla.',
      'Moisés y Elías hablan con Él de su partida: la ley y los profetas convergen sobre la cruz, y en la montaña la Escritura entera se ve de pie alrededor del Señor.',
      'Los tres discípulos no suben para un privilegio sino para un encargo: el que ha visto la gloria debe bajar con ella al valle donde el niño epiléptico espera.'
    ],
    q: [
      'La gloria no vino al monte: la gloria salió de debajo de la carne por un momento y volvió a cubrirse.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis de Getsemaní',
    y: 1907,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'En su lectura arquitectónica de la pasión, Morgan expone Getsemaní como la puerta de la cruz: aquí el Hijo bebe la copa que nadie más podía beber, y la agonía se lee no como miedo sino como consagración final del Calvario.',
    x: 'Mateo 26:39 — "Y adelantándose un poco, se postró sobre su rostro, orando y diciendo: Padre mío, si es posible, pase de mí esta copa; pero no sea como yo quiero, sino como tú."',
    th: ['Crisis y prueba', 'Gracia'],
    ol: [
      'La copa no era la muerte en general: era esa muerte concreta, hecho pecado por nosotros, y el Hijo santo la mira de frente antes de beberla sin escapar.',
      'Getsemaní no es debilidad vencida sino voluntad ofrecida: la frase no sea como yo quiero, sino como tú es el centro del Evangelio dicho por el propio Señor.',
      'Los discípulos duermen mientras se decide la redención: toda la historia de la Iglesia está en esa escena, con el cielo en agonía y la carne sin vela.'
    ],
    q: [
      'Getsemaní no es el lugar donde Cristo casi fracasa: es el lugar donde la cruz se hizo posible antes de llegar a ser real.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis de Gabbatha',
    y: 1908,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'Morgan llama a Gabbatha la crisis del tribunal: el Juez de los vivos y de los muertos de pie ante un tribunal humano. La homilía contrasta la autoridad del César con la que calla en el reo, en su tono de exposición contenida.',
    x: 'Juan 19:15 — "Ellos gritaron: Quita, quita, crucifícale. Les dice Pilato: ¿A vuestro rey he de crucificar? Respondieron los príncipes de los sacerdotes: No tenemos rey sino a César."',
    th: ['Crisis y prueba', 'Firma y certeza'],
    ol: [
      'El juicio de Cristo invierte todos los tribunales: el reo interroga al magistrado, y el que dicta sentencia es el que más la teme.',
      'La frase no tenemos rey sino a César es la renuncia más trágica de la historia de Israel: la nación escogida declara su bancarrota espiritual con la voz de sus príncipes.',
      'Gabbatha enseña que ningún poder humano condena al Señor: Él permite el tribunal para que en él se juzgue al mundo y se cumpla la Escritura.'
    ],
    q: [
      'El mundo juzgó al Juez y en ese juicio fue juzgado: Gabbatha es la sentencia del hombre contra sí mismo.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis de Golgota',
    y: 1909,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'Morgan predica las siete palabras de la cruz no como siete sermones devocionales sino como una sola arquitectura: cada palabra abre un salón del misterio redentor, desde el perdón hasta la entrega final del espíritu.',
    x: 'Lucas 23:46 — "Y clamando Jesús a gran voz, dijo: Padre, en tus manos encomiendo mi espíritu. Y habiendo dicho esto, expiró."',
    th: ['Gracia', 'Muerte y eternidad'],
    ol: [
      'Las siete palabras no son fragmentos: son el edificio completo de la redención, con cimientos de perdón, columnas de misericordia y remate de entrega.',
      'La primera palabra es intercesión y la última es confianza: el Señor abre y cierra su obra en oración, y todo el Calvario transcurre dentro de un corazón que reza.',
      'El velo rasgado confirma lo que la voz clamada declara: la muerte del Hijo no es un accidente sufrido sino un acceso abierto, hecho por Él y dado a nosotros.'
    ],
    q: [
      'En el Calvario la muerte no venció: la muerte fue vencida mientras parecía celebrar su victoria.'
    ]
  },
  {
    a: 'morgan',
    t: 'La crisis de Pentecostés',
    y: 1910,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'Morgan cierra su línea de crisis con Pentecostés: el Espíritu que clausura la espera de los discípulos y abre la era de la Iglesia. La homilía enlaza la ascensión con el fuego del comedor, mostrando la continuidad de la obra del Señor.',
    x: 'Hechos 2:4 — "Y fueron todos llenos del Espíritu Santo, y comenzaron a hablar en otras lenguas, según el Espíritu les daba que hablasen."',
    th: ['Poder sobrenatural', 'Evangelismo'],
    ol: [
      'La espera de los discípulos no era inacción sino obediencia: el Señor les había ordenado no salir hasta ser revestidos, y Pentecostés es el cumplimiento puntual de esa orden.',
      'El Espíritu no viene como ornamento de la Iglesia sino como su vida: sin el fuego del comedor, la asamblea es un club con buena memoria y sin poder.',
      'Las lenguas del primer anuncio revierten la confusión de Babel: el Evangelio nace hablando la lengua de cada pueblo, y ese es su método para siempre.'
    ],
    q: [
      'La Iglesia no nació de un plan de hombres sino de una promesa cumplida: Pentecostés es la firma de Dios sobre la obra de la cruz.'
    ]
  },
  {
    a: 'morgan',
    t: 'El gran médico',
    y: 1911,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'En su predicación regular de Westminster Chapel, Morgan detiene el ritmo expositivo para detenerse en la frase del Señor sobre los enfermos: la homilía despliega la figura del gran médico y el diagnóstico del alma que el mundo no sabe hacerse.',
    x: 'Marcos 2:17 — "Al oír esto Jesús, les dijo: Los sanos no tienen necesidad de médico, sino los enfermos. No he venido a llamar a justos, sino a pecadores."',
    th: ['Gracia', 'Arrepentimiento'],
    ol: [
      'El Señor no vino a abrir un consultorio para sanos: su método empieza siempre por el diagnóstico, y el que no se reconoce enfermo queda fuera del alcance de su medicina.',
      'Los fariseos no estaban sanos sino anestesiados: la religión sin arrepentimiento produce el único enfermo que niega la enfermería.',
      'La llamadura de Cristo no es premio a la salud sino cita para los que se saben mal: el pecador que se declara tal ha dado el primer paso dentro de la consulta.'
    ],
    q: [
      'El peor síntoma del alma es ignorar que está enferma, y la peor religión es la que cura ese síntoma con halagos.'
    ]
  },
  {
    a: 'morgan',
    t: 'El mensaje del libro abierto',
    y: 1912,
    p: 'Londres (Westminster Chapel, estilo fiel de The Westminster Pulpit)',
    o: 'Morgan, que leía cada libro de la Escritura unas cuarenta veces antes de predicarlo, expone aquí la visita de Nazaret como la carta fundacional de la misión: la Biblia como la casa de Dios, con el Señor de pie en su propio salón leyendo lo que de Él estaba escrito.',
    x: 'Lucas 4:18 — "El Espíritu del Señor está sobre mí, por cuanto me ha ungido para dar buenas nuevas a los pobres; me ha enviado a sanar a los quebrantados de corazón."',
    th: ['Evangelismo', 'Firma y certeza'],
    ol: [
      'En Nazaret el Señor no improvisa: abre el rollo, lee y dice hoy se cumple, y con esa frase declara que toda la Escritura era un mapa cuyo centro acababa de llegar.',
      'La Biblia no es un archivo de máximas sino la casa donde Dios recibe: el que la abre con hambre encuentra al Huésped dentro de sus páginas.',
      'El pueblo que oyó con admiración terminó en furia: el libro abierto siempre divide, y la franqueza de la palabra es la prueba de que es viva.'
    ],
    q: [
      'El libro que no se abre no alimenta: la Biblia es pan de cada día o es decoración de anaquel.'
    ]
  },
  {
    a: 'morgan',
    t: 'La resurrección y la vida',
    y: 1913,
    p: 'Londres (Westminster Chapel, estilo fiel de su ciclo de predicación sobre el Evangelio de Juan)',
    o: 'De su largo ciclo sobre el Evangelio de Juan, Morgan toma el encuentro de Betania: el Yo soy que no promete una resurrección futura sino que se declara presente. La homilía muestra su hábito de leer cada signo del cuarto Evangelio como revelación progresiva.',
    x: 'Juan 11:25 — "Le dijo Jesús: Yo soy la resurrección y la vida; el que en mí cree, aunque esté muerto, vivirá."',
    th: ['Muerte y eternidad', 'Poder sobrenatural', 'Firma y certeza'],
    ol: [
      'Ante la tumba el Señor no dice que resucitará a Marta: dice que Él es la resurrección, y así desplaza la esperanza de un acontecimiento a una Persona.',
      'El llanto de Jesús no es impotencia: es la ira del Hijo ante la muerte, entendida como el intruso que invade la casa de su amigo.',
      'Marta confiesa con exactitud y no entiende todavía: la fe en la Escritura correcta necesita el encuentro personal para convertirse en consuelo vivo.'
    ],
    q: [
      'La esperanza cristiana no es que la muerte terminará: es que la muerte ya ha encontrado a Alguien que la desarma.'
    ]
  },
  {
    a: 'sunday',
    t: 'Wonderful',
    y: 1905,
    p: 'Chicago (sermón documentado de sus campañas de tabernáculo, recogido en su colección impresa)',
    o: 'Uno de los sermones más famosos de Billy Sunday, predicado en decenas de campañas: un vuelco atlético sobre el nombre de Cristo, nombre Wonderful, Admirable, que el evangelista descuelga frase a frase como quien golpea una pelota contra el vaso del pecado.',
    x: 'Isaías 9:6 — "porque un niño nos es nacido, hijo nos es dado, y el principado será sobre su hombro; y se llamará su nombre Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz."',
    th: ['Adoración', 'Poder sobrenatural'],
    ol: [
      'El nombre Admirable no es un epíteto de calendario: es una lista de emergencias humanas, y cada título del versículo responde a una carencia que el pecador reconoce en la silla del tabernáculo.',
      'Sunday tumba la indiferencia preguntando qué nombre ha invocado el mundo en sus horas finales: nadie muere llamando a sus ídolos, y todos los que han pasado la muerte de cerca saben a quién gritar.',
      'El sermón golpea con la única conclusión que admite: si el nombre es Admirable, entonces la vida que no se rinde a Él ha quedado fuera de la mayor oferta que la historia ha hecho a un hombre.'
    ],
    q: [
      'Cristo no es un tema para hablar en domingo: es el nombre que responde cuando todo lo demás cuelga el teléfono.'
    ],
    i: 'Convertido en pieza central de sus campañas, este sermón fijó su fama de predicador capaz de hacer teología con el ritmo del estadio.'
  },
  {
    a: 'sunday',
    t: 'Las mejores obras del diablo',
    y: 1908,
    p: 'Estados Unidos (sermón documentado de sus campañas, impreso por la prensa de sus reuniones)',
    o: 'En su sermón documentado sobre el diablo, Sunday alegaba que la mejor obra de Satanás no es el escándalo sino la respetabilidad sin conversión: el hombre que va a la iglesia, paga sus cuentas y sigue perdido, y por eso nadie lo alerta.',
    x: '2 Corintios 11:14 — "Y no es maravilla, porque el mismo Satanás se transforma en ángel de luz."',
    th: ['Arrepentimiento', 'Idolatría del corazón'],
    ol: [
      'El diablo no necesita fabricar ateos: le basta con llenar los bancos de gente que confunde pertenecer a una iglesia con haber nacido de nuevo.',
      'La transformación en ángel de luz no es un truco de escenario: es la moral exterior impecable que esconde un corazón jamás rendido, y esa es la obra maestra que Sunday denunciaba en sus reuniones.',
      'Ninguna etiqueta salva: la membresía, la costumbre familiar y la decencia pública son las cortinas del taller donde el alma nunca se ha negociado con Dios.'
    ],
    q: [
      'El diablo manda a sus peores obras vestidas de domingo, con la Biblia debajo del brazo y el corazón intacto.'
    ]
  },
  {
    a: 'sunday',
    t: 'Arregla tus cuentas con Dios',
    y: 1910,
    p: 'Estados Unidos (sermón documentado de sus campañas de tabernáculo, impreso por la prensa de sus reuniones)',
    o: 'Su llamado documentado más repetido, predicado al final de cada campaña: Sunday cruzaba el tabernáculo y apuraba la decisión inmediata, porque para él la reconciliación con Dios no era un proyecto de temporada sino una cuenta que se paga hoy.',
    x: '2 Corintios 5:20 — "Así que, somos embajadores en nombre de Cristo, como si Dios rogase por medio de nosotros: Reconciliaos con Dios."',
    th: ['Arrepentimiento', 'Evangelismo', 'Crisis y prueba'],
    ol: [
      'Dios no mendiga: Dios suplica, y esa es la inversión que el versículo pone delante de todo auditorio orgulloso, con el Creador rogando por medio de un embajador',
      'Las cuentas con Dios no se refinancian: cada año de demora agrega intereses de duro estudio, y el moribundo en la mesa de operaciones no pide una cita para mañana.',
      'La reconciliación es un acto, no un sentimiento: se baja del banco, se cruza el tabernáculo y se firma la paz con Dios en la línea donde ya está esperando el testimonio.'
    ],
    q: [
      'Mañana es la excusa favorita del infierno: Dios dice hoy, y el diablo dice demora.'
    ],
    i: 'El llamado fijó el estilo de cierre de sus campañas: miles de decisiones bajando del banco por el sendero del tabernáculo.'
  },
  {
    a: 'sunday',
    t: 'El retroceso',
    y: 1909,
    p: 'Estados Unidos (sermón documentado de sus campañas, impreso por la prensa de sus reuniones)',
    o: 'Sunday predicó el retroceso como nadie: con caricaturas físicas del creyente que se enfría, citado por sus oyentes durante décadas. El sermón no consuela al caído: lo empuja a la vuelta, y nombra el primer peldaño del descenso sin adornos.',
    x: 'Jeremías 2:19 — "Conoce, pues, y ve cuán malo y amargo sea para ti el haber dejado tú a Jehová tu Dios, y que mi temor no está en ti, ha dicho el Señor Jehová de los ejércitos."',
    th: ['Arrepentimiento', 'Santidad'],
    ol: [
      'El retroceso no es una caída súbita: es un enfriamiento por grados, y el creyente que ha bajado de una temperatura sin darse cuenta descubre el hielo cuando ya está en el centro del lago.',
      'La apostasía es amarga porque sabe mentir: promete vida al dejar la casa del Padre y entrega ceniza, y el versículo obliga al fugitivo a saber, no a sospechar, cuán mal le salió el trato.',
      'La vuelta no es nostalgia: es arrepentimiento con pies, deshacer el camino hecho, y Sunday lo pedía en el tabernáculo con la misma urgencia con que pedía la primera conversión.'
    ],
    q: [
      'Nadie se cae de una iglesia de golpe: se enfría, se enfría y se enfría, hasta que el fuego se apaga sin haber hecho ruido.'
    ]
  },
  {
    a: 'sunday',
    t: 'La segunda venida de Cristo',
    y: 1912,
    p: 'Estados Unidos (estilo fiel de su evangelismo, predicado en el cierre de campañas)',
    o: 'En su evangelismo, Sunday usaba la segunda venida no como curiosidad de cronología sino como palanca de urgencia: si el Dueño vuelve, el empleado está en la puerta con las cuentas listas. El sermón es fiel a su manera de golpear la eternidad contra el reloj.',
    x: 'Hechos 1:11 — "varones galileos, ¿por qué estáis mirando al cielo? Este mismo Jesús, que ha sido tomado de vosotros al cielo, vendrá del mismo modo que le habéis visto subir."',
    th: ['Muerte y eternidad', 'Firma y certeza', 'Evangelismo'],
    ol: [
      'El ángel no dice que vendrá otro: dice que vendrá este mismo Jesús, y la fe no descansa en un calendario sino en un cuerpo que los cielos recibieron y devolverán.',
      'La segunda venida no es un tema de congresos: es la palabra que ordena la bolsa del pecador hoy, porque nadie negocia con la eternidad si cree que el Juez está a la vuelta de la esquina.',
      'Sunday corta la curiosidad profética de raíz: la pregunta no es cuándo sino quién, porque el que está listo no necesita fechas y el que no lo está no las soportaría.'
    ],
    q: [
      'El que vive listo para la venida de Cristo no tiene tiempo de desperdiciar la vida en cosas que no la valen.'
    ]
  },
  {
    a: 'sunday',
    t: 'Sembrar y cosechar',
    y: 1913,
    p: 'Estados Unidos (sermón impreso de sus campañas, recogido en su colección)',
    o: 'Sermón impreso de su colección, con el ritmo agropecuario queSunday sabía usar con audiencias de pueblo y de ciudad: la ley de la siembra no negocia, y el sermón camina por el surco mostrando cada semilla del pecado que termina en su cosecha.',
    x: 'Gálatas 6:7 — "no os engañéis; Dios no puede ser burlado: pues todo lo que el hombre sembrare, eso también segará."',
    th: ['Arrepentimiento', 'Crisis y prueba'],
    ol: [
      'Nadie siembra cardos y espera trigo: la ley de la cosecha es la única legislación que el hombre no puede apelar, porque Dios no se burla y el suelo no olvida.',
      'El engaño del pecador es sembrar a plazos: piensa cosechar después y alegrarse ahora, pero la parcela no firma contratos y devuelve lo que recibió con intereses.',
      'La cosecha del Espíritu obedece la misma ley en positivo: el que siembra bien en el alma ajena segará vida eterna, y Sunday predicaba ambas caras de la ley con la misma pala.'
    ],
    q: [
      'Siembras una noche de placer y cosechas años de arrepentimiento: la tierra nunca se equivoca de recibo.'
    ]
  },
  {
    a: 'sunday',
    t: 'El hogar cristiano',
    y: 1915,
    p: 'Estados Unidos (estilo fiel de su evangelismo doméstico, predicado en campañas)',
    o: 'En su evangelismo doméstico, Sunday atacaba los hogares divididos con la misma descarga con que atacaba el salón: el estilo fiel de sus llamadas a las familias es un asedio contra la ambivalencia, apurando la decisión de una casa entera de una sola vez.',
    x: 'Josué 24:15 — "pero yo y mi casa serviremos a Jehová."',
    th: ['Santidad', 'Anhelos humanos', 'Firma y certeza'],
    ol: [
      'Josué no pregunta a la asamblea qué opinan los demás: firma primero, y su decisión pone el termómetro de la casa aunque el resto titubee con los dioses de allá alrededor.',
      'El hogar cristiano no es una casa con una Biblia en la mesa: es una casa donde alguien decidió por la familia y sostiene la decisión cuando el trabajo, la deuda y la costumbre la ponen a prueba.',
      'Sunday empujaba al cabeza de familia a romper la paridad: una casa servida a medias entre Dios y el mundo no es un compromiso, es una fuga por etapas.'
    ],
    q: [
      'Mejor una casa entera a ras de suelo con Dios que un palacio de dos pisos con el diablo en la planta baja.'
    ]
  },
  {
    a: 'sunday',
    t: 'El joven que cree en sí mismo',
    y: 1914,
    p: 'Estados Unidos (estilo fiel de sus llamadas a la juventud, predicado en campañas de tabernáculo)',
    o: 'Sunday, ex deportista profesional, hablaba a los jóvenes como un veterano del vestuario: el estilo fiel de sus llamadas a la juventud convierte la confianza en sí mismo en un reto espiritual, con la franqueza que los jóvenes escuchaban de nadie más.',
    x: '1 Timoteo 4:12 — "Ninguno tenga en poco tu juventud; sé modelo de los fieles en la palabra, en conducta, en amor, en espíritu, en fe, en pureza."',
    th: ['Santidad', 'Anhelos humanos'],
    ol: [
      'Creen en sí mismos, les decía, pero la confianza sin dirección termina en el zaguán de cualquier pasión: el ídolo del instante desmonta la carrera antes del segundo tiempo.',
      'El apóstol no le dice al joven que espere a ser mayor: le dice que sea modelo ahora, y Sunday traducía esa orden a la vida del estadio, del taller y del escritorio.',
      'La juventud no es un préstamo: es el capital inicial de toda la vida, y el joven que lo invierte en Dios no llega a la madurez quebrado y pidiendo un rescate.'
    ],
    q: [
      'Confía en ti mismo si quieres, pero recuerda que el hombre que no cree en nadie termina creyendo en cualquiera.'
    ]
  },
  {
    a: 'sunday',
    t: 'La oración que abre el tabernáculo',
    y: 1916,
    p: 'Estados Unidos (estilo fiel de su evangelismo, predicado en los comienzos de campaña)',
    o: 'Antes de cada campaña, Sunday y sus colaboradores levantaban semanas de oración previa, y el estilo fiel de su evangelismo condensa esa práctica en un sermón: el tabernáculo de madera se abre primero en el cuarto de oración y después con el martillo.',
    x: 'Santiago 5:16 — "La oración eficaz del justo puede mucho."',
    th: ['Oración', 'Poder sobrenatural'],
    ol: [
      'La oración eficaz no es discurso largo: es justo que habla claro, con la boca limpia y el pedido concreto, y por eso puede mucho donde la elocuencia no mueve una silla.',
      'El tabernáculo se levanta con clavos pero se abre con oración: Sunday atribuía a las semanas previas de petición las multitudes que después llenaban el recinto.',
      'El avivamiento no baja de la tarima sino del cielo: los que oran antes de la campaña cosechan después, y los que no oran solo recogen lo que la carne fabrica.'
    ],
    q: [
      'El diablo ríe de nuestros planes y tiembla cuando el justo se pone de rodillas.'
    ]
  },
  {
    a: 'sunday',
    t: 'El final de la carrera',
    y: 1920,
    p: 'Estados Unidos (estilo fiel de sus predicaciones de madurez y despedida, en sus últimos años de campañas)',
    o: 'En el tramo final de su carrera, cuando el cuerpo ya no podía saltar como en los primeros tabernáculos, el estilo fiel de sus predicaciones de madurez mira hacia atrás desde el atleta veterano: la despedida de un hombre que corrió en público y no quería descalificarse al final.',
    x: '2 Timoteo 4:7 — "He peleado la buena batalla, he acabado la carrera, he guardado la fe."',
    th: ['Firma y certeza', 'Muerte y eternidad', 'Crisis y prueba'],
    ol: [
      'El veterano no cuenta los aplausos de la pista: cuenta las vueltas completas, y las tres frases del versículo son el inventario de un hombre que no abandonó ningún tramo de su prueba.',
      'La corona no se gana en la salida: se gana en el último tramo, cuando las piernas pesan y el estadio ya no grita, y ahí es donde la fe se distingue del entusiasmo.',
      'Sunday cerraba mirando al banco de los jueces: el Señor justo premia, y esa sentencia futura era para él la única auditoría que valía la pena preparar desde hoy.'
    ],
    q: [
      'No importa cómo entraste a la pista: importa cómo sales, porque la corona se entrega en la meta y no en el vestuario.'
    ]
  },
{
    a: 'king',
    t: 'La muerte del mal en la playa',
    y: 1957,
    p: 'Dexter Avenue Baptist Church, Montgomery (púlpito dominical; King Papers, Stanford)',
    o: 'Un año después del boicot, la congregación necesitaba un lenguaje para lo vivido sin llamarlo triunfo humano. King sostiene que lo que Israel vio en la orilla no fue la caída de un ejército ante otro, sino del mal ante el juicio de Dios. La escena del mar despejado ordena mirar atrás una sola vez y luego caminar.',
    x: 'Éxodo 14:30 — "Y salvó Jehová a Israel aquel día de mano de los egipcios; e Israel vio a los egipcios muertos a la orilla del mar."',
    th: ['Crisis y prueba', 'Poder sobrenatural'],
    ol: [
      'El éxodo enseña que hay madrugadas en las que el pueblo cruza el agua mientras la historia lo persigue, y la fe consiste en avanzar aunque el carro del opresor aún suene en la orilla contraria.',
      'Israel miró los cuerpos en la playa y no celebró la ruina ajena: entendió que el mismo mar que se abrió para salvar se cerró para juzgar, y guardó silencio antes que canto.',
      'Ninguna discriminación dura para siempre, porque el mal que se alza contra la justicia queda finalmente tendido en la costa, y el pueblo liberado debe escribir esa memoria para las generaciones.',
    ],
    q: [
      'El mar que se abre para un pueblo se cierra contra el mal: la playa de la historia guarda siempre ese doble testimonio.',
      'No festejamos la caída del opresor, celebramos que Dios es fiel a su promesa cuando la noche parece no terminar.',
    ],
    i: 'Predicado en pleno rebrote del Klan en Montgomery, dio a la comunidad del boicot una teología del fin del mal. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: '¿Qué es el hombre?',
    y: 1959,
    p: 'Ebenezer Baptist Church, Atlanta (sermón dominical; King Papers, Stanford)',
    o: 'King toma la pregunta del salmista para confrontar una época que mide al hombre por producción y poder. El sermón recorre la doble condición humana, de barro y de corona, para terminar en adoración. Fue el núcleo antropológico de su obra publicada más tarde.',
    x: 'Salmo 8:4 — "¿Qué es el hombre, para que tengas de él memoria? ¿Y el hijo del hombre, para que lo visites?"',
    th: ['Anhelos humanos', 'Muerte y eternidad'],
    ol: [
      'El salmista mide al hombre entre el polvo y la corona: menor que los cielos en talla, mayor que ellos en destino, y esa doble medida desarma toda antropología que solo cuenta células.',
      'Una civilización que domina la naturaleza y todavía no domina su corazón responde a esta pregunta con máquinas cada vez mayores y respuestas cada vez más pequeñas.',
      'La grandeza del hombre no está en lo que produce sino en que Dios lo visita, y por eso la pregunta del salmo termina en adoración y no en inventario.',
    ],
    q: [
      'El hombre es una paradoja de polvo y gloria: quien olvida el polvo hace tiranos, quien olvida la gloria hace esclavos.',
    ],
    i: 'Versión central de su antropología publicada después en Strength to Love. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'Sueños rotos',
    y: 1961,
    p: 'Ebenezer Baptist Church, Atlanta (sermón dominical; King Papers, Stanford)',
    o: 'Casi todo el mundo carga una esperanza que murió antes de nacer, y el púlpito suele mentir prometiendo que la fe la resucita entera. King predica que Dios no repara el sueño de modo automático, pero sí al quebrantado. La consolación creyente es otra cosa: un rediseño de gracia.',
    x: 'Salmo 34:18 — "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu."',
    th: ['Anhelos humanos', 'Gracia'],
    ol: [
      'Los sueños rotos no son accidentes del camino creyente sino su terreno ordinario, y la Escritura nunca prometió un itinerario sin escombros a quienes caminan con Dios.',
      'El salmo no dice que Dios cercano consuele a los triunfadores, dice que se inclina sobre los quebrantados, y esa cercanía es la única terapia que no requiere disfraz.',
      'La gracia no siempre devuelve el sueño pedido: a veces lo sustituye por un propósito mayor que el soñador jamás habría elegido, y solo después se reconoce como mejor.',
    ],
    q: [
      'La gracia no siempre entrega el sueño que pedimos; suele entregar uno que no sabíamos necesitar.',
    ],
    i: 'Recogido en Strength to Love como médula de su consolación pastoral. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'El hombre que fue un necio',
    y: 1959,
    p: 'Ebenezer Baptist Church, Atlanta (sermón dominical; King Papers, Stanford)',
    o: 'King desarma el retrato del rico insensato negando que su pecado fuera la codicia cruel: fue el éxito sin ventanas. La parábola de Jesús le sirve para desenmascarar una cultura que acumula graneros y vacía almas. La medianoche funciona en el sermón como auditorio que iguala todas las cuentas.',
    x: 'Lucas 12:20 — "Necio, esta noche vienen a pedirte tu alma; y lo que has preparado, ¿de quién será?"',
    th: ['Idolatría del corazón', 'Muerte y eternidad'],
    ol: [
      'El rico del granero no era un villano: era exitoso, y su ruina fue construir una vida sin ventanas hacia Dios y sin puertas hacia el hermano.',
      'Se puede llenar el granero y vaciar el alma, porque la escala del bienestar material no sabe medir el bien interior que sostiene a una persona cuando el censo termina.',
      'La medianoche iguala todas las cuentas bancarias, y por eso el necio no fracasó por almacenar sino por olvidar que el alma no entra en el inventario.',
    ],
    q: [
      'El necio no amó demasiado el dinero: amó demasiado poco lo que el dinero no puede comprar.',
      'Rico para sí y pobre para Dios es la única bancarrota que no avisa.',
    ],
    i: 'Pieza de su crítica moral a la afluencia americana, incluida luego en su obra publicada. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'Un golpe a medianoche',
    y: 1957,
    p: 'Dexter Avenue Baptist Church, Montgomery (King Papers, Stanford)',
    o: 'King describe la medianoche como hora de la civilización: sociedades que fabrican abundancia material y se quedan sin el pan del evangelio. La parábola del amigo importuno le sirve para defender una oración insistente y pública. El sermón interpela tanto a la iglesia cómoda como al vecindario desesperado.',
    x: 'Lucas 11:8 — "Os digo: aunque no se levante a darle por ser su amigo, por su importunidad se levantará, y le dará todo lo que necesite."',
    th: ['Oración', 'Crisis y prueba'],
    ol: [
      'La parábola de Jesús no retrata a un Dios dormido que hay que despertar, sino a un Padre que se complace en la persistencia de los que claman sin vergüenza.',
      'La medianoche de una civilización no es la falta de electricidad sino la falta de pan espiritual: avances técnicos sobre un suelo vaciado de sentido y de misericordia.',
      'El que golpea a medianoche confiesa dos cosas a la vez, que la casa ajena tiene lo que él no posee y que no piensa irse hasta recibirlo.',
    ],
    q: [
      'La oración que golpea a medianoche no convence a Dios de dar el pan: convence al que ora de que sin ese pan no hay mañana.',
    ],
    i: 'Sermón de su catálogo montgomeryiano sobre la oración y la urgencia social. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'Las tres dimensiones de una vida completa',
    y: 1959,
    p: 'Ebenezer Baptist Church, Atlanta (versiones predicadas entre 1959 y 1967; King Papers, Stanford)',
    o: 'King repite durante años su tesis de la vida en tres medidas: largo, ancho y alto. El largo persigue un objetivo digno, el ancho se abre al amor del prójimo y el alto descansa en Dios. El sermón une su ética social con su devoción sin separarlas jamás.',
    x: 'Eclesiastés 4:12 — "Y si alguien prevalece contra uno, dos le resisten; y cordón de tres dobleces no se rompe pronto."',
    th: ['Anhelos humanos', 'Santidad'],
    ol: [
      'La vida completa tiene una longitud que persigue un objetivo digno, una anchura que se abre al amor de los hermanos y una altura que se apoya en Dios, y ninguna de las tres sobra.',
      'Quien cultiva solo el largo produce eficiencia sin compasión, y quien cultiva solo el ancho produce cariño sin brújula: el cordón necesita los tres hilos tensados a la vez.',
      'En la ciudad cúbica de Juan el largo, el ancho y el alto se miden iguales, señal de que una vida madura ya no jerarquiza a Dios y al prójimo, sino que los entrelaza.',
    ],
    q: [
      'Una vida que solo se mide en largo termina atascada; la altura no es lujo espiritual, es el tercer hilo sin el cual todo se rompe.',
    ],
    i: 'Su sermón más repetido en décadas de púlpito, piedra angular de su ética integral. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'La mente fuerte y el corazón tierno',
    y: 1959,
    p: 'Ebenezer Baptist Church, Atlanta (King Papers, Stanford)',
    o: 'King diagnostica una época que divide a la gente entre duros sin compasión y blandos sin criterio. El mandato de Jesús sobre serpientes y palomas le ofrece la síntesis: fortaleza de juicio y suavidad de trato. El sermón funda su ética de la resistencia no violenta.',
    x: 'Mateo 10:16 — "He aquí yo os envío como a ovejas en medio de lobos; sed, pues, prudentes como las serpientes, y sencillos como las palomas."',
    th: ['Santidad', 'Crisis y prueba'],
    ol: [
      'La fe madura no elige entre ser dura o ser mansa: reúne la mente que analiza sin miedo y el corazón que no sabe despreciar, aunque el mundo los separe en castas.',
      'El ingenuo sin firmeza es presa fácil del engaño, y el cínico sin ternura convierte toda relación en transacción: Jesús manda cultivar las dos alas del mismo pájaro.',
      'La resistencia no violenta nace de esta síntesis, porque exige la dureza de no ceder al mal y la mansedumbre de no devolverlo con la misma moneda.',
    ],
    q: [
      'Ni la paloma sola ni la serpiente sola sobreviven: la madurez cristiana es fortaleza que no endurece y ternura que no se rinde.',
    ],
    i: 'Base doctrinal de su noviolencia, recogida después en Strength to Love. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'Redefiniendo los valores perdidos',
    y: 1954,
    p: 'Second Baptist Church, Detroit (gira juvenil del Norte; King Papers, Stanford)',
    o: 'En uno de sus primeros sermones del Norte, King compara una civilización de instrumentos perfectos con una brújula moral rota. El texto del Señor sobre buscar primero el Reino ordena la crítica: no es falta de riqueza, es desorden de prioridades. El púlpito acusa a la nación antes que consolarla.',
    x: 'Mateo 6:33 — "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas serán añadidas."',
    th: ['Idolatría del corazón', 'Santidad'],
    ol: [
      'La civilización ha ganado en instrumentos lo que pierde en brújula: sabemos más de bombas que de justicia y medimos con precisión lo que vale menos.',
      'Perder los valores no es olvidar ideales abstractos, es ordenar la vida al revés, buscando primero las cosas que se añaden y dejando para después el Reino.',
      'El orden del Reino no desprecia el pan: lo coloca donde recibe bendición, después y no antes de la justicia de Dios.',
    ],
    q: [
      'Una nación puede producir riquezas y cultura y seguir en quiebra moral: el orden de las prioridades es el verdadero inventario.',
    ],
    i: 'Sermón temprano que ya contiene la crítica cultural de toda su carrera posterior. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'La carta de Pablo a los cristianos americanos',
    y: 1956,
    p: 'Dexter Avenue Baptist Church, Montgomery (sermón epistolar leído luego en giras; King Papers, Stanford)',
    o: 'Con la ficción literaria de una carta apostólica dirigida a la iglesia de su país, King pone a Pablo escribiendo desde la cárcel romana al siglo veinte americano. La cortesía del tono acentúa la ironía del reproche. El dispositivo le permite a la Escritura interrogar a la cultura sin mediador.',
    x: 'Efesios 4:14 — "para que ya no seamos niños fluctuantes, llevados por doquiera de todo viento de doctrina."',
    th: ['Santidad', 'Crisis y prueba'],
    ol: [
      'La carta elogia el genio científico del destinatario y a la vez le pregunta qué ha hecho por su alma, porque un instrumento perfecto en manos de un corazón torcido agranda la ruina.',
      'La madurez que pide Pablo no es acumulación de saber sino firmeza de raíces: árboles de fe que no se doblan ante cada viento cultural que pasa.',
      'El sermón demuestra que la Escritura no necesita ser actualizada para hablar al presente, basta dejarla firmar la carta con su propia mano.',
    ],
    q: [
      'El genio sin carácter es un cohete sin brújula: llega más lejos y cae en peor lugar.',
    ],
    i: 'Pieza inventiva de su oratoria, difundida después en sus giras y publicada en sus antologías. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'king',
    t: 'El sueño americano',
    y: 1961,
    p: 'Ebenezer Baptist Church, Atlanta (King Papers, Stanford)',
    o: 'Años antes del mitin de la capital, King ya predicaba el sueño como teología y no como política. La promesa americana solo es honesta si arranca del Creador que hizo de un mismo origen a todos los hombres. El sermón une el evangelio de la imagen de Dios con la crítica a la segregación.',
    x: 'Gálatas 3:28 — "no hay judío ni griego; no hay esclavo ni libre; no hay varón ni hembra; porque todos vosotros sois uno en Cristo Jesús."',
    th: ['Crisis y prueba', 'Anhelos humanos'],
    ol: [
      'King distingue entre un sueño de privilegios y un sueño de fundamento: la promesa del país solo es honesta cuando se apoya en el Creador que hizo de un origen común a todos los hombres.',
      'La igualdad que defiende no es una moda del siglo sino una convicción bíblica sobre la imagen de Dios, y por eso no se negocia en cada elección ni se mide en encuestas.',
      'Un credo proclamado y no encarnado agrava la desilusión de los que lo esperan, y por eso el sueño exige tribunales y corazones, leyes y madrugadas de oración.',
    ],
    q: [
      'Una democracia que declara la igualdad y la niega en la vereda no necesita más consignas: necesita convertirse.',
    ],
    i: 'Versión púlpito de la tesis que luego maduró en su discurso de 1963. © King Estate vía IPM; transcripción académica en kinginstitute.stanford.edu (solo con fines de estudio).',
  },
  {
    a: 'washer',
    t: 'Un sermón que ha enojado a muchos',
    y: 2006,
    p: 'Grabación de conferencia, SermonAudio (verificado)',
    o: 'Nace de la constatación de que miles de profesiones de fe no sobreviven la primera prueba real. Washer pide detener el evangelismo de decisiones y volver a la pregunta de Pablo: está usted en la fe o solo está en la lista. El enojo del título es la reacción esperada del corazón no examinado.',
    x: '2 Corintios 13:5 — "Examinaos a vosotros mismos si estáis en la fe; probaos a vosotros mismos. ¿O no os conocéis a vosotros mismos, que Jesucristo está en vosotros?"',
    th: ['Firma y certeza', 'Arrepentimiento'],
    ol: [
      'La Escritura no manda examinar la fecha en que firmaste una tarjeta sino la vida que hoy produce evidencia de la presencia de Cristo.',
      'El miedo a inquietar a los falsamente seguros ha producido multitudes tranquilas camino al juicio, y ese silencio pastoral es el mayor acto de odio espiritual.',
      'Un examen honesto no desangra la fe verdadera: la fortalece, porque la certeza que no puede pasar una prueba no era certeza, era costumbre.',
    ],
    q: [
      'Es más amable asustar hoy a un falso convertido que dejarlo dormir hasta el juicio.',
      'La salvación no es una decisión que tomaste una tarde: es una obra que Dios está haciendo y que se nota.',
    ],
    i: 'Sermón repetido y discutido en círculos bautistas del sur de Estados Unidos; inclinó a muchos ministros hacia el examen personal antes del llamado público.',
  },
  {
    a: 'washer',
    t: 'La soberanía de Dios en la salvación',
    y: 2010,
    p: 'Grabación de SermonAudio (estilo fiel de su enseñanza teológica; año aproximado)',
    o: 'Washer parte de la palabra pequeña del texto, nadie, para desmontar siglos de autoconfianza religiosa. Antes de preguntar si el hombre quiere venir, el evangelio afirma que no puede. La atracción del Padre se predica como obra regeneradora y no como gesto decorativo.',
    x: 'Juan 6:44 — "Nadie puede venir a mí, si el Padre que me envió no le trajere; y yo le resucitaré en el día postrero."',
    th: ['Gracia', 'Firma y certeza'],
    ol: [
      'Antes de preguntar si el hombre quiere venir, el texto afirma que nadie puede, y esa palabra pequeña desmonta siglos de autoconfianza religiosa.',
      'La atracción del Padre no es un empujón externo sino una obra que abre ojos y oídos cautivos, y mueve la voluntad muerta a abrazar al Hijo de corazón entero.',
      'Quien entiende que su venida a Cristo fue tramada y ejecutada por Dios deja de presumir su decisión y comienza a adorar la misericordia que la produjo.',
    ],
    q: [
      'El hombre no pierde la salvación por falta de información: la rechaza por falta de voluntad, y por eso hace falta que Dios la vuelva hacia sí.',
    ],
    i: 'Núcleo de su enseñanza teológica repetida en conferencias de todo el mundo hispano.',
  },
  {
    a: 'washer',
    t: 'El evangelio al desnudo',
    y: 2008,
    p: 'Grabación de SermonAudio (estilo fiel de su colección; año aproximado)',
    o: 'Washer defiende un evangelio con contenido verificable y no con atractivos: muerto, sepultado y resucitado según las Escrituras. Su diagnóstico es que la Iglesia moderna ha decorado el mensaje hasta disimular el escándalo. La predicación vuelve a la fórmula de Pablo como fundamento inamovible.',
    x: '1 Corintios 15:3-4 — "Cristo murió por nuestros pecados, conforme a las Escrituras; y que fue sepultado, y que resucitó al tercer día, conforme a las Escrituras."',
    th: ['Evangelismo', 'Gracia'],
    ol: [
      'El evangelio que predicó Pablo no dependía de técnicas ni de atracciones: era un mensaje con contenido verificable, muerto, sepultado y resucitado conforme a las Escrituras.',
      'Cada palabra sobra si se quita la sustitución, porque un Cristo que solo enseña y no paga deja al hombre en la misma condena, solo que con mejores ejemplos.',
      'La Iglesia no necesita modernizar el mensaje sino volver a decirlo entero, aunque el mundo lo llame irrelevante y la religión lo llame escandaloso.',
    ],
    q: [
      'Si el evangelio que predicas no ofende al orgulloso y no consuela al quebrado, probablemente no es el evangelio.',
    ],
    i: 'Resumen habitual de su defensa pública del mensaje evangélico frente a versiones terapéuticas.',
  },
  {
    a: 'washer',
    t: 'La iglesia que Dios quiere',
    y: 2012,
    p: 'Grabación de SermonAudio (estilo fiel de su crítica a la iglesia del entretenimiento; año aproximado)',
    o: 'Washer contrapone la iglesia que Cristo edifica con la que el mercado diseña. Su pregunta incisiva es si nuestra asamblea sobreviviría sin el aparato de entretenimiento que la sostiene. La promesa de Cristo sobre las puertas del infierno delimita qué obra merece el nombre de iglesia.',
    x: 'Mateo 16:18 — "que tú eres Pedro, y sobre esta roca edificaré mi iglesia; y las puertas del infierno no prevalecerán contra ella."',
    th: ['Poder sobrenatural', 'Santidad'],
    ol: [
      'La iglesia pertenece a Cristo, se edifica sobre su confesión y sobrevive al infierno: todo lo demás que la cultura enseña sobre cómo hacer iglesia es decoración.',
      'Cuando la asamblea se convierte en mercado de entretenimiento gana multitudes y pierde poder, porque lo que atrae por la carne solo se sostiene con carne.',
      'La promesa de Cristo no garantiza nuestros programas sino su obra: él construye, él sostiene y él purifica a la esposa que se le entregó.',
    ],
    q: [
      'Una iglesia que ya no necesita del Espíritu para llenarse ha dejado de ser la iglesia que Cristo edifica.',
    ],
    i: 'Mote de su crítica repetida al evangelismo centrado en el consumidor.',
  },
  {
    a: 'washer',
    t: 'La oración de la medianoche',
    y: 2011,
    p: 'Grabación de SermonAudio (estilo fiel de su enseñanza sobre la oración misionera; año aproximado)',
    o: 'Washer usa la viuda insistente para confrontar una iglesia que organiza más de lo que clama. Su pregunta final es si el Señor, al volver, encontrará gente que ore como si Dios fuera real. La oración aparece como obra misionera antes que como hábito devocional.',
    x: 'Lucas 18:7 — "¿Y acaso Dios no hará justicia a sus escogidos, que claman a él día y noche?"',
    th: ['Oración', 'Crisis y prueba'],
    ol: [
      'La viuda insistente no tenía méritos ni influencia, y su única riqueza era la terquedad de volver cada día al juez que la despreciaba.',
      'Si un juez injusto cede ante la persistencia, cuánto más el Padre justo ante los clamores de sus escogidos: la parábola compara para contrastar, no para igualar.',
      'La pregunta final de Jesús sigue pesando: cuando vuelva, ¿hallará en su iglesia gente que ora como si Dios fuera real, o gente que solo organiza como si no existiese?',
    ],
    q: [
      'El cielo no responde a la necesidad que no sabe clamar: Dios espera de su iglesia más que proyectos, espera gemidos.',
    ],
    i: 'Eje de su enseñanza misionera en HeartCry, donde la oración precede a la estrategia.',
  },
  {
    a: 'washer',
    t: 'El precio de seguir a Cristo',
    y: 2009,
    p: 'Grabación de SermonAudio (estilo fiel de su colección; año aproximado)',
    o: 'Washer denuncia el discipulado de letra pequeña que promete vida eterna sin cruz. Jesús, dice, jamás engañó a los voluntarios: habló de torres que se calculan y ejércitos que se pesan. La renuncia total se predica como puerta de entrada, no como optativa para avanzados.',
    x: 'Lucas 14:33 — "Así, pues, cualquiera de vosotros que no renuncia a todas las cosas que posee, no puede ser mi discípulo."',
    th: ['Arrepentimiento', 'Anhelos humanos'],
    ol: [
      'Jesús no engaña con letra pequeña: habla de cargar la cruz, de calcular la torre y de pesar el ejército, para que nadie se convierta por entusiasmo publicitario.',
      'El discipulado no es añadir Jesús a una vida ya llena, es demoler el reino propio para edificar sobre la voluntad de otro Rey.',
      'Renunciarlo todo no empobrece: descubre que la posesión más peligrosa era el yo, y que fuera de sus manos todo lo demás recobra su lugar.',
    ],
    q: [
      'Cristo no viene a completar tu vida, viene a comprarla entera; y el que regatea una habitación no le ha dado nada.',
    ],
    i: 'Tema recurrente de sus conferencias contra el evangelismo de beneficios.',
  },
  {
    a: 'washer',
    t: 'La ceguera del corazón religioso',
    y: 2013,
    p: 'Grabación de SermonAudio (estilo fiel de su colección; año aproximado)',
    o: 'Washer sostiene que la religión puede ser la forma más refinada de huir de Dios: culto puntual y doctrina correcta sobre un corazón ausente. La palabra de Jesús a los fariseos le sirve de espejo para la iglesia actual. El mensaje termina en petición de cirugía, no de técnica.',
    x: 'Mateo 15:8 — "Este pueblo de labios me honra; mas su corazón está lejos de mí."',
    th: ['Idolatría del corazón', 'Arrepentimiento'],
    ol: [
      'La religión puede llegar a ser la forma más refinada de huir de Dios: culto puntual, doctrina correcta y un corazón que ama otra cosa.',
      'El peligro no está en las prácticas sino en la sustitución, porque el corazón que no adora a Dios no queda vacío: siempre halla un ídolo menor que entronizar.',
      'La obra del Espíritu no empieza enseñando vocabulario nuevo sino abriendo el pecho, para que el hombre vea la distancia real entre sus labios y su afecto.',
    ],
    q: [
      'Un culto puede estar lleno mientras el corazón está ausente: Dios no mide decibeles, mide distancia.',
    ],
    i: 'Diagnóstico habitual de sus mensajes sobre la religiosidad vacía en América Latina y Estados Unidos.',
  },
  {
    a: 'washer',
    t: 'El amor que describe a Dios',
    y: 2010,
    p: 'Grabación de SermonAudio (estilo fiel de su cristología; año aproximado)',
    o: 'Washer define el amor divino contra el sentimentalismo: un amor que decide pagar y no un sentimiento que descubre mérito. El tiempo elegido por Dios, cuando éramos pecadores, es la prueba. De ahí saca la seguridad del creyente y su obligación de amar así.',
    x: 'Romanos 5:8 — "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros."',
    th: ['Gracia', 'Evangelismo'],
    ol: [
      'El amor de Dios no es un sentimiento que descubre mérito: es una decisión que lo paga, y el texto lo demuestra con el tiempo elegido, cuando éramos enemigos.',
      'Predicar un amor que solo satisface al egoísta es predicar otro dios: el amor del evangelio es santo, y por eso costó sangre y no solo lágrimas.',
      'La seguridad del creyente no se apoya en sus caídas menos frecuentes, sino en que el amor que lo alcanzó actuó cuando en él no había nada que amar.',
    ],
    q: [
      'Dios no esperó a que fuéramos amables para amarnos; si lo hubiera hecho, todavía estaría esperando.',
    ],
    i: 'Base de su cristología pastoral, repetida en sus escritos de HeartCry.',
  },
  {
    a: 'washer',
    t: 'El poder para vivir como Dios manda',
    y: 2014,
    p: 'Grabación de SermonAudio (estilo fiel de su enseñanza del Espíritu; año aproximado)',
    o: 'Washer ataca la versión de la vida cristiana que depende de fuerza de voluntad. Su tesis es que el mandato de andar en el Espíritu describe una morada continua y no un impulso ocasional. La santificación aparece como guerra sostenida por poder ajeno al propio.',
    x: 'Gálatas 5:16 — "Andad en el Espíritu, y no satisfagáis la concupiscencia de la carne."',
    th: ['Poder sobrenatural', 'Santidad'],
    ol: [
      'El mandato cristiano no se cumple con voluntad reforzada sino con un andar continuo: la morada del Espíritu desmonta paso a paso los caminos de la carne.',
      'La santificación no es perfección instantánea sino guerra sostenida, y el que deja de pelear por cansancio confiesa que camina en la carne aunque predique del Espíritu.',
      'El fruto no lo fabrica el creyente: lo produce el Espíritu en la rama que permanece, y por eso la vida cristiana es mandato y dependencia al mismo tiempo.',
    ],
    q: [
      'La carne no se reforma, se crucifica; y la cruz no es un sentimiento, es una decisión diaria.',
    ],
    i: 'Resumen de su enseñanza sobre la santificación en los retiros de pastores de HeartCry.',
  },
  {
    a: 'washer',
    t: 'La misión: el corazón de Dios por las naciones',
    y: 2015,
    p: 'Grabación de SermonAudio (estilo fiel de HeartCry; año aproximado)',
    o: 'Washer sitúa la misión en el trono antes que en el comité: el Cordero fue inmolado por gentes de toda lengua y eso define a la iglesia. Su crítica es a la cristiandad que adora a un Salvador cuyo propósito no le interesa. El llamado es a la obediencia, no al heroísmo.',
    x: 'Apocalipsis 5:9 — "porque fuiste inmolado, y con tu sangre nos redimiste para Dios, de todo linaje y lengua y pueblo y nación."',
    th: ['Evangelismo', 'Adoración'],
    ol: [
      'En el trono del cielo la misión no es un departamento de la iglesia, sino la razón por la cual el Cordero fue inmolado y recibe el cántico de las multitudes.',
      'El misionero no es un héroe voluntarioso sino un pecador obediente enviado por un Dios que compró gentes de toda lengua con el mismo precio de sangre.',
      'Si el corazón de la iglesia no late por las naciones, su liturgia es incompleta, porque adora a un Cordero cuyo propósito alcanzó más allá de sus fronteras.',
    ],
    q: [
      'La misión no es la obra de los apasionados: es la sangre del Cordero derramada por pueblos que aún no cantan.',
    ],
    i: 'Visión que articula el ministerio internacional de HeartCry Missionary Society.',
  },
  {
    a: 'sproul',
    t: 'La providencia de Dios',
    y: 1999,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su biblioteca; año aproximado)',
    o: 'Sproul toma el versículo para enseñar que la providencia no es un consuelo vago sino una doctrina con gramática exacta. Todas las cosas, dice, no algunas, y el bien definido por el propósito del que llama. La serie entera gira en torno al gobierno silencioso de Dios sobre la historia.',
    x: 'Romanos 8:28 — "sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme al propósito de Dios son llamados."',
    th: ['Firma y certeza', 'Crisis y prueba'],
    ol: [
      'La providencia no es un consuelo vago sino una doctrina con gramática: todas las cosas, no algunas, y ayudan a bien según el propósito del que llama, no según nuestro calendario.',
      'Entre la oración y la respuesta gobierna un Dios que no improvisa, y su cadena de gobierno sostiene desde los eclipses hasta las lágrimas de los suyos.',
      'La certeza del cristiano no descansa en que las cosas salgan bien, sino en que nada sale suelto del gobierno del Padre.',
    ],
    q: [
      'Dios no causa el mal, pero tampoco lo deja cabalgar sin rienda: la providencia es el gobierno silencioso que convierte hasta la ruina en siervo.',
    ],
    i: 'Serie clásica de Ligonier, reeditada durante décadas como curso de doctrina para laicos.',
  },
  {
    a: 'sproul',
    t: 'La voluntad de Dios',
    y: 2000,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su serie sobre la voluntad; año aproximado)',
    o: 'Sproul diagnostica que la pregunta por la voluntad de Dios suele buscar un mapa secreto del futuro. La Escritura ya entregó el punto de partida, y es la santificación. Su triple clasificación de la voluntad libera al creyente del ansia de adivinar.',
    x: '1 Tesalonicenses 4:3 — "pues la voluntad de Dios es vuestra santificación; que os apartéis de fornicación."',
    th: ['Santidad', 'Firma y certeza'],
    ol: [
      'La pregunta por la voluntad de Dios suele buscar un mapa secreto del futuro cuando la Escritura ya entregó el punto de partida: vuestra santificación.',
      'Sproul distingue entre el decreto que gobierna todo, el precepto que manda y la disposición que desea, y esa triple clasificación libera del ansia de adivinar.',
      'El creyente que busca la voluntad de Dios la halla primero en el dormitorio y en el escritorio, donde la santidad se decide antes que en las señales del cielo.',
    ],
    q: [
      'Muchos piden a Dios una señal para el futuro mientras ignoran el mandato que ya tienen sobre la mesa.',
    ],
    i: 'Curso de Ligonier que ordenó la conversación evangélica sobre decisión y voluntad divina.',
  },
  {
    a: 'sproul',
    t: 'El dilema divino de la cruz',
    y: 2005,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su enseñanza sobre la propiciación; año aproximado)',
    o: 'Sproul plantea el problema moral del universo: cómo absuelve un juez santo a culpables sin manchar el tribunal. La respuesta de la cruz es la propiciación, donde la ira y el amor de Dios se encuentran en el mismo altar. De ahí nace su defensa de la justificación imputada.',
    x: 'Romanos 3:26 — "a fin de ser él el justo, y a la vez el que justifica al que es de la fe de Jesús."',
    th: ['Gracia', 'Santidad'],
    ol: [
      'El problema moral del universo es cómo puede un juez santo absolver culpables sin corromper el tribunal, y la cruz es la única solución que no compra la justicia.',
      'La propiciación no significa que un Padre amable engaña a un Hijo indignado: la Trinidad concuerda en que la ira y el amor se encuentren en el mismo altar.',
      'La justificación declara justo al pecador por un sustituto, y ese verbo forense es el corazón del evangelio que Lutero redescubrió contra toda síntesis barata.',
    ],
    q: [
      'Dios no perdona por decreto arbitrario: perdona porque la cuenta ya se pagó, y por eso es justo y justificador a la vez.',
    ],
    i: 'Cátedra de propiciación que alimentó la formación doctrinal de Ligonier en dos generaciones.',
  },
  {
    a: 'sproul',
    t: 'El Padre nuestro',
    y: 2001,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su serie sobre la oración del Señor; año aproximado)',
    o: 'Sproul recorre la oración del Señor mostrando que su orden es ya una cirugía del corazón. La filiación y la adoración van antes que la lista de peticiones, y el plural disuelve la oración privada como asunto individual. Cada línea reordena el universo del que ora.',
    x: 'Mateo 6:9 — "Vosotros, pues, oraréis así: Padre nuestro que estás en los cielos, santificado sea tu nombre."',
    th: ['Oración', 'Adoración'],
    ol: [
      'La oración que Jesús enseña empieza con la filiación y con la adoración, no con la lista de pedidos, y ese orden es ya una cirugía del corazón.',
      'El nuestro de la primera línea disuelve la oración como asunto privado: se ora en plural, como cuerpo, y por el nombre del Padre antes que por el pan.',
      'Cada petición del padrenuestro reordena el universo del que ora: el Reino primero, el pan después, y el perdón como condición de comunión, no como favor.',
    ],
    q: [
      'Quien empieza a orar pidiendo nunca aprendió a orar: el comienzo del padrenuestro enseña a mirar arriba antes de abrir la mano.',
    ],
    i: 'Serie de Ligonier de uso extendido en escuelas de oración y estudio en grupos.',
  },
  {
    a: 'sproul',
    t: 'La oscuridad en la cruz',
    y: 2009,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su exposición del abandono; año aproximado)',
    o: 'Sproul insiste en que el grito del Gólgota no es un desmayo de fe sino un salmo de fe dicho bajo juicio real. En la cruz ocurrió algo más terrible que un martirio: el Hijo cargó el abandono que los condenados de todos los siglos merecieron. Por eso el creyente jamás grita sin respuesta.',
    x: 'Marcos 15:34 — "Dios mío, Dios mío, ¿por qué me has desamparado?"',
    th: ['Crisis y prueba', 'Gracia'],
    ol: [
      'El grito del Gólgota no es un desmayo de fe sino un salmo de fe: Jesús cita a David mientras carga el abandono que los condenados de todos los siglos merecieron.',
      'En la cruz ocurrió algo más terrible que el martirio: el Hijo conoció el juicio real del Padre contra el pecado que no era suyo.',
      'El desamparo fue momentáneo y redentor, y por eso el que cree jamás gritará ese grito sin respuesta, porque la oscuridad ya fue habitada por otro.',
    ],
    q: [
      'En el centro de la cruz no está el dolor de un mártir, está el juicio de un sustituto; por eso el cristiano jamás es desamparado.',
    ],
    i: 'Su exposición más recordada sobre el sufrimiento expiatorio, repetida en Viernes Santo.',
  },
  {
    a: 'sproul',
    t: 'La perseverancia de los santos',
    y: 2003,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su enseñanza sobre la seguridad; año aproximado)',
    o: 'Sproul defiende la seguridad del creyente como confianza en el carácter de Dios y no como optimismo sobre el propio. Los santos perseveran porque son guardados por el poder que los levantó. La doctrina, bien entendida, produce humildad sostenida y no libertinaje.',
    x: 'Filipenses 1:6 — "el que comenzó en vosotros la buena obra la perfeccionará hasta el día de Jesucristo."',
    th: ['Firma y certeza', 'Gracia'],
    ol: [
      'La seguridad del creyente no es optimismo sobre su carácter sino confianza en el carácter de Dios, que no abandona a medias las obras que comienza.',
      'Los santos perseveran porque son guardados por el poder mismo que los levantó, y esa garantía es obra divina antes que rendimiento humano.',
      'La doctrina no produce libertinaje sino humildad sostenida, porque el que se sabe guardado rinde cuentas con gratitud y no con terror.',
    ],
    q: [
      'La salvación no es una suscripción que se cancela por impago: la pagó entera el Cordero, y por eso nadie la rescinde.',
    ],
    i: 'Docencia central de Ligonier sobre la doctrina de la gracia en su quinto punto reformado.',
  },
  {
    a: 'sproul',
    t: 'La gloria de la Navidad',
    y: 2006,
    p: 'Predicación adventicia de St. Andrew\u2019s Chapel (estilo fiel de sus mensajes de diciembre; año aproximado)',
    o: 'Sproul recuerda que el niño del pesebre es la segunda persona de la Trinidad velada en carne. El cántico de los pastores anuncia paz vertical antes que paz social, porque la Navidad resuelve primero el pleito entre el cielo y la tierra. La celebración verdadera es asombro de encarnación, no nostalgia.',
    x: 'Lucas 2:14 — "¡Gloria a Dios en las alturas, y en la tierra paz, buena voluntad para con los hombres!"',
    th: ['Adoración', 'Gracia'],
    ol: [
      'El cántico de los pastores anuncia paz vertical antes que paz social, porque la Navidad resuelve primero el pleito entre el cielo y la tierra.',
      'El niño del pesebre es la segunda persona de la Trinidad velada en carne, y la gloria no se abolió en Belén, se hospedó entre nosotros.',
      'La verdadera celebración adventicia no es nostalgia de pesebres sino asombro de encarnación: Dios visitó a su pueblo con obras y no con sentimientos.',
    ],
    q: [
      'La Navidad no es que el cielo mirara con ternura la tierra, es que el Verbo bajó a pagar la cuenta que la tierra no podía firmar.',
    ],
    i: 'Predicación anual de Adviento en su cátedra de Sanford, reproducida en las series navideñas de Ligonier.',
  },
  {
    a: 'sproul',
    t: 'El fuego del bautismo del Espíritu',
    y: 2007,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su enseñanza sobre el Espíritu; año aproximado)',
    o: 'Sproul une la promesa de poder al mandato de testimonio: el Espíritu desciende para que la iglesia declare, no para que se admire. Distingue el bautismo de regeneración del llenado repetido, y advierte contra los certificados de élite espiritual. El poder prometido es valentía ordenada para señalar a Cristo.',
    x: 'Hechos 1:8 — "Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra."',
    th: ['Poder sobrenatural', 'Evangelismo'],
    ol: [
      'La promesa de poder no está desligada del mandato de testimonio: el Espíritu desciende para que la iglesia declare, no para que se admire a sí misma.',
      'Sproul distingue el bautismo de regeneración del llenado repetido, y advierte contra convertir la experiencia en certificado de élite espiritual.',
      'El poder prometido no es furia emocional sino valentía ordenada para señalar a Cristo desde la propia ciudad hasta el fin de la tierra.',
    ],
    q: [
      'Una iglesia sin el Espíritu organiza; una iglesia con el Espíritu testifica: la diferencia no está en los métodos, está en el fuego.',
    ],
    i: 'Enseñanza de Ligonier que ordenó el debate sobre el Espíritu en círculos reformados.',
  },
  {
    a: 'sproul',
    t: 'La fe que salva sola',
    y: 2010,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su defensa de la Reforma; año aproximado)',
    o: 'Sproul vuelve a la batalla de la Reforma: la justificación es gratuita, por medio de la fe, sin mérito que presuma. Desmonta la caricatura que confunde fe sola con fe solitaria, porque la fe que salva trae arrepentimiento y fruto. La doctrina recupera la paz de la conciencia.',
    x: 'Efesios 2:8-9 — "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se glorie."',
    th: ['Gracia', 'Santidad'],
    ol: [
      'La sola fide no inventa un evangelio nuevo: traduce el veredicto de Pablo de que la justificación es gratuita, por medio de la fe y sin mérito que presuma.',
      'Sproul desmonta la caricatura que confunde fe sola con fe solitaria: la fe que salva no está sola, porque viene acompañada de arrepentimiento y fruto.',
      'La Reforma no fue una disputa de especialistas sino la recuperación de la paz de la conciencia, que ningún sistema de méritos pudo dar jamás.',
    ],
    q: [
      'Somos salvos solo por la fe, pero la fe que salva nunca viene sola: trae consigo un corazón que se arrepiente y manos que obedecen.',
    ],
    i: 'Defensa reiterada de la sola fide en toda la obra docente de Ligonier.',
  },
  {
    a: 'sproul',
    t: 'La segunda venida: la esperanza de la iglesia',
    y: 2012,
    p: 'Serie de enseñanza de Ligonier (estilo fiel de su escatología; año aproximado)',
    o: 'Sproul ancla la escatología en la promesa del ángel: el mismo Jesús que subió vendrá de manera corporal y visible. Descarta los cálculos de fechas y reclama la ética de la espera. La esperanza de la venida no es escapismo sino consagración con lámparas encendidas.',
    x: 'Hechos 1:11 — "este Jesús, que ha sido tomado de vosotros al cielo, así vendrá como le habéis visto ir al cielo."',
    th: ['Muerte y eternidad', 'Poder sobrenatural'],
    ol: [
      'El ángel promete un retorno corporal y visible, no un sentimiento interior: el mismo Jesús que subió vendrá, y esa literalidad ordena toda la escatología.',
      'Sproul descarta los cálculos de fechas y reclama la ética de la espera: una iglesia que mira el cielo vive con las lámparas encendidas y el trabajo terminado.',
      'La esperanza de la venida no es escapismo sino consagración, porque el Rey que regresa encuentra a su pueblo gobernando su casa y no dormido en el sofá.',
    ],
    q: [
      'La escatología no nació para vender mapas del futuro, sino para enderezar el presente de una iglesia que sabe que el Rey ya se fue y volverá.',
    ],
    i: 'Docencia amilenial de Ligonier difundida en sus series sobre el fin de los tiempos.',
  },

]

export const EXTRA_SERMONS: InspirationSermon[] = EXTRA_SEEDS.map(expandSeed)

export const ALL_SERMONS: InspirationSermon[] = [...SERMONS, ...EXTRA_SERMONS]
