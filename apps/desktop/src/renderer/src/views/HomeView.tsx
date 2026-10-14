import type { CSSProperties } from 'react'
import { useI18n } from '@keryx/i18n'
import { useAppStore } from '../store/appStore'

const FORM_DELAY_MS = 900
const FORM_STEP_MS = 230

export function HomeView() {
  const { t } = useI18n()
  const setView = useAppStore((s) => s.setView)
  const delay = (i: number): CSSProperties =>
    ({ '--d': `${FORM_DELAY_MS + i * FORM_STEP_MS}ms` }) as CSSProperties

  return (
    <div className="home">
      <div className="home-stage">
        <span className="home-glow" aria-hidden="true" />
        <span className="home-word">Keryx</span>
        <span className="home-forms" aria-label={t('home.forms')} role="img">
          <svg viewBox="0 0 24 24" style={delay(0)} aria-hidden="true">
            <title>Paloma</title>
            <path pathLength={1} d="M19.5 10.5c-1.6-2.4-4.6-3.2-7.4-2.1L6.6 6.5v3.3C4.7 10.8 3.4 12.2 3 13.9c3.1 2.7 8.5 3 12 1.1 3.4-1.4 4.2-3.5 4.5-4.5z" />
            <path pathLength={1} d="M10.5 9c.9-2.2 2.7-2.9 4.7-2.3" />
          </svg>
          <svg viewBox="0 0 24 24" style={delay(1)} aria-hidden="true">
            <title>Fuego</title>
            <path pathLength={1} d="M12 3.2c1.1 3 4.1 4.4 4.1 7.9a4.1 4.1 0 0 1-8.2 0c0-1.5.5-2.7 1.4-3.8.2 1 .8 1.9 1.7 2.3-.7-2-.7-4.7 1-6.4z" />
          </svg>
          <svg viewBox="0 0 24 24" style={delay(2)} aria-hidden="true">
            <title>Siervo</title>
            <path pathLength={1} d="M5.5 12.5h13l-1.4 5.3a2.2 2.2 0 0 1-2.2 1.7H9.1a2.2 2.2 0 0 1-2.2-1.7z" />
            <path pathLength={1} d="M8.8 12.5V9.4A2.7 2.7 0 0 1 11.5 7h1a2.7 2.7 0 0 1 2.7 2.4v3.1" />
            <path pathLength={1} d="M12 7V3.6" />
          </svg>
          <svg viewBox="0 0 24 24" style={delay(3)} aria-hidden="true">
            <title>Cruz</title>
            <path pathLength={1} d="M12 3.5v17" />
            <path pathLength={1} d="M6.8 8.8h10.4" />
          </svg>
        </span>
        <span className="home-line" aria-hidden="true" />
        <p className="home-lede">{t('home.lede')}</p>
        <button className="btn primary home-start" onClick={() => setView('study')}>
          {t('home.start')}
        </button>
      </div>
    </div>
  )
}
