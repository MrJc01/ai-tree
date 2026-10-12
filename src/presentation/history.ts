import type { PresentationStep } from './steps'

/**
 * História da IA, contada em ordem cronológica, do começo até hoje.
 *
 * Diferente da apresentação, aqui cada passo move o Time Slider para o ano da história. Tudo que é
 * posterior fica em névoa, então a árvore cresce junto com a narrativa.
 *
 * Regras (validadas em src/__tests__/presentation.test.ts):
 * - Os anos dos passos não podem voltar no tempo: a história só anda para a frente.
 * - A habilidade em foco de cada passo precisa existir até o ano do passo, senão ela fica apagada.
 * - Mesmas regras de ids e de ações do roteiro da apresentação (ver docs/APRESENTACAO.md).
 */
export const HISTORY_STEPS: PresentationStep[] = [
  {
    id: 'historia-inicio',
    title: 'Antes de tudo: a névoa',
    body: [
      'Esta é a história da inteligência artificial, do começo até hoje.',
      'Tudo o que ainda não existia está em névoa. Conforme a história avança, o Time Slider avança junto e a árvore cresce.',
    ],
    notes: 'Comece com a tela inteira e deixe a névoa cobrir quase tudo.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'clearFilters' },
      { kind: 'benchmark', id: null },
      { kind: 'models', on: false },
      { kind: 'year', year: 1950 },
      { kind: 'fit' },
    ],
  },
  {
    id: 'historia-1950-turing',
    title: '1950 · A pergunta de Turing',
    body: [
      'Alan Turing publica na revista Mind a pergunta: as máquinas podem pensar?',
      'Ele propõe um jogo de imitação: um interrogador conversa às cegas com uma máquina e com uma pessoa. Se não conseguir distinguir, a máquina pode ser considerada inteligente.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1950 },
      { kind: 'focus', skillId: 'turing-test' },
    ],
  },
  {
    id: 'historia-1956-dartmouth',
    title: '1956 · Nasce o campo',
    body: [
      'No workshop de verão de Dartmouth, pesquisadores como McCarthy, Minsky e Shannon reúnem a ideia de estudar máquinas que simulem a inteligência humana. É ali que o nome "inteligência artificial" se consolida.',
      'A aposta inicial é raciocinar com símbolos e regras lógicas.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1956 },
      { kind: 'focus', skillId: 'symbolic-ai' },
    ],
  },
  {
    id: 'historia-1958-perceptron',
    title: '1958 · O primeiro neurônio que aprende',
    body: [
      'Frank Rosenblatt cria o perceptron, uma rede de um único neurônio que aprende a separar classes ajustando os próprios pesos.',
      'Aparece uma máquina que aprende com exemplos, em vez de seguir regras escritas à mão.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1958 },
      { kind: 'focus', skillId: 'perceptron' },
    ],
  },
  {
    id: 'historia-1969-inverno',
    title: '1969 a 1980 · O inverno da IA',
    body: [
      'Minsky e Papert mostram os limites do perceptron de uma camada: ele não consegue aprender a função XOR.',
      'Financiamento cai e a área esfria. Parte do trabalho continua, em silêncio, para resolver esse limite.',
    ],
    notes: 'Mostre o contraste: a ideia não morreu, ela ficou esperando uma técnica para treinar camadas profundas.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1980 },
      { kind: 'focus', skillId: 'perceptron' },
    ],
  },
  {
    id: 'historia-1986-backprop',
    title: '1986 · Treinar camadas escondidas',
    body: [
      'Rumelhart, Hinton e Williams publicam na Nature a retropropagação do erro: o método que calcula como cada peso deve mudar para reduzir o erro, camada por camada.',
      'Agora dá para treinar redes com várias camadas.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1986 },
      { kind: 'focus', skillId: 'backprop' },
    ],
  },
  {
    id: 'historia-1997-lstm',
    title: '1997 · Memória de longo prazo',
    body: [
      'Hochreiter e Schmidhuber criam o LSTM, uma rede recorrente com portas que decidem o que lembrar e o que esquecer.',
      'Ele mantém informação por muitos passos de uma sequência e vira o padrão em texto e fala por duas décadas.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1997 },
      { kind: 'focus', skillId: 'lstm' },
    ],
  },
  {
    id: 'historia-1998-cnn',
    title: '1998 · Filtros que varrem a imagem',
    body: [
      'LeCun aplica redes convolucionais ao reconhecimento de documentos, na arquitetura LeNet.',
      'A ideia de um mesmo filtro percorrendo a imagem inteira, com poucos parâmetros, nasce aqui.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1998 },
      { kind: 'focus', skillId: 'cnn' },
    ],
  },
  {
    id: 'historia-2012-gpu',
    title: '2007 a 2012 · A placa gráfica vira computador',
    body: [
      'Em 2007, a NVIDIA lança o CUDA, que deixa a GPU fazer contas gerais e não só gráficos.',
      'Em 2012, o AlexNet treina em duas dessas GPUs e vence o ILSVRC por larga margem. Começa a era do deep learning.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2012 },
      { kind: 'focus', skillId: 'gpu' },
    ],
  },
  {
    id: 'historia-2014-atencao',
    title: '2014 · A rede aprende a olhar',
    body: [
      'Bahdanau, Cho e Bengio deixam o tradutor neural olhar para as partes certas da frase de entrada a cada palavra gerada.',
      'Nasce o mecanismo de atenção, resposta a um gargalo: comprimir uma frase inteira num vetor só.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2014 },
      { kind: 'focus', skillId: 'attention' },
    ],
  },
  {
    id: 'historia-2015-jogos',
    title: '2015 a 2016 · Aprender a jogar',
    body: [
      'O DQN da DeepMind aprende jogos de Atari a partir dos pixels, sem regras escritas.',
      'Em 2016, o AlphaGo vence Lee Sedol, combinando aprendizado por reforço com busca.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2016 },
      { kind: 'focus', skillId: 'deep-rl' },
    ],
  },
  {
    id: 'historia-2017-transformer',
    title: '2017 · Só atenção',
    body: [
      'O artigo "Attention Is All You Need" troca a recorrência por atenção pura. A sequência inteira é processada em paralelo.',
      'Escala melhor que as redes recorrentes, e é a base de quase tudo o que vem depois.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2017 },
      { kind: 'focus', skillId: 'transformer' },
    ],
  },
  {
    id: 'historia-2018-llm',
    title: '2018 · Pré-treino em texto',
    body: [
      'O GPT-1 e o BERT mostram que pré-treinar um transformer em grandes volumes de texto gera representações úteis para muitas tarefas.',
      'Nasce o modelo de linguagem em larga escala.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2018 },
      { kind: 'focus', skillId: 'llm' },
    ],
  },
  {
    id: 'historia-2020-escala',
    title: '2020 · A escala previsível',
    body: [
      'Kaplan e colegas mostram que o erro cai de forma previsível quando se aumentam parâmetros, dados e compute.',
      'O GPT-3 com 175 bilhões de parâmetros vira a referência. Escalar passa a ser um plano, não um palpite.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2020 },
      { kind: 'focus', skillId: 'scaling-laws' },
    ],
  },
  {
    id: 'historia-2022-alinhamento',
    title: '2022 · Alinhar com pessoas',
    body: [
      'O InstructGPT ajusta o modelo com preferências humanas, e ele passa a seguir instruções em vez de só completar texto.',
      'A IA constitucional segue a mesma linha, com princípios escritos no lugar de parte das avaliações humanas.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2022 },
      { kind: 'focus', skillId: 'rlhf' },
    ],
  },
  {
    id: 'historia-2023-multimodal',
    title: '2023 · Ver além do texto',
    body: [
      'O GPT-4 e o Gemini passam a receber imagens, além de texto.',
      'São os modelos fundacionais multimodais: percebem e raciocinam sobre mais de uma modalidade.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2023 },
      { kind: 'focus', skillId: 'multimodal-fm' },
    ],
  },
  {
    id: 'historia-2025-raciocinio',
    title: '2025 · Raciocinar com aprendizado por reforço',
    body: [
      'O DeepSeek-R1 treina raciocínio longo com aprendizado por reforço, com pesos abertos.',
      'Ative a camada de modelos: GPT-4o, Claude 3.5, Gemini 2.0 e DeepSeek-R1 orbitam as habilidades correspondentes.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2025 },
      { kind: 'models', on: true },
      { kind: 'focus', skillId: 'reasoning-rl' },
    ],
  },
  {
    id: 'historia-hoje-topo',
    title: 'Hoje · E o topo da árvore?',
    body: [
      'No topo, a superinteligência ainda é teórica: um sistema que melhora a si mesmo.',
      'O debate sobre governança e controle acontece agora, antes de qualquer patamar ser alcançado.',
    ],
    notes: 'Feche com a pergunta aberta para a plateia.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'models', on: false },
      { kind: 'year', year: 2026 },
      { kind: 'focus', skillId: 'recursive-self-improvement' },
    ],
  },
  {
    id: 'historia-fim',
    title: 'Fim da história',
    body: [
      'De 1950 até hoje: uma pergunta, um campo, um neurônio, um inverno, um método, uma memória, uma visão, uma atenção, um transformer, uma escala e um alinhamento.',
      'Use as setas ou o roteiro à direita para revisitar qualquer passo.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'clearFilters' },
      { kind: 'year', year: 2026 },
      { kind: 'fit' },
    ],
  },
]
