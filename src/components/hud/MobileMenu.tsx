import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { SKILLS } from '../../data'
import { ARRANGE_MODES, arrangePositions } from '../../lib/arrange'
import { EXPORT_OPTIONS, exportCanvas, type ExportFormat, type ExportScope } from '../../lib/exportCanvas'
import { PRESENTATION_MODES } from '../../presentation/modes'
import { useAppStore } from '../../store/appStore'

const itemClass =
  'block w-full rounded-lg px-3 py-2 text-left text-[13px] transition-colors hover:bg-(--t-bg) disabled:opacity-40'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={title} className="space-y-0.5">
      <p className="px-3 pt-1 font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{title}</p>
      {children}
    </div>
  )
}

/**
 * Menu do cabeçalho no celular. Reúne, em uma lista, os botões que não cabem na barra estreita. Usa as mesmas
 * ações do desktop. Só aparece abaixo de md.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const faqOpen = useAppStore((s) => s.faqOpen)
  const setFaqOpen = useAppStore((s) => s.setFaqOpen)
  const resetLayout = useAppStore((s) => s.resetLayout)
  const setPositions = useAppStore((s) => s.setPositions)
  const showModels = useAppStore((s) => s.showModels)
  const toggleModels = useAppStore((s) => s.toggleModels)
  const presenting = useAppStore((s) => s.presentation.active)
  const presentationMode = useAppStore((s) => s.presentation.mode)
  const startPresentation = useAppStore((s) => s.startPresentation)
  const stopPresentation = useAppStore((s) => s.stopPresentation)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const run = (action: () => void) => {
    action()
    setOpen(false)
  }

  const exportFormat = async (format: ExportFormat, scope: ExportScope) => {
    setOpen(false)
    setStatus(null)
    try {
      if (!(await exportCanvas(format, scope))) setStatus('Canvas não encontrado')
    } catch {
      setStatus('Não foi possível exportar esta vista')
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative lg:hidden"
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !open) return
        event.stopPropagation()
        setOpen(false)
      }}
    >
      <button
        type="button"
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) transition-colors hover:text-(--t-text)"
      >
        {open ? <X size={16} /> : <Menu size={16} />}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Menu"
          className="absolute top-full right-0 z-50 mt-2 max-h-[70dvh] w-[min(300px,calc(100vw-2rem))] space-y-2 overflow-y-auto rounded-xl border border-(--t-border) bg-(--t-surface) p-2 shadow-lg backdrop-blur-md"
        >
          <Group title="Vista">
            <button type="button" role="menuitem" className={itemClass} onClick={() => run(resetLayout)}>
              Padrão: volta ao layout curado
            </button>
            <button type="button" role="menuitem" className={itemClass} onClick={() => run(() => setFaqOpen(!faqOpen))}>
              FAQ {faqOpen ? '· aberto' : ''}
            </button>
            <button type="button" role="menuitem" className={itemClass} onClick={() => run(toggleModels)}>
              Modelos · {showModels ? 'ligados' : 'desligados'}
            </button>
          </Group>

          <Group title="Organizar">
            {ARRANGE_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => run(() => setPositions(arrangePositions(SKILLS, mode.id)))}
              >
                {mode.label}
              </button>
            ))}
          </Group>

          <Group title="Exportar">
            {EXPORT_OPTIONS.map((o) => (
              <button
                key={`${o.format}-${o.scope}`}
                type="button"
                role="menuitem"
                className={itemClass}
                onClick={() => void exportFormat(o.format, o.scope)}
              >
                {o.label}
              </button>
            ))}
          </Group>

          <Group title="Apresentar">
            {(['apresentacao', 'historia'] as const).map((m) => {
              const on = presenting && presentationMode === m
              return (
                <button
                  key={m}
                  type="button"
                  role="menuitem"
                  className={itemClass}
                  onClick={() => run(() => (on ? stopPresentation() : startPresentation(m)))}
                >
                  {PRESENTATION_MODES[m].label} {on ? '· em andamento' : ''}
                </button>
              )
            })}
          </Group>

          {status && (
            <p role="status" className="px-3 pb-1 text-[11px] text-(--t-text-muted)">
              {status}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
