export const IPC = {
  appVersion: 'app:version',
  appPlatform: 'app:platform',
  appEngine: 'app:engine',

  windowSetFullscreen: 'window:set-fullscreen',
  windowIsFullscreen: 'window:is-fullscreen',
  windowToggleFullscreen: 'window:toggle-fullscreen',
  windowSetZoom: 'window:set-zoom',

  modulesList: 'modules:list',
  modulesRemote: 'modules:remote',
  modulesRefresh: 'modules:refresh',
  modulesInstall: 'modules:install',
  modulesUninstall: 'modules:uninstall',
  modulesRepositories: 'modules:repositories',
  modulesSyncRepos: 'modules:sync-repos',

  bibleBooks: 'bible:books',
  bibleChapter: 'bible:chapter',
  bibleVerse: 'bible:verse',
  bibleCommentaryVerses: 'bible:commentary-verses',
  bibleCommentaryCoverage: 'bible:commentary-coverage',
  bibleSearch: 'bible:search',
  bibleSearchCount: 'bible:search-count',
  bibleSuggest: 'bible:suggest',
  bibleCheckSpelling: 'bible:check-spelling',
  bibleCompare: 'bible:compare',

  dictLookup: 'dict:lookup',
  dictEntries: 'dict:entries',
  dictStrongs: 'dict:strongs',
  dictCoverage: 'dict:coverage',
  dictLemma: 'dict:lemma',
  bibleStrongsOccurrences: 'bible:strongs-occurrences',

  documentsList: 'documents:list',
  documentsGet: 'documents:get',
  documentsSave: 'documents:save',
  documentsCreate: 'documents:create',
  documentsRemove: 'documents:remove',

  settingsGet: 'settings:get',
  settingsSet: 'settings:set',

  presentationsSave: 'presentations:save',

  translateStatus: 'translate:status',
  translateRequest: 'translate:translate',
  translateInstall: 'translate:install',

  aiChat: 'ai:chat',
  aiStatus: 'ai:status'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
