export interface LoginRta {
  licencia: string
  expiraISO: string
  estado: string
}

export type RtaBackend<T> = { ok: true; data: T } | { ok: false; error: string; codigo?: string }

export class ClienteLicencia {
  constructor(private backendUrl: string, private fetchFn: typeof fetch = fetch) {}

  private async post<T>(ruta: string, cuerpo: unknown): Promise<RtaBackend<T>> {
    let r: Response
    try {
      r = await this.fetchFn(`${this.backendUrl}${ruta}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo)
      })
    } catch {
      return { ok: false, error: 'no se pudo conectar', codigo: 'red' }
    }
    try {
      return (await r.json()) as RtaBackend<T>
    } catch {
      return { ok: false, error: 'respuesta no valida del servidor', codigo: 'red' }
    }
  }

  async tokenSesion(email: string, password: string): Promise<{ token: string } | { error: string; codigo?: string }> {
    const rta = await this.post<{ token: string; email: string; estado: string }>('/auth/login', { email, password })
    return rta.ok ? { token: rta.data.token } : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async activar(token: string, huella: string): Promise<LoginRta | { error: string; codigo?: string }> {
    const rta = await this.post<LoginRta>('/license/activar', { tokenSesion: token, huella })
    return rta.ok ? rta.data : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async refrescar(jwt: string): Promise<LoginRta | { error: string; codigo?: string }> {
    const rta = await this.post<LoginRta>('/license/refrescar', { licencia: jwt })
    return rta.ok ? rta.data : { error: rta.error, codigo: rta.codigo ?? 'red' }
  }

  async desactivar(token: string, huella: string): Promise<void> {
    await this.post('/license/desactivar', { tokenSesion: token, huella })
  }
}
