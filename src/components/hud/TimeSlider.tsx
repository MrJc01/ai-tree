import { TIMELINE_MAX, TIMELINE_MIN, useAppStore } from '../../store/appStore'

const TICKS = [1950, 1970, 1990, 2010, 2026]

/**
 * Time Machine: arrastar o slider apaga, em névoa, o que foi introduzido depois da data escolhida.
 * O grafo continua na mesma posição, só muda a opacidade.
 */
export function TimeSlider() {
  const year = useAppStore((s) => s.year)
  const setYear = useAppStore((s) => s.setYear)
  const label = year >= TIMELINE_MAX ? 'Presente' : String(year)

  return (
    <div className="absolute bottom-3 left-1/2 z-20 w-[min(640px,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-(--t-border) bg-(--t-surface) px-4 py-2.5 backdrop-blur-md">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor="time-slider" className="font-mono text-[10px] tracking-[0.16em] text-(--t-text-muted) uppercase">
          Linha do tempo
        </label>
        <output htmlFor="time-slider" className="font-mono text-[13px] text-(--t-text)">
          {label}
        </output>
      </div>
      <input
        id="time-slider"
        type="range"
        min={TIMELINE_MIN}
        max={TIMELINE_MAX}
        step={1}
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: 'var(--t-accent)' }}
      />
      <div className="mt-1 flex justify-between font-mono text-[9px] text-(--t-text-muted)">
        {TICKS.map((t) => (
          <span key={t}>{t === TIMELINE_MAX ? 'Presente' : t}</span>
        ))}
      </div>
    </div>
  )
}
