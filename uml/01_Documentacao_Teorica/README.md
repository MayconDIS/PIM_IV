# 📄 Documentação Teórica e Planejamento do Projeto Nex_TI

Esta pasta centraliza os principais artefatos teóricos, atas de sprints e o backlog do produto desenvolvidos para o sistema **Nex_TI**, em conformidade com as diretrizes do PIM III (UNIP).

Abaixo, apresentamos o sumário detalhado e o conteúdo textual dos artefatos oficiais em PDF disponíveis nesta pasta:

---

## 📌 Índice de Artefatos
1. [Visão do Produto e Arquitetura (Documentacao_Projeto_Nex_TI.pdf)](#1-visão-do-produto-e-arquitetura)
2. [Backlog do Produto e Histórias de Usuário (Product_Backlog_Nex_TI.pdf)](#2-backlog-do-produto-e-histórias-de-usuário)
3. [Planejamento da Sprint 1 (Ata_Sprint_Planning_Nex_TI.pdf)](#3-planejamento-da-sprint-1)

---

## 1. Visão do Produto e Arquitetura
*Referente ao arquivo [Documentacao_Projeto_Nex_TI.pdf](./Documentacao_Projeto_Nex_TI.pdf)*

### 🎯 Visão Geral
O **Nex_TI** é uma plataforma educacional gamificada de estudo ativo projetada para auxiliar estudantes da área de Tecnologia da Informação. O sistema emprega o consagrado algoritmo de repetição espaçada (**SM-2**) e elementos de gamificação para potencializar a memorização e o engajamento de conceitos complexos de programação, banco de dados e engenharia de software.

### 👥 Persona UX (Público-Alvo)
* **Perfil:** Estudantes universitários e recém-ingressos em cursos de TI (18 a 20 anos).
* **Necessidade:** Necessitam de nivelamento rápido e fixação teórica dos conceitos de linguagens de programação, arquitetura de sistemas e álgebra de dados para exames e disciplinas curriculares.
* **Comportamento:** Estudantes autônomos que buscam métodos interativos e rápidos de fixação de conteúdo diário.

### 🏗️ Arquitetura Técnica Adotada
* **Frontend:** Interfaces limpas, responsivas e construídas sob o princípio *Desktop First* usando HTML5 semântico, CSS3 (Design System) e JavaScript Vanilla.
* **Backend:** C# (.NET 10) utilizando Minimal APIs e Entity Framework Core para garantir performance e organização rígida de padrões SOLID.
* **Banco de Dados:** Microsoft SQL Server para persistência estruturada relacional.
* **Segurança:** Senhas protegidas via criptografia Hash (BCrypt), em conformidade com as diretrizes de privacidade da LGPD.

---

## 2. Backlog do Produto e Histórias de Usuário
*Referente ao arquivo [Product_Backlog_Nex_TI.pdf](./Product_Backlog_Nex_TI.pdf)*

O backlog é estimado utilizando a sequência de Fibonacci para estimativa de Story Points (SP) e está estruturado em 6 Épicos centrais englobando 15 Histórias de Usuário (User Stories):

### 🔑 ÉPICO 1: Autenticação e Acesso
* **US01 - Realizar Login (3 SP):** Como usuário, quero fazer login para acessar minha conta com segurança.
  * *Critérios de Aceitação:* Validação segura no backend e fornecimento de token de acesso JWT.
* **US02 - Cadastrar Usuário (5 SP):** Como usuário, quero me cadastrar para acessar o sistema.
  * *Critérios de Aceitação:* Validação de dados pessoais obrigatórios e hashing seguro de senhas com BCrypt.
* **US03 - Gerenciar Perfis/Acessos (8 SP):** Como admin, quero gerenciar permissões (Aluno, Tutor, Admin) para controlar a plataforma.
  * *Critérios de Aceitação:* Painel restrito a administradores com atualização de papéis (Roles) em tempo real.

### 📊 ÉPICO 2: Nivelamento do Aluno
* **US04 - Teste de Nivelamento (5 SP):** Como aluno, quero fazer um teste inicial para que o sistema me classifique no módulo adequado.
  * *Critérios de Aceitação:* Prova diagnóstica de múltipla escolha com atribuição automática do nível inicial no perfil do aluno.

### 🧠 ÉPICO 3: Flashcards e Repetição Espaçada
* **US05 - Gerenciar Conteúdo de Cartas (8 SP):** Como tutor, quero criar e editar flashcards globais para os alunos estudarem.
  * *Critérios de Aceitação:* CRUD completo de flashcards categorizados por trilhas de disciplinas no painel do Tutor.
* **US06 - Estudar Flashcards (SM-2) (13 SP):** Como aluno, quero estudar com repetição espaçada para focar nas minhas dificuldades.
  * *Critérios de Aceitação:* Integração com o motor SM-2 recalculando os intervalos de revisão com base no feedback de dificuldade (1-5).
* **US07 - Criar Flashcards Pessoais (5 SP):** Como aluno, quero criar flashcards pessoais para reforçar tópicos específicos.
  * *Critérios de Aceitação:* Deck privado do estudante inserido de forma autônoma na fila de revisões diárias.

### 🎮 ÉPICO 4: Gamificação e Recompensas
* **US08 - Atribuir XP e Moedas (3 SP):** Como aluno, quero ser recompensado ao estudar para me manter engajado.
  * *Critérios de Aceitação:* Cálculo e incremento de moedas e pontos de experiência no perfil do aluno ao concluir tarefas validadas.
* **US09 - Desbloquear Módulos/Fases (5 SP):** Como aluno, quero usar minhas moedas virtuais para desbloquear novos baralhos avançados.
  * *Critérios de Aceitação:* Validação de saldo no banco de dados e dedução automática ao resgatar novos baralhos.
* **US10 - Visualizar Painel de Progresso (3 SP):** Como aluno, quero ver meu nível, XP acumulado e moedas em um painel interativo.
  * *Critérios de Aceitação:* Exibição visual de progresso, gráficos de retenção e ranking de XP.

### 💬 ÉPICO 5: Suporte Acadêmico e IA
* **US11 - Consultar Agente IA (8 SP):** Como aluno, quero consultar um agente especialista de IA para tirar dúvidas pontuais.
  * *Critérios de Aceitação:* Chat integrado com IA contextualizado com o flashcard estudado atualmente pelo aluno.
* **US12 - Escalar Dúvida para Tutor (5 SP):** Como aluno, quero encaminhar minha dúvida a um tutor se a IA não for suficiente.
  * *Critérios de Aceitação:* Ticket de dúvida registrado no banco de dados e notificado na dashboard do Tutor correspondente.
* **US13 - Acompanhar Desempenho (5 SP):** Como tutor, quero acompanhar o rendimento dos alunos para oferecer melhor suporte.
  * *Critérios de Aceitação:* Relatórios gerenciais de desempenho, taxas de erro e frequência de revisões dos alunos da turma.
* **US14 - Realizar Simulado ENADE (8 SP):** Como aluno, quero resolver simulados para testar meus conhecimentos gerais em formato de prova.
  * *Critérios de Aceitação:* Banco de questões com cronômetro ativo e relatório de acertos com justificativas pedagógicas.

### 📐 ÉPICO 6: Acessibilidade e Inclusão
* **US15 - Ajustar Acessibilidade (5 SP):** Como usuário, quero alterar contraste e tamanho de fonte para adequar a visualização à minha visão.
  * *Critérios de Aceitação:* Painel de preferências persistente com injeção instantânea de classes CSS de alto contraste e tags WAI-ARIA.

---

## 3. Planejamento da Sprint 1
*Referente ao arquivo [Ata_Sprint_Planning_Nex_TI.pdf](./Ata_Sprint_Planning_Nex_TI.pdf)*

A primeira iteração de desenvolvimento focou na estruturação da infraestrutura básica do projeto e na entrega da fundação de acessos e inclusão:

* **Papéis do Time:**
  * **Scrum Master:** Responsável pela facilitação e remoção de impedimentos de equipe.
  * **Product Owner:** Gestão do Product Backlog e validação dos critérios de aceitação.
  * **Time de Desenvolvimento:** Implementação técnica e persistência de dados.
* **Objetivo da Sprint 1:** Estabelecer a fundação básica de segurança e acesso do projeto, cobrindo o cadastro inicial de usuários (US02), o login seguro com hashing de senha (US01) e o painel inicial adaptado com recursos de acessibilidade (US15).
* **Escopo Selecionado (Sprint Backlog):**
  * **[US01] Realizar Login (3 Story Points):** Autenticação JWT no backend e tela inicial de acesso.
  * **[US02] Cadastrar Usuário (5 Story Points):** Persistência inicial da entidade `Usuario` com hashing seguro de senha (BCrypt) alinhado à LGPD.
  * **[US15] Ajustar Acessibilidade (5 Story Points):** Estruturação do Design System em CSS nativo com suporte a alto contraste e leitura dinâmica.
  * **Pontuação Total Planejada:** 13 Story Points.
* **Decisões Técnicas:**
  * Uso do Microsoft SQL Server como base relacional estável.
  * Senhas hasheadas e nunca salvas em texto puro.
  * Preferências de acessibilidade salvas em cache local para aplicação instantânea no front-end.
