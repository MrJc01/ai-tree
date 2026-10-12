import { describe, expect, it } from 'vitest'
import { hashForSkill, skillIdFromHash } from '../lib/deeplink'
import { nearestInDirection, type Point } from '../lib/keynav'

describe('link direto', () => {
  it('lê a habilidade do hash', () => {
    expect(skillIdFromHash('#habilidade=llm')).toBe('llm')
    expect(skillIdFromHash('#habilidade=attention-replica')).toBe('attention-replica')
  })

  it('ignora hashes que não são de habilidade ou que tentam outro formato', () => {
    expect(skillIdFromHash('')).toBeNull()
    expect(skillIdFromHash('#outra=1')).toBeNull()
    expect(skillIdFromHash('#habilidade=../x')).toBeNull()
    expect(skillIdFromHash('#habilidade=LLM')).toBeNull()
  })

  it('gera o hash de volta e fica vazio sem habilidade', () => {
    expect(hashForSkill('llm')).toBe('#habilidade=llm')
    expect(hashForSkill(null)).toBe('')
    expect(skillIdFromHash(hashForSkill('transformer'))).toBe('transformer')
  })
})

describe('navegação por setas', () => {
  const grid: Point[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: 200, y: 0 },
    { id: 'c', x: 400, y: 0 },
    { id: 'd', x: 0, y: 200 },
    { id: 'e', x: 200, y: 200 },
  ]
  const at = (id: string) => grid.find((p) => p.id === id) as Point

  it('anda para o vizinho mais próximo na direção pedida', () => {
    expect(nearestInDirection(at('a'), 'right', grid)).toBe('b')
    expect(nearestInDirection(at('b'), 'right', grid)).toBe('c')
    expect(nearestInDirection(at('c'), 'left', grid)).toBe('b')
    expect(nearestInDirection(at('a'), 'down', grid)).toBe('d')
    expect(nearestInDirection(at('d'), 'up', grid)).toBe('a')
  })

  it('não sai da borda: sem nada naquela direção, devolve null', () => {
    expect(nearestInDirection(at('c'), 'right', grid)).toBeNull()
    expect(nearestInDirection(at('a'), 'up', grid)).toBeNull()
  })

  it('prefere seguir na mesma linha ou coluna a pular de coluna', () => {
    // de "a", descer: "d" está logo abaixo, "e" está na diagonal e mais longe
    expect(nearestInDirection(at('a'), 'down', grid)).toBe('d')
  })

  it('nunca devolve o próprio ponto', () => {
    expect(nearestInDirection(at('a'), 'right', [at('a')])).toBeNull()
  })
})

describe('apresentação salva na sessão', () => {
  it('lê um estado válido sem mudar nada', async () => {
    const { parsePresentation } = await import('../store/appStore')
    expect(parsePresentation('{"active":true,"index":4,"mode":"historia"}')).toEqual({ active: true, index: 4, mode: 'historia' })
  })

  it('volta ao padrão com dado ausente, JSON quebrado ou campos inválidos', async () => {
    const { parsePresentation } = await import('../store/appStore')
    const padrao = { active: false, index: 0, mode: 'apresentacao' }
    expect(parsePresentation(null)).toEqual(padrao)
    expect(parsePresentation('{quebrado')).toEqual(padrao)
    expect(parsePresentation('{"active":"sim","index":2}')).toEqual(padrao)
  })

  it('um índice fora do roteiro é ajustado para dentro dele, e modo desconhecido vira apresentação', async () => {
    const { parsePresentation } = await import('../store/appStore')
    expect(parsePresentation('{"active":true,"index":999,"mode":"apresentacao"}').index).toBe(16)
    expect(parsePresentation('{"active":true,"index":-5,"mode":"apresentacao"}').index).toBe(0)
    expect(parsePresentation('{"active":true,"index":2,"mode":"qualquer"}').mode).toBe('apresentacao')
  })
})
