import type { ReactNode } from 'react'
import { useAppStore, type Density } from '../../store/appStore'

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded border border-(--t-border) px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-(--t-text-muted) uppercase ${className}`}
    >
      {children}
    </span>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="font-mono text-[10px] tracking-[0.16em] text-(--t-text-muted) uppercase">{title}</h3>
      {children}
    </section>
  )
}

/** Alterna entre Streamline e Research. Vale para toda a gaveta. */
export function DensityToggle() {
  const density = useAppStore((s) => s.density)
  const setDensity = useAppStore((s) => s.setDensity)
  const options: Array<{ value: Density; label: string }> = [
    { value: 'streamline', label: 'Streamline' },
    { value: 'research', label: 'Research' },
  ]
  return (
    <div role="group" aria-label="Densidade de dados" className="inline-flex rounded-md border border-(--t-border) p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={density === opt.value}
          onClick={() => setDensity(opt.value)}
          className={`rounded px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors ${
            density === opt.value ? 'bg-(--t-accent) text-(--t-bg)' : 'text-(--t-text-muted) hover:text-(--t-text)'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function Chip({
  children,
  onClick,
  active = false,
  title,
}: {
  children: ReactNode
  onClick?: () => void
  active?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
        active
          ? 'border-(--t-accent) bg-(--t-accent) text-(--t-bg)'
          : 'border-(--t-border) text-(--t-text-muted) hover:border-(--t-accent) hover:text-(--t-text)'
      }`}
    >
      {children}
    </button>
  )
}
