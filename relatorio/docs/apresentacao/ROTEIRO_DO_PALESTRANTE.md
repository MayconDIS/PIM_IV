# 🎤 Roteiro do Palestrante — Apresentação do PIM IV (Nex_TI)

A apresentação conta o projeto como uma história, com **começo, meio e fim**, como o professor pediu:

| Parte | Slides | O que mostra |
|---|---|---|
| **Começo** | 1–6 | O problema, **como levantamos os requisitos (elicitação)**, o caminho da necessidade até o teste e a solução em números |
| **Meio** | 7–17 | **As oito disciplinas do semestre**, uma por slide: o que a disciplina ensinou → onde usamos no Nex_TI → a prova no sistema. No fim, uma resposta do aluno passando pelas oito |
| **Fim** | 18–20 | O que os testes mostraram, a conclusão respondendo aos problemas do começo e o sistema funcionando |

O Maciel abre e fecha a história; o meio vai na ordem das etapas do manual. Os números e as
imagens são os do relatório. A fala curta de cada slide também está dentro dos slides: no modo
apresentação, aperte **N**.

## Informações gerais

| Item | Detalhe |
|---|---|
| **O quê** | Apresentação do PIM IV para a avaliação (24/11 a 03/12/2026) |
| **Duração** | 20 minutos, cerca de 4 por pessoa, mais as perguntas. Se a banca der outro tempo, ajuste a coluna "Tempo" abaixo |
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

### 3 — O problema (00:50 – 01:40)
- Três problemas: muitos termos novos, estudo pouco sistemático e falta de acompanhamento.
- A persona: jovem de 18 a 20 anos, recém-saído do ensino médio.
- *"São hipóteses: o próximo slide mostra de onde vieram, e o fim mostra como validar."*

### 4 — Elicitação (01:40 – 02:50)
- As seis técnicas que usamos para descobrir os requisitos:
  1. **Análise de documentos:** o Manual do PIM IV, os materiais das 31 disciplinas de AVA e ED e as provas oficiais do ENADE.
  2. **Comparação com o Anki:** de onde vieram a revisão espaçada e os quatro botões.
  3. **Persona e cenários:** somos alunos de ADS; partimos da nossa experiência de ingressantes.
  4. **Priorização:** as necessidades viraram épicos e itens do backlog no Trello.
  5. **Protótipo e iteração:** cada entrega foi um sistema funcionando, revisado num pull request.
  6. **Validação:** testes de usabilidade com roteiro de tarefas.
- **Ser honesto:** a elicitação com ingressantes reais (entrevista, questionário e piloto) é o próximo passo.

### 5 — Da necessidade ao teste (02:50 – 03:50)
- O resultado da elicitação: 8 regras de negócio, 14 requisitos funcionais e 6 não funcionais.
- Contar o exemplo: *"Quero estudar no ônibus, sem internet"* → RF12 e RNF05 → backlog PB10 a PB12 → fila no aparelho → 26 testes do app.

### 6 — A solução em números (03:50 – 04:30)
- 43 fases e 1198 cartas, 31 disciplinas do curso dentro da plataforma, 27 rotas, 16 casos de uso, 445 testes.
- *"O Nex_TI foi feito com as disciplinas e também ensina um pouco de cada disciplina do curso."*
- **Passar a vez:** *"Agora o meio: o Gabriel abre com as duas primeiras disciplinas."*

## ⏱️ Meio: as oito disciplinas

Cada slide do meio segue o mesmo formato. Leia o título, depois **"o que a disciplina ensinou"**,
depois **"onde usamos"** e aponte a prova (tela ou diagrama).

### 7 — Empreendedorismo em TI · Etapas 1 e 2 (04:30 – 05:30) · Gabriel
- Ensinou plano de negócios, proposta de valor, ponto de equilíbrio e sustentabilidade.
- Usamos na Nex_TI Educacional, uma EdTech fictícia (B2C e B2B), com quatro funções e a proposta de valor. O ponto de equilíbrio será calculado com os dados do piloto.

### 8 — Relações Étnico-Raciais e Afrodescendência · Etapa 3 (05:30 – 06:30) · Gabriel
- Ensinou ações afirmativas, a Lei 10.639/2003 e o Estatuto da Igualdade Racial.
- Separar o que é **proposta** (curadoria sem estereótipos, canal de relato) do que **já está no sistema** (VLibras, contraste, zoom, teclado, leitor de tela, estudo sem internet).
- **Passar a vez:** *"O Maycon mostra Web e Mobile."*

### 9 — Desenvolvimento Web com .NET, o site e a API · Etapa 4 (06:30 – 07:40) · Maycon
- Ensinou Minimal APIs, EF Core e migrations, JWT, CORS, limite de requisições e OpenAPI.
- Usamos todas essas peças na API .NET 10 (27 rotas); mostrar o painel e a conversa site → API → banco.

### 10 — Web com .NET, estudo e estrutura administrativa · Etapa 4 (07:40 – 08:50) · Maycon
- Os quatro botões do SM-2; XP e moedas calculados no servidor.
- A estrutura administrativa vale ponto na Etapa 4: Tutor acompanha e modera; Administrador define perfis.
- A Trilha com as 31 disciplinas e o Nexor.

