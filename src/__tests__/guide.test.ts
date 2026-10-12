import { describe, expect, it } from 'vitest'
import { SKILL_BY_ID } from '../data'
import { describeHexagon } from '../guide/hexGuide'
import { summarizeSkill } from '../guide/skillSummary'
import { HISTORY_STEPS } from '../presentation/history'
import { PRESENTATION_STEPS } from '../presentation/steps'
import { faqItems, filterFaq } from '../guide/faq'
import { statusDetails, tierDetails } from '../guide/levels'
import { type SkillNode } from '../types/skill'

const FAQ = faqItems()
const TIER_DETAILS = tierDetails()
const STATUS_DETAILS = statusDetails()

const SKILLS_FOR_HEX = [...SKILL_BY_ID.values()]

const skill = (id: string): SkillNode => {
  const s = SKILL_BY_ID.get(id)
  if (!s) throw new Error(`habilidade ${id} não existe`)
  return s
}

describe('explicação do hexágono aberto', () => {
  const llm = skill('llm')

  it('lista as órbitas dos modelos quando a habilidade tem modelos', () => {
    const orbit = describeHexagon(llm).visual.find((v) => v.term === 'Órbitas')
    expect(orbit?.text).toContain('GPT-4')
  })

  it('o "De onde vem" nomeia cada pré-requisito, e o "Para onde vai" cada desbloqueio', () => {
    const guide = describeHexagon(llm)
    const from = guide.steps.find((s) => s.term === 'De onde vem')?.text ?? ''
    for (const id of llm.prerequisites) expect(from, id).toContain(skill(id).name)
    const to = guide.steps.find((s) => s.term === 'Para onde vai')?.text ?? ''
    for (const id of llm.unlocks) expect(to, id).toContain(skill(id).name)
  })

  it('uma base sem pré-requisitos é dita como base', () => {
    const from = describeHexagon(skill('perceptron')).steps.find((s) => s.term === 'De onde vem')?.text ?? ''
    expect(from).toContain('É uma base')
  })

  it('uma réplica diz que é réplica e aponta o endereço para a original', () => {
    const guide = describeHexagon(skill('attention-replica'))
    expect(guide.visual.find((v) => v.term === 'Contorno')?.text).toContain('réplica')
    expect(guide.steps.find((s) => s.term === 'Compartilhar')?.text).toContain('#habilidade=attention')
  })

  it('toda habilidade tem as mesmas perguntas de uso e nenhum texto vazio (exceto sem data)', () => {
    for (const s of SKILLS_FOR_HEX) {
      const guide = describeHexagon(s)
      const termsSteps = guide.steps.map((i) => i.term)
      expect(termsSteps, s.id).toEqual(['De onde vem', 'Para onde vai', 'Fontes', 'Como funciona', 'Benchmarks', 'No tempo', 'Compartilhar'])
      for (const item of [...guide.visual, ...guide.steps]) expect(item.text.length, `${s.id}: ${item.term}`).toBeGreaterThan(5)
    }
  })

  it('os benchmarks que medem a habilidade aparecem no "Benchmarks"', () => {
    const bench = describeHexagon(skill('react')).steps.find((s) => s.term === 'Benchmarks')?.text ?? ''
    expect(bench).toContain('SWE-bench')
  })
})

describe('resumo da habilidade', () => {
  it('conta os pré-requisitos e os desbloqueios a partir dos dados', () => {
    const llm = skill('llm')
    const s = summarizeSkill(llm)
    const pre = s.facts.find((f) => f.label === 'Pré-requisitos')?.value ?? ''
    const unl = s.facts.find((f) => f.label === 'Desbloqueia')?.value ?? ''
    expect(pre.startsWith(`${llm.prerequisites.length}:`)).toBe(true)
    expect(unl.startsWith(`${llm.unlocks.length}:`)).toBe(true)
  })

  it('o parágrafo diz o patamar, a área e a maturidade', () => {
    const p = summarizeSkill(skill('llm')).paragraph
    expect(p).toContain('Modelos de Linguagem em Larga Escala (LLM)')
    expect(p).toContain('patamar T3')
    expect(p).toContain('Raciocínio & LLMs')
    expect(p).toContain('A maturidade desta habilidade é Produção')
  })

  it('uma base sem pré-requisitos é descrita como base', () => {
    const base = SKILL_BY_ID.get('perceptron') as SkillNode
    expect(base.prerequisites).toHaveLength(0)
    expect(summarizeSkill(base).paragraph).toContain('é uma base')
  })

  it('uma réplica aponta para a habilidade original', () => {
    const note = summarizeSkill(skill('attention-replica')).replicaNote ?? ''
    expect(note).toContain('réplica')
    expect(note).toContain('Attention Mechanism')
  })

  it('uma habilidade original não tem nota de réplica', () => {
    expect(summarizeSkill(skill('llm')).replicaNote).toBeUndefined()
  })

  it('lista os modelos que orbitam a habilidade', () => {
    const models = summarizeSkill(skill('llm')).facts.find((f) => f.label === 'Modelos')?.value ?? ''
    expect(models).toContain('GPT-4')
  })
})

describe('perguntas frequentes', () => {
  it('ids únicos, cada pergunta com resposta', async () => {
    const ids = FAQ.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of FAQ) {
      expect(f.question.endsWith('?'), f.id).toBe(true)
      expect(f.answer.length, f.id).toBeGreaterThan(0)
    }
  })

  it('os números citados batem com os roteiros reais', async () => {
    const all = FAQ.flatMap((f) => f.answer).join(' ')
    expect(all).toContain(`${PRESENTATION_STEPS.length} passos`)
    expect(all).toContain(`${HISTORY_STEPS.length} passos`)
  })

  it('a pesquisa acha pela pergunta e pela resposta, sem se importar com acentos', async () => {
    expect(filterFaq(FAQ, '')).toHaveLength(FAQ.length)
    expect(filterFaq(FAQ, 'NÉVOA').map((f) => f.id)).toContain('nevoa')
    expect(filterFaq(FAQ, 'placar oficial').map((f) => f.id)).toContain('placares')
    expect(filterFaq(FAQ, 'xyzzy-nao-existe')).toEqual([])
  })
})

describe('FAQ traz os patamares e as maturidades', () => {
  it('há uma pergunta para cada patamar T1 a T5 e uma para cada maturidade, com a explicação completa', async () => {
    for (const t of TIER_DETAILS) {
      const item = FAQ.find((f) => f.id === `patamar-t${t.tier}`)
      expect(item, `T${t.tier} no FAQ`).toBeDefined()
      expect(item?.question).toContain(`T${t.tier}`)
      expect(item?.answer.join(' ')).toContain(t.explanation[0])
    }
    for (const m of STATUS_DETAILS) {
      const item = FAQ.find((f) => f.id === `maturidade-${m.status}`)
      expect(item, `${m.name} no FAQ`).toBeDefined()
      expect(item?.question).toContain(m.name)
      expect(item?.answer.join(' ')).toContain(m.explanation[0])
    }
  })

  it('as perguntas de patamar e maturidade trazem exemplos da árvore', async () => {
    const detail = FAQ.filter((f) => f.id.startsWith('patamar-') || f.id.startsWith('maturidade-'))
    expect(detail).toHaveLength(9)
    for (const f of detail) expect(f.answer.join(' '), f.id).toMatch(/Exemplos: /)
  })
})
