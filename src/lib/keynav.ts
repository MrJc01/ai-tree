export type Direction = 'left' | 'right' | 'up' | 'down'

export interface Point {
  id: string
  x: number
  y: number
}

/**
 * Próximo hexágono numa direção, para navegar a árvore com as setas. Considera só os que estão nessa direção
 * e prefere o mais próximo no eixo do movimento; desvio para o lado pesa o dobro, para não "pular" de coluna.
 */
export function nearestInDirection(from: Point, dir: Direction, candidates: Point[]): string | null {
  let best: { id: string; cost: number } | null = null
  for (const c of candidates) {
    if (c.id === from.id) continue
    const dx = c.x - from.x
    const dy = c.y - from.y
    let along: number
    let across: number
    switch (dir) {
      case 'right':
        along = dx
        across = dy
        break
      case 'left':
        along = -dx
        across = dy
        break
      case 'down':
        along = dy
        across = dx
        break
      case 'up':
        along = -dy
        across = dx
        break
    }
    if (along <= 0) continue
    const cost = along + 2 * Math.abs(across)
    if (!best || cost < best.cost) best = { id: c.id, cost }
  }
  return best?.id ?? null
}
