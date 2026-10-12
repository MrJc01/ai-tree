# Checklist do projeto

Memória do projeto entre conversas. Cada pedido do usuário entra aqui na hora em que chega, nas palavras dele.

Legenda: `[x]` feito com evidência · `[ ]` a fazer · **parcial** = implementado, mas falta verificar ou concluir.

> **Sobre commit:** o projeto ainda **não é um repositório git** (`git rev-parse` falha). Por isso nada foi commitado nem publicado. Ver pergunta 1 abaixo.

---

## 📥 Pedidos de 2026-10-12

### Feito e no ar (ou no código, com evidência)

- [x] **Estrutura do projeto**: Vite + React + TypeScript + Tailwind v4, tokens de tema Dark Clean / White Clean. Evidência: `npm run typecheck` ok; build passou no fim da etapa de estrutura.
- [x] **Nó hexagonal**: SVG flat-top, ponto de assinatura de 6px, cantoneiras no hover, réplica com contorno tracejado, hover sincronizado entre réplicas. Evidência: conferido no navegador (hover em *Attention Mechanism* acendeu as duas instâncias).
- [x] **Dados reais**: 51 habilidades em 5 áreas × 5 patamares, com histórico, atores, equações e fontes. Evidência: `src/__tests__/data.test.ts` (ligações sem ciclos, cores únicas, URLs válidas, unlocks = inverso de prerequisites). Todas as URLs de arXiv e DOI conferidas por fetch ou busca antes de entrarem nos dados.
- [x] **Gaveta lateral**: abre ao clicar, pilha de folhas (estilo Stacking Sheets), breadcrumb `Área > Habilidade > Sub-conceito > Paper`, ESC volta uma folha. Evidência: conferido no navegador (fonte empilhada sobre a habilidade; ESC voltou).
- [x] **Abas da gaveta**: Visão Geral, História (ordenável por data ou impacto), Atores & Labs, Fluxograma (Mermaid), Grafo (pré-requisitos e desbloqueios), Fontes & Benchmarks. Evidência: navegação testada; fluxograma do LLM renderizou de verdade no navegador.
- [x] **Modo Streamline / Research**: oculta datas e equações no Streamline. Evidência: teste de unidade + conferido no navegador.
- [x] **Filtros com ghosting**: área, empresa e maturidade; o que não bate fica cinza a 15%. Evidência: conferido no navegador (filtro *Raciocínio & LLMs* apagou o resto).
- [x] **Time Slider**: 1950 a presente; névoa nas tecnologias posteriores. Evidência: conferido no navegador (em 1985 quase tudo sumiu).
- [x] **Benchmark Vault**: SWE-bench, MMLU-Pro, ARC-AGI, Arena, MMLU, ImageNet; clicar destaca as habilidades avaliadas. Evidência: conferido no navegador (SWE-bench destacou ReAct, Agentes Generativos e Raciocínio por RL).
- [x] **Camada de modelos**: GPT-4o, Claude 3.5 Sonnet, Gemini 2.0, DeepSeek-R1 e outros orbitando. Evidência: os 7 modelos aparecem no DOM; visualmente conferido só de relance.
- [x] **Canvas com arraste**: hexágonos movíveis, posição salva no navegador. Evidência: conferido no navegador (arrastei *Visão Transformer*; sobreviveu ao recarregamento).
- [x] **Padrão e Auto-organizar**: Padrão volta ao layout curado; Auto-organizar reordena cada área. Evidência: conferido no navegador nos dois botões.
- [x] **Layout em árvore** (pedido "tire um de cima do outro, faça igual uma árvore"): cada patamar é uma linha, habilidades lado a lado, uma trilha horizontal exclusiva por aresta. Evidência: teste "nenhuma trilha horizontal se sobrepõe" passa; conferido no navegador ampliado.
- [x] **Foco ao abrir**: clicar em um hexágono centraliza o canvas na área livre à esquerda da gaveta. Evidência: conferido no navegador (*Transformer* centralizado).
- [x] **Foco ao abrir pré-requisito ou desbloqueio**: centraliza na habilidade nova. Evidência: conferido no navegador (*Attention* centralizado ao clicar na aba Grafo).
- [x] **Borda no que está em foco**: contorno azul na habilidade aberta e nas réplicas. Evidência: conferido no navegador (*LSTM* com borda).
- [x] **Painel de apresentação** (botão Apresentação, painel à esquerda, Anterior/Próximo, setas do teclado, roteiro clicável): 17 passos em `src/presentation/steps.ts`. Evidência: conferido no navegador (passo 1 e passo 17 no roteiro).
- [x] **Ordem da apresentação documentada**: `docs/APRESENTACAO.md` (regras, tabela de ações, ordem atual) e `README.md`. Evidência: arquivos existem; ordem confere com `steps.ts`.
- [x] **Busca por nome** (tecla `/`): acentos normalizados, ranking por relevância. Evidência: testes de unidade (busca sem acento, réplicas fora, limite de resultados). **Parcial**: falta conferir no navegador.
- [x] **Rótulos T1 a T5 e nomes das áreas** no canvas. Evidência: conferido no navegador.
- [x] **Legenda** dos símbolos (dentro do painel de filtros). Evidência: renderiza; **parcial**: falta conferir no modo escuro.
- [x] **Mini-mapa**: estava vazio até declarar as dimensões dos nós. Evidência: conferido no navegador (52 nós desenhados).
- [x] **Testes**: 121 passando (`npm test`), em 6 arquivos. Evidência: última execução desta conversa.
- [x] **Aba "Como usar" na gaveta** (pedido original: "o lado direito aberto do hexágono não tem como usar, como funciona, mais detalhes, crie um tabpage"). Hoje a aba explica o hexágono aberto, não o sistema: a correção está no item de mesmo assunto em "Pedidos de 2026-10-12 (continuação)", com evidência.
- [x] **Recarga inteira ao salvar arquivo corrigida.** Causa: arquivos de componente exportavam funções e constantes (`sortHistory`, `SOURCE_TYPE_LABEL`, `STATUS_TONE`, `PANEL_WIDTH`), o que impede a *Fast Refresh* e recarrega a página, zerando a apresentação e a gaveta. Correção: exports movidos para `src/lib/timeline.ts` e `src/components/drawer/labels.ts`. Evidência: log do servidor sem novos "Could not Fast Refresh" depois da mudança.