### 11 — Desenvolvimento Mobile · Etapa 5 (08:50 – 10:00) · Maycon
- Ensinou multiplataforma, React Native com Expo, armazenamento local e acessibilidade.
- Usamos no app Expo: mesma API, token no cofre do aparelho, fila sem internet, 26 testes.
- **Passar a vez:** *"O Miguel mostra a arquitetura e o banco."*

### 12 — Programação Aplicada em .NET, orientação a objetos e camadas · Etapa 6 (10:00 – 11:10) · Miguel
- Ensinou classes, herança, interfaces, encapsulamento e camadas.
- Usamos na API: rotas → serviços → banco, uma interface por serviço, perfis que herdam.
- Citar que a disciplina também teve a atividade do Nex_TI Desktop.

### 13 — Programação Aplicada em .NET, UML · Etapa 6 (11:10 – 12:20) · Miguel
- 16 casos de uso; os diagramas saem de um gerador do Astah que lê o código.

### 14 — Programação de Banco de Dados · Etapa 7 (12:20 – 13:30) · Miguel
- Ensinou integridade referencial, joins e views, procedures, triggers, funções, backup e restore.
- Usamos: triggers (histórico e proteção do XP), procedures (ranking, estatísticas, cadastro de carta), views, chaves estrangeiras e backup na Azure.
- **Passar a vez:** *"O Rafael mostra as duas últimas disciplinas e junta tudo."*

### 15 — Cloud Computing e DevOps · Etapa 8 (13:30 – 14:30) · Rafael
- Ensinou IaaS, PaaS e SaaS, elasticidade, LGPD, contêineres, CI/CD e monitoramento.
- Usamos: App Service e Azure SQL (PaaS), Docker, deploy automático, Application Insights e os direitos do titular.

### 16 — Gerenciamento de Projetos Ágil · Etapa 9 (14:30 – 15:30) · Rafael
- Ensinou Scrum, Kanban, backlog, sprints, caminho crítico e organização do tempo.
- Usamos: backlog PB01 a PB22 no Trello, cinco sprints, um pull request por cartão.

### 17 — Tudo junto (15:30 – 16:30) · Rafael
- **O slide mais importante para a banca.** Contar como uma história: o aluno responde "Bom" no celular, dentro do ônibus, e a resposta passa pelas oito disciplinas, do aparelho (Mobile) até o Trello (Projetos Ágil).
- **Passar a vez:** *"O Maciel fecha a história."*

## ⏱️ Fim (Maciel e Maycon)

### 18 — Resultados (16:30 – 17:30) · Maciel
- 445 testes aprovados; eles **acharam defeitos reais** (o teto do SM-2, a nota sem validação, as estatísticas erradas), todos corrigidos com teste novo.

### 19 — Conclusão (17:30 – 18:30) · Maciel
- Voltar aos três problemas do começo e mostrar o que resolveu cada um.
- Confirmado: a parte técnica funciona de ponta a ponta.
- Próximo passo: completar a elicitação com ingressantes reais (entrevista, questionário e piloto).
- **Passar a vez:** *"O Maycon mostra o sistema funcionando."*

### 20 — Demonstração e perguntas (18:30 – 20:00) · Maycon e todos
- **Ao vivo (1 minuto):** entrar no site → abrir a Fase 1 → responder duas cartas → abrir Minhas Estatísticas.
- Se a internet falhar, seguir com as telas dos slides 9 a 11.

---

## ❓ Perguntas prováveis

| Pergunta | Quem responde | Resposta curta |
|---|---|---|
| Como vocês levantaram os requisitos? | Maciel | Análise de documentos (manual, materiais das disciplinas e provas do ENADE), comparação com o Anki, persona, priorização no backlog, protótipo e testes de usabilidade. Entrevista e questionário com ingressantes reais ficam para o piloto. |
| Qual disciplina pesou mais no projeto? | Maycon | Web com .NET e Mobile, que viraram o site, a API e o app; mas a resposta do aluno (slide 17) só funciona com as oito juntas. |
| Por que o XP é calculado no servidor? | Maycon | Se fosse no navegador, qualquer um mudaria o próprio XP. A API calcula pela tabela de recompensas, e o banco ainda impede que o XP diminua. |
| Como o app funciona sem internet? | Maycon | A resposta fica numa fila no aparelho e é enviada na próxima sincronização; o servidor recalcula o SM-2. |
| Por que separar a API em camadas? | Miguel | Cada parte cuida de uma coisa: dá para testar a regra sem a tela e trocar o banco sem mexer nas regras. |
| Os diagramas foram feitos à mão? | Miguel | Não: um gerador monta o arquivo do Astah a partir do código, com a explicação de cada elemento. |
| Para que servem as triggers? | Miguel | Uma grava o histórico de cada revisão; a outra impede que XP ou nível diminuam, mesmo por fora da API. |
| Onde entra a disciplina de Relações Étnico-Raciais? | Gabriel | Na proposta social (curadoria sem estereótipos e canal de relato) e no acesso: recursos de acessibilidade e estudo sem internet. A política e o canal ainda precisam ser publicados. |
| Quanto custa manter no ar? | Rafael | Tudo está em camadas gratuitas (Vercel, App Service F1 e Azure SQL serverless); por isso a primeira requisição pode demorar. |
| Como sabem que funciona? | Rafael | 445 testes rodam a cada pull request, e um script confere se o relatório e os slides batem com o código. |
| A plataforma melhora o aprendizado? | Maciel | Ainda não dá para afirmar: falta um piloto com alunos reais, medindo o desempenho antes e depois. |
