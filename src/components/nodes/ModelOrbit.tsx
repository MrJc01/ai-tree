import { motion } from 'framer-motion'
import type { ModelNode } from '../../types/skill'
import { HEX_RADIUS } from '../../lib/layout'

/** Distância do centro do hexágono até o centro de cada modelo. */
const ORBIT_R = HEX_RADIUS + 34
const SPIN = { duration: 42, repeat: Infinity, ease: 'linear' } as const

/**
 * Modelos orbitando um hexágono. O anel gira continuamente e cada etiqueta gira ao contrário,
 * para ficar sempre na horizontal.
 */
export function ModelOrbit({ models }: { models: ModelNode[] }) {
  return (
    <motion.div className="absolute top-1/2 left-1/2 size-0" animate={{ rotate: 360 }} transition={SPIN}>
      {models.map((model, i) => {
        const angle = (360 / models.length) * i
        return (
          <div key={model.id} className="absolute top-0 left-0 size-0" style={{ transform: `rotate(${angle}deg)` }}>
            <div
              className="absolute top-0 left-0"
              style={{ transform: `translate(${ORBIT_R}px, 0) translate(-50%, -50%)` }}
            >
              <motion.span
                title={`${model.name} · ${model.vendor} · ${model.releasedAt}`}
                className="pointer-events-auto flex h-5 items-center rounded-full border border-(--t-border) bg-(--t-surface) px-2 font-mono text-[9px] whitespace-nowrap text-(--t-text) shadow-sm"
                animate={{ rotate: [-angle, -angle - 360] }}
                transition={SPIN}
              >
                {model.name}
              </motion.span>
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
