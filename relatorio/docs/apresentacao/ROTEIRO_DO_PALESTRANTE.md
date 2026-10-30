# 🎤 Roteiro do Palestrante — Apresentação do PIM IV (Nex_TI)

A apresentação conta o projeto como uma história, com **começo, meio e fim**, como o professor pediu:

| Parte | Slides | O que mostra |
|---|---|---|
| **Começo** | 1–7 | A equipe (organograma do DevTeam), o problema, **como levantamos os requisitos (elicitação)**, o caminho da necessidade até o teste e a solução em números |
| **Meio** | 8–29 | **As oito disciplinas do semestre**, cada uma com **um exemplo real** logo depois da introdução: o que a disciplina ensinou → onde usamos no Nex_TI → a prova no sistema. Empreendedorismo traz também o organograma, o Canvas, a SWOT e o plano de negócios do Nex_TI. No fim, uma resposta do aluno passando pelas oito |
| **Fim** | 30–34 | O que os testes mostraram, o que a equipe aprendeu (problema → solução), a conclusão respondendo aos problemas do começo e o sistema funcionando |

O Maciel abre e fecha a história; o meio vai na ordem das etapas do manual. Os números e as
imagens são os do relatório. A fala curta de cada slide também está dentro dos slides: no modo
apresentação, aperte **N**.

## Informações gerais

