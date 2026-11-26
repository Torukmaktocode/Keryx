import type { Dispositivo, Suscripcion, Usuario } from './tipos'

export interface BaseFalsa {
  suscripciones: Suscripcion[]
  usuarios: Usuario[]
  dispositivos: Dispositivo[]
  sermones_comunidad?: Record<string, unknown>[]
}

export interface FetchFalso {
  (url: string, init?: RequestInit): Promise<Response>
}

export function supabaseFalso(
  base: BaseFalsa = { suscripciones: [], usuarios: [], dispositivos: [] }
): { base: BaseFalsa; fetch: FetchFalso } {
  const fetchFalso: FetchFalso = async (url, init) => {
    const u = new URL(url)
    const tabla = u.pathname.split('/rest/v1/')[1]?.split('?')[0] ?? ''
    const params = u.searchParams
    const prefer =
      init?.headers instanceof Headers
        ? init.headers.get('Prefer') ?? ''
        : String((init?.headers as Record<string, string> | undefined)?.Prefer ?? '')
    const cuerpo = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : null

    if (init?.method === 'POST' && prefer.includes('resolution=merge-duplicates')) {
      const filas = Array.isArray(cuerpo) ? cuerpo : [cuerpo]
      for (const fila of filas) {
        const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla]
        const idx = lista.findIndex((x) =>
          tabla === 'dispositivos'
            ? x['email'] === fila['email'] && x['huella'] === fila['huella']
            : x['email'] === fila['email']
        )
        if (idx >= 0) lista[idx] = { ...lista[idx], ...fila }
        else lista.push(fila)
      }
      return new Response('[]', { status: 201 })
    }

    if (init?.method === 'POST') {
      const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla] ?? []
      lista.push(cuerpo as Record<string, unknown>)
      return new Response('[]', { status: 201 })
    }

    if (init?.method === 'PATCH') {
      const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla] ?? []
      let tocadas = lista
      for (const [clave, valor] of params.entries()) {
        if (clave === 'select' || clave === 'order' || clave === 'limit') continue
        if (valor.startsWith('eq.')) tocadas = tocadas.filter((x) => x[clave] === valor.slice(3))
      }
      for (const fila of tocadas) Object.assign(fila, cuerpo)
      return Response.json(tocadas)
    }

    if (init?.method === 'DELETE') {
      const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla]
      const email = params.get('email')?.replace(/^eq\./, '') ?? null
      const huella = params.get('huella')?.replace(/^eq\./, '') ?? null
      const restantes = lista.filter(
        (x) => x['email'] !== email || (huella !== null && x['huella'] !== huella)
      )
      ;(base as unknown as Record<string, Record<string, unknown>[]>)[tabla] = restantes
      return new Response(null, { status: 204 })
    }

    const lista = (base as unknown as Record<string, Record<string, unknown>[]>)[tabla] ?? []
    let filtrada = lista
    for (const [clave, valor] of params.entries()) {
      if (clave === 'select' || clave === 'order' || clave === 'limit') continue
      if (valor.startsWith('eq.')) filtrada = filtrada.filter((x) => x[clave] === valor.slice(3))
    }
    return Response.json(filtrada)
  }
  return { base, fetch: fetchFalso }
}
