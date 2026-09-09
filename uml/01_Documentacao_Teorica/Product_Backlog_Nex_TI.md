# PRODUCT BACKLOG – Sistema Nex_TI
**Framework:** Ágil (Scrum) | **Estimativa:** Story Points (Fibonacci)

---

## ÉPICO 1: Autenticação e Acesso

### História 1 (US01) - Realizar Login

*(Red) Prioridade: Alta*

Como usuário, quero fazer login para acessar minha conta com segurança.

*   **Critérios de Aceitação:** O sistema deve validar as credenciais. Tokens JWT devem ser gerados.
*   **Estimativa:** 3 Points

### História 2 (US02) - Cadastrar Usuário

*(Red) Prioridade: Alta*

Como usuário, quero me cadastrar para acessar o sistema.

*   **Critérios de Aceitação:** Validação de e-mail e senha forte. Hash de senha no BD (LGPD).
*   **Estimativa:** 5 Points

### História 3 (US03) - Gerenciar Perfis/Acessos

*(Red) Prioridade: Alta*

Como admin, quero gerenciar permissões (Aluno, Tutor, Admin) para controlar a plataforma.

*   **Critérios de Aceitação:** Apenas Admins acessam esta interface. Mudanças de role em tempo real.
*   **Estimativa:** 8 Points

---

## ÉPICO 2: Nivelamento do Usuário

### História 4 (US04) - Teste de Nivelamento

*(Yellow) Prioridade: Média*

Como aluno, quero fazer um teste inicial para que o sistema me classifique corretamente.

*   **Critérios de Aceitação:** Teste de múltipla escolha. Classificação inicial salva no perfil.
*   **Estimativa:** 5 Points

---

## ÉPICO 3: Flashcards e Conteúdo Pedagógico

### História 5 (US05) - Gerenciar Conteúdo de Cartas

*(Yellow) Prioridade: Média*

Como tutor, quero criar e editar flashcards globais para os alunos estudarem.

*   **Critérios de Aceitação:** CRUD completo das cartas e organização por trilhas.
*   **Estimativa:** 8 Points

### História 6 (US06) - Estudar Flashcards (SM-2)

*(Red) Prioridade: Alta*

Como aluno, quero estudar com repetição espaçada para focar nas minhas dificuldades.

*   **Critérios de Aceitação:** Motor SM-2 deve atualizar a data da próxima revisão baseado na resposta.
*   **Estimativa:** 13 Points

### História 7 (US07) - Criar Flashcards

*(Yellow) Prioridade: Média*

Como aluno, quero criar flashcards pessoais para reforçar tópicos específicos.

*   **Critérios de Aceitação:** Cartas criadas entram imediatamente no loop de revisão pessoal.
*   **Estimativa:** 5 Points

---

## ÉPICO 4: Gamificação e Progressão

### História 8 (US08) - Atribuir XP e Moedas

*(Red) Prioridade: Alta*

Como aluno, quero ser recompensado ao estudar para me manter engajado.

*   **Critérios de Aceitação:** XP e Moedas somados no BD. Feedback visual na tela.
*   **Estimativa:** 3 Points

### História 9 (US09) - Desbloquear Fases

*(Yellow) Prioridade: Média*

Como aluno, quero usar minhas moedas para comprar novas trilhas bônus.

*   **Critérios de Aceitação:** Impedir compra se saldo insuficiente. Liberar acesso no BD.
*   **Estimativa:** 5 Points

### História 10 (US10) - Visualizar Painel de Progresso

*(Red) Prioridade: Alta*

Como aluno, quero ver meu nível, XP e moedas em um dashboard central.

*   **Critérios de Aceitação:** Exibição gráfica e clara do progresso no header.
*   **Estimativa:** 3 Points

---

## ÉPICO 5: Suporte e Preparação

### História 11 (US11) - Consultar Agente IA

*(Yellow) Prioridade: Média*

Como aluno, quero consultar uma IA quando tiver dúvidas imediatas sobre o flashcard.

*   **Critérios de Aceitação:** Prompt recebe o contexto da carta. Retorno via API.
*   **Estimativa:** 8 Points

### História 12 (US12) - Escalar Dúvida para Tutor

*(Yellow) Prioridade: Média*

Como aluno, quero mandar um ticket para o tutor se a IA não resolver minha dúvida.

*   **Critérios de Aceitação:** Notificação para o Tutor. Ticket registrado.
*   **Estimativa:** 5 Points

### História 13 (US13) - Acompanhar Desempenho

*(Yellow) Prioridade: Média*

Como tutor, quero visualizar relatórios das dificuldades da turma para agir.

*   **Critérios de Aceitação:** Painel de alunos filtrável por inatividade e erros contínuos.
*   **Estimativa:** 5 Points

### História 14 (US14) - Simulado ENADE

*(Red) Prioridade: Alta*

Como aluno, quero testar meus conhecimentos globais num formato de prova.

*   **Critérios de Aceitação:** Quiz pontuado com justificativa de resposta.
*   **Estimativa:** 8 Points

---

## ÉPICO 6: Acessibilidade e Inclusão

### História 15 (US15) - Ajustar Acessibilidade

*(Red) Prioridade: Alta*

Como usuário, quero ajustar zoom e contraste para adequar a interface à minha visão.

*   **Critérios de Aceitação:** Preferências salvas e aplicadas em todas as telas (WAI-ARIA).
*   **Estimativa:** 5 Points
