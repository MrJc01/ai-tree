import { expect, test } from '@playwright/test'

// O slide Sobre abre sozinho na primeira visita e cobriria a página. Os testes começam com a visita já feita;
// o teste da primeira visita usa um contexto limpo.
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => localStorage.setItem('ai-tech-tree:welcome-seen', '1'))
})

test('primeira visita abre o slide Sobre, e a segunda visita não', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.reload()
  await expect(page.getByRole('dialog')).toBeHidden()
  await context.close()
})

test('link direto abre a habilidade, e a aba Como usar explica o hexágono aberto', async ({ page }) => {
  await page.goto('/#habilidade=llm')
  await expect(page.getByRole('heading', { name: 'Modelos de Linguagem em Larga Escala (LLM)' })).toBeVisible()
  await page.getByRole('tab', { name: 'Como usar' }).click()
  await expect(page.getByRole('heading', { name: 'Como ler este hexágono' })).toBeVisible()
  await expect(page.getByText(/Aba Grafo: os pré-requisitos são/)).toBeVisible()
})

test('a apresentação avança, e "voltar ao último visto" desfaz o salto', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no celular o início da apresentação fica no menu, coberto no teste do menu')
  await page.goto('/')
  await page.getByRole('button', { name: 'Apresentação' }).click()
  await expect(page.getByText('passo 1 de 17')).toBeVisible()
  await page.getByRole('button', { name: 'Próximo' }).click()
  await expect(page.getByText('passo 2 de 17')).toBeVisible()
  await page.getByRole('button', { name: /Voltar ao último visto/ }).click()
  await expect(page.getByText('passo 1 de 17')).toBeVisible()
})

test('Auto-organizar oferece quatro organizações e a escolha grava as posições', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no celular o Auto-organizar fica no menu')
  await page.goto('/')
  await page.getByRole('button', { name: 'Auto-organizar' }).click()
  const menu = page.getByRole('menu', { name: 'Tipo de organização' })
  await expect(menu.getByRole('menuitem')).toHaveCount(4)
  await menu.getByRole('menuitem', { name: /Alfabética/ }).click()
  await expect(menu).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('ai-tech-tree:positions:v2'))).not.toBeNull()
})

test('exportar gera um PNG de verdade, com a data no nome do arquivo', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no celular a exportação fica no menu')
  await page.goto('/')
  await page.getByRole('button', { name: 'Exportar' }).click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: /PNG · vista atual/ }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^ai-tree-vista-\d{4}-\d{2}-\d{2}\.png$/)
})

test('o Vault mostra o placar atual com a data da leitura e o link do placar oficial', async ({ page, isMobile }) => {
  test.skip(isMobile, 'o Vault do celular fica acima da barra do tempo; coberto pela checagem visual')
  await page.goto('/')
  await page.getByRole('button', { name: 'Benchmarks' }).click()
  await expect(page.getByText('Placar atual: 76,8%')).toBeVisible()
  await expect(page.getByRole('link', { name: /Placar oficial · swebench.com/ })).toHaveAttribute('href', 'https://www.swebench.com/')
})

test('no celular, o menu do cabeçalho liga a camada de modelos', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular')
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('menuitem', { name: /Modelos · desligados/ }).click()
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('menuitem', { name: /Modelos · ligados/ })).toBeVisible()
})

test('no celular, as abas da gaveta rolam pelas setas', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular, onde a faixa de abas de fato rola')
  await page.goto('/#habilidade=llm')
  await page.getByRole('button', { name: 'Rolar abas para a direita' }).click()
  await expect(page.getByRole('button', { name: 'Rolar abas para a esquerda' })).toBeVisible()
})

test('no celular, o menu exporta a vista como PNG', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular')
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: 'PNG · vista atual' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^ai-tree-vista-\d{4}-\d{2}-\d{2}\.png$/)
})

test('no celular, o menu inicia a apresentação no painel de baixo', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'só no celular')
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('menuitem', { name: /^Apresentação/ }).click()
  await expect(page.getByText('passo 1 de 17')).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Roteiro da apresentação' })).toBeVisible()
})

test('exportar a árvore inteira gera um PNG com o nome de árvore', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no celular a exportação fica no menu')
  await page.goto('/')
  await page.getByRole('button', { name: 'Exportar' }).click()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('menuitem', { name: /PNG · árvore inteira/ }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^ai-tree-arvore-\d{4}-\d{2}-\d{2}\.png$/)
})
