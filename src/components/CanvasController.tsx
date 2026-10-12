import { useEffect, useRef } from 'react'
import { useReactFlow, useStore } from '@xyflow/react'
import { drawerWidthIn, HEX_HEIGHT, HEX_WIDTH } from '../lib/geometry'
import { useAppStore } from '../store/appStore'

/** Zoom com que a habilidade em foco aparece, legível. */
const FOCUS_ZOOM = 1
const FOCUS_DURATION = 650
const FIT_DURATION = 600

/** O último pedido de câmera. Enquanto ele vale, a câmera acompanha mudanças de tamanho do canvas. */
type Camera = { kind: 'focus'; id: string } | { kind: 'fit' }

/**
 * Controla a câmera do canvas a partir do store:
 * - `focus`: centraliza numa habilidade, na parte livre à esquerda da gaveta quando ela está aberta.
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
  const width = useStore((s) => s.width)
  const height = useStore((s) => s.height)
  const { getNode, setCenter, fitView } = useReactFlow()

  const camera = useRef<Camera | null>(null)
  const seen = useRef({ focus: 0, fit: 0 })
  // Evita refazer a mesma câmera a cada render: só age quando o alvo ou o tamanho de fato mudaram.
  const lastKey = useRef<string | null>(null)

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

    const cam = camera.current
    if (!cam || width === 0 || height === 0) return

    if (cam.kind === 'fit') {
      const key = `fit:${width}:${height}`
      if (!animate && key === lastKey.current) return
      lastKey.current = key
      void fitView({ padding: 0.06, minZoom: 0.2, maxZoom: 0.7, duration: animate ? FIT_DURATION : 0 })
      return
    }

    const node = getNode(cam.id)
    if (!node) return
    const covered = drawerOpen ? drawerWidthIn(width) : 0
    // Deslocar o centro para a direita empurra o nó para a esquerda na tela, dentro da área livre.
    const x = node.position.x + HEX_WIDTH / 2 + covered / 2 / FOCUS_ZOOM
    const y = node.position.y + HEX_HEIGHT / 2
    const key = `focus:${cam.id}:${x}:${y}:${width}:${height}`
    if (!animate && key === lastKey.current) return
    lastKey.current = key
    setCenter(x, y, { zoom: FOCUS_ZOOM, duration: animate ? FOCUS_DURATION : 0 })
  }, [focus, fit, drawerOpen, width, height, getNode, setCenter, fitView])

  return null
}
