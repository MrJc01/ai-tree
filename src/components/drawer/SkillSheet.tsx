import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BENCHMARKS, MODELS } from '../../data'
import { localSkills, localSkillById } from '../../data/localized'
import { sourceHost } from '../../lib/graph'
import { domainLabel, getEntityKey, statusLabel, tierLabel } from '../../lib/skillMeta'
import { useAppStore } from '../../store/appStore'
import type { SkillNode } from '../../types/skill'
import { MermaidDiagram } from './MermaidDiagram'
import { GuideSheet } from './GuideSheet'
import { sourceTypeLabel, STATUS_TONE } from './labels'
import { Badge, Chip, Section } from './shared'
import { sortHistory, type HistoryOrder } from '../../lib/timeline'
import { t } from '../../i18n'
import type { UIKey } from '../../i18n/ui/pt'

type TabId = 'overview' | 'history' | 'actors' | 'diagram' | 'graph' | 'sources' | 'guia'

const TABS: Array<{ id: TabId; labelKey: UIKey }> = [
  { id: 'overview', labelKey: 'drawer.overview' },
  { id: 'history', labelKey: 'drawer.history' },
  { id: 'actors', labelKey: 'drawer.actors' },
  { id: 'diagram', labelKey: 'drawer.diagram' },
  { id: 'graph', labelKey: 'drawer.graph' },
  { id: 'sources', labelKey: 'drawer.sources' },
  { id: 'guia', labelKey: 'drawer.guide' },
]

const ORDER_KEYS: Record<HistoryOrder, UIKey> = {
  desc: 'drawer.order.desc',
  asc: 'drawer.order.asc',
  impact: 'drawer.order.impact',
}


/** Conteúdo de uma habilidade: abas, com os dados completos no modo Research e a versão conceitual no Streamline. */
export function SkillSheet({ skill }: { skill: SkillNode }) {
  const [tab, setTab] = useState<TabId>('overview')
  const density = useAppStore((s) => s.density)
  const research = density === 'research'

  return (
    <div className="flex h-full flex-col">
      <header className="space-y-3 border-b border-(--t-border) px-6 pt-5 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{domainLabel(skill.domain)}</Badge>
          <Badge>
            T{skill.tier} · {tierLabel(skill.tier)}
          </Badge>
          <Badge className={STATUS_TONE[skill.metadata.status]}>{statusLabel(skill.metadata.status)}</Badge>
          {skill.isDuplicateInstance && <Badge>{t('drawer.replica')}</Badge>}
        </div>
        <h2 className="text-xl leading-tight font-semibold tracking-tight">{skill.name}</h2>
        <TabStrip tab={tab} onSelect={setTab} />
      </header>

      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        {tab === 'overview' && <Overview skill={skill} research={research} />}
        {tab === 'history' && <History skill={skill} research={research} />}
        {tab === 'actors' && <Actors skill={skill} research={research} />}
        {tab === 'diagram' && <Diagram skill={skill} />}
        {tab === 'graph' && <Graph skill={skill} />}
        {tab === 'sources' && <Sources skill={skill} research={research} />}
        {tab === 'guia' && <GuideSheet skill={skill} />}
      </div>
    </div>
  )
}

const TAB_STEP = 140

/** Faixa de abas com setas para os lados. Cada seta aparece só quando há abas escondidas naquela direção. */
function TabStrip({ tab, onSelect }: { tab: TabId; onSelect: (id: TabId) => void }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  const measure = useCallback(() => {
    const el = listRef.current
    if (!el) return
    setEdges({ left: el.scrollLeft > 1, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1 })
  }, [])

  useEffect(() => {
    measure()
    const el = listRef.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure])

  const scrollTabs = (dx: number) => listRef.current?.scrollBy?.({ left: dx, behavior: 'smooth' })

  return (
    <div className="-mb-px flex items-stretch gap-1">
      <TabArrow direction="left" visible={edges.left} onClick={() => scrollTabs(-TAB_STEP)} />
      <div
        ref={listRef}
        role="tablist"
        aria-label={t('drawer.tabs')}
        onScroll={measure}
        className="flex min-w-0 flex-1 gap-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => onSelect(item.id)}
            className={`shrink-0 border-b-2 px-2.5 pt-1 pb-2 text-[12px] transition-colors ${
              tab === item.id ? 'border-(--t-accent) text-(--t-text)' : 'border-transparent text-(--t-text-muted) hover:text-(--t-text)'
            }`}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>
      <TabArrow direction="right" visible={edges.right} onClick={() => scrollTabs(TAB_STEP)} />
    </div>
  )
}

function TabArrow({ direction, visible, onClick }: { direction: 'left' | 'right'; visible: boolean; onClick: () => void }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  const label = direction === 'left' ? t('drawer.scrollLeft') : t('drawer.scrollRight')
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={`flex w-6 shrink-0 items-center justify-center text-(--t-text-muted) transition-colors hover:text-(--t-text) ${
        visible ? '' : 'invisible'
      }`}
    >
      <Icon size={14} aria-hidden />
    </button>
  )
}

