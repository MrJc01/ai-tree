import { DEFAULT_LOCALE, isLocale, type Locale } from './locales'

const STORAGE_KEY = 'ai-tech-tree:locale'

/** Idioma em uso. Os componentes leem daqui na renderização; a árvore é remontada quando ele muda. */
let current: Locale = DEFAULT_LOCALE

export function currentLocale(): Locale {
  return current
}

export function setCurrentLocale(locale: Locale): void {
  current = locale
  if (typeof document !== 'undefined') document.documentElement.lang = locale === 'zh-CN' ? 'zh-CN' : locale
}

export function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage bloqueado: cai no padrão.
  }
  return DEFAULT_LOCALE
}

export function persistLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Sem persistência: vale só para esta página.
  }
}
