# 🎤 Roteiro do Palestrante — Apresentação P.A. em .NET

A apresentação é sobre o **Nex_TI Desktop**, a aplicação desktop feita para esta atividade
(`sistema/apps/desktop`). Tudo o que aparece nos slides vem dessa pasta: os diagramas de
`docs/diagramas`, as telas de `docs/telas` e o código de `src/`. Para entender cada critério antes de
ensaiar, leia o [`ESTUDOS.md`](../../ESTUDOS.md).

## Informações Gerais

| Item | Detalhe |
|---|---|
| **Atividade** | 9 – Apresentação em grupo, disciplina P.A. em .NET |
| **Data** | 27/10/2026, em aula (entrega no AVA até 26/10, 23:59) |
| **Duração** | 10 minutos + perguntas, cerca de 2 minutos por pessoa |
| **O que avaliam** | Orientação a objetos, arquitetura em camadas, modularização e os 4 diagramas UML (caso de uso, classe, sequência e atividade). O GitHub faz parte. |
| **Slides** | `Nex_TI - Apresentacao PA DotNet.pdf`, nesta pasta, em tela cheia. Se mudar algo no `slides.html`: abrir no Chrome, `Ctrl+P`, papel A4, paisagem, margens "Nenhuma", "Gráficos de segundo plano" marcado, salvar como PDF. |
| **Ter aberto** | O PDF dos slides, o projeto no **Antigravity** (pasta `PIM_IV` inteira) e uma aba com https://github.com/MayconDIS/PIM_IV. Como abrir cada coisa: [README do desktop, "Como abrir cada parte no Antigravity"](../../README.md#como-abrir-cada-parte-no-antigravity) |
| **Antes de começar** | No Antigravity, rodar a tarefa **Desktop: começar do zero** e depois **Desktop: abrir o programa** uma vez (a primeira compilação demora) e fechar. Assim a demonstração do slide 11 abre rápido. |

### Equipe DevTime

| Integrante | RA | Slides | Tempo |
|---|---|---|---|
| Maciel Costa da Silva | R280985 | 1–2 · Capa e o programa | 00:00 – 01:40 |
| Gabriel Alves Moreira | H67HJI4 | 3–4 · Caso de uso e atividade | 01:40 – 03:20 |
| Rafael Mesquita | H6722I0 | 5–6 · Orientação a objetos e classes do domínio | 03:20 – 05:00 |
| Miguel Angel Fernandez Ortiz | H7858F9 | 7–9 · Camadas e modularização | 05:00 – 06:50 |
| Maycon Douglas Inácio Silva | H719CD3 | 10–12 · Sequência, programa funcionando e GitHub | 06:50 – 10:00 |

---

## ⏱️ Cronograma por Slide

### Slide 1 — Capa (00:00 – 00:20) · Maciel

- **Objetivo:** apresentar o grupo e o programa.
- **Fala sugerida:**
  > *"Somos o DevTime: Gabriel, Maciel, Maycon, Miguel e Rafael. Vamos mostrar o Nex_TI Desktop, uma aplicação desktop em .NET para estudar TI com flashcards. Cada um apresenta uma parte."*

---

### Slide 2 — O programa (00:20 – 01:40) · Maciel

- **Objetivo:** explicar o que o programa faz, com a tela principal (`docs/telas/2-principal.png`).
- **Tópicos-chave:**
  1. O aluno entra só com o nickname; os dados ficam num banco SQLite no computador dele, sem internet.
  2. São **25 fases e 582 cartas** sobre TI. Só a primeira começa liberada; concluir uma fase libera a próxima.
  3. O **SM-2** decide quando cada carta volta. A fase dá **XP e moedas só na primeira vez**.
  4. Feito em **Windows Forms** com **.NET 10**.
- **Passar a vez:** *"O Gabriel mostra o que o aluno faz no programa."*

---

### Slide 3 — Caso de uso (01:40 – 02:30) · Gabriel

