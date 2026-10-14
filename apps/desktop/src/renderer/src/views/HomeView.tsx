import { useI18n } from '@keryx/i18n'

export function HomeView() {
  const { t } = useI18n()

  return (
    <div className="home">
      <div className="home-stage">
        <span className="home-glow" aria-hidden="true" />
        <span className="home-word">
          <span className="home-dove" aria-hidden="true">
            <svg viewBox="20 50 400 260" role="presentation">
              <path className="home-wing-far" d="M246 200C220 120 170 74 96 60c44 56 100 104 144 146z" />
              <path d="M172 238 84 258 124 234 96 222 146 222Z" />
              <ellipse cx="250" cy="230" rx="86" ry="46" transform="rotate(-8 250 230)" />
              <circle cx="332" cy="196" r="26" />
              <path d="M356 190l32 8-32 12z" />
              <path className="home-wing-near" d="M232 204C200 136 140 92 64 78c46 54 114 98 162 132z" />
              <g className="home-branch">
                <path className="home-branch-stem" d="M386 204c16-8 32-12 48-14" />
                <path className="home-branch-leaf" d="M434 190c10-6 22-6 30 0-10 6-22 6-30 0z" />
                <circle className="home-branch-olive" cx="404" cy="191" r="5" />
              </g>
            </svg>
          </span>
          Keryx
        </span>
        <span className="home-line" aria-hidden="true" />
        <blockquote className="home-verse">
          <span className="home-verse-text">{t('home.verse')}</span>
          <cite>{t('home.verseRef')}</cite>
        </blockquote>
      </div>
    </div>
  )
}
