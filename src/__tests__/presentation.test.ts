import { beforeEach, describe, expect, it } from 'vitest'
import { BENCHMARKS, SKILLS, SKILL_BY_ID } from '../data'
import { normalizeText, searchSkills } from '../lib/search'
import { runPresentationActions } from '../presentation/runner'
import { PRESENTATION_STEPS, type PresentationAction } from '../presentation/steps'
import { HISTORY_STEPS } from '../presentation/history'
import { getYear } from '../lib/graph'
import { TIMELINE_MAX, TIMELINE_MIN, useAppStore } from '../store/appStore'
import { DOMAINS } from '../types/skill'

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
    density: 'streamline',
    presentation: { active: false, index: 0, mode: 'apresentacao', trail: [] },
    focus: null,
    fit: null,
    positions: {},
  })
})

const COMPANIES = new Set(SKILLS.flatMap((s) => s.metadata.companies))

describe('roteiro da apresentação', () => {
  it('tem passos suficientes e cada um com título e texto', () => {
    expect(PRESENTATION_STEPS.length).toBeGreaterThanOrEqual(12)
    for (const step of PRESENTATION_STEPS) {
      expect(step.title.length, step.id).toBeGreaterThan(3)
      expect(step.body.length, step.id).toBeGreaterThan(0)
    }
  })

  it('ids dos passos são únicos e no formato kebab-case', () => {
    const ids = PRESENTATION_STEPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('o primeiro passo enquadra a árvore e o último também', () => {
    expect(PRESENTATION_STEPS[0].actions).toContainEqual({ kind: 'fit' })
    expect(PRESENTATION_STEPS.at(-1)?.actions).toContainEqual({ kind: 'fit' })
  })

  it('toda ação aponta para algo que existe', () => {
    const benchmarkIds = new Set(BENCHMARKS.map((b) => b.id))
    for (const step of PRESENTATION_STEPS) {
      for (const action of step.actions) {
        const where = `${step.id}: ${action.kind}`
        switch (action.kind) {
          case 'focus':
          case 'open':
            expect(SKILL_BY_ID.has(action.skillId), where).toBe(true)
            break
          case 'source': {
            const skill = SKILL_BY_ID.get(action.skillId)
            expect(skill, where).toBeDefined()
            expect(skill?.content.sources[action.index], where).toBeDefined()
            break
          }
          case 'benchmark':
            if (action.id !== null) expect(benchmarkIds.has(action.id), where).toBe(true)
            break
          case 'year':
            expect(action.year, where).toBeGreaterThanOrEqual(TIMELINE_MIN)
            expect(action.year, where).toBeLessThanOrEqual(TIMELINE_MAX)
            break
          case 'filter':
            for (const d of action.domains ?? []) expect(DOMAINS, where).toContain(d)
            for (const c of action.companies ?? []) expect(COMPANIES.has(c), where).toBe(true)
            break
          default:
            break
        }
      }
    }
  })
})

describe('executor de ações', () => {
  it('filter define as categorias de uma vez e zera as que não foram informadas', () => {
    useAppStore.setState({ companies: ['OpenAI'], statuses: ['research'] })
    runPresentationActions([{ kind: 'filter', domains: ['reasoning'] }])
    const s = useAppStore.getState()
    expect(s.domains).toEqual(['reasoning'])
    expect(s.companies).toEqual([])
    expect(s.statuses).toEqual([])
  })

  it('source abre a habilidade e empilha a fonte pedida', () => {
    runPresentationActions([{ kind: 'source', skillId: 'llm', index: 0 }])
    const drawer = useAppStore.getState().drawer
    expect(drawer).toEqual([
      { kind: 'skill', id: 'llm' },
      { kind: 'source', skillId: 'llm', index: 0 },
    ])
  })

  it('year, benchmark, models e density chegam ao store', () => {
    runPresentationActions([
      { kind: 'year', year: 1990 },
      { kind: 'benchmark', id: 'swe-bench' },
      { kind: 'models', on: true },
      { kind: 'density', value: 'research' },
    ])
    const s = useAppStore.getState()
    expect(s.year).toBe(1990)
    expect(s.benchmarkId).toBe('swe-bench')
    expect(s.showModels).toBe(true)
    expect(s.density).toBe('research')
  })

  it('fit e focus geram pedidos de câmera com nonce novo', () => {
    runPresentationActions([{ kind: 'fit' }, { kind: 'focus', skillId: 'llm' }])
    expect(useAppStore.getState().fit?.nonce).toBeGreaterThan(0)
    expect(useAppStore.getState().focus?.id).toBe('llm')
  })

  it('layout padrao limpa posições e auto as preenche para todas as habilidades', () => {
    runPresentationActions([{ kind: 'layout', value: 'auto' }])
    expect(Object.keys(useAppStore.getState().positions)).toHaveLength(SKILLS.length)
    runPresentationActions([{ kind: 'layout', value: 'padrao' }])
    expect(useAppStore.getState().positions).toEqual({})
  })

  it('toda ação conhecida é executável sem erro', () => {
    const all: PresentationAction[] = [
      { kind: 'fit' },
      { kind: 'focus', skillId: 'llm' },
      { kind: 'open', skillId: 'llm' },
      { kind: 'source', skillId: 'llm', index: 0 },
      { kind: 'closeDrawer' },
      { kind: 'filter', domains: ['compute'] },
      { kind: 'clearFilters' },
      { kind: 'year', year: 2000 },
      { kind: 'benchmark', id: null },
      { kind: 'models', on: false },
      { kind: 'density', value: 'streamline' },
      { kind: 'layout', value: 'padrao' },
    ]
    expect(() => runPresentationActions(all)).not.toThrow()
  })
})

describe('store da apresentação', () => {
  it('start, goToStep, next e prev respeitam os limites', () => {
    const s = useAppStore.getState()
    s.startPresentation()
    expect(useAppStore.getState().presentation).toEqual({ active: true, index: 0, mode: 'apresentacao', trail: [] })
    useAppStore.getState().prevStep()
    expect(useAppStore.getState().presentation.index).toBe(0)
    useAppStore.getState().goToStep(999)
    expect(useAppStore.getState().presentation.index).toBe(PRESENTATION_STEPS.length - 1)
    useAppStore.getState().nextStep()
    expect(useAppStore.getState().presentation.index).toBe(PRESENTATION_STEPS.length - 1)
  })

  it('stop desativa sem perder o passo', () => {
    useAppStore.getState().startPresentation()
    useAppStore.getState().goToStep(4)
    useAppStore.getState().stopPresentation()
    expect(useAppStore.getState().presentation).toEqual({ active: false, index: 4, mode: 'apresentacao', trail: [0] })
  })
})

describe('busca', () => {
  it('normaliza acentos e maiúsculas', () => {
    expect(normalizeText('Ética & Governança')).toBe('etica & governanca')
  })

  it('não encontra nada com a consulta vazia', () => {
    expect(searchSkills('   ', SKILLS)).toEqual([])
  })

  it('nome que começa com o termo vem antes de nome que só contém', () => {
    const results = searchSkills('mod', SKILLS)
    expect(results.length).toBeGreaterThan(0)
    const first = results[0].name.toLowerCase()
    expect(first.startsWith('mod') || first.includes(' mod')).toBe(true)
  })

  it('encontra sem acento: "governanca" acha "Governança"', () => {
    const hits = searchSkills('governanca', SKILLS).map((s) => s.name)
    expect(hits.some((n) => n.includes('Governança'))).toBe(true)
  })

  it('não repete réplicas', () => {
    const results = searchSkills('attention', SKILLS)
    expect(results.every((r) => !r.isDuplicateInstance)).toBe(true)
    expect(results[0].id).toBe('attention')
  })

  it('respeita o limite de resultados', () => {
    expect(searchSkills('a', SKILLS, 3).length).toBeLessThanOrEqual(3)
  })
})

describe('foco e borda da apresentação', () => {
  it('a etapa marca como foco a habilidade que ela explica, mesmo com a gaveta fechada', async () => {
    const { runPresentationActions: run } = await import('../presentation/runner')
    run([{ kind: 'closeDrawer' }, { kind: 'focus', skillId: 'transformer' }])
    expect(useAppStore.getState().presentationFocus).toBe('transformer')
    expect(useAppStore.getState().drawer).toEqual([])
  })

  it('uma etapa só de enquadrar limpa o foco de habilidade', async () => {
    const { runPresentationActions: run } = await import('../presentation/runner')
    run([{ kind: 'focus', skillId: 'llm' }])
    run([{ kind: 'fit' }])
    expect(useAppStore.getState().presentationFocus).toBeNull()
  })

  it('com gaveta aberta, a habilidade da gaveta tem prioridade sobre o passo', async () => {
    const { activeFocusOf } = await import('../store/appStore')
    expect(activeFocusOf({ drawer: [{ kind: 'skill', id: 'llm' }], presentationFocus: 'transformer' })).toBe('llm')
    expect(activeFocusOf({ drawer: [], presentationFocus: 'transformer' })).toBe('transformer')
    expect(activeFocusOf({ drawer: [], presentationFocus: null })).toBeNull()
  })

  it('stop limpa o foco da apresentação', () => {
    useAppStore.setState({ presentationFocus: 'llm' })
    useAppStore.getState().stopPresentation()
    expect(useAppStore.getState().presentationFocus).toBeNull()
  })

  it('todo passo que centraliza uma habilidade fecha a gaveta antes, para foco e gaveta baterem', () => {
    for (const step of PRESENTATION_STEPS) {
      const focusAt = step.actions.findIndex((a) => a.kind === 'focus')
      if (focusAt === -1) continue
      const closedBefore = step.actions.slice(0, focusAt).some((a) => a.kind === 'closeDrawer')
      expect(closedBefore, `${step.id} centraliza sem fechar a gaveta`).toBe(true)
    }
  })

  it('todo passo enquadra a árvore ou centraliza uma habilidade', () => {
    for (const step of PRESENTATION_STEPS) {
      const frames = step.actions.some((a) => a.kind === 'fit' || a.kind === 'focus' || a.kind === 'open' || a.kind === 'source')
      expect(frames, `${step.id} não tem câmera definida`).toBe(true)
    }
  })
})

describe('roteiro da História da IA', () => {
  // Simula a apresentação do começo ao fim, na ordem dos passos, como o usuário veria.
  function replay(): Array<{ id: string; year: number; focus: string | null }> {
    let year = TIMELINE_MAX
    return HISTORY_STEPS.map((step) => {
      let focus: string | null = null
      for (const action of step.actions) {
        if (action.kind === 'year') year = action.year
        if (action.kind === 'focus') focus = action.skillId
      }
      return { id: step.id, year, focus }
    })
  }

  it('ids são únicos e no formato kebab-case', () => {
    const ids = HISTORY_STEPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('começa em 1950 e termina em 2026', () => {
    const years = replay().map((r) => r.year)
    expect(years[0]).toBe(TIMELINE_MIN)
    expect(years.at(-1)).toBe(TIMELINE_MAX)
  })

  it('os anos da história só andam para a frente', () => {
    const yearActions = HISTORY_STEPS.flatMap((s) => s.actions).flatMap((a) => (a.kind === 'year' ? [a.year] : []))
    for (let i = 1; i < yearActions.length; i++) {
      expect(yearActions[i], `ano ${yearActions[i]} volta antes de ${yearActions[i - 1]}`).toBeGreaterThanOrEqual(yearActions[i - 1])
    }
  })

  it('a habilidade em foco de cada passo já existe no ano do passo, então não fica em névoa', () => {
    for (const { id, year, focus } of replay()) {
      if (!focus) continue
      const skill = SKILL_BY_ID.get(focus)
      expect(skill, `${id}: ${focus} não existe`).toBeDefined()
      expect(getYear(skill?.metadata.dateIntroduced ?? ''), `${id}: ${focus} ainda não existia em ${year}`).toBeLessThanOrEqual(year)
    }
  })

  it('cada passo da História ocupa a câmera: centraliza uma habilidade ou enquadra a árvore', () => {
    for (const step of HISTORY_STEPS) {
      const frames = step.actions.some((a) => a.kind === 'fit' || a.kind === 'focus' || a.kind === 'open')
      expect(frames, `${step.id} sem câmera`).toBe(true)
    }
  })

  it('todo passo que centraliza fecha a gaveta antes', () => {
    for (const step of HISTORY_STEPS) {
      const focusAt = step.actions.findIndex((a) => a.kind === 'focus')
      if (focusAt === -1) continue
      expect(step.actions.slice(0, focusAt).some((a) => a.kind === 'closeDrawer'), step.id).toBe(true)
    }
  })

  it('a história tem pelo menos uma etapa por década de 1950 a 2020', () => {
    const decades = new Set(replay().map((r) => Math.floor(r.year / 10) * 10))
    for (const d of [1950, 1990, 2010, 2020]) expect(decades.has(d), `década ${d}`).toBe(true)
  })
})

describe('modo da apresentação', () => {
  it('startPresentation("historia") entra no roteiro histórico', () => {
    useAppStore.getState().startPresentation('historia')
    expect(useAppStore.getState().presentation).toEqual({ active: true, index: 0, mode: 'historia', trail: [] })
  })

  it('navegação respeita o tamanho do roteiro do modo ativo', () => {
    useAppStore.getState().startPresentation('historia')
    useAppStore.getState().goToStep(999)
    expect(useAppStore.getState().presentation.index).toBe(HISTORY_STEPS.length - 1)
    useAppStore.getState().startPresentation('apresentacao')
    useAppStore.getState().goToStep(999)
    expect(useAppStore.getState().presentation.index).toBe(PRESENTATION_STEPS.length - 1)
  })
})

describe('estado-base dos passos', () => {
  it('um passo não herda filtro, ano, benchmark, modelos nem gaveta do anterior', async () => {
    const { runPresentationStep } = await import('../presentation/runner')
    runPresentationStep([
      { kind: 'filter', companies: ['OpenAI'] },
      { kind: 'year', year: 1990 },
      { kind: 'benchmark', id: 'swe-bench' },
      { kind: 'models', on: true },
      { kind: 'open', skillId: 'llm' },
    ])
    runPresentationStep([{ kind: 'fit' }])
    const s = useAppStore.getState()
    expect(s.companies).toEqual([])
    expect(s.domains).toEqual([])
    expect(s.year).toBe(TIMELINE_MAX)
    expect(s.benchmarkId).toBeNull()
    expect(s.showModels).toBe(false)
    expect(s.drawer).toEqual([])
  })

  it('o passo ainda aplica as próprias ações depois do estado-base', async () => {
    const { runPresentationStep } = await import('../presentation/runner')
    runPresentationStep([{ kind: 'year', year: 1958 }, { kind: 'focus', skillId: 'perceptron' }])
    expect(useAppStore.getState().year).toBe(1958)
    expect(useAppStore.getState().presentationFocus).toBe('perceptron')
  })
})

describe('voltar ao último passo visto', () => {
  it('desfaz o último salto, inclusive o de "Próximo", e para quando não há o que desfazer', () => {
    const s = useAppStore.getState()
    s.startPresentation()
    useAppStore.getState().goToStep(5)
    useAppStore.getState().nextStep()
    expect(useAppStore.getState().presentation.index).toBe(6)
    useAppStore.getState().backToLastSeen()
    expect(useAppStore.getState().presentation.index).toBe(5)
    useAppStore.getState().backToLastSeen()
    expect(useAppStore.getState().presentation.index).toBe(0)
    expect(useAppStore.getState().presentation.trail).toEqual([])
    useAppStore.getState().backToLastSeen()
    expect(useAppStore.getState().presentation.index).toBe(0)
  })

  it('ficar no mesmo passo não cria entrada, e a pilha não passa de 50', () => {
    useAppStore.getState().startPresentation()
    useAppStore.getState().goToStep(0)
    expect(useAppStore.getState().presentation.trail).toEqual([])
    for (let i = 0; i < 80; i++) useAppStore.getState().goToStep(i % 2)
    expect(useAppStore.getState().presentation.trail.length).toBeLessThanOrEqual(50)
  })
})
