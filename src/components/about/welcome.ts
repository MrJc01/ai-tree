const KEY = 'ai-tech-tree:welcome-seen'

/**
 * Primeira visita neste navegador. Se o armazenamento estiver bloqueado, conta como visita já feita: sem
 * como lembrar, o aviso não pode abrir a cada carregamento.
 */
export function isFirstVisit(): boolean {
  try {
    return localStorage.getItem(KEY) === null
  } catch {
    return false
  }
}

export function markVisited(): void {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    // Armazenamento bloqueado: nada a guardar.
  }
}
