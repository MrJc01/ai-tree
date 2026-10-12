import { contentOverlay } from '../i18n/content'
import { currentLocale } from '../i18n/state'
import type { UIKey } from '../i18n/ui/pt'
import { HISTORY_STEPS } from './history'
import { PRESENTATION_STEPS, type PresentationStep } from './steps'

/** Os dois roteiros: a apresentação do sistema e a história da IA contada desde o começo. */
export type PresentationMode = 'apresentacao' | 'historia'

export const PRESENTATION_MODES: Record<
  PresentationMode,
  { titleKey: UIKey; steps: PresentationStep[] }
> = {
  apresentacao: { titleKey: 'presentation.apresentacaoTitle', steps: PRESENTATION_STEPS },
  historia: { titleKey: 'presentation.historyTitle', steps: HISTORY_STEPS },
}

const cache = new Map<string, PresentationStep[]>()

/**
 * Passos do roteiro no idioma atual. Título, parágrafos e notas vêm do overlay de conteúdo, pelo `id` do
 * passo; as ações (o que a tela faz) são sempre as do arquivo de dados.
 */
export function stepsOf(mode: PresentationMode): PresentationStep[] {
  const locale = currentLocale()
  const key = `${locale}:${mode}`
  let steps = cache.get(key)
  if (!steps) {
    const overlay = contentOverlay(locale)?.presentation
    steps = PRESENTATION_MODES[mode].steps.map((step) => {
      const o = overlay?.[step.id]
      return o ? { ...step, ...o } : step
    })
    cache.set(key, steps)
  }
  return steps
}
