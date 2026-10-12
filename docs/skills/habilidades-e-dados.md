# Habilidades e dados

Cada habilidade é um objeto em `src/data/skills/<area>.ts`, do tipo `SkillSeed`. O guia completo de inclusão está no README; aqui ficam os padrões que os testes cobram.

## Áreas (colunas) e patamares (linhas)

- Cinco áreas, nesta ordem, que é a ordem das colunas (`DOMAINS` em `src/types/skill.ts`): `architectures` (0), `compute` (1), `reasoning` (2), `robotics` (3), `alignment` (4).
- Cinco patamares: `tier` de 1 (base, machine learning clássico) a 5 (topo, superinteligência teórica).
- `gridCoordinates.col` tem que bater com a área; `row` é a posição dentro da célula. Ao reordenar, use "Auto-organizar", não números à mão.

## Campos de uma habilidade

- `id`: kebab-case, único, estável. Vira o link `#habilidade=<id>`.
- `name`: nome em português. Em inglês, vai no overlay.
- `signatureColor`: `sig(n)` de `src/lib/color.ts`, com `n` único. Réplicas usam a **mesma** cor.
- `prerequisites`: ids que precisam existir antes. `unlocks` não se escreve: é calculado.
- `metadata`: `status` (`theoretical`, `research`, `production`, `commodity`), `dateIntroduced` (`AAAA` ou `AAAA-MM`), `companies`, `modelsAssociated` opcional.
- `content`: `overview`, `impact`, `history` (ano, evento, importância 1 a 5), `actors` (nome, papel, organização), `equations` opcionais, `mermaidDiagram` opcional, `benchmarks` opcional, `sources` (título, url, tipo `paper`/`repo`/`article`, resumo).

## Réplicas

Uma habilidade que aparece em outra área é uma **réplica**:

- `isDuplicateInstance: true`, `rootEntityId` apontando para o id da instância original.
- Mesma `signatureColor` da original.
- A réplica não repete os dados completos: a aba "Como usar" aponta para a original.
- Não puxa nem é puxada pelo "Auto-organizar" (ver `src/lib/arrange.ts`).

## Fontes

- Só links que você conferiu. Antes de incluir um link, abra a página ou busque o título.
- Resumo curto escrito a partir da fonte, não trecho copiado.

## Quando alterar uma habilidade existente

- Se o texto aparece em inglês, atualize também `src/i18n/content/en.ts` (mesmo id, mesma ordem das listas).
- Se mudou a ordem ou o número de histórias, atores, equações ou fontes, o overlay precisa acompanhar; `i18n.test.ts` acusa.
- Se mudou algo que aparece num passo da apresentação ou da história, confira `src/presentation/steps.ts` e `history.ts`.

## Testes que protegem os dados

`src/__tests__/data.test.ts` confere ligações sem ciclos, cores únicas, URLs válidas, `unlocks` como inverso de `prerequisites` e a integridade da árvore. `npm test` precisa passar antes do commit.