function Overview({ skill, research }: { skill: SkillNode; research: boolean }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  const entityKey = getEntityKey(skill)
  const models = MODELS.filter((m) => m.orbits === entityKey && skill.id === entityKey)

  return (
    <div className="space-y-6">
      {research && <p className="font-mono text-[11px] text-(--t-text-muted)">{t('drawer.introduced', { date: skill.metadata.dateIntroduced })}</p>}
      <p className="text-[14px] leading-relaxed">{skill.content.overview}</p>

      <Section title={t('drawer.whyMatters')}>
        <p className="text-[13px] leading-relaxed text-(--t-text-muted)">{skill.content.impact}</p>
      </Section>

      {research && skill.content.equations && skill.content.equations.length > 0 && (
        <Section title={t('drawer.equations')}>
          <ul className="space-y-2">
            {skill.content.equations.map((eq) => (
              <li key={eq.label} className="rounded-md border border-(--t-border) p-3">
                <p className="mb-1 text-[11px] text-(--t-text-muted)">{eq.label}</p>
                <code className="font-mono text-[13px] break-words">{eq.expression}</code>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skill.metadata.companies.length > 0 && (
        <Section title={t('drawer.companies')}>
          <div className="flex flex-wrap gap-1.5">
            {skill.metadata.companies.map((company) => (
              <Chip key={company} onClick={() => pushEntry({ kind: 'company', name: company })}>
                {company}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      {models.length > 0 && (
        <Section title={t('drawer.models')}>
          <ul className="space-y-1 text-[13px]">
            {models.map((m) => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">
                  {m.name}
                </a>
                <span className="text-(--t-text-muted)">
                  {' · '}
                  {m.vendor}
                  {research && ` · ${m.releasedAt}`}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skill.content.sources.length > 0 && (
        <Section title={t('drawer.quickLinks')}>
          <ul className="space-y-1.5">
            {skill.content.sources.slice(0, 3).map((src, index) => (
              <li key={src.url}>
                <button
                  type="button"
                  onClick={() => pushEntry({ kind: 'source', skillId: skill.id, index })}
                  className="text-left text-[13px] underline-offset-2 hover:underline"
                >
                  {src.title}
                </button>
                <span className="ml-2 font-mono text-[10px] text-(--t-text-muted)">{sourceHost(src.url)}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

function History({ skill, research }: { skill: SkillNode; research: boolean }) {
  const [order, setOrder] = useState<HistoryOrder>('desc')
  const events = sortHistory(skill.content.history, order)

  if (events.length === 0) {
    return <p className="text-[13px] text-(--t-text-muted)">{t('drawer.noMilestones')}</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('drawer.timelineOrder')}>
        {(Object.keys(ORDER_KEYS) as HistoryOrder[]).map((o) => (
          <Chip key={o} active={order === o} onClick={() => setOrder(o)}>
            {t(ORDER_KEYS[o])}
          </Chip>
        ))}
      </div>
      <ol className="space-y-4 border-l border-(--t-border) pl-4">
        {events.map((ev) => (
          <li key={`${ev.year}-${ev.event}`} className="relative">
            <span
              aria-hidden
              className="absolute top-1.5 -left-[21px] size-2 rounded-full bg-(--sig)"
              style={{ ['--sig' as string]: skill.signatureColor }}
            />
            {research && <p className="font-mono text-[11px] text-(--t-text-muted)">{ev.year}</p>}
            <p className="text-[13px] leading-relaxed">{ev.event}</p>
            <p className="mt-1 flex items-center gap-1" aria-label={t('drawer.impactAria', { value: ev.importance })}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className="size-1 rounded-full"
                  style={{ background: n <= ev.importance ? skill.signatureColor : 'var(--t-border)' }}
                />
              ))}
              {research && <span className="ml-2 font-mono text-[10px] text-(--t-text-muted)">{t('drawer.impact', { value: ev.importance })}</span>}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Actors({ skill, research }: { skill: SkillNode; research: boolean }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  if (skill.content.actors.length === 0 && skill.metadata.companies.length === 0) {
    return <p className="text-[13px] text-(--t-text-muted)">{t('drawer.noActors')}</p>
  }
  return (
    <div className="space-y-6">
      {skill.content.actors.length > 0 && (
        <ul className="space-y-3">
          {skill.content.actors.map((a) => (
            <li key={`${a.name}-${a.role}`} className="rounded-md border border-(--t-border) p-3">
              <p className="text-[14px] font-medium">{a.name}</p>
              <p className="text-[12px] text-(--t-text-muted)">{a.role}</p>
              {research && <p className="mt-1 font-mono text-[11px] text-(--t-text-muted)">{a.org}</p>}
            </li>
          ))}
        </ul>
      )}
      {skill.metadata.companies.length > 0 && (
        <Section title={t('drawer.companiesPioneer')}>
          <div className="flex flex-wrap gap-1.5">
            {skill.metadata.companies.map((company) => (
              <Chip key={company} onClick={() => pushEntry({ kind: 'company', name: company })}>
                {company}
              </Chip>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Diagram({ skill }: { skill: SkillNode }) {
  if (!skill.content.mermaidDiagram) {
    return <p className="text-[13px] text-(--t-text-muted)">{t('drawer.noDiagram')}</p>
  }
  return <MermaidDiagram code={skill.content.mermaidDiagram} />
}

function Graph({ skill }: { skill: SkillNode }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  const entityKey = getEntityKey(skill)
  const prereqs = skill.prerequisites.map((id) => localSkillById(id)).filter((s): s is SkillNode => Boolean(s))
  const unlocks = skill.unlocks.map((id) => localSkillById(id)).filter((s): s is SkillNode => Boolean(s))
  const replicas = localSkills().filter((s) => s.id !== skill.id && getEntityKey(s) === entityKey)

  const column = (title: string, list: SkillNode[]) => (
    <div className="min-w-0 flex-1 space-y-2">
      <p className="font-mono text-[10px] tracking-[0.14em] text-(--t-text-muted) uppercase">{title}</p>
      {list.length === 0 && <p className="text-[12px] text-(--t-text-muted)">{t('drawer.none')}</p>}
      {list.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => pushEntry({ kind: 'skill', id: s.id })}
          className="w-full rounded-md border border-(--t-border) px-2.5 py-2 text-left transition-colors hover:border-(--t-accent)"
        >
          <span className="block text-[12px] font-medium">{s.name}</span>
          <span className="font-mono text-[10px] text-(--t-text-muted)">T{s.tier} · {domainLabel(s.domain)}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <p className="text-[12px] text-(--t-text-muted)">
        {t('drawer.explainGraph')}
      </p>
      <div className="flex items-start gap-3">
        {column(t('drawer.prereqs'), prereqs)}
        <div className="flex w-28 shrink-0 flex-col items-center gap-1 pt-6 text-center">
          <span className="size-2 rounded-full" style={{ background: skill.signatureColor, boxShadow: `0 0 8px ${skill.signatureColor}` }} />
          <span className="text-[12px] font-medium">{skill.name}</span>
        </div>
        {column(t('drawer.unlocks'), unlocks)}
      </div>
      {replicas.length > 0 && (
        <p className="text-[12px] text-(--t-text-muted)">
          Também aparece em:{' '}
          {replicas.map((r) => domainLabel(r.domain)).join(', ')}
        </p>
      )}
    </div>
  )
}

function Sources({ skill, research }: { skill: SkillNode; research: boolean }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  const setBenchmark = useAppStore((s) => s.setBenchmark)
  const activeBenchmark = useAppStore((s) => s.benchmarkId)
  const entityKey = getEntityKey(skill)
  const benchmarks = BENCHMARKS.filter((b) => b.measures.includes(entityKey))
  const benchmarkRows = Object.entries(skill.content.benchmarks ?? {})

  return (
    <div className="space-y-6">
      {skill.content.sources.length === 0 ? (
        <p className="text-[13px] text-(--t-text-muted)">{t('drawer.noSources')}</p>
      ) : (
        <ul className="space-y-3">
          {skill.content.sources.map((src, index) => (
            <li key={src.url}>
              <button
                type="button"
                onClick={() => pushEntry({ kind: 'source', skillId: skill.id, index })}
                className="w-full rounded-md border border-(--t-border) p-3 text-left transition-colors hover:border-(--t-accent)"
              >
                <span className="mb-1.5 flex flex-wrap gap-1.5">
                  <Badge>{sourceTypeLabel(src.type)}</Badge>
                  <Badge>{sourceHost(src.url)}</Badge>
                </span>
                <span className="block text-[13px] font-medium">{src.title}</span>
                {src.summary && <span className="mt-1 block text-[12px] text-(--t-text-muted)">{src.summary}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      {benchmarks.length > 0 && (
        <Section title={t('drawer.benchmarksThat')}>
          <div className="flex flex-wrap gap-1.5">
            {benchmarks.map((b) => (
              <Chip key={b.id} active={activeBenchmark === b.id} onClick={() => setBenchmark(b.id)}>
                {b.name}
              </Chip>
            ))}
          </div>
        </Section>
      )}

      {research && benchmarkRows.length > 0 && (
        <Section title={t('drawer.metrics')}>
          <table className="w-full text-[12px]">
            <tbody>
              {benchmarkRows.map(([key, value]) => (
                <tr key={key} className="border-b border-(--t-border) last:border-0">
                  <td className="py-2 pr-3 text-(--t-text-muted)">{key}</td>
                  <td className="py-2 text-right font-mono">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}
    </div>
  )
}
