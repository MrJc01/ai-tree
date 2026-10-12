# Arquitetura

Stack: React 19, TypeScript, Vite, Tailwind v4, `@xyflow/react` (canvas), zustand (store), framer-motion, mermaid (carregado sob demanda), html-to-image (exportação), lucide-react (ícones).

## Mapa das pastas

| Pasta | O que mora ali |
| --- | --- |
| `src/data/` | Dados: habilidades (`skills/*.ts`), benchmarks, modelos. `index.ts` monta `SKILLS`; `localized.ts` entrega tudo no idioma atual. |
| `src/types/skill.ts` | Tipos do domínio: `SkillNode`, `SkillSeed`, `DOMAINS`, `MATURITY_STATUSES`, `Benchmark`. |
| `src/lib/` | Lógica sem interface: layout e rotas das trilhas (`layout.ts`, `route.ts`), organização (`arrange.ts`), busca, cores, exportação, deep link (`#habilidade=`). |
| `src/store/appStore.ts` | Estado global (zustand): gaveta, painéis, apresentação, tema, idioma, slide Sobre. |
| `src/components/` | Interface. `hud/` (cabeçalho e barras), `drawer/` (gaveta da habilidade), `presentation/`, `faq/`, `about/`, `nodes/` e `edges/` (canvas), `SkillCanvas.tsx`. |
| `src/presentation/` | Roteiros: `steps.ts` (apresentação), `history.ts` (história), `modes.ts`, `runner.ts` (aplica as ações de cada passo). |
| `src/guide/` | Texto explicativo derivado dos dados: FAQ, níveis, resumo e "como ler o hexágono". |
| `src/i18n/` | Idiomas: dicionários da interface, overlays de conteúdo e estado do idioma. Ver [i18n.md](i18n.md). |
| `src/__tests__/` | Testes unitários (Vitest + Testing Library). |
| `e2e/` | Testes de ponta a ponta (Playwright), desktop e celular. |
| `scripts/` | Geração de prints e da imagem de compartilhamento. |
| `docs/` | `CHECKLIST.md` (pedidos), `APRESENTACAO.md` (regras do roteiro), `img/` (prints do README), `skills/` (esta pasta). |

## Fluxo de dados

1. Os arquivos de `src/data/skills/` são sementes (`SkillSeed`), sem `unlocks`.
2. `normalizeSkills` (em `src/lib/graph.ts`) calcula `unlocks` a partir de `prerequisites`.
3. `SKILLS` vai para o canvas, para a busca e para as listas.
4. Para o idioma atual, `localSkills()` e `localSkillById()` aplicam o overlay de conteúdo sobre essas habilidades.
5. A interface lê as habilidades por esses acessores, nunca direto de `SKILLS` quando o texto aparece na tela.

`SKILLS` continua útil para contagens e ids, que não mudam com o idioma.

## Pontos de atenção

- **Ids são estáveis.** Ids de habilidades, passos, perguntas e benchmarks aparecem em links (`#habilidade=llm`), em overlays e no `localStorage`. Não renomeie sem migrar tudo.
- **Estado persistido.** O app guarda no navegador: posições (`ai-tech-tree:positions:v2`), tema, idioma (`ai-tech-tree:locale`), apresentação (`ai-tech-tree:presentation`) e a primeira visita (`ai-tech-tree:welcome-seen`). A apresentação pode estar aberta ao recarregar a página, porque o estado dela é restaurado.
- **Não use `window.location` para decidir o idioma.** O idioma vem de `src/i18n/state.ts`.
