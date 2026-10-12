import { sig } from '../../lib/color'
import type { SkillSeed } from '../../types/skill'

/** Raciocínio & LLMs (coluna 2). Inclui a réplica de Attention Mechanism, que é a mesma entidade da coluna 0. */
export const REASONING_SKILLS: SkillSeed[] = [
  {
    id: 'symbolic-ai',
    name: 'IA Simbólica',
    domain: 'reasoning',
    tier: 1,
    gridCoordinates: { col: 2, row: 0 },
    signatureColor: sig(22),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '1956', companies: ['Carnegie Mellon', 'MIT'] },
    content: {
      overview:
        'Representa conhecimento com símbolos e regras lógicas e raciocina por busca e dedução. Foi a abordagem dominante antes do aprendizado estatístico.',
      impact:
        'Deu origem ao campo e segue útil em verificação formal, planejamento e sistemas com regras explícitas.',
      history: [
        { year: 1956, event: 'Workshop de Dartmouth reúne os fundadores do campo "inteligência artificial"', importance: 5 },
        { year: 1956, event: 'Newell e Simon demonstram o Logic Theorist, que prova teoremas', importance: 4 },
      ],
      actors: [
        { name: 'John McCarthy', role: 'Organizador de Dartmouth', org: 'Dartmouth College' },
        { name: 'Allen Newell e Herbert Simon', role: 'Logic Theorist', org: 'Carnegie Mellon' },
      ],
      sources: [
        {
          title: 'Dartmouth workshop',
          url: 'https://en.wikipedia.org/wiki/Dartmouth_workshop',
          type: 'article',
          summary: 'Resumo do workshop de 1956, que dá nome ao início formal do campo.',
        },
      ],
    },
  },
  {
    id: 'word-embeddings',
    name: 'Word Embeddings',
    domain: 'reasoning',
    tier: 1,
    gridCoordinates: { col: 2, row: 1 },
    signatureColor: sig(23),
    prerequisites: [],
    metadata: { status: 'commodity', dateIntroduced: '2013-01', companies: ['Google'] },
    content: {
      overview:
        'Representa cada palavra como um vetor denso, aprendido a partir do contexto em que ela aparece. Palavras de sentido parecido ficam próximas.',
      impact:
        'Trocou as representações esparsas por vetores densos. É a camada de entrada de quase todos os modelos de linguagem antes dos transformers.',
      history: [
        { year: 2013, event: 'Mikolov et al. publicam o word2vec com skip-gram e CBOW', importance: 5 },
      ],
      actors: [{ name: 'Tomas Mikolov', role: 'Primeiro autor', org: 'Google' }],
      equations: [
        { label: 'Skip-gram', expression: 'maximizar Σₜ Σ_{−c≤j≤c, j≠0} log p(w_{t+j} | w_t)' },
      ],
      sources: [
        {
          title: 'Efficient Estimation of Word Representations in Vector Space',
          url: 'https://arxiv.org/abs/1301.3781',
          type: 'paper',
          summary: 'Mikolov et al. (2013). Modelos skip-gram e CBOW para vetores de palavras.',
        },
      ],
    },
  },
  {
    id: 'lstm',
    name: 'LSTM',
    domain: 'reasoning',
    tier: 2,
    gridCoordinates: { col: 2, row: 0 },
    signatureColor: sig(24),
    prerequisites: ['word-embeddings'],
    metadata: { status: 'production', dateIntroduced: '1997-11', companies: ['IDSIA'] },
    content: {
      overview:
        'Rede recorrente com portas de esquecimento, entrada e saída, que controlam um estado de célula. Mantém dependências longas sem o desaparecimento do gradiente.',
      impact:
        'Por duas décadas foi o padrão em tradução, fala e geração de texto. Só foi superada em larga escala pelos transformers.',
      history: [
        { year: 1997, event: 'Hochreiter e Schmidhuber publicam o LSTM na Neural Computation', importance: 5 },
        { year: 2014, event: 'LSTMs bidirecionais e codificadores-decodificadores dominam a tradução neural', importance: 4 },
      ],
      actors: [
        { name: 'Sepp Hochreiter', role: 'Primeiro autor', org: 'TU Munich' },
        { name: 'Jürgen Schmidhuber', role: 'Autor', org: 'IDSIA' },
      ],
      equations: [
        { label: 'Atualização da célula', expression: 'cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ gₜ' },
      ],
      sources: [
        {
          title: 'Long Short-Term Memory',
          url: 'https://doi.org/10.1162/neco.1997.9.8.1735',
          type: 'paper',
          summary: 'Hochreiter e Schmidhuber (1997), na Neural Computation.',
        },
      ],
    },
  },
  {
    id: 'seq2seq',
    name: 'Sequência para Sequência',
    domain: 'reasoning',
    tier: 2,
    gridCoordinates: { col: 2, row: 1 },
    signatureColor: sig(25),
    prerequisites: ['word-embeddings', 'lstm'],
    metadata: { status: 'production', dateIntroduced: '2014-09', companies: ['Google'] },
    content: {
      overview:
        'Um encoder lê a sequência de entrada e um decoder gera a sequência de saída a partir de um vetor de contexto.',
      impact:
        'Formalizou a tradução neural de ponta a ponta. A limitação do vetor fixo motivou a atenção.',
      history: [
        { year: 2014, event: 'Sutskever, Vinyals e Le publicam a tradução neural sequência a sequência', importance: 5 },
      ],
      actors: [{ name: 'Ilya Sutskever', role: 'Primeiro autor', org: 'Google' }],
      equations: [
        { label: 'Probabilidade da saída', expression: 'p(y₁…y_T′ | x₁…x_T) = Π_t p(y_t | v, y₁…y_{t−1})' },
      ],
      sources: [
        {
          title: 'Sequence to Sequence Learning with Neural Networks',
          url: 'https://arxiv.org/abs/1409.3215',
          type: 'paper',
          summary: 'Sutskever et al. (2014). Encoder LSTM e decoder LSTM para tradução.',
        },
      ],
    },
  },
  {
    id: 'attention-replica',
    name: 'Attention Mechanism',
    domain: 'reasoning',
    tier: 2,
    gridCoordinates: { col: 2, row: 2 },
    signatureColor: sig(3),
    isDuplicateInstance: true,
    rootEntityId: 'attention',
    prerequisites: [],
    metadata: { status: 'production', dateIntroduced: '2014-09', companies: ['Mila', 'Google'] },
    content: {
      overview:
        'Mesma entidade da coluna de Arquiteturas. Aqui aparece como ferramenta de raciocínio sobre texto: pesos de alinhamento entre tokens.',
      impact: 'Réplica: os detalhes, fontes e história estão na instância original, em Arquiteturas & Redes.',
      history: [],
      actors: [],
      sources: [],
    },
  },
  {
    id: 'llm',
    name: 'Modelos de Linguagem em Larga Escala (LLM)',
    domain: 'reasoning',
    tier: 3,
    gridCoordinates: { col: 2, row: 0 },
    signatureColor: sig(26),
    prerequisites: ['transformer', 'seq2seq'],
    metadata: {
      status: 'production',
      dateIntroduced: '2018-06',
      companies: ['OpenAI', 'Google'],
      modelsAssociated: ['GPT-4', 'GPT-4o', 'Llama 3', 'Mistral 7B'],
    },
    content: {
      overview:
        'Transformers treinados para prever o próximo token em corpora enormes. Depois ajustados para seguir instruções e conversar.',
      impact:
        'Concentram conhecimento, escrita e raciocínio em um modelo só. São o núcleo dos assistentes e agentes atuais.',
      history: [
        { year: 2018, event: 'OpenAI publica o GPT-1: pré-treino generativo seguido de ajuste fino', importance: 5 },
        { year: 2018, event: 'Google publica o BERT, com pré-treino bidirecional de máscara', importance: 5 },
        { year: 2020, event: 'GPT-3, com 175B parâmetros, mostra aprendizado em contexto (few-shot)', importance: 5 },
      ],
      actors: [
        { name: 'Alec Radford', role: 'Autor do GPT-1', org: 'OpenAI' },
        { name: 'Jacob Devlin', role: 'Primeiro autor do BERT', org: 'Google' },
        { name: 'Tom Brown', role: 'Primeiro autor do GPT-3', org: 'OpenAI' },
      ],
      equations: [
        { label: 'Objetivo de modelagem de linguagem', expression: 'L = − Σₜ log p_θ(xₜ | x₍<t₎)' },
      ],
      benchmarks: {
        'MMLU · GPT-3 175B (few-shot)': '43,9%',
        'MMLU · GPT-3 175B (zero-shot)': '37,7%',
      },
      mermaidDiagram:
        'flowchart LR\n  P["Pré-treino: próximo token"] --> S["Ajuste por instruções"]\n  S --> R["Alinhamento por preferência"]\n  R --> I["Inferência: token a token"]',
      sources: [
        {
          title: 'Improving Language Understanding by Generative Pre-Training',
          url: 'https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf',
          type: 'paper',
          summary: 'Radford et al. (2018), o GPT-1 e o pré-treino generativo seguido de ajuste fino.',
        },
        {
          title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
          url: 'https://arxiv.org/abs/1810.04805',
          type: 'paper',
          summary: 'Devlin et al. (2018). Pré-treino bidirecional com máscara.',
        },
        {
          title: 'Language Models are Few-Shot Learners',
          url: 'https://arxiv.org/abs/2005.14165',
          type: 'paper',
          summary: 'Brown et al. (2020), o GPT-3 e a avaliação few-shot.',
        },
      ],
    },
  },
  {
    id: 'chain-of-thought',
    name: 'Cadeia de Pensamento (Chain-of-Thought)',
    domain: 'reasoning',
    tier: 3,
    gridCoordinates: { col: 2, row: 1 },
    signatureColor: sig(27),
    prerequisites: ['llm'],
    metadata: { status: 'production', dateIntroduced: '2022-01', companies: ['Google'] },
    content: {
      overview:
        'Pedir ao modelo que escreva os passos intermediários do raciocínio antes da resposta. Melhora a acurácia em problemas de múltiplas etapas.',
      impact:
        'Mostrou que a forma de pedir importa tanto quanto o tamanho do modelo. Virou técnica padrão e base do raciocínio estendido.',
      history: [
        { year: 2022, event: 'Wei et al. (Google) mostram ganhos de cadeia de pensamento em aritmética e raciocínio', importance: 5 },
      ],
      actors: [{ name: 'Jason Wei', role: 'Primeiro autor', org: 'Google Research' }],
      sources: [
        {
          title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
          url: 'https://arxiv.org/abs/2201.11903',
          type: 'paper',
          summary: 'Wei et al. (2022). Exemplos com passos de raciocínio no prompt.',
        },
      ],
    },
  },
  {
    id: 'react',
    name: 'ReAct (Raciocínio + Ação)',
    domain: 'reasoning',
    tier: 3,
    gridCoordinates: { col: 2, row: 2 },
    signatureColor: sig(28),
    prerequisites: ['llm', 'chain-of-thought'],
    metadata: { status: 'research', dateIntroduced: '2022-10', companies: ['Princeton', 'Google'] },
    content: {
      overview:
        'Intercala pensamento e ação: o modelo raciocina, chama uma ferramenta, lê a observação e continua. Cada passo é um texto que pode ser auditado.',
      impact:
        'É o padrão de loop dos agentes que usam ferramentas, como busca, código e navegação.',
      history: [
        { year: 2022, event: 'Yao et al. propõem o ReAct, com ações em ambientes como Wikipedia e compras', importance: 5 },
      ],
      actors: [{ name: 'Shunyu Yao', role: 'Primeiro autor', org: 'Princeton' }],
      sources: [
        {
          title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
          url: 'https://arxiv.org/abs/2210.03629',
          type: 'paper',
          summary: 'Yao et al. (2022). Pensamento e ação intercalados em um único prompt.',
        },
      ],
    },
  },
  {
    id: 'reasoning-rl',
    name: 'Raciocínio por Reforço (DeepSeek-R1)',
    domain: 'reasoning',
    tier: 4,
    gridCoordinates: { col: 2, row: 0 },
    signatureColor: sig(29),
    prerequisites: ['chain-of-thought', 'llm'],
    metadata: {
      status: 'research',
      dateIntroduced: '2025-01',
      companies: ['DeepSeek'],
      modelsAssociated: ['DeepSeek-R1'],
    },
    content: {
      overview:
        'Treina o raciocínio longo com aprendizado por reforço usando recompensas verificáveis, como acerto em matemática e código, sem depender só de exemplos humanos.',
      impact:
        'Mostrou que o raciocínio pode emergir do RL em um modelo de pesos abertos. Mudou o debate sobre como aumentar capacidade em tempo de inferência.',
      history: [
        { year: 2025, event: 'DeepSeek publica o R1 e o relatório técnico com pesos abertos', importance: 5 },
      ],
      actors: [{ name: 'DeepSeek-AI', role: 'Autores do relatório', org: 'DeepSeek' }],
      sources: [
        {
          title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
          url: 'https://arxiv.org/abs/2501.12948',
          type: 'paper',
          summary: 'Guo et al. (2025). RL com recompensas verificáveis para raciocínio.',
        },
        {
          title: 'DeepSeek-R1 no Hugging Face',
          url: 'https://huggingface.co/deepseek-ai/DeepSeek-R1',
          type: 'repo',
          summary: 'Página oficial dos pesos do modelo.',
        },
      ],
    },
  },
  {
    id: 'generative-agents',
    name: 'Agentes Generativos',
    domain: 'reasoning',
    tier: 4,
    gridCoordinates: { col: 2, row: 1 },
    signatureColor: sig(30),
    prerequisites: ['llm', 'react'],
    metadata: { status: 'research', dateIntroduced: '2023-04', companies: ['Stanford', 'Google'] },
    content: {
      overview:
        'Agentes com LLM que guardam memórias, refletem sobre elas e planejam o dia. Em uma simulação, 25 personagens interagem de forma crível.',
      impact:
        'Mostrou comportamento social emergente a partir de um LLM com memória. Base de sistemas de agentes de longo prazo.',
      history: [
        { year: 2023, event: 'Park et al. publicam a simulação com 25 agentes generativos', importance: 5 },
      ],
      actors: [{ name: 'Joon Sung Park', role: 'Primeiro autor', org: 'Stanford' }],
      sources: [
        {
          title: 'Generative Agents: Interactive Simulacra of Human Behavior',
          url: 'https://arxiv.org/abs/2304.03442',
          type: 'paper',
          summary: 'Park et al. (2023). Memória, reflexão e planejamento para agentes com LLM.',
        },
      ],
    },
  },
  {
    id: 'recursive-self-improvement',
    name: 'Automelhoria Recursiva',
    domain: 'reasoning',
    tier: 5,
    gridCoordinates: { col: 2, row: 0 },
    signatureColor: sig(31),
    prerequisites: ['reasoning-rl'],
    metadata: { status: 'theoretical', dateIntroduced: '1965', companies: [] },
    content: {
      overview:
        'Um sistema que melhora o próprio código e o próprio aprendizado, e usa essa melhoria para melhorar de novo. Ciclo que pode levar a uma explosão de inteligência.',
      impact:
        'É o mecanismo central dos cenários de ASI. Hoje é área de pesquisa e de preocupação, sem exemplo confirmado de ciclo fechado.',
      history: [
        { year: 1965, event: 'I. J. Good descreve a "máquina ultrainteligente" que projeta máquinas melhores', importance: 5 },
        { year: 2014, event: 'Bostrom populariza o cenário de explosão de inteligência', importance: 4 },
      ],
      actors: [{ name: 'I. J. Good', role: 'Autor da ideia (1965)', org: 'Matemático britânico' }],
      sources: [
        {
          title: 'Intelligence explosion',
          url: 'https://en.wikipedia.org/wiki/Intelligence_explosion',
          type: 'article',
          summary: 'Resumo do conceito e da origem em I. J. Good (1965).',
        },
      ],
    },
  },
]
