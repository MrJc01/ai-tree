import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'

interface MermaidDiagramProps {
  code: string
}

let renderCounter = 0

/**
 * Renderiza um fluxograma Mermaid no cliente. O pacote é carregado sob demanda para não pesar o
 * bundle inicial. O tema do diagrama acompanha o tema da aplicação.
 */
export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const theme = useAppStore((s) => s.theme)
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setSvg(null)
    setError(null)

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({ startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'default', securityLevel: 'strict' })
        renderCounter += 1
        const { svg: output } = await mermaid.render(`flow-${renderCounter}`, code)
        if (!cancelled) setSvg(output)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Falha ao renderizar o diagrama')
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [code, theme])

  if (error) {
    return (
      <p role="alert" className="rounded border border-(--t-border) p-3 font-mono text-[11px] text-(--t-text-muted)">
        Não foi possível renderizar o fluxograma: {error}
      </p>
    )
  }
  if (!svg) {
    return <p className="font-mono text-[11px] text-(--t-text-muted)">Renderizando fluxograma…</p>
  }
  return (
    <div
      className="overflow-x-auto rounded-lg border border-(--t-border) bg-(--t-surface) p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // SVG gerado pelo Mermaid com securityLevel "strict". O código vem dos nossos dados, não do usuário.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
