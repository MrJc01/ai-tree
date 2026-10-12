import { HISTORY_STEPS } from './history'
import { PRESENTATION_STEPS, type PresentationStep } from './steps'

/** Os dois roteiros: a apresentação do sistema e a história da IA contada desde o começo. */
export type PresentationMode = 'apresentacao' | 'historia'

export const PRESENTATION_MODES: Record<
  PresentationMode,
  { label: string; title: string; steps: PresentationStep[] }
> = {
  apresentacao: { label: 'Apresentação', title: 'Apresentação', steps: PRESENTATION_STEPS },
  historia: { label: 'História', title: 'História da IA', steps: HISTORY_STEPS },
}

export function stepsOf(mode: PresentationMode): PresentationStep[] {
  return PRESENTATION_MODES[mode].steps
}
