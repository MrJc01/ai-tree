import { useCallback, useMemo } from 'react'
import { Background, BackgroundVariant, Controls, MiniMap, ReactFlow, type NodeChange } from '@xyflow/react'
import { layoutSkills } from '../lib/layout'
import { edgeOpacity, toVisualContext, visualStateFor } from '../lib/visibility'
import { useAppStore } from '../store/appStore'
import type { Theme } from '../theme/theme'
import type { SkillNode } from '../types/skill'
import { CircuitEdge } from './edges/CircuitEdge'
import { HexNode } from './nodes/HexNode'
import { BandLabel } from './nodes/BandLabel'
import { TierLabel } from './nodes/TierLabel'
import { CanvasController } from './CanvasController'

// Fora do componente para o React Flow não recriar os tipos a cada render.
const nodeTypes = { hex: HexNode, band: BandLabel, tier: TierLabel }
const edgeTypes = { circuit: CircuitEdge }

const GRID_COLOR: Record<Theme, string> = { dark: '#1a1f29', light: '#dfe3e8' }

/** Cor de cada nó no mini-mapa: habilidades usam a cor de assinatura, rótulos somem. */
function miniMapColor(node: { type?: string; data: unknown }): string {
  if (node.type !== 'hex') return 'transparent'
  const skill = (node.data as { skill?: { signatureColor?: string } }).skill
  return skill?.signatureColor ?? 'var(--t-edge)'
}

interface SkillCanvasProps {
  skills: SkillNode[]
}

export function SkillCanvas({ skills }: SkillCanvasProps) {
  const theme = useAppStore((s) => s.theme)
  const domains = useAppStore((s) => s.domains)
  const companies = useAppStore((s) => s.companies)
  const statuses = useAppStore((s) => s.statuses)
  const year = useAppStore((s) => s.year)
  const benchmarkId = useAppStore((s) => s.benchmarkId)
  const positions = useAppStore((s) => s.positions)
  const setNodePosition = useAppStore((s) => s.setNodePosition)

  const { nodes, edges } = useMemo(() => layoutSkills(skills, positions), [skills, positions])

  // Arestas herdam a opacidade do extremo mais apagado, para o ghosting também valer nas conexões.
  const visibleEdges = useMemo(() => {
    const ctx = toVisualContext({ domains, companies, statuses, year, benchmarkId })
    const byId = new Map(skills.map((s) => [s.id, s]))
    return edges.map((edge) => {
      const a = byId.get(edge.source)
      const b = byId.get(edge.target)
      const opacity = a && b ? edgeOpacity(visualStateFor(a, ctx), visualStateFor(b, ctx)) : 1
      return { ...edge, style: { opacity } }
    })
  }, [edges, skills, domains, companies, statuses, year, benchmarkId])

  // O canvas é controlado: cada movimento de nó vai para o store, que também persiste a posição.
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === 'position' && change.position) setNodePosition(change.id, change.position)
      }
    },
    [setNodePosition],
  )

  return (
    <div className="h-full w-full">
      <ReactFlow
        className="max-md:[&_.react-flow__controls]:hidden max-md:[&_.react-flow__minimap]:hidden"
        nodes={nodes}
        edges={visibleEdges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        colorMode={theme}
        fitViewOptions={{ padding: 0.06, minZoom: 0.2, maxZoom: 0.7 }}
        minZoom={0.12}
        maxZoom={2}
        nodesDraggable
        nodesConnectable={false}
        selectNodesOnDrag={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color={GRID_COLOR[theme]} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          className="!border-(--t-border) !bg-(--t-surface)"
          maskColor="color-mix(in srgb, var(--t-bg) 70%, transparent)"
          nodeColor={miniMapColor}
        />
        <CanvasController />
      </ReactFlow>
    </div>
  )
}
