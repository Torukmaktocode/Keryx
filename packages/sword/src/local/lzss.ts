/**
 * LZSS (STEP/SWORD, dominio publico) portado desde la implementacion de
 * CrossWire (sword/lzss.cpp y JSword LZSS.java, Okumura 1989).
 *
 * Formato: ring buffer de 4096, ventana de 18 bytes, umbral 3. Cada grupo de
 * 8 unidades viene precedido por un byte de flags (bit LSB primero, y 1 =
 * literal, 0 = par <posicion, longitud> de 2 bytes).
 */

const RING_SIZE = 4096
const RING_WRAP = RING_SIZE - 1
const MAX_STORE_LENGTH = 18
const THRESHOLD = 3

export function lzssDecompress(input: Buffer, expectedSize?: number): Buffer {
  let out =
    expectedSize && expectedSize > 0
      ? Buffer.alloc(expectedSize)
      : Buffer.alloc(Math.max(input.length * 2, 64))
  let outLen = 0

  const ring = Buffer.alloc(RING_SIZE + MAX_STORE_LENGTH - 1, 0x20)
  let r = RING_SIZE - MAX_STORE_LENGTH

  let flags = 0
  let flagCount = 0
  let pos = 0

  const grow = (needed: number): void => {
    if (outLen + needed <= out.length) return
    let size = out.length
    while (size < outLen + needed) size *= 2
    const next = Buffer.alloc(size)
    out.copy(next, 0, 0, outLen)
    out = next
  }

  while (pos < input.length) {
    if (flagCount > 0) {
      flags = (flags >> 1) & 0xff
      flagCount--
    } else {
      flags = input[pos++] & 0xff
      flagCount = 7
    }

    if ((flags & 1) !== 0) {
      if (pos >= input.length) break
      const byte = input[pos++]
      if (outLen + 1 > out.length) grow(1)
      out[outLen++] = byte
      ring[r] = byte
      r = (r + 1) & RING_WRAP
    } else {
      if (pos + 2 > input.length) break
      const b0 = input[pos++]
      const b1 = input[pos++]
      const matchPos = (b0 & 0xff) | ((b1 & 0xf0) << 4)
      const len = (b1 & 0x0f) + THRESHOLD
      if (outLen + len > out.length) grow(len)
      for (let k = 0; k < len; k++) {
        const value = ring[(matchPos + k) & RING_WRAP]
        out[outLen++] = value
        ring[r] = value
        r = (r + 1) & RING_WRAP
      }
    }
  }

  return out.subarray(0, outLen)
}
