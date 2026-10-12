import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { exportCanvas, type ExportFormat } from '../../lib/exportCanvas'

const FORMATS: Array<{ id: ExportFormat; label: string; description: string }> = [
  { id: 'png', label: 'PNG', description: 'Imagem para slides e documentos. Mantém as cores do tema atual.' },
  { id: 'svg', label: 'SVG', description: 'Vetorial, para editar em outro programa. Mantém as cores do tema atual.' },
]

/**
 * Botão Exportar: salva a vista atual do canvas como PNG ou SVG. Exporta o que está na tela, com o zoom
 * e a posição atuais. Para a árvore inteira, ajuste o zoom antes (Padrão, depois Ajustar).
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

  const exportAs = async (format: ExportFormat) => {
    setOpen(false)
    setStatus(null)
    try {
      if (!(await exportCanvas(format))) setStatus('Canvas não encontrado')
    } catch {
      setStatus('Não foi possível exportar esta vista')
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
        title="Salva a vista atual do canvas como imagem"
        className={`${buttonClass} gap-1.5`}
      >
        Exportar
        <ChevronDown size={12} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Formato da exportação"
          className="absolute top-full right-0 z-30 mt-2 w-[min(300px,calc(100vw-2rem))] space-y-0.5 rounded-xl border border-(--t-border) bg-(--t-surface) p-1.5 shadow-lg backdrop-blur-md"
        >
          {FORMATS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="menuitem"
              onClick={() => void exportAs(f.id)}
              className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-(--t-bg)"
            >
              <span className="block text-[13px] font-medium">{f.label}</span>
              <span className="block text-[12px] text-(--t-text-muted)">{f.description}</span>
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
