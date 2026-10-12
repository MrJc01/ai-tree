import { HISTORY_STEPS } from './history'
import { PRESENTATION_STEPS, type PresentationStep } from './steps'
import type { UIKey } from '../i18n/ui/pt'

/** Os dois roteiros: a apresentação do sistema e a história da IA contada desde o começo. */
export type PresentationMode = 'apresentacao' | 'historia'

export const PRESENTATION_MODES: Record<
  PresentationMode,
  { titleKey: UIKey; steps: PresentationStep[] }
> = {
  apresentacao: { titleKey: 'presentation.apresentacaoTitle', steps: PRESENTATION_STEPS },
  historia: { titleKey: 'presentation.historyTitle', steps: HISTORY_STEPS },
}

export function stepsOf(mode: PresentationMode): PresentationStep[] {
  return PRESENTATION_MODES[mode].steps
}
