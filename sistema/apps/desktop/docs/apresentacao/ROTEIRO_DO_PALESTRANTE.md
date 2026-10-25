# 🎤 Roteiro do Palestrante — Apresentação P.A. em .NET

## Informações Gerais

| Item | Detalhe |
|---|---|
| **Atividade** | 9 – Apresentação em grupo, disciplina P.A. em .NET |
| **Data** | 27/10/2026, em aula (entrega no AVA até 26/10, 23:59) |
| **Duração** | 10 minutos + perguntas, cerca de 2 minutos por pessoa |
| **O que avaliam** | Orientação a objetos, arquitetura em camadas, modularização e os 4 diagramas UML (caso de uso, classe, sequência e atividade). O GitHub faz parte. |
| **Slides** | `Nex_TI - Apresentacao PA DotNet.pdf`, nesta pasta, em tela cheia. Se mudar algo no `slides.html`: abrir no Chrome, `Ctrl+P`, papel A4, paisagem, margens "Nenhuma", "Gráficos de segundo plano" marcado, salvar como PDF. |
| **Ter aberto** | O PDF dos slides, o projeto no **Antigravity** (com o terminal em `sistema/apps/desktop`) e uma aba com o repositório: https://github.com/MayconDIS/PIM_IV. Como abrir cada coisa: [README do desktop, "Como abrir cada parte no Antigravity"](../../README.md#como-abrir-cada-parte-no-antigravity) |

### Equipe DevTime

| Integrante | RA | Slides | Tempo |
|---|---|---|---|
| Maciel Costa da Silva | R280985 | 1–2 · Capa e o projeto | 00:00 – 01:40 |
| Gabriel Alves Moreira | H67HJI4 | 3–4 · Caso de uso e atividade | 01:40 – 03:20 |
| Rafael Mesquita | H6722I0 | 5–6 · Orientação a objetos e classes | 03:20 – 05:00 |
| Miguel Angel Fernandez Ortiz | H7858F9 | 7–9 · Camadas e modularização | 05:00 – 06:50 |
| Maycon Douglas Inácio Silva | H719CD3 | 10–13 · Sequência, programa desktop e GitHub | 06:50 – 10:00 |

---

## ⏱️ Cronograma por Slide

### Slide 1 — Capa (00:00 – 00:20) · Maciel

- **Objetivo:** apresentar o grupo e a ordem das falas.
- **Fala sugerida:**
  > *"Somos o DevTime: Gabriel, Maciel, Maycon, Miguel e Rafael. Vamos mostrar o Nex_TI, um app para estudar TI com flashcards. Cada um vai apresentar uma parte."*

---

### Slide 2 — O que é o Nex_TI (00:20 – 01:40) · Maciel

- **Objetivo:** explicar o produto.
- **Tópicos-chave:**
  1. O aluno estuda por flashcards e o algoritmo **SM-2** decide quando cada carta volta.
  2. São **29 fases e 702 cartas**, liberadas em ordem. No fim, um guia de estudos e as provas oficiais do ENADE de ADS (2017 e 2021).
  3. Cada fase dá **XP e moedas**; as moedas liberam disciplinas bônus.
- **Passar a vez:** *"O Gabriel mostra quem usa o sistema."*

---

### Slide 3 — Caso de uso (01:40 – 02:30) · Gabriel

- **Objetivo:** mostrar os atores e o que cada um faz.
- **Tópicos-chave:**
  - **Aluno:** estuda, cria cartas, faz simulado e vê o desempenho.
  - **Tutor:** tudo do Aluno, mais o painel dos alunos e editar ou excluir cartas.
  - **Admin:** tudo do Tutor, mais definir o perfil de cada usuário.
  - A seta de herança entre os atores mostra isso: o Admin herda do Tutor, que herda do Aluno.
- **Se perguntarem:** os três perfis existem: o Tutor tem um painel com os alunos e modera as cartas; o Admin também define o perfil de cada usuário.

---

### Slide 4 — Atividade (02:30 – 03:20) · Gabriel

