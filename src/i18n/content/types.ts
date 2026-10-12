import type { Actor, Equation, MaturityStatus, SkillSource } from '../../types/skill'

/**
 * Tradução parcial do conteúdo de uma habilidade. Cada campo é opcional: o que não estiver aqui
 * continua em português. Listas (história, atores, equações, fontes) são indexadas pela posição
 * no arquivo de dados, então a ordem de `history`, `actors` etc. precisa bater com a da fonte.
 */
export interface SkillOverlay {
  name?: string
  overview?: string
  impact?: string
  /** Código do fluxograma Mermaid inteiro, com os rótulos no idioma. */
  mermaid?: string
  history?: string[]
  actors?: Array<Partial<Actor>>
  equations?: Array<Partial<Equation>>
  sources?: Array<Partial<SkillSource>>
  /** Rótulo do benchmark mapeado para o valor, já com a formatação do idioma. */
  benchmarks?: Record<string, string>
}

/** Passo da apresentação e da história, pelo `id` do passo. */
export interface StepOverlay {
  title?: string
  body?: string[]
  notes?: string
}

/** Pergunta fixa do FAQ, pelo `id`. As perguntas de patamar e de maturidade vêm de `tiers` e `statuses`. */
export interface FaqOverlay {
  question?: string
  answer?: string[]
}

/** Texto de um patamar (T1 a T5). O nome do patamar já vem traduzido pela interface. */
export interface TierOverlay {
  explanation?: string[]
  criteria?: string[]
  position?: string
  references?: string[]
}

export interface StatusOverlay {
  explanation?: string[]
  /** Sinais para reconhecer a maturidade. */
  recognize?: string[]
}

/** Texto de um benchmark. Nome e ids continuam os mesmos; o placar é formatado no idioma. */
export interface BenchmarkOverlay {
  description?: string
  reference?: { value: string; setting: string }
  current?: { leader?: string; value?: string; note?: string; sourceLabel?: string }
}

export interface ContentOverlay {
  skills: Record<string, SkillOverlay>
  presentation?: Record<string, StepOverlay>
  faq?: Record<string, FaqOverlay>
  terms?: Array<{ term: string; text: string }>
  tiers?: Partial<Record<number, TierOverlay>>
  statuses?: Partial<Record<MaturityStatus, StatusOverlay>>
  benchmarks?: Record<string, BenchmarkOverlay>
}
