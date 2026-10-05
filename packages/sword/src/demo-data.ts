import type { Verse } from '@keryx/core'

export interface DemoModule {
  name: string
  description: string
  category: 'Bible' | 'Commentary' | 'Lexicon' | 'Dictionary'
  lang: string
  hasStrongs?: boolean
}

export const DEMO_LOCAL_MODULES: DemoModule[] = [
  {
    name: 'KJV',
    description: 'King James Version (1769) with Strongs Numbers',
    category: 'Bible',
    lang: 'en',
    hasStrongs: true
  },
  {
    name: 'RVR1909',
    description: 'Reina-Valera 1909 (dominio publico)',
    category: 'Bible',
    lang: 'es'
  },
  {
    name: 'StrongsGreek',
    description: 'Strongs Greek Dictionary',
    category: 'Lexicon',
    lang: 'grc'
  },
  {
    name: 'StrongsHebrew',
    description: 'Strongs Hebrew Dictionary',
    category: 'Lexicon',
    lang: 'he'
  }
]

export const DEMO_REMOTE_MODULES: DemoModule[] = [
  { name: 'WLC', description: 'Westminster Leningrad Codex (Hebrew OT)', category: 'Bible', lang: 'he' },
  { name: 'TR', description: 'Textus Receptus (Greek NT)', category: 'Bible', lang: 'grc' },
  { name: 'VulgClementine', description: 'Clementine Vulgate (Latin)', category: 'Bible', lang: 'la' },
  { name: 'PorAlmeida', description: 'Joao Ferreira de Almeida (Portuguese)', category: 'Bible', lang: 'pt' },
  { name: 'MHCC', description: 'Matthew Henrys Concise Commentary', category: 'Commentary', lang: 'en' },
  { name: 'ISBE', description: 'International Standard Bible Encyclopedia', category: 'Dictionary', lang: 'en' }
]

const chapterKey = (module: string, book: string, chapter: number): string =>
  `${module}:${book}:${chapter}`