- **Objetivo:** contar uma sessão de estudo do começo ao fim.
- **Tópicos-chave:**
  - As 4 colunas (raias): Aluno, Site, API e Banco.
  - Seguir os 5 passos do slide.
  - Enquanto o aluno já vê a próxima carta, a API grava o progresso ao mesmo tempo (a barra grossa no meio do diagrama).
- **Passar a vez:** *"O Rafael mostra como isso está no código."*

---

### Slide 5 — Orientação a objetos (03:20 – 04:20) · Rafael

- **Objetivo:** mostrar os quatro pilares com exemplos do projeto.
- **Tópicos-chave:**
  - **Herança:** `Models/Aluno.cs` herda de `Usuario`.
  - **Interface:** `Services/ISm2Engine.cs` e `Sm2Engine.cs`. A API depende da interface, não da classe.
  - **Polimorfismo:** o `DatabaseSeeder` percorre as etapas (`ConteudoSeeder` e `SimuladoSeeder`) chamando `ExecutarAsync` sem saber qual é qual.
  - **Encapsulamento:** `GamificacaoService.ValidarAtualizacao` impede que o XP caia ou suba mais de 200 de uma vez.

---

### Slide 6 — Classes: entidades (04:20 – 05:00) · Rafael

- **Objetivo:** ligar o diagrama ao código de `sistema/apps/api/Models`.
- **Tópicos-chave:**
  - `Usuario` é pai de `Aluno` e `Tutor` (a herança do slide anterior).
  - `ProgressoFlashcard` liga o aluno à carta e guarda os números do SM-2.
  - `Prova`, `Questao`, `Alternativa` e `AreaConhecimento` entraram no PIM IV para os simulados.
- **Passar a vez:** *"O Miguel mostra como a API está organizada."*

---

### Slide 7 — Camadas (05:00 – 05:50) · Miguel

- **Objetivo:** explicar a arquitetura em camadas com o exemplo do login.
- **Fala sugerida:**
  > *"Quando o aluno faz login, a rota recebe o pedido e chama o AuthService. O serviço confere a senha e usa o AppDbContext para buscar o usuário no banco. Cada parte só conversa com a do lado."*
- **Tópicos-chave:** antes tudo ficava no `EndpointExtensions.cs` (338 linhas); separamos em `AuthService`, `ProgressoService`, `GamificacaoService` e `ConteudoService`; depois vieram `AdminService` (painel) e `ContaService` (Minha conta). Para o aluno nada mudou, e os testes conferem isso.

---

### Slide 8 — Classes: camadas (05:50 – 06:20) · Miguel

- **Objetivo:** mostrar o slide anterior em UML, sem ler o diagrama inteiro.
- **Tópicos-chave:** de cima para baixo: as rotas usam as interfaces dos serviços, cada interface tem sua classe (a seta tracejada com triângulo quer dizer "implementa"), e os serviços usam o `AppDbContext`.

---

### Slide 9 — Modularização (06:20 – 06:50) · Miguel

- **Objetivo:** mostrar que cada parte tem sua pasta e roda sozinha.
- **Tópico-chave:** a pasta nova `apps/desktop` é o programa desktop, que o Maycon mostra daqui a pouco. `packages/shared` guarda as 702 cartas e o código que fala com a API, e é usado pelo site e pelo app. Escrevemos uma vez e usamos nos dois.
- **Passar a vez:** *"O Maycon fecha com o SM-2, o programa desktop e o GitHub."*

---

### Slide 10 — Sequência (06:50 – 07:40) · Maycon

- **Objetivo:** mostrar a ordem das mensagens quando o aluno revisa uma carta.
- **Tópicos-chave:**
  - O aluno avalia a carta → o site manda a nota para `POST /api/progresso/atualizar` → a rota confere o token → o `ProgressoService` busca o progresso → o `Sm2Engine` calcula a nova data → o banco grava, e uma trigger guarda o histórico.
  - Sem login ou sem internet, o site segue só com o estado local (no app, a resposta espera numa fila).
  - Regra em `Services/Sm2Engine.cs`, igual à do site e do app (`sm2.js`): os dois lados rodam os mesmos 11 casos de teste. Bom multiplica o intervalo pelo fator (2,5); Fácil vai mais longe (carta nova: 3 dias); Difícil soma pelo menos 1 dia; Errei volta para amanhã. O fator nunca fica abaixo de 1,3.

