// Gera os prints do slide "Sobre" em português e em inglês, a partir do servidor de desenvolvimento.
// Saída: public/sobre/<idioma>/1.png ... 5.png. Uso: npm run prints:sobre (com npm run dev rodando).
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
const settle = (page, ms = 1500) => page.waitForTimeout(ms)

// Rótulos da interface em cada idioma. Mudou um texto do app, atualize aqui.
const LABELS = {
  pt: {
    presentation: 'Apresentação',
    next: 'Próximo',
    end: 'Encerrar apresentação',
    guideTab: 'Como usar',
    autoArrange: 'Auto-organizar',
    benchmarks: 'Benchmarks',
  },
  en: {
    presentation: 'Presentation',
    next: 'Next',
    end: 'End presentation',
    guideTab: 'How to use',
    autoArrange: 'Auto-arrange',
    benchmarks: 'Benchmarks',
  },
}

const browser = await chromium.launch()
try {
  for (const [locale, L] of Object.entries(LABELS)) {
    const dir = `public/sobre/${locale}`
    mkdirSync(dir, { recursive: true })
    const context = await browser.newContext(desktop)
    // Visita já feita (o slide não abre sozinho) e idioma fixo para este conjunto de prints.
    await context.addInitScript((loc) => {
      localStorage.setItem('ai-tech-tree:welcome-seen', '1')
      localStorage.setItem('ai-tech-tree:locale', loc)
    }, locale)
    const page = await context.newPage()
    const shot = (name) => page.screenshot({ path: `${dir}/${name}` })

    // 1. Visão geral da árvore
    await page.goto(`${BASE}/`)
    await settle(page, 2500)
    await shot('1.png')

    // 2. Gaveta com a aba "Como usar" aberta
    await page.goto(`${BASE}/#habilidade=llm`)
    await settle(page, 2000)
    await page.getByRole('tab', { name: L.guideTab }).click()
    await settle(page, 1000)
    await shot('2.png')

    // 3. Apresentação: dois passos adiante
    await page.goto(`${BASE}/`)
    await settle(page, 1500)
    await page.getByRole('button', { name: L.presentation, exact: true }).click()
    await settle(page, 1200)
    await page.getByRole('button', { name: L.next, exact: true }).click()
    await settle(page, 800)
    await page.getByRole('button', { name: L.next, exact: true }).click()
    await settle(page, 2000)
    await shot('3.png')
    await page.getByRole('button', { name: L.end, exact: true }).click()
    await settle(page, 800)

    // 4. Benchmarks, com um destacado
    await page.goto(`${BASE}/`)
    await settle(page, 1500)
    await page.getByRole('button', { name: L.benchmarks, exact: true }).click()
    await settle(page, 1000)
    await shot('4.png')
    await page.getByRole('button', { name: L.benchmarks, exact: true }).click()
    await settle(page, 500)

    // 5. Organização automática
    await page.goto(`${BASE}/`)
    await settle(page, 1500)
    await page.getByRole('button', { name: L.autoArrange, exact: true }).click()
    await settle(page, 900)
    await shot('5.png')

    await context.close()
    console.log('prints salvos em', dir)
  }
} finally {
  await browser.close()
}
