# Skills do projeto (padrões para agentes)

Esta pasta explica o padrão do AI Tech Tree & Knowledge para quem for mexer no código, humano ou agente. Leia antes de alterar algo. Cada arquivo cobre um assunto e aponta para o código real; quando o código e este texto divergirem, confie no código e corrija o texto.

## Ordem de leitura

1. [arquitetura.md](arquitetura.md): o mapa das pastas e quem é dono de cada coisa.
2. [i18n.md](i18n.md): idiomas, dicionários da interface e conteúdo traduzido.
3. [habilidades-e-dados.md](habilidades-e-dados.md): como incluir ou alterar uma habilidade.
4. [apresentacao-e-faq.md](apresentacao-e-faq.md): roteiros, FAQ, patamares, maturidades e benchmarks.
5. [interface.md](interface.md): cabeçalho, gaveta, painéis, teclado e estilo visual.
6. [testes-e-entrega.md](testes-e-entrega.md): testes, CI, publicação, commits e o checklist.

## Regras que valem para tudo

- **Português é a fonte.** Todo texto novo nasce em português; o inglês vem depois, pelo overlay de conteúdo ou pelo dicionário `en`.
- **Nada de texto fixo nos componentes.** Rótulos passam por `t()`. Texto que depende do idioma não é calculado no carregamento do módulo; é uma função que lê o idioma atual.
- **Commit e push são decisões do dono do projeto.** Faça o commit local e pergunte antes do `git push`. Cada push precisa de confirmação, mesmo se o anterior foi autorizado.
- **O checklist é a memória do projeto.** Pedidos entram em `docs/CHECKLIST.md` na hora; `[x]` só com evidência (commit, teste ou verificação real).
- **Verifique antes de dizer que está pronto.** Typecheck, lint, testes e build passam, e a mudança de interface foi conferida no navegador ou pelo teste de ponta a ponta.

## Como usar estes arquivos com Claude Code

Estes arquivos são markdown comum: qualquer agente pode lê-los. Se quiser que o Claude Code os carregue como skills, mova cada um para `.claude/skills/<nome>/SKILL.md` com o cabeçalho que o Claude Code exige.
