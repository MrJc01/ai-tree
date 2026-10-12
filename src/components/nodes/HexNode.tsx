import { memo, useEffect, useRef, type CSSProperties, type MouseEvent } from 'react'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'
import { MODELS } from '../../data/models'
import { HEX_HEIGHT, HEX_RADIUS, HEX_WIDTH, type HandleId } from '../../lib/layout'
import { getEntityKey, statusLabel } from '../../lib/skillMeta'
import { isGrayscale, OPACITY, toVisualContext, visualStateFor } from '../../lib/visibility'
import { nearestInDirection, type Direction } from '../../lib/keynav'
import { activeFocusOf, useAppStore } from '../../store/appStore'
import { useHoverStore } from '../../store/hoverStore'
import type { SkillNode } from '../../types/skill'
import { ModelOrbit } from './ModelOrbit'
import { t } from '../../i18n'

export type HexFlowNode = Node<{ skill: SkillNode }, 'hex'>

const W = HEX_WIDTH
const H = HEX_HEIGHT
const R = HEX_RADIUS

const SPRING = { type: 'spring', stiffness: 380, damping: 26, mass: 0.8 } as const
const ARROW_DIRECTIONS: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

/** Move o foco para o hexágono mais próximo na direção da seta, usando as posições reais na tela. */
function focusNeighbor(from: HTMLElement, dir: Direction) {
  const center = (el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 }
  }
  const points = [...document.querySelectorAll<HTMLElement>('[data-hex-id]')].map((el) => ({
    id: el.dataset.hexId ?? '',
    ...center(el),
  }))
  const id = nearestInDirection({ id: from.dataset.hexId ?? '', ...center(from) }, dir, points)
  if (id) document.querySelector<HTMLElement>(`[data-hex-id="${CSS.escape(id)}"]`)?.focus()
}

/** Movimento em pixels acima do qual o gesto é arrasto, e não clique. */
const DRAG_TOLERANCE = 5
const BRACKET_SPRING = { type: 'spring', stiffness: 320, damping: 30 } as const

/** Vértices do hexágono flat-top (pontas à esquerda e à direita) dentro do box W×H. */
const VERTICES: Array<[number, number]> = [
  [0, H / 2],
  [R / 2, 0],
  [R * 1.5, 0],
  [W, H / 2],
  [R * 1.5, H],
  [R / 2, H],
]

