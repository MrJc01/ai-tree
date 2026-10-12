import { create } from 'zustand'

interface HoverState {
  /** Entidade sob o mouse. Todas as réplicas com a mesma chave acendem juntas. */
  hoveredEntityKey: string | null
  setHoveredEntityKey: (key: string | null) => void
}

export const useHoverStore = create<HoverState>((set) => ({
  hoveredEntityKey: null,
  setHoveredEntityKey: (key) => set({ hoveredEntityKey: key }),
}))