export const DEMO_CHAPTERS: Record<string, Verse[]> = {
  [chapterKey('KJV', 'Gen', 1)]: [
    { book: 'Gen', chapter: 1, verse: 1, heading: 'The Creation', text: 'In the beginning God created the heaven and the earth.' },
    { book: 'Gen', chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
    { book: 'Gen', chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.' },
    { book: 'Gen', chapter: 1, verse: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
    { book: 'Gen', chapter: 1, verse: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' }
  ],
  [chapterKey('RVR1909', 'Gen', 1)]: [
    { book: 'Gen', chapter: 1, verse: 1, heading: 'La creacion', text: 'EN el principio cri\u00f3 Dios los cielos y la tierra.' },
    { book: 'Gen', chapter: 1, verse: 2, text: 'Y la tierra estaba desordenada y vac\u00eda, y las tinieblas estaban sobre la haz del abismo, y el Esp\u00edritu de Dios se mov\u00eda sobre la haz de las aguas.' },
    { book: 'Gen', chapter: 1, verse: 3, text: 'Y dijo Dios: Sea la luz: y fu\u00e9 la luz.' },
    { book: 'Gen', chapter: 1, verse: 4, text: 'Y vi\u00f3 Dios que la luz era buena: y apart\u00f3 Dios la luz de las tinieblas.' },
    { book: 'Gen', chapter: 1, verse: 5, text: 'Y llam\u00f3 Dios a la luz D\u00eda, y a las tinieblas llam\u00f3 Noche. Y fu\u00e9 la tarde y la ma\u00f1ana un d\u00eda.' }
  ],
  [chapterKey('KJV', 'Ps', 23)]: [
    { book: 'Ps', chapter: 23, verse: 1, heading: 'The Lord is my shepherd', text: 'The LORD is my shepherd; I shall not want.' },
    { book: 'Ps', chapter: 23, verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
    { book: 'Ps', chapter: 23, verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his names sake.' },
    { book: 'Ps', chapter: 23, verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
    { book: 'Ps', chapter: 23, verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
    { book: 'Ps', chapter: 23, verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' }
  ],
  [chapterKey('RVR1909', 'Ps', 23)]: [
    { book: 'Ps', chapter: 23, verse: 1, heading: 'Jehov\u00e1 es mi pastor', text: 'JEHOV\u00c1 es mi pastor; nada me faltar\u00e1.' },
    { book: 'Ps', chapter: 23, verse: 2, text: 'En lugares de verdes pastos me har\u00e1 descansar: junto a aguas de reposo me pastorear\u00e1.' },
    { book: 'Ps', chapter: 23, verse: 3, text: 'Confortar\u00e1 mi alma; guiar\u00e1me por sendas de justicia por amor de su nombre.' },
    { book: 'Ps', chapter: 23, verse: 4, text: 'Aunque ande en valle de sombra de muerte, no temer\u00e9 mal alguno; porque t\u00fa estar\u00e1s conmigo: tu vara y tu cayado me infundir\u00e1n aliento.' },
    { book: 'Ps', chapter: 23, verse: 5, text: 'Aderezar\u00e1s mesa delante de m\u00ed en presencia de mis angustiadores: ungiste mi cabeza con aceite: mi copa est\u00e1 rebosando.' },
    { book: 'Ps', chapter: 23, verse: 6, text: 'Ciertamente el bien y la misericordia me seguir\u00e1n todos los d\u00edas de mi vida: y en la casa de Jehov\u00e1 morar\u00e9 por largos d\u00edas.' }
  ],
  [chapterKey('KJV', 'John', 3)]: [
    { book: 'John', chapter: 3, verse: 16, heading: 'God so loved the world', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { book: 'John', chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
    { book: 'John', chapter: 3, verse: 18, text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.' }
  ],
  [chapterKey('RVR1909', 'John', 3)]: [
    { book: 'John', chapter: 3, verse: 16, heading: 'De tal manera am\u00f3 Dios al mundo', text: 'Porque de tal manera am\u00f3 Dios al mundo, que ha dado \u00e1 su Hijo unig\u00e9nito, para que todo aquel que en \u00e9l cree, no se pierda, mas tenga vida eterna.' },
    { book: 'John', chapter: 3, verse: 17, text: 'Porque no envi\u00f3 Dios \u00e1 su Hijo al mundo para que condene al mundo, mas para que el mundo sea salvo por \u00e9l.' },
    { book: 'John', chapter: 3, verse: 18, text: 'El que en \u00e9l cree, no es condenado; mas el que no cree, ya es condenado, porque no crey\u00f3 en el nombre del unig\u00e9nito Hijo de Dios.' }
  ],
  [chapterKey('KJV', 'Rom', 8)]: [
    { book: 'Rom', chapter: 8, verse: 28, heading: 'All things work together for good', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
    { book: 'Rom', chapter: 8, verse: 29, text: 'For whom he did foreknow, he also did predestinate to be conformed to the image of his Son, that he might be the firstborn among many brethren.' }
  ],
  [chapterKey('RVR1909', 'Rom', 8)]: [
    { book: 'Rom', chapter: 8, verse: 28, heading: 'Todas las cosas ayudan \u00e1 bien', text: 'Y sabemos que \u00e1 los que aman \u00e1 Dios, todas las cosas les ayudan \u00e1 bien, esto es, \u00e1 los que conforme \u00e1 su prop\u00f3sito son llamados.' },
    { book: 'Rom', chapter: 8, verse: 29, text: 'Porque \u00e1 los que antes conoci\u00f3, predestin\u00f3 para que fuesen hechos conformes \u00e1 la imagen de su Hijo, para que \u00e9l sea el primog\u00e9nito entre muchos hermanos.' }
  ]
}

export const DEMO_DICTIONARY: Record<string, Record<string, string>> = {
  StrongsGreek: {
    G26: 'agape (ag-ah\'-pay): love, i.e. affection or benevolence; specially a love-feast.',
    G2316: 'theos (theh\'-os): a deity, especially the supreme Divinity; figuratively a magistrate.',
    G3056: 'logos (log\'-os): something said, including the thought; by implication a topic, also reasoning.'
  },
  StrongsHebrew: {
    H430: 'elohim (el-o-heem\'): gods in the ordinary sense; but specifically the supreme God.',
    H157: 'ahab (aw-hab\'): to have affection for, to love.',
    H2617: 'chesed (kheh\'-sed): kindness, mercy, lovingkindness.'
  }
}