- **Objetivo:** mostrar o ator e os casos de uso (`docs/diagramas/1-casos-de-uso.png`).
- **Tópicos-chave:**
  - O ator é o **Aluno**: entra com nickname, vê o painel e a trilha e estuda uma fase.
  - **«include»:** estudar uma fase sempre inclui responder cartas.
  - **«extend»:** concluir a fase só acontece quando a última carta é acertada.
- **Se perguntarem:** cada caso de uso é um método do código. Entrar é `ServicoDeAlunos.Entrar`; estudar, responder e concluir estão no `ServicoDeEstudo`.

---

### Slide 4 — Atividade (02:30 – 03:20) · Gabriel

- **Objetivo:** contar uma sessão de estudo do começo ao fim (`docs/diagramas/5-atividade.png`).
- **Tópicos-chave:**
  - Uma raia para o **Aluno** e uma para cada camada: Apresentação, Aplicação, Domínio e Infraestrutura.
  - Seguir os 5 passos do slide. Destacar as duas decisões: fase trancada ou liberada, e "ainda há cartas?".
  - A última decisão é a regra do prêmio: primeira vez paga XP e moedas; nas outras é só revisão.
- **Passar a vez:** *"O Rafael mostra como isso está no código."*

---

### Slide 5 — Orientação a objetos (03:20 – 04:20) · Rafael

- **Objetivo:** mostrar os pilares com o código do desktop (`src/NexTI.Desktop.Dominio`).
- **Tópicos-chave:**
  - **Herança:** `Entidades/Aluno.cs`, `class Aluno : Usuario`.
  - **Abstração e polimorfismo:** `Usuario` é abstrata e tem `Perfil` abstrato; o `Aluno` responde "Aluno".
  - **Encapsulamento:** `Xp` e `Moedas` têm `private set`; só o método `ReceberPremio` muda os dois, e ele paga uma vez por fase. O construtor de `Usuario` recusa nickname com menos de 3 ou mais de 20 letras.
  - **Interface:** `IAgendadorDeRevisao` (em `Regras/Regras.cs`) e o `AgendadorSm2`, que a implementa. A `Revisao` recebe o agendador sem saber qual algoritmo é.

---

### Slide 6 — Classes do domínio (04:20 – 05:00) · Rafael

- **Objetivo:** ligar o diagrama (`docs/diagramas/3-classes-dominio.png`) ao código.
- **Tópicos-chave:**
  - O triângulo vazio é a herança: Aluno herda de Usuario.
  - O losango cheio é a composição: o Aluno é dono das `FaseConcluida`, e a Fase, das `Flashcard`.
  - `Revisao` guarda o SM-2 de cada carta para cada aluno e usa a interface `IAgendadorDeRevisao`.
- **Passar a vez:** *"O Miguel mostra como o programa está dividido."*

---

### Slide 7 — Camadas (05:00 – 05:50) · Miguel

- **Objetivo:** explicar as quatro camadas com um exemplo.
- **Fala sugerida:**
  > *"Quando o aluno clica em 'Bom', a tela chama o ServicoDeEstudo. O serviço usa a regra do SM-2, que está no Domínio, e pede para gravar. Quem grava no SQLite é a Infraestrutura. A tela não sabe que existe banco, e o serviço não sabe que é SQLite."*
- **Tópico-chave:** cada camada só usa a de baixo, e o Domínio não depende de nenhuma.

---

### Slide 8 — Classes das camadas (05:50 – 06:20) · Miguel

- **Objetivo:** mostrar o slide anterior em UML (`docs/diagramas/2-classes-camadas.png`), sem ler o diagrama inteiro.
- **Tópicos-chave:** de cima para baixo: telas → serviços → interfaces do domínio. Embaixo, as implementações com EF Core (a seta tracejada com triângulo quer dizer "implementa") e o `ContextoNexTI`.

---

### Slide 9 — Modularização (06:20 – 06:50) · Miguel

