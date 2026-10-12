// @vitest-environment jsdom
import { describe, expect, it, vi, beforeAll } from 'vitest'
import { runCreator, composeSermonSkeleton, assembleSermon } from './creator'
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

describe('esqueleto + ensamble (codigo primero)', () => {
  it('el esqueleto trae texto, puntos, evidencia y marcadores de voz', async () => {
    const scaffold: Parameters<typeof composeSermonSkeleton>[2] = {
      section: 'Juan 3:16',
      chars: 1000,
      citations: [],
      query: 'Juan 3:16',
      sections: [
        { kind: 'texto', title: 'Juan 3', entries: ['16 Por que de tal manera amó Dios...'] },
        { kind: 'bosquejo', title: 'Bosquejo', entries: ['1. La fuente del amor', '2. La extensión del amor'] },
        { kind: 'comentario', title: 'Comentario', entries: ['[Comentario Real] Dios amó...'] }
      ]
    } as never
    const skeleton = composeSermonSkeleton('crearsermon', 'Juan 3:16', scaffold, { name: 'Predicador' } as never)
    expect(skeleton).toContain('## Gancho')
    expect(skeleton).toContain('[[GANCHO]]')
    expect(skeleton).toContain('## Gran idea')
    expect(skeleton).toContain('. La fuente del amor')
  })

  it('assembleSermon nunca deja marcadores y usa fallbacks deterministas', () => {
    const out = assembleSermon('X [[GANCHO]] Y [[PUENTE 1]] Z [[ORACION]] W', { bridges: [] }, 'Juan 3:16')
    expect(out).not.toContain('[[')
    expect(out.length).toBeGreaterThan(40)
  })

  it('modo economia: 1 llamada, cuerpo de codigo, voz insertada', async () => {
    state.chat = vi.fn(async () => ({
      text: '==GANCHO==\nMirad el asombro.\n==PUENTE 1==\nVamos con calma.\n==ORACION==\nDios, gracias.',
      role: 'assistant'
    })) as unknown as typeof state.chat
    const result = await runCreator(mkCtx({}), 'crearsermon', 'Juan 3:16', 'escudero')
    expect(state.chat).toHaveBeenCalledTimes(1)
    expect(result.aiUsed).toBe(true)
    expect(result.markdown).toContain('Mirad el asombro')
    expect(result.markdown).toContain('## Gran idea')
    expect(result.markdown).not.toContain('[[')
  })

  it('IA apagada: esqueleto completo con fallbacks, hasta 0 llamadas', async () => {
    const chat = vi.fn(() => {
      throw new Error('no')
    })
    state.chat = chat as unknown as typeof state.chat
    const result = await runCreator(mkCtx({ aiEnabled: false }), 'crearsermon', 'Juan 3:16', 'escudero')
    expect(result.aiUsed).toBe(false)
    expect(chat).not.toHaveBeenCalled()
    expect(result.markdown).toContain('## El mensaje')
    expect(result.markdown).not.toContain('[[')
  })

  it('deepSermon on: 3 llamadas y usa la final (modo calidad)', async () => {
    state.chat = vi.fn(async () => ({ text: 'FINAL\n\n## Sección', role: 'assistant' })) as unknown as typeof state.chat
    const result = await runCreator(mkCtx({ deepSermon: true }), 'crearsermon', 'Romanos 8:28', 'escudero')
    expect(state.chat).toHaveBeenCalledTimes(3)
    expect(result.aiUsed).toBe(true)
    expect(result.markdown).toContain('## Sección')
  })

  it('deepSermon: si la critica falla, fallback local completo', async () => {
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
})
