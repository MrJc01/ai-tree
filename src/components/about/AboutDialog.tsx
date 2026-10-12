import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { t } from '../../i18n'

/**
 * Slide "Sobre". Abre sozinho na primeira visita e pelo botão do cabeçalho. Fecha com o X, com Escape ou
 * clicando fora. Escape é capturado aqui, para não fechar também a gaveta ou o FAQ que estiverem por baixo.
 */
export function AboutDialog() {
  const open = useAppStore((s) => s.aboutOpen)
  const setAboutOpen = useAppStore((s) => s.setAboutOpen)
  const startRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    startRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setAboutOpen(false)
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, setAboutOpen])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setAboutOpen(false)
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="relative max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-(--t-border) bg-(--t-bg) p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={() => setAboutOpen(false)}
          aria-label={t('about.close')}
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) transition-colors hover:text-(--t-text)"
        >
          <X size={16} />
        </button>

        <p className="font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{t('app.title')}</p>
        <h2 id="about-title" className="mt-2 pr-10 text-xl font-semibold tracking-tight">
          {t('about.title')}
        </h2>

        <div className="mt-4 space-y-3 text-[14px] leading-relaxed">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>

        <div className="mt-6 rounded-xl border border-(--t-border) bg-(--t-surface) p-4">
          <p className="font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{t('about.orgLabel')}</p>
          <p className="mt-2 text-[14px]">
            {t('about.orgText')}{' '}
            <a
              href="https://crom.run"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-(--t-accent) underline underline-offset-4"
            >
              crom.run
            </a>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            ref={startRef}
            type="button"
            onClick={() => setAboutOpen(false)}
            className="h-9 rounded-md border border-(--t-accent) bg-(--t-accent) px-4 font-mono text-[11px] tracking-[0.12em] text-(--t-bg) uppercase"
          >
            {t('about.start')}
          </button>
        </div>
      </section>
    </div>
  )
}
