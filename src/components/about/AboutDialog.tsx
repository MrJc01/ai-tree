import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { LOCALES, type Locale } from '../../i18n/locales'
import type { UIKey } from '../../i18n/ui/pt'
import { t } from '../../i18n'
import { useAppStore } from '../../store/appStore'

/**
 * Slides do "Sobre". `shot` é o número do print em public/sobre/<idioma>/<n>.png, gerado por npm run prints:sobre.
 * O último slide não tem print: traz a fonte, a licença e a organização.
 */
const SLIDES: Array<{ title: UIKey; texts: UIKey[]; shot: number | null }> = [
  { title: 'about.s1.title', texts: ['about.p1'], shot: 1 },
  { title: 'about.s2.title', texts: ['about.s2.text'], shot: 2 },
  { title: 'about.s3.title', texts: ['about.s3.text'], shot: 3 },
  { title: 'about.s4.title', texts: ['about.s4.text'], shot: 4 },
  { title: 'about.s5.title', texts: ['about.s5.text'], shot: 5 },
  { title: 'about.s6.title', texts: ['about.p2', 'about.p3'], shot: null },
]

const LAST = SLIDES.length - 1

const navButton =
  'inline-flex h-9 items-center gap-1 rounded-md border border-(--t-border) px-3 font-mono text-[11px] tracking-[0.12em] text-(--t-text-muted) uppercase transition-colors hover:text-(--t-text) disabled:opacity-40'

/**
 * Slide "Sobre": carrossel com prints e explicação, abre sozinho na primeira visita e pelo botão do cabeçalho.
 * Tem seletor de idioma. Fecha com o X, com Escape ou clicando fora; setas trocam de slide. Escape e setas são
 * capturados aqui, para não fechar a gaveta nem passar os passos da apresentação que estiverem por baixo.
 */
export function AboutDialog() {
  const open = useAppStore((s) => s.aboutOpen)
  const setAboutOpen = useAppStore((s) => s.setAboutOpen)
  const slide = useAppStore((s) => s.aboutSlide)
  const setAboutSlide = useAppStore((s) => s.setAboutSlide)
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setAboutOpen(false)
        return
      }
      // Com o foco no seletor de idioma, as setas são dele.
      if (event.target instanceof HTMLSelectElement) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.stopPropagation()
        const current = useAppStore.getState().aboutSlide
        const next = event.key === 'ArrowLeft' ? current - 1 : current + 1
        setAboutSlide(Math.min(LAST, Math.max(0, next)))
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, setAboutOpen, setAboutSlide])

  if (!open) return null

  const current = SLIDES[slide]
  const go = (n: number) => setAboutSlide(Math.min(LAST, Math.max(0, n)))

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setAboutOpen(false)
      }}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--t-border) bg-(--t-bg) p-5 shadow-2xl outline-none sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
          <p className="font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{t('app.title')}</p>
          <select
            aria-label={t('app.language')}
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            className="h-7 cursor-pointer rounded-md border border-(--t-border) bg-transparent px-2 font-mono text-[11px] text-(--t-text-muted) transition-colors hover:text-(--t-text)"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setAboutOpen(false)}
          aria-label={t('about.close')}
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) transition-colors hover:text-(--t-text)"
        >
          <X size={16} />
        </button>

        <h2 id="about-title" className="mt-3 text-lg font-semibold tracking-tight">
          {t('about.title')}
        </h2>

        {current.shot !== null && (
          <img
            key={`${locale}-${current.shot}`}
            src={`${import.meta.env.BASE_URL}sobre/${locale}/${current.shot}.png`}
            alt={t(current.title)}
            className="mt-4 aspect-[16/10] w-full rounded-xl border border-(--t-border) object-cover object-top"
          />
        )}

        <h3 className="mt-4 text-[16px] font-semibold">{t(current.title)}</h3>
        <div className="mt-2 space-y-2 text-[14px] leading-relaxed">
          {current.texts.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </div>

        {slide === LAST && (
          <div className="mt-5 rounded-xl border border-(--t-border) bg-(--t-surface) p-4">
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
        )}

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={() => go(slide - 1)} disabled={slide === 0} className={navButton}>
            <ChevronLeft size={14} aria-hidden />
            {t('about.prev')}
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t('about.dot', { n: i + 1 })}
                  aria-current={i === slide}
                  className={`size-2 rounded-full transition-colors ${i === slide ? 'bg-(--t-accent)' : 'bg-(--t-border) hover:bg-(--t-text-muted)'}`}
                />
              ))}
            </div>
            <span className="font-mono text-[11px] text-(--t-text-muted)">
              {t('about.counter', { current: slide + 1, total: SLIDES.length })}
            </span>
          </div>

          {slide < LAST ? (
            <button type="button" onClick={() => go(slide + 1)} className={navButton}>
              {t('about.next')}
              <ChevronRight size={14} aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              className="h-9 rounded-md border border-(--t-accent) bg-(--t-accent) px-4 font-mono text-[11px] tracking-[0.12em] text-(--t-bg) uppercase"
            >
              {t('about.start')}
            </button>
          )}
        </footer>
      </section>
    </div>
  )
}
