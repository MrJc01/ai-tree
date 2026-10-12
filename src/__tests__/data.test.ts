import { describe, expect, it } from 'vitest'
import { BENCHMARKS, MODELS, SKILLS, SKILL_BY_ID } from '../data'
import { getEntityKey } from '../lib/skillMeta'
import { getYear } from '../lib/graph'
import { DOMAINS, MATURITY_STATUSES, type SkillNode } from '../types/skill'

const ORIGINALS = SKILLS.filter((s) => !s.isDuplicateInstance)
const REPLICAS = SKILLS.filter((s) => s.isDuplicateInstance)

/** Detecta ciclos na ordem de dependência. Um ciclo tornaria a árvore impossível de ler. */
function hasCycle(skills: SkillNode[]): boolean {
  const state = new Map<string, 'visiting' | 'done'>()
  const visit = (id: string): boolean => {
    const s = state.get(id)
    if (s === 'visiting') return true
    if (s === 'done') return false
    state.set(id, 'visiting')
    const node = SKILL_BY_ID.get(id)
    for (const p of node?.prerequisites ?? []) if (visit(p)) return true
    state.set(id, 'done')
    return false
  }
  return skills.some((s) => visit(s.id))
}

describe('catálogo de habilidades', () => {
  it('tem 51 habilidades distintas e a réplica de Attention', () => {
    expect(ORIGINALS).toHaveLength(51)
    expect(REPLICAS).toHaveLength(1)
    expect(REPLICAS[0].rootEntityId).toBe('attention')
  })

  it('cada área tem pelo menos oito habilidades originais', () => {
    for (const domain of DOMAINS) {
      const count = ORIGINALS.filter((s) => s.domain === domain).length
      expect(count, domain).toBeGreaterThanOrEqual(8)
    }
  })

  it('cada patamar de 1 a 5 tem pelo menos uma habilidade', () => {
    for (const tier of [1, 2, 3, 4, 5] as const) {
      expect(ORIGINALS.some((s) => s.tier === tier), `tier ${tier}`).toBe(true)
    }
  })

  it('ids são únicos', () => {
    const ids = SKILLS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('toda pré-requisito existe e nenhuma habilidade depende dela mesma', () => {
    for (const s of SKILLS) {
      expect(s.prerequisites, s.id).not.toContain(s.id)
      for (const p of s.prerequisites) expect(SKILL_BY_ID.has(p), `${s.id} -> ${p}`).toBe(true)
    }
  })

  it('não há ciclos de dependência', () => {
    expect(hasCycle(SKILLS)).toBe(false)
  })

  it('unlocks é o inverso exato de prerequisites', () => {
    for (const s of SKILLS) {
      for (const u of s.unlocks) expect(SKILL_BY_ID.get(u)?.prerequisites, `${s.id} desbloqueia ${u}`).toContain(s.id)
    }
    for (const s of SKILLS) {
      for (const p of s.prerequisites) expect(SKILL_BY_ID.get(p)?.unlocks, `${p} deve listar ${s.id}`).toContain(s.id)
    }
  })

  it('a coluna de cada habilidade bate com a ordem da área', () => {
    for (const s of SKILLS) expect(s.gridCoordinates.col, s.id).toBe(DOMAINS.indexOf(s.domain))
  })

  it('faixas ficam entre 0 e 2, e nenhuma célula tem duas habilidades na mesma faixa', () => {
    const seen = new Set<string>()
    for (const s of SKILLS) {
      expect(s.gridCoordinates.row).toBeGreaterThanOrEqual(0)
      expect(s.gridCoordinates.row).toBeLessThanOrEqual(2)
      const key = `${s.gridCoordinates.col}:${s.tier}:${s.gridCoordinates.row}`
      expect(seen.has(key), `posição repetida em ${key} (${s.id})`).toBe(false)
      seen.add(key)
    }
  })

  it('cada entidade original tem cor de assinatura própria', () => {
    const colors = ORIGINALS.map((s) => s.signatureColor)
    expect(new Set(colors).size).toBe(colors.length)
  })

  it('réplicas compartilham a cor e a entidade da original', () => {
    for (const r of REPLICAS) {
      const original = SKILL_BY_ID.get(r.rootEntityId ?? '')
      expect(original, r.id).toBeDefined()
      expect(r.signatureColor).toBe(original?.signatureColor)
      expect(getEntityKey(r)).toBe(getEntityKey(original as SkillNode))
      expect(r.name).toBe(original?.name)
      expect(r.prerequisites).toHaveLength(0)
    }
  })

  it('data de introdução é um ano plausível e o status é válido', () => {
    for (const s of SKILLS) {
      const year = getYear(s.metadata.dateIntroduced)
      expect(year, s.id).toBeGreaterThanOrEqual(1940)
      expect(year, s.id).toBeLessThanOrEqual(2026)
      expect(MATURITY_STATUSES).toContain(s.metadata.status)
    }
  })

  it('toda habilidade original tem visão geral, impacto e pelo menos uma fonte', () => {
    for (const s of ORIGINALS) {
      expect(s.content.overview.length, s.id).toBeGreaterThan(40)
      expect(s.content.impact.length, s.id).toBeGreaterThan(20)
      expect(s.content.sources.length, s.id).toBeGreaterThanOrEqual(1)
    }
  })

  it('toda fonte tem título e URL http(s) válida', () => {
    for (const s of SKILLS) {
      for (const src of s.content.sources) {
        expect(src.title.length, s.id).toBeGreaterThan(3)
        const url = new URL(src.url)
        expect(['http:', 'https:'], src.url).toContain(url.protocol)
      }
    }
  })

  it('diagramas e equações, quando existem, não estão vazios', () => {
    for (const s of SKILLS) {
      if (s.content.mermaidDiagram !== undefined) expect(s.content.mermaidDiagram.trim().length, s.id).toBeGreaterThan(10)
      for (const eq of s.content.equations ?? []) {
        expect(eq.label.length, s.id).toBeGreaterThan(0)
        expect(eq.expression.length, s.id).toBeGreaterThan(0)
      }
    }
  })
})

describe('modelos e benchmarks', () => {
  it('cada modelo orbita uma habilidade original existente', () => {
    for (const m of MODELS) {
      const target = SKILL_BY_ID.get(m.orbits)
      expect(target, m.id).toBeDefined()
      expect(target?.isDuplicateInstance, m.id).not.toBe(true)
      expect(m.releasedAt, m.id).toMatch(/^\d{4}-\d{2}$/)
      expect(new URL(m.url).protocol, m.id).toMatch(/^https?:$/)
    }
  })

  it('cada benchmark avalia entidades existentes e tem links válidos', () => {
    const keys = new Set(SKILLS.map((s) => getEntityKey(s)))
    for (const b of BENCHMARKS) {
      expect(b.measures.length, b.id).toBeGreaterThan(0)
      for (const id of b.measures) expect(keys.has(id), `${b.id} -> ${id}`).toBe(true)
      expect(new URL(b.paperUrl).protocol).toMatch(/^https?:$/)
      expect(new URL(b.officialUrl).protocol).toMatch(/^https?:$/)
    }
  })
})

describe('placares atuais dos benchmarks', () => {
  it('cada placar tem a data da leitura, a página de origem e o placar oficial, todos com links https', () => {
    const withCurrent = BENCHMARKS.filter((b) => b.current)
    expect(withCurrent.length).toBeGreaterThan(0)
    for (const b of withCurrent) {
      const c = b.current
      if (!c) continue
      expect(c.value.length, b.id).toBeGreaterThan(0)
      expect(c.leader.length, b.id).toBeGreaterThan(0)
      expect(c.checkedAt, b.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      if (c.sourceDate) expect(c.sourceDate, b.id).toMatch(/^\d{4}-\d{2}(-\d{2})?$/)
      expect(new URL(c.sourceUrl).protocol, b.id).toBe('https:')
      expect(new URL(c.officialUrl).protocol, b.id).toBe('https:')
    }
  })
})
