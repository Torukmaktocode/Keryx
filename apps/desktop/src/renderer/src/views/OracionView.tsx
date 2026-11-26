import { useEffect, useState } from 'react'
import type { JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import type { OraciónResumen } from '@keryx/core'
import { api } from '../lib/api'
import { useAppStore } from '../store/appStore'

function fechaCorta(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString()
}

type FormOracion = { nombre: string; pais: string; peticion: string; categoria: string }

const FORM_VACIO: FormOracion = { nombre: '', pais: '', peticion: '', categoria: 'general' }

const CATEGORIAS = ['general', 'salud', 'familia', 'trabajo', 'economia', 'gratitud'] as const

export function OracionView(): JSX.Element {
  const { t } = useI18n()
  const notify = useAppStore((s) => s.notify)

  const [lista, setLista] = useState<OraciónResumen[] | null>(null)
  const [cargando, setCargando] = useState(true)
  const [modo, setModo] = useState<'recientes' | 'ranking'>('recientes')
  const [categoria, setCategoria] = useState('todas')
  const [formAbierto, setFormAbierto] = useState(false)
  const [form, setForm] = useState<FormOracion>(FORM_VACIO)
  const [publicando, setPublicando] = useState(false)
  const [miEmail, setMiEmail] = useState('')
  const [respondiendo, setRespondiendo] = useState<string | null>(null)
  const [textoRespuesta, setTextoRespuesta] = useState('')

  const cargar = async (modoActual: 'recientes' | 'ranking', categoriaActual: string): Promise<void> => {
    setCargando(true)
    const rta = await api.oracion.lista({
      modo: modoActual,
      categoria: categoriaActual === 'todas' ? undefined : categoriaActual
    })
    setCargando(false)
    if ('error' in rta) {
      notify(rta.error)
      setLista([])
      return
    }
    setLista(rta)
  }

  useEffect(() => {
    void api.licencia.estado().then((estado) => {
      if (estado.email) setMiEmail(estado.email)
    })
  }, [])

  useEffect(() => {
    void cargar(modo, categoria)
  }, [modo, categoria])

  const campo = (clave: keyof FormOracion) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [clave]: e.target.value }))

  const enviar = async (): Promise<void> => {
    if (form.peticion.trim().length < 10) {
      notify(t('oracion.form.muyCorta'))
      return
    }
    setPublicando(true)
    const rta = await api.oracion.publicar({ ...form })
    setPublicando(false)
    if ('error' in rta) {
      notify(rta.error)
      return
    }
    notify(t('oracion.form.publicado'))
    setForm(FORM_VACIO)
    setFormAbierto(false)
    void cargar(modo, categoria)
  }

  const llamita = async (id: string): Promise<void> => {
    const rta = await api.oracion.llamita({ id })
    if ('error' in rta) {
      notify(rta.error)
      return
    }
    setLista((prev) =>
      (prev ?? []).map((o) => (o.id === id ? { ...o, orando: rta.orando, yo_oro: rta.yo_oro } : o))
    )
  }

  const responder = async (id: string): Promise<void> => {
    if (textoRespuesta.trim().length < 10) {
      notify(t('oracion.form.respuestaCorta'))
      return
    }
    const rta = await api.oracion.responder({ id, respuesta: textoRespuesta.trim() })
    if ('error' in rta) {
      notify(rta.error)
      return
    }
    notify(t('oracion.form.respondidaOk'))
    setRespondiendo(null)
    setTextoRespuesta('')
    void cargar(modo, categoria)
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.oracion')}</h1>
        <div className="spacer" />
        {lista && <span className="badge">{t('oracion.total', { count: lista.length })}</span>}
      </header>
      <div className="view-body">
        <div className="oracion">
          {formAbierto ? (
            <div className="oracion-form-card">
              <h2 className="oracion-form-titulo">{t('oracion.form.titulo')}</h2>
              <div className="oracion-form-grid">
                <label className="oracion-campo">
                  <span>{t('oracion.form.nombre')}</span>
                  <input className="input" value={form.nombre} onChange={campo('nombre')} maxLength={80} />
                </label>
                <label className="oracion-campo">
                  <span>{t('oracion.form.pais')}</span>
                  <input className="input" value={form.pais} onChange={campo('pais')} maxLength={80} />
                </label>
              </div>
              <label className="oracion-campo">
                <span>{t('oracion.form.categoria')}</span>
                <select className="input" value={form.categoria} onChange={campo('categoria')}>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {t(`oracion.cat.${c}` as never)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="oracion-campo">
                <span>{t('oracion.form.peticion')}</span>
                <textarea
                  className="input"
                  rows={6}
                  value={form.peticion}
                  onChange={campo('peticion')}
                  maxLength={3000}
                  placeholder={t('oracion.form.peticionHint')}
                />
              </label>
              <div className="oracion-form-acciones">
                <button className="btn ghost" onClick={() => setFormAbierto(false)}>
                  {t('oracion.form.cancelar')}
                </button>
                <button className="btn primary" disabled={publicando} onClick={() => void enviar()}>
                  {publicando ? t('oracion.form.publicando') : t('oracion.form.publicar')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="oracion-hero">
                <p className="oracion-hero-verso">
                  <em>{t('oracion.hero.verso')}</em>
                </p>
                <button className="btn primary oracion-hero-boton" onClick={() => setFormAbierto(true)}>
                  {t('oracion.pedir')}
                </button>
              </div>

              <div className="oracion-tabs">
                <button
                  className={`tab-btn ${modo === 'recientes' ? 'activa' : ''}`}
                  onClick={() => setModo('recientes')}
                >
                  {t('oracion.tabs.recientes')}
                </button>
                <button
                  className={`tab-btn ${modo === 'ranking' ? 'activa' : ''}`}
                  onClick={() => setModo('ranking')}
                >
                  🔥 {t('oracion.tabs.ranking')}
                </button>
              </div>

              <div className="inspiration-theme-chips">
                {['todas', ...CATEGORIAS].map((c) => (
                  <button
                    key={c}
                    className={`chip ${categoria === c ? 'active' : 'ghost'}`}
                    onClick={() => setCategoria(categoria === c ? 'todas' : c)}
                  >
                    {t(`oracion.cat.${c}` as never)}
                  </button>
                ))}
              </div>

              {cargando && <p className="muted assistant-hint">{t('oracion.cargando')}</p>}

              <div className="oracion-lista">
                {(lista ?? []).map((oracion) => (
                  <article
                    key={oracion.id}
                    className={`oracion-tarjeta ${oracion.respondida ? 'respondida' : ''}`}
                  >
                    <div className="oracion-tarjeta-cabecera">
                      <div>
                        <strong className="oracion-nombre">{oracion.nombre}</strong>
                        <span className="oracion-pais">🌍 {oracion.pais}</span>
                        <span className="oracion-fecha">{fechaCorta(oracion.creado_at)}</span>
                      </div>
                      <button
                        className={`oracion-llamita ${oracion.yo_oro ? 'activa' : ''}`}
                        onClick={() => void llamita(oracion.id)}
                        title={t('oracion.llamita.titulo')}
                      >
                        🔥 {oracion.orando}
                      </button>
                    </div>
                    <p className="oracion-peticion">{oracion.peticion}</p>

                    {oracion.respondida && oracion.respuesta && (
                      <div className="oracion-testimonio">
                        <strong>✝ {t('oracion.testimonio')}</strong>
                        <p>{oracion.respuesta}</p>
                      </div>
                    )}

                    {miEmail === oracion.email && !oracion.respondida && (
                      <div className="oracion-acciones">
                        {respondiendo === oracion.id ? (
                          <>
                            <textarea
                              className="input"
                              rows={3}
                              value={textoRespuesta}
                              onChange={(e) => setTextoRespuesta(e.target.value)}
                              placeholder={t('oracion.form.respuestaPlaceholder')}
                              maxLength={3000}
                            />
                            <button className="btn primary small" onClick={() => void responder(oracion.id)}>
                              {t('oracion.form.guardarTestimonio')}
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn ghost small"
                            onClick={() => setRespondiendo(oracion.id)}
                          >
                            {t('oracion.marcarRespondida')}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {!cargando && lista && lista.length === 0 && (
                <p className="muted assistant-hint">{t('oracion.vacio')}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
