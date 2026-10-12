import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SKILLS } from '../../data'
import { ARRANGE_MODES, arrangePositions, type ArrangeMode } from '../../lib/arrange'
import { useAppStore } from '../../store/appStore'
import { t } from '../../i18n'

/**
 * Botão Auto-organizar com um dropdown para escolher o tipo de organização. Fecha ao escolher,
 * ao clicar fora ou com ESC. O ESC não chega à gaveta, porque o menu o consome.
 */
export function ArrangeMenu({ buttonClass }: { buttonClass: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const setPositions = useAppStore((s) => s.setPositions)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onPointerDown)
    return () => window.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const apply = (mode: ArrangeMode) => {
    setPositions(arrangePositions(SKILLS, mode))
    setOpen(false)
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
        title={t('arrange.title')}
        className={`${buttonClass} gap-1.5`}
      >
        {t('arrange.button')}
        <ChevronDown size={12} aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('arrange.menu')}
          className="absolute top-full right-0 z-30 mt-2 w-[min(320px,calc(100vw-2rem))] space-y-0.5 rounded-xl border border-(--t-border) bg-(--t-surface) p-1.5 shadow-lg backdrop-blur-md"
        >
          {ARRANGE_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="menuitem"
              onClick={() => apply(mode.id)}
              className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-(--t-bg)"
            >
              <span className="block text-[13px] font-medium">{t(mode.labelKey)}</span>
              <span className="block text-[12px] text-(--t-text-muted)">{t(mode.descKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
