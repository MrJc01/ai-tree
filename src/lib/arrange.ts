import type { MaturityStatus, SkillNode } from '../types/skill'
import { HEX_WIDTH, nodePositionAt } from './geometry'
import { getYear } from './graph'

/** Tipos de organização que o menu Auto-organizar oferece. Cada um reordena só os slots dentro de cada patamar e área. */
export type ArrangeMode = 'cruzamentos' | 'cronologica' | 'maturidade' | 'alfabetica'

export const ARRANGE_MODES: Array<{ id: ArrangeMode; label: string; description: string }> = [
  {
    id: 'cruzamentos',
    label: 'Menos cruzamentos',
    description: 'Aproxima as habilidades ligadas entre si, para as trilhas se cruzarem menos.',
  },
  {
    id: 'cronologica',
    label: 'Cronológica',
    description: 'Dentro de cada patamar, da data mais antiga para a mais nova, da esquerda para a direita.',
  },
  {
    id: 'maturidade',
    label: 'Por maturidade',
    description: 'Dentro de cada patamar, do comoditizado ao teórico, da esquerda para a direita.',
  },
  {
    id: 'alfabetica',
    label: 'Alfabética',
    description: 'Dentro de cada patamar, em ordem de nome.',
  },
]

const MATURITY_RANK: Record<MaturityStatus, number> = { commodity: 0, production: 1, research: 2, theoretical: 3 }

const byName = (a: SkillNode, b: SkillNode): number => a.name.localeCompare(b.name, 'pt-BR')

/** Sem data cadastrada, a habilidade vai para o fim da linha. */
const yearOf = (s: SkillNode): number => {
  const year = getYear(s.metadata.dateIntroduced)
  return Number.isNaN(year) ? Number.POSITIVE_INFINITY : year
}

const byYear = (a: SkillNode, b: SkillNode): number => {
  const ya = yearOf(a)
  const yb = yearOf(b)
  if (ya !== yb) return ya < yb ? -1 : 1
  return byName(a, b)
}

const byMaturity = (a: SkillNode, b: SkillNode): number => {
  const d = MATURITY_RANK[a.metadata.status] - MATURITY_RANK[b.metadata.status]
  return d !== 0 ? d : byName(a, b)
}

/**
 * Organização automática da árvore. Dentro de cada área e patamar, as habilidades são reordenadas
 * pela posição média dos vizinhos ligados a elas (barycenter). Quem tem pais à esquerda vai para
 * a esquerda, e quem tem filhos à direita vai para a direita. Assim as trilhas cruzam menos.
 *
 * Patamar (Y) e área (coluna) não mudam. Só a ordem dos slots dentro de cada célula.
 */
export function autoArrangePositions(skills: SkillNode[], iterations = 4): Record<string, { x: number; y: number }> {
  const byId = new Map(skills.map((s) => [s.id, s]))
  const slots = new Map(skills.map((s) => [s.id, s.gridCoordinates.row]))

  // Réplicas não puxam nem são puxadas: a organização da origem é a referência.
  const neighbors = new Map<string, string[]>()
  for (const s of skills) {
    if (s.isDuplicateInstance) continue
    neighbors.set(
      s.id,
      [...s.prerequisites, ...s.unlocks].filter((id) => {
        const other = byId.get(id)
        return other !== undefined && !other.isDuplicateInstance
      }),
    )
  }

  const centerX = (id: string): number => {
    const s = byId.get(id)
    return s ? nodePositionAt(s, slots.get(id) ?? 0).x + HEX_WIDTH / 2 : 0
  }

  for (let pass = 0; pass < iterations; pass++) {
    const cells = new Map<string, SkillNode[]>()
    for (const s of skills) {
      const key = `${s.gridCoordinates.col}:${s.tier}`
      cells.set(key, [...(cells.get(key) ?? []), s])
    }

    for (const cell of cells.values()) {
      const scored = cell.map((s) => {
        const linked = neighbors.get(s.id) ?? []
        const score =
          linked.length === 0
            ? (slots.get(s.id) ?? 0)
            : linked.reduce((sum, id) => sum + centerX(id), 0) / linked.length
        return { s, score }
      })
      // Empate fica na ordem atual, para o resultado ser estável entre execuções.
      scored.sort((a, b) => a.score - b.score || (slots.get(a.s.id) ?? 0) - (slots.get(b.s.id) ?? 0))
      scored.forEach(({ s }, index) => slots.set(s.id, index))
    }
  }

  const positions: Record<string, { x: number; y: number }> = {}
  for (const s of skills) positions[s.id] = nodePositionAt(s, slots.get(s.id) ?? 0)
  return positions
}

/** Posições para o modo escolhido no menu. "cruzamentos" usa o barycenter; os outros ordenam cada célula. */
export function arrangePositions(skills: SkillNode[], mode: ArrangeMode): Record<string, { x: number; y: number }> {
  if (mode === 'cruzamentos') return autoArrangePositions(skills)

  const compare = mode === 'cronologica' ? byYear : mode === 'maturidade' ? byMaturity : byName
  const cells = new Map<string, SkillNode[]>()
  for (const s of skills) {
    const key = `${s.gridCoordinates.col}:${s.tier}`
    cells.set(key, [...(cells.get(key) ?? []), s])
  }

  const positions: Record<string, { x: number; y: number }> = {}
  for (const cell of cells.values()) {
    cell.sort(compare).forEach((s, slot) => {
      positions[s.id] = nodePositionAt(s, slot)
    })
  }
  return positions
}
