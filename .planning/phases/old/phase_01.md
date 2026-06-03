# Fase 1: Integração de Ativos Visuais e Abas Dinâmicas

Esta fase contemplou o planejamento, desenvolvimento e consolidação dos diagramas de arquitetura, banco de dados e modelagem de casos de uso na documentação acadêmica interativa do PIM III.

---

## 📋 Plano de Implementação: Integração Dinâmica dos Diagramas

Este plano visou a integração das três versões de cada diagrama (Visão Geral, Corte 1 e Corte 2) no documento [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html), fornecendo uma navegação interativa por abas (Tabs) no navegador e um layout empilhado clássico para impressão em PDF/papel de acordo com as normas ABNT.

### Proposta de Interatividade
Para manter o layout limpo e não estourar a paginação física de 27 páginas do relatório na visualização web, criamos um componente de **Abas Interativas (Tabbed Interface)** em Vanilla CSS e JS para cada diagrama:
- **Diagrama DER** (Banco de Dados)
- **Diagrama de Casos de Uso** (UML)
- **Diagrama de Classes** (UML)
- **Diagrama de Sequência** (UML)

* **Visualização de Tela (`screen`)**: Apresenta uma barra de abas moderna no topo de cada contêiner de diagrama. Permite alternar suavemente (com efeito de transição de opacidade) entre a **Visão Geral** e os **Cortes 1 e 2**.
* **Visualização de Impressão (`print`)**: Oculta a barra de abas interativas. Expande e exibe **todas as três versões** sequencialmente, garantindo que o avaliador que imprimir ou gerar o PDF tenha acesso total a todos os diagramas e cortes em páginas consecutivas de forma transparente.

### Propostas de Alteração
1. **Estilização CSS: [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css)**:
   * Design moderno das abas: botões sem bordas, com indicação de estado ativo, seguindo a identidade visual do relatório.
   * Transição de fade-in suave para troca de conteúdo.
   * Regra `@media print` para ocultar os controles de abas e forçar a exibição de todas as imagens empilhadas.
2. **Marcação HTML: [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)**:
   * Substituição dos contêineres de diagramas simples pela estrutura de abas.
   * Integração dos arquivos corretos do diretório `assets/diagrams/`:
     * **DER**: `DER_Nex_TI.png` (Visão Geral), `DER_Nex_TI 01.png` (Corte 1) e `DER_Nex_TI 02.png` (Corte 2).
     * **Casos de Uso**: `UseCase Diagrams Nex_TI.png` (Visão Geral), `UseCase Diagrams Nex_TI 01.png` (Corte 1) e `UseCase Diagrams Nex_TI 02.png` (Corte 2).
     * **Classes**: `Class Diagram Nex_TI.png` (Visão Geral), `Class Diagram Nex_TI 01.png` (Corte 1) e `Class Diagram Nex_TI 02.png` (Corte 2).
     * **Sequência**: `Sequence Diagram Nex_TI.png` (Visão Geral), `Sequence Diagram Nex_TI 01.png` (Corte 1) e `Sequence Diagram Nex_TI 02.png` (Corte 2).
   * Inserção de um bloco `<script>` ao final do arquivo para gerenciar as classes ativas das abas.

---

## 🛠️ Tasks Executadas

- [x] Adicionar estilos CSS para as abas no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css)
- [x] Implementar a estrutura de abas e os diagramas corretos (Visão Geral, Corte 1 e Corte 2) no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Adicionar o script Vanilla JS para controle de alternância no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Validar a interatividade e o modo de impressão (Ctrl + P) no navegador

---

## 🚀 Walkthrough: Integração Dinâmica de Diagramas (Nex_TI)

Concluímos com sucesso a integração das três versões de cada diagrama no documento do relatório acadêmico [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html).

### O que foi Desenvolvido
1. **Estilização no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css)**:
   * Criadas as classes `.tabs-control`, `.tab-btn` e `.tab-content` para estruturar a alternância visual das abas.
   * Adicionado efeito de transição de opacidade (`transition: opacity 0.2s ease-in-out`) para suavizar a troca das imagens.
   * Configurado o comportamento de impressão sob a regra `@media print` para ocultar os controles e exibir todas as imagens em cascata.
2. **Estrutura HTML no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)**:
   * Substituição dos contêineres de imagem simples pelas estruturas dinâmicas de abas.
   * Integração de metadados de acessibilidade `WAI-ARIA` (`role="tablist"`, `role="tab"`, `aria-selected`, `role="tabpanel"`) para assegurar a leitura nativa por leitores de tela em conformidade com as exigências de acessibilidade.
3. **Script Vanilla JS no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)**:
   * Um script leve e desacoplado que gerencia a troca da classe `.active` e do estado `aria-selected` de forma independente para cada contêiner de diagrama.

### Validação dos Resultados
* **Interatividade Web**: No modo tela, o leitor pode clicar nas abas para navegar dinamicamente entre as visões completas e cortes detalhados, mantendo o layout limpo e sem esticar a página.
* **Layout ABNT**: Ao acionar a impressão/visualização de PDF (Ctrl + P), o documento renderiza automaticamente todas as imagens de maneira sequencial e ordenada com suas respectivas legendas originais, garantindo conformidade acadêmica total para a entrega.
