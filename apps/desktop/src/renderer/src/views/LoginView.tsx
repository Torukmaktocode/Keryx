import { useState } from 'react'
import type { JSX } from 'react'
import { useI18n } from '@keryx/i18n'
import { api } from '../lib/api'
import { esErrorLogin, codigoAKey } from '../lib/licencia-ui'

export function LoginView({ alListo }: { alListo: () => void }): JSX.Element {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function entrar(): Promise<void> {
    setCargando(true)
    setErrorKey(null)
    const rta = await api.licencia.login({ email, password })
    setCargando(false)
    if (esErrorLogin(rta)) {
      setErrorKey(t(codigoAKey(rta.codigo) as never))
      return
    }
    alListo()
  }

  return (
    <div className="licencia-panel">
      <h1>Keryx</h1>
      <p className="licencia-sub">{t('licencia.loginTitulo')}</p>
      <label className="licencia-campo">
        <span>{t('licencia.email')}</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </label>
      <label className="licencia-campo">
        <span>{t('licencia.password')}</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      {errorKey && <p className="licencia-error">{errorKey}</p>}
      <button className="licencia-boton" onClick={() => void entrar()} disabled={cargando || !email || password.length < 6}>
        {cargando ? t('app.loading') : t('licencia.entrar')}
      </button>
      <button className="licencia-enlace" onClick={() => void api.licencia.checkout()}>
        {t('licencia.comprar')}
      </button>
    </div>
  )
}
