import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import zlib from 'node:zlib'
import { SwordCipher } from './cipher'
import { lzssDecompress } from './lzss'

function inflate(buf: Buffer, expectedSize?: number): Buffer {
  try {
    return zlib.inflateSync(buf)
  } catch {
    // sin cabecera zlib (deflate crudo)
  }
  try {
    return zlib.inflateRawSync(buf)
  } catch {
    // otros formatos
  }
  return lzssDecompress(buf, expectedSize)
}

function keyLineEnd(buf: Buffer): number {
  const nl = buf.indexOf(0x0a)
  if (nl !== -1) return nl
  for (let i = 0; i < buf.length; i++) {
    const c = buf[i]
    if (c === 0x5c || c === 0x0d) return i
  }
  return buf.length
}

function cleanKey(value: string): string {
  return value.replace(/[\r\\]+$/, '').trim()
}

function normalizeKey(value: string): string {
  return value.trim().toUpperCase()
}

/** Biblias y comentarios comprimidos (zText / zCom / zCom4). */
export class ZTextModule {
  private readonly verseIndex = new Map<number, Buffer>()
  private readonly blockIndex = new Map<number, Buffer>()
  private readonly data = new Map<number, Buffer>()
  private readonly blockCache = new Map<string, Buffer>()
  private readonly cipher: SwordCipher | null

  constructor(
    private readonly dir: string,
    cipherKey?: string | null,
    compressType = 'ZIP',
    // zText/zCom v2 usa entradas de 10 bytes (size u16); la serie 4 usa 12 (size u32).
    private readonly entrySize = 10
  ) {
    this.cipher = cipherKey ? new SwordCipher(cipherKey) : null
    this.compressType = compressType.toUpperCase()
  }

  private readonly compressType: string

  private family(testament: 1 | 2): { v: string; s: string; z: string } | null {
    const prefix = testament === 1 ? 'ot' : 'nt'
    for (const ext of ['c', 'b', 'x']) {
      const v = join(this.dir, `${prefix}.${ext}zv`)
      if (existsSync(v)) {
        return { v, s: join(this.dir, `${prefix}.${ext}zs`), z: join(this.dir, `${prefix}.${ext}zz`) }
      }
    }
    return null
  }

  private load(testament: 1 | 2): boolean {
    const fam = this.family(testament)
    if (!fam) return false
    if (!this.verseIndex.has(testament)) {
      this.verseIndex.set(testament, readFileSync(fam.v))
      this.blockIndex.set(testament, readFileSync(fam.s))
      this.data.set(testament, readFileSync(fam.z))
    }
    return true
  }

  private readBlock(testament: 1 | 2, block: number): Buffer {
    const cacheKey = `${testament}:${block}`
    const cached = this.blockCache.get(cacheKey)
    if (cached) return cached
    const index = this.blockIndex.get(testament)!
    const compOffset = index.readUInt32LE(block * 12)
    const compSize = index.readUInt32LE(block * 12 + 4)
    const uncompSize = index.readUInt32LE(block * 12 + 8)
    let raw: Buffer = this.data.get(testament)!.subarray(compOffset, compOffset + compSize)
    if (this.cipher) raw = this.cipher.decipher(raw)
    const out = this.inflateBlock(raw, uncompSize)
    this.blockCache.set(cacheKey, out)
    return out
  }

  private inflateBlock(raw: Buffer, expectedSize: number): Buffer {
    try {
      if (this.compressType === 'LZSS') return lzssDecompress(raw, expectedSize || undefined)
    } catch {
      // cae a la deteccion generica
    }
    return inflate(raw, expectedSize || undefined)
  }

