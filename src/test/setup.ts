import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// React Flow mede os nós com ResizeObserver, que o jsdom não tem.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver

afterEach(() => {
  cleanup()
  localStorage.clear()
})

// O hook de tamanho (useMedia) consulta matchMedia, que o jsdom não tem. Consultas de min-width seguem a largura
// da janela do jsdom (1024px por padrão, ou seja, desktop); as demais não batem.
window.matchMedia = (query: string) => {
  const min = /min-width:\s*(\d+)px/.exec(query)
  const matches = min ? window.innerWidth >= Number(min[1]) : false
  return {
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList
}
