import { useState } from 'react'
import { useI18n, LOCALES, type Locale } from '@keryx/i18n'
import type { AiStatus, AppSettings } from '@keryx/core'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'

const THEMES: AppSettings['theme'][] = ['light', 'sepia', 'dark']
const FOCUS: AppSettings['focusMode'][] = ['off', 'sentence', 'paragraph']
const WRITING_FONTS = ['iA Writer Quattro', 'IBM Plex Sans', 'system-ui', 'Georgia']
const READING_FONTS = ['serif', 'Georgia', 'iA Writer Quattro', 'system-ui']

export function SettingsView() {
  const { t } = useI18n()
  const settings = useAppStore((s) => s.settings)
  const update = useAppStore((s) => s.updateSettings)
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<AiStatus | null>(null)

  const testAi = async (): Promise<void> => {
    setTesting(true)
    try {
      setStatus(await api.ai.status())
    } catch {
      setStatus(null)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('settings.title')}</h1>
      </header>
      <div className="view-body">
        <div className="settings-section">
          <div className="settings-row">
            <label>{t('settings.language')}</label>
            <div className="segmented">
              {LOCALES.map((locale: Locale) => (
                <button
                  key={locale}
                  className={settings.uiLocale === locale ? 'active' : ''}
                  onClick={() => void update({ uiLocale: locale })}
                >
                  {t(`language.${locale}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <label>{t('settings.theme')}</label>
            <div className="segmented">
              {THEMES.map((theme) => (
                <button
                  key={theme}
                  className={settings.theme === theme ? 'active' : ''}
                  onClick={() => void update({ theme })}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <label>
              {t('settings.writingFont')}
              <span className="hint">{t('settings.writingFontHint')}</span>
            </label>
            <select
              className="select"
              value={settings.writingFont}
              onChange={(e) => void update({ writingFont: e.target.value })}
            >
              {WRITING_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-row">
            <label>{t('settings.readingFont')}</label>
            <select
              className="select"
              value={settings.readingFont}
              onChange={(e) => void update({ readingFont: e.target.value })}
            >
              {READING_FONTS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="settings-row">
            <label>
              {t('settings.focusMode')}
              <span className="hint">{t('settings.focusHint')}</span>
            </label>
            <div className="segmented">
              {FOCUS.map((mode) => (
                <button
                  key={mode}
                  className={settings.focusMode === mode ? 'active' : ''}
                  onClick={() => void update({ focusMode: mode })}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-row">
            <label>
              {t('settings.typewriter')}
              <span className="hint">{t('settings.typewriterHint')}</span>
            </label>
            <input
              type="checkbox"
              checked={settings.typewriter}
              onChange={(e) => void update({ typewriter: e.target.checked })}
            />
          </div>

          <div className="settings-row">
            <label>
              {t('settings.measure')}
              <span className="hint">{settings.measure}ch</span>
            </label>
            <input
              type="range"
              min={45}
              max={90}
              value={settings.measure}
              onChange={(e) => void update({ measure: Number(e.target.value) })}
            />
          </div>

          <div className="settings-row">
            <label>
              {t('settings.fontSize')}
              <span className="hint">{settings.fontSize}px</span>
            </label>
            <input
              type="range"
              min={14}
              max={28}
              value={settings.fontSize}
              onChange={(e) => void update({ fontSize: Number(e.target.value) })}
            />
          </div>

          <div className="settings-row">
            <label>
              {t('settings.lineHeight')}
              <span className="hint">{settings.lineHeight}</span>
            </label>
            <input
              type="range"
              min={1.3}
              max={2.2}
              step={0.05}
              value={settings.lineHeight}
              onChange={(e) => void update({ lineHeight: Number(e.target.value) })}
            />
          </div>

          <h3 className="settings-heading">{t('settings.ai.title')}</h3>

          <div className="settings-row">
            <label>
              {t('settings.ai.enable')}
              <span className="hint">{t('settings.ai.enableHint')}</span>
            </label>
            <input
              type="checkbox"
              checked={settings.aiEnabled}
              onChange={(e) => void update({ aiEnabled: e.target.checked })}
            />
          </div>

          <div className="settings-row">
            <label>
              {t('settings.ai.baseUrl')}
              <span className="hint">{t('settings.ai.baseUrlHint')}</span>
            </label>
            <input
              className="input"
              style={{ width: 260 }}
              value={settings.aiBaseUrl}
              onChange={(e) => void update({ aiBaseUrl: e.target.value })}
            />
          </div>

          <div className="settings-row">
            <label>{t('settings.ai.model')}</label>
            <input
              className="input"
              style={{ width: 200 }}
              value={settings.aiModel}
              list="ai-models"
              onChange={(e) => void update({ aiModel: e.target.value })}
            />
            <datalist id="ai-models">
              {(status?.models ?? []).map((model) => (
                <option key={model} value={model} />
              ))}
            </datalist>
          </div>

          <div className="settings-row">
            <label>
              {t('settings.ai.apiKey')}
              <span className="hint">{t('settings.ai.apiKeyHint')}</span>
            </label>
            <input
              className="input"
              type="password"
              style={{ width: 260 }}
              placeholder="sk-…"
              value={settings.aiApiKey}
              onChange={(e) => void update({ aiApiKey: e.target.value })}
            />
          </div>

          <div className="settings-row">
            <label>
              {t('settings.ai.test')}
              {status && (
                <span className="hint">
                  {status.error
                    ? `${t('settings.ai.error')}: ${status.error}`
                    : status.configured
                      ? t('settings.ai.connected', { count: status.models.length })
                      : t('settings.ai.noKey')}
                </span>
              )}
            </label>
            <button className="btn small" onClick={() => void testAi()} disabled={testing}>
              {testing ? t('settings.ai.testing') : t('settings.ai.test')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
