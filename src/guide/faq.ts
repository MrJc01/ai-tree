import { normalizeText } from '../lib/search'
import { STATUS_DETAILS, TIER_DETAILS, statusExamples, tierExamples } from './levels'

/**
 * Perguntas frequentes, mostradas no painel FAQ do cabeçalho. Edite aqui: a ordem da lista é a ordem na tela.
 * `id` é único. `answer` são parágrafos curtos. A pesquisa do painel procura no texto da pergunta e da resposta.
 */
export interface FaqItem {
  id: string
  question: string
  answer: string[]
}

/** Termos que aparecem no sistema (LLM, AGI, benchmark, fonte...). Um por linha, na resposta da pergunta de termos. */
export const TERMS: Array<{ term: string; text: string }> = [
  { term: 'Habilidade', text: 'Um nó da árvore: um conceito, uma arquitetura, uma técnica ou um problema.' },
  { term: 'Área', text: 'Coluna temática da árvore.' },
  { term: 'Patamar', text: 'Nível de evolução, de T1 a T5. A explicação de cada um está no FAQ.' },
  { term: 'Pré-requisito', text: 'O que precisa existir antes de uma habilidade fazer sentido.' },
  { term: 'Desbloqueio', text: 'O que uma habilidade torna possível depois dela.' },
  { term: 'Réplica', text: 'Outra aparição de uma habilidade, em outra área. Mesma cor e mesmos dados.' },
  { term: 'Cor de assinatura', text: 'A cor única de uma habilidade, usada no ponto, no pulso e na borda.' },
  { term: 'Benchmark', text: 'Teste padronizado para comparar sistemas de IA.' },
  { term: 'Fonte', text: 'Paper: artigo científico. Repositório: código e pesos abertos. Artigo: texto de divulgação ou enciclopédia.' },
  { term: 'Time Slider', text: 'O controle da linha do tempo, no rodapé.' },
  { term: 'Névoa', text: 'Habilidade posterior ao ano escolhido no Time Slider.' },
  { term: 'Ghosting', text: 'Apagamento de tudo o que não bate com o filtro ou o benchmark.' },
  { term: 'LLM', text: 'Modelo de linguagem em larga escala: um transformer treinado em grandes volumes de texto.' },
  { term: 'AGI', text: 'Inteligência artificial geral: capaz de aprender e agir em uma ampla gama de tarefas, no nível humano ou acima.' },
  { term: 'ASI', text: 'Superinteligência artificial: muito além do humano em praticamente tudo. No app, é teórica.' },
  { term: 'Mermaid', text: 'Linguagem de texto para desenhar fluxogramas. Os diagramas desta aba são feitos com ela.' },
]

