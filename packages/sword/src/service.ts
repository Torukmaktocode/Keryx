import type {
  BookInfo,
  ModuleCoverage,
  Repository,
  SearchOptions,
  SearchResult,
  StrongsEntry,
  SwordModule,
  Verse
} from '@keryx/core'
import type { SwordProvider } from './provider'
import { DemoSwordProvider } from './demo-provider'
import { NativeSwordProvider, tryLoadNativeSword } from './native-provider'
import { LocalSwordProvider } from './local/local-provider'
import { EswordProvider } from './local/esword'
import { CompositeSwordProvider } from './local/composite'

export class SwordService {
  private constructor(
    private readonly provider: SwordProvider,
    private readonly nativeLoaded: boolean
  ) {}

  static async create(
    dataPath?: string,
    eswordPath?: string,
    bibliotecaPath?: string
  ): Promise<SwordService> {
    const providers: SwordProvider[] = []
    if (dataPath) {
      try {
        const local = LocalSwordProvider.create(dataPath)
        if (local) providers.push(local)
      } catch {
        // ignora
      }
    }
    const extraRoots = bibliotecaPath ? [bibliotecaPath] : []
    if (eswordPath || bibliotecaPath) {
      try {
        const esword = EswordProvider.create(eswordPath ?? '', extraRoots)
        if (esword) providers.push(esword)
      } catch {
        // ignora
      }
    }
    if (providers.length === 1) return new SwordService(providers[0], true)
    if (providers.length > 1) return new SwordService(new CompositeSwordProvider(providers), true)

    const native = await tryLoadNativeSword()
    if (native) {
      try {
        return new SwordService(new NativeSwordProvider(native), true)
      } catch {
        // cae al proveedor demo
      }
    }
    return new SwordService(new DemoSwordProvider(), false)
  }

  get usingNative(): boolean {
    return this.nativeLoaded
  }

  get providerKind(): 'native' | 'local' | 'demo' {
    return this.provider.kind
  }

  repositories(): Promise<Repository[]> {
    return this.provider.repositories()
  }

  listLocalModules(): Promise<SwordModule[]> {
    return this.provider.listLocalModules()
  }

  listRemoteModules(repository?: string): Promise<SwordModule[]> {
    return this.provider.listRemoteModules(repository)
  }

  installModule(name: string, repository?: string): Promise<void> {
    return this.provider.installModule(name, repository)
  }

  uninstallModule(name: string): Promise<void> {
    return this.provider.uninstallModule(name)
  }

  getBooks(module?: string): Promise<BookInfo[]> {
    return this.provider.getBooks(module ?? '')
  }

  getChapter(module: string, book: string, chapter: number): Promise<Verse[]> {
    return this.provider.getChapter(module, book, chapter)
  }

  getVerse(module: string, book: string, chapter: number, verse: number): Promise<Verse | null> {
    return this.provider.getVerse(module, book, chapter, verse)
  }

  commentaryVerses(module: string, book: string, chapter: number): Promise<number[]> {
    return this.provider.commentaryVerses(module, book, chapter)
  }

  commentaryCoverage(book: string, chapter: number): Promise<ModuleCoverage[]> {
    return this.provider.commentaryCoverage(book, chapter)
  }

  dictCoverage(term: string): Promise<ModuleCoverage[]> {
    return this.provider.dictCoverage(term)
  }

  search(options: SearchOptions): Promise<SearchResult[]> {
    return this.provider.search(options)
  }

  lookupDict(module: string, key: string): Promise<string | null> {
    return this.provider.lookupDict(module, key)
  }

  lookupLemma(module: string, lemma: string): Promise<{ topic: string; definition: string } | null> {
    return this.provider.lookupLemma(module, lemma)
  }

  strongsOccurrences(
    code: string,
    limit = 600
  ): Promise<Array<{ book: string; chapter: number; verse: number; word: string; morphology: string }>> {
    return this.provider.strongsOccurrences(code, limit)
  }

  strongs(key: string): Promise<StrongsEntry | null> {
    return this.provider.strongs(key)
  }
}