  getVerse(testament: 1 | 2, slot: number): string | null {
    if (!this.load(testament)) return null
    const index = this.verseIndex.get(testament)!
    const pos = slot * this.entrySize
    if (pos + this.entrySize > index.length) return null
    const block =
      this.entrySize === 12 ? index.readUInt32LE(pos) : index.readUInt32LE(pos)
    const offset = index.readUInt32LE(pos + 4)
    const size =
      this.entrySize === 12 ? index.readUInt32LE(pos + 8) : index.readUInt16LE(pos + 8)
    if (size === 0) return ''
    const out = this.readBlock(testament, block)
    return out.subarray(offset, offset + size).toString('utf8')
  }

  /** Recorre todos los bloques y devuelve pares (slot, texto). */
  iterateVerses(testament: 1 | 2): Array<{ slot: number; text: string }> {
    if (!this.load(testament)) return []
    const index = this.verseIndex.get(testament)!
    const total = Math.floor(index.length / this.entrySize)
    const result: Array<{ slot: number; text: string }> = []
    for (let slot = 0; slot < total; slot++) {
      const text = this.getVerse(testament, slot)
      if (text) result.push({ slot, text })
    }
    return result
  }
}

/** Diccionarios sin comprimir (RawLD / RawLD4). */
export class RawLdModule {
  private readonly index: Buffer
  private readonly data: Buffer
  private readonly entrySize: number

  constructor(dir: string, prefix: string, raw4 = false) {
    this.index = readFileSync(join(dir, `${prefix}.idx`))
    this.data = readFileSync(join(dir, `${prefix}.dat`))
    this.entrySize = raw4 ? 8 : 6
  }

  get count(): number {
    return Math.floor(this.index.length / this.entrySize)
  }

  private readEntryAt(position: number): { key: string; text: string } {
    const start = this.index.readUInt32LE(position)
    const size = this.entrySize === 8 ? this.index.readUInt32LE(position + 4) : this.index.readUInt16LE(position + 4)
    const buf = this.data.subarray(start, start + size)
    const end = keyLineEnd(buf)
    const key = cleanKey(buf.subarray(0, end).toString('utf8'))
    const text = end < buf.length ? buf.subarray(end + 1).toString('utf8') : ''
    return { key, text }
  }

  private findPosition(key: string): number {
    const target = normalizeKey(key)
    let low = 0
    let high = this.count - 1
    while (low <= high) {
      const mid = (low + high) >> 1
      const { key: midKey } = this.readEntryAt(mid * this.entrySize)
      const a = normalizeKey(midKey)
      const cmp = a < target ? -1 : a > target ? 1 : 0
      if (cmp === 0) return mid * this.entrySize
      if (cmp < 0) low = mid + 1
      else high = mid - 1
    }
    return -1
  }

  private findNearest(key: string): number {
    const target = normalizeKey(key)
    let low = 0
    let high = this.count - 1
    let ans = -1
    while (low <= high) {
      const mid = (low + high) >> 1
      const { key: midKey } = this.readEntryAt(mid * this.entrySize)
      if (normalizeKey(midKey) >= target) {
        ans = mid
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    if (ans < 0) ans = this.count - 1
    return ans * this.entrySize
  }

  getEntry(key: string, snap = false): string | null {
    const position = this.findPosition(key)
    if (position >= 0) return this.readEntryAt(position).text
    if (!snap) return null
    const nearest = this.findNearest(key)
    if (nearest < 0) return null
    return this.readEntryAt(nearest).text
  }

  keys(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.count; i++) result.push(this.readEntryAt(i * this.entrySize).key)
    return result
  }
}

/** Diccionarios comprimidos (zLD). */
export class ZLdModule {
  private readonly index: Buffer
  private readonly data: Buffer
  private readonly blockIndex: Buffer
  private readonly blockData: Buffer
  private readonly cache = new Map<number, Buffer>()
  private readonly cipher: SwordCipher | null

