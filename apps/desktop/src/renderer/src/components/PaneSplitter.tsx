import { useCallback, useEffect, useRef } from 'react'

interface Props {
  onResize: (dx: number) => void
  onReset: () => void
  onEnd?: () => void
}

/** Separador entre paneles: arrastrar ajusta anchos, doble clic restaura. */
export function PaneSplitter({ onResize, onReset, onEnd }: Props) {
  const dragging = useRef(false)
  const last = useRef(0)

  const onPointerMove = useCallback(
    (event: PointerEvent): void => {
      if (!dragging.current) return
      const dx = event.clientX - last.current
      last.current = event.clientX
      if (dx !== 0) onResize(dx)
    },
    [onResize]
  )

  const stop = useCallback((): void => {
    if (dragging.current) onEnd?.()
    dragging.current = false
  }, [onEnd])

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', stop)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stop)
    }
  }, [onPointerMove, stop])

  return (
    <div
      className="pane-splitter"
      role="separator"
      aria-orientation="vertical"
      title=""
      onPointerDown={(e) => {
        dragging.current = true
        last.current = e.clientX
        e.preventDefault()
      }}
      onDoubleClick={onReset}
    />
  )
}
