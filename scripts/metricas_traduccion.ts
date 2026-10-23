/**
 * metricas_traduccion.ts — Metricas MT deterministas (0 tokens IA): chrF++
 * (Popovic 2015, n-gramas de caracteres 1..6 + bonus de palabra) y BLEU-4
 * con suavizado add-1 (evita 0.0 cuando falta algun 4-grama). Puras e
 * inyectables: el eval de traduccion y sus tests las componen.
 */

const TOKENIZA = /[\p{L}\p{N}]+/gu

export function normaliza(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
}

/** F-score (beta=2) de n-gramas de caracteres n=1..maxN, acumulando
 * hipotesis/referencia por nivel de n. Devuelve 0..100. */
function fNgramas(
  candidatos: Map<string, number>,
  referencia: Map<string, number>,
  beta = 2
): number {
  let solapado = 0
  let totalCandidatos = 0
  let totalReferencia = 0
  for (const [, n] of candidatos) totalCandidatos += n
  for (const [, n] of referencia) totalReferencia += n
  if (totalCandidatos === 0 || totalReferencia === 0) return 0
  for (const [gramo, n] of candidatos) {
    const m = referencia.get(gramo)
    if (m) solapado += Math.min(n, m)
  }
  const precision = solapado / totalCandidatos
  const recall = solapado / totalReferencia
  if (precision === 0 || recall === 0) return 0
  const b2 = beta * beta
  return ((1 + b2) * precision * recall) / (b2 * precision + recall)
}

function ngramasCaracter(secuencia: string, n: number): Map<string, number> {
  const mapa = new Map<string, number>()
  for (let i = 0; i + n <= secuencia.length; i++) {
    const gramo = secuencia.slice(i, i + n)
    mapa.set(gramo, (mapa.get(gramo) ?? 0) + 1)
  }
  return mapa
}

function suma(mapas: Array<Map<string, number>>): Map<string, number> {
  const salida = new Map<string, number>()
  for (const mapa of mapas) {
    for (const [k, v] of mapa) salida.set(k, (salida.get(k) ?? 0) + v)
  }
  return salida
}

/** chrF++ (0..100): n-gramas de caracteres sobre hipotesis vs referencia
 * (n=1..6, beta=2) + media aritmetica con n-gramas de palabra (n=1,2). */
export function chrFpp(hipotesis: string, referencia: string): number {
  const hip = ` ${normaliza(hipotesis)} `
  const ref = ` ${normaliza(referencia)} `
  if (!hip.trim() || !ref.trim()) return 0
  const caracteres = [1, 2, 3, 4, 5, 6].map((n) =>
    fNgramas(ngramasCaracter(hip, n), ngramasCaracter(ref, n))
  )
  const chrf = (caracteres.reduce((a, b) => a + b, 0) / caracteres.length) * 100
  const palabrasHip = hip.split(' ').filter(Boolean)
  const palabrasRef = ref.split(' ').filter(Boolean)
  const palabras: number[] = [1, 2].map((n) => {
    const h = suma(
      palabrasHip.slice(0, Math.max(0, palabrasHip.length - n + 1)).map((_, i) => {
        const mapa = new Map<string, number>()
        const gramo = palabrasHip.slice(i, i + n).join(' ')
        mapa.set(gramo, (mapa.get(gramo) ?? 0) + 1)
        return mapa
      })
    )
    const r = suma(
      palabrasRef.slice(0, Math.max(0, palabrasRef.length - n + 1)).map((_, i) => {
        const mapa = new Map<string, number>()
        const gramo = palabrasRef.slice(i, i + n).join(' ')
        mapa.set(gramo, (mapa.get(gramo) ?? 0) + 1)
        return mapa
      })
    )
    return fNgramas(h, r)
  })
  const bonus = (palabras[0] + palabras[1]) / 2
  return (chrf + bonus * 100) / 2
}

/** BLEU-4 con suavizado add-1 y penalizacion de brevedad (0..100). */
export function bleu4(hipotesis: string, referencia: string): number {
  const hip = normaliza(hipotesis).match(TOKENIZA) ?? []
  const ref = normaliza(referencia).match(TOKENIZA) ?? []
  if (!hip.length || !ref.length) return 0
  const logN: number[] = []
  for (let n = 1; n <= 4; n++) {
    const h = new Map<string, number>()
    for (let i = 0; i + n <= hip.length; i++) {
      const gramo = hip.slice(i, i + n).join(' ')
      h.set(gramo, (h.get(gramo) ?? 0) + 1)
    }
    const r = new Map<string, number>()
    for (let i = 0; i + n <= ref.length; i++) {
      const gramo = ref.slice(i, i + n).join(' ')
      r.set(gramo, (r.get(gramo) ?? 0) + 1)
    }
    let acierto = 0
    let total = 0
    for (const [gramo, c] of h) {
      total += c
      acierto += Math.min(c, r.get(gramo) ?? 0)
    }
    if (total === 0) {
      logN.push(Math.log(1 / 2))
      continue
    }
    const suavizado = acierto === 0 ? 1 : 0
    logN.push(Math.log((acierto + suavizado) / (total + suavizado)))
  }
  const bp = hip.length < ref.length ? Math.exp(1 - ref.length / hip.length) : 1
  return bp * Math.exp(logN.reduce((a, b) => a + b, 0) / 4) * 100
}
