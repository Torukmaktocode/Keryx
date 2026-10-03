import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const pkg = (name: string): string => resolve(__dirname, '../../packages', name, 'src')

const alias = {
  '@keryx/core': pkg('core'),
  '@keryx/sword': pkg('sword'),
  '@keryx/db': pkg('db'),
  '@keryx/editor': pkg('editor'),
  '@keryx/templates': pkg('templates'),
  '@keryx/ui': pkg('ui'),
  '@keryx/i18n': pkg('i18n'),
  '@renderer': resolve(__dirname, 'src/renderer/src')
}

export default defineConfig({
  main: {
    resolve: { alias },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: { alias },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: { alias },
    plugins: [react()]
  }
})
