import type { Locale } from '../i18n/locales'
import { contentOverlay } from '../i18n/content'
import type { BenchmarkOverlay, SkillOverlay } from '../i18n/content/types'
import { currentLocale } from '../i18n/state'
import type { Benchmark, SkillNode } from '../types/skill'
import { BENCHMARKS } from './benchmarks'
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

/** Aplica a tradução de um benchmark. Nome, ids, links e datas continuam os do dado. */
function applyBenchmark(b: Benchmark, o: BenchmarkOverlay): Benchmark {
  return {
    ...b,
    description: o.description ?? b.description,
    reference: b.reference && o.reference ? { ...b.reference, ...o.reference } : b.reference,
    current: b.current && o.current ? { ...b.current, ...o.current } : b.current,
  }
}

interface LocalSkills {
  list: SkillNode[]
  byId: Map<string, SkillNode>
}

const skillCache = new Map<Locale, LocalSkills>()
const benchmarkCache = new Map<Locale, Benchmark[]>()

function buildSkills(locale: Locale): LocalSkills {
  const overlay = contentOverlay(locale)
  const list = overlay
    ? SKILLS.map((s) => (overlay.skills[s.id] ? applyOverlay(s, overlay.skills[s.id]) : s))
    : SKILLS
  return { list, byId: new Map(list.map((s) => [s.id, s])) }
}

function currentSkills(): LocalSkills {
  const locale = currentLocale()
  let entry = skillCache.get(locale)
  if (!entry) {
    entry = buildSkills(locale)
    skillCache.set(locale, entry)
  }
  return entry
}

/** Habilidades no idioma atual. No português são as próprias do arquivo de dados. */
export function localSkills(): SkillNode[] {
  return currentSkills().list
}

/** Uma habilidade no idioma atual, pelo `id` da instância. */
export function localSkillById(id: string): SkillNode | undefined {
  return currentSkills().byId.get(id)
}

/** Benchmarks no idioma atual. */
export function localBenchmarks(): Benchmark[] {
  const locale = currentLocale()
  let list = benchmarkCache.get(locale)
  if (!list) {
    const overlay = contentOverlay(locale)?.benchmarks
    list = overlay ? BENCHMARKS.map((b) => (overlay[b.id] ? applyBenchmark(b, overlay[b.id]) : b)) : BENCHMARKS
    benchmarkCache.set(locale, list)
  }
  return list
}
