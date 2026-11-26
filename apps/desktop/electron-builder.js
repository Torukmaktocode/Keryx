const { existsSync } = require('node:fs')
const { join } = require('node:path')

const extraResources = [
  {
    from: '../../scripts/traductor_daemon.py',
    to: 'scripts/traductor_daemon.py'
  },
  {
    from: '../../scripts/instalar_dialectos.py',
    to: 'scripts/instalar_dialectos.py'
  }
]

// Daemon de traduccion congelado (PyInstaller): traduccion sin Python.
if (existsSync(join(__dirname, 'build', 'daemon'))) {
  extraResources.push({
    from: 'build/daemon',
    to: 'daemon'
  })
}

// Corpus verificado + glosarios de lenguas nativas (small, van dentro del DMG).
if (existsSync(join(__dirname, 'corpus'))) {
  extraResources.push({
    from: 'corpus',
    to: 'corpus',
    filter: ['*.db', 'glosario_*.json']
  })
}

// Pack completo: modelos neuronales de lenguas nativas dentro del DMG
// (solo cuando el workflow los restaura antes de compilar).
if (existsSync(join(__dirname, 'dialectos'))) {
  extraResources.push({
    from: 'dialectos',
    to: 'dialectos',
    filter: ['*/model.bin', '*/preprocessor_config.json', '*/tokenizer*', '*/source.spm', '*/target.spm', '*/vocab*', '*/shared_voc*']
  })
}

// La clave de IA NO viaja en los instaladores: la app usa el proxy
// /ai/chat del Worker, que la guarda como secret del servidor.

if (existsSync(join(__dirname, 'biblioteca'))) {
  extraResources.push({
    from: 'biblioteca',
    to: 'biblioteca',
    filter: ['**/*', '!**/*.rar', '!**/desktop.ini']
  })
}

if (existsSync(join(__dirname, 'coalicion'))) {
  extraResources.push({
    from: 'coalicion',
    to: 'coalicion',
    filter: ['articulos.jsonl']
  })
}

// Paquetes Argos de idiomas grandes: precargados offline en la primera
// instalacion (el daemon los instala desde KERYX_ARGOS_PRELOAD).
if (existsSync(join(__dirname, 'argos-preload'))) {
  extraResources.push({
    from: 'argos-preload',
    to: 'argos-preload',
    filter: ['*.argosmodel']
  })
}

module.exports = {
  appId: 'org.keryx.app',
  productName: 'Keryx',
  directories: {
    buildResources: 'build'
  },
  files: ['out/**/*', 'package.json'],
  extraResources,
  asar: true,
  compression: 'maximum',
  electronLanguages: ['es', 'en-US', 'pt-BR', 'pt-PT', 'it', 'fr', 'de', 'zh-CN'],
  removePackageScripts: true,
  nsis: {
    differentialPackage: false
  },
  win: {
    target: ['nsis']
  },
  mac: {
    target: [{ target: 'dmg', arch: ['arm64', 'x64'] }],
    category: 'public.app-category.reference',
    identity: null,
    minimumSystemVersion: '11.0.0'
  },
  linux: {
    target: ['AppImage', 'deb'],
    category: 'Education'
  }
}
