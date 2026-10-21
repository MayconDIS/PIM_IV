# Design System Nex_TI: Cores e Tipografia

Este documento detalha os tokens visuais do Nex_TI. A referência mantida é o
[Design DNA do sistema](../../../sistema/packages/design-dna/diretrizes.md),
baseado no CSS atual do site.

---

## 1. Paleta de Cores (Color Palette)

O Nex_TI adota um tema escuro (*Dark Mode*) imersivo de alta tecnologia, utilizando cores frias e acentos vibrantes para feedback e gamificação.

### Cores de Fundo e Contêineres
* **Fundo Principal (`--nexti-dark`)**: `#0b0c10`.
* **Fundo de Cards/Modais (`--nexti-card`)**: `#161b22`.
* **Bordas Sutis**: `rgba(255, 255, 255, 0.05)` (borda de 1px para dar profundidade aos cards).

### Acentos Principais (Aesthetic Accents)
* **Ciano Nex_TI (`var(--nexti-cyan)`)**: `#00e6e6` — Utilizado para botões principais, realces e links interativos.
* **Roxo (`var(--nexti-purple)`)**: `#8a2be2` — Acento secundário e brilho do fundo.

### Cores de Status (Gamificação e Algoritmo)
* **Verde Progresso (`var(--nexti-green)`)**: `#00ff88` — Respostas de sucesso, badges de XP e cartões dominados no SM-2.
* **Amarelo Ouro (`#ffd700`)**: Moedas virtiais (Coins), conquistas e realces dourados.
* **Vermelho Alerta (`#ff5555`)**: Respostas de erro, cancelamentos ou ações críticas.

---

## 2. Atmosfera e Efeitos de Brilho (Glows)

A profundidade visual é acentuada com luzes difusas no plano de fundo (gradientes radiais):
* **Glow Roxo (Esquerda/Centro)**: `hsla(260, 40%, 30%, 0.15)`
* **Glow Ciano (Direita/Centro)**: `hsla(190, 40%, 30%, 0.15)`
* **Glow de Cards**: Aplicação de box-shadow suave `0 8px 32px rgba(0, 230, 230, 0.05)` ao passar o mouse.

---

## 3. Tipografia Oficial (Typography)

A tipografia combina legibilidade corporativa com visual técnico monoespaçado:

* **Textos Gerais e Interfaces (UI)**: Fonte **Inter** (ou Arial/Sans-serif como fallback). Oferece clareza em resoluções variadas.
* **Títulos**: **Space Grotesk**.
* **Marca Nex_TI**: **Orbitron**.
* **Código e Métricas Técnicas**: **Fira Code**.
* **Monografia**: mantém Arial e a formatação acadêmica em fundo branco.
