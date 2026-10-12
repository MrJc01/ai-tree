// Gera public/og-image.png (1200x630), a imagem que aparece quando o link do site é compartilhado.
// Uso: npm run og
import { chromium } from '@playwright/test'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const template = resolve(here, 'og-image.html')
const output = resolve(here, '..', 'public', 'og-image.png')

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto(`file://${template}`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: output, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } })
  console.log('imagem salva em', output)
} finally {
  await browser.close()
}
