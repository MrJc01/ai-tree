import type { Locale } from '../locales'
import { currentLocale } from '../state'
import { enContent } from './en'
import type { ContentOverlay } from './types'

/**
 * Conteúdo traduzido por idioma. O português é a fonte e fica nos arquivos de dados, então um idioma
 * sem overlay (ou um campo que ele não traz) mostra o texto original.
 */
const OVERLAYS: Partial<Record<Locale, ContentOverlay>> = {
  en: enContent,
}

export function contentOverlay(locale: Locale = currentLocale()): ContentOverlay | undefined {
  return OVERLAYS[locale]
}
