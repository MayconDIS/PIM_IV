# relatorio/ — o relatório ABNT do Nex_TI

Leia primeiro o [`AGENTS.md`](../AGENTS.md) da raiz: as regras do projeto inteiro estão lá.
Aqui fica só o que é específico do relatório.

## O que tem aqui

- `index.html` e `style.css`: o relatório, uma folha A4 por `<section class="page">`.
- `word/Relatorio_PIM_IV_Nex_TI.docx`: a versão em Word, gerada do HTML por `word/gerar-docx.js`.
- `assets/diagrams/` e `assets/casos-de-uso/`: cópias exatas das imagens exportadas do Astah.
- `assets/telas/`: fotos das telas reais do site (Apêndice A).
- `assets/trello/`: prints do quadro do Trello (Etapa 9).
- `docs/`: a apresentação do PIM IV (slides em HTML com modo apresentação, PDF e roteiro). Usa as
  imagens de `assets/` e os números do relatório; depois de mudar, `node gerar-pdf.mjs` em
  `docs/apresentacao`.

## Regras do relatório

- Nenhuma página passa de 29,7 cm. Incluiu ou tirou página ou título? Rode `python atualizar-sumario.py`:
  ele renumera as páginas e refaz o sumário, com link e página em cada linha.
- Números e imagens vêm do código e da modelagem, nunca de memória.
- Cada etapa cita o livro-texto da sua disciplina (seção 1.5), com referência ABNT.
- O PIM III aparece só na seção 1.4 (melhorias) e nas referências.
- Mudou o HTML? Gere o Word de novo (`word/`: `npm run gerar`) e atualize o sumário no Word.
  Confira no PDF exportado do Word que não sobrou folha em branco.
- Modelo de PIM da UNIP: resumo num parágrafo só, no passado, com 200 a 250 palavras (o abstract é a
  tradução dele); conclusão sem citação, ligando o problema às soluções; figuras numeradas
  ("Figura N – título") com a fonte embaixo; ficha de controle com orientador, e-mail e curso.
- Encontros com o orientador só com datas reais, preenchidas com ele; os registros da equipe saem do
  histórico do Trello e do GitHub.
- O Live Server do editor usa a porta 5500 para abrir o relatório.
