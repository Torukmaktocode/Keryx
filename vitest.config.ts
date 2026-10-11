import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

const pkg = (name: string): string => resolve(process.cwd(), 'packages', name, 'src', 'index.ts')

export default defineConfig({
  resolve: {
    alias: {
      '@keryx/core': pkg('core'),
      '@keryx/sword': pkg('sword'),
      '@keryx/db': pkg('db'),
      '@keryx/editor': pkg('editor'),
      '@keryx/templates': pkg('templates')
    }
  },
  test: {
    environment: 'node',
    include: ['packages/**/*.test.ts', 'apps/**/*.test.ts']
  }
})
