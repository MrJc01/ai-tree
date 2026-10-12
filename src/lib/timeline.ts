import type { HistoryEvent } from '../types/skill'

/** Ordem da timeline: cronológica crescente, decrescente, ou pelo impacto (depois pelo ano). */
export type HistoryOrder = 'desc' | 'asc' | 'impact'

/** Devolve uma cópia ordenada. Não altera a lista original. */
export function sortHistory(events: HistoryEvent[], order: HistoryOrder): HistoryEvent[] {
  const copy = [...events]
  if (order === 'asc') return copy.sort((a, b) => a.year - b.year)
  if (order === 'desc') return copy.sort((a, b) => b.year - a.year)
  return copy.sort((a, b) => b.importance - a.importance || a.year - b.year)
}
