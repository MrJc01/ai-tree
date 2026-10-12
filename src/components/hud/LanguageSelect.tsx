import { Globe } from 'lucide-react'
import { LOCALES, type Locale } from '../../i18n/locales'
import { t } from '../../i18n'
import { useAppStore } from '../../store/appStore'

/** Seletor de idioma do cabeçalho. A troca é imediata: a interface e o conteúdo mudam na própria página. */
export function LanguageSelect() {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)

  return (
    <div className="relative inline-flex h-8 items-center">
      <Globe size={14} aria-hidden className="pointer-events-none absolute left-2 text-(--t-text-muted)" />
      <select
        aria-label={t('app.language')}
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="h-8 cursor-pointer appearance-none rounded-md border border-(--t-border) bg-transparent pr-2 pl-7 font-mono text-[11px] text-(--t-text-muted) transition-colors hover:text-(--t-text)"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  )
}
