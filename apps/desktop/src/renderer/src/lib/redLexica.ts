/**
 * Red lexica determinista (0 tokens): patrones de COMO abrio Jesus y como lo
 * hablaron sus apostoles, por tema pastoral. Cada frase es textual (RV60) y
 * citada; si el tema no esta en la tabla, no se inventa (principio de
 * silencio). La IA solo recibe estas citas como anclas para la voz.
 */
export interface PatronLine {
  ref: string
  frase: string
  modo: string
  voz: string
}

export interface PatronTema {
  cristo: PatronLine
  apostoles: PatronLine[]
}

const cristo = (ref: string, frase: string, modo: string): PatronLine => ({
  ref,
  frase,
  modo,
  voz: 'Jesús'
})

const apostol = (voz: string, ref: string, frase: string, modo: string): PatronLine => ({
  voz,
  ref,
  frase,
  modo
})

const P = (c: PatronLine, a: PatronLine[]): PatronTema => ({ cristo: c, apostoles: a })

export const PATRONES: Record<string, PatronTema> = {
  'el miedo y la ansiedad': P(
    cristo('Juan 14:27', 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.', 'con una promesa propia, de tú a tú'),
    [
      apostol('Pedro', '1 Pedro 5:7', 'echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros', 'con la invitación de soltar la carga'),
      apostol('Pablo', 'Filipenses 4:6', 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración', 'con una práctica concreta para esa noche'),
      apostol('Juan', '1 Juan 4:18', 'En el amor no hay temor, sino que el perfecto amor echa fuera el temor', 'con la lógica del amor que desarma')
    ]
  ),
  'el dolor y el duelo': P(
    cristo('Juan 11:35', 'Jesús lloró.', 'llorando primero, sin prisa por arreglar'),
    [
      apostol('Jesús (en las bienaventuranzas)', 'Mateo 5:4', 'Bienaventurados los que lloran, porque ellos recibirán consolación', 'bendiciendo el llanto antes de la consuelo'),
      apostol('Pablo', '1 Tesalonicenses 4:13', 'no os aflijáis como los otros que no tienen esperanza', 'nombrando la diferencia de la esperanza'),
      apostol('Juan', 'Juan 16:20', 'vuestra tristeza se convertirá en gozo', 'con la promesa del giro del dolor')
    ]
  ),
  'el sufrimiento': P(
    cristo('Mateo 5:10', 'Bienaventurados los que padecen persecución por causa de la justicia, porque de ellos es el reino de los cielos', 'llamando bienaventurada la vida que duele por lo bueno'),
    [
      apostol('Pablo', '2 Corintios 12:9', 'Te basta mi gracia; porque mi poder se perfecciona en la debilidad', 'con la palabra que el Señor le dio en su propia debilidad'),
      apostol('Pedro', '1 Pedro 1:6-7', 'aunque ahora por breve tiempo tenéis que ser afligidos, para que la prueba de vuestra fe sea hallada en alabanza', 'con la fe puesta a prueba como oro'),
      apostol('Santiago', 'Santiago 1:2-3', 'Tened por sumo gozo cuando os halléis en diversas pruebas, sabiendo que la prueba de vuestra fe produce paciencia', 'con la paciencia que va creciendo')
    ]
  ),
  'la esperanza': P(
    cristo('Juan 11:25', 'Yo soy la resurrección y la vida', 'poniéndose Él mismo como la promesa'),
    [
      apostol('Pablo', 'Romanos 15:13', 'Y el Dios de esperanza os llene de todo gozo y paz en el creer', 'orando la esperanza sobre la congregación'),
      apostol('Pedro', '1 Pedro 1:3', 'nos hizo renacer para una esperanza viva por la resurrección de Jesucristo', 'con la esperanza viva y no prestada'),
      apostol('Juan', 'Apocalipsis 21:4', 'Enjugará Dios toda lágrima de los ojos de ellos', 'con la mirada puesta en la casa final')
    ]
  ),
  'el desánimo': P(
    cristo('Juan 16:33', 'En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo', 'diciendo la verdad entera sin esconder la pelea'),
    [
      apostol('Pablo', '2 Corintios 4:1', 'teniendo nosotros este ministerio... no desmayamos', 'testificando que la misericordia sostiene'),
      apostol('Pedro', '1 Pedro 5:10', 'el Dios de toda gracia... los perfeccione, afirme, fortalezca y establezca', 'con cuatro verbos de restauración'),
      apostol('Pablo', 'Gálatas 6:9', 'no nos cansemos, pues, de hacer bien; porque a su tiempo segaremos', 'con la cosecha que llega a su tiempo')
    ]
  ),
  'el cansancio y la carga': P(
    cristo('Mateo 11:28', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar', 'con la invitación más directa y humana de todas'),
    [
      apostol('Jesús', 'Mateo 11:29', 'Aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas', 'aprendiendo el paso del maestro'),
      apostol('Pablo', 'Gálatas 6:2', 'Sobrellevad los unos las cargas de los otros', 'repartiendo la carga en comunidad'),
      apostol('Hebreos', 'Hebreos 4:9', 'Por tanto, queda un reposo para el pueblo de Dios', 'con el descanso que aún espera')
    ]
  ),
  'el descanso': P(
    cristo('Mateo 11:28', 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar', 'con la invitación de sentarse a Su lado'),
    [
      apostol('Hebreos', 'Hebreos 4:10', 'porque el que ha entrado en su reposo, también ha reposado de sus obras', 'cesando para que Él sostenga'),
      apostol('Pablo', 'Filipenses 4:6-7', 'la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones', 'con la paz que guarda de noche'),
      apostol('Santiago', 'Santiago 1:5', 'pídala a Dios, que da a todos abundantemente y sin reprochación', 'pidiendo en lugar de agotarse solo')
    ]
  ),
  'la gratitud': P(
    cristo('Lucas 22:19', 'Tomando el pan, dio gracias', 'agradeciendo aun la noche más pesada'),
    [
      apostol('Pablo', '1 Tesalonicenses 5:18', 'Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús', 'con la gratitud en todo, no solo en lo bueno'),
      apostol('Pablo', 'Efesios 5:20', 'dando siempre gracias por todo al Dios y Padre', 'con la gratitud como costumbre de casa'),
      apostol('Santiago', 'Santiago 1:17', 'Toda buena dádiva y todo don perfecto desciende de lo alto', 'contando los regalos de arriba')
    ]
  ),
  'el perdón': P(
    cristo('Lucas 23:34', 'Padre, perdónalos, porque no saben lo que hacen', 'perdonando desde la cruz misma'),
    [
      apostol('Pablo', 'Efesios 4:32', 'sean unos con otros benignos, misericordiosos, perdonándose unos a otros, como Dios también os perdonó', 'perdonando como fuimos perdonados'),
      apostol('Juan', '1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados', 'con la fidelidad que recibe y limpia'),
      apostol('Santiago', 'Santiago 5:16', 'Confesaos vuestras ofensas unos a otros, y orad unos por otros', 'con el paso concreto de hablarlo')
    ]
  ),
  'el amor': P(
    cristo('Juan 13:34', 'Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado', 'dando la medida del amor: Él mismo'),
    [
      apostol('Juan', '1 Juan 4:10', 'En esto consiste el amor: no en que nosotros hayamos amado a Dios, sino en que él nos amó a nosotros', 'empezando por el amor que nos alcanzó'),
      apostol('Pablo', '1 Corintios 13:4-5', 'El amor es sufrido, es benigno; no guarda rencor, no se irrita', 'describiendo el amor con gestos de casa'),
      apostol('Pedro', '1 Pedro 4:8', 'Ante todas las cosas tened ferviente amor entre vosotros, porque el amor cubre multitud de pecados', 'con el amor que tapa la grieta')
    ]
  ),
  'la familia y el hogar': P(
    cristo('Marcos 10:14', 'Dejad a los niños venir a mí, y no se lo impidáis', 'defendiendo a los pequeños con ternura y firmeza'),
    [
      apostol('Pablo', 'Efesios 6:4', 'criadlos en la disciplina y amonestación del Señor', 'formando el corazón, no solo la conducta'),
      apostol('Pedro', '1 Pedro 3:7', 'vosotros, maridos, vivid de manera inteligente con vuestras compañeras... y orad para que vuestras oraciones no tengan estorbo', 'con el trato que abre el cielo en casa'),
      apostol('Pablo', 'Colosenses 3:16', 'la palabra de Cristo more en vosotros abundantemente... en cánticos y himnos espirituales', 'con la Palabra cantada en la mesa')
    ]
  ),
  'la fe': P(
    cristo('Marcos 9:23', 'Si puedes creer, al que cree todo le es posible', 'volviendo el foco de mi fuerza a Su fidelidad'),
    [
      apostol('Pablo', 'Romanos 10:17', 'la fe es por el oír, y el oír, por la palabra de Dios', 'alimentando la fe con el oído del texto'),
      apostol('Hebreos', 'Hebreos 11:1', 'Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve', 'con la fe como certeza y no sentimiento'),
      apostol('Juan', 'Juan 20:29', 'Bienaventurados los que no vieron, y creyeron', 'bendiciendo la fe sin pruebas a la vista')
    ]
  ),
  'el propósito y el llamado': P(
    cristo('Marcos 1:17', 'Venid en pos de mí, y os haré pescadores de hombres', 'cambiando el oficio sin cambiar la persona'),
    [
      apostol('Pablo', 'Filipenses 3:14', 'Prosigo al blanco, al premio del supremo llamamiento de Dios en Cristo Jesús', 'siguiendo hacia adelante sin miradas de duelo'),
      apostol('Pedro', '1 Pedro 2:9', 'para anunciar las virtudes de aquel que os llamó de las tinieblas a su luz admirable', 'con la identidad antes que la tarea'),
      apostol('Pablo', 'Efesios 2:10', 'somos hechura suya, creados para buenas obras, las cuales Dios preparó de antemano', 'con las obras que ya estaban listas')
    ]
  ),
  'la paz': P(
    cristo('Juan 14:27', 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da', 'regalando una paz que no fabrica el mundo'),
    [
      apostol('Pablo', 'Romanos 5:1', 'Justificados, pues, por la fe, tenemos paz para con Dios por medio de nuestro Señor Jesucristo', 'empezando por la paz con Dios'),
      apostol('Juan', 'Juan 16:33', 'En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo', 'con la paz dentro de la pelea real'),
      apostol('Pablo', 'Colosenses 3:15', 'Y la paz de Dios gobierne en vuestros corazones', 'dejar que la paz árbitre')
    ]
  ),
  'el gozo': P(
    cristo('Juan 15:11', 'Estas cosas os he hablado, para que mi gozo permanezca en vosotros, y vuestro gozo sea cumplido', 'con Su gozo puesto a permanecer, no a pasar'),
    [
      apostol('Pablo', 'Filipenses 4:4', 'Gozaos siempre en el Señor. Otra vez digo: ¡Gozaos!', 'repitiéndolo porque la casa lo necesita dos veces'),
      apostol('Santiago', 'Santiago 1:2', 'Tened por sumo gozo cuando os halléis en diversas pruebas', 'el gozo que no depende del día'),
      apostol('Juan', '1 Juan 1:4', 'Y estas cosas os escribimos, para que vuestro gozo sea cumplido', 'escribiendo para llenar el gozo')
    ]
  ),
  'la adversidad': P(
    cristo('Mateo 5:11-12', 'Gozaos y alegraos, porque vuestra recompensa es grande en los cielos', 'recolocando la tormenta en la línea larga'),
    [
      apostol('Pablo', '2 Corintios 4:17', 'nuestra leve aflicción momentánea produce un peso eterno de gloria', 'sopesando lo eterno contra lo corto'),
      apostol('Pedro', '1 Pedro 4:12-13', 'No os sorprendáis del fuego de prueba... sino gozaos por cuanto sois partícipes de los padecimientos de Cristo', 'quitando la sorpresa y dando compañía'),
      apostol('Santiago', 'Santiago 1:3', 'la prueba de vuestra fe produce paciencia', 'con la paciencia como músculo')
    ]
  ),
  'la provisión': P(
    cristo('Mateo 6:26', 'Mirad las aves del cielo... y vuestro Padre celestial las alimenta. ¿No sois vosotros de mucho más valor?', 'con un ejemplo de la ventana y una pregunta honesta'),
    [
      apostol('Pablo', 'Filipenses 4:19', 'Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria', 'con la cuenta abierta en Su riqueza'),
      apostol('Pablo', '2 Corintios 9:8', 'Y poderoso es Dios para hacer que abundéis en todo bien', 'suficiente para dar y para bien hacer'),
      apostol('Pedro', '1 Pedro 5:7', 'echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros', 'con el cuidado personal del Pastor')
    ]
  ),
  'la sanidad': P(
    cristo('Mateo 8:3', 'Extendiendo la mano, le tocó, diciendo: Yo quiero; sé limpio', 'tocando primero y sanando después'),
    [
      apostol('Santiago', 'Santiago 5:14', '¿Está alguno enfermo entre vosotros? Llame a los ancianos de la iglesia, y oren por él', 'con pasos concretos de comunidad'),
      apostol('Pablo', '2 Corintios 12:9', 'Te basta mi gracia; porque mi poder se perfecciona en la debilidad', 'con la gracia suficiente cuando la cura tarda'),
      apostol('Mateo (evangelista)', 'Mateo 8:17', 'Él mismo tomó nuestras enfermedades, y llevó nuestras dolencias', 'con el Siervo que cargó el dolor')
    ]
  ),
  'la oración': P(
    cristo('Mateo 7:7', 'Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá', 'con tres verbos simples para empezar hoy'),
    [
      apostol('Pablo', 'Efesios 6:18', 'orando en todo tiempo con toda oración y súplica en el Espíritu', 'con la oración en todo tiempo'),
      apostol('Santiago', 'Santiago 5:13', '¿Está alguno afligido entre vosotros? Que ore', 'con la oración como primer reflejo'),
      apostol('Juan', '1 Juan 5:14', 'si pedimos alguna cosa conforme a su voluntad, él nos oye', 'con la confianza de que Él oye')
    ]
  ),
  'el evangelio y la misión': P(
    cristo('Mateo 28:19', 'Por tanto, id, y haced discípulos a todas las naciones', 'despidiendo con una misión, no con un consejo'),
    [
      apostol('Pablo', 'Romanos 1:16', 'No me avergüenzo del evangelio, porque es poder de Dios para salvación', 'confesando el poder del mensaje'),
      apostol('Pedro', '1 Pedro 3:15', 'estad siempre preparados... con mansedumbre y reverencia', 'con la defensa amable y preparada'),
      apostol('Pablo', '1 Corintios 9:22', 'Me he hecho a todos las cosas... para salvar por todos medios a algunos', 'entrando en el mundo del otro')
    ]
  ),
  'el arrepentimiento': P(
    cristo('Lucas 15:20', 'Aún cuando estaba lejos, su padre lo vio, y sintió compasión, y corrió, y abrazó, y besó', 'corriendo primero hacia el que vuelve'),
    [
      apostol('Juan', '1 Juan 1:9', 'Si confesamos nuestros pecados, él es fiel y justo para perdonar', 'con la fidelidad que espera la confesión'),
      apostol('Pablo', 'Romanos 2:4', 'la benignidad de Dios te guía al arrepentimiento', 'sin presión: con la bondad que conduce'),
      apostol('Pedro', '1 Pedro 2:25', 'pero ahora habéis vuelto al Pastor y Obispo de vuestras almas', 'nombrando la vuelta a casa')
    ]
  ),
  'la santidad': P(
    cristo('Mateo 5:8', 'Bienaventurados los de limpio corazón, porque ellos verán a Dios', 'con la promesa que sostiene el camino limpio'),
    [
      apostol('Pedro', '1 Pedro 1:15', 'sé santos también en toda manera de vivir, porque escrito está: Sed santos', 'con la santidad en lo cotidiano'),
      apostol('Pablo', '1 Tesalonicenses 4:7', 'pues no nos ha llamado Dios a inmundicia, sino a la santificación', 'nombrando el llamado exacto'),
      apostol('Pablo', '1 Corintios 6:11', 'y esto erais algunos; mas ya sois lavados, ya sois santificados', 'anclando la identidad en la gracia')
    ]
  ),
  'la sabiduría': P(
    cristo('Mateo 7:24', 'cualquiera que oye estas palabras mías y las hace, será como un hombre prudente que edificó sobre la roca', 'con la casa que resiste cuando llueve'),
    [
      apostol('Santiago', 'Santiago 1:5', 'Si alguno os falta sabiduría, pídala a Dios, que da a todos abundantemente', 'con la puerta abierta para pedirla'),
      apostol('Pablo', 'Colosenses 2:3', 'en quien están escondidos todos los tesoros de la sabiduría y del conocimiento', 'señalando el lugar del tesoro'),
      apostol('Pablo', '1 Corintios 1:24', 'a los llamados, Cristo poder de Dios y sabiduría de Dios', 'con Cristo mismo como la sabiduría')
    ]
  )
}

/** Busca el patrón de un tema exacto. Determinista: nada de aproximaciones. */
export function patronDeTema(tema: string | undefined): PatronTema | undefined {
  if (!tema) return undefined
  return PATRONES[tema]
}

/** Líneas citables para el gancho y la guía (con cita [ref]). */
export function patronLineas(tema: string | undefined, maxApostoles = 2): string[] {
  const patron = patronDeTema(tema)
  if (!patron) return []
  const lines: string[] = [
    `> *Como lo abrió Jesús:* «${patron.cristo.frase}» (${patron.cristo.ref}) — ${patron.cristo.modo}.`
  ]
  for (const a of patron.apostoles.slice(0, maxApostoles)) {
    lines.push(`> *Como lo habló ${a.voz}:* «${a.frase}» (${a.ref}) — ${a.modo}.`)
  }
  return lines
}
