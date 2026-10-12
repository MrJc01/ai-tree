import type { CircuitEdgeType } from '../components/edges/CircuitEdge'
import type { BandNode } from '../components/nodes/BandLabel'
import type { HexFlowNode } from '../components/nodes/HexNode'
import type { TierNode } from '../components/nodes/TierLabel'
import { DOMAINS, type SkillNode } from '../types/skill'
import { BAND_WIDTH, DOMAIN_GAP, HEX_HEIGHT, HEX_WIDTH, MARGIN_X, nodePosition, rowTop } from './geometry'
import { routeEdges } from './route'
import { domainLabel, getEntityKey, tierLabel } from './skillMeta'

export { HEX_HEIGHT, HEX_RADIUS, HEX_WIDTH, nodePosition, nodePositionAt } from './geometry'

/** Identificadores das portas. As arestas usam estes ids para o React Flow; a trilha é desenhada pelo roteador. */
export type HandleId =
  | 'out-top'
  | 'in-bottom'
  | 'out-bottom'
  | 'in-top'
  | 'out-right'
  | 'in-left'
  | 'out-left'
  | 'in-right'

export type LayoutNode = HexFlowNode | BandNode | TierNode

/** Rótulo de cada área, no topo da sua coluna. Não é arrastável nem interativo. */
const BAND_LABEL_Y = -36

/**
 * Converte o grafo em nós e arestas do React Flow.
 * `overrides` são as posições que o usuário arrastou ou que a organização automática definiu.
 * As trilhas são recalculadas a partir das posições reais, então arrastar um nó também redesenha as ligações dele.
 */
export function layoutSkills(
  skills: SkillNode[],
  overrides: Record<string, { x: number; y: number }> = {},
): { nodes: LayoutNode[]; edges: CircuitEdgeType[] } {
  const byId = new Map(skills.map((s) => [s.id, s]))
  const positions = new Map(skills.map((s) => [s.id, overrides[s.id] ?? nodePosition(s)]))

  // Dimensões declaradas: o mini-mapa só desenha nós que já têm tamanho conhecido.
  const hexNodes: HexFlowNode[] = skills.map((skill) => ({
    id: skill.id,
    type: 'hex',
    position: positions.get(skill.id) ?? { x: 0, y: 0 },
    width: HEX_WIDTH,
    height: HEX_HEIGHT,
    data: { skill },
  }))

  const bandNodes: BandNode[] = DOMAINS.map((domain, col) => ({
    id: `band:${domain}`,
    type: 'band',
    position: { x: MARGIN_X + col * BAND_WIDTH, y: BAND_LABEL_Y },
    data: { label: domainLabel(domain), width: BAND_WIDTH - DOMAIN_GAP },
    draggable: false,
    selectable: false,
    focusable: false,
  }))

  const TIER_LABEL_WIDTH = MARGIN_X - 40
  const tierNodes: TierNode[] = ([1, 2, 3, 4, 5] as const).map((tier) => ({
    id: `tier:${tier}`,
    type: 'tier',
    position: { x: 16, y: rowTop(5 - tier) + HEX_HEIGHT / 2 - 26 },
    data: { tier, label: tierLabel(tier), width: TIER_LABEL_WIDTH },
    draggable: false,
    selectable: false,
    focusable: false,
  }))

  const refs: Array<{ id: string; source: string; target: string; prereq: SkillNode; dependent: SkillNode }> = []
  for (const skill of skills) {
    for (const prereqId of skill.prerequisites) {
      const prereq = byId.get(prereqId)
      if (!prereq) continue
      refs.push({ id: `${prereqId}->${skill.id}`, source: prereqId, target: skill.id, prereq, dependent: skill })
    }
  }

  const routes = routeEdges(
    refs.map((r) => ({ id: r.id, source: r.source, target: r.target })),
    positions,
  )

  const edges: CircuitEdgeType[] = refs.map((r) => ({
    id: r.id,
    type: 'circuit',
    source: r.source,
    target: r.target,
    // Os ids de porta só existem para o React Flow aceitar a aresta. A geometria vem do roteador.
    sourceHandle: 'out-top',
    targetHandle: 'in-bottom',
    data: {
      color: r.prereq.signatureColor,
      sourceKey: getEntityKey(r.prereq),
      targetKey: getEntityKey(r.dependent),
      points: routes.get(r.id) ?? [],
    },
  }))

  return { nodes: [...bandNodes, ...tierNodes, ...hexNodes], edges }
}
