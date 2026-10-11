import { EswordProvider } from './packages/sword/src/local/esword'

const p = EswordProvider.create('esword', ['biblioteca'])!
const tests: Array<[string, string[]]> = [
  ['AMOR', ['Nuevo Diccionario de Teologia - Ferguson-Wright-Packer', 'Diccionario Teologico Enciclopedico', 'Diccionario de Filosofia Brugger', 'Enciclopedia de Filosofia', 'Usos y Costumbres de las Tierras Biblicas - Fred Wight', 'Compendio de la Doctrina Social de la Iglesia']],
  ['GRACIA', ['Nuevo Diccionario de Teologia - Ferguson-Wright-Packer', 'Diccionario Teologico Enciclopedico', 'Diccionario de Filosofia Brugger']],
  ['CRISTOLOGIA', ['Diccionario Teologico Enciclopedico', 'Diccionario de Jesus de Nazaret', 'Nuevo Diccionario de Teologia - Ferguson-Wright-Packer']],
  ['FARISEOS', ['Usos y Costumbres de las Tierras Biblicas - Fred Wight', 'Diccionario Biblico Arqueologico - Charles Pfeiffer']],
  ['VERDAD', ['Diccionario de Filosofia Herder', 'Diccionario de Filosofia Rosental']],
  ['TRABAJO', ['Compendio de la Doctrina Social de la Iglesia', 'Diccionario de Filosofia Brugger']],
  ['SINAGOGA', ['Usos y Costumbres de las Tierras Biblicas - Fred Wight', 'Diccionario Biblico Arqueologico - Charles Pfeiffer']],
  ['ENCARNACION', ['Diccionario Teologico Enciclopedico', 'Diccionario de Jesus de Nazaret']],
  ['ESCLAVITUD', ['Usos y Costumbres de las Tierras Biblicas - Fred Wight', 'Diccionario de Filosofia Brugger', 'Compendio de la Doctrina Social de la Iglesia']]
]
for (const [topic, modules] of tests) {
  const parts: string[] = []
  for (const m of modules) {
    const entry = await p.lookupDict(m, topic)
    parts.push(`${m.slice(0, 28)}: ${entry ? entry.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 90) : 'NULL'}`)
  }
  console.log(`## ${topic}\n- ` + parts.join('\n- '))
}
p.dispose()
