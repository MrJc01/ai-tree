import { afterEach, describe, expect, it, vi } from 'vitest'
import { isFirstVisit, markVisited } from '../components/about/welcome'

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('slide Sobre: primeira visita', () => {
  it('a primeira visita abre o slide; depois de marcada, não abre mais', () => {
    expect(isFirstVisit()).toBe(true)
    markVisited()
    expect(isFirstVisit()).toBe(false)
  })

  it('com o armazenamento bloqueado, não abre a cada carregamento', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    expect(isFirstVisit()).toBe(false)
  })

  it('gravar com o armazenamento bloqueado não lança erro', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    expect(() => markVisited()).not.toThrow()
  })
})
