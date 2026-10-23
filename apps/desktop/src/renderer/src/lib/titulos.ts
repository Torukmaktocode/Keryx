/**
 * Titulos de modulos traducidos en vivo (sub-agente de codigo, 0 tokens).
 * Reusa el motor del traductor (daemon Argos + cache LRU) con UNA llamada
 * por lote; los nombres son cortes, asi que resuelve en segundos y queda
 * cacheado en caliente.
 */
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { NATIVAS, normalizarIdioma, traducirLoteMulti } from './traductor'
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
    // En lenguas nativas el motor es lento (NLLB 600M): 700 titulos en lote
    // saturaria el daemon; los titulos quedan originales.
    if (NATIVAS.includes(tgt)) return
    let alive = true
    void (async () => {
      const lista = modsRef.current
      const valores = await traducirLoteMulti(
        lista.map((m) => ({ texto: etiquetaBase(m), lang: m.lang })),
        tgt
      )
      if (alive) setRes({ clave, valores })
    })()
    return () => {
      alive = false
    }
  }, [clave])

  const activo = target !== 'off' && target !== 'es'
  if (!activo || !res || res.clave !== clave) return etiquetas
  return etiquetas.map((e, i) => res.valores[i] ?? e)
}
