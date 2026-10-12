import { BENCHMARKS, MODELS, SKILL_BY_ID } from '../data'
import { DOMAIN_LABELS, getEntityKey, STATUS_LABELS, TIER_LABELS } from '../lib/skillMeta'
import type { SkillNode } from '../types/skill'

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
  ids.map((id) => SKILL_BY_ID.get(id)?.name).filter((n): n is string => Boolean(n))

/**
 * Resume uma habilidade para a aba "Como usar": onde ela está na árvore, o que depende dela,
 * o que ela desbloqueia e quanto há de fonte, modelo e benchmark. Tudo vem dos dados, nada é escrito à mão.
 */
export function summarizeSkill(skill: SkillNode): SkillSummary {
  const entity = getEntityKey(skill)
  const original = skill.isDuplicateInstance ? SKILL_BY_ID.get(entity) : undefined

  const prereqs = names(skill.prerequisites)
  const unlocks = names(skill.unlocks)
  const models = MODELS.filter((m) => m.orbits === entity).map((m) => m.name)
  const benchmarks = BENCHMARKS.filter((b) => b.measures.includes(entity)).map((b) => b.name)

  const facts: SkillFact[] = [
    { label: 'Área', value: DOMAIN_LABELS[skill.domain] },
    { label: 'Patamar', value: `T${skill.tier} · ${TIER_LABELS[skill.tier]}` },
    { label: 'Maturidade', value: STATUS_LABELS[skill.metadata.status] },
    { label: 'Introduzida em', value: skill.metadata.dateIntroduced },
    { label: 'Pré-requisitos', value: prereqs.length ? `${prereqs.length}: ${prereqs.join(', ')}` : 'nenhum (é uma base)' },
    { label: 'Desbloqueia', value: unlocks.length ? `${unlocks.length}: ${unlocks.join(', ')}` : 'nada ainda na árvore' },
    { label: 'Fontes', value: String(skill.content.sources.length) },
  ]
  if (models.length) facts.push({ label: 'Modelos', value: models.join(', ') })
  if (benchmarks.length) facts.push({ label: 'Benchmarks', value: benchmarks.join(', ') })

  const base = prereqs.length
    ? `Para existir, ela depende de ${prereqs.length === 1 ? 'uma habilidade' : `${prereqs.length} habilidades`}: ${prereqs.join(', ')}.`
    : 'Ela é uma base: não depende de outra habilidade da árvore.'
  const next = unlocks.length
    ? `Ela abre caminho para ${unlocks.length === 1 ? 'uma habilidade' : `${unlocks.length} habilidades`}: ${unlocks.join(', ')}.`
    : 'Ainda não desbloqueia outra habilidade desta árvore.'
  const paragraph = [
    `${skill.name} está no patamar T${skill.tier}, ${TIER_LABELS[skill.tier]}, na área ${DOMAIN_LABELS[skill.domain]}.`,
    base,
    next,
    `A maturidade desta habilidade é ${STATUS_LABELS[skill.metadata.status]}. O que cada maturidade significa está no FAQ.`,
  ].join(' ')

  return {
    name: skill.name,
    facts,
    paragraph,
    replicaNote: original
      ? `Esta é uma réplica. Os dados completos estão na habilidade original, "${original.name}", na área ${DOMAIN_LABELS[original.domain]}.`
      : undefined,
  }
}
