import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import App from '../App'
import { toPng } from 'html-to-image'
import { SkillDrawer } from '../components/drawer/SkillDrawer'
import { TIMELINE_MAX, useAppStore } from '../store/appStore'
import { PRESENTATION_STEPS } from '../presentation/steps'

// Diagramas Mermaid não rodam no jsdom. O teste só precisa saber que a aba existe.
vi.mock('mermaid', () => ({ default: { initialize: () => {}, render: async () => ({ svg: '<svg/>' }) } }))

// A exportação lê o DOM renderizado, que o jsdom não desenha. O teste só confere o pedido e o nome do arquivo.
vi.mock('html-to-image', () => ({
  toPng: vi.fn(async () => 'data:image/png;base64,AA'),
  toSvg: vi.fn(async () => 'data:image/svg+xml;base64,AA'),
}))

const initial = useAppStore.getState()

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({
    ...initial,
    drawer: [],
    domains: [],
    companies: [],
    statuses: [],
    year: TIMELINE_MAX,
    showModels: false,
    benchmarkId: null,
    positions: {},
    density: 'streamline',
    theme: 'dark',
  })
})

describe('gaveta', () => {
  it('não aparece sem nada aberto', () => {
    render(<SkillDrawer />)
    expect(screen.queryByLabelText('Detalhes da habilidade')).not.toBeInTheDocument()
  })

  it('abre uma habilidade com visão geral, impacto e tags', () => {
    useAppStore.getState().openSkill('cnn')
    render(<SkillDrawer />)
    const drawer = screen.getByLabelText('Detalhes da habilidade')
    expect(within(drawer).getByRole('heading', { name: 'Rede Convolucional (CNN)' })).toBeInTheDocument()
    expect(within(drawer).getByText('Por que importa')).toBeInTheDocument()
    expect(within(drawer).getByRole('tab', { name: 'Fontes & Benchmarks' })).toBeInTheDocument()
  })

  it('modo Streamline oculta a data exata e o modo Research a mostra', () => {
    useAppStore.getState().openSkill('llm')
    render(<SkillDrawer />)
    expect(screen.queryByText(/Introduzido em 2018-06/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Research' }))
    expect(screen.getByText('Introduzido em 2018-06')).toBeInTheDocument()
  })

  it('clicar em uma fonte empilha a folha dela e mostra no breadcrumb', () => {
    useAppStore.getState().openSkill('cnn')
    render(<SkillDrawer />)
    fireEvent.click(screen.getByRole('button', { name: /Gradient-based learning/ }))
    const crumbs = screen.getByRole('navigation', { name: 'Caminho' })
    expect(crumbs).toHaveTextContent('Arquiteturas & Redes')
    expect(crumbs).toHaveTextContent('Rede Convolucional (CNN)')
    expect(crumbs).toHaveTextContent('Gradient-based learning applied to document recognition')
    expect(useAppStore.getState().drawer.at(-1)).toEqual({ kind: 'source', skillId: 'cnn', index: 0 })
  })

  it('ESC volta uma folha e, na primeira, fecha a gaveta', () => {
    useAppStore.getState().openSkill('cnn')
    useAppStore.getState().pushEntry({ kind: 'company', name: 'Meta' })
    render(<SkillDrawer />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(useAppStore.getState().drawer).toHaveLength(1)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(useAppStore.getState().drawer).toEqual([])
  })

  it('a aba Fluxograma sai do estado de carregamento quando a habilidade tem diagrama', async () => {
    useAppStore.getState().openSkill('cnn')
    render(<SkillDrawer />)
    fireEvent.click(screen.getByRole('tab', { name: 'Fluxograma' }))
    expect(screen.getByText(/Renderizando fluxograma/)).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText(/Renderizando fluxograma/)).not.toBeInTheDocument())
  })
})

describe('App', () => {
  it('monta o cabeçalho, os controles e a contagem de habilidades', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'AI Tech Tree & Knowledge' })).toBeInTheDocument()
    expect(screen.getByText('51 habilidades')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Padrão' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Auto-organizar' })).toBeInTheDocument()
  })

  it('o botão Modelos liga a camada de modelos', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Modelos' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('o botão Padrão limpa as posições arrastadas', () => {
    useAppStore.getState().setNodePosition('llm', { x: 1, y: 2 })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Padrão' }))
    expect(useAppStore.getState().positions).toEqual({})
  })

  it('Auto-organizar abre o menu, e escolher um tipo grava uma posição para todas as habilidades', () => {
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Auto-organizar' })
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = screen.getByRole('menu', { name: 'Tipo de organização' })
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(4)
    fireEvent.click(within(menu).getByRole('menuitem', { name: /Alfabética/ }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(Object.keys(useAppStore.getState().positions)).toHaveLength(52)
  })

  it('ESC fecha o menu de organização sem fechar a gaveta', () => {
    useAppStore.getState().openSkill('llm')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Auto-organizar' }))
    fireEvent.keyDown(screen.getByRole('menu', { name: 'Tipo de organização' }), { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(useAppStore.getState().drawer).toEqual([{ kind: 'skill', id: 'llm' }])
  })
})

describe('apresentação na interface', () => {
  it('o botão Apresentação liga e desliga o painel', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: 'Apresentação' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(useAppStore.getState().presentation.active).toBe(true)
    fireEvent.click(button)
    expect(useAppStore.getState().presentation.active).toBe(false)
  })

  it('o painel mostra o primeiro passo e o roteiro com todos os passos', () => {
    useAppStore.getState().startPresentation()
    render(<App />)
    expect(screen.getByText(/passo 1 de/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bem-vindo à árvore da IA' })).toBeInTheDocument()
    const roteiro = screen.getByRole('region', { name: 'Roteiro completo' })
    expect(within(roteiro).getAllByRole('button').length).toBe(PRESENTATION_STEPS.length)
  })

  it('Próximo avança o passo e o título acompanha', () => {
    useAppStore.getState().startPresentation()
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Próximo' }))
    expect(useAppStore.getState().presentation.index).toBe(1)
    expect(screen.getByRole('heading', { name: 'Os dois eixos' })).toBeInTheDocument()
  })

  it('as setas do teclado avançam e voltam, mas não quando o foco está na busca', () => {
    useAppStore.getState().startPresentation()
    render(<App />)
    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(useAppStore.getState().presentation.index).toBe(1)
    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(useAppStore.getState().presentation.index).toBe(0)

    // A busca fica no painel de filtros: a tecla / abre o painel e coloca o cursor no campo.
    fireEvent.keyDown(window, { key: '/' })
    const search = screen.getByRole('searchbox', { name: 'Buscar habilidade' })
    expect(search).toHaveFocus()
    fireEvent.keyDown(search, { key: 'ArrowRight' })
    expect(useAppStore.getState().presentation.index).toBe(0)
  })

  it('aplicar um passo leva a tela ao estado que ele descreve', () => {
    useAppStore.getState().startPresentation()
    render(<App />)
    const roteiro = screen.getByRole('region', { name: 'Roteiro completo' })
    fireEvent.click(within(roteiro).getByRole('button', { name: /Linha do tempo/ }))
    expect(useAppStore.getState().presentation.index).toBe(PRESENTATION_STEPS.findIndex((s) => s.id === 'linha-do-tempo'))
    expect(useAppStore.getState().year).toBe(1990)
  })
})

describe('aba Como usar', () => {
  it('aparece na gaveta e explica o hexágono aberto e como usar a habilidade', () => {
    useAppStore.getState().openSkill('cnn')
    render(<SkillDrawer />)
    fireEvent.click(screen.getByRole('tab', { name: 'Como usar' }))
    expect(screen.getByRole('heading', { name: 'Sobre esta habilidade' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Como ler este hexágono' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Como usar esta habilidade' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'O que é esta árvore' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Glossário' })).not.toBeInTheDocument()
  })
})

describe('FAQ e busca no painel', () => {
  it('o botão FAQ abre o painel, uma pergunta recolhe e expande, e a pesquisa filtra', async () => {
    render(<App />)
    const faq = screen.getByRole('button', { name: 'FAQ' })
    fireEvent.click(faq)
    expect(faq).toHaveAttribute('aria-pressed', 'true')
    const panel = screen.getByRole('complementary', { name: 'Perguntas frequentes' })
    const question = within(panel).getByRole('button', { name: /O que é a névoa/ })
    expect(question).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(question)
    expect(question).toHaveAttribute('aria-expanded', 'true')
    expect(within(panel).getByText(/quase invisíveis/)).toBeInTheDocument()

    fireEvent.change(within(panel).getByRole('searchbox', { name: 'Pesquisar nas perguntas' }), { target: { value: 'zzzz-nada' } })
    expect(within(panel).getByText(/Nenhuma pergunta bate/)).toBeInTheDocument()
  })

  it('ESC fecha o FAQ e não fecha a gaveta', () => {
    useAppStore.getState().openSkill('llm')
    useAppStore.getState().setFaqOpen(true)
    render(<App />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(useAppStore.getState().faqOpen).toBe(false)
    expect(useAppStore.getState().drawer).toEqual([{ kind: 'skill', id: 'llm' }])
  })

  it('a tecla / abre o painel de busca e a busca leva à habilidade', () => {
    render(<App />)
    fireEvent.keyDown(window, { key: '/' })
    const search = screen.getByRole('searchbox', { name: 'Buscar habilidade' })
    expect(search).toHaveFocus()
    fireEvent.change(search, { target: { value: 'llm' } })
    const results = screen.getByRole('listbox', { name: 'Resultados da busca' })
    fireEvent.click(within(results).getAllByRole('button')[0])
    expect(useAppStore.getState().drawer).toHaveLength(1)
    expect(useAppStore.getState().drawer[0].kind).toBe('skill')
  })
})

describe('abas da gaveta com setas', () => {
  it('a seta para a direita rola a faixa de abas', () => {
    const scrollBy = vi.fn()
    Object.defineProperty(HTMLElement.prototype, 'scrollBy', { configurable: true, value: scrollBy })
    useAppStore.getState().openSkill('llm')
    render(<SkillDrawer />)
    fireEvent.click(screen.getByRole('button', { name: 'Rolar abas para a direita' }))
    expect(scrollBy).toHaveBeenCalledWith({ left: 140, behavior: 'smooth' })
    delete (HTMLElement.prototype as unknown as { scrollBy?: unknown }).scrollBy
  })
})

describe('Como usar fala do hexágono, não do sistema', () => {
  it('a aba traz os pré-requisitos da habilidade e não tem as seções gerais do manual', () => {
    useAppStore.getState().openSkill('llm')
    render(<SkillDrawer />)
    fireEvent.click(screen.getByRole('tab', { name: 'Como usar' }))
    expect(screen.getByRole('heading', { name: 'Como ler este hexágono' })).toBeInTheDocument()
    expect(screen.getByText(/Aba Grafo: os pré-requisitos são/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Exemplos de uso' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Patamares e maturidade' })).not.toBeInTheDocument()
  })
})

describe('link direto ao carregar', () => {
  it('um link de habilidade abre a habilidade e encerra uma apresentação que estava aberta', () => {
    useAppStore.getState().startPresentation('historia')
    window.history.replaceState(null, '', '/#habilidade=llm')
    render(<App />)
    expect(useAppStore.getState().drawer).toEqual([{ kind: 'skill', id: 'llm' }])
    expect(useAppStore.getState().presentation.active).toBe(false)
    window.history.replaceState(null, '', '/')
  })

  it('um link colado com a página já aberta abre a habilidade, sem recarregar', () => {
    useAppStore.getState().closeDrawer()
    render(<App />)
    window.history.replaceState(null, '', '/#habilidade=cnn')
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(useAppStore.getState().drawer).toEqual([{ kind: 'skill', id: 'cnn' }])
    window.history.replaceState(null, '', '/')
  })
})

describe('exportar a vista', () => {
  it('o menu oferece PNG e SVG, e o PNG sai com a data no nome do arquivo', async () => {
    const downloads: string[] = []
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.download)
    })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Exportar' }))
    const menu = screen.getByRole('menu', { name: 'Formato da exportação' })
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(4)
    fireEvent.click(within(menu).getByRole('menuitem', { name: /PNG · vista atual/ }))
    await waitFor(() => expect(toPng).toHaveBeenCalled())
    await waitFor(() => expect(downloads[0]).toMatch(/^ai-tree-vista-\d{4}-\d{2}-\d{2}\.png$/))
    click.mockRestore()
  })
})

describe('menu do cabeçalho no celular', () => {
  it('o menu reúne as ações, e Padrão volta o layout pelo menu', () => {
    useAppStore.getState().setNodePosition('llm', { x: 1, y: 2 })
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }))
    const menu = screen.getByRole('menu', { name: 'Menu' })
    expect(within(menu).getAllByRole('menuitem').length).toBeGreaterThanOrEqual(8)
    fireEvent.click(within(menu).getByRole('menuitem', { name: /Padrão/ }))
    expect(useAppStore.getState().positions).toEqual({})
    expect(screen.queryByRole('menu', { name: 'Menu' })).not.toBeInTheDocument()
  })
})