  constructor(
    dir: string,
    prefix: string,
    cipherKey?: string | null,
    compressType = 'ZIP'
  ) {
    this.index = readFileSync(join(dir, `${prefix}.idx`))
    this.data = readFileSync(join(dir, `${prefix}.dat`))
    this.blockIndex = readFileSync(join(dir, `${prefix}.zdx`))
    this.blockData = readFileSync(join(dir, `${prefix}.zdt`))
    this.cipher = cipherKey ? new SwordCipher(cipherKey) : null
    this.compressType = compressType.toUpperCase()
  }

  private readonly compressType: string

  get count(): number {
    return Math.floor(this.index.length / 8)
  }

  private readDatEntry(position: number): { key: string; block: number; entry: number; link: string | null } {
    const start = this.index.readUInt32LE(position)
    const size = this.index.readUInt32LE(position + 4)
    const buf = this.data.subarray(start, start + size)
    const end = keyLineEnd(buf)
    const key = cleanKey(buf.subarray(0, end).toString('utf8'))
    const rest = buf.subarray(end + 1)
    if (rest.subarray(0, 5).toString('latin1') === '@LINK') {
      const linkEnd = rest.indexOf(0x0a)
      const link = rest.subarray(0, linkEnd === -1 ? rest.length : linkEnd).toString('utf8').slice(6).trim()
      return { key, block: 0, entry: 0, link }
    }
    return { key, block: rest.readUInt32LE(0), entry: rest.readUInt32LE(4), link: null }
  }

  private readBlock(block: number): Buffer {
    const cached = this.cache.get(block)
    if (cached) return cached
    const start = this.blockIndex.readUInt32LE(block * 8)
    const size = this.blockIndex.readUInt32LE(block * 8 + 4)
    let raw: Buffer = this.blockData.subarray(start, start + size)
    if (this.cipher) raw = this.cipher.decipher(raw)
    let out: Buffer
    if (this.compressType === 'LZSS') {
      try {
        // El tamaño sin comprimir queda al final del indice LZSS de SWORD.
        out = lzssDecompress(raw)
      } catch {
        out = inflate(raw)
      }
    } else {
      out = inflate(raw)
    }
    this.cache.set(block, out)
    return out
  }

  private getCompressed(block: number, entry: number): string {
    const out = this.readBlock(block)
    const offset = out.readUInt32LE(4 + entry * 8)
    const size = out.readUInt32LE(8 + entry * 8)
    if (!offset) return ''
    return out.subarray(offset, offset + size).toString('utf8')
  }

  private findPosition(key: string): number {
    const target = normalizeKey(key)
    let low = 0
    let high = this.count - 1
    while (low <= high) {
      const mid = (low + high) >> 1
      const { key: midKey } = this.readDatEntry(mid * 8)
      const a = normalizeKey(midKey)
      const cmp = a < target ? -1 : a > target ? 1 : 0
      if (cmp === 0) return mid * 8
      if (cmp < 0) low = mid + 1
      else high = mid - 1
    }
    return -1
  }

  private findNearest(key: string): number {
    const target = normalizeKey(key)
    let low = 0
    let high = this.count - 1
    let ans = -1
    while (low <= high) {
      const mid = (low + high) >> 1
      const { key: midKey } = this.readDatEntry(mid * 8)
      if (normalizeKey(midKey) >= target) {
        ans = mid
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    if (ans < 0) ans = this.count - 1
    return ans * 8
  }

  getEntry(key: string, snap = false): string | null {
    const position = this.findPosition(key)
    if (position < 0) {
      if (!snap) return null
      const nearest = this.findNearest(key)
      if (nearest < 0) return null
      const nearEntry = this.readDatEntry(nearest)
      if (nearEntry.link) return this.getEntry(nearEntry.link)
      return this.getCompressed(nearEntry.block, nearEntry.entry)
    }
    const entry = this.readDatEntry(position)
    if (entry.link) return this.getEntry(entry.link)
    return this.getCompressed(entry.block, entry.entry)
  }

  keys(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.count; i++) result.push(this.readDatEntry(i * 8).key)
    return result
  }
}
