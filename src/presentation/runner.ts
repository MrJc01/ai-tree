import { localSkills } from '../data/localized'
import { autoArrangePositions } from '../lib/arrange'
import { TIMELINE_MAX, useAppStore } from '../store/appStore'
import type { PresentationAction } from './steps'

/**
 * Estado-base de todo passo: gaveta fechada, sem filtros, sem benchmark, sem modelos e no presente.
 * Assim um passo nunca herda o estado de outro (por exemplo, um filtro ou um ano de um passo anterior).
 * Cada passo só precisa dizer o que é diferente do básico.
 */
export function applyBaseline(): void {
  const s = useAppStore.getState()
  s.closeDrawer()
  s.clearFilters()
  useAppStore.setState({ benchmarkId: null, showModels: false, year: TIMELINE_MAX })
}

/** Entra num passo: parte do estado-base e aplica as ações do passo, em ordem. */
export function runPresentationStep(actions: PresentationAction[]): void {
  applyBaseline()
  runPresentationActions(actions)
}

/**
 * Aplica as ações de um passo na ordem em que aparecem. Cada ação mexe só no store, e os componentes
 * reagem a ele. Por isso o mesmo código serve para o painel e para os testes.
 */
export function runPresentationActions(actions: PresentationAction[]): void {
  for (const action of actions) runAction(action)
  // A etapa explica uma habilidade: é ela que recebe a borda de foco, mesmo com a gaveta fechada.
  useAppStore.getState().setPresentationFocus(focusTargetOf(actions))
}

/** Habilidade que a etapa destaca: a última citada por uma ação de foco, abertura ou fonte. */
export function focusTargetOf(actions: PresentationAction[]): string | null {
  for (let i = actions.length - 1; i >= 0; i--) {
    const a = actions[i]
    if (a.kind === 'focus' || a.kind === 'open' || a.kind === 'source') return a.skillId
  }
  return null
}

export function runAction(action: PresentationAction): void {
  const s = useAppStore.getState()
  switch (action.kind) {
    case 'fit':
      s.requestFit()
      return
    case 'focus':
      s.requestFocus(action.skillId)
      return
    case 'open':
      s.openSkill(action.skillId)
      return
    case 'source':
      s.openSkill(action.skillId)
      s.pushEntry({ kind: 'source', skillId: action.skillId, index: action.index })
      return
    case 'closeDrawer':
      s.closeDrawer()
      return
    case 'filter':
      // Define tudo de uma vez: um filtro anterior não deve sobrar sem querer.
      useAppStore.setState({
        domains: action.domains ?? [],
        companies: action.companies ?? [],
        statuses: action.statuses ?? [],
      })
      return
    case 'clearFilters':
      s.clearFilters()
      return
    case 'year':
      s.setYear(action.year)
      return
    case 'benchmark':
      useAppStore.setState({ benchmarkId: action.id })
      return
    case 'models':
      useAppStore.setState({ showModels: action.on })
      return
    case 'density':
      s.setDensity(action.value)
      return
    case 'layout':
      if (action.value === 'padrao') s.resetLayout()
      else s.setPositions(autoArrangePositions(localSkills()))
      return
  }
}
