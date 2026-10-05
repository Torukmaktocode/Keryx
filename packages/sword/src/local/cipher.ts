/**
 * Sapphire II stream cipher (dominio publico, Michael Paul Johnson),
 * portado desde la implementacion de SWORD para descifrar modulos con
 * CipherKey. Ver swcipher.cpp / sapphire.cpp de CrossWire.
 */

const LATS = 'bceafgijklhmpqBrHostTuwxyAdCDzEFIJKGLNO7PQMRSUVWXY9012Z364n8v5'

const CHAR_HASH = new Map<string, number>()
for (let i = 0; i < LATS.length; i++) CHAR_HASH.set(LATS[i], i)

export function personalize(buf: string, encode: boolean): string {
  const segs: string[][] = [[], [], [], [], []]
  let segn = 0
  for (let i = 0; i < buf.length && segn < 5; i++) {
    if (buf[i] === '-') segn += 1
    else segs[segn].push(buf[i])
  }
  const chkSum = segs[4].join('')
  if (segs[4].length < 5) {
    segs[4] = ['\0', '\0', '\0', '\0']
  }
  let result = ''
  for (let i = 0; i < 4; i++) {
    let csum = 0
    for (let j = 0; j < segs[i].length && j < segs[0].length; j++) {
      const hash = CHAR_HASH.get(segs[i][j]) ?? 0
      let obfusHash = CHAR_HASH.get(segs[0][j % segs[0].length]) ?? 0
      if (encode) {
        obfusHash = hash - (i ? obfusHash : 0)
        if (obfusHash < 0) obfusHash = 62 + obfusHash
      } else {
        obfusHash = (hash + (i ? obfusHash : 0)) % 62
      }
      if (i) segs[i][j] = LATS[obfusHash]
      csum += encode ? obfusHash : hash
    }
    segs[4][i] = LATS[csum % 62]
    if (result.length) result += '-'
    result += !encode && !i ? '' : segs[i].join('')
  }
  if (encode) result += `-${segs[4].join('')}`
  return !encode && chkSum !== segs[4].join('') ? buf : result
}

export class Sapphire {
  private cards = new Uint8Array(256)
  private rotor = 0
  private ratchet = 0
  private avalanche = 0
  private lastPlain = 0
  private lastCipher = 0

  constructor(key?: Uint8Array) {
    if (key && key.length) this.initialize(key)
  }

  private keyrand(
    limit: number,
    key: Uint8Array,
    keysize: number,
    rsum: { value: number },
    keypos: { value: number }
  ): number {
    if (!limit) return 0
    let retry = 0
    let mask = 1
    while (mask < limit) mask = (mask << 1) + 1
    let u: number
    do {
      rsum.value = (this.cards[rsum.value] + key[keypos.value++]) & 0xff
      if (keypos.value >= keysize) {
        keypos.value = 0
        rsum.value = (rsum.value + keysize) & 0xff
      }
      u = mask & rsum.value
      if (++retry > 11) u %= limit
    } while (u > limit)
    return u
  }

  initialize(key: Uint8Array): void {
    const keysize = key.length
    for (let i = 0; i < 256; i++) this.cards[i] = i
    const rsum = { value: 0 }
    const keypos = { value: 0 }
    for (let i = 255; i >= 0; i--) {
      const toswap = this.keyrand(i, key, keysize, rsum, keypos)
      const swaptemp = this.cards[i]
      this.cards[i] = this.cards[toswap]
      this.cards[toswap] = swaptemp
    }
    this.rotor = this.cards[1]
    this.ratchet = this.cards[3]
    this.avalanche = this.cards[5]
    this.lastPlain = this.cards[7]
    this.lastCipher = this.cards[rsum.value]
  }

  clone(): Sapphire {
    const copy = new Sapphire()
    copy.cards = this.cards.slice()
    copy.rotor = this.rotor
    copy.ratchet = this.ratchet
    copy.avalanche = this.avalanche
    copy.lastPlain = this.lastPlain
    copy.lastCipher = this.lastCipher
    return copy
  }

  private shuffle(): number {
    const oldRotor = this.rotor
    this.ratchet = (this.ratchet + this.cards[oldRotor]) & 0xff
    this.rotor = (oldRotor + 1) & 0xff
    const newRotor = this.rotor
    const swaptemp = this.cards[this.lastCipher]
    this.cards[this.lastCipher] = this.cards[this.ratchet]
    this.cards[this.ratchet] = this.cards[this.lastPlain]
    this.cards[this.lastPlain] = this.cards[newRotor]
    this.cards[newRotor] = swaptemp
    this.avalanche = (this.avalanche + this.cards[swaptemp]) & 0xff
    return swaptemp
  }

  decrypt(b: number): number {
    this.shuffle()
    const idx1 = (this.cards[this.ratchet] + this.cards[this.rotor]) & 0xff
    const idx2 =
      (this.cards[this.lastPlain] + this.cards[this.lastCipher] + this.cards[this.avalanche]) & 0xff
    this.lastPlain = (b ^ this.cards[idx1] ^ this.cards[this.cards[idx2]]) & 0xff
    this.lastCipher = b
    return this.lastPlain
  }

  encrypt(b: number): number {
    this.shuffle()
    const idx1 = (this.cards[this.ratchet] + this.cards[this.rotor]) & 0xff
    const idx2 =
      (this.cards[this.lastPlain] + this.cards[this.lastCipher] + this.cards[this.avalanche]) & 0xff
    this.lastCipher = (b ^ this.cards[idx1] ^ this.cards[this.cards[idx2]]) & 0xff
    this.lastPlain = b
    return this.lastCipher
  }
}

export class SwordCipher {
  private readonly master: Sapphire

  constructor(key: string) {
    const personalized = personalize(key, false)
    const bytes = new Uint8Array(personalized.length)
    for (let i = 0; i < personalized.length; i++) bytes[i] = personalized.charCodeAt(i) & 0xff
    this.master = new Sapphire(bytes)
  }

  decipher(input: Buffer): Buffer {
    const work = this.master.clone()
    const out = Buffer.allocUnsafe(input.length)
    for (let i = 0; i < input.length; i++) out[i] = work.decrypt(input[i])
    return out
  }
}
