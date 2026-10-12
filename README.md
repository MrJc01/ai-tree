# AI Tech Tree & Knowledge

Árvore de habilidades no estilo RPG para mapear a evolução da inteligência artificial, do machine learning clássico até a superinteligência teórica.

## Como rodar

```bash
npm install
npm run dev        # servidor de desenvolvimento em http://localhost:5173
npm test           # testes de unidade e de interface (Vitest)
npm run e2e        # testes de ponta a ponta, no desktop e no celular (Playwright)
npm run lint       # ESLint: padrões de código e regras do React
npm run typecheck  # checagem de tipos
npm run build      # build de produção
```

Os testes de ponta a ponta precisam do navegador de teste, que se instala uma vez com `npx playwright install chromium`.

## Onde fica o conteúdo

| O que | Onde |
| --- | --- |
| Habilidades (51 entradas, por área) | `src/data/skills/*.ts` |
| Modelos que orbitam as habilidades | `src/data/models.ts` |
| Benchmarks do Vault, com o placar atual, a data da leitura e as fontes | `src/data/benchmarks.ts` |
| Roteiro da apresentação | `src/presentation/steps.ts` ([guia](docs/APRESENTACAO.md)) |

Para adicionar uma habilidade, inclua um objeto `SkillSeed` no arquivo da área correspondente. A coluna (`gridCoordinates.col`) segue a ordem das áreas: 0 arquiteturas, 1 compute, 2 raciocínio, 3 robótica, 4 alinhamento. Os testes em `src/__tests__/data.test.ts` conferem as ligações, os ciclos, as cores e as fontes.

## Estrutura

- `src/types/skill.ts`: modelo de dados.
- `src/lib/`: geometria da árvore, roteamento das arestas, organização automática, visibilidade, busca.
- `src/store/appStore.ts`: estado da aplicação (gaveta, filtros, linha do tempo, apresentação, foco).
- `src/components/`: canvas, nós, arestas, gaveta, painel de apresentação e controles.
- `e2e/`: testes de ponta a ponta. `playwright.config.ts` define os perfis desktop e celular.

## Exportação e celular

- **Exportar**: salva a vista atual do canvas como PNG ou SVG (no celular, pelo menu).
- **Celular** (abaixo de 768px): os botões ficam no menu do cabeçalho, a gaveta sobe por baixo ocupando 60% da tela e o roteiro da apresentação ocupa 40%.

## Atalhos

- `/`: foca a busca de habilidades.
- `ESC`: volta uma folha na gaveta, ou fecha a gaveta na primeira.
- `← →`: avança e volta passos da apresentação.
