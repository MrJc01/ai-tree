import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { localSkills } from '../../data/localized'
import { isTyping } from '../../lib/dom'
import { domainLabel, statusLabel } from '../../lib/skillMeta'
import { useAppStore } from '../../store/appStore'
import { DOMAINS, MATURITY_STATUSES } from '../../types/skill'
import { Chip } from '../drawer/shared'
import { Legend } from './Legend'
import { SearchBox } from './SearchBox'
import { t } from '../../i18n'

/** Empresas do grafo, ordenadas pelo número de habilidades que aparecem. */
function companiesByCount(): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>()
  for (const skill of localSkills()) {
    if (skill.isDuplicateInstance) continue
    for (const company of skill.metadata.companies) counts.set(company, (counts.get(company) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

type Section = 'filtros' | 'legenda' | 'busca'

/**
 * Painel do canto superior esquerdo: Filtros, Legenda e Busca, cada um em sua seção recolhível.
 * A tecla / abre a busca de qualquer lugar (exceto quando já se está digitando em outro campo).
 * O que não bate com o filtro fica apagado em cinza, e o que bate pulsa. A árvore não muda de lugar.
 */
export function FilterBar() {
  const [open, setOpen] = useState<Section | null>(null)
  const [searchFocus, setSearchFocus] = useState(0)
  const domains = useAppStore((s) => s.domains)
  const companies = useAppStore((s) => s.companies)
  const statuses = useAppStore((s) => s.statuses)
  const toggleDomain = useAppStore((s) => s.toggleDomain)
  const toggleCompany = useAppStore((s) => s.toggleCompany)
  const toggleStatus = useAppStore((s) => s.toggleStatus)
  const clearFilters = useAppStore((s) => s.clearFilters)

  const companyList = useMemo(() => companiesByCount(), [])
  const active = domains.length + companies.length + statuses.length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !isTyping(e.target)) {
        e.preventDefault()
        setOpen('busca')
        setSearchFocus((n) => n + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggle = (section: Section) => {
    setOpen((current) => (current === section ? null : section))
    if (section === 'busca') setSearchFocus((n) => n + 1)
  }

  return (
    <div className="w-full rounded-xl border border-(--t-border) bg-(--t-surface) backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-3">
          <SectionButton label={t('filter.filters')} expanded={open === 'filtros'} onClick={() => toggle('filtros')}>
            {active > 0 && (
              <span className="ml-2 rounded-full bg-(--t-accent) px-1.5 py-px text-[9px] text-(--t-bg)">{active}</span>
            )}
          </SectionButton>
          <SectionButton label={t('filter.legend')} expanded={open === 'legenda'} onClick={() => toggle('legenda')} />
          <SectionButton label={t('filter.search')} expanded={open === 'busca'} onClick={() => toggle('busca')} />
        </div>
        {active > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-mono text-[10px] text-(--t-text-muted) underline-offset-2 hover:underline"
          >
            {t('filter.clear')}
          </button>
        )}
      </div>

      {open === 'filtros' && (
        <div className="max-h-[52vh] space-y-3 overflow-y-auto border-t border-(--t-border) px-3 py-3">
          <FilterRow label={t('filter.area')}>
            {DOMAINS.map((d) => (
              <Chip key={d} active={domains.includes(d)} onClick={() => toggleDomain(d)}>
                {domainLabel(d)}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label={t('filter.maturity')}>
            {MATURITY_STATUSES.map((st) => (
              <Chip key={st} active={statuses.includes(st)} onClick={() => toggleStatus(st)}>
                {statusLabel(st)}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label={t('filter.company')}>
            {companyList.map((c) => (
              <Chip key={c.name} active={companies.includes(c.name)} onClick={() => toggleCompany(c.name)}>
                {c.name} <span className="ml-1 opacity-60">{c.count}</span>
              </Chip>
            ))}
          </FilterRow>
        </div>
      )}

      {open === 'legenda' && (
        <div className="max-h-[52vh] overflow-y-auto border-t border-(--t-border) px-3 py-3">
          <Legend />
        </div>
      )}

      {open === 'busca' && (
        <div className="max-h-[52vh] overflow-y-auto border-t border-(--t-border) px-3 py-3">
          <SearchBox focusNonce={searchFocus} />
        </div>
      )}
    </div>
  )
}

function SectionButton({
  label,
  expanded,
  onClick,
  children,
}: {
  label: string
  expanded: boolean
  onClick: () => void
  children?: ReactNode
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onClick}
      className={`flex items-center font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
        expanded ? 'text-(--t-text)' : 'text-(--t-text-muted) hover:text-(--t-text)'
      }`}
    >
      {label}
      {children}
    </button>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
