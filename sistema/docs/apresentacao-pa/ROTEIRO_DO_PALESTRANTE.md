# 🎤 Roteiro do Palestrante — Apresentação P.A. em .NET

## Informações Gerais

| Item | Detalhe |
|---|---|
| **Atividade** | 9 – Apresentação em grupo, disciplina P.A. em .NET |
| **Data** | 27/10/2026, em aula (entrega no AVA até 26/10, 23:59) |
| **Duração** | 10 minutos + perguntas |
| **O que avaliam** | Orientação a objetos, arquitetura em camadas, modularização e os 4 diagramas UML (caso de uso, classe, sequência e atividade). O GitHub faz parte. |
| **Slides** | `slides.html`, nesta pasta. Para projetar: abrir no Chrome, `Ctrl+P`, papel A4, paisagem, margens "Nenhuma", "Gráficos de segundo plano" marcado, salvar como PDF e apresentar o PDF em tela cheia. |
| **Ter aberto** | O PDF dos slides e uma aba com o repositório: https://github.com/MayconDIS/PIM_IV |
| **Apresentadores** | Maciel (slides 1–3) · Rafa (slides 4–6) · Maycon (slides 7–11) |

---

## ⏱️ Cronograma por Slide

### Slide 1 — Capa (00:00 – 00:20) · Maciel

- **Objetivo:** apresentar o grupo e dizer quem fala o quê.
- **Fala sugerida:**
  > *"Somos o DevTime: Maciel, Maycon e Rafa. Vamos mostrar o Nex_TI, um app para estudar TI com flashcards. Eu falo do projeto, o Rafa da orientação a objetos e dos diagramas, e o Maycon da arquitetura e do GitHub."*

---

### Slide 2 — O que é o Nex_TI (00:20 – 01:30) · Maciel

- **Objetivo:** explicar o produto em um minuto.
- **Tópicos-chave:**
  1. O aluno estuda por flashcards e o algoritmo **SM-2** decide quando cada carta volta.
  2. São **26 fases e 620 cartas**, liberadas em ordem, com simulado no estilo ENADE.
  3. Cada fase dá **XP e moedas**; as moedas liberam disciplinas bônus.
- **Fechar com:** *"O PIM IV é a continuação do PIM III."*

---

### Slide 3 — Caso de uso (01:30 – 03:20) · Maciel

- **Objetivo:** mostrar os atores e o que cada um faz.
- **Tópicos-chave:**
  - **Aluno:** estuda, faz simulado e vê o desempenho.
  - **Tutor:** cria conteúdo e acompanha os alunos.
  - **Admin:** controla o acesso.
- **Se perguntarem:** hoje o Aluno está completo; os perfis de Tutor e Admin estão no backlog (PB01 e PB15).
- **Passar a vez:** *"Agora o Rafa mostra como isso virou código."*

---

### Slide 4 — Orientação a objetos (03:20 – 04:40) · Rafa

- **Objetivo:** mostrar os quatro pilares com exemplos reais do projeto.
- **Tópicos-chave:**
  - **Herança:** `Models/Aluno.cs` herda de `Usuario`.
  - **Interface:** `Services/ISm2Engine.cs` e `Sm2Engine.cs`. A API depende da interface, não da classe.
  - **Polimorfismo:** o `DatabaseSeeder` percorre as etapas (`ConteudoSeeder` e `SimuladoSeeder`) chamando `ExecutarAsync` sem saber qual é qual.
  - **Encapsulamento:** `GamificacaoService.ValidarAtualizacao` impede que o XP caia ou suba mais de 200 de uma vez.
- **Se der tempo:** abrir um desses arquivos no GitHub.

---

### Slide 5 — Classes: entidades (04:40 – 05:40) · Rafa

- **Objetivo:** ligar o diagrama ao código de `sistema/apps/api/Models`.
- **Tópicos-chave:**
  - `Usuario` é pai de `Aluno` e `Tutor` (a herança do slide anterior).
  - `ProgressoFlashcard` liga o aluno à carta e guarda os números do SM-2.
  - `Prova`, `Questao`, `Alternativa` e `AreaConhecimento` entraram no PIM IV para os simulados.
