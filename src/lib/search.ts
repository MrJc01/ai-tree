import type { SkillNode } from '../types/skill'

/** Minúsculas e sem acentos, para que "Rede" encontre "rede" e "Ética" encontre "etica". */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Busca de habilidades por nome. Ordena por relevância: nome que começa com o termo vem antes de
 * nome que só contém o termo, e palavra inteira antes de trecho. Réplicas não aparecem: a original já está na lista.
 */
export function searchSkills(query: string, skills: SkillNode[], limit = 8): SkillNode[] {
  const q = normalizeText(query)
  if (!q) return []

  const scored: Array<{ skill: SkillNode; score: number }> = []
  for (const skill of skills) {
    if (skill.isDuplicateInstance) continue
    const name = normalizeText(skill.name)
    let score: number
    if (name.startsWith(q)) score = 0
    else if (name.split(/[\s()/,-]+/).some((word) => word.startsWith(q))) score = 1
    else if (name.includes(q)) score = 2
    else continue
    scored.push({ skill, score })
  }

  scored.sort((a, b) => a.score - b.score || a.skill.name.localeCompare(b.skill.name, 'pt-BR'))
  return scored.slice(0, limit).map((s) => s.skill)
}
