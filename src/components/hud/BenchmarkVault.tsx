import { useState } from 'react'
import { currentLocale } from '../../i18n/state'
import { localBenchmarks } from '../../data/localized'
import { sourceHost } from '../../lib/graph'
import { useAppStore } from '../../store/appStore'
import type { Benchmark } from '../../types/skill'
import { Badge } from '../drawer/shared'
import { t } from '../../i18n'

/**
 * Hub de benchmarks. Clicar em um benchmark destaca na grade as habilidades que ele avalia.
 * Cada um mostra o valor publicado no artigo e, quando há, o placar atual com a data da leitura
 * e os links de onde o dado saiu, para conferir.
 */
export function BenchmarkVault() {
  const [open, setOpen] = useState(false)
  const activeId = useAppStore((s) => s.benchmarkId)
  const setBenchmark = useAppStore((s) => s.setBenchmark)
  const active = localBenchmarks().find((b) => b.id === activeId)

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2 max-md:top-auto max-md:right-3 max-md:bottom-24">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-(--t-border) bg-(--t-surface) px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase backdrop-blur-md hover:text-(--t-text)"
      >
        {t('vault.button')} {active ? `· ${active.name}` : ''}
      </button>

      {open && (
        <section
          aria-label={t('vault.title')}
          className="max-h-[70vh] w-[min(380px,calc(100vw-2rem))] space-y-3 overflow-y-auto rounded-xl border border-(--t-border) bg-(--t-surface) p-3 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold">{t('vault.title')}</h2>
            {active && (
              <button type="button" onClick={() => setBenchmark(null)} className="font-mono text-[10px] text-(--t-text-muted) underline-offset-2 hover:underline">
                {t('vault.clear')}
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {localBenchmarks().map((b) => (
              <BenchmarkRow key={b.id} benchmark={b} active={activeId === b.id} onToggle={() => setBenchmark(b.id)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

/** Data ISO (AAAA-MM-DD ou AAAA-MM) no formato do idioma: dd/mm/aaaa em português, mm/dd/aaaa em inglês. */
function formatDate(iso: string, locale: string): string {
  const [year, month, day] = iso.split('-')
  if (locale === 'en') return day ? `${month}/${day}/${year}` : `${month}/${year}`
  return day ? `${day}/${month}/${year}` : `${month}/${year}`
}

function BenchmarkRow({ benchmark: b, active, onToggle }: { benchmark: Benchmark; active: boolean; onToggle: () => void }) {
  const current = b.current
  return (
    <li
      className={`rounded-lg border p-2.5 transition-colors ${
        active ? 'border-(--t-accent) bg-(--t-bg)' : 'border-(--t-border)'
      }`}
    >
      <button type="button" onClick={onToggle} aria-pressed={active} className="w-full text-left">
        <span className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{b.name}</span>
          <Badge>{b.year}</Badge>
          <Badge>{t('vault.habs', { count: b.measures.length })}</Badge>
        </span>
        <span className="mt-1 block text-[12px] text-(--t-text-muted)">{b.description}</span>
      </button>

      {current ? (
        <div className="mt-2 rounded-md border border-(--t-border) p-2 text-[11px]">
          <p>
            <span className="text-(--t-text-muted)">{t('vault.currentScore')}</span>
            <span className="font-mono font-medium">{current.value}</span>
          </p>
          <p className="text-(--t-text-muted)">{current.leader}</p>
          <p className="mt-1 font-mono text-[10px] text-(--t-text-muted)">
            {t('vault.readAt', { date: formatDate(current.checkedAt, currentLocale()) })}
            {current.sourceDate && ` · ${t('vault.sourceDate', { date: formatDate(current.sourceDate, currentLocale()) })}`}
          </p>
          {current.note && <p className="mt-1 text-(--t-text-muted)">{current.note}</p>}
        </div>
      ) : (
        <p className="mt-2 text-[11px] text-(--t-text-muted)">{t('vault.noScore')}</p>
      )}

      {b.reference && (
        <p className="mt-2 text-[11px]">
          <span className="text-(--t-text-muted)">{t('vault.reference')}</span>
          <span className="font-mono">{b.reference.value}</span>
          <span className="block text-(--t-text-muted)">{b.reference.setting}</span>
        </p>
      )}

      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px]">
        <a href={b.paperUrl} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">
          {t('vault.paper')} · {sourceHost(b.paperUrl)}
        </a>
        {current && current.sourceUrl !== b.officialUrl && (
          <a href={current.sourceUrl} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">
            {t('vault.readSource')} · {sourceHost(current.sourceUrl)}
          </a>
        )}
        <a href={b.officialUrl} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">
          {t('vault.officialScore')} · {sourceHost(b.officialUrl)}
        </a>
      </p>
    </li>
  )
}
