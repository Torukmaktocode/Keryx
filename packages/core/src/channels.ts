export const IPC = {
  appVersion: 'app:version',
  appPlatform: 'app:platform',
  appEngine: 'app:engine',

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
  bibleSearch: 'bible:search',
  bibleCompare: 'bible:compare',

  dictLookup: 'dict:lookup',
  dictStrongs: 'dict:strongs',

  documentsList: 'documents:list',
  documentsGet: 'documents:get',
  documentsSave: 'documents:save',
  documentsCreate: 'documents:create',
  documentsRemove: 'documents:remove',

  settingsGet: 'settings:get',
  settingsSet: 'settings:set'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]
