import type { Edge, EdgeProps } from '@xyflow/react'
import { roundedPath, type Point } from '../../lib/route'
import { useHoverStore } from '../../store/hoverStore'

export interface CircuitEdgeData extends Record<string, unknown> {
  /** Cor de assinatura do pré-requisito, que é a origem do pulso. */
  color: string
  sourceKey: string
  targetKey: string
  /** Trilha ortogonal já roteada: do pré-requisito até quem depende dele. */
  points: Point[]
}

export type CircuitEdgeType = Edge<CircuitEdgeData, 'circuit'>

const PULSE_SECONDS = 2.4

/**
 * Dependência estilo circuito impresso: trilha ortogonal com cantos arredondados, tracejado de energia
 * e dois pulsos que percorrem a trilha do pré-requisito para a habilidade que ele desbloqueia.
 */
export function CircuitEdge({ sourceX, sourceY, targetX, targetY, data, style }: EdgeProps<CircuitEdgeType>) {
  const points: Point[] = data?.points?.length ? data.points : [[sourceX, sourceY], [targetX, targetY]]
  const path = roundedPath(points)
  const hovered = useHoverStore((s) => s.hoveredEntityKey)

  const active = hovered !== null && (hovered === data?.sourceKey || hovered === data?.targetKey)
  const color = data?.color ?? 'var(--t-accent)'
  const opacity = typeof style?.opacity === 'number' ? style.opacity : 1

  return (
    <g style={{ opacity }}>
      <path d={path} fill="none" strokeWidth={active ? 1.6 : 1.1} style={{ stroke: 'var(--t-edge)' }} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={active ? 2 : 1.2}
        strokeDasharray="3 9"
        opacity={active ? 0.95 : 0.45}
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-48" dur={`${PULSE_SECONDS}s`} repeatCount="indefinite" />
      </path>
      {[0, PULSE_SECONDS / 2].map((begin) => (
        <circle key={begin} r={active ? 3.5 : 2.5} fill={color}>
          <animateMotion dur={`${PULSE_SECONDS}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
    </g>
  )
}
