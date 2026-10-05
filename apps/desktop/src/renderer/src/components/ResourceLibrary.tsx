import { useMemo, useState } from 'react'
import { useI18n } from '@keryx/i18n'
import {
  LIBRARY,
  RESOURCE_CATEGORIES,
  buildDeliveryGuide,
  type ResourceBook,
  type ResourceCategory
} from '@keryx/templates'

interface Props {
  onInsert: (markdown: string, title: string) => void
}

export function ResourceLibrary({ onInsert }: Props) {
  const { t } = useI18n()
  const [category, setCategory] = useState<ResourceCategory>('hermeneutics')

  const books = useMemo(
    () => LIBRARY.filter((book) => book.category === category),
    [category]
  )

  const insertBibliography = (book: ResourceBook): void => {
    onInsert(
      `- **${book.title}** — ${book.author}\n  ${book.summary}`,
      t('preacher.title')
    )
  }

  const insertCatalog = (): void => {
    onInsert(
      `# ${t('preacher.title')}\n\n${LIBRARY.map(
        (book) => `- **${book.title}** — ${book.author}\n  ${book.summary}`
      ).join('\n\n')}`,
      t('preacher.title')
    )
  }

  return (
    <section className="library-section">
      <div className="filters">
        <div className="segmented">
          {RESOURCE_CATEGORIES.map((id) => (
            <button
              key={id}
              className={category === id ? 'active' : ''}
              onClick={() => setCategory(id)}
            >
              {t(`preacher.category.${id}`)}
            </button>
          ))}
        </div>
        <button
          className="btn ghost small"
          title={t('preacher.insertCatalog')}
          onClick={insertCatalog}
        >
          {t('preacher.insertCatalog')}
        </button>
        <button
          className="btn ghost small"
          title={t('preacher.insertDelivery')}
          onClick={() => onInsert(buildDeliveryGuide(), t('preacher.delivery'))}
        >
          {t('preacher.insertDelivery')}
        </button>
      </div>
      <div className="grid">
        {books.map((book) => (
          <div className="card" key={book.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <strong style={{ fontFamily: 'var(--font-scripture)', fontSize: 16 }}>{book.title}</strong>
            <span className="muted" style={{ fontSize: 12 }}>{book.author}</span>
            <p className="muted" style={{ margin: 0, fontSize: 13, flex: 1 }}>{book.summary}</p>
            <button className="btn" onClick={() => insertBibliography(book)}>
              {t('preacher.insert')}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
