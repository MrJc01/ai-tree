import { SKILL_BY_ID } from '../../data'
import { DOMAIN_LABELS } from '../../lib/skillMeta'
import type { DrawerEntry } from '../../store/appStore'
import type { SkillSource, SkillNode } from '../../types/skill'

export function sourceFor(entry: Extract<DrawerEntry, { kind: 'source' }>): SkillSource | undefined {
  return SKILL_BY_ID.get(entry.skillId)?.content.sources[entry.index]
}

export function skillFor(entry: Extract<DrawerEntry, { kind: 'skill' }>): SkillNode | undefined {
  return SKILL_BY_ID.get(entry.id)
}

/** Rótulo de uma folha da pilha, usado no breadcrumb. */
export function entryLabel(entry: DrawerEntry): string {
  switch (entry.kind) {
    case 'skill':
      return skillFor(entry)?.name ?? entry.id
    case 'source':
      return sourceFor(entry)?.title ?? 'Fonte'
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
  if (area) crumbs.push({ label: DOMAIN_LABELS[area], depth: null })
  stack.forEach((entry, depth) => crumbs.push({ label: entryLabel(entry), depth }))
  return crumbs
}
