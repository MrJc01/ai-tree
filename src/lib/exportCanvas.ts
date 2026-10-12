import { toPng, toSvg } from 'html-to-image'

export type ExportFormat = 'png' | 'svg'

/** Elementos do canvas que não entram na imagem: controles, minimapa e atribuição. */
const EXCLUDED = '.react-flow__controls, .react-flow__minimap, .react-flow__attribution, .react-flow__panel'

/**
 * Salva a vista atual do canvas como PNG ou SVG, com as cores do tema. Exporta o que está na tela,
 * com o zoom e a posição atuais. Devolve false quando o canvas não está na página.
 */
export async function exportCanvas(format: ExportFormat): Promise<boolean> {
  const canvas = document.querySelector<HTMLElement>('.react-flow')
  if (!canvas) return false
  const background = getComputedStyle(document.documentElement).getPropertyValue('--t-bg').trim() || undefined
  const options = {
    backgroundColor: background,
    cacheBust: true,
    filter: (node: HTMLElement) => !node.matches?.(EXCLUDED),
  }
  const dataUrl = format === 'png' ? await toPng(canvas, options) : await toSvg(canvas, options)
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `ai-tree-${new Date().toISOString().slice(0, 10)}.${format}`
  link.click()
  return true
}
