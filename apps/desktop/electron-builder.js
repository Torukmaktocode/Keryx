const { existsSync } = require('node:fs')
const { join } = require('node:path')

const extraResources = [
  {
    from: '../../scripts/traductor_daemon.py',
    to: 'scripts/traductor_daemon.py'
  }
]

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
