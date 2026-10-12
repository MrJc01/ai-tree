import type { Viewport } from '@xyflow/react'

/** O que o menu de exportação precisa do canvas: ler a vista, enquadrar a árvore inteira e restaurar a vista. */
export interface CanvasHandle {
  getViewport: () => Viewport
  setViewport: (viewport: Viewport) => void
  fitAll: () => Promise<unknown>
}

let current: CanvasHandle | null = null

/** Registrado pelo controlador da câmera, dentro do React Flow. O menu, que fica fora dele, o usa. */
export function setCanvasHandle(handle: CanvasHandle | null): void {
  current = handle
}

export function canvasHandle(): CanvasHandle | null {
  return current
}
