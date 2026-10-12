import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, X } from 'lucide-react'
import { SKILL_BY_ID } from '../../data'
import { DRAWER_MAX_SHARE, DRAWER_MAX_WIDTH, MOBILE_DRAWER_SHARE } from '../../lib/geometry'
import { DESKTOP_QUERY, useMedia } from '../../lib/useMedia'
import { useAppStore, type DrawerEntry } from '../../store/appStore'
import { CompanySheet, SourceSheet } from './DetailSheets'
import { breadcrumbsFor } from './entries'
import { DensityToggle } from './shared'
import { SkillSheet } from './SkillSheet'
import { t } from '../../i18n'

const SPRING = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 } as const
/** Quanto cada folha de baixo fica exposta à esquerda da folha de cima. */
const STACK_STEP = 22

function entryKey(entry: DrawerEntry): string {
  switch (entry.kind) {
    case 'skill':
      return `skill:${entry.id}`
    case 'source':
      return `source:${entry.skillId}:${entry.index}`
    case 'company':
      return `company:${entry.name}`
  }
}

function renderEntry(entry: DrawerEntry) {
  switch (entry.kind) {
    case 'skill': {
      const skill = SKILL_BY_ID.get(entry.id)
      return skill ? (
        <SkillSheet skill={skill} />
      ) : (
        <p className="p-6 text-[13px] text-(--t-text-muted)">Habilidade não encontrada: {entry.id}</p>
      )
    }
    case 'source':
      return (
        <div className="h-full overflow-y-auto">
          <SourceSheet skillId={entry.skillId} index={entry.index} />
        </div>
      )
    case 'company':
      return (
        <div className="h-full overflow-y-auto">
          <CompanySheet name={entry.name} />
        </div>
      )
  }
}

/**
 * Gaveta lateral translúcida. Ela empilha folhas: um paper ou uma empresa abre por cima da habilidade,
 * e as folhas de baixo ficam expostas à esquerda. ESC volta uma folha. Na primeira, fecha a gaveta.
 */
export function SkillDrawer() {
  const drawer = useAppStore((s) => s.drawer)
  const popEntry = useAppStore((s) => s.popEntry)
  const jumpTo = useAppStore((s) => s.jumpTo)
  const closeDrawer = useAppStore((s) => s.closeDrawer)
  const faqOpen = useAppStore((s) => s.faqOpen)
  const open = drawer.length > 0

  useEffect(() => {
    // Com o FAQ aberto, ESC fecha o FAQ e não mexe na gaveta.
    if (!open || faqOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        popEntry()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, faqOpen, popEntry])

  const desktop = useMedia(DESKTOP_QUERY)
  const crumbs = breadcrumbsFor(drawer)

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="drawer"
          aria-label={t('drawer.aside')}
          initial={desktop ? { x: '100%' } : { y: '100%' }}
          animate={{ x: 0, y: 0 }}
          exit={desktop ? { x: '100%' } : { y: '100%' }}
          transition={SPRING}
          className={`absolute z-30 flex flex-col shadow-2xl ${
            desktop ? 'inset-y-0 right-0 border-l border-(--t-border)' : 'inset-x-0 bottom-0 rounded-t-xl border-t border-(--t-border)'
          }`}
          style={{
            ...(desktop
              ? { width: `min(${DRAWER_MAX_WIDTH}px, ${DRAWER_MAX_SHARE * 100}%)` }
              : { height: `${MOBILE_DRAWER_SHARE * 100}%` }),
            background: 'color-mix(in srgb, var(--t-bg) 92%, transparent)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="flex items-center gap-2 border-b border-(--t-border) px-3 py-2.5">
            {drawer.length > 1 && (
              <button
                type="button"
                onClick={popEntry}
                aria-label={t('drawer.back')}
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) hover:text-(--t-text)"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <nav aria-label={t('drawer.path')} className="min-w-0 flex-1 overflow-hidden text-[12px] leading-relaxed">
              {crumbs.map((c, i) => (
                <span key={`${c.label}-${i}`}>
                  {i > 0 && <span className="mx-1.5 text-(--t-text-muted)">&gt;</span>}
                  {c.depth === null ? (
                    <span className="text-(--t-text-muted)">{c.label}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => jumpTo(c.depth as number)}
                      disabled={c.depth === drawer.length - 1}
                      className="max-w-[180px] truncate align-middle underline-offset-2 hover:underline disabled:cursor-default disabled:no-underline disabled:text-(--t-text)"
                    >
                      {c.label}
                    </button>
                  )}
                </span>
              ))}
            </nav>
            <span className="shrink-0">
              <DensityToggle />
            </span>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label={t('a11y.closeDrawer')}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) hover:text-(--t-text)"
            >
              <X size={16} />
            </button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {drawer.map((entry, i) => {
                const depth = drawer.length - 1 - i
                const isTop = depth === 0
                return (
                  <motion.div
                    key={`${i}-${entryKey(entry)}`}
                    initial={desktop ? { left: '100%' } : { top: '100%' }}
                    animate={desktop ? { left: i * STACK_STEP, opacity: isTop ? 1 : 0.85 } : { top: i * STACK_STEP, opacity: isTop ? 1 : 0.85 }}
                    exit={desktop ? { left: '100%', opacity: 0 } : { top: '100%', opacity: 0 }}
                    transition={SPRING}
                    onClick={isTop ? undefined : () => jumpTo(i)}
                    className={`absolute bg-(--t-bg) ${
                      desktop
                        ? 'inset-y-0 right-0 shadow-[-10px_0_24px_rgba(0,0,0,0.18)]'
                        : 'inset-x-0 bottom-0 rounded-t-xl shadow-[0_-10px_24px_rgba(0,0,0,0.18)]'
                    } ${isTop ? '' : `cursor-pointer ${desktop ? 'border-l' : 'border-t'} border-(--t-border)`}`}
                    style={{ zIndex: i + 1 }}
                    aria-hidden={!isTop}
                  >
                    {renderEntry(entry)}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
