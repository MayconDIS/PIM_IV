# Como trabalhar no Nex_TI (PIM IV)

Regras do projeto inteiro, para a equipe e para qualquer IA (Claude, Gemini/Antigravity, Copilot).
Os `AGENTS.md` de cada pasta (`sistema/`, `relatorio/` e `modelagem-uml/`) só complementam este; se algo
divergir, vale este arquivo. Cada pasta tem também um `CLAUDE.md` e um `GEMINI.md` que só importam o
`AGENTS.md` dela. As skills de IA ficam numa pasta só: `.agents/`, na raiz.

## O projeto

O Nex_TI é a versão final do PIM IV (UNIP, ADS, 4º semestre): uma plataforma para estudar TI com
flashcards, revisão espaçada (SM-2), gamificação e as provas oficiais do ENADE. Este repositório
juntou três que eram separados; hoje são três pastas **do mesmo projeto**:

| Pasta | O que tem | Formato |
|---|---|---|
| `sistema/` | O código: API .NET 10, site React, app Expo, pacote compartilhado, banco | Monorepo npm + .NET |
| `modelagem-uml/` | Os diagramas (Astah) e o banco (MER, DER, modelo físico) | `.asta` + imagens exportadas |
| `relatorio/` | O relatório ABNT, a versão em Word e as imagens que ele usa | HTML/CSS + `.docx` |

Os slides e o roteiro da apresentação ficam em `sistema/docs/apresentacao-pa/`.

## De onde vem cada informação

A ordem é sempre a mesma: **código → modelagem → relatório, Word e slides**.

1. O **código** (`sistema/`) é a verdade. Números (rotas, fases, cartas, testes) saem dele.
2. Os **diagramas** saem só do Astah, pelo gerador `modelagem-uml/02_Modelagem_UML/gerador-astah/`.
   Não usamos PlantUML. As imagens são exportadas pelo próprio Astah (`ExportarImagens.java`).
3. O **relatório** e os **slides** copiam as imagens da modelagem e os números do código; o **Word**
   é gerado do relatório (`relatorio/word`).

## Se mudar X, atualize Y

| Mudou | Atualize também |
|---|---|
| Rota da API | `sistema/docs/MANUAL_TECNICO.md` (tabela de rotas), relatório 2.4.3, número de rotas no README, no relatório e nos slides, diagramas do caso de uso no gerador do Astah |
| Regra de SM-2 ou de XP e moedas (`packages/shared`) | `npm run seed:api` (gera a tabela da API), testes compartilhados e da API, manual, relatório |
| Fases ou cartas (`content.js`) | `npm run seed:api`, número de fases e cartas no README, relatório e slides |
| Tabela ou entidade do banco | migration, `sistema/database/NexTI_DB.sql`, gerador do Astah (entidades, MER, DER, modelo físico), relatório Etapa 7 |
| Qualquer diagrama | gerador do Astah → gerar o `.asta` → exportar imagens → copiar as principais para `02_Modelagem_UML` e `04_Banco_de_Dados` → copiar para `relatorio/assets` → Word → PDF dos slides |
| Texto ou página do relatório | conferir que toda página cabe em A4 e gerar o Word de novo |
| Tela do site | tirar nova foto para o Apêndice A do relatório |

Antes de abrir um pull request, rode **`node scripts/verificar-sincronia.mjs`**. Ele confere se os
números dos documentos batem com o código, se os diagramas do relatório são os mesmos do Astah e
se o PIM III só aparece nas melhorias. O GitHub roda a mesma checagem em todo pull request.

## Regras

- **Só PIM IV.** O PIM III aparece apenas em "Melhorias em relação ao PIM III" (README e seção 1.4
  do relatório). A documentação dele fica em [MayconDIS/PIM_III](https://github.com/MayconDIS/PIM_III).
- **Linguagem simples.** Somos alunos: textos diretos, sem jargão desnecessário.
- **Diagramas só do Astah**, com a explicação de cada elemento no campo *Definition*.
- **Commits** em português, no padrão *Conventional Commits* (`feat(api):`, `docs(relatorio):`…).
- **Pull requests**: um assunto por PR. Quando um PR depende de outro, ele é aberto sobre o branch
  do outro; o merge segue a ordem da pilha (ver a descrição de cada PR).
- **Trello** (quadro PIM IV): todo cartão mexido recebe o link do PR num comentário e o Maycon como
  membro.
- **Nada de PIM III, `TODO` ou texto provisório** em arquivo entregue.

## Comandos

| O quê | Comando (na pasta indicada) |
|---|---|
| Subir API (porta 5000) e site (porta 5501) | `sistema/`: `npm install` e `npm run dev` |
| Testes da API / compartilhados / app | `sistema/`: `npm test`, `npm run test:shared`, `npm run test:mobile` |
| Tabelas da API a partir do conteúdo | `sistema/`: `npm run seed:api` (e `npm run seed:api:check` para conferir) |
| Gerar o `.asta` | ver `modelagem-uml/02_Modelagem_UML/gerador-astah/README.md` |
| Exportar as imagens do Astah | idem (`ExportarImagens.java`) |
| Gerar o Word do relatório | `relatorio/word/`: `npm install` e `npm run gerar` |
| Conferir a sincronia | raiz: `node scripts/verificar-sincronia.mjs` |

O Live Server do editor usa a porta **5500** (para abrir o relatório); a 5501 é do site.

## O time (agentes)

Para tarefas grandes, divida o trabalho entre estes papéis (no Claude Code ficam em
`.claude/agents/`; em outras IAs, use a descrição como roteiro):

| Papel | Cuida de |
|---|---|
| `coordenador` | Entende o pedido, vê na tabela acima o que muda em cada pasta, divide o trabalho, define a ordem dos PRs e atualiza o Trello |
| `dev-sistema` | Código da API, do site, do app e do pacote compartilhado, com testes |
| `modelador-astah` | Diagramas no gerador do Astah, exportação das imagens e cópias para as pastas |
| `redator-relatorio` | Relatório ABNT, Word, slides e roteiro, sempre com os números do código |
| `revisor-sincronia` | Roda a checagem de sincronia e os testes, mede as páginas A4 e aponta o que ficou para trás |
