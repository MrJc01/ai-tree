import { useEffect, useState } from 'react'

/** A partir de md (768px), a gaveta e a apresentação ficam ao lado; abaixo disso, sobem por baixo. */
export const DESKTOP_QUERY = '(min-width: 768px)'

/** Acompanha uma consulta de mídia e atualiza quando a janela muda de tamanho. */
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}
