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
  /** Patamar cuja faixa de cima recebe a trilha horizontal desta aresta. */
  gap: number
  start: Point
  end: Point
}

/**
 * Roteia cada aresta como trilha ortogonal (sobe, anda, sobe) e dá a cada uma a sua própria linha horizontal.
 *
 * - Cada aresta usa uma faixa horizontal exclusiva dentro do espaço entre patamares. Por isso as trilhas
 *   não se sobrepõem, mesmo quando várias ligam os mesmos patamares.
 * - As portas se distribuem ao longo da borda do hexágono, ordenadas pelo outro extremo. Assim as arestas
 *   não saem todas do mesmo ponto e não se cruzam à toa.
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
    let gap: number
    if (tRow < sRow) {
      sourceSide = 'top'
      targetSide = 'bottom'
      gap = sRow
    } else if (tRow === sRow) {
      sourceSide = 'top'
      targetSide = 'top'
      gap = sRow
    } else {
      sourceSide = 'bottom'
      targetSide = 'top'
      gap = sRow + 1
    }

    routes.push({
      id: e.id,
      sourceId: e.source,
      targetId: e.target,
      sourceSide,
      targetSide,
      gap,
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

  // Pontos de partida e chegada, já com a porta escolhida.
  routes.forEach((r, i) => {
    const s = positions.get(r.sourceId)
    const t = positions.get(r.targetId)
    if (!s || !t) return
    r.start = [portX.get(`${i}:start`) ?? centerX(r.sourceId), r.sourceSide === 'top' ? s.y : s.y + HEX_HEIGHT]
    r.end = [portX.get(`${i}:end`) ?? centerX(r.targetId), r.targetSide === 'top' ? t.y : t.y + HEX_HEIGHT]
  })

  // 2. Trilhas: dentro de cada faixa, cada aresta recebe a sua linha horizontal, ordenada pela posição.
  const byGap = new Map<number, number[]>()
  routes.forEach((r, i) => byGap.set(r.gap, [...(byGap.get(r.gap) ?? []), i]))

  const channelY = new Map<number, number>()
  for (const [gap, indexes] of byGap) {
    const [top, bottom] = gapBounds(gap)
    const ordered = [...indexes].sort((a, b) => {
      const ra = routes[a]
      const rb = routes[b]
      return (ra.start[0] + ra.end[0]) / 2 - (rb.start[0] + rb.end[0]) / 2
    })
    ordered.forEach((i, k) => {
      channelY.set(i, top + ((k + 1) * (bottom - top)) / (ordered.length + 1))
    })
  }

  // 3. Pontos finais: sobe/desce até a trilha, anda na horizontal e entra no outro hexágono.
  const out = new Map<string, Point[]>()
  routes.forEach((r, i) => {
    const yc = channelY.get(i) ?? r.start[1]
    out.set(r.id, [r.start, [r.start[0], yc], [r.end[0], yc], r.end])
  })
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
