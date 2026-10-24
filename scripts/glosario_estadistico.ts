/**
 * Motor de glosario estadistico (0 tokens): extrae el diccionario basico de
 * una lengua nativa ALINEANDO el corpus biblico verificado verso por verso
 * contra el espanol. Estadistica determinista: co-ocurrencia ponderada por
 * frecuencia inversa (estilo PMI). Nada se instala: el corpus que trae el
 * misionero ES el motor.
 */

export interface ParGlosario {
  es: string
  nat: string
  peso: number
}

export interface VersoAlineado {
  es: string
  nat: string
}

const MIN_PESO = 1.4
const MAX_CANDIDATOS = 3

/** Funciones nativas de muy alta frecuencia (articulos, conectores): nunca son la traduccion de un termino. */
function funcionarios(nativo: string[]): string[] {
  const freq = new Map<string, number>()
  for (const verso of nativo) for (const tok of verso) freq.set(tok, (freq.get(tok) ?? 0) + 1)
  const total = [...freq.values()].reduce((a, b) => a + b, 0) || 1
  return [...freq.entries()].filter(([, n]) => n / total > 0.08).map(([w]) => w)
}

/**
 * Extrae el glosario: para cada termino semilla espanol, cuenta los tokens
 * nativos de los versos donde aparece y los pondera por rareza inversa.
 * Devuelve pares ordenados por peso, candidatos max MAX_CANDIDATOS.
 */
export function extraerGlosario(
  versos: VersoAlineado[],
  semillas: string[],
  esStop?: Set<string>
): ParGlosario[] {
  if (!versos.length || !semillas.length) return []
  const versosNat = versos.map((v) => tokenize(v.nat))
  const funcionas = new Set(funcionarios(versosNat))
  const freqNat = new Map<string, number>()
  for (const toks of versosNat) for (const tok of toks) freqNat.set(tok, (freqNat.get(tok) ?? 0) + 1)

  const pares: ParGlosario[] = []
  for (const semilla of semillas) {
    const termino = semilla.toLowerCase()
    const occ = new Map<string, number>()
    let hits = 0
    versos.forEach((verso, i) => {
      if (!versoTextoContiene(verso.es, termino, esStop)) return
      hits += 1
      for (const tok of versosNat[i]) {
        if (funcionas.has(tok) || freqNat.get(tok) === 1) continue
        occ.set(tok, (occ.get(tok) ?? 0) + 1)
      }
    })
    if (hits < 4) continue
    const ordenados = [...occ.entries()]
      .map(([nat, n]) => ({ nat, peso: n / Math.pow(freqNat.get(nat) ?? 1, 0.45) }))
      .sort((a, b) => b.peso - a.peso)
      .filter((x) => x.peso >= MIN_PESO)
      .slice(0, MAX_CANDIDATOS)
    for (const c of ordenados) {
      pares.push({ es: semilla, nat: c.nat, peso: Math.round(c.peso * 100) / 100 })
    }
  }
  return pares
}

function versoTextoContiene(es: string, termino: string, esStop?: Set<string>): boolean {
  const normalizado = es
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
  const base = termino
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
  if (!base.includes(' ')) {
    return new RegExp(`(?<![a-z])${base}(?![a-z])`).test(normalizado)
  }
  const partes = base.split(/\s+/)
  if (partes.every((p) => esStop?.has(p))) return false
  const regex = new RegExp(`(?<![a-z])${partes.join('\\s+[a-z]+\\s+')}(?![a-z])`)
  return regex.test(normalizado)
}

export function tokenize(texto: string): string[] {
  return texto
    .toLowerCase()
    .split(/[^\p{L}\p{M}'’-]+/u)
    .filter((tok) => tok.length >= 2 && !/^\d/.test(tok))
}

/** Semillas biblicas basicas: el vocabulario núcleo del pastor. */
export const SEMILLAS = [
  'Dios', 'Señor', 'Jesús', 'Cristo', 'pecado', 'fe', 'gracia', 'vida', 'muerte',
  'luz', 'corazón', 'pan', 'padre', 'hijo', 'cielo', 'tierra', 'rey', 'pueblo',
  'sangre', 'palabra', 'amor', 'ley', 'paz', 'espiritu', 'oracion', 'hombre',
  'mujer', 'bien', 'mal', 'nombre', 'casa', 'dia', 'mano', 'rey de reyes'
]
