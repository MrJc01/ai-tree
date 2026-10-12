import { describe, expect, it } from 'vitest'
import { SKILLS } from '../data'
import { FAQ, TERMS } from '../guide/faq'
import { describeHexagon } from '../guide/hexGuide'
import { STATUS_DETAILS, TIER_DETAILS, statusExamples, tierExamples } from '../guide/levels'
import { TIER_LABELS, STATUS_LABELS } from '../lib/skillMeta'
import { MATURITY_STATUSES, type Tier } from '../types/skill'

const ORIGINALS = SKILLS.filter((s) => !s.isDuplicateInstance)
const TIERS: Tier[] = [1, 2, 3, 4, 5]

describe('patamares T1 a T5', () => {
  it('há uma explicação para cada patamar, sem repetir nenhum', () => {
    expect(TIER_DETAILS.map((t) => t.tier).sort()).toEqual(TIERS)
    for (const t of TIER_DETAILS) {
      expect(t.name, `T${t.tier}`).toBe(TIER_LABELS[t.tier])
      expect(t.explanation.length, `T${t.tier} explicação`).toBeGreaterThanOrEqual(2)
      expect(t.criteria.length, `T${t.tier} critérios`).toBeGreaterThanOrEqual(2)
      expect(t.position.length, `T${t.tier} posição`).toBeGreaterThan(40)
    }
  })

  it('os exemplos de cada patamar são de fato daquele patamar', () => {
    for (const tier of TIERS) {
      const { count, examples } = tierExamples(tier, 50)
      expect(count, `T${tier} tem habilidades`).toBeGreaterThan(0)
      const names = ORIGINALS.filter((s) => s.tier === tier).map((s) => s.name)
      expect(names.length).toBe(count)
      for (const e of examples) expect(names, `${e} não está no T${tier}`).toContain(e)
    }
  })

  it('as contagens dos patamares somam todas as habilidades originais', () => {
    const total = TIERS.reduce((sum, tier) => sum + tierExamples(tier).count, 0)
    expect(total).toBe(ORIGINALS.length)
  })
})

describe('maturidade', () => {
  it('há uma explicação para cada uma das quatro maturidades', () => {
    expect(STATUS_DETAILS.map((m) => m.status).sort()).toEqual([...MATURITY_STATUSES].sort())
    for (const m of STATUS_DETAILS) {
      expect(m.name, m.status).toBe(STATUS_LABELS[m.status])
      expect(m.explanation.length, m.status).toBeGreaterThanOrEqual(2)
      expect(m.recognize.length, m.status).toBeGreaterThanOrEqual(2)
    }
  })

  it('as contagens das maturidades somam todas as habilidades originais', () => {
    const total = MATURITY_STATUSES.reduce((sum, st) => sum + statusExamples(st).count, 0)
    expect(total).toBe(ORIGINALS.length)
  })

  it('os exemplos de cada maturidade têm essa maturidade', () => {
    for (const st of MATURITY_STATUSES) {
      const names = ORIGINALS.filter((s) => s.metadata.status === st).map((s) => s.name)
      for (const e of statusExamples(st, 50).examples) expect(names, e).toContain(e)
    }
  })
})

describe('separação entre Como usar e FAQ', () => {
  const guideText = SKILLS.flatMap((s) => {
    const g = describeHexagon(s)
    return [...g.visual, ...g.steps].map((item) => `${item.term} ${item.text}`)
  }).join('\n')

  it('Como usar não repete a explicação de patamar nem de maturidade (isso fica no FAQ)', () => {
    for (const t of TIER_DETAILS) expect(guideText, `T${t.tier}`).not.toContain(t.explanation[0])
    for (const m of STATUS_DETAILS) expect(guideText, m.name).not.toContain(m.explanation[0])
  })

  it('Como usar fala do hexágono, sem as seções gerais do manual antigo', () => {
    expect(guideText).not.toContain('Patamares e maturidade')
    expect(guideText).not.toContain('Exemplos de uso')
  })
})

describe('glossário e FAQ', () => {
  it('o glossário não define as maturidades (fica no FAQ) e aponta o patamar para o FAQ', () => {
    const terms = TERMS.map((g) => g.term)
    for (const m of STATUS_DETAILS) expect(terms, m.name).not.toContain(m.name)
    expect(TERMS.find((g) => g.term === 'Patamar')?.text).toContain('FAQ')
    expect(new Set(terms).size).toBe(terms.length)
  })

  it('o FAQ começa por "o que é a árvore" e o item de termos traz um parágrafo por termo', () => {
    expect(FAQ[0].id).toBe('o-que-e')
    expect(FAQ.find((f) => f.id === 'termos')?.answer).toHaveLength(TERMS.length)
  })
})
