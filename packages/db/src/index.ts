import { randomUUID } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { DEFAULT_SETTINGS, type AppSettings, type Document, type DocumentMeta } from '@keryx/core'

export { DEFAULT_SETTINGS }

interface StoreShape {
  version: number
  settings: AppSettings
  documents: Document[]
}

export interface Store {
  getSettings(): AppSettings
  setSettings(patch: Partial<AppSettings>): AppSettings
  listDocuments(): DocumentMeta[]
  getDocument(id: string): Document | null
  createDocument(input: { title: string; kind: Document['kind']; content?: string }): Document
  saveDocument(id: string, content: string, title?: string): Document
  removeDocument(id: string): void
}

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

function toMeta(doc: Document): DocumentMeta {
  return {
    id: doc.id,
    title: doc.title,
    kind: doc.kind,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    wordCount: doc.wordCount
  }
}

export class JsonStore implements Store {
  private data: StoreShape

  constructor(private readonly filePath: string) {
    this.data = this.load()
  }

  private load(): StoreShape {
    try {
      if (existsSync(this.filePath)) {
        const raw = readFileSync(this.filePath, 'utf-8')
        const parsed = JSON.parse(raw) as Partial<StoreShape>
        return {
          version: parsed.version ?? 1,
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
          documents: parsed.documents ?? []
        }
      }
    } catch {
      // archivo corrupto: se recrea
    }
    return { version: 1, settings: { ...DEFAULT_SETTINGS }, documents: [] }
  }

  private persist(): void {
    mkdirSync(dirname(this.filePath), { recursive: true })
    writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8')
  }

  getSettings(): AppSettings {
    return { ...this.data.settings }
  }

  setSettings(patch: Partial<AppSettings>): AppSettings {
    this.data.settings = { ...this.data.settings, ...patch }
    this.persist()
    return this.getSettings()
  }

  listDocuments(): DocumentMeta[] {
    return [...this.data.documents]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(toMeta)
  }

  getDocument(id: string): Document | null {
    return this.data.documents.find((d) => d.id === id) ?? null
  }

  createDocument(input: { title: string; kind: Document['kind']; content?: string }): Document {
    const now = new Date().toISOString()
    const content = input.content ?? ''
    const doc: Document = {
      id: randomUUID(),
      title: input.title,
      kind: input.kind,
      content,
      createdAt: now,
      updatedAt: now,
      wordCount: countWords(content)
    }
    this.data.documents.push(doc)
    this.persist()
    return doc
  }

  saveDocument(id: string, content: string, title?: string): Document {
    const doc = this.data.documents.find((d) => d.id === id)
    if (!doc) throw new Error(`Documento no encontrado: ${id}`)
    doc.content = content
    if (title !== undefined) doc.title = title
    doc.updatedAt = new Date().toISOString()
    doc.wordCount = countWords(content)
    this.persist()
    return doc
  }

  removeDocument(id: string): void {
    this.data.documents = this.data.documents.filter((d) => d.id !== id)
    this.persist()
  }
}
