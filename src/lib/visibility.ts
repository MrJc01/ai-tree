import { BENCHMARKS } from '../data/benchmarks'
import type { Domain, MaturityStatus, SkillNode } from '../types/skill'
import { getYear } from './graph'
import { getEntityKey } from './skillMeta'

/**
 * Estado visual de um nó.
 * - `hl`: destacado pelo filtro ou pelo benchmark (pulsa).
 * - `dim`: fora do filtro ou do benchmark (cinza, 15% de opacidade).
 * - `fog`: tecnologia posterior à data do Time Slider (quase apagada).
 * - `normal`: sem filtro ativo e dentro da data.
 */
export type VisualState = 'normal' | 'hl' | 'dim' | 'fog'

export interface VisualContext {
  domains: readonly Domain[]
  companies: readonly string[]
  statuses: readonly MaturityStatus[]
  year: number
  benchmarkId: string | null
  /** Chaves de entidade avaliadas pelo benchmark selecionado. */
  benchmarkMeasures: readonly string[]
}

/** Recorte do store que influencia o estado visual. */
export interface VisualInputs {
  domains: readonly Domain[]
  companies: readonly string[]
  statuses: readonly MaturityStatus[]
  year: number
  benchmarkId: string | null
}

export function toVisualContext(inputs: VisualInputs): VisualContext {
  const benchmark = BENCHMARKS.find((b) => b.id === inputs.benchmarkId)
  return { ...inputs, benchmarkMeasures: benchmark?.measures ?? [] }
}

export const OPACITY: Record<VisualState, number> = { normal: 1, hl: 1, dim: 0.15, fog: 0.08 }

export function isFilterActive(ctx: VisualContext): boolean {
  return ctx.domains.length + ctx.companies.length + ctx.statuses.length > 0
}

/** Um nó passa no filtro se cada categoria ativa contiver o valor dele (OR dentro, AND entre categorias). */
export function matchesFilters(skill: SkillNode, ctx: VisualContext): boolean {
  const domainOk = ctx.domains.length === 0 || ctx.domains.includes(skill.domain)
  const companyOk =
    ctx.companies.length === 0 || skill.metadata.companies.some((c) => ctx.companies.includes(c))
  const statusOk = ctx.statuses.length === 0 || ctx.statuses.includes(skill.metadata.status)
  return domainOk && companyOk && statusOk
}

export function visualStateFor(skill: SkillNode, ctx: VisualContext): VisualState {
  const year = getYear(skill.metadata.dateIntroduced)
  if (year > ctx.year) return 'fog'

  const filterActive = isFilterActive(ctx)
  const benchActive = ctx.benchmarkId !== null
  if (!filterActive && !benchActive) return 'normal'

  const benchOk = !benchActive || ctx.benchmarkMeasures.includes(getEntityKey(skill))
  const filterOk = !filterActive || matchesFilters(skill, ctx)
  return filterOk && benchOk ? 'hl' : 'dim'
}

/** Aresta fica tão visível quanto o mais apagado dos dois extremos. */
export function edgeOpacity(a: VisualState, b: VisualState): number {
  return Math.min(OPACITY[a], OPACITY[b])
}

export function isGrayscale(state: VisualState): boolean {
  return state === 'dim' || state === 'fog'
}
