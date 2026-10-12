import { create } from 'zustand'
import { stepsOf, type PresentationMode } from '../presentation/modes'
import { getStoredTheme, persistTheme, type Theme } from '../theme/theme'
import type { Domain, MaturityStatus } from '../types/skill'

export type Density = 'streamline' | 'research'

/**
 * Uma folha da pilha da gaveta. `source` aponta para uma fonte de uma habilidade pelo índice,
 * para não duplicar URLs no estado.
 */
export type DrawerEntry =
  | { kind: 'skill'; id: string }
  | { kind: 'source'; skillId: string; index: number }
  | { kind: 'company'; name: string }

export const TIMELINE_MIN = 1950
export const TIMELINE_MAX = 2026

export type Position = { x: number; y: number }

/** Pedido para o canvas centralizar um nó. `nonce` muda a cada pedido, mesmo para o mesmo nó. */
export interface FocusRequest {
  id: string
  nonce: number
}

/** Pedido para enquadrar a árvore inteira. `nonce` muda a cada pedido. */
export interface FitRequest {
  nonce: number
}

export interface PresentationState {
  active: boolean
  index: number
  mode: PresentationMode
  /** Passos já vistos, do mais antigo ao mais recente, sem o atual. "Voltar ao último visto" usa a última entrada. */
  trail: number[]
}

const PRESENTATION_KEY = 'ai-tech-tree:presentation'
const TRAIL_LIMIT = 50
const DEFAULT_PRESENTATION: PresentationState = { active: false, index: 0, mode: 'apresentacao', trail: [] }

/**
 * Lê o estado da apresentação salvo na sessão. Valida o que veio: modo desconhecido, índice fora do roteiro
 * ou JSON quebrado voltam ao padrão. Assim um recarregamento não zera a apresentação.
 */
export function parsePresentation(raw: string | null): PresentationState {
  if (!raw) return DEFAULT_PRESENTATION
  try {
    const p = JSON.parse(raw) as Partial<PresentationState>
    const mode: PresentationMode = p.mode === 'historia' ? 'historia' : 'apresentacao'
    if (typeof p.index !== 'number' || typeof p.active !== 'boolean') return DEFAULT_PRESENTATION
    const last = stepsOf(mode).length - 1
    const clamp = (n: number) => Math.min(last, Math.max(0, Math.trunc(n)))
    const trail = Array.isArray(p.trail)
      ? p.trail.filter((n): n is number => typeof n === 'number' && Number.isFinite(n)).map(clamp).slice(-TRAIL_LIMIT)
      : []
    return { active: p.active, mode, index: clamp(p.index), trail }
  } catch {
    return DEFAULT_PRESENTATION
  }
}

function loadPresentation(): PresentationState {
  try {
    return parsePresentation(sessionStorage.getItem(PRESENTATION_KEY))
  } catch {
    return DEFAULT_PRESENTATION
  }
}

function savePresentation(p: PresentationState): void {
  try {
    sessionStorage.setItem(PRESENTATION_KEY, JSON.stringify(p))
  } catch {
    // Sem sessão disponível: a apresentação volta ao início se a página recarregar.
  }
}

// Versão 2: o layout em árvore mudou, então posições da versão 1 são descartadas.
const POSITIONS_KEY = 'ai-tech-tree:positions:v2'

/** Posições arrastadas pelo usuário. Vazio = layout padrão. Falha de storage cai para vazio. */
function loadPositions(): Record<string, Position> {
  try {
    const raw = localStorage.getItem(POSITIONS_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as Record<string, Position>
  } catch {
    return {}
  }
}

function savePositions(positions: Record<string, Position>): void {
  try {
    if (Object.keys(positions).length === 0) localStorage.removeItem(POSITIONS_KEY)
    else localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions))
  } catch {
    // Sem persistência: a posição vale só para esta sessão.
  }
}

/** Habilidade que a pilha da gaveta está mostrando: a mais recente, ou a dona da fonte mais recente. */
export function focusedSkillOf(drawer: DrawerEntry[]): string | null {
  for (let i = drawer.length - 1; i >= 0; i--) {
    const entry = drawer[i]
    if (entry.kind === 'skill') return entry.id
    if (entry.kind === 'source') return entry.skillId
  }
  return null
}

/**
 * Habilidade em foco na tela: a aberta na gaveta tem prioridade; sem gaveta, vale o passo da apresentação.
 * Só uma habilidade recebe a borda de foco por vez.
 */
