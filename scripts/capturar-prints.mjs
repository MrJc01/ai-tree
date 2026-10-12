// Gera os prints do README a partir do servidor de desenvolvimento (npm run dev, porta 5173).
// Uso: npm run prints
import { chromium, devices } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const OUT = 'docs/img'
mkdirSync(OUT, { recursive: true })

const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
const celular = devices['Pixel 5']
const settle = (page, ms = 1500) => page.waitForTimeout(ms)
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}` })

const browser = await chromium.launch()
try {
  // Desktop, tema escuro (padrão)
  const escuro = await browser.newContext(desktop)
  const page = await escuro.newPage()

  await page.goto(`${BASE}/`)
  await settle(page, 2500)
  await shot(page, '01-visao-geral.png')

  await page.goto(`${BASE}/#habilidade=llm`)
  await settle(page, 2000)
  await page.getByRole('tab', { name: 'Como usar' }).click()
  await settle(page, 1000)
  await shot(page, '02-gaveta-como-usar.png')

  await page.goto(`${BASE}/`)
  await settle(page, 1500)
  await page.getByRole('button', { name: 'Apresentação' }).click()
  await settle(page, 1200)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await settle(page, 800)
  await page.getByRole('button', { name: 'Próximo' }).click()
  await settle(page, 2000)
  await shot(page, '03-apresentacao.png')
  await page.getByRole('button', { name: 'Encerrar apresentação' }).click()
  await settle(page, 800)

  await page.getByRole('button', { name: 'História' }).click()
  await settle(page, 1200)
  for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'Próximo' }).click()
  await settle(page, 2000)
  await shot(page, '04-historia.png')
  await page.getByRole('button', { name: 'Encerrar apresentação' }).click()
  await settle(page, 800)
  // Volta ao estado padrão (presente, sem névoa) para os próximos prints.
  await page.goto(`${BASE}/`)
  await settle(page, 1500)

  await page.getByRole('button', { name: 'Auto-organizar' }).click()
  await settle(page, 700)
  await shot(page, '05-auto-organizar.png')
  await page.keyboard.press('Escape')
  await settle(page, 400)

  await page.getByRole('button', { name: 'FAQ' }).click()
  await settle(page, 900)
  await page.getByRole('button', { name: /O que é a névoa/ }).click()
  await settle(page, 700)
  await shot(page, '06-faq.png')
  await page.getByRole('button', { name: 'FAQ' }).click()
  await settle(page, 500)

  await page.getByRole('button', { name: 'Benchmarks' }).click()
  await settle(page, 1000)
  await shot(page, '07-benchmarks.png')
  await escuro.close()

  // Desktop, tema claro
  const claro = await browser.newContext(desktop)
  const claroPage = await claro.newPage()
  await claroPage.goto(`${BASE}/`)
  await settle(claroPage, 1500)
  await claroPage.getByRole('button', { name: 'Trocar para o tema claro' }).click()
  await settle(claroPage, 1500)
  await shot(claroPage, '08-tema-claro.png')
  await claro.close()

  // Celular
  const phone = await browser.newContext({ ...celular })
  const phonePage = await phone.newPage()
  await phonePage.goto(`${BASE}/#habilidade=llm`)
  await settle(phonePage, 2500)
  await shot(phonePage, '09-celular-gaveta.png')
  await phonePage.goto(`${BASE}/`)
  await settle(phonePage, 2000)
  await phonePage.getByRole('button', { name: 'Menu' }).click()
  await settle(phonePage, 700)
  await shot(phonePage, '10-celular-menu.png')
  await phone.close()

  console.log('prints salvos em', OUT)
} finally {
  await browser.close()
}
