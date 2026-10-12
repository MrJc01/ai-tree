# Testes, CI, publicação e commits

## Scripts (`package.json`)

| Comando | Para que serve |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:5173`. |
| `npm run typecheck` | `tsc -b`. |
| `npm run lint` | ESLint (`eslint .`). |
| `npm test` | Vitest, todos os testes unitários. |
| `npm run build` | Typecheck e build de produção. |
| `npm run e2e` | Playwright, em desktop e em celular (Pixel 5). Sobe o servidor sozinho. |
| `npm run prints` | Gera os prints do README em `docs/img/` (com o servidor rodando). |
| `npm run prints:sobre` | Gera os prints do slide Sobre em `public/sobre/<idioma>/`. |
| `npm run og` | Gera a imagem de compartilhamento. |

## Antes de cada commit

1. `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`.
2. Se mexeu em interface, rode `npm run e2e` ou confira no navegador.
3. Se mexeu em texto, confira `src/__tests__/i18n.test.ts`.

## Primeira visita e os testes

- O slide Sobre abre sozinho na primeira visita (chave `ai-tech-tree:welcome-seen`). Ele cobre a página.
- Por isso, **todo teste que começa com o navegador limpo** precisa marcar a visita como feita:
  - Unitários (`ui.test.tsx`): `localStorage.setItem('ai-tech-tree:welcome-seen', '1')` no `beforeEach`.
  - Ponta a ponta (`e2e/app.spec.ts`): `context.addInitScript(...)` no `beforeEach`.
- Teste de primeira visita usa um contexto novo, sem o script.
- Testes de idioma: marque também `ai-tech-tree:locale` quando precisar de um idioma específico.

## CI

- `.github/workflows/ci.yml`: a cada push, roda lint, typecheck, testes e build; depois um job separado roda o Playwright com Chromium.
- `.github/workflows/pages.yml`: publica no GitHub Pages. Roda `npm run build` com `GITHUB_PAGES=true`, o que muda a base para `/ai-tree/`.
- Um push com CI vermelho deixa o `main` quebrado. Antes de dar push, rode os mesmos passos localmente.

## Commits

- Branch `main`.
- Mensagem em português, primeira linha curta e direta. Corpo explica o porquê quando não for óbvio.
- Termine toda mensagem com a linha `Co-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>` (ou o modelo que estiver usando).
- Commit local é seguro. **Push publica** no GitHub Pages: peça confirmação antes, mesmo que o push anterior tenha sido autorizado.
- Não reescreva commits que já estão no remoto.

## Checklist (`docs/CHECKLIST.md`)

- Cada pedido do dono do projeto entra no checklist na hora em que chega, nas palavras dele.
- Marque `[x]` só com evidência (commit, teste ou verificação real). Parcial é `[ ]` com "parcial: o que falta".
- Pendências de tradução ficam na seção "Traduções: o que falta".

## Pontos de atenção que já causaram problema

- Estado da apresentação é restaurado do navegador: ao recarregar, a apresentação pode estar aberta e capturar as setas.
- `npm run build` com o servidor aberto pode recarregar a página e zerar o estado da apresentação.
- Mudança de idioma remonta a árvore: qualquer valor guardado fora da store é perdido.
- Teste de ponta a ponta com diálogo de primeira visita sem a marcação falha com "intercepts pointer events".
