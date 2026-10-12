import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { EXPORT_OPTIONS, exportCanvas, type ExportFormat, type ExportScope } from '../../lib/exportCanvas'
import { t } from '../../i18n'

/**
 * Botão Exportar: salva o canvas como PNG ou SVG, da vista atual ou da árvore inteira.
 */
export function ExportMenu({ buttonClass }: { buttonClass: string }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const exportAs = async (format: ExportFormat, scope: ExportScope) => {
    setOpen(false)
    setStatus(null)
    try {
      if (!(await exportCanvas(format, scope))) setStatus(t('export.noCanvas'))
    } catch {
      setStatus(t('export.failed'))
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return
        event.stopPropagation()
        setOpen(false)
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        title={t('app.exportTitle')}
        className={`${buttonClass} gap-1.5`}
      >
        {t('app.export')}
        <ChevronDown size={12} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('export.menu')}
          className="absolute top-full right-0 z-30 mt-2 w-[min(300px,calc(100vw-2rem))] space-y-0.5 rounded-xl border border-(--t-border) bg-(--t-surface) p-1.5 shadow-lg backdrop-blur-md"
        >
          {EXPORT_OPTIONS.map((o) => (
            <button
              key={`${o.format}-${o.scope}`}
              type="button"
              role="menuitem"
              onClick={() => void exportAs(o.format, o.scope)}
              className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-(--t-bg)"
            >
              <span className="block text-[13px] font-medium">{t(o.labelKey)}</span>
              <span className="block text-[12px] text-(--t-text-muted)">{t(o.descKey)}</span>
            </button>
          ))}
        </div>
      )}

      {status && (
        <p role="status" className="absolute top-full right-0 mt-2 rounded-md bg-(--t-surface) px-2 py-1 text-[11px] text-(--t-text-muted)">
          {status}
        </p>
      )}
    </div>
  )
}
