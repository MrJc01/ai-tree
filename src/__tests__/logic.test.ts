import { describe, expect, it } from 'vitest'
import { SKILLS, SKILL_BY_ID } from '../data'
import { autoArrangePositions } from '../lib/arrange'
import { getYear, normalizeSkills, sourceHost } from '../lib/graph'
import { HEX_HEIGHT, HEX_WIDTH, SLOT_WIDTH, rowTop } from '../lib/geometry'
import { layoutSkills, nodePosition, nodePositionAt } from '../lib/layout'
import { roundedPath, type Point } from '../lib/route'
import { edgeOpacity, matchesFilters, toVisualContext, visualStateFor, type VisualContext } from '../lib/visibility'
import { sortHistory } from '../lib/timeline'
import type { SkillNode, SkillSeed } from '../types/skill'

const EMPTY: VisualContext = {
  domains: [],
  companies: [],
  statuses: [],
  year: 2026,
  benchmarkId: null,
  benchmarkMeasures: [],
}

const perceptron = SKILL_BY_ID.get('perceptron') as SkillNode
const llm = SKILL_BY_ID.get('llm') as SkillNode

const HEX_NODES_OF = (nodes: ReturnType<typeof layoutSkills>['nodes']) => nodes.filter((n) => n.type === 'hex')

describe('normalizeSkills', () => {
  it('deriva unlocks a partir de prerequisites sem duplicar', () => {
    const seeds: SkillSeed[] = [
      { ...base('a'), prerequisites: [] },
      { ...base('b'), prerequisites: ['a', 'a'] },
    ]
    const [a, b] = normalizeSkills(seeds)
    expect(a.unlocks).toEqual(['b'])
    expect(b.unlocks).toEqual([])
  })
})

describe('datas e fontes', () => {
  it('getYear lê YYYY e YYYY-MM', () => {
    expect(getYear('1958')).toBe(1958)
    expect(getYear('2014-09')).toBe(2014)
  })

  it('sourceHost resolve rótulos conhecidos e cai no hostname', () => {
    expect(sourceHost('https://arxiv.org/abs/1706.03762')).toBe('arXiv')
    expect(sourceHost('https://doi.org/10.1038/323533a0')).toBe('DOI')
    expect(sourceHost('https://example.org/x')).toBe('example.org')
    expect(sourceHost('não é url')).toBe('link')
  })
})

describe('geometria da árvore', () => {
  it('patamar maior fica mais acima e área maior fica mais à direita', () => {
    const top = nodePositionAt({ gridCoordinates: { col: 0, row: 0 }, tier: 5 }, 0)
    const base = nodePositionAt({ gridCoordinates: { col: 0, row: 0 }, tier: 1 }, 0)
    expect(top.y).toBeLessThan(base.y)
    const left = nodePositionAt({ gridCoordinates: { col: 0, row: 0 }, tier: 2 }, 0)
    const right = nodePositionAt({ gridCoordinates: { col: 3, row: 0 }, tier: 2 }, 0)
    expect(right.x).toBeGreaterThan(left.x)
  })

  it('slots de um mesmo patamar ficam lado a lado, na mesma linha, nunca empilhados', () => {
    const s0 = nodePositionAt(perceptron, 0)
    const s1 = nodePositionAt(perceptron, 1)
    expect(s0.y).toBe(s1.y)
    expect(s1.x - s0.x).toBe(SLOT_WIDTH)
    expect(s1.x - s0.x).toBeGreaterThan(HEX_WIDTH)
  })

  it('cada patamar começa numa linha distinta, com folga para as trilhas', () => {
    expect(rowTop(1) - rowTop(0)).toBeGreaterThan(HEX_HEIGHT + 100)
  })
})