### A fazer — pedidos novos (ordem de prioridade)

1. [x] **História da IA** (pedido: "crie outro estilo de apresentação só que contando a história desde o começo"). Código pronto: `src/presentation/history.ts` (19 passos, 1950 → hoje), `modes.ts`, store com `presentation.mode`, painel e botão **História** no cabeçalho.
   - [x] Testes de invariantes do roteiro histórico (anos não voltam; habilidade em foco existe no ano do passo; começa em 1950 e termina em 2026). Evidência: 9 testes novos em `presentation.test.ts`, 109 passando.
   - [x] Conferir no navegador: o slider anda junto com a narrativa, a névoa cresce, a borda e a câmera batem em cada passo. Evidência: passos 1, 2 (1950, Turing centralizado e com borda) e 8 (1998, CNN centralizada, Attention em névoa) conferidos.
   - [x] Seção "Modo História" no `docs/APRESENTACAO.md`. Evidência: arquivo atualizado.
2. [ ] **Foco e borda corretos no "Próximo"** (pedido: "quando clico em próximo não tá dando foco correto com borda, corrija e continue"). Já corrigido no código: câmera refeita quando o tamanho do canvas muda, borda pela habilidade explicada mesmo com gaveta fechada, passos de foco fecham a gaveta antes, gaveta limitada a 60% do canvas (era o caso do passo 9 cobrindo o canvas inteiro).
   - [x] Conferir no navegador o passo 9 (gaveta + painel) depois da regra dos 60%. Evidência: o *LLM* ficou centralizado na parte livre, com borda, e o breadcrumb da fonte apareceu.
   - [x] Percorrer os 17 passos da apresentação um a um. Evidência: todos conferidos no navegador. Dois problemas encontrados e corrigidos no caminho: (a) passos herdavam filtro, ano e benchmark do anterior; (b) no passo 5, a habilidade em foco ficava em névoa. Correção: cada passo parte de um estado-base (gaveta fechada, sem filtros, sem benchmark, sem modelos, no presente). Evidência: 2 testes novos (`presentation.test.ts`, 'estado-base dos passos'), 123 passando, e os passos 2 e 5 reconferidos depois da correção.
3. [ ] **Confirmar o layout em árvore com o usuário**: as linhas ainda se sobrepõem em algum ponto? Se sim, anotar qual.

### A fazer — pendentes de antes

- [x] **Build de produção**: refeito depois das mudanças de História e da câmera. Evidência: `npm run build` ok (7,7 s); typecheck ok; 109 testes passando.
- [ ] **Busca e legenda no modo escuro**: conferir contraste.
- [ ] **Abas da gaveta quebram em duas linhas** com a aba "Como usar" (cosmético). Decidir entre quebra de linha, rolagem horizontal ou abreviar rótulos.
- [ ] **npm audit**: 2 vulnerabilidades de severidade baixa, não corrigidas (`npm audit fix` mexe nas dependências; decidir antes).
- [ ] **Revisar dados sem fonte direta**: alguns marcos históricos ainda não foram checados linha a linha (ex.: "Linnainmaa 1970" na retropropagação; papel exato de alguns atores nas áreas; datas de lançamento de modelos como Llama 3 (abr/2024) e DeepSeek-R1 (jan/2025)).
- [x] **Benchmarks com placar atual**: ver rodada 3, item 3 (parcial: três fontes oficiais carregam por JavaScript).
- [ ] **Limpeza**: campo `subPages` não usado em nenhum dado; checar se algum import ficou sem uso.

### Perguntas sem resposta (preciso do usuário)

