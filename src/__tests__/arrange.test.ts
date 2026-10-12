import { describe, expect, it } from 'vitest'
import { SKILLS } from '../data'
import { ARRANGE_MODES, arrangePositions, autoArrangePositions, type ArrangeMode } from '../lib/arrange'
import { getYear } from '../lib/graph'
import type { SkillNode } from '../types/skill'

const MATURITY_RANK = { commodity: 0, production: 1, research: 2, theoretical: 3 } as const

/** Agrupa as habilidades por área e patamar, cada grupo ordenado da esquerda para a direita. */
function rowsLeftToRight(mode: ArrangeMode): SkillNode[][] {
  const positions = arrangePositions(SKILLS, mode)
  const cells = new Map<string, SkillNode[]>()
  for (const s of SKILLS) {
    const key = `${s.gridCoordinates.col}:${s.tier}`
    cells.set(key, [...(cells.get(key) ?? []), s])
  }
  return [...cells.values()].map((cell) => [...cell].sort((a, b) => positions[a.id].x - positions[b.id].x))
}

describe('tipos de organização', () => {
  it('há quatro tipos, com ids e nomes únicos', () => {
    expect(ARRANGE_MODES.map((m) => m.id)).toEqual(['cruzamentos', 'cronologica', 'maturidade', 'alfabetica'])
    expect(new Set(ARRANGE_MODES.map((m) => m.label)).size).toBe(ARRANGE_MODES.length)
  })

  it('todo tipo posiciona todas as habilidades, sem dois hexágonos no mesmo slot de uma célula', () => {
    for (const { id } of ARRANGE_MODES) {
      const positions = arrangePositions(SKILLS, id)
      expect(Object.keys(positions), id).toHaveLength(SKILLS.length)
      for (const row of rowsLeftToRight(id)) {
        const xs = row.map((s) => positions[s.id].x)
        expect(new Set(xs).size, `${id}: ${row.map((s) => s.name).join(', ')}`).toBe(xs.length)
      }
    }
  })

  it('"Menos cruzamentos" é o barycenter de sempre', () => {
    expect(arrangePositions(SKILLS, 'cruzamentos')).toEqual(autoArrangePositions(SKILLS))
  })

  it('"Cronológica" põe o mais antigo à esquerda em cada patamar', () => {
    const yearOf = (s: SkillNode) => {
      const y = getYear(s.metadata.dateIntroduced)
      return Number.isNaN(y) ? Number.POSITIVE_INFINITY : y
    }
    for (const row of rowsLeftToRight('cronologica')) {
      const years = row.map(yearOf)
      expect(years, row.map((s) => s.name).join(', ')).toEqual([...years].sort((a, b) => a - b))
    }
  })

  it('"Por maturidade" vai do comoditizado ao teórico, da esquerda para a direita', () => {
    for (const row of rowsLeftToRight('maturidade')) {
      const ranks = row.map((s) => MATURITY_RANK[s.metadata.status])
      expect(ranks, row.map((s) => s.name).join(', ')).toEqual([...ranks].sort((a, b) => a - b))
    }
  })

  it('"Alfabética" põe os nomes em ordem em cada patamar', () => {
    for (const row of rowsLeftToRight('alfabetica')) {
      const names = row.map((s) => s.name)
      expect(names, names.join(', ')).toEqual([...names].sort((a, b) => a.localeCompare(b, 'pt-BR')))
    }
  })

  it('os tipos produzem disposições diferentes', () => {
    const layouts = ARRANGE_MODES.map((m) => JSON.stringify(arrangePositions(SKILLS, m.id)))
    expect(new Set(layouts).size).toBe(ARRANGE_MODES.length)
  })
})