---

### Slide 11 — Nex_TI Desktop (07:40 – 08:40) · Maycon

- **Objetivo:** mostrar a aplicação desktop pedida na atividade, pequena e organizada.
- **Ao vivo no Antigravity (30 s):** no terminal, em `sistema/apps/desktop`, rodar `dotnet run --project src/NexTI.Desktop.Apresentacao`, entrar com um nickname, abrir a fase 1 e responder duas cartas. Se algo travar, seguir com a foto do slide.
- **Tópicos-chave:**
  - Quatro projetos, um por camada: **Apresentação** (telas) → **Aplicação** (casos de uso) → **Domínio** (regras) ← **Infraestrutura** (banco). O Domínio não depende de ninguém.
  - **POO:** `Usuario` é abstrata e `Aluno` herda dela; `Xp` e `Moedas` têm `private set` e só mudam por `ReceberPremio`, que paga uma vez por fase; o SM-2 fica atrás da interface `IAgendadorDeRevisao`.
  - **Banco:** EF Core com SQLite, com migration e semente, como no PetMatch do livro da disciplina.
  - As cartas e o SM-2 são os mesmos do site: os **27 testes** usam os mesmos casos.

---

### Slide 12 — Diagramas do desktop (08:40 – 09:20) · Maycon

- **Objetivo:** mostrar que os quatro diagramas também existem para o programa desktop, feitos no Astah.
- **Tópicos-chave:** caso de uso (o aluno entra, vê a trilha e estuda; responder carta é «include» e concluir fase é «extend»), classes do domínio (herança e composição), sequência (responder a última carta e concluir) e atividade (uma raia para o aluno e uma para cada camada).
- **No Antigravity, se pedirem:** abrir `docs/diagramas` dentro de `sistema/apps/desktop`.

---

### Slide 13 — GitHub (09:20 – 10:00) · Maycon

- **Objetivo:** mostrar o repositório ao vivo.
- **No GitHub:** abrir o **Pull Request #33** (o programa desktop e os diagramas) e a aba **Actions**, com os testes passando.
- **Fala sugerida:**
  > *"Abrimos um Pull Request, damos merge na main, o GitHub Actions roda os 182 testes da API e, se passarem, publica a API na Azure sozinho. O site vai para a Vercel."*

---

### Slide 14 — Perguntas · Todos

| Pergunta provável | Quem responde | Resposta curta |
|---|---|---|
| Onde está a herança? | Rafael | `Models/Aluno.cs` e `Models/Tutor.cs`, herdando de `Usuario`. |
| Onde está a interface? | Rafael | `ISm2Engine`, `IAuthService` e os outros serviços. O `Program.cs` liga cada interface à sua classe. |
| Por que separar em camadas? | Miguel | Cada parte cuida de uma coisa: dá para testar a regra sem a rota e trocar o banco sem mexer nas regras. |
| O que o diagrama de atividade mostra? | Gabriel | Uma sessão de estudo, da escolha da fase até ganhar XP. |
| Como funciona o deploy? | Maycon | Merge na main → GitHub Actions roda os testes → publica na Azure. |
| Por que fazer um programa desktop? | Maycon | A atividade pede uma aplicação desktop organizada em escala pequena. Ele usa as mesmas cartas e regras do Nex_TI, em quatro projetos separados por camada. |
| Onde está a herança no desktop? | Rafael | `Aluno : Usuario`, em `src/NexTI.Desktop.Dominio/Entidades`. |
| O que mudou desde o PIM III? | Maciel | Site em React, app de celular, API em camadas na Azure, simulados oficiais do ENADE e três perfis. A lista completa está no README. |
