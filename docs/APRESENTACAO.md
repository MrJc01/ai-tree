# Roteiro da apresentação

O roteiro do botão **Apresentação** é um arquivo de dados: [src/presentation/steps.ts](../src/presentation/steps.ts).

## Regras

- **A ordem é a ordem da lista.** O primeiro objeto é o passo 1. Para mudar a ordem, mude a posição dos objetos.
- **Cada `id` é único e estável.** Use kebab-case (`linha-do-tempo`). Não reutilize o id de um passo que foi removido.
- **Cada passo parte do estado-base.** Ao entrar num passo, o app fecha a gaveta, limpa os filtros, tira o benchmark, desliga os modelos e volta o ano ao presente. Depois aplica as `actions` do passo, em ordem. Assim um passo nunca herda o estado do anterior, mesmo quando você pula vários de uma vez. Só diga no passo o que é diferente do básico.
- **Texto para a plateia** vai em `body`, em parágrafos curtos. **Observações para quem apresenta** vão em `notes`.

## Como adicionar um passo

1. Abra `src/presentation/steps.ts`.
2. Insira um objeto no lugar em que o assunto deve aparecer. Exemplo:

```ts
{
  id: 'etica-dos-modelos',
  title: 'Ética dos modelos',
  body: [
    'Explique o problema em uma ou duas frases.',
    'Diga o que o sistema mostra sobre isso.',
  ],
  notes: 'Opcional: lembrete só para quem apresenta.',
  actions: [
    { kind: 'closeDrawer' },
    { kind: 'clearFilters' },
    { kind: 'open', skillId: 'constitutional-ai' },
  ],
},
```

3. Rode `npm test`. Os testes conferem: ids únicos e em kebab-case, títulos e textos presentes, e se toda ação aponta para uma habilidade, fonte, benchmark, empresa ou ano que existe. Um erro de digitação aparece já na suíte.

## Ações disponíveis

| `kind` | O que faz | Campos |
| --- | --- | --- |
| `fit` | Enquadra a árvore inteira | — |
| `focus` | Centraliza o canvas numa habilidade, sem abrir a gaveta | `skillId` |
| `open` | Abre a gaveta numa habilidade (e centraliza) | `skillId` |
| `source` | Abre a habilidade e empilha uma fonte por cima | `skillId`, `index` (posição em `content.sources`) |
| `closeDrawer` | Fecha a gaveta | — |
| `filter` | Define os filtros de uma vez (os não informados ficam vazios) | `domains?`, `companies?`, `statuses?` |
| `clearFilters` | Limpa todos os filtros | — |
| `year` | Posiciona o Time Slider (1950 a 2026) | `year` |
| `benchmark` | Destaca os nós avaliados por um benchmark, ou limpa | `id` (ou `null`) |
| `models` | Liga ou desliga a camada de modelos | `on` |
| `density` | Troca Streamline ou Research | `value` |
| `layout` | `padrao` restaura o layout curado; `auto` aplica a organização automática | `value` |

Para `skillId`, use o id da habilidade (por exemplo `transformer`, `llm`, `attention`). Os ids estão em `src/data/skills/*.ts`.

## Ordem atual

1. Bem-vindo à árvore da IA
2. Os dois eixos
3. Como ler um hexágono
4. Arestas são dependências
5. Réplicas
6. Abrir uma habilidade
7. Streamline e Research
8. As abas da habilidade
9. Fontes e navegação empilhada
10. Pré-requisitos e desbloqueios
11. Filtros e o efeito de ghosting
12. Filtrar por empresa
13. Linha do tempo
14. Benchmarks
15. Camada de modelos
16. Organizar a árvore
17. Recapitulando

Esta lista reflete o arquivo `steps.ts`. Se você mudar a ordem ou acrescentar passos, atualize-a aqui também.

## Como o painel se comporta

- **Setas do teclado** (← e →) avançam e voltam, desde que o foco não esteja num campo de texto.
- **O roteiro à direita** do painel lista todos os passos. Clicar em um leva direto a ele.
- **Encerrar** fecha o painel. O passo atual fica guardado enquanto a página estiver aberta.

## Modo História

Além da apresentação, o botão **História** conta a história da IA em ordem cronológica, de 1950 até hoje. O roteiro está em [src/presentation/history.ts](../src/presentation/history.ts).

Diferença principal: cada passo move o **Time Slider** para o ano da história. Tudo o que é posterior fica em névoa, então a árvore cresce junto com a narrativa.

Regras, conferidas pela suíte (`src/__tests__/presentation.test.ts`):

- Os anos dos passos só andam para a frente.
- A habilidade em foco de cada passo já existe no ano do passo. Se não existir, ela fica em névoa e o foco aponta para algo invisível.
- A história começa em 1950 e termina em 2026.
- Todo passo que centraliza uma habilidade fecha a gaveta antes.

Para acrescentar um passo histórico, insira um objeto em `HISTORY_STEPS` na posição do ano. Use `{ kind: 'year', year: ... }` antes do `focus`, com um ano em que a habilidade já existia.
