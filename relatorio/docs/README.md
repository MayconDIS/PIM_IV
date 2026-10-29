# relatorio/docs — apresentação do PIM IV

A apresentação do Nex_TI para a avaliação do PIM IV (24/11 a 03/12/2026). Ela conta o projeto
com **começo, meio e fim**, como o professor pediu:

- **Começo (slides 1–6):** o problema, como a equipe levantou os requisitos (elicitação), o caminho
  de uma necessidade até o teste e a solução em números.
- **Meio (7–19):** as oito disciplinas do semestre, sempre no mesmo formato: o que a disciplina
  ensinou → onde usamos no Nex_TI → a prova no sistema. Empreendedorismo traz o organograma, o Canvas
  e a SWOT do Nex_TI. Fecha com uma resposta do aluno passando pelas oito.
- **Fim (20–23):** os resultados dos testes, o que a equipe aprendeu (problema → solução), a conclusão
  respondendo aos problemas do começo e a demonstração.

Usa os mesmos números e imagens do relatório.

| Arquivo | O que é |
|---|---|
| [`apresentacao/slides.html`](apresentacao/slides.html) | Os 23 slides. Abrem no navegador e têm modo apresentação próprio |
| [`apresentacao/Nex_TI - Apresentacao PIM IV.pdf`](apresentacao/Nex_TI%20-%20Apresentacao%20PIM%20IV.pdf) | Os mesmos slides em PDF (A4 paisagem), para enviar ou projetar |
| [`apresentacao/ROTEIRO_DO_PALESTRANTE.md`](apresentacao/ROTEIRO_DO_PALESTRANTE.md) | Quem fala o quê (20 minutos), o tempo de cada slide e as perguntas prováveis |
| [`apresentacao/gerar-pdf.mjs`](apresentacao/gerar-pdf.mjs) | Gera o PDF de novo depois de mudar os slides |

## Como apresentar

1. Abra `apresentacao/slides.html` no Chrome ou no Edge (dois cliques no arquivo, ou o Live
   Server do editor na porta 5500).
2. Clique em **▶ Apresentar** (ou aperte **P**) e depois **F** para a tela cheia.
3. **→** e **←** trocam o slide; **N** mostra a fala do slide, o tempo e o número do slide;
   **Esc** sai.

Sem internet, as fontes do Google não carregam e o navegador usa outra parecida; o PDF já leva
as fontes dentro e serve de plano B.

## Como mudar

- **Texto ou número:** edite `slides.html`; a fala de cada slide fica no `<aside class="notas">`
  dele. Os números vêm do código, pelo relatório: não escreva de memória.
- **Imagens:** os slides usam as mesmas imagens do relatório (`../assets/telas`,
  `../assets/diagrams` e `../assets/trello`), então uma tela ou um diagrama novo no relatório
  já aparece aqui, sem cópia para atualizar.
- **PDF:** na pasta `apresentacao`, rode `node gerar-pdf.mjs`. Ele também avisa se algum
  conteúdo passou da borda de algum slide ou se alguma imagem não foi encontrada.
- **Tempo da apresentação:** se a banca der outro tempo, ajuste a tabela "Equipe e divisão" do
  roteiro.

A checagem do projeto (`node scripts/verificar-sincronia.mjs`, na raiz) também confere os números
dos slides e do roteiro, junto com os do relatório e do README.
