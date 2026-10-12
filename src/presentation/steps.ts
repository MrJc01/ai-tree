import type { Domain, MaturityStatus } from '../types/skill'

/**
 * Roteiro da apresentação. A ORDEM É A ORDEM DA LISTA: o primeiro item é o passo 1.
 *
 * Para incluir um passo novo, insira um objeto no lugar em que ele deve aparecer. Veja
 * docs/APRESENTACAO.md para as regras e para a lista de ações disponíveis.
 *
 * Ao entrar num passo, a tela volta ao estado-base (gaveta fechada, sem filtros, sem benchmark, sem
 * modelos, no presente) e depois as `actions` do passo são aplicadas, nesta ordem. Assim um passo nunca
 * herda o estado do anterior. Cada passo só precisa dizer o que é diferente do básico.
 */

export type PresentationAction =
  /** Enquadra a árvore inteira. */
  | { kind: 'fit' }
  /** Centraliza o canvas numa habilidade, sem abrir a gaveta. */
  | { kind: 'focus'; skillId: string }
  /** Abre a gaveta numa habilidade (e centraliza nela). */
  | { kind: 'open'; skillId: string }
  /** Abre a habilidade e empilha a fonte de índice `index` por cima. */
  | { kind: 'source'; skillId: string; index: number }
  | { kind: 'closeDrawer' }
  /** Define os filtros de uma vez. Categorias não informadas ficam vazias. */
  | { kind: 'filter'; domains?: Domain[]; companies?: string[]; statuses?: MaturityStatus[] }
  | { kind: 'clearFilters' }
  | { kind: 'year'; year: number }
  | { kind: 'benchmark'; id: string | null }
  | { kind: 'models'; on: boolean }
  | { kind: 'density'; value: 'streamline' | 'research' }
  /** `padrao` volta ao layout curado. `auto` aplica a organização automática. */
  | { kind: 'layout'; value: 'padrao' | 'auto' }

export interface PresentationStep {
  /** Identificador estável e único. Não reutilize um id removido. */
  id: string
  title: string
  /** Parágrafos curtos, mostrados no painel para a plateia. */
  body: string[]
  /** Observações só para quem apresenta. Aparecem em destaque menor. */
  notes?: string
  /** Aplicadas ao entrar no passo, em ordem. */
  actions: PresentationAction[]
}

