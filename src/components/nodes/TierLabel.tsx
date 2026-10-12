import type { Node, NodeProps } from '@xyflow/react'
import type { Tier } from '../../types/skill'

export type TierNode = Node<{ tier: Tier; label: string; width: number }, 'tier'>

/** Nome do patamar à esquerda da sua linha (T1 a T5). Só orienta a leitura; não recebe clique nem arraste. */
export function TierLabel({ data }: NodeProps<TierNode>) {
  return (
    <div className="pointer-events-none flex flex-col gap-0.5" style={{ width: data.width }}>
      <span className="font-mono text-[11px] tracking-[0.14em] text-(--t-text) uppercase">T{data.tier}</span>
      <span className="text-[11px] leading-snug text-(--t-text-muted)">{data.label}</span>
    </div>
  )
}
