import { localSkills } from '../data/localized'
import { domainLabel, statusLabel, tierLabel } from '../lib/skillMeta'
import type { MaturityStatus, SkillNode, Tier } from '../types/skill'

/**
 * Explicação completa de cada patamar (T1 a T5) e de cada maturidade. O texto é fixo; os exemplos e as
 * contagens são calculados a partir da árvore, então nunca ficam fora de sintonia com os dados.
 */

export interface TierDetail {
  tier: Tier
  name: string
  /** O que é esse nível, em linguagem direta. */
  explanation: string[]
  /** Como reconhecer uma habilidade desse patamar. */
  criteria: string[]
  /** Por que ele fica nessa posição na árvore. */
  position: string
  /** Leituras de referência para o patamar, quando há um texto de base publicado. */
  references?: string[]
}

export interface StatusDetail {
  status: MaturityStatus
  name: string
  explanation: string[]
  /** Sinais para decidir se uma habilidade está nessa maturidade. */
  recognize: string[]
}

export const TIER_DETAILS: TierDetail[] = [
  {
    tier: 1,
    name: tierLabel(1),
    explanation: [
      'São os métodos clássicos de aprendizado de máquina e as ideias matemáticas que sustentam todo o resto: estatística, modelos lineares, árvores de decisão, máquinas de vetores de suporte, o gradiente descendente e o próprio neurônio artificial.',
      'Muitos deles já são simples e interpretáveis, e funcionam bem com dados limitados.',
    ],
    criteria: [
      'Modelos com poucas camadas, ou ideias fundamentais que não dependem de redes profundas.',
      'Costumam ser ensinados como o básico do campo.',
      'Trabalham bem com poucos dados e são fáceis de explicar.',
    ],
    position: 'Fica na base porque quase todo o resto depende dele: sem o gradiente e sem o neurônio, não há deep learning.',
  },
  {
    tier: 2,
    name: tierLabel(2),
    explanation: [
      'São as redes neurais profundas treinadas para uma tarefa específica: reconhecer imagens, traduzir frases, transcrever fala, jogar um jogo. A palavra "estreita" quer dizer exatamente isso: a rede é muito boa numa tarefa e não generaliza sozinha para outra.',
      'Aqui surgiram as arquiteturas que dominaram a área, como as redes convolucionais e a atenção.',
    ],
    criteria: [
      'Usa redes com muitas camadas, treinadas por retropropagação e, em geral, em GPUs.',
      'Aprende representações a partir de muitos dados rotulados ou simulados.',
      'Tem desempenho excelente em uma tarefa, mas não transfere bem para outras sem novo treino.',
    ],
    position: 'Vem logo acima da base: é o primeiro salto que depende dos fundamentos do T1, mas ainda não generaliza.',
  },
  {
    tier: 3,
    name: tierLabel(3),
    explanation: [
      'São os modelos de linguagem grandes e os sistemas que usam essas capacidades para agir: usam ferramentas, planejam em vários passos, consultam a web e executam código. Um agente, nesse sentido, é um sistema que percebe, decide e age em sequência para cumprir um objetivo.',
      'Um mesmo modelo serve para muitas tarefas de texto, o que é uma virada em relação ao T2. Ainda assim, comete erros e costuma precisar de supervisão.',
    ],
    criteria: [
      'Aprende uma capacidade geral (como linguagem) e a usa em muitas tarefas diferentes.',
      'Pode agir: chamar ferramentas, navegar, escrever e executar código, em um laço de decisão.',
      'Ainda não é confiável sem verificação em tarefas longas.',
    ],
    position: 'Fica no meio da árvore: depende das arquiteturas do T2 (como o transformer) e abre caminho para o raciocínio mais longo do T4.',
  },
  {
    tier: 4,
    name: tierLabel(4),
    explanation: [
      'São os sistemas que se aproximam da inteligência geral: modelos multimodais (que entendem texto, imagem e áudio juntos), raciocínio longo, agentes que operam em muitos domínios e robôs que transferem o que aprenderam para tarefas novas.',
      'Não há consenso de que a AGI, a inteligência geral no nível humano, já tenha sido alcançada. No app, este patamar marca o que está mais perto disso, e a discussão continua aberta.',
    ],
    criteria: [
      'Desempenho bom em muitas tarefas diferentes, e transferência entre domínios.',
      'Combina percepção (imagem, áudio) com linguagem e raciocínio.',
      'Ainda com limitações claras, e com debate público sobre o quanto está de fato próximo da AGI.',
    ],
    position: 'Fica acima do T3 porque combina as capacidades anteriores em sistemas gerais. É o trecho mais disputado da árvore.',
    references: [
      'Morris et al., "Levels of AGI for Operationalizing Progress on the Path to AGI" (arXiv:2311.02462, 2023): propõe níveis de desempenho para a AGI, do emergente ao sobre-humano.',
    ],
  },
  {
    tier: 5,
    name: tierLabel(5),
    explanation: [
      'É a superinteligência: uma inteligência que supera amplamente o humano em praticamente todos os domínios, inclusive na própria pesquisa em IA. Não existe. É um cenário teórico, usado para pensar riscos, controle e governança antes que qualquer coisa parecida apareça.',
      'As habilidades desse patamar não são produtos. São hipóteses de trabalho.',
    ],
    criteria: [
      'Teórico: nenhuma implementação existe hoje.',
      'Costuma envolver automelhoria recursiva, controle de sistemas muito capazes e limites físicos de computação.',
      'Discutido por pesquisadores de segurança e de governança, não por produtos.',
    ],
    position: 'Fica no topo: depende do que está embaixo, mas não há ainda um caminho técnico consolidado até ele.',
    references: [
      'Good, "Speculations Concerning the First Ultraintelligent Machine" (1965): a ideia de que uma máquina capaz de melhorar a si mesma leva a uma explosão de inteligência.',
      'Bostrom, "Superintelligence: Paths, Dangers, Strategies" (Oxford University Press, 2014): o estudo clássico dos caminhos, dos riscos e do controle da superinteligência.',
    ],
  },
]

