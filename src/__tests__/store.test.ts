import { beforeEach, describe, expect, it } from 'vitest'
import { TIMELINE_MAX, TIMELINE_MIN, useAppStore } from '../store/appStore'

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
  })
})

describe('gaveta', () => {
  it('openSkill substitui a pilha inteira', () => {
    const s = useAppStore.getState()
    s.pushEntry({ kind: 'company', name: 'OpenAI' })
    s.openSkill('llm')
    expect(useAppStore.getState().drawer).toEqual([{ kind: 'skill', id: 'llm' }])
  })

  it('pushEntry empilha e popEntry desempilha uma folha por vez', () => {
    const s = useAppStore.getState()
    s.openSkill('llm')
    s.pushEntry({ kind: 'source', skillId: 'llm', index: 0 })
    s.pushEntry({ kind: 'company', name: 'Google' })
    expect(useAppStore.getState().drawer).toHaveLength(3)
    useAppStore.getState().popEntry()
    expect(useAppStore.getState().drawer.at(-1)).toEqual({ kind: 'source', skillId: 'llm', index: 0 })
  })

  it('popEntry na última folha fecha a gaveta (ESC na primeira)', () => {
    useAppStore.getState().openSkill('llm')
    useAppStore.getState().popEntry()
    expect(useAppStore.getState().drawer).toEqual([])
  })

  it('jumpTo mantém a pilha até a profundidade pedida, inclusive', () => {
    const s = useAppStore.getState()
    s.openSkill('llm')
    s.pushEntry({ kind: 'company', name: 'OpenAI' })
    s.pushEntry({ kind: 'company', name: 'Meta' })
    useAppStore.getState().jumpTo(1)
    expect(useAppStore.getState().drawer).toHaveLength(2)
  })

  it('closeDrawer esvazia a pilha', () => {
    useAppStore.getState().openSkill('llm')
    useAppStore.getState().closeDrawer()
    expect(useAppStore.getState().drawer).toEqual([])
  })
})

describe('filtros, tempo e benchmark', () => {
  it('toggles de área, empresa e maturidade alternam o valor', () => {
    const s = useAppStore.getState()
    s.toggleDomain('compute')
    s.toggleCompany('OpenAI')
    s.toggleStatus('production')
    expect(useAppStore.getState().domains).toEqual(['compute'])
    useAppStore.getState().toggleDomain('compute')
    expect(useAppStore.getState().domains).toEqual([])
  })

  it('clearFilters limpa tudo', () => {
    const s = useAppStore.getState()
    s.toggleDomain('compute')
    s.toggleCompany('OpenAI')
    s.clearFilters()
    const st = useAppStore.getState()
    expect(st.domains.length + st.companies.length + st.statuses.length).toBe(0)
  })

  it('setYear limita ao intervalo da linha do tempo', () => {
    useAppStore.getState().setYear(1800)
    expect(useAppStore.getState().year).toBe(TIMELINE_MIN)
    useAppStore.getState().setYear(3000)
    expect(useAppStore.getState().year).toBe(TIMELINE_MAX)
  })

  it('setBenchmark alterna: o mesmo id desliga o destaque', () => {
    useAppStore.getState().setBenchmark('mmlu')
    expect(useAppStore.getState().benchmarkId).toBe('mmlu')
    useAppStore.getState().setBenchmark('mmlu')
    expect(useAppStore.getState().benchmarkId).toBeNull()
  })
})

describe('posições e densidade', () => {
  it('setNodePosition grava e persiste; resetLayout limpa', () => {
    useAppStore.getState().setNodePosition('llm', { x: 10, y: 20 })
    expect(useAppStore.getState().positions.llm).toEqual({ x: 10, y: 20 })
    expect(JSON.parse(localStorage.getItem('ai-tech-tree:positions:v2') ?? '{}').llm).toEqual({ x: 10, y: 20 })
    useAppStore.getState().resetLayout()
    expect(useAppStore.getState().positions).toEqual({})
    expect(localStorage.getItem('ai-tech-tree:positions:v2')).toBeNull()
  })

  it('setDensity troca entre streamline e research', () => {
    useAppStore.getState().setDensity('research')
    expect(useAppStore.getState().density).toBe('research')
  })

  it('toggleModels liga e desliga a camada de modelos', () => {
    useAppStore.getState().toggleModels()
    expect(useAppStore.getState().showModels).toBe(true)
  })
})

describe('foco do canvas', () => {
  it('abrir uma habilidade pede foco nela', () => {
    useAppStore.getState().openSkill('llm')
    expect(useAppStore.getState().focus?.id).toBe('llm')
  })

  it('abrir um pré-requisito ou desbloqueio pela gaveta pede foco nele', () => {
    useAppStore.getState().openSkill('llm')
    useAppStore.getState().pushEntry({ kind: 'skill', id: 'transformer' })
    expect(useAppStore.getState().focus?.id).toBe('transformer')
  })

  it('abrir a mesma habilidade de novo ainda pede foco (nonce muda)', () => {
    useAppStore.getState().openSkill('llm')
    const first = useAppStore.getState().focus?.nonce
    useAppStore.getState().openSkill('llm')
    expect(useAppStore.getState().focus?.nonce).not.toBe(first)
  })

  it('trocar só de fonte ou de empresa na mesma habilidade não move a tela', () => {
    useAppStore.getState().openSkill('llm')
    const before = useAppStore.getState().focus
    useAppStore.getState().pushEntry({ kind: 'source', skillId: 'llm', index: 0 })
    useAppStore.getState().pushEntry({ kind: 'company', name: 'OpenAI' })
    expect(useAppStore.getState().focus).toBe(before)
  })

  it('ESC que volta para a habilidade anterior devolve o foco a ela', () => {
    useAppStore.getState().openSkill('llm')
    useAppStore.getState().pushEntry({ kind: 'skill', id: 'transformer' })
    useAppStore.getState().popEntry()
    expect(useAppStore.getState().focus?.id).toBe('llm')
  })

  it('focusedSkillOf usa a habilidade mais recente da pilha, inclusive a dona de uma fonte', async () => {
    const { focusedSkillOf } = await import('../store/appStore')
    expect(focusedSkillOf([])).toBeNull()
    expect(focusedSkillOf([{ kind: 'skill', id: 'a' }, { kind: 'company', name: 'X' }])).toBe('a')
    expect(focusedSkillOf([{ kind: 'skill', id: 'a' }, { kind: 'source', skillId: 'b', index: 0 }])).toBe('b')
  })
})