describe('roteamento das arestas', () => {
  const { edges } = layoutSkills(SKILLS)
  const allPoints = edges.map((e) => ({ id: e.id, points: e.data?.points ?? [] }))

  it('cada aresta tem pontos e vai do pré-requisito até quem depende dele', () => {
    expect(edges.length).toBe(SKILLS.reduce((n, s) => n + s.prerequisites.length, 0))
    for (const e of edges) {
      // Trilha entre vizinhos: 4 pontos. Trilha longa, que desvia por uma coluna livre: 6.
      expect([4, 6], e.id).toContain(e.data?.points.length)
      expect(SKILL_BY_ID.get(e.target)?.prerequisites).toContain(e.source)
      expect(e.type).toBe('circuit')
    }
  })

  it('todo segmento é ortogonal: horizontal ou vertical, nunca diagonal', () => {
    for (const { id, points } of allPoints) {
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1]
        const [bx, by] = points[i]
        expect(ax === bx || ay === by, `${id} segmento ${i}`).toBe(true)
      }
    }
  })

  it('nenhuma trilha horizontal se sobrepõe a outra de outra aresta (as linhas não se encavalam)', () => {
    type Seg = { id: string; y: number; x1: number; x2: number }
    const horizontals: Seg[] = []
    for (const { id, points } of allPoints) {
      for (let i = 1; i < points.length; i++) {
        const [ax, ay] = points[i - 1]
        const [bx, by] = points[i]
        if (ay === by && ax !== bx) horizontals.push({ id, y: ay, x1: Math.min(ax, bx), x2: Math.max(ax, bx) })
      }
    }
    expect(horizontals.length).toBeGreaterThan(20)
    const conflicts: string[] = []
    for (let i = 0; i < horizontals.length; i++) {
      for (let j = i + 1; j < horizontals.length; j++) {
        const a = horizontals[i]
        const b = horizontals[j]
        if (a.id === b.id || Math.abs(a.y - b.y) > 0.01) continue
        const overlap = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1)
        if (overlap > 0.5) conflicts.push(`${a.id} x ${b.id} em y=${a.y.toFixed(1)}`)
      }
    }
    expect(conflicts).toEqual([])
  })

  it('a trilha horizontal de cada aresta fica numa faixa livre entre patamares', () => {
    for (const { id, points } of allPoints) {
      const yc = points[1][1]
      const onRow = [0, 1, 2, 3, 4].some((r) => Math.abs(yc - rowTop(r)) < 1)
      expect(onRow, `${id} passa por cima de um patamar`).toBe(false)
    }
  })

  it('posições sobrescritas valem para o nó e redesenham as arestas dele', () => {
    const override = { x: 1234, y: 567 }
    const { nodes, edges: moved } = layoutSkills(SKILLS, { [perceptron.id]: override })
    expect(HEX_NODES_OF(nodes).find((n) => n.id === perceptron.id)?.position).toEqual(override)
    const touching = moved.filter((e) => e.source === perceptron.id || e.target === perceptron.id)
    expect(touching.length).toBeGreaterThan(0)
    for (const e of touching) {
      const start: Point | undefined = e.data?.points[0]
      expect(start).toBeDefined()
    }
    expect(nodePosition(perceptron)).not.toEqual(override)
  })

  it('roundedPath gera um caminho SVG e arredonda cada curva', () => {
    const d = roundedPath([[0, 0], [0, 50], [100, 50], [100, 100]], 8)
    expect(d.startsWith('M 0 0')).toBe(true)
    expect(d.match(/Q/g)?.length).toBe(2)
    expect(roundedPath([[0, 0]])).toBe('')
  })
})

describe('layout de nós', () => {
  it('cria um nó por habilidade mais um rótulo por área', () => {
    const { nodes } = layoutSkills(SKILLS)
    expect(HEX_NODES_OF(nodes)).toHaveLength(SKILLS.length)
    expect(nodes.filter((n) => n.type === 'band')).toHaveLength(5)
  })

  it('rótulos de área não são arrastáveis', () => {
    const { nodes } = layoutSkills(SKILLS)
    for (const n of nodes.filter((n) => n.type === 'band')) expect(n.draggable).toBe(false)
  })
})