export function activeFocusOf(state: Pick<AppState, 'drawer' | 'presentationFocus'>): string | null {
  return focusedSkillOf(state.drawer) ?? state.presentationFocus
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

/** Mantém o índice dentro do roteiro do modo atual. */
function clampFor(mode: PresentationMode, i: number): number {
  return Math.min(stepsOf(mode).length - 1, Math.max(0, i))
}

/** Vai para outro passo e guarda o atual na pilha de vistos. Ficar no mesmo passo não gera entrada. */
function moveTo(p: PresentationState, target: number, active: boolean): PresentationState {
  const next = clampFor(p.mode, target)
  if (next === p.index) return { ...p, active }
  return { ...p, active, index: next, trail: [...p.trail, p.index].slice(-TRAIL_LIMIT) }
}

interface AppState {
  focus: FocusRequest | null
  requestFocus: (id: string) => void
  fit: FitRequest | null
  requestFit: () => void

  /** Painel de perguntas frequentes, aberto pelo botão FAQ. Enquanto está aberto, ESC é dele. */
  faqOpen: boolean
  setFaqOpen: (open: boolean) => void

  presentation: PresentationState
  /** Habilidade que o passo atual da apresentação está explicando. Recebe a borda de foco. */
  presentationFocus: string | null
  setPresentationFocus: (id: string | null) => void
  startPresentation: (mode?: PresentationMode) => void
  stopPresentation: () => void
  goToStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
  backToLastSeen: () => void

  theme: Theme
  setTheme: (theme: Theme) => void
  /** Posição de cada nó quando foi movido à mão ou organizado. Nós fora deste mapa seguem o padrão. */
  positions: Record<string, Position>
  setPositions: (positions: Record<string, Position>) => void
  setNodePosition: (id: string, position: Position) => void
  resetLayout: () => void
  density: Density
  drawer: DrawerEntry[]
  domains: Domain[]
  companies: string[]
  statuses: MaturityStatus[]
  year: number
  showModels: boolean
  benchmarkId: string | null

  setDensity: (density: Density) => void
  /** Abre uma habilidade. Se a gaveta já estiver aberta, substitui a pilha inteira. */
  openSkill: (id: string) => void
  pushEntry: (entry: DrawerEntry) => void
  popEntry: () => void
  /** Mantém a pilha até `depth` (inclusive). Usado pelo breadcrumb. */
  jumpTo: (depth: number) => void
  closeDrawer: () => void

  toggleDomain: (domain: Domain) => void
  toggleCompany: (company: string) => void
  toggleStatus: (status: MaturityStatus) => void
  clearFilters: () => void
  setYear: (year: number) => void
  toggleModels: () => void
  setBenchmark: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  focus: null,
  requestFocus: (id) => set((s) => ({ focus: { id, nonce: (s.focus?.nonce ?? 0) + 1 } })),
  fit: null,
  requestFit: () => set((s) => ({ fit: { nonce: (s.fit?.nonce ?? 0) + 1 } })),

  faqOpen: false,
  setFaqOpen: (open) => set({ faqOpen: open }),
  presentation: loadPresentation(),
  presentationFocus: null,
  setPresentationFocus: (id) => set({ presentationFocus: id }),
  startPresentation: (mode = 'apresentacao') => set({ presentation: { active: true, index: 0, mode, trail: [] } }),
  stopPresentation: () =>
    set((s) => ({ presentation: { ...s.presentation, active: false }, presentationFocus: null })),
  goToStep: (index) => set((s) => ({ presentation: moveTo(s.presentation, index, true) })),
  nextStep: () => set((s) => ({ presentation: moveTo(s.presentation, s.presentation.index + 1, s.presentation.active) })),
  prevStep: () => set((s) => ({ presentation: moveTo(s.presentation, s.presentation.index - 1, s.presentation.active) })),
  backToLastSeen: () =>
    set((s) => {
      const { trail, mode } = s.presentation
      if (trail.length === 0) return s
      const previous = trail[trail.length - 1]
      return { presentation: { ...s.presentation, index: clampFor(mode, previous), trail: trail.slice(0, -1) } }
    }),

  theme: getStoredTheme(),
  setTheme: (theme) => {
    persistTheme(theme)
    set({ theme })
  },
  positions: loadPositions(),
  setPositions: (positions) => {
    savePositions(positions)
    set({ positions })
  },
  setNodePosition: (id, position) =>
    set((s) => {
      const positions = { ...s.positions, [id]: position }
      savePositions(positions)
      return { positions }
    }),
  resetLayout: () => {
    savePositions({})
    set({ positions: {} })
  },
  density: 'streamline',
  drawer: [],
  domains: [],
  companies: [],
  statuses: [],
  year: TIMELINE_MAX,
  showModels: false,
  benchmarkId: null,

  setDensity: (density) => set({ density }),
  openSkill: (id) => {
    set({ drawer: [{ kind: 'skill', id }] })
    // Abrir de novo a mesma habilidade também centraliza, mesmo sem mudança de foco.
    useAppStore.getState().requestFocus(id)
  },
  pushEntry: (entry) => set((s) => ({ drawer: [...s.drawer, entry] })),
  popEntry: () => set((s) => ({ drawer: s.drawer.slice(0, -1) })),
  jumpTo: (depth) => set((s) => ({ drawer: s.drawer.slice(0, depth + 1) })),
  closeDrawer: () => set({ drawer: [] }),

  toggleDomain: (domain) => set((s) => ({ domains: toggle(s.domains, domain) })),
  toggleCompany: (company) => set((s) => ({ companies: toggle(s.companies, company) })),
  toggleStatus: (status) => set((s) => ({ statuses: toggle(s.statuses, status) })),
  clearFilters: () => set({ domains: [], companies: [], statuses: [] }),
  setYear: (year) => set({ year: Math.min(TIMELINE_MAX, Math.max(TIMELINE_MIN, year)) }),
  toggleModels: () => set((s) => ({ showModels: !s.showModels })),
  setBenchmark: (id) => set((s) => ({ benchmarkId: s.benchmarkId === id ? null : id })),
}))

// A apresentação fica salva na sessão: recarregar a página não a zera.
useAppStore.subscribe((state, prev) => {
  if (state.presentation !== prev.presentation) savePresentation(state.presentation)
})

/**
 * Sempre que a gaveta passa a mostrar outra habilidade (abrir um pré-requisito, desbloqueio ou voltar com ESC),
 * o canvas centraliza nela. Trocar só de fonte ou de empresa dentro da mesma habilidade não move a tela.
 */
useAppStore.subscribe((state, prev) => {
  if (state.drawer === prev.drawer) return
  const next = focusedSkillOf(state.drawer)
  if (next && next !== focusedSkillOf(prev.drawer)) state.requestFocus(next)
})
