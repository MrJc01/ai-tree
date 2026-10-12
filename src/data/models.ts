import type { ModelNode } from '../types/skill'

/**
 * Modelos que orbitam a habilidade correspondente quando a Camada de Modelos está ativa.
 * `orbits` aponta para a entidade original (não para uma réplica).
 */
export const MODELS: ModelNode[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    vendor: 'OpenAI',
    releasedAt: '2023-03',
    orbits: 'llm',
    url: 'https://arxiv.org/abs/2303.08774',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    vendor: 'OpenAI',
    releasedAt: '2024-05',
    orbits: 'llm',
    url: 'https://arxiv.org/abs/2410.21276',
  },
  {
    id: 'llama-3-8b',
    name: 'Llama 3 (8B)',
    vendor: 'Meta',
    releasedAt: '2024-04',
    orbits: 'llm',
    url: 'https://arxiv.org/abs/2407.21783',
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    vendor: 'Mistral AI',
    releasedAt: '2023-09',
    orbits: 'llm',
    url: 'https://arxiv.org/abs/2310.06825',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    vendor: 'Anthropic',
    releasedAt: '2024-06',
    orbits: 'constitutional-ai',
    url: 'https://www.anthropic.com/news/claude-3-5-sonnet',
  },
  {
    id: 'gemini-2-0',
    name: 'Gemini 2.0',
    vendor: 'Google DeepMind',
    releasedAt: '2024-12',
    orbits: 'multimodal-fm',
    url: 'https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    vendor: 'DeepSeek',
    releasedAt: '2025-01',
    orbits: 'reasoning-rl',
    url: 'https://arxiv.org/abs/2501.12948',
  },
]