- **Objetivo:** mostrar que cada camada é um projeto `.csproj` separado.
- **Tópico-chave:** as referências só apontam para baixo. Como o Domínio não referencia a tela nem o banco, o compilador não deixa misturar. Por isso os testes trocam o banco por um em memória sem mudar nenhuma regra.
- **No Antigravity, se der tempo:** mostrar as quatro pastas em `sistema/apps/desktop/src`.
- **Passar a vez:** *"O Maycon fecha com a sequência, o programa funcionando e o GitHub."*

---

### Slide 10 — Sequência (06:50 – 07:50) · Maycon

- **Objetivo:** mostrar a ordem das mensagens ao responder a última carta (`docs/diagramas/4-sequencia.png`).
- **Tópicos-chave:**
  - A `TelaEstudo` chama `Responder` → a `SessaoDeEstudo` tira a carta da fila → a `Revisao` pede ao `AgendadorSm2` a próxima data → a `UnidadeDeTrabalho` grava.
  - Era a última carta: a tela chama `ConcluirFase` → o `Aluno` recebe o prêmio se for a primeira vez → grava → a tela mostra o resultado.
  - Regra do SM-2: Bom multiplica o intervalo pelo fator (começa em 2,5); Fácil vai mais longe (carta nova volta em 3 dias); Difícil soma pelo menos 1 dia; Errei volta amanhã. O fator nunca fica abaixo de 1,3.

---

### Slide 11 — O programa funcionando (07:50 – 09:00) · Maycon

- **Objetivo:** mostrar o programa de verdade.
- **Ao vivo no Antigravity (40 s):** tarefa **Desktop: abrir o programa** (ou, no terminal, em `sistema/apps/desktop`: `dotnet run --project src/NexTI.Desktop.Apresentacao`). Entrar com um nickname, abrir a fase 1 e responder duas cartas com as teclas (Espaço mostra a resposta; 1 a 4 respondem). Se algo travar, seguir com as fotos do slide.
- **Tópicos-chave:** EF Core com SQLite, num arquivo no computador do aluno. A migration `Inicial` cria as 5 tabelas e a semente coloca as fases e as cartas, como no exemplo PetMatch do livro da disciplina.

---

### Slide 12 — GitHub (09:00 – 10:00) · Maycon

- **Objetivo:** mostrar o repositório e os testes.
- **No GitHub:** abrir o **Pull Request #33** (o programa desktop e os diagramas) e a aba **Actions**, com a checagem "Nex_TI Desktop" passando.
- **Fala sugerida:**
  > *"Cada mudança entra por um Pull Request. O GitHub Actions roda os 28 testes do programa: o SM-2, o prêmio uma vez só e o programa de ponta a ponta, com um banco em memória. Se passarem, damos merge na main."*

---

### Slide 13 — Perguntas · Todos

| Pergunta provável | Quem responde | Resposta curta |
|---|---|---|
| Onde está a herança? | Rafael | `Aluno : Usuario`, em `src/NexTI.Desktop.Dominio/Entidades`. |
| Onde está o encapsulamento? | Rafael | `Xp` e `Moedas` com `private set`; só `ReceberPremio` muda os dois. |
| Onde está a interface? | Rafael | `IAgendadorDeRevisao` (o SM-2) e as interfaces dos repositórios, como `IRepositorioDeFases`. |
| Por que separar em camadas? | Miguel | Cada parte cuida de uma coisa: dá para testar a regra sem a tela e trocar o banco sem mexer nas regras. |
| Como as camadas se ligam? | Miguel | No `Program.cs` da Apresentação, que cria os repositórios e entrega aos serviços pelo construtor. |
| O que o diagrama de atividade mostra? | Gabriel | Uma sessão de estudo, do nickname até ganhar XP, com uma raia por camada. |
| Onde fica o banco? | Maycon | Um arquivo SQLite em `%LOCALAPPDATA%\NexTI.Desktop`, criado pela migration na primeira vez. |
| Como sabem que funciona? | Maycon | 28 testes automáticos, rodados no GitHub a cada Pull Request. |
