import type { SwordModule } from '@keryx/core'

export function isChamplin(m: SwordModule): boolean {
  return m.name.toLowerCase().startsWith('champlin')
}

export function moduleLabel(m: SwordModule): string {
  const description = (m.description || '').trim()
  return isChamplin(m) && description ? description : m.name
}