const toPoints = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${x},${y}`).join(' ')

const HEX_POINTS = toPoints(VERTICES)
/** Contorno interno, reduzido a 90%, que dá o acabamento de HUD. */
const INNER_POINTS = toPoints(
  VERTICES.map(([x, y]): [number, number] => [W / 2 + (x - W / 2) * 0.9, H / 2 + (y - H / 2) * 0.9]),
)
/** Contorno de foco: o mesmo hexágono, 7% maior, em volta da habilidade aberta na gaveta. */
const OUTLINE_POINTS = toPoints(
  VERTICES.map(([x, y]): [number, number] => [W / 2 + (x - W / 2) * 1.07, H / 2 + (y - H / 2) * 1.07]),
)
/** Mesmo recorte do hexágono em CSS, usado pelo brilho de assinatura. */
const HEX_CLIP = 'polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)'

/** Cantoneiras nos cantos do box, fora do hexágono. Cada entrada é [x, y, dirX, dirY] para dentro. */
const BRACKET_OFFSET = 9
const BRACKET_ARM = 12
const BRACKETS: Array<[number, number, number, number]> = [
  [-BRACKET_OFFSET, -BRACKET_OFFSET, 1, 1],
  [W + BRACKET_OFFSET, -BRACKET_OFFSET, -1, 1],
  [-BRACKET_OFFSET, H + BRACKET_OFFSET, 1, -1],
  [W + BRACKET_OFFSET, H + BRACKET_OFFSET, -1, -1],
]
const BRACKET_PATHS = BRACKETS.map(
  ([x, y, dx, dy]) => `M ${x} ${y + dy * BRACKET_ARM} L ${x} ${y} L ${x + dx * BRACKET_ARM} ${y}`,
)

/** Todas as portas. Arestas escolhem a saída e a chegada conforme a direção (ver `pickHandles`). */
const HANDLES: Array<{ id: HandleId; type: 'source' | 'target'; position: Position }> = [
  { id: 'out-top', type: 'source', position: Position.Top },
  { id: 'in-top', type: 'target', position: Position.Top },
  { id: 'out-bottom', type: 'source', position: Position.Bottom },
  { id: 'in-bottom', type: 'target', position: Position.Bottom },
  { id: 'out-right', type: 'source', position: Position.Right },
  { id: 'in-right', type: 'target', position: Position.Right },
  { id: 'out-left', type: 'source', position: Position.Left },
  { id: 'in-left', type: 'target', position: Position.Left },
]

function HexNodeComponent({ data }: NodeProps<HexFlowNode>) {
  const { skill } = data
  const entityKey = getEntityKey(skill)
  const isActive = useHoverStore((s) => s.hoveredEntityKey === entityKey)
  const setHovered = useHoverStore((s) => s.setHoveredEntityKey)

  const visual = useAppStore((s) => visualStateFor(skill, toVisualContext(s)))
  const openSkill = useAppStore((s) => s.openSkill)
  const showModels = useAppStore((s) => s.showModels)
  // A habilidade em foco (gaveta aberta ou passo da apresentação) e suas réplicas recebem a borda.
  const isOpen = useAppStore((s) => activeFocusOf(s) === entityKey)

  // Só a instância original recebe os modelos. As réplicas não duplicam as órbitas.
  const orbiting = skill.id === entityKey ? MODELS.filter((m) => m.orbits === entityKey) : []

  // Se a réplica sumir com o mouse em cima (ex.: filtro de linha do tempo), libera o hover.
  useEffect(() => {
    return () => {
      if (useHoverStore.getState().hoveredEntityKey === entityKey) setHovered(null)
    }
  }, [entityKey, setHovered])

  const showBrackets = isActive || visual === 'hl'
  const glowOpacity = isActive ? 0.55 : visual === 'hl' ? 0.35 : 0

  const rootStyle = {
    width: W,
    height: H,
    '--sig': skill.signatureColor,
    opacity: OPACITY[visual],
    filter: isGrayscale(visual) ? 'grayscale(1)' : 'var(--t-node-shadow)',
    transition: 'opacity 500ms ease, filter 500ms ease',
  } as CSSProperties

  const open = () => openSkill(entityKey)

  // Soltar o hexágono depois de arrastá-lo não pode abrir a gaveta: só clique curto abre.
  const pressAt = useRef<{ x: number; y: number } | null>(null)
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const start = pressAt.current
    pressAt.current = null
    if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > DRAG_TOLERANCE) return
    open()
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${skill.name}, ${t('hex.tier', { tier: skill.tier })}, ${statusLabel(skill.metadata.status)}`}
      className="relative cursor-grab outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--t-accent) active:cursor-grabbing"
      style={rootStyle}
      animate={{ scale: isActive ? 1.05 : 1 }}
      transition={SPRING}
      onPointerEnter={() => setHovered(entityKey)}
      onPointerLeave={() => setHovered(null)}
      onPointerDown={(e) => {
        pressAt.current = { x: e.clientX, y: e.clientY }
      }}
      onFocus={() => setHovered(entityKey)}
      onBlur={() => setHovered(null)}
      onClick={onClick}
      data-hex-id={skill.id}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
          return
        }
        // As setas andam pela árvore, a não ser que a apresentação esteja usando as setas para passar de passo.
        const dir = ARROW_DIRECTIONS[e.key]
        if (dir && !useAppStore.getState().presentation.active) {
          e.preventDefault()
          e.stopPropagation()
          focusNeighbor(e.currentTarget, dir)
        }
      }}
    >
      {/* Brilho de assinatura: o hexágono sangra em blur. Em `hl` ele pulsa de forma contínua. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: 'blur(16px)' }}
        initial={false}
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 0.25 }}
      >
        <div
          className={`absolute inset-0 ${visual === 'hl' ? 'animate-hex-pulse' : ''}`}
          style={{ background: 'var(--sig)', clipPath: HEX_CLIP }}
        />
      </motion.div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} overflow="visible" className="absolute inset-0 block">
        {isOpen && (
          <polygon
            points={OUTLINE_POINTS}
            fill="none"
            strokeWidth={2.5}
            style={{ stroke: 'var(--t-accent)', filter: 'drop-shadow(0 0 6px var(--t-accent))' }}
          />
        )}
        <polygon
          points={HEX_POINTS}
          className="transition-[stroke] duration-200"
          style={{
            fill: 'var(--t-node-fill)',
            stroke: isActive || visual === 'hl' ? 'var(--sig)' : 'var(--t-node-stroke)',
            strokeWidth: 1.5,
            strokeDasharray: skill.isDuplicateInstance ? '4 3' : undefined,
          }}
        />
        <polygon points={INNER_POINTS} fill="none" strokeWidth={1} style={{ stroke: 'var(--t-node-inner)' }} />
        {BRACKET_PATHS.map((d) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            strokeWidth={1.5}
            strokeLinecap="square"
            style={{ stroke: 'var(--sig)' }}
            initial={false}
            animate={{ pathLength: showBrackets ? 1 : 0, opacity: showBrackets ? 1 : 0 }}
            transition={BRACKET_SPRING}
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-10 text-center">
        <span
          aria-hidden
          className="absolute top-3.5 size-1.5 rounded-full"
          style={{ background: 'var(--sig)', boxShadow: '0 0 6px var(--sig)' }}
        />
        <span className="absolute top-6 font-mono text-[9px] tracking-[0.14em] text-(--t-text-muted) uppercase">
          T{skill.tier}
        </span>
        <span className="line-clamp-2 text-[13px] leading-tight font-medium text-(--t-text)">{skill.name}</span>
        <span className="absolute bottom-5 font-mono text-[9px] tracking-[0.14em] text-(--t-text-muted) uppercase">
          {statusLabel(skill.metadata.status)}
        </span>
      </div>

      {showModels && orbiting.length > 0 && <ModelOrbit models={orbiting} />}

      {HANDLES.map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable={false}
          style={{ opacity: 0 }}
        />
      ))}
    </motion.div>
  )
}

export const HexNode = memo(HexNodeComponent)
