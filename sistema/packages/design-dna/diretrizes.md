# Design_DNA do Nex_TI

As cores e fontes abaixo são as que o site usa de verdade
(`sistema/packages/shared/css/global.css` e `dashboard.css`). Os valores
exatos estão em [`paleta.json`](paleta.json), e o [`design.html`](design.html)
mostra tudo junto. Mudou uma cor no site? Mude aqui também.

## Cores

| Uso | Cor | Onde aparece |
|---|---|---|
| Fundo | `#0b0c10` | Página inteira |
| Cartão | `#161b22` | Cartões, modais, painel de estudo |
| Campo | `#0d1117` | Inputs e botões de opção |
| Borda | `#30363d` | Bordas de cartões e campos |
| Texto | `#c5c6c7` | Texto normal |
| Texto secundário | `#8b92a5` | Legendas e descrições |
| **Ciano** | `#00e6e6` | Cor principal: links, borda ativa, verso da carta, brilho |
| **Verde** | `#00ff88` | Acerto, sucesso e XP |
| **Roxo** | `#8a2be2` | Acento secundário e brilho do fundo |
| Dourado | `#ffd700` | Moedas |
| Vermelho | `#ff5555` | Erro e botão de fechar |
| Amarelo | `#ffff00` | Só no modo de alto contraste |

**Brilho (glow):** o ciano aparece com sombra do mesmo tom, por exemplo
`text-shadow: 0 0 12px rgba(0, 230, 230, 0.4)`. No fundo há um brilho roxo
suave à esquerda e um ciano à direita.

## Fontes

| Fonte | Uso |
|---|---|
| **Orbitron** | A marca: "Nex" em branco e "_TI" em ciano |
| **Space Grotesk** | Títulos |
| **Inter** | Texto |
| **Fira Code** | Código, números técnicos e o terminal do painel |

## Regras

- Tema sempre escuro. Fundo claro só no modo de alto contraste, que é uma opção de acessibilidade.
- Ciano é a cor principal. Verde só para coisa boa (acertou, ganhou XP). Vermelho só para erro.
- Cor nunca sozinha: o acerto também diz "Acertou", o erro diz o que deu errado.
- Moedas sempre em dourado, com o ícone de moeda.
- Material visual da equipe (slides, relatório) usa estas mesmas cores e fontes,
  como em `sistema/docs/apresentacao-pa/slides.html`.
