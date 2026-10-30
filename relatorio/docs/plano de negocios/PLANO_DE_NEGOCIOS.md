# Plano de negócios do Nex_TI Educacional (simulação)

Plano da empresa fictícia do PIM IV, no formato visto em Empreendedorismo em TI (ARAÚJO NETO, 2026)
e no modelo da equipe (plano de negócios da miniempresa: Canvas, SWOT, 4 P's, organograma,
investimento, ponto de equilíbrio, payback e rentabilidade).

> **É uma simulação.** O relatório (seção 2.2) registra que a viabilidade econômica ainda não foi
> demonstrada com dados. Os **custos** abaixo vêm de preços públicos dos serviços que o Nex_TI já usa;
> o **preço** e o **número de alunos** são **premissas da equipe**, para serem trocadas pelos dados
> do piloto. Mudou uma premissa? Refaça as contas da seção 4 e atualize os slides do plano de negócios
> (12 a 14 em `../apresentacao/` e os desta pasta).
>
> **Hoje o Nex_TI custa R$ 0:** a API e o site estão em planos gratuitos, o banco usa o plano de aluno
> da faculdade no Azure e o domínio .com.br ainda não foi comprado (o site usa o endereço da Vercel).
> Os custos abaixo são **estimativas** dos planos pagos, para quando o Nex_TI crescer.

## 1. Canvas, SWOT e organograma

Estão nos slides 9 e 10 e no slide 8 (organograma da empresa), com o conteúdo das seções 2.1 e 2.2 do relatório.

## 2. Os 4 P's

| P | No Nex_TI |
|---|---|
| **Produto** | Plataforma Web e app de estudo de TI: flashcards com revisão espaçada (SM-2), Trilha com 31 disciplinas, simulados do ENADE, gamificação e painel do Tutor |
| **Preço** | Instituições: licença por aluno ativo por mês. Alunos: assinatura individual mensal. O estudo básico continua gratuito, como na proposta social da Etapa 3 |
| **Praça** | No navegador (site) e no celular (app), inclusive sem internet; venda direta a instituições com ações de nivelamento |
| **Promoção** | Parcerias com cursos de TI, demonstração para coordenações, redes sociais e indicação entre alunos |

## 3. Premissas

| Premissa | Valor | De onde veio |
|---|---|---|
| Câmbio | US$ 1 = R$ 5,20 | Premissa da equipe; o último valor encontrado foi R$ 5,15 (set/2026) |
| API: Azure App Service B1 (não "dorme" como o gratuito) | US$ 13,14/mês ≈ R$ 68,33 | Preço público citado em respostas da Microsoft (2025) e guias de 2026 |
| Banco: Azure SQL Basic (5 DTU, 2 GB) | US$ 5/mês ≈ R$ 26,00 | Preço público do tier Basic |
| Site: Vercel Pro (1 assento) | US$ 20/mês ≈ R$ 104,00 | Preço público do plano Pro (o Hobby não permite uso comercial) |
| Domínio .com.br | R$ 40/ano ≈ R$ 3,33/mês | Registro.br |
| Monitoramento (Application Insights) | R$ 0 | Dentro da cota gratuita, com o limite diário já configurado |
| Taxa de pagamento (Pix e cartão) | 4% da receita | Premissa da equipe |
| Preço para instituições | R$ 5,00 por aluno ativo por mês | **Premissa da equipe** |
| Preço individual | R$ 9,90 por mês | **Premissa da equipe** |
| Piloto | 1 instituição com 100 alunos e 30 assinantes individuais | **Premissa da equipe** |
| Pró-labore | Nenhum no piloto (a equipe não recebe) | **Premissa da equipe**; ver a seção 5 |

Preços de serviços em nuvem mudam por região e por mês: confira na calculadora da Azure e na página
da Vercel antes de usar os números fora do PIM.

## 4. Contas

| Item | Conta | Resultado |
|---|---|---|
| **Custo fixo mensal** | 68,33 + 26,00 + 104,00 + 3,33 | **R$ 202** |
| **Investimento inicial** | domínio do 1º ano (R$ 40) + capital de giro de 3 meses (3 × R$ 202) + divulgação inicial (R$ 300) | **R$ 946** |
| **Receita mensal** | 100 × R$ 5,00 + 30 × R$ 9,90 | **R$ 797** |
| **Custo variável** | 4% de R$ 797 | **R$ 32** |
| **Lucro mensal** | 797 − 202 − 32 | **R$ 563** |
| **Ponto de equilíbrio** | custo fixo ÷ margem por aluno = 202 ÷ (5,00 × 0,96) | **43 alunos de instituição** (cerca de R$ 210 de receita por mês) |
| **Payback** | investimento ÷ lucro mensal = 946 ÷ 563 | **cerca de 1,7 mês** |
| **Rentabilidade** | lucro mensal ÷ investimento = 563 ÷ 946 | **cerca de 60% ao mês** |

## 5. Leitura honesta dos números

Os números ficam bons porque **ninguém é pago** no piloto: o código já foi feito pela equipe no PIM.
Com um pró-labore de R$ 500 para cada um dos cinco integrantes, o custo fixo sobe para R$ 2.702 por mês,
e o ponto de equilíbrio passa a ser **563 alunos de instituição** (2.702 ÷ 4,80). Ou seja: o piloto se
paga com uma turma, mas, para virar empresa de verdade, a Nex_TI precisa de várias instituições.

O próximo passo é validar com o piloto: quanto as instituições aceitam pagar, quantos alunos usam de
fato e qual é o custo real da nuvem com esse uso.

## Fontes dos preços

- Azure App Service (B1): [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/a/12322935) e [Kuberns, Azure Pricing in 2026](https://kuberns.com/blogs/azure-pricing/)
- Azure SQL Database (Basic): [SQLServerCentral](https://www.sqlservercentral.com/blogs/azure-sql-database-pricing) e [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/589981/does-azure-provide-sql-database-service-which-is-e)
- Vercel Pro: [documentação da Vercel](https://vercel.com/docs/plans/pro-plan) e [MakerKit, Vercel Cost in 2026](https://makerkit.dev/blog/saas/vercel-cost)
- Câmbio de referência: [Meelion, dólar hoje](https://www.meelion.com/indicadores-financeiros/dolar-hoje/)
