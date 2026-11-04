import { parseReference, type ParsedRef } from './reference'

export interface CitaAnclada {
  module: string
  entry: string
  kind: string
}

/** Clave Strong valida (H2088, G26, H08059A). */
export function esStrongClave(entry: string): boolean {
  return /^[GH]0?\d{1,5}[A-Z]?$/i.test(entry.replace(/\s/g, ''))
}

/** Deduplica citas por (modulo+entrada) preservando el primer orden. */
export function citasUnicas(citations: readonly CitaAnclada[]): CitaAnclada[] {
  const seen = new Set<string>()
  const out: CitaAnclada[] = []
  for (const citation of citations) {
    const key = `${citation.module}\u0000${citation.entry}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(citation)
  }
  return out
}

/** Resuelve la entrada de una cita a un pasaje (o null si no lo es). */
export function refDeEntrada(entry: string): ParsedRef | null {
  return parseReference(entry)
}

/** Quita la seccion "## Fuentes ancladas" del markdown (se reemplaza por chips). */
export function mdSinFuentes(markdown: string): { body: string; hayFuentes: boolean } {
  const marker = '## Fuentes ancladas'
  const index = markdown.indexOf(marker)
  if (index === -1) return { body: markdown, hayFuentes: false }
  return { body: markdown.slice(0, index).replace(/\n+$/, '\n'), hayFuentes: true }
}
