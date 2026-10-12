import type { MaturityStatus, SourceType } from '../../types/skill'
import { t } from '../../i18n'
import type { UIKey } from '../../i18n/ui/pt'

/** Rótulo do tipo de fonte no idioma atual. */
export function sourceTypeLabel(type: SourceType): string {
  return t(SOURCE_TYPE_KEYS[type])
}

const SOURCE_TYPE_KEYS = {
  paper: 'source.kind.paper',
  repo: 'source.kind.repo',
  article: 'source.kind.article',
} as const satisfies Record<SourceType, UIKey>

/** Cor do selo de maturidade. Usa tokens de cor da assinatura, então funciona nos dois temas. */
export const STATUS_TONE: Record<MaturityStatus, string> = {
  theoretical: 'text-violet-400 border-violet-400/40',
  research: 'text-amber-400 border-amber-400/40',
  production: 'text-emerald-400 border-emerald-400/40',
  commodity: 'text-slate-400 border-slate-400/40',
}
