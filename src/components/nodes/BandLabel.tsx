import type { Node, NodeProps } from '@xyflow/react'

export type BandNode = Node<{ label: string; width: number }, 'band'>

/** Nome da área no topo da sua coluna. Só orienta a leitura; não recebe clique nem arraste. */
export function BandLabel({ data }: NodeProps<BandNode>) {
  return (
    <div
      className="pointer-events-none border-b border-(--t-border) pb-1.5 font-mono text-[11px] tracking-[0.18em] text-(--t-text-muted) uppercase"
      style={{ width: data.width }}
    >
      {data.label}
    </div>
  )
}
