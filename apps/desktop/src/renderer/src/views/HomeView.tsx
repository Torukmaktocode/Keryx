import type { CSSProperties } from 'react'
import { useI18n } from '@keryx/i18n'
import { useAppStore } from '../store/appStore'

const FORM_DELAY_MS = 320
const FORM_STEP_MS = 150

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
            <path pathLength={1} d="M16 7h.01" />
            <path pathLength={1} d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
            <path pathLength={1} d="m20 7 2 .5-2 .5" />
            <path pathLength={1} d="M10 18v3" />
            <path pathLength={1} d="M14 17.75V21" />
            <path pathLength={1} d="M7 18a6 6 0 0 0 3.84-10.61" />
          </svg>
          <svg viewBox="0 0 24 24" style={delay(1)} aria-hidden="true">
            <title>Fuego</title>
            <path pathLength={1} d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
          </svg>
          <svg viewBox="0 0 24 24" style={delay(2)} aria-hidden="true">
            <title>Siervo</title>
            <path pathLength={1} d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
            <path pathLength={1} d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" />
            <path pathLength={1} d="m2 15 6 6" />
            <path pathLength={1} d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />
          </svg>
          <svg viewBox="0 0 24 24" className="home-forms-cross" style={delay(3)} aria-hidden="true">
            <title>Cruz</title>
            <path pathLength={1} d="M10.3 2.5h3.4v5.1H19.3v3.4h-5.6V21.5h-3.4V11H4.7V7.6h5.6z" />
          </svg>
        </span>
        <span className="home-line" aria-hidden="true" />
        <blockquote className="home-verse">
          <span className="home-verse-text">{t('home.verse')}</span>
          <cite>{t('home.verseRef')}</cite>
        </blockquote>
        <p className="home-lede">{t('home.lede')}</p>
        <button className="btn primary home-start" onClick={() => setView('study')}>
          {t('home.start')}
        </button>
      </div>
    </div>
  )
}
