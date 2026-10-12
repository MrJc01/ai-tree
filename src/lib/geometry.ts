import type { SkillNode } from '../types/skill'

/** Raio do hexágono (vértice a vértice, flat-top: a largura é 2R). */
export const HEX_RADIUS = 84
export const HEX_WIDTH = HEX_RADIUS * 2
export const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS

/**
 * Árvore em patamares: cada patamar é uma única linha horizontal. Dentro de cada área, as habilidades
 * do mesmo patamar ficam lado a lado em posições (slots), nunca empilhadas umas sobre as outras.
 */
export const SLOTS_PER_CELL = 3
export const SLOT_WIDTH = HEX_WIDTH + 24
export const DOMAIN_GAP = 72
export const BAND_WIDTH = SLOTS_PER_CELL * SLOT_WIDTH + DOMAIN_GAP

/** Espaço entre patamares. É nele que correm as trilhas horizontais das arestas, uma por aresta. */
export const ROW_GAP = 170
export const ROW_PITCH = HEX_HEIGHT + ROW_GAP
export const MARGIN_X = 230
export const MARGIN_Y = ROW_GAP

const TOP_TIER = 5

/** Canto superior esquerdo do patamar `row` (0 = topo, que é a ASI). */
export function rowTop(row: number): number {
  return MARGIN_Y + row * ROW_PITCH
}

/** Patamar mais próximo de uma altura. Usado para decidir a trilha de uma aresta, inclusive com nós arrastados. */
export function rowIndexOf(y: number): number {
  return Math.round((y - MARGIN_Y) / ROW_PITCH)
}

/** Faixa vertical livre acima do patamar `gap` (onde correm as trilhas): [topo, base]. */
export function gapBounds(gap: number): [number, number] {
  return [rowTop(gap - 1) + HEX_HEIGHT, rowTop(gap)]
}

/** Posição (canto superior esquerdo) de uma habilidade num slot da sua área. */
export function nodePositionAt(
  skill: Pick<SkillNode, 'gridCoordinates' | 'tier'>,
  slot: number,
): { x: number; y: number } {
  return {
    x: MARGIN_X + skill.gridCoordinates.col * BAND_WIDTH + slot * SLOT_WIDTH,
    y: rowTop(TOP_TIER - skill.tier),
  }
}

/** Posição padrão, usando o slot curado em `gridCoordinates.row`. */
export function nodePosition(skill: Pick<SkillNode, 'gridCoordinates' | 'tier'>): { x: number; y: number } {
  return nodePositionAt(skill, skill.gridCoordinates.row)
}

/**
 * Tamanho da gaveta: no máximo 620px e, em telas menores ou com o painel da apresentação aberto,
 * no máximo 60% da área do canvas. A câmera usa a mesma regra para centralizar na parte livre.
 */
export const DRAWER_MAX_WIDTH = 620
export const DRAWER_MAX_SHARE = 0.6
export const drawerWidthIn = (canvasWidth: number): number =>
  Math.min(DRAWER_MAX_WIDTH, canvasWidth * DRAWER_MAX_SHARE)
