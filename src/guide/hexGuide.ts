import { BENCHMARKS, MODELS } from '../data'
import { localSkillById } from '../data/localized'
import { getYear } from '../lib/graph'
import { domainLabel, getEntityKey, statusLabel, tierLabel } from '../lib/skillMeta'
import type { SkillNode } from '../types/skill'
import { t } from '../i18n'

/**
 * Explicação do hexágono aberto. Fala só desta habilidade: o que cada parte dele significa para ela
 * e como usá-la. O texto geral do sistema fica no FAQ. Tudo sai dos dados, nada é escrito à mão.
 */

export interface HexItem {
  term: string
  text: string
}

export interface HexGuide {
  /** O que cada elemento visual deste hexágono significa. */
  visual: HexItem[]
  /** Como usar esta habilidade: onde clicar e o que cada aba mostra para ela. */
  steps: HexItem[]
}

const names = (ids: string[]): string[] =>
  ids.map((id) => localSkillById(id)?.name).filter((n): n is string => Boolean(n))

export function describeHexagon(skill: SkillNode): HexGuide {
  const entity = getEntityKey(skill)
  const isReplica = Boolean(skill.isDuplicateInstance)
  const year = getYear(skill.metadata.dateIntroduced)
  const prereqs = names(skill.prerequisites)
  const unlocks = names(skill.unlocks)
  const models = MODELS.filter((m) => m.orbits === entity && !isReplica).map((m) => m.name)
  const benchmarks = BENCHMARKS.filter((b) => b.measures.includes(entity)).map((b) => b.name)
  const sources = skill.content.sources.length

  const visual: HexItem[] = [
    {
      term: t('hexg.dotTerm'),
      text: isReplica ? t('hexg.dotReplica', { name: skill.name }) : t('hexg.dotOriginal', { name: skill.name }),
    },
    {
      term: t('hexg.tierTerm', { tier: skill.tier }),
      text: t('hexg.tierText', { tier: skill.tier, label: tierLabel(skill.tier), domain: domainLabel(skill.domain) }),
    },
    {
      term: t('hexg.badgeTerm', { status: statusLabel(skill.metadata.status) }),
      text: t('hexg.badgeText'),
    },
    {
      term: t('hexg.outlineTerm'),
      text: isReplica ? t('hexg.outlineReplica') : t('hexg.outlineOriginal'),
    },
    { term: t('hexg.blueTerm'), text: t('hexg.blueText', { name: skill.name }) },
    { term: t('legend.brackets'), text: t('legend.bracketsText') },
    {
      term: t('legend.fog'),
      text: Number.isNaN(year) ? t('hexg.noDate') : t('hexg.fogText', { name: skill.name, year }),
    },
  ]
  if (models.length) {
    visual.push({ term: t('hexg.orbitTerm'), text: t('hexg.orbitText', { models: models.join(', ') }) })
  }

  const steps: HexItem[] = [
    {
      term: t('hexg.fromTerm'),
      text: prereqs.length ? t('hexg.fromText', { list: prereqs.join(', ') }) : t('hexg.fromBase', { name: skill.name }),
    },
    {
      term: t('hexg.toTerm'),
      text: unlocks.length ? t('hexg.toText', { list: unlocks.join(', ') }) : t('hexg.toNone'),
    },
    {
      term: t('hexg.sourcesTerm'),
      text: sources
        ? sources === 1
          ? t('hexg.sourcesOne')
          : t('hexg.sourcesMany', { count: sources })
        : t('hexg.sourcesNone'),
    },
    {
      term: t('hexg.howTerm'),
      text: skill.content.mermaidDiagram ? t('hexg.howText') : t('hexg.howNone'),
    },
    {
      term: t('hexg.benchTerm'),
      text: benchmarks.length ? t('hexg.benchText', { list: benchmarks.join(', ') }) : t('hexg.benchNone'),
    },
    {
      term: t('hexg.timeTerm'),
      text: Number.isNaN(year) ? t('hexg.timeNone') : t('hexg.timeText', { name: skill.name, year }),
    },
    { term: t('hexg.shareTerm'), text: t('hexg.shareText', { entity }) },
  ]

  return { visual, steps }
}