describe('organização automática', () => {
  const positions = autoArrangePositions(SKILLS)

  it('posiciona todas as habilidades: patamar (Y) e área (X) preservados', () => {
    for (const s of SKILLS) {
      const p = positions[s.id]
      expect(p, s.id).toBeDefined()
      expect(p.y, s.id).toBe(nodePositionAt(s, 0).y)
      expect(p.x - nodePositionAt(s, 0).x, s.id).toBeGreaterThanOrEqual(0)
    }
  })

  it('nenhuma habilidade fica em cima de outra', () => {
    const seen = new Set<string>()
    for (const s of SKILLS) {
      const key = `${positions[s.id].x}:${positions[s.id].y}`
      expect(seen.has(key), `${s.id} empilhado`).toBe(false)
      seen.add(key)
    }
  })

  it('é determinística', () => {
    expect(autoArrangePositions(SKILLS)).toEqual(autoArrangePositions(SKILLS))
  })
})

describe('nós e arestas', () => {
  it('normalizeSkills e o layout usam as mesmas dependências', () => {
    const { edges } = layoutSkills(SKILLS)
    const pairs = new Set(edges.map((e) => `${e.source}->${e.target}`))
    for (const s of SKILLS) for (const p of s.prerequisites) expect(pairs.has(`${p}->${s.id}`)).toBe(true)
  })
})

describe('visibilidade', () => {
  it('sem filtro nem benchmark, todo nó é normal', () => {
    expect(visualStateFor(perceptron, EMPTY)).toBe('normal')
  })

  it('filtro de área apaga o que não pertence e destaca o que pertence', () => {
    const ctx = { ...EMPTY, domains: ['reasoning' as const] }
    expect(visualStateFor(llm, ctx)).toBe('hl')
    expect(visualStateFor(perceptron, ctx)).toBe('dim')
  })

  it('dentro de uma categoria é OU; entre categorias é E', () => {
    const orCtx = { ...EMPTY, companies: ['OpenAI', 'Meta'] }
    expect(matchesFilters(llm, orCtx)).toBe(true)
    const andCtx = { ...EMPTY, domains: ['architectures' as const], statuses: ['commodity' as const] }
    expect(matchesFilters(perceptron, andCtx)).toBe(true)
    expect(matchesFilters(llm, andCtx)).toBe(false)
  })

  it('o Time Slider apaga o que é posterior ao ano escolhido', () => {
    expect(visualStateFor(llm, { ...EMPTY, year: 1990 })).toBe('fog')
    expect(visualStateFor(perceptron, { ...EMPTY, year: 1990 })).toBe('normal')
  })

  it('benchmark destaca só as entidades avaliadas', () => {
    const inputs = { domains: [], companies: [], statuses: [], year: 2026, benchmarkId: 'arc-agi' }
    const ctx = toVisualContext(inputs)
    expect(ctx.benchmarkMeasures).toContain('reasoning-rl')
    expect(visualStateFor(SKILL_BY_ID.get('reasoning-rl') as SkillNode, ctx)).toBe('hl')
    expect(visualStateFor(perceptron, ctx)).toBe('dim')
  })

  it('aresta fica tão visível quanto o extremo mais apagado', () => {
    expect(edgeOpacity('hl', 'dim')).toBeCloseTo(0.15)
    expect(edgeOpacity('normal', 'fog')).toBeCloseTo(0.08)
    expect(edgeOpacity('hl', 'hl')).toBe(1)
  })
})

describe('sortHistory', () => {
  const events = [
    { year: 1990, event: 'b', importance: 2 },
    { year: 1950, event: 'a', importance: 5 },
    { year: 2010, event: 'c', importance: 4 },
  ]

  it('ordena crescente, decrescente e por impacto', () => {
    expect(sortHistory(events, 'asc').map((e) => e.year)).toEqual([1950, 1990, 2010])
    expect(sortHistory(events, 'desc').map((e) => e.year)).toEqual([2010, 1990, 1950])
    expect(sortHistory(events, 'impact').map((e) => e.event)).toEqual(['a', 'c', 'b'])
  })

  it('não altera a lista original', () => {
    sortHistory(events, 'asc')
    expect(events[0].year).toBe(1990)
  })
})

function base(id: string): Omit<SkillSeed, 'prerequisites'> {
  return {
    id,
    name: id,
    domain: 'architectures',
    tier: 1,
    gridCoordinates: { col: 0, row: 0 },
    signatureColor: 'hsl(0 85% 62%)',
    metadata: { status: 'commodity', dateIntroduced: '2000', companies: [] },
    content: { overview: 'x', impact: 'y', history: [], actors: [], sources: [] },
  }
}
