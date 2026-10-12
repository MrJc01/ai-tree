import type { Actor, Equation, SkillSource } from '../../types/skill'

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

export interface ContentOverlay {
  skills: Record<string, SkillOverlay>
}