| Item | Detalhe |
|---|---|
| **O quê** | Apresentação do PIM IV para a avaliação (24/11 a 03/12/2026) |
| **Duração** | 27 minutos, cerca de 5 por pessoa, mais as perguntas. Se a banca der outro tempo, ajuste a coluna "Tempo" abaixo |
| **Slides** | `slides.html` no navegador (botão **Apresentar** ou tecla **P**) ou o PDF `Nex_TI - Apresentacao PIM IV.pdf` em tela cheia |
| **Ter aberto** | Os slides, o site (https://nexti-pim-iv.vercel.app) já logado numa conta de teste, e o GitHub (https://github.com/MayconDIS/PIM_IV) |
| **Antes de começar** | Abra o site uns 2 minutos antes: no plano gratuito a API "dorme" e a primeira requisição pode levar até um minuto |

### Teclas no modo apresentação

| Tecla | O que faz |
|---|---|
| **→**, **Espaço**, **Enter** ou clique na metade direita | Próximo slide |
| **←** ou clique na metade esquerda | Slide anterior |
| **F** | Tela cheia |
| **N** | Mostra a fala do slide, o tempo e o número do slide |
| **T** | Zera o tempo |
| **Esc** | Sai do modo apresentação |

### Equipe e divisão

| Integrante | RA | Slides | Tempo |
|---|---|---|---|
| Maciel Costa da Silva | R280985 | 1–7 · Começo: equipe, problema, elicitação, requisitos e números | 00:00 – 05:15 |
| Gabriel Alves Moreira | H67HJI4 | 8–14 · Empreendedorismo em TI (organograma, Canvas, SWOT e plano de negócios), Relações Étnico-Raciais e o exemplo de acessibilidade | 05:15 – 10:25 |
| Maycon Douglas Inácio Silva | H719CD3 | 15–19 · Web com .NET e Mobile, com os exemplos (rota da API e fila do app) | 10:25 – 14:45 |
| Miguel Angel Fernandez Ortiz | H7858F9 | 20–24 · Programação Aplicada em .NET e Banco de Dados, com os exemplos (caso de uso e trigger) | 14:45 – 19:05 |
| Rafael Mesquita | H6722I0 | 25–29 · Cloud e DevOps e Projetos Ágil, com os exemplos (deploy e cartão do Trello), e "tudo junto" | 19:05 – 22:55 |
| Maciel Costa da Silva | R280985 | 30–32 · Fim: resultados, experiência da equipe e conclusão | 22:55 – 25:40 |
| Maycon e todos | — | 33–34 · Demonstração, perguntas e agradecimento | 25:40 – 27:10 |

---|---|---|---|
| Maciel Costa da Silva | R280985 | 1–6 · Começo: problema, elicitação, requisitos e números | 00:00 – 04:30 |
| Gabriel Alves Moreira | H67HJI4 | 7–8 · Empreendedorismo em TI e Relações Étnico-Raciais | 04:30 – 06:30 |
| Maycon Douglas Inácio Silva | H719CD3 | 9–11 · Web com .NET e Mobile | 06:30 – 10:00 |
| Miguel Angel Fernandez Ortiz | H7858F9 | 12–14 · Programação Aplicada em .NET e Banco de Dados | 10:00 – 13:30 |
| Rafael Mesquita | H6722I0 | 15–17 · Cloud e DevOps, Projetos Ágil e "tudo junto" | 13:30 – 16:30 |
| Maciel Costa da Silva | R280985 | 18–19 · Fim: resultados e conclusão | 16:30 – 18:30 |
| Maycon e todos | — | 20 · Demonstração e perguntas | 18:30 – 20:00 |

---

## ⏱️ Começo (Maciel)

### 1 — Capa (00:00 – 00:20)
> *"Somos a equipe do Nex_TI: Gabriel, Maciel, Maycon, Miguel e Rafael. Vamos contar o projeto do começo ao fim: o problema e como levantamos os requisitos, depois como cada disciplina do semestre entrou no sistema, e no fim os resultados e o sistema funcionando."*

### 2 — Roteiro (00:20 – 00:50)
- Mostrar as três partes e as oito disciplinas embaixo: *"Vocês vão ver cada uma no lugar onde foi usada."*

### 3 — O DevTeam (00:50 – 01:35)
- O organograma com os papéis que definimos no Scrum: Maciel, Scrum Master; Maycon, desenvolvedor líder (full stack); Rafael, desenvolvedor com o banco de dados; Gabriel, desenvolvedor com a prototipação; Miguel, desenvolvedor.
> *"Eu fui o Scrum Master: montei o quadro no Trello e organizei as sprints. Estes foram os papéis que definimos no começo."*
- **Se perguntarem quem fez cada parte, responder com sinceridade:** o histórico do GitHub e do Trello mostra as entregas, e o slide de experiência da equipe fala do que aprendemos com a divisão do trabalho.

### 4 — O problema (01:35 – 02:25)
- Três problemas: muitos termos novos, estudo pouco sistemático e falta de acompanhamento.
- A persona: jovem de 18 a 20 anos, recém-saído do ensino médio.
- *"São hipóteses: o próximo slide mostra de onde vieram, e o fim mostra como validar."*

### 5 — Elicitação (02:25 – 03:35)
- As seis técnicas que usamos para descobrir os requisitos:
  1. **Análise de documentos:** o Manual do PIM IV, os materiais das 31 disciplinas de AVA e ED e as provas oficiais do ENADE.
  2. **Comparação com o Anki:** de onde vieram a revisão espaçada e os quatro botões.
  3. **Persona e cenários:** somos alunos de ADS; partimos da nossa experiência de ingressantes.
  4. **Priorização:** as necessidades viraram épicos e itens do backlog no Trello.
  5. **Protótipo e iteração:** cada entrega foi um sistema funcionando, revisado num pull request.
  6. **Validação:** testes de usabilidade com roteiro de tarefas.
- **Ser honesto:** a elicitação com ingressantes reais (entrevista, questionário e piloto) é o próximo passo.

### 6 — Da necessidade ao teste (03:35 – 04:35)
- O resultado da elicitação: 8 regras de negócio, 14 requisitos funcionais e 6 não funcionais.
- Contar o exemplo: *"Quero estudar no ônibus, sem internet"* → RF12 e RNF05 → backlog PB10 a PB12 → fila no aparelho → 26 testes do app.

### 7 — A solução em números (04:35 – 05:15)
- 43 fases e 1198 cartas, 31 disciplinas do curso dentro da plataforma, 27 rotas, 16 casos de uso, 445 testes.
- *"O Nex_TI foi feito com as disciplinas e também ensina um pouco de cada disciplina do curso."*
- **Passar a vez:** *"Agora o meio: o Gabriel abre com as duas primeiras disciplinas."*

## ⏱️ Meio: as oito disciplinas

Cada disciplina tem uma introdução ("o que ensinou → onde usamos") e, logo depois, **um exemplo real**: código, diagrama, tela ou cartão do Trello.

### 8 — Empreendedorismo em TI · Etapas 1 e 2 (05:15 – 06:00) · Gabriel
- Ensinou plano de negócios, proposta de valor, ponto de equilíbrio e sustentabilidade.
- Usamos na Nex_TI Educacional, uma EdTech fictícia (B2C e B2B). Mostrar o organograma das quatro funções.

### 9 — Canvas do Nex_TI (06:00 – 06:45) · Gabriel
- Os nove blocos: parcerias, atividades, recursos, proposta de valor, relacionamento, canais, segmentos, custos e receitas.
- **Ser honesto:** custos e receitas são hipóteses; o ponto de equilíbrio será calculado com os dados do piloto (a fórmula está no slide).

### 10 — SWOT do Nex_TI (06:45 – 07:30) · Gabriel
- Forças (mesma API, regras no servidor, testes, estudo sem internet), fraquezas (sem alunos reais ainda, nuvem gratuita que "dorme", viabilidade econômica não demonstrada), oportunidades e ameaças (os riscos do relatório).

### 11 — Plano de negócios: os 4 P's (07:30 – 08:15) · Gabriel
- Produto, Preço, Praça e Promoção do Nex_TI. O produto já existe; o **preço é premissa** da equipe (R$ 5,00 por aluno de instituição e R$ 9,90 individual), para validar no piloto.

### 12 — Plano de negócios: os números (08:15 – 09:00) · Gabriel
- Investimento inicial R$ 946, custo fixo R$ 202 por mês (Azure, Vercel e domínio), ponto de equilíbrio de 43 alunos de instituição e payback de cerca de 1,7 mês.
- **Leitura honesta:** os números são bons porque ninguém recebe no piloto; com R$ 500 de pró-labore para cada um, o ponto de equilíbrio sobe para 563 alunos.
- Premissas, contas e fontes: `relatorio/docs/PLANO_DE_NEGOCIOS.md`.

### 13 — Relações Étnico-Raciais e Afrodescendência · Etapa 3 (09:00 – 09:45) · Gabriel
- Ensinou ações afirmativas, a Lei 10.639/2003 e o Estatuto da Igualdade Racial.
- Separar o que é **proposta** (curadoria sem estereótipos, canal de relato) do que **já está no sistema** (VLibras, contraste, zoom, teclado, leitor de tela, estudo sem internet).
- **Passar a vez:** *"O Maycon mostra Web e Mobile."*

### 14 — Exemplo: acessibilidade na tela (09:45 – 10:25) · Gabriel
- A tela real com o **alto contraste** ligado pelo menu ☰: A- e A+ mudam o tamanho do texto, o contraste deixa o fundo preto com destaques em amarelo e o VLibras (a mão azul) traduz para Libras.

### 15 — Desenvolvimento Web com .NET, o site e a API · Etapa 4 (10:25 – 11:25) · Maycon
- Ensinou Minimal APIs, EF Core e migrations, JWT, CORS, limite de requisições e OpenAPI.
- Usamos todas essas peças na API .NET 10 (27 rotas); mostrar o painel e a conversa site → API → banco.

### 16 — Exemplo: uma rota da API (11:25 – 12:05) · Maycon
- O código da rota que grava cada resposta: `MapPost` (Minimal API), `RequireAuthorization()` (JWT, sem login dá 401) e só o próprio aluno grava a resposta dele (403 para os outros). A rota chama o serviço, não o banco.

### 17 — Web com .NET, estudo e estrutura administrativa · Etapa 4 (12:05 – 13:05) · Maycon
- Os quatro botões do SM-2; XP e moedas calculados no servidor.
- A estrutura administrativa vale ponto na Etapa 4: Tutor acompanha e modera; Administrador define perfis.
- A Trilha com as 31 disciplinas e o Nexor.

### 18 — Desenvolvimento Mobile · Etapa 5 (13:05 – 14:05) · Maycon
- Ensinou multiplataforma, React Native com Expo, armazenamento local e acessibilidade.
- Usamos no app Expo: mesma API, token no cofre do aparelho, fila sem internet, 26 testes.
- **Passar a vez:** *"O Miguel mostra a arquitetura e o banco."*

### 19 — Exemplo: a fila do app (14:05 – 14:45) · Maycon
- O código que cumpre o RF12 e o RNF05: sem internet a resposta entra na fila do aparelho; sessão expirada volta ao login; erro de regra (400) é descartado. Na sincronização, a fila vai para a API.

### 20 — Programação Aplicada em .NET, orientação a objetos e camadas · Etapa 6 (14:45 – 15:45) · Miguel
- Ensinou classes, herança, interfaces, encapsulamento e camadas.
- Usamos na API: rotas → serviços → banco, uma interface por serviço, perfis que herdam.
- Citar que a disciplina também teve a atividade do Nex_TI Desktop.

### 21 — Programação Aplicada em .NET, UML · Etapa 6 (15:45 – 16:45) · Miguel
- 16 casos de uso; os diagramas saem de um gerador do Astah que lê o código.

### 22 — Exemplo: Estudar Flashcards em classes e em sequência (16:45 – 17:25) · Miguel
- **Cada caso de uso tem um diagrama de classes e um de sequência** (32 no total). Mostrar o par do Estudar Flashcards: as classes, de cima para baixo (tela → API → serviço → entidade), e a ordem das mensagens quando o aluno responde.

### 23 — Programação de Banco de Dados · Etapa 7 (17:25 – 18:25) · Miguel
- Ensinou integridade referencial, joins e views, procedures, triggers, funções, backup e restore.
- Usamos: triggers (histórico e proteção do XP), procedures (ranking, estatísticas, cadastro de carta), views, chaves estrangeiras e backup na Azure.
- **Passar a vez:** *"O Rafael mostra as duas últimas disciplinas e junta tudo."*

### 24 — Exemplo: a trigger que protege o XP (18:25 – 19:05) · Miguel
- `AFTER UPDATE` em `usuarios`: compara o valor novo (`inserted`) com o antigo (`deleted`) e, se o XP ou o nível caírem, o `THROW` desfaz. Vale até para quem mexer no banco por fora da API (RN05).

### 25 — Cloud Computing e DevOps · Etapa 8 (19:05 – 19:55) · Rafael
- Ensinou IaaS, PaaS e SaaS, elasticidade, LGPD, contêineres, CI/CD e monitoramento.
- Usamos: App Service e Azure SQL (PaaS), Docker, deploy automático, Application Insights e os direitos do titular.

### 26 — Exemplo: o deploy automático (19:55 – 20:35) · Rafael
- O GitHub Actions a cada merge na `main`: testes primeiro (se falhar, nada é publicado), depois publica, faz o deploy no Azure e confere se a API publicada responde.

### 27 — Gerenciamento de Projetos Ágil · Etapa 9 (20:35 – 21:25) · Rafael
- Ensinou Scrum, Kanban, backlog, sprints, caminho crítico e organização do tempo.
- Usamos: backlog PB01 a PB22 no Trello, cinco sprints, um pull request por cartão.

### 28 — Exemplo: um cartão do Trello (21:25 – 22:05) · Rafael
- O cartão da Etapa 6 por dentro: responsável, prazo, checklist com os critérios de pronto e o link do pull request da entrega.

### 29 — Tudo junto (22:05 – 22:55) · Rafael
- **O slide mais importante para a banca.** Contar como uma história: o aluno responde "Bom" no celular, dentro do ônibus, e a resposta passa pelas oito disciplinas, do aparelho (Mobile) até o Trello (Projetos Ágil).
- **Passar a vez:** *"O Maciel fecha a história."*

## ⏱️ Fim

### 30 — Resultados (22:55 – 23:45) · Maciel
- 445 testes aprovados; eles **acharam defeitos reais** (o teto do SM-2, a nota sem validação, as estatísticas erradas), todos corrigidos com teste novo.

### 31 — Experiência da equipe (23:45 – 24:40) · Maciel
- Problema → solução, em três casos reais da Etapa 9: a troca de contexto (um cartão por pessoa), a integração do app que não coube na Sprint 4 (voltou ao backlog) e a Sprint 5 que concentrou entregas (revisar a capacidade).
- *"O ponto não é não ter problema, e sim como a equipe lida com ele."*

### 32 — Conclusão (24:40 – 25:40) · Maciel
- Voltar aos três problemas do começo e mostrar o que resolveu cada um.
- Confirmado: a parte técnica funciona de ponta a ponta.
- Próximo passo: completar a elicitação com ingressantes reais (entrevista, questionário e piloto).
- **Passar a vez:** *"O Maycon mostra o sistema funcionando."*

### 33 — Demonstração e perguntas (25:40 – 26:55) · Maycon e todos
- **Ao vivo (1 minuto):** entrar no site → abrir a Fase 1 → responder duas cartas → abrir Minhas Estatísticas.
- Se a internet falhar, seguir com as telas dos slides 15 a 18.

### 34 — Agradecimento (26:55 – 27:10) · Todos
- Página só para o "Obrigado!", com o logo da UNIP e os nomes da equipe. Agradecer à banca e aos professores.

---

## ❓ Perguntas prováveis

| Pergunta | Quem responde | Resposta curta |
|---|---|---|
| Quem fez cada parte? | Maciel | Os papéis estão no slide 3; o GitHub e o Trello mostram quem entregou cada parte. Responder com sinceridade. |
| Como vocês levantaram os requisitos? | Maciel | Análise de documentos (manual, materiais das disciplinas e provas do ENADE), comparação com o Anki, persona, priorização no backlog, protótipo e testes de usabilidade. Entrevista e questionário com ingressantes reais ficam para o piloto. |
| Qual disciplina pesou mais no projeto? | Maycon | Web com .NET e Mobile, que viraram o site, a API e o app; mas a resposta do aluno (slide 29) só funciona com as oito juntas. |
| O negócio se paga? | Gabriel | Na simulação, o piloto se paga com 43 alunos de instituição, mas sem salários; com pró-labore, são 563 alunos. Preço e número de alunos são premissas que o piloto vai confirmar. |
| Por que o XP é calculado no servidor? | Maycon | Se fosse no navegador, qualquer um mudaria o próprio XP. A API calcula pela tabela de recompensas, e o banco ainda impede que o XP diminua. |
| Como o app funciona sem internet? | Maycon | A resposta fica numa fila no aparelho e é enviada na próxima sincronização; o servidor recalcula o SM-2. |
| Por que separar a API em camadas? | Miguel | Cada parte cuida de uma coisa: dá para testar a regra sem a tela e trocar o banco sem mexer nas regras. |
| Os diagramas foram feitos à mão? | Miguel | Não: um gerador monta o arquivo do Astah a partir do código, com a explicação de cada elemento. |
| Para que servem as triggers? | Miguel | Uma grava o histórico de cada revisão; a outra impede que XP ou nível diminuam, mesmo por fora da API. |
| Onde entra a disciplina de Relações Étnico-Raciais? | Gabriel | Na proposta social (curadoria sem estereótipos e canal de relato) e no acesso: recursos de acessibilidade e estudo sem internet. A política e o canal ainda precisam ser publicados. |
| Quanto custa manter no ar? | Rafael | Tudo está em camadas gratuitas (Vercel, App Service F1 e Azure SQL serverless); por isso a primeira requisição pode demorar. |
| Como sabem que funciona? | Rafael | 445 testes rodam a cada pull request, e um script confere se o relatório e os slides batem com o código. |
| A plataforma melhora o aprendizado? | Maciel | Ainda não dá para afirmar: falta um piloto com alunos reais, medindo o desempenho antes e depois. |
