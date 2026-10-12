export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'ai-tech-tree:theme'

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage bloqueado (janela privada, políticas do navegador): cai no padrão.
  }
  return 'dark'
}

export function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Sem persistência: o tema vale só para esta sessão da página.
  }
}

/** Aplica o tema no <html>. Os tokens de cor em index.css dependem da classe `.dark`. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
}
