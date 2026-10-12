import { gapBounds, HEX_HEIGHT, HEX_RADIUS, HEX_WIDTH, rowIndexOf } from './geometry'

export type Point = [number, number]
export interface EdgeRef {
  id: string
  source: string
  target: string
}
type Pos = { x: number; y: number }
type Side = 'top' | 'bottom'

/** Até onde, a partir do centro, uma trilha pode encostar na borda de cima ou de baixo do hexágono. */
const PORT_SPREAD = HEX_RADIUS / 2 - 8

interface Route {
  id: string
  sourceId: string
  targetId: string
  sourceSide: Side
  targetSide: Side
  /** Faixa horizontal da ponta de saída e da ponta de chegada (iguais quando a aresta é entre vizinhos). */
  gapA: number
  gapB: number
  /** Patamares que a trilha atravessa sem tocar (vazio entre vizinhos). */
  between: Set<number>
  /** Coluna vertical da trilha longa, quando há. */
  corridor: number | null
  start: Point
  end: Point
}

/** Margem da caixa de um hexágono ao procurar uma coluna livre: tira os cantos vazios do desenho plano. */
const CORRIDOR_INSET = 12
/** Espaço entre a coluna de uma trilha longa e a próxima, para duas trilhas não correrem coladas. */
const CORRIDOR_CLEARANCE = 10

interface Block {
  x0: number
  x1: number
  row: number
}

/**
 * Procura a coluna vertical mais perto do ideal que não bata em nenhum hexágono dos patamares do meio e não
 * encoste em outra trilha longa que ocupe os mesmos patamares. Se não achar, devolve o ideal.
 */
function chooseCorridor(ideal: number, rows: Set<number>, blocks: Block[], used: Array<{ x: number; rows: Set<number> }>): number {
  const sharesRow = (a: Set<number>, b: Set<number>) => [...a].some((r) => b.has(r))
  const free = (x: number) =>
    !blocks.some((b) => rows.has(b.row) && x >= b.x0 - CORRIDOR_INSET / 2 && x <= b.x1 + CORRIDOR_INSET / 2) &&
    !used.some((u) => Math.abs(u.x - x) < CORRIDOR_CLEARANCE && sharesRow(u.rows, rows))
  for (let d = 0; d <= 4000; d += 6) {
    if (free(ideal + d)) return ideal + d
    if (d > 0 && free(ideal - d)) return ideal - d
  }
  return ideal
}

/**
 * Roteia cada aresta como trilha ortogonal e dá a cada uma a sua própria linha horizontal.
 *
 * - Arestas entre patamares vizinhos sobem, andam e descem numa faixa só.
 * - Arestas que atravessam patamares intermediários ganham uma coluna livre entre os hexágonos desses patamares,
 *   e usam uma faixa horizontal em cada ponta. Assim a trilha não passa por dentro de hexágono nenhum.
 * - Cada aresta usa uma linha horizontal exclusiva dentro de cada faixa, então as trilhas não se sobrepõem.
 * - As portas se distribuem ao longo da borda do hexágono, ordenadas pelo outro extremo.
 *
 * Retorna os pontos de cada aresta, do pré-requisito até quem depende dele.
 */
