# Pesquisa do Nex_TI (Google Forms)

Um questionário para colher **dados quantitativos e qualitativos** sobre o Nex_TI e sobre a
apresentação e o relatório do PIM IV. Os resultados servem para:

- **Relatório:** completar a elicitação (seção 2.2.3), que hoje registra que faltam entrevistas e um
  questionário com usuários reais, e trazer números de usabilidade (nota SUS).
- **Plano de negócios:** conferir o preço de R$ 9,90 e a vontade de recomendar, que hoje são premissas, e
  os 4 P's: forma de pagamento, ofertas que fariam a pessoa assinar e onde ela gostaria de conhecer o Nex_TI.
- **Apresentação:** saber o que ficou claro, o que confundiu e se o tempo foi bom.

| Arquivo | O que é |
|---|---|
| [`QUESTIONARIO.md`](QUESTIONARIO.md) | As 39 perguntas, marcadas como [QUANT] (29) ou [QUAL] (10), para ler e revisar |
| [`criar-formulario.gs`](criar-formulario.gs) | Script do Google Apps Script que cria o formulário pronto, com a planilha de respostas |
| [`analisar-respostas.mjs`](analisar-respostas.mjs) | Lê as respostas (CSV) e gera o resumo com os números e as respostas abertas por tema |

## Que dados saem dele

**Quantitativos:** perfil (curso e semestre), como a pessoa estuda e o que atrapalha, onde usou o
sistema e o que fez nele, **nota SUS** de 0 a 100 (facilidade de uso), partes mais úteis, motivação
com XP e moedas, quanto pagaria, forma de pagamento, ofertas e canais preferidos, **recomendação de
0 a 10 (NPS)**, clareza e tempo da apresentação.

**Qualitativos:** dez perguntas abertas, como estudar TI hoje, primeira impressão, uma situação real de
uso, o que faltou e o que mudaria. Várias pedem o **porquê** de uma nota: por que pagaria ou não, e por
que deu aquela nota de recomendação. O script de análise junta essas respostas por tema (facilidade,
conteúdo, celular, lentidão, preço, apresentação…) e mostra exemplos. É uma primeira separação
automática: leia as respostas antes de citar no relatório.

## 1. Criar o formulário (uma vez só)

1. Entre em <https://script.google.com> com a conta da equipe e clique em **Novo projeto**.
2. Apague o que vier no editor, cole o conteúdo de `criar-formulario.gs` e salve.
3. No alto, escolha a função **criarFormulario** e clique em **Executar**. O Google pede autorização
   para criar o formulário e a planilha na sua conta: autorize.
4. Em **Registro de execução** aparecem três links: o de **responder** (é esse que se divulga), o de
   **editar** o formulário e o da **planilha de respostas**.

O formulário sai com as seções e os caminhos certos: quem não concorda termina na hora, quem ainda não
usou o Nex_TI pula a parte de uso e quem não viu a apresentação nem o relatório pula a parte deles.

## 2. Divulgar

- Mande o link de **responder** para colegas de ADS e de outros cursos, pelo grupo da turma.
- Peça para a pessoa abrir o site (<https://nexti-pim-iv.vercel.app>), criar uma conta e estudar uma
  fase **antes** de responder: assim a parte de uso e a nota SUS ficam com dados de verdade.
- Depois da apresentação, mande o mesmo link para quem assistiu.
- Para a nota SUS ter valor, o ideal é ter **pelo menos 10 a 15 respostas** de quem usou o sistema.

## 3. Analisar as respostas

1. Na planilha de respostas: **Arquivo → Fazer download → Valores separados por vírgula (.csv)**.
2. Salve o arquivo nesta pasta como `respostas.csv`.
3. Nesta pasta, rode:

   ```bash
   node analisar-respostas.mjs respostas.csv > RESULTADOS.md
   ```

4. Abra `RESULTADOS.md`: os números (contagens, médias, nota SUS e NPS) e as respostas abertas, cada
   uma na sua pergunta, com a tabela de temas no fim.

**Como ler a nota SUS:** 68 é a média dos sistemas avaliados com essa escala; acima de 71 é boa, acima
de 85 é excelente. **NPS** = % de promotores (notas 9 e 10) − % de detratores (0 a 6); vai de −100 a 100.

## Cuidados (LGPD)

- O formulário **não coleta** nome, e-mail nem RA, e não guarda o e-mail de quem responde.
- Respostas abertas podem trazer dados pessoais sem querer: ao citar no relatório, não use nada que
  identifique a pessoa.
- A planilha e o `respostas.csv` ficam **fora do git**: só o resumo (`RESULTADOS.md`), sem dados
  pessoais, pode entrar no repositório.

## Depois da pesquisa

Com os resultados em mãos, atualize, sempre com os números do `RESULTADOS.md`:
- **Relatório:** a elicitação (2.2.3), a conclusão e os resultados dos testes de usabilidade. Depois,
  gere o Word de novo.
- **Plano de negócios:** o preço e a premissa de assinantes no
  [`PLANO_DE_NEGOCIOS.md`](../plano%20de%20negocios/PLANO_DE_NEGOCIOS.md) e nos slides dele.
- **Slides do PIM:** o slide de elicitação e o de resultados. Depois, gere o PDF de novo.