export const PRESENTATION_STEPS: PresentationStep[] = [
  {
    id: 'boas-vindas',
    title: 'Bem-vindo à árvore da IA',
    body: [
      'A AI Tech Tree & Knowledge mostra a evolução da inteligência artificial como uma árvore de habilidades.',
      'Da base, o machine learning clássico, até o topo, a superinteligência teórica.',
    ],
    notes: 'Abra com a tela inteira visível. Não precisa mexer em nada ainda.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'clearFilters' },
      { kind: 'benchmark', id: null },
      { kind: 'models', on: false },
      { kind: 'year', year: 2026 },
      { kind: 'fit' },
    ],
  },
  {
    id: 'eixos',
    title: 'Os dois eixos',
    body: [
      'As colunas são as áreas: Arquiteturas & Redes, Compute & Hardware, Raciocínio & LLMs, Robótica & Embodiment e Alinhamento & Governança.',
      'As linhas são os patamares, de T1 (base) a T5 (topo). Cada habilidade fica no patamar da sua complexidade.',
    ],
    notes: 'Os nomes das áreas ficam no topo de cada coluna. Os T1 a T5 aparecem à esquerda de cada linha.',
    actions: [{ kind: 'fit' }],
  },
  {
    id: 'hexagono',
    title: 'Como ler um hexágono',
    body: [
      'Cada hexágono é uma habilidade. O ponto colorido é a cor de assinatura, a mesma em todas as réplicas dela.',
      'O selo embaixo mostra a maturidade: Teórico, Experimental, Produção ou Comoditizado.',
    ],
    notes: 'Passe o mouse sobre o hexágono para ver as cantoneiras de destaque.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'focus', skillId: 'transformer' },
    ],
  },
  {
    id: 'arestas',
    title: 'Arestas são dependências',
    body: [
      'As trilhas em circuito ligam um pré-requisito a quem ele desbloqueia.',
      'O pulso de energia anda do pré-requisito para o desbloqueio. Cada ligação tem a sua própria trilha, então nenhuma se sobrepõe à outra.',
    ],
    notes: 'Sem a trilha de um pré-requisito, a habilidade seguinte não tem base para existir.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'focus', skillId: 'llm' },
    ],
  },
  {
    id: 'replicas',
    title: 'Réplicas',
    body: [
      'Algumas habilidades aparecem em mais de uma área. Attention Mechanism está em Arquiteturas e em Raciocínio.',
      'O contorno tracejado marca a réplica. Passe o mouse sobre qualquer uma: todas as instâncias acendem juntas.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'focus', skillId: 'attention' },
    ],
  },
  {
    id: 'abrir-habilidade',
    title: 'Abrir uma habilidade',
    body: [
      'Clique em um hexágono para abrir a gaveta com os detalhes. A tela se centraliza nele, com espaço para a gaveta.',
      'Também dá para buscar pelo nome: aperte a tecla / e digite.',
    ],
    actions: [{ kind: 'open', skillId: 'transformer' }],
  },
  {
    id: 'streamline-research',
    title: 'Streamline e Research',
    body: [
      'O modo Streamline mostra o conceito e o impacto, sem jargão.',
      'O modo Research libera datas exatas, autores, equações e métricas. Troque no canto superior da gaveta.',
    ],
    actions: [
      { kind: 'open', skillId: 'llm' },
      { kind: 'density', value: 'research' },
    ],
  },
  {
    id: 'abas',
    title: 'As abas da habilidade',
    body: [
      'Visão geral, história (ordenável por data ou por impacto), atores e laboratórios, fluxograma, grafo de relações e fontes com benchmarks.',
    ],
    actions: [{ kind: 'open', skillId: 'llm' }],
  },
  {
    id: 'fontes',
    title: 'Fontes e navegação empilhada',
    body: [
      'Cada fonte abre um painel por cima da habilidade. O caminho aparece no topo: Área > Habilidade > Paper.',
      'Aperte ESC para voltar um passo. Na primeira folha, ESC fecha a gaveta.',
    ],
    actions: [{ kind: 'source', skillId: 'llm', index: 0 }],
  },
  {
    id: 'pre-requisitos',
    title: 'Pré-requisitos e desbloqueios',
    body: [
      'Na aba Grafo, cada pré-requisito e cada desbloqueio é um botão. Clicar nele abre a habilidade correspondente.',
      'O canvas se centraliza na nova habilidade automaticamente.',
    ],
    actions: [{ kind: 'open', skillId: 'transformer' }],
  },
  {
    id: 'filtros',
    title: 'Filtros e o efeito de ghosting',
    body: [
      'No painel de filtros, escolha uma área, uma empresa ou uma maturidade.',
      'O que não bate fica cinza e apagado, e o que bate pulsa. A geometria da árvore não muda.',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'filter', domains: ['reasoning'] },
      { kind: 'fit' },
    ],
  },
  {
    id: 'empresas',
    title: 'Filtrar por empresa',
    body: [
      'Filtre por empresa, como OpenAI, Anthropic ou Google DeepMind.',
      'Na gaveta, clicar numa empresa abre a folha dela, com as habilidades e os modelos que ela traz.',
    ],
    actions: [
      { kind: 'clearFilters' },
      { kind: 'closeDrawer' },
      { kind: 'filter', companies: ['OpenAI'] },
      { kind: 'fit' },
    ],
  },
  {
    id: 'linha-do-tempo',
    title: 'Linha do tempo',
    body: [
      'Arraste o Time Slider no rodapé. Tecnologias posteriores à data escolhida entram em névoa.',
      'Aqui, o mapa está em 1990: só existia o que vinha antes.',
    ],
    actions: [
      { kind: 'clearFilters' },
      { kind: 'closeDrawer' },
      { kind: 'year', year: 1990 },
      { kind: 'fit' },
    ],
  },
  {
    id: 'benchmarks',
    title: 'Benchmarks',
    body: [
      'O Benchmark Vault, no canto superior direito, reúne SWE-bench, MMLU-Pro, ARC-AGI e Arena Elo.',
      'Ao escolher um, a grade destaca as habilidades que ele avalia.',
    ],
    notes: 'Os valores são só os publicados no artigo original. Placares atuais ficam na fonte oficial, e o painel traz o link.',
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'year', year: 2026 },
      { kind: 'benchmark', id: 'swe-bench' },
      { kind: 'fit' },
    ],
  },
  {
    id: 'modelos',
    title: 'Camada de modelos',
    body: [
      'Ative Modelos para ver GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 e DeepSeek-R1 orbitando as habilidades correspondentes.',
    ],
    actions: [
      { kind: 'benchmark', id: null },
      { kind: 'models', on: true },
      { kind: 'closeDrawer' },
      { kind: 'focus', skillId: 'llm' },
    ],
  },
  {
    id: 'organizacao',
    title: 'Organizar a árvore',
    body: [
      'Arraste qualquer hexágono: as trilhas são redesenhadas e a posição fica salva.',
      'Padrão volta ao layout curado. Auto-organizar reordena cada área para reduzir cruzamentos.',
    ],
    actions: [
      { kind: 'models', on: false },
      { kind: 'layout', value: 'padrao' },
      { kind: 'fit' },
    ],
  },
  {
    id: 'encerramento',
    title: 'Recapitulando',
    body: [
      'Áreas em colunas, patamares em linhas, habilidades com fontes verificadas, gaveta com navegação empilhada, filtros, linha do tempo, benchmarks e modelos.',
      'Para explorar por conta própria, use a busca (tecla /).',
    ],
    actions: [
      { kind: 'closeDrawer' },
      { kind: 'clearFilters' },
      { kind: 'fit' },
    ],
  },
]
