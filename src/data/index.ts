import { normalizeSkills } from '../lib/graph'
import type { SkillNode } from '../types/skill'
import { ALIGNMENT_SKILLS } from './skills/alignment'
import { ARCHITECTURE_SKILLS } from './skills/architectures'
import { COMPUTE_SKILLS } from './skills/compute'
import { REASONING_SKILLS } from './skills/reasoning'
import { ROBOTICS_SKILLS } from './skills/robotics'

export { BENCHMARKS } from './benchmarks'
export { MODELS } from './models'

/** Grafo completo, com `unlocks` derivado. Para adicionar uma habilidade, inclua um objeto na área certa. */
export const SKILLS: SkillNode[] = normalizeSkills([
  ...ARCHITECTURE_SKILLS,
  ...COMPUTE_SKILLS,
  ...REASONING_SKILLS,
  ...ROBOTICS_SKILLS,
  ...ALIGNMENT_SKILLS,
])

export const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]))
