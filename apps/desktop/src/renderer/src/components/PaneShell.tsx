import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useI18n } from '@keryx/i18n'
import type { StudyPaneKind, SwordModule } from '@keryx/core'
import { Icon } from './Icon'
import { PANE_LABELS } from '../lib/studyLayout'
import { moduleOptionLabel } from '../lib/modules'

const PANE_KINDS: StudyPaneKind[] = ['bible', 'commentary', 'dictionary', 'book']

interface Props {
  kind: StudyPaneKind
  modules: SwordModule[]
  moduleId: string
  sync: boolean
  refLabel: string
  children: ReactNode
  onModuleChange: (name: string) => void
  onToggleSync: () => void
  onChangeKind: (kind: StudyPaneKind) => void
  onClose: () => void
}

/** Cabecera comun del estudio: modulo + menu de zona + chip de referencia sincronizada. */
export function PaneShell({
  kind,
  modules,
  moduleId,
  sync,
  refLabel,
  children,
  onModuleChange,
  onToggleSync,
  onChangeKind,
  onClose
}: Props) {
  const { t, locale } = useI18n()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (event: globalThis.MouseEvent): void => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [open])

  const iconFor = (k: StudyPaneKind): IconKey =>
    k === 'bible' ? 'reader' : k === 'book' ? 'book' : k === 'commentary' ? 'library' : 'modules'

  return (
    <section className="pane" data-pane={kind}>
      <div className="pane-head">
        <span className="pane-kind">{t(PANE_LABELS[kind])}</span>
        <div className="spacer" />
        {modules.length > 1 ? (
          <select
            className="select"
            value={moduleId}
            title={moduleId}
            onChange={(e) => onModuleChange(e.target.value)}
          >
            {!modules.some((m) => m.name === moduleId) && (
              <option value={moduleId}>{moduleId}</option>
            )}
            {modules.map((m) => (
              <option key={`${m.driver}-${m.name}`} value={m.name}>
                {moduleOptionLabel(m, locale)}
              </option>
            ))}
          </select>
        ) : null}
        <div className="pane-menu" ref={menuRef}>
          <button
            className="btn small ghost"
            title={t('study.menu.title')}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" size={15} />
          </button>
          {open && (
            <div className="pane-menu-pop">
              <label className="pane-menu-title">{t('study.menu.changeType')}</label>
              {PANE_KINDS.map((k) => (
                <button
                  key={k}
                  className={`pane-menu-item ${k === kind ? 'active' : ''}`}
                  onClick={() => {
                    onChangeKind(k)
                    setOpen(false)
                  }}
                >
                  <Icon name={iconFor(k)} size={14} />
                  {t(PANE_LABELS[k])}
                </button>
              ))}
              <div className="pane-menu-sep" />
              <button className="pane-menu-item" onClick={() => { onToggleSync(); setOpen(false) }}>
                <Icon name="pin" size={14} />
                {sync ? t('study.menu.unpin') : t('study.menu.pin')}
              </button>
              <button className="pane-menu-item danger" onClick={() => { onClose(); setOpen(false) }}>
                <Icon name="close" size={14} />
                {t('study.menu.close')}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pane-ref">
        <span className={`verse-mark ${sync ? 'synced' : 'pinned-off'}`} />
        {refLabel}
      </div>
      {children}
    </section>
  )
}

type IconKey =
  | 'reader'
  | 'book'
  | 'library'
  | 'modules'
