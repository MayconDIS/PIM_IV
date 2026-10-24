# relatorio/ — o relatório ABNT do Nex_TI

Leia primeiro o [`AGENTS.md`](../AGENTS.md) da raiz: as regras do projeto inteiro estão lá.
Aqui fica só o que é específico do relatório.

## O que tem aqui

- `index.html` e `style.css`: o relatório, uma folha A4 por `<section class="page">`.
- `word/Relatorio_PIM_IV_Nex_TI.docx`: a versão em Word, gerada do HTML por `word/gerar-docx.js`.
- `assets/diagrams/` e `assets/casos-de-uso/`: cópias exatas das imagens exportadas do Astah.
- `assets/telas/`: fotos das telas reais do site (Apêndice A).
- `assets/trello/`: prints do quadro do Trello (Etapa 9).

## Regras do relatório

- Nenhuma página passa de 29,7 cm. Incluiu ou tirou página? Renumere as páginas e o sumário.
- Números e imagens vêm do código e da modelagem, nunca de memória.
- Cada etapa cita o livro-texto da sua disciplina (seção 1.5), com referência ABNT.
- O PIM III aparece só na seção 1.4 (melhorias) e nas referências.
- Mudou o HTML? Gere o Word de novo (`word/`: `npm run gerar`) e atualize o sumário no Word.
- O Live Server do editor usa a porta 5500 para abrir o relatório.