1. Quer que eu inicie um repositório git aqui? Sem isso, não há commit, push nem histórico do checklist.
2. A apresentação História deve ficar como botão separado (como está) ou como opção dentro de um só botão?
3. O layout em árvore atende, ou quer mais separação entre as trilhas?
4. Quer benchmarks com placares atuais (buscados de fontes oficiais, com data) ou só os valores de artigo?
6. O ponto no hexágono: hoje há **um** ponto por habilidade, com a cor de assinatura (identidade, igual nas réplicas). Você imaginava mais pontos com outros significados? Se sim, quais: maturidade, número de pré-requisitos, de modelos, de fontes? O ponto único é o que a especificação pede (um ponto de 6px com a cor de assinatura). Mais indicadores podem ir em uma segunda fileira de pontos pequenos, sem mexer no ponto de identidade.
5. A aba "Como usar" ficou por último, depois de "Fontes & Benchmarks". Quer que ela seja a primeira, para quem abre o hexágono pela primeira vez?

### Futuro (só anotado)

- Publicar a apresentação para outras pessoas (link compartilhável).
- Exportar a árvore como imagem para slides.

### Ideias propostas por mim (ainda não pedidas, decidir)

- **Navegação por teclado entre hexágonos** (setas) e foco visível em cada um.
- **Link direto** para uma habilidade ou passo (ex.: `#habilidade=llm`), para compartilhar.
- **Trilhas que contornam os hexágonos**: hoje, uma aresta que atravessa vários patamares pode passar atrás de um nó.
- **Layout para celular e tablet**: o cabeçalho esconde botões abaixo de `md`, e a gaveta ainda não foi pensada para telas pequenas.
- **Testes de ponta a ponta** (Playwright) para os fluxos da apresentação e da gaveta, em vez de conferir só pelo navegador de teste.
- **Lint e CI**: ainda não há ESLint; um workflow com `npm test` e `npm run build` evitaria regressões.
- **Desempenho**: cada nó tem um filtro de blur; medir com a árvore cheia antes de ampliar.
- **Retomar a apresentação depois de um recarregamento**: guardar o modo e o passo atual na sessão (`sessionStorage`), para que um recarregamento não zere a apresentação. Hoje o estado é só de memória.

---

## 📥 Pedidos de 2026-10-12 (rodada 4)

**Pedido do usuário:** "corrija e faça tudo que ta falando também", com a lista de pendências da rodada 3.

**Feito, com evidência**
- [x] **Modelos de 2026 com fonte oficial**: Claude Opus 5 (24/07/2026), Claude Fable 5 (09/06), Fable 5.1 (01/09), Mythos 5 (09/06) e Mythos 5.1 (01/09), das páginas `anthropic.com/claude/opus`, `/fable` e `/mythos`; os dois Mythos marcados como acesso restrito. GPT-6 Astra (lançamento 02/09/2026, na tabela oficial do ARC Prize), GPT-6 Sol (22/09) e GPT-6.1 Sol (22/09), das páginas da OpenAI. Gemini 4 Argon, como anunciado (28/09), na página do Google, ainda não lançado de forma ampla. Evidência: `models.ts` (19 modelos), `data.test.ts`, leitura no navegador.
- [x] **Placares lidos nas páginas oficiais, no navegador** (o navegador executa o JavaScript dos sites). SWE-bench: **76,8%** (oficial, Verified, só bash), no lugar dos 96% do BenchLM, que usam outra configuração. ARC-AGI-2: **95%** (GPT-6 Astra). ARC-AGI-3: **62,7%** na configuração padrão e **99,9%** no Provider Adapter, que bate com o anúncio da OpenAI. MMLU-Pro: **91,16%**, com empate na tabela entre Gemini-3.1-Pro e Llama-3.1-Nemotron (as duas linhas têm as mesmas notas por área, provável duplicata). Arena: 1525 preliminar, conferido no DOM. Evidência: `benchmarks.ts`, teste E2E do Vault (agora `Placar atual: 76,8%`).
- [x] **Publicação no GitHub Pages** em https://mrjc01.github.io/ai-tree/ (pedido: "pode ser nesse domínio mesmo"). Caminho base `/ai-tree/` só no build do Pages (`GITHUB_PAGES=true`); workflow `.github/workflows/pages.yml` publica a cada push na `main`. Evidência: build com os assets sob `/ai-tree/`; a versão de produção abriu e carregou a habilidade pelo link direto no navegador; Pages ativo com fonte no workflow.
- [x] **Exportar a árvore inteira**: enquadra a árvore, exporta e devolve a vista que o usuário tinha. Quatro opções nos dois menus (PNG e SVG, vista atual ou árvore inteira), vindas de uma lista única (`EXPORT_OPTIONS`). Evidência: PNG da árvore gerado e conferido (árvore completa, sem controles), teste E2E de download e `ui.test.tsx`.
- [x] **Tablet**: o cabeçalho ficava apertado em 768 px (menu ausente) e 1024 px (contagem quebrava). Agora a barra de botões só aparece a partir de 1024 px, e a contagem de habilidades a partir de 1280 px. Evidência: capturas do cabeçalho em 768 e 1024 px.
- [x] **Revisão dos 67 registros de atores**: 13 correções, todas com fonte, cada uma em uma busca. Monro e Robbins: filiação do artigo de 1951 é a Universidade da Carolina do Norte, não Columbia. I. J. Good: Trinity College (Oxford) e Atlas Computer Laboratory. Dario Amodei: Google Brain no artigo de 2016. Jared Kaplan: só OpenAI no artigo de 2020, sem Johns Hopkins. Bahdanau: Jacobs University Bremen no artigo de 2014, não Montréal. Yann LeCun: AT&T Labs-Research na época do LeNet. Chris Olah: OpenAI no *Zoom In*. Micikevicius: contribuição igual com Sharan Narang (Baidu). Newell e Simon: RAND e Carnegie Tech. Kalman: Research Institute for Advanced Study, Baltimore. Michael Ahn: primeiro autor só no arXiv (no CoRL é Brian Ichter). Danny Driess: Robotics at Google e TU Berlin. Os 5 relatórios de empresa (Gemini, GPT-4, Llama 3, DeepSeek) ficam atribuídos à própria empresa.

