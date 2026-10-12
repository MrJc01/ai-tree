import type { Locale } from '../i18n/locales'
import { contentOverlay } from '../i18n/content'
import type { SkillOverlay } from '../i18n/content/types'
import { currentLocale } from '../i18n/state'
import type { SkillNode } from '../types/skill'
import { SKILLS } from './index'

/** Aplica a tradução de uma habilidade. Campos sem tradução continuam como estão no dado. */
function applyOverlay(skill: SkillNode, o: SkillOverlay): SkillNode {
  const c = skill.content
  return {
    ...skill,
    name: o.name ?? skill.name,
    content: {
      ...c,
      overview: o.overview ?? c.overview,
      impact: o.impact ?? c.impact,
      mermaidDiagram: o.mermaid ?? c.mermaidDiagram,
      benchmarks: o.benchmarks ?? c.benchmarks,
      history: c.history.map((h, i) => ({ ...h, event: o.history?.[i] ?? h.event })),
      actors: c.actors.map((a, i) => ({ ...a, ...o.actors?.[i] })),
      equations: c.equations?.map((e, i) => ({ ...e, ...o.equations?.[i] })),
      sources: c.sources.map((s, i) => ({ ...s, ...o.sources?.[i] })),
    },
  }
}

interface LocalSkills {
  list: SkillNode[]
  byId: Map<string, SkillNode>
}

const cache = new Map<Locale, LocalSkills>()

function build(locale: Locale): LocalSkills {
  const overlay = contentOverlay(locale)
  const list = overlay
    ? SKILLS.map((s) => (overlay.skills[s.id] ? applyOverlay(s, overlay.skills[s.id]) : s))
    : SKILLS
  return { list, byId: new Map(list.map((s) => [s.id, s])) }
}

function current(): LocalSkills {
  const locale = currentLocale()
  let entry = cache.get(locale)
  if (!entry) {
    entry = build(locale)
    cache.set(locale, entry)
  }
  return entry
}

/** Habilidades no idioma atual. No português são as próprias do arquivo de dados. */
export function localSkills(): SkillNode[] {
  return current().list
}

/** Uma habilidade no idioma atual, pelo `id` da instância. */
export function localSkillById(id: string): SkillNode | undefined {
  return current().byId.get(id)
}