- **Se perguntarem do diagrama do PIM III:** ele continua no projeto como a ideia inicial; este mostra o que foi implementado.

---

### Slide 6 — Atividade (05:40 – 06:40) · Rafa

- **Objetivo:** contar uma sessão de estudo do começo ao fim.
- **Tópicos-chave:**
  - As 4 colunas (raias): Aluno, Site, API e Banco.
  - Seguir os 5 passos do slide.
  - Enquanto o aluno já vê a próxima carta, a API grava o progresso ao mesmo tempo (a barra grossa no meio do diagrama).
- **Passar a vez:** *"O Maycon mostra como a API está organizada."*

---

### Slide 7 — Camadas (06:40 – 07:40) · Maycon

- **Objetivo:** explicar a arquitetura em camadas com o exemplo do login.
- **Fala sugerida:**
  > *"Quando o aluno faz login, a rota recebe o pedido e chama o AuthService. O serviço confere a senha e usa o AppDbContext para buscar o usuário no banco. Cada parte só conversa com a do lado."*
- **Tópicos-chave:** antes tudo ficava no `EndpointExtensions.cs` (338 linhas); separamos em `AuthService`, `ProgressoService`, `GamificacaoService` e `ConteudoService`. Para o aluno nada mudou, e os testes conferem isso.

---

### Slide 8 — Classes: camadas (07:40 – 08:10) · Maycon

- **Objetivo:** mostrar o slide anterior em UML, sem ler o diagrama inteiro.
- **Tópicos-chave:** de cima para baixo: as rotas usam as interfaces dos serviços, cada interface tem sua classe (a seta tracejada com triângulo quer dizer "implementa"), e os serviços usam o `AppDbContext`.

---

### Slide 9 — Modularização (08:10 – 08:40) · Maycon

- **Objetivo:** mostrar que cada parte tem sua pasta e roda sozinha.
- **Tópico-chave:** `packages/shared` guarda as 620 cartas e o código que fala com a API, e é usado pelo site e pelo app. Escrevemos uma vez e usamos nos dois.
- **No GitHub:** mostrar a pasta `sistema/`.

---

### Slide 10 — Sequência (08:40 – 09:20) · Maycon

- **Objetivo:** mostrar a ordem das mensagens quando o aluno revisa uma carta.
- **Tópicos-chave:**
  - A tela pede as cartas → o SM-2 filtra as vencidas → o aluno responde → o SM-2 calcula a nova data → o banco grava → a gamificação dá XP.
  - Regra em `Services/Sm2Engine.cs`, com 5 testes. Nota 3 ou mais: 1 dia, 6 dias, depois multiplica pelo fator de facilidade. Menor que 3: volta para 1 dia e o fator cai (mínimo 1,3).

---

### Slide 11 — GitHub (09:20 – 10:00) · Maycon

- **Objetivo:** mostrar o repositório ao vivo.
- **No GitHub:** abrir o **Pull Request #1** (o trabalho desta entrega separado em commits) e a pasta `sistema/tests`.
- **Fala sugerida:**
  > *"Abrimos um Pull Request, damos merge na main, o GitHub Actions roda os 62 testes e, se passarem, publica a API na Azure sozinho. O site vai para a Vercel."*

---

### Slide 12 — Perguntas · Todos

| Pergunta provável | Quem responde | Resposta curta |
|---|---|---|
| Onde está a herança? | Rafa | `Models/Aluno.cs` e `Models/Tutor.cs`, herdando de `Usuario`. |
| Por que separar em camadas? | Maycon | Cada parte cuida de uma coisa: dá para testar a regra sem a rota e trocar o banco sem mexer nas regras. |
| Onde está a interface? | Rafa | `ISm2Engine`, `IAuthService` e os outros serviços. O `Program.cs` liga cada interface à sua classe. |
| O que ainda falta? | Maciel | Perfis de Tutor e Admin, painel do Tutor e login no app de celular. Estão no backlog do Trello. |
