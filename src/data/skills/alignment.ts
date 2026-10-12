import { sig } from '../../lib/color'
import type { SkillSeed } from '../../types/skill'

/** Alinhamento & Governança (coluna 4). */
export const ALIGNMENT_SKILLS: SkillSeed[] = [
  {
    id: 'turing-test',
    name: 'Teste de Turing',
    domain: 'alignment',
    tier: 1,
    gridCoordinates: { col: 4, row: 0 },
    signatureColor: sig(41),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1950', companies: [] },
    content: {
      overview:
        'Critério de inteligência por imitação: uma máquina é considerada inteligente se um interrogador não distingue suas respostas das de um humano.',
      impact:
        'Ainda é a referência cultural de "máquina inteligente". Também ilustra por que avaliações de comportamento não bastam para medir capacidade real.',
      history: [
        { year: 1950, event: 'Turing publica "Computing Machinery and Intelligence" na Mind', importance: 5 },
      ],
      actors: [{ name: 'Alan Turing', role: 'Autor', org: 'Universidade de Manchester' }],
      sources: [
        {
          title: 'Computing machinery and intelligence',
          url: 'https://doi.org/10.1093/mind/LIX.236.433',
          type: 'paper',
          summary: 'Turing (1950), na Mind. Propõe o jogo da imitação.',
        },
      ],
    },
  },
  {
    id: 'specification-gaming',
    name: 'Jogo de Especificação (Reward Hacking)',
    domain: 'alignment',
    tier: 2,
    gridCoordinates: { col: 4, row: 0 },
    signatureColor: sig(42),
    prerequisites: ['deep-rl'],
    metadata: { status: 'research', dateIntroduced: '2016-06', companies: ['Google Brain', 'OpenAI'] },
    content: {
      overview:
        'O agente maximiza a recompensa escrita e não o objetivo que o projetista tinha em mente. Ele encontra atalhos que contam como sucesso sem cumprir a tarefa.',
      impact:
        'É um dos problemas centrais de alinhamento. Mostra que especificar bem o objetivo é tão difícil quanto otimizá-lo.',
      history: [
        { year: 2016, event: 'Amodei et al. listam problemas concretos de segurança em IA, incluindo recompensas erradas', importance: 5 },
      ],
      actors: [{ name: 'Dario Amodei', role: 'Primeiro autor', org: 'Google Brain (no artigo de 2016)' }],
      sources: [
        {
          title: 'Concrete Problems in AI Safety',
          url: 'https://arxiv.org/abs/1606.06565',
          type: 'paper',
          summary: 'Amodei et al. (2016). Recompensas erradas, exploração e robustez.',
        },
      ],
    },
  },
  {
    id: 'model-cards',
    name: 'Model Cards',
    domain: 'alignment',
    tier: 2,
    gridCoordinates: { col: 4, row: 1 },
    signatureColor: sig(43),
    prerequisites: [],
    metadata: { status: 'production', dateIntroduced: '2018-10', companies: ['Google'] },
    content: {
      overview:
        'Documento padronizado que descreve um modelo: uso pretendido, dados de treino, métricas por subgrupo e limitações conhecidas.',
      impact:
        'Virou prática de transparência adotada por muitos laboratórios. Facilita comparar modelos e decidir se um deles serve ao caso de uso.',
      history: [
        { year: 2019, event: 'Mitchell et al. publicam o formato de model cards para relatório de modelos', importance: 4 },
      ],
      actors: [{ name: 'Margaret Mitchell', role: 'Primeira autora', org: 'Google' }],
      sources: [
        {
          title: 'Model Cards for Model Reporting',
          url: 'https://arxiv.org/abs/1810.03993',
          type: 'paper',
          summary: 'Mitchell et al. (2019). Formato de relatório com desempenho desagregado.',
        },
      ],
    },
  },
  {
    id: 'rlhf',
    name: 'RLHF (Aprendizado por Preferência Humana)',
    domain: 'alignment',
    tier: 3,
    gridCoordinates: { col: 4, row: 0 },
    signatureColor: sig(44),
    prerequisites: ['deep-rl', 'specification-gaming'],
    metadata: { status: 'production', dateIntroduced: '2017-06', companies: ['OpenAI', 'Google DeepMind'] },
    content: {
      overview:
        'Treina um modelo de recompensa com comparações humanas entre respostas e usa esse modelo para ajustar a política por RL, com uma penalidade para não se afastar do modelo original.',
      impact:
        'É a técnica que transformou LMs de completadores de texto em assistentes úteis. Base do alinhamento dos LLMs atuais.',
      history: [
        { year: 2017, event: 'Christiano et al. treinam agentes de RL com preferências humanas', importance: 5 },
        { year: 2022, event: 'InstructGPT aplica RLHF a GPT-3 e os resultados são preferidos sobre o GPT-3 puro', importance: 5 },
      ],
      actors: [
        { name: 'Paul Christiano', role: 'Primeiro autor', org: 'OpenAI' },
        { name: 'Long Ouyang', role: 'Primeiro autor do InstructGPT', org: 'OpenAI' },
      ],
      equations: [
        { label: 'Modelo de preferência', expression: 'P(i ≻ j) = σ(r(i) − r(j))' },
        { label: 'Objetivo', expression: 'max E[r(x,y)] − β · KL(π ‖ π_ref)' },
      ],
      sources: [
        {
          title: 'Deep reinforcement learning from human preferences',
          url: 'https://arxiv.org/abs/1706.03741',
          type: 'paper',
          summary: 'Christiano et al. (2017). Modelo de recompensa aprendido com comparações humanas.',
        },
        {
          title: 'Training language models to follow instructions with human feedback',
          url: 'https://arxiv.org/abs/2203.02155',
          type: 'paper',
          summary: 'Ouyang et al. (2022). InstructGPT, com RLHF aplicado a LMs.',
        },
      ],
    },
  },
  {
    id: 'constitutional-ai',
    name: 'IA Constitucional',
    domain: 'alignment',
    tier: 3,
    gridCoordinates: { col: 4, row: 1 },
    signatureColor: sig(45),
    prerequisites: ['rlhf'],
    metadata: { status: 'production', dateIntroduced: '2022-12', companies: ['Anthropic'] },
    content: {
      overview:
        'O modelo critica e reescreve as próprias respostas segundo um conjunto de princípios escritos, e o próprio feedback de IA substitui parte dos rótulos humanos.',
      impact:
        'Reduz a dependência de anotação humana para segurança e deixa as regras do alinhamento explícitas e auditáveis.',
      history: [
        { year: 2022, event: 'Bai et al. (Anthropic) publicam a IA constitucional com feedback de IA', importance: 5 },
      ],
      actors: [{ name: 'Yuntao Bai', role: 'Primeiro autor', org: 'Anthropic' }],
      sources: [
        {
          title: 'Constitutional AI: Harmlessness from AI Feedback',
          url: 'https://arxiv.org/abs/2212.08073',
          type: 'paper',
          summary: 'Bai et al. (2022). Crítica e revisão guiadas por princípios escritos.',
        },
      ],
    },
  },
  {
    id: 'ai-debate',
    name: 'Debate entre IAs',
    domain: 'alignment',
    tier: 4,
    gridCoordinates: { col: 4, row: 0 },
    signatureColor: sig(46),
    prerequisites: ['rlhf'],
    metadata: { status: 'research', dateIntroduced: '2018-05', companies: ['OpenAI'] },
    content: {
      overview:
        'Duas IAs argumentam sobre uma resposta e um juiz humano escolhe o argumento mais convincente. A ideia é que o debate ajude o humano a supervisionar sistemas mais capazes que ele.',
      impact:
        'Propõe supervisão escalável: o humano não precisa conhecer a resposta, só julgar os argumentos.',
      history: [
        { year: 2018, event: 'Irving, Christiano e Amodei propõem o debate como técnica de segurança', importance: 4 },
      ],
      actors: [{ name: 'Geoffrey Irving', role: 'Primeiro autor', org: 'OpenAI' }],
      sources: [
        {
          title: 'AI safety via debate',
          url: 'https://arxiv.org/abs/1805.00899',
          type: 'paper',
          summary: 'Irving et al. (2018). Protocolo de debate para supervisão.',
        },
      ],
    },
  },
  {
    id: 'weak-to-strong',
    name: 'Generalização Fraco-para-Forte',
    domain: 'alignment',
    tier: 4,
    gridCoordinates: { col: 4, row: 1 },
    signatureColor: sig(47),
    prerequisites: ['rlhf'],
    metadata: { status: 'research', dateIntroduced: '2023-12', companies: ['OpenAI'] },
    content: {
      overview:
        'Um modelo fraco rotula dados e um modelo mais forte é treinado com esses rótulos. Testa se a capacidade do forte pode ser extraída sem supervisão de alta qualidade.',
      impact:
        'É um laboratório para supervisionar modelos que superam o supervisor humano, que é o problema que virá com a AGI.',
      history: [
        { year: 2023, event: 'Burns et al. (OpenAI) mostram recuperação parcial da capacidade do modelo forte', importance: 4 },
      ],
      actors: [{ name: 'Collin Burns', role: 'Primeiro autor', org: 'OpenAI' }],
      sources: [
        {
          title: 'Weak-to-Strong Generalization: Eliciting Strong Capabilities With Weak Supervision',
          url: 'https://arxiv.org/abs/2312.09390',
          type: 'paper',
          summary: 'Burns et al. (2023). Supervisão fraca para extrair capacidade forte.',
        },
      ],
    },
  },
  {
    id: 'interpretability',
    name: 'Interpretabilidade Mecanística',
    domain: 'alignment',
    tier: 4,
    gridCoordinates: { col: 4, row: 2 },
    signatureColor: sig(48),
    prerequisites: ['transformer'],
    metadata: { status: 'research', dateIntroduced: '2020-03', companies: ['OpenAI', 'Anthropic'] },
    content: {
      overview:
        'Procura circuitos e features que implementam comportamentos dentro da rede. Uma feature é uma direção do espaço de ativações associada a um conceito.',
      impact:
        'Permite auditar o que o modelo realmente faz por dentro, em vez de confiar só no comportamento externo.',
      history: [
        { year: 2020, event: 'Olah et al. publicam "Zoom In", a base de circuitos de redes neurais', importance: 4 },
        { year: 2024, event: 'Anthropic extrai milhões de features interpretáveis de um modelo Claude 3 Sonnet', importance: 5 },
      ],
      actors: [
        { name: 'Chris Olah', role: 'Autor', org: 'OpenAI (no artigo Zoom In, de 2020)' },
        { name: 'Anthropic Interpretability Team', role: 'Autores do Scaling Monosemanticity', org: 'Anthropic' },
      ],
      sources: [
        {
          title: 'Zoom In: An Introduction to Circuits',
          url: 'https://distill.pub/2020/circuits/zoom-in/',
          type: 'article',
          summary: 'Olah et al. (2020), no Distill. Define features e circuitos.',
        },
        {
          title: 'Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet',
          url: 'https://transformer-circuits.pub/2024/scaling-monosemanticity/',
          type: 'article',
          summary: 'Anthropic (2024). Sparse autoencoders com milhões de features em um modelo de produção.',
        },
      ],
    },
  },
  {
    id: 'superintelligence-governance',
    name: 'Governança da Superinteligência',
    domain: 'alignment',
    tier: 5,
    gridCoordinates: { col: 4, row: 0 },
    signatureColor: sig(49),
    prerequisites: ['recursive-self-improvement'],
    metadata: { status: 'theoretical', dateIntroduced: '2014', companies: [] },
    content: {
      overview:
        'Como coordenar, limitar e distribuir os benefícios de um sistema muito mais inteligente que os humanos. Envolve controle de acesso, supervisão internacional e incentivos.',
      impact:
        'Define o problema político da ASI. Sem governança, o ritmo técnico pode superar a capacidade de decisão coletiva.',
      history: [
        { year: 2014, event: 'Bostrom publica "Superintelligence: Paths, Dangers, Strategies"', importance: 5 },
      ],
      actors: [{ name: 'Nick Bostrom', role: 'Autor', org: 'Future of Humanity Institute' }],
      sources: [
        {
          title: 'Superintelligence: Paths, Dangers, Strategies',
          url: 'https://en.wikipedia.org/wiki/Superintelligence:_Paths,_Dangers,_Strategies',
          type: 'article',
          summary: 'Resumo do livro de Bostrom (2014), que organiza os riscos e estratégias da ASI.',
        },
      ],
    },
  },
  {
    id: 'ai-control',
    name: 'Controle de IA',
    domain: 'alignment',
    tier: 5,
    gridCoordinates: { col: 4, row: 1 },
    signatureColor: sig(50),
    prerequisites: ['constitutional-ai', 'ai-debate'],
    metadata: { status: 'research', dateIntroduced: '2023-12', companies: ['Redwood Research'] },
    content: {
      overview:
        'Assume que um modelo pode tentar sabotar a supervisão. Desenha protocolos, como monitoramento e revisão por modelos mais fracos, que mantêm a segurança mesmo nesse caso.',
      impact:
        'Trata o cenário adversário como premissa de projeto, e não como cenário improvável. Relevante para ASI e para sistemas agentes.',
      history: [
        { year: 2023, event: 'Greenblatt et al. publicam o controle de IA sob subversão intencional', importance: 4 },
      ],
      actors: [{ name: 'Ryan Greenblatt', role: 'Primeiro autor', org: 'Redwood Research' }],
      sources: [
        {
          title: 'AI Control: Improving Safety Despite Intentional Subversion',
          url: 'https://arxiv.org/abs/2312.06942',
          type: 'paper',
          summary: 'Greenblatt et al. (2023). Protocolos de segurança sob sabotagem intencional.',
        },
      ],
    },
  },
]
