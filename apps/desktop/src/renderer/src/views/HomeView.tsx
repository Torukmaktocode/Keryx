import { useI18n } from '@keryx/i18n'
import { useAppStore } from '../store/appStore'

export function HomeView() {
  const { t } = useI18n()
  const setView = useAppStore((s) => s.setView)

  return (
    <div className="home">
      <div className="home-stage">
        <span className="home-glow" aria-hidden="true" />
        <span className="home-word" aria-label="Keryx">
          κῆρυξ
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
