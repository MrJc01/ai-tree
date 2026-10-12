import { BENCHMARKS, MODELS, SKILL_BY_ID } from '../data'
import { getYear } from '../lib/graph'
import { DOMAIN_LABELS, getEntityKey, STATUS_LABELS, TIER_LABELS } from '../lib/skillMeta'
import type { SkillNode } from '../types/skill'

/**
 * Explicação do hexágono aberto. Fala só desta habilidade: o que cada parte dele significa para ela
 * e como usá-la. O texto geral do sistema fica no FAQ. Tudo sai dos dados, nada é escrito à mão.
 */

export interface HexItem {
  term: string
  text: string
}

export interface HexGuide {
  /** O que cada elemento visual deste hexágono significa. */
  visual: HexItem[]
  /** Como usar esta habilidade: onde clicar e o que cada aba mostra para ela. */
  steps: HexItem[]
}

const names = (ids: string[]): string[] =>
  ids.map((id) => SKILL_BY_ID.get(id)?.name).filter((n): n is string => Boolean(n))

export function describeHexagon(skill: SkillNode): HexGuide {
  const entity = getEntityKey(skill)
  const isReplica = Boolean(skill.isDuplicateInstance)
  const year = getYear(skill.metadata.dateIntroduced)
  const prereqs = names(skill.prerequisites)
  const unlocks = names(skill.unlocks)
  const models = MODELS.filter((m) => m.orbits === entity && !isReplica).map((m) => m.name)
  const benchmarks = BENCHMARKS.filter((b) => b.measures.includes(entity)).map((b) => b.name)
  const sources = skill.content.sources.length

  const visual: HexItem[] = [
    {
      term: 'Ponto colorido',
      text: isReplica
        ? `É a cor de assinatura de ${skill.name}. Esta é uma réplica: a mesma cor aparece na habilidade original.`
        : `É a cor de assinatura de ${skill.name}. É a identidade desta habilidade: ela aparece com essa cor em qualquer lugar da árvore.`,
    },
    {
      term: `Patamar T${skill.tier}`,
      text: `Este hexágono está na linha T${skill.tier} (${TIER_LABELS[skill.tier]}), na área ${DOMAIN_LABELS[skill.domain]}.`,
    },
    {
      term: `Selo "${STATUS_LABELS[skill.metadata.status]}"`,
      text: `A maturidade desta habilidade, escrita na base do hexágono.`,
    },
    {
      term: 'Contorno',
      text: isReplica
        ? 'Tracejado: esta é uma réplica. Os dados completos ficam na habilidade original.'
        : 'Contínuo: esta é a instância original da habilidade.',
    },
    {
      term: 'Borda azul',
      text: `Aparece enquanto ${skill.name} está em foco: aberta na gaveta, ou explicada no passo da apresentação.`,
    },
    {
      term: 'Cantoneiras',
      text: 'Aparecem com o mouse sobre o hexágono, ou quando um filtro ou benchmark destaca a habilidade.',
    },
    {
      term: 'Névoa',
      text: Number.isNaN(year)
        ? 'Sem data cadastrada.'
        : `${skill.name} só aparece com o Time Slider em ${year} ou depois. Antes disso, fica em névoa.`,
    },
  ]
  if (models.length) {
    visual.push({
      term: 'Órbitas',
      text: `Modelos ligados a esta habilidade: ${models.join(', ')}. Eles aparecem em volta do hexágono com o botão Modelos.`,
    })
  }

  const steps: HexItem[] = [
    {
      term: 'De onde vem',
      text: prereqs.length
        ? `Aba Grafo: os pré-requisitos são ${prereqs.join(', ')}. Clique em um para abri-lo.`
        : `Aba Grafo: ${skill.name} não depende de outra habilidade da árvore. É uma base.`,
    },
    {
      term: 'Para onde vai',
      text: unlocks.length
        ? `Aba Grafo: ela desbloqueia ${unlocks.join(', ')}. Clique em um para seguir a cadeia.`
        : `Ainda não desbloqueia outra habilidade desta árvore.`,
    },
    {
      term: 'Fontes',
      text: sources
        ? `Aba Fontes & Benchmarks: ${sources} fonte${sources > 1 ? 's' : ''}. Clique em uma para abrir a folha com o resumo e o link do original.`
        : 'Esta habilidade não tem fontes cadastradas.',
    },
    {
      term: 'Como funciona',
      text: skill.content.mermaidDiagram
        ? 'Aba Fluxograma: o diagrama de como a técnica funciona.'
        : 'Esta habilidade não tem fluxograma cadastrado.',
    },
    {
      term: 'Benchmarks',
      text: benchmarks.length
        ? `Aba Fontes & Benchmarks: ela é medida por ${benchmarks.join(', ')}. Clique em um benchmark para destacar as habilidades que ele mede.`
        : 'Nenhum benchmark da árvore mede esta habilidade diretamente.',
    },
    {
      term: 'No tempo',
      text: Number.isNaN(year)
        ? 'Sem data para usar no Time Slider.'
        : `Para ver ${skill.name} no mapa, arraste o Time Slider até ${year}.`,
    },
    {
      term: 'Compartilhar',
      text: `Copie o endereço da página: ele termina em #habilidade=${entity}, e abre esta habilidade para quem recebe.`,
    },
  ]

  return { visual, steps }
}
