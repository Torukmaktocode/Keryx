import { useEffect, useMemo, useState, type JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import { useAppStore } from '../store/appStore'
import { buildSlides, parsePuleo, pidePuleo, type PSlide } from '../lib/presentation'
import { api } from '../lib/api'
import {
  fondosDeTema,
  fondoPorId,
  fondoInicial,
  resolveFondoStyle,
  TEMAS,
  type Fondo,
  type FondoStyle,
  type TemaId
} from '../lib/fondos'
import { exportPptx } from '../lib/exportPptx'

const CENTERED_KINDS = new Set(['titulo', 'cita', 'meditacion'])

export function PresentacionesView() {
  const { t } = useI18n()
  const doc = useAppStore((s) => s.presentationDoc)
  const setView = useAppStore((s) => s.setView)
  const notify = useAppStore((s) => s.notify)
  const aiEnabled = useAppStore((s) => s.settings.aiEnabled)

  const [tema, setTema] = useState<TemaId>('azules')
  const [fondoId, setFondoId] = useState<string>('')
  const [style, setStyle] = useState<FondoStyle | null>(null)
  const [exporting, setExporting] = useState(false)
  const [pulido, setPulido] = useState<PSlide[] | null>(null)
  const [redactando, setRedactando] = useState(false)

  const base = useMemo<PSlide[]>(() => (doc ? buildSlides(doc) : []), [doc])
  const slides = pulido ?? base
  const temaFondos = useMemo<Fondo[]>(() => fondosDeTema(tema), [tema])
  const fondo = useMemo<Fondo>(
    () => (fondoId ? fondoPorId(fondoId) : undefined) ?? temaFondos[0] ?? fondoInicial(),
    [fondoId, temaFondos]
  )

  useEffect(() => {
    let cancelled = false
    setStyle(null)
    void resolveFondoStyle(fondo).then((next) => {
      if (!cancelled) setStyle(next)
    })
    return () => {
      cancelled = true
    }
  }, [fondo])

  useEffect(() => {
    setPulido(null)
    setRedactando(false)
  }, [doc])

  const redactar = async (): Promise<void> => {
    if (!doc) return
    setRedactando(true)
    try {
      const peticion = pidePuleo(doc, base)
      const res = await api.ai.chat({
        messages: [
          { role: 'system', content: peticion.system },
          { role: 'user', content: peticion.user }
        ],
        temperature: 0.5,
        maxTokens: 1800
      })
      const nuevo = parsePuleo(res.text, base)
      if (nuevo !== base) setPulido(nuevo)
    } catch (error) {
      notify(error instanceof Error ? error.message : t('presentaciones.redactarError'))
    } finally {
      setRedactando(false)
    }
  }

  if (!doc) {
    return (
      <div className="view">
        <header className="view-header">
          <h1 className="view-title">{t('nav.presentaciones')}</h1>
        </header>
        <div className="view-body">
          <div className="empty presentaciones">
            <p className="muted">{t('presentaciones.empty')}</p>
            <button className="btn primary" onClick={() => setView('assistant')}>
              {t('presentaciones.goAssistant')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const exportar = async (): Promise<void> => {
    setExporting(true)
    try {
      const res = await exportPptx(doc.ref, fondo, slides)
      if (res.saved) notify(t('presentaciones.exported', { path: res.path }))
    } catch (error) {
      notify(t('presentaciones.exportError', { error: error instanceof Error ? error.message : String(error) }))
    } finally {
      setExporting(false)
    }
  }

  const textColor = style?.dark ? '#FFFFFF' : '#241A10'
  const scrim = style?.dark ? 'rgba(0,0,0,0.42)' : 'rgba(255,255,255,0.55)'
  const bases = temaFondos.filter((item) => item.variante == null)
  const variantes = temaFondos.filter((item) => item.variante != null)

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.presentaciones')}</h1>
        <div className="spacer" />
        <span className="badge muted">{doc.ref}</span>
      </header>
      <div className="view-body">
        <div className="presentaciones">
          <div className="presentaciones-temas">
            {TEMAS.map((item) => (
              <button
                key={item}
                className={`chip ${tema === item ? 'active' : ''}`}
                onClick={() => setTema(item)}
              >
                {t(`presentaciones.theme.${item}`)}
              </button>
            ))}
          </div>

          <div>
            <div className="presentaciones-grupo-label">{t('presentaciones.bases')}</div>
            <div className="presentaciones-grid">
              {bases.map((item) => (
                <FondoCard
                  key={item.id}
                  fondo={item}
                  active={fondo.id === item.id}
                  onPick={() => {
                    setFondoId(item.id)
                    setTema(item.tema)
                  }}
                />
              ))}
            </div>
          </div>

          {variantes.length > 0 && (
            <div>
              <div className="presentaciones-grupo-label">{t('presentaciones.variantes')}</div>
              <div className="presentaciones-grid">
                {variantes.map((item) => (
                  <FondoCard
                    key={item.id}
                    fondo={item}
                    active={fondo.id === item.id}
                    onPick={() => {
                      setFondoId(item.id)
                      setTema(item.tema)
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="presentaciones-actions">
            {aiEnabled && (
              <button className="btn" onClick={() => void redactar()} disabled={redactando}>
                {redactando ? t('presentaciones.redactando') : t('presentaciones.redactarIA')}
              </button>
            )}
            <button className="btn primary" onClick={() => void exportar()} disabled={exporting}>
              {exporting ? t('presentaciones.exporting') : t('presentaciones.export')}
            </button>
            {pulido && (
              <button className="btn ghost" onClick={() => setPulido(null)}>
                {t('presentaciones.volverCodigo')}
              </button>
            )}
            <span className="muted" style={{ fontSize: 12 }}>
              {t('presentaciones.preview')}
            </span>
          </div>

          <div className="presentaciones-preview">
            {slides.map((slide, index) => (
              <div key={index} className="slide-card" style={{ backgroundImage: `url(${fondo.url})` }}>
                <div className="slide-scrim" style={{ background: scrim }} />
                <div
                  className={`slide-content ${CENTERED_KINDS.has(slide.kind) ? 'center' : ''}`}
                  style={{ color: textColor }}
                >
                  {slide.kicker && <span className="slide-kicker">{slide.kicker}</span>}
                  <h3
                    className="slide-title"
                    style={slide.kind === 'titulo' ? { fontSize: '6.6cqw' } : undefined}
                  >
                    {slide.title}
                  </h3>
                  {slide.lines.length > 0 && (
                    <ul className="slide-lines">
                      {slide.lines.map((line, lineIndex) => (
                        <li key={lineIndex}>{line}</li>
                      ))}
                    </ul>
                  )}
                  {slide.quote && <p className="slide-quote">{slide.quote}</p>}
                </div>
                <span className="slide-num" style={{ color: textColor }}>
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FondoCard({
  fondo,
  active,
  onPick
}: {
  fondo: Fondo
  active: boolean
  onPick: () => void
}): JSX.Element {
  return (
    <button className={`fondo-card ${active ? 'active' : ''}`} onClick={onPick} title={fondo.label}>
      <span className="fondo-thumb" style={{ backgroundImage: `url(${fondo.url})` }} />
      <span className="fondo-label">{fondo.label}</span>
    </button>
  )
}
