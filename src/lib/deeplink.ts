/**
 * Link direto para uma habilidade: `#habilidade=llm`. Serve para compartilhar uma habilidade específica.
 * Só aceita ids no formato de habilidade (letras minúsculas, números e hífen). O resto é ignorado.
 */
export function skillIdFromHash(hash: string): string | null {
  const match = /^#habilidade=([a-z0-9-]+)$/.exec(hash)
  return match ? match[1] : null
}

export function hashForSkill(id: string | null): string {
  return id ? `#habilidade=${id}` : ''
}
