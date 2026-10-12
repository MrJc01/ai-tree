/**
 * Idiomas disponíveis no seletor. Por enquanto só português (fonte) e inglês estão completos.
 * Os dicionários dos outros idiomas continuam em src/i18n/ui/ e docs/CHECKLIST.md tem o que falta
 * para reativá-los: basta devolvê-los a esta lista e ao DICTS de src/i18n/index.ts.
 */
export const LOCALES = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
] as const

export type Locale = (typeof LOCALES)[number]['code']
export const DEFAULT_LOCALE: Locale = 'pt'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && LOCALES.some((l) => l.code === value)
}
