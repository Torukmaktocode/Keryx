import { generateKeyPairSync } from 'node:crypto'

const par = generateKeyPairSync('ed25519')
const privada = par.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()
const publica = par.publicKey.export({ type: 'spki', format: 'pem' }).toString()

console.log('=== LICENCIA_PRIVADA (solo para: npx wrangler secret put LICENCIA_PRIVADA) ===')
console.log(privada)
console.log('=== LICENCIA_PUBLICA (pegar en apps/desktop/src/main/clave-publica.ts) ===')
console.log(publica)
console.log('NUNCA guardes el PEM privado en el repo ni en el chat.')
