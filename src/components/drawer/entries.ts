import { localSkillById } from '../../data/localized'
import { domainLabel } from '../../lib/skillMeta'
import type { DrawerEntry } from '../../store/appStore'
import type { SkillSource, SkillNode } from '../../types/skill'
import { t } from '../../i18n'

export function sourceFor(entry: Extract<DrawerEntry, { kind: 'source' }>): SkillSource | undefined {
  return localSkillById(entry.skillId)?.content.sources[entry.index]
}

export function skillFor(entry: Extract<DrawerEntry, { kind: 'skill' }>): SkillNode | undefined {
  return localSkillById(entry.id)
}

/** Rótulo de uma folha da pilha, usado no breadcrumb. */
export function entryLabel(entry: DrawerEntry): string {
  switch (entry.kind) {
    case 'skill':
      return skillFor(entry)?.name ?? entry.id
    case 'source':
      return sourceFor(entry)?.title ?? t('drawer.sourceSheet')
    case 'company':
      return entry.name
  }
}

/** Crumbs no formato `[Área > Habilidade > Sub-conceito > Paper]`. O primeiro é a área. */
export function breadcrumbsFor(stack: DrawerEntry[]): Array<{ label: string; depth: number | null }> {
  if (stack.length === 0) return []
  const first = stack[0]
  const area = first.kind === 'skill' ? skillFor(first)?.domain : undefined
  const crumbs: Array<{ label: string; depth: number | null }> = []
  if (area) crumbs.push({ label: domainLabel(area), depth: null })
  stack.forEach((entry, depth) => crumbs.push({ label: entryLabel(entry), depth }))
  return crumbs
}