**Pendente**
- Gu e Dao (Mamba) e Ho (DDPM): afiliação confirmada por fonte secundária, não pela primeira página do artigo.
- Os relatórios de empresa não foram buscados um a um: a autoria é da própria empresa.
- Publicação: repositório público `ai-tree` com MIT, na rodada 4 (ver a seção de publicação).

## 📥 Pedidos de 2026-10-12 (rodada 3)

**Respostas do usuário às perguntas abertas**
- Aba "Como usar" **não** vai para a primeira posição. Pedido: seta para rolar a lista de abas para os lados, no lugar da barra de rolagem feia.
- Layout em árvore: o usuário quer escolher o tipo de organização. Ao clicar em **Auto-organizar**, abrir um dropdown com as opções de organização.
- Benchmarks: **sim**, placares atuais com data e fonte oficial, e os links dos sites de onde vieram os dados.
- Repositório git: antes de iniciar, o usuário quer **nomes para escolher**. Nada foi iniciado.

**A fazer (ordem de prioridade)**
1. [x] **Seta para rolar as abas da gaveta** (pedido: "coloque uma seta para ir para os lados"). Setas `‹` e `›` nas laterais, que aparecem só quando há abas escondidas naquela direção; a barra de rolagem some. Evidência: conferido no navegador (clique na seta rolou de 0 a 108 px, a seta da direita sumiu no fim, a da esquerda apareceu); `ui.test.tsx` ("abas da gaveta com setas").
2. [x] **Dropdown no Auto-organizar** (pedido: "quando clicar em auto organizar, abra um dropdown para escolher qual tipo de organização mostrar"). Quatro tipos: **Menos cruzamentos** (o barycenter de sempre), **Cronológica** (da data mais antiga para a mais nova em cada patamar), **Por maturidade** (do comoditizado ao teórico) e **Alfabética**. Fecha ao escolher, ao clicar fora e com ESC (o ESC não fecha a gaveta). Evidência: `arrange.test.ts` (7 testes: posições únicas, ordem por ano, por maturidade, alfabética, cruzamentos igual ao barycenter, tipos diferentes); `ui.test.tsx` (menu com 4 opções, ESC); conferido no navegador: o menu abriu, escolhi Alfabética e o layout mudou. Correção no caminho: o menu ficava atrás da gaveta; o cabeçalho passou para `z-40`.
3. [x] **Placares atuais de benchmarks**, com data da leitura, fonte e link do placar oficial (pedido: "sim, e os sites de onde veio os dados"). Valores lidos em 2026-10-12:
   - SWE-bench: Claude Opus 5, 96%. Dado de [BenchLM](https://benchlm.ai/benchmarks/swe-verified), atualizado em 10/10/2026. Oficial: swebench.com.
   - MMLU-Pro: Claude Fable 5.1, 92,38%. Dado de [Vals.ai](https://www.vals.ai/benchmarks/mmlu_pro), atualizado em 01/09/2026. Oficial: TIGER-Lab no Hugging Face.
   - ARC-AGI-2: Tufa Labs (equipe), 88,06%, **parcial**. Dado de [ToolNavs](https://toolnavs.com/article/2447-arc-agi-2-high-score-refresh-tufa-labs-tops-the-board-at-8806-past-the-85-bonus), que cita a ARC Prize (09/10/2026). Oficial: arcprize.org/leaderboard.
   - Arena (texto): gemini-4-argon-high, 1525 ±9, **preliminar**. Lido em [arena.ai](https://arena.ai/leaderboard/text), atualizado em 08/10/2026. É a fonte oficial.
   - ImageNet-1k: CoCa ViT-G/14, 91,0% top-1. Dado de [Codesota](https://www.codesota.com/browse/computer-vision/image-classification/imagenet), revisado em março de 2026; a entrada é de 2022. O ImageNet não tem placar atual oficial.
   - MMLU clássico: sem placar atual verificado; continua só com o valor do artigo.
   Modelo: campo `current` em `src/types/skill.ts` e `src/data/benchmarks.ts`. Evidência: `data.test.ts` ("placares atuais": data, fonte e links https); conferido no navegador (Vault mostra "Placar atual: 96%", "Lido em 12/10/2026", "dado da fonte de 10/10/2026" e os três links); FAQ "Os benchmarks mostram placares atuais?" reescrita.
   **Parcial**: swebench.com, arcprize.org, TIGER-Lab e arena.ai carregam os placares por JavaScript, então o WebFetch não leu as tabelas. Só o arena.ai foi lido direto; os outros números vêm de agregadores, e o painel diz isso em cada item.
4. [x] **Repositório git: `ai-tree`**. Nome escolhido pelo usuário ("na real, ai-tree"). Iniciado na branch `main`, com o pacote renomeado para `ai-tree`. Evidência: commit `76d2333` (primeiro commit, 83 arquivos). **Pendente**: o remoto no GitHub não foi criado (ação que publica código; aguarda confirmação).

**Pedido novo: "pense e pesquise o que mais pode estar faltando, e faça tudo"**

**Lacunas levantadas (pesquisa de 2026-10-12), com estado:**
- [x] **Modelos da árvore desatualizados (prioridade alta)**: fechado na rodada 4 (ver lá). Pendentes de fonte oficial ficaram resolvidos: Fable 5/5.1, Mythos 5/5.1, GPT-6 Astra/Sol/6.1 Sol e Gemini 4 Argon (anunciado).
- [x] **ARC-AGI-3 com entrada e placar oficial** (rodada 4): 62,7% na configuração padrão e 99,9% com o Provider Adapter, lidos na tabela oficial.
- [x] **Celular e tablet**: cabeçalho com menu (Vista, Organizar, Exportar, Apresentar); gaveta sobe por baixo com 60% da tela; painel da apresentação é faixa inferior com 40%; câmera centraliza na área livre de cima; controles e minimapa ocultos. Conferido em 375×812, 768×1024 e 1024 px no navegador, e no perfil Pixel 5 dos testes de ponta a ponta.
- [x] **Placares oficiais** (rodada 4): lidos nas tabelas renderizadas no navegador (SWE-bench, ARC Prize, TIGER-Lab, Arena). Valor do SWE-bench corrigido de 96% (BenchLM, outra configuração) para 76,8% (oficial, só bash). ImageNet segue sem placar oficial, com agregador marcado.
- [x] **Testes de ponta a ponta** (Playwright): `npm run e2e`, 10 testes passando e 8 pulados por perfil (desktop e celular). Cobrem link direto, apresentação e "voltar ao último visto", Auto-organizar, exportação PNG real, Vault com placar atual, e o menu do celular. Rodam no CI (`ponta_a_ponta`). Evidência: saída do `playwright test`.
- [x] **ESLint**: `npm run lint` sem erros (regras do TypeScript, React Hooks e Fast Refresh). Um erro real encontrado e corrigido: `MermaidDiagram` chamava setState dentro do efeito. Roda no CI.
- [~] **Acessibilidade**: axe-core 4.10 na página: **0 violações**, 46 regras aprovadas. 63 casos de contraste ficaram "incompletos" (o axe não lê fundo com imagem, desfoque ou sobreposição do canvas). Medido à mão no tema escuro: título do hexágono 15,04:1; selo muted 4,91:1. No claro, valem os tokens da rodada anterior (16,9 e 4,51). **Pendente**: leitor de tela não testado com ferramenta própria.
- [x] **Revisão de dados (atores)**: rodada 4 revisou os 67 registros. Foram 13 correções com fonte, e os 5 relatórios de empresa ficam atribuídos à própria empresa. Ver a rodada 4. **Pendente**: Gu/Dao (Mamba) e Ho (DDPM) têm afiliação por fonte secundária, não pela primeira página do artigo.
- [x] **Trilhas que contornam os hexágonos**: a medição mostrou **7 cruzamentos** (arestas longas, como `transformer → mamba`, passando por dentro de um hexágono de um patamar intermediário). Correção: arestas que atravessam patamares ganham uma coluna livre entre os hexágonos, com faixa horizontal em cada ponta (`src/lib/route.ts`). Agora, zero cruzamentos. Evidência: `edges.test.ts` (controle do detector, rotas não vazias, zero cruzamentos); `logic.test.ts` (sem sobreposição horizontal, trilhas ortogonais); conferido no navegador.
- [x] **Exportar PNG ou SVG, vista atual e árvore inteira** (rodada 4): enquadra a árvore, exporta e devolve a vista. Evidência: PNG da árvore gerado e conferido, teste E2E e `ui.test.tsx`.
- [x] **Histórico de passos da apresentação**: botão "Voltar ao último visto" com o título do passo de destino; a pilha guarda até 50 passos e fica salva na sessão. Evidência: `presentation.test.ts` (desfaz o salto de "Próximo", ignora o mesmo passo, limita a pilha), `navigation.test.ts` (leitura validada), e o E2E de apresentação.
- [x] **Repositório git** iniciado (`ai-tree`, branch `main`, primeiro commit `76d2333`). O CI agora roda lint, tipos, testes, build e ponta a ponta. **Pendente**: criar o remoto no GitHub, se você quiser.
- [x] **Tamanho do pacote**: o arquivo principal caiu de 689 kB para 173 kB, com React, React Flow e Framer Motion em pacotes separados. Os avisos que sobram são de módulos do Mermaid, carregados só quando um fluxograma é aberto. Evidência: saída do `npm run build`.
- Já decidido (não é lacuna): `npm audit` (risco aceito, ver "Decisões já tomadas").

## 📥 Pedidos de 2026-10-12 (continuação)

**Feito e no ar (com evidência)**
- [x] **Aba "Como usar" explica o hexágono aberto, não o sistema** (pedido: que a aba explique o hexágono que está aberto, e não o sistema inteiro). Agora fala só da habilidade aberta, em `src/guide/hexGuide.ts`: o que cada parte do hexágono significa para ela (ponto, patamar, selo, contorno, borda azul, cantoneiras, névoa, órbitas de modelos) e como usá-la (pré-requisitos e desbloqueios clicáveis, fontes, fluxograma, benchmarks, linha do tempo, compartilhar). O bloco "Sobre esta habilidade" continua vindo dos dados (`src/guide/skillSummary.ts`). O manual geral saiu de `src/guide/content.ts` (apagado); patamar e maturidade ficam só no FAQ. Evidência: `guide.test.ts` (órbitas, pré-requisitos e desbloqueios pelo nome, base, réplica, os sete passos em todas as habilidades); `levels.test.ts` (a aba não repete o FAQ); `ui.test.tsx`; typecheck ok; build ok; 155 testes passando; conferido no navegador com o LLM (pré-requisitos, desbloqueios, 3 fontes, benchmarks e órbitas aparecem).
- [x] **Busca dentro do painel de filtros**, ao lado de Filtros e Legenda (pedido: "coloque a busca no menu superior como o filtros e legendas"). Tecla `/` abre a busca e coloca o cursor no campo. Evidência: conferido no navegador (digitei "llm", o resultado abriu a habilidade e atualizou o endereço); `ui.test.tsx`.
- [x] **Botão FAQ ao lado de Padrão**, com painel lateral: 26 perguntas em recolhíveis hoje (17 na primeira versão), pesquisa simples que procura na pergunta e na resposta, e ESC fecha o painel sem fechar a gaveta (pedido: "um faz do lado do padrão para abrir um lateral e ter como ver faqs em collapses e uma pesquisa simples"). Evidência: conferido no navegador ("placar" → 1 de 17); `guide.test.ts` (ids únicos, números de passos batendo, pesquisa sem acento); `ui.test.tsx`.
- [x] **Apresentação continua no mesmo passo depois de recarregar** (guardada na sessão do navegador). Evidência: recarreguei no passo 5 e voltou ao passo 5; `navigation.test.ts` (leitura válida, JSON quebrado, índice fora do roteiro).
- [x] **Link direto** `#habilidade=<id>`: abre a habilidade ao carregar e atualiza o endereço quando a gaveta muda. Evidência: abri `#habilidade=llm` no navegador (gaveta, centralização e borda); `navigation.test.ts`.
- [x] **Link colado com a página já aberta abre a habilidade.** Antes, `#habilidade=` só era lido ao carregar a página; agora o app também reage quando o hash muda. Achado no caminho: a página de teste ainda rodava o código antigo, por isso o primeiro teste no navegador falhou; recarregada, passou. Evidência: `ui.test.tsx` ("um link colado com a página já aberta abre a habilidade, sem recarregar"); conferido no navegador: hash trocado de *Perceptron* para *CNN* e a CNN abriu.
- [x] **Setas entre os hexágonos** (sem disputar as setas da apresentação). Evidência: foco foi de *LLM* para *Cadeia de Pensamento* ao apertar →; `navigation.test.ts` (direção certa, borda da árvore, nunca o próprio ponto).
- [x] **Abas da gaveta em uma linha**, com rolagem horizontal, em vez de quebrar em duas. Evidência: captura de tela.
- [x] **Contraste da legenda no modo escuro**: exemplos de "15%" e "névoa" mais legíveis. Evidência: captura no modo escuro antes do ajuste; **reconferir** depois do ajuste.
- [x] **Dados conferidos na web**: CUDA tinha como criador só Ian Buck, mas a enciclopédia lista Ian Buck e John Nickolls como autores originais (corrigido). Linnainmaa (1970): a tese descreve a diferenciação automática em modo reverso, e a prioridade sobre a retropropagação é debatida (texto ajustado). Llama 3: 18/04/2024 confere. DeepSeek-R1: 20/01/2025 confere.
- [x] **`npm audit`: decisão tomada.** Risco aceito: a vulnerabilidade é do KaTeX, dependência do mermaid. O mermaid 12.1.0 já é a versão mais nova, e a correção que o `npm audit` sugere é voltar para o mermaid 10 (quebra os fluxogramas). Os diagramas são fixos no código, e nenhum texto de usuário passa pelo KaTeX. Reavaliar quando o mermaid publicar correção.
- [x] **Integração contínua**: `.github/workflows/ci.yml` roda tipos, testes e build a cada push. Evidência: arquivo criado e os três comandos rodados localmente. **Não executado no GitHub**: o projeto ainda não tem repositório.
- [x] **Limpeza**: o campo `subPages` fica. Ele vem do schema da especificação (opcional), então remover seria mudar o contrato. Decisão registrada.

**A fazer (ordem de prioridade)**
1. [ ] **Confirmar o layout em árvore** com você: as trilhas ainda se sobrepõem em algum ponto?
2. [ ] **Reconferir o contraste da legenda** no modo escuro depois do ajuste.
3. [ ] **Layout para celular e tablet**: o cabeçalho esconde botões abaixo de `md`, e a gaveta ocupa a tela toda. Precisa de uma passada própria.
4. [ ] **Trilhas que contornam os hexágonos**: uma aresta que atravessa vários patamares ainda pode passar por trás de um nó.
5. [ ] **Testes de ponta a ponta** (Playwright) para apresentação, gaveta e FAQ. Hoje só há conferência manual no navegador de teste.
6. [ ] **Lint (ESLint)** para pegar padrões ruins que o TypeScript não pega.
7. [ ] **Desempenho**: medir o custo do blur de cada nó com a árvore cheia e com a camada de modelos ligada.

**Perguntas sem resposta**
1. Quer que eu inicie um repositório git? Sem ele, o CI não roda e nada é commitado.
2. A aba "Como usar" deve ser a primeira aba da gaveta?
3. Benchmarks: placares atuais (com data e fonte oficial) ou só os valores de artigo?
4. A busca agora fica no painel de filtros. Quer também um atalho no cabeçalho?

**Ideias (não pedidas, decidir)**
- Exportar a árvore como imagem (PNG ou SVG) para slides.
- Publicar a apresentação para outras pessoas (link compartilhável).
- Histórico de passos da apresentação, com voltar para o último passo visto.

---

## 🗺️ Plano completo: o que já está feito e o que falta (atualizado em 2026-10-12)

Este bloco é a lista única de tudo. Nada que foi pedido ou sugerido fica fora dele. Cada item tem estado, motivo e, quando aplicável, quem decide.

### Feito nesta rodada (com evidência)

- [x] **Explicações de T1 a T5 e das maturidades no FAQ** (pedido: "coloque sobre o que é tudo, comoditizado, t3 t4 etc... quero detalhes"). Antes, o detalhe estava só na aba Como usar, e o FAQ apontava para lá. Erro meu. Agora o FAQ tem uma pergunta por patamar (5) e uma por maturidade (4), com a explicação completa, os sinais para reconhecer e exemplos reais. A aba Como usar não repete esse texto (hoje ela explica só o hexágono aberto). Evidência: FAQ com 25 perguntas, pesquisa "comoditizado" conferida no navegador; `guide.test.ts` (FAQ traz os nove itens com o texto completo e exemplos).
- [x] **Como usar sem repetir o FAQ** (pedido: "o como usar é como funciona e exemplos, por que tá igual deveria ser no faq"). Esta etapa tirou da aba os patamares e as maturidades. Depois a aba foi refeita para explicar o hexágono aberto (ver a correção acima), e o texto geral não voltou para ela. Evidência: `levels.test.ts` ("Como usar não repete a explicação de patamar nem de maturidade"); `ui.test.tsx` (aba sem "Patamares e maturidade" nem "Exemplos de uso").
- [x] **Painel superior esquerdo não fica mais por baixo da gaveta aberta**: encolhe para a área livre, com a mesma regra de largura da gaveta. Evidência: legenda aberta com a gaveta aberta, conferida no navegador.

- [x] **Detalhes de cada patamar (T1 a T5)**: o que é, como reconhecer, por que está nessa posição e exemplos reais calculados a partir da árvore (`src/guide/levels.ts`). Evidência: FAQ, perguntas "O que é o T1…T5", conferidas no navegador (T2 e T3 com exemplos); `levels.test.ts`.
- [x] **Detalhes de cada maturidade** (Teórico, Experimental, Produção, Comoditizado): explicação, sinais para reconhecer e exemplos. Mesma fonte e mesma evidência acima.
- [x] **FAQ, legenda e glossário** atualizados com os mesmos termos: pergunta nova "O que são T1, T2, T3, T4 e T5?", legenda com os patamares, e glossário com as quatro maturidades. Evidência: `guide.test.ts`, `levels.test.ts`.
- [x] **Link direto ganha da apresentação**: `#habilidade=llm` encerra a apresentação que estava aberta na sessão e abre a habilidade. Evidência: recarreguei com a apresentação ativa e a habilidade abriu (`ui.test.tsx`, 'link direto ao carregar').
- [x] **Build de produção** conferido de novo: passou. Evidência: `npm run build` ok.
- [x] **Rodada anterior fechada**: busca no painel de filtros, botão FAQ, painel FAQ com pesquisa, apresentação persistida, link direto, setas entre hexágonos, abas em uma linha, dados conferidos, decisão sobre `npm audit`, CI criado. Evidências no bloco "Pedidos de 2026-10-12 (continuação)".

### Plano restante, em ordem

**Fazer agora (sem depender de ninguém):**
1. [x] Reconferir o contraste da legenda no modo escuro depois do último ajuste de opacidade. Evidência: legenda conferida no modo escuro, com os itens legíveis, incluindo os exemplos de 15% e névoa.
2. [ ] Revisar as descrições dos patamares T4 e T5 com referências: são as partes mais disputadas, e o texto precisa dizer isso com precisão. Fontes candidatas: os artigos de AGI e o debate sobre ASI já citados na árvore.
3. [ ] Conferir os papéis dos atores de cada habilidade, uma a uma, contra a fonte da própria habilidade. Hoje a maioria está conferida; faltam os que só têm um nome de autor sem referência de cargo.
4. [ ] Acessibilidade: auditar contraste nos dois temas e o rótulo de cada hexágono para leitor de tela. Os hexágonos já têm `role="button"` e `aria-label`; falta verificar o resto.

**Depois, com mais esforço:**
5. [ ] Layout para celular e tablet: o cabeçalho esconde botões abaixo de `md`, e a gaveta ocupa a tela toda. Precisa de uma passada própria, testada em tamanho pequeno.
6. [ ] Trilhas que contornam os hexágonos: uma aresta que atravessa vários patamares ainda pode passar por trás de um nó. Hoje é aceito; decidir se vale o esforço.
7. [ ] Testes de ponta a ponta (Playwright) para apresentação, gaveta, FAQ e link direto. Hoje a conferência é manual no navegador de teste.
8. [ ] ESLint, para pegar padrões ruins que o TypeScript não pega.
9. [ ] Desempenho: medir o custo do blur de cada nó com a árvore cheia e com a camada de modelos ligada.
10. [x] Histórico de passos da apresentação, com voltar ao último passo visto: feito (ver a rodada 3).
11. [x] Exportar a árvore como imagem (PNG ou SVG): feito para a vista atual (ver a rodada 3).

**Dependem de você (não consigo decidir sozinho):**
- [x] Layout em árvore: o usuário quer escolher o tipo de organização no Auto-organizar. Feito (dropdown com quatro tipos).
- [x] A aba "Como usar" deve ser a primeira? Respondido: não (fica por último).
- [x] Benchmarks: placares atuais com data e fonte. Respondido: sim, com os sites de origem (feito na rodada 3).
- [ ] Iniciar um repositório git? Sem ele, o CI não roda e nada é commitado.
- [ ] A busca deve ter também um atalho no cabeçalho, além do painel de filtros?
- [ ] Publicar a apresentação para outras pessoas (link compartilhável)?

**Decisões já tomadas (não reabrir sem motivo):**
- Um ponto por hexágono, com a cor de assinatura. Você decidiu manter.
- `subPages` fica no modelo: o campo vem do schema da especificação.
- `npm audit`: risco aceito. O mermaid 12.1.0 é a versão mais nova, e a correção sugerida (mermaid 10) quebra os fluxogramas. Reavaliar quando houver correção.
- A busca fica no painel de filtros, junto de Filtros e Legenda.
- Patamares (T1 a T5) e maturidades ficam só no FAQ. A aba Como usar explica o hexágono aberto e como usar a habilidade (corrigido em 2026-10-12: antes ela explicava o sistema inteiro).
- Um pedido de link direto encerra a apresentação que estiver aberta.

**Ideias sem prioridade definida:**
- Mais habilidades, em especial nos patamares T4 e T5, onde a árvore ainda é fina.
- Versão para impressão, com a árvore e o glossário.

---

## ▶️ Retomar

**Por onde começar na próxima conversa:**
1. Repositório público `ai-tree` com licença MIT: publicado na rodada 4 (ver lá). Próximo passo: acompanhar o primeiro CI no GitHub.
2. Fontes ainda pendentes: a afiliação de Gu/Dao e Ho pela primeira página dos artigos.
3. Antes de conferir no navegador, recarregar a página: depois de editar arquivos com efeitos, a aba aberta pode continuar com o código antigo.

**Comandos:**
- `npm run dev`: servidor em `http://localhost:5173` (já estava rodando pelo preview).
- `npm test`: suíte (155 testes em 8 arquivos).
- `npm run typecheck`: checagem de tipos.
- `npm run build`: build de produção.

**Armadilhas conhecidas:**
- Não existe `docs/CHECKLIST.md` em outro lugar; este é o único.
- O `localStorage` guarda posições na chave `ai-tech-tree:positions:v2`. Mudar o layout exige mudar a versão da chave, senão posições antigas sobrescrevem o layout novo.
- Passos de foco da apresentação precisam fechar a gaveta antes (`closeDrawer`); a regra está testada.
- Rodar `npm run build` com o dev server aberto recarregou a página e zerou a apresentação (o estado do store não é salvo). Por isso, na hora de conferir, reabra o roteiro depois de build.
- A habilidade de um passo histórico precisa existir no ano do passo, senão fica em névoa e o foco aponta para nada visível.
- No navegador de teste (800×600), o painel da apresentação mais a gaveta deixam pouca área de canvas. Testar em tamanho maior também.
