import type { Domain, MaturityStatus, SkillNode, Tier } from '../types/skill'
import { t } from '../i18n'
import type { UIKey } from '../i18n/ui/pt'

const DOMAIN_KEYS = {
  architectures: 'domain.architectures',
  compute: 'domain.compute',
  reasoning: 'domain.reasoning',
  robotics: 'domain.robotics',
  alignment: 'domain.alignment',
} as const satisfies Record<Domain, UIKey>

const TIER_KEYS = { 1: 'tier.1', 2: 'tier.2', 3: 'tier.3', 4: 'tier.4', 5: 'tier.5' } as const satisfies Record<Tier, UIKey>

const STATUS_KEYS = {
  theoretical: 'status.theoretical',
  research: 'status.research',
  production: 'status.production',
  commodity: 'status.commodity',
} as const satisfies Record<MaturityStatus, UIKey>

/** Rótulos no idioma atual (a árvore é remontada quando o idioma muda, então a chamada sempre lê o certo). */
export const domainLabel = (domain: Domain): string => t(DOMAIN_KEYS[domain])
export const tierLabel = (tier: Tier): string => t(TIER_KEYS[tier])
export const statusLabel = (status: MaturityStatus): string => t(STATUS_KEYS[status])

/**
 * Chave da entidade conceitual. Todas as réplicas de uma mesma habilidade
 * compartilham esta chave, e é por ela que o hover sincronizado as acende juntas.
 */
export function getEntityKey(skill: Pick<SkillNode, 'id' | 'rootEntityId'>): string {
  return skill.rootEntityId ?? skill.id
}
