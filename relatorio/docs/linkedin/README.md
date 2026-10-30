# Publicação no LinkedIn: pesquisa do Nex_TI

Material pronto para divulgar a [pesquisa do PIM IV](../pesquisa/README.md) no LinkedIn: o texto do
post, um carrossel de 7 slides e uma imagem única, feitos com as telas reais do sistema e as cores
dos slides do PIM.

| Arquivo | O que é |
|---|---|
| [`Nex_TI - Carrossel LinkedIn.pdf`](Nex_TI%20-%20Carrossel%20LinkedIn.pdf) | O carrossel (7 slides 1080×1350). É o que dá mais alcance |
| [`imagens/`](imagens/) | Cada slide em PNG e a `imagem-unica.png`, para um post com uma foto só |
| [`carrossel.html`](carrossel.html) | A fonte dos slides (HTML/CSS) |
| [`gerar-imagens.mjs`](gerar-imagens.mjs) | Gera os PNGs e o PDF: `node gerar-imagens.mjs`, nesta pasta |

Os slides usam as fotos de `relatorio/assets/telas` e os números do sistema (43 fases, 1198 cartas,
2 provas oficiais do ENADE, 453 testes). Mudou algum número ou foto? Edite `carrossel.html` e rode
`node gerar-imagens.mjs` de novo: ele avisa se algum texto passou da borda.

## O carrossel

1. **Capa:** "Estudar TI sem esquecer tudo na semana seguinte", com o painel no computador e no celular
2. **O problema:** muitos termos novos, estudo na véspera, esquecer em poucos dias
3. **Como funciona:** a carta virada e a revisão espaçada (SM-2)
4. **O que tem dentro:** 43 fases, 1198 cartas, provas do ENADE, XP e moedas
5. **Em qualquer tela:** celular e Mapa Neural
6. **Por trás:** .NET 10, SQL Server no Azure, React, React Native e os 453 testes
7. **Chamada:** "Me ajuda com 5 minutos?" e o link da pesquisa

## O texto do post

```text
Nos últimos meses, minha equipe e eu construímos o Nex_TI, uma plataforma para estudar TI. Agora preciso da ajuda de quem estuda na área.

A ideia surgiu de um problema que todo aluno de TI conhece: no começo do curso chega uma avalanche de termos novos, a gente estuda na véspera e esquece tudo uma semana depois.

Então montamos um sistema de flashcards com revisão espaçada (o algoritmo SM-2, o mesmo do Anki). Cada carta volta na hora certa, um pouco antes de você esquecer. São 43 fases e quase 1.200 cartas, com questões das provas oficiais do ENADE de ADS, XP, moedas e níveis para manter o ritmo.

Por trás, uma API em .NET 10 com SQL Server no Azure guarda o progresso e calcula as recompensas no servidor. O site em React e o app em React Native usam a mesma API, então dá para começar no computador e continuar no celular. São 453 testes automáticos rodando a cada mudança.

Falta a parte mais importante: saber se funciona para quem estuda de verdade. Por isso criamos uma pesquisa curta e anônima, sem nome, e-mail nem RA. Leva uns 5 minutos.

Se você estuda TI, entre no site, estude uma fase e depois responda:
nexti-pim-iv.vercel.app/pesquisa

Se não estuda, compartilhar já ajuda muito. Cada resposta entra no nosso Projeto Integrado (PIM IV) na UNIP.

Tecnologias: C#, .NET 10, SQL Server, Azure, React, React Native e Docker.
#DotNet #React #ReactNative #Azure #AnaliseDeSistemas
```

## Como postar o carrossel

1. No LinkedIn, clique em **Começar uma publicação** e cole o texto acima.
2. Clique no **+** (ou em **Mais**) e escolha **Adicionar um documento**.
3. Envie `Nex_TI - Carrossel LinkedIn.pdf` e dê um título, por exemplo *Nex_TI: estudar TI sem esquecer*.
4. Marque a equipe (Gabriel, Maciel, Miguel e Rafael) e publique.

Para um post com uma foto só, use `imagens/imagem-unica.png` no lugar do documento.

## Para ter mais alcance

- **Horário:** de terça a quinta, entre 8h e 9h ou na hora do almoço.
- **Primeira hora:** combine com a equipe de comentar logo depois de publicar. Comentários no começo
  levam o post para mais gente.
- **Responda todos os comentários**, se der com uma pergunta de volta.
- **Repostar com uma frase própria** vale mais que só compartilhar.
- **Não edite o post** nos primeiros minutos.
