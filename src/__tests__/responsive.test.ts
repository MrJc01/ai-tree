import { describe, expect, it } from 'vitest'
import { coveredArea, drawerWidthIn, MOBILE_DRAWER_SHARE, MOBILE_PRESENTATION_SHARE } from '../lib/geometry'

describe('área coberta pela gaveta e pelo painel da apresentação', () => {
  const base = { width: 1200, height: 800 }

  it('no desktop, a gaveta cobre a direita pela largura dela, e sem gaveta não cobre nada', () => {
    expect(coveredArea({ ...base, desktop: true, drawerOpen: true, presenting: false })).toEqual({
      axis: 'x',
      px: drawerWidthIn(1200),
    })
    expect(coveredArea({ ...base, desktop: true, drawerOpen: false, presenting: true })).toEqual({ axis: 'x', px: 0 })
  })

  it('no celular, a gaveta cobre a parte de baixo com 60% da altura', () => {
    expect(coveredArea({ width: 375, height: 700, desktop: false, drawerOpen: true, presenting: false })).toEqual({
      axis: 'y',
      px: 700 * MOBILE_DRAWER_SHARE,
    })
  })

  it('no celular, o painel da apresentação cobre 40%, e a gaveta tem prioridade quando as duas estão abertas', () => {
    expect(coveredArea({ width: 375, height: 700, desktop: false, drawerOpen: false, presenting: true })).toEqual({
      axis: 'y',
      px: 700 * MOBILE_PRESENTATION_SHARE,
    })
    expect(coveredArea({ width: 375, height: 700, desktop: false, drawerOpen: true, presenting: true })).toEqual({
      axis: 'y',
      px: 700 * MOBILE_DRAWER_SHARE,
    })
  })
})
