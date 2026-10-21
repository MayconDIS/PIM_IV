---
name: design-dna
description: >
  Diretrizes visuais e especificações estéticas do Design System da EdTech Nex_TI (UNIP, PIM IV).
  Use esta skill para orientar a criação, edição ou estilização de qualquer interface,
  tela ou componente web do projeto Nex_TI.
---

# Skill: Design System & Identidade Visual (Nex_TI)

Esta skill orienta a identidade visual do Nex_TI. Consulte o
[Design DNA atualizado](../../design_DNA/diretrizes.md) e preserve a formatação
acadêmica da monografia ao aplicar a identidade em materiais de apresentação.

---

## 🎨 Paleta de Cores e Iluminação

O sistema utiliza um tema essencialmente escuro (*Dark Mode*) com atmosfera imersiva de profundidade digital.

### Cores Principais
*   **Fundo Principal (`--bg-color`)**: `#0b0c10` (cinza-grafite escuro).
*   **Fundo dos Cards (`--card-bg`)**: `#161b22` (cinza-chumbo com bordas de opacidade sutil).
*   **Acento Ciano (`--link-cyan` / `var(--nexti-cyan)`)**: `#00e6e6` — Usado para elementos interativos principais, botões de ação e realces de tecnologia.
*   **Acento Roxo (`var(--nexti-purple)`)**: `#8a2be2` — Acento secundário e brilho do fundo.

### Cores de Status e Gamificação
*   **Verde Sucesso (`var(--nexti-green)`)**: `#00ff88` — Usado para badges de XP, acertos no SM-2, status ativo e conclusões.
*   **Amarelo/Ouro (`#ffd700`)**: Usado para moedas virtuais (Coins), bônus e ranks altos.
*   **Vermelho Erro (`#ff5555`)**: Usado para erros no SM-2, botões de cancelamento ou alertas críticos.

### Focos de Luz Radiais (Glows)
A atmosfera imersiva é criada através de duas luzes difusas no fundo da tela via gradiente radial:
*   **Glow Esquerdo (Roxo)**: `hsla(260, 40%, 30%, 0.15)`
*   **Glow Direito (Ciano)**: `hsla(190, 40%, 30%, 0.15)`

---

## 🔤 Tipografia Oficial

A tipografia do projeto combina legibilidade premium de UI com elementos técnicos mono-espaçados:

1.  **Textos Técnicos e Monografias**:
    *   **Arial**: Fonte universal usada para o relatório acadêmico de PIM IV.
    *   A monografia mantém a tipografia acadêmica, sem substituir Arial pelas fontes decorativas do site.
2.  **Interface da Plataforma (UI)**:
    *   **Inter**: Fonte padrão para descrições, labels e textos de leitura na interface.
    *   **Fira Code**: Código, métricas técnicas e comandos de console.
    *   **Orbitron**: Marca `Nex_TI`.
    *   **Space Grotesk**: Títulos.

---

## 🧱 Componentes de UI Nex_TI

Qualquer novo componente de interface criado deve respeitar as seguintes diretrizes estéticas:

### 1. Flashcards (Estudo Ativo)
*   **Frente/Verso**: Cards com cantos arredondados, borda fina (`1px solid rgba(255, 255, 255, 0.05)`) e fundo escuro.
*   **Interação**: Efeito 3D de rotação no eixo Y ao clicar ou pressionar a barra de espaço.
*   **Status**: Botões de feedback rápidos e coloridos na base (ERRO em ciano/vermelho, SUCESSO em verde/ouro).

### 2. HUD de Gamificação
*   **XP e Coins**: Exibidos em badges compactas com bordas coloridas correspondentes e ícones da biblioteca de símbolos.
*   **Barra de Progresso**: Fina, preenchida de forma responsiva com gradiente ciano-roxo sem quebras órfãs.

### 3. Mapa Neural (Obsidian View)
*   **Nós (Nodes)**: Círculos com ícones que mudam de cor conforme o progresso da fase (concluído em verde, ativo em ciano, bloqueado em cinza/cadeado).
*   **Conexões (Edges)**: Linhas fluidas e finas com efeitos de opacidade sutil.
*   **Controles**: Widget flutuante no canto inferior para controle de zoom (Zoom In, Zoom Out) e acessibilidade.

---

## ♿ Acessibilidade Universal (WAI-ARIA)
*   Todas as imagens devem possuir tags `alt` descritivas ou `aria-label`.
*   Botões e controles interativos devem possuir tags `aria-label` adequadas para leitores de tela.
*   O sistema deve suportar nativamente **Alto Contraste** (inversão ou simplificação de cores de fundo e aumento de contraste nas bordas) e **Zoom de Texto** (manipulando a raiz `html { font-size: ... }`).
