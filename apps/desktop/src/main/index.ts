import { app, BrowserWindow, shell } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { registerIpc } from './ipc'

function resolveSwordPath(): string {
  const candidates = [
    process.env.KERYX_SWORD_PATH,
    join(process.cwd(), 'sword'),
    join(process.resourcesPath, 'sword'),
    join(app.getAppPath(), '..', '..', 'sword'),
    join(app.getAppPath(), '..', 'sword'),
    join(app.getPath('userData'), 'sword')
  ].filter((value): value is string => Boolean(value))
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'mods.d'))) return candidate
  }
  return join(app.getPath('userData'), 'sword')
}

function resolveEswordPath(): string {
  const candidates = [
    process.env.KERYX_ESWORD_PATH,
    join(process.cwd(), 'esword'),
    join(process.resourcesPath, 'esword'),
    join(app.getAppPath(), '..', '..', 'esword'),
    join(app.getAppPath(), '..', 'esword'),
    join(app.getPath('userData'), 'esword')
  ].filter((value): value is string => Boolean(value))
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return join(app.getPath('userData'), 'esword')
}

function resolveBibliotecaPath(): string | undefined {
  const candidates = [
    process.env.KERYX_BIBLIOTECA_PATH,
    join(process.cwd(), 'biblioteca'),
    join(process.resourcesPath, 'biblioteca'),
    join(app.getAppPath(), '..', '..', 'biblioteca'),
    join(app.getAppPath(), '..', 'biblioteca'),
    join(app.getPath('userData'), 'biblioteca')
  ].filter((value): value is string => Boolean(value))
  let userHome = ''
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
    if (!userHome) userHome = candidate
  }
  return userHome || undefined
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 940,
    minHeight: 620,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#fbfaf7',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  window.on('ready-to-show', () => window.show())

  window.webContents.setWindowOpenHandler((details) => {
    void shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    void window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('org.keryx.app')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const store = await registerIpc(resolveSwordPath(), resolveEswordPath(), resolveBibliotecaPath())
  window_all_closed_flush = (): void => store?.flush()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

let window_all_closed_flush: (() => void) | undefined

app.on('window-all-closed', () => {
  window_all_closed_flush?.()
  if (process.platform !== 'darwin') app.quit()
})