const BASE_FAQ: FaqItem[] = [
  {
    id: 'o-que-e',
    question: 'O que é esta árvore?',
    answer: [
      'É um mapa da evolução da inteligência artificial. Cada hexágono é uma habilidade: um conceito, uma arquitetura, uma técnica ou um problema em aberto.',
      'As colunas são as áreas e as linhas são os patamares, de T1 (base, machine learning clássico) a T5 (topo, superinteligência teórica).',
    ],
  },
  {
    id: 'ponto',
    question: 'Por que cada hexágono tem só um ponto colorido?',
    answer: [
      'O ponto é a cor de assinatura da habilidade: a identidade dela. Cada uma tem uma cor própria, e as réplicas usam a mesma, para você reconhecer a habilidade em outra área.',
      'Os outros sinais são o selo de maturidade, as cantoneiras, a borda de foco e a névoa. A escala de cinco bolinhas aparece só na aba História, como o impacto de cada marco.',
    ],
  },
  {
    id: 'replica',
    question: 'O que é uma réplica?',
    answer: [
      'Uma habilidade que aparece em mais de uma área. Attention Mechanism, por exemplo, está em Arquiteturas e em Raciocínio.',
      'O contorno da réplica é tracejado. Os dados completos ficam na habilidade original, e a aba Como usar aponta para ela.',
    ],
  },
  {
    id: 'nevoa',
    question: 'O que é a névoa?',
    answer: [
      'Quando você move a linha do tempo para um ano, as habilidades introduzidas depois dele ficam em névoa: continuam na posição, mas quase invisíveis.',
      'Isso mostra como a árvore se formou ao longo do tempo.',
    ],
  },
  {
    id: 'foco',
    question: 'Como funcionam o foco e a borda azul?',
    answer: [
      'A habilidade aberta na gaveta, ou a que o passo da apresentação está explicando, recebe a borda azul. A câmera se centraliza nela, na parte livre à esquerda da gaveta.',
      'Ao abrir um pré-requisito ou um desbloqueio pela aba Grafo, a câmera vai para a habilidade nova.',
    ],
  },
  {
    id: 'organizacao',
    question: 'Como salvo a organização que fiz?',
    answer: [
      'Arraste os hexágonos. A posição fica salva neste navegador e volta quando você reabre a página.',
      'Padrão apaga a organização e volta ao layout curado. Auto-organizar reordena cada área para reduzir cruzamentos.',
    ],
  },
  {
    id: 'compartilhar',
    question: 'Posso compartilhar uma habilidade?',
    answer: [
      'Sim. Quando você abre uma habilidade, o endereço da página ganha o trecho #habilidade seguido do identificador dela, por exemplo #habilidade=llm.',
      'Quem abrir esse endereço vê a habilidade já aberta e centralizada.',
    ],
  },
  {
    id: 'busca',
    question: 'Como busco uma habilidade?',
    answer: [
      'Abra o botão Buscar no painel do canto superior esquerdo, ou aperte a tecla /. Digite parte do nome; acentos não importam.',
      'Enter abre o primeiro resultado. Clicar em um resultado abre a habilidade e centraliza a árvore nela.',
    ],
  },
  {
    id: 'atalhos',
    question: 'Quais são os atalhos de teclado?',
    answer: [
      '/ foca a busca. ESC, na gaveta, volta uma folha; na primeira, fecha a gaveta.',
      'As setas movem o foco entre os hexágonos, e Tab percorre hexágonos e abas. Enter ou Espaço abre o hexágono selecionado.',
      'Com a apresentação ou a História abertas, as setas ← e → passam os passos.',
    ],
  },
  {
    id: 'apresentacao-historia',
    question: 'Qual a diferença entre Apresentação e História?',
    answer: [
      'Apresentação tem 17 passos sobre como usar o sistema: como ler, explorar, filtrar, usar o tempo e os modelos.',
      'História tem 19 passos contando a evolução da IA de 1950 até hoje, e o Time Slider avança junto com a narrativa.',
    ],
  },
  {
    id: 'abas',
    question: 'O que tem em cada aba da gaveta?',
    answer: [
      'Visão Geral, História, Atores & Labs, Fluxograma, Grafo, Fontes & Benchmarks e Como usar.',
      'A aba Como usar explica o hexágono aberto: o que cada parte dele significa para a habilidade e como usá-la, com pré-requisitos, desbloqueios, fontes e benchmarks.',
    ],
  },
  {
    id: 'dados',
    question: 'De onde vêm os dados?',
    answer: [
      'Das fontes citadas em cada habilidade: artigos (arXiv e DOI), repositórios e textos de referência. Os links abrem a fonte original.',
      'A data de uma habilidade é a do artigo que a introduziu, salvo indicação em contrário.',
    ],
  },
  {
    id: 'placares',
    question: 'Os benchmarks mostram placares atuais?',
    answer: [
      'Sim, com data. Cada benchmark mostra o valor do artigo original e, quando há, o placar atual lido em uma data, com a página de onde o dado saiu e o link do placar oficial para você conferir.',
      'Placares mudam. Quando a página oficial carrega os números por JavaScript, o valor vem de um agregador citado no painel, e o texto diz isso.',
    ],
  },
  {
    id: 'completa',
    question: 'A árvore mostra tudo o que existe em IA?',
    answer: [
      'Não. É uma seleção editorial de habilidades, feita para explicar a evolução do campo, e não um catálogo completo.',
    ],
  },
  {
    id: 'celular',
    question: 'Posso usar no celular?',
    answer: [
      'A versão atual foi pensada para computador. Em telas pequenas, o cabeçalho esconde alguns botões e a gaveta ocupa a tela inteira.',
    ],
  },
  {
    id: 'adicionar',
    question: 'Como adiciono uma habilidade nova?',
    answer: [
      'Inclua um objeto nos arquivos de src/data/skills/, na área certa. Depois rode npm test: os testes conferem ligações, cores, fontes e a integridade da árvore.',
      'O README tem o passo a passo.',
    ],
  },
  {
    id: 'termos',
    question: 'O que significam os termos (LLM, AGI, ASI, benchmark, fonte, Mermaid...)?',
    answer: TERMS.map((t) => `${t.term}: ${t.text}`),
  },
]



/** Uma pergunta por patamar (T1 a T5), com a explicação completa e exemplos da árvore. Texto vindo de levels.ts. */
function tierFaq(): FaqItem[] {
  return TIER_DETAILS.map((t) => {
    const ex = tierExamples(t.tier)
    return {
      id: `patamar-t${t.tier}`,
      question: `O que é o T${t.tier}, ${t.name}?`,
      answer: [
        ...t.explanation,
        `Como reconhecer: ${t.criteria.join(' ')}`,
        `Posição na árvore: ${t.position}`,
        `${ex.count} habilidades. Exemplos: ${ex.examples.join(', ')}.`,
      ],
    }
  })
}

/** Uma pergunta por maturidade, com a explicação completa, os sinais e exemplos da árvore. */
function statusFaq(): FaqItem[] {
  return STATUS_DETAILS.map((m) => {
    const ex = statusExamples(m.status)
    return {
      id: `maturidade-${m.status}`,
      question: `O que significa "${m.name}"?`,
      answer: [
        ...m.explanation,
        `Como reconhecer: ${m.recognize.join(' ')}`,
        `${ex.count} habilidades. Exemplos: ${ex.examples.join(', ')}.`,
      ],
    }
  })
}

/** Ordem final: o que é a árvore, os patamares, as maturidades e o restante. */
export const FAQ: FaqItem[] = [BASE_FAQ[0], ...tierFaq(), ...statusFaq(), ...BASE_FAQ.slice(1)]

/** Perguntas que batem com a pesquisa, pelo texto da pergunta ou da resposta. Sem pesquisa, devolve todas. */
export function filterFaq(items: FaqItem[], query: string): FaqItem[] {
  const q = normalizeText(query)
  if (!q) return items
  return items.filter(
    (item) =>
      normalizeText(item.question).includes(q) || item.answer.some((paragraph) => normalizeText(paragraph).includes(q)),
  )
}
