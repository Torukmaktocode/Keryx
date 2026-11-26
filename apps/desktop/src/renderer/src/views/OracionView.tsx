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

type FormOracion = { nombre: string; pais: string; peticion: string }

const FORM_VACIO: FormOracion = { nombre: '', pais: '', peticion: '' }

export function OracionView(): JSX.Element {
  const { t } = useI18n()
  const notify = useAppStore((s) => s.notify)

  const [lista, setLista] = useState<OraciónResumen[] | null>(null)
  const [cargando, setCargando] = useState(true)
  const [formAbierto, setFormAbierto] = useState(false)
  const [form, setForm] = useState<FormOracion>(FORM_VACIO)
  const [publicando, setPublicando] = useState(false)
  const [miEmail, setMiEmail] = useState('')
  const [respondiendo, setRespondiendo] = useState<string | null>(null)
  const [textoRespuesta, setTextoRespuesta] = useState('')

  const cargar = async (): Promise<void> => {
    setCargando(true)
    const rta = await api.oracion.lista()
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
    void cargar()
  }, [])

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
    void cargar()
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
    void cargar()
  }

  return (
    <div className="view">
      <header className="view-header">
        <h1 className="view-title">{t('nav.oracion')}</h1>
        <div className="spacer" />
        <button className="btn primary small" onClick={() => setFormAbierto(!formAbierto)}>
          {formAbierto ? t('oracion.form.cancelar') : t('oracion.pedir')}
        </button>
      </header>
      <div className="view-body">
        <div className="inspiration">
          {formAbierto && (
            <div className="inspiration-form">
              <h2>{t('oracion.form.titulo')}</h2>
              <div className="inspiration-grid">
                <label className="field">
                  <span>{t('oracion.form.nombre')}</span>
                  <input className="input" value={form.nombre} onChange={campo('nombre')} maxLength={80} />
                </label>
                <label className="field">
                  <span>{t('oracion.form.pais')}</span>
                  <input className="input" value={form.pais} onChange={campo('pais')} maxLength={80} />
                </label>
              </div>
              <label className="field">
                <span>{t('oracion.form.peticion')}</span>
                <textarea
                  className="input"
                  rows={5}
                  value={form.peticion}
                  onChange={campo('peticion')}
                  maxLength={3000}
                  placeholder={t('oracion.form.peticionHint')}
                />
              </label>
              <div className="inspiration-detail-tools">
                <div className="spacer" />
                <button className="btn primary small" disabled={publicando} onClick={() => void enviar()}>
                  {publicando ? t('oracion.form.publicando') : t('oracion.form.publicar')}
                </button>
              </div>
            </div>
          )}

          {cargando && <p className="muted assistant-hint">{t('oracion.cargando')}</p>}

          <div className="inspiration-list">
            {(lista ?? []).map((oracion) => (
              <div key={oracion.id} className={`inspiration-item oracion-item ${oracion.respondida ? 'oracion-respondida' : ''}`}>
                <div>
                  <h3>
                    {oracion.respondida && <span className="veracity-badge">{t('oracion.respondida')}</span>}
                    {oracion.peticion.slice(0, 80)}
                  </h3>
                  <p className="meta">
                    <strong>{oracion.nombre}</strong> · {oracion.pais} · {fechaCorta(oracion.creado_at)}
                  </p>
                  <p className="inspiration-preview">{oracion.peticion}</p>

                  {oracion.respondida && oracion.respuesta && (
                    <blockquote className="inspiration-quote">
                      <strong>{t('oracion.testimonio')}:</strong> {oracion.respuesta}
                    </blockquote>
                  )}

                  <div className="inspiration-detail-tools">
                    <button
                      className={`btn ghost small ${oracion.yo_oro ? 'primary' : ''}`}
                      onClick={() => void llamita(oracion.id)}
                    >
                      🔥 {t('oracion.orando', { count: oracion.orando })}
                    </button>
                    {miEmail && oracion.email === miEmail && !oracion.respondida && (
                      <button
                        className="btn ghost small"
                        onClick={() => setRespondiendo(respondiendo === oracion.id ? null : oracion.id)}
                      >
                        {t('oracion.marcarRespondida')}
                      </button>
                    )}
                  </div>

                  {respondiendo === oracion.id && (
                    <div>
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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!cargando && lista && lista.length === 0 && (
            <p className="muted assistant-hint">{t('oracion.vacio')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
