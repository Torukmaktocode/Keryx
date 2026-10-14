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
  }
]

export const EXTRA_SERMONS: InspirationSermon[] = EXTRA_SEEDS.map(expandSeed)

export const ALL_SERMONS: InspirationSermon[] = [...SERMONS, ...EXTRA_SERMONS]
