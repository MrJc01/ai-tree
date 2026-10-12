import { sig } from '../../lib/color'
import type { SkillSeed } from '../../types/skill'

/** Robótica & Embodiment (coluna 3). */
export const ROBOTICS_SKILLS: SkillSeed[] = [
  {
    id: 'kalman',
    name: 'Filtro de Kalman',
    domain: 'robotics',
    tier: 1,
    gridCoordinates: { col: 3, row: 0 },
    signatureColor: sig(32),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1960', companies: [] },
    content: {
      overview:
        'Estima o estado de um sistema a partir de medições ruidosas, combinando um modelo de predição com a correção pelas medições.',
      impact:
        'Está em GPS, navegação inercial e controle de voo. É a base da estimação de estado em robótica.',
      history: [
        { year: 1960, event: 'Kalman publica o filtro linear recursivo de predição e correção', importance: 5 },
        { year: 1961, event: 'Kalman e Bucy estendem a teoria para o caso de tempo contínuo', importance: 3 },
      ],
      actors: [{ name: 'Rudolf E. Kalman', role: 'Autor', org: 'Research Institute for Advanced Studies' }],
      equations: [
        { label: 'Correção', expression: 'x̂ₖ = x̂ₖ⁻ + Kₖ (zₖ − H x̂ₖ⁻)' },
      ],
      sources: [
        {
          title: 'A New Approach to Linear Filtering and Prediction Problems',
          url: 'https://doi.org/10.1115/1.3662552',
          type: 'paper',
          summary: 'Kalman (1960), no Journal of Basic Engineering.',
        },
      ],
    },
  },
  {
    id: 'deep-rl',
    name: 'Aprendizado por Reforço Profundo',
    domain: 'robotics',
    tier: 2,
    gridCoordinates: { col: 3, row: 0 },
    signatureColor: sig(33),
    prerequisites: ['backprop'],
    metadata: { status: 'production', dateIntroduced: '2015-02', companies: ['Google DeepMind'] },
    content: {
      overview:
        'Redes profundas estimam valores ou políticas de ação. O agente aprende por tentativa e erro com recompensas do ambiente.',
      impact:
        'Jogou Atari no nível humano e abriu o caminho para controle de robôs e jogos complexos, como AlphaGo.',
      history: [
        { year: 2013, event: 'Mnih et al. (DeepMind) publicam o DQN para jogos de Atari a partir de pixels', importance: 5 },
        { year: 2015, event: 'DQN publicado na Nature com resultados em 49 jogos de Atari', importance: 5 },
        { year: 2016, event: 'AlphaGo vence Lee Sedol, combinando RL e busca em árvore', importance: 5 },
      ],
      actors: [{ name: 'Volodymyr Mnih', role: 'Primeiro autor', org: 'DeepMind' }],
      equations: [
        {
          label: 'Alvo do Q-learning profundo',
          expression: 'y = r + γ · maxₐ′ Q(s′, a′; θ⁻)',
        },
      ],
      mermaidDiagram:
        'flowchart LR\n  S["Estado s"] --> Q["Rede Q(s, a; θ)"]\n  Q --> A["Ação ε-greedy"]\n  A --> E["Ambiente"]\n  E --> R["Recompensa r, próximo estado"]\n  R --> B["Replay buffer"]\n  B --> U["Atualiza θ"]\n  U --> Q',
      sources: [
        {
          title: 'Playing Atari with Deep Reinforcement Learning',
          url: 'https://arxiv.org/abs/1312.5602',
          type: 'paper',
          summary: 'Mnih et al. (2013). Primeiro DQN a jogar Atari a partir de pixels.',
        },
        {
          title: 'Human-level control through deep reinforcement learning',
          url: 'https://doi.org/10.1038/nature14236',
          type: 'paper',
          summary: 'Mnih et al. (2015), na Nature. Versão com 49 jogos e rede alvo.',
        },
      ],
    },
  },
  {
    id: 'sim2real',
    name: 'Transferência Simulação → Real',
    domain: 'robotics',
    tier: 2,
    gridCoordinates: { col: 3, row: 1 },
    signatureColor: sig(34),
    prerequisites: ['deep-rl'],
    metadata: { status: 'research', dateIntroduced: '2017-03', companies: ['OpenAI'] },
    content: {
      overview:
        'Treina o controle em simulação com variações aleatórias de textura, luz e física, para que o modelo funcione no robô real sem re-treino.',
      impact:
        'Reduz o custo de coletar dados no mundo real, que é lento e caro. É uma das técnicas que mais avançaram a manipulação robótica.',
      history: [
        { year: 2017, event: 'Tobin et al. (OpenAI) publicam a randomização de domínio para transferência', importance: 5 },
      ],
      actors: [{ name: 'Josh Tobin', role: 'Primeiro autor', org: 'OpenAI' }],
      sources: [
        {
          title: 'Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World',
          url: 'https://arxiv.org/abs/1703.06907',
          type: 'paper',
          summary: 'Tobin et al. (2017). Randomização de aparência e física na simulação.',
        },
      ],
    },
  },
  {
    id: 'rt2',
    name: 'RT-2 (Modelo Visão-Linguagem-Ação)',
    domain: 'robotics',
    tier: 3,
    gridCoordinates: { col: 3, row: 0 },
    signatureColor: sig(35),
    prerequisites: ['vit', 'llm'],
    metadata: { status: 'research', dateIntroduced: '2023-07', companies: ['Google DeepMind'] },
    content: {
      overview:
        'Um VLM treinado na web também emite ações de robô como tokens de texto. O mesmo modelo responde perguntas e controla o braço.',
      impact:
        'Mostrou que o conhecimento da web transfere para a ação física. É um passo em direção a robôs de propósito geral.',
      history: [
        { year: 2023, event: 'Brohan et al. (Google DeepMind) publicam o RT-2', importance: 5 },
      ],
      actors: [{ name: 'Anthony Brohan', role: 'Primeiro autor', org: 'Google DeepMind' }],
      sources: [
        {
          title: 'RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control',
          url: 'https://arxiv.org/abs/2307.15818',
          type: 'paper',
          summary: 'Brohan et al. (2023). Ações do robô representadas como tokens de linguagem.',
        },
      ],
    },
  },
  {
    id: 'saycan',
    name: 'SayCan (Linguagem com Affordances)',
    domain: 'robotics',
    tier: 3,
    gridCoordinates: { col: 3, row: 1 },
    signatureColor: sig(36),
    prerequisites: ['llm', 'deep-rl'],
    metadata: { status: 'research', dateIntroduced: '2022-04', companies: ['Google'] },
    content: {
      overview:
        'O LLM propõe passos em linguagem natural e uma função de valor, aprendida por RL, mede se cada passo é possível no estado atual do robô.',
      impact:
        'Conectou a linguagem à capacidade real do robô. Evitou que o planejador escolhesse ações impossíveis.',
      history: [
        { year: 2022, event: 'Ahn et al. (Google) mostram o SayCan em tarefas de cozinha com um robô real', importance: 4 },
      ],
      actors: [{ name: 'Michael Ahn', role: 'Primeiro autor', org: 'Google' }],
      sources: [
        {
          title: 'Do As I Can, Not As I Say: Grounding Language in Robotic Affordances',
          url: 'https://arxiv.org/abs/2204.01691',
          type: 'paper',
          summary: 'Ahn et al. (2022). Combina pontuação de linguagem e de viabilidade.',
        },
      ],
    },
  },
  {
    id: 'diffusion-policy',
    name: 'Política por Difusão',
    domain: 'robotics',
    tier: 3,
    gridCoordinates: { col: 3, row: 2 },
    signatureColor: sig(37),
    prerequisites: ['diffusion-models', 'sim2real'],
    metadata: { status: 'research', dateIntroduced: '2023-03', companies: ['Columbia University', 'Toyota Research Institute'] },
    content: {
      overview:
        'Usa um modelo de difusão para gerar sequências de ações do robô. Lida bem com distribuições de comportamento com vários modos, como duas formas válidas de pegar um objeto.',
      impact:
        'Melhorou muito a imitação de demonstrações humanas em manipulação. Virou referência para políticas de visuomotor.',
      history: [
        { year: 2023, event: 'Chi et al. publicam a política por difusão para visuomotor', importance: 5 },
      ],
      actors: [{ name: 'Cheng Chi', role: 'Primeiro autor', org: 'Columbia University' }],
      sources: [
        {
          title: 'Diffusion Policy: Visuomotor Policy Learning via Action Diffusion',
          url: 'https://arxiv.org/abs/2303.04137',
          type: 'paper',
          summary: 'Chi et al. (2023). Geração de trajetórias de ação por difusão.',
        },
      ],
    },
  },
  {
    id: 'palm-e',
    name: 'PaLM-E (Modelo Incorporado)',
    domain: 'robotics',
    tier: 4,
    gridCoordinates: { col: 3, row: 0 },
    signatureColor: sig(38),
    prerequisites: ['rt2', 'multimodal-fm'],
    metadata: { status: 'research', dateIntroduced: '2023-03', companies: ['Google'] },
    content: {
      overview:
        'Um modelo de linguagem com entradas de sensores contínuos, como imagens e estado do robô, integrados ao texto. Planeja e age em ambientes físicos.',
      impact:
        'Mostrou transferência entre tarefas de robótica e raciocínio geral, um passo em direção a agentes incorporados de uso geral.',
      history: [
        { year: 2023, event: 'Driess et al. (Google) publicam o PaLM-E, com 562B parâmetros', importance: 4 },
      ],
      actors: [{ name: 'Danny Driess', role: 'Primeiro autor', org: 'Google' }],
      sources: [
        {
          title: 'PaLM-E: An Embodied Multimodal Language Model',
          url: 'https://arxiv.org/abs/2303.03378',
          type: 'paper',
          summary: 'Driess et al. (2023). Entradas multimodais de sensores em um LLM.',
        },
      ],
    },
  },
  {
    id: 'gato',
    name: 'Gato (Agente Generalista)',
    domain: 'robotics',
    tier: 4,
    gridCoordinates: { col: 3, row: 1 },
    signatureColor: sig(39),
    prerequisites: ['transformer', 'deep-rl'],
    metadata: { status: 'research', dateIntroduced: '2022-05', companies: ['Google DeepMind'] },
    content: {
      overview:
        'Um único transformer que joga Atari, conversa, legenda imagens e controla braços, com a mesma rede e os mesmos pesos.',
      impact:
        'Testou o limite de um agente único para muitas tarefas. Influenciou o debate sobre o caminho para AGI.',
      history: [
        { year: 2022, event: 'Reed et al. (DeepMind) apresentam o Gato, um agente generalista', importance: 5 },
      ],
      actors: [{ name: 'Scott Reed', role: 'Primeiro autor', org: 'DeepMind' }],
      sources: [
        {
          title: 'A Generalist Agent',
          url: 'https://arxiv.org/abs/2205.06175',
          type: 'paper',
          summary: 'Reed et al. (2022). Um transformer para várias tarefas e modalidades.',
        },
      ],
    },
  },
  {
    id: 'self-replicating-machines',
    name: 'Máquinas Auto-Replicantes',
    domain: 'robotics',
    tier: 5,
    gridCoordinates: { col: 3, row: 0 },
    signatureColor: sig(40),
    prerequisites: [],
    metadata: { status: 'theoretical', dateIntroduced: '1966', companies: [] },
    content: {
      overview:
        'Máquinas que constroem cópias de si mesmas a partir de matéria-prima. Von Neumann mostrou que a auto-replicação é logicamente possível.',
      impact:
        'Conecta robótica e ASI: um sistema que se replica no mundo físico teria crescimento de capacidade limitado só pela matéria e pela energia.',
      history: [
        { year: 1966, event: 'Von Neumann propõe o construtor universal, publicado postumamente como livro', importance: 5 },
      ],
      actors: [{ name: 'John von Neumann', role: 'Autor', org: 'IAS Princeton' }],
      sources: [
        {
          title: 'Von Neumann universal constructor',
          url: 'https://en.wikipedia.org/wiki/Von_Neumann_universal_constructor',
          type: 'article',
          summary: 'Resumo da teoria de auto-replicação de von Neumann e do livro publicado em 1966.',
        },
      ],
    },
  },
]
