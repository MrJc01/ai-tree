import { sourceTypeLabel } from './labels'
import { MODELS, SKILLS, SKILL_BY_ID } from '../../data'
import { sourceHost } from '../../lib/graph'
import { domainLabel } from '../../lib/skillMeta'
import { useAppStore } from '../../store/appStore'
import { Badge, Chip, Section } from './shared'
import { sourceFor } from './entries'
import { t } from '../../i18n'

/** Folha de um paper ou fonte. Mostra o resumo, o link e a habilidade de origem. */
export function SourceSheet({ skillId, index }: { skillId: string; index: number }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  const skill = SKILL_BY_ID.get(skillId)
  const source = sourceFor({ kind: 'source', skillId, index })
  const density = useAppStore((s) => s.density)

  if (!skill || !source) {
    return <p className="p-6 text-[13px] text-(--t-text-muted)">{t('drawer.sourceNotFound')}</p>
  }

  return (
    <div className="space-y-6 px-6 py-5">
      <div className="flex flex-wrap gap-1.5">
        <Badge>{sourceTypeLabel(source.type)}</Badge>
        <Badge>{sourceHost(source.url)}</Badge>
      </div>
      <h2 className="text-lg leading-snug font-semibold tracking-tight">{source.title}</h2>
      {source.summary && <p className="text-[14px] leading-relaxed">{source.summary}</p>}

      <a
        href={source.url}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 rounded-md border border-(--t-accent) px-3 py-2 text-[13px] text-(--t-accent) hover:bg-(--t-accent) hover:text-(--t-bg)"
      >
        Abrir fonte original ↗
      </a>
      {density === 'research' && <p className="font-mono text-[11px] break-all text-(--t-text-muted)">{source.url}</p>}

      <Section title={t('drawer.related')}>
        <Chip onClick={() => pushEntry({ kind: 'skill', id: skill.id })}>
          {skill.name} · {domainLabel(skill.domain)}
        </Chip>
      </Section>
    </div>
  )
}

/** Folha de uma empresa ou instituição. Lista as habilidades e os modelos dela e pode filtrar a árvore. */
export function CompanySheet({ name }: { name: string }) {
  const pushEntry = useAppStore((s) => s.pushEntry)
  const toggleCompany = useAppStore((s) => s.toggleCompany)
  const active = useAppStore((s) => s.companies.includes(name))

  const skills = SKILLS.filter((s) => s.metadata.companies.includes(name) && !s.isDuplicateInstance)
  const models = MODELS.filter((m) => m.vendor === name)

  return (
    <div className="space-y-6 px-6 py-5">
      <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
      <p className="text-[13px] text-(--t-text-muted)">
        {skills.length} habilidade(s) na árvore{models.length > 0 ? ` · ${models.length} modelo(s) orbitando` : ''}.
      </p>

      <button
        type="button"
        onClick={() => toggleCompany(name)}
        aria-pressed={active}
        className={`rounded-md border px-3 py-2 text-[13px] transition-colors ${
          active ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)' : 'border-(--t-border) hover:border-(--t-accent)'
        }`}
      >
        {active ? t('company.removeFilter') : t('company.addFilter')}
      </button>

      <Section title={t('company.skills')}>
        <ul className="space-y-1.5">
          {skills.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pushEntry({ kind: 'skill', id: s.id })}
                className="text-left text-[13px] underline-offset-2 hover:underline"
              >
                {s.name}
              </button>
              <span className="ml-2 font-mono text-[10px] text-(--t-text-muted)">{domainLabel(s.domain)}</span>
            </li>
          ))}
        </ul>
      </Section>

      {models.length > 0 && (
        <Section title={t('app.models')}>
          <ul className="space-y-1.5 text-[13px]">
            {models.map((m) => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noreferrer noopener" className="underline-offset-2 hover:underline">
                  {m.name}
                </a>
                <span className="ml-2 font-mono text-[10px] text-(--t-text-muted)">{m.releasedAt}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
