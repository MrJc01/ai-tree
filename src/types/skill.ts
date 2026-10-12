/** Áreas (eixo X) da árvore. A ordem aqui define a coluna: arquiteturas = 0, alinhamento = 4. */
export const DOMAINS = ['architectures', 'compute', 'reasoning', 'robotics', 'alignment'] as const
export type Domain = (typeof DOMAINS)[number]

/** Patamares de evolução (eixo Y): 1 = base (ML clássico), 5 = topo (ASI). */
export type Tier = 1 | 2 | 3 | 4 | 5

/** Maturidade de uma habilidade. */
export const MATURITY_STATUSES = ['theoretical', 'research', 'production', 'commodity'] as const
export type MaturityStatus = (typeof MATURITY_STATUSES)[number]

export type SourceType = 'paper' | 'repo' | 'article'

export interface SkillSource {
  title: string
  url: string
  type: SourceType
  /** Resumo curto escrito a partir da fonte, não um trecho copiado. */
  summary?: string
}

export interface HistoryEvent {
  year: number
  event: string
  /** 1 (detalhe) a 5 (marco). Usado na ordenação "por impacto". */
  importance: number
}

export interface Actor {
  name: string
  role: string
  org: string
}

export interface Equation {
  label: string
  expression: string
}

export interface SkillNode {
  /** Identificador desta instância no grafo. */
  id: string
  name: string
  domain: Domain
  tier: Tier
  gridCoordinates: { col: number; row: number }
  /** Cor de assinatura: ponto no hexágono e brilho no hover sincronizado. */
  signatureColor: string
  /** Réplica de uma habilidade que também aparece em outra área. */
  isDuplicateInstance?: boolean
  /** `id` da instância original. Réplicas compartilham a entidade por este campo. */
  rootEntityId?: string
  /** IDs de nós que precisam existir antes deste. Arestas saem deles em direção a este nó. */
  prerequisites: string[]
  /** IDs de nós que este desbloqueia. Derivado de `prerequisites` ao carregar. */
  unlocks: string[]
  metadata: {
    status: MaturityStatus
    /** `YYYY` ou `YYYY-MM`. */
    dateIntroduced: string
    companies: string[]
    modelsAssociated?: string[]
  }
  content: {
    overview: string
    /** Por que importa. Mostrado nos dois modos. */
    impact: string
    history: HistoryEvent[]
    actors: Actor[]
    equations?: Equation[]
    mermaidDiagram?: string
    benchmarks?: Record<string, string | number>
    sources: SkillSource[]
  }
  subPages?: Array<{ id: string; title: string; contentMarkdown: string }>
}

/** Forma dos arquivos de dados. `unlocks` é opcional e é preenchido por `normalizeSkills`. */
export type SkillSeed = Omit<SkillNode, 'unlocks'> & { unlocks?: string[] }

export interface ModelNode {
  id: string
  name: string
  vendor: string
  /** `YYYY-MM` de lançamento. */
  releasedAt: string
  /** ID da entidade (habilidade original) que o modelo orbita. */
  orbits: string
  /** Fonte oficial do lançamento: arXiv, blog da empresa ou página do modelo. */
  url: string
}

/** Placar atual de um benchmark, lido em `checkedAt` na página `sourceUrl`. Confira no placar oficial antes de citar. */
export interface CurrentScore {
  /** Quem lidera e o resultado, como aparece na fonte. */
  leader: string
  value: string
  /** Data da leitura (AAAA-MM-DD). */
  checkedAt: string
  /** Data que a própria fonte informa como última atualização (AAAA-MM ou AAAA-MM-DD). */
  sourceDate?: string
  sourceUrl: string
  sourceLabel: string
  officialUrl: string
  note?: string
}

export interface Benchmark {
  id: string
  name: string
  description: string
  year: number
  /** IDs de entidades (originais) que este benchmark avalia. */
  measures: string[]
  paperUrl: string
  officialUrl: string
  /** Valor de referência publicado no artigo original. */
  reference?: { value: string; setting: string; source: string }
  /** Placar atual, com a data da leitura e a página de onde saiu. Ausente quando não há placar verificado. */
  current?: CurrentScore
}
