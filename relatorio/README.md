# Relatório do Nex_TI (PIM IV)

O relatório do PIM IV em HTML e CSS, nas normas da ABNT, organizado nas nove etapas
do Manual do PIM IV. Para ler, abra o [`index.html`](index.html) no navegador; para
gerar o PDF, use *Imprimir → Salvar como PDF* (cada `<section class="page">` é uma
folha A4).

A versão em Word está em [`word/Relatorio_PIM_IV_Nex_TI.docx`](word/Relatorio_PIM_IV_Nex_TI.docx), com o
mesmo conteúdo, formatação ABNT e sumário automático. Para gerar de novo depois de mudar o
`index.html`: `cd word`, `npm install` e `npm run gerar`; ao abrir no Word, aceite atualizar os
campos para o sumário ganhar os números de página.

## O que tem aqui

```text
📁 relatorio/
├── 📄 index.html     # O relatório: introdução, as nove etapas, conclusão, referências e apêndice
├── 📄 style.css      # Formatação ABNT (margens, fontes, numeração das páginas)
├── 📁 word/          # O relatório em Word e o gerador dele
│   ├── 📄 Relatorio_PIM_IV_Nex_TI.docx  # O relatório em Word
│   └── 📄 gerar-docx.js  # Gera o .docx a partir do index.html
├── 📁 assets/
│   ├── 📁 branding/  # Logo da UNIP
│   ├── 📁 diagrams/  # Diagramas do Astah: casos de uso, classes, atividade, sequência, MER, DER e modelo físico
│   ├── 📁 telas/     # Fotos das telas reais do site (Apêndice A)
│   ├── 📁 trello/    # Prints do quadro do Trello (Etapa 9)
│   └── 📁 casos-de-uso/ # Classes e sequência de cada caso de uso, do Astah (Apêndice B)
└── 📁 design_DNA/    # Padrões visuais do relatório
```

Os diagramas são cópias dos que estão em [`../modelagem-uml`](../modelagem-uml), feitos a
partir do código do sistema.

## Em relação ao PIM III

O relatório trata só do PIM IV. A seção **1.4 Melhorias em relação ao PIM III** resume o que
mudou; a documentação do PIM III fica no repositório dele
([MayconDIS/PIM_III](https://github.com/MayconDIS/PIM_III)).
