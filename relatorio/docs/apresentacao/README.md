# relatorio/docs/apresentacao — apresentação do PIM IV

A apresentação do Nex_TI para a avaliação do PIM IV (24/11 a 03/12/2026). Ela conta o projeto
com **começo, meio e fim**, como o professor pediu:

- **Começo (slides 1–7):** a equipe (organograma do DevTeam), o problema, como a equipe levantou os requisitos (elicitação), o caminho
  de uma necessidade até o teste e a solução em números.
- **Meio (8–31):** as oito disciplinas do semestre, sempre no mesmo formato: o que a disciplina
  ensinou → onde usamos no Nex_TI → a prova no sistema, e logo depois um exemplo real (código, diagrama,
  tela ou cartão do Trello). Empreendedorismo traz o organograma, o Canvas,
  a SWOT e o plano de negócios do Nex_TI (o custo hoje e ao crescer, a meta de vendas e os indicadores). Fecha com uma resposta do aluno passando pelas oito.
- **Fim (32–36):** os resultados dos testes, o que a equipe aprendeu (problema → solução), a conclusão
  respondendo aos problemas do começo, a demonstração e uma página de agradecimento.

Usa os mesmos números e imagens do relatório.

| Arquivo | O que é |
|---|---|
| [`slides.html`](slides.html) | Os 36 slides. Abrem no navegador e têm modo apresentação próprio |
| [`Nex_TI - Apresentacao PIM IV.pdf`](Nex_TI%20-%20Apresentacao%20PIM%20IV.pdf) | Os mesmos slides em PDF (A4 paisagem), para enviar ou projetar |
| [`ROTEIRO_DO_PALESTRANTE.md`](ROTEIRO_DO_PALESTRANTE.md) | Quem fala o quê (cerca de 28 minutos e meio), o tempo de cada slide e as perguntas prováveis |
| [`gerar-pdf.mjs`](gerar-pdf.mjs) | Gera o PDF de novo depois de mudar os slides |
| [`../plano de negocios/PLANO_DE_NEGOCIOS.md`](../plano%20de%20negocios/PLANO_DE_NEGOCIOS.md) | O plano de negócios do Nex_TI (simulação): 4 P's, premissas, contas e fontes dos preços; a apresentação dele fica na mesma pasta |

## Como apresentar

1. Abra `slides.html` no Chrome ou no Edge (dois cliques no arquivo, ou o Live
   Server do editor na porta 5500).
2. Clique em **▶ Apresentar** (ou aperte **P**) e depois **F** para a tela cheia.
3. **→** e **←** trocam o slide; **N** mostra a fala do slide, o tempo e o número do slide;
   **Esc** sai.

Sem internet, as fontes do Google não carregam e o navegador usa outra parecida; o PDF já leva
as fontes dentro e serve de plano B.

## Como mudar

- **Texto ou número:** edite `slides.html`; a fala de cada slide fica no `<aside class="notas">`
  dele. Os números vêm do código, pelo relatório: não escreva de memória.
- **Imagens:** os slides usam as mesmas imagens do relatório (`../../assets/telas`,
  `../../assets/diagrams` e `../../assets/trello`), então uma tela ou um diagrama novo no relatório
  já aparece aqui, sem cópia para atualizar.
- **PDF:** nesta pasta, rode `node gerar-pdf.mjs`. Ele também avisa se algum
  conteúdo passou da borda de algum slide ou se alguma imagem não foi encontrada.
- **Tempo da apresentação:** se a banca der outro tempo, ajuste a tabela "Equipe e divisão" do
  roteiro.

A checagem do projeto (`node scripts/verificar-sincronia.mjs`, na raiz) também confere os números
dos slides e do roteiro, junto com os do relatório e do README.
