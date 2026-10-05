import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { app } from 'electron'
import type { AiChatRequest, AiChatResult, AiStatus, AppSettings } from '@keryx/core'

const OPENCODE_PROVIDERS = ['opencode', 'opencode-go'] as const

function authCandidatePaths(): string[] {
  const home = homedir()
  return [
    process.env.KERYX_OPENCODE_AUTH,
    join(home, '.local', 'share', 'opencode', 'auth.json'),
    join(process.env.APPDATA ?? '', 'opencode', 'auth.json'),
    join(process.env.LOCALAPPDATA ?? '', 'opencode', 'auth.json'),
    join(home, '.config', 'opencode', 'auth.json')
  ].filter((value): value is string => Boolean(value))
}

/** Busca una clave de OpenCode Zen/Go en el equipo del usuario. */
export function detectOpencodeKey(): string | null {
  for (const path of authCandidatePaths()) {
    try {
      if (!existsSync(path)) continue
      const parsed = JSON.parse(readFileSync(path, 'utf-8')) as Record<
        string,
        { type?: string; key?: string } | string
      >
      for (const provider of OPENCODE_PROVIDERS) {
        const entry = parsed[provider]
        if (typeof entry === 'string' && entry) return entry
        if (entry && typeof entry === 'object' && entry.key) return entry.key
      }
    } catch {
      // siguiente candidato
    }
  }
  return null
}

interface LocalAiConfig {
  key?: string
  baseUrl?: string
  model?: string
}

/** Lee la clave/proveedor desde un archivo local (gitignored) o variables de entorno. */
export function readLocalAiConfig(): LocalAiConfig {
  const cwd = process.cwd()
  const candidates = [
    process.env.KERYX_AI_CONFIG,
    join(cwd, 'ai.local.json'),
    join(cwd, '..', 'ai.local.json'),
    join(cwd, '..', '..', 'ai.local.json'),
    join(app.getAppPath(), 'ai.local.json'),
    join(app.getPath('userData'), 'ai.local.json')
  ].filter((value): value is string => Boolean(value))
  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue
      const parsed = JSON.parse(readFileSync(path, 'utf-8')) as LocalAiConfig
      if (parsed.key || parsed.baseUrl || parsed.model) return parsed
    } catch {
      // siguiente candidato
    }
  }
  const envKey = process.env.KERYX_AI_KEY ?? process.env.OPENAI_API_KEY
  if (envKey) return { key: envKey }
  return {}
}

function normalizeBaseUrl(value: string): string {
  const trimmed = (value || '').trim().replace(/\/+$/, '')
  return trimmed || 'https://api.openai.com/v1'
}

interface ResolvedAi {
  enabled: boolean
  baseUrl: string
  model: string
  apiKey: string
  source: AiStatus['source']
}

export function resolveAi(settings: AppSettings): ResolvedAi {
  const detected = detectOpencodeKey()
  const local = readLocalAiConfig()
  const settingKey = settings.aiApiKey?.trim()
  const apiKey = settingKey || local.key || detected || ''
  const source: AiStatus['source'] = settingKey
    ? 'settings'
    : local.key
      ? 'env'
      : detected
        ? 'opencode'
        : 'none'
  return {
    enabled: settings.aiEnabled,
    baseUrl: normalizeBaseUrl(settings.aiBaseUrl || local.baseUrl || ''),
    model: settings.aiModel?.trim() || local.model || 'gpt-4o-mini',
    apiKey,
    source
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const text = await response.text()
    try {
      const parsed = JSON.parse(text) as { error?: { message?: string } | string }
      if (parsed.error) {
        return typeof parsed.error === 'string' ? parsed.error : (parsed.error.message ?? text)
      }
    } catch {
      // texto plano
    }
    return text || `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

export async function aiChat(
  settings: AppSettings,
  request: AiChatRequest
): Promise<AiChatResult> {
  const ai = resolveAi(settings)
  if (!ai.apiKey) {
    throw new Error(
      'Sin clave de IA. Añade una en Ajustes o instala OpenCode con una sesión iniciada.'
    )
  }
  const response = await fetch(`${ai.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ai.apiKey}`
    },
    body: JSON.stringify({
      model: ai.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.6,
      max_tokens: request.maxTokens ?? 1200
    })
  })
  if (!response.ok) {
    throw new Error(await readError(response))
  }
  const data = (await response.json()) as {
    model?: string
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = data.choices?.[0]?.message?.content?.trim() ?? ''
  if (!text) throw new Error('La IA devolvió una respuesta vacía.')
  return { text, model: data.model ?? ai.model }
}

export async function aiStatus(settings: AppSettings): Promise<AiStatus> {
  const ai = resolveAi(settings)
  const status: AiStatus = {
    configured: Boolean(ai.apiKey),
    source: ai.source,
    baseUrl: ai.baseUrl,
    model: ai.model,
    models: []
  }
  if (!ai.apiKey) return status
  try {
    const response = await fetch(`${ai.baseUrl}/models`, {
      headers: { Authorization: `Bearer ${ai.apiKey}` }
    })
    if (!response.ok) {
      status.error = await readError(response)
      return status
    }
    const data = (await response.json()) as { data?: Array<{ id?: string }> }
    status.models = (data.data ?? [])
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id))
      .sort((a, b) => a.localeCompare(b))
  } catch (error) {
    status.error = error instanceof Error ? error.message : String(error)
  }
  return status
}
