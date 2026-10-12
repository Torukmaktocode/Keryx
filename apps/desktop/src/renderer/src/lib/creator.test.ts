// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest'
import { runCreator } from './creator'
import type { AssistantContext } from './assistant'
import type { AppSettings, SwordModule } from '@keryx/core'

const state = { chat: vi.fn<(req: unknown) => Promise<{ text: string; role: string }>>() }

vi.mock('./api', () => ({
  api: {
    bible: {
      chapter: vi.fn(async () => [{ verse: 16, text: 'amor y unigenito' }]),
      verse: vi.fn(async () => ({ verse: 16, text: 'Comentario anclado del verso.' })),
      commentaryCoverage: vi.fn(async () => [{ module: 'Comentario Real', hits: 3 }]),
      search: vi.fn(async () => []),
      strongsOccurrences: vi.fn(async () => []),
      books: vi.fn(async () => []),
      compare: vi.fn(async () => [])
    },
    dict: {
      lookup: vi.fn(async () => null),
      strongs: vi.fn(async () => null),
      coverage: vi.fn(async () => []),
      lookupLemma: vi.fn(async () => null)
    },
    ai: {
      chat: (req: unknown) => state.chat(req)
    }
  }
}))

const modules: SwordModule[] = [
  { name: 'Reina Valera 1960 con Strong', description: '', category: 'Bible', lang: 'es', driver: '', encoding: '', version: '', installed: true, source: 'local' },
  { name: 'Comentario Real', description: '', category: 'Commentary', lang: 'es', driver: '', encoding: '', version: '', installed: true, source: 'local' }
]

beforeAll(() => {
  state.chat.mockReset()
})

function mkCtx(overrides: { deepSermon?: boolean; aiEnabled?: boolean }): AssistantContext {
  const settings = {
    priorityModules: [],
    aiEnabled: overrides.aiEnabled ?? true,
    deepSermon: overrides.deepSermon ?? false,
    locale: 'es'
  } as unknown as AppSettings
  return { modules, locale: 'es', settings } as unknown as AssistantContext
}

describe('deepSermon (doble pasada opt-in)', () => {
  it('IA apagada: fallback determinista con 0 llamadas', async () => {
    const chat = vi.fn(() => {
      throw new Error('no debe llamarse')
    })
    state.chat = chat as unknown as typeof state.chat
    const result = await runCreator(mkCtx({ aiEnabled: false }), 'crearsermon', 'Juan 3:16', 'escudero')
    expect(result.aiUsed).toBe(false)
    expect(chat).not.toHaveBeenCalled()
    expect(result.markdown).toContain('#')
  })

  it('deepSermon on: la critica falla, fallback local completo', async () => {
    let calls = 0
    state.chat = vi.fn(() => {
      calls += 1
      if (calls === 2) throw new Error('fallo de red')
      return Promise.resolve({ text: 'borrador', role: 'assistant' })
    }) as unknown as typeof state.chat
    const result = await runCreator(mkCtx({ deepSermon: true }), 'crearsermon', 'Juan 3:16', 'escudero')
    expect(calls).toBe(2)
    expect(result.aiUsed).toBe(false)
    expect(result.markdown).toContain('## ')
  })

  it('deepSermon on sin fallos: 3 llamadas y usa la final', async () => {
    state.chat = vi.fn(async () => ({ text: 'FINAL-CON-SECCIONES\n\n## Sección', role: 'assistant' })) as unknown as typeof state.chat
    const result = await runCreator(mkCtx({ deepSermon: true }), 'crearsermon', 'Romanos 8:28', 'escudero')
    expect(state.chat).toHaveBeenCalledTimes(3)
    expect(result.aiUsed).toBe(true)
    expect(result.markdown).toContain('## Sección')
  })
})
