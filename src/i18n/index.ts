import { currentLocale } from './state'
import { en } from './ui/en'
import { pt, type UIKey } from './ui/pt'
import type { Locale } from './locales'

/** Dicionários dos idiomas ativos. Os outros estão em src/i18n/ui/ à espera de tradução completa. */
export const DICTS: Record<Locale, Record<UIKey, string>> = {
  pt,
  en,
}

/**
 * Texto da interface no idioma atual. Sem tradução, cai no português. {nome} é substituído por vars.nome.
 */
export function t(key: UIKey, vars?: Record<string, string | number>): string {
  const template = DICTS[currentLocale()][key] ?? pt[key]
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}