export function routeEdges(edges: EdgeRef[], positions: Map<string, Pos>): Map<string, Point[]> {
  const centerX = (id: string) => (positions.get(id)?.x ?? 0) + HEX_WIDTH / 2

  const routes: Route[] = []
  for (const e of edges) {
    const s = positions.get(e.source)
    const t = positions.get(e.target)
    if (!s || !t) continue
    const sRow = rowIndexOf(s.y)
    const tRow = rowIndexOf(t.y)

    // Pré-requisito sempre sai pelo lado de quem está mais embaixo (ou no mesmo patamar, pelo topo).
    let sourceSide: Side
    let targetSide: Side
    let gapA: number
    let gapB: number
    let between: Set<number>
    if (tRow < sRow) {
      sourceSide = 'top'
      targetSide = 'bottom'
      gapA = sRow
      gapB = tRow + 1
      between = new Set(range(tRow + 1, sRow))
    } else if (tRow === sRow) {
      sourceSide = 'top'
      targetSide = 'top'
      gapA = sRow
      gapB = sRow
      between = new Set()
    } else {
      sourceSide = 'bottom'
      targetSide = 'top'
      gapA = sRow + 1
      gapB = tRow
      between = new Set(range(sRow + 1, tRow))
    }

    routes.push({
      id: e.id,
      sourceId: e.source,
      targetId: e.target,
      sourceSide,
      targetSide,
      gapA,
      gapB,
      between,
      corridor: null,
      start: [0, 0],
      end: [0, 0],
    })
  }

  // 1. Portas: cada lado de cada hexágono reparte sua borda entre as trilhas que o usam.
  type User = { route: number; end: 'start' | 'end'; other: number }
  const users = new Map<string, User[]>()
  const add = (key: string, user: User) => users.set(key, [...(users.get(key) ?? []), user])
  routes.forEach((r, i) => {
    add(`${r.sourceId}|${r.sourceSide}`, { route: i, end: 'start', other: centerX(r.targetId) })
    add(`${r.targetId}|${r.targetSide}`, { route: i, end: 'end', other: centerX(r.sourceId) })
  })

  const portX = new Map<string, number>()
  for (const [key, list] of users) {
    const nodeId = key.split('|')[0]
    list.sort((a, b) => a.other - b.other || a.route - b.route)
    const n = list.length
    list.forEach((u, k) => {
      const t = n === 1 ? 0 : (2 * k) / (n - 1) - 1
      portX.set(`${u.route}:${u.end}`, centerX(nodeId) + t * PORT_SPREAD)
    })
  }

  routes.forEach((r, i) => {
    const s = positions.get(r.sourceId)
    const t = positions.get(r.targetId)
    if (!s || !t) return
    r.start = [portX.get(`${i}:start`) ?? centerX(r.sourceId), r.sourceSide === 'top' ? s.y : s.y + HEX_HEIGHT]
    r.end = [portX.get(`${i}:end`) ?? centerX(r.targetId), r.targetSide === 'top' ? t.y : t.y + HEX_HEIGHT]
  })

  // 2. Colunas livres para as trilhas que atravessam patamares intermediários.
  const blocks: Block[] = []
  for (const s of positions.values()) {
    blocks.push({ x0: s.x + CORRIDOR_INSET, x1: s.x + HEX_WIDTH - CORRIDOR_INSET, row: rowIndexOf(s.y) })
  }
  const used: Array<{ x: number; rows: Set<number> }> = []
  routes.forEach((r) => {
    if (r.between.size === 0) return
    const ideal = (r.start[0] + r.end[0]) / 2
    const x = chooseCorridor(ideal, r.between, blocks, used)
    r.corridor = x
    used.push({ x, rows: r.between })
  })

  // 3. Faixas horizontais: cada trilha ocupa uma linha exclusiva em cada faixa que toca.
  const segments = new Map<number, Array<{ route: number; mid: number }>>()
  const addSegment = (gap: number, route: number, mid: number) =>
    segments.set(gap, [...(segments.get(gap) ?? []), { route, mid }])
  routes.forEach((r, i) => {
    if (r.corridor === null) {
      addSegment(r.gapA, i, (r.start[0] + r.end[0]) / 2)
      return
    }
    addSegment(r.gapA, i, (r.start[0] + r.corridor) / 2)
    addSegment(r.gapB, i, (r.corridor + r.end[0]) / 2)
  })

  const channelY = new Map<string, number>()
  for (const [gap, list] of segments) {
    const [top, bottom] = gapBounds(gap)
    const ordered = [...list].sort((a, b) => a.mid - b.mid || a.route - b.route)
    ordered.forEach((seg, k) => {
      channelY.set(`${seg.route}|${gap}`, top + ((k + 1) * (bottom - top)) / (ordered.length + 1))
    })
  }

  // 4. Pontos finais: sobe/desce até a faixa, anda na horizontal e, se preciso, sobe pela coluna livre.
  const out = new Map<string, Point[]>()
  routes.forEach((r, i) => {
    const yA = channelY.get(`${i}|${r.gapA}`) ?? r.start[1]
    if (r.corridor === null) {
      out.set(r.id, [r.start, [r.start[0], yA], [r.end[0], yA], r.end])
      return
    }
    const yB = channelY.get(`${i}|${r.gapB}`) ?? r.end[1]
    out.set(r.id, [r.start, [r.start[0], yA], [r.corridor, yA], [r.corridor, yB], [r.end[0], yB], r.end])
  })
  return out
}

/** Patamares de a até b, sem incluir b. Vazio quando não há nenhum entre eles. */
function range(a: number, b: number): number[] {
  const out: number[] = []
  for (let i = a; i < b; i++) out.push(i)
  return out
}

function towards(from: Point, to: Point, distance: number): Point {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.hypot(dx, dy) || 1
  return [from[0] + (dx / len) * distance, from[1] + (dy / len) * distance]
}

/** Caminho SVG com cantos arredondados. Dá o aspecto de trilha de circuito impresso. */
export function roundedPath(points: Point[], radius = 8): string {
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const next = points[i + 1]
    const lenIn = Math.hypot(cur[0] - prev[0], cur[1] - prev[1])
    const lenOut = Math.hypot(next[0] - cur[0], next[1] - cur[1])
    const r = Math.min(radius, lenIn / 2, lenOut / 2)
    if (r < 1) {
      d += ` L ${cur[0]} ${cur[1]}`
      continue
    }
    const a = towards(cur, prev, r)
    const b = towards(cur, next, r)
    d += ` L ${a[0]} ${a[1]} Q ${cur[0]} ${cur[1]} ${b[0]} ${b[1]}`
  }
  const last = points[points.length - 1]
  d += ` L ${last[0]} ${last[1]}`
  return d
}
