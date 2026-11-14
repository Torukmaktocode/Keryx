import { createHash } from 'node:crypto'

export function calcularHuella(piezas: string[]): string {
  return createHash('sha256').update(piezas.join('\u0000')).digest('hex')
}
