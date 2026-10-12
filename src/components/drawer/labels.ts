import type { MaturityStatus, SourceType } from '../../types/skill'

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  paper: 'Paper',
  repo: 'Repositório',
  article: 'Artigo',
}

/** Cor do selo de maturidade. Usa tokens de cor da assinatura, então funciona nos dois temas. */
export const STATUS_TONE: Record<MaturityStatus, string> = {
  theoretical: 'text-violet-400 border-violet-400/40',
  research: 'text-amber-400 border-amber-400/40',
  production: 'text-emerald-400 border-emerald-400/40',
  commodity: 'text-slate-400 border-slate-400/40',
}
