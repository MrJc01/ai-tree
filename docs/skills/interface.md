# Interface

## Organização da tela

- **Cabeçalho** (`src/App.tsx`): título e contagem, depois os botões de ferramenta (Padrão, FAQ, Sobre, crom.run, Auto-organizar, Exportar, Apresentação, História, Modelos), seletor de idioma e tema. Em telas menores, `MobileMenu` reúne os botões.
- **Canvas** (`src/components/SkillCanvas.tsx`): `@xyflow/react`, com hexágonos (`nodes/HexNode.tsx`), trilhas (`edges/CircuitEdge.tsx`) e rótulos de patamar e de área.
- **Barra superior esquerda:** filtros, legenda e busca (`hud/FilterBar.tsx`).
- **Canto superior direito do canvas:** Benchmarks (`hud/BenchmarkVault.tsx`). **Parte de baixo:** linha do tempo (`hud/TimeSlider.tsx`). O link do React Flow fica no canto inferior direito, escondido por `proOptions`.
- **Gaveta** (`drawer/SkillDrawer.tsx`): abre ao clicar em um hexágono, com folhas empilhadas. Abas em `drawer/SkillSheet.tsx`: Visão Geral, História, Atores & Labs, Fluxograma, Grafo, Fontes & Benchmarks e Como usar.
- **Visão Geral** termina com o bloco "Como usar" (`GuideSheet`). A aba "Como usar" continua existindo.
- **Apresentação** (`presentation/PresentationPanel.tsx`): painel à esquerda, com passos e roteiro.
- **FAQ** (`faq/FaqPanel.tsx`) e **Sobre** (`about/AboutDialog.tsx`): painel lateral e diálogo centralizado, respectivamente.

## Painéis e teclado

- Cada painel tem um estado booleano na store (`faqOpen`, `aboutOpen`) e um setter (`setFaqOpen`, `setAboutOpen`).
- A gaveta **ignora Escape** quando um desses painéis está aberto (`SkillDrawer.tsx`).
- O diálogo Sobre captura Escape e as setas na fase de captura (`window.addEventListener(..., true)`) e chama `stopPropagation`. Assim, a gaveta e a apresentação por baixo não reagem.
- A apresentação ignora as setas enquanto o Sobre está aberto (`PresentationPanel.tsx`).
- Atalhos: `/` busca; Escape fecha a folha da gaveta; setas movem o foco entre hexágonos; `← →` passam os passos da apresentação.

## Links

- `#habilidade=<id>` abre a habilidade (`src/lib/deeplink.ts`). `App.tsx` escreve o link quando a gaveta muda.
- Link direto encerra a apresentação que estiver aberta.

## Estilo

- Cores só por variáveis CSS: `--t-bg`, `--t-surface`, `--t-border`, `--t-text`, `--t-text-muted`, `--t-accent`. Tema claro e escuro usam as mesmas variáveis.
- Botões de ferramenta: classe `toolButton` (em `App.tsx`): fonte mono, 10px, maiúscula, borda fina, escondido abaixo de `lg`.
- Ícones: `lucide-react`.
- Texto em `font-mono` com `uppercase` é rótulo; texto corrido usa a fonte padrão.
- Teste no mínimo em 1024 px e no celular (375 px ou o Pixel 5 do Playwright).

## Canvas e atribuição

- `ReactFlow` recebe `proOptions={PRO_OPTIONS}` com `hideAttribution: true`. A biblioteca pede assinatura do React Flow Pro para esconder a atribuição; isso é decisão de quem mantém o projeto. Não esconda a atribuição por CSS.
- A exportação (`src/lib/exportCanvas.ts`) exclui controles, minimapa e painéis do PNG e do SVG.

## Analytics

- O snippet do Google tag (`G-EEE3YV9K01`) está no `index.html`, uma única vez. Não adicione outra tag.
