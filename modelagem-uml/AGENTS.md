# modelagem-uml/ — os diagramas do Nex_TI

Leia primeiro o [`AGENTS.md`](../AGENTS.md) da raiz: as regras do projeto inteiro estão lá.
Aqui fica só o que é específico da modelagem.

## O que tem aqui

- `02_Modelagem_UML/Diagrams Nex_TI - PIM IV.asta`: todos os diagramas, gerados pelo programa em
  `02_Modelagem_UML/gerador-astah/` (API do Astah, rodando com o Java do próprio Astah).
- `02_Modelagem_UML/imagens-astah/`: as imagens de todos os diagramas, exportadas pelo Astah.
- As imagens principais ficam soltas em `02_Modelagem_UML/` (UML) e em `04_Banco_de_Dados/`
  (MER, DER e modelo físico), copiadas das exportadas.

## Regras da modelagem

- Diagramas só pelo gerador do Astah; não usamos PlantUML e não editamos o `.asta` à mão.
- Todo elemento tem a explicação no campo *Definition*.
- Caixas sem sobreposição e linhas que não passam por cima de outras caixas.
- Depois de gerar: exportar as imagens, copiar as principais e avisar quem cuida do relatório e dos
  slides (eles usam cópias dessas imagens).
