import type { Domain, MaturityStatus, SkillNode, Tier } from '../types/skill'

export const DOMAIN_LABELS: Record<Domain, string> = {
  architectures: 'Arquiteturas & Redes',
  compute: 'Compute & Hardware',
  reasoning: 'Raciocínio & LLMs',
  robotics: 'Robótica & Embodiment',
  alignment: 'Alinhamento & Governança',
}

export const TIER_LABELS: Record<Tier, string> = {
  1: 'Machine Learning Clássico',
  2: 'Narrow AI & Deep Learning',
  3: 'Advanced AI & Agentes Autônomos',
  4: 'Proto-AGI / AGI',
  5: 'ASI (Superinteligência Teórica)',
}

export const STATUS_LABELS: Record<MaturityStatus, string> = {
  theoretical: 'Teórico',
  research: 'Experimental',
  production: 'Produção',
  commodity: 'Comoditizado',
}

/**
 * Chave da entidade conceitual. Todas as réplicas de uma mesma habilidade
 * compartilham esta chave, e é por ela que o hover sincronizado as acende juntas.
 */
export function getEntityKey(skill: Pick<SkillNode, 'id' | 'rootEntityId'>): string {
  return skill.rootEntityId ?? skill.id
}
