import { useEffect, useRef } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import { coveredArea, HEX_HEIGHT, HEX_WIDTH } from '../lib/geometry'
import { DESKTOP_QUERY, useMedia } from '../lib/useMedia'
import { setCanvasHandle } from '../lib/canvasHandle'
import { useAppStore } from '../store/appStore'

/** Zoom com que a habilidade em foco aparece, legível. */
const FOCUS_ZOOM = 1
const FOCUS_DURATION = 650
const FIT_DURATION = 600

/** Verdadeiro quando há hexágonos e todos já têm largura medida pelo React Flow. */
function hexesMeasured(s: { nodeLookup: Map<string, { type?: string; measured: { width?: number } }> }): boolean {
  if (s.nodeLookup.size === 0) return false
  for (const node of s.nodeLookup.values()) {
    if (node.type === 'hex' && node.measured.width === undefined) return false
  }
  return true
}

/** O último pedido de câmera. Enquanto ele vale, a câmera acompanha mudanças de tamanho do canvas. */
type Camera = { kind: 'focus'; id: string } | { kind: 'fit' }

/**
 * Controla a câmera do canvas a partir do store:
 * - `focus`: centraliza numa habilidade, na parte livre: à esquerda da gaveta no desktop, acima dela no celular.
 * - `fit`: enquadra a árvore inteira.
 *
 * A área do canvas muda sozinha: o painel da apresentação abre e fecha com animação, e a gaveta cobre parte dela.
 * Por isso a câmera é refeita quando o tamanho real do canvas muda, e o nó em foco continua no centro.
 * Abrir ou fechar a gaveta não reenquadra a árvore inteira se o último pedido foi só de enquadrar.
 */
export function CanvasController() {
  const focus = useAppStore((s) => s.focus)
  const fit = useAppStore((s) => s.fit)
  const drawerOpen = useAppStore((s) => s.drawer.length > 0)
  const presenting = useAppStore((s) => s.presentation.active)
  const desktop = useMedia(DESKTOP_QUERY)
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)
  // Os hexágonos já foram medidos: só então a câmera pode centralizar. (useNodesInitialized não serve: as faixas não têm alças.)
  const initialized = useStore(hexesMeasured)
  const { getNode, setCenter, fitView, getViewport, setViewport } = useReactFlow()

  const camera = useRef<Camera | null>(null)

  // Expõe o canvas para o menu de exportação, que fica fora do React Flow.
  useEffect(() => {
    setCanvasHandle({
      getViewport,
      setViewport: (viewport) => setViewport(viewport, { duration: 0 }),
      fitAll: () => fitView({ padding: 0.04, minZoom: 0.05, maxZoom: 1, duration: 0 }),
    })
    return () => setCanvasHandle(null)
  }, [getViewport, setViewport, fitView])
  const seen = useRef({ focus: 0, fit: 0 })
  // Evita refazer a mesma câmera a cada render: só age quando o alvo ou o tamanho de fato mudaram.
  const lastKey = useRef<string | null>(null)
  // Enquadramento inicial, feito uma vez quando os nós estão medidos e nenhum pedido de câmera veio antes.
  const startedFit = useRef(false)

  useEffect(() => {
    let animate = false
    if (focus && focus.nonce !== seen.current.focus) {
      seen.current.focus = focus.nonce
      camera.current = { kind: 'focus', id: focus.id }
      animate = true
    }
    if (fit && fit.nonce !== seen.current.fit) {
      seen.current.fit = fit.nonce
      camera.current = { kind: 'fit' }
      animate = true
    }

    if (!initialized || width === 0 || height === 0) return

    const cam = camera.current
    if (!cam) {
      if (!startedFit.current) {
        startedFit.current = true
        void fitView({ padding: 0.06, minZoom: 0.2, maxZoom: 0.7, duration: 0 })
      }
      return
    }

    if (cam.kind === 'fit') {
      const key = `fit:${width}:${height}`
      if (!animate && key === lastKey.current) return
      lastKey.current = key
      void fitView({ padding: 0.06, minZoom: 0.2, maxZoom: 0.7, duration: animate ? FIT_DURATION : 0 })
      return
    }

    const node = getNode(cam.id)
    if (!node) return
    const covered = coveredArea({ desktop, width, height, drawerOpen, presenting })
    // Deslocar o centro empurra o nó para o lado oposto ao coberto: para a direita no desktop, para cima no celular.
    const shiftX = covered.axis === 'x' ? covered.px / 2 / FOCUS_ZOOM : 0
    const shiftY = covered.axis === 'y' ? covered.px / 2 / FOCUS_ZOOM : 0
    const x = node.position.x + HEX_WIDTH / 2 + shiftX
    const y = node.position.y + HEX_HEIGHT / 2 + shiftY
    const key = `focus:${cam.id}:${x}:${y}:${width}:${height}`
    if (!animate && key === lastKey.current) return
    lastKey.current = key
    setCenter(x, y, { zoom: FOCUS_ZOOM, duration: animate ? FOCUS_DURATION : 0 })
  }, [focus, fit, drawerOpen, presenting, desktop, width, height, initialized, getNode, setCenter, fitView])

  return null
}
