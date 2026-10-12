import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { FAQ, filterFaq, type FaqItem } from '../../guide/faq'
import { useAppStore } from '../../store/appStore'

const SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const

/** Uma pergunta que abre e fecha. Só a resposta da pergunta aberta aparece. */
function FaqRow({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  return (
    <li className="border-b border-(--t-border) last:border-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-${item.id}`}
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-3 py-3 text-left"
      >
        <span className="text-[13px] font-medium leading-snug">{item.question}</span>
        <ChevronDown
          size={16}
          aria-hidden
          className={`mt-0.5 shrink-0 text-(--t-text-muted) transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div id={`faq-${item.id}`} className="space-y-2 pb-3 pr-6 text-[12px] leading-relaxed text-(--t-text-muted)">
          {item.answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </li>
  )
}

/**
 * Painel lateral de perguntas frequentes. Cada pergunta é um recolhível. A pesquisa procura no texto da pergunta
 * e da resposta, e mostra só as perguntas que batem. ESC fecha o painel.
 */
export function FaqPanel() {
  const open = useAppStore((s) => s.faqOpen)
  const setFaqOpen = useAppStore((s) => s.setFaqOpen)
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const items = useMemo(() => filterFaq(FAQ, query), [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFaqOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setFaqOpen])

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          key="faq"
          aria-label="Perguntas frequentes"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={SPRING}
          className="absolute inset-y-0 right-0 z-40 flex w-[min(420px,100%)] flex-col border-l border-(--t-border) bg-(--t-bg) shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-(--t-border) px-5 py-3">
            <h2 className="text-[15px] font-semibold tracking-tight">Perguntas frequentes</h2>
            <button
              type="button"
              onClick={() => setFaqOpen(false)}
              aria-label="Fechar perguntas frequentes"
              className="inline-flex size-8 items-center justify-center rounded-md border border-(--t-border) text-(--t-text-muted) hover:text-(--t-text)"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 border-b border-(--t-border) px-5 py-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar nas perguntas"
              aria-label="Pesquisar nas perguntas"
              className="w-full rounded-md border border-(--t-border) bg-(--t-surface) px-3 py-2 text-[13px] text-(--t-text) outline-none placeholder:text-(--t-text-muted) focus:border-(--t-accent)"
            />
            <p className="font-mono text-[10px] tracking-[0.12em] text-(--t-text-muted) uppercase" aria-live="polite">
              {items.length} de {FAQ.length} perguntas
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5">
            {items.length > 0 ? (
              <ul>
                {items.map((item) => (
                  <FaqRow key={item.id} item={item} open={expanded.has(item.id)} onToggle={() => toggle(item.id)} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-[13px] text-(--t-text-muted)">
                Nenhuma pergunta bate com &ldquo;{query}&rdquo;. Tente outra palavra.
              </p>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