export const STATUS_DETAILS: StatusDetail[] = [
  {
    status: 'theoretical',
    name: statusLabel('theoretical'),
    explanation: [
      'Uma proposta, um cenário ou um argumento sem implementação consolidada. Pode ser uma previsão, um experimento mental ou uma análise de riscos.',
      'Serve para pensar o caminho e não para ser usado hoje.',
    ],
    recognize: [
      'Não existe sistema em uso nem resultado replicável.',
      'O texto de referência costuma ser de posição, de análise ou de especulação fundamentada.',
    ],
  },
  {
    status: 'research',
    name: statusLabel('research'),
    explanation: [
      'Pesquisa ativa: há artigos, protótipos e resultados publicados, mas a técnica ainda não foi adotada amplamente em produtos.',
      'É onde a área está testando ideias, e algumas dessas ideias ainda vão virar produção.',
    ],
    recognize: [
      'Resultados em laboratório e benchmarks publicados, com código aberto ou em estágio inicial.',
      'Ainda pouca gente usa fora de pesquisa, e as implementações mudam muito de um trabalho para o outro.',
    ],
  },
  {
    status: 'production',
    name: statusLabel('production'),
    explanation: [
      'Em uso real, em produtos e serviços que as pessoas usam hoje. A técnica já passou pela fase de prova e está sendo aplicada no dia a dia.',
      'Ainda há variantes competindo entre si, e ela ainda não virou o básico do campo.',
    ],
    recognize: [
      'Usada por produtos conhecidos, com ferramentas e documentação maduras.',
      'Ainda é diferencial de quem a implementa bem, e as comparações entre abordagens são frequentes.',
    ],
  },
  {
    status: 'commodity',
    name: statusLabel('commodity'),
    explanation: [
      'Técnica padrão: disponível em qualquer biblioteca, ensinada como o básico e usada sem precisar de justificativa especial. Deixou de ser diferencial e virou infraestrutura.',
      'Um exemplo é o gradiente descendente: quase ninguém o reinventa, todo mundo o usa.',
    ],
    recognize: [
      'Implementada com uma linha de código em bibliotecas comuns.',
      'Aparece em cursos introdutórios e não é mais tema de artigo principal.',
    ],
  },
]

/** Originais da árvore (sem réplicas), para contar e dar exemplos sem repetir a mesma habilidade. */
const originals = (): SkillNode[] => localSkills().filter((s) => !s.isDuplicateInstance)

/** Quantas habilidades há no patamar, e até `limit` exemplos (nomes, em ordem alfabética). */
export function tierExamples(tier: Tier, limit = 6): { count: number; examples: string[] } {
  const list = originals().filter((s) => s.tier === tier)
  return {
    count: list.length,
    examples: list
      .map((s) => s.name)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .slice(0, limit),
  }
}

/** Quantas habilidades têm a maturidade, e até `limit` exemplos. */
export function statusExamples(status: MaturityStatus, limit = 6): { count: number; examples: string[] } {
  const list = originals().filter((s) => s.metadata.status === status)
  return {
    count: list.length,
    examples: list
      .map((s) => s.name)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'))
      .slice(0, limit),
  }
}

/** Área de cada exemplo, para dar contexto sem ambiguidade (ex.: "Transformer (Arquiteturas & Redes)"). */
export function describeExample(skill: SkillNode): string {
  return `${skill.name} (${domainLabel(skill.domain)})`
}
