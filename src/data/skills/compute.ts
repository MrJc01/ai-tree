import { sig } from '../../lib/color'
import type { SkillSeed } from '../../types/skill'

/** Compute & Hardware (coluna 1). */
export const COMPUTE_SKILLS: SkillSeed[] = [
  {
    id: 'sgd',
    name: 'Gradiente Descendente Estocástico',
    domain: 'compute',
    tier: 1,
    gridCoordinates: { col: 1, row: 0 },
    signatureColor: sig(11),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1951', companies: [] },
    content: {
      overview:
        'Atualiza os parâmetros usando o gradiente de um subconjunto dos dados a cada passo, em vez do conjunto inteiro. Reduz o custo por iteração.',
      impact:
        'Tornou viável otimizar modelos com muitos dados. Quase todo treino de rede neural ainda é uma variante dele.',
      history: [
        { year: 1951, event: 'Robbins e Monro publicam o método de aproximação estocástica', importance: 5 },
      ],
      actors: [
        { name: 'Herbert Robbins', role: 'Autor', org: 'Columbia University' },
        { name: 'Sutton Monro', role: 'Autor', org: 'Columbia University' },
      ],
      equations: [{ label: 'Passo', expression: 'θₜ₊₁ = θₜ − ηₜ ∇L(θₜ)' }],
      sources: [
        {
          title: 'A Stochastic Approximation Method',
          url: 'https://doi.org/10.1214/aoms/1177729586',
          type: 'paper',
          summary: 'Robbins e Monro (1951), base teórica da atualização estocástica.',
        },
      ],
    },
  },
  {
    id: 'backprop',
    name: 'Retropropagação (Backpropagation)',
    domain: 'compute',
    tier: 1,
    gridCoordinates: { col: 1, row: 1 },
    signatureColor: sig(12),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1986-10', companies: [] },
    content: {
      overview:
        'Calcula o gradiente da perda em relação a cada peso aplicando a regra da cadeia de trás para frente pela rede.',
      impact:
        'Permitiu treinar redes com camadas ocultas. Sem ele, o deep learning moderno não existiria.',
      history: [
        { year: 1970, event: 'Linnainmaa descreve, na tese de mestrado, a diferenciação automática em modo reverso (base do método). A prioridade sobre a retropropagação é debatida', importance: 3 },
        { year: 1986, event: 'Rumelhart, Hinton e Williams popularizam a retropropagação na Nature', importance: 5 },
      ],
      actors: [
        { name: 'David Rumelhart', role: 'Autor', org: 'UC San Diego' },
        { name: 'Geoffrey Hinton', role: 'Autor', org: 'Carnegie Mellon University' },
      ],
      equations: [{ label: 'Gradiente na camada', expression: '∂L/∂W = δ · aᵀ, com δ = (∂L/∂z) ⊙ σ′(z)' }],
      mermaidDiagram:
        'flowchart LR\n  X["Entrada"] --> F["Passagem direta"]\n  F --> L["Perda L"]\n  L --> B["Passagem reversa: gradientes"]\n  B --> U["Atualização dos pesos"]',
      sources: [
        {
          title: 'Learning representations by back-propagating errors',
          url: 'https://doi.org/10.1038/323533a0',
          type: 'paper',
          summary: 'Rumelhart, Hinton e Williams (1986), na Nature. Formaliza o uso da retropropagação.',
        },
      ],
    },
  },
  {
    id: 'gpu',
    name: 'GPUs para Treino Neural',
    domain: 'compute',
    tier: 2,
    gridCoordinates: { col: 1, row: 0 },
    signatureColor: sig(13),
    prerequisites: ['backprop'],
    metadata: { status: 'production', dateIntroduced: '2007-02', companies: ['NVIDIA'] },
    content: {
      overview:
        'Processadores com milhares de núcleos para operações de matriz em paralelo. Multiplicar matrizes grandes em GPU é muito mais rápido que em CPU.',
      impact:
        'Foi o que tornou o treino de redes profundas prático. O AlexNet foi treinado em duas GPUs GTX 580.',
      history: [
        { year: 2007, event: 'NVIDIA lança o CUDA, que expõe a GPU para computação geral', importance: 5 },
        { year: 2012, event: 'AlexNet treina em duas GPUs e vence o ILSVRC', importance: 5 },
      ],
      actors: [
        { name: 'Ian Buck', role: 'Autor principal do CUDA, com John Nickolls', org: 'NVIDIA' },
        { name: 'John Nickolls', role: 'Coautor do CUDA', org: 'NVIDIA' },
      ],
      sources: [
        {
          title: 'ImageNet classification with deep convolutional neural networks',
          url: 'https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks',
          type: 'paper',
          summary: 'O AlexNet descreve o treino em duas GPUs, o que é a referência histórica deste nó.',
        },
      ],
    },
  },
  {
    id: 'adam',
    name: 'Otimizador Adam',
    domain: 'compute',
    tier: 2,
    gridCoordinates: { col: 1, row: 1 },
    signatureColor: sig(14),
    prerequisites: ['sgd'],
    metadata: { status: 'production', dateIntroduced: '2014-12', companies: ['University of Amsterdam', 'University of Toronto'] },
    content: {
      overview:
        'Combina médias móveis do gradiente e do seu quadrado para ajustar a taxa de aprendizado de cada parâmetro.',
      impact:
        'É o otimizador padrão em boa parte dos modelos de linguagem e de visão. Funciona bem com pouca calibração.',
      history: [
        { year: 2014, event: 'Kingma e Ba publicam o Adam no arXiv', importance: 5 },
        { year: 2019, event: 'AdamW separa o decaimento de peso e vira padrão em transformers', importance: 3 },
      ],
      actors: [
        { name: 'Diederik Kingma', role: 'Primeiro autor', org: 'University of Amsterdam' },
        { name: 'Jimmy Ba', role: 'Autor', org: 'University of Toronto' },
      ],
      equations: [
        { label: 'Atualização', expression: 'θ ← θ − α · m̂ₜ / (√v̂ₜ + ε)' },
      ],
      sources: [
        {
          title: 'Adam: A Method for Stochastic Optimization',
          url: 'https://arxiv.org/abs/1412.6980',
          type: 'paper',
          summary: 'Kingma e Ba (2014). Propõe o Adam com estimativas adaptativas de momento.',
        },
      ],
    },
  },
  {
    id: 'mixed-precision',
    name: 'Treino em Precisão Mista',
    domain: 'compute',
    tier: 2,
    gridCoordinates: { col: 1, row: 2 },
    signatureColor: sig(15),
    prerequisites: ['gpu'],
    metadata: { status: 'production', dateIntroduced: '2017-10', companies: ['NVIDIA'] },
    content: {
      overview:
        'Faz a maior parte das contas em meia precisão (FP16) e mantém uma cópia em precisão cheia dos pesos para estabilidade.',
      impact:
        'Quase dobra a velocidade e reduz a memória sem perda de qualidade. Sem isso, modelos grandes não cabem na memória.',
      history: [
        { year: 2017, event: 'Micikevicius et al. (NVIDIA) publicam o treino em precisão mista', importance: 5 },
      ],
      actors: [{ name: 'Paulius Micikevicius', role: 'Primeiro autor', org: 'NVIDIA' }],
      sources: [
        {
          title: 'Mixed Precision Training',
          url: 'https://arxiv.org/abs/1710.03740',
          type: 'paper',
          summary: 'Micikevicius et al. (2017). Escala de perda e cópias FP32 dos pesos.',
        },
      ],
    },
  },
  {
    id: 'tpu',
    name: 'TPU (Unidade de Processamento Tensorial)',
    domain: 'compute',
    tier: 3,
    gridCoordinates: { col: 1, row: 0 },
    signatureColor: sig(16),
    prerequisites: ['gpu'],
    metadata: { status: 'production', dateIntroduced: '2017-04', companies: ['Google'] },
    content: {
      overview:
        'Acelerador próprio do Google com unidades de multiplicação de matrizes em sístole. Otimizado para inferência e treino de redes densas.',
      impact:
        'Mostrou que um chip de domínio específico pode ser muito mais eficiente por watt do que uma GPU de uso geral.',
      history: [
        { year: 2015, event: 'Google começa a usar TPUs internamente em produção', importance: 3 },
        { year: 2017, event: 'Jouppi et al. publicam a análise de desempenho do TPU v1 no datacenter', importance: 5 },
      ],
      actors: [{ name: 'Norman Jouppi', role: 'Primeiro autor', org: 'Google' }],
      sources: [
        {
          title: 'In-Datacenter Performance Analysis of a Tensor Processing Unit',
          url: 'https://arxiv.org/abs/1704.04760',
          type: 'paper',
          summary: 'Jouppi et al. (2017), análise do TPU v1 em produção.',
        },
      ],
    },
  },
  {
    id: 'scaling-laws',
    name: 'Leis de Escala',
    domain: 'compute',
    tier: 3,
    gridCoordinates: { col: 1, row: 1 },
    signatureColor: sig(17),
    prerequisites: ['gpu', 'adam'],
    metadata: { status: 'production', dateIntroduced: '2020-01', companies: ['OpenAI'] },
    content: {
      overview:
        'A perda de linguagem cai como uma lei de potência previsível quando se aumenta parâmetros, dados e compute, em escalas de muitas ordens de grandeza.',
      impact:
        'Deu base quantitativa para investir em modelos maiores. Passou a guiar o planejamento de treinos de fronteira.',
      history: [
        { year: 2020, event: 'Kaplan et al. (OpenAI) publicam as leis de escala para modelos de linguagem', importance: 5 },
        { year: 2022, event: 'Chinchilla revisa a proporção ótima entre parâmetros e dados', importance: 4 },
      ],
      actors: [{ name: 'Jared Kaplan', role: 'Primeiro autor', org: 'OpenAI / Johns Hopkins' }],
      equations: [{ label: 'Perda em função de N', expression: 'L(N) ≈ (N_c / N)^α_N' }],
      sources: [
        {
          title: 'Scaling Laws for Neural Language Models',
          url: 'https://arxiv.org/abs/2001.08361',
          type: 'paper',
          summary: 'Kaplan et al. (2020). Lei de potência entre perda, parâmetros, dados e compute.',
        },
      ],
    },
  },
  {
    id: 'chinchilla',
    name: 'Treino Ótimo em Compute (Chinchilla)',
    domain: 'compute',
    tier: 4,
    gridCoordinates: { col: 1, row: 0 },
    signatureColor: sig(18),
    prerequisites: ['scaling-laws'],
    metadata: { status: 'production', dateIntroduced: '2022-03', companies: ['Google DeepMind'], modelsAssociated: ['Chinchilla'] },
    content: {
      overview:
        'Para um orçamento fixo de compute, o ótimo é escalar parâmetros e tokens de treino na mesma proporção, em vez de priorizar um modelo gigante com pouco dado.',
      impact:
        'Mudou a forma como se planeja o treino de LLMs: modelos menores treinados com mais dados superam os maiores sub-treinados.',
      history: [
        { year: 2022, event: 'Hoffmann et al. (DeepMind) publicam o Chinchilla, com 70B parâmetros e 4× mais dados', importance: 5 },
      ],
      actors: [{ name: 'Jordan Hoffmann', role: 'Primeiro autor', org: 'DeepMind' }],
      equations: [
        { label: 'Proporção ótima', expression: 'N_ótimo ∝ C^a   e   D_ótimo ∝ C^b   com a ≈ b ≈ 0,5' },
      ],
      benchmarks: {
        'MMLU (média) · Chinchilla 70B': '67,5%',
      },
      sources: [
        {
          title: 'Training Compute-Optimal Large Language Models',
          url: 'https://arxiv.org/abs/2203.15556',
          type: 'paper',
          summary: 'Hoffmann et al. (2022). Propõe a regra de escala ótima de parâmetros por tokens.',
        },
      ],
    },
  },
  {
    id: 'frontier-training',
    name: 'Treino de Fronteira em Cluster',
    domain: 'compute',
    tier: 4,
    gridCoordinates: { col: 1, row: 1 },
    signatureColor: sig(19),
    prerequisites: ['tpu', 'mixed-precision'],
    metadata: { status: 'production', dateIntroduced: '2024-07', companies: ['Meta', 'Google DeepMind'] },
    content: {
      overview:
        'Treinos com dezenas de milhares de aceleradores, coordenados por paralelismo de dados, de tensores e de pipeline, com recuperação de falhas.',
      impact:
        'É onde se decide o que é possível treinar hoje. A escala de cluster virou um fator tão importante quanto o algoritmo.',
      history: [
        { year: 2023, event: 'Gemini é treinado em TPUs de múltiplas gerações, com relatório técnico público', importance: 4 },
        { year: 2024, event: 'Meta descreve o treino do Llama 3 em clusters de dezenas de milhares de GPUs', importance: 5 },
      ],
      actors: [
        { name: 'Meta AI', role: 'Relatório técnico do Llama 3', org: 'Meta' },
        { name: 'Gemini Team', role: 'Relatório técnico do Gemini', org: 'Google DeepMind' },
      ],
      sources: [
        {
          title: 'The Llama 3 Herd of Models',
          url: 'https://arxiv.org/abs/2407.21783',
          type: 'paper',
          summary: 'Relatório técnico do Llama 3 (2024), com detalhes do treino em escala.',
        },
        {
          title: 'Gemini: A Family of Highly Capable Multimodal Models',
          url: 'https://arxiv.org/abs/2312.11805',
          type: 'paper',
          summary: 'Relatório do Gemini (2023), com o treino em TPUs.',
        },
      ],
    },
  },
  {
    id: 'zero-distributed',
    name: 'Treino Distribuído (ZeRO)',
    domain: 'compute',
    tier: 4,
    gridCoordinates: { col: 1, row: 2 },
    signatureColor: sig(20),
    prerequisites: ['mixed-precision'],
    metadata: { status: 'production', dateIntroduced: '2019-10', companies: ['Microsoft'] },
    content: {
      overview:
        'Particiona estados do otimizador, gradientes e parâmetros entre os dispositivos, em vez de replicá-los em cada um.',
      impact:
        'Permite treinar modelos que não cabem na memória de uma única GPU, sem reescrever o modelo.',
      history: [
        { year: 2019, event: 'Rajbhandari et al. (Microsoft) publicam o ZeRO', importance: 5 },
        { year: 2020, event: 'DeepSpeed incorpora o ZeRO e o disponibiliza como biblioteca', importance: 3 },
      ],
      actors: [{ name: 'Samyam Rajbhandari', role: 'Primeiro autor', org: 'Microsoft' }],
      equations: [{ label: 'Memória por parâmetro (Adam, precisão mista)', expression: '≈ 16 bytes × Ψ (parâmetros)' }],
      sources: [
        {
          title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
          url: 'https://arxiv.org/abs/1910.02054',
          type: 'paper',
          summary: 'Rajbhandari et al. (2019). Particionamento de estados para reduzir a memória por dispositivo.',
        },
      ],
    },
  },
  {
    id: 'physical-limits',
    name: 'Limites Físicos da Computação',
    domain: 'compute',
    tier: 5,
    gridCoordinates: { col: 1, row: 0 },
    signatureColor: sig(21),
    prerequisites: ['frontier-training'],
    metadata: { status: 'theoretical', dateIntroduced: '2000-08', companies: [] },
    content: {
      overview:
        'Cada operação irreversível dissipa energia mínima. Calcular a partir de um certo ponto exigiria mais energia do que a disponível.',
      impact:
        'Define o teto teórico de quanto computo uma superinteligência física poderia usar. Balizador de qualquer cenário de ASI.',
      history: [
        { year: 1961, event: 'Landauer mostra que apagar um bit dissipa pelo menos kT ln 2 de energia', importance: 5 },
        { year: 2000, event: 'Lloyd calcula os limites finais de computação na Nature', importance: 4 },
      ],
      actors: [
        { name: 'Rolf Landauer', role: 'Autor do princípio', org: 'IBM Research' },
        { name: 'Seth Lloyd', role: 'Autor dos limites finais', org: 'MIT' },
      ],
      equations: [{ label: 'Limite de Landauer', expression: 'E_mín = k_B · T · ln 2' }],
      sources: [
        {
          title: 'Ultimate physical limits to computation',
          url: 'https://doi.org/10.1038/35023282',
          type: 'paper',
          summary: 'Lloyd (2000), na Nature. Limites de energia e de operações para um computador.',
        },
        {
          title: 'Irreversibility and heat generation in the computing process',
          url: 'https://doi.org/10.1147/rd.53.0183',
          type: 'paper',
          summary: 'Landauer (1961), no IBM Journal of Research and Development.',
        },
      ],
    },
  },
]
