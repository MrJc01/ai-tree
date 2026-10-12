import { BENCHMARKS, MODELS } from '../data'
import { localSkillById } from '../data/localized'
import { domainLabel, getEntityKey, statusLabel, tierLabel } from '../lib/skillMeta'
import type { SkillNode } from '../types/skill'
import { t } from '../i18n'

export interface SkillFact {
  label: string
  value: string
}

export interface SkillSummary {
  name: string
  /** Uma linha por informação, prontas para a lista da aba. */
  facts: SkillFact[]
  /** Parágrafo que explica a habilidade no contexto da árvore. */
  paragraph: string
  /** Quando é uma réplica, aponta para a original. */
  replicaNote?: string
}

const names = (ids: string[]): string[] =>
  ids.map((id) => localSkillById(id)?.name).filter((n): n is string => Boolean(n))

/**
 * Resume uma habilidade para a aba "Como usar": onde ela está na árvore, o que depende dela,
 * o que ela desbloqueia e quanto há de fonte, modelo e benchmark. Tudo vem dos dados, nada é escrito à mão.
 */
export function summarizeSkill(skill: SkillNode): SkillSummary {
  const entity = getEntityKey(skill)
  const original = skill.isDuplicateInstance ? localSkillById(entity) : undefined

  const prereqs = names(skill.prerequisites)
  const unlocks = names(skill.unlocks)
  const models = MODELS.filter((m) => m.orbits === entity).map((m) => m.name)
  const benchmarks = BENCHMARKS.filter((b) => b.measures.includes(entity)).map((b) => b.name)

  const facts: SkillFact[] = [
    { label: t('summary.area'), value: domainLabel(skill.domain) },
    { label: t('summary.tier'), value: `T${skill.tier} · ${tierLabel(skill.tier)}` },
    { label: t('summary.status'), value: statusLabel(skill.metadata.status) },
    { label: t('summary.introduced'), value: skill.metadata.dateIntroduced },
    {
      label: t('summary.prereqs'),
      value: prereqs.length ? `${prereqs.length}: ${prereqs.join(', ')}` : t('summary.noneBase'),
    },
    {
      label: t('summary.unlocks'),
      value: unlocks.length ? `${unlocks.length}: ${unlocks.join(', ')}` : t('summary.noneUnlocks'),
    },
    { label: t('summary.sources'), value: String(skill.content.sources.length) },
  ]
  if (models.length) facts.push({ label: t('summary.models'), value: models.join(', ') })
  if (benchmarks.length) facts.push({ label: t('summary.benchmarks'), value: benchmarks.join(', ') })

  const base = prereqs.length
    ? prereqs.length === 1
      ? t('summary.dependsOne', { list: prereqs.join(', ') })
      : t('summary.dependsMany', { count: prereqs.length, list: prereqs.join(', ') })
    : t('summary.base')
  const next = unlocks.length
    ? unlocks.length === 1
      ? t('summary.opensOne', { list: unlocks.join(', ') })
      : t('summary.opensMany', { count: unlocks.length, list: unlocks.join(', ') })
    : t('summary.opensNone')
  const paragraph = [
    t('summary.tierLine', { name: skill.name, tier: skill.tier, label: tierLabel(skill.tier), domain: domainLabel(skill.domain) }),
    base,
    next,
    t('summary.maturity', { status: statusLabel(skill.metadata.status) }),
  ].join(' ')

  return {
    name: skill.name,
    facts,
    paragraph,
    replicaNote: original
      ? t('summary.replica', { original: original.name, domain: domainLabel(original.domain) })
      : undefined,
  }
}
