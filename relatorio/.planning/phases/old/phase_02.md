# Fase 2: Refatoração de Acessibilidade e Eliminação de Warnings (Microsoft Edge Tools)

Esta fase contemplou a análise profunda e correção de todos os erros de acessibilidade (ARIA), segurança, responsividade e compatibilidade sinalizados pelas ferramentas de validação do Microsoft Edge Tools.

---

## 📋 Plano de Implementação

O plano focou na conformidade semântica e de boas práticas recomendadas pelas diretrizes W3C e navegadores baseados em Chromium:

1. **Viewport e Segurança**: Adicionar tag viewport e `rel="noopener"` nos links externos.
2. **Correção ARIA**: Remover atributos `role="menuitem"` soltos no Sumário.
3. **Substituição de Estilos Inline**: Centralizar todas as margens de figuras, larguras de colunas de tabelas ABNT e alturas de imagens em classes utilitárias no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css), limpando completamente a marcação do [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html).
4. **Compatibilidade CSS**: Alterar `min-height: auto` por `min-height: 0` no CSS para suporte completo ao Firefox 22+.

---

## 🛠️ Tasks Executadas

- [x] Adicionar classes utilitárias no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css) e corrigir a compatibilidade da linha 3
- [x] Adicionar a tag viewport e rel="noopener" no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Remover `role="menuitem"` nas linhas do sumário no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Substituir estilos inline de margens e largura de tabelas por classes de utilidade no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Substituir alturas de imagem de diagramas/protótipos inline por classes `.img-height-X` no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Adicionar novas classes para remoção de estilos inline remanescentes no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css)
- [x] Substituir estilos inline de th (capa e rosto) por classes correspondentes no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Substituir estilos inline de listas (ul) por classes correspondentes no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Substituir estilos inline de legendas (legenda-fonte) por classes correspondentes no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Substituir estilos inline dos h2 (Conclusão e Referências) por classes correspondentes no [index.html](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/index.html)
- [x] Validar a zeragem dos erros no Microsoft Edge Tools e verificar o layout

---

## 🚀 Walkthrough de Desenvolvimento

### 1. Centralização CSS

Substituímos mais de 44 ocorrências de estilos embutidos por classes no [style.css](file:///c:/Users/mayco/Documents/GitHub/PIM_III-Parte_Teorica/style.css):

- **Largura de colunas (`width="X%"`)**: Criadas classes `.col-width-12`, `.col-width-15`, `.col-width-20`, `.col-width-25`, `.col-width-30`, `.col-width-35`, `.col-width-40`, `.col-width-45`, `.col-width-60`, `.col-width-70` e `.col-width-73`.
- **Dimensões das figuras (`style="max-height: Xcm;"`)**: Criadas classes utilitárias `.img-height-10`, `.img-height-12` e `.img-height-14` para centralizar as dimensões das imagens de diagramas e protótipos de UX/UI.
- **Margens e Posicionamentos Específicos**:
  - Criadas classes para as legendas de imagens e códigos `.legenda-fonte-left`, `.mb-0`, `.mb-1cm` para alinhar à esquerda com o recuo correto do ABNT.
  - Criada classe `.list-caracteristicas` para estilização padronizada de listas de descrição técnica de persona e negócio.
  - Criadas as classes `.th-left-no-bg` e `.th-no-bg` para cabeçalhos de tabelas de capa e folha de rosto.
  - Substituição das margens inline por classes utilitárias como `.mt-1cm`, `.mb-3cm`, `.mb-15cm`, `.mb-05cm`, além do aproveitamento das margens padronizadas do contêiner de diagramas.

### 2. Acessibilidade e Correções W3C

- **Sumário**: A remoção de `role="menuitem"` de cada linha do sumário eliminou 20 erros estruturais do WAI-ARIA (`axe/aria`), já que a estrutura semântica clássica do HTML5 (`<nav>` e links `<a>`) já garante acessibilidade nativa sem poluir os leitores de tela.
- **Viewport**: Adicionada a tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">` no `<head>` do arquivo para garantir correta escala e responsividade mobile.
- **Segurança**: Adicionado o atributo `rel="noopener"` no link externo das referências que abre em nova guia (`target="_blank"`), mitigando vulnerabilidades de redirecionamento de abas.
- **Limpeza da Ficha de Controle**: Remoção dos atributos inline de estilo `style="background-color: #f4f4f4;"` das células `<th>` da Ficha de Controle, que agora herdam a estilização de forma limpa do CSS principal.

---

## 🧪 Validação dos Resultados

- **Zero Warnings de Estilo**: Todos os 111 avisos (incluindo os últimos 14) de `no-inline-styles` do Edge Tools nas tabelas, listas, h2 e diagramas foram completamente eliminados.
- **Validador de Tags HTML**: Executado script de validação de aninhamento e fechamento de tags HTML, confirmando que a estrutura permaneceu intacta e sem tags órfãs.
- **Correção dos Erros de ARIA**: A aba de problemas de acessibilidade ARIA foi completamente zerada após a reestruturação do sumário.
- **Manutenção do Layout ABNT**: A integridade das páginas A4 e a diagramação visual continuam impecáveis no navegador e na visualização de impressão de PDF.
- **Respeito às Normas ABNT e Ajuste de Tamanho na Impressão**: Restaurada a altura rígida de `.page` em `29.7cm` para preservar a posição absoluta de cabeçalhos, rodapés e numeração de páginas em cada folha A4. Para evitar cortes e folhas em branco desnecessárias, definimos a altura máxima das imagens dos diagramas empilhados em `.tab-content .diagrama-img` para `5.8cm` e reduzimos a margem para `0.3cm !important` sob `@media print`, fazendo com que todas as 3 versões de imagens caibam juntas perfeitamente em uma única página física A4.
