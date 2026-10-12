import { toPng, toSvg } from 'html-to-image'
import { canvasHandle } from './canvasHandle'

export type ExportFormat = 'png' | 'svg'
/** `view`: o que está na tela. `tree`: a árvore inteira, enquadrada de uma vez. */
export type ExportScope = 'view' | 'tree'

/** Opções exibidas nos dois menus (desktop e celular). Uma lista só, para não divergirem. */
export const EXPORT_OPTIONS: Array<{ format: ExportFormat; scope: ExportScope; label: string; description: string }> = [
  { format: 'png', scope: 'view', label: 'PNG · vista atual', description: 'Imagem da tela, com o zoom e a posição atuais.' },
  { format: 'png', scope: 'tree', label: 'PNG · árvore inteira', description: 'A árvore toda numa imagem, para slides.' },
  { format: 'svg', scope: 'view', label: 'SVG · vista atual', description: 'Vetorial, da tela atual, para editar em outro programa.' },
  { format: 'svg', scope: 'tree', label: 'SVG · árvore inteira', description: 'Vetorial, com a árvore toda.' },
]

/** Elementos do canvas que não entram na imagem: controles, minimapa e atribuição. */
const EXCLUDED = '.react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__panel'

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/**
 * Salva o canvas como PNG ou SVG, com as cores do tema. Na vista atual, exporta o que está na tela. Na árvore
 * inteira, enquadra a árvore, exporta e devolve a vista que o usuário tinha. Devolve false se o canvas não existe.
 */
export async function exportCanvas(format: ExportFormat, scope: ExportScope = 'view'): Promise<boolean> {
  const canvas = document.querySelector<HTMLElement>('.react-flow')
  if (!canvas) return false
  const handle = canvasHandle()
  const wholeTree = scope === 'tree' && handle !== null
  const previous = wholeTree ? handle.getViewport() : null
  try {
    if (wholeTree) {
      await handle.fitAll()
      await nextFrame()
      await nextFrame()
    }
    const background = getComputedStyle(document.documentElement).getPropertyValue('--t-bg').trim() || undefined
    const options = {
      backgroundColor: background,
      cacheBust: true,
      pixelRatio: 2,
      filter: (node: HTMLElement) => !node.matches?.(EXCLUDED),
    }
    const dataUrl = format === 'png' ? await toPng(canvas, options) : await toSvg(canvas, options)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `ai-tree-${wholeTree ? 'arvore' : 'vista'}-${new Date().toISOString().slice(0, 10)}.${format}`
    link.click()
  } finally {
    if (previous && handle) handle.setViewport(previous)
  }
  return true
}
