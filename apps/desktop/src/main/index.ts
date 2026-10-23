import { app, BrowserWindow, shell } from 'electron'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { registerIpc } from './ipc'
import { cacheDescarga, prepararSalidaTraductor } from './traductor'

if (is.dev) app.commandLine.appendSwitch('remote-debugging-port', '9222')

function resolveSwordPath(): string {
  const devCandidates = app.isPackaged
    ? []
    : [process.env.KERYX_SWORD_PATH, join(process.cwd(), 'sword')]
  const candidates = [
    ...devCandidates,
    join(process.resourcesPath, 'sword'),
    join(app.getAppPath(), '..', 'sword'),
    join(app.getPath('userData'), 'sword')
  ].filter((value): value is string => Boolean(value))
  for (const candidate of candidates) {
    if (existsSync(join(candidate, 'mods.d'))) return candidate
  }
  return join(app.getPath('userData'), 'sword')
}

function resolveEswordPath(): string {
  const devCandidates = app.isPackaged
    ? []
    : [process.env.KERYX_ESWORD_PATH, join(process.cwd(), 'esword')]
  const candidates = [
    ...devCandidates,
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
  const devCandidates = app.isPackaged
    ? []
    : [process.env.KERYX_BIBLIOTECA_PATH, join(process.cwd(), 'biblioteca')]
  const candidates = [
    ...devCandidates,
    join(process.resourcesPath, 'biblioteca'),
    join(app.getAppPath(), '..', '..', 'biblioteca'),
    join(app.getAppPath(), '..', 'biblioteca'),
    join(app.getPath('userData'), 'biblioteca')
  ].filter((value): value is string => Boolean(value))
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return join(app.getPath('userData'), 'biblioteca')
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

  if (process.env['KERYX_DEBUG']) {
    window.webContents.on('console-message', (details) => {
      const message = typeof details === 'object' && details && 'message' in details ? String((details as { message: unknown }).message) : String(details)
      console.log('[renderer]', message.slice(0, 300))
    })
  }

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
  window_all_closed_flush = (): void => {
    store?.flush()
    cacheDescarga()
  }
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

let window_all_closed_flush: (() => void) | undefined

app.on('window-all-closed', () => {
  window_all_closed_flush?.()
  prepararSalidaTraductor()
  if (process.platform !== 'darwin') app.quit()
})
