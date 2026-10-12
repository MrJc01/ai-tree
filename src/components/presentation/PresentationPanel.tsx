import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Undo2, X } from 'lucide-react'
import { MOBILE_PRESENTATION_SHARE } from '../../lib/geometry'
import { isTyping } from '../../lib/dom'
import { DESKTOP_QUERY, useMedia } from '../../lib/useMedia'
import { runPresentationStep } from '../../presentation/runner'
import { PRESENTATION_MODES, stepsOf } from '../../presentation/modes'
import { useAppStore } from '../../store/appStore'

const PANEL_WIDTH = 360

/**
 * Painel lateral da apresentação. Mostra o passo atual e o roteiro completo, para quem apresenta
 * saber onde está e para onde vai. Ao mudar de passo, as ações dele são aplicadas à tela.
 */
export function PresentationPanel() {
  const active = useAppStore((s) => s.presentation.active)
  const desktop = useMedia(DESKTOP_QUERY)
  const index = useAppStore((s) => s.presentation.index)
  const mode = useAppStore((s) => s.presentation.mode)
  const steps = stepsOf(mode)
  const total = steps.length
  const nextStep = useAppStore((s) => s.nextStep)
  const prevStep = useAppStore((s) => s.prevStep)
  const goToStep = useAppStore((s) => s.goToStep)
  const trail = useAppStore((s) => s.presentation.trail)
  const backToLastSeen = useAppStore((s) => s.backToLastSeen)
  const lastSeen = trail.length > 0 ? stepsOf(mode)[trail[trail.length - 1]] : undefined
  const stopPresentation = useAppStore((s) => s.stopPresentation)

  // Cada passo leva a tela ao estado que o texto descreve, inclusive ao abrir a apresentação.
  useEffect(() => {
    if (!active) return
    runPresentationStep(steps[index].actions)
  }, [active, index, steps])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevStep()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, nextStep, prevStep])

  const step = steps[index]
  const isLast = index === total - 1

  return (
    <motion.aside
      aria-label="Roteiro da apresentação"
      aria-hidden={!active}
      inert={!active}
      initial={false}
      animate={desktop ? { width: active ? PANEL_WIDTH : 0 } : { height: active ? `${MOBILE_PRESENTATION_SHARE * 100}%` : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      className={`overflow-hidden bg-(--t-surface) backdrop-blur-md ${
        desktop ? 'relative h-full shrink-0' : 'absolute inset-x-0 bottom-0 z-40 rounded-t-xl border-t border-(--t-border)'
      }`}
      style={{ borderRight: desktop && active ? '1px solid var(--t-border)' : 'none' }}
    >
      <div style={desktop ? { width: PANEL_WIDTH } : undefined} className="flex h-full w-full flex-col">
        <div className="flex items-center justify-between border-b border-(--t-border) px-5 py-3">
          <span className="font-mono text-[10px] tracking-[0.16em] text-(--t-text-muted) uppercase">
            {PRESENTATION_MODES[mode].title} · passo {index + 1} de {total}
          </span>
          <button
            type="button"
            onClick={stopPresentation}
            aria-label="Encerrar apresentação"
            className="inline-flex size-7 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) hover:text-(--t-text)"
          >
            <X size={14} />
          </button>
        </div>

        <div className="h-0.5 bg-(--t-border)" aria-hidden>
          <div
            className="h-full bg-(--t-accent) transition-[width] duration-500"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <h2 className="text-lg leading-tight font-semibold tracking-tight">{step.title}</h2>
          <div className="mt-3 space-y-2.5">
            {step.body.map((paragraph) => (
              <p key={paragraph} className="text-[13px] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {step.notes && (
            <div className="mt-4 rounded-md border border-dashed border-(--t-border) p-3">
              <p className="mb-1 font-mono text-[9px] tracking-[0.16em] text-(--t-text-muted) uppercase">
                Para quem apresenta
              </p>
              <p className="text-[12px] leading-relaxed text-(--t-text-muted)">{step.notes}</p>
            </div>
          )}

          <section className="mt-6" aria-label="Roteiro completo">
            <h3 className="mb-2 font-mono text-[10px] tracking-[0.16em] text-(--t-text-muted) uppercase">Roteiro</h3>
            <ol className="space-y-0.5">
              {steps.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goToStep(i)}
                    aria-current={i === index ? 'step' : undefined}
                    data-step-id={s.id}
                    className={`flex w-full items-baseline gap-2 rounded px-2 py-1 text-left text-[12px] transition-colors ${
                      i === index
                        ? 'bg-(--t-accent) text-(--t-bg)'
                        : 'text-(--t-text-muted) hover:bg-(--t-bg) hover:text-(--t-text)'
                    }`}
                  >
                    <span className="w-5 shrink-0 font-mono text-[10px] opacity-70">{i + 1}.</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="border-t border-(--t-border) px-4 pt-3">
          <button
            type="button"
            onClick={backToLastSeen}
            disabled={!lastSeen}
            title={lastSeen ? `Volta para: ${lastSeen.title}` : 'Ainda não há passo anterior visto'}
            className="inline-flex max-w-full items-center gap-1.5 text-[11px] text-(--t-text-muted) transition-colors hover:text-(--t-text) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Undo2 size={12} className="shrink-0" />
            <span className="truncate">{lastSeen ? `Voltar ao último visto: ${lastSeen.title}` : 'Voltar ao último visto'}</span>
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-md border border-(--t-border) px-3 py-1.5 text-[12px] text-(--t-text-muted) transition-colors hover:text-(--t-text) disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Anterior
          </button>
          <span className="font-mono text-[9px] text-(--t-text-muted)">← → para navegar</span>
          <button
            type="button"
            onClick={nextStep}
            disabled={isLast}
            className="inline-flex items-center gap-1 rounded-md border border-(--t-accent) bg-(--t-accent) px-3 py-1.5 text-[12px] text-(--t-bg) transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLast ? 'Fim' : 'Próximo'} {!isLast && <ChevronRight size={14} />}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
