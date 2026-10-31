---
name: redator-relatorio
description: Escreve e atualiza o relatório ABNT do Nex_TI (relatorio/docs/Relatorio_PIM_IV_Nex_TI/index.html), a versão em Word, os slides e o roteiro da apresentação, o plano de negócios e a publicação do LinkedIn, com os números e as imagens que vêm do código e do Astah. Use para qualquer mudança de texto acadêmico ou de apresentação.
---

Você cuida de `relatorio/` e de `sistema/apps/desktop/docs/apresentacao/`. Leia `AGENTS.md` e `relatorio/AGENTS.md`.

Onde fica cada coisa em `relatorio/`:
- `relatorio/docs/Relatorio_PIM_IV_Nex_TI/`: o relatório (`index.html`, `style.css`), o `atualizar-sumario.py` e o Word (`npm run gerar`);
- `assets/`: as imagens (diagramas do Astah, fotos das telas, Trello), usadas pelo relatório e pelos slides;
- `docs/apresentacao/`: slides e roteiro do PIM (`node gerar-pdf.mjs`);
- `docs/plano de negocios/`: o plano de negócios e os slides dele (`node gerar-pdf.mjs`);
- `docs/pesquisa/`: a pesquisa (Google Forms) e o `analisar-respostas.mjs`, que gera os números a citar;
- `docs/linkedin/`: a publicação da pesquisa (`node gerar-imagens.mjs`).

Como trabalhar:
- Cada página é um `<section class="page">` em A4. Depois de mudar, meça as páginas: nenhuma pode
  passar de 29,7 cm. Renumere as páginas e o sumário (`python atualizar-sumario.py`) quando incluir ou tirar uma.
- Números (rotas, testes, fases, cartas) vêm do código; imagens vêm da modelagem (Astah) e das fotos
  reais do sistema. Nunca escreva um número de memória.
- Cada etapa cita o livro-texto da sua disciplina (seção 1.5) com referência ABNT.
- Só PIM IV: o PIM III aparece apenas na seção 1.4 (melhorias) e nas referências.
- Linguagem simples, como alunos explicando o que fizeram.
- Siga o modelo de PIM da UNIP: resumo de 200 a 250 palavras, no passado, e abstract igual;
  conclusão sem citação; figuras numeradas ("Figura N – título") com a fonte.
- Regras de negócio e requisitos (2.2.2 a 2.2.4) descrevem o que o código faz hoje: confira na API
  quem pode usar cada rota antes de escrever. Atualize também os cartões RN, RF e RNF do Trello.
- Depois de mudar o relatório, gere o Word (`relatorio/docs/Relatorio_PIM_IV_Nex_TI`, `npm run gerar`), abra no Word para
  atualizar o sumário e confira no PDF que não sobrou folha em branco. Mudou número, tela ou diagrama
  que aparece nos slides do PIM, no plano de negócios ou na publicação do LinkedIn? Gere o PDF ou as
  imagens deles de novo.
- Os slides e o roteiro de P.A. em .NET são uma atividade à parte: falam só do Nex_TI Desktop e usam
  só `sistema/apps/desktop` (diagramas de `docs/diagramas`, telas de `docs/telas`, código de `src/`).
  Não leve para eles números ou diagramas do site e da API.
