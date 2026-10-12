import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/appStore'

interface MermaidDiagramProps {
  code: string
}

/** Resultado de uma renderização, guardado com a chave (tema + código) que a produziu. */
interface RenderResult {
  key: string
  svg?: string
  error?: string
}

let renderCounter = 0

/**
 * Renderiza um fluxograma Mermaid no cliente. O pacote é carregado sob demanda para não pesar o
 * bundle inicial. O tema do diagrama acompanha o tema da aplicação.
 */
export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const theme = useAppStore((s) => s.theme)
  const [result, setResult] = useState<RenderResult | null>(null)
  const key = `${theme}\n${code}`

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const { default: mermaid } = await import('mermaid')
        mermaid.initialize({ startOnLoad: false, theme: theme === 'dark' ? 'dark' : 'default', securityLevel: 'strict' })
        renderCounter += 1
        const { svg: output } = await mermaid.render(`flow-${renderCounter}`, code)
        if (!cancelled) setResult({ key, svg: output })
      } catch (err) {
        if (!cancelled) setResult({ key, error: err instanceof Error ? err.message : 'Falha ao renderizar o diagrama' })
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [code, theme, key])

  // Um resultado de outro tema ou de outro código não vale: enquanto o novo não chega, mostra "renderizando".
  const current = result?.key === key ? result : null

  if (current?.error) {
    return (
      <p role="alert" className="rounded border border-(--t-border) p-3 font-mono text-[11px] text-(--t-text-muted)">
        Não foi possível renderizar o fluxograma: {current.error}
      </p>
    )
  }
  if (!current?.svg) {
    return <p className="font-mono text-[11px] text-(--t-text-muted)">Renderizando fluxograma…</p>
  }
  return (
    <div
      className="overflow-x-auto rounded-lg border border-(--t-border) bg-(--t-surface) p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // SVG gerado pelo Mermaid com securityLevel "strict". O código vem dos nossos dados, não do usuário.
      dangerouslySetInnerHTML={{ __html: current.svg }}
    />
  )
}
