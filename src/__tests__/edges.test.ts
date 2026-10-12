import { describe, expect, it } from 'vitest'
import { SKILLS } from '../data'
import { HEX_HEIGHT, HEX_WIDTH } from '../lib/geometry'
import { layoutSkills } from '../lib/layout'

type Pt = { x: number; y: number }

/** As rotas guardam pontos como tuplas [x, y]. */
const toPt = (p: [number, number]): Pt => ({ x: p[0], y: p[1] })

/** Um hexágono plano (flat-top) cabe no retângulo da caixa; a margem tira os cantos vazios, que o traço pode cruzar. */
const INSET = 12

/** Verdadeiro se algum ponto interno do segmento cai dentro da caixa do hexágono. */
function segmentEntersBox(a: Pt, b: Pt, box: { x0: number; y0: number; x1: number; y1: number }): boolean {
  const steps = 32
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const x = a.x + (b.x - a.x) * t
    const y = a.y + (b.y - a.y) * t
    if (x > box.x0 && x < box.x1 && y > box.y0 && y < box.y1) return true
  }
  return false
}

/** Trilhas que passam por dentro de um hexágono que não é a origem nem o destino delas. */
function crossingsThroughNodes(): Array<{ edge: string; node: string }> {
  const { nodes, edges } = layoutSkills(SKILLS)
  const hexes = nodes.filter((n) => n.type === 'hex')
  const found: Array<{ edge: string; node: string }> = []
  for (const edge of edges) {
    const points = edge.data?.points ?? []
    for (let i = 0; i + 1 < points.length; i++) {
      for (const hex of hexes) {
        if (hex.id === edge.source || hex.id === edge.target) continue
        const box = {
          x0: hex.position.x + INSET,
          y0: hex.position.y + INSET,
          x1: hex.position.x + HEX_WIDTH - INSET,
          y1: hex.position.y + HEX_HEIGHT - INSET,
        }
        if (segmentEntersBox(toPt(points[i]), toPt(points[i + 1]), box)) found.push({ edge: edge.id, node: hex.id })
      }
    }
  }
  return found
}

describe('trilhas', () => {
  it('o detector reconhece um segmento que atravessa uma caixa (controle do próprio teste)', () => {
    expect(segmentEntersBox({ x: 0, y: 50 }, { x: 100, y: 50 }, { x0: 40, y0: 0, x1: 60, y1: 100 })).toBe(true)
    expect(segmentEntersBox({ x: 0, y: 150 }, { x: 100, y: 150 }, { x0: 40, y0: 0, x1: 60, y1: 100 })).toBe(false)
  })

  it('há trilhas com pontos de rota para medir (o teste não passa vazio)', () => {
    const { edges } = layoutSkills(SKILLS)
    const routed = edges.filter((e) => (e.data?.points ?? []).length >= 2)
    expect(routed.length).toBeGreaterThan(50)
  })

  it('nenhuma trilha atravessa um hexágono que não é a origem nem o destino dela', () => {
    expect(crossingsThroughNodes()).toEqual([])
  })
})
