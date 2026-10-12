import { afterEach, describe, expect, it } from 'vitest'
import { contentOverlay } from '../i18n/content'
import { DICTS } from '../i18n'
import { LOCALES } from '../i18n/locales'
import { setCurrentLocale } from '../i18n/state'
import { pt } from '../i18n/ui/pt'
import { SKILLS } from '../data'
import { localSkillById, localSkills } from '../data/localized'

/** Variáveis {nome} de um texto, em ordem. Tradução precisa manter exatamente as mesmas. */
const placeholders = (text: string): string =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',')

afterEach(() => setCurrentLocale('pt'))

describe('dicionários da interface', () => {
  for (const { code } of LOCALES) {
    it(`${code} tem as mesmas chaves do português`, () => {
      expect(Object.keys(DICTS[code]).sort()).toEqual(Object.keys(pt).sort())
    })

    it(`${code} mantém as variáveis {…} de cada texto`, () => {
      for (const key of Object.keys(pt) as Array<keyof typeof pt>) {
        expect(placeholders(DICTS[code][key]), key).toBe(placeholders(pt[key]))
      }
    })

    it(`${code} não deixa texto vazio`, () => {
      for (const key of Object.keys(pt) as Array<keyof typeof pt>) {
        expect(DICTS[code][key].trim(), key).not.toBe('')
      }
    })
  }
})

describe('overlays de conteúdo', () => {
  for (const { code } of LOCALES) {
    const overlay = contentOverlay(code)
    if (!overlay) continue

    it(`${code}: cada habilidade traduzida existe e tem listas do mesmo tamanho`, () => {
      for (const [id, o] of Object.entries(overlay.skills)) {
        const seed = SKILLS.find((s) => s.id === id)
        expect(seed, `id ${id} inexistente`).toBeDefined()
        if (!seed) continue
        const c = seed.content
        if (o.history) expect(o.history.length, `${id} history`).toBe(c.history.length)
        if (o.actors) expect(o.actors.length, `${id} actors`).toBe(c.actors.length)
        if (o.equations) expect(o.equations.length, `${id} equations`).toBe(c.equations?.length ?? 0)
        if (o.sources) expect(o.sources.length, `${id} sources`).toBe(c.sources.length)
        if (o.mermaid) expect(c.mermaidDiagram, `${id} mermaid sem diagrama original`).toBeDefined()
        if (o.benchmarks) {
          expect(Object.keys(o.benchmarks).length, `${id} benchmarks`).toBe(Object.keys(c.benchmarks ?? {}).length)
        }
      }
    })

    it(`${code}: a habilidade localizada mantém id, área, patamar e links`, () => {
      setCurrentLocale(code)
      const localized = localSkills()
      expect(localized.map((s) => s.id)).toEqual(SKILLS.map((s) => s.id))
      for (const seed of SKILLS) {
        const s = localSkillById(seed.id)
        expect(s?.domain).toBe(seed.domain)
        expect(s?.tier).toBe(seed.tier)
        expect(s?.prerequisites).toEqual(seed.prerequisites)
        expect(s?.content.sources.map((x) => x.url)).toEqual(seed.content.sources.map((x) => x.url))
      }
    })
  }
})
