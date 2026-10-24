/**
 * Analizador de lengua nueva (0 tokens): ESTANDAR de adopcion del mega-motor.
 * Dado un corpus biblico (versos en texto plano + meta), infiere por contexto
 * el perfil de la lengua: alfabeto (inventario de caracteres con diacriticos),
 * funcionarios (palabras funcionales de alta frecuencia), tamano y cobertura.
 * El main usa esto para SUMAR la seccion de la lengua nueva sin tocar codigo.
 */

export interface AnalisisLengua {
  /** Nombre legible (meta 'nombre' o el codigo). */
  nombre: string
  /** Fuente declarada del corpus (meta 'fuente' o 'lengua indigena'). */
  familia: string
  /** Alfabeto inferido: inventario de letras con diacriticos, ordenado. */
  alfabeto: string
  /** Palabras funcionales detectadas (top frecuencia). */
  funcionarios: string[]
  /** Versos, libros y capitulos cubiertos. */
  versos: number
  libros: number
  capitulos: number
  /** Palabras unicas y media de palabras por verso (muestral). */
  tokensUnicos: number
  mediaPalabrasVerso: number
}

interface AnalisisMuestral {
  alfabeto: string
  funcionarios: string[]
  tokensUnicos: number
  mediaPalabrasVerso: number
}

/** Inventario de letras (con diacriticos y apostrofe/glotal) sobre una muestra. */
export function inferirAlfabeto(textos: string[]): string {
  const freq = new Map<string, number>()
  for (const texto of textos) {
    for (const ch of texto.toLowerCase()) {
      if (/[\p{L}\p{M}'’]/u.test(ch)) freq.set(ch, (freq.get(ch) ?? 0) + 1)
    }
  }
  return [...freq.keys()]
    .sort((a, b) => a.localeCompare(b, 'es'))
    .join(' ')
}

/** Palabras funcionales: las mas frecuentes de la muestra (top 15). */
export function inferirFuncionarios(textos: string[]): string[] {
  const freq = new Map<string, number>()
  for (const texto of textos) {
    for (const tok of tokenize(texto)) freq.set(tok, (freq.get(tok) ?? 0) + 1)
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .filter(([, n]) => n >= 3)
    .map(([w]) => w)
}

/** Analisis muestral: alfabeto, funcionarios, tokens unicos y media por verso. */
export function analizarMuestra(textos: string[]): AnalisisMuestral {
  const unicos = new Set<string>()
  let total = 0
  let versos = 0
  for (const texto of textos) {
    const toks = tokenize(texto)
    if (!toks.length) continue
    versos += 1
    total += toks.length
    for (const tok of toks) unicos.add(tok)
  }
  return {
    alfabeto: inferirAlfabeto(textos),
    funcionarios: inferirFuncionarios(textos),
    tokensUnicos: unicos.size,
    mediaPalabrasVerso: versos ? Math.round((total / versos) * 10) / 10 : 0
  }
}

/** Analisis completo de un corpus: muestral + metadatos + cobertura. */
export function analizarCorpus(
  code: string,
  textos: string[],
  meta: Record<string, string> = {},
  cobertura: { versos: number; libros: number; capitulos: number } = { versos: 0, libros: 0, capitulos: 0 }
): AnalisisLengua {
  const muestra = analizarMuestra(textos)
  return {
    nombre: meta.nombre || `Lengua ${code}`,
    familia: meta.fuente || 'lengua indígena',
    alfabeto: muestra.alfabeto,
    funcionarios: muestra.funcionarios,
    versos: cobertura.versos,
    libros: cobertura.libros,
    capitulos: cobertura.capitulos,
    tokensUnicos: muestra.tokensUnicos,
    mediaPalabrasVerso: muestra.mediaPalabrasVerso
  }
}

/** Tokenizador compatible con el glosario (letras + diacriticos + apostrofe). */
export function tokenize(texto: string): string[] {
  return texto
    .toLowerCase()
    .split(/[^\p{L}\p{M}'’-]+/u)
    .filter((tok) => tok.length >= 2 && !/^\d/.test(tok))
}
