# Apresentação, história, FAQ, níveis e benchmarks

## Roteiros

- **Apresentação:** `src/presentation/steps.ts` (17 passos). A ordem é a ordem da lista. Regras e ações disponíveis estão em `docs/APRESENTACAO.md`.
- **História:** `src/presentation/history.ts` (19 passos). Cada passo move o Time Slider para o ano do passo; os anos não podem voltar no tempo.
- **Passo:** `id` único e estável, `title`, `body` (parágrafos), `notes` opcional (para quem apresenta), `actions`.
- **Ações:** `runner.ts` leva a tela a um estado-base (gaveta fechada, sem filtros, sem benchmark, sem modelos, no presente) e aplica as `actions` do passo em ordem. Um passo nunca herda o estado do anterior.
- Tipos de ação: `fit`, `focus`, `open`, `source`, `closeDrawer`, `filter`, `clearFilters`, `year`, `benchmark`, `models`, `density`, `layout`.
- Regra da história: a habilidade em foco de um passo precisa existir até o ano do passo; senão ela fica em névoa e o foco aponta para nada visível.
- Texto em inglês: `src/i18n/content/en-text.ts`, chave `presentation`, pelo mesmo `id` do passo.

## FAQ

- `src/guide/faq.ts`: perguntas fixas (`BASE_FAQ`, com `id`), o glossário (`TERMS`) e as perguntas de patamar e de maturidade, geradas a partir de `levels.ts`.
- A ordem da lista é a ordem na tela: o que é a árvore primeiro, depois os patamares, as maturidades e o resto.
- Textos dos rótulos do FAQ (como "Como reconhecer:") são chaves `faq.*` do dicionário.
- Inglês: `en-text.ts`, chaves `faq`, `terms`, `tiers`, `statuses`.

## Patamares e maturidades

- `src/guide/levels.ts` tem o texto base em português (`TIER_TEXT`, `STATUS_TEXT`).
- Os nomes vêm de `tierLabel()` e `statusLabel()`, que leem o dicionário.
- Exemplos e contagens são calculados a partir da árvore, então não ficam fora de sintonia com os dados.
- Use `tierDetails()` e `statusDetails()` na interface: elas já aplicam o idioma.

## Benchmarks

- `src/data/benchmarks.ts`: cada benchmark tem `measures` (ids das habilidades que ele avalia), `reference` (valor publicado no artigo) e `current` (placar lido numa data, com fonte e link oficial).
- O Vault mostra o placar atual com a data da leitura; o texto deixa claro que o valor do artigo não é o placar atual.
- Não altere números ou datas de um placar sem reler a fonte oficial. Ao atualizar, atualize português e inglês juntos.
- Overlay em inglês: `en-text.ts`, chave `benchmarks`.

## Quando mexer no conteúdo educativo

- Mantenha os mesmos ids e a mesma quantidade de parágrafos entre português e inglês. `i18n.test.ts` compara a estrutura dos passos, do FAQ, dos patamares, das maturidades e dos benchmarks.
- O FAQ e o "Como usar" não repetem a explicação de patamar ou maturidade: ela fica no FAQ.
