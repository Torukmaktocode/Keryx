/**
 * Titulos de modulos traducidos en vivo (sub-agente de codigo, 0 tokens).
 * Reusa el motor del traductor (daemon Argos + cache LRU); los nombres son
 * cortes, asi que el lote resuelve en segundos y queda cacheado en caliente.
 */
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { normalizarIdioma, traducirTexto } from './traductor'

export interface ModuloEtiqueta {
  name: string
  description?: string | null
  lang?: string | null
}

/** Etiqueta visible de un modulo (la misma logica de moduleLabel). */
export function etiquetaBase(m: ModuloEtiqueta): string {
  const description = (m.description ?? '').trim()
  return description || m.name
}

/** Traduce en lote las etiquetas visibles de una lista de modulos (para <option>). */
export function useEtiquetasModulos(mods: ModuloEtiqueta[]): string[] {
  const target = useAppStore((s) => s.settings.translateLocale)
  const etiquetas = mods.map(etiquetaBase)
  const clave = `${target}\u0002${etiquetas.join('\u0000')}`
  const modsRef = useRef(mods)
  modsRef.current = mods
  const [res, setRes] = useState<{ clave: string; valores: string[] } | null>(null)

  useEffect(() => {
    const tgt = normalizarIdioma(clave.split('\u0002')[0])
    if (!tgt || tgt === 'off' || tgt === 'es') return
    let alive = true
    void (async () => {
      const lista = modsRef.current
      const valores: string[] = []
      for (let i = 0; i < lista.length; i++) {
        valores.push(await traducirTexto(etiquetaBase(lista[i]), normalizarIdioma(lista[i].lang), tgt))
        if (alive && (i % 6 === 5 || i === lista.length - 1)) {
          setRes({ clave, valores: [...valores] })
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [clave])

  const activo = target !== 'off' && target !== 'es'
  if (!activo || !res || res.clave !== clave) return etiquetas
  return etiquetas.map((e, i) => res.valores[i] ?? e)
}
