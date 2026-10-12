import { useEffect, useMemo, useRef, useState } from 'react'
import { localSkills } from '../../data/localized'
import { searchSkills } from '../../lib/search'
import { domainLabel } from '../../lib/skillMeta'
import { useAppStore } from '../../store/appStore'
import { t } from '../../i18n'

interface SearchBoxProps {
  /** Quando muda, o campo ganha o foco. O painel de filtros usa isso para a tecla /. */
  focusNonce: number
}

/**
 * Busca por nome, dentro do painel de filtros. Enter abre o primeiro resultado; clicar num resultado abre a
 * habilidade e centraliza a árvore nela. ESC limpa o campo.
 */
export function SearchBox({ focusNonce }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const openSkill = useAppStore((s) => s.openSkill)
  const results = useMemo(() => searchSkills(query, localSkills()), [query])

  useEffect(() => {
    if (focusNonce > 0) inputRef.current?.focus()
  }, [focusNonce])

  const choose = (id: string) => {
    openSkill(id)
    setQuery('')
    inputRef.current?.blur()
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) choose(results[0].id)
          if (e.key === 'Escape') {
            setQuery('')
            inputRef.current?.blur()
          }
        }}
        placeholder={t('search.placeholder')}
        aria-label={t('search.label')}
        className="w-full rounded-md border border-(--t-border) bg-(--t-surface) px-3 py-2 text-[13px] text-(--t-text) outline-none placeholder:text-(--t-text-muted) focus:border-(--t-accent)"
      />
      {query.trim() && (
        <ul role="listbox" aria-label={t('search.results')} className="max-h-64 space-y-0.5 overflow-y-auto">
          {results.map((s) => (
            <li key={s.id} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => choose(s.id)}
                className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left text-[13px] hover:bg-(--t-bg)"
              >
                <span className="min-w-0 truncate">{s.name}</span>
                <span className="shrink-0 font-mono text-[10px] text-(--t-text-muted)">
                  T{s.tier} · {domainLabel(s.domain)}
                </span>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2.5 py-2 text-[12px] text-(--t-text-muted)">{t('search.noResults')}</li>
          )}
        </ul>
      )}
    </div>
  )
}
