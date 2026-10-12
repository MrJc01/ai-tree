import type { SkillNode, SkillSeed } from '../types/skill'

/**
 * Preenche `unlocks` a partir de `prerequisites`. Assim cada aresta é declarada uma única vez,
 * no nó que depende, e não existe risco de os dois lados ficarem diferentes.
 */
export function normalizeSkills(seeds: SkillSeed[]): SkillNode[] {
  const unlocks = new Map<string, string[]>(seeds.map((s) => [s.id, []]))
  for (const seed of seeds) {
    for (const prereq of seed.prerequisites) {
      const list = unlocks.get(prereq)
      if (list && !list.includes(seed.id)) list.push(seed.id)
    }
  }
  return seeds.map((seed) => ({ ...seed, unlocks: unlocks.get(seed.id) ?? [] }))
}

/** Ano de uma data `YYYY` ou `YYYY-MM`. Retorna NaN se o formato não for reconhecido. */
export function getYear(dateIntroduced: string): number {
  return Number.parseInt(dateIntroduced.slice(0, 4), 10)
}

const HOST_LABELS: Record<string, string> = {
  'arxiv.org': 'arXiv',
  'doi.org': 'DOI',
  'github.com': 'GitHub',
  'huggingface.co': 'Hugging Face',
  'en.wikipedia.org': 'Wikipedia',
  'distill.pub': 'Distill',
  'transformer-circuits.pub': 'Transformer Circuits',
  'papers.nips.cc': 'NeurIPS',
  'www.nature.com': 'Nature',
  'arena.ai': 'Arena',
  'anthropic.com': 'Anthropic',
  'www.anthropic.com': 'Anthropic',
  'blog.google': 'Google',
  'openai.com': 'OpenAI',
}

/** Nome legível do site da fonte, usado como selo. Cai no hostname quando não há rótulo conhecido. */
export function sourceHost(url: string): string {
  try {
    const host = new URL(url).hostname
    return HOST_LABELS[host] ?? host.replace(/^www\./, '')
  } catch {
    return 'link'
  }
}
