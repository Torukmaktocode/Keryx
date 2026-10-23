import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import { AUTHORS, THEMES } from '../lib/inspiration'
import {
  ALL_SERMONS,
  searchInspiration,
  type InspirationHit,
  type InspirationSermon
} from '../lib/inspiration'
import { useAppStore } from '../store/appStore'
import { Icon } from '../components/Icon'
import { TextoTraducido } from '../components/TextoTraducido'

function sermonMarkdownVeracity(sermon: InspirationSermon): string {
  return sermon.veracity === 'reconstruido'
    ? 'reconstrucción fiel del estilo del predicador (no transcripción de un sermón fechado)'
    : 'basada en sermones con registro histórico (ficha de estudio, no transcripción)'
}

function sermonMarkdown(sermon: InspirationSermon): string {
  const lines = [
    `# ${sermon.title} — ${sermon.author} (${sermon.year})`,
    '',
    `**Escena:** ${sermon.place}. ${sermon.occasion}`,
    ''
  ]
  if (sermon.veracity === 'reconstruido' || sermon.veracity === 'documentado') {
    lines.push(`**Fiabilidad de la ficha:** ${sermonMarkdownVeracity(sermon)}`, '')
  }
  if (sermon.preached) {
    lines.push(`**Cómo se predicó:** ${sermon.preached}`, '')
  }
  if (sermon.introduction) {
    lines.push(`**Introducción:** ${sermon.introduction}`, '')
  }
  lines.push(`**Texto base:** ${sermon.text}`, '', '## Estructura del sermón', '')
  if (sermon.bridges && sermon.bridges.length > 0) {
    sermon.outline.forEach((step, index) => {
      lines.push(`${index + 1}. ${step}`)
      const bridge = sermon.bridges?.[index]
      if (bridge) lines.push(`   _Puente:_ ${bridge}`)
    })
  } else {
    sermon.outline.forEach((step, index) => lines.push(`${index + 1}. ${step}`))
  }
  lines.push('', '## Citas representativas', '')
  for (const quote of sermon.quotes) lines.push(quote, '')
  if (sermon.phrases && sermon.phrases.length > 0) {
    lines.push('## Frases que usó', '')
    for (const phrase of sermon.phrases) lines.push(`- ${phrase}`)
    lines.push('')
  }
  lines.push(
    `**Estilo:** ${sermon.style}`,
    '',
    `**Impacto histórico:** ${sermon.impact}`,
    '',
    '**Temas:** ' + sermon.themes.join(' · ')
  )
  return lines.join('\n')
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function highlight(snippet: string, query: string): string {
  const needle = query.trim()
  if (!needle) return escapeHtml(snippet)
  const words = needle
    .split(/\s+/)
    .filter((word) => word.length > 1)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return escapeHtml(snippet)
  let html = escapeHtml(snippet)
  for (const word of words) {
    html = html.replace(new RegExp(word, 'gi'), (m) => `<mark>${m}</mark>`)
  }
  return html
}

export function InspirationView() {
  const { t } = useI18n()
  const sendToWriting = useAppStore((s) => s.sendToWriting)
  const notify = useAppStore((s) => s.notify)

  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [author, setAuthor] = useState('')
  const [theme, setTheme] = useState('')
  const [grouped, setGrouped] = useState(false)

  const hits = useMemo(() => searchInspiration(query, author, theme), [query, author, theme])
  const filtering = Boolean(query.trim() || author || theme)

  // Enter abre el primer resultado de la búsqueda
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (
        e.key === 'Enter' &&
        !openId &&
        hits.length &&
        (e.target as HTMLElement)?.tagName === 'INPUT'
      ) {
        setOpenId(hits[0].sermon.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hits, openId])

  const open = openId ? (ALL_SERMONS.find((s) => s.id === openId) ?? null) : null
  const authorOf = (name: string) => AUTHORS.find((a) => a.name === name)

  const groupedHits = useMemo(() => {
    const groups: Array<{
      authorName: string
      info: (typeof AUTHORS)[number] | undefined
      items: InspirationHit[]
    }> = []
    for (const hit of hits) {
      const last = groups[groups.length - 1]
      if (last && last.authorName === hit.sermon.author) {
        last.items.push(hit)
      } else {
        groups.push({
          authorName: hit.sermon.author,
          info: authorOf(hit.sermon.author),
          items: [hit]
        })
      }
    }
    return groups
  }, [hits])

  const clearFilters = (): void => {
    setQuery('')
    setAuthor('')
    setTheme('')
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.inspiration')}</h1>
        <div className="spacer" />
        <span className="badge">{t('inspiration.count', { count: ALL_SERMONS.length })}</span>
      </header>
      <div className="view-body">
        <div className="inspiration">
          <div className="inspiration-filters">
            <input
              className="input"
              placeholder={t('inspiration.search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <select className="select" value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value="">{t('inspiration.allAuthors')}</option>
              {AUTHORS.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} ({item.era})
                </option>
              ))}
            </select>
            <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="">{t('inspiration.allThemes')}</option>
              {THEMES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button
              className={`btn ghost small ${grouped ? 'primary' : ''}`}
              onClick={() => setGrouped(!grouped)}
              title={t('inspiration.groupByAuthor')}
            >
              <Icon name="columns" size={14} />
              {t('inspiration.groupByAuthor')}
            </button>
            {filtering && (
              <button className="btn ghost small" onClick={clearFilters}>
                {t('inspiration.clear')}
              </button>
            )}
          </div>

          <div className="inspiration-theme-chips">
            {THEMES.map((item) => (
              <button
                key={item}
                className={`chip ${theme === item ? 'active' : 'ghost'}`}
                onClick={() => setTheme(theme === item ? '' : item)}
              >
                {item}
              </button>
            ))}
          </div>

          {open ? (
            <article className="inspiration-detail">
              <div className="inspiration-detail-head">
                <div>
                  <h2>
                    {open.title}{' '}
                    {open.veracity && (
                      <span
                        className={`veracity-badge ${open.veracity === 'reconstruido' ? 'reconstruido' : ''}`}
                        title={t('inspiration.veracity.hint')}
                      >
                        {t(`inspiration.veracity.${open.veracity}`)}
                      </span>
                    )}
                  </h2>
                  <p className="meta">
                    <strong>{open.author}</strong> · {open.year} · {open.place} · {open.duration}
                  </p>
                </div>
                <div className="inspiration-detail-tools">
                  <button
                    className="btn ghost small"
                    onClick={() => {
                      void sendToWriting(sermonMarkdown(open), open.title)
                    }}
                  >
                    {t('assistant.sendToEditor')}
                  </button>
                  <button
                    className="btn ghost small"
                    onClick={() => {
                      navigator.clipboard
                        ?.writeText(sermonMarkdown(open))
                        .then(() => notify(t('inspiration.copied')))
                    }}
                  >
                    {t('inspiration.copy')}
                  </button>
                  <button className="btn ghost small" onClick={() => setOpenId(null)}>
                    <Icon name="fullscreen-exit" size={14} /> {t('inspiration.back')}
                  </button>
                </div>
              </div>

              <div className="inspiration-scene">
                <p>
                  <TextoTraducido plain={open.occasion} lang="es" />
                </p>
              </div>

              {open.preached && (
                <section>
                  <h3>{t('inspiration.preached')}</h3>
                  <p className="inspiration-preview">
                    <TextoTraducido plain={open.preached} lang="es" />
                  </p>
                </section>
              )}

              {open.introduction && (
                <section>
                  <h3>{t('inspiration.introduction')}</h3>
                  <blockquote className="inspiration-quote">
                    <TextoTraducido plain={open.introduction} lang="es" />
                  </blockquote>
                </section>
              )}

              <blockquote className="inspiration-text">
                <TextoTraducido plain={open.text} lang="es" />
              </blockquote>

              <div className="inspiration-themes">
                {open.themes.map((item) => (
                  <button
                    key={item}
                    className="chip"
                    onClick={() => {
                      setTheme(item)
                      setOpenId(null)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <section>
                <h3>{t('inspiration.outline')}</h3>
                <ol className="inspiration-outline">
                  {open.outline.map((step, index) => (
                    <li key={index}>
                      <TextoTraducido plain={step} lang="es" />
                    </li>
                  ))}
                </ol>
              </section>

              {open.bridges && open.bridges.length > 0 && (
                <section>
                  <h3>{t('inspiration.bridges')}</h3>
                  <ul className="inspiration-apps">
                    {open.bridges.map((bridge, index) => (
                      <li key={index}>
                        {index === 0 ? (
                          <>
                            <strong>{t('inspiration.bridgeFirst')}</strong> {bridge}
                          </>
                        ) : (
                          <>
                            <strong>
                              {open.outline[index - 1].split(':')[0].slice(0, 48)} →{' '}
                              {open.outline[index].split(':')[0].slice(0, 48)}
                            </strong>{' '}
                            {bridge}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h3>{t('inspiration.quotes')}</h3>
                {open.quotes.map((quote, index) => (
                  <blockquote key={index} className="inspiration-quote">
                    <TextoTraducido plain={quote} lang="es" />
                  </blockquote>
                ))}
              </section>

              {open.phrases && open.phrases.length > 0 && (
                <section>
                  <h3>{t('inspiration.phrases')}</h3>
                  <ul className="inspiration-apps">
                    {open.phrases.map((phrase, index) => (
                      <li key={index}>
                        <TextoTraducido plain={phrase} lang="es" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {open.bigIdea && (
                <section>
                  <h3>{t('inspiration.bigIdea')}</h3>
                  <p className="inspiration-bigidea">
                    <TextoTraducido plain={open.bigIdea} lang="es" />
                  </p>
                </section>
              )}

              {open.application && open.application.length > 0 && (
                <section>
                  <h3>{t('inspiration.application')}</h3>
                  <ul className="inspiration-apps">
                    {open.application.map((item, index) => (
                      <li key={index}>
                        <TextoTraducido plain={item} lang="es" />
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="inspiration-card inspiration-prepare">
                <h4>{t('inspiration.prepare')}</h4>
                <ol className="inspiration-prepare-list">
                  <li>
                    <strong>{t('inspiration.prepareHook')}</strong> {open.occasion.split(';')[0]}
                  </li>
                  <li>
                    <strong>{t('inspiration.prepareText')}</strong> {open.text}
                  </li>
                  <li>
                    <strong>{t('inspiration.prepareBody')}</strong> {open.quotes[0]}
                  </li>
                  <li>
                    <strong>{t('inspiration.prepareChallenge')}</strong>{' '}
                    {open.outline[open.outline.length - 1]}
                  </li>
                </ol>
              </div>

              <div className="inspiration-grid">
                <div className="inspiration-card">
                  <h4>{t('inspiration.style')}</h4>
                  <p>{open.style}</p>
                  <p className="author-voice">{authorOf(open.author)?.style}</p>
                </div>
                <div className="inspiration-card">
                  <h4>{t('inspiration.impact')}</h4>
                  <p>{open.impact}</p>
                </div>
              </div>

              {(() => {
                const authorInfo = authorOf(open.author)
                return authorInfo ? (
                  <div className="inspiration-author">
                    <h4>{authorInfo.name}</h4>
                    <p className="meta">
                      {authorInfo.era} · {authorInfo.tradition}
                    </p>
                    <p>
                      <TextoTraducido plain={authorInfo.bio} lang="es" />
                    </p>
                  </div>
                ) : null
              })()}
            </article>
          ) : (
            <>
              <div className="inspiration-results-meta">
                {t('inspiration.results', { count: hits.length })}
              </div>

              {grouped ? (
                <div className="inspiration-groups">
                  {groupedHits.map((group) => (
                    <section className="inspiration-group" key={group.authorName}>
                      <header className="inspiration-group-head">
                        <h3>{group.authorName}</h3>
                        {group.info && (
                          <p className="meta">
                            {group.info.era} · {group.info.tradition}
                          </p>
                        )}
                      </header>
                      <div className="inspiration-list">
                        {group.items.map((hit) => (
                          <button
                            key={hit.sermon.id}
                            className="inspiration-item"
                            onClick={() => setOpenId(hit.sermon.id)}
                          >
                            <h3>
                              {hit.sermon.title}
                              {hit.sermon.veracity === 'reconstruido' && (
                                <span className="veracity-badge reconstruido" title={t('inspiration.veracity.hint')}>
                                  {t('inspiration.veracity.reconstruido')}
                                </span>
                              )}
                            </h3>
                            <p className="meta">
                              {hit.sermon.year} · {hit.sermon.place} · {hit.sermon.duration}
                            </p>
                            <p className="inspiration-preview">{hit.sermon.text}</p>
                            <div className="inspiration-chips">
                              {hit.sermon.themes.map((item) => (
                                <span className="chip ghost" key={item}>
                                  {item}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="inspiration-list">
                  {hits.map((hit) => (
                    <button
                      key={hit.sermon.id}
                      className="inspiration-item"
                      onClick={() => setOpenId(hit.sermon.id)}
                    >
                      <div>
                        <h3>
                          {hit.sermon.title}
                          {hit.sermon.veracity === 'reconstruido' && (
                            <span className="veracity-badge reconstruido" title={t('inspiration.veracity.hint')}>
                              {t('inspiration.veracity.reconstruido')}
                            </span>
                          )}
                        </h3>
                        <p className="meta">
                          <strong>{hit.sermon.author}</strong>
                          {hit.authorInfo ? ` — ${hit.authorInfo.era}` : ''} · {hit.sermon.year} ·{' '}
                          {hit.sermon.place} · {hit.sermon.duration}
                        </p>
                        <p
                          className="inspiration-preview"
                          dangerouslySetInnerHTML={{
                            __html: highlight(hit.snippet, query)
                          }}
                        />
                        <div className="inspiration-chips">
                          {hit.sermon.themes.map((item) => (
                            <span className="chip ghost" key={item}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!hits.length && <p className="muted assistant-hint">{t('inspiration.empty')}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
