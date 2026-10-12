import { currentLocale } from './state'
import { en } from './ui/en'
import { pt, type UIKey } from './ui/pt'
import { zhCN } from './ui/zh-CN'
import { de } from './ui/de'
import { es } from './ui/es'
import { fr } from './ui/fr'
import { itDict } from './ui/it'
import { ja } from './ui/ja'
import type { Locale } from './locales'

const DICTS: Record<Locale, Record<UIKey, string>> = {
  pt,
  en,
  es,
  fr,
  de,
  it: itDict,
  ja,
  'zh-CN': zhCN,
}

/**
 * Texto da interface no idioma atual. Sem tradução, cai no português. {nome} é substituído por vars.nome.
 */
export function t(key: UIKey, vars?: Record<string, string | number>): string {
  const template = DICTS[currentLocale()][key] ?? pt[key]
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match))
}
